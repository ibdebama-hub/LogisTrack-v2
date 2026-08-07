'use client';

import React from 'react';
import BiExecutiveDashboard from '@/components/modules/analytics/BiExecutiveDashboard';
import BiScorecardGrid from '@/components/modules/analytics/BiScorecardGrid';
import BiComparatorView from '@/components/modules/analytics/BiComparatorView';
import BiCartoAnalytics from '@/components/modules/analytics/BiCartoAnalytics';
import BiAlertEngine from '@/components/modules/analytics/BiAlertEngine';
import { useBusinessIntelligence } from '@/hooks/useBusinessIntelligence';

export default function BusinessIntelligencePage() {
  const {
    kpis,
    scorecards,
    alerts,
    comparison,
    activeRoleView,
    setActiveRoleView,
    exportReport
  } = useBusinessIntelligence('tenant-101');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. MASTER EXECUTIVE DASHBOARD BY ROLE */}
      <BiExecutiveDashboard
        kpis={kpis}
        activeRoleView={activeRoleView}
        onSelectRoleView={setActiveRoleView}
        onExportReport={exportReport}
      />

      {/* 2. SCORECARDS GRID & AUTOMATIC RATINGS */}
      <BiScorecardGrid scorecards={scorecards} />

      {/* 3. COMPARATOR & CARTOGRAPHIC HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BiComparatorView comparison={comparison} />
        <BiCartoAnalytics />
      </div>

      {/* 4. ANALYTICAL ALERT ENGINE & AI PREDICTIVE PREPARATION */}
      <BiAlertEngine alerts={alerts} />
    </div>
  );
}
