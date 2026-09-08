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
        className={`relative flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded font-mono text-[11px] md:text-[12px] font-bold tracking-tight transition-all duration-200 shadow-sm backdrop-blur-sm ${
          isAvailable
            ? 'bg-[#031c13]/95 text-emerald-300 border border-emerald-400/90 shadow-[0_1px_8px_rgba(16,185,129,0.35)] hover:bg-[#073324] hover:border-emerald-300 hover:scale-110'
            : isBooked
            ? 'bg-[#2b060d]/95 text-rose-300 border border-rose-500/90 shadow-[0_1px_8px_rgba(244,63,94,0.35)] hover:bg-[#3d0a13] hover:border-rose-400 hover:scale-110'
            : isBlocked
            ? 'bg-[#281504]/95 text-amber-300 border border-amber-500/90 shadow-[0_1px_8px_rgba(245,158,11,0.35)] hover:bg-[#381f07] hover:border-amber-400 hover:scale-110'
            : 'bg-[#0e1118]/95 text-slate-400 border border-slate-700 hover:bg-[#181d28] hover:text-slate-200 hover:scale-105'
        } ${
          isHighlighted
            ? 'scale-125 z-40 ring-2 ring-[#c5a869] border-[#c5a869] bg-black text-white'
            : ''
        }`}
      >
        {/* Compact Status Pip */}
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isAvailable
              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)] animate-pulse'
              : isBooked
              ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,1)]'
              : isBlocked
              ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,1)]'
              : 'bg-slate-500'
          }`}
        />
        <span className="font-bold tracking-wider">
          {unit.id}
          {isDuplexUpper && (
            <span className="text-[8px] text-[#c5a869] ml-1 uppercase font-semibold">
              DUPLEX
            </span>
          )}
        </span>
      </div>

      {/* Viewport-Safe Collision-Free Tooltip */}
      <div
        className={`absolute hidden group-hover:flex flex-col w-52 p-3 rounded-lg bg-[#060910]/98 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 pointer-events-none transition-all duration-200 ${tooltipClasses}`}
      >
        {/* Tooltip Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#c5a869] font-serif font-bold text-sm tracking-wide">
              Unit {unit.id}
            </span>
            {(unit.isDuplex || isDuplexUpper) && (
              <span className="text-[8px] bg-[#c5a869]/20 text-[#c5a869] border border-[#c5a869]/40 px-1 py-0.2 rounded font-mono font-bold uppercase">
                Duplex
              </span>
            )}
          </div>
          <span
            className={`text-[8px] uppercase tracking-widest font-mono font-semibold px-1 py-0.5 rounded ${
              isAvailable
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : isBooked
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                : isBlocked
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-700/40'
            }`}
          >
            {unit.status.replace(/_/g, ' ')}
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
