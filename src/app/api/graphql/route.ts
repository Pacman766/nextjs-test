import { buildSchema, graphql } from 'graphql';
import { NextRequest, NextResponse } from 'next/server';

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
	email: String
  }

  type Query {
    hello: String
    users: [User]
  }

  type Mutation {
    addUser(name: String! email: String!): User
  }
`);

const users = [
	{ id: 1, name: 'Alice', email: 'alice@example' },
	{ id: 2, name: 'Bob', email: 'bob@example' },
];

const root = {
	hello: () => 'Hello from GraphQL inside Next.js 👋',
	users: () => users,
	addUser: ({ name, email }: { name: string, email: string }) => {
		const user = { id: users.length + 1, name, email };
		users.push(user);
		return user;
	},
};

export async function POST(req: NextRequest) {
	try {
		const { query, variables } = await req.json();
		const response = await graphql({
			schema,
			source: query,
			rootValue: root,
			variableValues: variables,
		});
		return NextResponse.json(response);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: (err as Error).message }, { status: 500 });
	}
}
