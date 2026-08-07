'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  Layers,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';
import { Client } from '../../../types/logistrack';
import CreateClientModal from './CreateClientModal';

export const MOCK_CLIENT_LIST: Client[] = [
  {
    id: 'cli-orange',
    organization_id: 'org-1',
    name: 'Orange Mali / CI',
    code: 'ORA-B2B',
    contact_email: 'b2b@orange.ml',
    contact_phone: '+223 70 00 00 01',
    contract_type: 'corporate_key_account',
    color: '#FF7900',
    active_campaigns_count: 3
  },
  {
    id: 'cli-cie',
    organization_id: 'org-1',
    name: 'EDM / CIE Électricité',
    code: 'EDM-CIE',
    contact_email: 'distribution@cie.ci',
    contact_phone: '+225 27 20 00 00',
    contract_type: 'corporate_key_account',
    color: '#10B981',
    active_campaigns_count: 5
  },
  {
    id: 'cli-sib',
    organization_id: 'org-1',
    name: 'Société Ivoirienne de Banque (SIB)',
    code: 'SIB-BANK',
    contact_email: 'courriers@sib.ci',
    contact_phone: '+225 27 20 20 00',
    contract_type: 'corporate_key_account',
    color: '#4F46E5',
    active_campaigns_count: 2
  },
  {
    id: 'cli-jumia',
    organization_id: 'org-1',
    name: 'Jumia / E-Commerce Merchants',
    code: 'ECOM-COD',
    contact_email: 'logistics@jumia.ci',
    contact_phone: '+225 07 07 00 00',
    contract_type: 'ecommerce_merchant',
    color: '#F59E0B',
    active_campaigns_count: 4
  }
];

export default function ClientListTable() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENT_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientCreated = (newClient: Client) => {
    setClients([newClient, ...clients]);
  };

  const filteredClients = clients.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Action Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, code ou email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Ajouter un Nouveau Client Donneur d&apos;Ordre
        </button>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(cli => (
          <div
            key={cli.id}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all"
          >
            {/* Color Stripe Header */}
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: cli.color }} />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl font-mono font-bold text-sm text-white flex items-center justify-center border border-slate-700 shadow"
                  style={{ backgroundColor: cli.color }}
                >
                  {cli.code.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{cli.name}</h3>
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 text-[10px] font-mono rounded border border-slate-800 uppercase font-semibold">
                    {cli.contract_type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <span className="px-2 py-1 bg-emerald-950 text-emerald-300 font-bold text-[10px] rounded-lg border border-emerald-800/40">
                Actif
              </span>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{cli.contact_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono">{cli.contact_phone}</span>
              </div>
            </div>

            {/* Campaign Stats & Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-300 font-bold">
                {cli.active_campaigns_count} Campagnes actives
              </span>

              <div className="flex items-center gap-2">
                <a
                  href="/overview"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE CLIENT MODAL */}
      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
