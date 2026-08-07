'use client';

import React from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  ShieldCheck,
  Banknote,
  Award,
  FileSpreadsheet,
  FileText,
  Activity,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { BiExecutiveKpis, BiRoleView } from '@/types/biAnalytics';

interface BiExecutiveDashboardProps {
  kpis: BiExecutiveKpis;
  activeRoleView: BiRoleView;
  onSelectRoleView: (role: BiRoleView) => void;
  onExportReport: (format: 'CSV' | 'PDF' | 'EXCEL') => void;
}

export default function BiExecutiveDashboard({
  kpis,
  activeRoleView,
  onSelectRoleView,
  onExportReport
}: BiExecutiveDashboardProps) {
  const roleViews: Array<{ key: BiRoleView; label: string; icon: any }> = [
    { key: 'EXECUTIVE', label: 'Direction Générale', icon: Building2 },
    { key: 'OPERATIONS', label: 'Responsable Opérations', icon: Layers },
    { key: 'SUPERVISOR', label: 'Superviseur Terrain', icon: Users },
    { key: 'FINANCE', label: 'Responsable Financier', icon: Banknote },
    { key: 'QUALITY', label: 'Responsable Qualité', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* TOP HEADER & EXPORT BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
            <span>Centre de Business Intelligence (BI) Enterprise</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyse décisionnelle à 360°, prédictions de performance et scorecards automatiques.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportReport('CSV')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onExportReport('PDF')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <FileText className="w-4 h-4" />
            <span>Rapport Exécutif PDF</span>
          </button>
        </div>
      </div>

      {/* ROLE-BASED DASHBOARD TABS */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-1 text-xs">
        {roleViews.map((item) => {
          const isActive = activeRoleView === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSelectRoleView(item.key)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI GRID CARDS (ADAPTED BY ROLE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campagnes Actives</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.active_campaigns}</div>
          <span className="text-[10px] text-emerald-400 font-bold">{kpis.completed_campaigns} Clôturées</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Missions Livrées</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.delivered_missions.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Sur {kpis.total_missions.toLocaleString()} totales</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Respect SLA</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.sla_compliance_rate}%</div>
          <span className="text-[10px] text-emerald-400 font-bold">Conforme SLA 24h</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">PODs Validées</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.pod_validated.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-400 font-bold">100% Preuves Scellées</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">COD Encaissé</span>
          <div className="text-lg font-extrabold text-emerald-300 font-mono">{kpis.cod_collected.toLocaleString()} XOF</div>
          <span className="text-[10px] text-slate-400">Sur {kpis.cod_expected.toLocaleString()} XOF</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-indigo-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Taux Recouvrement</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.cod_recovery_rate}%</div>
          <span className="text-[10px] text-emerald-400 font-bold">Performance Caisse</span>
        </div>
      </div>
    </div>
  );
}
