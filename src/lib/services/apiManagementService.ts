import { ApiKeyItem } from '@/types/saasPlatform';

export const MOCK_API_KEYS: ApiKeyItem[] = [
  {
    id: 'k-1',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa',
    key_name: 'Production ERP Connector Key',
    masked_key: 'lgt_live_pk_9928...4a91',
    rate_limit_per_min: 500,
    is_active: true,
    last_used_at: 'Il y a 2 min',
    created_at: '2026-03-10'
  },
  {
    id: 'k-2',
    tenant_id: 'tenant-101',
    tenant_name: 'Logistics West Africa',
    key_name: 'E-Commerce Staging Key',
    masked_key: 'lgt_test_pk_1102...88b2',
    rate_limit_per_min: 120,
    is_active: true,
    last_used_at: 'Hier',
    created_at: '2026-05-18'
  }
];

export function generateNewApiKey(tenantId: string, keyName: string): ApiKeyItem {
  const randomKey = `lgt_live_pk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
  return {
    id: `k-${Date.now()}`,
    tenant_id: tenantId,
    tenant_name: 'Logistics West Africa',
    key_name: keyName,
    masked_key: `${randomKey.substring(0, 15)}...${randomKey.substring(randomKey.length - 4)}`,
    rate_limit_per_min: 250,
    is_active: true,
    created_at: new Date().toISOString().split('T')[0]
  };
}
