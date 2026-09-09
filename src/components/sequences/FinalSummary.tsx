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

// Translucent Architectural Glass Palette (65–80% opacity with edge definitions)
const SEGMENTS = [
  {
    key: 'available' as const,
    label: 'Available',
    fill: 'rgba(30, 107, 82, 0.78)',
    border: 'rgba(61, 163, 130, 0.50)',
    hoverFill: 'rgba(36, 125, 94, 0.92)',
    hoverBorder: 'rgba(74, 186, 150, 0.75)',
    textClass: 'text-[#3da382]',
    legendFill: 'rgba(30, 107, 82, 0.85)',
    legendBorder: 'border-[#3da382]/50',
  },
  {
    key: 'booked' as const,
    label: 'Booked',
    fill: 'rgba(122, 31, 51, 0.72)',
    border: 'rgba(184, 79, 103, 0.45)',
    hoverFill: 'rgba(143, 38, 61, 0.88)',
    hoverBorder: 'rgba(206, 92, 118, 0.70)',
    textClass: 'text-[#b84f67]',
    legendFill: 'rgba(122, 31, 51, 0.85)',
    legendBorder: 'border-[#b84f67]/50',
  },
  {
    key: 'blocked' as const,
    label: 'Blocked',
    fill: 'rgba(158, 120, 47, 0.68)',
    border: 'rgba(197, 158, 75, 0.40)',
    hoverFill: 'rgba(179, 137, 56, 0.85)',
    hoverBorder: 'rgba(219, 177, 89, 0.65)',
    textClass: 'text-[#c59e4b]',
    legendFill: 'rgba(158, 120, 47, 0.80)',
    legendBorder: 'border-[#c59e4b]/50',
  },
  {
    key: 'loBlocked' as const,
    label: 'LO-Blocked',
    fill: 'rgba(138, 67, 37, 0.68)',
    border: 'rgba(184, 106, 71, 0.40)',
    hoverFill: 'rgba(158, 78, 44, 0.85)',
    hoverBorder: 'rgba(206, 120, 81, 0.65)',
    textClass: 'text-[#b86a47]',
    legendFill: 'rgba(138, 67, 37, 0.80)',
    legendBorder: 'border-[#b86a47]/50',
  },
  {
    key: 'notForSale' as const,
    label: 'NFS',
    fill: 'rgba(60, 74, 92, 0.60)',
    border: 'rgba(107, 125, 148, 0.35)',
    hoverFill: 'rgba(74, 91, 112, 0.78)',
    hoverBorder: 'rgba(127, 147, 173, 0.55)',
    textClass: 'text-[#6b7d94]',
    legendFill: 'rgba(60, 74, 92, 0.75)',
    legendBorder: 'border-[#6b7d94]/50',
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
    const step = maxUnits <= 12 ? 3 : maxUnits <= 20 ? 4 : 5;
    const ticks: number[] = [];
    for (let i = 0; i <= maxUnits; i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [maxUnits]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
      
      {/* ── Top Header: Logo + Title + Executive Summary Strip ── */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-baseline justify-between border-b border-white/[0.08] pb-4 gap-4">
        <div className="flex items-center gap-5">
          <div className="relative h-9 w-32 flex-shrink-0">
            <Image
              src="/branding/balmandaisa-logo.png"
              alt="Balmandaisa by DAC"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-7 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[9px] tracking-[0.35em] text-[#c5a869] font-mono font-medium uppercase">
              Project Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white/95">
              Availability Matrix
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
            <span className="text-[#3da382] uppercase text-[9px] font-sans font-medium">Available</span>
            <span className="text-lg font-light text-[#3da382]">
              <AnimatedCounter value={overallStats.available} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#b84f67] uppercase text-[9px] font-sans font-medium">Booked</span>
            <span className="text-lg font-light text-[#b84f67]">
              <AnimatedCounter value={overallStats.booked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#c59e4b] uppercase text-[9px] font-sans font-medium">Blocked</span>
            <span className="text-lg font-light text-[#c59e4b]">
              <AnimatedCounter value={overallStats.blocked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#b86a47] uppercase text-[9px] font-sans font-medium">LO-Blocked</span>
            <span className="text-lg font-light text-[#b86a47]">
              <AnimatedCounter value={overallStats.loBlocked} />
            </span>
          </div>
          <span className="text-white/10">/</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[#6b7d94] uppercase text-[9px] font-sans font-medium">NFS</span>
            <span className="text-lg font-light text-[#6b7d94]">
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

                    {/* Slim Refined Translucent Bar Container */}
                    <div
                      className={`w-full max-w-[28px] sm:max-w-[32px] md:max-w-[34px] rounded-t-[3px] overflow-hidden flex flex-col transition-all duration-200 border ${
                        isHovered
                          ? 'border-[#c5a869]/70 shadow-[0_0_12px_rgba(197,168,105,0.15)] ring-1 ring-[#c5a869]/30'
                          : 'border-white/[0.08]'
                      }`}
                      style={{
                        height: `${barHeightPct}%`,
                      }}
                    >
                      {/* Segments Stacked Inside as Translucent Layers (Top-to-Bottom: NFS, LO-Blocked, Blocked, Booked, Available) */}
                      {SEGMENTS.slice().reverse().map(seg => {
                        const count = fd[seg.key];
                        if (count <= 0 || fd.total <= 0) return null;
                        const segmentHeightPct = (count / fd.total) * 100;

                        return (
                          <div
                            key={seg.key}
                            className="w-full relative flex items-center justify-center transition-all duration-150 border-b border-black/30 first:border-b-0"
                            style={{
                              height: `${segmentHeightPct}%`,
                              backgroundColor: isHovered ? seg.hoverFill : seg.fill,
                              borderTop: `1px solid ${isHovered ? seg.hoverBorder : seg.border}`,
                            }}
                          >
                            {/* Segment value inside if sufficient vertical height */}
                            {segmentHeightPct >= 22 && (
                              <span className="text-[9px] font-mono font-medium text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
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
