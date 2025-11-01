import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { name, email } = await req.json();
	console.log('New user:', name, email);

	return NextResponse.json({ success: true, message: 'User created' });
}
