import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a placeholder for your actual authentication logic.
// In a real Firebase app, you would verify the session cookie.
const isAuthenticatedAsAdmin = (request: NextRequest): boolean => {
  // To test, you can use a query param or a hardcoded cookie value.
  // Example: return request.cookies.get('session')?.value === 'admin-secret';
  // For this demo, we are blocking access by default.
  // In production, replace this with real authentication.
  return false; 
};

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticatedAsAdmin(request)) {
      // Redirect non-admins from admin routes to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
