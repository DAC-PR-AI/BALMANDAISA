'use client';

// ============================================================
// BALMANDAISA — Minimal 3D Building Elevation Showcase (Optimized)
// ============================================================

import React, { useState } from 'react';
import { ELEVATION_PINS_FULL } from '@/data/elevation-pins';
import { FloorSummary } from '@/types';

interface BuildingElevationProps {
  currentFloor?: number;
  onSelectFloor?: (floor: number) => void;
  getFloorStats: (floor: number) => FloorSummary;
}

export const BuildingElevation: React.FC<BuildingElevationProps> = ({
  currentFloor,
  onSelectFloor,
  getFloorStats,
}) => {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const activeFloor = hoveredFloor || currentFloor || 1;
  const floors = Array.from({ length: 13 }, (_, i) => 13 - i); // 13 down to 1

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 select-none">
      {/* Top Editorial Typography */}
      <div className="w-full flex items-baseline justify-between z-30 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] text-[#c5a869] font-medium uppercase">
            Architectural Elevation
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white/90">
            Tower Structure & Levels
          </h2>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono tracking-widest text-white/40 uppercase">
          <span>B + G + 13 RESIDENTIAL FLOORS</span>
          <span>·</span>
          <span>198 RESIDENCES</span>
        </div>
      </div>

      {/* Hero 3D Building Render with Fast-Loading WebP */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto py-2">
        <div className="relative w-full max-w-[1240px] aspect-[5176/3429] rounded-lg overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-white/10">
          <picture className="w-full h-full block">
            <source srcSet="/elevation/building-elevation.webp" type="image/webp" />
            <img
              src="/elevation/building-elevation.png"
              alt="BALMANDAISA 3D Building Elevation"
              className="w-full h-full object-fill block select-none pointer-events-none transform transition-transform duration-[12000ms] ease-out hover:scale-105"
              loading="eager"
              decoding="async"
            />
          </picture>

          {/* Minimal Hotspots on Facade Column */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {floors.map(floorNum => {
              const pos = ELEVATION_PINS_FULL[String(floorNum)];
              if (!pos) return null;

              const stats = getFloorStats(floorNum);
              const isSelected = activeFloor === floorNum;
              const hasAvailable = stats.available > 0;

              return (
                <div
                  key={floorNum}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  style={{ left: `${pos.xpct}%`, top: `${pos.ypct}%` }}
                  onClick={() => onSelectFloor?.(floorNum)}
                  onMouseEnter={() => setHoveredFloor(floorNum)}
                  onMouseLeave={() => setHoveredFloor(null)}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? 'bg-[#c5a869] text-black font-semibold shadow-[0_0_15px_rgba(197,168,105,0.7)] scale-110 z-40'
                        : hasAvailable
                        ? 'bg-black/70 border border-emerald-400/40 text-emerald-200 hover:border-emerald-300 hover:scale-110'
                        : 'bg-black/60 border border-slate-700/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{floorNum.toString().padStart(2, '0')}F</span>
                    <span className="text-[9px] opacity-75">
                      ({stats.available} Avail)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Minimal Info Bar */}
      <div className="w-full flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-2 z-30">
        <span>BALMANDAISA  ·  TOWER FACADE</span>
        <span>SELECT ANY LEVEL TO VIEW FLOOR BLUEPRINT</span>
      </div>
    </div>
  );
};
