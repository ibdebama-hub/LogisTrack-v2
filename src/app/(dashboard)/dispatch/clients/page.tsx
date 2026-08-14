'use client';

import React from 'react';
import ClientListTable from '../../../../components/modules/clients/ClientListTable';

export default function DispatchClientsPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            LOGISTRACK V2 • GESTION DES DONNEURS D&apos;ORDRES
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Registre des Clients Donneurs d&apos;Ordres</h1>
          <p className="text-xs text-slate-400">
            Gestion des comptes entreprises (Banques, Télécoms, Énergie, E-Commerce), contacts & rapports automatiques PoD
          </p>
        </div>
      </div>

      <ClientListTable />
    </div>
  );
}
