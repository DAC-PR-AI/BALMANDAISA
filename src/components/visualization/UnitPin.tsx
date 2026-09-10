'use client';

// ============================================================
// BALMANDAISA — Architectural Non-Interfering Unit Annotation Pin
// with Adaptive Scale & Collision-Free Viewport Tooltips
// ============================================================

import React from 'react';
import { Unit } from '@/types';

interface UnitPinProps {
  unit: Unit;
  xPct: number;
  yPct: number;
  isHighlighted?: boolean;
  isDuplexUpper?: boolean;
  onSelect?: (unit: Unit) => void;
}

export const UnitPin: React.FC<UnitPinProps> = ({
  unit,
  xPct,
  yPct,
  isHighlighted = false,
  isDuplexUpper = false,
  onSelect,
}) => {
  const isAvailable = unit.status === 'AVAILABLE';
  const isBooked = unit.status === 'BOOKED';
  const isBlocked = unit.status === 'BLOCKED';
  const isLoBlocked = unit.status === 'LO_BLOCKED';

  // Clamp anchor safely inside the floor-plan canvas
  const clampedLeft = Math.max(2.5, Math.min(97.5, xPct));
  const clampedTop = Math.max(2.5, Math.min(97.5, yPct));

  // Collision-Aware Tooltip Positioning
  const isNearTop = yPct < 28;
  const isNearLeft = xPct < 22;
  const isNearRight = xPct > 75;

  let tooltipClasses = '';
  if (isNearTop) {
    tooltipClasses += ' top-full mt-1.5';
  } else {
    tooltipClasses += ' bottom-full mb-1.5';
  }

  if (isNearLeft) {
    tooltipClasses += ' left-0 translate-x-0';
  } else if (isNearRight) {
    tooltipClasses += ' right-0 translate-x-0';
  } else {
    tooltipClasses += ' left-1/2 -translate-x-1/2';
  }

  return (
    <div
      className="absolute cursor-pointer group z-20 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${clampedLeft}%`, top: `${clampedTop}%` }}
      onClick={() => onSelect?.(unit)}
    >
      {/* Compact Architectural Tag (Floor Plan Visibility > Marker Size) */}
      <div
        className={`relative flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-mono text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight transition-all duration-200 shadow-md backdrop-blur-md overflow-hidden ${
          isAvailable
            ? 'bg-[#241e12]/90 text-[#fae5a4] border-2 border-[#d4af37] unit-pin-available-live hover:bg-[#382f1d] hover:border-[#f59e0b] hover:scale-115'
            : isBooked
            ? 'bg-[#280511]/90 text-[#fda4af] border-2 border-[#9f1239] hover:bg-[#3d081a] hover:border-[#e11d48] hover:scale-115 opacity-90'
            : isBlocked
            ? 'bg-[#261705]/90 text-[#fcd34d] border-2 border-[#b45309] hover:bg-[#382207] hover:border-[#d97706] hover:scale-115'
            : isLoBlocked
            ? 'bg-[#200903]/90 text-[#fdba74] border-2 border-[#c2410c] hover:bg-[#330f05] hover:border-[#ea580c] hover:scale-115'
            : 'bg-[#0f172a]/90 text-[#cbd5e1] border-2 border-[#475569] hover:bg-[#1e293b] hover:text-white hover:scale-110'
        } ${
          isHighlighted
            ? 'scale-125 z-40 ring-4 ring-[#c5a869] border-[#c5a869] bg-black text-white'
            : ''
        }`}
      >
        {/* Subtle Live Shimmer Sweep on Available Unit Buttons */}
        {isAvailable && <span className="unit-pin-shimmer-sweep" />}

        {/* Compact Status Pip */}
        <span
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 relative z-10 ${
            isAvailable
              ? 'bg-[#e5cb89] shadow-[0_0_8px_rgba(229,203,137,1)]'
              : isBooked
              ? 'bg-[#fb7185] shadow-[0_0_8px_rgba(251,113,133,0.9)]'
              : isBlocked
              ? 'bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.9)]'
              : isLoBlocked
              ? 'bg-[#fb923c] shadow-[0_0_8px_rgba(251,146,60,0.9)]'
              : 'bg-[#94a3b8]'
          }`}
        />
        <span className="font-extrabold tracking-wider relative z-10">
          {unit.id}
          {isDuplexUpper && (
            <span className="text-[10px] sm:text-xs text-[#fae5a4] ml-1.5 uppercase font-bold">
              DUPLEX
            </span>
          )}
        </span>
      </div>

      {/* Viewport-Safe Collision-Free Tooltip */}
      <div
        className={`absolute hidden group-hover:flex flex-col w-72 p-4 rounded-xl bg-[#060910]/98 border-2 border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 pointer-events-none transition-all duration-200 ${tooltipClasses}`}
      >
        {/* Tooltip Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a869] font-serif font-bold text-lg tracking-wide">
              Unit {unit.id}
            </span>
            {(unit.isDuplex || isDuplexUpper) && (
              <span className="text-[10px] bg-[#c5a869]/25 text-[#c5a869] border border-[#c5a869]/50 px-2 py-0.5 rounded font-mono font-bold uppercase">
                Duplex
              </span>
            )}
          </div>
          <span
            className={`text-[10px] sm:text-xs uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded ${
              isAvailable
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : isBooked
                ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                : isBlocked
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : isLoBlocked
                ? 'bg-orange-950 text-orange-300 border border-orange-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-700/50'
            }`}
          >
            {unit.status === 'LO_BLOCKED' ? 'LO-BLOCKED' : unit.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Specifications */}
        <div className="text-xs sm:text-sm text-gray-200 space-y-1.5 font-sans">
          <div className="flex justify-between">
            <span className="text-gray-400">Layout</span>
            <span className="font-semibold text-white">{unit.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Orientation</span>
            <span className="text-gray-200 font-medium">{unit.facing} Facing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Saleable Area</span>
            <span className="text-[#c5a869] font-mono font-bold">
              {unit.sizeLabel || `${unit.builtup} SQ.FT`}
            </span>
          </div>
          {unit.uds && (
            <div className="flex justify-between">
              <span className="text-gray-400">UDS</span>
              <span className="text-gray-300 font-mono">{unit.uds} SQ.FT</span>
            </div>
          )}
          {unit.totalCost > 0 && (
            <div className="flex justify-between border-t border-white/15 pt-1.5 mt-1.5">
              <span className="text-gray-300 font-semibold">All-Inclusive</span>
              <span className="text-emerald-400 font-mono font-bold text-sm sm:text-base">
                ₹{(unit.totalCost / 10000000).toFixed(2)} Cr
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
