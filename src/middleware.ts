// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;
	const protectedPaths = ['/dashboard', '/profile', '/account'];

	if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p)) && !token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}
	return NextResponse.next();
}

// Опционально укажите matcher, если нужно
export const config = { matcher: ['/dashboard/:path*', '/profile/:path*'] };
