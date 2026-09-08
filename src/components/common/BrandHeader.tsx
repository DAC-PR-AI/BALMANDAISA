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
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  isConnected = true,
  lastUpdated,
  onToggleFullscreen,
  isFullscreen = false,
  visible = true,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 px-8 py-4 flex items-center justify-between z-50 pointer-events-none transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Left: Understated Editorial Typography Mark */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono font-medium tracking-[0.3em] text-white/70 uppercase">
          BALMANDAISA
        </span>
        <span className="text-white/20">/</span>
        <span className="text-[10px] tracking-[0.25em] text-[#c5a869] uppercase font-mono">
          DAC DEVELOPERS
        </span>
      </div>

      {/* Right: Discreet Live Sync Pulse & Fullscreen Button */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <LiveIndicator isConnected={isConnected} lastUpdated={lastUpdated} />

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            className="p-1.5 text-white/40 hover:text-white transition-colors"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
