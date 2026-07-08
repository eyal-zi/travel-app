import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  uniqueId: text('unique_id').notNull().unique(),
  username: text('username'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name'),
  displayName: text('display_name'),
  email: text('email'),

  groups: jsonb('groups').$type<string[]>().notNull().default([]),

  role: text('role').$type<UserRole>().notNull().default('user'),
  ...softDelete(),
  ...timestamps(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
