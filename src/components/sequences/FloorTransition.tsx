'use client';

// ============================================================
// BALMANDAISA — Minimal Floor Transition
// ============================================================

import React from 'react';

interface FloorTransitionProps {
  fromFloor: number;
  toFloor: number;
}

export const FloorTransition: React.FC<FloorTransitionProps> = ({
  toFloor,
}) => {
  const formattedFloor = toFloor.toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-12 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.35em] text-white/40 uppercase">
        <span>BALMANDAISA</span>
        <span>LEVEL SEQUENCE</span>
      </div>

      <div className="flex flex-col items-center text-center my-auto space-y-4">
        <span className="text-xs tracking-[0.4em] text-[#c5a869] uppercase font-mono">
          RESIDENTIAL LEVEL
        </span>

        <h2 className="text-7xl sm:text-8xl md:text-9xl font-light font-mono tracking-tighter text-white">
          {formattedFloor}
        </h2>

        <p className="text-sm font-light text-white/50 tracking-widest uppercase">
          Architectural Layout & Unit Matrix
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/30 tracking-[0.25em] uppercase border-t border-white/5 pt-3">
        <span>FLOOR PLAN TRANSITION</span>
        <span>INITIALIZING</span>
      </div>
    </div>
  );
};
