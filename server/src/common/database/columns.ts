import { boolean, timestamp } from 'drizzle-orm/pg-core';

// Shared column groups so every table declares its audit and soft-delete columns
// the same way. Each is a factory (returns fresh builders) rather than a shared
// object, so two tables never alias the same column-builder instance.

// created_at / updated_at, at millisecond precision. timestamp(3) matches what the
// pg driver hands back as a JS Date: a value read out and sent back (e.g. as a
// keyset pagination cursor) then compares exactly equal to the stored value, which
// the default microsecond precision would not — the driver truncates the micros.
export const timestamps = () => ({
  createdAt: timestamp('created_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Just created_at (same precision) for append-only tables that never update in
// place — file attachments, large_files.
export const creationTimestamp = () => ({
  createdAt: timestamp('created_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow(),
});

// Soft-delete flag: rows are flagged instead of being removed so history is
// preserved and deletes stay reversible.
export const softDelete = () => ({
  isDeleted: boolean('is_deleted').notNull().default(false),
});
