import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch'; // Node fetch

export const serverClient = new ApolloClient({
	ssrMode: true,
	link: new HttpLink({
		uri: 'http://localhost:3000/api/graphql', // серверный endpoint
		fetch,
	}),
	cache: new InMemoryCache(),
});
