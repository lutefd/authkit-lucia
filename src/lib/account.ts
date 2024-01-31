import { dbPromise } from '@/server/db';
import { accounts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get Account Information by UserID
 *
 * Given a user ID, attempt to retrieve account records related to that user.
 * Return the first account found, or null if no account is found.
 *
 * @param {string} userId Unique Identifier for the user.
 */
export const getAccountByUserId = async (userId: string) => {
	const db = await dbPromise;
	try {
		const account = await db.query.accounts.findFirst({
			where: eq(accounts.userId, userId),
		});
		return account;
	} catch (error) {
		return null;
	}
};
