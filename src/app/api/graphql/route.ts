import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

// ——— СХЕМА ———
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
  }

  type Query {
    hello: String
    users: [User]
  }

  type Mutation {
    addUser(name: String!): User
  }
`);

// ——— ДАННЫЕ ———
const users = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
];

// ——— РЕЗОЛВЕРЫ ———
const root = {
	hello: () => 'Hello from GraphQL inside Next.js 👋',
	users: () => users,
	addUser: ({ name }: { name: string }) => {
		const user = { id: users.length + 1, name };
		users.push(user);
		return user;
	},
};

// ——— HTTP HANDLER ———
export const { GET, POST } = createHandler({
	schema,
	rootValue: root,
});

// ——— Встроенный playground (GraphiQL аналог) ———
export async function GET_playground() {
	return new Response(ruruHTML({ endpoint: '/api/graphql' }), {
		headers: { 'Content-Type': 'text/html' },
	});
}
