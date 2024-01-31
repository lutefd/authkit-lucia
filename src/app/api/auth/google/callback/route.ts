import { getUserByEmail, getUserById } from '@/lib/user';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { google, lucia, validateRequest } from '@/server/auth';
import { dbPromise } from '@/server/db';
import { oauthAccounts, users } from '@/server/db/schema';
import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encodeBase64 } from 'oslo/encoding';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const db = await dbPromise;
	const storedState = cookies().get('google_oauth_state')?.value ?? null;
	const storedCodeVerifier =
		cookies().get('google_oauth_code_verifier')?.value ?? null;

	if (
		!code ||
		!state ||
		!storedState ||
		state !== storedState ||
		!storedCodeVerifier
	) {
		console.table({
			code,
			state,
			storedState,
			storedCodeVerifier,
		});
		return new Response(
			JSON.stringify({
				error: 'Request foi mal formado',
			}),
			{
				status: 400,
				statusText: 'Bad Request',
			}
		);
	}

	try {
		const tokens = await google.validateAuthorizationCode(
			code,
			storedCodeVerifier
		);
		const response = await fetch(
			'https://openidconnect.googleapis.com/v1/userinfo',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			}
		);
		const googleUser = await response.json();
		const googleEmail = googleUser.email;
		const isGoogleEmailVerified = googleUser.email_verified;
		if (!isGoogleEmailVerified) {
			return new Response(
				JSON.stringify({
					error: 'Email não verificado',
				}),
				{
					status: 400,
					statusText: 'Bad Request',
				}
			);
		}
		const existingAccount = await db.query.oauthAccounts.findFirst({
			where: and(
				eq(oauthAccounts.provider_id, 'google'),
				eq(oauthAccounts.provider_user_id, googleUser.sub)
			),
		});
		const existingUser = await getUserByEmail(googleEmail);
		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.user_id, {
				is_oauth: true,
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			);
			const cookieSession = JSON.stringify({
				user: {
					id: existingUser!.id,
					email: existingUser!.email,
					role: existingUser!.role,
					status: existingUser!.status,
					two_factor_method: existingUser!.two_factor_method,
					name: existingUser!.name,
					image: existingUser!.image,
				},
				is_oauth: true,
			});
			const data = new TextEncoder().encode(cookieSession);
			const encodedSession = encodeBase64(data);
			cookies().set('userSession', encodedSession, {
				secure: process.env.NODE_ENV !== 'development',
				sameSite: 'strict',
			});

			cookies().delete('google_oauth_state');
			cookies().delete('google_oauth_code_verifier');
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/auth/login',
				},
			});
		} else {
			if (existingUser) {
				await db.insert(oauthAccounts).values({
					user_id: existingUser.id,
					provider_id: 'google',
					provider_user_id: googleUser.sub,
				});
				const session = await lucia.createSession(existingUser.id, {
					is_oauth: true,
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
				const cookieSession = JSON.stringify({
					user: {
						id: existingUser.id,
						email: existingUser.email,
						role: existingUser.role,
						status: existingUser.status,
						two_factor_method: existingUser.two_factor_method,
						name: existingUser.name,
						image: existingUser.image,
					},
					is_oauth: true,
				});
				const data = new TextEncoder().encode(cookieSession);
				const encodedSession = encodeBase64(data);
				cookies().set('userSession', encodedSession, {
					secure: process.env.NODE_ENV !== 'development',
					sameSite: 'strict',
				});

				cookies().delete('google_oauth_state');
				cookies().delete('google_oauth_code_verifier');
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/auth/login',
					},
				});
			} else {
				const newUser = await db
					.insert(users)
					.values({
						email: googleEmail,
						emailVerified: new Date(),
						name: googleUser.name,
						image: googleUser.picture,
						role: 'USER',
						two_factor_method: 'NONE',
						password: null,
						status: 'ACTIVE',
					})
					.returning({
						id: users.id,
						email: users.email,
						role: users.role,
						status: users.status,
						two_factor_method: users.two_factor_method,
						name: users.name,
						image: users.image,
					});
				await db.insert(oauthAccounts).values({
					user_id: newUser[0].id,
					provider_id: 'google',
					provider_user_id: googleUser.sub,
				});
				const session = await lucia.createSession(newUser[0].id, {
					is_oauth: true,
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
				const cookieSession = JSON.stringify({
					user: {
						id: newUser[0].id,
						email: newUser[0].email,
						role: newUser[0].role,
						status: newUser[0].status,
						two_factor_method: newUser[0].two_factor_method,
						name: newUser[0].name,
						image: newUser[0].image,
					},
					is_oauth: true,
				});
				const data = new TextEncoder().encode(cookieSession);
				const encodedSession = encodeBase64(data);
				cookies().set('userSession', encodedSession, {
					secure: process.env.NODE_ENV !== 'development',
					sameSite: 'strict',
				});
				cookies().delete('google_oauth_state');
				cookies().delete('google_oauth_code_verifier');
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/auth/login',
					},
				});
			}
		}
	} catch (e) {
		console.log(e);
		if (
			e instanceof OAuth2RequestError &&
			e.message === 'bad_verification_code'
		) {
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
}
