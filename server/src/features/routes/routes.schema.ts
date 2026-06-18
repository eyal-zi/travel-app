import {
  boolean,
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';

export const routes = pgTable('routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  // The calendar date this route belongs to. Unique: there is exactly one route
  // per date, so creating a route for an existing date overwrites it instead of
  // inserting a duplicate. Stored as a date-only value ("YYYY-MM-DD").
  date: date('date').notNull().unique(),
  // The route geometry, stored as a GeoJSON FeatureCollection. jsonb keeps it
  // queryable and lets us read/write whole layers without a separate blob store.
  data: jsonb('data').$type<FeatureCollection>().notNull(),
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

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
