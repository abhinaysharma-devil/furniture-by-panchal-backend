ALTER TABLE "furniture_items" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_otp_verified" boolean DEFAULT 0;