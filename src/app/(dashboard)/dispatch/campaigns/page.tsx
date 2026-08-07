'use client';

import React, { useState } from 'react';
import { Layers, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import CampaignsListTable from '@/components/modules/campaigns/CampaignsListTable';
import CampaignDetailView from '@/components/modules/campaigns/CampaignDetailView';
import CreateCampaignModal from '@/components/modules/campaigns/CreateCampaignModal';
import { MOCK_CAMPAIGNS } from '@/lib/mockCampaignsData';
import { CampaignItem } from '@/types/campaigns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(MOCK_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toggle Pause / Resume
  const handleTogglePause = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, status: c.status === 'EN_PAUSE' ? 'EN_COURS' : 'EN_PAUSE' }
          : c
      )
    );
  };

  // Close Campaign
  const handleCloseCampaign = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, status: 'CLÔTURÉE' } : c))
    );
  };

  // Add Created Campaign
  const handleCreateCampaign = (newCamp: Partial<CampaignItem>) => {
    const campaignToAdd: CampaignItem = {
      id: `camp-${Date.now()}`,
      reference: newCamp.reference || `CAMP-2026-${Math.floor(Math.random() * 900 + 100)}`,
      name: newCamp.name || 'Nouvelle Campagne',
      client_id: 'cli-default',
      client_name: newCamp.client_name || 'Client B2B',
      client_code: newCamp.client_code || 'CLI',
      operation_type: newCamp.operation_type || 'MASS_INVOICE_DISTRIBUTION',
      total_items: newCamp.total_items || 1000,
      delivered_items: 0,
      failed_items: 0,
      in_progress_items: 0,
      unassigned_items: newCamp.total_items || 1000,
      start_date: newCamp.start_date || '2026-08-10',
      due_date: newCamp.due_date || '2026-08-25',
      is_urgent: !!newCamp.is_urgent,
      status: 'PLANIFIÉE',
      batches_count: 1,
      agents_assigned_count: 0,
      zones_progress: newCamp.zones_progress || [],
      assigned_agents: [],
      incidents: []
    };

    setCampaigns([campaignToAdd, ...campaigns]);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> OPÉRATIONS DE DISTRIBUTION
            </span>
            <span className="text-slate-500 text-xs font-mono">• Dispatcher Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestion & Suivi des Campagnes de Distribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Supervision du cycle de vie des lots de factures, plis et colis confiés par les clients donneurs d'ordres.
          </p>
        </div>
      </div>

      {/* CAMPAIGNS LIST & GRID */}
      <CampaignsListTable
        campaigns={campaigns}
        onSelectCampaign={c => setSelectedCampaign(c)}
        onTogglePauseCampaign={handleTogglePause}
        onCloseCampaign={handleCloseCampaign}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* CAMPAIGN DETAIL VIEW DRAWER */}
      <CampaignDetailView
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />

      {/* CREATE CAMPAIGN MODAL */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </div>
  );
}
