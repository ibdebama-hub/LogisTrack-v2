'use client';

import React from 'react';
import Link from 'next/link';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  RefreshCw,
  Wifi,
  WifiOff,
  UserCheck,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useAgentMissions } from '../../../hooks/useAgentMissions';
import { useGpsTracker } from '../../../hooks/useGpsTracker';
import { useOfflineSync } from '../../../hooks/useOfflineSync';

export default function AgentDashboardPage() {
  const { missions } = useAgentMissions('a1');
  const { isOnline, pendingCount, triggerSyncNow } = useOfflineSync();
  const { position, speed } = useGpsTracker('a1', true);

  const completedCount = missions.filter((m) => m.status === 'TERMINEE' || m.status === 'VALIDEE').length;
  const inProgressCount = missions.filter((m) => m.status === 'EN_COURS').length;
  const acceptedCount = missions.filter((m) => m.status === 'ACCEPTEE').length;
  const failedCount = missions.filter((m) => m.status === 'ECHOUEE').length;
  const totalReceived = missions.length;
  const successRate = totalReceived > 0 ? Math.round((completedCount / totalReceived) * 100) : 100;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5 text-slate-100">
      
      {/* 1. AGENT IDENTITY & ONLINE BADGE HEADER */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 font-black text-white flex items-center justify-center text-sm shadow-lg shadow-indigo-600/30">
              KJ
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Kouassi Jean-Marc</h1>
              <span className="text-xs text-indigo-400 font-semibold block">Agent Terrain Mobile • Zone Riviera</span>
            </div>
          </div>

          <div className="text-right">
            {isOnline ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> En Ligne
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1 animate-pulse">
                <WifiOff className="w-3 h-3" /> Hors-Ligne
              </span>
            )}
          </div>
        </div>

        {/* GPS REALTIME SPEED & POSITION SUB-BANNER */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-mono text-[11px]">
              GPS Live : {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Fixation GPS...'}
            </span>
          </div>
          <span className="font-mono text-indigo-400 font-bold text-[11px]">{speed.toFixed(0)} km/h</span>
        </div>
      </div>

      {/* 2. TODAY'S METRICS CARDS GRID */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Missions Aujourd'hui
        </h2>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">Missions Reçues</span>
            <div className="text-2xl font-black text-white font-mono">{totalReceived}</div>
            <span className="text-[10px] text-slate-500">Tournée du jour</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-blue-900/40 space-y-1">
            <span className="text-blue-400 text-[10px] block">En Cours / En Route</span>
            <div className="text-2xl font-black text-blue-300 font-mono">{inProgressCount}</div>
            <span className="text-[10px] text-blue-500">Livraisons GPS</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-900/40 space-y-1">
            <span className="text-emerald-400 text-[10px] block">Terminées / Certifiées</span>
            <div className="text-2xl font-black text-emerald-300 font-mono">{completedCount}</div>
            <span className="text-[10px] text-emerald-500">PoD Capturées</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-rose-900/40 space-y-1">
            <span className="text-rose-400 text-[10px] block">Échouées / Anomalies</span>
            <div className="text-2xl font-black text-rose-300 font-mono">{failedCount}</div>
            <span className="text-[10px] text-rose-500">Motifs déclarés</span>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE & ACTIVITY METRICS */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Performance & Activité
          </span>
          <span className="text-emerald-400 font-mono font-bold text-sm">{successRate}% Succès</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-slate-500 block">Temps de travail</span>
            <span className="font-mono font-bold text-slate-200">04h 25min</span>
          </div>
          <div>
            <span className="text-slate-500 block">Temps moyen / Mission</span>
            <span className="font-mono font-bold text-indigo-400">14 min</span>
          </div>
        </div>
      </div>

      {/* 4. OFFLINE SYNC STATUS CARD */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-white block">Synchronisation Offline</span>
            <span className="text-slate-400 text-[11px]">
              {pendingCount > 0 ? `${pendingCount} actions en attente de réseau` : 'Données 100% synchronisées avec Supabase'}
            </span>
          </div>

          <button
            onClick={triggerSyncNow}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 5. QUICK LAUNCH ACTION BUTTON */}
      <Link
        href="/agent/tournee"
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
      >
        <Navigation className="w-5 h-5" />
        <span>Démarrer ma Tournée du Jour</span>
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
