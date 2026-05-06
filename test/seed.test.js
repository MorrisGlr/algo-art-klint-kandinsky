import { describe, it, expect } from 'vitest';
import { KLINT_KANDINSKY } from '../src/klint-kandinsky.js';
import { selectPalette, sampleColor, computeGradient, computeSideColor } from '../src/palette.js';
import { computePlacementPositions } from '../src/spatial.js';
import { CONFIG } from '../src/config.js';

function generateComposition(seed) {
  randomSeed(seed);
  const palette = selectPalette(KLINT_KANDINSKY.palettes);
  const positions = computePlacementPositions(KLINT_KANDINSKY.grid);
  const shapes = [];
  const types = ['trapezoid', 'rectangle', 'circle', 'semiCircle', 'triangle', 'teardrop'];

  for (let i = 0; i < Math.min(positions.length, CONFIG.MAX_SHAPES); i++) {
    const baseColor = sampleColor(palette);
    const grad = computeGradient(baseColor);
    shapes.push({
      type: types[Math.floor(random(types.length))],
      x: positions[i].x,
      y: positions[i].y,
      z: random(-CONFIG.CANVAS_WIDTH * CONFIG.Z_RANGE_FACTOR, CONFIG.CANVAS_WIDTH * CONFIG.Z_RANGE_FACTOR),
      rotation: random(TWO_PI),
      size: random(CONFIG.MIN_SIZE, CONFIG.MAX_SIZE),
      topColor: grad.topColor,
      baseColor: grad.baseColor,
      sideColor: computeSideColor(baseColor),
      thickness: random(CONFIG.MIN_THICKNESS, CONFIG.MAX_THICKNESS),
    });
  }

  return { palette: palette.name, shapes };
}

describe('seed reproducibility', () => {
  it('same seed produces identical composition', () => {
    const c1 = generateComposition(42);
    const c2 = generateComposition(42);
    expect(c1.palette).toBe(c2.palette);
    expect(c1.shapes.length).toBe(c2.shapes.length);
    for (let i = 0; i < c1.shapes.length; i++) {
      expect(c1.shapes[i].type).toBe(c2.shapes[i].type);
      expect(c1.shapes[i].x).toBe(c2.shapes[i].x);
      expect(c1.shapes[i].y).toBe(c2.shapes[i].y);
      expect(c1.shapes[i].z).toBe(c2.shapes[i].z);
      expect(c1.shapes[i].size).toBe(c2.shapes[i].size);
    }
  });

  it('different seeds produce different compositions', () => {
    const c1 = generateComposition(1);
    const c2 = generateComposition(999);
    const allSame = c1.shapes.every((s, i) =>
      s.type === c2.shapes[i]?.type && s.x === c2.shapes[i]?.x
    );
    expect(allSame).toBe(false);
  });
});
