import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { redirect } from 'next/navigation';
import Navbar from './_components/Navbar';
import { readSession } from '@/actions/session';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await readSession();
	if (!session.user) {
		redirect('/auth/login');
	}
	return (
		<div className="h-full w-full flex flex-col gap-y-10 items-center justify-center  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 to bg-purple-800">
			<Navbar user={session.user!} />
			{children}
		</div>
	);
};

export default AuthLayout;
