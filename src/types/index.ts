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
    color: '#10b981',
    textColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]',
    borderColor: 'border-emerald-500/40',
    bgBadge: 'bg-[#031c13]/95 text-emerald-300 border-emerald-400/90 shadow-[0_1px_8px_rgba(16,185,129,0.35)]',
  },
  {
    key: 'BOOKED',
    statKey: 'booked',
    sheetName: 'BOOKED',
    color: '#f43f5e',
    textColor: 'text-rose-400',
    dotColor: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,1)]',
    borderColor: 'border-rose-500/40',
    bgBadge: 'bg-[#2b060d]/95 text-rose-300 border-rose-500/90 shadow-[0_1px_8px_rgba(244,63,94,0.35)]',
  },
  {
    key: 'BLOCKED',
    statKey: 'blocked',
    sheetName: 'BLOCKED',
    color: '#f59e0b',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,1)]',
    borderColor: 'border-amber-500/40',
    bgBadge: 'bg-[#281504]/95 text-amber-300 border-amber-500/90 shadow-[0_1px_8px_rgba(245,158,11,0.35)]',
  },
  {
    key: 'LO_BLOCKED',
    statKey: 'loBlocked',
    sheetName: 'LO-BLOCKED',
    color: '#f97316',
    textColor: 'text-orange-400',
    dotColor: 'bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,1)]',
    borderColor: 'border-orange-500/40',
    bgBadge: 'bg-[#2a1304]/95 text-orange-300 border-orange-500/90 shadow-[0_1px_8px_rgba(249,115,22,0.35)]',
  },
  {
    key: 'NOT_FOR_SALE',
    statKey: 'notForSale',
    sheetName: 'NOT FOR SALE',
    color: '#94a3b8',
    textColor: 'text-slate-400',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-500/40',
    bgBadge: 'bg-[#0e1118]/95 text-slate-400 border-slate-700/80',
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
