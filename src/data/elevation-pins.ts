// ============================================================
// BALMANDAISA — Elevation Pin Positions
// ============================================================
// Floor indicator positions on the building elevation image.
// Ported from existing app's FLOORPINS_FULL.

import { PinPosition } from '@/types';

/** Floor pins on the full-screen building elevation */
export const ELEVATION_PINS_FULL: Record<string, PinPosition> = {
  '13': { xpct: 60.842, ypct: 44.519 },
  '12': { xpct: 60.842, ypct: 48.206 },
  '11': { xpct: 60.842, ypct: 51.892 },
  '10': { xpct: 60.842, ypct: 55.579 },
  '9':  { xpct: 60.842, ypct: 59.265 },
  '8':  { xpct: 60.842, ypct: 62.952 },
  '7':  { xpct: 60.842, ypct: 66.639 },
  '6':  { xpct: 60.842, ypct: 70.325 },
  '5':  { xpct: 60.842, ypct: 74.012 },
  '4':  { xpct: 60.842, ypct: 77.698 },
  '3':  { xpct: 60.842, ypct: 81.385 },
  '2':  { xpct: 60.842, ypct: 85.072 },
  '1':  { xpct: 60.842, ypct: 88.758 },
};

/** Floor pins on the sidebar navigation elevation */
export const ELEVATION_PINS_NAV: Record<string, PinPosition> = {
  '13': { xpct: 77.778, ypct: 33.969 },
  '12': { xpct: 77.778, ypct: 38.995 },
  '11': { xpct: 77.778, ypct: 44.020 },
  '10': { xpct: 77.778, ypct: 49.046 },
  '9':  { xpct: 77.778, ypct: 54.071 },
  '8':  { xpct: 77.778, ypct: 59.097 },
  '7':  { xpct: 77.778, ypct: 64.122 },
  '6':  { xpct: 77.778, ypct: 69.148 },
  '5':  { xpct: 77.778, ypct: 74.173 },
  '4':  { xpct: 77.778, ypct: 79.198 },
  '3':  { xpct: 77.778, ypct: 84.224 },
  '2':  { xpct: 77.778, ypct: 89.249 },
  '1':  { xpct: 77.778, ypct: 94.275 },
};

export const ELEVATION_PINS = ELEVATION_PINS_FULL;
