import { index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';
import { timestamps } from '../../common/database/columns';
import { requestStatus } from '../../common/database/enums';
import { users } from '../auth/users.schema';
import { largeFiles } from '../large-files/large-files.schema';

export const fileRequests = pgTable(
  'file_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    tripGoal: text('trip_goal').notNull(),
    country: text('country').notNull(),
    agency: text('agency').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),

    area: jsonb('area').$type<FeatureCollection>().notNull(),

    fileTypes: jsonb('file_types').$type<string[]>().notNull(),

    geo: jsonb('geo').$type<string[]>().notNull(),
    notes: text('notes'),

    createdBy: uuid('created_by').references(() => users.id),

    status: requestStatus('status').notNull().default('received'),

    adminNote: text('admin_note'),

    updatedBy: uuid('updated_by').references(() => users.id),

    largeFileId: uuid('large_file_id').references(() => largeFiles.id),
    ...timestamps(),
  },
  (table) => [
    index('file_requests_created_at_id_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type FileRequest = typeof fileRequests.$inferSelect;
export type NewFileRequest = typeof fileRequests.$inferInsert;
