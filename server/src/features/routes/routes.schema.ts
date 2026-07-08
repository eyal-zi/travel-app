import { date, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { FeatureCollection } from 'geojson';
import { softDelete, timestamps } from '../../common/database/columns';

export const routes = pgTable('routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),

  date: date('date').notNull().unique(),

  data: jsonb('data').$type<FeatureCollection>().notNull(),
  ...softDelete(),
  ...timestamps(),
});

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
