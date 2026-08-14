'use client';

import React from 'react';
import {
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  Download,
  QrCode,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Wallet
} from 'lucide-react';
import { useCodEnterprise } from '../../../hooks/useCodEnterprise';
import { CodPaymentEnterprise } from '../../../types/codEnterprise';

export default function CodReconciliationHub() {
  const {
    payments,
    kpis,
    isLoading,
    selectedMethod,
    setSelectedMethod,
    searchQuery,
    setSearchQuery,
    refreshPayments,
    reconcilePayment,
    downloadCodReceipt
  } = useCodEnterprise('tenant-101');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* 1. TOP HEADER & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <Banknote className="w-8 h-8 text-emerald-400" />
            <span>Centre de Encaissements & Rapprochement COD Enterprise</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion complète des fonds collectés sur le terrain (Espèces, Mobile Money, Cartes) et rapprochement caisse.
          </p>
        </div>
      </div>

      {/* 2. COD ENTERPRISE KPI GRID CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Montant Attendu</span>
          <div className="text-lg font-extrabold text-white font-mono">{kpis.total_expected.toLocaleString()} XOF</div>
          <span className="text-[10px] text-slate-500">Missions COD</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Montant Encaissé</span>
          <div className="text-lg font-extrabold text-emerald-300 font-mono">{kpis.total_collected.toLocaleString()} XOF</div>
          <span className="text-[10px] text-emerald-500">En Caisse / Wallets</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-amber-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Solde Restant</span>
          <div className="text-lg font-extrabold text-amber-300 font-mono">{kpis.remaining_balance.toLocaleString()} XOF</div>
          <span className="text-[10px] text-amber-500">À recouvrer</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Réconciliés</span>
          <div className="text-lg font-extrabold text-emerald-300 font-mono">{kpis.validated_count.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-500">Validés Caisse</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-rose-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Écarts Détectés</span>
          <div className="text-lg font-extrabold text-rose-300 font-mono">{kpis.discrepancies_count}</div>
          <span className="text-[10px] text-rose-500">Alertes Caisse</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-indigo-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Taux Recouvrement</span>
          <div className="text-lg font-extrabold text-indigo-300 font-mono">{kpis.recovery_rate}%</div>
          <span className="text-[10px] text-indigo-500">Performance</span>
        </div>
      </div>

      {/* 3. SEARCH & COMBINABLE FILTERS */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher n° COD, mission, client, destinataire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium"
          >
            <option value="ALL">Tous les Modes</option>
            <option value="CASH">Espèces</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="BANK_CARD">Carte Bancaire</option>
            <option value="WIRE_TRANSFER">Virement</option>
            <option value="CHEQUE">Chèque</option>
          </select>

          <button
            onClick={refreshPayments}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. COD PAYMENTS TABLE */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="p-4">N° COD / Mission</th>
                <th className="p-4">Client / Destinataire</th>
                <th className="p-4">Agent Terrain</th>
                <th className="p-4">Attendu vs Encaissé</th>
                <th className="p-4">Mode & Réf</th>
                <th className="p-4">Statut & Écart</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payments.map((c) => {
                const isReconciled = c.status === 'RECONCILED' || c.status === 'VALIDATED';
                const isConforme = c.conformance_status === 'CONFORME';

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-4 font-mono">
                      <span className="font-bold text-emerald-400 block">{c.cod_number}</span>
                      <span className="text-[10px] text-slate-500">{c.mission_number}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-white block">{c.recipient_name}</span>
                      <span className="text-[10px] text-slate-400">{c.client_name}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-200 block">{c.agent_name}</span>
                      <span className="text-[10px] text-slate-500">{c.created_at}</span>
                    </td>

                    <td className="p-4 font-mono font-bold">
                      <span className="text-emerald-400 block">{c.amount_collected.toLocaleString()} {c.currency}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Attendu : {c.amount_expected.toLocaleString()} XOF</span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-indigo-400 inline-block">
                        {c.payment_method}
                      </span>
                      {c.payment_reference && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{c.payment_reference}</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                          isReconciled
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {isReconciled ? '🟢 RÉCONCILIÉ' : '🟡 EN ATTENTE'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => downloadCodReceipt(c)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold inline-flex items-center gap-1 transition-all"
                        title="Reçu Numérique PDF"
                      >
                        <Download className="w-3.5 h-3.5" /> Reçu
                      </button>

                      <a
                        href={`/verify/cod/${c.cod_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold inline-flex items-center gap-1 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" /> QR
                      </a>

                      {!isReconciled && (
                        <button
                          onClick={() => reconcilePayment(c.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1 shadow-md transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Réconcilier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
