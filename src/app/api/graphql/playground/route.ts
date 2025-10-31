import { ruruHTML } from 'ruru/server';

export async function GET() {
	return new Response(ruruHTML({ endpoint: '/api/graphql' }), {
		headers: { 'Content-Type': 'text/html' },
	});
}
