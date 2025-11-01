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
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
			<div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
				<h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="user"
						required
					/>
					<input
						className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="pass"
						required
					/>
					<button
						type="submit"
						className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition-all"
					>
						Login
					</button>
				</form>
			</div>
		</main>
	);
}
