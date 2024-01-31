import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { DatabaseUserAttributes } from '@/server/auth';

interface UserInfoProps {
	user: DatabaseUserAttributes | null;
	label: string;
}

function UserInfo({ user, label }: UserInfoProps) {
	return (
		<Card className="w-[600px] shadow-md">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">{label}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">ID</p>
					<div className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
						{user?.id}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">Name</p>
					<div className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
						{user?.name}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">Email</p>
					<div className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
						{user?.email}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">Role</p>
					<div className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
						{user?.role}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">2FA</p>
					<div className="truncate text-sm max-w-[180px]  rounded-md">
						<Badge
							variant={
								user?.two_factor_method == 'NONE' ||
								!user?.two_factor_method
									? 'destructive'
									: 'success'
							}
						>
							{' '}
							{user?.two_factor_method == 'NONE' ||
							!user?.two_factor_method
								? 'OFF'
								: user?.two_factor_method}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default UserInfo;
