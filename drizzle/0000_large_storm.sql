DO $$ BEGIN
 CREATE TYPE "role_enum" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "two_factor_method_enum" AS ENUM('NONE', 'EMAIL', 'AUTHENTICATOR');
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
CREATE TABLE IF NOT EXISTS "project1_emailTwoFactorConfirmation" (
	"id" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "project1_emailTwoFactorConfirmation_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_emailTwoFactorVerificationToken" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_emailTwoFactorVerificationToken_email_unique" UNIQUE("email"),
	CONSTRAINT "project1_emailTwoFactorVerificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_oauth_account" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "project1_oauth_account_provider_user_id_unique" UNIQUE("provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_passwordResetToken" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_passwordResetToken_email_unique" UNIQUE("email"),
	CONSTRAINT "project1_passwordResetToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"is_oauth" boolean,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"password" text,
	"image" text,
	"role" "role_enum",
	"status" "user_status_enum",
	"two_factor_method" "two_factor_method_enum",
	"two_factor_secret" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_verificationToken" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_verificationToken_email_unique" UNIQUE("email"),
	CONSTRAINT "project1_verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_emailTwoFactorConfirmation" ADD CONSTRAINT "project1_emailTwoFactorConfirmation_userId_project1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "project1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
