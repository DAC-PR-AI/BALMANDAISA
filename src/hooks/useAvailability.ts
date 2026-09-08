'use client';

// ============================================================
// BALMANDAISA — useAvailability Hook
// ============================================================
// Polls availability endpoint and maintains synchronized unit state.

import { useState, useEffect, useCallback, useRef } from 'react';
import { Unit, AvailabilityChange, FloorSummary } from '@/types';
import { SEED_STOCK } from '@/data/seed-stock';
import { diffUnitAvailability } from '@/lib/availability/differ';
import { PRESENTATION_CONFIG } from '@/config/presentation';

export function useAvailability() {
  const [units, setUnits] = useState<Record<string, Unit>>(SEED_STOCK);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [recentChanges, setRecentChanges] = useState<AvailabilityChange[]>([]);
  const unitsRef = useRef<Record<string, Unit>>(SEED_STOCK);

  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/availability', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      if (json.status === 'ok' && json.data) {
        const nextUnits = json.data as Record<string, Unit>;
        const detected = diffUnitAvailability(unitsRef.current, nextUnits);
        
        if (detected.length > 0) {
          setRecentChanges(prev => [...detected, ...prev].slice(0, 10));
        }

        unitsRef.current = nextUnits;
        setUnits(nextUnits);
        setIsConnected(true);
        setLastUpdated(new Date(json.timestamp || Date.now()));
      }
    } catch (err) {
      console.warn('Availability fetch failed, using fallback data:', err);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll on interval
  useEffect(() => {
    fetchAvailability();
    const timer = setInterval(fetchAvailability, PRESENTATION_CONFIG.DATA_REFRESH_INTERVAL || 15000);
    return () => clearInterval(timer);
  }, [fetchAvailability]);

  const getFloorUnitsList = useCallback((floor: number) => {
    return Object.values(units).filter(u => u.floor === floor);
  }, [units]);

  const getFloorStats = useCallback((floor: number): FloorSummary => {
    const floorUnits = Object.values(units).filter(u => u.floor === floor);
    return {
      floor,
      total: floorUnits.length,
      available: floorUnits.filter(u => u.status === 'AVAILABLE').length,
      booked: floorUnits.filter(u => u.status === 'BOOKED').length,
      blocked: floorUnits.filter(u => u.status === 'BLOCKED').length,
      notForSale: floorUnits.filter(u => u.status === 'NOT_FOR_SALE').length,
    };
  }, [units]);

  const getProjectStats = useCallback(() => {
    const allUnits = Object.values(units);
    return {
      total: allUnits.length,
      available: allUnits.filter(u => u.status === 'AVAILABLE').length,
      booked: allUnits.filter(u => u.status === 'BOOKED').length,
      blocked: allUnits.filter(u => u.status === 'BLOCKED').length,
      notForSale: allUnits.filter(u => u.status === 'NOT_FOR_SALE').length,
    };
  }, [units]);

  return {
    units,
    isConnected,
    isLoading,
    lastUpdated,
    recentChanges,
    refresh: fetchAvailability,
    getFloorUnitsList,
    getFloorStats,
    getProjectStats,
  };
}
