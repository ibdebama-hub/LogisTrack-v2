'use client';

import React from 'react';
import { DollarSign, Building2, Layers, TrendingUp, PieChart, Crown, Zap } from 'lucide-react';
import { MasterFinancialKPIs } from '@/types/masterAdmin';

interface SaaSFinancialOverviewProps {
  kpis: MasterFinancialKPIs;
}

export default function SaaSFinancialOverview({ kpis }: SaaSFinancialOverviewProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('GNF', 'FCFA / GNF');
  };

  return (
    <div className="space-y-6">
      {/* 4 SAAS KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">MRR (Monthly Recurring)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{formatCurrency(kpis.mrr)}</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">+14% ce mois-ci</span>
        </div>

        <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ARR (Annual Run Rate)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">{formatCurrency(kpis.arr)}</div>
          <span className="text-[10px] text-slate-400 block">Projection annuelle récurrente</span>
        </div>

        <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Entreprises Actives (Tenants)</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.active_tenants_count} sociétés</div>
          <span className="text-[10px] text-violet-300 font-semibold block">Taux de Churn: {kpis.churn_rate}%</span>
        </div>

        <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Volume Global Traité</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{kpis.total_items_processed_month.toLocaleString('fr-FR')}</div>
          <span className="text-[10px] text-slate-400 block">Factures/Plis ce mois sur tout le SaaS</span>
        </div>
      </div>

      {/* PLAN DISTRIBUTION BREAKDOWN */}
      <div className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-violet-400" />
          Répartition des Sociétés de Logistique par Plan d'Abonnement
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {kpis.plan_distribution.map(p => (
            <div key={p.plan} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] font-sans font-bold block">{p.plan}</span>
              <div className="text-white font-extrabold text-lg">{p.count} entreprise(s)</div>
              <div className="text-[11px] text-emerald-400 font-bold">{p.percentage}% du parc</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
