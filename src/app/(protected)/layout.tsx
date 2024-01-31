import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import SessionProvider from '@/components/providers/SessionProvider';
import Navbar from './_components/Navbar';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session) {
		redirect('/auth/login');
	}
	return (
		<SessionProvider session={session}>
			<div className="h-full w-full flex flex-col gap-y-10 items-center justify-center  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 to bg-purple-800">
				<Navbar />
				{children}
			</div>
		</SessionProvider>
	);
};

export default AuthLayout;
