'use client';
import React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LogoutBtn from './LogoutBtn';
import { LogOut } from 'lucide-react';
import { logout } from '@/actions/logout';
function UserBtn() {
	const user = useCurrentUser();
	const onClick = () => {
		logout();
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image ?? ''} />
					<AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 to bg-purple-800">
						<FaUser className="text-white" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="end">
				<DropdownMenuItem onClick={onClick}>
					<LogOut className="w-4 h-4 mr-2" />
					<LogoutBtn>Sair</LogoutBtn>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserBtn;
