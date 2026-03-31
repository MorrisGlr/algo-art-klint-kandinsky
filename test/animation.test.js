import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAnimationState, updateAnimation, shouldAddShape, PHASE } from '../src/animation.js';
import { CONFIG } from '../src/config.js';

describe('createAnimationState', () => {
  it('starts in PLACING phase', () => {
    const state = createAnimationState();
    expect(state.phase).toBe(PHASE.PLACING);
    expect(state.delayStartTime).toBeNull();
    expect(state.rotationStartTime).toBeNull();
  });
});

describe('updateAnimation', () => {
  let mockTime;

  beforeEach(() => {
    mockTime = 0;
    globalThis.millis = () => mockTime;
  });

  it('transitions from PLACING to DELAYING when shapes reach max', () => {
    const state = createAnimationState();
    updateAnimation(state, CONFIG.MAX_SHAPES);
    expect(state.phase).toBe(PHASE.DELAYING);
  });

  it('stays in PLACING when shapes below max', () => {
    const state = createAnimationState();
    updateAnimation(state, 10);
    expect(state.phase).toBe(PHASE.PLACING);
  });

  it('transitions from DELAYING to ROTATING after delay', () => {
    const state = createAnimationState();
    mockTime = 1000;
    updateAnimation(state, CONFIG.MAX_SHAPES);
    expect(state.phase).toBe(PHASE.DELAYING);

    mockTime = 1000 + CONFIG.ROTATION_DELAY_MS + 1;
    updateAnimation(state, CONFIG.MAX_SHAPES);
    expect(state.phase).toBe(PHASE.ROTATING);
  });

  it('transitions from ROTATING to COMPLETE after duration', () => {
    const state = createAnimationState();
    mockTime = 0;
    updateAnimation(state, CONFIG.MAX_SHAPES); // -> DELAYING

    mockTime = CONFIG.ROTATION_DELAY_MS + 1;
    updateAnimation(state, CONFIG.MAX_SHAPES); // -> ROTATING

    mockTime = CONFIG.ROTATION_DELAY_MS + 1 + CONFIG.ROTATION_DURATION_MS + 1;
    updateAnimation(state, CONFIG.MAX_SHAPES); // -> COMPLETE
    expect(state.phase).toBe(PHASE.COMPLETE);
  });
});

describe('shouldAddShape', () => {
  it('returns true during PLACING when conditions met', () => {
    const state = createAnimationState();
    globalThis.frameCount = CONFIG.SHAPE_EVERY_N_FRAMES;
    expect(shouldAddShape(state, 0)).toBe(true);
  });

  it('returns false when shape count at max', () => {
    const state = createAnimationState();
    globalThis.frameCount = CONFIG.SHAPE_EVERY_N_FRAMES;
    expect(shouldAddShape(state, CONFIG.MAX_SHAPES)).toBe(false);
  });

  it('returns false on wrong frame', () => {
    const state = createAnimationState();
    globalThis.frameCount = CONFIG.SHAPE_EVERY_N_FRAMES + 1;
    expect(shouldAddShape(state, 0)).toBe(false);
  });

  it('returns false when not in PLACING phase', () => {
    const state = createAnimationState();
    state.phase = PHASE.ROTATING;
    globalThis.frameCount = CONFIG.SHAPE_EVERY_N_FRAMES;
    expect(shouldAddShape(state, 10)).toBe(false);
  });
});
