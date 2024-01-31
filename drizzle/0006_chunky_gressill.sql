ALTER TABLE "project1_twoFactorVerificationToken" RENAME TO "project1_emailTwoFactorVerificationToken";--> statement-breakpoint
ALTER TABLE "project1_emailTwoFactorVerificationToken" DROP CONSTRAINT "project1_twoFactorVerificationToken_email_unique";--> statement-breakpoint
ALTER TABLE "project1_emailTwoFactorVerificationToken" DROP CONSTRAINT "project1_twoFactorVerificationToken_token_unique";--> statement-breakpoint
ALTER TABLE "project1_emailTwoFactorVerificationToken" ADD CONSTRAINT "project1_emailTwoFactorVerificationToken_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "project1_emailTwoFactorVerificationToken" ADD CONSTRAINT "project1_emailTwoFactorVerificationToken_token_unique" UNIQUE("token");