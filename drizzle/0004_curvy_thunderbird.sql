CREATE TABLE IF NOT EXISTS "project1_twoFactorVerificationToken" (
	"id" text NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_twoFactorVerificationToken_token_unique" UNIQUE("token")
);
