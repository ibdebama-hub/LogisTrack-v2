'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MapPin,
  UserCheck,
  ShieldCheck,
  Calendar,
  FileText,
  Phone,
  Building,
  Navigation,
  Key,
  BadgeCheck
} from 'lucide-react';
import { PoDItem } from '@/types/podValidation';

interface PoDInspectModalProps {
  item: PoDItem | null;
  onClose: () => void;
  onApprove: (itemId: string, note?: string) => void;
  onReject: (itemId: string, reason: string) => void;
  onReschedule: (itemId: string) => void;
}

export default function PoDInspectModal({
  item,
  onClose,
  onApprove,
  onReject,
  onReschedule
}: PoDInspectModalProps) {
  if (!item) return null;

  const isGpsWarning = item.gps_distance_diff_meters > 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base">{item.tracking_number}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {item.client_name}
                </span>
              </div>
              <span className="text-xs text-slate-400">Inspection & Certification de la Preuve de Livraison</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Destinataire</span>
              <span className="font-bold text-white block truncate">{item.recipient_name}</span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" /> {item.recipient_phone}
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Livreur Terrain</span>
              <span className="font-bold text-indigo-300 block truncate">{item.agent_name}</span>
              <span className="text-[11px] text-slate-400 font-mono">{item.delivery_timestamp}</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Type de Remise</span>
              <span className="font-bold text-emerald-400 block">{item.delivery_method}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Preuve: {item.proof_type}</span>
            </div>
          </div>

          {/* MAIN PROOF DISPLAY & MINI MAP COMPARISON GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. VISUEL DE LA PREUVE (HD SIGNATURE OU PHOTO) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-indigo-400" /> Preuve Tactile / Visuelle
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {item.proof_type.toUpperCase()}
                </span>
              </div>

              {/* Proof Image Box */}
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center min-h-[160px] overflow-hidden">
                {item.proof_image_url ? (
                  <img
                    src={item.proof_image_url}
                    alt="Preuve de livraison"
                    className="max-h-[180px] w-auto object-contain rounded-lg shadow-inner"
                  />
                ) : item.proof_type === 'otp' ? (
                  <div className="text-center p-6 space-y-2">
                    <Key className="w-10 h-10 text-emerald-400 mx-auto" />
                    <span className="text-xs font-mono text-slate-300 block">CODE OTP SMS VALIDE</span>
                    <span className="text-2xl font-black font-mono text-emerald-400 block tracking-widest">
                      {item.otp_code_verified || '7492'}
                    </span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">Aucun visuel de preuve disponible</div>
                )}
              </div>

              {/* Proxy receiver information if applicable */}
              {item.proxy_info && (
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Reçu par Tiers Mandataire:
                  </div>
                  <div className="text-white font-medium">{item.proxy_info.name} ({item.proxy_info.relation})</div>
                  {item.proxy_info.cni_number && (
                    <div className="font-mono text-[10px] text-slate-400">
                      N° Pièce / CNI: <span className="text-amber-400 font-bold">{item.proxy_info.cni_number}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. COMPARAISON GPS & PRÉCISION SCAN */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" /> Précision GPS du Scan
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    isGpsWarning
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    Δ {item.gps_distance_diff_meters}m {isGpsWarning ? '(Écart Important)' : '(Précis)'}
                  </span>
                </div>

                {/* Simulated Mini Map Display */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 relative overflow-hidden space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Position Théorique:
                    </span>
                    <span className="font-mono text-white text-[11px]">{item.expected_lat.toFixed(4)}, {item.expected_lng.toFixed(4)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Position Scan Agent:
                    </span>
                    <span className="font-mono text-emerald-300 text-[11px] font-bold">{item.gps_lat.toFixed(4)}, {item.gps_lng.toFixed(4)}</span>
                  </div>

                  {isGpsWarning && (
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300 flex items-center gap-1.5 mt-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Écart GPS supérieur à 100m. Vérifier la conformité de l'adresse.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address detail */}
              <div className="text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Adresse de Livraison</span>
                <span className="font-semibold text-white block">{item.recipient_address}</span>
              </div>
            </div>
          </div>

          {/* AUDIT NOTE IF PREVIOUSLY REVIEWED */}
          {item.audited_by && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Certifiée par {item.audited_by}
              </span>
              <span className="text-slate-500">{item.audited_at}</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onReschedule(item.id)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Requalifier en Relivraison</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onReject(item.id, 'Preuve illisible ou non-conforme')}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all"
            >
              ⚠️ Rejeter / Invalider
            </button>

            <button
              onClick={() => onApprove(item.id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approuver & Certifier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
