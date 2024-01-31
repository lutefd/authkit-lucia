import UserInfo from '@/components/UserInfo';
import { currentUserServer } from '@/lib/user';
import React from 'react';

async function ServerPage() {
	const user = await currentUserServer();
	return <UserInfo user={user} label="Server Page" />;
}

export default ServerPage;
