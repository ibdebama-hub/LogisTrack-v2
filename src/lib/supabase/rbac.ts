import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from '../../middleware';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './client';

export interface UserAuthContext {
  userId: string | null;
  role: UserRole;
  organizationId: string | null;
  clientId: string | null;
  email: string | null;
}

/**
 * Creates a server-side Supabase client initialized with authorization headers or cookies.
 */
export function createServerComponentClient(): SupabaseClient {
  const cookieStore = cookies();
  const token = cookieStore.get('sb-access-token')?.value || '';

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });
}

/**
 * Creates a client-side Supabase client for React components.
 */
export function createClientComponentClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Server-side RBAC Context Extractor: Retrieves user identity, role, tenant org_id, and B2B client_id.
 */
export async function getAuthContextServer(): Promise<UserAuthContext> {
  const cookieStore = cookies();
  const headerList = headers();

  const roleFromCookie = cookieStore.get('user_role')?.value as UserRole | undefined;
  const roleFromHeader = headerList.get('x-user-role') as UserRole | null;
  const activeRole: UserRole = roleFromCookie || roleFromHeader || 'DISPATCHER';

  const supabase = createServerComponentClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    return {
      userId: null,
      role: activeRole,
      organizationId: 'tenant-101',
      clientId: activeRole === 'CLIENT_B2B' ? 'cli-orange' : null,
      email: activeRole === 'CLIENT_B2B' ? 'contact@orange-guinee.gn' : 'dispatcher@logistics-wa.gn',
    };
  }

  // Fetch database profile for authoritative role & tenant ids
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_id, client_id, email')
    .eq('id', user.id)
    .single();

  return {
    userId: user.id,
    role: (profile?.role as UserRole) || activeRole,
    organizationId: profile?.organization_id || 'tenant-101',
    clientId: profile?.client_id || (activeRole === 'CLIENT_B2B' ? 'cli-orange' : null),
    email: profile?.email || user.email || null,
  };
}

/**
 * Enforces role-based access control (RBAC) guard in Next.js Server Components.
 * Redirects to role home or login page if permission is denied.
 */
export async function requireServerRole(allowedRoles: UserRole[]): Promise<UserAuthContext> {
  const context = await getAuthContextServer();

  if (!allowedRoles.includes(context.role)) {
    console.warn(`[RBAC GUARD] Access denied for role: ${context.role}. Required:`, allowedRoles);
    
    switch (context.role) {
      case 'super_admin':
      case 'SUPER_ADMIN':
        redirect('/master-admin/overview');
      case 'client_admin':
      case 'CLIENT_B2B':
        redirect('/client-portal/overview');
      case 'field_agent':
      case 'FIELD_AGENT':
        redirect('/dispatch');
      case 'dispatcher':
      case 'DISPATCHER':
      default:
        redirect('/overview');
    }
  }

  return context;
}
