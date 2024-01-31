CREATE TABLE IF NOT EXISTS "project1_verificationToken" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_verificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "project1_user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project1_user" ALTER COLUMN "status" DROP NOT NULL;