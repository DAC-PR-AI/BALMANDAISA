'use client';

// ============================================================
// BALMANDAISA — Keyboard Controls Hook
// ============================================================

import { useEffect } from 'react';
import { PresentationPhase } from '@/types';

interface KeyboardControlOptions {
  onTogglePause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpToFloor: (floor: number) => void;
  onSetPhase: (phase: PresentationPhase, floor?: number) => void;
  onToggleFullscreen: () => void;
  onRefreshData: () => void;
}

export function useKeyboardControls({
  onTogglePause,
  onNext,
  onPrev,
  onJumpToFloor,
  onSetPhase,
  onToggleFullscreen,
  onRefreshData,
}: KeyboardControlOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when focusing input elements if any
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case ' ': // Space bar - pause/resume
          e.preventDefault();
          onTogglePause();
          break;
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          onPrev();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          onSetPhase('INTRO');
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          onSetPhase('ELEVATION_REVEAL');
          break;
        case 's':
        case 'S':
          e.preventDefault();
          onSetPhase('SUMMARY');
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          onRefreshData();
          break;
        default:
          // Numeric floor selection (1-9)
          if (/^[1-9]$/.test(e.key)) {
            e.preventDefault();
            onJumpToFloor(parseInt(e.key, 10));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePause, onNext, onPrev, onJumpToFloor, onSetPhase, onToggleFullscreen, onRefreshData]);
}
