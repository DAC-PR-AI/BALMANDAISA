'use client';

// ============================================================
// BALMANDAISA — 3D Building Elevation Showcase (Optimized)
// ============================================================

import React, { useState } from 'react';
import { ELEVATION_PINS_FULL } from '@/data/elevation-pins';
import { FloorSummary, AVAILABILITY_SPLITS, FLOOR_TERMINOLOGY, Unit } from '@/types';

interface BuildingElevationProps {
  currentFloor?: number;
  onSelectFloor?: (floor: number) => void;
  getFloorStats: (floor: number) => FloorSummary;
  overallStats?: {
    total: number;
    available: number;
    booked: number;
    blocked: number;
    loBlocked: number;
    notForSale: number;
  };
  units?: Record<string, Unit>;
  lastUpdated?: Date | null;
}

export const BuildingElevation: React.FC<BuildingElevationProps> = ({
  currentFloor,
  onSelectFloor,
  getFloorStats,
  overallStats,
  units,
  lastUpdated,
}) => {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const activeFloor = hoveredFloor || currentFloor || 1;
  const floors = Array.from({ length: 13 }, (_, i) => 13 - i); // 13 down to 1

  // Compute live project availability stats if not directly passed
  const statsSummary = overallStats || floors.reduce(
    (acc, f) => {
      const s = getFloorStats(f);
      return {
        total: acc.total + s.total,
        available: acc.available + s.available,
        booked: acc.booked + s.booked,
        blocked: acc.blocked + s.blocked,
        loBlocked: acc.loBlocked + s.loBlocked,
        notForSale: acc.notForSale + s.notForSale,
      };
    },
    { total: 0, available: 0, booked: 0, blocked: 0, loBlocked: 0, notForSale: 0 }
  );

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 select-none">
      {/* Top Editorial Typography */}
      <div className="w-full flex items-start justify-between z-30 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-sm sm:text-base md:text-lg tracking-[0.4em] text-[#c5a869] font-bold uppercase font-mono">
            ARCHITECTURAL ELEVATION
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white/95 mt-1">
            Thirteen-Storey Residence
          </h2>
          <span className="text-xs sm:text-sm md:text-base tracking-[0.25em] text-white/60 uppercase mt-1 font-mono font-medium">
            MODERN LIVING / REFINED SPACES / ELEVATED LIFESTYLE
          </span>
        </div>

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="flex items-center gap-6 text-sm sm:text-base font-mono tracking-widest text-white/60 uppercase font-medium">
            <span>B + G + 13 RESIDENTIAL LEVELS</span>
            <span>·</span>
            <span>194 SIGNATURE RESIDENCES</span>
          </div>

          {/* Canonical 5 Availability Splits from Google Sheet */}
          <div className="flex items-center gap-4 bg-black/75 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-white/20 shadow-2xl">
            {AVAILABILITY_SPLITS.map(split => {
              const count = statsSummary[split.statKey] ?? 0;
              return (
                <div
                  key={split.key}
                  className="flex items-center gap-2.5 text-sm sm:text-base font-mono"
                  title={`${split.sheetName}: ${count} Residences`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: split.color,
                      boxShadow: `0 0 10px ${split.color}`,
                    }}
                  />
                  <span className="text-white/80 tracking-wider uppercase font-sans text-xs sm:text-sm font-semibold">
                    {split.sheetName}
                  </span>
                  <span className="font-extrabold text-white ml-0.5">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero 3D Building Render with Fast-Loading WebP */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto py-2">
        <div className="relative w-full max-w-[1240px] aspect-[5176/3429] rounded-xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] border-2 border-white/15">
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
              const term = FLOOR_TERMINOLOGY[floorNum] || {
                short: `${floorNum.toString().padStart(2, '0')}F`,
                full: `FLOOR ${floorNum}`,
                display: `${floorNum.toString().padStart(2, '0')}F — FLOOR ${floorNum}`,
              };

              // Determine primary availability indicator color matching Sheet mapping
              let statusBorder = 'border-slate-600/60 text-slate-300 hover:text-white';
              if (stats.available > 0) {
                statusBorder = 'border-emerald-400/70 text-emerald-100 hover:border-emerald-300';
              } else if (stats.loBlocked > 0) {
                statusBorder = 'border-orange-500/70 text-orange-100 hover:border-orange-300';
              } else if (stats.blocked > 0) {
                statusBorder = 'border-amber-500/70 text-amber-100 hover:border-amber-300';
              } else if (stats.booked > 0) {
                statusBorder = 'border-rose-500/70 text-rose-100 hover:border-rose-300';
              }

              return (
                <div
                  key={floorNum}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  style={{ left: `${pos.xpct}%`, top: `${pos.ypct}%` }}
                  onClick={() => onSelectFloor?.(floorNum)}
                  onMouseEnter={() => setHoveredFloor(floorNum)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  title={term.display}
                >
                  <div
                    className={`relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm sm:text-base font-mono tracking-wider transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? 'bg-[#c5a869] text-black font-extrabold shadow-[0_0_24px_rgba(197,168,105,0.95)] scale-115 z-40'
                        : `bg-black/90 border-2 ${statusBorder} hover:scale-115 font-bold`
                    }`}
                  >
                    <span>{term.short}</span>
                    <span className="text-xs sm:text-sm font-semibold opacity-90">
                      ({stats.available} Avail)
                    </span>

                    {/* Popover on hover with exact 5 categories and full floor display */}
                    <div className="absolute left-full ml-3.5 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-2 px-5 py-3 rounded-xl bg-[#0a0d14]/98 border-2 border-white/25 shadow-[0_16px_45px_rgba(0,0,0,0.98)] backdrop-blur-xl z-50 whitespace-nowrap pointer-events-none">
                      <span className="text-sm sm:text-base font-sans font-bold text-white tracking-wide border-b border-white/20 pb-1.5">
                        {term.display}
                      </span>
                      <div className="flex items-center gap-4 pt-1 text-xs sm:text-sm font-mono font-bold">
                        <span className="text-emerald-300">
                          {stats.available} Avail
                        </span>
                        <span className="text-rose-300">
                          {stats.booked} Booked
                        </span>
                        <span className="text-amber-300">
                          {stats.blocked} Blocked
                        </span>
                        <span className="text-orange-300">
                          {stats.loBlocked} LO-Blk
                        </span>
                        <span className="text-slate-300">
                          {stats.notForSale} NFS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Minimal Info Bar */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm md:text-base text-white/50 tracking-[0.25em] uppercase border-t border-white/10 pt-2.5 z-30 font-mono font-medium">
        <span>BALMANDAISA  ·  ARCHITECTURAL ELEVATION</span>
        <span>SELECT ANY RESIDENTIAL LEVEL TO VIEW BLUEPRINT</span>
      </div>
    </div>
  );
};
