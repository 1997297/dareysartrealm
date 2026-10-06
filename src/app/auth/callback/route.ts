import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeRedirectPath } from '@/lib/supabase/middleware';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const type = requestUrl.searchParams.get('type');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If recovery type, direct the patron to set a new password
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/account/reset-password', requestUrl.origin));
      }
      const destination = sanitizeRedirectPath(next, '/account');
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  // Return the user to an error page or login with an error flag
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin));
}
