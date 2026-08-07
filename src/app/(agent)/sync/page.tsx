'use client';

import React from 'react';
import { RefreshCw, Wifi, WifiOff, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function AgentSyncPage() {
  const { isOnline, pendingCount, isSyncing, triggerSyncNow } = useOfflineSync();

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5 text-slate-100">
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3">
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Centre de Synchronisation Offline</span>
        </h1>
        <p className="text-xs text-slate-400">
          Gestion du stockage local IndexedDB et vidage de la file d'attente vers Supabase.
        </p>
      </div>

      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400">Statut de la Connexion Réseau</span>
          {isOnline ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Wifi className="w-4 h-4" /> En Ligne (4G/WiFi)
            </span>
          ) : (
            <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
              <WifiOff className="w-4 h-4" /> Hors-Ligne (Stockage Local)
            </span>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400">Actions en Attente de Réseau</span>
          <span className="font-mono font-bold text-indigo-400 text-sm">{pendingCount} éléments</span>
        </div>

        <button
          onClick={triggerSyncNow}
          disabled={isSyncing}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronisation en cours...' : 'Synchroniser Maintenant avec Supabase'}</span>
        </button>
      </div>
    </div>
  );
}
