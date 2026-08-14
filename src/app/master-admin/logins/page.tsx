'use client';

import React from 'react';
import LoginHistoryViewer from '../../../components/modules/master-admin/identity/LoginHistoryViewer';

export default function MasterAdminLoginsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <LoginHistoryViewer />
    </div>
  );
}
