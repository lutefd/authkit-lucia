'use client';
import { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResetPasswordSchema } from '@/schemas';
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
import { resetPassword } from '@/actions/reset';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
		},
	});
	const router = useRouter();

	const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
		startTransition(() => {
			setError('');
			setSuccess('');
			resetPassword(data, token).then((res) => {
				setError(res?.error);
				setSuccess(res?.success);
				if (res?.success) {
					form.reset();
					setTimeout(() => {
						router.push('/auth/login');
					}, 1500);
				}
			});
		});
	};
	return (
		<CardWrapper
			headerLabel="Crie uma nova senha"
			backButtonLabel="Voltar ao login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-4">
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
						Redefinir senha
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default ResetPasswordForm;
