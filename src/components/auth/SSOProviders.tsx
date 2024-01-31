'use client';
import { Button, buttonVariants } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function SSOProviders() {
	const router = useRouter();
	const onClick = async (provider: 'google' | 'github') => {
		console.log('provider', provider);
	};
	return (
		<div className="flex items-center w-full gap-x-2">
			<Link
				href={`/api/auth/google`}
				className={cn(
					buttonVariants({
						variant: 'outline',
						size: 'lg',
					}),
					'w-full'
				)}
			>
				<FcGoogle className="h-5 w-5" />
			</Link>
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
