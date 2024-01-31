'use client';
import { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/schemas';
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
import { login } from '@/actions/login';
import Link from 'next/link';

function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: z.infer<typeof LoginSchema>) => {
		startTransition(() => {
			setError('');
			setSuccess('');
			login(data).then((res) => {
				if (res.error) {
					form.reset();
					setError(res?.error);
					setShowTwoFactor(false);
				}
				if (res.success) {
					form.reset();
					setSuccess(res?.success);
				}
				if (res.twoFactor) {
					setShowTwoFactor(true);
				}
			});
		});
	};
	return (
		<CardWrapper
			headerLabel="Bem-vindo de volta"
			backButtonLabel="Não tem uma conta?"
			backButtonHref="/auth/register"
			showSSO
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
						{showTwoFactor && (
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Código de autenticação
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="000000"
												required
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!showTwoFactor && (
							<>
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
													required
													disabled={isPending}
												/>
											</FormControl>
											<Button
												variant="link"
												className="mt-2 mx-0 px-0"
												size="sm"
												asChild
											>
												<Link
													href="/auth/reset"
													className="mx-0"
												>
													Esqueceu a senha?
												</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError error={error} />
					<FormSuccess success={success} />
					<Button
						type="submit"
						variant="default"
						className="w-full"
						disabled={isPending}
					>
						{!showTwoFactor ? 'Entrar' : 'Confirmar'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default LoginForm;
