'use client';
import { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResetSchema } from '@/schemas';
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
import { reset } from '@/actions/reset';

function ResetForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = (data: z.infer<typeof ResetSchema>) => {
		startTransition(() => {
			setError('');
			setSuccess('');
			reset(data).then((res) => {
				setError(res?.error);
				setSuccess(res?.success);
			});
		});
	};
	return (
		<CardWrapper
			headerLabel="Esqueceu sua senha?"
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
						Enviar email de redefinição
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}

export default ResetForm;
