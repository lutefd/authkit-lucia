'use client';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from '@/server/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { oauthLogin } from '@/actions/oauth';

function SSOProviders() {
	const onClick = async (provider: 'google' | 'github') => {
		await oauthLogin(provider);
	};
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button
				size={'lg'}
				className="w-full"
				variant={'outline'}
				onClick={() => onClick('google')}
			>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button
				size={'lg'}
				className="w-full"
				variant={'outline'}
				onClick={() => onClick('github')}
			>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
}

export default SSOProviders;
