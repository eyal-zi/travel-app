CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unique_id" text NOT NULL,
	"username" text,
	"first_name" text,
	"last_name" text,
	"full_name" text,
	"display_name" text,
	"email" text,
	"groups" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_unique_id_unique" UNIQUE("unique_id")
);
