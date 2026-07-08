import { pgEnum } from 'drizzle-orm/pg-core';

export const requestStatus = pgEnum('request_status', [
  'received',
  'processing',
  'done',
]);

export type RequestStatus = (typeof requestStatus.enumValues)[number];
