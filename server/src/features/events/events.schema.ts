import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// A calendar event. Unlike routes (one per date), there can be many events on
// any given day and an event can span a range, so this is a plain id-keyed table
// with no date uniqueness or upsert.
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  // Stored as the client string ("YYYY-MM-DD" for all-day, "YYYY-MM-DDTHH:mm"
  // for timed). Kept as text to preserve that format and avoid timezone
  // coercion the calendar doesn't want.
  start: text('start').notNull(),
  end: text('end'),
  allDay: boolean('all_day').notNull().default(false),
  // One of the client EventColor union ("primary" | "secondary" | ...).
  color: text('color'),
  // Soft-delete flag: rows are marked deleted instead of being removed so the
  // history is preserved and deletes stay reversible.
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
