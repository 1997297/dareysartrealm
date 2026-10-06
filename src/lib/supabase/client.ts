import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

export function createClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!isSupabaseConfigured()) {
    // Return dummy browser client during builds or when environment is unconfigured
    browserClient = createBrowserClient<Database>(
      url || 'https://unconfigured.supabase.co',
      anonKey || 'unconfigured-anon-key'
    );
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
