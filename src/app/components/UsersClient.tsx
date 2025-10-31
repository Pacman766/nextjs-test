'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const ADD_USER = gql`
	mutation ($name: String!) {
		addUser(name: $name) {
			id
			name
		}
	}
`;

const GET_USERS = gql`
	query {
		users {
			id
			name
		}
	}
`;

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
	const { data, refetch } = useQuery(GET_USERS, { fetchPolicy: 'cache-and-network' });
	const [addUser] = useMutation(ADD_USER);

	async function handleAdd() {
		const name = prompt('Enter new user name:');
		if (!name) return;
		await addUser({ variables: { name } });
		await refetch();
	}

	const users = data?.users || initialUsers;

	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold">Users</h2>
			<ul className="list-disc pl-4">
				{users.map((u: any) => (
					<li key={u.id}>{u.name}</li>
				))}
			</ul>

			<button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
				Add User
			</button>
		</section>
	);
}
