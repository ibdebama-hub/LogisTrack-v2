'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  UploadCloud,
  FileCheck,
  FileText,
  Settings,
  Building,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { ClientPortalUser } from '../../types/b2bClientPortal';

interface ClientPortalSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeClient: ClientPortalUser;
}

export default function ClientPortalSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  activeClient
}: ClientPortalSidebarProps) {
  const pathname = usePathname();

  const [clientInfo, setClientInfo] = useState({
    client_name: activeClient.client_name,
    contact_name: activeClient.contact_name,
    client_code: activeClient.client_code
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('logistrack_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company_name || parsed.full_name) {
          setClientInfo({
            client_name: parsed.company_name || activeClient.client_name,
            contact_name: parsed.full_name || activeClient.contact_name,
            client_code: parsed.initials || activeClient.client_code
          });
        }
      }
    } catch (e) {}
  }, [activeClient]);

  const NAV_ITEMS = [
    { label: 'Tableau de Bord', href: '/client-portal/overview', icon: LayoutDashboard },
    { label: 'Suivi des Campagnes', href: '/client-portal/campaigns', icon: Layers },
    { label: 'Dépôt & Nouvelle Campagne', href: '/client-portal/upload', icon: UploadCloud },
    { label: 'Preuves & Attestations PoD', href: '/client-portal/pod', icon: FileCheck },
    { label: 'Facturation & Honoraires', href: '/client-portal/billing', icon: FileText },
    { label: 'Mon Compte & Paramètres', href: '/client-portal/settings', icon: Settings }
  ];

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen max-h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRANDING & COLLAPSE TOGGLE (FIXED TOP) */}
        <div className="shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/client-portal/overview" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-orange-500/20 shrink-0">
                <Building className="w-5 h-5 text-slate-950" />
              </div>
              {!isCollapsed && (
                <div className="space-y-0.5 truncate">
                  <span className="font-black text-sm text-white tracking-wider block">LOGISTRACK</span>
                  <span className="text-[9px] font-mono text-amber-400 font-bold block">PORTAIL CLIENT B2B</span>
                </div>
              )}
            </Link>

            {/* Collapse Button (Desktop) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title={isCollapsed ? 'Déplier le menu' : 'Réduire le menu'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE NAVIGATION BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* ACTIVE CLIENT BADGE */}
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Donneur d'Ordre</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="font-extrabold text-white text-xs truncate">{clientInfo.client_name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{clientInfo.contact_name}</div>
            </div>
          )}

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/client-portal/overview' && pathname.startsWith(item.href));
              const IconComp = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold text-xs ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-md shadow-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER USER PROFILE & LOGOUT (FIXED BOTTOM) */}
        <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-950">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                {clientInfo.client_code}
              </div>
              {!isCollapsed && (
                <div className="truncate text-left">
                  <span className="font-bold text-white text-xs block truncate">{clientInfo.contact_name}</span>
                  <span className="text-[9px] text-emerald-400 font-mono block">Espace Sécurisé RLS</span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <Link
                href="/overview"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition-colors"
                title="Quitter le Portail B2B"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
