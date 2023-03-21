import { NextResponse, NextFetchEvent } from 'next/server';

export default async function middleware(req) {
  const cookie = req.cookies.get('accessToken')?.value;
  // const currentUrl = req.nextUrl?.pathname;
  // console.log(req.headers.get('referer'));
  if (cookie === undefined) {
    return NextResponse.redirect(new URL('/account/login', req.url));
  }
  // event.waitUntil(
  //   fetch('https://my-analytics-platform.com', {
  //     method: 'POST',
  //     body: JSON.stringify({ pathname: req.nextUrl.pathname })
  //   })
  // );

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/artworks/new',
    '/api/auth/logout'
    // '/account/my-profile',
    // '/about/:path*',
    // '/dashboard/:path*'
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
