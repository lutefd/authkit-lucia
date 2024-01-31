import { readSession } from '@/actions/session';
import Settingsform from './_components/settings-form';
import { redirect } from 'next/navigation';

async function SettingsPage() {
	const { user, is_oauth } = await readSession()!;
	if (!user) {
		redirect('/auth/login');
	}
	return <Settingsform user={user!} is_oauth={is_oauth!} />;
}

export default SettingsPage;

export const dynamic = 'force-dynamic';
