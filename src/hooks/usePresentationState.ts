'use client';

// ============================================================
// BALMANDAISA — Presentation State Machine & Autoplay Controller
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { PresentationPhase, PresentationState } from '@/types';
import { PRESENTATION_CONFIG } from '@/config/presentation';

export function usePresentationState() {
  const [state, setState] = useState<PresentationState>({
    phase: 'INTRO',
    currentFloor: 1,
    isPaused: false,
    progress: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const currentDurationRef = useRef<number>(PRESENTATION_CONFIG.INTRO_DURATION || 5000);

  // Clear timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    timerRef.current = null;
    progressIntervalRef.current = null;
  }, []);

  const goToNextPhase = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'INTRO') {
        return { ...prev, phase: 'ELEVATION_REVEAL', progress: 0 };
      }
      if (prev.phase === 'ELEVATION_REVEAL') {
        return { ...prev, phase: 'FLOOR_PRESENTATION', currentFloor: 1, progress: 0 };
      }
      if (prev.phase === 'FLOOR_PRESENTATION') {
        if (prev.currentFloor < 13) {
          return { ...prev, phase: 'FLOOR_TRANSITION', progress: 0 };
        } else {
          return { ...prev, phase: 'SUMMARY', progress: 0 };
        }
      }
      if (prev.phase === 'FLOOR_TRANSITION') {
        return {
          ...prev,
          phase: 'FLOOR_PRESENTATION',
          currentFloor: Math.min(13, prev.currentFloor + 1),
          progress: 0,
        };
      }
      if (prev.phase === 'SUMMARY') {
        // Loop back to Intro
        return { ...prev, phase: 'INTRO', currentFloor: 1, progress: 0 };
      }
      return prev;
    });
  }, []);

  const goToPrevFloor = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'FLOOR_PRESENTATION' || prev.phase === 'FLOOR_TRANSITION') {
        const targetFloor = Math.max(1, prev.currentFloor - 1);
        return { ...prev, phase: 'FLOOR_PRESENTATION', currentFloor: targetFloor, progress: 0 };
      } else if (prev.phase === 'SUMMARY') {
        return { ...prev, phase: 'FLOOR_PRESENTATION', currentFloor: 13, progress: 0 };
      } else if (prev.phase === 'ELEVATION_REVEAL') {
        return { ...prev, phase: 'INTRO', progress: 0 };
      }
      return prev;
    });
  }, []);

  const jumpToFloor = useCallback((floor: number) => {
    if (floor < 1 || floor > 13) return;
    setState(prev => ({
      ...prev,
      phase: 'FLOOR_PRESENTATION',
      currentFloor: floor,
      progress: 0,
    }));
  }, []);

  const setPhase = useCallback((phase: PresentationPhase, floor?: number) => {
    setState(prev => ({
      ...prev,
      phase,
      currentFloor: floor ?? prev.currentFloor,
      progress: 0,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Determine current duration based on state
  useEffect(() => {
    let duration = 6000;
    switch (state.phase) {
      case 'INTRO':
        duration = PRESENTATION_CONFIG.INTRO_DURATION || 5000;
        break;
      case 'ELEVATION_REVEAL':
        duration = PRESENTATION_CONFIG.ELEVATION_DURATION || 6000;
        break;
      case 'FLOOR_PRESENTATION':
        duration = PRESENTATION_CONFIG.FLOOR_DETAIL_DURATION || 6000;
        break;
      case 'FLOOR_TRANSITION':
        duration = PRESENTATION_CONFIG.FLOOR_TRANSITION_DURATION || 1800;
        break;
      case 'SUMMARY':
        duration = PRESENTATION_CONFIG.SUMMARY_DURATION || 6000;
        break;
      default:
        duration = 6000;
    }

    currentDurationRef.current = duration;
    startTimeRef.current = Date.now();

    clearTimers();

    if (!state.isPaused) {
      // Progress ticker for smooth indicator bars
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min(1, elapsed / duration);
        setState(s => ({ ...s, progress: p }));
      }, 50);

      // Transition timer
      timerRef.current = setTimeout(() => {
        goToNextPhase();
      }, duration);
    }

    return () => clearTimers();
  }, [state.phase, state.currentFloor, state.isPaused, goToNextPhase, clearTimers]);

  return {
    state,
    goToNextPhase,
    goToPrevFloor,
    jumpToFloor,
    setPhase,
    togglePause,
  };
}
