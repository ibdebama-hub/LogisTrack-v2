'use client';

import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Radio, Sparkles } from 'lucide-react';
import AgentStatusCard from '../../../components/modules/agents/AgentStatusCard';
import AgentFleetTable from '../../../components/modules/agents/AgentFleetTable';
import AgentFormModal from '../../../components/modules/agents/AgentFormModal';
import AgentDetailDrawer from '../../../components/modules/agents/AgentDetailDrawer';
import { MOCK_FLEET_AGENTS } from '../../../lib/mockAgentsData';
import { FleetAgentFull } from '../../../types/agentFleet';

export default function AgentFleetPage() {
  const [agentsList, setAgentsList] = useState<FleetAgentFull[]>(MOCK_FLEET_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<FleetAgentFull | null>(null);
  const [agentToEdit, setAgentToEdit] = useState<FleetAgentFull | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle manual sync simulation
  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  // Open Creation Modal
  const handleOpenCreateModal = () => {
    setAgentToEdit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (agent: FleetAgentFull) => {
    setAgentToEdit(agent);
    setIsFormModalOpen(true);
  };

  // Handle Save Agent (Creation or Modification)
  const handleSaveAgent = (agentData: Partial<FleetAgentFull>) => {
    if (agentToEdit) {
      // Edit mode
      setAgentsList(prev =>
        prev.map(a =>
          a.id === agentToEdit.id
            ? {
                ...a,
                ...agentData,
                vehicle: {
                  ...a.vehicle,
                  ...agentData.vehicle
                }
              }
            : a
        )
      );
    } else {
      // Creation mode
      const newId = `agent-${Date.now()}`;
      const newAgent: FleetAgentFull = {
        id: newId,
        full_name: agentData.full_name || 'Nouvel Agent',
        email: agentData.email || '',
        phone: agentData.phone || '',
        role: agentData.role || 'field_agent',
        status: 'DISPONIBLE',
        account_status: agentData.account_status || 'ACTIF',
        pwa_pin: agentData.pwa_pin || '1234',
        primary_zone_id: 'zone-1',
        primary_zone_name: agentData.primary_zone_name || 'Kaloum Centre-Ville',
        primary_zone_code: agentData.primary_zone_code || 'Z-KAL',
        district_names: agentData.district_names || ['Centre'],
        assigned_zone_names: agentData.assigned_zone_names || [agentData.primary_zone_name || 'Kaloum Centre-Ville'],
        assigned_district_names: agentData.assigned_district_names || agentData.district_names || ['Centre'],
        allowed_client_names: agentData.allowed_client_names || ['Tous (Polyvalent)'],
        allowed_operation_types: agentData.allowed_operation_types || ['Distribution Factures', 'Plis Confidentiels', 'Livraisons Colis COD'],
        max_cod_cash_ceiling: agentData.max_cod_cash_ceiling || 1000000,
        vehicle: agentData.vehicle || { type: 'MOTO', equipment_id: 'MOT-000' },
        telemetry: {
          battery_level: 100,
          gps_status: 'EXCELLENT',
          gps_lat: 9.5092,
          gps_lng: -13.7122,
          network_mode: '4G',
          last_ping_at: 'À l\'instant',
          pwa_version: 'v2.4.1'
        },
        workload: { total_assigned: 0, delivered: 0, remaining: 0, failed: 0 },
        cod: { collected_today: 0, pending_discharge: 0 },
        performance: {
          success_rate: 100,
          avg_time_per_delivery: '10 min',
          npai_rate: 0,
          reconciliation_score: 'Nouveau'
        },
        route_history: []
      };

      setAgentsList([newAgent, ...agentsList]);
    }

    setIsFormModalOpen(false);
    setAgentToEdit(null);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER PAGE BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> TÉLÉMÉTRIE EN TEMPS RÉEL
            </span>
            <span className="text-slate-500 text-xs font-mono">• Supabase WebSockets Sync</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestion & Suivi de la Flotte d'Agents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Poste de contrôle dispatcher : connectivité PWA, télémétrie batterie/GPS, solde caisse COD et suivi des tournées terrain.
          </p>
        </div>

        {/* Sync telemetry action button */}
        <button
          onClick={handleSyncTelemetry}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shrink-0 shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Actualisation...' : 'Rafraîchir Pings'}</span>
        </button>
      </div>

      {/* SECTION 1: STATUS CARDS KPI */}
      <AgentStatusCard agents={agentsList} />

      {/* SECTION 2: FLEET TABLE & GRID */}
      <AgentFleetTable
        agents={agentsList}
        onSelectAgent={agent => setSelectedAgent(agent)}
        onEditAgent={handleOpenEditModal}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* MODAL: CREATE OR EDIT AGENT (ADVANCED 4 SECTIONS) */}
      <AgentFormModal
        isOpen={isFormModalOpen}
        agentToEdit={agentToEdit}
        onClose={() => { setIsFormModalOpen(false); setAgentToEdit(null); }}
        onSave={handleSaveAgent}
      />

      {/* DRAWER: AGENT DETAILS & GPS ROUTE */}
      <AgentDetailDrawer
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
