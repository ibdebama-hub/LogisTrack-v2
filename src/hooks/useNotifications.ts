'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotifications,
  markNotificationsAsRead,
  clearAllNotifications
} from '@/lib/services/notificationService';
import { DispatcherNotification } from '@/types/missionControl';
import { supabase } from '@/lib/supabase/queries';

export function useNotifications(organizationId: string = 'tenant-101') {
  const [notifications, setNotifications] = useState<DispatcherNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchNotifications(organizationId);
    setNotifications(data);
    setIsLoading(false);
  }, [organizationId]);

  useEffect(() => {
    loadNotifications();

    // Supabase Realtime Subscription for Dispatcher Notifications
    const channel = supabase
      .channel('realtime_dispatcher_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new as any;
          setNotifications((prev) => [
            {
              id: newNotif.id,
              timestamp: 'À l\'instant',
              title: newNotif.title,
              message: newNotif.message,
              severity: newNotif.severity || 'INFO',
              read: false,
              category: newNotif.category || 'SYSTEM',
              action_url: newNotif.action_url
            },
            ...prev
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadNotifications, organizationId]);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markNotificationsAsRead(organizationId);
  };

  const clearAll = async () => {
    setNotifications([]);
    await clearAllNotifications(organizationId);
  };

  return {
    notifications,
    setNotifications,
    isLoading,
    refreshNotifications: loadNotifications,
    markAllRead,
    clearAll
  };
}
