'use client';

import React from 'react';
import ClientMessagingHub from '../../../components/modules/client-portal/ClientMessagingHub';
import { useB2BPortal } from '../../../hooks/useB2BPortal';

export default function ClientMessagesPage() {
  const { messages, sendMessage } = useB2BPortal('cli-cie');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <ClientMessagingHub messages={messages} onSendMessage={sendMessage} />
    </div>
  );
}
