'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Database, ShoppingBag, Smartphone, CheckCircle2, RefreshCw } from 'lucide-react';
import { IntegrationConnector } from '../../../../types/integrations';
import { IntegrationService } from '../../../../lib/services/integrationService';

export default function IntegrationConnectorsHub() {
  const [connectors, setConnectors] = useState<IntegrationConnector[]>([]);

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    const list = await IntegrationService.fetchConnectors();
    setConnectors(list);
  };

  const handleToggle = async (id: string) => {
    await IntegrationService.toggleConnectorStatus(id);
    await loadConnectors();
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit mb-1">
            <Layers className="w-3 h-3" /> CONNECTEURS ENTERPRISE MULTI-SYSTÈMES
          </span>
          <h1 className="text-2xl font-black text-white">Centre de Contrôle des Connecteurs ERP / CRM & Mobile Money</h1>
          <p className="text-slate-400">Interfaçage bidirectionnel avec SAP, Oracle, Odoo, Salesforce, Shopify & passerelles de paiement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connectors.map((c) => (
          <div key={c.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {c.category}
              </span>
              <button
                onClick={() => handleToggle(c.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                  c.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {c.status}
              </button>
            </div>

            <h4 className="font-bold text-white text-sm">{c.name}</h4>
            <div className="text-slate-400 font-mono text-[11px] truncate">{c.base_url}</div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Fréquence: {c.sync_frequency_minutes} min</span>
              <span className="text-emerald-400 font-mono font-bold">{c.last_synced_at}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
