'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, Send } from 'lucide-react';
import { TrialTelemetry } from '@/types/crm';
import { TrialManagementService } from '@/lib/services/trialManagementService';

export default function TrialManagementRadar() {
  const [trials, setTrials] = useState<TrialTelemetry[]>([]);

  useEffect(() => {
    TrialManagementService.fetchTrialTelemetry().then(setTrials);
  }, []);

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit mb-1">
            <Activity className="w-3 h-3" /> RADAR DES ESSAIS & FIDÉLISATION CLIENTS
          </span>
          <h1 className="text-2xl font-black text-white">Tableau de Bord de Suivi des Périodes d'Essai</h1>
          <p className="text-slate-400">Supervision en temps réel de l'engagement, du risque d'abandon et des alertes automatiques (J-7, J-3, J-0).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {trials.map((t) => (
          <div key={t.tenant_id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-sm font-sans">{t.company_name}</span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  t.churn_risk === 'LOW'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                }`}
              >
                Risque : {t.churn_risk}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-bold">Jours Restants</span>
                <span className="text-amber-400 font-bold text-lg">{t.days_remaining} jours</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-bold">Score d'Engagement</span>
                <span className="text-sky-400 font-bold text-lg">{t.feature_usage_score} / 100</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-slate-300 text-[11px]">
              <div>Connexions : <strong className="text-white">{t.logins_count}</strong></div>
              <div>Campagnes créées : <strong className="text-white">{t.campaigns_created}</strong></div>
              <div>Missions exécutées : <strong className="text-white">{t.missions_executed}</strong></div>
            </div>

            {t.alert_level && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center justify-between">
                <span className="text-rose-300 font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Alerte Expiration {t.alert_level}
                </span>
                <button className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px]">
                  Relancer par Email
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
