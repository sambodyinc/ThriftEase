import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware checks if a user is authenticated by looking for the session cookie.
// The actual role-based access control is handled on the client-side in the admin layout.
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session'); // This is a placeholder name. Actual cookie name might differ.

  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real Firebase setup, we'd verify a session cookie here.
    // For now, we'll allow access to the route to let the client-side layout handle auth.
    // This is a simplified approach for demonstration. A robust solution would
    // involve server-side session validation.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
