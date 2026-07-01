import { index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';
import { creationTimestamp, timestamps } from '../../common/database/columns';
import { requestStatus } from '../../common/database/enums';
import { users } from '../auth/users.schema';

// A request from a user asking the admin to produce a new file for a trip.
// Like trip requests, rows are created via POST and carry a workflow `status`
// so an admin can process them and respond. Dates are stored as "YYYY-MM-DD"
// text to avoid timezone coercion. The drawn `area`, the requested `fileTypes`
// and the `geo` tags are stored as JSON (display/intake only — no spatial query).
export const fileRequests = pgTable(
  'file_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Free-form explanation of the trip the file is for.
    tripGoal: text('trip_goal').notNull(),
    country: text('country').notNull(),
    agency: text('agency').notNull(),
    startDate: text('start_date').notNull(), // 'YYYY-MM-DD'
    endDate: text('end_date').notNull(), // 'YYYY-MM-DD'
    // Area of interest drawn on the map, as a GeoJSON FeatureCollection.
    area: jsonb('area').$type<FeatureCollection>().notNull(),
    // Requested file types (fixed values and/or free-text "other" entries).
    fileTypes: jsonb('file_types').$type<string[]>().notNull(),
    // Selected geo tags (terrain/urban/coastal).
    geo: jsonb('geo').$type<string[]>().notNull(),
    notes: text('notes'), // optional free-form notes
    // The user who submitted the request, captured from the authenticated user on
    // intake. Joined to `users` on read so admins can see who sent it. Null on
    // legacy rows created before this was tracked.
    createdBy: uuid('created_by').references(() => users.id),
    // Workflow status, set server-side. Defaults to "received" on intake.
    status: requestStatus('status').notNull().default('received'),
    // Admin's free-form response to the user. One note per request; overwritten on
    // each save. Null until an admin writes one.
    adminNote: text('admin_note'),
    // The admin who last updated the request (status/note). Joined to `users` on
    // read so the requester can see who handled it. Null until an admin updates it.
    updatedBy: uuid('updated_by').references(() => users.id),
    ...timestamps(),
  },
  (table) => [
    // Backs the newest-first keyset pagination on (createdAt, id).
    index('file_requests_created_at_id_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type FileRequest = typeof fileRequests.$inferSelect;
export type NewFileRequest = typeof fileRequests.$inferInsert;

// Files an admin attaches to a file request as part of their response. A request
// can have any number of these (many-to-one). Files are stored in S3 under
// `fileKey`; we keep the original `fileName`/`contentType` for download.
export const fileRequestFiles = pgTable('file_request_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileRequestId: uuid('file_request_id')
    .notNull()
    .references(() => fileRequests.id, { onDelete: 'cascade' }),
  fileKey: text('file_key').notNull(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull(),
  ...creationTimestamp(),
});

export type FileRequestFile = typeof fileRequestFiles.$inferSelect;
export type NewFileRequestFile = typeof fileRequestFiles.$inferInsert;
