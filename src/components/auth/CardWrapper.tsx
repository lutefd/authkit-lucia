import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Header from './Header';
import SSOProviders from './SSOProviders';
import BackButton from './BackButton';

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSSO?: boolean;
}

function CardWrapper({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSSO,
}: CardWrapperProps) {
	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>

			{showSSO && (
				<CardFooter>
					<SSOProviders />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
}

export default CardWrapper;
