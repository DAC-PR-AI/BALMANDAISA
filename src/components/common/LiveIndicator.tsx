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
    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-md">
      <span className="relative flex h-3 w-3">
        {isConnected ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        )}
      </span>
      <div className="flex flex-col">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-100">
          {isConnected ? 'LIVE SYNC' : 'OFFLINE MODE'}
        </span>
        {formattedTime && (
          <span
            suppressHydrationWarning
            className="text-[10px] sm:text-xs text-gray-300 font-mono"
          >
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};
