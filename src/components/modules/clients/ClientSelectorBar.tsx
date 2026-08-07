'use client';

import React, { useState } from 'react';
import {
  Building2,
  Filter,
  Layers,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import { Client, OperationType } from '../../../types/logistrack';
import CreateClientModal from './CreateClientModal';

export const MOCK_CLIENTS: Client[] = [
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
    id: 'cli-ecom',
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

interface ClientSelectorBarProps {
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  selectedOperationType: OperationType | 'ALL';
  onSelectOperationType: (opType: OperationType | 'ALL') => void;
}

export default function ClientSelectorBar({
  selectedClientId,
  onSelectClient,
  selectedOperationType,
  onSelectOperationType
}: ClientSelectorBarProps) {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleClientCreated = (newClient: Client) => {
    setClients([newClient, ...clients]);
    onSelectClient(newClient.id);
  };

  return (
    <div className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Client Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0 mr-1">
            <Building2 className="w-4 h-4 text-indigo-400" /> Donneur d&apos;Ordre :
          </span>

          <button
            onClick={() => onSelectClient('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedClientId === 'ALL'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Tous les Clients
          </button>

          {clients.map(cli => (
            <button
              key={cli.id}
              onClick={() => onSelectClient(cli.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border flex items-center gap-2 ${
                selectedClientId === cli.id
                  ? 'bg-slate-800 text-white border-slate-700 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cli.color }} />
              {cli.name}
            </button>
          ))}

          {/* Quick Create Client Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Nouveau Client
          </button>
        </div>

        {/* Operation Type Dropdown Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Type d&apos;Opération :</span>
            <select
              value={selectedOperationType}
              onChange={e => onSelectOperationType(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="ALL">Toutes les Opérations</option>
              <option value="MASS_INVOICE_DISTRIBUTION">Factures Grand Volume (Sans COD)</option>
              <option value="CONFIDENTIAL_MAIL">Plis Confidentiels / Recommandés</option>
              <option value="PARCEL_DELIVERY_COD">Colis E-Commerce (Cash on Delivery)</option>
              <option value="EXPRESS_COURIER">Courriers Simples / Express</option>
            </select>
          </div>
        </div>
      </div>

      {/* CREATE CLIENT MODAL */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
