import { readSession } from '@/actions/session';
import AdminView from '@/components/AdminView';

import React from 'react';

async function AdminPage() {
	const { user } = await readSession();
	return <AdminView user={user} />;
}

export default AdminPage;
