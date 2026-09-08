'use client';

// ============================================================
// BALMANDAISA — Floor Statistics & Spotlight Card
// ============================================================

import React from 'react';
import { FloorSummary, Unit } from '@/types';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface FloorStatsCardProps {
  summary: FloorSummary;
  selectedUnit?: Unit | null;
  onClearSelectedUnit?: () => void;
}

export const FloorStatsCard: React.FC<FloorStatsCardProps> = ({
  summary,
  selectedUnit,
  onClearSelectedUnit,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {/* Floor Overview Card */}
      <div className="bg-gradient-to-br from-[#13294b]/80 via-[#0d121d]/90 to-[#13294b]/80 border border-[#D4AF37]/30 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-baseline justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
              Floor Plan
            </span>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              {summary.floor === 1 ? '1st Floor' : summary.floor === 2 ? '2nd Floor' : summary.floor === 3 ? '3rd Floor' : `${summary.floor}th Floor`}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Total Units</span>
            <span className="text-2xl font-bold font-mono text-white">
              <AnimatedCounter value={summary.total} />
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Available */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              <AnimatedCounter value={summary.available} />
            </span>
          </div>

          {/* Booked */}
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Booked
            </span>
            <span className="text-2xl font-bold font-mono text-rose-400 mt-1">
              <AnimatedCounter value={summary.booked} />
            </span>
          </div>

          {/* Blocked */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[10px] text-amber-200 uppercase tracking-wide">Blocked</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              <AnimatedCounter value={summary.blocked} />
            </span>
          </div>

          {/* Not for sale */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Reserved / NFS</span>
            <span className="text-lg font-bold font-mono text-gray-400">
              <AnimatedCounter value={summary.notForSale} />
            </span>
          </div>
        </div>
      </div>

      {/* Selected Unit Spotlight Card (if any selected) */}
      {selectedUnit && (
        <div className="bg-gradient-to-br from-[#1a2e4c]/95 to-[#0b101b]/95 border border-[#D4AF37] rounded-xl p-5 shadow-[0_0_30px_rgba(212,175,55,0.25)] backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold text-[#D4AF37]">
                Unit {selectedUnit.id}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider border ${
                  selectedUnit.status === 'AVAILABLE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : selectedUnit.status === 'BOOKED'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                    : selectedUnit.status === 'BLOCKED'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700/50'
                }`}
              >
                {selectedUnit.status.replace(/_/g, ' ')}
              </span>
              {selectedUnit.isDuplex && (
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded font-bold uppercase">
                  Duplex
                </span>
              )}
            </div>
            {onClearSelectedUnit && (
              <button
                onClick={onClearSelectedUnit}
                className="text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Configuration</span>
              <span className="font-semibold text-white">{selectedUnit.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Facing Direction</span>
              <span className="font-semibold text-white">{selectedUnit.facing}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Saleable Area</span>
              <span className="font-bold text-[#D4AF37]">{selectedUnit.sizeLabel || `${selectedUnit.builtup} SQ.FT`}</span>
            </div>
            {selectedUnit.uds && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">UDS</span>
                <span className="text-gray-200">{selectedUnit.uds} SQ.FT</span>
              </div>
            )}
            {selectedUnit.totalCost > 0 && (
              <div className="flex justify-between py-1.5 pt-2 border-t border-[#D4AF37]/20 mt-2">
                <span className="text-gray-300 font-medium">All-Inclusive Price</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  ₹{(selectedUnit.totalCost / 10000000).toFixed(2)} Cr
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
