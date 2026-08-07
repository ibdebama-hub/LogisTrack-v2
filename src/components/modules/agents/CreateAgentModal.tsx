'use client';

import React, { useState } from 'react';
import { X, UserPlus, Shield, Phone, Mail, MapPin, Bike, Car, Layers, Footprints, Key } from 'lucide-react';
import { FleetAgentFull, VehicleType } from '@/types/agentFleet';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAgent: Partial<FleetAgentFull>) => void;
}

export default function CreateAgentModal({
  isOpen,
  onClose,
  onSave
}: CreateAgentModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'field_agent' | 'team_leader'>('field_agent');
  const [zone, setZone] = useState('Kaloum Centre-Ville');
  const [vehicleType, setVehicleType] = useState<VehicleType>('MOTO');
  const [licensePlate, setLicensePlate] = useState('');
  const [pwaPin, setPwaPin] = useState('1234');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    onSave({
      full_name: fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@logistrack.gn`,
      role,
      status: 'DISPONIBLE',
      primary_zone_name: zone,
      primary_zone_code: zone.substring(0, 5).toUpperCase(),
      vehicle: {
        type: vehicleType,
        license_plate: licensePlate || 'RC-0000-X',
        equipment_id: `VEH-${Math.floor(Math.random() * 900 + 100)}`
      },
      telemetry: {
        battery_level: 100,
        gps_status: 'EXCELLENT',
        gps_lat: 9.5092,
        gps_lng: -13.7122,
        network_mode: '4G',
        last_ping_at: 'À l\'instant',
        pwa_version: 'v2.4.1'
      },
      workload: {
        total_assigned: 0,
        delivered: 0,
        remaining: 0,
        failed: 0
      },
      cod: {
        collected_today: 0,
        pending_discharge: 0
      },
      performance: {
        success_rate: 100,
        avg_time_per_delivery: '10 min',
        npai_rate: 0,
        reconciliation_score: 'Nouveau'
      },
      route_history: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Ajouter un Agent Terrain</h3>
              <p className="text-xs text-slate-400">Créer une nouvelle fiche livreur et son accès PWA</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* SECTION 1: INFORMATIONS PERSONNELLES */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Identity & Connexion PWA
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Nom et Prénom <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ex: Mamadou Diallo"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Numéro Téléphone <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+224 620 00 00 00"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="agent@logistrack.gn"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Code PIN d'Accès PWA</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pwaPin}
                    onChange={e => setPwaPin(e.target.value)}
                    maxLength={4}
                    placeholder="1234"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Rôle & Responsabilité</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('field_agent')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'field_agent'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-white">Distributeur Terrain</span>
                  <span className="text-[10px] text-slate-400 font-normal">Effectue les remises de plis & PoD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('team_leader')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    role === 'team_leader'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-white">Chef d'Équipe</span>
                  <span className="text-[10px] text-slate-400 font-normal">Supervise la zone & réassignations</span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* SECTION 2: ZONE & VÉHICULE */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Zone & Moyen de Transports
            </h4>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Zone Principale d'Affectation</label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Kaloum Centre-Ville">Kaloum Centre-Ville (Z-KAL)</option>
                <option value="Dixinn & Landréah">Dixinn & Landréah (Z-DIX)</option>
                <option value="Cocody & Riviera">Cocody & Riviera (Z-COC)</option>
                <option value="Ratoma & Kipé">Ratoma & Kipé (Z-RAT)</option>
                <option value="Dakar Plateau & Medina">Dakar Plateau & Medina (Z-DAK)</option>
                <option value="Yopougon Industrial Zone">Yopougon Industrial Zone (Z-YOP)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Type de Véhicule</label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value as VehicleType)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="MOTO">Moto de livraison (125cc)</option>
                  <option value="TRICYCLE">Tricycle Cargo (200cc)</option>
                  <option value="À PIED">À Pied (Courrier hyper-centre)</option>
                  <option value="VOITURE">Fourgonnette / Voiture</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Immatriculation / Matériel</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={e => setLicensePlate(e.target.value)}
                  placeholder="Ex: RC-9842-A"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Enregistrer l'Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
