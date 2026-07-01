import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  and,
  between,
  desc,
  eq,
  gte,
  inArray,
  lte,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import type { FeatureCollection, Geometry } from 'geojson';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import {
  buildPage,
  keysetCondition,
  type Page,
} from '../../common/pagination/keyset';
import { S3Service } from '../../common/storage/s3.service';
import { largeFileFiles, largeFiles } from './large-files.schema';
import { CreateLargeFileDto } from './dto/create-large-file.dto';
import { SearchLargeFilesDto } from './dto/search-large-files.dto';

// A search hit: the stored metadata plus its footprint as GeoJSON.
export interface LargeFileResult {
  id: string;
  name: string;
  fileType: string;
  accuracy: number;
  country: string | null;
  coverageDate: string | null;
  sizeBytes: number;
  geometry: Geometry;
  createdAt: string;
}

// The metadata row shape shared by the search query and the create path (geometry
// already parsed to GeoJSON, createdAt still a Date) — mapped to LargeFileResult
// by `toResult`.
interface LargeFileRow {
  id: string;
  name: string;
  fileType: string;
  accuracy: number;
  country: string | null;
  coverageDate: string | null;
  sizeBytes: number;
  geometry: Geometry;
  createdAt: Date;
}

export type LargeFilePage = Page<LargeFileResult>;

const DEFAULT_LIMIT = 20;

const LARGE_FILE_BUCKET = process.env.S3_LARGE_FILE_BUCKET ?? 'large-files';

@Injectable()
export class LargeFilesService {
  private readonly logger = new Logger(LargeFilesService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly s3: S3Service,
  ) {}

  // Newest-first page of large files matching the given filters. Accuracy is an
  // inclusive ±1 band, file types an IN-list, and the area an intersection test.
  // All filtering happens in SQL so cursor pagination stays exact: fetch
  // limit + 1 rows to detect an older page, then trim and expose the cursor.
  async search(dto: SearchLargeFilesDto): Promise<LargeFilePage> {
    const limit = dto.limit ?? DEFAULT_LIMIT;

    const conditions: (SQL | undefined)[] = [
      keysetCondition(largeFiles.createdAt, largeFiles.id, dto.cursor),
      dto.accuracy !== undefined
        ? between(largeFiles.accuracy, dto.accuracy - 1, dto.accuracy + 1)
        : undefined,
      dto.fileTypes?.length
        ? inArray(largeFiles.fileType, dto.fileTypes)
        : undefined,
      dto.country ? eq(largeFiles.country, dto.country) : undefined,
      dto.startDate ? gte(largeFiles.coverageDate, dto.startDate) : undefined,
      dto.endDate ? lte(largeFiles.coverageDate, dto.endDate) : undefined,
      this.areaCondition(dto.area),
    ];

    const rows = await this.db
      .select(this.resultColumns())
      .from(largeFiles)
      .where(and(...conditions))
      .orderBy(desc(largeFiles.createdAt), desc(largeFiles.id))
      .limit(limit + 1);

    const page = buildPage(rows, limit, (row) => ({
      createdAt: row.createdAt,
      id: row.id,
    }));

    return {
      items: page.items.map((row) => this.toResult(row)),
      nextCursor: page.nextCursor,
    };
  }

