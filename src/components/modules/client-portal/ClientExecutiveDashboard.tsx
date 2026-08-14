'use client';

import React from 'react';
import {
  TrendingUp,
  Layers,
  PackageCheck,
  ShieldCheck,
  Banknote,
  Clock,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { B2BExecutiveKpis, B2BAnalyticsPoint } from '../../../types/b2bClientPortal';
import { ReportFormat } from '../../../lib/services/b2bReportGenerator';

interface ClientExecutiveDashboardProps {
  clientName: string;
  kpis: B2BExecutiveKpis;
  analytics: B2BAnalyticsPoint[];
  onExportReport: (clientName: string, format: ReportFormat) => void;
}

export default function ClientExecutiveDashboard({
  clientName,
  kpis,
  analytics,
  onExportReport
}: ClientExecutiveDashboardProps) {
  return (
    <div className="space-y-6 text-slate-100">
      {/* HEADER & REPORT EXPORTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
            <span>Tableau de Bord Décisionnel — {clientName}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vue synthétique à 360° de vos opérations de distribution, preuves POD et recouvrements COD en temps réel.
          </p>
        </div>

        {/* DYNAMIC REPORT EXPORT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportReport(clientName, 'CSV')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onExportReport(clientName, 'PDF')}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <FileText className="w-4 h-4" />
            <span>Rapport PDF</span>
          </button>
        </div>
      </div>

      {/* KPI GRID CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campagnes Actives</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.active_campaigns}</div>
          <span className="text-[10px] text-emerald-400 font-bold">{kpis.completed_campaigns} Terminées</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Missions Livrées</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.delivered_missions.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Sur {kpis.total_missions.toLocaleString()} totales</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">PODs Disponibles</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.pod_available.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-400 font-bold">100% Certifiées</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">COD Encaissé</span>
          <div className="text-lg font-extrabold text-emerald-300 font-mono">{kpis.cod_collected.toLocaleString()} XOF</div>
          <span className="text-[10px] text-slate-400">Attendu : {kpis.cod_expected.toLocaleString()} XOF</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Respect SLA</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.sla_compliance_rate}%</div>
          <span className="text-[10px] text-emerald-500 font-bold">Objectif &gt; 95%</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Temps Moyen Livraison</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.avg_delivery_time_hours}h</div>
          <span className="text-[10px] text-slate-400">SLA 24h</span>
        </div>
      </div>

      {/* ANALYTICS CHART SIMULATION TABLE */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Évolution Quotidienne des Distributeurs & Encaissements</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Mise à jour Realtime WebSockets</span>
        </div>

        <div className="grid grid-cols-6 gap-2 text-xs text-center font-mono">
          {analytics.map((pt, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-slate-400 block font-bold text-[11px]">{pt.date}</span>
              <div className="h-16 flex items-end justify-center pb-1">
                <div
                  className="w-5 bg-indigo-600 rounded-t-md shadow-md"
                  style={{ height: `${(pt.delivered / 800) * 100}%` }}
                />
              </div>
              <span className="text-emerald-400 font-bold block">{pt.delivered} Livrés</span>
              <span className="text-indigo-300 block text-[10px]">{(pt.cod_collected / 1000000).toFixed(1)}M XOF</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
