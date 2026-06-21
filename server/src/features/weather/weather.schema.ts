import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// A weather image for a given calendar date. The image bytes live in S3; this
// table keeps the S3 object key plus the date it belongs to so the signed URL
// can be regenerated on demand (signed URLs are short-lived and not stored).
export const weather = pgTable('weather', {
  id: uuid('id').primaryKey().defaultRandom(),
  // The S3 object key (a uuid-based name) the image was uploaded under.
  imageKey: text('image_key').notNull(),
  // The calendar date this image belongs to. Stored as a date-only value
  // ("YYYY-MM-DD"), matching the routes table convention.
  date: date('date').notNull(),
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

export type Weather = typeof weather.$inferSelect;
export type NewWeather = typeof weather.$inferInsert;
