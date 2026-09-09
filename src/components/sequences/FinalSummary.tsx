'use client';

// ============================================================
// BALMANDAISA — Premium Stacked Bar Chart Availability Matrix
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FloorSummary, FLOOR_TERMINOLOGY } from '@/types';
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

// 5 Status segments matching Google Sheet availability categories exactly
const SEGMENTS = [
  { key: 'available' as const, label: 'Available', color: '#10b981', hoverColor: '#34d399', bgClass: 'bg-emerald-500' },
  { key: 'booked' as const, label: 'Booked', color: '#f43f5e', hoverColor: '#fb7185', bgClass: 'bg-rose-500' },
  { key: 'blocked' as const, label: 'Blocked', color: '#f59e0b', hoverColor: '#fbbf24', bgClass: 'bg-amber-500' },
  { key: 'loBlocked' as const, label: 'LO-Blocked', color: '#f97316', hoverColor: '#fb923c', bgClass: 'bg-orange-500' },
  { key: 'notForSale' as const, label: 'NFS', color: '#64748b', hoverColor: '#94a3b8', bgClass: 'bg-slate-500' },
];

export const FinalSummary: React.FC<FinalSummaryProps> = ({
  overallStats,
  getFloorStats,
  onSelectFloor,
}) => {
  const floors = useMemo(() => Array.from({ length: 13 }, (_, i) => i + 1), []);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [animProgress, setAnimProgress] = useState(0);

  // Smooth cubic ease-out entry animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimProgress(ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute floor data
  const floorData = useMemo(() => {
    return floors.map(f => getFloorStats(f));
  }, [floors, getFloorStats]);

  // Max units for Y-axis scaling (minimum 16 to keep nice headroom)
  const maxUnits = useMemo(() => {
    const highest = Math.max(...floorData.map(d => d.total), 1);
    // Round up to nearest multiple of 4 or 5 for clean Y-axis ticks
    return Math.max(Math.ceil(highest / 4) * 4, 16);
  }, [floorData]);

  // Development Data Validation Mechanism
  const validationIssues = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return [];
    const issues: string[] = [];

    let sumAvailable = 0, sumBooked = 0, sumBlocked = 0, sumLoBlocked = 0, sumNfs = 0, sumTotal = 0;

    for (const fd of floorData) {
      const floorSegmentSum = fd.available + fd.booked + fd.blocked + fd.loBlocked + fd.notForSale;
      if (floorSegmentSum !== fd.total) {
        issues.push(`Floor ${fd.floor}: sum of segments (${floorSegmentSum}) !== total (${fd.total})`);
      }
      sumAvailable += fd.available;
      sumBooked += fd.booked;
      sumBlocked += fd.blocked;
      sumLoBlocked += fd.loBlocked;
      sumNfs += fd.notForSale;
      sumTotal += fd.total;
    }

    if (sumTotal !== overallStats.total) issues.push(`Total: sum(${sumTotal}) !== overall(${overallStats.total})`);
    if (sumAvailable !== overallStats.available) issues.push(`Available: sum(${sumAvailable}) !== overall(${overallStats.available})`);
    if (sumBooked !== overallStats.booked) issues.push(`Booked: sum(${sumBooked}) !== overall(${overallStats.booked})`);
    if (sumBlocked !== overallStats.blocked) issues.push(`Blocked: sum(${sumBlocked}) !== overall(${overallStats.blocked})`);
    if (sumLoBlocked !== overallStats.loBlocked) issues.push(`LO-Blocked: sum(${sumLoBlocked}) !== overall(${overallStats.loBlocked})`);
    if (sumNfs !== overallStats.notForSale) issues.push(`NFS: sum(${sumNfs}) !== overall(${overallStats.notForSale})`);

    if (issues.length > 0) {
      console.warn('[BALMANDAISA Stacked Chart Sync Validation]', issues);
    }

    return issues;
  }, [floorData, overallStats]);

  // Y-axis tick intervals
  const yTicks = useMemo(() => {
    const step = maxUnits <= 12 ? 3 : maxUnits <= 20 ? 4 : 5;
    const ticks: number[] = [];
    for (let i = 0; i <= maxUnits; i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [maxUnits]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
      
      {/* ── Top Header: Logo + Title + Summary KPIs ── */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-baseline justify-between border-b border-white/10 pb-4 gap-4">
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

        {/* Discreet KPI Line with all 5 Google Sheet Categories */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 text-xs font-mono tracking-widest flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-white/40 uppercase text-[10px]">Total</span>
            <span className="text-lg font-light text-white">
              <AnimatedCounter value={overallStats.total} />
            </span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-emerald-400/80 uppercase text-[10px]">Available</span>
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

      {/* ── Dev Mode Data Sync Alert (if any inconsistency detected) ── */}
      {validationIssues.length > 0 && process.env.NODE_ENV === 'development' && (
        <div className="my-2 px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/30 text-rose-300 text-[10px] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <span>Data Sync Issue: {validationIssues[0]}</span>
        </div>
      )}

      {/* ── Center Section: Stacked Bar Chart ── */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        {/* Section Heading */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono tracking-[0.35em] text-white/40 uppercase">
            Total Units by Floor
          </span>
        </div>

        {/* Main Chart Canvas Container */}
        <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[340px] flex">
          
          {/* Y-Axis Scale */}
          <div className="relative h-full flex flex-col justify-between pr-3 py-0 text-right select-none" style={{ minWidth: '32px' }}>
            {yTicks.slice().reverse().map(tick => (
              <span key={tick} className="text-[9px] sm:text-[10px] font-mono text-white/30 leading-none">
                {tick}
              </span>
            ))}
          </div>

          {/* Chart Grid & Bars Body */}
          <div className="relative flex-1 h-full border-l border-b border-white/10">
            
            {/* Horizontal Gridlines */}
            {yTicks.map(tick => (
              <div
                key={tick}
                className="absolute w-full border-t border-white/[0.04] pointer-events-none"
                style={{ bottom: `${(tick / maxUnits) * 100}%` }}
              />
            ))}

            {/* 13 Stacked Vertical Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-1 sm:px-2 gap-1.5 sm:gap-3">
              {floorData.map(fd => {
                const isHovered = hoveredFloor === fd.floor;
                const barHeightPct = fd.total > 0 ? (fd.total / maxUnits) * 100 * animProgress : 0;

                return (
                  <div
                    key={fd.floor}
                    className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredFloor(fd.floor)}
                    onMouseLeave={() => setHoveredFloor(null)}
                    onClick={() => onSelectFloor?.(fd.floor)}
                  >
                    {/* Total Number Badge Above Stacked Bar */}
                    <div
                      className="absolute text-center pointer-events-none transition-all duration-300"
                      style={{
                        bottom: `calc(${barHeightPct}% + 6px)`,
                        opacity: animProgress > 0.3 ? 1 : 0,
                      }}
                    >
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono font-semibold transition-colors duration-200 ${
                          isHovered ? 'text-[#D4AF37]' : 'text-white/60'
                        }`}
                      >
                        {fd.total}
                      </span>
                    </div>

                    {/* The Stacked Bar Column */}
                    <div
                      className={`w-full max-w-[42px] sm:max-w-[48px] rounded-t-[4px] overflow-hidden flex flex-col transition-all duration-300 border ${
                        isHovered
                          ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/50'
                          : 'border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                      }`}
                      style={{
                        height: `${barHeightPct}%`,
                      }}
                    >
                      {/* Segments Stacked Inside (Top-to-Bottom order: NFS, LO-Blocked, Blocked, Booked, Available) */}
                      {SEGMENTS.slice().reverse().map(seg => {
                        const count = fd[seg.key];
                        if (count <= 0 || fd.total <= 0) return null;
                        const segmentHeightPct = (count / fd.total) * 100;

                        return (
                          <div
                            key={seg.key}
                            className="w-full relative flex items-center justify-center transition-all duration-200"
                            style={{
                              height: `${segmentHeightPct}%`,
                              backgroundColor: isHovered ? seg.hoverColor : seg.color,
                              opacity: isHovered ? 1 : 0.9,
                            }}
                          >
                            {/* Inner segment number if segment has enough vertical space */}
                            {segmentHeightPct >= 18 && (
                              <span className="text-[9px] font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                {count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div
                        className="absolute z-50 pointer-events-none"
                        style={{
                          bottom: `calc(${barHeightPct}% + 28px)`,
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="bg-[#0b101b]/98 border border-[#D4AF37]/50 rounded-xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl min-w-[170px]">
                          <div className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold mb-1.5">
                            {FLOOR_TERMINOLOGY[fd.floor]?.display || `Floor ${fd.floor}`}
                          </div>
                          <div className="h-[1px] bg-white/10 mb-2" />
                          
                          {SEGMENTS.map(seg => {
                            const val = fd[seg.key];
                            return (
                              <div key={seg.key} className="flex items-center justify-between gap-4 py-[2.5px]">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: seg.color }}
                                  />
                                  <span className="text-[11px] text-white/70">{seg.label}</span>
                                </div>
                                <span className="text-[11px] font-mono font-semibold text-white">
                                  {val}
                                </span>
                              </div>
                            );
                          })}

                          <div className="h-[1px] bg-white/10 mt-2 mb-1.5" />
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Total Units</span>
                            <span className="text-xs font-mono font-bold text-[#D4AF37]">{fd.total}</span>
                          </div>
                        </div>
                        {/* Tooltip Downward Caret */}
                        <div className="w-2.5 h-2.5 bg-[#0b101b] border-b border-r border-[#D4AF37]/50 rotate-45 mx-auto -mt-1.5 shadow-[2px_2px_4px_rgba(0,0,0,0.5)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-Axis Floor Indicator Labels */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1 sm:px-2 gap-1.5 sm:gap-3">
              {floorData.map(fd => (
                <div
                  key={fd.floor}
                  className={`flex-1 text-center text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200 cursor-pointer ${
                    hoveredFloor === fd.floor
                      ? 'text-[#D4AF37] font-semibold'
                      : 'text-white/40 group-hover:text-white/70'
                  }`}
                  onClick={() => onSelectFloor?.(fd.floor)}
                >
                  {FLOOR_TERMINOLOGY[fd.floor]?.short || `${fd.floor.toString().padStart(2, '0')}F`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Status Color Legend ── */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-14 flex-wrap">
          {SEGMENTS.map(seg => (
            <div key={seg.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-[2px]"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Editorial Footer ── */}
      <div className="flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-3">
        <span>BALMANDAISA  ·  SALES GALLERY</span>
        <span>CONTINUOUS CINEMATIC LOOP</span>
      </div>
    </div>
  );
};
