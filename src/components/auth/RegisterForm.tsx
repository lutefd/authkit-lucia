'use client';
import { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterSchema } from '@/schemas';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import { register } from '@/actions/register';

function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
		startTransition(() => {
			setError('');
			setSuccess('');
			register(data).then((res) => {
				setError(res.error);
				setSuccess(res.success);
			});
		});
	};
	return (
		<CardWrapper
			headerLabel="Crie sua conta"
			backButtonLabel="Já tem uma conta?"
			backButtonHref="/auth/login"
			showSSO
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Seu nome"
											type="text"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="exemplo@email.com"
											type="email"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="********"
											type="password"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError error={error} />
					<FormSuccess success={success} />
					<Button
						type="submit"
						variant="default"
						className="w-full"
						disabled={isPending}
					>
						{' '}
						Cadastrar{' '}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default LoginForm;
