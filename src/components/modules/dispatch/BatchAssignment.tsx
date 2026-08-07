'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Users,
  CheckCircle2,
  Printer,
  QrCode,
  ArrowRight,
  Building2,
  FileCheck,
  Zap,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import { BatchAssignmentSummary, FieldAgent, ImportedRow } from '../../../types/logistrack';
import BatchManifestPrintModal from '../import/BatchManifestPrintModal';

interface BatchAssignmentProps {
  importedRows: ImportedRow[];
}

const MOCK_TEAM_LEADERS: FieldAgent[] = [
  { id: 'tl1', full_name: 'Traoré Bakary (Chef de Zone Bamako)', email: 'b.traore@logistrack.ml', phone: '+223 70 12 34 56', role: 'team_leader', primary_zone_id: 'z_bmk', primary_zone_code: 'BMK-COU-01', assigned_zone_codes: ['BMK-COU-01'], active_workload_count: 5 },
  { id: 'tl2', full_name: 'Coulibaly Dramane (Chef Sikasso)', email: 'd.coulibaly@logistrack.ml', phone: '+223 76 99 88 77', role: 'team_leader', primary_zone_id: 'z_sik', primary_zone_code: 'SIK-CEN-02', assigned_zone_codes: ['SIK-CEN-02'], active_workload_count: 2 },
  { id: 'tl3', full_name: 'Kouassi Jean-Marc (Chef Abidjan)', email: 'jean.kouassi@logistrack.ci', phone: '+225 07 08 12 34 56', role: 'team_leader', primary_zone_id: 'z_abj', primary_zone_code: 'ABJ-KOU-REM', assigned_zone_codes: ['ABJ-KOU-REM', 'ABJ-COC-RIV'], active_workload_count: 12 },
];

export default function BatchAssignment({ importedRows }: BatchAssignmentProps) {
  const [assignedLeaders, setAssignedLeaders] = useState<Record<string, FieldAgent>>({
    'BMK-COU-01': MOCK_TEAM_LEADERS[0],
    'SIK-CEN-02': MOCK_TEAM_LEADERS[1],
    'ABJ-KOU-REM': MOCK_TEAM_LEADERS[2],
  });

  const [activePrintBatch, setActivePrintBatch] = useState<BatchAssignmentSummary | null>(null);

  // Group items automatically by Operational Zone/Sector
  const zoneBatches = useMemo(() => {
    const map = new Map<string, BatchAssignmentSummary>();

    importedRows.forEach(row => {
      const zCode = row.zone_code || 'BMK-COU-01';
      const existing = map.get(zCode) || {
        zone_code: zCode,
        zone_name:
          zCode === 'BMK-COU-01' ? 'Bamako Coura' :
          zCode === 'SIK-CEN-02' ? 'Sikasso Centre' :
          zCode === 'ABJ-KOU-REM' ? 'Koumassi Remblais' :
          zCode === 'ABJ-COC-RIV' ? 'Cocody Riviera' : 'Zone Opérationnelle',
        total_items: 0,
        total_cod: 0,
        assigned_agent: assignedLeaders[zCode] || MOCK_TEAM_LEADERS[0],
        item_ids: []
      };

      existing.total_items += 1;
      existing.total_cod += row.cod_amount;
      existing.item_ids.push(row.id);
      map.set(zCode, existing);
    });

    return Array.from(map.values());
  }, [importedRows, assignedLeaders]);

  const handle1ClickAssign = (zoneCode: string, leader: FieldAgent) => {
    setAssignedLeaders(prev => ({
      ...prev,
      [zoneCode]: leader
    }));
  };

  return (
    <div className="w-full space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Découpage Territorial & Lotissement Automatique par Zone ({zoneBatches.length} Lots)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Attribution 1-clic des lots aux chefs d&apos;équipe et impression des bordereaux avec QR Code
          </p>
        </div>
      </div>

      {/* Grid of Generated Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zoneBatches.map(b => (
          <div key={b.zone_code} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs rounded-md border border-indigo-500/20">
                LOT #{b.zone_code}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{b.total_items} articles</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{b.zone_name}</h4>
              {b.total_cod > 0 ? (
                <span className="text-xs text-amber-400 font-bold mt-1 block">
                  Encaissement COD : {b.total_cod.toLocaleString()} FCFA
                </span>
              ) : (
                <span className="text-xs text-indigo-300 font-medium mt-1 block">
                  Distribution Administrative (Sans Frais)
                </span>
              )}
            </div>

            {/* 1-Click Agent Assignment Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-400 block font-medium">Chef d&apos;Équipe / Agent Affecté :</label>
              <select
                value={b.assigned_agent?.id || ''}
                onChange={e => {
                  const selected = MOCK_TEAM_LEADERS.find(l => l.id === e.target.value);
                  if (selected) handle1ClickAssign(b.zone_code, selected);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {MOCK_TEAM_LEADERS.map(l => (
                  <option key={l.id} value={l.id}>{l.full_name}</option>
                ))}
              </select>
            </div>

            {/* Action Bar & Print Slip Trigger */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>QR LOT-2026-981</span>
              </div>

              <button
                onClick={() => setActivePrintBatch(b)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Bordereau
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRINT MODAL */}
      {activePrintBatch && (
        <BatchManifestPrintModal
          batch={activePrintBatch}
          items={importedRows}
          campaignTitle="Campagne Factures & Courriers - Bamako / Sikasso"
          onClose={() => setActivePrintBatch(null)}
        />
      )}
    </div>
  );
}
