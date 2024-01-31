CREATE TABLE IF NOT EXISTS "project1_emailTwoFactorConfirmation" (
	"id" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "project1_emailTwoFactorConfirmation_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "project1_twoFactorVerificationToken" RENAME COLUMN "userId" TO "email";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_emailTwoFactorConfirmation" ADD CONSTRAINT "project1_emailTwoFactorConfirmation_userId_project1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "project1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project1_passwordResetToken" ADD CONSTRAINT "project1_passwordResetToken_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "project1_twoFactorVerificationToken" ADD CONSTRAINT "project1_twoFactorVerificationToken_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "project1_verificationToken" ADD CONSTRAINT "project1_verificationToken_email_unique" UNIQUE("email");