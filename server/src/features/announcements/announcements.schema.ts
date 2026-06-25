import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

// A broadcast announcement. Plain id-keyed table (like events): many rows, no
// date uniqueness. `createdAt` is the moment it was announced and `author` is
// the source — hard-coded to "System" on write for now.
export const announcements = pgTable(
  'announcements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    text: text('text').notNull(),
    // Who posted the announcement. Defaults to "System" until authored posting exists.
    author: text('author').notNull().default('System'),
    ...softDelete(),
    ...timestamps(),
  },
  (table) => [
    // Backs the newest-first keyset pagination on (createdAt, id).
    index('announcements_created_at_id_idx').on(
      table.createdAt.desc(),
      table.id.desc(),
    ),
  ],
);

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
