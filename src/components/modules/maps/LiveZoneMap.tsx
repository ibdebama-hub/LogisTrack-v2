'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Users, Navigation, ShieldCheck } from 'lucide-react';

interface ZoneMarker {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  itemsCount: number;
  assignedAgent: string;
}

const SAMPLE_MAP_PINS: ZoneMarker[] = [
  { id: 'p1', name: 'Cocody Riviera 2', code: 'ABJ-COC-RIV', lat: 5.3599, lng: -3.9723, itemsCount: 42, assignedAgent: 'Kouassi Jean-Marc' },
  { id: 'p2', name: 'Marcory Zone 4', code: 'ABJ-MAR-Z4', lat: 5.3021, lng: -3.9856, itemsCount: 28, assignedAgent: 'Koffi Marie-Noëlle' },
  { id: 'p3', name: 'Yopougon Selmer', code: 'ABJ-YOP-SEL', lat: 5.3341, lng: -4.0621, itemsCount: 65, assignedAgent: 'Diallo Mamadou' },
  { id: 'p4', name: 'Dakar Plateau Sandaga', code: 'DKR-PLT-SAN', lat: 14.6672, lng: -17.4338, itemsCount: 19, assignedAgent: 'Ndiaye Cheikh' }
];

export default function LiveZoneMap() {
  const [selectedPin, setSelectedPin] = useState<ZoneMarker | null>(SAMPLE_MAP_PINS[0]);

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            Cartographie des Repères & Densité de Distribution
          </h3>
          <p className="text-xs text-slate-400">Positionnement des repères visuels et affectations par zone</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Factures actives
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Agents en cours
          </span>
        </div>
      </div>

      {/* Simulated Interactive Map Container */}
      <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Map Background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

        {/* Map Pins overlay */}
        <div className="relative z-10 w-full h-full p-8 flex flex-wrap items-center justify-around">
          {SAMPLE_MAP_PINS.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className={`p-3 rounded-xl border transition-all flex items-center gap-2 shadow-lg ${
                selectedPin?.id === pin.id
                  ? 'bg-indigo-600 text-white border-indigo-400 scale-105 shadow-indigo-600/40'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-indigo-500/50'
              }`}
            >
              <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="font-mono text-[10px] font-bold block opacity-80">{pin.code}</span>
                <span className="text-xs font-semibold">{pin.name}</span>
              </div>
              <span className="ml-1 px-1.5 py-0.5 bg-slate-950/60 rounded text-[10px] font-bold text-emerald-300">
                {pin.itemsCount}
              </span>
            </button>
          ))}
        </div>

        {/* Floating Selected Pin Info Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedPin.name} ({selectedPin.code})</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Agent affecté : <strong className="text-slate-200">{selectedPin.assignedAgent}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-emerald-400">{selectedPin.itemsCount} factures/courriers</span>
              <span className="text-[10px] text-slate-400 block">GPS: {selectedPin.lat}, {selectedPin.lng}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
