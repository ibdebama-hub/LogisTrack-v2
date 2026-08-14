'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchCodPaymentsPaged,
  reconcileCodPaymentRecord
} from '../lib/services/codEnterpriseService';
import { generateCodDigitalReceipt } from '../lib/services/codReceiptService';
import {
  CodPaymentEnterprise,
  CodKpisEnterprise,
  CodPaymentMethod
} from '../types/codEnterprise';
import { MOCK_COD_KPIS } from '../lib/services/codEnterpriseService';

export function useCodEnterprise(organizationId: string = 'tenant-101') {
  const [payments, setPayments] = useState<CodPaymentEnterprise[]>([]);
  const [kpis, setKpis] = useState<CodKpisEnterprise>(MOCK_COD_KPIS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMethod, setSelectedMethod] = useState<CodPaymentMethod | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchCodPaymentsPaged(organizationId, selectedMethod, searchQuery);
    setPayments(res.data);
    setKpis(res.kpis);
    setIsLoading(false);
  }, [organizationId, selectedMethod, searchQuery]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const reconcilePayment = async (codId: string, notes?: string) => {
    setPayments((prev) =>
      prev.map((c) => (c.id === codId ? { ...c, status: 'RECONCILED' } : c))
    );
    await reconcileCodPaymentRecord(codId, 'Yves Touré (Dispatcher)', notes, organizationId);
    await loadPayments();
  };

  const downloadCodReceipt = (cod: CodPaymentEnterprise) => {
    const dataUri = generateCodDigitalReceipt(cod);
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${dataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  return {
    payments,
    kpis,
    isLoading,
    selectedMethod,
    setSelectedMethod,
    searchQuery,
    setSearchQuery,
    refreshPayments: loadPayments,
    reconcilePayment,
    downloadCodReceipt
  };
}
