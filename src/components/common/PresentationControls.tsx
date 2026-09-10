'use client';

// ============================================================
// BALMANDAISA — Auto-Hiding Minimal Cinematic Controls
// ============================================================

import React from 'react';
import { PresentationPhase, FLOOR_TERMINOLOGY } from '@/types';

interface PresentationControlsProps {
  phase: PresentationPhase;
  currentFloor: number;
  totalFloors?: number;
  progress: number;
  isPaused: boolean;
  visible?: boolean;
  onJumpToFloor: (floor: number) => void;
  onSetPhase: (phase: PresentationPhase, floor?: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onTogglePause: () => void;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  phase,
  currentFloor,
  totalFloors = 13,
  progress,
  isPaused,
  visible = false,
  onJumpToFloor,
  onSetPhase,
  onNext,
  onPrev,
  onTogglePause,
}) => {
  const floors = Array.from({ length: totalFloors }, (_, i) => i + 1);

  return (
    <>
      {/* Ultra-fine hairline progress line at bottom screen edge (always subtle) */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/5 z-50 pointer-events-none">
        <div
          className="h-full bg-[#c5a869] transition-all duration-100 ease-linear opacity-60"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Floating Minimal Controller (Only visible when user interacts/moves mouse) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 sm:gap-5 px-6 py-3 rounded-full bg-[#0a0d14]/95 border-2 border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.9)] backdrop-blur-md transition-opacity duration-700 select-none ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Play/Pause */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Autoplay (Space)' : 'Pause (Space)'}
          className="p-2 text-white/80 hover:text-white transition-colors"
        >
          {isPaused ? (
            <svg className="w-6 h-6 text-[#c5a869]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0118 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <span className="text-white/25">|</span>

        {/* Sequences */}
        <button
          onClick={() => onSetPhase('INTRO')}
          className={`text-xs sm:text-sm font-mono tracking-widest uppercase transition-colors px-1.5 py-0.5 ${
            phase === 'INTRO' ? 'text-[#c5a869] font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          Intro
        </button>
        <button
          onClick={() => onSetPhase('ELEVATION_REVEAL')}
          className={`text-xs sm:text-sm font-mono tracking-widest uppercase transition-colors px-1.5 py-0.5 ${
            phase === 'ELEVATION_REVEAL' ? 'text-[#c5a869] font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          Elevation
        </button>

        <span className="text-white/25">|</span>

        {/* Floor numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {floors.map(floorNum => {
            const isActive =
              (phase === 'FLOOR_PRESENTATION' || phase === 'FLOOR_TRANSITION') &&
              currentFloor === floorNum;

            return (
              <button
                key={floorNum}
                onClick={() => onJumpToFloor(floorNum)}
                title={FLOOR_TERMINOLOGY[floorNum]?.display || `${floorNum}F`}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center text-xs sm:text-sm font-mono transition-all ${
                  isActive
                    ? 'bg-[#c5a869] text-black font-extrabold shadow-[0_0_12px_rgba(197,168,105,0.7)] scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/15 font-semibold'
                }`}
              >
                {floorNum}
              </button>
            );
          })}
        </div>

        <span className="text-white/25">|</span>

        <button
          onClick={() => onSetPhase('SUMMARY')}
          className={`text-xs sm:text-sm font-mono tracking-widest uppercase transition-colors px-1.5 py-0.5 ${
            phase === 'SUMMARY' ? 'text-[#c5a869] font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          Summary
        </button>

        <span className="text-white/25">|</span>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            title="Previous (←)"
            className="p-2 text-sm sm:text-base font-mono text-white/70 hover:text-white font-bold"
          >
            ←
          </button>
          <button
            onClick={onNext}
            title="Next (→)"
            className="p-2 text-sm sm:text-base font-mono text-white/70 hover:text-white font-bold"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
};
