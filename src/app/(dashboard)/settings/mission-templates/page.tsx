'use client';

import React from 'react';
import { Sliders, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import MissionTemplateEditor from '../../../../components/modules/settings/MissionTemplateEditor';
import { useMissionTemplates } from '../../../../hooks/useMissionTemplates';

export default function MissionTemplatesSettingsPage() {
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    saveTemplate,
    toggleTemplateActive
  } = useMissionTemplates('tenant-101');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-indigo-400" />
            <span>Gestion des Types de Missions (Mission Templates)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configuration visuelle des preuves obligatoires, de l'activation du module COD et des workflows métiers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TEMPLATE LIST SELECTOR */}
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl text-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm">Modèles Enregistrés ({templates.length})</h2>
          </div>

          <div className="space-y-2">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3.5 rounded-xl border cursor-pointer space-y-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white block">{tpl.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white border"
                      style={{ backgroundColor: `${tpl.color_hex}20`, borderColor: tpl.color_hex }}
                    >
                      {tpl.code}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">{tpl.description}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono">
                    <span className={tpl.has_cod ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {tpl.has_cod ? '🟢 COD Actif' : '⚪ Sans COD'}
                    </span>
                    <span className="text-slate-400">{tpl.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TEMPLATE EDITOR */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <MissionTemplateEditor template={selectedTemplate} onSave={saveTemplate} />
          ) : (
            <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 text-center text-slate-500 italic text-xs">
              Sélectionnez un modèle de mission pour afficher l'éditeur.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
