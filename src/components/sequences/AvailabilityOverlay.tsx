'use client';

// ============================================================
// BALMANDAISA — Full-Screen Cinematic Luxury Celebration &
// Opportunity Experience (Zero Technical Boxed Modals)
// ============================================================

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AvailabilityChange, Unit } from '@/types';

interface AvailabilityOverlayProps {
  changes: AvailabilityChange[];
  units?: Record<string, Unit>;
  onDismiss?: () => void;
}

// Particle specs for subtle luxury golden/crimson/emerald embers
const PARTICLES = [
  { left: '15%', top: '65%', size: 4, delay: '0s', dur: '3.2s' },
  { left: '25%', top: '75%', size: 3, delay: '0.6s', dur: '4s' },
  { left: '35%', top: '60%', size: 5, delay: '1.2s', dur: '3.6s' },
  { left: '50%', top: '80%', size: 3, delay: '0.3s', dur: '3.8s' },
  { left: '65%', top: '70%', size: 4, delay: '0.9s', dur: '4.2s' },
  { left: '75%', top: '65%', size: 3, delay: '1.5s', dur: '3.4s' },
  { left: '85%', top: '75%', size: 5, delay: '0.4s', dur: '4.1s' },
  { left: '20%', top: '35%', size: 3, delay: '0.8s', dur: '3.5s' },
  { left: '80%', top: '30%', size: 4, delay: '1.1s', dur: '3.9s' },
];

export const AvailabilityOverlay: React.FC<AvailabilityOverlayProps> = ({
  changes,
  units = {},
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);

  // Take the most recent change event
  const activeChange = changes && changes.length > 0 ? changes[0] : null;

  // 3.4-second auto-dismiss timer with smooth return to dashboard
  useEffect(() => {
    if (!activeChange) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const startTime = Date.now();
    const duration = 3400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [activeChange]);

  if (!activeChange) return null;

  const unitDetails = units[activeChange.unitId];
  const isBooked = activeChange.newStatus === 'BOOKED';
  const isAvailable = activeChange.newStatus === 'AVAILABLE';

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center p-8 sm:p-12 bg-[#020408]/92 backdrop-blur-2xl cursor-pointer select-none overflow-hidden transition-all duration-700 animate-in fade-in"
      onClick={onDismiss}
    >
      {/* ── Ambient Radial Atmosphere (Ruby / Emerald / Gold) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isBooked
            ? 'radial-gradient(circle at 50% 50%, rgba(190, 24, 58, 0.16) 0%, rgba(197, 168, 105, 0.06) 35%, transparent 70%)'
            : isAvailable
            ? 'radial-gradient(circle at 50% 50%, rgba(46, 158, 108, 0.18) 0%, rgba(56, 181, 125, 0.06) 35%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(196, 121, 23, 0.16) 0%, transparent 70%)',
        }}
      />

      {/* Floating Ambient Light Embers */}
      {PARTICLES.map((p, idx) => (
        <span
          key={idx}
          className="absolute rounded-full pointer-events-none particle-float"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: isBooked ? '#be183a' : isAvailable ? '#2e9e6c' : '#D4AF37',
            boxShadow: `0 0 10px ${isBooked ? '#be183a' : isAvailable ? '#2e9e6c' : '#D4AF37'}`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}

      {/* Light Streak Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="w-[200%] h-[300px] absolute -top-[50px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent light-beam-sweep"
          style={{ transformOrigin: 'center' }}
        />
      </div>

      {/* ── Top Brand Watermark ── */}
      <div className="w-full flex items-center justify-between z-10 pointer-events-none border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative h-8 w-32">
            <Image
              src="/branding/balmandaisa-logo.png"
              alt="Balmandaisa by DAC"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#c5a869] uppercase font-medium">
            {isBooked ? 'Acquisition Announcement' : 'Inventory Release'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/50 uppercase">
          <span
            className={`w-2 h-2 rounded-full ${
              isBooked ? 'bg-[#be183a] shadow-[0_0_8px_rgba(190,24,58,0.8)]' : 'bg-[#2e9e6c] shadow-[0_0_8px_rgba(46,158,108,0.8)]'
            }`}
          />
          <span>Real-Time Sync</span>
        </div>
      </div>

      {/* ── Center Stage: The Unit Number as the Hero ── */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10 celebration-hero-enter">
        {/* Top Gold Star ✦ */}
        <div className="mb-4 sm:mb-6">
          <span className="text-3xl sm:text-4xl text-[#D4AF37] sparkle-twinkle inline-block select-none">
            ✦
          </span>
        </div>

        {/* Hero Unit Number */}
        <div className="relative">
          {/* Subtle Backglow behind unit text */}
          <div
            className="absolute inset-0 -inset-x-12 blur-3xl opacity-35 pointer-events-none celebration-glow-aura"
            style={{
              background: isBooked
                ? 'radial-gradient(circle, rgba(190,24,58,0.5) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(46,158,108,0.5) 0%, transparent 70%)',
            }}
          />
          <h1 className="relative text-6xl sm:text-8xl md:text-9xl font-light tracking-tight text-white font-serif uppercase drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
            UNIT <span className="font-semibold text-[#D4AF37] font-mono tracking-normal">{activeChange.unitId}</span>
          </h1>
        </div>

        {/* Status Line ✦ BOOKED ✦ or ✦ AVAILABLE ✦ */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4">
          <span className="text-xl sm:text-2xl text-[#D4AF37] select-none">✦</span>
          <span
            className={`text-2xl sm:text-4xl md:text-5xl font-mono font-extrabold tracking-[0.35em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] ${
              isBooked
                ? 'text-[#d42b4e] drop-shadow-[0_0_20px_rgba(190,24,58,0.5)]'
                : isAvailable
                ? 'text-[#38b57d] drop-shadow-[0_0_20px_rgba(46,158,108,0.5)]'
                : 'text-[#db8a22] drop-shadow-[0_0_20px_rgba(196,121,23,0.5)]'
            }`}
          >
            {isBooked ? 'BOOKED' : isAvailable ? 'AVAILABLE' : activeChange.newStatus.replace(/_/g, ' ')}
          </span>
          <span className="text-xl sm:text-2xl text-[#D4AF37] select-none">✦</span>
        </div>

        {/* Subtitle / Celebratory Phrase */}
        <p className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl text-[#c5a869] font-serif italic tracking-wide">
          {isBooked ? 'Congratulations!' : 'Now available for sale'}
        </p>

        {/* Optional Subtle Specification Line (Non-intrusive) */}
        {unitDetails && (
          <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono text-white/60 tracking-widest uppercase">
            <span>Floor {unitDetails.floor}</span>
            <span className="text-white/20">·</span>
            <span>{unitDetails.type}</span>
            <span className="text-white/20">·</span>
            <span>{unitDetails.sizeLabel || `${unitDetails.builtup} SQ.FT`}</span>
            {unitDetails.facing && (
              <>
                <span className="text-white/20">·</span>
                <span>{unitDetails.facing} Facing</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Auto-Dismiss Progress Bar & Hint ── */}
      <div className="w-full max-w-md flex flex-col items-center gap-2 z-10">
        <div className="w-full bg-white/10 h-[2px] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c5a869] via-[#D4AF37] to-[#c5a869] transition-all duration-75 ease-linear rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-mono tracking-[0.25em] text-white/35 uppercase">
          Returning to dashboard · Click anywhere to return
        </span>
      </div>
    </div>
  );
};
