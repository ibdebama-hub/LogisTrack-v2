'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  UploadCloud,
  Building2,
  Wifi,
  Sparkles,
  Crown,
  CheckCircle2,
  X
} from 'lucide-react';
import CreateClientModal from '../modules/clients/CreateClientModal';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  isCollapsed: boolean;
}

export default function TopHeader({ onOpenMobileMenu, isCollapsed }: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const {
    isConnected,
    newCampaignAlertsCount,
    notifications,
    clearCampaignAlerts,
  } = useRealtimeSync();

  return (
    <header
      className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800"
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Hamburger & Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Input */}
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Recherche globale (N° Suivi, Client, Destinataire, Zone...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right Section: System Live Badge & Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Realtime Connection Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 text-emerald-400 text-[11px] font-mono font-bold rounded-xl border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Sync {isConnected ? 'Actif' : 'Reconnexion...'}
          </div>

          {/* Notifications Bell Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                clearCampaignAlerts();
              }}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {newCampaignAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-rose-500/50">
                  +{newCampaignAlertsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" /> Notifications Realtime (Supabase)
                  </span>
                  <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">Aucune notification pour le moment.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 text-[11px]">{n.title}</span>
                          <span className="text-[9px] font-mono text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: Master Admin */}
          <a
            href="/master-admin/overview"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-bold text-xs rounded-xl border border-violet-500/30"
            title="Espace Super Admin / Master SaaS Owner"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" /> Master Admin
          </a>

          {/* Quick Action: Portail Client B2B */}
          <a
            href="/client-portal/overview"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30"
            title="Accéder au Portail Client B2B"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Portail Client
          </a>

          {/* Quick Action: Import CSV */}
          <a
            href="/dispatch/import"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 font-semibold text-xs rounded-xl border border-slate-800"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" /> + Import CSV
          </a>

          {/* Quick Action: Nouveau Client */}
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
          >
            <Building2 className="w-4 h-4" /> + Client
          </button>
        </div>
      </div>

      {/* CREATE CLIENT MODAL */}
      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onClientCreated={() => setIsClientModalOpen(false)}
      />
    </header>
  );
}
