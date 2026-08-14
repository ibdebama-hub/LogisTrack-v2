'use client';

import React from 'react';
import { AlertTriangle, Sparkles, BellRing, CheckCircle2 } from 'lucide-react';
import { BiAlertRule } from '../../../types/biAnalytics';

interface BiAlertEngineProps {
  alerts: BiAlertRule[];
}

export default function BiAlertEngine({ alerts }: BiAlertEngineProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>Moteur d'Alertes Analytiques & Détection Prédictive IA</span>
        </h2>
        <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Module IA Prêt
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((al) => (
          <div
            key={al.id}
            className="bg-slate-950 p-3.5 rounded-xl border border-amber-900/50 flex items-center justify-between transition-all hover:border-amber-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">{al.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Règle : {al.metric} • Valeur constatée : <strong className="text-amber-400">{al.threshold_value}</strong>
                </span>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 font-mono">{al.triggered_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
