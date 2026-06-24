CREATE EXTENSION IF NOT EXISTS postgis;--> statement-breakpoint
CREATE TABLE "large_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"file_type" text NOT NULL,
	"accuracy" integer NOT NULL,
	"size_bytes" bigint NOT NULL,
	"geom" geometry(Geometry, 4326) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "large_files_geom_idx" ON "large_files" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "large_files_created_at_idx" ON "large_files" USING btree ("created_at" DESC NULLS LAST);