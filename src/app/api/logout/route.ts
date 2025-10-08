// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
	const cookie = `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	return NextResponse.json(
		{ ok: true },
		{
			status: 200,
			headers: { 'Set-Cookie': cookie },
		}
	);
}
