'use client';

import React from 'react';
import { GitCompare, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { BiComparisonResult } from '@/types/biAnalytics';

interface BiComparatorViewProps {
  comparison: BiComparisonResult;
}

export default function BiComparatorView({ comparison }: BiComparatorViewProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-indigo-400" />
          <span>Analyse Comparative Side-by-Side (Deltas & Variance)</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">Comparaison 2 Entités</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ENTITY 1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/50 space-y-3">
          <span className="font-bold text-indigo-400 block text-sm">{comparison.entity1_label}</span>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Taux Succès Livraison :</span>
              <span className="text-emerald-400 font-bold">{comparison.success_rate_1}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Recouvrement COD :</span>
              <span className="text-emerald-400 font-bold">{comparison.cod_1.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Respect SLA :</span>
              <span className="text-indigo-300 font-bold">{comparison.sla_1}%</span>
            </div>
          </div>
        </div>

        {/* ENTITY 2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="font-bold text-white block text-sm">{comparison.entity2_label}</span>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Taux Succès Livraison :</span>
              <span className="text-slate-200 font-bold">{comparison.success_rate_2}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Recouvrement COD :</span>
              <span className="text-slate-200 font-bold">{comparison.cod_2.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Respect SLA :</span>
              <span className="text-slate-200 font-bold">{comparison.sla_2}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* VARIANCE SUMMARY BADGE */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-bold">Écart de Performance Constaté :</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          +{comparison.success_rate_delta}% Succès en faveur de {comparison.entity1_label}
        </span>
      </div>
    </div>
  );
}
