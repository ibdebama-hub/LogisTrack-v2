'use client';

import { useState, useEffect } from 'react';
import { updateAgentGpsPosition } from '../lib/services/agentService';

export function useGpsTracker(agentId: string = 'a1', isTrackingActive: boolean = true) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>({
    lat: 5.3600,
    lng: -3.9700
  });
  const [speed, setSpeed] = useState<number>(24.5);
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!isTrackingActive || typeof window === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const spd = pos.coords.speed ? pos.coords.speed * 3.6 : 25;

        setPosition({ lat, lng });
        setSpeed(spd);
        setIsGpsEnabled(true);

        updateAgentGpsPosition(agentId, lat, lng, spd, batteryLevel);
      },
      (err) => {
        console.warn('[GPS Watch Error]', err.message);
        setIsGpsEnabled(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [agentId, isTrackingActive, batteryLevel]);

  return { position, speed, batteryLevel, isGpsEnabled };
}
