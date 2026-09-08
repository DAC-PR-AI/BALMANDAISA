'use client';

// ============================================================
// BALMANDAISA — Editorial Inventory Matrix with Subtle Branding
// ============================================================

import React from 'react';
import Image from 'next/image';
import { FloorSummary } from '@/types';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface FinalSummaryProps {
  overallStats: {
    total: number;
    available: number;
    booked: number;
    blocked: number;
    notForSale: number;
  };
  getFloorStats: (floor: number) => FloorSummary;
  onSelectFloor?: (floor: number) => void;
}

export const FinalSummary: React.FC<FinalSummaryProps> = ({
  overallStats,
  getFloorStats,
  onSelectFloor,
}) => {
  const floors = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-10 select-none max-w-7xl mx-auto">
      {/* Top Editorial Title & Subtle Brand Mark */}
      <div className="w-full flex items-baseline justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-6">
          <div className="relative h-10 w-36">
            <Image
              src="/branding/balmandaisa-logo.png"
              alt="Balmandaisa by DAC"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-[1px] bg-white/15" />
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a869] font-medium uppercase">
              Project Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              Availability Matrix
            </h2>
          </div>
        </div>

        {/* Discreet KPI Line */}
        <div className="flex items-center gap-8 text-xs font-mono tracking-widest">
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase text-[10px]">Total</span>
            <span className="text-lg font-light text-white">
              <AnimatedCounter value={overallStats.total} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-emerald-400/70 uppercase text-[10px]">Available</span>
            <span className="text-lg font-light text-emerald-400">
              <AnimatedCounter value={overallStats.available} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-rose-400/80 uppercase text-[10px]">Booked</span>
            <span className="text-lg font-light text-rose-400">
              <AnimatedCounter value={overallStats.booked} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-amber-400/80 uppercase text-[10px]">Blocked</span>
            <span className="text-lg font-light text-amber-400">
              <AnimatedCounter value={overallStats.blocked} />
            </span>
          </div>
        </div>
      </div>

      {/* Clean 13-Floor Matrix Table with Fine Hairlines */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-13 gap-2 border-b border-white/10 pb-2 text-[10px] font-mono tracking-widest text-white/40 uppercase text-center">
          {floors.map(f => (
            <div key={f}>{f.toString().padStart(2, '0')}F</div>
          ))}
        </div>

        <div className="grid grid-cols-13 gap-2 py-4">
          {floors.map(floorNum => {
            const stats = getFloorStats(floorNum);
            return (
              <div
                key={floorNum}
                onClick={() => onSelectFloor?.(floorNum)}
                className="flex flex-col items-center justify-between p-3 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#c5a869]/40 cursor-pointer transition-all duration-200"
              >
                <span className="text-xs font-mono font-medium text-white mb-2">
                  {floorNum.toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col items-center gap-1 text-[11px] font-mono">
                  <span className="text-emerald-400">
                    {stats.available} <span className="text-[8px] text-white/30 uppercase">Av</span>
                  </span>
                  <span className="text-rose-400/90 text-[10px]">
                    {stats.booked} <span className="text-[8px] text-white/30 uppercase">Bk</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Editorial Footer */}
      <div className="flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-3">
        <span>BALMANDAISA  ·  SALES GALLERY PRESENTATION</span>
        <span>CONTINUOUS CINEMATIC LOOP</span>
      </div>
    </div>
  );
};
