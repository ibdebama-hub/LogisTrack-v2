'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Map,
  Clock,
  Filter,
  Users,
  Search,
  SlidersHorizontal,
  X,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Zap,
  LayoutGrid
} from 'lucide-react';
import MissionControlHeader from './MissionControlHeader';
import DispatcherKpiGrid from './DispatcherKpiGrid';
import MissionControlKanban from './MissionControlKanban';
import BatchAssignment from './BatchAssignment';
import LiveDispatcherMap from '../maps/LiveDispatcherMap';
import OperationalTimeline from './OperationalTimeline';
import DispatcherNotificationDrawer from './DispatcherNotificationDrawer';
import CreateCampaignWizardModal from './CreateCampaignWizardModal';
import BatchAssignmentModal from './BatchAssignmentModal';
import { useMissionControl } from '@/hooks/useMissionControl';

import {
  DispatchLot,
  LotPriority,
  LotStatus
} from '@/types/missionControl';

export default function MissionControlHub() {
  // Use Unified Mission Control Custom Hook connected to Supabase & Services Layer
  const {
    kpis,
    lots,
    setLots,
    campaigns,
    timelineEvents,
    notifications,
    isLoading,
    refreshAll,
    changeBatchStatus,
    reassignBatchAgents,
    addCampaign,
    addEvent,
    markAllRead,
    clearAll
  } = useMissionControl('tenant-101');

  // UI State
  const [activeTab, setActiveTab] = useState<'kanban' | 'lots' | 'map' | 'timeline'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Filters State
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedAgent, setSelectedAgent] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<LotStatus | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<LotPriority | 'ALL'>('ALL');

  // Modals & Drawers
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedLotForAssign, setSelectedLotForAssign] = useState<DispatchLot | null>(null);

  // Filter Logic
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      // 1. Search Query Instant Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          lot.lot_number.toLowerCase().includes(q) ||
          lot.name.toLowerCase().includes(q) ||
          lot.campaign_reference.toLowerCase().includes(q) ||
          lot.client_name.toLowerCase().includes(q) ||
          lot.zone_name.toLowerCase().includes(q) ||
          lot.assigned_agents.some((a) => a.name.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. KPI Filter Shortcuts
      if (activeKpiFilter === 'delayed' && lot.priority !== 'URGENTE') return false;
      if (activeKpiFilter === 'campaigns' && lot.status === 'TERMINE') return false;

      // 3. Dropdown Filters
      if (selectedClient !== 'ALL' && lot.client_id !== selectedClient) return false;
      if (selectedZone !== 'ALL' && lot.zone_code !== selectedZone) return false;
      if (selectedStatus !== 'ALL' && lot.status !== selectedStatus) return false;
      if (selectedPriority !== 'ALL' && lot.priority !== selectedPriority) return false;

      return true;
    });
  }, [lots, searchQuery, activeKpiFilter, selectedClient, selectedZone, selectedStatus, selectedPriority]);

  // Actions
  const handleMoveLotStatus = (lotId: string, newStatus: LotStatus) => {
    changeBatchStatus(lotId, newStatus);
  };

  const handleConfirmAssignment = (
    lotId: string,
    action: 'ASSIGN' | 'UNASSIGN' | 'TRANSFER' | 'SPLIT',
    agentIds: string[],
    auditNote: string
  ) => {
    reassignBatchAgents(lotId, action, agentIds, 'Yves Touré (Dispatcher)', auditNote);
  };

  const handleCreateCampaign = async (campData: any) => {
    await addCampaign({
      client_id: campData.client_id,
      name: campData.name,
      operation_type: campData.operation_type,
      priority: campData.priority,
      start_date: campData.start_date,
      due_date: campData.due_date,
      total_items: campData.total_items,
      description: campData.description,
      creator_name: campData.creator
    });
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      {/* 1. TOP HEADER WITH GLOBAL SEARCH & NOTIFICATION BADGE */}
      <MissionControlHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadNotifsCount={unreadNotifsCount}
        onToggleNotifications={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
        onOpenCreateCampaign={() => setIsCreateCampaignOpen(true)}
        onToggleFilters={() => setIsFiltersVisible(!isFiltersVisible)}
        isFiltersVisible={isFiltersVisible}
        onRefreshData={refreshAll}
      />

      {/* 2. COMBINABLE ADVANCED FILTERS BAR */}
      {isFiltersVisible && (
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs animate-fadeIn">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="ALL">Tous les Clients</option>
              <option value="cli-cie">CIE Électricité</option>
              <option value="cli-sodeci">SODECI Eau</option>
              <option value="cli-orange">Orange CI</option>
              <option value="cli-bdm">BDM Mali</option>
              <option value="cli-jumia">Jumia Express</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Zone Opérationnelle</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="ALL">Toutes les Zones</option>
              <option value="ABJ-COC-RIV">Cocody Riviera</option>
              <option value="ABJ-YOP-SEL">Yopougon Selmer</option>
              <option value="BMK-COU-01">Bamako Coura</option>
              <option value="DKR-PLT-SAN">Dakar Plateau</option>
              <option value="ABJ-MAR-Z4">Marcory Zone 4</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Statut du Lot</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="ALL">Tous les Statuts</option>
              <option value="A_PREPARER">À préparer</option>
              <option value="A_AFFECTER">À affecter</option>
              <option value="AFFECTE">Affectées</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminées</option>
              <option value="A_CONTROLER">À contrôler</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Priorité</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="ALL">Toutes les Priorités</option>
              <option value="URGENTE">🔴 Urgente</option>
              <option value="HAUTE">🟠 Haute</option>
              <option value="NORMALE">🔵 Normale</option>
              <option value="BASSE">⚪ Basse</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedClient('ALL');
                setSelectedZone('ALL');
                setSelectedStatus('ALL');
                setSelectedPriority('ALL');
                setSearchQuery('');
                setActiveKpiFilter(null);
              }}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all"
            >
              Réinitialiser Filtres
            </button>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE KPI GRID BANNER */}
      <DispatcherKpiGrid
        kpis={kpis}
        activeKpiFilter={activeKpiFilter}
        onSelectKpiFilter={setActiveKpiFilter}
      />

      {/* 4. MAIN DISPATCH VIEW SWITCHER TABS */}
      <div className="bg-slate-900/60 p-2 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kanban'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Vue Kanban moderne ({filteredLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lots')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lots'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gestion des Lots & Affectation 1-Clic</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Carte GPS Live & Progression</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Journal des Opérations ({timelineEvents.length})</span>
          </button>
        </div>
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <MissionControlKanban
          lots={filteredLots}
          onMoveLotStatus={handleMoveLotStatus}
          onOpenAssignModal={(lot) => setSelectedLotForAssign(lot)}
          onInspectLot={(lot) => setSelectedLotForAssign(lot)}
        />
      )}

      {/* TAB 2: BATCH LOTTING & 1-CLICK ASSIGNMENT */}
      {activeTab === 'lots' && (
        <BatchAssignment
          importedRows={filteredLots.map((l) => ({
            id: l.id,
            tracking_number: l.lot_number,
            item_type: 'invoice',
            payment_status: l.total_cod_amount > 0 ? 'PENDING_COD' : 'NO_PAYMENT_REQUIRED',
            recipient_name: l.name,
            recipient_phone: '+225 07 08 12 34 56',
            address_raw: `${l.zone_name}, ${l.city_name}`,
            landmark_description: `Campagne ${l.campaign_reference}`,
            zone_code: l.zone_code,
            cod_amount: l.total_cod_amount,
            due_date: l.due_date,
            status: 'valid',
            validation_errors: []
          }))}
        />
      )}

      {/* TAB 3: LIVE GPS MAP */}
      {activeTab === 'map' && <LiveDispatcherMap />}

      {/* TAB 4: OPERATIONAL TIMELINE LOG */}
      {activeTab === 'timeline' && (
        <OperationalTimeline events={timelineEvents} />
      )}

      {/* MODAL 1: BATCH ASSIGNMENT & REASSIGNMENT */}
      <BatchAssignmentModal
        lot={selectedLotForAssign}
        isOpen={!!selectedLotForAssign}
        onClose={() => setSelectedLotForAssign(null)}
        onConfirmAssignment={handleConfirmAssignment}
      />

      {/* MODAL 2: CREATE CAMPAIGN WIZARD */}
      <CreateCampaignWizardModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreateCampaign={handleCreateCampaign}
      />

      {/* DRAWER: NOTIFICATIONS */}
      <DispatcherNotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllRead}
        onClearNotifications={clearAll}
      />
    </div>
  );
}
