import { describe, it, expect } from 'vitest';
import { computeGradient, computeSideColor } from '../src/palette.js';

describe('computeGradient', () => {
  it('produces a measurably lighter topColor', () => {
    const base = color(120, 70, 40);
    const grad = computeGradient(base);
    const diff = brightness(grad.topColor) - brightness(base);
    expect(diff).toBeGreaterThan(1); // more than 1% brightness increase
  });

  it('topColor has lower saturation than baseColor', () => {
    const base = color(120, 70, 40);
    const grad = computeGradient(base);
    expect(saturation(grad.topColor)).toBeLessThan(saturation(base));
  });

  it('preserves baseColor reference', () => {
    const base = color(0, 50, 50);
    const grad = computeGradient(base);
    expect(grad.baseColor).toBe(base);
  });
});

describe('computeSideColor', () => {
  it('is darker than the base', () => {
    const base = color(200, 60, 60);
    const side = computeSideColor(base);
    expect(brightness(side)).toBeLessThan(brightness(base));
  });

  it('preserves approximate hue', () => {
    const base = color(200, 60, 60);
    const side = computeSideColor(base);
    expect(Math.abs(hue(side) - hue(base))).toBeLessThan(1);
  });
});
