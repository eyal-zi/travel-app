-- Add the per-date key for routes. Existing rows are backfilled from their
-- creation date so the NOT NULL + UNIQUE constraints can be applied cleanly.
ALTER TABLE "routes" ADD COLUMN "date" date;--> statement-breakpoint
UPDATE "routes" SET "date" = "created_at"::date WHERE "date" IS NULL;--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_date_unique" UNIQUE("date");
