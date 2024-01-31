import { z } from 'zod';

export const SettingsSchema = z
	.object({
		name: z.optional(
			z.string().min(3, {
				message: 'O nome deve ter no mínimo 3 caracteres',
			})
		),
		email: z.optional(
			z.string().email({
				message: 'O email deve ser válido',
			})
		),
		role: z.optional(z.enum(['ADMIN', 'USER'])),
		two_factor_method: z.optional(
			z.enum(['NONE', 'EMAIL', 'AUTHENTICATOR'])
		),
		password: z.optional(
			z.string().min(8, {
				message: 'A senha deve ter no mínimo 8 caracteres',
			})
		),
		newPassword: z.optional(
			z.string().min(8, {
				message: 'A nova senha deve ter no mínimo 8 caracteres',
			})
		),
		code: z.optional(z.string()),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}
			if (!data.password && data.newPassword) {
				return false;
			}
			return true;
		},
		{
			message: 'A senha atual e a nova senha são obrigatórias',
			path: ['password', 'newPassword'],
		}
	);

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'O email deve ser válido',
	}),
	password: z.string().min(1, {
		message: 'A senha é obrigatória',
	}),
	code: z.optional(z.string()),
});

export const ResetSchema = z.object({
	email: z.string().email({
		message: 'O email é obrigatório',
	}),
});

export const ResetPasswordSchema = z.object({
	password: z
		.string()
		.min(8, {
			message: 'A senha deve ter no mínimo 8 caracteres',
		})
		.max(44, {
			message: 'A senha deve ter no máximo 44 caracteres',
		}),
});

export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'O email deve ser válido',
	}),
	password: z
		.string()
		.min(8, {
			message: 'A senha deve ter no mínimo 8 caracteres',
		})
		.max(44, {
			message: 'A senha deve ter no máximo 44 caracteres',
		}),
	name: z.string().min(3, {
		message: 'O nome deve ter no mínimo 3 caracteres',
	}),
});
