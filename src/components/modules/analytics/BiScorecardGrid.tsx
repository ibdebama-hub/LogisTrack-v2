'use client';

import React from 'react';
import { Award, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { BiScorecardItem, BiRating } from '../../../types/biAnalytics';

interface BiScorecardGridProps {
  scorecards: BiScorecardItem[];
}

export default function BiScorecardGrid({ scorecards }: BiScorecardGridProps) {
  const getRatingBadgeStyle = (rating: BiRating) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'BON':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'MOYEN':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'A_AMELIORER':
        return 'bg-rose-950 text-rose-400 border-rose-800';
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Matrice de Scorecards & Notation Automatique (Sur 100)</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">Évaluation Multi-critères</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scorecards.map((sc) => (
          <div
            key={sc.id}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-sm">{sc.entity_name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{sc.entity_type} • {sc.missions_count} missions</span>
              </div>

              <div className="text-right">
                <span className="text-lg font-black font-mono text-emerald-400 block">{sc.score} / 100</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRatingBadgeStyle(sc.rating)}`}>
                  {sc.rating}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-900 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Taux Succès :</span>
                <span className="text-emerald-400 font-bold">{sc.success_rate}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Respect SLA :</span>
                <span className="text-indigo-400 font-bold">{sc.sla_rate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
