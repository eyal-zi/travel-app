import { pgEnum } from 'drizzle-orm/pg-core';

// Workflow status shared by trip requests and file requests (identical lifecycles).
// Set server-side: defaults to "received" on intake and is advanced by an admin.
// A Postgres enum so the database itself rejects unknown values and the inferred
// Drizzle column type is the union, not a bare string.
export const requestStatus = pgEnum('request_status', [
  'received',
  'processing',
  'done',
]);

export type RequestStatus = (typeof requestStatus.enumValues)[number];
