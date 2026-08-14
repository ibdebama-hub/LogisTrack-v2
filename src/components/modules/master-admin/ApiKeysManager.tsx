'use client';

import React, { useState } from 'react';
import { Key, Plus, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { ApiKeyItem } from '../../../types/saasPlatform';

interface ApiKeysManagerProps {
  apiKeys: ApiKeyItem[];
  onCreateKey: (tenantId: string, name: string) => void;
}

export default function ApiKeysManager({ apiKeys, onCreateKey }: ApiKeysManagerProps) {
  const [keyName, setKeyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    onCreateKey('tenant-101', keyName);
    setKeyName('');
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>Gestionnaire des Clés API Publiques & Quotas Rate-Limiting</span>
        </h2>
        <span className="text-slate-400 font-mono text-[11px]">Accès REST Externalisé</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <input
          type="text"
          placeholder="Nom de la nouvelle clé API (ex: Connecteur ERP)..."
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Générer Clé API</span>
        </button>
      </form>

      <div className="space-y-2">
        {apiKeys.map((k) => (
          <div key={k.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
            <div className="space-y-1">
              <span className="font-bold text-white block text-sm">{k.key_name}</span>
              <span className="text-emerald-400 font-mono font-bold block">{k.masked_key}</span>
              <span className="text-[10px] text-slate-400 block">Quota Rate-Limit : {k.rate_limit_per_min} req/min</span>
            </div>

            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold rounded-full text-[10px]">
              🟢 ACTIVE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
