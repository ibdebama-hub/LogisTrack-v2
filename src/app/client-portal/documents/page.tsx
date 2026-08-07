'use client';

import React from 'react';
import ClientDocumentCenter from '@/components/modules/client-portal/ClientDocumentCenter';
import { useB2BPortal } from '@/hooks/useB2BPortal';

export default function ClientDocumentsPage() {
  const { documents } = useB2BPortal('cli-cie');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <ClientDocumentCenter documents={documents} />
    </div>
  );
}
