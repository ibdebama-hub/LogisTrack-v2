'use client';

import React, { useState, useEffect } from 'react';
import { Kanban, Sparkles, Building2, UserCheck, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Lead, LeadStage } from '../../../../types/crm';
import { CrmService } from '../../../../lib/services/crmService';

const PIPELINE_COLUMNS: { id: LeadStage; title: string; color: string }[] = [
  { id: 'NEW', title: 'Nouveau Prospect', color: 'border-indigo-500 text-indigo-400' },
  { id: 'CONTACTED', title: 'Contact Établi', color: 'border-sky-500 text-sky-400' },
  { id: 'QUALIFIED', title: 'Qualification', color: 'border-amber-500 text-amber-400' },
  { id: 'DEMO_SCHEDULED', title: 'Démo Planifiée', color: 'border-purple-500 text-purple-400' },
  { id: 'DEMO_COMPLETED', title: 'Démo Réalisée', color: 'border-violet-500 text-violet-400' },
  { id: 'PROPOSAL_SENT', title: 'Proposition Envoyée', color: 'border-blue-500 text-blue-400' },
  { id: 'NEGOTIATION', title: 'Négociation', color: 'border-orange-500 text-orange-400' },
  { id: 'CONTRACT_SIGNED', title: 'Contrat Signé', color: 'border-emerald-500 text-emerald-400' },
  { id: 'ACTIVATION', title: 'Activation', color: 'border-teal-500 text-teal-400' },
  { id: 'ACTIVE_CLIENT', title: 'Client Actif', color: 'border-emerald-400 text-emerald-300' }
];

export default function SalesPipelineKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await CrmService.fetchLeads();
    setLeads(data);
  };

  const handleMoveStage = async (leadId: string, nextStage: LeadStage) => {
    await CrmService.updateLeadStage(leadId, nextStage);
    await loadLeads();
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit mb-1">
            <Kanban className="w-3 h-3" /> PIPELINE COMMERCIAL KANBAN (10 ÉTAPES)
          </span>
          <h1 className="text-2xl font-black text-white">Pipeline de Conversion des Prospects</h1>
          <p className="text-slate-400">Suivi visuel du cycle d'acquisition depuis la qualification jusqu'au contrat signé et onboarding.</p>
        </div>
      </div>

      {/* KANBAN BOARD COLUMNS */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {PIPELINE_COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.id);
          return (
            <div key={col.id} className="min-w-[260px] w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shrink-0">
              <div>
                <div className={`p-2.5 rounded-xl border mb-4 flex items-center justify-between font-bold ${col.color}`}>
                  <span className="truncate">{col.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 text-white font-mono text-[10px]">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-amber-500/50 transition-all font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs font-sans truncate">{lead.company_name}</span>
                        <span className="text-[10px] text-amber-400 font-bold">{lead.qualification_score}/100</span>
                      </div>

                      <div className="text-[10px] text-slate-400">
                        {lead.contact_name} • <span className="text-slate-300">{lead.contact_phone}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">{lead.estimated_agents} agents</span>

                        {/* STAGE SELECTOR */}
                        <select
                          value={lead.stage}
                          onChange={(e) => handleMoveStage(lead.id, e.target.value as LeadStage)}
                          className="bg-slate-900 border border-slate-800 text-amber-300 text-[10px] font-bold rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          {PIPELINE_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
