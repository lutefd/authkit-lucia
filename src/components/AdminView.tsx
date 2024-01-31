'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { currentRole } from '@/lib/user';
import { RoleGate } from './auth/RoleGate';
import { Button } from './ui/button';
import { useCurrentRole } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';
import { adminDemo } from '@/actions/admin-demo';
import FormSuccess from './FormSuccess';

function AdminView() {
	const onApiRouteClick = () => {
		fetch('/api/admin').then((res) => {
			if (res.ok) {
				toast.success('Você tem permissão para acessar essa rota');
			} else {
				toast.error('Você não tem permissão para acessar essa rota');
			}
		});
	};
	const onServerActionClick = () => {
		adminDemo().then((res) => {
			if (res.success) {
				toast.success(res.success);
			}
			if (res.error) {
				toast.error(res.error);
			}
		});
	};
	return (
		<Card className="w-[600px] shadow-md">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole="ADMIN">
					<FormSuccess success="Você pode visualizar esse conteúdo" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">
						Rota de API disponível apenas para administradores
					</p>
					<Button onClick={onApiRouteClick}>
						Clique para testar
					</Button>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">
						Server Action disponível apenas para administradores
					</p>
					<Button onClick={onServerActionClick}>
						Clique para testar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default AdminView;
