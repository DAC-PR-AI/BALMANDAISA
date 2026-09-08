'use client';

// ============================================================
// BALMANDAISA — Cinematic Opening with Premium Logo Reveal
// ============================================================

import React from 'react';
import Image from 'next/image';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface IntroSequenceProps {
  onSkip?: () => void;
  overallStats: {
    total: number;
    available: number;
    booked: number;
    blocked: number;
    notForSale: number;
  };
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  overallStats,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-12 select-none">
      {/* Top subtle developer attribution */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.35em] text-white/40 uppercase">
        <div className="flex items-center gap-3">
          <div className="relative h-5 w-16 opacity-70">
            <Image
              src="/branding/dac-logo.png"
              alt="DAC Developers"
              fill
              className="object-contain"
            />
          </div>
          <span>PRESENTS</span>
        </div>
        <span>LIVE AVAILABILITY SHOWCASE</span>
      </div>

      {/* Center Grand Architectural Identity & Project Logo */}
      <div className="flex flex-col items-center text-center my-auto max-w-4xl mx-auto space-y-6">
        {/* Actual Project Brand Logo with refined luxury reveal */}
        <div className="relative h-28 w-80 sm:w-96 md:w-[440px] transform transition-transform duration-1000 ease-out">
          <Image
            src="/branding/balmandaisa-logo.png"
            alt="Balmandaisa by DAC"
            fill
            className="object-contain filter drop-shadow-[0_4px_25px_rgba(197,168,105,0.35)]"
            priority
          />
        </div>

        <span className="text-xs tracking-[0.5em] text-[#c5a869] uppercase font-mono mt-2 block">
          A SIGNATURE RESIDENTIAL ADDRESS
        </span>

        <p className="text-lg sm:text-xl font-light italic text-white/60 max-w-xl leading-relaxed">
          Thirteen residential levels of contemporary architectural luxury.
        </p>

        {/* Minimal Typographic Stats Line */}
        <div className="flex items-center justify-center gap-8 sm:gap-14 pt-8 text-xs font-mono tracking-widest text-white/60 border-t border-white/10 w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-light text-white font-mono mb-1">13</span>
            <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Floors</span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-light text-white font-mono mb-1">
              <AnimatedCounter value={overallStats.total} />
            </span>
            <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Residences</span>
          </div>
          <span className="text-white/15">/</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-light text-emerald-400 font-mono mb-1">
              <AnimatedCounter value={overallStats.available} />
            </span>
            <span className="text-[10px] tracking-[0.25em] text-emerald-400/70 uppercase">Available</span>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Hint */}
      <div className="flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-3">
        <span>ARCHITECTURAL PRESENTATION</span>
        <span>STARTING AUTOMATED SHOWCASE</span>
      </div>
    </div>
  );
};
