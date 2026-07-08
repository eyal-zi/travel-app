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
import { buildPage, keysetCondition } from '../../common/pagination/keyset';
import { S3Service } from '../../common/storage/s3.service';
import { largeFileFiles, largeFiles } from './large-files.schema';
import { CreateLargeFileDto } from './dto/create-large-file.dto';
import { SearchLargeFilesDto } from './dto/search-large-files.dto';
import { LargeFilePage, LargeFileResult, LargeFileRow } from './types';

const DEFAULT_LIMIT = 20;

const LARGE_FILE_BUCKET = process.env.S3_LARGE_FILE_BUCKET ?? 'large-files';

@Injectable()
export class LargeFilesService {
  private readonly logger = new Logger(LargeFilesService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly s3: S3Service,
  ) {}

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

  async create(
    dto: CreateLargeFileDto,
    source: { key: string; fileName: string },
  ): Promise<LargeFileResult> {
    const geometry = this.toSingleGeometry(dto.area);

    const head = await this.s3.headObject(source.key, LARGE_FILE_BUCKET);
    const sizeBytes = head.contentLength ?? 0;
    const contentType = head.contentType ?? 'application/octet-stream';

    const [row] = await this.db
      .insert(largeFiles)
      .values({
        name: dto.name,
        fileType: dto.fileType,
        accuracy: dto.accuracy,
        country: dto.country ?? null,
        coverageDate: dto.coverageDate ?? null,
        sizeBytes,
        geom: sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), 4326)`,
      })
      .returning({ id: largeFiles.id, createdAt: largeFiles.createdAt });

    await this.db.insert(largeFileFiles).values({
      largeFileId: row.id,
      fileKey: source.key,
      fileName: source.fileName,
      contentType,
    });

    this.logger.log(`Created large file ${row.id}`);
    return this.toResult({
      id: row.id,
      name: dto.name,
      fileType: dto.fileType,
      accuracy: dto.accuracy,
      country: dto.country ?? null,
      coverageDate: dto.coverageDate ?? null,
      sizeBytes,
      geometry,
      createdAt: row.createdAt,
    });
  }

  async findResultsByIds(ids: string[]): Promise<Map<string, LargeFileResult>> {
    if (ids.length === 0) return new Map();
    const rows = await this.db
      .select(this.resultColumns())
      .from(largeFiles)
      .where(inArray(largeFiles.id, ids));
    return new Map(rows.map((row) => [row.id, this.toResult(row)]));
  }

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

  private toSingleGeometry(area: FeatureCollection): Geometry {
    const geometries = area.features
      .map((feature) => feature.geometry)
      .filter((geometry): geometry is Geometry => Boolean(geometry));
    return geometries.length === 1
      ? geometries[0]
      : { type: 'GeometryCollection', geometries };
  }

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
