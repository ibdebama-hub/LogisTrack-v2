'use client';

import React from 'react';
import SaaSAuditLogViewer from '@/components/modules/master-admin/SaaSAuditLogViewer';
import { usePlatformManagement } from '@/hooks/usePlatformManagement';

export default function PlatformAuditPage() {
  const { audits } = usePlatformManagement();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <SaaSAuditLogViewer audits={audits} />
    </div>
  );
}
