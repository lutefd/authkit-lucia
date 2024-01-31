'use client';
import { currentRole } from '@/lib/user';
import FormError from '../FormError';

interface RoleGateProps {
	children: React.ReactNode;
	allowedRole: 'ADMIN' | 'USER' | null | string;
	role: string;
}

export const RoleGate = ({ children, allowedRole, role }: RoleGateProps) => {
	if (role === allowedRole) {
		return <>{children}</>;
	} else {
		return (
			<FormError error="Você não tem permissão para acessar esse conteúdo" />
		);
	}
};
