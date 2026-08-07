import { supabase } from '@/lib/supabase/queries';
import { MOCK_TENANTS } from '@/lib/mockMasterAdminData';
import { TenantCompany } from '@/types/masterAdmin';

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: 'ACTIVE' | 'QUOTA_EXCEEDED' | 'SUBSCRIPTION_EXPIRED' | 'TENANT_NOT_FOUND';
  currentUsage: number;
  maxAllowed: number;
  remainingQuota: number;
  requestedCount: number;
  planType: string;
  message: string;
}

/**
 * Validates whether an organization has sufficient SaaS quota to process requested items.
 */
export async function checkOrganizationQuota(
  orgId: string = 'tenant-101',
  requestedItemsCount: number = 1
): Promise<QuotaCheckResult> {
  // 1. Attempt to query Supabase subscriptions table
  try {
    const { data: sub, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', orgId)
      .single();

    if (!error && sub) {
      if (sub.status !== 'ACTIVE') {
        return {
          allowed: false,
          reason: 'SUBSCRIPTION_EXPIRED',
          currentUsage: sub.monthly_items_processed || 0,
          maxAllowed: sub.max_items_allowed || 0,
          remainingQuota: 0,
          requestedCount: requestedItemsCount,
          planType: sub.plan_type || 'PRO',
          message: `L'abonnement de votre entreprise est inactif ou suspendu (Statut: ${sub.status}). Veuillez contacter l'administrateur SaaS.`,
        };
      }

      const currentUsage = sub.monthly_items_processed || 0;
      const maxAllowed = sub.max_items_allowed || 25000;
      const remainingQuota = Math.max(0, maxAllowed - currentUsage);

      if (currentUsage + requestedItemsCount > maxAllowed) {
        return {
          allowed: false,
          reason: 'QUOTA_EXCEEDED',
          currentUsage,
          maxAllowed,
          remainingQuota,
          requestedCount: requestedItemsCount,
          planType: sub.plan_type || 'PRO',
          message: `Dépassement du quota souscrit (${currentUsage.toLocaleString()} / ${maxAllowed.toLocaleString()} items). L'import de ${requestedItemsCount} items dépasse la limite mensuelle de votre forfait ${sub.plan_type}.`,
        };
      }

      return {
        allowed: true,
        reason: 'ACTIVE',
        currentUsage,
        maxAllowed,
        remainingQuota,
        requestedCount: requestedItemsCount,
        planType: sub.plan_type || 'PRO',
        message: 'Quota valide. Importation autorisée.',
      };
    }
  } catch (e) {
    console.warn('[QuotaService] Supabase query fallback to mock tenant data');
  }

  // 2. Fallback to Mock Tenant Data if Supabase table isn't seeded yet
  const tenant = MOCK_TENANTS.find((t) => t.id === orgId || t.company_name.toLowerCase().includes('logistics')) || MOCK_TENANTS[0];

  if (tenant.status !== 'ACTIVE') {
    return {
      allowed: false,
      reason: 'SUBSCRIPTION_EXPIRED',
      currentUsage: tenant.monthly_items_processed,
      maxAllowed: tenant.max_items_allowed,
      remainingQuota: 0,
      requestedCount: requestedItemsCount,
      planType: tenant.plan_type,
      message: `L'abonnement de ${tenant.company_name} est suspendu. Veuillez passer au plan supérieur auprès du Master Admin.`,
    };
  }

  const currentUsage = tenant.monthly_items_processed;
  const maxAllowed = tenant.max_items_allowed;
  const remainingQuota = Math.max(0, maxAllowed - currentUsage);

  if (currentUsage + requestedItemsCount > maxAllowed) {
    return {
      allowed: false,
      reason: 'QUOTA_EXCEEDED',
      currentUsage,
      maxAllowed,
      remainingQuota,
      requestedCount: requestedItemsCount,
      planType: tenant.plan_type,
      message: `Quota d'items dépassé ! Vous tentez d'importer ${requestedItemsCount.toLocaleString()} items alors qu'il vous reste ${remainingQuota.toLocaleString()} items sur votre forfait ${tenant.plan_type}.`,
    };
  }

  return {
    allowed: true,
    reason: 'ACTIVE',
    currentUsage,
    maxAllowed,
    remainingQuota,
    requestedCount: requestedItemsCount,
    planType: tenant.plan_type,
    message: 'Quota d\'items disponible. Continuer l\'importation.',
  };
}

/**
 * Record processed items and update tenant quota count
 */
export async function recordProcessedItems(orgId: string = 'tenant-101', count: number) {
  try {
    await supabase.rpc('increment_monthly_items', { p_org_id: orgId, p_count: count });
  } catch (e) {
    const tenant = MOCK_TENANTS.find((t) => t.id === orgId) || MOCK_TENANTS[0];
    tenant.monthly_items_processed += count;
  }
}
