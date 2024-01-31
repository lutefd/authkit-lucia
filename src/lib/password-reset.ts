import { dbPromise } from '@/server/db';
import { passwordResetToken } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Finds a password reset token in the database by searching for the provided token string.
 * @param token - String representation of the token to search for.
 */
export const getPasswordResetTokenbyToken = async (token: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.token, token),
		});
		return result;
	} catch (error) {
		return null;
	}
};

/**
 * Gets the most recent valid password reset token for the specified email address.
 *
 * @param email - The email address to find the password reset token for.
 * @returns An object containing the token information, or null if no such token could be found.
 */
export const getPasswordResetTokenbyEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const result = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.email, email),
		});
		return result;
	} catch (error) {
		return null;
	}
};
