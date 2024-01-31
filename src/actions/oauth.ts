'use server';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from '@/server/auth';
import { AuthError } from 'next-auth';

/**
 * Performs OAuth Login using third party providers
 *
 * @param {string} provider - Name of the supported OAuth Provider (e.g. Google, Facebook)
 */
export const oauthLogin = async (provider: string) => {
	try {
		await signIn(provider);
		return {
			success: 'Login realizado com sucesso',
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return {
						error: 'Email ou senha incorretos',
					};
				default:
					return { error: 'Ocorreu um erro ao realizar o login' };
			}
		}
		throw error;
	}
};
