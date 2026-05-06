import { describe, it, expect, beforeEach } from 'vitest';
import { KLINT_KANDINSKY } from '../src/klint-kandinsky.js';
import { selectPalette, sampleColor, computeGradient, computeSideColor } from '../src/palette.js';

const PALETTES = KLINT_KANDINSKY.palettes;

describe('PALETTES', () => {
  it('has at least 4 palettes', () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(4);
  });

  it('each palette has valid structure', () => {
    for (const p of PALETTES) {
      expect(p.name).toBeTruthy();
      expect(p.source).toBeTruthy();
      expect(p.background).toHaveLength(3);
      expect(p.colors.length).toBeGreaterThanOrEqual(5);
      expect(p.variation).toHaveProperty('hue');
      expect(p.variation).toHaveProperty('saturation');
      expect(p.variation).toHaveProperty('brightness');
    }
  });

  it('all HSB values are in valid ranges', () => {
    for (const p of PALETTES) {
      const [h, s, b] = p.background;
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(360);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(100);

      for (const [ch, cs, cb] of p.colors) {
        expect(ch).toBeGreaterThanOrEqual(0);
        expect(ch).toBeLessThanOrEqual(360);
        expect(cs).toBeGreaterThanOrEqual(0);
        expect(cs).toBeLessThanOrEqual(100);
        expect(cb).toBeGreaterThanOrEqual(0);
        expect(cb).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('selectPalette', () => {
  it('returns a valid palette', () => {
    randomSeed(42);
    const p = selectPalette();
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('colors');
    expect(PALETTES).toContain(p);
  });

  it('same seed returns same palette', () => {
    randomSeed(42);
    const p1 = selectPalette();
    randomSeed(42);
    const p2 = selectPalette();
    expect(p1.name).toBe(p2.name);
  });
});

describe('sampleColor', () => {
  beforeEach(() => randomSeed(123));

  it('returns a color object', () => {
    const c = sampleColor(PALETTES[0]);
    expect(c._isColor).toBe(true);
  });

  it('falls back to random RGB when palette is null', () => {
    const c = sampleColor(null);
    expect(c._isColor).toBe(true);
  });
});

describe('computeGradient', () => {
  it('topColor is brighter than baseColor', () => {
    const base = color(200, 60, 50);
    const grad = computeGradient(base);
    expect(brightness(grad.topColor)).toBeGreaterThan(brightness(grad.baseColor));
  });

  it('baseColor is unchanged', () => {
    const base = color(200, 60, 50);
    const grad = computeGradient(base);
    expect(grad.baseColor).toBe(base);
  });
});

describe('computeSideColor', () => {
  it('returns a darker color', () => {
    const base = color(200, 60, 50);
    const side = computeSideColor(base);
    expect(brightness(side)).toBeLessThan(brightness(base));
  });
});
