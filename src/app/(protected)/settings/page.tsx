'use client';
import { settings } from '@/actions/settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SettingsSchema } from '@/schemas';
import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormSuccess from '@/components/FormSuccess';
import FormError from '@/components/FormError';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import QRCode from 'qrcode';
import FormAlert from '@/components/FormMessage';
import { verifyTOTPInConfig } from '@/actions/totp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function SettingsPage() {
	const { update, data } = useSession();
	const router = useRouter();
	const user = data?.user;
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [uri, setUri] = useState<string | undefined>();
	const [twoFactor, setTwoFactor] = useState<string | undefined>();
	const [message, setMessage] = useState<string | undefined>();

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((res) => {
					if (res.error) {
						setError(res.error);
					}
					if (res.success) {
						setSuccess(res.success);
						router.refresh();
						update();
					}
					if (res.twoFactor) {
						setMessage(res.message);
						QRCode.toDataURL(res.uri).then((val) => setUri(val));
						setShowTwoFactor(true);
					}
				})
				.catch((err) => {
					setError('Ocorreu um erro ao atualizar as configurações.');
				});
		});
	};
	const onValidate = () => {
		startTransition(() => {
			if (!twoFactor) return;
			verifyTOTPInConfig(twoFactor, user?.id!).then((res) => {
				if (res?.error) {
					toast.error(res.error);
				}
				if (res?.success) {
					toast.success(res.success);
					setShowTwoFactor(false);
				}
			});
		});
	};
	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: (user?.role as 'ADMIN' | 'USER') || undefined,
			two_factor_method:
				(user?.twoFactorMethod as 'EMAIL' | 'AUTHENTICATOR' | 'NONE') ||
				undefined,
		},
	});

	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">
					{showTwoFactor
						? 'Configurar Autenticador'
						: 'Configurações'}
				</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-6"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						{showTwoFactor && (
							<div className="space-y-6">
								<FormAlert message={message} />
								<div className="w-full flex justify-center items-center">
									<img src={uri} />
								</div>

								<Input
									type="text"
									placeholder="000000"
									required
									disabled={isPending}
									onChange={(e) =>
										setTwoFactor(e.target.value)
									}
								/>
								<div className="flex gap-x-6 items-center">
									<Button type="button" onClick={onValidate}>
										Validar
									</Button>
									<Button
										type="button"
										variant={'link'}
										onClick={() => {
											form.resetField(
												'two_factor_method'
											);
											setShowTwoFactor(false);
										}}
									>
										Voltar
									</Button>
								</div>
							</div>
						)}
						{!showTwoFactor && (
							<>
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
														placeholder={
															user?.name
																? user.name
																: 'nome'
														}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{!user?.isOauth && (
										<>
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Email
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder={
																	user?.email
																		? user.email
																		: 'email'
																}
																disabled={
																	isPending
																}
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
														<FormLabel>
															Senha
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																type="password"
																placeholder="********"
																disabled={
																	isPending
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="newPassword"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Nova Senha
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																type="password"
																placeholder="********"
																disabled={
																	isPending
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									)}
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Papel</FormLabel>
												<Select
													disabled={isPending}
													onValueChange={
														field.onChange
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecione um papel" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem
															value={'ADMIN'}
														>
															Administrador
														</SelectItem>
														<SelectItem
															value={'USER'}
														>
															Usuário
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									{!user?.isOauth && (
										<FormField
											control={form.control}
											name="two_factor_method"
											render={({ field }) => (
												<FormItem>
													<FormLabel>2FA</FormLabel>
													<Select
														disabled={isPending}
														onValueChange={
															field.onChange
														}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Selecione um metodo de 2FA" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem
																value={'EMAIL'}
															>
																Email
															</SelectItem>
															<SelectItem
																value={
																	'AUTHENTICATOR'
																}
															>
																Autenticador
															</SelectItem>
															<SelectItem
																value={'NONE'}
															>
																Nenhum
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</div>
								<FormSuccess success={success} />
								<FormError error={error} />
								<Button type="submit" disabled={isPending}>
									{' '}
									Atualizar{' '}
								</Button>
							</>
						)}
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default SettingsPage;
