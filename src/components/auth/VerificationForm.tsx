'use client';
import React, { useCallback, useEffect, useState } from 'react';
import CardWrapper from './CardWrapper';
import { useSearchParams } from 'next/navigation';
import { verificateToken } from '@/actions/verification';
import { set } from 'zod';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';

function VerificationForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const onSubmit = useCallback(async () => {
		if (success || error) return;
		if (!token) {
			setError('Token não encontrado');
			return;
		}
		await verificateToken(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch((error) => {
				setError('Erro ao verificar token');
			});
	}, [token, success, error]);
	useEffect(() => {
		onSubmit();
	}, [onSubmit]);
	return (
		<CardWrapper
			headerLabel="Confirmando seu cadastro"
			backButtonHref="/auth/login"
			backButtonLabel="Voltar para o login"
		>
			<div className="flex items-center w-full justify-center flex-col gap-8">
				{!success && !error && (
					<div className="flex items-center justify-center space-x-2">
						<div className="w-4 h-4 rounded-full animate-pulse bg-purple-800"></div>
						<div className="w-4 h-4 rounded-full animate-pulse bg-purple-800 delay-150"></div>
						<div className="w-4 h-4 rounded-full animate-pulse bg-purple-800 delay-200"></div>
					</div>
				)}
				<FormSuccess success={success} />
				{!success && <FormError error={error} />}
			</div>
		</CardWrapper>
	);
}

export default VerificationForm;
