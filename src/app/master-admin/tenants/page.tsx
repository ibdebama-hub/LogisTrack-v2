'use client';

import React, { useState } from 'react';
import TenantListTable from '@/components/modules/master-admin/TenantListTable';
import TenantConfigModal from '@/components/modules/master-admin/TenantConfigModal';
import { MOCK_TENANTS } from '@/lib/mockMasterAdminData';
import { TenantCompany } from '@/types/masterAdmin';

export default function MasterTenantsPage() {
  const [tenants, setTenants] = useState<TenantCompany[]>(MOCK_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<TenantCompany | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTenant = (tenant: TenantCompany) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleSaveTenant = (updatedData: Partial<TenantCompany>) => {
    setTenants(prev =>
      prev.map(t => (t.id === updatedData.id ? { ...t, ...updatedData } : t))
    );
  };

  const handleImpersonate = (tenant: TenantCompany) => {
    alert(`⚡ Mode Impersonation activé : Vous êtes maintenant connecté en tant que "${tenant.company_name}".`);
  };

  const handleToggleStatus = (id: string) => {
    setTenants(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'ACTIVE' ? 'CANCELED' : 'ACTIVE' } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <TenantListTable
        tenants={tenants}
        onEditTenant={handleEditTenant}
        onImpersonate={handleImpersonate}
        onToggleStatus={handleToggleStatus}
      />

      <TenantConfigModal
        isOpen={isModalOpen}
        tenantToEdit={selectedTenant}
        onClose={() => { setIsModalOpen(false); setSelectedTenant(null); }}
        onSave={handleSaveTenant}
      />
    </div>
  );
}
