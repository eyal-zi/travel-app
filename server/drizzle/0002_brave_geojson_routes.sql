-- Routes now store GeoJSON in a jsonb column instead of S3 file metadata.
-- The previous rows held only disposable S3 references, so the table is
-- truncated to let the new NOT NULL columns be added cleanly.
TRUNCATE TABLE "routes";--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "bucket";--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "original_name";--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "content_type";--> statement-breakpoint
ALTER TABLE "routes" DROP COLUMN "file_size";
