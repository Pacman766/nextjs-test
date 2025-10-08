Отлично — ниже простой, понятный и **рабочий** пример авторизации в Next.js (App Router) с настоящими HTTP-Only cookies и пошаговым объяснением что и где происходит. Я покажу:

* минимальные route-handlers для `login` / `logout` / `profile` (серверные API);
* страницу входа (клиентский компонент), серверную защищённую страницу;
* опциональную `middleware` для перенаправления неавторизованных пользователей;
* потом — пошагово что происходит и важные замечания по безопасности.

> Примечание: в примерах для простоты я использую «демо-токен». В реальном приложении храните сессии безопасно (подписанные JWT / session store) и используйте HTTPS.

---

# 1) Файловая структура (микро-пример)

```
app/
  api/
    login/route.ts     -> POST (устанавливает cookie)
    logout/route.ts    -> POST (очищает cookie)
    profile/route.ts   -> GET  (возвращает данные если cookie валидна)
  login/page.tsx      -> клиентская форма входа
  dashboard/page.tsx  -> серверная защищённая страница
middleware.ts         -> (опционально) защита маршрутов
```

---

# 2) Код (коротко и прямо)

### `app/api/login/route.ts` — вход, устанавливаем `Set-Cookie`

```ts
// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // === Примитивная проверка (только для примера) ===
  if (username === 'user' && password === 'pass') {
    // В продакшне: sign JWT или создайте session id и сохраните на сервере
    const token = 'demo-signed-token-xxx';

    // Собираем Set-Cookie строку
    // Важно: для локальной разработки учтите флаг Secure (см. пояснения ниже)
    const cookie = `token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`;

    return NextResponse.json({ ok: true }, {
      status: 200,
      headers: { 'Set-Cookie': cookie }
    });
  }

  return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
}
```

### `app/api/logout/route.ts` — удаляем cookie

```ts
// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const cookie = `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  return NextResponse.json({ ok: true }, {
    status: 200,
    headers: { 'Set-Cookie': cookie }
  });
}
```

### `app/api/profile/route.ts` — пример защищённого API, читает cookie на сервере

```ts
// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // В реальности: валидируйте token (JWT verify или lookup в session store)
  return NextResponse.json({ name: 'Demo user', email: 'demo@example.com' });
}
```

### `app/login/page.tsx` — клиентская форма (доходит до `/api/login`)

```tsx
// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      // same-origin по умолчанию, но можно явно указать:
      credentials: 'same-origin'
    });

    if (res.ok) {
      // Сервер установил HttpOnly cookie — JS не видит его напрямую.
      router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="user" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="pass" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### `app/dashboard/page.tsx` — серверная страница, проверяет cookie на сервере

```tsx
// app/dashboard/page.tsx (Server Component)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const token = cookies().get('token')?.value;
  if (!token) redirect('/login'); // серверный редирект

  // Здесь можно безопасно делать server-to-server вызовы с token
  return <div>Welcome to dashboard — you are authenticated</div>;
}
```

### `middleware.ts` (опционально) — защита путей на уровне middleware

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const protectedPaths = ['/dashboard', '/profile', '/account'];

  if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

// Опционально укажите matcher, если нужно
export const config = { matcher: ['/dashboard/:path*', '/profile/:path*'] };
```

---

# 3) Пошагово — что и где происходит (важно)

1. Пользователь заполняет форму и `fetch('/api/login', { method: 'POST', ... })` из клиентского компонента.

   * Если запрос same-origin — браузер по умолчанию позволит серверу установить cookie из заголовка `Set-Cookie`. Если вы делаете кросс-доменный запрос, потребуется `credentials: 'include'` и корректная CORS-настройка на сервере. ([MDN Web Docs][1])

2. В `app/api/login/route.ts` сервер проверяет учётные данные. При успехе сервер возвращает ответ **с заголовком `Set-Cookie`**, например:

   ```
   Set-Cookie: token=...; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400
   ```

   — браузер сохраняет cookie (HttpOnly означает: JavaScript в браузере не сможет прочитать `document.cookie`). `Set-Cookie` — стандартный способ отправки cookie от сервера к браузеру. ([MDN Web Docs][2])

3. Клиент получает ответ, видит `res.ok` и делает `router.push('/dashboard')`. Клиент сам не видит токен (он HttpOnly), но браузер уже его хранит и автоматически будет отправлять cookie при последующих запросах к тому же сайту.

4. При заходе на `/dashboard` серверная страница (Server Component) выполняется на сервере. Она может прочитать cookie текущего запроса через `cookies()` из `next/headers` (серверная утилита Next.js) и принять решение Render vs Redirect (например, `redirect('/login')` если нет cookie). Это даёт надёжную защиту рендеринга. ([Next.js][3])

5. При вызове защищённого API `/api/profile` браузер автоматически прикрепит cookie в заголовке `Cookie`, сервер прочитает cookie (в route handler — через `cookies()` или `req.cookies`) и вернёт данные, если сессия валидна.

6. При logout клиент вызывает `/api/logout` — сервер возвращает `Set-Cookie` с `Max-Age=0`/expired, браузер удаляет cookie.

---

# 4) Где часто подводят и на что обратить внимание (security & gotchas)

* **HttpOnly** — защищает от XSS (скрипты не могут прочитать cookie), но не от CSRF. Если вы используете cookie для аутентификации, подумайте о CSRF-защитах (SameSite, CSRF-token для state-changing запросов).
* **SameSite** — `Strict` или `Lax` уменьшает риск CSRF; `None` позволит third-party cookies (нужен `Secure`).
* **Secure** — cookie с `Secure` будут сохраняться только по HTTPS. На localhost можно временно не ставить `Secure`, но в продакшне — обязательно.
* **Подпись/шифрование** — не храните чувствительные данные в незашифрованном виде: используйте подписанные JWT или session id + server session store.
* **Refresh tokens** — обычно используют короткоживущий access token в cookie + refresh token (хранится в httpOnly cookie или secure storage) с endpoint для обновления.
* **Лучше использовать battle-tested библиотеку** (NextAuth, Clerk, Supabase Auth и т. п.) для продакшна — уменьшает риск ошибок. Next.js сам рекомендует готовые библиотеки для большей безопасности и удобства. ([Next.js][4])

(Браузерное поведение по `fetch` + cookies и заголовкам описано в MDN: default — credentials для same-origin; для кросс-доменных запросов используйте `credentials: 'include'` и `Access-Control-Allow-Credentials: true` на сервере). ([MDN Web Docs][1])

---

# 5) Короткий чеклист при внедрении

* ✅ Используйте `HttpOnly`, `SameSite` и `Secure` в продакшне.
* ✅ Не храните пароль/личные данные в cookie. Храните session id или подписанный токен.
* ✅ При кросс-доменных запросах настройте CORS & `credentials`. ([MDN Web Docs][1])
* ✅ Защитите state-changing запросы от CSRF (или используйте SameSite=strict/lax + другие меры).
* ✅ Для продакшна рассмотрите NextAuth / внешние провайдеры. ([Next.js][4])

---

# 6) Резюме (короче)

* Сервер устанавливает cookie через `Set-Cookie` в API (route handlers). Браузер сохраняет cookie; флаг `HttpOnly` делает cookie недоступной для JS. Серверные компоненты Next.js читают cookie через `cookies()` и могут делать серверные редиректы/рендеринг на основе наличия/валидности cookie. Для защиты маршрутов можно использовать `middleware`. ([Next.js][5])

---
