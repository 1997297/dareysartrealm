import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/supabase';
import { isSupabaseConfigured } from './client';

/**
 * Validates internal redirect paths to prevent Open Redirect vulnerabilities.
 */
export function sanitizeRedirectPath(path: string | null | undefined, fallback: string = '/account'): string {
  if (!path) return fallback;
  const trimmed = path.trim();
  // Must start with a single slash, not double slashes (protocol-relative), not backslashes
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  // Disallow protocols like http:, https:, javascript:, data:
  if (trimmed.includes(':')) {
    return fallback;
  }
  return trimmed;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isSupabaseConfigured()) {
    // If Supabase is unconfigured in development, proceed without route interception
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // getUser() sends a request to the Supabase Auth server and validates the user token
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Collector Area Protection: /account/*
  if (pathname.startsWith('/account')) {
    // Allow password reset page if visiting with a recovery token or auth session
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', sanitizeRedirectPath(pathname));
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Studio Area Protection: /studio/*
  if (pathname.startsWith('/studio')) {
    // Step A: Must be authenticated
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', sanitizeRedirectPath(pathname));
      return NextResponse.redirect(loginUrl);
    }

    // Step B: Must have 'admin' role in database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin' || profile.status !== 'active') {
      // Forbidden: redirect to collector account with an unauthorized notification
      const accountUrl = new URL('/account', request.url);
      accountUrl.searchParams.set('denied', 'studio');
      return NextResponse.redirect(accountUrl);
    }
  }

  // 3. Auth pages (login/register): if already authenticated, redirect to /account
  if ((pathname === '/login' || pathname === '/register') && user) {
    const nextPath = sanitizeRedirectPath(request.nextUrl.searchParams.get('next'), '/account');
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return response;
}
