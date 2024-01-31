'use client';

import { usePathname } from 'next/navigation';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import UserBtn from '@/components/auth/UserBtn';
import { DatabaseUserAttributes } from '@/server/auth';

function Navbar({ user }: { user: DatabaseUserAttributes }) {
	const pathname = usePathname();
	return (
		<div className="bg-white flex justify-between items-center p-4 rounded-xl max-w-[600px] w-[600px] shadow-sm">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/server"
						>
							Servidor
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/admin"
						>
							Admin
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						{' '}
						<Link
							className={navigationMenuTriggerStyle()}
							href="/settings"
						>
							Configurações
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<UserBtn user={user} />
		</div>
	);
}

export default Navbar;
