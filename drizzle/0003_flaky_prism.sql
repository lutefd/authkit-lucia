CREATE TABLE IF NOT EXISTS "project1_passwordResetToken" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "project1_passwordResetToken_token_unique" UNIQUE("token")
);
