'use client';

import React, { useState } from 'react';
import {
  X,
  Layers,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Phone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CampaignItem } from '@/types/campaigns';

interface CampaignDetailViewProps {
  campaign: CampaignItem | null;
  onClose: () => void;
}

export default function CampaignDetailView({ campaign, onClose }: CampaignDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'zones' | 'agents' | 'incidents'>('metrics');

  if (!campaign) return null;

  const completionRate = Math.round((campaign.delivered_items / campaign.total_items) * 100);
  const failureRate = ((campaign.failed_items / campaign.total_items) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-3xl h-full shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {campaign.reference}
              </span>
              <span className="text-slate-400">• {campaign.client_name}</span>
            </div>

            <h2 className="text-xl font-black text-white">{campaign.name}</h2>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 font-semibold text-xs gap-6">
          {[
            { id: 'metrics', label: '1. Synthèse & KPIs', icon: TrendingUp },
            { id: 'zones', label: '2. Ventilation Zones', icon: MapPin },
            { id: 'agents', label: '3. Agents Mobilisés', icon: Users },
            { id: 'incidents', label: '4. Incidents & NPAI', icon: AlertTriangle }
          ].map(t => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                  isActive ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB BODY SCROLLABLE */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* TAB 1: SYNTHÈSE & KPIS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Taux de Complétion</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{completionRate}%</div>
                  <span className="text-[10px] text-slate-400 block">{campaign.delivered_items} / {campaign.total_items} livrés</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Taux d'Échecs (NPAI)</span>
                  <div className="text-2xl font-black text-rose-400 font-mono">{failureRate}%</div>
                  <span className="text-[10px] text-slate-400 block">{campaign.failed_items} retours anomalie</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Échéance Contractuelle</span>
                  <div className="text-base font-black text-white font-mono">{campaign.due_date}</div>
                  <span className="text-[10px] text-amber-400 font-semibold block">Lancement: {campaign.start_date}</span>
                </div>
              </div>

              {/* Multi-color progress bar */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Répartition du Lot Globale ({campaign.total_items.toLocaleString('fr-FR')} items)</span>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(campaign.delivered_items / campaign.total_items) * 100}%` }} className="bg-emerald-500 h-full" title="Livrés" />
                  <div style={{ width: `${(campaign.failed_items / campaign.total_items) * 100}%` }} className="bg-rose-500 h-full" title="Échecs" />
                  <div style={{ width: `${(campaign.in_progress_items / campaign.total_items) * 100}%` }} className="bg-amber-500 h-full" title="En cours" />
                  <div style={{ width: `${(campaign.unassigned_items / campaign.total_items) * 100}%` }} className="bg-slate-700 h-full" title="Non assignés" />
                </div>

                <div className="flex flex-wrap gap-4 text-[11px] font-mono pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Livrés ({campaign.delivered_items})</span>
                  <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Échecs ({campaign.failed_items})</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> En cours ({campaign.in_progress_items})</span>
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded bg-slate-700" /> Non assignés ({campaign.unassigned_items})</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VENTILATION ZONES */}
          {activeTab === 'zones' && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="font-bold text-white text-sm">Avancement par Zone & Secteur Opérationnel</h4>
              <div className="space-y-3">
                {campaign.zones_progress.map(z => {
                  const pct = Math.round((z.delivered / z.total) * 100);
                  return (
                    <div key={z.zone_name} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-200 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {z.zone_name}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{z.delivered}/{z.total} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AGENTS MOBILISÉS */}
          {activeTab === 'agents' && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="font-bold text-white text-sm">Performances Indivduelles des Livreurs Mobilisés</h4>
              <div className="space-y-3">
                {campaign.assigned_agents.map(ag => (
                  <div key={ag.agent_id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block text-sm">{ag.agent_name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{ag.agent_phone}</span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-emerald-400 font-bold block">{ag.delivered} / {ag.total_assigned} livrés</span>
                      <span className="text-slate-400 text-[10px]">Taux réussite: {ag.success_rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INCIDENTS & NPAI */}
          {activeTab === 'incidents' && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="font-bold text-white text-sm">Journal des Anomalies Signalees (NPAI)</h4>
              {campaign.incidents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono">
                  Aucune anomalie critique enregistrée sur cette campagne.
                </div>
              ) : (
                <div className="space-y-3">
                  {campaign.incidents.map(inc => (
                    <div key={inc.id} className="bg-slate-950 p-4 rounded-2xl border border-rose-900/40 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-rose-400">{inc.tracking_ref}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                          {inc.status}
                        </span>
                      </div>
                      <div className="text-white font-semibold">{inc.recipient_name} — {inc.recipient_address}</div>
                      <div className="text-slate-400 text-[11px]">Motif: <strong className="text-slate-200">{inc.reason}</strong></div>
                      <div className="text-[10px] text-slate-500 font-mono">Signalé par {inc.agent_name} le {inc.reported_at}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
