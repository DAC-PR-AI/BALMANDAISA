// ============================================================
// BALMANDAISA — Availability Differ
// ============================================================
// Compares previous and incoming unit states to detect status changes.

import { Unit, AvailabilityChange } from '@/types';

/**
 * Compare two unit dictionaries and return any changed units with timestamps.
 */
export function diffUnitAvailability(
  prevUnits: Record<string, Unit>,
  nextUnits: Record<string, Unit>
): AvailabilityChange[] {
  const changes: AvailabilityChange[] = [];
  const now = Date.now();

  for (const [id, nextUnit] of Object.entries(nextUnits)) {
    const prevUnit = prevUnits[id];
    if (prevUnit && prevUnit.status !== nextUnit.status) {
      changes.push({
        unitId: id,
        oldStatus: prevUnit.status,
        newStatus: nextUnit.status,
        timestamp: now,
      });
    }
  }

  return changes;
}
