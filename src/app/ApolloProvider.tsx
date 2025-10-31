'use client';

import React from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider as Provider } from '@apollo/client/react';

const client = new ApolloClient({
	link: new HttpLink({ uri: '/api/graphql' }),
	cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
	return <Provider client={client}>{children}</Provider>;
}