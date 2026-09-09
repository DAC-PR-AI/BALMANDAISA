'use client';

// ============================================================
// BALMANDAISA — Premium Stacked Bar Chart Availability Matrix
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FloorSummary, FLOOR_TERMINOLOGY, AVAILABILITY_SPLITS } from '@/types';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface FinalSummaryProps {
  overallStats: {
    total: number;
    available: number;
    booked: number;
    blocked: number;
    loBlocked: number;
    notForSale: number;
  };
  getFloorStats: (floor: number) => FloorSummary;
  onSelectFloor?: (floor: number) => void;
}

// Status segment config matching AVAILABILITY_SPLITS exactly
const SEGMENTS = [
  { key: 'available' as const, label: 'Available', color: '#10b981', hoverColor: '#34d399' },
  { key: 'booked' as const, label: 'Booked', color: '#f43f5e', hoverColor: '#fb7185' },
  { key: 'blocked' as const, label: 'Blocked', color: '#f59e0b', hoverColor: '#fbbf24' },
  { key: 'loBlocked' as const, label: 'LO-Blocked', color: '#f97316', hoverColor: '#fb923c' },
  { key: 'notForSale' as const, label: 'NFS', color: '#64748b', hoverColor: '#94a3b8' },
];

export const FinalSummary: React.FC<FinalSummaryProps> = ({
  overallStats,
  getFloorStats,
  onSelectFloor,
}) => {
  const floors = Array.from({ length: 13 }, (_, i) => i + 1);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  // Smooth load-in animation
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out cubic
      setAnimProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  // Compute floor data and max total for Y-axis scaling
  const floorData = useMemo(() => {
    return floors.map(f => getFloorStats(f));
  }, [floors, getFloorStats]);

  const maxUnits = useMemo(() => {
    return Math.max(...floorData.map(d => d.total), 1);
  }, [floorData]);

  // Data validation (development mode only)
  const validationIssues = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return [];
    const issues: string[] = [];

    // Check each floor's internal consistency
    let sumAvailable = 0, sumBooked = 0, sumBlocked = 0, sumLoBlocked = 0, sumNfs = 0;
    for (const fd of floorData) {
      const floorTotal = fd.available + fd.booked + fd.blocked + fd.loBlocked + fd.notForSale;
      if (floorTotal !== fd.total) {
        issues.push(`Floor ${fd.floor}: segment sum (${floorTotal}) ≠ total (${fd.total})`);
      }
      sumAvailable += fd.available;
      sumBooked += fd.booked;
      sumBlocked += fd.blocked;
      sumLoBlocked += fd.loBlocked;
      sumNfs += fd.notForSale;
    }

    // Cross-check with header totals
    if (sumAvailable !== overallStats.available) issues.push(`Available: floors(${sumAvailable}) ≠ header(${overallStats.available})`);
    if (sumBooked !== overallStats.booked) issues.push(`Booked: floors(${sumBooked}) ≠ header(${overallStats.booked})`);
    if (sumBlocked !== overallStats.blocked) issues.push(`Blocked: floors(${sumBlocked}) ≠ header(${overallStats.blocked})`);
    if (sumLoBlocked !== overallStats.loBlocked) issues.push(`LO-Blocked: floors(${sumLoBlocked}) ≠ header(${overallStats.loBlocked})`);
    if (sumNfs !== overallStats.notForSale) issues.push(`NFS: floors(${sumNfs}) ≠ header(${overallStats.notForSale})`);

    if (issues.length > 0) {
      console.warn('[BALMANDAISA Data Sync]', issues);
    }
    return issues;
  }, [floorData, overallStats]);

  // Y-axis tick marks
  const yTicks = useMemo(() => {
    const step = maxUnits <= 10 ? 2 : maxUnits <= 20 ? 5 : 10;
    const ticks: number[] = [];
    for (let v = 0; v <= maxUnits; v += step) {
      ticks.push(v);
    }
    if (ticks[ticks.length - 1] < maxUnits) {
      ticks.push(maxUnits);
    }
    return ticks;
  }, [maxUnits]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      
      {/* ── Top Header: Logo + Title + KPIs ── */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-baseline justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-5">
          <div className="relative h-10 w-36 flex-shrink-0">
            <Image
              src="/branding/balmandaisa-logo.png"
              alt="Balmandaisa by DAC"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-8 w-[1px] bg-white/15 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.4em] text-[#c5a869] font-medium uppercase">
              Project Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              Availability Matrix
            </h2>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono tracking-widest flex-wrap">
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
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-orange-400/80 uppercase text-[10px]">LO-Blocked</span>
            <span className="text-lg font-light text-orange-400">
              <AnimatedCounter value={overallStats.loBlocked} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-400/80 uppercase text-[10px]">NFS</span>
            <span className="text-lg font-light text-slate-400">
              <AnimatedCounter value={overallStats.notForSale} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Data Sync Warning (Dev Only) ── */}
      {validationIssues.length > 0 && process.env.NODE_ENV === 'development' && (
        <div className="mt-2 px-3 py-1.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
          Data Sync Issue — {validationIssues.length} mismatch{validationIssues.length > 1 ? 'es' : ''} detected
        </div>
      )}

      {/* ── Chart Section Title ── */}
      <div className="mt-5 mb-2">
        <span className="text-[10px] tracking-[0.35em] text-white/30 uppercase font-mono">
          Total Units by Floor
        </span>
      </div>

      {/* ── Stacked Bar Chart ── */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-3 py-1 text-right" style={{ minWidth: '28px' }}>
          {yTicks.slice().reverse().map(tick => (
            <span key={tick} className="text-[9px] font-mono text-white/25 leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative border-l border-b border-white/[0.07]">
          {/* Horizontal grid lines */}
          {yTicks.map(tick => (
            <div
              key={tick}
              className="absolute w-full border-t border-white/[0.04]"
              style={{ bottom: `${(tick / maxUnits) * 100}%` }}
            />
          ))}

          {/* Bars container */}
          <div className="absolute inset-0 flex items-end">
            {floorData.map((fd, idx) => {
              const isHovered = hoveredFloor === fd.floor;
              const barHeightPct = (fd.total / maxUnits) * 100 * animProgress;
              
              // Build segments bottom-to-top
              let runningPct = 0;
              const segmentElements = SEGMENTS.map(seg => {
                const count = fd[seg.key];
                if (count === 0) return null;
                const segPct = (count / maxUnits) * 100 * animProgress;
                const bottomPct = runningPct;
                runningPct += segPct;

                return (
                  <div
                    key={seg.key}
                    className="absolute left-0 right-0 transition-all duration-300"
                    style={{
                      bottom: `${bottomPct}%`,
                      height: `${segPct}%`,
                      backgroundColor: isHovered ? seg.hoverColor : seg.color,
                      opacity: isHovered ? 1 : 0.85,
                      borderRadius: runningPct >= barHeightPct - 0.5 ? '3px 3px 0 0' : '0',
                    }}
                  >
                    {/* Show count inside segment only if tall enough */}
                    {segPct > 12 && count > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {count}
                      </span>
                    )}
                  </div>
                );
              });

              return (
                <div
                  key={fd.floor}
                  className="relative flex-1 flex flex-col items-center group cursor-pointer"
                  style={{ padding: '0 clamp(2px, 0.4vw, 6px)' }}
                  onMouseEnter={() => setHoveredFloor(fd.floor)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => onSelectFloor?.(fd.floor)}
                >
                  {/* Total label above bar */}
                  <div
                    className="absolute text-center transition-all duration-300"
                    style={{
                      bottom: `calc(${barHeightPct}% + 6px)`,
                      opacity: animProgress > 0.5 ? 1 : 0,
                    }}
                  >
                    <span className={`text-[10px] font-mono font-semibold transition-colors duration-200 ${
                      isHovered ? 'text-[#D4AF37]' : 'text-white/50'
                    }`}>
                      {fd.total}
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div
                    className={`absolute bottom-0 left-[15%] right-[15%] rounded-t-[3px] transition-all duration-200 ${
                      isHovered
                        ? 'shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/30'
                        : ''
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  >
                    {segmentElements}
                  </div>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div
                      className="absolute z-50 pointer-events-none"
                      style={{
                        bottom: `calc(${barHeightPct}% + 26px)`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="bg-[#0c1220]/98 border border-[#D4AF37]/40 rounded-xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl min-w-[160px]">
                        <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-medium mb-2">
                          {FLOOR_TERMINOLOGY[fd.floor]?.display || `Floor ${fd.floor}`}
                        </div>
                        <div className="h-[1px] bg-white/10 mb-2" />
                        {SEGMENTS.map(seg => {
                          const val = fd[seg.key];
                          if (val === 0) return null;
                          return (
                            <div key={seg.key} className="flex items-center justify-between gap-4 py-[3px]">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: seg.color }}
                                />
                                <span className="text-[11px] text-white/60">{seg.label}</span>
                              </div>
                              <span className="text-[11px] font-mono font-semibold text-white">{val}</span>
                            </div>
                          );
                        })}
                        <div className="h-[1px] bg-white/10 mt-1.5 mb-1.5" />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">Total</span>
                          <span className="text-xs font-mono font-bold text-white">{fd.total}</span>
                        </div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="w-2 h-2 bg-[#0c1220]/98 border-b border-r border-[#D4AF37]/40 rotate-45 mx-auto -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis floor labels */}
          <div className="absolute -bottom-7 left-0 right-0 flex">
            {floorData.map(fd => (
              <div
                key={fd.floor}
                className={`flex-1 text-center text-[10px] font-mono tracking-wider transition-colors duration-200 cursor-pointer ${
                  hoveredFloor === fd.floor
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-white/35'
                }`}
                onClick={() => onSelectFloor?.(fd.floor)}
              >
                {FLOOR_TERMINOLOGY[fd.floor]?.short || `${fd.floor.toString().padStart(2, '0')}F`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center justify-center gap-5 mt-10 mb-2">
        {SEGMENTS.map(seg => (
          <div key={seg.key} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: seg.color, opacity: 0.85 }}
            />
            <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
              {seg.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Bottom Editorial Footer ── */}
      <div className="flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-3">
        <span>BALMANDAISA  ·  SALES GALLERY PRESENTATION</span>
        <span>CONTINUOUS CINEMATIC LOOP</span>
      </div>
    </div>
  );
};
