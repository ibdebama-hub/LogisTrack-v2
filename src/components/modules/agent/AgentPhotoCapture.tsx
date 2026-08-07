'use client';

import React, { useState } from 'react';
import { Camera, Trash2, CheckCircle2, Image as ImageIcon, Plus } from 'lucide-react';

interface AgentPhotoCaptureProps {
  onPhotosChange?: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function AgentPhotoCapture({
  onPhotosChange,
  maxPhotos = 3
}: AgentPhotoCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSimulateAddPhoto = () => {
    if (photos.length >= maxPhotos) return;
    const mockDataUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    const nextPhotos = [...photos, mockDataUrl];
    setPhotos(nextPhotos);
    if (onPhotosChange) onPhotosChange(nextPhotos);
  };

  const handleRemovePhoto = (index: number) => {
    const nextPhotos = photos.filter((_, i) => i !== index);
    setPhotos(nextPhotos);
    if (onPhotosChange) onPhotosChange(nextPhotos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-indigo-400" />
          <span>Photos de décharge / Porte / Façade ({photos.length}/{maxPhotos})</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, idx) => (
          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
            <img src={url} alt={`Preuve ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleRemovePhoto(idx)}
              className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-lg text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            onClick={handleSimulateAddPhoto}
            className="aspect-video rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-900 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-300 gap-1 text-xs transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter Photo</span>
          </button>
        )}
      </div>
    </div>
  );
}
