import ErrorCard from '@/components/auth/ErrorCard';
import React from 'react';

function AuthErrorPage({
	searchParams,
}: {
	searchParams: {
		error: string;
	};
}) {
	return <ErrorCard error={searchParams.error} />;
}

export default AuthErrorPage;
