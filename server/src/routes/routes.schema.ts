import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const routes = pgTable('routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  bucket: text('bucket').notNull(),
  key: text('key').notNull(),
  originalName: text('original_name'),
  contentType: text('content_type'),
  fileSize: integer('file_size'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
