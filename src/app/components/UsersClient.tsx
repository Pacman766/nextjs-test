'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

interface User {
	id: string;
	name: string;
	email: string;
}

interface GetUsersData {
	users: User[];
}
import { useState } from 'react';

const ADD_USER = gql`
	mutation AddUser($name: String!, $email: String!) {
		addUser(name: $name, email: $email) {
			id
			name
			email
		}
	}
`;

interface AddUserData {
	addUser: User;
}

const GET_USERS = gql`
	query GetUsers {
		users {
			id
			name
			email
		}
	}
`;

export function UsersClient() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const { data, loading, error, refetch } = useQuery<GetUsersData>(GET_USERS);
	const [addUserMutation] = useMutation<AddUserData, { name: string; email: string }>(ADD_USER, {
		update(cache, { data }) {
			if (!data || !data.addUser) return;
			const existingUsers = cache.readQuery<GetUsersData>({
				query: GET_USERS,
			});
			if (existingUsers && data.addUser) {
				cache.writeQuery<GetUsersData>({
					query: GET_USERS,
					data: { users: [...existingUsers.users, data.addUser] },
				});
			}
		},
		onCompleted: () => {
			setMessage('✅ User added successfully');
			setName('');
			setEmail('');
			setTimeout(() => setMessage(''), 1000); // Clear message after 3 seconds
		},
		onError: (err: any) => {
			setMessage(`❌ Failed to add user: ${err.message}`);
		},
	});

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		await addUserMutation({ variables: { name, email } });
	};

	if (loading) return <p>Loading users...</p>;
	if (error) return <p>Error loading users: {error.message}</p>;

	const users = (data as GetUsersData)?.users || [];

	return (
		<div className="space-y-8">
			<div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
				<h2 className="text-2xl font-semibold mb-4 text-center">Add User (GraphQL)</h2>
				<form onSubmit={handleAddUser} className="flex flex-col gap-4">
					<input
						className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="User name"
						required
					/>
					<input
						className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
					/>
					<button
						type="submit"
						className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition-all"
					>
						Add User
					</button>
				</form>
				{message && <p className="mt-4 text-sm text-amber-400 text-center">{message}</p>}
			</div>

			<div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
				<h2 className="text-2xl font-semibold mb-4 text-center">Users List (GraphQL)</h2>
				{users.length === 0 ? (
					<p className="text-gray-400 text-center">No users found.</p>
				) : (
					<ul className="list-disc list-inside text-gray-300 max-h-60 overflow-y-auto">
						{users.map((user: any) => (
							<li key={user.id}>{user.name} ({user.email})</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}