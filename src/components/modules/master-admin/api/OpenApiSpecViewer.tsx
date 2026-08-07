'use client';

import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal, Code2, ExternalLink } from 'lucide-react';
import { SdkGeneratorService } from '@/lib/services/sdkGeneratorService';

export default function OpenApiSpecViewer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/missions');
  const [selectedMethod, setSelectedMethod] = useState<string>('GET');
  const [activeLang, setActiveLang] = useState<'curl' | 'ts' | 'python' | 'php'>('curl');
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = () => {
    switch (activeLang) {
      case 'curl':
        return SdkGeneratorService.generateCurlSnippet(selectedEndpoint, selectedMethod);
      case 'ts':
        return SdkGeneratorService.generateTsSnippet(selectedEndpoint, selectedMethod);
      case 'python':
        return SdkGeneratorService.generatePythonSnippet(selectedEndpoint, selectedMethod);
      case 'php':
        return SdkGeneratorService.generatePhpSnippet(selectedEndpoint, selectedMethod);
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-violet-900/40 backdrop-blur-md shadow-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 w-fit mb-1">
            <FileCode className="w-3 h-3" /> SPÉCIFICATION OPENAPI 3.0 & SDKs
          </span>
          <h1 className="text-2xl font-black text-white">Documentation API REST Interactive</h1>
          <p className="text-slate-400">Explorez les endpoints versionnés `/api/v1/` et générez du code d'intégration multi-langages.</p>
        </div>

        <a
          href="/api/v1/docs"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all w-fit shrink-0"
        >
          <span>OpenAPI 3.0 JSON</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ENDPOINTS LIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-white text-sm mb-3">Endpoints Versionnés</h3>

          {[
            { path: '/api/v1/organisations', method: 'GET', label: 'Organisations' },
            { path: '/api/v1/missions', method: 'GET', label: 'Lister Missions' },
            { path: '/api/v1/missions', method: 'POST', label: 'Créer Mission' },
            { path: '/api/v1/pod', method: 'GET', label: 'Certifications POD' },
            { path: '/api/v1/cod', method: 'GET', label: 'Encaissements COD (Optionnel)' },
            { path: '/api/v1/analytics', method: 'GET', label: 'Analytics BI' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedEndpoint(item.path);
                setSelectedMethod(item.method);
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedEndpoint === item.path && selectedMethod === item.method
                  ? 'bg-indigo-950/50 border-indigo-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.method === 'GET'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {item.method}
                </span>
                <span className="font-mono text-xs">{item.path}</span>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE CODE GENERATOR */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded">
                {selectedMethod}
              </span>
              <span className="font-mono font-bold text-white text-sm">{selectedEndpoint}</span>
            </div>

            <div className="flex items-center gap-2">
              {(['curl', 'ts', 'python', 'php'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    activeLang === lang
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
              title="Copier le code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre>{getCodeSnippet()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
