// ============================================================
// BALMANDAISA — Project Configuration
// ============================================================

export const PROJECT = {
  name: 'BALMANDAISA',
  developer: 'DAC',
  developerFull: 'Dream Ascend Conquer',
  tagline: 'Balmandaisa by DAC',
  floorCount: 13,
  floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const,
} as const;

export const SHEET_CONFIG = {
  sheetId: '11jGZiv2llSFucy9DdfPIiP5OeWYz0ZBQd1u87xwbhXk',
  tabName: 'Stock',
  // Column indices (0-based) from the raw sheet
  columns: {
    sno: 0,
    unitNo: 1,
    facing: 2,
    type: 3,
    saleableArea: 4,
    uds: 5,
    terrace: 6,
    carpark: 7,
    totalCost: 8,
    availability: 9,
  },
} as const;
