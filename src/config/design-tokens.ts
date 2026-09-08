// ============================================================
// BALMANDAISA — Design Tokens
// ============================================================
// Derived from the actual BALMANDAISA logo (gold gradient + dark brown serif)
// and DAC branding (navy + orange). NOT a generic palette.

export const COLORS = {
  // --- Backgrounds (warm charcoal, NOT pure black) ---
  bgPrimary: '#1A1410',       // Deep warm charcoal — echoes logo brown
  bgSecondary: '#221C15',     // Slightly lighter, for cards/surfaces
  bgTertiary: '#2A2018',      // Panels, overlays
  bgElevation: '#0D0B08',     // Darkest — behind building elevation

  // --- Gold accent system (from logo gradient) ---
  gold: '#C9A54E',
  goldLight: '#E0C878',
  goldDark: '#8B7240',
  goldMuted: '#6B5A38',
  goldGlow: 'rgba(201, 165, 78, 0.15)',

  // --- Availability statuses ---
  available: '#22B06B',
  availableGlow: 'rgba(34, 176, 107, 0.25)',
  booked: '#8B4A4A',          // Muted rose — desaturated, not aggressive
  bookedMuted: '#5C3333',
  blocked: '#B89440',         // Amber
  blockedMuted: '#7A6530',
  notForSale: '#6B6058',      // Warm gray
  notForSaleMuted: '#4A443D',

  // --- Text ---
  textPrimary: '#F5F0E8',     // Warm white
  textSecondary: '#C8C0B4',
  textMuted: '#9B9088',
  textDark: '#3B1E00',        // From logo — for use on light surfaces only

  // --- Utility ---
  divider: 'rgba(201, 165, 78, 0.12)',
  overlay: 'rgba(13, 11, 8, 0.7)',
  liveIndicator: '#39D98A',
  error: '#E23B3B',
} as const;

export const TYPOGRAPHY = {
  /** Serif display — for project name, floor labels */
  displayFont: '"Playfair Display", Georgia, "Times New Roman", serif',
  /** Sans body — for data, counts, labels */
  bodyFont: '"Inter", "Segoe UI", system-ui, sans-serif',
  /** Monospace — for unit numbers */
  monoFont: '"JetBrains Mono", "Fira Code", monospace',

  sizes: {
    projectName: 'clamp(2.5rem, 4vw, 5rem)',
    floorLabel: 'clamp(1.8rem, 3vw, 3.5rem)',
    sectionTitle: 'clamp(1.2rem, 2vw, 2rem)',
    body: 'clamp(0.85rem, 1.2vw, 1.1rem)',
    caption: 'clamp(0.7rem, 0.9vw, 0.9rem)',
    unitPin: 'clamp(0.55rem, 0.7vw, 0.75rem)',
    counter: 'clamp(2rem, 3.5vw, 4.5rem)',
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    extraWide: '0.12em',
  },
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const;

export const SHADOWS = {
  unitPin: '0 1px 4px rgba(0, 0, 0, 0.5)',
  unitPinGlow: '0 0 12px rgba(201, 165, 78, 0.3)',
  card: '0 4px 20px rgba(0, 0, 0, 0.3)',
  elevation: '0 8px 40px rgba(0, 0, 0, 0.5)',
  text: '0 2px 8px rgba(0, 0, 0, 0.6)',
} as const;

export const BORDERS = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    full: '50%',
  },
} as const;
