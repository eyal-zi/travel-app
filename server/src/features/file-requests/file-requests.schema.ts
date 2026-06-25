import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';

// A request from a user asking the admin to produce a new file for a trip.
// Like trip requests, rows are created via POST and carry a workflow `status`
// so an admin can process them and respond. Dates are stored as "YYYY-MM-DD"
// text to avoid timezone coercion. The drawn `area`, the requested `fileTypes`
// and the `geo` tags are stored as JSON (display/intake only — no spatial query).
export const FILE_REQUEST_STATUSES = [
  'received',
  'processing',
  'done',
] as const;
export type FileRequestStatus = (typeof FILE_REQUEST_STATUSES)[number];

export const fileRequests = pgTable('file_requests', {
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
  // Workflow status, set server-side. Defaults to "received" on intake.
  status: text('status').notNull().default('received'),
  // Admin's free-form response to the user. One note per request; overwritten on
  // each save. Null until an admin writes one.
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

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
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type FileRequestFile = typeof fileRequestFiles.$inferSelect;
export type NewFileRequestFile = typeof fileRequestFiles.$inferInsert;
