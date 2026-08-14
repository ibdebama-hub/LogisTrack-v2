'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  User,
  Activity,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { OperationalTimelineEvent } from '../../../types/missionControl';

interface OperationalTimelineProps {
  events: OperationalTimelineEvent[];
}

export default function OperationalTimeline({ events }: OperationalTimelineProps) {
  const getCategoryIcon = (cat: OperationalTimelineEvent['category']) => {
    switch (cat) {
      case 'CAMPAIGN': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'IMPORT': return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case 'DISPATCH': return <Package className="w-4 h-4 text-amber-400" />;
      case 'AGENT': return <User className="w-4 h-4 text-blue-400" />;
      case 'INCIDENT': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'DELIVERY': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getSeverityBadge = (sev: OperationalTimelineEvent['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-400 border border-rose-800/60">Critique</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">Avertissement</span>;
      case 'success':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">Succès</span>;
      case 'info':
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">Info</span>;
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Journal Chronologique des Opérations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Historique temps réel des événements de dispatch, connexions agents et validations de missions
          </p>
        </div>

        <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-800/40 font-bold">
          {events.length} Événements
        </span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt) => (
          <div key={evt.id} className="relative flex items-start justify-between gap-4 group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-xs shadow-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 group-hover:animate-ping" />
            </div>

            {/* Event Body */}
            <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    {evt.timestamp}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-bold text-white">{evt.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getSeverityBadge(evt.severity)}
                </div>
              </div>

              <p className="text-xs text-slate-300">{evt.description}</p>

              {evt.actor && (
                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Opérateur/Agent :</span>
                  <strong className="text-slate-200">{evt.actor}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
