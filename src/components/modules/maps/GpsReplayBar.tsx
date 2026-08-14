'use client';

import React, { useEffect } from 'react';
import { Play, Pause, X, RotateCcw, FastForward, Clock } from 'lucide-react';
import { GpsTrailPoint } from '../../../types/mapSupervision';

interface GpsReplayBarProps {
  agentName: string;
  trail: GpsTrailPoint[];
  currentIndex: number;
  onIndexChange: (idx: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export default function GpsReplayBar({
  agentName,
  trail,
  currentIndex,
  onIndexChange,
  isPlaying,
  onTogglePlay,
  onClose
}: GpsReplayBarProps) {
  useEffect(() => {
    if (!isPlaying || trail.length === 0) return;

    const interval = setInterval(() => {
      onIndexChange((currentIndex + 1) % trail.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, trail, onIndexChange]);

  if (trail.length === 0) return null;

  const currentPoint = trail[currentIndex] || trail[0];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-indigo-800/80 shadow-2xl space-y-3 animate-fadeIn text-xs text-white max-w-lg w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-indigo-400 animate-spin" />
          <span className="font-bold">Rejeu GPS Tournée : {agentName}</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
        <span>Point {currentIndex + 1} / {trail.length}</span>
        <span className="text-indigo-400 font-bold">Horodatage : {currentPoint.timestamp}</span>
        <span className="text-emerald-400 font-bold">{currentPoint.speed} km/h</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min={0}
          max={trail.length - 1}
          value={currentIndex}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="flex-1 accent-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
