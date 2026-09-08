// ============================================================
// BALMANDAISA — Presentation Timing Configuration
// ============================================================
// All durations in milliseconds.
// Floor duration reduced by 2 seconds (from 8s to 6s) for a brisk cinematic rhythm.

export const TIMING = {
  /** Brand reveal + project intro */
  INTRO_DURATION: 5000,

  /** Building elevation reveal with floor markers */
  ELEVATION_REVEAL: 6000,

  /** 13-floor overview on the building */
  FLOOR_OVERVIEW: 3000,

  /** How long each floor plan is displayed (Reduced by 2s) */
  FLOOR_DWELL: 6000,

  /** Transition animation between floors */
  FLOOR_TRANSITION: 1800,

  /** Final summary with counters before loop restart */
  SUMMARY_DURATION: 6000,

  /** How often to poll for new availability data (ms) */
  DATA_REFRESH_INTERVAL: 15000,

  /** Delay before auto-hiding presentation controls after inactivity */
  CONTROLS_AUTO_HIDE: 2500,

  /** Stagger delay between unit pin animations on a floor (ms per pin) */
  UNIT_STAGGER: 40,

  /** Duration of a unit status change animation */
  STATUS_CHANGE_DURATION: 500,
} as const;

export const PRESENTATION_CONFIG = {
  INTRO_DURATION: TIMING.INTRO_DURATION,
  ELEVATION_DURATION: TIMING.ELEVATION_REVEAL,
  FLOOR_DETAIL_DURATION: TIMING.FLOOR_DWELL,
  FLOOR_TRANSITION_DURATION: TIMING.FLOOR_TRANSITION,
  SUMMARY_DURATION: TIMING.SUMMARY_DURATION,
  DATA_REFRESH_INTERVAL: TIMING.DATA_REFRESH_INTERVAL,
  AUTO_PLAY: true,
  TOTAL_FLOORS: 13,
} as const;

/**
 * Total approximate loop duration:
 * INTRO (5s) + ELEVATION (6s) + 13×FLOOR (78s) + 12×TRANSITION (21.6s) + SUMMARY (6s)
 * = ~116s ≈ ~1.9 minutes per full presentation cycle
 */
export const ESTIMATED_LOOP_DURATION =
  TIMING.INTRO_DURATION +
  TIMING.ELEVATION_REVEAL +
  13 * TIMING.FLOOR_DWELL +
  12 * TIMING.FLOOR_TRANSITION +
  TIMING.SUMMARY_DURATION;
