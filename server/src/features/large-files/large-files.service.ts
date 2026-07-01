import { Inject, Injectable } from '@nestjs/common';
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
import { largeFiles } from './large-files.schema';
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

export type LargeFilePage = Page<LargeFileResult>;

const DEFAULT_LIMIT = 20;

@Injectable()
export class LargeFilesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

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
      .select({
        id: largeFiles.id,
        name: largeFiles.name,
        fileType: largeFiles.fileType,
        accuracy: largeFiles.accuracy,
        country: largeFiles.country,
        coverageDate: largeFiles.coverageDate,
        sizeBytes: largeFiles.sizeBytes,
        createdAt: largeFiles.createdAt,
        geometry: sql<string>`ST_AsGeoJSON(${largeFiles.geom})`,
      })
      .from(largeFiles)
      .where(and(...conditions))
      .orderBy(desc(largeFiles.createdAt), desc(largeFiles.id))
      .limit(limit + 1);

    const page = buildPage(rows, limit, (row) => ({
      createdAt: row.createdAt,
      id: row.id,
    }));

    const items: LargeFileResult[] = page.items.map((row) => ({
      id: row.id,
      name: row.name,
      fileType: row.fileType,
      accuracy: row.accuracy,
      country: row.country,
      coverageDate: row.coverageDate,
      sizeBytes: row.sizeBytes,
      geometry: JSON.parse(row.geometry) as Geometry,
      createdAt: row.createdAt.toISOString(),
    }));

    return { items, nextCursor: page.nextCursor };
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
