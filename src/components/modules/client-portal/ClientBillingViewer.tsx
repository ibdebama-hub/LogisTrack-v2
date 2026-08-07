'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle2, Clock, DollarSign, Printer, Sparkles } from 'lucide-react';
import { MOCK_CLIENT_INVOICES } from '@/lib/mockClientPortalData';
import { ClientInvoiceSummary } from '@/types/b2bClientPortal';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export default function ClientBillingViewer() {
  const [invoiceList, setInvoiceList] = useState<ClientInvoiceSummary[]>(MOCK_CLIENT_INVOICES);

  const { latestInvoice } = useRealtimeSync();

  useEffect(() => {
    if (latestInvoice) {
      setInvoiceList(prev => {
        if (prev.some(inv => inv.id === latestInvoice.id || inv.invoice_number === latestInvoice.invoice_number)) {
          return prev;
        }
        return [latestInvoice, ...prev];
      });
    }
  }, [latestInvoice]);

  const formatAmount = (val: number, currency: string = 'GNF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('XOF', 'FCFA');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* REALTIME INVOICE ISSUANCE ALERT */}
      {latestInvoice && (
        <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                Nouvelle Facture d'Honoraires Disponible !
              </h4>
              <p className="text-[11px] text-amber-300/80">
                Facture N° <strong className="font-mono text-white">{latestInvoice.invoice_number}</strong> d'un montant de <strong>{formatAmount(latestInvoice.total_ttc, latestInvoice.currency)}</strong> mise à disposition par le service comptabilité.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/40">
            Synchro WebSocket
          </span>
        </div>
      )}

      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Factures & Prestations Logistiques
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consultez l'ensemble de vos factures d'honoraires de distribution émises par Logistics West Africa.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">N° Facture</th>
              <th className="p-3.5">Campagne Confiée</th>
              <th className="p-3.5">Émission & Échéance</th>
              <th className="p-3.5">Statut Règlement</th>
              <th className="p-3.5">Montant Net TTC</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {invoiceList.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                <td className="p-3.5 font-bold text-white text-xs">{inv.invoice_number}</td>
                <td className="p-3.5 font-sans font-semibold text-slate-200">{inv.campaign_name}</td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  Émise: {inv.issue_date} • Due: <span className="text-amber-400">{inv.due_date}</span>
                </td>
                <td className="p-3.5">
                  {inv.status === 'PAYÉE' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> PAYÉE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                      <Clock className="w-3 h-3" /> ÉMISE (À REGLER)
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-extrabold text-white text-sm">
                  {formatAmount(inv.total_ttc, inv.currency)}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors inline-flex items-center gap-1 font-sans"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-400" /> Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
