// ============================================================
// BALMANDAISA — Core Type Definitions
// ============================================================

/** Possible availability statuses for a unit */
export type UnitStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'NOT_FOR_SALE';

/** Normalized status from raw sheet text */
export function normalizeStatus(raw: string): UnitStatus {
  const s = (raw || '').trim().toUpperCase();
  if (s === 'AVAILABLE' || s === 'AVL') return 'AVAILABLE';
  if (s === 'BOOKED' || s === 'SOLD') return 'BOOKED';
  if (s.includes('BLOCK')) return 'BLOCKED'; // Matches 'BLOCKED', 'LO-BLOCKED', 'MGMT BLOCKED'
  // "NOT FOR SALE NOW", "NOT FOR SALE", "NFS", etc.
  return 'NOT_FOR_SALE';
}

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
