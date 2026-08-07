'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchB2BExecutiveData,
  fetchB2BUsers,
  fetchB2BDocuments,
  fetchB2BMessages,
  sendB2BMessage,
  MOCK_B2B_KPIS,
  MOCK_B2B_ANALYTICS
} from '@/lib/services/b2bPortalService';
import { generateDynamicB2BReport, ReportFormat } from '@/lib/services/b2bReportGenerator';
import {
  B2BExecutiveKpis,
  B2BAnalyticsPoint,
  B2BClientUser,
  B2BDocument,
  B2BMessageThread
} from '@/types/b2bClientPortal';

export function useB2BPortal(clientId: string = 'cli-cie') {
  const [kpis, setKpis] = useState<B2BExecutiveKpis>(MOCK_B2B_KPIS);
  const [analytics, setAnalytics] = useState<B2BAnalyticsPoint[]>(MOCK_B2B_ANALYTICS);
  const [users, setUsers] = useState<B2BClientUser[]>([]);
  const [documents, setDocuments] = useState<B2BDocument[]>([]);
  const [messages, setMessages] = useState<B2BMessageThread[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const execData = await fetchB2BExecutiveData(clientId);
    setKpis(execData.kpis);
    setAnalytics(execData.analytics);

    const [u, d, m] = await Promise.all([
      fetchB2BUsers(clientId),
      fetchB2BDocuments(clientId),
      fetchB2BMessages(clientId)
    ]);

    setUsers(u);
    setDocuments(d);
    setMessages(m);
    setIsLoading(false);
  }, [clientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendMessage = async (content: string, subject?: string) => {
    const newMsg: B2BMessageThread = {
      id: `msg-${Date.now()}`,
      client_id: clientId,
      sender_id: 'u-2',
      sender_name: 'Diallo Aïcha (CIE)',
      sender_role: 'CLIENT',
      subject: subject || 'Nouveau Message',
      content,
      is_read: true,
      created_at: 'À l\'instant'
    };
    setMessages((prev) => [...prev, newMsg]);
    await sendB2BMessage(clientId, content, subject);
  };

  const exportReport = (clientName: string, format: ReportFormat) => {
    generateDynamicB2BReport(clientName, kpis, format);
  };

  return {
    kpis,
    analytics,
    users,
    documents,
    messages,
    isLoading,
    refreshPortal: loadData,
    sendMessage: handleSendMessage,
    exportReport
  };
}
