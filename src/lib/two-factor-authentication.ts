import { dbPromise } from '@/server/db';
import {
	emailTwoFactorConfirmation,
	emailTwoFactorVerificationToken,
} from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Updates the specified user's account status to either "ACTIVE" or "BLOCKED".
 * Returns the updated user object if successful, otherwise returns `null`.
 * @param {string} id - The unique identifier of the user whose account status should be updated.
 * @param {'ACTIVE'|'BLOCKED'} status - The new account status value for the user. Must be either "ACTIVE" or "BLOCKED".
 */
export const getEmailTwoFactorToken = async (token: string) => {
	const db = await dbPromise;
	try {
		const twoFactorToken =
			await db.query.emailTwoFactorVerificationToken.findFirst({
				where: eq(emailTwoFactorVerificationToken.token, token),
			});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the active Email Two Factor Verification Token associated with the given email address.
 * Returns the EmailTwoFactorVerificationToken object representing the requested token, or null if the token doesn't exist or has expired.
 * @param {string} email - The email address associated with the desired Email Two Factor Verification Token.
 */
export const getEmailTwoFactorTokenByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const twoFactorToken =
			await db.query.emailTwoFactorVerificationToken.findFirst({
				where: eq(emailTwoFactorVerificationToken.email, email),
			});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the Email Two Factor Confirmation associated with the given user ID.
 * Returns the EmailTwoFactorConfirmation object representing the confirmation, or null if none exists or has already been consumed.
 * @param {string} userId - The unique identifier of the user associated with the desired Email Two Factor Confirmation.
 */
export const getEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	try {
		const twoFactorConfirmation =
			await db.query.emailTwoFactorConfirmation.findFirst({
				where: eq(emailTwoFactorConfirmation.userId, userId),
			});
		return twoFactorConfirmation;
	} catch (error) {
		return null;
	}
};

/**
 * Creates a new EmailTwoFactorConfirmation object for the given user ID.
 * @param {string} userId - The unique identifier of the user to associate with the confirmation.
 */
export const generateEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	await db.insert(emailTwoFactorConfirmation).values({
		userId,
	});
};

/**
 * Attempts to delete the EmailTwoFactorConfirmation object associated with the given user ID.
 * Returns true upon successful deletion, false otherwise.
 * @param {string} userId - The unique identifier of the user whose EmailTwoFactorConfirmation object should be deleted.
 */
export const deleteEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	try {
		await db
			.delete(emailTwoFactorConfirmation)
			.where(eq(emailTwoFactorConfirmation.userId, userId));
		return true;
	} catch (error) {
		return false;
	}
};
