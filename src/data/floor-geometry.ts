// ============================================================
// BALMANDAISA — Floor Geometry (Adaptive Non-Colliding Anchors)
// ============================================================
// Each unit marker is placed naturally at its apartment location,
// aligned into clear pockets and clean spaces to ensure zero
// interference with major architectural lines, walls, or text.

import { FloorGeometry } from '@/types';

// Standard 16-unit residential floor layout (Floors 2 to 12)
const TYPICAL_FLOOR_UNITS = (floorNum: number) => {
  const f = floorNum;
  return {
    [`${f}01`]: { xpct: 12.500, ypct: 91.500 }, // Unit 01 living/balcony clear pocket
    [`${f}02`]: { xpct: 25.500, ypct: 91.500 }, // Unit 02 balcony clear pocket
    [`${f}03`]: { xpct: 36.500, ypct: 91.500 }, // Unit 03 balcony clear pocket
    [`${f}04`]: { xpct: 47.500, ypct: 91.500 }, // Unit 04 balcony clear pocket
    [`${f}05`]: { xpct: 58.500, ypct: 91.500 }, // Unit 05 balcony clear pocket
    [`${f}06`]: { xpct: 69.500, ypct: 91.500 }, // Unit 06 balcony clear pocket
    [`${f}07`]: { xpct: 76.500, ypct: 56.500 }, // Unit 07 balcony clear pocket
    [`${f}08`]: { xpct: 70.000, ypct: 10.500 }, // Unit 08 top balcony clear pocket
    [`${f}09`]: { xpct: 58.500, ypct: 10.500 }, // Unit 09 top balcony clear pocket
    [`${f}10`]: { xpct: 57.500, ypct: 43.500 }, // Unit 10 open void clear pocket
    [`${f}11`]: { xpct: 55.500, ypct: 53.500 }, // Unit 11 courtyard clear pocket
    [`${f}12`]: { xpct: 45.500, ypct: 53.500 }, // Unit 12 courtyard clear pocket
    [`${f}13`]: { xpct: 32.000, ypct: 61.500 }, // Unit 13 living clear pocket
    [`${f}14`]: { xpct: 37.500, ypct: 28.500 }, // Unit 14 upper lightwell clear pocket
    [`${f}15`]: { xpct: 14.500, ypct: 16.000 }, // Unit 15 top-left clear pocket
    [`${f}16`]: { xpct: 10.500, ypct: 62.500 }, // Unit 16 living/balcony clear pocket
  };
};

export const FLOOR_GEOMETRY: Record<string, FloorGeometry> = {
  '1': {
    planKey: 'floor-01',
    units: {
      '101': { xpct: 25.500, ypct: 91.500 },
      '102': { xpct: 36.500, ypct: 91.500 },
      '103': { xpct: 47.500, ypct: 91.500 },
      '104': { xpct: 58.500, ypct: 91.500 },
      '105': { xpct: 69.500, ypct: 91.500 },
      '106': { xpct: 76.500, ypct: 43.000 },
      '107': { xpct: 70.000, ypct: 10.500 },
      '108': { xpct: 58.500, ypct: 10.500 },
      '109': { xpct: 54.500, ypct: 38.500 },
      '110': { xpct: 51.500, ypct: 47.500 },
      '111': { xpct: 32.000, ypct: 61.500 },
      '112': { xpct: 37.500, ypct: 28.500 },
    },
  },
  '2': {
    planKey: 'floor-02',
    units: TYPICAL_FLOOR_UNITS(2),
  },
  '3': {
    planKey: 'floor-03',
    units: TYPICAL_FLOOR_UNITS(3),
  },
  '4': {
    planKey: 'floor-04',
    units: TYPICAL_FLOOR_UNITS(4),
  },
  '5': {
    planKey: 'floor-05',
    units: TYPICAL_FLOOR_UNITS(5),
  },
  '6': {
    planKey: 'floor-06',
    units: TYPICAL_FLOOR_UNITS(6),
  },
  '7': {
    planKey: 'floor-07',
    units: TYPICAL_FLOOR_UNITS(7),
  },
  '8': {
    planKey: 'floor-08',
    units: TYPICAL_FLOOR_UNITS(8),
  },
  '9': {
    planKey: 'floor-09',
    units: TYPICAL_FLOOR_UNITS(9),
  },
  '10': {
    planKey: 'floor-10',
    units: TYPICAL_FLOOR_UNITS(10),
  },
  '11': {
    planKey: 'floor-11',
    units: TYPICAL_FLOOR_UNITS(11),
  },
  '12': {
    planKey: 'floor-12',
    units: TYPICAL_FLOOR_UNITS(12),
  },
  '13': {
    planKey: 'floor-13',
    units: {
      '1301': { xpct: 12.500, ypct: 91.500 }, // Penthouse 1301 clear pocket
      '1310': { xpct: 57.500, ypct: 43.500 }, // Unit 1310 clear pocket
      '1311': { xpct: 55.500, ypct: 53.500 }, // Unit 1311 clear pocket
      '1312': { xpct: 45.500, ypct: 53.500 }, // Unit 1312 clear pocket
      '1313': { xpct: 32.000, ypct: 61.500 }, // Unit 1313 clear pocket
      '1315': { xpct: 14.500, ypct: 16.000 }, // Penthouse 1315 clear pocket
    },
  },
};

/** Duplex tag positions on the 13th floor plan (upper levels of floor 12 duplexes) */
export const DUPLEX_TAGS_13: Record<string, { xpct: number; ypct: number }> = {
  '1209': { xpct: 58.500, ypct: 10.500 },
  '1208': { xpct: 70.000, ypct: 10.500 },
  '1214': { xpct: 37.500, ypct: 28.500 },
  '1207': { xpct: 76.500, ypct: 56.500 },
  '1202': { xpct: 25.500, ypct: 91.500 },
  '1203': { xpct: 36.500, ypct: 91.500 },
  '1204': { xpct: 47.500, ypct: 91.500 },
  '1205': { xpct: 58.500, ypct: 91.500 },
  '1206': { xpct: 69.500, ypct: 91.500 },
};
