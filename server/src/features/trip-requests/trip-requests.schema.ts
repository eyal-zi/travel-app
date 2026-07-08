import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { creationTimestamp, timestamps } from '../../common/database/columns';
import { requestStatus } from '../../common/database/enums';
import { users } from '../auth/users.schema';

export const tripRequests = pgTable(
  'trip_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tripGoal: text('trip_goal').notNull(),
    country: text('country').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    timezone: text('timezone').notNull(),
    landmark: text('landmark').notNull(),
    timeDivision: text('time_division').notNull(),
    notes: text('notes'),

    createdBy: uuid('created_by').references(() => users.id),

    status: requestStatus('status').notNull().default('received'),

    adminNote: text('admin_note'),

    updatedBy: uuid('updated_by').references(() => users.id),
    ...timestamps(),
  },
  (table) => [
    index('trip_requests_created_at_id_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type TripRequest = typeof tripRequests.$inferSelect;
export type NewTripRequest = typeof tripRequests.$inferInsert;

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
