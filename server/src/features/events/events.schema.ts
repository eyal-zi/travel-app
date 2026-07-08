import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

export const EVENT_COLORS = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
] as const;

export type EventColor = (typeof EVENT_COLORS)[number];

export const EVENT_STYLES = [...EVENT_COLORS, 'moon'] as const;

export type EventStyle = (typeof EVENT_STYLES)[number];

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),

  start: text('start').notNull(),
  end: text('end'),
  allDay: boolean('all_day').notNull().default(false),

  style: text('style').$type<EventStyle>(),
  ...softDelete(),
  ...timestamps(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
