'use client';

import React, { useState } from 'react';
import {
  Users,
  MapPin,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Phone,
  Battery,
  Navigation,
  RotateCcw
} from 'lucide-react';
import {
  SupervisionAgent,
  SupervisionMission,
  SupervisionZone,
  SupervisionIncident
} from '@/types/mapSupervision';
import { getMissionStatusBadgeStyle, getMissionStatusLabel } from '@/lib/missionWorkflow';

interface MapControlPanelDrawerProps {
  agents: SupervisionAgent[];
  missions: SupervisionMission[];
  zones: SupervisionZone[];
  incidents: SupervisionIncident[];
  onSelectEntity: (lat: number, lng: number, zoom?: number) => void;
  onStartReplay: (agentId: string) => void;
  onOpenMissionDetail?: (missionId: string) => void;
}

export default function MapControlPanelDrawer({
  agents,
  missions,
  zones,
  incidents,
  onSelectEntity,
  onStartReplay,
  onOpenMissionDetail
}: MapControlPanelDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'agents' | 'missions' | 'incidents' | 'zones'>('agents');

  return (
    <div className="relative flex">
      {/* TOGGLE DRAWER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-10 top-6 z-30 p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-r-xl shadow-2xl transition-all"
        title={isOpen ? 'Masquer le panneau' : 'Afficher le panneau'}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* DRAWER CONTAINER */}
      {isOpen && (
        <div className="w-80 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 h-full flex flex-col shadow-2xl z-20 text-xs animate-fadeIn">
          {/* TAB HEADER */}
          <div className="p-3 border-b border-slate-800 grid grid-cols-4 gap-1 bg-slate-950">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'agents'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Agents ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('missions')}
              className={`py-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'missions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Missions ({missions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`py-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'incidents'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Incidents ({incidents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('zones')}
              className={`py-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'zones'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Zones ({zones.length})</span>
            </button>
          </div>

          {/* TAB CONTENT LIST */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {/* TAB AGENTS */}
            {activeTab === 'agents' && (
              agents.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectEntity(a.current_lat, a.current_lng, 16)}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 hover:border-indigo-500 cursor-pointer space-y-2 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                        {a.avatar_initials}
                      </span>
                      <div>
                        <span className="font-bold text-white block group-hover:text-indigo-400 transition-all">
                          {a.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{a.zone_name}</span>
                      </div>
                    </div>

                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        a.status === 'ONLINE_AVAILABLE'
                          ? 'bg-emerald-500 shadow-md shadow-emerald-500/50'
                          : a.status === 'ON_MISSION'
                          ? 'bg-blue-500 shadow-md shadow-blue-500/50'
                          : a.status === 'INCIDENT'
                          ? 'bg-rose-500 animate-ping'
                          : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="font-mono">{a.speed_kmh} km/h</span>
                    <span>Batterie : {a.battery_level}%</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReplay(a.id);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-indigo-950 text-indigo-400 border border-slate-800 flex items-center gap-1 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> Rejouer
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* TAB MISSIONS */}
            {activeTab === 'missions' && (
              missions.map((m) => {
                const style = getMissionStatusBadgeStyle(m.status);
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectEntity(m.lat, m.lng, 16)}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 hover:border-indigo-500 cursor-pointer space-y-1.5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-400">{m.mission_number}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {getMissionStatusLabel(m.status)}
                      </span>
                    </div>
                    <span className="font-bold text-white block group-hover:text-indigo-400">{m.recipient_name}</span>
                    <span className="text-slate-400 block text-[11px] truncate">{m.address_raw}</span>
                  </div>
                );
              })
            )}

            {/* TAB INCIDENTS */}
            {activeTab === 'incidents' && (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectEntity(inc.lat, inc.lng, 16)}
                  className="bg-slate-950 p-3 rounded-xl border border-rose-900/50 hover:border-rose-500 cursor-pointer space-y-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {inc.incident_type}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">{inc.created_at}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{inc.description}</p>
                </div>
              ))
            )}

            {/* TAB ZONES */}
            {activeTab === 'zones' && (
              zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => onSelectEntity(z.center_lat, z.center_lng, 14)}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-indigo-500 cursor-pointer space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{z.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{z.success_rate}% Succès</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>{z.delivered_missions} / {z.total_missions} distribués</span>
                    <span>{z.assigned_agents_count} Agents</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
