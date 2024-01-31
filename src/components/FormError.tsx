import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface FormErrorProps {
	error?: string;
	iconSize?: string;
	flexDirection?: string;
}

function FormError({ error, iconSize, flexDirection }: FormErrorProps) {
	if (!error) return null;
	return (
		<div
			className={
				flexDirection
					? `bg-destructive/15 p-3 rounded-md  flex ${flexDirection} items-center gap-x-2 text-sm text-destructive`
					: 'bg-destructive/15 p-3 rounded-md  flex items-center gap-x-2 text-sm text-destructive'
			}
		>
			<FaExclamationTriangle
				className={iconSize ? iconSize : 'h-4 w-4'}
			/>
			<p>{error}</p>
		</div>
	);
}

export default FormError;
