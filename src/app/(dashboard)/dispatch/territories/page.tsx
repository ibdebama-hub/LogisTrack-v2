'use client';

import React, { useState } from 'react';
import ZoneManagement from '../../../../components/modules/zones/ZoneManagement';
import AgentAssignmentMatrix from '../../../../components/modules/zones/AgentAssignmentMatrix';
import { Layers, Users } from 'lucide-react';

export default function DispatchTerritoriesPage() {
  const [activeTab, setActiveTab] = useState<'zones' | 'assignments'>('zones');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            LOGISTRACK V2 • DECOUPAGE TERRITORIAL & AFFECTATION
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Gestion des Zones, Quartiers & Affectations Agents</h1>
          <p className="text-xs text-slate-400">
            Structurez vos zones opérationnelles, associez les quartiers et configurez le dispatch automatique par secteur
          </p>
        </div>

        {/* Tab Segmented Switch */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'zones'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Zones & Quartiers
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Affectations Agents
          </button>
        </div>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'zones' ? (
        <ZoneManagement />
      ) : (
        <AgentAssignmentMatrix />
      )}
    </div>
  );
}
