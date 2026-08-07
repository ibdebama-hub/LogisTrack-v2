'use client';

import React from 'react';
import CSVBatchImportManager from '@/components/modules/import/CSVBatchImportManager';

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <CSVBatchImportManager />
    </div>
  );
}
