import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

export const pdf = pgTable('pdf', {
  id: uuid('id').primaryKey().defaultRandom(),

  fileKey: text('file_key').notNull(),

  date: date('date').notNull().unique(),
  ...softDelete(),
  ...timestamps(),
});

export type Pdf = typeof pdf.$inferSelect;
export type NewPdf = typeof pdf.$inferInsert;
