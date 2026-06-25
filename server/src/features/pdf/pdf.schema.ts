import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

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
  ...softDelete(),
  ...timestamps(),
});

export type Pdf = typeof pdf.$inferSelect;
export type NewPdf = typeof pdf.$inferInsert;
