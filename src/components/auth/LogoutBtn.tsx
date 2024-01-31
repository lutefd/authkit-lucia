import { logout } from '@/actions/logout';
import React from 'react';

interface LogoutBtnProps {
	children: React.ReactNode;
}

function LogoutBtn({ children }: LogoutBtnProps) {
	const onClick = () => {
		logout();
	};
	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	);
}

export default LogoutBtn;
