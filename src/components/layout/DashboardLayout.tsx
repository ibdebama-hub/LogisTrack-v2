'use client';

import React, { useState } from 'react';
import SidebarNav from './SidebarNav';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Sidebar Navigation */}
      <SidebarNav
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area with Sidebar Offset */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col justify-between ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Application Header */}
        <TopHeader
          isCollapsed={isCollapsed}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Main Page Content Area */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
