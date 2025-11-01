'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		checkLoginStatus();
	}, [pathname]); // Re-run effect when pathname changes

	const checkLoginStatus = async () => {
		const res = await fetch('/api/profile');
		setIsLoggedIn(res.ok);
	};

	const handleLogout = async () => {
		await fetch('/api/logout', { method: 'POST' });
		setIsLoggedIn(false); // Update state immediately
		router.push('/login');
	};

	return (
		<header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 w-full z-10">
			<Link href="/" className="text-xl font-bold">
				Next.js App
			</Link>
			<nav>
				{isLoggedIn ? (
					<button
						onClick={handleLogout}
						className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
					>
						Logout
					</button>
				) : (
					<Link
						href="/login"
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
					>
						Login
					</Link>
				)}
			</nav>
		</header>
	);
}