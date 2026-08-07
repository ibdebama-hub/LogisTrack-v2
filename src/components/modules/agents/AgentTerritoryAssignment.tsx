'use client';

import React from 'react';
import { MapPin, Building, Check, Layers, CheckSquare, Square } from 'lucide-react';

export interface TerritoryAssignmentProps {
  selectedZones: string[];
  onChangeZones: (zones: string[]) => void;
  selectedDistricts: string[];
  onChangeDistricts: (districts: string[]) => void;
  selectedClients: string[];
  onChangeClients: (clients: string[]) => void;
}

const AVAILABLE_ZONES_MAPPING: Record<string, string[]> = {
  'Kaloum Centre-Ville': ['Almamya', 'Sandervalia', 'Boulbinet', 'Manquepas', 'Kouléwondi'],
  'Dixinn & Landréah': ['Landréah', 'Dixinn Port', 'Hafia', 'Minière', 'Cité Cambérène'],
  'Cocody & Riviera': ['Riviera 3', 'Riviera Faya', 'Angré 8ème Tranche', 'Palmeraie', 'Deux Plateaux'],
  'Ratoma & Kipé': ['Kipé Centre', 'Kaporo', 'Lambanyi', 'Taouyah', 'Nongo'],
  'Dakar Plateau & Medina': ['Medina', 'Fann Residence', 'Point E', 'Colobane', 'Gueule Tapée'],
  'Yopougon Industrial Zone': ['Niangon', 'Maroc', 'Siporex', 'Zone Industrielle', 'Toit Rouge']
};

const AVAILABLE_CLIENTS = [
  'Tous (Polyvalent)',
  'Orange Guinée',
  'Banque Atlantique',
  'Électricité De Guinée (EDG)',
  'SODECI Côte d\'Ivoire',
  'MTN Business',
  'CIE Électricité CI'
];

export default function AgentTerritoryAssignment({
  selectedZones,
  onChangeZones,
  selectedDistricts,
  onChangeDistricts,
  selectedClients,
  onChangeClients
}: TerritoryAssignmentProps) {
  // Toggle Zone Selection
  const toggleZone = (zoneName: string) => {
    if (selectedZones.includes(zoneName)) {
      const nextZones = selectedZones.filter(z => z !== zoneName);
      onChangeZones(nextZones);
      // Remove districts associated with this zone
      const zoneDistricts = AVAILABLE_ZONES_MAPPING[zoneName] || [];
      onChangeDistricts(selectedDistricts.filter(d => !zoneDistricts.includes(d)));
    } else {
      const nextZones = [...selectedZones, zoneName];
      onChangeZones(nextZones);
      // Auto-select all districts for newly selected zone by default
      const zoneDistricts = AVAILABLE_ZONES_MAPPING[zoneName] || [];
      const newDistricts = Array.from(new Set([...selectedDistricts, ...zoneDistricts]));
      onChangeDistricts(newDistricts);
    }
  };

  // Toggle District Selection
  const toggleDistrict = (districtName: string) => {
    if (selectedDistricts.includes(districtName)) {
      onChangeDistricts(selectedDistricts.filter(d => d !== districtName));
    } else {
      onChangeDistricts([...selectedDistricts, districtName]);
    }
  };

  // Toggle All Districts of a Specific Zone
  const toggleAllDistrictsOfZone = (zoneName: string) => {
    const zoneDistricts = AVAILABLE_ZONES_MAPPING[zoneName] || [];
    const allSelected = zoneDistricts.every(d => selectedDistricts.includes(d));

    if (allSelected) {
      onChangeDistricts(selectedDistricts.filter(d => !zoneDistricts.includes(d)));
    } else {
      onChangeDistricts(Array.from(new Set([...selectedDistricts, ...zoneDistricts])));
    }
  };

  // Toggle Client Selection
  const toggleClient = (clientName: string) => {
    if (clientName === 'Tous (Polyvalent)') {
      onChangeClients(['Tous (Polyvalent)']);
      return;
    }

    let nextClients = selectedClients.filter(c => c !== 'Tous (Polyvalent)');
    if (nextClients.includes(clientName)) {
      nextClients = nextClients.filter(c => c !== clientName);
    } else {
      nextClients.push(clientName);
    }

    if (nextClients.length === 0) {
      nextClients = ['Tous (Polyvalent)'];
    }

    onChangeClients(nextClients);
  };

  return (
    <div className="space-y-6">
      {/* 1. SELECTION MULTI-ZONES */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> 1. Zones Opérationnelles d'Intervention (Multi-Zones)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.keys(AVAILABLE_ZONES_MAPPING).map(zoneName => {
            const isSelected = selectedZones.includes(zoneName);
            return (
              <button
                key={zoneName}
                type="button"
                onClick={() => toggleZone(zoneName)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{zoneName}</span>
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                  isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC DISTRICTS SELECTOR GROUPED BY SELECTED ZONES */}
      {selectedZones.length > 0 && (
        <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-in fade-in">
          <label className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 2. Quartiers & Secteurs Spécifiques Confiés
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({selectedDistricts.length} quartier(s) coché(s))
            </span>
          </label>

          <div className="space-y-4">
            {selectedZones.map(zoneName => {
              const zoneDistricts = AVAILABLE_ZONES_MAPPING[zoneName] || [];
              const allZoneDistrictsSelected = zoneDistricts.every(d => selectedDistricts.includes(d));

              return (
                <div key={zoneName} className="space-y-2 border-b border-slate-800/80 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">{zoneName}</span>
                    <button
                      type="button"
                      onClick={() => toggleAllDistrictsOfZone(zoneName)}
                      className="text-[11px] text-indigo-400 hover:underline font-mono"
                    >
                      {allZoneDistrictsSelected ? 'Tout décocher' : 'Tout cocher pour cette zone'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zoneDistricts.map(district => {
                      const isChecked = selectedDistricts.includes(district);
                      return (
                        <button
                          key={district}
                          type="button"
                          onClick={() => toggleDistrict(district)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                            isChecked
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5 text-slate-600" />}
                          <span>{district}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MULTI-CLIENTS SELECTION */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5" /> 3. Clients Donneurs d'Ordres Autorisés
        </label>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CLIENTS.map(client => {
            const isSelected = selectedClients.includes(client);
            return (
              <button
                key={client}
                type="button"
                onClick={() => toggleClient(client)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? client === 'Tous (Polyvalent)'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold shadow-md'
                      : 'bg-indigo-600/20 text-indigo-300 border-indigo-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {client}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
