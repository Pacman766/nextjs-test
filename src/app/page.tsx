import { gql } from '@apollo/client/core';
import { UsersClient } from './components/UsersClient';
import { serverClient } from '@/lib/apolloClientServer';

const GET_USERS = gql`
	query {
		users {
			id
			name
		}
		hello
	}
`;

export default async function HomePage() {
	const { data } = await serverClient.query({ query: GET_USERS });

	return (
		<main className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Next.js + Apollo SSR + CSR 🔥</h1>
			<p>{data.hello}</p>

			{/* Данные с сервера + интерактив на клиенте */}
			<UsersClient initialUsers={data.users} />
		</main>
	);
}
