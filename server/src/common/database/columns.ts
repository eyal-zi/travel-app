import { boolean, timestamp } from 'drizzle-orm/pg-core';

export const timestamps = () => ({
  createdAt: timestamp('created_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const creationTimestamp = () => ({
  createdAt: timestamp('created_at', { withTimezone: true, precision: 3 })
    .notNull()
    .defaultNow(),
});

export const softDelete = () => ({
  isDeleted: boolean('is_deleted').notNull().default(false),
});
