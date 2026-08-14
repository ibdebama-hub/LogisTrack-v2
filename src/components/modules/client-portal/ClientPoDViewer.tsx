'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, FileCheck, Eye, MapPin, CheckCircle2, ShieldCheck, Printer, X, Sparkles } from 'lucide-react';
import { MOCK_CLIENT_POD_PROOFS } from '../../../lib/mockClientPortalData';
import { ClientPoDProof } from '../../../types/b2bClientPortal';
import { useRealtimeSync } from '../../../hooks/useRealtimeSync';

export default function ClientPoDViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProof, setSelectedProof] = useState<ClientPoDProof | null>(null);
  const [proofList, setProofList] = useState<ClientPoDProof[]>(MOCK_CLIENT_POD_PROOFS);

  const { latestCertifiedPoD } = useRealtimeSync();

  // Listen to realtime certified PoD updates from Dispatcher
  useEffect(() => {
    if (latestCertifiedPoD) {
      setProofList(prev => {
        if (prev.some(p => p.id === latestCertifiedPoD.id || p.tracking_number === latestCertifiedPoD.tracking_number)) {
          return prev;
        }
        return [latestCertifiedPoD, ...prev];
      });
    }
  }, [latestCertifiedPoD]);

  const filteredProofs = proofList.filter(p =>
    p.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.recipient_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* REALTIME POD BANNER ALERT */}
      {latestCertifiedPoD && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-200">
                Certifiée conforme par le transporteur !
              </h4>
              <p className="text-[11px] text-emerald-300/80">
                La preuve pour <strong className="font-mono text-white">{latestCertifiedPoD.tracking_number}</strong> ({latestCertifiedPoD.recipient_name}) vient d'être certifiée et archivée dans votre coffre-fort PoD.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
            Realtime Sync Active
          </span>
        </div>
      )}

      {/* HEADER & SEARCH BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-400" />
              Attestations & Preuves de Livraison Certifiées (PoD Hub)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Recherchez et téléchargez les bordereaux avec visuel de signature tactile, horodatage et filigrane GPS.
            </p>
          </div>

          <button
            onClick={() => alert('Exportation de l\'ensemble des décharges certifiées au format ZIP en cours...')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Tout en ZIP</span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par référence facture, nom de destinataire, adresse..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* PROOFS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProofs.map(p => (
            <div
              key={p.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-extrabold text-white text-sm">{p.tracking_number}</span>
                  <span className="text-xs text-slate-400 block mt-0.5 font-semibold">{p.recipient_name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CERTIFIÉE CONFORME
                </span>
              </div>

              {/* Proof Image box */}
              <div className="bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center min-h-[100px] overflow-hidden">
                {p.proof_image_url ? (
                  <img src={p.proof_image_url} alt="Signature PoD" className="max-h-[90px] w-auto object-contain" />
                ) : (
                  <div className="text-center font-mono text-emerald-400 text-xs font-bold">OTP VERIFIÉ</div>
                )}
              </div>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>Remis le: <strong className="text-slate-200">{p.delivery_timestamp}</strong></div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <MapPin className="w-3 h-3" /> GPS: {p.gps_lat?.toFixed(4)}, {p.gps_lng?.toFixed(4)} (Précision {p.gps_accuracy_meters}m)
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProof(p)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" /> Inspecter HD
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs transition-all flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Télécharger PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HD PROOF MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">Bordereau Certifié PoD : {selectedProof.tracking_number}</h3>
              </div>
              <button onClick={() => setSelectedProof(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl text-slate-900 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <span className="font-bold text-sm text-indigo-900">LOGISTRACK PROOF CERTIFICATION</span>
                  <p className="text-slate-500 text-[10px]">Filigrane Horodaté & GPS • Certifiée Conforme par le Transporteur</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-base text-slate-900">{selectedProof.tracking_number}</span>
                </div>
              </div>

              <div>
                <p>Destinataire: <strong>{selectedProof.recipient_name}</strong></p>
                <p>Adresse: {selectedProof.recipient_address}</p>
                <p>Date & Heure: {selectedProof.delivery_timestamp}</p>
                <p>Coordonnées GPS: {selectedProof.gps_lat}, {selectedProof.gps_lng}</p>
              </div>

              <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 flex items-center justify-center min-h-[140px]">
                {selectedProof.proof_image_url ? (
                  <img src={selectedProof.proof_image_url} alt="Signature HD" className="max-h-[120px]" />
                ) : (
                  <div className="font-bold text-emerald-800">OTP Verifié sur mobile agent</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimer / Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
