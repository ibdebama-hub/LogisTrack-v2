'use client';

import React from 'react';
import { ShieldCheck, FileCheck, AlertTriangle, CheckCircle2, Clock, RefreshCw, Search } from 'lucide-react';
import PoDGalleryGrid from '@/components/modules/pod/PoDGalleryGrid';
import { usePoDEnterprise } from '@/hooks/usePoDEnterprise';

export default function PoDVerificationsPage() {
  const {
    pods,
    kpis,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refreshPoDs,
    approvePoD,
    downloadPdfCertificate
  } = usePoDEnterprise('tenant-101');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      {/* 1. TOP HEADER & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <span>Centre de Validation & Preuves de Livraison (POD Enterprise)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contrôle d'authenticité des signatures tactiles, empreintes SHA-256, photos et conformité GPS télé-écart.
          </p>
        </div>
      </div>

      {/* 2. POD ENTERPRISE KPI GRID CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Générées</span>
          <div className="text-xl font-extrabold text-white font-mono">{kpis.total_generated.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Base Supabase</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Validées / Certifiées</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.approved.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-500">Prêtes Facturation</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-amber-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">En Attente Audit</span>
          <div className="text-xl font-extrabold text-amber-300 font-mono">{kpis.pending.toLocaleString()}</div>
          <span className="text-[10px] text-amber-500">À vérifier</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-rose-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Rejetées</span>
          <div className="text-xl font-extrabold text-rose-300 font-mono">{kpis.rejected.toLocaleString()}</div>
          <span className="text-[10px] text-rose-500">Anomalies PoD</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/40 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Conformité GPS</span>
          <div className="text-xl font-extrabold text-emerald-300 font-mono">{kpis.gps_conformance_rate}%</div>
          <span className="text-[10px] text-emerald-500">Écart &lt; 50m</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Temps Moyen Audit</span>
          <div className="text-xl font-extrabold text-indigo-300 font-mono">{kpis.avg_validation_time_min} min</div>
          <span className="text-[10px] text-slate-500">Validation Dispatch</span>
        </div>
      </div>

      {/* 3. SEARCH & COMBINABLE FILTERS */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher n° POD, n° mission, client, destinataire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="PENDING">En Attente Audit</option>
            <option value="APPROVED">Certifiées / Approuvées</option>
            <option value="REJECTED">Rejetées</option>
          </select>

          <button
            onClick={refreshPoDs}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. GALLERY GRID */}
      <PoDGalleryGrid
        pods={pods}
        onApprovePoD={approvePoD}
        onDownloadPdf={downloadPdfCertificate}
      />
    </div>
  );
}
