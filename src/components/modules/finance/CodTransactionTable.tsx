'use client';

import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Filter,
  Printer,
  Smartphone,
  Wallet,
  CheckCircle2,
  Clock,
  Download,
  Building,
  User
} from 'lucide-react';
import { CodTransactionItem, PaymentMethod } from '@/types/financeReports';

interface CodTransactionTableProps {
  transactions: CodTransactionItem[];
  onOpenExportModal: () => void;
}

export default function CodTransactionTable({
  transactions,
  onOpenExportModal
}: CodTransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState<CodTransactionItem | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.agent_name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesMethod = true;
    if (methodFilter !== 'ALL') {
      matchesMethod = t.payment_method === methodFilter;
    }

    return matchesSearch && matchesMethod;
  });

  const getPaymentBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'ESPÈCES':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Wallet className="w-3 h-3" /> ESPÈCES
          </span>
        );
      case 'ORANGE_MONEY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Smartphone className="w-3 h-3 text-amber-400" /> ORANGE MONEY
          </span>
        );
      case 'WAVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Smartphone className="w-3 h-3 text-sky-400" /> WAVE DIGITAL
          </span>
        );
      case 'MTN_MOMO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Smartphone className="w-3 h-3 text-yellow-400" /> MTN MOMO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            VIREMENT
          </span>
        );
    }
  };

  const formatAmount = (val: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('XOF', 'FCFA');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-white text-base">Journal Général des Encaissements COD</h3>
          <p className="text-xs text-slate-400">Traçabilité complète des encaissements par agent et mode de règlement</p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exporter Grand Livre & PDF</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N° Suivi, reçu, client, destinataire ou agent..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Date presets */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'TODAY', label: 'Aujourd\'hui' },
              { id: 'WEEK', label: 'Cette Semaine' },
              { id: 'MONTH', label: 'Ce Mois' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDateRange(d.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  dateRange === d.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Method filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tous Modes de Règlement</option>
            <option value="ESPÈCES">Espèces (Cash)</option>
            <option value="ORANGE_MONEY">Orange Money</option>
            <option value="WAVE">Wave Digital</option>
            <option value="MTN_MOMO">MTN MoMo</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">N° Reçu / Suivi</th>
              <th className="p-3.5">Client & Destinataire</th>
              <th className="p-3.5">Livreur Collecteur</th>
              <th className="p-3.5">Mode Règlement</th>
              <th className="p-3.5">Horodatage</th>
              <th className="p-3.5">Statut Caisse</th>
              <th className="p-3.5">Montant Encaissé</th>
              <th className="p-3.5 text-right">Reçu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                  Aucune transaction enregistrée pour ces critères.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{t.receipt_number}</span>
                    <span className="text-[10px] text-indigo-400 block">{t.tracking_number}</span>
                  </td>

                  <td className="p-3.5 font-sans">
                    <span className="font-semibold text-slate-200 block">{t.recipient_name}</span>
                    <span className="text-[11px] text-slate-400 block">{t.client_name}</span>
                  </td>

                  <td className="p-3.5 font-sans text-slate-300">
                    {t.agent_name}
                  </td>

                  <td className="p-3.5">
                    {getPaymentBadge(t.payment_method)}
                  </td>

                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {t.timestamp}
                  </td>

                  <td className="p-3.5">
                    {t.reconciliation_status === 'RÉCONCILIÉ' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> RÉCONCILIÉ
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> EN ATTENTE DÉPÔT
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 font-black text-white text-sm">
                    {formatAmount(t.amount_collected, t.currency)}
                  </td>

                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedReceipt(t)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                      title="Réimprimer le reçu de caisse"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PRINT RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Reçu d'Encaissement COD</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-white p-5 rounded-2xl text-slate-900 font-mono text-xs space-y-3">
              <div className="text-center border-b pb-2">
                <span className="font-black text-sm text-indigo-900 block">LOGISTRACK V2 CAISSE</span>
                <span className="text-[10px] text-slate-500 block">REÇU DE CAISSE CERTIFIÉ</span>
              </div>

              <div>
                <p>N° Reçu: <strong>{selectedReceipt.receipt_number}</strong></p>
                <p>N° Suivi: {selectedReceipt.tracking_number}</p>
                <p>Date: {selectedReceipt.timestamp}</p>
                <p>Client: {selectedReceipt.client_name}</p>
                <p>Payeur: {selectedReceipt.recipient_name}</p>
                <p>Agent Collecteur: {selectedReceipt.agent_name}</p>
                <p>Mode Règlement: <strong>{selectedReceipt.payment_method}</strong></p>
              </div>

              <div className="border-t pt-2 text-base font-black text-right text-indigo-950">
                Montant: {formatAmount(selectedReceipt.amount_collected, selectedReceipt.currency)}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimer le Reçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
