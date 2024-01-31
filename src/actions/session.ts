'use server';
import { DatabaseUserAttributes, validateRequest } from '@/server/auth';
import brcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decodeBase64, encodeBase64 } from 'oslo/encoding';
export const updateSession = async () => {
	const { user, session } = await validateRequest();
	const sessionInfo = {
		user,
		is_oauth: session?.is_oauth,
	};

	const stringfiedUser = JSON.stringify(sessionInfo);
	const data = new TextEncoder().encode(stringfiedUser);
	const encodedUser = encodeBase64(data);

	cookies().set('userSession', encodedUser, {
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict',
	});
};

export const readSession = async () => {
	const userSession = cookies().get('userSession');
	if (!userSession) {
		const { user, session } = await validateRequest();
		if (!user || !session) {
			return {
				user: null,
				is_oauth: null,
			};
		}
		const sessionInfo = {
			user,
			is_oauth: session?.is_oauth,
		};
		return sessionInfo;
	}
	try {
		const decodedUserSession = decodeBase64(userSession.value);
		const decodedUser = new TextDecoder().decode(decodedUserSession);
		const parsedCookie = JSON.parse(decodedUser);
		const user = parsedCookie.user as DatabaseUserAttributes;
		const is_oauth = parsedCookie.is_oauth as boolean;
		return { user, is_oauth };
	} catch (error) {
		return {
			user: null,
			is_oauth: null,
		};
	}
};
