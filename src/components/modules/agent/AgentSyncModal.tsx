'use client';

import React from 'react';
import { RefreshCw, Wifi, WifiOff, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useOfflineSync } from '../../../hooks/useOfflineSync';

interface AgentSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentSyncModal({ isOpen, onClose }: AgentSyncModalProps) {
  const { isOnline, pendingCount, isSyncing, triggerSyncNow } = useOfflineSync();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-5 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className={`w-5 h-5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Centre de Synchronisation</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">État du Réseau :</span>
            {isOnline ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Wifi className="w-4 h-4" /> Connecté (4G/WiFi)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <WifiOff className="w-4 h-4" /> Hors-ligne
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Éléments en Attente :</span>
            <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {pendingCount} actions
            </span>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Progression de Synchronisation</span>
              <span>{isSyncing ? '100%' : 'En attente'}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all ${
                  isSyncing ? 'w-full bg-gradient-to-r from-indigo-500 to-emerald-500 animate-pulse' : 'w-0'
                }`}
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Synchroniser Maintenant</span>
          </button>
        </div>
      </div>
    </div>
  );
}
