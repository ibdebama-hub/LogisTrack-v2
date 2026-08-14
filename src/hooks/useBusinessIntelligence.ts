'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchBiExecutiveKpis,
  fetchBiScorecards,
  MOCK_BI_KPIS,
  MOCK_BI_SCORECARDS,
  MOCK_BI_ALERTS,
  MOCK_BI_COMPARISON
} from '../lib/services/biService';
import { exportBiReport } from '../lib/services/biReportEngine';
import {
  BiExecutiveKpis,
  BiScorecardItem,
  BiAlertRule,
  BiRoleView,
  BiComparisonResult
} from '../types/biAnalytics';

export function useBusinessIntelligence(organizationId: string = 'tenant-101') {
  const [kpis, setKpis] = useState<BiExecutiveKpis>(MOCK_BI_KPIS);
  const [scorecards, setScorecards] = useState<BiScorecardItem[]>(MOCK_BI_SCORECARDS);
  const [alerts, setAlerts] = useState<BiAlertRule[]>(MOCK_BI_ALERTS);
  const [comparison, setComparison] = useState<BiComparisonResult>(MOCK_BI_COMPARISON);
  const [activeRoleView, setActiveRoleView] = useState<BiRoleView>('EXECUTIVE');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [k, sc] = await Promise.all([
      fetchBiExecutiveKpis(organizationId),
      fetchBiScorecards(organizationId)
    ]);
    setKpis(k);
    setScorecards(sc);
    setIsLoading(false);
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportReport = (format: 'CSV' | 'PDF' | 'EXCEL') => {
    exportBiReport(kpis, scorecards, format);
  };

  return {
    kpis,
    scorecards,
    alerts,
    comparison,
    activeRoleView,
    setActiveRoleView,
    isLoading,
    refreshBi: loadData,
    exportReport: handleExportReport
  };
}
