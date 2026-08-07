import { FeatureFlagItem } from '@/types/saasPlatform';

export const DEFAULT_FEATURE_FLAGS: FeatureFlagItem[] = [
  { id: 'f-1', feature_key: 'MODULE_POD', feature_label: 'Proof of Delivery (POD) Enterprise', is_enabled: true },
  { id: 'f-2', feature_key: 'MODULE_COD', feature_label: 'Cash On Delivery (COD) & Cash Reconciliation', is_enabled: true },
  { id: 'f-3', feature_key: 'MODULE_BI', feature_label: 'Business Intelligence & Scorecards', is_enabled: true },
  { id: 'f-4', feature_key: 'ADVANCED_MAP', feature_label: 'Cartographie Temps Réel & PostGIS Heatmap', is_enabled: true },
  { id: 'f-5', feature_key: 'PUBLIC_API', feature_label: 'Accès API Publiques REST B2B', is_enabled: true }
];

export function isFeatureEnabled(featureKey: string, tenantId?: string): boolean {
  const flag = DEFAULT_FEATURE_FLAGS.find((f) => f.feature_key === featureKey);
  return flag ? flag.is_enabled : true;
}
