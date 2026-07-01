import {
  bigint,
  customType,
  date,
  index,
  integer,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Geometry } from 'geojson';
import { creationTimestamp } from '../../common/database/columns';

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
    // Country the file covers. Nullable so the column can be added to existing
    // rows; search filters by exact match when provided. Null rows never match.
    country: text('country'),
    // The date the file's data covers, as a 'YYYY-MM-DD' calendar date (no time
    // component). Search filters by an inclusive start/end range on this.
    coverageDate: date('coverage_date'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    // The record's footprint, a PostGIS geometry in WGS84 (SRID 4326).
    geom: geometry('geom').notNull(),
    ...creationTimestamp(),
  },
  (table) => [
    // GiST index backing the ST_Intersects area filter.
    index('large_files_geom_idx').using('gist', table.geom),
    // Backs the newest-first keyset pagination on (createdAt, id).
    index('large_files_created_at_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type LargeFile = typeof largeFiles.$inferSelect;
export type NewLargeFile = typeof largeFiles.$inferInsert;

// The single uploaded file backing a large file. Kept in its own table (joined on
// read) rather than as columns on `large_files` so the searchable metadata row
// stays clean. One file per large file (unique FK). The file lives in S3 under
// `fileKey`; the original `fileName`/`contentType` are kept for download.
export const largeFileFiles = pgTable('large_file_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  largeFileId: uuid('large_file_id')
    .notNull()
    .unique()
    .references(() => largeFiles.id, { onDelete: 'cascade' }),
  fileKey: text('file_key').notNull(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull(),
  ...creationTimestamp(),
});

export type LargeFileFile = typeof largeFileFiles.$inferSelect;
export type NewLargeFileFile = typeof largeFileFiles.$inferInsert;
