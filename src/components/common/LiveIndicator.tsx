'use client';

// ============================================================
// BALMANDAISA — Live Sync Indicator Component
// ============================================================

import React, { useState, useEffect } from 'react';

interface LiveIndicatorProps {
  isConnected?: boolean;
  lastUpdated?: Date | null;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isConnected = true,
  lastUpdated = null,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedTime =
    mounted && lastUpdated
      ? lastUpdated.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : null;

  return (
    <div className="flex items-center gap-3.5 px-4 py-2 rounded-full bg-black/60 border-2 border-white/20 backdrop-blur-md shadow-lg">
      <span className="relative flex h-3.5 w-3.5">
        {isConnected ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
        )}
      </span>
      <div className="flex flex-col">
        <span className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-white">
          {isConnected ? 'LIVE SYNC' : 'OFFLINE MODE'}
        </span>
        {formattedTime && (
          <span
            suppressHydrationWarning
            className="text-xs sm:text-sm text-gray-300 font-mono font-medium"
          >
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};
