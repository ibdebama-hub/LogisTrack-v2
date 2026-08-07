'use client';

import React from 'react';
import {
  Activity,
  Building2,
  Users,
  HardDrive,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Server
} from 'lucide-react';
import { PlatformMonitoringKpis } from '@/types/saasPlatform';

interface PlatformMonitoringCenterProps {
  kpis: PlatformMonitoringKpis;
}

export default function PlatformMonitoringCenter({ kpis }: PlatformMonitoringCenterProps) {
  return (
    <div className="space-y-6 text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-indigo-400" />
            <span>Supervision & Monitoring Technique Plateforme SaaS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Console de contrôle de la santé système, de la consommation du stockage et du trafic API WebSockets.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Statut Plateforme : {kpis.system_health_status}</span>
        </div>
      </div>

      {/* KPI GRID CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organisations (Tenants)</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.total_tenants}</div>
          <span className="text-[10px] text-emerald-400 font-bold">{kpis.active_tenants} Actifs</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Utilisateurs Plateforme</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.total_users}</div>
          <span className="text-[10px] text-indigo-400 font-bold">{kpis.active_agents} Agents Terrain</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Missions Indexées</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.total_missions.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">PostgreSQL / Supabase</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stockage Consommé</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.storage_consumed_gb} GB</div>
          <span className="text-[10px] text-slate-500">Supabase Storage</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Requêtes API (24h)</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{(kpis.api_requests_24h / 1000).toFixed(1)}k</div>
          <span className="text-[10px] text-emerald-500 font-bold">100% Succès</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Uptime WebSockets</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">99.99%</div>
          <span className="text-[10px] text-emerald-500 font-bold">Supabase Realtime</span>
        </div>
      </div>
    </div>
  );
}
