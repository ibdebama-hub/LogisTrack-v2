'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
  MapPin,
  Users,
  AlertTriangle,
  Layers,
  Activity,
  Navigation,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useOperationalMap } from '@/hooks/useOperationalMap';
import MapLayerToggleBar from './MapLayerToggleBar';
import MapControlPanelDrawer from './MapControlPanelDrawer';
import GpsReplayBar from './GpsReplayBar';
import MissionDetailDrawer from '../dispatch/MissionDetailDrawer';
import { Mission } from '@/types/mission';
import { getMissionStatusBadgeStyle, getMissionStatusLabel } from '@/lib/missionWorkflow';

export default function OperationalMapCenter() {
  const {
    agents,
    missions,
    zones,
    incidents,
    layers,
    toggleLayer,
    focusTarget,
    focusEntity,
    searchQuery,
    setSearchQuery,
    refreshMap,
    selectedAgentForReplay,
    replayTrail,
    replayIndex,
    setReplayIndex,
    isReplaying,
    setIsReplaying,
    startAgentReplay,
    stopAgentReplay
  } = useOperationalMap('tenant-101');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMissionDetail, setSelectedMissionDetail] = useState<Mission | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase();
    const matchedAgent = agents.find((a) => a.name.toLowerCase().includes(q) || a.zone_code.toLowerCase().includes(q));
    if (matchedAgent) {
      focusEntity(matchedAgent.current_lat, matchedAgent.current_lng, 16);
      return;
    }

    const matchedMission = missions.find(
      (m) =>
        m.mission_number.toLowerCase().includes(q) ||
        m.recipient_name.toLowerCase().includes(q) ||
        m.address_raw.toLowerCase().includes(q)
    );
    if (matchedMission) {
      focusEntity(matchedMission.lat, matchedMission.lng, 16);
    }
  };

  const selectedReplayAgentObj = agents.find((a) => a.id === selectedAgentForReplay);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex flex-col">
      {/* 1. TOP FLOATING CONTROL BAR WITH SEARCH & FULLSCREEN TOGGLE */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Recentrer sur agent, mission, zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-2xl"
            />
          </form>

          {/* MULTI-LAYER TOGGLE BAR */}
          <MapLayerToggleBar layers={layers} onToggleLayer={toggleLayer} />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={refreshMap}
            className="p-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-2xl shadow-2xl transition-all"
            title="Rafraîchir les données cartographiques"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-2xl shadow-2xl transition-all"
            title={isFullscreen ? 'Quitter Plein Écran' : 'Mode Plein Écran Command Room'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN MAP CONTAINER & FLOATING SIDEBAR */}
      <div className="relative flex-1 w-full h-full">
        {/* RETRACTABLE CONTROL PANEL SIDEBAR */}
        <div className="absolute left-0 top-0 bottom-0 z-20">
          <MapControlPanelDrawer
            agents={agents}
            missions={missions}
            zones={zones}
            incidents={incidents}
            onSelectEntity={focusEntity}
            onStartReplay={startAgentReplay}
          />
        </div>

        {/* MAP CANVAS VIEW & MARKERS OVERLAY */}
        <div className="w-full h-full bg-slate-950 relative flex items-center justify-center">
          {/* SIMULATED MAP CANVAS WITH INTERACTIVE AGENT, MISSION & ZONE OVERLAYS */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          {/* ZONES LAYER OVERLAY */}
          {layers.zones && (
            <div className="absolute inset-0 pointer-events-none">
              {zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => focusEntity(z.center_lat, z.center_lng, 14)}
                  className="absolute p-4 rounded-full border-2 border-indigo-500/40 bg-indigo-500/10 pointer-events-auto cursor-pointer flex flex-col items-center justify-center hover:bg-indigo-500/20 transition-all"
                  style={{
                    left: `${(z.center_lng + 18) * 4} %`,
                    top: `${(15 - z.center_lat) * 6} %`,
                    width: '180px',
                    height: '180px'
                  }}
                >
                  <span className="font-bold text-xs text-white">{z.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{z.success_rate}% Succès</span>
                </div>
              ))}
            </div>
          )}

          {/* AGENTS MARKERS LAYER */}
          {layers.agents && (
            <div className="absolute inset-0 pointer-events-none">
              {agents.map((a) => (
                <div
                  key={a.id}
                  onClick={() => focusEntity(a.current_lat, a.current_lng, 16)}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${50 + (a.current_lng + 4) * 20}%`,
                    top: `${50 - (a.current_lat - 5.3) * 20}%`
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 border-2 border-white text-white font-bold text-xs flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                      {a.avatar_initials}
                    </div>
                    <span
                      className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        a.status === 'ONLINE_AVAILABLE' ? 'bg-emerald-500' : a.status === 'ON_MISSION' ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  {/* HOVER TOOLTIP CARD */}
                  <div className="hidden group-hover:block absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl text-xs w-48 text-white z-40">
                    <span className="font-bold block">{a.name}</span>
                    <span className="text-[10px] text-slate-400 block">{a.zone_name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block pt-1">
                      {a.delivered_today} / {a.total_assigned_today} Livrés
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MISSIONS MARKERS LAYER */}
          {layers.missions && (
            <div className="absolute inset-0 pointer-events-none">
              {missions.map((m) => {
                const style = getMissionStatusBadgeStyle(m.status);
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMissionDetail({
                        id: m.id,
                        mission_number: m.mission_number,
                        organization_id: 'tenant-101',
                        client_id: 'cli-cie',
                        client_name: 'Client B2B',
                        client_code: 'CLI',
                        campaign_id: 'camp-1',
                        campaign_reference: 'CAMP-2026',
                        campaign_name: 'Campagne Distribution',
                        recipient_name: m.recipient_name,
                        recipient_phone: m.recipient_phone,
                        address_raw: m.address_raw,
                        city_name: 'Abidjan',
                        item_type: 'invoice',
                        operation_type: 'MASS_INVOICE_DISTRIBUTION',
                        priority: m.priority,
                        sla_hours: 24,
                        due_date: '2026-08-15',
                        cod_amount: m.cod_amount,
                        payment_status: 'NO_PAYMENT_REQUIRED',
                        status: m.status,
                        created_at: '2026-08-06',
                        updated_at: '2026-08-06'
                      });
                    }}
                    className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${48 + (m.lng + 4) * 20}%`,
                      top: `${48 - (m.lat - 5.3) * 20}%`
                    }}
                  >
                    <div className={`p-2 rounded-xl border font-bold text-xs shadow-xl transition-all group-hover:scale-110 ${style.bg} ${style.text} ${style.border}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MAP WATERMARK BADGE */}
          <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 shadow-2xl pointer-events-none">
            <span className="font-bold text-white block">LogisTrack V2 Map Engine</span>
            <span>Leaflet 1.9.4 • PostGIS Realtime</span>
          </div>
        </div>

        {/* FLOATING GPS REPLAY BAR */}
        {layers.replay && selectedReplayAgentObj && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <GpsReplayBar
              agentName={selectedReplayAgentObj.name}
              trail={replayTrail}
              currentIndex={replayIndex}
              onIndexChange={setReplayIndex}
              isPlaying={isReplaying}
              onTogglePlay={() => setIsReplaying(!isReplaying)}
              onClose={stopAgentReplay}
            />
          </div>
        )}
      </div>

      {/* MISSION DETAIL DRAWER ON MARKER CLICK */}
      <MissionDetailDrawer
        mission={selectedMissionDetail}
        isOpen={!!selectedMissionDetail}
        onClose={() => setSelectedMissionDetail(null)}
      />
    </div>
  );
}
