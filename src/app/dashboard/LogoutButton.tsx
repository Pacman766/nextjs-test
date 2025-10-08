'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function handleLogout() {
		setLoading(true);
		const res = await fetch('/api/logout', {
			method: 'POST',
			credentials: 'same-origin',
		});

		setLoading(false);

		if (res.ok) {
			router.push('/login'); // после logout перенаправляем на страницу логина
		} else {
			alert('Logout failed');
		}
	}

	return (
		<button
			onClick={handleLogout}
			disabled={loading}
			style={{
				marginTop: 20,
				padding: '8px 16px',
				borderRadius: 8,
				border: '1px solid #ccc',
				backgroundColor: '#f5f5f5',
				cursor: 'pointer',
				color: '#333',
			}}
		>
			{loading ? 'Logging out...' : 'Logout'}
		</button>
	);
}
