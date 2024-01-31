'use server';

import { currentRole } from '@/lib/user';

/**
 * Checks if the current user has administrative privileges
 */
export const adminDemo = async () => {
	const role = await currentRole();
	if (role == 'ADMIN') {
		return { success: 'Você tem permissão para acessar essa ação' };
	}
	return { error: 'Você não tem permissão para acessar essa ação' };
};
