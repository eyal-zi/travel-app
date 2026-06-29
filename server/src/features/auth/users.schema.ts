import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { softDelete, timestamps } from '../../common/database/columns';

// The application roles. Role is derived at sign-in from the IdP groups: a user
// is `admin` when they belong to the configured ADMIN_GROUP, otherwise `user`.
export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// A user provisioned from the external identity provider. Sign-in upserts on
// `uniqueId` (the IdP's stable identifier), so repeated logins refresh the
// stored profile rather than creating duplicates. We never store credentials —
// authentication happens at the IdP; we only mirror the profile + groups so we
// can issue our own app JWT and do group-based authorization.
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  // The IdP's stable identifier. Unique so it can be the upsert conflict target.
  uniqueId: text('unique_id').notNull().unique(),
  username: text('username'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name'),
  displayName: text('display_name'),
  email: text('email'),
  // The IdP groups this user belongs to, used for authorization.
  groups: jsonb('groups').$type<string[]>().notNull().default([]),
  // Derived from `groups` at sign-in: `admin` if the ADMIN_GROUP is present,
  // otherwise `user`.
  role: text('role').$type<UserRole>().notNull().default('user'),
  ...softDelete(),
  ...timestamps(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
