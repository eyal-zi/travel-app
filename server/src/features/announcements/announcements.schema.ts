import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// A broadcast announcement. Plain id-keyed table (like events): many rows, no
// date uniqueness. `createdAt` is the moment it was announced and `author` is
// the source — hard-coded to "System" on write for now.
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  // Who posted the announcement. Defaults to "System" until authored posting exists.
  author: text('author').notNull().default('System'),
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

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
