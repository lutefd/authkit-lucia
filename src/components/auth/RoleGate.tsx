'use client';
import { currentRole } from '@/lib/user';
import FormError from '../FormError';
import { useCurrentRole } from '@/hooks/useCurrentUser';

interface RoleGateProps {
	children: React.ReactNode;
	allowedRole: 'ADMIN' | 'USER' | null | string;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
	const role = useCurrentRole();

	if (role === allowedRole) {
		return <>{children}</>;
	} else {
		return (
			<FormError error="Você não tem permissão para acessar esse conteúdo" />
		);
	}
};
