import { readSession } from '@/actions/session';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { validateRequest } from '@/server/auth';
import { redirect } from 'next/navigation';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const { user, session } = await validateRequest();

	if (user) {
		redirect(DEFAULT_LOGIN_REDIRECT);
	}
	if (session) {
		redirect(DEFAULT_LOGIN_REDIRECT);
	}
	return (
		<div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 to bg-purple-800">
			{children}
		</div>
	);
};

export default AuthLayout;
