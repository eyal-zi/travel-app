// Re-baselines drizzle's migration bookkeeping table so it exactly mirrors the
// on-disk migrations in ./drizzle.
//
// WHY THIS EXISTS
// drizzle-kit `migrate` decides what to run with a single comparison: it looks
// at the newest row in `drizzle.__drizzle_migrations` and applies a migration
// only if its journal timestamp (`when`) is greater than that row's
// `created_at` (see drizzle-orm/pg-core dialect: `created_at < folderMillis`).
// If the bookkeeping table ever holds a row newer than a pending migration —
// which is exactly what happens after migrations are squashed/regenerated and
// the table keeps stale rows from the previous set — `migrate` silently treats
// everything as applied and creates nothing, while still printing "applied
// successfully". New tables then never get created.
//
// This script makes the table a faithful mirror of the current journal: one row
// per migration file, with `created_at` = the journal `when` and `hash` =
// sha256 of the file (the same hash drizzle computes). After running it,
// `migrate` works correctly again.
//
// WHEN TO RUN
// Run AFTER you have squashed/regenerated migrations (or otherwise know the
// database schema already matches the migrations at head) to re-baseline the
// bookkeeping. Verify with `npm run db:generate` first: it should report no
// schema changes. Do NOT run it to skip migrations that haven't actually been
// applied to the database.
//
// Usage: npm run db:baseline

import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const drizzleDir = join(here, '..', 'drizzle');

const journal = JSON.parse(
  readFileSync(join(drizzleDir, 'meta', '_journal.json'), 'utf8'),
);

const migrations = journal.entries.map((entry) => {
  const sql = readFileSync(join(drizzleDir, `${entry.tag}.sql`), 'utf8');
  return {
    tag: entry.tag,
    when: entry.when,
    hash: createHash('sha256').update(sql).digest('hex'),
  };
});

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

try {
  await pool.query('CREATE SCHEMA IF NOT EXISTS "drizzle"');
  await pool.query(
    `CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
       id SERIAL PRIMARY KEY,
       hash text NOT NULL,
       created_at bigint
     )`,
  );

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM "drizzle"."__drizzle_migrations"');
    for (const m of migrations) {
      await client.query(
        'INSERT INTO "drizzle"."__drizzle_migrations" ("hash", "created_at") VALUES ($1, $2)',
        [m.hash, m.when],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  console.log(
    `Baselined drizzle.__drizzle_migrations to ${migrations.length} migration(s):`,
  );
  for (const m of migrations) console.log(`  ${m.tag} (when=${m.when})`);
} finally {
  await pool.end();
}
