'use client';

// ============================================================
// BALMANDAISA — Minimal Discreet Header Watermark
// ============================================================

import React from 'react';
import { LiveIndicator } from './LiveIndicator';

interface BrandHeaderProps {
  currentFloor?: number;
  totalFloors?: number;
  isConnected?: boolean;
  lastUpdated?: Date | null;
  phaseTitle?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  visible?: boolean;
  phase?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  isConnected = true,
  lastUpdated,
  onToggleFullscreen,
  isFullscreen = false,
  visible = true,
  phase,
}) => {
  const isIntroOrSummary = phase === 'INTRO' || phase === 'SUMMARY';

  return (
    <header
      className={`fixed top-0 left-0 right-0 px-8 py-4 flex items-center justify-between z-50 pointer-events-none transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Left: Understated Editorial Typography Mark (Hidden on Intro & Summary to prevent overlap) */}
      <div className={`flex items-center gap-4 sm:gap-5 transition-opacity duration-300 ${isIntroOrSummary ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <span className="text-base sm:text-lg md:text-xl font-mono font-bold tracking-[0.3em] text-white uppercase">
          BALMANDAISA
        </span>
        <span className="text-white/30 text-base">/</span>
        <span className="text-sm sm:text-base tracking-[0.25em] text-[#c5a869] uppercase font-mono font-bold">
          DAC DEVELOPERS
        </span>
      </div>

      {/* Right: Discreet Live Sync Pulse & Fullscreen Button */}
      <div className="flex items-center gap-5 pointer-events-auto">
        <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} />

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            {isFullscreen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
