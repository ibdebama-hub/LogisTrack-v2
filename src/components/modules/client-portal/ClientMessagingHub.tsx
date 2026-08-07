'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Clock } from 'lucide-react';
import { B2BMessageThread } from '@/types/b2bClientPortal';

interface ClientMessagingHubProps {
  messages: B2BMessageThread[];
  onSendMessage: (content: string, subject?: string) => void;
}

export default function ClientMessagingHub({ messages, onSendMessage }: ClientMessagingHubProps) {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendMessage(content, subject);
    setContent('');
    setSubject('');
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
            <span>Centre de Communication B2B (Messagerie Directe Dispatch)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Échanges filés en temps réel avec l'équipe de régie logistique et suivi des priorités.
          </p>
        </div>
      </div>

      {/* MESSAGES THREAD HISTORY */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl max-h-[500px] overflow-y-auto">
        {messages.map((m) => {
          const isClient = m.sender_role === 'CLIENT';
          return (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${isClient ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-lg space-y-1.5 border shadow-md ${
                  isClient
                    ? 'bg-indigo-950/80 border-indigo-800 text-indigo-100 rounded-tr-none'
                    : 'bg-slate-950 border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-1 font-bold text-[11px]">
                  <span className={isClient ? 'text-indigo-300' : 'text-emerald-400'}>{m.sender_name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{m.created_at}</span>
                </div>
                {m.subject && <span className="font-bold text-white block text-xs">{m.subject}</span>}
                <p className="leading-relaxed">{m.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEND NEW MESSAGE FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-3 text-xs shadow-xl">
        <input
          type="text"
          placeholder="Objet du message (Optionnel)..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <textarea
            placeholder="Rédigez votre message à l'équipe de dispatch..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  );
}
