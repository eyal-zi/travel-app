import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

// The calendar event color options. Mirrors the client EventColor union and is the
// single source of truth shared by the schema's column type and the DTO validator.
export const EVENT_COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
] as const;

export type EventColor = (typeof EVENT_COLORS)[number];

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
  // One of the EventColor union.
  color: text('color').$type<EventColor>(),
  ...softDelete(),
  ...timestamps(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
