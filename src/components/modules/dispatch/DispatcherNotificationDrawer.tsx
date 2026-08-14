'use client';

import React, { useState } from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle2,
  Filter,
  Trash2,
  Check
} from 'lucide-react';
import { DispatcherNotification, NotificationSeverity } from '../../../types/missionControl';

interface DispatcherNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DispatcherNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export default function DispatcherNotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications
}: DispatcherNotificationDrawerProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<NotificationSeverity | 'ALL'>('ALL');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (selectedSeverity === 'ALL') return true;
    return n.severity === selectedSeverity;
  });

  const getSeverityBadge = (sev: NotificationSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Critique
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" /> Avertissement
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
            <Info className="w-3 h-3 text-indigo-400" /> Information
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Centre de Notifications</h2>
            <span className="text-xs text-slate-400">Alertes & Événements en direct</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs by Severity */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedSeverity === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            Toutes ({notifications.length})
          </button>

          <button
            onClick={() => setSelectedSeverity('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedSeverity === 'CRITICAL'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-950 text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            Critique ({notifications.filter((n) => n.severity === 'CRITICAL').length})
          </button>

          <button
            onClick={() => setSelectedSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedSeverity === 'WARNING'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-950 text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            Avertissement ({notifications.filter((n) => n.severity === 'WARNING').length})
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-700" />
            <p className="text-xs font-semibold">Aucune notification dans cette catégorie</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                notif.read
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                  : 'bg-slate-900 border-slate-700 text-white shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                {getSeverityBadge(notif.severity)}
                <span className="font-mono text-[10px] text-slate-400">{notif.timestamp}</span>
              </div>

              <h4 className="text-xs font-bold text-white">{notif.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold"
        >
          <Check className="w-4 h-4" /> Marquer tout comme lu
        </button>

        <button
          onClick={onClearNotifications}
          className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 font-semibold"
        >
          <Trash2 className="w-4 h-4" /> Vider
        </button>
      </div>
    </div>
  );
}
