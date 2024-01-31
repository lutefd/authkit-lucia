'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
	redirect?: string;
}

export const LoginBtn = ({
	children,
	mode = 'redirect',
	asChild,
	redirect = '/auth/login',
}: LoginButtonProps) => {
	const router = useRouter();
	const handleClick = () => {
		router.push(redirect);
	};
	return (
		<span onClick={handleClick} className="cursor-pointer">
			{children}
		</span>
	);
};

export default LoginBtn;
