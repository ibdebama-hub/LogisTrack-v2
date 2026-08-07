'use client';

import React from 'react';
import { LifeBuoy, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { SupportTicket } from '@/types/saasPlatform';

interface SupportTicketHubProps {
  tickets: SupportTicket[];
}

export default function SupportTicketHub({ tickets }: SupportTicketHubProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-amber-400" />
          <span>Centre de Support B2B & Resolution de Tickets</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">{tickets.length} Tickets Enregistrés</span>
      </div>

      <div className="space-y-2">
        {tickets.map((t) => (
          <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-amber-400">{t.ticket_number}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                {t.status}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm">{t.subject}</h3>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900 font-mono">
              <span>Client : {t.tenant_name}</span>
              <span>Priorité : {t.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
