'use client';

import React from 'react';
import { Users, Truck, WifiOff, BatteryCharging, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FleetAgentFull } from '../../../types/agentFleet';

interface AgentStatusCardProps {
  agents: FleetAgentFull[];
}

export default function AgentStatusCard({ agents }: AgentStatusCardProps) {
  const totalAgents = agents.length;
  const activeInField = agents.filter(a => a.status === 'EN_TOURNÉE').length;
  const onBreak = agents.filter(a => a.status === 'EN_PAUSE').length;
  const available = agents.filter(a => a.status === 'DISPONIBLE').length;
  const offline = agents.filter(a => a.status === 'HORS_LIGNE').length;
  
  // Critical silence alerts (last ping > 45 minutes or telemetry marked critical)
  const criticalSignalAlerts = agents.filter(a => a.telemetry.is_signal_critical || a.status === 'HORS_LIGNE').length;

  // Average battery level
  const avgBattery = Math.round(
    agents.reduce((acc, curr) => acc + curr.telemetry.battery_level, 0) / (totalAgents || 1)
  );

  // Low battery count (< 15%)
  const lowBatteryCount = agents.filter(a => a.telemetry.battery_level < 15).length;

  // Total workload delivered ratio
  const totalAssigned = agents.reduce((acc, a) => acc + a.workload.total_assigned, 0);
  const totalDelivered = agents.reduce((acc, a) => acc + a.workload.delivered, 0);
  const globalProgress = totalAssigned > 0 ? Math.round((totalDelivered / totalAssigned) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL AGENTS ACTIFS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            FLOTTE ACTIVÉE
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalAgents}</span>
            <span className="text-xs text-slate-400 font-medium">agents enregistrés</span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {available} Dispo
            </span>
            <span className="text-amber-400 font-semibold">{onBreak} En pause</span>
          </div>
        </div>
      </div>

      {/* 2. EN TOURNÉE & PROGRESSION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            EN TOURNÉE LIVE
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{activeInField}</span>
            <span className="text-xs text-slate-400 font-semibold">
              en distribution ({globalProgress}% remises)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
              <span>{totalDelivered} remis</span>
              <span>{totalAssigned} attribués</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HORS-LIGNE & ALERTE SIGNAL */}
      <div className={`bg-slate-900/90 border rounded-2xl p-4 shadow-lg flex flex-col justify-between relative overflow-hidden group transition-all ${
        criticalSignalAlerts > 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800 hover:border-slate-700'
      }`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            PERTE DE SIGNAL GPS
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            criticalSignalAlerts > 0
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <WifiOff className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${offline > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {offline}
            </span>
            <span className="text-xs text-slate-400 font-medium">agents hors-ligne</span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            {criticalSignalAlerts > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> {criticalSignalAlerts} alerte &gt; 45 min
              </span>
            ) : (
              <span className="text-slate-400">Aucun signal critique</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. NIVEAU MOYEN DE BATTERIE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            BATTERIE MOYENNE
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <BatteryCharging className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${avgBattery < 30 ? 'text-amber-400' : 'text-white'}`}>
              {avgBattery}%
            </span>
            <span className="text-xs text-slate-400 font-medium">charge globale</span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            {lowBatteryCount > 0 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {lowBatteryCount} appareil &lt; 15%
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Télémétrie optimale</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
