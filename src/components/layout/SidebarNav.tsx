'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/queries';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  UploadCloud,
  Layers,
  Map,
  Users,
  FileCheck,
  Wallet,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Package,
  FileText,
  ChevronDown,
  BarChart3
} from 'lucide-react';

interface SidebarNavProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'POSTE DE PILOTAGE',
    items: [
      { label: 'Vue d\'Ensemble (Overview)', href: '/overview', icon: LayoutDashboard }
    ]
  },
  {
    groupName: 'PILOTAGE & DECISION',
    items: [
      { label: 'Business Intelligence', href: '/analytics', icon: BarChart3, badge: 'IA Ready', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
    ]
  },
  {
    groupName: 'DONNEURS D\'ORDRES',
    items: [
      { label: 'Clients & Contrats', href: '/dispatch/clients', icon: Building2 }
    ]
  },
  {
    groupName: 'TERRITOIRES & AFFECTATIONS',
    items: [
      { label: 'Zones & Quartiers', href: '/dispatch/territories', icon: MapPin }
    ]
  },
  {
    groupName: 'OPÉRATIONS DE DISTRIBUTION',
    items: [
      { label: 'Import & Lotissement', href: '/dispatch/import', icon: UploadCloud },
      { label: 'Suivi des Campagnes', href: '/dispatch/campaigns', icon: Layers },
      { label: 'Explorateur de Missions', href: '/dispatch/missions', icon: Package, badge: 'SLA 24h', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
      { label: 'Carte GPS Live', href: '/dispatch/map', icon: Map, badge: 'Supervision', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
    ]
  },
  {
    groupName: 'ÉQUIPE TERRAIN & DECHARGES',
    items: [
      { label: 'Flotte Agents', href: '/agents', icon: Users },
      { label: 'Décharges & PoD', href: '/pod/verifications', icon: FileCheck }
    ]
  },
  {
    groupName: 'FINANCE & CAISSE (COD)',
    items: [
      { label: 'Réconciliation Caisse', href: '/finance/reconciliation', icon: Wallet, badge: '3 à valider', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      { label: 'Facturation Clients (B2B)', href: '/finance/billing', icon: FileText },
      { label: 'Rapports Encaissement', href: '/finance/reports', icon: FileSpreadsheet }
    ]
  },
  {
    groupName: 'CONFIGURATION',
    items: [
      { label: 'Paramètres Général & SMS', href: '/settings', icon: Settings }
    ]
  }
];

export default function SidebarNav({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeOrg, setActiveOrg] = useState('Logistics West Africa (Siège)');
  const [userInfo, setUserInfo] = useState({
    name: 'Yves Touré',
    initials: 'YT',
    role: 'Dispatcher Principal'
  });

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('logistrack_user_session');
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    router.push('/login');
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('logistrack_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company_name) setActiveOrg(parsed.company_name);
        if (parsed.full_name) {
          setUserInfo({
            name: parsed.full_name,
            initials: parsed.initials || parsed.full_name.slice(0, 2).toUpperCase(),
            role: parsed.role ? parsed.role.replace('_', ' ') : 'Administrateur'
          });
        }
      }
    } catch (e) {}
  }, []);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen max-h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRANDING & COLLAPSE HEADER (FIXED TOP) */}
        <div className="shrink-0 border-b border-slate-800 p-4 flex items-center justify-between">
          <Link href="/overview" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-extrabold text-base bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent tracking-wider block">
                  LOGISTRACK
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest block -mt-1">
                  V2 ENTERPRISE
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* AGENCY / ORGANIZATION SELECTOR (FIXED) */}
        {!isCollapsed && (
          <div className="shrink-0 px-3 pt-3">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate text-slate-200 font-semibold">{activeOrg}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>
          </div>
        )}

        {/* NAVIGATION SCROLLABLE MENU */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {NAV_GROUPS.map(group => (
            <div key={group.groupName} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  {group.groupName}
                </h4>
              )}

              {group.items.map(item => {
                const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* USER PROFILE FOOTER */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                {userInfo.initials}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">{userInfo.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 block truncate">
                    {userInfo.role}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
