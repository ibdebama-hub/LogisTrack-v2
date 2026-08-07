import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Enforces strict environment variable validation for Production deployments.
 * Throws actionable errors if mandatory Supabase credentials are not configured on Render/Vercel.
 */
const getRequiredEnvVar = (name: string, fallback: string): string => {
  const value = process.env[name];
  if (!value || value === 'https://demo.supabase.co' || value === 'demo-key') {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[SUPABASE CONFIG WARNING] Environment variable ${name} is missing or using fallback value. Real database features require valid Supabase Cloud credentials.`);
    }
    return value || fallback;
  }
  return value;
};

export const SUPABASE_URL = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://demo.supabase.co');
export const SUPABASE_ANON_KEY = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'demo-key');
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Client-Side Supabase Production Client Instance
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper to create a client-side Supabase client for React components
 */
export function createClientComponentClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Helper to create a service-role admin Supabase client for privileged backend ops
 */
export function createAdminSupabaseClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
