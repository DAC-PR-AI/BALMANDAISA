'use client';

// ============================================================
// BALMANDAISA — Modern Translucent Architectural Availability Matrix
// Semi-Transparent Layered Glass · Slim Refined Columns · Executive Hierarchy
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

// Modern Translucent Architectural Glass Palette — Champagne Gold & Bordeaux
const SEGMENTS = [
  {
    key: 'available' as const,
    label: 'Available',
    fill: 'rgba(197, 168, 105, 0.38)',
    border: 'rgba(212, 175, 55, 0.75)',
    hoverFill: 'rgba(197, 168, 105, 0.62)',
    hoverBorder: 'rgba(240, 215, 140, 0.95)',
    textClass: 'text-[#c5a869]',
    legendFill: 'rgba(197, 168, 105, 0.45)',
    legendBorder: 'border-[#c5a869]/70',
  },
  {
    key: 'booked' as const,
    label: 'Booked',
    fill: 'rgba(136, 19, 55, 0.42)',
    border: 'rgba(190, 24, 93, 0.70)',
    hoverFill: 'rgba(159, 18, 57, 0.65)',
    hoverBorder: 'rgba(244, 63, 94, 0.90)',
    textClass: 'text-[#be185d]',
    legendFill: 'rgba(136, 19, 55, 0.48)',
    legendBorder: 'border-[#be185d]/70',
  },
  {
    key: 'blocked' as const,
    label: 'Blocked',
    fill: 'rgba(146, 96, 26, 0.38)',
    border: 'rgba(197, 138, 47, 0.70)',
    hoverFill: 'rgba(180, 115, 27, 0.62)',
    hoverBorder: 'rgba(230, 165, 60, 0.90)',
    textClass: 'text-[#c58a2f]',
    legendFill: 'rgba(146, 96, 26, 0.45)',
    legendBorder: 'border-[#c58a2f]/70',
  },
  {
    key: 'loBlocked' as const,
    label: 'LO-Blocked',
    fill: 'rgba(124, 45, 18, 0.38)',
    border: 'rgba(194, 65, 12, 0.70)',
    hoverFill: 'rgba(154, 52, 18, 0.62)',
    hoverBorder: 'rgba(234, 88, 12, 0.88)',
    textClass: 'text-[#ea580c]',
    legendFill: 'rgba(124, 45, 18, 0.45)',
    legendBorder: 'border-[#ea580c]/70',
  },
  {
    key: 'notForSale' as const,
    label: 'NFS',
    fill: 'rgba(51, 65, 85, 0.30)',
    border: 'rgba(100, 116, 139, 0.55)',
    hoverFill: 'rgba(71, 85, 105, 0.52)',
    hoverBorder: 'rgba(148, 163, 184, 0.80)',
    textClass: 'text-[#94a3b8]',
    legendFill: 'rgba(51, 65, 85, 0.38)',
    legendBorder: 'border-[#94a3b8]/60',
  },
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
    const duration = 750;

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

  // Max units for Y-axis scaling
  const maxUnits = useMemo(() => {
    const highest = Math.max(...floorData.map(d => d.total), 1);
    return Math.max(Math.ceil(highest / 4) * 4, 16);
  }, [floorData]);

  // Development Data Sync Validation
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
    const step = maxUnits <= 16 ? 4 : maxUnits <= 24 ? 6 : 8;
    const ticks: number[] = [];
    for (let i = 0; i <= maxUnits; i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [maxUnits]);

  // Active hover summary data
  const activeHoverData = useMemo(() => {
    if (hoveredFloor === null) return null;
    return floorData.find(d => d.floor === hoveredFloor) || null;
  }, [hoveredFloor, floorData]);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[#040608] text-white select-none overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(197, 168, 105, 0.08), transparent 70%)',
        }}
      />

      {/* ── Top Header Bar: Luxury Title + Executive Stats ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
        {/* Project Branding */}
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-36 flex-shrink-0">
            <Image
              src="/branding/balmandaisa-logo.png"
              alt="Balmandaisa by DAC"
              fill
              className="object-contain"
              sizes="144px"
              priority
            />
          </div>
          <div className="h-7 w-[1px] bg-white/15 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#c5a869] uppercase font-semibold">
                Live Availability Matrix
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide text-white font-sans mt-0.5">
              Tower Inventory Summary
            </h2>
          </div>
        </div>

        {/* Executive KPI Summary Row */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 text-xs font-mono tracking-wider flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-white/35 uppercase text-[9px] font-sans">Total</span>
            <span className="text-lg font-light text-white">
              <AnimatedCounter value={overallStats.total} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#c5a869] uppercase text-[9px] font-sans font-medium">Available</span>
            <span className="text-lg font-light text-[#c5a869]">
              <AnimatedCounter value={overallStats.available} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#be185d] uppercase text-[9px] font-sans font-medium">Booked</span>
            <span className="text-lg font-light text-[#be185d]">
              <AnimatedCounter value={overallStats.booked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#c58a2f] uppercase text-[9px] font-sans font-medium">Blocked</span>
            <span className="text-lg font-light text-[#c58a2f]">
              <AnimatedCounter value={overallStats.blocked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#ea580c] uppercase text-[9px] font-sans font-medium">LO-Blocked</span>
            <span className="text-lg font-light text-[#ea580c]">
              <AnimatedCounter value={overallStats.loBlocked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#94a3b8] uppercase text-[9px] font-sans font-medium">NFS</span>
            <span className="text-lg font-light text-[#94a3b8]">
              <AnimatedCounter value={overallStats.notForSale} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Dev Mode Data Sync Alert (if any inconsistency detected) ── */}
      {validationIssues.length > 0 && process.env.NODE_ENV === 'development' && (
        <div className="my-2 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[10px] font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <span>Data Sync Issue: {validationIssues[0]}</span>
        </div>
      )}

      {/* ── Center Section: Slim Modern Translucent Architectural Stacked Chart ── */}
      <div className="flex-1 flex flex-col justify-center my-auto py-3">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/35 uppercase">
            Total Units by Floor
          </span>
        </div>

        {/* Main Chart Canvas Container */}
        <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[330px] flex">
          
          {/* Y-Axis Scale */}
          <div className="relative h-full flex flex-col justify-between pr-3 py-0 text-right select-none" style={{ minWidth: '30px' }}>
            {yTicks.slice().reverse().map(tick => (
              <span key={tick} className="text-[9px] font-mono text-white/30 leading-none">
                {tick}
              </span>
            ))}
          </div>

          {/* Chart Grid & Translucent Bars Body */}
          <div className="relative flex-1 h-full border-l border-b border-white/[0.08]">
            
            {/* Horizontal Gridlines (Ultra-Subtle) */}
            {yTicks.map(tick => (
              <div
                key={tick}
                className="absolute w-full border-t border-white/[0.03] pointer-events-none"
                style={{ bottom: `${(tick / maxUnits) * 100}%` }}
              />
            ))}

            {/* 13 Refined Slim Stacked Bars with Generous Breathing Room */}
            <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-4 md:px-6 gap-2 sm:gap-3 md:gap-4">
              {floorData.map(fd => {
                const isHovered = hoveredFloor === fd.floor;
                const isAnyHovered = hoveredFloor !== null;
                const isDimmed = isAnyHovered && !isHovered;
                const barHeightPct = fd.total > 0 ? (fd.total / maxUnits) * 100 * animProgress : 0;

                return (
                  <div
                    key={fd.floor}
                    className={`relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer transition-opacity duration-200 ${
                      isDimmed ? 'opacity-30' : 'opacity-100'
                    }`}
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
                        className={`text-[10px] sm:text-[11px] font-mono font-medium transition-colors duration-200 ${
                          isHovered ? 'text-[#D4AF37] font-bold' : 'text-white/45'
                        }`}
                      >
                        {fd.total}
                      </span>
                    </div>

                    {/* Slim Refined Translucent Architectural Glass Bar Container */}
                    <div
                      className={`w-full max-w-[28px] sm:max-w-[32px] md:max-w-[34px] rounded-t-[4px] overflow-hidden flex flex-col transition-all duration-200 border backdrop-blur-md relative ${
                        isHovered
                          ? 'border-[#c5a869]/80 shadow-[0_0_16px_rgba(197,168,105,0.25)] ring-1 ring-[#c5a869]/40 bg-white/[0.04]'
                          : 'border-white/15 bg-white/[0.02] shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                      }`}
                      style={{
                        height: `${barHeightPct}%`,
                      }}
                    >
                      {/* Architectural Glass Reflection Sheen */}
                      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/[0.08] to-transparent pointer-events-none z-10" />

                      {/* Segments Stacked Inside as Translucent Architectural Layers (Top-to-Bottom: NFS, LO-Blocked, Blocked, Booked, Available) */}
                      {SEGMENTS.slice().reverse().map(seg => {
                        const count = fd[seg.key];
                        if (count <= 0 || fd.total <= 0) return null;
                        const segmentHeightPct = (count / fd.total) * 100;

                        return (
                          <div
                            key={seg.key}
                            className="w-full relative flex items-center justify-center transition-all duration-150 border-b border-black/40 first:border-b-0"
                            style={{
                              height: `${segmentHeightPct}%`,
                              backgroundColor: isHovered ? seg.hoverFill : seg.fill,
                              borderTop: `1px solid ${isHovered ? seg.hoverBorder : seg.border}`,
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                            }}
                          >
                            {/* Segment value inside if sufficient vertical height */}
                            {segmentHeightPct >= 22 && (
                              <span className="text-[9px] font-mono font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] relative z-20">
                                {count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Clean Dark Glass Tooltip */}
                    {isHovered && (
                      <div
                        className="absolute z-50 pointer-events-none"
                        style={{
                          bottom: `calc(${barHeightPct}% + 26px)`,
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="bg-[#080c14]/98 border border-white/15 rounded-xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl min-w-[170px]">
                          <div className="text-[10px] tracking-[0.2em] text-[#c5a869] uppercase font-mono font-medium mb-1.5">
                            {FLOOR_TERMINOLOGY[fd.floor]?.display || `Floor ${fd.floor}`}
                          </div>
                          <div className="h-[1px] bg-white/[0.08] mb-2" />
                          
                          {SEGMENTS.map(seg => {
                            const val = fd[seg.key];
                            return (
                              <div key={seg.key} className="flex items-center justify-between gap-4 py-[2px]">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-[9px] h-[9px] rounded-[2px] flex-shrink-0"
                                    style={{
                                      backgroundColor: seg.fill,
                                      border: `1px solid ${seg.border}`,
                                    }}
                                  />
                                  <span className="text-[11px] font-sans text-white/70">{seg.label}</span>
                                </div>
                                <span className="text-[11px] font-mono font-medium text-white">
                                  {val}
                                </span>
                              </div>
                            );
                          })}

                          <div className="h-[1px] bg-white/[0.08] mt-2 mb-1.5" />
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[10px] text-white/40 uppercase font-sans tracking-wider">Total</span>
                            <span className="text-xs font-mono font-bold text-[#c5a869]">{fd.total}</span>
                          </div>
                        </div>
                        {/* Tooltip Downward Caret */}
                        <div className="w-2.5 h-2.5 bg-[#080c14] border-b border-r border-white/15 rotate-45 mx-auto -mt-1.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-Axis Floor Indicator Labels */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2 sm:px-4 md:px-6 gap-2 sm:gap-3 md:gap-4">
              {floorData.map(fd => (
                <div
                  key={fd.floor}
                  className={`flex-1 text-center text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors duration-200 cursor-pointer ${
                    hoveredFloor === fd.floor
                      ? 'text-[#c5a869] font-bold'
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

        {/* ── Translucent Legend (13px Rounded Square Indicators with Matching Depth) ── */}
        <div className="flex items-center justify-center gap-7 sm:gap-11 mt-14 flex-wrap">
          {SEGMENTS.map(seg => (
            <div key={seg.key} className="flex items-center gap-3">
              <span
                className={`w-[13px] h-[13px] rounded-[3px] flex-shrink-0 shadow-sm border ${seg.legendBorder}`}
                style={{ backgroundColor: seg.legendFill }}
              />
              <span className="text-xs font-sans text-white/80 font-normal tracking-wide">
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Editorial Footer ── */}
      <div className="flex items-center justify-between text-[10px] text-white/25 tracking-[0.25em] uppercase border-t border-white/[0.06] pt-3">
        <span>BALMANDAISA  ·  SALES GALLERY</span>
        <span>CONTINUOUS CINEMATIC LOOP</span>
      </div>
    </div>
  );
};
