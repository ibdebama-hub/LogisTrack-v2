'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, Crown, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import MasterAdminSidebar from './MasterAdminSidebar';

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* MASTER SIDEBAR */}
      <MasterAdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* CONTENT WRAPPER WITH SIDEBAR OFFSET */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col justify-between ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-violet-900/30">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Espace Master Owner SaaS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/overview"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-800 transition-colors font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Backoffice Dispatcher</span>
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-slate-950 border-t border-violet-900/20 p-4 text-center text-xs text-slate-500 font-mono">
          LogisTrack V2 Master Super Admin • Plateforme SaaS Multi-Tenants Enterprise
        </footer>
      </div>
    </div>
  );
}
