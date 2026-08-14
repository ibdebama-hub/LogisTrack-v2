'use client';

import React from 'react';
import ApiKeysManager from '../../../components/modules/master-admin/ApiKeysManager';
import { usePlatformManagement } from '../../../hooks/usePlatformManagement';

export default function ApiKeysManagementPage() {
  const { apiKeys, createApiKey } = usePlatformManagement();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <ApiKeysManager apiKeys={apiKeys} onCreateKey={createApiKey} />
    </div>
  );
}
