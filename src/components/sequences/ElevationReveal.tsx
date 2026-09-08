'use client';

// ============================================================
// BALMANDAISA — Elevation Reveal Sequence
// ============================================================

import React from 'react';
import { BuildingElevation } from '../visualization/BuildingElevation';
import { FloorSummary } from '@/types';

interface ElevationRevealProps {
  getFloorStats: (floor: number) => FloorSummary;
  onSelectFloor?: (floor: number) => void;
}

export const ElevationReveal: React.FC<ElevationRevealProps> = ({
  getFloorStats,
  onSelectFloor,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <div className="text-center mb-4 z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
          Architectural Overview
        </span>
        <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
          Building Elevation & Floor Matrix
        </h2>
      </div>

      <BuildingElevation
        getFloorStats={getFloorStats}
        onSelectFloor={onSelectFloor}
      />
    </div>
  );
};
