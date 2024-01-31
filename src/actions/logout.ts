'use server';

import { lucia } from '@/server/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Signs out the user from the system
 */
export const logout = async () => {
	const sessionId = cookies().get('auth_session');
	await lucia.invalidateSession(sessionId?.value!);
	cookies().delete('auth_session');
	cookies().delete('userSession');
	redirect('/auth/login');
};
