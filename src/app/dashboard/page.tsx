'use client';

import { UsersClient } from '../components/UsersClient';

export default function DashboardPage() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
			<UsersClient />
		</main>
	);
}
