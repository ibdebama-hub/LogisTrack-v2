'use client';

import React from 'react';
import SupportTicketHub from '../../../components/modules/master-admin/SupportTicketHub';
import { usePlatformManagement } from '../../../hooks/usePlatformManagement';

export default function PlatformSupportPage() {
  const { tickets } = usePlatformManagement();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <SupportTicketHub tickets={tickets} />
    </div>
  );
}
