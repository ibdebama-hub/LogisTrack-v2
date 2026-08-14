'use client';

import React, { useState } from 'react';
import { Key, Server, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SystemIntegrationsConfig } from '../../../../types/masterSettings';

interface SystemIntegrationsProps {
  config: SystemIntegrationsConfig;
  onSave: (updated: SystemIntegrationsConfig) => void;
}

export default function SystemIntegrations({ config, onSave }: SystemIntegrationsProps) {
  const [smsProvider, setSmsProvider] = useState(config.sms_provider);
  const [smsApiKey, setSmsApiKey] = useState(config.sms_api_key);
  const [smtpHost, setSmtpHost] = useState(config.smtp_host);
  const [smtpPort, setSmtpPort] = useState(config.smtp_port);
  const [smtpUser, setSmtpUser] = useState(config.smtp_user);
  const [supabaseUrl, setSupabaseUrl] = useState(config.supabase_url);
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState(config.supabase_service_role_key);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      sms_provider: smsProvider,
      sms_api_key: smsApiKey,
      smtp_host: smtpHost,
      smtp_port: smtpPort,
      smtp_user: smtpUser,
      supabase_url: supabaseUrl,
      supabase_service_role_key: supabaseServiceRoleKey
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-violet-900/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-4xl mx-auto text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Key className="w-6 h-6 text-violet-400" />
          Passerelles Système & Clés d'API Maître
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configuration des intégrations SMS, serveurs SMTP et clés de rôle de service Supabase Auth Admin.
        </p>
      </div>

      {/* SUPABASE AUTH ADMIN */}
      <div className="space-y-4">
        <h3 className="font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> 1. Configuration Supabase Service Role
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">URL du Projet Supabase</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Service Role Key (Supabase Auth Admin)</label>
            <input
              type="password"
              value={supabaseServiceRoleKey}
              onChange={e => setSupabaseServiceRoleKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* SYSTEM SMTP MAILER */}
      <div className="space-y-4 pt-2">
        <h3 className="font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" /> 2. Serveur SMTP d'Envoi d'Emails Système
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Hôte SMTP</label>
            <input
              type="text"
              value={smtpHost}
              onChange={e => setSmtpHost(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Port SMTP</label>
            <input
              type="number"
              value={smtpPort}
              onChange={e => setSmtpPort(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Identifiant Utilisateur SMTP</label>
            <input
              type="text"
              value={smtpUser}
              onChange={e => setSmtpUser(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Passerelles système enregistrées avec succès !</span>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Enregistrer la Configuration
        </button>
      </div>
    </form>
  );
}
