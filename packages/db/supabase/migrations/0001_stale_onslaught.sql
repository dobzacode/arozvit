CREATE TABLE IF NOT EXISTS "expo_push_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plant" RENAME COLUMN "watering_frequency" TO "day_between_watering";--> statement-breakpoint
ALTER TABLE "plant" ALTER COLUMN "last_watering" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plant" ALTER COLUMN "next_watering" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plant" ADD COLUMN "species" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expo_push_token" ADD CONSTRAINT "expo_push_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
