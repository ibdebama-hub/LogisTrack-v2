'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Sparkles,
  ArrowLeft,
  Building,
  Bell
} from 'lucide-react';
import ClientPortalSidebar from './ClientPortalSidebar';
import { MOCK_CLIENT_PORTAL_USERS } from '../../lib/mockClientPortalData';
import { ClientPortalUser } from '../../types/b2bClientPortal';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('cli-orange');
  const [searchQuery, setSearchQuery] = useState('');
  const [userClient, setUserClient] = useState<any | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('logistrack_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company_name) {
          setUserClient({
            id: 'cli-custom',
            client_name: parsed.company_name,
            client_code: parsed.initials || 'GKS',
            contact_name: parsed.full_name || 'Contact Client',
            contact_email: parsed.email || 'contact@gks-logistics.gn',
            contact_phone: '+224 620 00 00 00',
            active_campaigns_count: 3,
            total_items_delivered: 4500,
            pending_items_count: 120,
            total_invoiced_xof: 12500000,
            unpaid_invoices_xof: 2500000
          });
        }
      }
    } catch (e) {}
  }, []);

  const activeClient = userClient || MOCK_CLIENT_PORTAL_USERS[selectedClientId] || MOCK_CLIENT_PORTAL_USERS['cli-orange'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* DEDICATED CLIENT SIDEBAR */}
      <ClientPortalSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        activeClient={activeClient}
      />

      {/* CONTENT WRAPPER WITH SIDEBAR OFFSET */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col justify-between ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            {/* Left section: Mobile Hamburger & Search */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Client Search Bar */}
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Recherche dans vos plis, factures ou contrats..."
                  className="w-full pl-10 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Right section: Client Selector & Back-Office Link */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Client Selector Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={userClient ? 'cli-custom' : selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  {userClient && <option value="cli-custom">{userClient.client_name} ({userClient.client_code})</option>}
                  <option value="cli-orange">Orange Guinée (OGN)</option>
                  <option value="cli-ba">Banque Atlantique (BAT)</option>
                </select>
              </div>

              {/* Back to Backoffice Shortcut */}
              <Link
                href="/overview"
                className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-800 transition-colors font-mono"
                title="Retour au Backoffice Dispatcher"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Backoffice</span>
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-slate-950 border-t border-slate-800/80 p-4 text-center text-xs text-slate-500 font-mono">
          Portail Donneur d'Ordre B2B • LogisTrack V2 Enterprise • Données sécurisées Supabase RLS
        </footer>
      </div>
    </div>
  );
}
