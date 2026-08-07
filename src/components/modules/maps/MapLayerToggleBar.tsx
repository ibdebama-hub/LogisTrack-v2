'use client';

import React from 'react';
import { Layers, Users, MapPin, Activity, AlertTriangle, Navigation, RotateCcw } from 'lucide-react';
import { LayerToggles } from '@/types/mapSupervision';

interface MapLayerToggleBarProps {
  layers: LayerToggles;
  onToggleLayer: (layerKey: keyof LayerToggles) => void;
}

export default function MapLayerToggleBar({ layers, onToggleLayer }: MapLayerToggleBarProps) {
  const toggleItems: Array<{ key: keyof LayerToggles; label: string; icon: any }> = [
    { key: 'agents', label: 'Agents', icon: Users },
    { key: 'missions', label: 'Missions', icon: MapPin },
    { key: 'zones', label: 'Zones', icon: Layers },
    { key: 'heatmap', label: 'Heatmap', icon: Activity },
    { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { key: 'routes', label: 'Itinéraires', icon: Navigation },
    { key: 'replay', label: 'Rejeu GPS', icon: RotateCcw }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-2xl overflow-x-auto text-xs">
      {toggleItems.map((item) => {
        const isActive = layers[item.key];
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onToggleLayer(item.key)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
