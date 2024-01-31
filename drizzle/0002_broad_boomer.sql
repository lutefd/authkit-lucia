DO $$ BEGIN
 CREATE TYPE "two_factor_method_enum" AS ENUM('NONE', 'EMAIL', 'AUTHENTICATOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project1_user" ADD COLUMN "two_factor_method" "two_factor_method_enum";--> statement-breakpoint
ALTER TABLE "project1_user" ADD COLUMN "two_factor_secret" text;