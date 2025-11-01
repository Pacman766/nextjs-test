import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
	const cookieStore = cookies();
	const hasSession = (await cookieStore).has('session');

	if (!hasSession) {
		redirect('/login');
	}

	redirect('/dashboard');
}
