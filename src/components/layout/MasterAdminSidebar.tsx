'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  LayoutDashboard,
  Building2,
  Gem,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  Settings,
  Mail,
  Key,
  Webhook,
  Layers,
  FileCode,
  TrendingUp,
  Kanban
} from 'lucide-react';

interface MasterAdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function MasterAdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}: MasterAdminSidebarProps) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Vue d\'Ensemble SaaS', href: '/master-admin/overview', icon: LayoutDashboard },
    { label: 'CRM Commercial', href: '/master-admin/crm', icon: TrendingUp },
    { label: 'Pipeline Kanban', href: '/master-admin/crm/pipeline', icon: Kanban },
    { label: 'Onboarding & Wizard', href: '/master-admin/onboarding', icon: Sparkles },
    { label: 'Invitations Clients', href: '/master-admin/invitations', icon: Mail },
    { label: 'Identités & Accès', href: '/master-admin/identity', icon: ShieldAlert },
    { label: 'Journal des Connexions', href: '/master-admin/logins', icon: FileText },
    { label: 'Entreprises & Tenants', href: '/master-admin/tenants', icon: Building2 },
    { label: 'Clés API & Scopes', href: '/master-admin/api-keys', icon: Key },
    { label: 'Webhooks Événements', href: '/master-admin/webhooks', icon: Webhook },
    { label: 'Connecteurs ERP/CRM', href: '/master-admin/integrations', icon: Layers },
    { label: 'Docs API OpenAPI', href: '/master-admin/api-docs', icon: FileCode },
    { label: 'Plans & Tarification', href: '/master-admin/plans', icon: Gem },
    { label: 'Facturation & MRR', href: '/master-admin/billing', icon: FileText },
    { label: 'Paramètres & Config', href: '/master-admin/settings', icon: Settings }
  ];



  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen max-h-screen bg-slate-950 border-r border-violet-900/40 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* BRANDING HEADER (FIXED TOP) */}
        <div className="shrink-0">
          <div className="p-4 border-b border-violet-900/30 flex items-center justify-between">
            <Link href="/master-admin/overview" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30 shrink-0">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              {!isCollapsed && (
                <div className="space-y-0.5 truncate">
                  <span className="font-black text-sm text-white tracking-wider block">LOGISTRACK</span>
                  <span className="text-[9px] font-mono text-violet-400 font-bold block">MASTER SUPER ADMIN</span>
                </div>
              )}
            </Link>

            {/* Collapse Toggle Desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 text-violet-300 transition-colors"
              title={isCollapsed ? 'Déplier' : 'Réduire'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close */}
            <button onClick={onCloseMobile} className="lg:hidden p-1.5 rounded-xl bg-violet-950 text-violet-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE NAVIGATION BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-violet-900/40 scrollbar-track-transparent">
          {/* SUPER ADMIN BADGE */}
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-violet-950/40 border border-violet-800/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Propriétaire SaaS</span>
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <div className="font-extrabold text-white text-xs">SaaS Multi-Tenants V2</div>
              <div className="text-[10px] text-slate-400 font-mono">Contrôle global des souscriptions</div>
            </div>
          )}

          {/* NAV LINKS */}
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/master-admin/overview' && pathname.startsWith(item.href));
              const IconComp = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold text-xs ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-white font-bold border border-violet-500/40 shadow-lg shadow-violet-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-violet-950/30'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${isActive ? 'text-violet-300' : 'text-slate-500'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER (FIXED BOTTOM) */}
        <div className="shrink-0 p-3 border-t border-violet-900/30 bg-slate-950">
          <Link
            href="/overview"
            className={`flex items-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-violet-950/40 transition-colors text-xs font-semibold ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Retour au Backoffice Dispatcher"
          >
            <ArrowLeft className="w-4 h-4 text-violet-400" />
            {!isCollapsed && <span>Retour Dispatcher</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
