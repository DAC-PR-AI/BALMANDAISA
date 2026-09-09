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
          <span className="text-[10px] tracking-[0.4em] text-[#c5a869] font-medium uppercase">
            ARCHITECTURAL ELEVATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white/90">
            Thirteen-Storey Residence
          </h2>
          <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase mt-1 font-mono">
            MODERN LIVING / REFINED SPACES / ELEVATED LIFESTYLE
          </span>
        </div>

        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-6 text-[11px] font-mono tracking-widest text-white/40 uppercase">
            <span>B + G + 13 RESIDENTIAL LEVELS</span>
            <span>·</span>
            <span>194 SIGNATURE RESIDENCES</span>
          </div>

          {/* Canonical 5 Availability Splits from Google Sheet */}
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            {AVAILABILITY_SPLITS.map(split => {
              const count = statsSummary[split.statKey] ?? 0;
              return (
                <div
                  key={split.key}
                  className="flex items-center gap-1.5 text-[10px] font-mono"
                  title={`${split.sheetName}: ${count} Residences`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: split.color,
                      boxShadow: `0 0 6px ${split.color}`,
                    }}
                  />
                  <span className="text-white/60 tracking-wider uppercase font-sans text-[9px]">
                    {split.sheetName}
                  </span>
                  <span className="font-semibold text-white/90 ml-0.5">
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
              const term = FLOOR_TERMINOLOGY[floorNum] || {
                short: `${floorNum.toString().padStart(2, '0')}F`,
                full: `FLOOR ${floorNum}`,
                display: `${floorNum.toString().padStart(2, '0')}F — FLOOR ${floorNum}`,
              };

              // Determine primary availability indicator color matching Sheet mapping
              let statusBorder = 'border-slate-700/40 text-slate-400 hover:text-slate-200';
              if (stats.available > 0) {
                statusBorder = 'border-emerald-400/40 text-emerald-200 hover:border-emerald-300';
              } else if (stats.loBlocked > 0) {
                statusBorder = 'border-orange-500/40 text-orange-200 hover:border-orange-300';
              } else if (stats.blocked > 0) {
                statusBorder = 'border-amber-500/40 text-amber-200 hover:border-amber-300';
              } else if (stats.booked > 0) {
                statusBorder = 'border-rose-500/40 text-rose-200 hover:border-rose-300';
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
                    className={`relative flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? 'bg-[#c5a869] text-black font-semibold shadow-[0_0_15px_rgba(197,168,105,0.7)] scale-110 z-40'
                        : `bg-black/75 border ${statusBorder} hover:scale-110`
                    }`}
                  >
                    <span>{term.short}</span>
                    <span className="text-[9px] opacity-75">
                      ({stats.available} Avail)
                    </span>

                    {/* Popover on hover with exact 5 categories and full floor display */}
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1 px-3 py-2 rounded-md bg-[#0a0d14]/95 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md z-50 whitespace-nowrap pointer-events-none">
                      <span className="text-[11px] font-sans font-medium text-white tracking-wide border-b border-white/10 pb-1">
                        {term.display}
                      </span>
                      <div className="flex items-center gap-3 pt-0.5 text-[9px] font-mono">
                        <span className="text-emerald-400">
                          {stats.available} Avail
                        </span>
                        <span className="text-rose-400">
                          {stats.booked} Booked
                        </span>
                        <span className="text-amber-400">
                          {stats.blocked} Blocked
                        </span>
                        <span className="text-orange-400">
                          {stats.loBlocked} LO-Blk
                        </span>
                        <span className="text-slate-400">
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
      <div className="w-full flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-2 z-30">
        <span>BALMANDAISA  ·  ARCHITECTURAL ELEVATION</span>
        <span>SELECT ANY RESIDENTIAL LEVEL TO VIEW BLUEPRINT</span>
      </div>
    </div>
  );
};
