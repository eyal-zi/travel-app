CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket" text NOT NULL,
	"key" text NOT NULL,
	"original_name" text,
	"content_type" text,
	"file_size" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
