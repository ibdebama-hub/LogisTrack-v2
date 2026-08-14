'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  Plus,
  Building,
  DollarSign,
  TrendingUp,
  CreditCard,
  Printer
} from 'lucide-react';
import { B2BInvoice, InvoiceStatus } from '../../../types/b2bBilling';

interface B2BInvoiceListProps {
  invoices: B2BInvoice[];
  onInspectInvoice: (invoice: B2BInvoice) => void;
  onMarkPaid: (invoiceId: string) => void;
  onSendReminder: (invoiceId: string) => void;
  onGenerateNewModalOpen: () => void;
}

export default function B2BInvoiceList({
  invoices,
  onInspectInvoice,
  onMarkPaid,
  onSendReminder,
  onGenerateNewModalOpen
}: B2BInvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter !== 'ALL') matchesStatus = inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate KPIs
  const totalRevenueTtc = invoices
    .filter(i => i.status !== 'ANNULÉE')
    .reduce((acc, curr) => acc + curr.total_ttc, 0);

  const collectedAmount = invoices
    .filter(i => i.status === 'PAYÉE')
    .reduce((acc, curr) => acc + curr.total_ttc, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'ÉMISE' || i.status === 'EN_RETARD')
    .reduce((acc, curr) => acc + curr.total_ttc, 0);

  const overdueCount = invoices.filter(i => i.status === 'EN_RETARD').length;

  const formatAmount = (val: number, currency: string = 'GNF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('XOF', 'FCFA');
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'BROUILLON':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            BROUILLON
          </span>
        );
      case 'ÉMISE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> ÉMISE (ATTENTE 30J)
          </span>
        );
      case 'PAYÉE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> PAYÉE
          </span>
        );
      case 'EN_RETARD':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> EN RETARD DE PAIEMENT
          </span>
        );
      case 'ANNULÉE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-500 line-through">
            ANNULÉE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* FINANCIAL KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Chiffre d'Affaires Généré
          </span>
          <div className="text-xl font-black text-white font-mono mt-2">
            {formatAmount(totalRevenueTtc, 'GNF')}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Prestations facturées B2B</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Total Encaissé
          </span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-2">
            {formatAmount(collectedAmount, 'GNF')}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Reglements validés</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            En Attente de Règlement
          </span>
          <div className="text-xl font-black text-amber-400 font-mono mt-2">
            {formatAmount(pendingAmount, 'GNF')}
          </div>
          <span className="text-[10px] text-amber-400 block mt-1">Factures ouvertes (30j)</span>
        </div>

        <div className={`bg-slate-900/90 border rounded-2xl p-4 shadow-lg ${
          overdueCount > 0 ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800'
        }`}>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Factures en Retard
          </span>
          <div className="text-xl font-black text-rose-400 font-mono mt-2 flex items-center gap-2">
            <span>{overdueCount}</span>
            <span className="text-xs text-slate-400 font-normal">facture(s) impayée(s)</span>
          </div>
          <span className="text-[10px] text-rose-400 font-semibold block mt-1">Relance requise</span>
        </div>
      </div>

      {/* MAIN INVOICE LIST TABLE & CONTROLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* SEARCH, FILTERS & GENERATE BUTTON */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher n° facture, client, campagne..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'ALL', label: 'Toutes' },
                { id: 'ÉMISE', label: 'Émises' },
                { id: 'PAYÉE', label: 'Payées' },
                { id: 'EN_RETARD', label: 'En Retard' },
                { id: 'BROUILLON', label: 'Brouillons' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === f.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onGenerateNewModalOpen}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Générer Facture Campagne</span>
          </button>
        </div>

        {/* INVOICES TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">N° Facture / Donneur d'Ordre</th>
                <th className="p-3.5">Campagne / Prestation</th>
                <th className="p-3.5">Échéance</th>
                <th className="p-3.5">Statut Paiement</th>
                <th className="p-3.5">Montant Total TTC</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    Aucune facture ne correspond à la recherche.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* N° FACTURE & CLIENT */}
                    <td className="p-3.5">
                      <div className="font-mono font-extrabold text-white text-xs flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{inv.invoice_number}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-semibold mt-0.5">
                        {inv.client_name} ({inv.client_code})
                      </div>
                    </td>

                    {/* CAMPAGNE */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{inv.campaign_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Émise le: {inv.issue_date}</div>
                    </td>

                    {/* ÉCHÉANCE */}
                    <td className="p-3.5 font-mono text-xs">
                      <div className={inv.status === 'EN_RETARD' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {inv.due_date}
                      </div>
                      <div className="text-[10px] text-slate-500">30j fin de mois</div>
                    </td>

                    {/* STATUT PAIEMENT */}
                    <td className="p-3.5">
                      {getStatusBadge(inv.status)}
                    </td>

                    {/* MONTANT TTC */}
                    <td className="p-3.5">
                      <div className="font-mono font-extrabold text-white text-sm">
                        {formatAmount(inv.total_ttc, inv.currency)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">HT: {formatAmount(inv.subtotal_ht, inv.currency)}</div>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectInvoice(inv)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors"
                          title="Prévisualiser Facture PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-indigo-400" />
                          <span>PDF / Voir</span>
                        </button>

                        {inv.status === 'ÉMISE' || inv.status === 'EN_RETARD' ? (
                          <button
                            onClick={() => onMarkPaid(inv.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-bold transition-all"
                            title="Enregistrer comme Payée"
                          >
                            Payer
                          </button>
                        ) : null}

                        {inv.status === 'EN_RETARD' && (
                          <button
                            onClick={() => onSendReminder(inv.id)}
                            className="p-1.5 text-rose-400 hover:text-white bg-rose-950/50 hover:bg-rose-900 rounded-xl transition-colors border border-rose-800"
                            title="Envoyer Relance Email"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
