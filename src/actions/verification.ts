'use server';

import { getVerificationTokenByToken } from '@/lib/token';
import { getUserByEmail } from '@/lib/user';
import { dbPromise } from '@/server/db';
import { users, verificationToken } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Verifies an email verification token
 *
 * @param {string} token - The verification token to check
 */
export async function verificateToken(token: string) {
	const db = await dbPromise;
	const existingToken = await getVerificationTokenByToken(token);
	if (!existingToken)
		return {
			error: 'Token não encontrado',
		};
	const hasExpired = existingToken.expires < new Date();
	if (hasExpired)
		return {
			error: 'Token expirado',
		};

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser)
		return {
			error: 'Usuário não encontrado',
		};
	await db
		.update(users)
		.set({
			emailVerified: new Date(),
			email: existingToken.email,
		})
		.where(eq(users.id, existingUser.id))
		.returning({
			email: users.email,
			emailVerified: users.emailVerified,
		});
	await db
		.delete(verificationToken)
		.where(eq(verificationToken.id, existingToken.id));

	return {
		success: 'Email verificado com sucesso!',
	};
}