  // Creates a large file from admin-supplied metadata plus the uploaded file.
  // The file is stored in S3 and recorded in `large_file_files` (joined on read);
  // the footprint is written as a PostGIS geometry via ST_GeomFromGeoJSON. Returns
  // the record as a search-style result so callers can render it immediately.
  async create(
    dto: CreateLargeFileDto,
    file: Express.Multer.File,
  ): Promise<LargeFileResult> {
    const geometry = this.toSingleGeometry(dto.area);

    const [row] = await this.db
      .insert(largeFiles)
      .values({
        name: dto.name,
        fileType: dto.fileType,
        accuracy: dto.accuracy,
        country: dto.country ?? null,
        coverageDate: dto.coverageDate ?? null,
        sizeBytes: file.size,
        geom: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)`,
      })
      .returning({ id: largeFiles.id, createdAt: largeFiles.createdAt });

    const key = `${randomUUID()}${extname(file.originalname)}`;
    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: LARGE_FILE_BUCKET,
      contentType: file.mimetype,
    });

    await this.db.insert(largeFileFiles).values({
      largeFileId: row.id,
      fileKey: key,
      fileName: file.originalname,
      contentType: file.mimetype,
    });

    this.logger.log(`Created large file ${row.id}`);
    return this.toResult({
      id: row.id,
      name: dto.name,
      fileType: dto.fileType,
      accuracy: dto.accuracy,
      country: dto.country ?? null,
      coverageDate: dto.coverageDate ?? null,
      sizeBytes: file.size,
      geometry,
      createdAt: row.createdAt,
    });
  }

  // Loads large files by id as search-style results, keyed by id. Used to enrich
  // fulfilled file requests with their linked large file in one query.
  async findResultsByIds(
    ids: string[],
  ): Promise<Map<string, LargeFileResult>> {
    if (ids.length === 0) return new Map();
    const rows = await this.db
      .select(this.resultColumns())
      .from(largeFiles)
      .where(inArray(largeFiles.id, ids));
    return new Map(rows.map((row) => [row.id, this.toResult(row)]));
  }

  // The column selection shared by every read: metadata plus the footprint as
  // GeoJSON text (parsed by `toResult`).
  private resultColumns() {
    return {
      id: largeFiles.id,
      name: largeFiles.name,
      fileType: largeFiles.fileType,
      accuracy: largeFiles.accuracy,
      country: largeFiles.country,
      coverageDate: largeFiles.coverageDate,
      sizeBytes: largeFiles.sizeBytes,
      createdAt: largeFiles.createdAt,
      geometry: sql<string>`ST_AsGeoJSON(${largeFiles.geom})`,
    } as const;
  }

  // Maps a DB row (geometry as GeoJSON string or already-parsed object) to the
  // API result shape.
  private toResult(
    row: (Omit<LargeFileRow, 'geometry'> & { geometry: string }) | LargeFileRow,
  ): LargeFileResult {
    const geometry =
      typeof row.geometry === 'string'
        ? (JSON.parse(row.geometry) as Geometry)
        : row.geometry;
    return {
      id: row.id,
      name: row.name,
      fileType: row.fileType,
      accuracy: row.accuracy,
      country: row.country,
      coverageDate: row.coverageDate,
      sizeBytes: row.sizeBytes,
      geometry,
      createdAt: row.createdAt.toISOString(),
    };
  }

  // Collapses a drawn area (a FeatureCollection) into one geometry to store: the
  // lone geometry when there is a single feature, otherwise a GeometryCollection.
  private toSingleGeometry(area: FeatureCollection): Geometry {
    const geometries = area.features
      .map((feature) => feature.geometry)
      .filter((geometry): geometry is Geometry => Boolean(geometry));
    return geometries.length === 1
      ? geometries[0]
      : { type: 'GeometryCollection', geometries };
  }

  // Match records intersecting the drawn area. ORs a per-feature ST_Intersects
  // term so we never depend on GeometryCollection support, and parameterises the
  // GeoJSON (Drizzle binds the interpolated string) so it is injection-safe.
  // Returns undefined when there is no usable area, leaving the filter off.
  private areaCondition(area?: FeatureCollection): SQL | undefined {
    if (!area?.features?.length) return undefined;

    const terms = area.features
      .map((feature) => feature.geometry)
      .filter((geometry): geometry is Geometry => Boolean(geometry))
      .map(
        (geometry) =>
          sql`ST_Intersects(${largeFiles.geom}, ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326))`,
      );

    return terms.length ? or(...terms) : undefined;
  }
}
