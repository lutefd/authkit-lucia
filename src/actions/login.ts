'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

import { signIn } from '@/server/auth';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/user';
import {
	deleteEmailTwoFactorToken,
	generateEmailTwoFactorToken,
	generateVerificationToken,
} from '@/lib/token';
import { sendTwoFactorEmail, sendVerificationEmail } from './email';
import {
	deleteEmailTwoFactorConfirmation,
	generateEmailTwoFactorConfirmation,
	getEmailTwoFactorConfirmation,
	getEmailTwoFactorTokenByEmail,
} from '@/lib/two-factor-authentication';
import { verifyTOTP } from './totp';

/**
 * Logs the user in with email & password credentials
 * @param {z.infer<typeof LoginSchema>} values - Values passed along with the login form submission
 */
export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o login',
		};
	}
	const { email, password, code } = validateFields.data;

	const user = await getUserByEmail(email);

	if (!user || !user.email) {
		return {
			error: 'Usuário não encontrado',
		};
	}
	if (!user.password) {
		return {
			error: 'Tenha certeza que você se cadastrou com o email e senha',
		};
	}
	if (!user.emailVerified) {
		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail(email, verificationToken[0].token);
		return {
			success: 'Confirmação de email enviada para o email',
		};
	}

	if (user.two_factor_method == 'EMAIL') {
		if (code) {
			const twoFactorToken = await getEmailTwoFactorTokenByEmail(
				user.email
			);
			if (!twoFactorToken) {
				return {
					error: 'Código de verificação inválido',
				};
			}
			if (twoFactorToken.token !== code) {
				return {
					error: 'Código de verificação inválido',
				};
			}
			const hasExpired = new Date(twoFactorToken.expires) < new Date();
			if (hasExpired) {
				return {
					error: 'Código de verificação expirado',
				};
			}
			await deleteEmailTwoFactorToken(twoFactorToken.id);
			const existingConfirmation = await getEmailTwoFactorConfirmation(
				user.id
			);
			if (existingConfirmation) {
				await deleteEmailTwoFactorConfirmation(user.id);
			}

			await generateEmailTwoFactorConfirmation(user.id);
		} else {
			const token = await generateEmailTwoFactorToken(user.email);
			await sendTwoFactorEmail(user.email, token[0].token);
			return {
				twoFactor: true,
			};
		}
	}

	if (user.two_factor_method == 'AUTHENTICATOR') {
		if (code) {
			const result = await verifyTOTP(code, user.id);
			if (result.error) {
				return {
					error: result.error,
				};
			}
		} else {
			return {
				twoFactor: true,
			};
		}
	}
	try {
		await signIn('credentials', {
			email,
			password,
		});
		return {
			success: 'Login realizado com sucesso',
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					if (user?.status == 'BLOCKED') {
						return {
							error: 'Usuário bloqueado',
						};
					}
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
