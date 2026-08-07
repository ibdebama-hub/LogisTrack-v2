'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  FileCheck,
  Award,
  DollarSign,
  Plus,
  ArrowUpRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import { SalesKpis, Lead } from '@/types/crm';
import { CrmService } from '@/lib/services/crmService';
import Link from 'next/link';

export default function CrmDashboardOverview() {
  const [kpis, setKpis] = useState<SalesKpis | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadCrmData();
  }, []);

  const loadCrmData = async () => {
    const dataKpis = await CrmService.fetchSalesKpis();
    const leads = await CrmService.fetchLeads();
    setKpis(dataKpis);
    setRecentLeads(leads);
  };

  if (!kpis) return null;

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit mb-1">
            <TrendingUp className="w-3 h-3" /> CRM COMMERCIAL & CUSTOMER LIFECYCLE MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Centre Commercial & Performance SaaS
          </h1>
          <p className="text-slate-400">
            Suivi du cycle de vie client : du premier prospect jusqu'à l'onboarding et l'activation d'abonnement MRR/ARR.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/master-admin/crm/pipeline"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pipeline Kanban (10 Étapes)</span>
          </Link>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Revenu Mensuel Récurrent (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {kpis.mrr_xof.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% ce mois-ci
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Revenu Annuel Récurrent (ARR)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {kpis.arr_xof.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">Objectif annuel réalisé à 82%</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Taux de Conversion Global</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">{kpis.conversion_rate_pct}%</div>
          <div className="text-[10px] text-sky-400 font-semibold font-mono">
            {kpis.contracts_signed} contrats signés / {kpis.total_leads} prospects
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Valeur Totale du Pipeline</span>
            <PieChart className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {kpis.pipeline_value_xof.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold font-mono">
            Durée moyenne cycle : {kpis.avg_sales_cycle_days} jours
          </div>
        </div>
      </div>

      {/* RECENT LEADS REGISTRY STREAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Derniers Prospects & Conversion en Client Actif</h3>
            <p className="text-slate-400 text-xs">Suivi en direct des opportunités commerciales et du statut d'onboarding.</p>
          </div>

          <Link
            href="/master-admin/crm/leads"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
          >
            Voir tous les prospects ({recentLeads.length})
          </Link>
        </div>

        <div className="space-y-3">
          {recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 transition-all font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-sm font-sans">{lead.company_name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Score: {lead.qualification_score}/100
                  </span>
                </div>
                <div className="text-slate-400 text-xs">
                  Contact: <strong className="text-slate-200">{lead.contact_name}</strong> ({lead.contact_email}) • {lead.country}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
                  {lead.stage}
                </span>
                <span className="text-slate-500 text-xs">{lead.assigned_sales_rep}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
