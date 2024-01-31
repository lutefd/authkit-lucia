'use server';

import { signOut } from '@/server/auth';

/**
 * Signs out the user from the system
 */
export const logout = async () => {
	await signOut();
};
