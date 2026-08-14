'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Key, ShieldCheck, Zap, AlertCircle, Edit3, Smartphone, Info } from 'lucide-react';
import { SmsGatewayConfigModel, SmsTemplate, SmsProviderType } from '../../../types/settings';

interface SmsGatewayConfigProps {
  gateways: SmsGatewayConfigModel[];
  templates: SmsTemplate[];
  onSaveGateways: (updated: SmsGatewayConfigModel[]) => void;
  onSaveTemplates: (updated: SmsTemplate[]) => void;
}

export default function SmsGatewayConfig({
  gateways,
  templates,
  onSaveGateways,
  onSaveTemplates
}: SmsGatewayConfigProps) {
  const [gatewayList, setGatewayList] = useState<SmsGatewayConfigModel[]>(gateways);
  const [templateList, setTemplateList] = useState<SmsTemplate[]>(templates);
  const [selectedProvider, setSelectedProvider] = useState<SmsProviderType>('ORANGE_SMS');

  // Test SMS Ping State
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Active provider item
  const activeGateway = gatewayList.find(g => g.provider === selectedProvider) || gatewayList[0];

  const handleProviderToggleActive = (provider: SmsProviderType) => {
    setGatewayList(prev =>
      prev.map(g => ({
        ...g,
        is_active: g.provider === provider
      }))
    );
  };

  const handleUpdateActiveGatewayFields = (fields: Partial<SmsGatewayConfigModel>) => {
    setGatewayList(prev =>
      prev.map(g => (g.provider === selectedProvider ? { ...g, ...fields } : g))
    );
  };

  const handleUpdateTemplateContent = (id: string, content: string) => {
    setTemplateList(prev =>
      prev.map(t => (t.id === id ? { ...t, content } : t))
    );
  };

  const handleInsertTag = (templateId: string, tag: string) => {
    setTemplateList(prev =>
      prev.map(t => {
        if (t.id === templateId) {
          return { ...t, content: `${t.content} ${tag}` };
        }
        return t;
      })
    );
  };

  // Run Test SMS Ping
  const handleRunTestPing = () => {
    if (!testPhoneNumber) return;
    setIsTesting(true);
    setTestStatus(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestStatus(`SMS de test envoyé avec succès au ${testPhoneNumber} via ${activeGateway.provider_name} ! (Ref: SMS-884210)`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. GATEWAY SELECTION & API KEYS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Passerelles SMS & OTP Régionales
            </h3>
            <p className="text-xs text-slate-400">
              Configuration des APIs d'envoi de SMS automatiques (avis de passage, codes OTP et preuves de remise).
            </p>
          </div>

          <button
            onClick={() => { onSaveGateways(gatewayList); onSaveTemplates(templateList); }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shrink-0 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Sauvegarder Config SMS
          </button>
        </div>

        {/* PROVIDERS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gatewayList.map(g => {
            const isSelected = selectedProvider === g.provider;
            return (
              <div
                key={g.provider}
                onClick={() => setSelectedProvider(g.provider)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white block">{g.provider_name}</span>
                  {g.is_active ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ACTIF
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-slate-500 bg-slate-900">
                      INACTIF
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  Crédits: <strong className="text-emerald-400">{g.sms_balance_credits.toLocaleString('fr-FR')} SMS</strong>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); handleProviderToggleActive(g.provider); }}
                  className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    g.is_active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g.is_active ? 'Passerelle Active' : 'Activer cette Passerelle'}
                </button>
              </div>
            );
          })}
        </div>

        {/* ACTIVE PROVIDER API KEYS & TEST PING */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> Clés d'API & Sender ID ({activeGateway.provider_name})
            </h4>
            <span className="text-xs font-mono text-indigo-400 font-semibold">Fournisseur sélectionné</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Clé d'API (API Key)</label>
              <input
                type="text"
                value={activeGateway.api_key}
                onChange={e => handleUpdateActiveGatewayFields({ api_key: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Clé Secrète (API Secret / Auth Token)</label>
              <input
                type="password"
                value={activeGateway.api_secret || ''}
                onChange={e => handleUpdateActiveGatewayFields({ api_secret: e.target.value })}
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nom d'Expéditeur (Sender ID)</label>
              <input
                type="text"
                value={activeGateway.sender_id}
                onChange={e => handleUpdateActiveGatewayFields({ sender_id: e.target.value })}
                placeholder="LOGISTRACK"
                maxLength={11}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* TEST SMS PING WIDGET */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Test d'Envoi SMS en Direct
            </h5>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={testPhoneNumber}
                  onChange={e => setTestPhoneNumber(e.target.value)}
                  placeholder="Ex: +224 620 00 00 00 ou +225 07 00 11 22"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleRunTestPing}
                disabled={isTesting || !testPhoneNumber}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Envoi...' : 'Envoyer SMS Test'}</span>
              </button>
            </div>

            {testStatus && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{testStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. GABARITS DE MESSAGES AUTOMATIQUES (SMS TEMPLATES) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            Gabarits de Messages Automatiques (SMS Templates)
          </h3>
          <p className="text-xs text-slate-400">
            Personnalisation des messages envoyés automatiquement aux destinataires avec balises dynamiques (`{`nom`}`, `{`ref`}`, `{`otp_code`}`, `{`agent`}`, `{`lien`}`).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateList.map(tmpl => (
            <div key={tmpl.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{tmpl.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {tmpl.event_trigger}
                </span>
              </div>

              {/* Textarea */}
              <textarea
                rows={3}
                value={tmpl.content}
                onChange={e => handleUpdateTemplateContent(tmpl.id, e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />

              {/* Tag inserters */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Balises:</span>
                {['{nom}', '{ref}', '{otp_code}', '{agent}', '{lien}'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tmpl.id, tag)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-mono text-[10px] border border-slate-700 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
