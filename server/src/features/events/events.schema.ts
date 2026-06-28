import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

// The calendar event color options.
export const EVENT_COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
] as const;

export type EventColor = (typeof EVENT_COLORS)[number];

// The marking style applied to an event: one of the palette colors, or a special
// marking such as 'moon'. Mirrors the client EventStyle union and is the single
// source of truth shared by the schema's column type and the DTO validator. New
// markings are added here and to the client registry.
export const EVENT_STYLES = [...EVENT_COLORS, 'moon'] as const;

export type EventStyle = (typeof EVENT_STYLES)[number];

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
  // One of the EventStyle union (a palette color or a special marking like 'moon').
  style: text('style').$type<EventStyle>(),
  ...softDelete(),
  ...timestamps(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
