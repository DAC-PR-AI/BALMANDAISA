'use client';

// ============================================================
// BALMANDAISA — Architectural Floor Plan Canvas (Optimized)
// ============================================================

import React, { useState, useEffect } from 'react';
import { Unit } from '@/types';
import { FLOOR_GEOMETRY, DUPLEX_TAGS_13 } from '@/data/floor-geometry';
import { UnitPin } from './UnitPin';

interface FloorPlanProps {
  floor: number;
  units: Unit[];
  allUnits?: Record<string, Unit>;
  selectedUnit?: Unit | null;
  onSelectUnit?: (unit: Unit) => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  floor,
  units,
  allUnits = {},
  selectedUnit,
  onSelectUnit,
}) => {
  const [imageError, setImageError] = useState(false);
  const geometry = FLOOR_GEOMETRY[String(floor)];

  useEffect(() => {
    setImageError(false);
  }, [floor]);

  const padFloor = floor.toString().padStart(2, '0');
  const webpSrc = `/floorplans/floor-${padFloor}.webp`;
  const pngSrc = `/floorplans/floor-${padFloor}.png`;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2">
      {/* 
        Exact aspect ratio matching the high-resolution architectural blueprints (4837x2444 ≈ 1.979:1).
      */}
      <div className="relative w-full max-w-[1520px] aspect-[4837/2444] bg-[#ffffff] rounded-lg shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Fast-Loading High-Fidelity WebP Blueprint with PNG Fallback */}
        {!imageError ? (
          <picture className="w-full h-full block">
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={pngSrc}
              alt={`Floor ${floor} Blueprint`}
              className="w-full h-full object-fill block select-none pointer-events-none"
              loading="eager"
              decoding="async"
              onError={() => setImageError(true)}
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-[#0a0d14] flex items-center justify-center">
            <span className="text-gray-600 text-xs tracking-widest uppercase font-mono">
              Floor {floor} blueprint loading...
            </span>
          </div>
        )}

        {/* Minimal Unit Coordinates Layer */}
        {geometry && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* Primary Floor Units */}
            {units.map(unit => {
              const pos = geometry.units[unit.id];
              if (!pos) return null;

              return (
                <div key={unit.id} className="pointer-events-auto">
                  <UnitPin
                    unit={unit}
                    xPct={pos.xpct}
                    yPct={pos.ypct}
                    isHighlighted={selectedUnit?.id === unit.id}
                    onSelect={onSelectUnit}
                  />
                </div>
              );
            })}

            {/* Duplex Upper Levels on Floor 13 */}
            {floor === 13 &&
              Object.entries(DUPLEX_TAGS_13).map(([duplexId, pos]) => {
                const duplexUnit = allUnits[duplexId] || {
                  id: duplexId,
                  floor: 12,
                  facing: 'NORTH',
                  type: '4BHK DUPLEX',
                  sizeLabel: 'DUPLEX UPPER LEVEL',
                  builtup: 2900,
                  totalCost: 0,
                  status: 'AVAILABLE',
                  isDuplex: true,
                };

                return (
                  <div key={`duplex-${duplexId}`} className="pointer-events-auto">
                    <UnitPin
                      unit={duplexUnit}
                      xPct={pos.xpct}
                      yPct={pos.ypct}
                      isDuplexUpper={true}
                      isHighlighted={selectedUnit?.id === duplexId}
                      onSelect={onSelectUnit}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
