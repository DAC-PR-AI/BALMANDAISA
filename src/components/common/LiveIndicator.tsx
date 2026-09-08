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
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        {isConnected ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        )}
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium tracking-wide text-gray-200">
          {isConnected ? 'LIVE SYNC' : 'OFFLINE MODE'}
        </span>
        {formattedTime && (
          <span
            suppressHydrationWarning
            className="text-[9px] text-gray-400 font-mono"
          >
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};
