'use client';

import React from 'react';
import { DollarSign, Wallet, Smartphone, ShieldCheck, TrendingUp, PieChart } from 'lucide-react';
import { FinanceKPIs } from '@/types/financeReports';

interface FinancialReportsOverviewProps {
  kpis: FinanceKPIs;
}

export default function FinancialReportsOverview({ kpis }: FinancialReportsOverviewProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('GNF', 'FCFA / GNF');
  };

  return (
    <div className="space-y-6">
      {/* 4 TOP KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Encaissé Bruts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{formatCurrency(kpis.total_collected)}</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Collecté sur la période sélectionnée</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Espèces vs Mobile Money</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">{kpis.cash_percentage}% / {kpis.mobile_money_percentage}%</div>
          <span className="text-[10px] text-slate-400 block">{kpis.cash_percentage}% Espèces • {kpis.mobile_money_percentage}% Mobile Money</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Transactions COD Validées</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.validated_transactions_count} encaissements</div>
          <span className="text-[10px] text-slate-400 block">100% avec reçus horodatés</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Commissions COD Perçues</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{formatCurrency(kpis.total_commissions)}</div>
          <span className="text-[10px] text-slate-400 block">Frais de prestation encaissement</span>
        </div>
      </div>

      {/* METHOD BREAKDOWN GAUGE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          Répartition des Modes de Règlement (Cash vs Mobile Money)
        </h3>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          {kpis.breakdown_by_method.map(b => (
            <div
              key={b.method}
              style={{ width: `${b.percentage}%` }}
              className={`${b.color} h-full transition-all duration-500`}
              title={`${b.label}: ${b.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          {kpis.breakdown_by_method.map(b => (
            <div key={b.method} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-sans font-bold flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
                {b.label}
              </span>
              <div className="text-white font-extrabold text-sm">{b.percentage}%</div>
              <div className="text-[10px] text-slate-500">{b.count} transaction(s)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
