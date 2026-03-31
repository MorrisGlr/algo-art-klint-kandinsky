import { CONFIG } from './config.js';

export const PHASE = {
  PLACING: 'placing',
  DELAYING: 'delaying',
  ROTATING: 'rotating',
  COMPLETE: 'complete',
};

export function createAnimationState() {
  return {
    phase: PHASE.PLACING,
    delayStartTime: null,
    rotationStartTime: null,
  };
}

export function updateAnimation(state, shapeCount) {
  if (state.phase === PHASE.PLACING && shapeCount >= CONFIG.MAX_SHAPES) {
    state.phase = PHASE.DELAYING;
    state.delayStartTime = millis();
  }

  if (state.phase === PHASE.DELAYING) {
    const elapsed = millis() - state.delayStartTime;
    if (elapsed > CONFIG.ROTATION_DELAY_MS) {
      state.phase = PHASE.ROTATING;
      state.rotationStartTime = millis();
    }
  }

  if (state.phase === PHASE.ROTATING) {
    const elapsed = millis() - state.rotationStartTime;
    if (elapsed > CONFIG.ROTATION_DURATION_MS) {
      state.phase = PHASE.COMPLETE;
    }
  }
}

export function applyRotation(state) {
  if (state.phase === PHASE.ROTATING) {
    const elapsed = millis() - state.rotationStartTime;
    const progress = map(elapsed, 0, CONFIG.ROTATION_DURATION_MS, 0, 1);
    rotateX(PI * 2 * progress);
    rotateZ(-PI * 2 * progress);
  } else if (state.phase === PHASE.COMPLETE) {
    rotateX(PI * 2);
    rotateZ(-PI * 2);
  }
}

export function shouldAddShape(state, shapeCount) {
  return state.phase === PHASE.PLACING
    && shapeCount < CONFIG.MAX_SHAPES
    && frameCount % CONFIG.SHAPE_EVERY_N_FRAMES === 0;
}
