'use client';

import React from 'react';
import { Building, CheckCircle2, AlertTriangle, Clock, TrendingUp, MapPin, Layers } from 'lucide-react';
import { MOCK_CLIENT_CAMPAIGNS } from '@/lib/mockClientPortalData';

export default function ClientDashboard() {
  const campaigns = MOCK_CLIENT_CAMPAIGNS;

  const totalConfied = campaigns.reduce((acc, c) => acc + c.total_items, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.delivered_items, 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + c.failed_items, 0);
  const globalSuccessRate = totalConfied > 0 ? ((totalDelivered / totalConfied) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-8">
      {/* BANNER */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl space-y-1">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          ESPACE DONNEUR D'ORDRE • ORANGE GUINÉE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Poste de Pilotage Campagnes B2B</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Suivi en temps réel des remises de factures, plis et colis confiés à Logistics West Africa.
        </p>
      </div>

      {/* 4 CLIENT KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Plis Confiés</span>
          <div className="text-2xl font-black text-white font-mono">{totalConfied.toLocaleString('fr-FR')}</div>
          <span className="text-[10px] text-slate-400 block">Sur les 30 derniers jours</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Taux de Distribution</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{globalSuccessRate}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Preuves certifiées</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Échecs / NPAI Restants</span>
          <div className="text-2xl font-black text-rose-400 font-mono">{totalFailed}</div>
          <span className="text-[10px] text-rose-400 block">Demande d'adresse corrective</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Temps Moyen / Remise</span>
          <div className="text-2xl font-black text-indigo-400 font-mono">11 min</div>
          <span className="text-[10px] text-slate-400 block">Entre prise en charge et PoD</span>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS PROGRESS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          Progression des Campagnes de Distribution Actives
        </h3>

        <div className="space-y-6">
          {campaigns.map(c => {
            const progress = Math.round((c.delivered_items / c.total_items) * 100);
            return (
              <div key={c.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      Du {c.start_date} au {c.due_date} • Type: {c.operation_type}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {progress}% Distribué
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Zone coverage breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {c.zone_coverage.map(z => (
                    <div key={z.zone_name} className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-xs">
                      <span className="text-slate-400 block flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {z.zone_name}
                      </span>
                      <span className="font-mono font-bold text-white mt-1 block">
                        {z.delivered} / {z.total} plis remises
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
