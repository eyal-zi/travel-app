import { date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

export const weather = pgTable(
  'weather',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    imageKey: text('image_key').notNull(),

    date: date('date').notNull(),
    ...softDelete(),
    ...timestamps(),
  },
  (table) => [index('weather_date_idx').on(table.date)],
);

export type Weather = typeof weather.$inferSelect;
export type NewWeather = typeof weather.$inferInsert;
