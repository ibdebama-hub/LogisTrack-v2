'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  X,
  Tag,
  Upload,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  Building2,
  Users,
  Search,
  FileSpreadsheet
} from 'lucide-react';
import { ZoneTerritory, District } from '../../../types/logistrack';

const INITIAL_ZONES: ZoneTerritory[] = [
  {
    id: 'z-bmk-w',
    organization_id: 'org-1',
    name: 'Zone Bamako Ouest',
    code: 'Z-BMK-W',
    description: 'Secteur Ouest comprenant ACI 2000, Hamdallaye et Lafiabougou',
    color: '#4F46E5',
    assigned_agents_count: 4,
    districts: [
      { id: 'd-1', zone_id: 'z-bmk-w', name: 'Hamdallaye ACI 2000', assigned_agents_count: 2, active_item_count: 450 },
      { id: 'd-2', zone_id: 'z-bmk-w', name: 'Lafiabougou', assigned_agents_count: 1, active_item_count: 320 },
      { id: 'd-3', zone_id: 'z-bmk-w', name: 'Djicoroni Para', assigned_agents_count: 1, active_item_count: 180 }
    ]
  },
  {
    id: 'z-abj-n',
    organization_id: 'org-1',
    name: 'Zone Abidjan Nord',
    code: 'Z-ABJ-N',
    description: 'Secteur Nord d\'Abidjan englobant Cocody, Angré et Abobo',
    color: '#10B981',
    assigned_agents_count: 6,
    districts: [
      { id: 'd-4', zone_id: 'z-abj-n', name: 'Cocody Riviera 3', assigned_agents_count: 3, active_item_count: 1200 },
      { id: 'd-5', zone_id: 'z-abj-n', name: 'Angré Djibi', assigned_agents_count: 2, active_item_count: 890 },
      { id: 'd-6', zone_id: 'z-abj-n', name: 'Deux Plateaux Vallons', assigned_agents_count: 1, active_item_count: 540 }
    ]
  },
  {
    id: 'z-sik-c',
    organization_id: 'org-1',
    name: 'Zone Sikasso Centre',
    code: 'Z-SIK-C',
    description: 'Centre-ville commercial et administration de Sikasso',
    color: '#F59E0B',
    assigned_agents_count: 2,
    districts: [
      { id: 'd-7', zone_id: 'z-sik-c', name: 'Sikasso Commercial', assigned_agents_count: 1, active_item_count: 310 },
      { id: 'd-8', zone_id: 'z-sik-c', name: 'Mamelon Central', assigned_agents_count: 1, active_item_count: 210 }
    ]
  }
];

