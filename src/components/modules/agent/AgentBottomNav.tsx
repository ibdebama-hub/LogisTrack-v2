'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Navigation, QrCode, RefreshCw, Bell, Wifi, WifiOff } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function AgentBottomNav() {
  const pathname = usePathname();
  const { isOnline, pendingCount } = useOfflineSync();

  const navItems = [
    { label: 'Accueil', href: '/agent/dashboard', icon: LayoutDashboard },
    { label: 'Tournée', href: '/agent/tournee', icon: Navigation, badge: '5' },
    { label: 'Scanner', href: '/scan', icon: QrCode },
    {
      label: 'Sync',
      href: '/agent/sync',
      icon: RefreshCw,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 sm:hidden flex items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center relative transition-all ${
              isActive
                ? 'text-indigo-400 font-bold bg-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && (
                <span
                  className={`absolute -top-1.5 -right-2 text-[9px] px-1.5 py-0.2 rounded-full font-bold shadow-md ${
                    item.badgeColor || 'bg-indigo-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}

      {/* ONLINE / OFFLINE STATUS BADGE */}
      <div className="flex flex-col items-center gap-1 p-2 text-[10px]">
        {isOnline ? (
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Wifi className="w-4 h-4" />
            <span>En ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
            <WifiOff className="w-4 h-4" />
            <span>Hors-ligne</span>
          </div>
        )}
      </div>
    </div>
  );
}
