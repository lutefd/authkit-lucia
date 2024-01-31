import { buttonVariants } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function SSOProviders() {
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
			<Link
				href={`/api/auth/github`}
				className={cn(
					buttonVariants({
						variant: 'outline',
						size: 'lg',
					}),
					'w-full'
				)}
			>
				<FaGithub className="h-5 w-5" />
			</Link>
		</div>
	);
}

export default SSOProviders;
