import { CONFIG } from './config.js';

// Curated palettes extracted from actual Klint and Kandinsky paintings.
// Colors in HSB: [hue (0-360), saturation (0-100), brightness (0-100)]
const PALETTES = [
  {
    name: 'Klint Childhood',
    source: 'The Ten Largest, No. 2: Childhood (1907)',
    background: [40, 15, 92],  // warm cream
    colors: [
      [25, 70, 85],   // warm orange
      [45, 65, 90],   // golden yellow
      [200, 45, 70],  // muted blue
      [340, 50, 80],  // dusty rose
      [140, 40, 65],  // sage green
      [20, 55, 75],   // terracotta
    ],
    variation: { hue: 8, saturation: 10, brightness: 8 },
  },
  {
    name: 'Kandinsky Composition VIII',
    source: 'Composition VIII (1923)',
    background: [48, 12, 95],  // warm off-white
    colors: [
      [220, 70, 55],  // deep blue
      [50, 85, 95],   // bright yellow
      [0, 75, 70],    // red
      [0, 0, 15],     // near-black
      [30, 60, 80],   // amber
      [180, 35, 60],  // teal
    ],
    variation: { hue: 6, saturation: 8, brightness: 6 },
  },
  {
    name: 'Kandinsky Several Circles',
    source: 'Several Circles (1926)',
    background: [225, 60, 18],  // deep dark blue (bold)
    colors: [
      [0, 70, 75],    // red
      [210, 65, 80],  // cerulean blue
      [45, 80, 90],   // yellow
      [280, 50, 55],  // violet
      [140, 55, 50],  // deep green
      [25, 65, 85],   // orange
    ],
    variation: { hue: 7, saturation: 10, brightness: 8 },
  },
  {
    name: 'Klint Adulthood',
    source: 'The Ten Largest, No. 7: Adulthood (1907)',
    background: [340, 18, 88],  // soft pink
    colors: [
      [340, 55, 75],  // deep pink
      [190, 50, 65],  // steel blue
      [45, 60, 85],   // warm gold
      [0, 0, 25],     // charcoal
      [140, 45, 55],  // forest green
      [15, 70, 80],   // burnt orange
    ],
    variation: { hue: 8, saturation: 10, brightness: 8 },
  },
  {
    name: 'Kandinsky Yellow-Red-Blue',
    source: 'Yellow-Red-Blue (1925)',
    background: [45, 10, 93],  // warm off-white
    colors: [
      [50, 85, 95],   // vivid yellow
      [0, 80, 70],    // deep red
      [220, 75, 50],  // ultramarine blue
      [280, 45, 45],  // dark violet
      [30, 70, 80],   // warm orange
      [0, 0, 20],     // near-black
    ],
    variation: { hue: 6, saturation: 8, brightness: 6 },
  },
];

export function selectPalette() {
  return PALETTES[Math.floor(random(PALETTES.length))];
}

export function sampleColor(palette) {
  if (!palette) return color(random(255), random(255), random(255));
  const base = palette.colors[Math.floor(random(palette.colors.length))];
  const v = palette.variation;
  const h = (base[0] + random(-v.hue, v.hue) + 360) % 360;
  const s = constrain(base[1] + random(-v.saturation, v.saturation), 0, 100);
  const b = constrain(base[2] + random(-v.brightness, v.brightness), 0, 100);
  return color(h, s, b);
}

export function computeGradient(baseColor) {
  // Lerp toward a desaturated bright version of the same hue for visible lightening
  const target = color(hue(baseColor), 0, 100);
  const topColor = lerpColor(baseColor, target, CONFIG.GRADIENT_LERP_AMOUNT);
  return { topColor, baseColor };
}

export function computeSideColor(baseColor) {
  const darker = color(hue(baseColor), saturation(baseColor), 20);
  return lerpColor(baseColor, darker, 0.4);
}

export function getBackgroundColor(palette) {
  if (!palette) return 200;
  const bg = palette.background;
  return color(bg[0], bg[1], bg[2]);
}

export { PALETTES };
