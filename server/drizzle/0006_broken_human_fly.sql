CREATE TYPE "public"."request_status" AS ENUM('received', 'processing', 'done');--> statement-breakpoint
DROP INDEX "large_files_created_at_idx";--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "routes" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "weather" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "weather" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "weather" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "weather" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pdf" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "pdf" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pdf" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "pdf" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trip_request_files" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "trip_request_files" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "status" SET DATA TYPE "public"."request_status" USING "status"::"public"."request_status";--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "status" SET DEFAULT 'received';--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "trip_requests" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "large_files" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "large_files" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "file_request_files" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "file_request_files" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "status" SET DATA TYPE "public"."request_status" USING "status"::"public"."request_status";--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "status" SET DEFAULT 'received';--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "file_requests" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "weather_date_idx" ON "weather" USING btree ("date");--> statement-breakpoint
CREATE INDEX "announcements_created_at_id_idx" ON "announcements" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "trip_requests_created_at_id_idx" ON "trip_requests" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "file_requests_created_at_id_idx" ON "file_requests" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "large_files_created_at_idx" ON "large_files" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);