// ============================================================
// BALMANDAISA — Core Type Definitions
// ============================================================

/** Possible availability statuses for a unit matching exact Google Sheet categories */
export type UnitStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'LO_BLOCKED' | 'NOT_FOR_SALE';

/** Normalized status from raw sheet text */
export function normalizeStatus(raw: string): UnitStatus {
  const s = (raw || '').trim().toUpperCase();
  if (s === 'AVAILABLE' || s === 'AVL') return 'AVAILABLE';
  if (s === 'BOOKED' || s === 'SOLD') return 'BOOKED';
  if (s === 'LO-BLOCKED' || s === 'LO_BLOCKED' || s === 'LO BLOCKED') return 'LO_BLOCKED';
  if (s.includes('BLOCK')) return 'BLOCKED';
  return 'NOT_FOR_SALE';
}

/** Canonical 5 Availability Splits matching the Google Sheet exactly */
export interface AvailabilitySplitConfig {
  key: UnitStatus;
  statKey: 'available' | 'booked' | 'blocked' | 'loBlocked' | 'notForSale';
  sheetName: string;
  color: string;
  textColor: string;
  dotColor: string;
  borderColor: string;
  bgBadge: string;
}

export const AVAILABILITY_SPLITS: AvailabilitySplitConfig[] = [
  {
    key: 'AVAILABLE',
    statKey: 'available',
    sheetName: 'AVAILABLE',
    color: '#1e6b52',
    textColor: 'text-[#3da382]',
    dotColor: 'bg-[#1e6b52]',
    borderColor: 'border-[#1e6b52]/50',
    bgBadge: 'bg-[#0a231b]/95 text-[#3da382] border-[#1e6b52]/70',
  },
  {
    key: 'BOOKED',
    statKey: 'booked',
    sheetName: 'BOOKED',
    color: '#7a1f33',
    textColor: 'text-[#b84f67]',
    dotColor: 'bg-[#7a1f33]',
    borderColor: 'border-[#7a1f33]/50',
    bgBadge: 'bg-[#220a11]/95 text-[#b84f67] border-[#7a1f33]/70',
  },
  {
    key: 'BLOCKED',
    statKey: 'blocked',
    sheetName: 'BLOCKED',
    color: '#9e782f',
    textColor: 'text-[#c59e4b]',
    dotColor: 'bg-[#9e782f]',
    borderColor: 'border-[#9e782f]/50',
    bgBadge: 'bg-[#201809]/95 text-[#c59e4b] border-[#9e782f]/70',
  },
  {
    key: 'LO_BLOCKED',
    statKey: 'loBlocked',
    sheetName: 'LO-BLOCKED',
    color: '#8a4325',
    textColor: 'text-[#b86a47]',
    dotColor: 'bg-[#8a4325]',
    borderColor: 'border-[#8a4325]/50',
    bgBadge: 'bg-[#1e0e07]/95 text-[#b86a47] border-[#8a4325]/70',
  },
  {
    key: 'NOT_FOR_SALE',
    statKey: 'notForSale',
    sheetName: 'NOT FOR SALE',
    color: '#3c4a5c',
    textColor: 'text-[#6b7d94]',
    dotColor: 'bg-[#3c4a5c]',
    borderColor: 'border-[#3c4a5c]/50',
    bgBadge: 'bg-[#0e1218]/95 text-[#6b7d94] border-[#3c4a5c]/60',
  },
];

/** Standardized Premium Floor Navigation Terminology */
export const FLOOR_TERMINOLOGY: Record<number | string, { short: string; full: string; display: string }> = {
  13: { short: '13F', full: 'THIRTEENTH FLOOR', display: '13F — THIRTEENTH FLOOR' },
  12: { short: '12F', full: 'TWELFTH FLOOR', display: '12F — TWELFTH FLOOR' },
  11: { short: '11F', full: 'ELEVENTH FLOOR', display: '11F — ELEVENTH FLOOR' },
  10: { short: '10F', full: 'TENTH FLOOR', display: '10F — TENTH FLOOR' },
  9:  { short: '09F', full: 'NINTH FLOOR', display: '09F — NINTH FLOOR' },
  8:  { short: '08F', full: 'EIGHTH FLOOR', display: '08F — EIGHTH FLOOR' },
  7:  { short: '07F', full: 'SEVENTH FLOOR', display: '07F — SEVENTH FLOOR' },
  6:  { short: '06F', full: 'SIXTH FLOOR', display: '06F — SIXTH FLOOR' },
  5:  { short: '05F', full: 'FIFTH FLOOR', display: '05F — FIFTH FLOOR' },
  4:  { short: '04F', full: 'FOURTH FLOOR', display: '04F — FOURTH FLOOR' },
  3:  { short: '03F', full: 'THIRD FLOOR', display: '03F — THIRD FLOOR' },
  2:  { short: '02F', full: 'SECOND FLOOR', display: '02F — SECOND FLOOR' },
  1:  { short: '01F', full: 'FIRST FLOOR', display: '01F — FIRST FLOOR' },
  0:  { short: 'GF', full: 'GROUND FLOOR', display: 'GF — GROUND FLOOR' },
  'BG': { short: 'B+G', full: 'BASEMENT + GROUND', display: 'B+G — BASEMENT + GROUND' },
};

/** A single residential unit */
export interface Unit {
  id: string;          // e.g. "101", "1201"
  floor: number;       // 1–13
  facing: string;      // NORTH, SOUTH, EAST, WEST
  type: string;        // "3BHK+3T", "4BHK+4T DUPLEX", etc.
  sizeLabel: string;   // "1647 SQ.FT" (display text)
  builtup: number;     // numeric sqft
  totalCost: number;   // price in ₹
  status: UnitStatus;
  uds?: number;        // undivided share sqft
  terrace?: number;    // private terrace sqft
  carpark?: string;    // car park type
  isDuplex: boolean;
}

/** Pin position on a floor plan (percentage-based) */
export interface PinPosition {
  xpct: number;
  ypct: number;
}

/** Geometry for a single floor */
export interface FloorGeometry {
  planKey: string;                        // image key, e.g. "p1"
  units: Record<string, PinPosition>;     // unitId -> position
}

/** Floor-level summary */
export interface FloorSummary {
  floor: number;
  total: number;
  available: number;
  booked: number;
  blocked: number;
  loBlocked: number;
  notForSale: number;
}

/** Presentation phase */
export type PresentationPhase =
  | 'LOADING'
  | 'INTRO'
  | 'ELEVATION_REVEAL'
  | 'FLOOR_PRESENTATION'
  | 'FLOOR_TRANSITION'
  | 'SUMMARY';

/** Presentation state */
export interface PresentationState {
  phase: PresentationPhase;
  currentFloor: number;         // 1–13 (relevant during FLOOR_PRESENTATION / FLOOR_TRANSITION)
  isPaused: boolean;
  progress: number;             // 0–1 within current phase
}

/** Availability data change */
export interface AvailabilityChange {
  unitId: string;
  oldStatus: UnitStatus;
  newStatus: UnitStatus;
  timestamp: number;
}

/** Availability state from the hook */
export interface AvailabilityState {
  units: Record<string, Unit>;
  lastUpdated: Date | null;
  isConnected: boolean;
  isLoading: boolean;
  changes: AvailabilityChange[];
}
