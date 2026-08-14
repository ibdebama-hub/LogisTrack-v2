'use client';

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  Check,
  Mail,
  Lock,
  Globe,
  Phone,
  Briefcase,
  KeyRound,
  Zap,
  Server,
  Users
} from 'lucide-react';
import { OnboardingWizardData, ProvisioningResult } from '../../../../types/saasOnboarding';
import { MOCK_SAAS_PLANS } from '../../../../lib/services/saasPlatformService';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingWizardData) => Promise<ProvisioningResult>;
}

export default function OnboardingWizardModal({
  isOpen,
  onClose,
  onComplete
}: OnboardingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [provisioningResult, setProvisioningResult] = useState<ProvisioningResult | null>(null);
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<OnboardingWizardData>({
    orgInfo: {
      name: '',
      country: "Côte d'Ivoire",
      city: 'Abidjan',
      address: '',
      phone: '',
      email: '',
      website: '',
      currency: 'XOF',
      timezone: 'Africa/Abidjan',
      language: 'fr',
      industry_sector: 'DISTRIBUTION_COURRIER'
    },
    planInfo: {
      plan_code: 'PROFESSIONAL',
      billing_cycle: 'MONTHLY'
    },
    adminInfo: {
      first_name: '',
      last_name: '',
      job_title: 'Directeur des Opérations Logistiques',
      phone: '',
      email: ''
    }
  });

  if (!isOpen) return null;

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as any);
    } else if (currentStep === 3) {
      setIsProvisioning(true);
      setCurrentStep(4);
      try {
        const result = await onComplete(formData);
        setProvisioningResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProvisioning(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleCopyPassword = () => {
    if (provisioningResult?.temp_password) {
      navigator.clipboard.writeText(provisioningResult.temp_password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                ASSISTANT D&apos;ONBOARDING CLIENT SAAS
              </span>
              <h2 className="text-xl font-bold text-white">Provisionnement d&apos;une Nouvelle Organisation</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Stepper Header */}
        <div className="px-8 py-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          {[
            { step: 1, title: "1. Organisation", icon: Building2 },
            { step: 2, title: "2. Plan Tarifaire", icon: ShieldCheck },
            { step: 3, title: "3. Admin Principal", icon: UserCheck },
            { step: 4, title: "4. Provisionnement", icon: CheckCircle2 }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;

            return (
              <div key={item.step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {item.title}
                </span>
                {item.step < 4 && <ChevronRight className="w-4 h-4 text-slate-700 hidden md:inline" />}
              </div>
            );
          })}
        </div>

        {/* Step Body Content */}
        <div className="p-8 max-h-[65vh] overflow-y-auto space-y-6">
          {/* STEP 1: INFORMATIONS ORGANISATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" /> Étape 1 — Informations de l&apos;Entreprise Cliente
                </h3>
                <p className="text-xs text-slate-400">
                  Définissez l&apos;identité juridique, les paramètres régionaux et la devise du nouveau compte client SaaS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom de l&apos;entreprise *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sahel Logistics & Courier SARL"
                    value={formData.orgInfo.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, name: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Secteur d&apos;activité</label>
                  <select
                    value={formData.orgInfo.industry_sector}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, industry_sector: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DISTRIBUTION_COURRIER">Distribution Factures & Courriers</option>
                    <option value="EXPRESS_DELIVERY">Livraison Express Colis & E-Commerce</option>
                    <option value="TELECOM_BANKING">Banques & Opérateurs Télécoms</option>
                    <option value="PHARMA_HEALTH">Distribution Pharmaceutique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Pays d&apos;implantation *</label>
                  <input
                    type="text"
                    value={formData.orgInfo.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, country: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ville du Siège</label>
                  <input
                    type="text"
                    value={formData.orgInfo.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, city: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">E-mail principal entreprise *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@sahel-logistics.com"
                    value={formData.orgInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, email: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    placeholder="+225 07 00 11 22 33"
                    value={formData.orgInfo.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, phone: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Devise de facturation</label>
                  <select
                    value={formData.orgInfo.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, currency: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="XOF">XOF (Franc CFA UEMOA)</option>
                    <option value="GNF">GNF (Franc Guinéen)</option>
                    <option value="XAF">XAF (Franc CFA CEMAC)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar US)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fuseau Horaire</label>
                  <select
                    value={formData.orgInfo.timezone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgInfo: { ...formData.orgInfo, timezone: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Africa/Abidjan">Africa/Abidjan (UTC+0)</option>
                    <option value="Africa/Bamako">Africa/Bamako (UTC+0)</option>
                    <option value="Africa/Conakry">Africa/Conakry (UTC+0)</option>
                    <option value="Africa/Dakar">Africa/Dakar (UTC+0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLAN D'ABONNEMENT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" /> Étape 2 — Choix du Plan d&apos;Abonnement SaaS
                </h3>
                <p className="text-xs text-slate-400">
                  Sélectionnez la formule d&apos;abonnement adaptée. Les quotas d&apos;utilisateurs, agents et stockage seront automatiquement provisionnés.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_SAAS_PLANS.map((plan) => {
                  const isSelected = formData.planInfo.plan_code === plan.code;
                  return (
                    <div
                      key={plan.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          planInfo: { ...formData.planInfo, plan_code: plan.code as any }
                        })
                      }
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                          {plan.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">{plan.name}</h4>
                      <p className="text-xs text-slate-400 mb-4 h-10">{plan.description}</p>

                      <div className="text-xl font-bold text-white mb-4">
                        {plan.price_monthly.toLocaleString('fr-FR')} {plan.currency}{' '}
                        <span className="text-xs text-slate-500 font-normal">/ mois</span>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Max Utilisateurs :</span>
                          <span className="font-bold text-white">{plan.max_users}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Max Agents Flotte :</span>
                          <span className="font-bold text-white">{plan.max_agents}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Stockage Inclus :</span>
                          <span className="font-bold text-white">{plan.storage_limit_gb} Go</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: ADMINISTRATEUR PRINCIPAL */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" /> Étape 3 — Administrateur Principal (Propriétaire)
                </h3>
                <p className="text-xs text-slate-400">
                  Renseignez les coordonnées du premier administrateur. Le rôle attribué sera automatiquement <span className="text-indigo-400 font-mono font-bold">Dispatcher Administrator</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Moussa"
                    value={formData.adminInfo.first_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminInfo: { ...formData.adminInfo, first_name: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Diallo"
                    value={formData.adminInfo.last_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminInfo: { ...formData.adminInfo, last_name: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Adresse E-mail Professionnelle *</label>
                  <input
                    type="email"
                    required
                    placeholder="m.diallo@sahel-logistics.com"
                    value={formData.adminInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminInfo: { ...formData.adminInfo, email: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Téléphone direct</label>
                  <input
                    type="text"
                    placeholder="+225 07 88 99 00"
                    value={formData.adminInfo.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminInfo: { ...formData.adminInfo, phone: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                  <div className="text-xs text-indigo-200">
                    <strong>Politique de Sécurité Automatique :</strong> Un mot de passe temporaire cryptographique de 18 caractères sera généré. Une invitation lui sera transmise imposant un changement obligatoire de mot de passe à la 1ère connexion.
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1 pl-1">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span>Forcer le changement de mot de passe à la première connexion (Recommandé)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: PROVISIONNEMENT & RÉSULTAT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {isProvisioning ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <h3 className="text-lg font-bold text-white">Provisionnement de l&apos;Organisation en cours...</h3>
                  <p className="text-xs text-slate-400">Création de l&apos;espace tenant, quotas, permissions et génération des clés d&apos;accès.</p>
                </div>
              ) : provisioningResult ? (
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Organisation Provisionnée avec Succès !</h3>
                      <p className="text-xs text-emerald-300">
                        {provisioningResult.tenant_name} est désormais active. L&apos;invitation d&apos;onboarding a été transmise à {provisioningResult.admin_email}.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-400" /> Identifiants de Première Connexion Générés
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-500 font-mono">ID Tenant :</span>
                        <div className="font-bold text-white mt-1 font-mono">{provisioningResult.tenant_id}</div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-500 font-mono">Compte Admin :</span>
                        <div className="font-bold text-white mt-1 font-mono">{provisioningResult.admin_email}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 font-mono">Mot de passe temporaire (18 chars) :</span>
                        <div className="text-base font-mono font-bold text-sky-400 mt-1">
                          {provisioningResult.temp_password}
                        </div>
                      </div>

                      <button
                        onClick={handleCopyPassword}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30"
                      >
                        {copiedPassword ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedPassword ? 'Copié !' : 'Copier'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-8 py-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !formData.orgInfo.name}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              {currentStep === 3 ? 'Lancer le Provisionnement' : 'Suivant'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/30"
            >
              Fermer & Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
