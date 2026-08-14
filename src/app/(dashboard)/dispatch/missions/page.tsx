import React from 'react';
import MissionsExplorerTable from '../../../../components/modules/dispatch/MissionsExplorerTable';

export const metadata = {
  title: 'Explorateur de Missions — LogisTrack V2',
  description: 'Gestion du cycle de vie des missions, SLA, suivi et audits'
};

export default function MissionsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <span>🎯 Explorateur de Missions & Suivi SLA</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion intégrale du cycle de vie des unités de travail (factures, plis, colis), incidents et preuves POD.
          </p>
        </div>
      </div>

      <MissionsExplorerTable />
    </div>
  );
}
