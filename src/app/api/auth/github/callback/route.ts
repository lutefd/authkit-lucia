import { getUserByEmail } from '@/lib/user';
import { github, lucia } from '@/server/auth';
import { dbPromise } from '@/server/db';
import { oauthAccounts, users } from '@/server/db/schema';
import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { encodeBase64 } from 'oslo/encoding';

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies().get('github_oauth_state')?.value ?? null;
	const db = await dbPromise;

	console.table({ code, state, storedState });

	if (!code || !state || !storedState || state !== storedState) {
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
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const githubUser: GitHubUser = await githubUserResponse.json();
		const oauthEmailResponse = await fetch(
			'https://api.github.com/user/emails',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			}
		);
		const oauthEmails: {
			email: string;
			verified: boolean;
			primary: boolean;
		}[] = await oauthEmailResponse.json();
		if (!githubUser.email) {
			githubUser.email =
				oauthEmails.find((email) => email.primary && email.verified)
					?.email ??
				oauthEmails.find((email) => email.verified)?.email ??
				null;
		}
		const primaryEmail = oauthEmails.find((email) => email.primary) ?? null;

		if (!githubUser.email) {
			return new Response(
				JSON.stringify({
					error: 'Sem email primário',
				}),
				{
					status: 400,
					statusText: 'Bad Request',
				}
			);
		}
		if (!primaryEmail!.verified) {
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
				eq(oauthAccounts.provider_id, 'github'),
				eq(oauthAccounts.provider_user_id, githubUser.id)
			),
		});
		const existingUser = await getUserByEmail(githubUser.email);
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

			cookies().delete('github_oauth_state');
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
					provider_id: 'github',
					provider_user_id: githubUser.id,
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

				cookies().delete('github_oauth_state');
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
						email: githubUser.email,
						emailVerified: new Date(),
						name: githubUser.name,
						image: githubUser.avatar_url,
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
					provider_id: 'github',
					provider_user_id: githubUser.id,
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
				cookies().delete('github_oauth_state');
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/auth/login',
					},
				});
			}
		}
	} catch (e) {
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
interface GitHubUser {
	id: string;
	login: string;
	avatar_url: string;
	name: string;
	email: string | null;
}
interface GitHubEmail {
	email: string;
	verified: boolean;
	primary: boolean;
}
