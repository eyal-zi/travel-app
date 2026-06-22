import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// A trip request submitted by a user describing what they want out of a trip.
// Intake-only for now: rows are created via POST and carry a workflow `status`
// so they can be processed later. Dates are stored as "YYYY-MM-DD" text (like
// events) to avoid timezone coercion the caller doesn't want.
export const TRIP_REQUEST_STATUSES = ['received', 'processing', 'done'] as const;
export type TripRequestStatus = (typeof TRIP_REQUEST_STATUSES)[number];

export const tripRequests = pgTable('trip_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripGoal: text('trip_goal').notNull(),
  country: text('country').notNull(),
  startDate: text('start_date').notNull(), // 'YYYY-MM-DD'
  endDate: text('end_date').notNull(), // 'YYYY-MM-DD'
  timezone: text('timezone').notNull(),
  landmark: text('landmark').notNull(),
  timeDivision: text('time_division').notNull(),
  notes: text('notes'), // optional free-form notes
  // Workflow status, set server-side. Defaults to "received" on intake.
  status: text('status').notNull().default('received'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type TripRequest = typeof tripRequests.$inferSelect;
export type NewTripRequest = typeof tripRequests.$inferInsert;
