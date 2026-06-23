import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// A PDF document for a given calendar date. The file bytes live in S3; this
// table keeps the S3 object key plus the date it belongs to so the signed URL
// can be regenerated on demand (signed URLs are short-lived and not stored).
export const pdf = pgTable('pdf', {
  id: uuid('id').primaryKey().defaultRandom(),
  // The S3 object key (a uuid-based name) the PDF was uploaded under.
  fileKey: text('file_key').notNull(),
  // The calendar date this PDF belongs to. Unique: there is exactly one PDF per
  // date, so uploading for an existing date overwrites it instead of inserting a
  // duplicate. Stored as a date-only value ("YYYY-MM-DD").
  date: date('date').notNull().unique(),
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

export type Pdf = typeof pdf.$inferSelect;
export type NewPdf = typeof pdf.$inferInsert;
