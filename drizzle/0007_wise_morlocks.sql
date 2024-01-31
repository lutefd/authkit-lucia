CREATE TABLE IF NOT EXISTS "project1_oauth_account" (
	"provider_id" text PRIMARY KEY NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "project1_oauth_account_provider_user_id_unique" UNIQUE("provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DROP TABLE "project1_account";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_oauth_account" ADD CONSTRAINT "project1_oauth_account_user_id_project1_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "project1_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_session" ADD CONSTRAINT "project1_session_user_id_project1_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "project1_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
