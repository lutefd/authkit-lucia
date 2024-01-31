DO $$ BEGIN
 CREATE TYPE "role_enum" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_status_enum" AS ENUM('ACTIVE', 'BLOCKED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "project1_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"password" text,
	"image" text,
	"role" "role_enum" DEFAULT 'USER' NOT NULL,
	"status" "user_status_enum" DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_account" ADD CONSTRAINT "project1_account_userId_project1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "project1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
