import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const AUTH_REQUIRED_PATHS = new Set(['/mywatchlist', '/friends', '/profile', '/forum', '/forum/threads']);
const PUBLIC_ONLY_PATHS = new Set(['/signin', '/signup']);
const HOME_PATH = '/';
const SIGNIN_PATH = '/signin';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const refreshToken = request.cookies.get('refresh_token');
  const url = request.nextUrl.clone();

  if (Array.from(AUTH_REQUIRED_PATHS).some((path) => url.pathname.startsWith(path))) {
    if (!token) {
      if (refreshToken) {
        url.pathname = HOME_PATH;
      } else {
        url.pathname = SIGNIN_PATH;
      }
      return NextResponse.redirect(url);
    }
  }

  if (PUBLIC_ONLY_PATHS.has(url.pathname) && token) {
    url.pathname = HOME_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/mywatchlist', '/friends', '/profile', '/forum/:path*'],
};
