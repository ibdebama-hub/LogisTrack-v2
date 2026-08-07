'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  XCircle,
  Camera,
  MapPin,
  X,
  Check,
  RefreshCcw,
  FileX,
  PhoneOff,
  UserX,
  DollarSign,
  Lock,
  Mailbox,
  ShieldAlert
} from 'lucide-react';
import { PaymentStatus } from '../../../types/logistrack';

interface DeliveryFailureModalProps {
  item: {
    id: string;
    trackingNumber: string;
    recipientName: string;
    address: string;
    codAmount: number;
    paymentStatus?: PaymentStatus;
  };
  onClose: () => void;
  onSuccess: (failureData: {
    reason: string;
    notes?: string;
    photoProofUrl?: string;
    rescheduleDate?: string;
    gpsLat?: number;
    gpsLng?: number;
  }) => void;
}

const ALL_FAILURE_REASONS = [
  { id: 'moved', label: 'Client Déménagé / Inconnu à l\'adresse', icon: UserX, color: 'text-amber-400 bg-amber-500/10', codOnly: false },
  { id: 'landmark_not_found', label: 'Adresse / Repère Introuvable', icon: MapPin, color: 'text-rose-400 bg-rose-500/10', codOnly: false },
  { id: 'mailbox_inaccessible', label: 'Boîte aux lettres / Fente inassible', icon: Mailbox, color: 'text-indigo-400 bg-indigo-500/10', codOnly: false },
  { id: 'access_denied_security', label: 'Accès refusé par la sécurité / Gardien', icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10', codOnly: false },
  { id: 'absent', label: 'Destinataire Absent lors du passage', icon: FileX, color: 'text-indigo-400 bg-indigo-500/10', codOnly: false },
  { id: 'unreachable_phone', label: 'Numéro de Téléphone Injoignable', icon: PhoneOff, color: 'text-slate-400 bg-slate-500/10', codOnly: false },
  { id: 'refused_cod', label: 'Refus de Paiement COD / Contestation du Montant', icon: DollarSign, color: 'text-amber-400 bg-amber-500/10', codOnly: true },
];

export default function DeliveryFailureModal({ item, onClose, onSuccess }: DeliveryFailureModalProps) {
  const isNoPayment = !item.paymentStatus || item.paymentStatus === 'NO_PAYMENT_REQUIRED' || item.codAmount === 0;

  // Filter failure reasons: Hide "Refus de paiement COD" if no payment is required
  const availableReasons = ALL_FAILURE_REASONS.filter(r => !r.codOnly || !isNoPayment);

  const [selectedReason, setSelectedReason] = useState<string>(availableReasons[0].id);
  const [notes, setNotes] = useState('');
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGpsLocation({ lat: 5.3599, lng: -3.9723 })
      );
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSimulatePhoto = () => {
    const svgPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23450a0a"/><text x="50%" y="40%" fill="%23f87171" font-family="sans-serif" font-size="14" text-anchor="middle">PREUVE DE PASSAGE - PORTE FERMÉE</text><text x="50%" y="60%" fill="%23fca5a5" font-family="monospace" font-size="11" text-anchor="middle">GPS: ${gpsLocation?.lat || 5.3599}, ${gpsLocation?.lng || -3.9723}</text></svg>`;
    setPhotoProof(svgPhoto);
  };

  const handleSubmit = () => {
    onSuccess({
      reason: selectedReason,
      notes: notes || undefined,
      photoProofUrl: photoProof || undefined,
      rescheduleDate: rescheduleDate || undefined,
      gpsLat: gpsLocation?.lat,
      gpsLng: gpsLocation?.lng
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold rounded">
              {item.trackingNumber}
            </span>
            <h2 className="text-base font-bold text-rose-400 mt-1">Signaler un Échec de Passage / Non-Remise</h2>
            <p className="text-xs text-slate-400">{item.recipientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Preset Failure Reasons Selector */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-medium block">Sélectionnez le motif d&apos;échec (1-Clic) :</label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {availableReasons.map((r) => {
              const IconComponent = r.icon;
              const isSelected = selectedReason === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedReason(r.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-rose-950/60 border-rose-600 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${r.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="flex-1">{r.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Proof of Attempt */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="text-xs text-slate-300 font-medium block">Photo preuve de passage (Porte/Boîte fermée) :</label>
          {photoProof ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <img src={photoProof} alt="Preuve de passage" className="w-full h-32 object-cover" />
              <button
                type="button"
                onClick={() => setPhotoProof(null)}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatePhoto}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              Prendre Photo de Devanture / Boîte
            </button>
          )}
        </div>

        {/* Reschedule Date Selector */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="text-xs text-slate-300 font-medium block flex items-center gap-1.5">
            <RefreshCcw className="w-3.5 h-3.5 text-indigo-400" />
            Reprogrammation / Date du 2nd passage :
          </label>
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Enregistrer le Motif d&apos;Échec
        </button>
      </div>
    </div>
  );
}
