import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// For local development, Supabase is optional
const isSupabaseConfigured = supabaseUrl && supabaseServiceKey;

// Server-side Supabase client (uses service key)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Client-side Supabase client (for mobile app)
export function createSupabaseClient(accessToken?: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }
  
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseAnonKey) {
    throw new Error('Missing Supabase anon key');
  }

  const client = createClient(supabaseUrl!, supabaseAnonKey, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    } as any);
  }

  return client;
}

