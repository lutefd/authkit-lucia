'use client';
import UserInfo from '@/components/UserInfo';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import React from 'react';

function ServerPage() {
	const user = useCurrentUser();
	return <UserInfo user={user} label="Client Page" />;
}

export default ServerPage;
