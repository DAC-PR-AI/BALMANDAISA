'use client';

// ============================================================
// BALMANDAISA — Master Architectural Presentation Engine
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePresentationState } from '@/hooks/usePresentationState';
import { useAvailability } from '@/hooks/useAvailability';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

import { BrandHeader } from './common/BrandHeader';
import { PresentationControls } from './common/PresentationControls';
import { IntroSequence } from './sequences/IntroSequence';
import { ElevationReveal } from './sequences/ElevationReveal';
import { FloorPresentation } from './sequences/FloorPresentation';
import { FloorTransition } from './sequences/FloorTransition';
import { FinalSummary } from './sequences/FinalSummary';
import { AvailabilityOverlay } from './sequences/AvailabilityOverlay';

export const PresentationEngine: React.FC = () => {
  const {
    state,
    goToNextPhase,
    goToPrevFloor,
    jumpToFloor,
    setPhase,
    togglePause,
  } = usePresentationState();

  const {
    units,
    isConnected,
    lastUpdated,
    recentChanges,
    refresh,
    getFloorUnitsList,
    getFloorStats,
    getProjectStats,
  } = useAvailability();

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Auto-hide UI controls on mouse inactivity
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  // Eager background preloading of all architectural assets into browser memory
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preload Elevation image
    const elevImg = new Image();
    elevImg.src = '/elevation/building-elevation.webp';

    // Preload all 13 Floor Plan blueprints
    for (let f = 1; f <= 13; f++) {
      const pad = f.toString().padStart(2, '0');
      const img = new Image();
      img.src = `/floorplans/floor-${pad}.webp`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [handleMouseMove]);

  useKeyboardControls({
    onTogglePause: () => {
      togglePause();
      handleMouseMove();
    },
    onNext: () => {
      goToNextPhase();
      handleMouseMove();
    },
    onPrev: () => {
      goToPrevFloor();
      handleMouseMove();
    },
    onJumpToFloor: floor => {
      jumpToFloor(floor);
      handleMouseMove();
    },
    onSetPhase: (phase, floor) => {
      setPhase(phase, floor);
      handleMouseMove();
    },
    onToggleFullscreen: toggleFullscreen,
    onRefreshData: refresh,
  });

  const overallStats = getProjectStats();
  const currentFloorUnits = getFloorUnitsList(state.currentFloor);
  const currentFloorStats = getFloorStats(state.currentFloor);

  return (
    <main
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-[#080a0f] text-white flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Subtle Architectural Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f] via-[#0b0e14] to-[#06080c] pointer-events-none z-0" />
      <div className="film-grain z-0" />

      {/* Discreet Watermark Header (Fades in on mouse move) */}
      <BrandHeader
        currentFloor={
          state.phase === 'FLOOR_PRESENTATION' || state.phase === 'FLOOR_TRANSITION'
            ? state.currentFloor
            : undefined
        }
        totalFloors={13}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        isPaused={state.isPaused}
        onTogglePause={togglePause}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        visible={controlsVisible}
      />

      {/* Main Full-Screen Architectural Viewport (The Hero) */}
      <section className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
        {state.phase === 'INTRO' && (
          <IntroSequence
            overallStats={overallStats}
            onSkip={() => setPhase('ELEVATION_REVEAL')}
          />
        )}

        {state.phase === 'ELEVATION_REVEAL' && (
          <ElevationReveal
            getFloorStats={getFloorStats}
            onSelectFloor={floor => jumpToFloor(floor)}
          />
        )}

        {state.phase === 'FLOOR_PRESENTATION' && (
          <FloorPresentation
            key={`floor-${state.currentFloor}`}
            floor={state.currentFloor}
            units={currentFloorUnits}
            allUnits={units}
            summary={currentFloorStats}
          />
        )}

        {state.phase === 'FLOOR_TRANSITION' && (
          <FloorTransition
            fromFloor={state.currentFloor}
            toFloor={Math.min(13, state.currentFloor + 1)}
          />
        )}

        {state.phase === 'SUMMARY' && (
          <FinalSummary
            overallStats={overallStats}
            getFloorStats={getFloorStats}
            onSelectFloor={floor => jumpToFloor(floor)}
          />
        )}
      </section>

      {/* Discreet Live Availability Notification Toast */}
      <AvailabilityOverlay changes={recentChanges} />

      {/* Minimal Auto-Hiding Controls */}
      <PresentationControls
        phase={state.phase}
        currentFloor={state.currentFloor}
        totalFloors={13}
        progress={state.progress}
        isPaused={state.isPaused}
        visible={controlsVisible}
        onJumpToFloor={jumpToFloor}
        onSetPhase={setPhase}
        onNext={goToNextPhase}
        onPrev={goToPrevFloor}
        onTogglePause={togglePause}
      />
    </main>
  );
};