export default function ZoneManagement() {
  const [zones, setZones] = useState<ZoneTerritory[]>(INITIAL_ZONES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneTerritory | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('#4F46E5');
  const [districtInput, setDistrictInput] = useState('');
  const [formDistricts, setFormDistricts] = useState<string[]>([]);
  const [bulkImportText, setBulkImportText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleOpenCreate = () => {
    setEditingZone(null);
    setFormName('');
    setFormCode('');
    setFormDesc('');
    setFormColor('#4F46E5');
    setFormDistricts([]);
    setDistrictInput('');
    setBulkImportText('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: ZoneTerritory) => {
    setEditingZone(zone);
    setFormName(zone.name);
    setFormCode(zone.code);
    setFormDesc(zone.description || '');
    setFormColor(zone.color || '#4F46E5');
    setFormDistricts((zone.districts || []).map(d => d.name));
    setDistrictInput('');
    setBulkImportText('');
    setShowBulkInput(false);
    setIsModalOpen(true);
  };

  const handleAddDistrictTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = districtInput.trim();
    if (trimmed && !formDistricts.includes(trimmed)) {
      setFormDistricts([...formDistricts, trimmed]);
      setDistrictInput('');
    }
  };

  const handleRemoveDistrictTag = (name: string) => {
    setFormDistricts(formDistricts.filter(d => d !== name));
  };

  const handleBulkImportDistricts = () => {
    const list = bulkImportText
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const unique = Array.from(new Set([...formDistricts, ...list]));
    setFormDistricts(unique);
    setBulkImportText('');
    setShowBulkInput(false);
  };

  const handleSaveZone = () => {
    if (!formName || !formCode) return;

    if (editingZone) {
      setZones(prev =>
        prev.map(z =>
          z.id === editingZone.id
            ? {
                ...z,
                name: formName,
                code: formCode.toUpperCase(),
                description: formDesc,
                color: formColor,
                districts: formDistricts.map((name, idx) => ({
                  id: `d-${z.id}-${idx}`,
                  zone_id: z.id,
                  name,
                  assigned_agents_count: 1,
                  active_item_count: 100
                }))
              }
            : z
        )
      );
    } else {
      const newZoneId = `z-${Date.now()}`;
      const newZone: ZoneTerritory = {
        id: newZoneId,
        organization_id: 'org-1',
        name: formName,
        code: formCode.toUpperCase(),
        description: formDesc,
        color: formColor,
        assigned_agents_count: 0,
        districts: formDistricts.map((name, idx) => ({
          id: `d-${newZoneId}-${idx}`,
          zone_id: newZoneId,
          name,
          assigned_agents_count: 0,
          active_item_count: 0
        }))
      };
      setZones([...zones, newZone]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const filteredZones = zones.filter(
    z =>
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (z.districts || []).some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher zone, code ou quartier..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Créer une Nouvelle Zone
        </button>
      </div>

      {/* Grid of Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map(zone => (
          <div
            key={zone.id}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all"
          >
            {/* Color Accent Indicator Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: zone.color || '#4F46E5' }} />

            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 font-mono text-[11px] font-bold rounded-md bg-slate-950 text-white border border-slate-800 inline-block mb-1">
                  {zone.code}
                </span>
                <h3 className="text-base font-bold text-white">{zone.name}</h3>
                {zone.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{zone.description}</p>}
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={() => handleOpenEdit(zone)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteZone(zone.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Agent Count & District Stats */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                <Users className="w-3.5 h-3.5" /> {zone.assigned_agents_count || 0} Agents affectés
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                {(zone.districts || []).length} Quartiers
              </span>
            </div>

            {/* List of Districts (Tags) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Quartiers / Secteurs Opérationnels :
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                {(zone.districts || []).map(d => (
                  <span
                    key={d.id}
                    className="px-2.5 py-1 bg-slate-950 text-slate-200 text-[11px] font-medium rounded-lg border border-slate-800 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    {d.name}
                    {d.assigned_agents_count ? (
                      <span className="text-[9px] px-1 bg-indigo-950 text-indigo-300 rounded font-bold">
                        {d.assigned_agents_count} p.
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT ZONE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                {editingZone ? 'Éditer la Zone Opérationnelle' : 'Créer une Nouvelle Zone Opérationnelle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-300 font-medium block mb-1">Nom de la Zone :</label>
                  <input
                    type="text"
                    placeholder="ex: Zone Bamako Ouest"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Code Zone :</label>
                  <input
                    type="text"
                    placeholder="ex: Z-BMK-W"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Couleur d&apos;Identification Carte :</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    className="w-10 h-9 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer p-1"
                  />
                  <span className="font-mono text-slate-300 font-bold">{formColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Description Opérationnelle :</label>
                <textarea
                  placeholder="Zone couvrant les quartiers ACI 2000, Lafiabougou..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              {/* Tag System for Districts */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    Quartiers / Secteurs associés ({formDistricts.length})
                  </label>

                  <button
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="text-indigo-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Import Massif par texte
                  </button>
                </div>

                {showBulkInput ? (
                  <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <textarea
                      placeholder="Saisissez ou collez les noms de quartiers séparés par des virgules ou retours à la ligne (ex: Hamdallaye ACI, Lafiabougou, Djicoroni)..."
                      value={bulkImportText}
                      onChange={e => setBulkImportText(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleBulkImportDistricts}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs"
                      >
                        Ajouter les Quartiers
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter un quartier (ex: Hamdallaye ACI) puis Entrée..."
                      value={districtInput}
                      onChange={e => setDistrictInput(e.target.value)}
                      onKeyDown={handleAddDistrictTag}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                    <button
                      onClick={handleAddDistrictTag}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold rounded-xl"
                    >
                      Ajouter
                    </button>
                  </div>
                )}

                {/* District Pills Container */}
                <div className="flex flex-wrap gap-2 pt-2 max-h-36 overflow-y-auto">
                  {formDistricts.map(name => (
                    <span
                      key={name}
                      className="px-3 py-1 bg-indigo-950/80 text-indigo-200 font-semibold rounded-xl border border-indigo-800/50 flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {name}
                      <button
                        onClick={() => handleRemoveDistrictTag(name)}
                        className="text-indigo-400 hover:text-rose-400 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveZone}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Enregistrer la Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
