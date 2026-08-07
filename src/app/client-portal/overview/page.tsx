'use client';

import React from 'react';
import ClientExecutiveDashboard from '@/components/modules/client-portal/ClientExecutiveDashboard';
import { useB2BPortal } from '@/hooks/useB2BPortal';

export default function ClientOverviewPage() {
  const { kpis, analytics, exportReport } = useB2BPortal('cli-cie');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <ClientExecutiveDashboard
        clientName="CIE Électricité CI"
        kpis={kpis}
        analytics={analytics}
        onExportReport={exportReport}
      />
    </div>
  );
}
