import { and, eq, lt, or, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

// Keyset (a.k.a. seek) pagination over a newest-first `(createdAt, id)` ordering.
// The cursor carries BOTH components so paging stays exact even when many rows
// share a createdAt — the id breaks the tie. It is encoded base64url so clients
// treat it as an opaque token and pass it straight back.

export interface KeysetCursor {
  createdAt: Date;
  id: string;
}

export const encodeCursor = ({ createdAt, id }: KeysetCursor): string =>
  Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');

// Returns null on a malformed token so a bad cursor degrades to the first page
// rather than throwing. Callers only ever echo a token we issued, so this is just
// defensive.
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

// WHERE term selecting rows strictly after the cursor under a
// `ORDER BY createdAt DESC, id DESC` scan. Equivalent to the row-value comparison
// `(createdAt, id) < (cursor.createdAt, cursor.id)` but written with typed Drizzle
// operators. Returns undefined when there is no (usable) cursor — i.e. first page.
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
  // Opaque cursor for the next (older) page, or null when none remain.
  nextCursor: string | null;
}

// Trims a fetched `limit + 1` window down to the page and derives the next cursor
// from the last kept row. Run this on the raw rows (which carry the Date createdAt
// and id) before mapping them to a response shape.
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
