'use client';

import React, { useState } from 'react';
import { X, Layers, Plus, Calendar, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CampaignItem, CampaignStatus } from '@/types/campaigns';
import { OperationType } from '@/types/logistrack';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (campaign: Partial<CampaignItem>) => void;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onCreate
}: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('Électricité De Guinée (EDG / EDM)');
  const [operationType, setOperationType] = useState<OperationType>('MASS_INVOICE_DISTRIBUTION');
  const [totalItems, setTotalItems] = useState(5000);
  const [startDate, setStartDate] = useState('2026-08-10');
  const [dueDate, setDueDate] = useState('2026-08-25');
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const clientCode = clientName.includes('EDG') ? 'EDM' : clientName.includes('Orange') ? 'OGN' : 'BAT';
    const refNumber = `CAMP-2026-${clientCode}-${Math.floor(Math.random() * 90 + 10)}`;

    onCreate({
      reference: refNumber,
      name,
      client_name: clientName,
      client_code: clientCode,
      operation_type: operationType,
      total_items: totalItems,
      delivered_items: 0,
      failed_items: 0,
      in_progress_items: 0,
      unassigned_items: totalItems,
      start_date: startDate,
      due_date: dueDate,
      is_urgent: isUrgent,
      status: 'PLANIFIÉE',
      batches_count: 1,
      agents_assigned_count: 0,
      zones_progress: [
        { zone_name: 'Kaloum Centre-Ville', total: totalItems, delivered: 0, failed: 0, in_progress: 0 }
      ],
      assigned_agents: [],
      incidents: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Nouvelle Campagne de Distribution</h3>
              <p className="text-xs text-slate-400">Initialisation d'un lot de factures, pli ou colis client</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nom de la Campagne <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Factures Électricité EDM - Août 2026"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Client Donneur d'Ordre</label>
              <select
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="Électricité De Guinée (EDG / EDM)">Électricité De Guinée (EDG / EDM)</option>
                <option value="Orange Guinée">Orange Guinée (OGN)</option>
                <option value="Banque Atlantique / BDM">Banque Atlantique / BDM</option>
                <option value="SODECI Côte d'Ivoire">SODECI Côte d'Ivoire</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Type d'Opération</label>
              <select
                value={operationType}
                onChange={e => setOperationType(e.target.value as OperationType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="MASS_INVOICE_DISTRIBUTION">Distribution Factures Simples</option>
                <option value="CONFIDENTIAL_MAIL">Plis Confidentiels / Recommandés (PoD)</option>
                <option value="PARCEL_DELIVERY_COD">Livraisons Colis (Avec Encaissement COD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Volume Estimé Items</label>
              <input
                type="number"
                value={totalItems}
                onChange={e => setTotalItems(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Date Lancement</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Échéance Contrat</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-slate-300">Marquer comme Prioritaire / Urgente</span>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={e => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Créer la Campagne
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
