'use client';

import React from 'react';
import { Layers, MapPin, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { MOCK_CLIENT_CAMPAIGNS } from '../../../lib/mockClientPortalData';

export default function ClientCampaignsPage() {
  const campaigns = MOCK_CLIENT_CAMPAIGNS;

  return (
    <div className="space-y-8">
      {/* BANNER */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl space-y-1">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          ESPACE DONNEUR D'ORDRE • ORANGE GUINÉE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Suivi Direct des Campagnes Confiées</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Suivi en temps réel de l'avancement global et de la couverture territoriale des lots de factures et courriers.
        </p>
      </div>

      {/* CAMPAIGNS LIST */}
      <div className="space-y-6">
        {campaigns.map(c => {
          const progress = Math.round((c.delivered_items / c.total_items) * 100);
          return (
            <div key={c.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">{c.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Lancement: {c.start_date} • Échéance: <strong className="text-amber-400">{c.due_date}</strong>
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  {progress}% Distribué
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Zone Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {c.zone_coverage.map(z => (
                  <div key={z.zone_name} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
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
  );
}
