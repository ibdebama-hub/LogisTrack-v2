'use client';

import React, { useState } from 'react';
import { Map, Activity, Layers, AlertTriangle, Banknote } from 'lucide-react';

export default function BiCartoAnalytics() {
  const [activeLayer, setActiveLayer] = useState<'missions' | 'incidents' | 'cod'>('missions');

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-400" />
          <span>Analyse Cartographique Heatmap PostGIS</span>
        </h2>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveLayer('missions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeLayer === 'missions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => setActiveLayer('incidents')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeLayer === 'incidents' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setActiveLayer('cod')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeLayer === 'cod' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Volume COD
          </button>
        </div>
      </div>

      {/* HEATMAP CANVAS SIMULATION OVERLAY */}
      <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* HEATMAP DENSITY HOTSPOTS */}
        <div className="absolute w-40 h-40 bg-emerald-500/20 blur-2xl rounded-full top-10 left-20 animate-pulse" />
        <div className="absolute w-32 h-32 bg-indigo-500/25 blur-2xl rounded-full bottom-10 right-32 animate-pulse" />
        <div className="absolute w-24 h-24 bg-rose-500/20 blur-2xl rounded-full top-14 right-20 animate-pulse" />

        <div className="relative z-10 text-center space-y-1 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
          <Activity className="w-6 h-6 text-emerald-400 mx-auto animate-bounce" />
          <span className="font-bold text-white block">PostGIS Heatmap Layer : {activeLayer.toUpperCase()}</span>
          <span className="text-[10px] text-slate-400 block font-mono">Abidjan & Suburbs • 18,450 Coordonnées Indexées</span>
        </div>
      </div>
    </div>
  );
}
