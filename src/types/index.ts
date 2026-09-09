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
    color: '#c5a869',
    textColor: 'text-[#c5a869]',
    dotColor: 'bg-[#c5a869]',
    borderColor: 'border-[#c5a869]/60',
    bgBadge: 'bg-[#241e12]/95 text-[#e5cb89] border-[#c5a869]/70',
  },
  {
    key: 'BOOKED',
    statKey: 'booked',
    sheetName: 'BOOKED',
    color: '#881337',
    textColor: 'text-[#be185d]',
    dotColor: 'bg-[#881337]',
    borderColor: 'border-[#881337]/60',
    bgBadge: 'bg-[#280511]/95 text-[#fda4af] border-[#881337]/70',
  },
  {
    key: 'BLOCKED',
    statKey: 'blocked',
    sheetName: 'BLOCKED',
    color: '#92601a',
    textColor: 'text-[#c58a2f]',
    dotColor: 'bg-[#92601a]',
    borderColor: 'border-[#92601a]/60',
    bgBadge: 'bg-[#261705]/95 text-[#e0a248] border-[#92601a]/70',
  },
  {
    key: 'LO_BLOCKED',
    statKey: 'loBlocked',
    sheetName: 'LO-BLOCKED',
    color: '#7c2d12',
    textColor: 'text-[#ea580c]',
    dotColor: 'bg-[#7c2d12]',
    borderColor: 'border-[#7c2d12]/60',
    bgBadge: 'bg-[#200903]/95 text-[#ea580c] border-[#7c2d12]/70',
  },
  {
    key: 'NOT_FOR_SALE',
    statKey: 'notForSale',
    sheetName: 'NOT FOR SALE',
    color: '#334155',
    textColor: 'text-[#94a3b8]',
    dotColor: 'bg-[#475569]',
    borderColor: 'border-[#334155]/60',
    bgBadge: 'bg-[#0f172a]/95 text-[#94a3b8] border-[#334155]/60',
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
