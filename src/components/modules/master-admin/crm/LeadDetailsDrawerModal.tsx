'use client';

import React, { useState, useEffect } from 'react';
import { Building2, User, Phone, Mail, Globe, Clock, MessageSquare, Plus, CheckCircle2, X } from 'lucide-react';
import { Lead, InteractionLog } from '@/types/crm';
import { CrmService } from '@/lib/services/crmService';

interface LeadDetailsDrawerModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsDrawerModal({ lead, isOpen, onClose }: LeadDetailsDrawerModalProps) {
  const [interactions, setInteractions] = useState<InteractionLog[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState<InteractionLog['interaction_type']>('CALL');

  useEffect(() => {
    if (lead) {
      CrmService.fetchInteractions(lead.id).then(setInteractions);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    await CrmService.addInteraction(lead.id, newType, newNote);
    setNewNote('');
    const updated = await CrmService.fetchInteractions(lead.id);
    setInteractions(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-6 text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{lead.company_name}</h2>
              <div className="text-slate-400 font-mono">Fiche Prospect & Qualification Commerciale</div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4 font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-bold block text-[10px]">CONTACT PRINCIPAL</span>
            <span className="text-white font-bold block text-sm">{lead.contact_name}</span>
            <span className="text-slate-400 text-[11px] block">{lead.contact_job_title}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-bold block text-[10px]">SCORE DE QUALIFICATION</span>
            <span className="text-amber-400 font-bold block text-xl">{lead.qualification_score} / 100</span>
            <span className="text-slate-400 text-[10px] block">Potentiel élevé</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-bold block text-[10px]">ÉTIQUETTE LOGISTIQUE</span>
            <span className="text-white font-bold block">{lead.estimated_agents} agents de flotte</span>
            <span className="text-slate-400 text-[11px] block">~{lead.estimated_monthly_missions} missions / mois</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-bold block text-[10px]">COMMERCIAL ASSIGNÉ</span>
            <span className="text-indigo-400 font-bold block">{lead.assigned_sales_rep}</span>
            <span className="text-slate-400 text-[10px] block">Canal: {lead.acquisition_channel}</span>
          </div>
        </div>

        {/* ADD INTERACTION FORM */}
        <form onSubmit={handleAddNote} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-sm">Ajouter une Interaction Commerciale</h3>

          <div className="flex gap-2">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-white px-3 py-2 text-xs font-mono"
            >
              <option value="CALL">Appel Téléphonique</option>
              <option value="MEETING">Réunion / Visio</option>
              <option value="EMAIL">E-mail</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="NOTE">Note Interne</option>
            </select>

            <input
              type="text"
              required
              placeholder="Saisissez le compte-rendu de l'échange..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />

            <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* TIMELINE OF INTERACTIONS */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm">Historique Chronologique des Échanges</h3>

          {interactions.map((int) => (
            <div key={int.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-amber-400">{int.interaction_type}</span>
                <span className="text-[10px]">{new Date(int.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <p className="text-slate-200">{int.summary}</p>
              <span className="text-[10px] text-slate-500 block">Par: {int.author_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
