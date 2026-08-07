'use client';

import React from 'react';
import { History, ShieldCheck, User } from 'lucide-react';
import { PlatformAuditLog } from '@/types/saasPlatform';

interface SaaSAuditLogViewerProps {
  audits: PlatformAuditLog[];
}

export default function SaaSAuditLogViewer({ audits }: SaaSAuditLogViewerProps) {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>Journal d'Audit Global de la Plateforme (Super Admin Logs)</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">Traçabilité Immuable</span>
      </div>

      <div className="space-y-2">
        {audits.map((a) => (
          <div key={a.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-indigo-400">{a.action_type}</span>
              <span className="text-slate-500 text-[10px]">{a.created_at}</span>
            </div>
            <p className="text-slate-200 font-semibold">{a.details}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
              <span>Effectué par : {a.performed_by}</span>
              <span>Cible : {a.target_tenant_name || 'Plateforme'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
