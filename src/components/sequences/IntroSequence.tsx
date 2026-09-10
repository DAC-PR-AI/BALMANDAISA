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
      <div className="flex flex-col items-center text-center my-auto max-w-5xl mx-auto space-y-7">
        {/* Actual Project Brand Logo with refined luxury reveal */}
        <div className="relative h-32 sm:h-36 w-88 sm:w-[480px] md:w-[540px] transform transition-transform duration-1000 ease-out">
          <Image
            src="/branding/balmandaisa-logo.png"
            alt="Balmandaisa by DAC"
            fill
            className="object-contain filter drop-shadow-[0_4px_30px_rgba(197,168,105,0.45)]"
            priority
          />
        </div>

        <span className="text-sm sm:text-base md:text-lg tracking-[0.5em] text-[#c5a869] uppercase font-mono mt-3 block font-bold">
          A SIGNATURE RESIDENTIAL ADDRESS
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl font-light italic text-white/80 max-w-2xl leading-relaxed font-serif">
          Thirteen residential levels of contemporary architectural luxury.
        </p>

        {/* Minimal Typographic Stats Line */}
        <div className="flex items-center justify-center gap-10 sm:gap-16 lg:gap-20 pt-8 text-sm sm:text-base font-mono tracking-widest text-white/70 border-t-2 border-white/15 w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-mono mb-1">13</span>
            <span className="text-xs sm:text-sm tracking-[0.25em] text-white/50 uppercase font-semibold">Floors</span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-mono mb-1">
              <AnimatedCounter value={overallStats.total} />
            </span>
            <span className="text-xs sm:text-sm tracking-[0.25em] text-white/50 uppercase font-semibold">Residences</span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-emerald-400 font-mono mb-1">
              <AnimatedCounter value={overallStats.available} />
            </span>
            <span className="text-xs sm:text-sm tracking-[0.25em] text-emerald-400/80 uppercase font-semibold">Available</span>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Hint */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-white/40 tracking-[0.25em] uppercase border-t border-white/10 pt-3 font-mono">
        <span>ARCHITECTURAL PRESENTATION</span>
        <span>STARTING AUTOMATED SHOWCASE</span>
      </div>
    </div>
  );
};
