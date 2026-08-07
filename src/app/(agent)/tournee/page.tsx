'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Search,
  Filter,
  ChevronRight,
  FileText,
  DollarSign,
  AlertCircle,
  WifiOff,
  Navigation,
  RefreshCw,
  Lock,
  Camera,
  UserCheck,
  Play,
  CheckCheck
} from 'lucide-react';
import PoDDischargeModal from '@/components/modules/pod/PoDDischargeModal';
import DeliveryFailureModal from '@/components/modules/pod/DeliveryFailureModal';
import AgentPhotoCapture from '@/components/modules/agent/AgentPhotoCapture';
import AgentSignatureCanvas from '@/components/modules/agent/AgentSignatureCanvas';
import { useAgentMissions } from '@/hooks/useAgentMissions';
import { useGpsTracker } from '@/hooks/useGpsTracker';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Mission } from '@/types/mission';

export default function FieldAgentTourPage() {
  const { missions, isLoading, acceptMission, refuseMission, startMission } = useAgentMissions('a1');
  const { isOnline, pendingCount } = useOfflineSync();
  const { position, speed } = useGpsTracker('a1', true);

  const [activeFilter, setActiveFilter] = useState<'pending' | 'delivered' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Proof Capture Drawer Modal state
  const [selectedMissionForProof, setSelectedMissionForProof] = useState<Mission | null>(null);
  const [failureModalItem, setFailureModalItem] = useState<Mission | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [capturedSignature, setCapturedSignature] = useState<string | null>(null);

  const filteredMissions = missions.filter((m) => {
    const isDelivered = m.status === 'TERMINEE' || m.status === 'VALIDEE';
    const matchesFilter =
      activeFilter === 'all' ? true :
      activeFilter === 'delivered' ? isDelivered : !isDelivered;

    const matchesSearch =
      m.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mission_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address_raw.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const deliveredCount = missions.filter((m) => m.status === 'TERMINEE' || m.status === 'VALIDEE').length;
  const pendingCountMissions = missions.length - deliveredCount;

  const handleCompleteMission = () => {
    if (!selectedMissionForProof) return;
    // Mark mission as complete locally and trigger offline engine
    selectedMissionForProof.status = 'TERMINEE';
    setSelectedMissionForProof(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 max-w-md mx-auto border-x border-slate-800 shadow-2xl">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-bold text-white">Tournée du Jour</h1>
          </div>
          <p className="text-xs text-slate-400">Kouassi Jean-Marc • Zone Cocody</p>
        </div>

        {!isOnline ? (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded-full border border-amber-500/30">
            <WifiOff className="w-3 h-3" /> Offline ({pendingCount})
          </div>
        ) : (
          <a
            href="/scan"
            className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 flex items-center gap-1 text-xs font-bold"
          >
            <QrCode className="w-4 h-4" /> Scan Rapide
          </a>
        )}
      </header>

      {/* Tour Progress Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Progression globale</span>
          <span className="font-bold text-indigo-400">
            {deliveredCount} / {missions.length} distribués
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-500"
            style={{ width: `${missions.length > 0 ? (deliveredCount / missions.length) * 100 : 0}%` }}
          />
        </div>

        {/* Quick Filter Segmented Control */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { id: 'pending', label: `À livrer (${pendingCountMissions})` },
            { id: 'delivered', label: `Livrés (${deliveredCount})` },
            { id: 'all', label: 'Tous' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                activeFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Chercher nom, réf, repère..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Missions List */}
      <div className="px-4 space-y-3">
        {filteredMissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Aucune mission trouvée dans cette catégorie.
          </div>
        ) : (
          filteredMissions.map((m) => {
            const isCompleted = m.status === 'TERMINEE' || m.status === 'VALIDEE';
            const isFailed = m.status === 'ECHOUEE';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border space-y-3 transition-all ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800 opacity-75'
                    : isFailed
                    ? 'bg-rose-950/20 border-rose-900/40'
                    : 'bg-slate-900 border-slate-800 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{m.mission_number}</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded uppercase font-semibold">
                        {m.item_type}
                      </span>
                      {m.cod_amount > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] rounded font-bold border border-amber-500/30">
                          {m.cod_amount.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1">{m.recipient_name}</h3>
                  </div>

                  <a
                    href={`tel:${m.recipient_phone}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-slate-700"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{m.address_raw}</span>
                  </div>

                  {m.landmark_description && (
                    <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      💡 {m.landmark_description}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS ACCORDING TO MISSION WORKFLOW STATUS */}
                {!isCompleted && !isFailed && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
                    {m.status === 'CREEE' || m.status === 'AFFECTEE' ? (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => acceptMission(m.id)}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accepter
                        </button>
                        <button
                          onClick={() => refuseMission(m.id, 'Agent indisponible')}
                          className="px-3 py-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 rounded-xl font-semibold border border-slate-700"
                        >
                          Refuser
                        </button>
                      </div>
                    ) : m.status === 'ACCEPTEE' ? (
                      <button
                        onClick={() => startMission(m.id)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
                      >
                        <Play className="w-4 h-4" /> Démarrer la Tournée (GPS)
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => setSelectedMissionForProof(m)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Capturer Preuve & Clôturer
                        </button>
                        <button
                          onClick={() => setFailureModalItem(m)}
                          className="p-2.5 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded-xl border border-rose-800 font-bold"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PROOF CAPTURE DRAWER MODAL */}
      {selectedMissionForProof && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Capture Preuve PoD — {selectedMissionForProof.mission_number}</span>
            </h3>

            {/* Photo Capture */}
            <AgentPhotoCapture onPhotosChange={setCapturedPhotos} />

            {/* Signature Canvas */}
            <AgentSignatureCanvas onSignatureSave={setCapturedSignature} />

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setSelectedMissionForProof(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={handleCompleteMission}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Valider Clôture Mission</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
