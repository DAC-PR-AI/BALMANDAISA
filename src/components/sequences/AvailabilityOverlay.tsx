'use client';

// ============================================================
// BALMANDAISA — Live Availability Change Toast Overlay
// ============================================================

import React from 'react';
import { AvailabilityChange } from '@/types';

interface AvailabilityOverlayProps {
  changes: AvailabilityChange[];
}

export const AvailabilityOverlay: React.FC<AvailabilityOverlayProps> = ({ changes }) => {
  if (!changes || changes.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {changes.slice(0, 3).map((change, idx) => {
        const isBooked = change.newStatus === 'BOOKED';
        const isAvailable = change.newStatus === 'AVAILABLE';

        return (
          <div
            key={`${change.unitId}-${change.timestamp}-${idx}`}
            className="animate-in slide-in-from-right-5 fade-in duration-300 p-3.5 rounded-xl bg-[#0e1626]/95 border border-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-3"
          >
            <span
              className={`w-3 h-3 rounded-full flex-shrink-0 animate-ping ${
                isBooked ? 'bg-rose-500' : isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                Live Update: Unit {change.unitId}
              </span>
              <span className="text-[11px] text-[#D4AF37]">
                Status changed to <span className="font-bold">{change.newStatus}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
