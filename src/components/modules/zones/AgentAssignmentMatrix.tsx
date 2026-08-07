'use client';

import React, { useState } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { AgentAssignment, ZoneTerritory } from '../../../types/logistrack';

const MOCK_ZONES: ZoneTerritory[] = [
  {
    id: 'z-bmk-w',
    organization_id: 'org-1',
    name: 'Zone Bamako Ouest',
    code: 'Z-BMK-W',
    color: '#4F46E5',
    assigned_agents_count: 4,
    districts: [
      { id: 'd-1', zone_id: 'z-bmk-w', name: 'Hamdallaye ACI 2000', assigned_agents_count: 2 },
      { id: 'd-2', zone_id: 'z-bmk-w', name: 'Lafiabougou', assigned_agents_count: 1 },
      { id: 'd-3', zone_id: 'z-bmk-w', name: 'Djicoroni Para', assigned_agents_count: 1 }
    ]
  },
  {
    id: 'z-abj-n',
    organization_id: 'org-1',
    name: 'Zone Abidjan Nord',
    code: 'Z-ABJ-N',
    color: '#10B981',
    assigned_agents_count: 6,
    districts: [
      { id: 'd-4', zone_id: 'z-abj-n', name: 'Cocody Riviera 3', assigned_agents_count: 3 },
      { id: 'd-5', zone_id: 'z-abj-n', name: 'Angré Djibi', assigned_agents_count: 2 },
      { id: 'd-6', zone_id: 'z-abj-n', name: 'Deux Plateaux Vallons', assigned_agents_count: 1 }
    ]
  }
];

const INITIAL_ASSIGNMENTS: AgentAssignment[] = [
  {
    id: 'asg-1',
    user_id: 'u-1',
    agent_name: 'Traoré Bakary',
    agent_phone: '+223 70 12 34 56',
    zone_id: 'z-bmk-w',
    zone_code: 'Z-BMK-W',
    zone_name: 'Zone Bamako Ouest',
    district_ids: ['d-1', 'd-2'],
    district_names: ['Hamdallaye ACI 2000', 'Lafiabougou'],
    is_primary: true,
    active_workload: 125
  },
  {
    id: 'asg-2',
    user_id: 'u-2',
    agent_name: 'Diallo Mamadou',
    agent_phone: '+223 76 99 88 77',
    zone_id: 'z-bmk-w',
    zone_code: 'Z-BMK-W',
    zone_name: 'Zone Bamako Ouest',
    district_ids: ['d-1', 'd-3'],
    district_names: ['Hamdallaye ACI 2000', 'Djicoroni Para'],
    is_primary: false,
    active_workload: 89
  },
  {
    id: 'asg-3',
    user_id: 'u-3',
    agent_name: 'Kouassi Jean-Marc',
    agent_phone: '+225 07 08 12 34 56',
    zone_id: 'z-abj-n',
    zone_code: 'Z-ABJ-N',
    zone_name: 'Zone Abidjan Nord',
    district_ids: ['d-4', 'd-5'],
    district_names: ['Cocody Riviera 3', 'Angré Djibi'],
    is_primary: true,
    active_workload: 340
  },
  {
    id: 'asg-4',
    user_id: 'u-4',
    agent_name: 'Koffi Marie-Noëlle',
    agent_phone: '+225 01 02 33 44 55',
    zone_id: 'z-abj-n',
    zone_code: 'Z-ABJ-N',
    zone_name: 'Zone Abidjan Nord',
    district_ids: ['d-4', 'd-6'],
    district_names: ['Cocody Riviera 3', 'Deux Plateaux Vallons'],
    is_primary: false,
    active_workload: 210
  }
];

export default function AgentAssignmentMatrix() {
  const [assignments, setAssignments] = useState<AgentAssignment[]>(INITIAL_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [activeEditingAgent, setActiveEditingAgent] = useState<AgentAssignment | null>(null);

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch =
      a.agent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zone_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district_names.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesZone = selectedZoneFilter === 'all' || a.zone_id === selectedZoneFilter;
    return matchesSearch && matchesZone;
  });

  const toggleDistrictAssignment = (districtId: string, districtName: string) => {
    if (!activeEditingAgent) return;
    const has = activeEditingAgent.district_ids.includes(districtId);
    const nextIds = has
      ? activeEditingAgent.district_ids.filter(id => id !== districtId)
      : [...activeEditingAgent.district_ids, districtId];
    const nextNames = has
      ? activeEditingAgent.district_names.filter(name => name !== districtName)
      : [...activeEditingAgent.district_names, districtName];

    const updated = {
      ...activeEditingAgent,
      district_ids: nextIds,
      district_names: nextNames
    };

    setActiveEditingAgent(updated);
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const editingZoneDistricts = activeEditingAgent
    ? (MOCK_ZONES.find(z => z.id === activeEditingAgent.zone_id)?.districts || [])
    : [];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Chercher agent, zone, quartier..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
            />
          </div>

          <select
            value={selectedZoneFilter}
            onChange={e => setSelectedZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="all">Toutes les Zones</option>
            {MOCK_ZONES.map(z => (
              <option key={z.id} value={z.id}>{z.name} ({z.code})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Auto-dispatch actif par correspondance de Quartier</span>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-4">Livreur / Agent Terrain</th>
              <th className="p-4">Zone Principale Affectée</th>
              <th className="p-4">Quartiers Opérationnels Couverts</th>
              <th className="p-4">Volume Actuel</th>
              <th className="p-4 text-right">Actions Affectation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredAssignments.map(asg => (
              <tr key={asg.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white">
                  {asg.agent_name}
                  <span className="block text-[11px] font-mono text-slate-400 font-normal">{asg.agent_phone}</span>
                </td>

                <td className="p-4">
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 font-mono font-bold text-xs rounded-lg border border-indigo-800/40">
                    {asg.zone_code}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">{asg.zone_name}</span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5 max-w-md">
                    {asg.district_names.map(dName => (
                      <span
                        key={dName}
                        className="px-2 py-0.5 bg-slate-950 text-emerald-400 font-medium text-[11px] rounded border border-slate-800 flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {dName}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4 font-mono font-bold text-amber-400">
                  {asg.active_workload} plis en cours
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => setActiveEditingAgent(asg)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Ajuster Quartiers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT AGENT DISTRICTS MODAL */}
      {activeEditingAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Affectation des Quartiers par Agent</h3>
                <p className="text-xs text-slate-400">Agent : <strong>{activeEditingAgent.agent_name}</strong> ({activeEditingAgent.zone_code})</p>
              </div>
              <button onClick={() => setActiveEditingAgent(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Sélectionnez les quartiers attribués à cet agent :
              </label>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {editingZoneDistricts.map(d => {
                  const isChecked = activeEditingAgent.district_ids.includes(d.id);
                  return (
                    <div
                      key={d.id}
                      onClick={() => toggleDistrictAssignment(d.id, d.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isChecked ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{d.name}</span>
                      </div>

                      {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveEditingAgent(null)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Valider l&apos;Affectation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
