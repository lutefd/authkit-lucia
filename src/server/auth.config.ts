import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from '@/lib/user';
import bcrypt from 'bcryptjs';
import { env } from '@/env';

export default {
	providers: [
		GitHub({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Google({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);

					if (!user || !user.password) {
						return null;
					}

					const passwordsMatch = await bcrypt.compare(
						password,
						user.password
					);

					if (passwordsMatch) {
						return user;
					}
				}
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
