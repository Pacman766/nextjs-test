// app/page.tsx (Server Component)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
	const token = (await cookies()).get('token')?.value;

	// Если пользователь уже авторизован → ведём в /dashboard
	if (token) {
		redirect('/dashboard');
	}

	// Если нет токена → перенаправляем на /login
	redirect('/login');
}
