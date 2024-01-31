'use server';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { dbPromise } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from './email';

/**
 * Registers a new user account
 *
 * @param {z.infer<typeof RegisterSchema>} values - Form data coming from registration screen
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const db = await dbPromise;
	const validateFields = RegisterSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o cadastro  ',
		};
	}
	const {
		email: inputEmail,
		password,
		name: inputName,
	} = validateFields.data;

	const hashPassword = await bcrypt.hash(password, 10);

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, inputEmail),
	});

	if (existingUser) {
		return {
			error: 'Usuário já cadastrado',
		};
	}
	const user = {
		email: inputEmail,
		password: hashPassword,
		name: inputName,
	};
	await db.insert(users).values(user);
	const verificationToken = await generateVerificationToken(inputEmail);
	await sendVerificationEmail(inputEmail, verificationToken[0].token);

	return {
		success: 'Confirmação de cadastro enviada para o email',
	};
};
