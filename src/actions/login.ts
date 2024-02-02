'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

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
import { lucia, validateRequest } from '@/server/auth';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { encodeBase64 } from 'oslo/encoding';
import { generateId } from 'lucia';
import { redirect } from 'next/navigation';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
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

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email) {
		return {
			error: 'Usuário não encontrado',
		};
	}
	if (!existingUser.password) {
		return {
			error: 'Tenha certeza que você se cadastrou com o email e senha',
		};
	}
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail(email, verificationToken[0].token);
		return {
			success: 'Confirmação de email enviada para o email',
		};
	}

	if (existingUser.two_factor_method == 'EMAIL') {
		const passwordsMatch = await new Argon2id().verify(
			existingUser.password,
			password
		);
		if (!passwordsMatch) {
			return {
				error: 'Email ou senha incorretos',
			};
		}
		if (code) {
			const twoFactorToken = await getEmailTwoFactorTokenByEmail(
				existingUser.email
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
				existingUser.id
			);
			if (existingConfirmation) {
				await deleteEmailTwoFactorConfirmation(existingUser.id);
			}

			await generateEmailTwoFactorConfirmation(existingUser.id);
		} else {
			const token = await generateEmailTwoFactorToken(existingUser.email);
			await sendTwoFactorEmail(existingUser.email, token[0].token);
			return {
				twoFactor: true,
			};
		}
	}

	if (existingUser.two_factor_method == 'AUTHENTICATOR') {
		const passwordsMatch = await new Argon2id().verify(
			existingUser.password,
			password
		);
		if (!passwordsMatch) {
			return {
				error: 'Email ou senha incorretos',
			};
		}
		if (code) {
			const result = await verifyTOTP(code, existingUser.id);
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

	const validPassword = await new Argon2id().verify(
		existingUser.password,
		password
	);
	if (!validPassword) {
		return {
			error: 'Senha inválida',
		};
	}
	if (validPassword) {
		const session = await lucia.createSession(existingUser.id, {
			is_oauth: false,
		});

		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
		const { user } = await validateRequest();
		const cookieSession = JSON.stringify({
			user,
			is_oauth: false,
		});
		const data = new TextEncoder().encode(cookieSession);
		const encodedSession = encodeBase64(data);
		cookies().set('userSession', encodedSession, {
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'strict',
		});
		return redirect(DEFAULT_LOGIN_REDIRECT);
	}
};
