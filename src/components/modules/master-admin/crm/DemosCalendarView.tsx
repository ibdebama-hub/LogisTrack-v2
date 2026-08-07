'use client';

import React, { useState } from 'react';
import { Calendar, Video, MapPin, User, CheckCircle2, Clock, Plus } from 'lucide-react';
import { CommercialDemo } from '@/types/crm';

const MOCK_DEMOS: CommercialDemo[] = [
  {
    id: 'demo-1',
    lead_id: 'lead-101',
    lead_company_name: 'Sahel Distribution Express',
    scheduled_at: '2026-08-08 10:00',
    mode: 'VIRTUAL',
    sales_rep: 'Yves (Directeur Commercial)',
    participants: ['Ibrahim Traoré (Directeur Ops)', 'Mamadou Koné (IT Head)'],
    summary: 'Présentation du module cartographique et de l\'intégration WhatsApp.',
    status: 'SCHEDULED',
    created_at: '2026-08-02'
  },
  {
    id: 'demo-2',
    lead_id: 'lead-102',
    lead_company_name: 'Dakar Parcel Delivery',
    scheduled_at: '2026-08-09 14:30',
    mode: 'IN_PERSON',
    sales_rep: 'Mariam (Ingénieure Vente)',
    participants: ['Fatou Ndiaye (Gérante)'],
    summary: 'Démonstration au siège de Dakar avec test d\'impression de bordereaux.',
    status: 'SCHEDULED',
    created_at: '2026-08-04'
  }
];

export default function DemosCalendarView() {
  const [demos, setDemos] = useState<CommercialDemo[]>(MOCK_DEMOS);

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit mb-1">
            <Calendar className="w-3 h-3" /> CALENDRIER & RAPPORTS DE DÉMONSTRATIONS
          </span>
          <h1 className="text-2xl font-black text-white">Planning des Démonstrations Personnalisées</h1>
          <p className="text-slate-400">Organisation des sessions avant-vente en visioconférence ou en présentiel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demos.map((d) => (
          <div key={d.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-sm font-sans">{d.lead_company_name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold">
                {d.mode === 'VIRTUAL' ? '🎥 Visioconférence' : '📍 Présentiel'}
              </span>
            </div>

            <div className="text-amber-400 font-bold text-xs flex items-center gap-2">
              <Clock className="w-4 h-4" /> {d.scheduled_at}
            </div>

            <p className="text-slate-300 text-xs font-sans">{d.summary}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Resp: {d.sales_rep}</span>
              <span className="text-emerald-400 font-bold">Participants: {d.participants.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
