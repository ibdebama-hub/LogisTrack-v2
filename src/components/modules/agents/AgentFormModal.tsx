'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Edit3,
  Shield,
  Phone,
  Mail,
  MapPin,
  Bike,
  Car,
  Layers,
  Footprints,
  Key,
  Building,
  DollarSign,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { FleetAgentFull, VehicleType } from '@/types/agentFleet';
import AgentTerritoryAssignment from './AgentTerritoryAssignment';

interface AgentFormModalProps {
  isOpen: boolean;
  agentToEdit: FleetAgentFull | null; // Null for Creation Mode, Non-null for Edit Mode
  onClose: () => void;
  onSave: (agentData: Partial<FleetAgentFull>) => void;
}

export default function AgentFormModal({
  isOpen,
  agentToEdit,
  onClose,
  onSave
}: AgentFormModalProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'territory' | 'operations' | 'security'>('profile');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pwaPin, setPwaPin] = useState('1234');
  const [role, setRole] = useState<'field_agent' | 'team_leader'>('field_agent');
  const [vehicleType, setVehicleType] = useState<VehicleType>('MOTO');
  const [licensePlate, setLicensePlate] = useState('');

  // Territory & Client Assignment States
  const [selectedZones, setSelectedZones] = useState<string[]>(['Kaloum Centre-Ville']);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['Almamya', 'Sandervalia']);
  const [selectedClients, setSelectedClients] = useState<string[]>(['Tous (Polyvalent)']);

  // Operation Restrictions & COD Ceiling
  const [allowInvoices, setAllowInvoices] = useState(true);
  const [allowConfidential, setAllowConfidential] = useState(true);
  const [allowCodParcels, setAllowCodParcels] = useState(true);
  const [maxCodCeiling, setMaxCodCeiling] = useState<number>(1000000);

  // Status
  const [accountStatus, setAccountStatus] = useState<'ACTIF' | 'SUSPENDU' | 'INACTIF'>('ACTIF');
  const [pinResetNotice, setPinResetNotice] = useState(false);

  // Synchronize when agentToEdit changes or modal opens
  useEffect(() => {
    if (agentToEdit) {
      setFullName(agentToEdit.full_name || '');
      setPhone(agentToEdit.phone || '');
      setEmail(agentToEdit.email || '');
      setPwaPin(agentToEdit.pwa_pin || '1234');
      setRole(agentToEdit.role === 'team_leader' ? 'team_leader' : 'field_agent');
      setVehicleType(agentToEdit.vehicle?.type || 'MOTO');
      setLicensePlate(agentToEdit.vehicle?.license_plate || '');

      setSelectedZones(agentToEdit.assigned_zone_names || [agentToEdit.primary_zone_name]);
      setSelectedDistricts(agentToEdit.assigned_district_names || agentToEdit.district_names || []);
      setSelectedClients(agentToEdit.allowed_client_names || ['Tous (Polyvalent)']);

      const ops = agentToEdit.allowed_operation_types || ['Distribution Factures', 'Plis Confidentiels', 'Livraisons Colis COD'];
      setAllowInvoices(ops.includes('Distribution Factures'));
      setAllowConfidential(ops.includes('Plis Confidentiels'));
      setAllowCodParcels(ops.includes('Livraisons Colis COD'));

      setMaxCodCeiling(agentToEdit.max_cod_cash_ceiling || 1000000);
      setAccountStatus(agentToEdit.account_status || 'ACTIF');
    } else {
      // Creation Defaults
      setFullName('');
      setPhone('');
      setEmail('');
      setPwaPin('1234');
      setRole('field_agent');
      setVehicleType('MOTO');
      setLicensePlate('');

      setSelectedZones(['Kaloum Centre-Ville']);
      setSelectedDistricts(['Almamya', 'Sandervalia', 'Boulbinet']);
      setSelectedClients(['Tous (Polyvalent)']);

      setAllowInvoices(true);
      setAllowConfidential(true);
      setAllowCodParcels(true);
      setMaxCodCeiling(1000000);
      setAccountStatus('ACTIF');
    }
  }, [agentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleResetPin = () => {
    setPwaPin('1234');
    setPinResetNotice(true);
    setTimeout(() => setPinResetNotice(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const allowedOps: string[] = [];
    if (allowInvoices) allowedOps.push('Distribution Factures');
    if (allowConfidential) allowedOps.push('Plis Confidentiels');
    if (allowCodParcels) allowedOps.push('Livraisons Colis COD');

    const primaryZoneName = selectedZones[0] || 'Kaloum Centre-Ville';

    onSave({
      id: agentToEdit?.id,
      full_name: fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@logistrack.gn`,
      role,
      pwa_pin: pwaPin,
      account_status: accountStatus,
      primary_zone_name: primaryZoneName,
      primary_zone_code: primaryZoneName.substring(0, 5).toUpperCase(),
      district_names: selectedDistricts,
      assigned_zone_names: selectedZones,
      assigned_district_names: selectedDistricts,
      allowed_client_names: selectedClients,
      allowed_operation_types: allowedOps,
      max_cod_cash_ceiling: maxCodCeiling,
      vehicle: {
        type: vehicleType,
        license_plate: licensePlate || 'RC-0000-X',
        equipment_id: agentToEdit?.vehicle?.equipment_id || `VEH-${Math.floor(Math.random() * 900 + 100)}`
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
              {agentToEdit ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {agentToEdit ? `Édition d'Agent : ${agentToEdit.full_name}` : 'Nouveau Livreur Terrain'}
              </h3>
              <p className="text-xs text-slate-400">Formulaire d'administration des accès, territoires et plafonds COD</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION TABS */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-6 font-semibold text-xs gap-4 overflow-x-auto">
          {[
            { id: 'profile', label: '1. Identité & Véhicule', icon: Shield },
            { id: 'territory', label: '2. Territoires & Quartiers', icon: MapPin },
            { id: 'operations', label: '3. Clients & Plafond COD', icon: Building },
            { id: 'security', label: '4. Statut & Sécurité', icon: Lock }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* FORM BODY SCROLLABLE */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* SECTION 1: IDENTITÉ & VÉHICULE */}
          {activeSection === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h4 className="font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Profil Personnel & Connexion PWA
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Nom et Prénom <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Mamadou Diallo"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Téléphone Login PWA <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+224 620 00 00 00"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email Professionnel</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="agent@logistrack.gn"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Code PIN PWA (4 chiffres)</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={4}
                      value={pwaPin}
                      onChange={e => setPwaPin(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Rôle & Responsabilité</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('field_agent')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'field_agent'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-white">Agent Livreur / Distributeur</span>
                    <span className="text-[10px] text-slate-400 font-normal">Remise de plis, factures & PoD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('team_leader')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'team_leader'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-white">Chef de Zone / Team Lead</span>
                    <span className="text-[10px] text-slate-400 font-normal">Supervision & Réassignations</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Moyen de Transport</label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value as VehicleType)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="MOTO">Moto de livraison (125cc)</option>
                    <option value="TRICYCLE">Tricycle Cargo (200cc)</option>
                    <option value="À PIED">À Pied (Courrier hyper-centre)</option>
                    <option value="VOITURE">Fourgonnette / Voiture</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Immatriculation / Plaque</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={e => setLicensePlate(e.target.value)}
                    placeholder="Ex: RC-9842-A"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: DÉCOUPAGE TERRITORIAL */}
          {activeSection === 'territory' && (
            <div className="animate-in fade-in duration-150">
              <AgentTerritoryAssignment
                selectedZones={selectedZones}
                onChangeZones={setSelectedZones}
                selectedDistricts={selectedDistricts}
                onChangeDistricts={setSelectedDistricts}
                selectedClients={selectedClients}
                onChangeClients={setSelectedClients}
              />
            </div>
          )}

          {/* SECTION 3: CLIENTS & OPERATIONS & PLAFOND COD */}
          {activeSection === 'operations' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <h4 className="font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Restristions d'Opérations & Plafond Caisse
              </h4>

              {/* Operation types checkboxes */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="text-slate-300 font-bold block">Types d'Opérations Autorisées</label>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowInvoices}
                      onChange={e => setAllowInvoices(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <span>Distribution Factures / Courriers Simples (Sans Encaissement)</span>
                  </label>

                  <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowConfidential}
                      onChange={e => setAllowConfidential(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <span>Plis Confidentiels / Recommandés (PoD / Signature obligatoire)</span>
                  </label>

                  <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowCodParcels}
                      onChange={e => setAllowCodParcels(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <span>Livraisons Colis (Avec Encaissement COD / Cash on Delivery)</span>
                  </label>
                </div>
              </div>

              {/* COD Cash Ceiling */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-slate-300 font-bold block">Plafond de Caisse COD Autorisé en Main</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    value={maxCodCeiling}
                    onChange={e => setMaxCodCeiling(Number(e.target.value))}
                    step={100000}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Montant maximal d'espèces accumulées au-delà duquel l'agent doit obligatoirement effectuer un dépôt de caisse intermédiaire au guichet.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: STATUT & SÉCURITÉ */}
          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <h4 className="font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Statut du Compte & Sécurité
              </h4>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">Statut d'Accès de l'Agent</label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ACTIF', label: 'ACTIF (Accès Autorisé)', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/20' },
                    { id: 'SUSPENDU', label: 'SUSPENDU (En Congé)', color: 'border-amber-500 text-amber-400 bg-amber-950/20' },
                    { id: 'INACTIF', label: 'INACTIF (Désactivé)', color: 'border-rose-500 text-rose-400 bg-rose-950/20' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAccountStatus(s.id as any)}
                      className={`p-3 rounded-xl border font-bold transition-all text-center ${
                        accountStatus === s.id
                          ? s.color
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset PIN Widget */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Réinitialiser le Code PIN PWA</span>
                    <span className="text-[10px] text-slate-400 block">Réinitialise immédiatement le PIN de connexion mobile à "1234"</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetPin}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-rose-800 font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser PIN
                  </button>
                </div>

                {pinResetNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Code PIN réinitialisé à "1234". Transmis à l'agent.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-mono">
              Formulaire Administrateur Agent • LogisTrack V2
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{agentToEdit ? 'Mettre à jour l\'Agent' : 'Créer l\'Agent'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
