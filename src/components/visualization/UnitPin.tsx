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
        className={`relative flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1 rounded-md font-mono text-[13px] md:text-[14px] lg:text-[15px] font-bold tracking-tight transition-all duration-200 shadow-sm backdrop-blur-md overflow-hidden ${
          isAvailable
            ? 'bg-[#241e12]/85 text-[#e5cb89] border border-[#c5a869]/80 unit-pin-available-live hover:bg-[#382f1d]/90 hover:border-[#d4af37] hover:scale-110'
            : isBooked
            ? 'bg-[#280511]/85 text-[#fda4af] border border-[#881337]/70 hover:bg-[#3d081a]/90 hover:border-[#be185d] hover:scale-110 opacity-90'
            : isBlocked
            ? 'bg-[#261705]/85 text-[#e0a248] border border-[#92601a]/70 hover:bg-[#382207]/90 hover:border-[#c58a2f] hover:scale-110'
            : isLoBlocked
            ? 'bg-[#200903]/85 text-[#ea580c] border border-[#7c2d12]/70 hover:bg-[#330f05]/90 hover:border-[#c2410c] hover:scale-110'
            : 'bg-[#0f172a]/85 text-[#94a3b8] border border-[#334155]/60 hover:bg-[#1e293b]/90 hover:text-white hover:scale-105'
        } ${
          isHighlighted
            ? 'scale-125 z-40 ring-2 ring-[#c5a869] border-[#c5a869] bg-black text-white'
            : ''
        }`}
      >
        {/* Subtle Live Shimmer Sweep on Available Unit Buttons */}
        {isAvailable && <span className="unit-pin-shimmer-sweep" />}

        {/* Compact Status Pip */}
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 relative z-10 ${
            isAvailable
              ? 'bg-[#c5a869] shadow-[0_0_6px_rgba(197,168,105,0.9)]'
              : isBooked
              ? 'bg-[#881337] shadow-[0_0_5px_rgba(136,19,55,0.8)]'
              : isBlocked
              ? 'bg-[#92601a] shadow-[0_0_5px_rgba(146,96,26,0.8)]'
              : isLoBlocked
              ? 'bg-[#7c2d12] shadow-[0_0_5px_rgba(124,45,18,0.8)]'
              : 'bg-[#475569]'
          }`}
        />
        <span className="font-bold tracking-wider relative z-10">
          {unit.id}
          {isDuplexUpper && (
            <span className="text-[9px] md:text-[10px] text-[#c5a869] ml-1 uppercase font-semibold">
              DUPLEX
            </span>
          )}
        </span>
      </div>

      {/* Viewport-Safe Collision-Free Tooltip */}
      <div
        className={`absolute hidden group-hover:flex flex-col w-60 p-3.5 rounded-lg bg-[#060910]/98 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 pointer-events-none transition-all duration-200 ${tooltipClasses}`}
      >
        {/* Tooltip Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a869] font-serif font-bold text-base tracking-wide">
              Unit {unit.id}
            </span>
            {(unit.isDuplex || isDuplexUpper) && (
              <span className="text-[9px] bg-[#c5a869]/20 text-[#c5a869] border border-[#c5a869]/40 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                Duplex
              </span>
            )}
          </div>
          <span
            className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-mono font-semibold px-1.5 py-0.5 rounded ${
              isAvailable
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : isBooked
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                : isBlocked
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                : isLoBlocked
                ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-700/40'
            }`}
          >
            {unit.status === 'LO_BLOCKED' ? 'LO-BLOCKED' : unit.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Specifications */}
        <div className="text-[10px] text-gray-200 space-y-1 font-sans">
          <div className="flex justify-between">
            <span className="text-gray-400">Layout</span>
            <span className="font-medium text-white">{unit.type}</span>
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
            <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
              <span className="text-gray-400 font-medium">All-Inclusive</span>
              <span className="text-emerald-400 font-mono font-bold text-[11px]">
                ₹{(unit.totalCost / 10000000).toFixed(2)} Cr
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
