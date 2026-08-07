'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchPlatformMonitoringKpis,
  fetchSaaSTenants,
  fetchSaaSPlans,
  fetchSaaSLicenses,
  fetchSaaSInvoices,
  fetchPlatformAudits,
  fetchSupportTickets,
  MOCK_SAAS_MONITORING
} from '@/lib/services/saasPlatformService';
import { generateSaaSInvoicePdf } from '@/lib/services/saasBillingService';
import { DEFAULT_FEATURE_FLAGS } from '@/lib/services/featureFlagService';
import { MOCK_API_KEYS, generateNewApiKey } from '@/lib/services/apiManagementService';
import {
  PlatformMonitoringKpis,
  SaaSTenant,
  SaaSPlan,
  SaaSLicense,
  SaaSInvoice,
  PlatformAuditLog,
  SupportTicket,
  FeatureFlagItem,
  ApiKeyItem
} from '@/types/saasPlatform';

export function usePlatformManagement() {
  const [kpis, setKpis] = useState<PlatformMonitoringKpis>(MOCK_SAAS_MONITORING);
  const [tenants, setTenants] = useState<SaaSTenant[]>([]);
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  const [licenses, setLicenses] = useState<SaaSLicense[]>([]);
  const [invoices, setInvoices] = useState<SaaSInvoice[]>([]);
  const [audits, setAudits] = useState<PlatformAuditLog[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>(DEFAULT_FEATURE_FLAGS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(MOCK_API_KEYS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [k, t, p, l, inv, aud, tick] = await Promise.all([
      fetchPlatformMonitoringKpis(),
      fetchSaaSTenants(),
      fetchSaaSPlans(),
      fetchSaaSLicenses(),
      fetchSaaSInvoices(),
      fetchPlatformAudits(),
      fetchSupportTickets()
    ]);
    setKpis(k);
    setTenants(t);
    setPlans(p);
    setLicenses(l);
    setInvoices(inv);
    setAudits(aud);
    setTickets(tick);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleFeature = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, is_enabled: !f.is_enabled } : f))
    );
  };

  const createApiKey = (tenantId: string, name: string) => {
    const newKey = generateNewApiKey(tenantId, name);
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const downloadInvoicePdf = (invoice: SaaSInvoice) => {
    const dataUri = generateSaaSInvoicePdf(invoice);
    const win = window.open();
    if (win) win.document.write(`<iframe src="${dataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
  };

  return {
    kpis,
    tenants,
    plans,
    licenses,
    invoices,
    audits,
    tickets,
    featureFlags,
    apiKeys,
    isLoading,
    refreshPlatform: loadData,
    toggleFeature,
    createApiKey,
    downloadInvoicePdf
  };
}
