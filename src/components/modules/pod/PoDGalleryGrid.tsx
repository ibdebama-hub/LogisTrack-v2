'use client';

import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  QrCode,
  User,
  Building2,
  Phone
} from 'lucide-react';
import { PoDRecordEnterprise } from '../../../types/podEnterprise';

interface PoDGalleryGridProps {
  pods: PoDRecordEnterprise[];
  onApprovePoD: (podId: string) => void;
  onDownloadPdf: (pod: PoDRecordEnterprise) => void;
}

export default function PoDGalleryGrid({
  pods,
  onApprovePoD,
  onDownloadPdf
}: PoDGalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pods.map((p) => {
        const isApproved = p.status === 'APPROVED';
        const isConforme = p.conformance_status === 'CONFORME';

        return (
          <div
            key={p.id}
            className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl hover:border-indigo-500/50 transition-all"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                    {p.pod_number}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{p.mission_number}</span>
                </div>
                <h3 className="font-bold text-sm text-white">{p.recipient_name}</h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  isApproved
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}
              >
                {isApproved ? '🟢 CERTIFIÉE' : '🟡 EN ATTENTE'}
              </span>
            </div>

            {/* GPS CONFORMANCE BADGE & DISTANCE */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${isConforme ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-slate-300 font-mono text-[11px]">
                  GPS : {p.gps_lat.toFixed(4)}, {p.gps_lng.toFixed(4)}
                </span>
              </div>
              <span
                className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                  isConforme
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                Écart : {p.gps_distance_diff_meters}m ({p.conformance_status})
              </span>
            </div>

            {/* SIGNATURE & MEDIA PREVIEW */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* SIGNATURE PREVIEW */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Signature ({p.signer_role})
                </span>
                {p.signature_url ? (
                  <img src={p.signature_url} alt="Signature" className="max-h-16 mx-auto rounded" />
                ) : (
                  <div className="h-16 flex items-center justify-center text-slate-600 italic">Signature tactile</div>
                )}
                <span className="text-[10px] text-slate-400 font-bold block">{p.signer_name}</span>
              </div>

              {/* PHOTOS PREVIEW */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Photos de Preuve ({p.photos.length})
                </span>
                <div className="flex justify-center gap-1 overflow-x-auto">
                  {p.photos.length > 0 ? (
                    p.photos.map((ph, idx) => (
                      <img
                        key={idx}
                        src={ph.url}
                        alt="Preuve"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800"
                      />
                    ))
                  ) : (
                    <div className="h-14 flex items-center justify-center text-slate-600 italic">Photos jointes</div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => onDownloadPdf(p)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Certificat PDF</span>
              </button>

              <a
                href={`/verify/pod/${p.pod_number}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition-all"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>QR Vérif</span>
              </a>

              {!isApproved && (
                <button
                  onClick={() => onApprovePoD(p.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approuver</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
