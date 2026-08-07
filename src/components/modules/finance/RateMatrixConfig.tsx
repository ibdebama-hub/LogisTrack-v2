'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Layers,
  MapPin,
  CheckCircle2,
  Edit2,
  Building,
  Settings,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { ClientRateConfig, PricingModel } from '@/types/b2bBilling';

interface RateMatrixConfigProps {
  rates: ClientRateConfig[];
  onSaveRate: (updatedRate: ClientRateConfig) => void;
}

export default function RateMatrixConfig({ rates, onSaveRate }: RateMatrixConfigProps) {
  const [selectedRate, setSelectedRate] = useState<ClientRateConfig | null>(rates[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [pricingModel, setPricingModel] = useState<PricingModel>(selectedRate?.pricing_model || 'FLAT_PER_UNIT');
  const [baseUnitPrice, setBaseUnitPrice] = useState<number>(selectedRate?.base_unit_price || 2500);
  const [signatureExtra, setSignatureExtra] = useState<number>(selectedRate?.options.hand_delivery_signature_extra || 500);
  const [npaiFee, setNpaiFee] = useState<number>(selectedRate?.options.npai_return_fee || 300);
  const [codCommission, setCodCommission] = useState<number>(selectedRate?.options.cod_commission_percentage || 1.5);

  const handleSelectClientRate = (rate: ClientRateConfig) => {
    setSelectedRate(rate);
    setPricingModel(rate.pricing_model);
    setBaseUnitPrice(rate.base_unit_price);
    setSignatureExtra(rate.options.hand_delivery_signature_extra);
    setNpaiFee(rate.options.npai_return_fee);
    setCodCommission(rate.options.cod_commission_percentage);
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRate) return;

    const updated: ClientRateConfig = {
      ...selectedRate,
      pricing_model: pricingModel,
      base_unit_price: baseUnitPrice,
      options: {
        hand_delivery_signature_extra: signatureExtra,
        npai_return_fee: npaiFee,
        cod_commission_percentage: codCommission
      }
    };

    onSaveRate(updated);
    setSelectedRate(updated);
    setIsEditing(false);
  };

  const formatAmount = (val: number, currency: string = 'GNF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : 'GNF',
      maximumFractionDigits: 0
    }).format(val).replace('XOF', 'FCFA');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            Configuration des Grilles Tarifaires Donneurs d'Ordres
          </h3>
          <p className="text-xs text-slate-400">
            Définition des prix unitaire par pli, tranches dégressives de volume, tarifs par zone et suppléments d'options.
          </p>
        </div>

        {selectedRate && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Edit2 className="w-4 h-4" /> Modifier les Tarifs
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. CLIENT SELECTION LIST */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Clients Donneurs d'Ordres
          </span>

          <div className="space-y-2">
            {rates.map(r => {
              const isSelected = selectedRate?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleSelectClientRate(r)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 font-bold text-indigo-400 text-xs flex items-center justify-center">
                        {r.client_code}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">{r.client_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">Modèle: {r.pricing_model}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatAmount(r.base_unit_price, r.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. RATE MATRIX EDITOR & DETAILS DISPLAY */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          {selectedRate && !isEditing ? (
            /* VIEW MODE */
            <div className="space-y-6">
              {/* Selected client banner */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Grille Tarifaire Active</span>
                  <h4 className="text-lg font-black text-white">{selectedRate.client_name} ({selectedRate.client_code})</h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Prix Unitaire de Base</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {formatAmount(selectedRate.base_unit_price, selectedRate.currency)}
                  </span>
                </div>
              </div>

              {/* PRICING MODEL DETAILS */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Structure de Tarification ({selectedRate.pricing_model})
                </h5>

                {selectedRate.pricing_model === 'VOLUME_TIERED' && selectedRate.volume_tiers && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-indigo-300 block mb-2">Tranches Dégressives par Volume de Plis:</span>
                    <div className="space-y-1.5 font-mono text-xs">
                      {selectedRate.volume_tiers.map((vt, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-slate-400">De {vt.min_qty} à {vt.max_qty >= 999999 ? '+' : vt.max_qty} plis:</span>
                          <span className="font-bold text-emerald-400">{formatAmount(vt.unit_price, selectedRate.currency)} / pli</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRate.pricing_model === 'ZONE_BASED' && selectedRate.zone_prices && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-indigo-300 block mb-2">Tarification par Zone Géographique:</span>
                    <div className="space-y-1.5 font-mono text-xs">
                      {selectedRate.zone_prices.map((zp, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-slate-400">{zp.zone_name} ({zp.zone_code}):</span>
                          <span className="font-bold text-emerald-400">{formatAmount(zp.unit_price, selectedRate.currency)} / pli</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRate.pricing_model === 'FLAT_PER_UNIT' && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                    Tarif uniforme appliqué à l'ensemble des plis et factures distribués quel que soit le volume ou la zone.
                  </div>
                )}
              </div>

              {/* OPTIONS AND SUPPLEMENTS */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Suppléments & Frais d'Options Souscrites
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block">Preuve Tactile (Signature)</span>
                    <span className="font-bold text-indigo-300 font-mono">
                      + {formatAmount(selectedRate.options.hand_delivery_signature_extra, selectedRate.currency)}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block">Frais Traitement NPAI</span>
                    <span className="font-bold text-amber-400 font-mono">
                      + {formatAmount(selectedRate.options.npai_return_fee, selectedRate.currency)}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block">Commission Encaissement COD</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {selectedRate.options.cod_commission_percentage}% du cash perçu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white">Édition des Tarifs : {selectedRate?.client_name}</h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Modèle de Tarification</label>
                  <select
                    value={pricingModel}
                    onChange={e => setPricingModel(e.target.value as PricingModel)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="FLAT_PER_UNIT">Tarif Fixe Unitaire par Pli</option>
                    <option value="VOLUME_TIERED">Tarification Dégressive par Volume</option>
                    <option value="ZONE_BASED">Tarification par Zone / Distance</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Prix Unitaire de Base ({selectedRate?.currency})</label>
                  <input
                    type="number"
                    value={baseUnitPrice}
                    onChange={e => setBaseUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Supplément Signature</label>
                    <input
                      type="number"
                      value={signatureExtra}
                      onChange={e => setSignatureExtra(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Frais NPAI / Échec</label>
                    <input
                      type="number"
                      value={npaiFee}
                      onChange={e => setNpaiFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Commission COD (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={codCommission}
                      onChange={e => setCodCommission(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg"
                >
                  Enregistrer les Modifs
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
