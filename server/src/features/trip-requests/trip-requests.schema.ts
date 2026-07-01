import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { creationTimestamp, timestamps } from '../../common/database/columns';
import { requestStatus } from '../../common/database/enums';
import { users } from '../auth/users.schema';

// A trip request submitted by a user describing what they want out of a trip.
// Intake-only for now: rows are created via POST and carry a workflow `status`
// so they can be processed later. Dates are stored as "YYYY-MM-DD" text (like
// events) to avoid timezone coercion the caller doesn't want.
export const tripRequests = pgTable(
  'trip_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tripGoal: text('trip_goal').notNull(),
    country: text('country').notNull(),
    startDate: text('start_date').notNull(), // 'YYYY-MM-DD'
    endDate: text('end_date').notNull(), // 'YYYY-MM-DD'
    timezone: text('timezone').notNull(),
    landmark: text('landmark').notNull(),
    timeDivision: text('time_division').notNull(),
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
    index('trip_requests_created_at_id_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type TripRequest = typeof tripRequests.$inferSelect;
export type NewTripRequest = typeof tripRequests.$inferInsert;

// Files an admin attaches to a trip request as part of their response. A request
// can have any number of these (many-to-one). Files are stored in S3 under
// `fileKey`; we keep the original `fileName`/`contentType` for download.
export const tripRequestFiles = pgTable('trip_request_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripRequestId: uuid('trip_request_id')
    .notNull()
    .references(() => tripRequests.id, { onDelete: 'cascade' }),
  fileKey: text('file_key').notNull(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull(),
  ...creationTimestamp(),
});

export type TripRequestFile = typeof tripRequestFiles.$inferSelect;
export type NewTripRequestFile = typeof tripRequestFiles.$inferInsert;
