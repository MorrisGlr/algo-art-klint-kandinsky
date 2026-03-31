import { describe, it, expect, beforeEach } from 'vitest';
import { computeGridCells, computePlacementPositions } from '../src/spatial.js';
import { CONFIG } from '../src/config.js';

describe('computeGridCells', () => {
  it('returns cols * rows cells', () => {
    const cells = computeGridCells(1080, 1920, 6, 11, 200);
    expect(cells).toHaveLength(66);
  });

  it('all cell centers are within canvas bounds minus margins', () => {
    const w = 1080, h = 1920, margin = 200;
    const cells = computeGridCells(w, h, 6, 11, margin);
    for (const cell of cells) {
      expect(cell.x).toBeGreaterThanOrEqual(-w / 2 + margin);
      expect(cell.x).toBeLessThanOrEqual(w / 2 - margin);
      expect(cell.y).toBeGreaterThanOrEqual(-h / 2 + margin);
      expect(cell.y).toBeLessThanOrEqual(h / 2 - margin);
    }
  });

  it('cells have positive dimensions', () => {
    const cells = computeGridCells(1080, 1920, 6, 11, 200);
    for (const cell of cells) {
      expect(cell.cellW).toBeGreaterThan(0);
      expect(cell.cellH).toBeGreaterThan(0);
    }
  });
});

describe('computePlacementPositions', () => {
  beforeEach(() => randomSeed(42));

  it('returns at most MAX_SHAPES positions', () => {
    const positions = computePlacementPositions();
    expect(positions.length).toBeLessThanOrEqual(CONFIG.MAX_SHAPES);
  });

  it('returns positions with x and y properties', () => {
    const positions = computePlacementPositions();
    for (const p of positions) {
      expect(p).toHaveProperty('x');
      expect(p).toHaveProperty('y');
      expect(typeof p.x).toBe('number');
      expect(typeof p.y).toBe('number');
    }
  });

  it('same seed produces identical positions', () => {
    randomSeed(99);
    const p1 = computePlacementPositions();
    randomSeed(99);
    const p2 = computePlacementPositions();
    expect(p1).toEqual(p2);
  });

  it('different seeds produce different positions', () => {
    randomSeed(1);
    const p1 = computePlacementPositions();
    randomSeed(2);
    const p2 = computePlacementPositions();
    const same = p1.every((pos, i) => pos.x === p2[i]?.x && pos.y === p2[i]?.y);
    expect(same).toBe(false);
  });
});
