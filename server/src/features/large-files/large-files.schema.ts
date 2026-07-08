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

export const geometry = customType<{ data: Geometry; driverData: string }>({
  dataType() {
    return 'geometry(Geometry, 4326)';
  },
});

export const LARGE_FILE_TYPES = [
  'geojson',
  'shapefile',
  'tiff',
  'ecw',
  'osgb',
  'kml',
  'csv',
  'excel',
] as const;

export type LargeFileType = (typeof LARGE_FILE_TYPES)[number];

export const largeFiles = pgTable(
  'large_files',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),

    fileType: text('file_type').notNull(),

    accuracy: integer('accuracy').notNull(),

    country: text('country'),

    coverageDate: date('coverage_date'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),

    geom: geometry('geom').notNull(),
    ...creationTimestamp(),
  },
  (table) => [
    index('large_files_geom_idx').using('gist', table.geom),

    index('large_files_created_at_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type LargeFile = typeof largeFiles.$inferSelect;
export type NewLargeFile = typeof largeFiles.$inferInsert;

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
