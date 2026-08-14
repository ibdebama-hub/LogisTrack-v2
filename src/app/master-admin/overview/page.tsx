'use client';

import React from 'react';
import PlatformMonitoringCenter from '../../../components/modules/master-admin/PlatformMonitoringCenter';
import FeatureFlagConfigurator from '../../../components/modules/master-admin/FeatureFlagConfigurator';
import SaaSAuditLogViewer from '../../../components/modules/master-admin/SaaSAuditLogViewer';
import { usePlatformManagement } from '../../../hooks/usePlatformManagement';

export default function MasterAdminOverviewPage() {
  const { kpis, featureFlags, audits, toggleFeature } = usePlatformManagement();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-6">
      <PlatformMonitoringCenter kpis={kpis} />
      <FeatureFlagConfigurator flags={featureFlags} onToggleFlag={toggleFeature} />
      <SaaSAuditLogViewer audits={audits} />
    </div>
  );
}
