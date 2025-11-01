// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { username, password } = await req.json();

	// === Примитивная проверка (только для примера) ===
	if (username === '111' && password === '111') {
		// В продакшне: sign JWT или создайте session id и сохраните на сервере
		const token = 'demo-signed-token-xxx';

		// Собираем Set-Cookie строку
		// Важно: для локальной разработки учтите флаг Secure (см. пояснения ниже)
		const cookie = `token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`;

		return NextResponse.json(
			{ ok: true },
			{
				status: 200,
				headers: { 'Set-Cookie': cookie },
			}
		);
	}

	return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
}
