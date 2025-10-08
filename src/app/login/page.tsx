// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const res = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
			// same-origin по умолчанию, но можно явно указать:
			credentials: 'same-origin',
		});

		if (res.ok) {
			// Сервер установил HttpOnly cookie — JS не видит его напрямую.
			router.push('/dashboard');
		} else {
			alert('Login failed');
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user" />
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="pass" />
			<button type="submit">Login</button>
		</form>
	);
}
