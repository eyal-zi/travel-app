import {
  bigint,
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Geometry } from 'geojson';

// A PostGIS geometry column (SRID 4326). This custom type only owns the DDL the
// migration emits — values are read and written as GeoJSON through
// ST_AsGeoJSON / ST_GeomFromGeoJSON in the service and seed script, never bound
// through Drizzle directly, so no JS <-> driver conversion is needed here.
export const geometry = customType<{ data: Geometry; driverData: string }>({
  dataType() {
    return 'geometry(Geometry, 4326)';
  },
});

// The fixed file-type options the search form offers (plus a free-text "other"
// value the client may send). Kept here so the seed script and any future
// validation share one source of truth.
export const LARGE_FILE_TYPES = [
  'geojson',
  'shapefile',
  'kml',
  'csv',
  'excel',
] as const;

export type LargeFileType = (typeof LARGE_FILE_TYPES)[number];

// A searchable "large file" record: metadata plus a geographic footprint. The
// search endpoint filters these by file type, accuracy (±1) and intersection
// with a drawn polygon area.
export const largeFiles = pgTable(
  'large_files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    // One of LARGE_FILE_TYPES, or a custom value when the user picked "other".
    fileType: text('file_type').notNull(),
    // Confidence score 0..15. Search matches records within ±1 of the query.
    accuracy: integer('accuracy').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    // The record's footprint, a PostGIS geometry in WGS84 (SRID 4326).
    geom: geometry('geom').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // GiST index backing the ST_Intersects area filter.
    index('large_files_geom_idx').using('gist', table.geom),
    // Supports the newest-first, cursor-paginated ordering.
    index('large_files_created_at_idx').on(table.createdAt.desc()),
  ],
);

export type LargeFile = typeof largeFiles.$inferSelect;
export type NewLargeFile = typeof largeFiles.$inferInsert;
