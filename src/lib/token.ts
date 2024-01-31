import { dbPromise } from '@/server/db';
import {
	passwordResetToken,
	emailTwoFactorVerificationToken,
	verificationToken,
} from '@/server/db/schema';
import cuid2 from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { getPasswordResetTokenbyEmail } from './password-reset';
import crypto from 'crypto';
import { getEmailTwoFactorTokenByEmail } from './two-factor-authentication';

/**
 * Generates a new verification token for the given email address.
 * Deletes any existing verification tokens for the same email before creating a new one.
 * Returns the newly created VerificationToken object.
 * @param {string} email - The email address for which to create a new verification token.
 */
export const generateVerificationToken = async (email: string) => {
	const token = cuid2.createId();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const db = await dbPromise;
	const existingToken = await getVerificationTokenByEmail(email);
	if (existingToken) {
		await db
			.delete(verificationToken)
			.where(eq(verificationToken.id, existingToken.id));
	}
	const newTokenData = {
		email,
		token,
		expires,
	};
	const newVerificationToken = await db
		.insert(verificationToken)
		.values(newTokenData)
		.returning({
			token: verificationToken.token,
		});
	return newVerificationToken;
};

/**
 * Retrieves a verification token by the given email address.
 * Returns the VerificationToken object if found, otherwise returns `null`.
 * @param {string} email - The email address associated with the desired verification token to be retrieved.
 */
export const getVerificationTokenByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.email, email),
		});
		return result;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a verification token by the given token value.
 * Returns the VerificationToken object if found, otherwise returns `null`.
 * @param {string} token - The token value of the verification token to be retrieved.
 */
export const getVerificationTokenByToken = async (token: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.token, token),
		});
		return result;
	} catch (error) {
		return null;
	}
};

/**
 * Generates a new Password Reset Token for the given email address.
 * Removes any previously issued token for the same email address before generating a new one.
 * Returns the newly created PasswordResetToken object.
 * @param {string} email - The email address for which to generate a new reset token.
 */
export const generatePasswordResetToken = async (email: string) => {
	const token = cuid2.createId();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const db = await dbPromise;
	const existingToken = await getPasswordResetTokenbyEmail(email);
	if (existingToken) {
		await db
			.delete(passwordResetToken)
			.where(eq(passwordResetToken.id, existingToken.id));
	}
	const newTokenData = {
		email,
		token,
		expires,
	};
	const newPasswordResetToken = await db
		.insert(passwordResetToken)
		.values(newTokenData)
		.returning({
			token: passwordResetToken.token,
		});
	return newPasswordResetToken;
};

/**
 * Generates a new Email Two Factor Authentication token for the given email address.
 * Invalidates any existing tokens for the same email address before issuing a new one.
 * Returns the newly created EmailTwoFactorVerificationToken object.
 * @param {string} email - The email address for which to generate a new two-factor token.
 */
export const generateEmailTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100000, 999999).toString();
	const expires = new Date(new Date().getTime() + 1800 * 1000);
	const db = await dbPromise;
	const existingToken = await getEmailTwoFactorTokenByEmail(email);
	if (existingToken) {
		await db
			.delete(emailTwoFactorVerificationToken)
			.where(eq(emailTwoFactorVerificationToken.id, existingToken.id));
	}
	const newTokenData = {
		email,
		token,
		expires,
	};
	const newTwoFactorToken = await db
		.insert(emailTwoFactorVerificationToken)
		.values(newTokenData)
		.returning({
			token: emailTwoFactorVerificationToken.token,
		});
	return newTwoFactorToken;
};

/**
 * Deletes the Email Two Factor Authentication token associated with the given token ID.
 * @param {string} tokenId - The unique identifier of the token to be deleted.
 */
export const deleteEmailTwoFactorToken = async (tokenId: string) => {
	const db = await dbPromise;
	await db
		.delete(emailTwoFactorVerificationToken)
		.where(eq(emailTwoFactorVerificationToken.id, tokenId));
};
