CREATE TABLE "large_file_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"large_file_id" uuid NOT NULL,
	"file_key" text NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "large_file_files_large_file_id_unique" UNIQUE("large_file_id")
);
--> statement-breakpoint
ALTER TABLE "file_requests" ADD COLUMN "large_file_id" uuid;--> statement-breakpoint
ALTER TABLE "large_file_files" ADD CONSTRAINT "large_file_files_large_file_id_large_files_id_fk" FOREIGN KEY ("large_file_id") REFERENCES "public"."large_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_requests" ADD CONSTRAINT "file_requests_large_file_id_large_files_id_fk" FOREIGN KEY ("large_file_id") REFERENCES "public"."large_files"("id") ON DELETE no action ON UPDATE no action;