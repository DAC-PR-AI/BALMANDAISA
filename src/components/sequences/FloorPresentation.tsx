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
        <div className="flex items-baseline gap-3 sm:gap-4">
          <span className="text-6xl sm:text-7xl lg:text-8xl font-light font-mono tracking-tighter text-white/95 leading-none">
            {formattedFloor}
          </span>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm tracking-[0.35em] text-[#c5a869] font-medium uppercase font-mono">
              Floor Plan
            </span>
            <span className="text-xs sm:text-sm tracking-[0.25em] text-white/50 uppercase font-mono">
              {floor === 13 ? 'Penthouse & Duplex Level' : 'Residential Level'}
            </span>
          </div>
        </div>

        {/* Right: Discreet Unboxed Status Metrics */}
        <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-mono tracking-wider">
          <div className="flex items-baseline gap-2 sm:gap-2.5">
            <span className="text-white/50 uppercase tracking-widest text-[10px] sm:text-xs font-sans">Available</span>
            <span className="text-[#c5a869] font-bold text-lg sm:text-xl md:text-2xl">
              <AnimatedCounter value={summary.available} />
            </span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex items-baseline gap-2 sm:gap-2.5">
            <span className="text-white/50 uppercase tracking-widest text-[10px] sm:text-xs font-sans">Booked</span>
            <span className="text-[#be185d] font-bold text-lg sm:text-xl md:text-2xl">
              <AnimatedCounter value={summary.booked} />
            </span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex items-baseline gap-2 sm:gap-2.5">
            <span className="text-white/50 uppercase tracking-widest text-[10px] sm:text-xs font-sans">Blocked</span>
            <span className="text-[#c58a2f] font-bold text-lg sm:text-xl md:text-2xl">
              <AnimatedCounter value={summary.blocked} />
            </span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex items-baseline gap-2 sm:gap-2.5">
            <span className="text-white/50 uppercase tracking-widest text-[10px] sm:text-xs font-sans">Total</span>
            <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">
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
        <div className="w-full flex items-center justify-between border-t border-white/10 pt-3 z-30 animate-in fade-in duration-300">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm sm:text-base text-[#c5a869] font-bold tracking-widest uppercase font-mono">
                UNIT {selectedUnit.id}
              </span>
              <span
                className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border ${
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
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c5a869] font-mono font-semibold">
                  (Duplex)
                </span>
              )}
            </div>
            <span className="text-white/20">|</span>
            <span className="text-sm sm:text-base text-white/90 tracking-wide font-sans">
              {selectedUnit.type}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-sm sm:text-base text-white/90 tracking-wide font-sans">
              Facing {selectedUnit.facing}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-sm sm:text-base text-white/95 font-mono font-medium">
              {selectedUnit.sizeLabel || `${selectedUnit.builtup} SQ.FT`}
            </span>
            {selectedUnit.totalCost > 0 && (
              <>
                <span className="text-white/20">|</span>
                <span className="text-sm sm:text-base text-emerald-400 font-mono font-bold">
                  ₹{(selectedUnit.totalCost / 10000000).toFixed(2)} Cr
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedUnit(null)}
            className="text-xs sm:text-sm uppercase tracking-widest text-white/50 hover:text-white font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10"
          >
            Close ×
          </button>
        </div>
      ) : (
        /* Subtle architectural footer hint */
        <div className="w-full flex items-center justify-between text-xs sm:text-sm text-white/40 tracking-[0.25em] uppercase border-t border-white/10 pt-2 font-mono">
          <span>BALMANDAISA  ·  LEVEL {formattedFloor}</span>
          <span>AUTOPLAYING PRESENTATION</span>
        </div>
      )}
    </div>
  );
};
