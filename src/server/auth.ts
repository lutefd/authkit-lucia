import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authDb } from './db';
import authConfig from './auth.config';
import { getUserById, setDefaultValues } from '@/lib/user';
import { pgTable } from './db/schema';
import {
	deleteEmailTwoFactorConfirmation,
	getEmailTwoFactorConfirmation,
} from '@/lib/two-factor-authentication';

declare module 'next-auth' {
	interface Session {
		user: {
			role: string | null;
			twoFactorMethod: string | null;
			isOauth: boolean;
		} & DefaultSession['user'];
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	update,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await setDefaultValues(user.id);
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			const existingUser = await getUserById(user.id);
			if (existingUser?.status == 'BLOCKED') {
				return false;
			}
			if (account?.provider != 'credentials') {
				return true;
			}
			if (!existingUser?.emailVerified) return false;

			if (existingUser.two_factor_method == 'EMAIL') {
				const twoFactorConfirmation =
					await getEmailTwoFactorConfirmation(existingUser.id);
				if (!twoFactorConfirmation) {
					return false;
				}
				await deleteEmailTwoFactorConfirmation(existingUser.id);
			}

			return true;
		},

		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.image as unknown as
					| string
					| null
					| undefined;
				session.user.isOauth = token.isOauth as unknown as boolean;
			}
			if (token.role && session.user) {
				session.user.role = token.role as 'ADMIN' | 'USER' | null;
			}
			if (token.twoFactorMethod && session.user) {
				session.user.twoFactorMethod = token.twoFactorMethod as
					| 'NONE'
					| 'EMAIL'
					| 'AUTHENTICATOR'
					| null;
			}

			return session;
		},

		async jwt({ token, account }) {
			if (!token.sub) return token;
			if (account) {
				if (
					account?.provider == 'credentials' ||
					account?.provider == null ||
					account == undefined ||
					account == null
				) {
					token.isOauth = false;
				} else {
					token.isOauth = true;
				}
			}
			const user = await getUserById(token.sub);
			if (!user) return token;

			token.twoFactorMethod = user.two_factor_method;
			token.role = user.role;
			token.name = user.name;
			token.email = user.email;
			token.image = user.image;

			return token;
		},
	},
	adapter: DrizzleAdapter(authDb, pgTable),
	session: {
		strategy: 'jwt',
	},
	trustHost: true,
	...authConfig,
});
