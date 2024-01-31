import { LockKeyhole } from 'lucide-react';
import React from 'react';

interface HeaderProps {
	label: string;
}

function Header({ label }: HeaderProps) {
	return (
		<div className="w-full flex flex-col gap-y-4 items-center justify-center">
			<div className="flex justify-center items-center gap-4">
				<h1 className=" text-3xl font-semibold">Branding</h1>
			</div>
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	);
}

export default Header;
