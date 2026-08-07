'use client';

import React, { useState } from 'react';
import { FileText, Download, Search, Eye, Filter, FolderArchive, ShieldCheck, Banknote } from 'lucide-react';
import { B2BDocument } from '@/types/b2bClientPortal';

interface ClientDocumentCenterProps {
  documents: B2BDocument[];
}

export default function ClientDocumentCenter({ documents }: ClientDocumentCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredDocs = documents.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <FolderArchive className="w-8 h-8 text-indigo-400" />
            <span>Centre Documentaire B2B & Preuves Certifiées</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bibliothèque sécurisée Supabase Storage de tous vos certificats POD, reçus COD, rapports et contrats.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre de document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium"
        >
          <option value="ALL">Toutes les Catégories</option>
          <option value="POD">Certificats POD</option>
          <option value="COD_RECEIPT">Reçus COD</option>
          <option value="REPORT">Rapports d'Opérations</option>
          <option value="INVOICE">Factures B2B</option>
          <option value="CONTRACT">Contrats & Avenants</option>
        </select>
      </div>

      {/* DOCUMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl hover:border-indigo-500/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-black">
                {doc.category === 'POD' ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                ) : doc.category === 'COD_RECEIPT' ? (
                  <Banknote className="w-6 h-6 text-emerald-400" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-white block">{doc.title}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{(doc.file_size_bytes / 1000000).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{doc.created_at}</span>
                </div>
              </div>
            </div>

            <a
              href={doc.file_path}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-all"
              title="Télécharger Document"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
