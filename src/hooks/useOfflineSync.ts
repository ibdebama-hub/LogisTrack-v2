'use client';

import { useState, useEffect } from 'react';
import { offlineEngine } from '../lib/services/offlineSyncEngine';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(offlineEngine.getOnlineStatus());
    setPendingCount(offlineEngine.getPendingCount());

    const unsubscribe = offlineEngine.subscribe((online, count) => {
      setIsOnline(online);
      setPendingCount(count);
    });

    return () => unsubscribe();
  }, []);

  const triggerSyncNow = async () => {
    setIsSyncing(true);
    await offlineEngine.flushQueue();
    setPendingCount(offlineEngine.getPendingCount());
    setIsSyncing(false);
  };

  const saveOfflinePoD = (payload: any) => {
    offlineEngine.saveOfflinePoD(payload);
    setPendingCount(offlineEngine.getPendingCount());
  };

  return { isOnline, pendingCount, isSyncing, triggerSyncNow, saveOfflinePoD };
}
