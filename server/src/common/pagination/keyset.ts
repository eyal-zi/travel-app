import { and, eq, lt, or, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

export interface KeysetCursor {
  createdAt: Date;
  id: string;
}

export const encodeCursor = ({ createdAt, id }: KeysetCursor): string =>
  Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');

export const decodeCursor = (token: string): KeysetCursor | null => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const separator = decoded.indexOf('|');
    if (separator === -1) return null;
    const createdAt = new Date(decoded.slice(0, separator));
    const id = decoded.slice(separator + 1);
    if (Number.isNaN(createdAt.getTime()) || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
};

export const keysetCondition = (
  createdAtColumn: PgColumn,
  idColumn: PgColumn,
  token?: string,
): SQL | undefined => {
  if (!token) return undefined;
  const cursor = decodeCursor(token);
  if (!cursor) return undefined;
  return or(
    lt(createdAtColumn, cursor.createdAt),
    and(eq(createdAtColumn, cursor.createdAt), lt(idColumn, cursor.id)),
  );
};

export interface Page<T> {
  items: T[];

  nextCursor: string | null;
}

export const buildPage = <T>(
  rows: T[],
  limit: number,
  toCursor: (row: T) => KeysetCursor,
): Page<T> => {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor =
    hasMore && items.length > 0
      ? encodeCursor(toCursor(items[items.length - 1]))
      : null;
  return { items, nextCursor };
};
