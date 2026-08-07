'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Globe, Key, Sparkles, ArrowRight } from 'lucide-react';
import GlobalSaaSSettings from '@/components/modules/master-admin/settings/GlobalSaaSSettings';
import SystemIntegrations from '@/components/modules/master-admin/settings/SystemIntegrations';
import { DEFAULT_GLOBAL_SAAS_SETTINGS, DEFAULT_SYSTEM_INTEGRATIONS } from '@/lib/mockMasterSettingsData';
import { GlobalSaaSSettings as GlobalSettingsType, SystemIntegrationsConfig } from '@/types/masterSettings';

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'integrations'>('global');

  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsType>(DEFAULT_GLOBAL_SAAS_SETTINGS);
  const [integrationsConfig, setIntegrationsConfig] = useState<SystemIntegrationsConfig>(DEFAULT_SYSTEM_INTEGRATIONS);

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
              <Settings className="w-3 h-3" /> MASTER SYSTEM CONFIGURATION
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Paramètres Système & Configuration SaaS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion des devises maîtres, paramètres légaux et passerelles d'intégration.
          </p>
        </div>

        {/* LINK TO CENTRAL ONBOARDING CENTER */}
        <Link
          href="/master-admin/onboarding"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-extrabold text-xs shadow-lg shadow-violet-600/30 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Assistant Onboarding & Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'global'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Paramètres Globaux SaaS</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'integrations'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Passerelles & Webhooks</span>
        </button>
      </div>

      {/* TAB 1: GLOBAL SAAS SETTINGS */}
      {activeTab === 'global' && (
        <GlobalSaaSSettings
          settings={globalSettings}
          onSave={updated => setGlobalSettings(updated)}
        />
      )}

      {/* TAB 2: SYSTEM INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <SystemIntegrations
          config={integrationsConfig}
          onSave={updated => setIntegrationsConfig(updated)}
        />
      )}
    </div>
  );
}
