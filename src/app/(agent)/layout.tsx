import React from 'react';
import AgentBottomNav from '../../components/modules/agent/AgentBottomNav';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 sm:pb-6">
      {children}
      <AgentBottomNav />
    </div>
  );
}
