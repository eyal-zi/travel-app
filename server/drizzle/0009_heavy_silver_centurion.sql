ALTER TABLE "trip_requests" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "trip_requests" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "file_requests" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "file_requests" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "trip_requests" ADD CONSTRAINT "trip_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_requests" ADD CONSTRAINT "trip_requests_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_requests" ADD CONSTRAINT "file_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_requests" ADD CONSTRAINT "file_requests_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;