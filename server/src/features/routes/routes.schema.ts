import { date, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';
import { softDelete, timestamps } from '../../common/database/columns';

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
  ...softDelete(),
  ...timestamps(),
});

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
