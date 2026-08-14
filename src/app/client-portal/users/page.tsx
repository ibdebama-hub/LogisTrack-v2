'use client';

import React from 'react';
import ClientUserManager from '../../../components/modules/client-portal/ClientUserManager';
import { useB2BPortal } from '../../../hooks/useB2BPortal';

export default function ClientUsersPage() {
  const { users } = useB2BPortal('cli-cie');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <ClientUserManager users={users} />
    </div>
  );
}
