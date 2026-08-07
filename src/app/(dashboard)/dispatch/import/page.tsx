'use client';

import React, { useState } from 'react';
import MassImportModal from '@/components/modules/dispatch/MassImportModal';
import BatchAssignment from '@/components/modules/dispatch/BatchAssignment';
import { ImportedRow } from '@/types/logistrack';
import { UploadCloud } from 'lucide-react';

const INITIAL_DEMO_ROWS: ImportedRow[] = [
  {
    id: 'row-0',
    tracking_number: 'FAC-BMK-001',
    item_type: 'invoice',
    payment_status: 'NO_PAYMENT_REQUIRED',
    recipient_name: 'Société Textile Malienne',
    recipient_phone: '70123456',
    address_raw: 'Bamako Coura Rue 114',
    landmark_description: 'En face de la grande mosquée',
    zone_code: 'BMK-COU-01',
    cod_amount: 0,
    due_date: '2026-08-15',
    status: 'valid',
    validation_errors: []
  },
  {
    id: 'row-1',
    tracking_number: 'FAC-BMK-002',
    item_type: 'invoice',
    payment_status: 'PENDING_COD',
    recipient_name: 'Oumar Cissé',
    recipient_phone: '66998877',
    address_raw: 'Bamako Coura Porte 45',
    landmark_description: 'Près du marché de légumes',
    zone_code: 'BMK-COU-01',
    cod_amount: 12500,
    due_date: '2026-08-12',
    status: 'valid',
    validation_errors: []
  },
  {
    id: 'row-2',
    tracking_number: 'FAC-SIK-089',
    item_type: 'registered_mail',
    payment_status: 'NO_PAYMENT_REQUIRED',
    recipient_name: 'Cabinet Avocats & Associes',
    recipient_phone: '76543210',
    address_raw: 'Sikasso Centre Avenue de l\'Indépendance',
    landmark_description: 'Immeuble SOGEFIH 2è ét.',
    zone_code: 'SIK-CEN-02',
    cod_amount: 0,
    due_date: '2026-08-10',
    status: 'valid',
    validation_errors: []
  },
  {
    id: 'row-3',
    tracking_number: 'COL-ABJ-441',
    item_type: 'package',
    payment_status: 'PENDING_COD',
    recipient_name: 'Pharmacie de la Renaissance',
    recipient_phone: '0707070707',
    address_raw: 'Koumassi Remblais Carrefour 3 Ampoules',
    landmark_description: 'A côté de la boulangerie moderne',
    zone_code: 'ABJ-KOU-REM',
    cod_amount: 42500,
    due_date: '2026-08-08',
    status: 'valid',
    validation_errors: []
  }
];

export default function DispatchImportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importedRows, setImportedRows] = useState<ImportedRow[]>(INITIAL_DEMO_ROWS);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            LOGISTRACK V2 • MODULE DISPATCH & LOTISSEMENT
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Importation Massive & Découpage Territorial</h1>
          <p className="text-xs text-slate-400">
            Parsing CSV jusqu&apos;à 10 000 lignes, détection des doublons, lotissement par zone & bordereaux avec QR code
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          Importer un Nouveau Fichier CSV / XLSX
        </button>
      </div>

      {/* Batch Assignment & Territorial Cut Section */}
      <BatchAssignment importedRows={importedRows} />

      {/* Mass Import Modal */}
      <MassImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImportComplete={(rows) => setImportedRows(rows)}
      />
    </div>
  );
}
