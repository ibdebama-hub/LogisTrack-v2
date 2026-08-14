'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCheck,
  Send,
  Building2,
  Phone,
  ShieldCheck,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  Mission,
  MissionStatus,
  IncidentType,
  IncidentSeverity
} from '../../../types/mission';
import {
  getMissionStatusBadgeStyle,
  getMissionStatusLabel,
  getAllowedNextStatuses,
  canTransitionMissionStatus
} from '../../../lib/missionWorkflow';
import { useMissionDetail } from '../../../hooks/useMissionDetail';

interface MissionDetailDrawerProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onMissionUpdated?: () => void;
}

export default function MissionDetailDrawer({
  mission: initialMission,
  isOpen,
  onClose,
  onMissionUpdated
}: MissionDetailDrawerProps) {
  const { mission, setMission, changeStatus, addIncident, addComment } = useMissionDetail(initialMission);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'workflow' | 'history' | 'incidents' | 'documents' | 'comments'
  >('overview');

  // New Comment State
  const [commentText, setCommentText] = useState('');

  // New Incident State
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('PHONE_UNREACHABLE');
  const [incidentSeverity, setIncidentSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [incidentDescription, setIncidentDescription] = useState('');

  if (!isOpen || !mission) return null;

  const badgeStyle = getMissionStatusBadgeStyle(mission.status);
  const allowedNext = getAllowedNextStatuses(mission.status);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    await addComment(commentText);
    setCommentText('');
  };

  const handleReportIncident = async () => {
    if (!incidentDescription.trim()) return;
    await addIncident(incidentType, incidentSeverity, incidentDescription);
    setIsIncidentModalOpen(false);
    setIncidentDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* 1. DRAWER HEADER */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/50">
                {mission.mission_number}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
              >
                <span>{badgeStyle.icon}</span>
                <span>{getMissionStatusLabel(mission.status)}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {mission.recipient_name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Campagne : {mission.campaign_name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. DRAWER TAB NAVIGATION */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Vue Générale</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'workflow'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Workflow & Transitions</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historique ({mission.history?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'incidents'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Incidents ({mission.incidents?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Pièces Jointes ({mission.documents?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'comments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Commentaires ({mission.comments?.length || 0})</span>
          </button>
        </div>

        {/* 3. DRAWER BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* RECIPIENT CARD */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Destinataire & Adresse</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nom complet</span>
                    <span className="font-bold text-white text-sm">{mission.recipient_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Téléphone</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {mission.recipient_phone}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Adresse de livraison</span>
                    <span className="text-slate-200 font-medium">{mission.address_raw}</span>
                  </div>
                  {mission.landmark_description && (
                    <div className="sm:col-span-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-indigo-400 font-bold block mb-0.5">Repère Visuel :</span>
                      <span className="text-slate-300 italic">{mission.landmark_description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MISSION PARAMETERS */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Paramètres Métier & SLA</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Type d'objet</span>
                    <span className="font-semibold text-white uppercase">{mission.item_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Montant COD (FCFA)</span>
                    <span className="font-mono font-bold text-amber-400">
                      {mission.cod_amount > 0 ? `${mission.cod_amount.toLocaleString()} FCFA` : 'Aucun'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Délai SLA</span>
                    <span className="font-bold text-indigo-400">{mission.sla_hours} Heures</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Agent Affecté</span>
                    <span className="font-semibold text-white">
                      {mission.assigned_agent_name || 'Non attribué'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Chef de Zone</span>
                    <span className="font-semibold text-slate-300">
                      {mission.team_leader_name || 'Traoré Bakary'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date Limite</span>
                    <span className="font-mono text-slate-300">{mission.due_date}</span>
                  </div>
                </div>
              </div>

              {/* FAILURE REASON IF FAILED */}
              {mission.status === 'ECHOUEE' && (
                <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-800/80 space-y-1">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Motif d'Échec Déclaré</span>
                  </h4>
                  <p className="text-xs text-rose-200 font-semibold">{mission.failure_reason}</p>
                  <p className="text-xs text-slate-300 italic">{mission.failure_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKFLOW & TRANSITIONS */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Actions de Transition de Statut Permises
                </h3>
                <p className="text-xs text-slate-400">
                  Statut actuel : <strong className="text-white">{getMissionStatusLabel(mission.status)}</strong>.
                  Seules les transitions autorisées par la machine à états sont cliquables.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {allowedNext.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-slate-900 p-3 rounded-xl border border-slate-800 w-full text-center">
                      Mission dans un état terminal ({mission.status}). Aucune transition ultérieure n'est autorisée.
                    </div>
                  ) : (
                    allowedNext.map((st) => (
                      <button
                        key={st}
                        onClick={() => changeStatus(st, `Changement vers ${st} depuis l'interface Dispatcher.`)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Passer à : {getMissionStatusLabel(st)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Historique d'Audit Horodaté
              </h3>
              <div className="space-y-3">
                {mission.history && mission.history.length > 0 ? (
                  mission.history.map((h) => (
                    <div
                      key={h.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800/50 text-indigo-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{h.action_title}</span>
                          <span className="font-mono text-slate-500">{h.created_at}</span>
                        </div>
                        <p className="text-xs text-slate-300">{h.comment}</p>
                        <span className="text-[10px] text-slate-500 block">Par : {h.user_name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">Aucun événement d'audit enregistré.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INCIDENTS */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Incidents & Anomalies
                </h3>
                <button
                  onClick={() => setIsIncidentModalOpen(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Signaler un Incident</span>
                </button>
              </div>

              <div className="space-y-3">
                {mission.incidents && mission.incidents.length > 0 ? (
                  mission.incidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="bg-slate-950 p-4 rounded-xl border border-rose-900/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {inc.incident_type}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{inc.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        <span>Déclaré par : {inc.reported_by_name}</span>
                        <span>{inc.created_at}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">Aucun incident signalé sur cette mission.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Documents & Pièces Jointes (Supabase Storage)
              </h3>

              <div className="space-y-3">
                {mission.documents && mission.documents.length > 0 ? (
                  mission.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-indigo-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">{doc.file_name}</span>
                          <span className="text-[10px] text-slate-500">
                            {doc.file_type} • {(doc.file_size_bytes / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      </div>

                      <a
                        href={doc.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">Aucun document joint.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-4 flex flex-col h-full">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fil de Discussion Signé & Horodaté
              </h3>

              <div className="space-y-3 flex-1">
                {mission.comments && mission.comments.length > 0 ? (
                  mission.comments.map((com) => (
                    <div
                      key={com.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-400">{com.author_name} ({com.author_role})</span>
                        <span className="text-[10px] text-slate-500">{com.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-200">{com.comment_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-4">Aucun commentaire publié.</p>
                )}
              </div>

              {/* POST COMMENT BOX */}
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Écrire un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500"
                />
                <button
                  onClick={handlePostComment}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL REPORT INCIDENT */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Signaler un Incident</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Type d'incident</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="PHONE_UNREACHABLE">Téléphone injoignable</option>
                  <option value="RECIPIENT_ABSENT">Destinataire absent</option>
                  <option value="ADDRESS_NOT_FOUND">Adresse introuvable</option>
                  <option value="REFUSED_COD">Refus de paiement COD</option>
                  <option value="BAD_ADDRESS">Erreur d'adresse</option>
                  <option value="TECHNICAL_ISSUE">Problème technique</option>
                  <option value="OTHER">Autre incident</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Sévérité</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="LOW">Moyenne (Faible impact)</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute (Action rapide requise)</option>
                  <option value="CRITICAL">🔴 Critique (Blocage livraison)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Détails de l'anomalie constatée sur le terrain..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsIncidentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={handleReportIncident}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Enregistrer Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
