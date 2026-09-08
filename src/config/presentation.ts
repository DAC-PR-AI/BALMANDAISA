// ============================================================
// BALMANDAISA — Presentation Timing Configuration
// ============================================================
// All durations in milliseconds.
// Edit this file to adjust the entire presentation rhythm.

export const TIMING = {
  /** Brand reveal + project intro */
  INTRO_DURATION: 6000,

  /** Building elevation reveal with floor markers */
  ELEVATION_REVEAL: 7000,

  /** 13-floor overview on the building */
  FLOOR_OVERVIEW: 4000,

  /** How long each floor plan is displayed */
  FLOOR_DWELL: 8000,

  /** Transition animation between floors */
  FLOOR_TRANSITION: 2000,

  /** Final summary with counters before loop restart */
  SUMMARY_DURATION: 6000,

  /** How often to poll for new availability data (ms) */
  DATA_REFRESH_INTERVAL: 20000,

  /** Delay before auto-hiding presentation controls after inactivity */
  CONTROLS_AUTO_HIDE: 3000,

  /** Stagger delay between unit pin animations on a floor (ms per pin) */
  UNIT_STAGGER: 50,

  /** Duration of a unit status change animation */
  STATUS_CHANGE_DURATION: 600,
} as const;

/**
 * Total approximate loop duration:
 * INTRO (6s) + ELEVATION (7s) + OVERVIEW (4s) + 13×FLOOR (104s) + 12×TRANSITION (24s) + SUMMARY (6s)
 * = ~151s ≈ 2.5 minutes per loop
 */
export const ESTIMATED_LOOP_DURATION =
  TIMING.INTRO_DURATION +
  TIMING.ELEVATION_REVEAL +
  TIMING.FLOOR_OVERVIEW +
  13 * TIMING.FLOOR_DWELL +
  12 * TIMING.FLOOR_TRANSITION +
  TIMING.SUMMARY_DURATION;
