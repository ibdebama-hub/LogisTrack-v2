'use client';

import React from 'react';
import { FileText, CheckCircle2, Clock, Mail, Printer, AlertTriangle } from 'lucide-react';
import { MOCK_TENANTS } from '../../../lib/mockMasterAdminData';

export default function MasterBillingViewer() {
  const tenants = MOCK_TENANTS;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('GNF', 'FCFA');
  };

  return (
    <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" />
          Facturation des Abonnements SaaS Multi-Tenants
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Suivi des paiements d'abonnements mensuels/annuels et gestion des relances pour impayés.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Entreprise Abonné</th>
              <th className="p-3.5">Plan actuel</th>
              <th className="p-3.5">Cycle</th>
              <th className="p-3.5">Montant Dû</th>
              <th className="p-3.5">Statut Paiement</th>
              <th className="p-3.5 text-right">Relance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {tenants.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-sans font-bold text-white text-xs">{t.company_name}</td>
                <td className="p-3.5 font-bold text-amber-300">{t.plan_type}</td>
                <td className="p-3.5 text-slate-400">{t.billing_cycle}</td>
                <td className="p-3.5 font-black text-white">{formatCurrency(t.monthly_price)}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    À JOUR / PAYÉ
                  </span>
                </td>
                <td className="p-3.5 text-right font-sans">
                  <button
                    onClick={() => alert(`Relance d'échéance envoyée à ${t.owner_email}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Relancer Email
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
