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
        <div className="flex items-baseline gap-3">
          <span className="text-5xl sm:text-6xl font-light font-mono tracking-tighter text-white/90">
            {formattedFloor}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.35em] text-[#c5a869] font-medium uppercase">
              Floor Plan
            </span>
            <span className="text-[11px] tracking-[0.25em] text-white/40 uppercase">
              {floor === 13 ? 'Penthouse & Duplex Level' : 'Residential Level'}
            </span>
          </div>
        </div>

        {/* Right: Discreet Unboxed Status Metrics */}
        <div className="flex items-center gap-6 text-[11px] font-mono tracking-wider">
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase tracking-widest text-[9px]">Available</span>
            <span className="text-[#c5a869] font-semibold text-sm">
              <AnimatedCounter value={summary.available} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase tracking-widest text-[9px]">Booked</span>
            <span className="text-[#be185d] font-semibold text-sm">
              <AnimatedCounter value={summary.booked} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase tracking-widest text-[9px]">Blocked</span>
            <span className="text-[#c58a2f] font-semibold text-sm">
              <AnimatedCounter value={summary.blocked} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase tracking-widest text-[9px]">Total</span>
            <span className="text-white/80 font-medium text-sm">
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
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[#c5a869] font-medium tracking-widest uppercase">
                UNIT {selectedUnit.id}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider border ${
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
                <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono">
                  (Duplex)
                </span>
              )}
            </div>
            <span className="text-white/20">|</span>
            <span className="text-xs text-white/80 tracking-wide">
              {selectedUnit.type}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs text-white/80 tracking-wide">
              Facing {selectedUnit.facing}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs text-white/90 font-mono">
              {selectedUnit.sizeLabel || `${selectedUnit.builtup} SQ.FT`}
            </span>
            {selectedUnit.totalCost > 0 && (
              <>
                <span className="text-white/20">|</span>
                <span className="text-xs text-emerald-400 font-mono font-medium">
                  ₹{(selectedUnit.totalCost / 10000000).toFixed(2)} Cr
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedUnit(null)}
            className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
          >
            Close ×
          </button>
        </div>
      ) : (
        /* Subtle architectural footer hint */
        <div className="w-full flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-2">
          <span>BALMANDAISA  ·  LEVEL {formattedFloor}</span>
          <span>AUTOPLAYING PRESENTATION</span>
        </div>
      )}
    </div>
  );
};
