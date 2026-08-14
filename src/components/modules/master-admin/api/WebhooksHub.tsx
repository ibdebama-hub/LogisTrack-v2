'use client';

import React, { useState, useEffect } from 'react';
import { Webhook, Plus, CheckCircle2, AlertTriangle, Send, RefreshCw } from 'lucide-react';
import { WebhookEndpoint, WebhookDeliveryLog } from '../../../../types/webhooks';
import { WebhookService } from '../../../../lib/services/webhookService';

export default function WebhooksHub() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<WebhookDeliveryLog[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    const ep = await WebhookService.fetchEndpoints();
    const logs = await WebhookService.fetchDeliveryLogs();
    setEndpoints(ep);
    setDeliveryLogs(logs);
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim()) return;

    await WebhookService.createEndpoint({
      client_id: 'tenant-101',
      name: newName,
      url: newUrl,
      secret: `whsec_${Math.random().toString(36).slice(2)}`,
      subscribed_events: ['mission.created', 'mission.delivered', 'pod.certified'],
      is_active: true,
      retry_count: 3
    });

    setNewUrl('');
    setNewName('');
    await loadWebhooks();
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit mb-1">
            <Webhook className="w-3 h-3" /> MOTEUR DE WEBHOOKS ÉVÉNEMENTIEL
          </span>
          <h1 className="text-2xl font-black text-white">Gestionnaire des Webhooks & Notification Push</h1>
          <p className="text-slate-400">Diffusion d'événements temps réel avec signature HMAC-SHA256 et réessais automatiques.</p>
        </div>
      </div>

      {/* CREATE WEBHOOK FORM */}
      <form onSubmit={handleCreateWebhook} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Ajouter un nouvel abonnement Webhook</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Nom du Webhook (ex: Connecteur SAP ERP)..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />

          <input
            type="url"
            required
            placeholder="URL de destination HTTPS (ex: https://api.client.com/webhooks)..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Créer l'Abonnement Webhook
        </button>
      </form>

      {/* ENDPOINTS LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white text-sm">Abonnements Webhooks Actifs</h3>

        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{ep.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ACTIF
                  </span>
                </div>
                <div className="text-indigo-400 font-mono mt-1">{ep.url}</div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>Secret: {ep.secret}</span>
                  <span>•</span>
                  <span>Événements: {ep.subscribed_events.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => WebhookService.dispatchEvent('mission.delivered', 'tenant-101', { test: true })}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" /> Test Ping
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
