// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
	const token = (await cookies()).get('token')?.value;
	if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

	// В реальности: валидируйте token (JWT verify или lookup в session store)
	return NextResponse.json({ name: 'Demo user', email: 'demo@example.com' });
}
