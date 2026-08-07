'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchPoDRecordsPaged,
  approvePoDRecord
} from '@/lib/services/podEnterpriseService';
import { generatePoDPdfCertificate } from '@/lib/services/podPdfService';
import {
  PoDRecordEnterprise,
  PoDKpisEnterprise,
  PoDStatus
} from '@/types/podEnterprise';
import { MOCK_POD_KPIS } from '@/lib/services/podEnterpriseService';

export function usePoDEnterprise(organizationId: string = 'tenant-101') {
  const [pods, setPods] = useState<PoDRecordEnterprise[]>([]);
  const [kpis, setKpis] = useState<PoDKpisEnterprise>(MOCK_POD_KPIS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<PoDStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadPoDs = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchPoDRecordsPaged(organizationId, selectedStatus, searchQuery);
    setPods(res.data);
    setKpis(res.kpis);
    setIsLoading(false);
  }, [organizationId, selectedStatus, searchQuery]);

  useEffect(() => {
    loadPoDs();
  }, [loadPoDs]);

  const approvePoD = async (podId: string, notes?: string) => {
    setPods((prev) =>
      prev.map((p) => (p.id === podId ? { ...p, status: 'APPROVED' } : p))
    );
    await approvePoDRecord(podId, 'Yves Touré (Dispatcher)', notes, organizationId);
    await loadPoDs();
  };

  const downloadPdfCertificate = (pod: PoDRecordEnterprise) => {
    const dataUri = generatePoDPdfCertificate(pod);
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${dataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  return {
    pods,
    kpis,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refreshPoDs: loadPoDs,
    approvePoD,
    downloadPdfCertificate
  };
}
