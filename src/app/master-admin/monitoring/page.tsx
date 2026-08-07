'use client';

import React from 'react';
import PlatformMonitoringCenter from '@/components/modules/master-admin/PlatformMonitoringCenter';
import { usePlatformManagement } from '@/hooks/usePlatformManagement';

export default function PlatformMonitoringPage() {
  const { kpis } = usePlatformManagement();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <PlatformMonitoringCenter kpis={kpis} />
    </div>
  );
}
