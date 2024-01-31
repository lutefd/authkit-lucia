import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { authDb, dbPromise } from './db';
import {
	type DatabaseUser,
	sessionTable,
	users,
	DatabaseSession,
} from './db/schema';
import { cache } from 'react';
import type { Session, User } from 'lucia';
import { GitHub, Google } from 'arctic';

import { cookies } from 'next/headers';
import { env } from '@/env';
const adapter = new DrizzlePostgreSQLAdapter(authDb, sessionTable, users);

export const lucia = new Lucia(adapter, {
	getUserAttributes(databaseUserAttributes) {
		return {
			email: databaseUserAttributes.email,
			image: databaseUserAttributes.image,
			role: databaseUserAttributes.role,
			status: databaseUserAttributes.status,
			two_factor_method: databaseUserAttributes.two_factor_method,
			name: databaseUserAttributes.name,
		};
	},
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getSessionAttributes(databaseSessionAttributes) {
		return {
			// userId: databaseSessionAttributes.userId,
			is_oauth: databaseSessionAttributes.is_oauth,
		};
	},
});
export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		sessionId;
		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}

		const result = await lucia.validateSession(sessionId);
		result;
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
		} catch {}
		return result;
	}
);

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseSessionAttributes {
	is_oauth: boolean;
}

export type DatabaseUserAttributes = Omit<
	DatabaseUser,
	'password' | 'two_factor_secret' | 'emailVerified'
>;

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	'http://localhost:3000/api/auth/google/callback'
);
export const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET
);
