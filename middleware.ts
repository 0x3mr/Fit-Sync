import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
// import { isValidSession } from './app/models/User';

export async function middleware(req: NextRequest) {
  // const code = await isValidSession(req);
  const code = 0;
  const { pathname } = req.nextUrl;

  // List of paths to exclude from authentication
  const freeRoutes = ['/api/login', '/api/status'];

  if (freeRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (code) {
    const errorMessage = code === 1 ? 'Unauthorized: No session cookie found' : 'Unauthorized: session expired';
    return NextResponse.json({ err: errorMessage }, { status: 401 });
  }

  return NextResponse.next();
}
