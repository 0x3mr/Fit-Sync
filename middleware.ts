import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // List of paths to exclude from authentication

  const { pathname } = req.nextUrl;
  const freeRoutes = ['/api/login', '/api/register', '/api/status', '/api/session', '/login', '/register', '/'];

  if (pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/public/') ||
    freeRoutes.includes(pathname)) {
    return NextResponse.next();
  }


  const res = await fetch(`${req.nextUrl.origin}/api/session`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'cookie': req.headers.get('cookie') || '',
    },
    credentials: 'include',
  });
  let code = await res.json();
  code = code.code;


  if (code) {
    const errorMessage = code === 1 ? 'Unauthorized: No session cookie found' : 'Unauthorized: session expired';
    return NextResponse.json({ err: errorMessage }, { status: 401 });
  }

  return NextResponse.next();
}
