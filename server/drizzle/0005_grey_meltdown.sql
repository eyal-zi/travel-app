CREATE TABLE "file_request_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_request_id" uuid NOT NULL,
	"file_key" text NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_goal" text NOT NULL,
	"country" text NOT NULL,
	"agency" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"area" jsonb NOT NULL,
	"file_types" jsonb NOT NULL,
	"geo" jsonb NOT NULL,
	"notes" text,
	"status" text DEFAULT 'received' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file_request_files" ADD CONSTRAINT "file_request_files_file_request_id_file_requests_id_fk" FOREIGN KEY ("file_request_id") REFERENCES "public"."file_requests"("id") ON DELETE cascade ON UPDATE no action;