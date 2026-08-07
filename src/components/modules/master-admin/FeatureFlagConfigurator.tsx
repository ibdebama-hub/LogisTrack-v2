'use client';

import React from 'react';
import { ToggleLeft, ToggleRight, Sliders, ShieldCheck } from 'lucide-react';
import { FeatureFlagItem } from '@/types/saasPlatform';

interface FeatureFlagConfiguratorProps {
  flags: FeatureFlagItem[];
  onToggleFlag: (flagId: string) => void;
}

export default function FeatureFlagConfigurator({ flags, onToggleFlag }: FeatureFlagConfiguratorProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Moteur Centralisé de Feature Flags (Gestion des Modules SaaS)</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">Bascule Dynamique des Fonctionnalités</span>
      </div>

      <div className="space-y-2">
        {flags.map((fl) => (
          <div
            key={fl.id}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:border-indigo-500/50"
          >
            <div className="space-y-0.5">
              <span className="font-bold text-white block text-sm">{fl.feature_label}</span>
              <span className="text-[10px] text-indigo-400 font-mono">Clé Technique : {fl.feature_key}</span>
            </div>

            <button
              onClick={() => onToggleFlag(fl.id)}
              className={`p-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                fl.is_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {fl.is_enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              <span>{fl.is_enabled ? 'Activé' : 'Désactivé'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
