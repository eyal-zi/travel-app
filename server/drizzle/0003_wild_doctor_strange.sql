CREATE TABLE "trip_request_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_request_id" uuid NOT NULL,
	"file_key" text NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trip_requests" ADD COLUMN "admin_note" text;--> statement-breakpoint
ALTER TABLE "trip_request_files" ADD CONSTRAINT "trip_request_files_trip_request_id_trip_requests_id_fk" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE cascade ON UPDATE no action;