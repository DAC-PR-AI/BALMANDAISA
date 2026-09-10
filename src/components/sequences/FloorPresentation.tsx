'use client';

// ============================================================
// BALMANDAISA — Minimal Architectural Floor Presentation
// ============================================================

import React, { useState } from 'react';
import { Unit, FloorSummary } from '@/types';
import { FloorPlan } from '../visualization/FloorPlan';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface FloorPresentationProps {
  floor: number;
  units: Unit[];
  allUnits?: Record<string, Unit>;
  summary: FloorSummary;
}

export const FloorPresentation: React.FC<FloorPresentationProps> = ({
  floor,
  units,
  allUnits = {},
  summary,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const formattedFloor = floor.toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-6 select-none">
      {/* Top Editorial Header: Large Low-Contrast Floor Stamp & Discreet Status Line */}
      <div className="w-full flex items-baseline justify-between z-30 pointer-events-none">
        {/* Left: 05 FLOOR Editorial Typography */}
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="text-7xl sm:text-8xl lg:text-9xl font-light font-mono tracking-tighter text-white/95 leading-none">
            {formattedFloor}
          </span>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg tracking-[0.35em] text-[#c5a869] font-bold uppercase font-mono">
              Floor Plan
            </span>
            <span className="text-xs sm:text-sm md:text-base tracking-[0.25em] text-white/60 uppercase font-mono font-medium">
              {floor === 13 ? 'Penthouse & Duplex Level' : 'Residential Level'}
            </span>
          </div>
        </div>

        {/* Right: Discreet Unboxed Status Metrics */}
        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 text-sm sm:text-base font-mono tracking-wider">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-white/60 uppercase tracking-widest text-xs sm:text-sm font-sans font-semibold">Available</span>
            <span className="text-[#c5a869] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              <AnimatedCounter value={summary.available} />
            </span>
          </div>
          <span className="text-white/25">/</span>
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-white/60 uppercase tracking-widest text-xs sm:text-sm font-sans font-semibold">Booked</span>
            <span className="text-[#be185d] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              <AnimatedCounter value={summary.booked} />
            </span>
          </div>
          <span className="text-white/25">/</span>
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-white/60 uppercase tracking-widest text-xs sm:text-sm font-sans font-semibold">Blocked</span>
            <span className="text-[#c58a2f] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              <AnimatedCounter value={summary.blocked} />
            </span>
          </div>
          <span className="text-white/25">/</span>
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-white/60 uppercase tracking-widest text-xs sm:text-sm font-sans font-semibold">Total</span>
            <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {summary.total}
            </span>
          </div>
        </div>
      </div>

      {/* Main Floor Plan — The Hero (Takes up ~90% of Viewport) */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto py-2">
        <FloorPlan
          floor={floor}
          units={units}
          allUnits={allUnits}
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
        />
      </div>

      {/* Discreet Bottom Unit Detail Strip (Only when unit is clicked) */}
      {selectedUnit ? (
        <div className="w-full flex items-center justify-between border-t-2 border-white/15 pt-3.5 z-30 animate-in fade-in duration-300">
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
            <div className="flex items-baseline gap-3">
              <span className="text-base sm:text-lg md:text-xl text-[#c5a869] font-bold tracking-widest uppercase font-mono">
                UNIT {selectedUnit.id}
              </span>
              <span
                className={`text-xs sm:text-sm px-2.5 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider border ${
                  selectedUnit.status === 'AVAILABLE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : selectedUnit.status === 'BOOKED'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                    : selectedUnit.status === 'BLOCKED'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                    : selectedUnit.status === 'LO_BLOCKED'
                    ? 'bg-orange-950 text-orange-300 border-orange-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700/50'
                }`}
              >
                {selectedUnit.status.replace(/_/g, ' ')}
              </span>
              {selectedUnit.isDuplex && (
                <span className="text-xs sm:text-sm uppercase tracking-widest text-[#c5a869] font-mono font-bold">
                  (Duplex)
                </span>
              )}
            </div>
            <span className="text-white/25">|</span>
            <span className="text-base sm:text-lg text-white font-medium tracking-wide font-sans">
              {selectedUnit.type}
            </span>
            <span className="text-white/25">|</span>
            <span className="text-base sm:text-lg text-white/90 font-medium tracking-wide font-sans">
              Facing {selectedUnit.facing}
            </span>
            <span className="text-white/25">|</span>
            <span className="text-base sm:text-lg text-white font-mono font-semibold">
              {selectedUnit.sizeLabel || `${selectedUnit.builtup} SQ.FT`}
            </span>
            {selectedUnit.totalCost > 0 && (
              <>
                <span className="text-white/25">|</span>
                <span className="text-base sm:text-lg md:text-xl text-emerald-400 font-mono font-extrabold">
                  ₹{(selectedUnit.totalCost / 10000000).toFixed(2)} Cr
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedUnit(null)}
            className="text-sm sm:text-base uppercase tracking-widest text-white/70 hover:text-white font-mono px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
          >
            Close ×
          </button>
        </div>
      ) : (
        /* Subtle architectural footer hint */
        <div className="w-full flex items-center justify-between text-xs sm:text-sm md:text-base text-white/50 tracking-[0.25em] uppercase border-t border-white/10 pt-2.5 font-mono font-medium">
          <span>BALMANDAISA  ·  LEVEL {formattedFloor}</span>
          <span>AUTOPLAYING PRESENTATION</span>
        </div>
      )}
    </div>
  );
};
