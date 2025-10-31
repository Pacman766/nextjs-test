// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function DashboardPage() {
	const token = (await cookies()).get('token')?.value;
	if (!token) redirect('/login');

	// Здесь можно запросить данные пользователя с /api/profile, если нужно
	return (
		<main style={{ padding: 24 }}>
			<h1>Welcome to Dashboard 🎉</h1>
			<p>You are successfully authenticated.</p>
			<LogoutButton />
		</main>
	);
}
