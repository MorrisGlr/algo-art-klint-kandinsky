import { CONFIG } from './config.js';
import { PAINTERS, DEFAULT_PAINTER } from './painters.js';
import { sampleColor, computeGradient, computeSideColor, getBackgroundColor, selectPalette } from './palette.js';
import { computePlacementPositions } from './spatial.js';
import { drawTrapezoid, drawRectangle, drawCircle, drawSemiCircle, drawTriangle, drawTeardrop } from './shapes.js';
import { createAnimationState, updateAnimation, applyRotation, shouldAddShape, PHASE } from './animation.js';

const DRAW_FUNCTIONS = {
  trapezoid: drawTrapezoid,
  rectangle: drawRectangle,
  circle: drawCircle,
  semiCircle: drawSemiCircle,
  triangle: drawTriangle,
  teardrop: drawTeardrop,
};

const SHAPE_TYPES = Object.keys(DRAW_FUNCTIONS);

let shapes = [];
let positions = [];
let animState;
let palette;
let activePainter;
let currentSeed;
let isFrozen = false;
let capturing = false;
let mediaRecorder = null;
let recordedChunks = [];
let videoTrack = null;
let offscreenCanvas = null;
let offscreenCtx = null;
let exportMode = false;
let exportStopped = false;

const PARALLAX_TILT_RANGE = Math.PI / 12;  // +/- 15 degrees

function parseSeedFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/#seed=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function showRecIndicator(visible) {
  const el = document.getElementById('rec-indicator');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

function startRecording() {
  const canvas = document.getElementById('defaultCanvas0');
  if (!canvas || !canvas.captureStream) return;
  offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  offscreenCtx = offscreenCanvas.getContext('2d');
  const stream = offscreenCanvas.captureStream(0);
  videoTrack = stream.getVideoTracks()[0];
  const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
    ? 'video/webm; codecs=vp9'
    : 'video/webm';
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType });
  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'klint-kandinsky-seed-' + currentSeed + '.webm';
    a.click();
    URL.revokeObjectURL(a.href);
    recordedChunks = [];
    mediaRecorder = null;
  };
  mediaRecorder.start();
  capturing = true;
  showRecIndicator(true);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  capturing = false;
  videoTrack = null;
  offscreenCanvas = null;
  offscreenCtx = null;
  showRecIndicator(false);
  loop();
}

function updateSeedDisplay() {
  const el = document.getElementById('seed-overlay');
  if (el) el.textContent = 'seed: ' + currentSeed;
}

function updateHash() {
  const url = new URL(window.location.href);
  url.hash = 'seed=' + currentSeed;
  history.replaceState(null, '', url.toString());
}

function initComposition() {
  randomSeed(currentSeed);
  palette = selectPalette(activePainter.palettes);
  positions = computePlacementPositions(activePainter.grid);
  animState = createAnimationState();
  shapes = [];
  updateSeedDisplay();
  updateHash();
}

function resolveRotation(painter) {
  const mode = painter.rotationMode || 'free';
  if (mode === 'fixed') return 0;
  if (mode === 'orthogonal') return Math.floor(random(4)) * HALF_PI;
  return random(TWO_PI);
}

function createRandomShape() {
  const pos = positions.shift() || {
    x: random(-CONFIG.CANVAS_WIDTH / 2 + CONFIG.MARGIN, CONFIG.CANVAS_WIDTH / 2 - CONFIG.MARGIN),
    y: random(-CONFIG.CANVAS_HEIGHT / 2 + CONFIG.MARGIN, CONFIG.CANVAS_HEIGHT / 2 - CONFIG.MARGIN),
  };

  const baseColor = sampleColor(palette);
  const lerpAmount = activePainter.gradientLerpAmount ?? CONFIG.GRADIENT_LERP_AMOUNT;
  const grad = computeGradient(baseColor, lerpAmount);
  const shapePool = activePainter.shapeTypes || SHAPE_TYPES;

  return {
    type: shapePool[Math.floor(random(shapePool.length))],
    x: pos.x,
    y: pos.y,
    z: random(-CONFIG.CANVAS_WIDTH * CONFIG.Z_RANGE_FACTOR, CONFIG.CANVAS_WIDTH * CONFIG.Z_RANGE_FACTOR),
    rotation: resolveRotation(activePainter),
    size: random(CONFIG.MIN_SIZE, CONFIG.MAX_SIZE),
    aspectRatio: random(0.4, 2.5),
    topColor: grad.topColor,
    baseColor: grad.baseColor,
    sideColor: computeSideColor(baseColor),
    thickness: random(CONFIG.MIN_THICKNESS, CONFIG.MAX_THICKNESS),
  };
}

export function initSketch() {
  window.setup = function () {
    colorMode(HSB, 360, 100, 100);
    pixelDensity(CONFIG.PIXEL_DENSITY);
    setAttributes('preserveDrawingBuffer', true);
    const cnv = createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT, WEBGL);
    cnv.parent('canvas-container');
    document.getElementById('canvas-container').classList.add('canvas-ready');
    frameRate(CONFIG.FRAME_RATE);

    const params = new URLSearchParams(window.location.search);
    const painterKey = params.get('painter') || DEFAULT_PAINTER;
    activePainter = PAINTERS[painterKey] || PAINTERS[DEFAULT_PAINTER];

    currentSeed = parseSeedFromHash() || Math.floor(Math.random() * 1000000);
    initComposition();

    // Share button — copy seed URL to clipboard, or open native share sheet on mobile
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        const url = window.location.href;
        if (navigator.share) {
          navigator.share({ title: 'Klint & Kandinsky — seed ' + currentSeed, url })
            .then(function () {
              shareBtn.textContent = 'Shared!';
              setTimeout(function () { shareBtn.textContent = 'Copy seed link'; }, 1500);
            })
            .catch(function () { /* user dismissed share sheet — no feedback needed */ });
        } else {
          navigator.clipboard.writeText(url).then(function () {
            shareBtn.textContent = 'Copied!';
            setTimeout(function () { shareBtn.textContent = 'Copy seed link'; }, 1500);
          });
        }
      });
    }

    // Export mode: auto-start recording
    exportMode = params.get('export') === 'true';
    if (exportMode) {
      startRecording();
    }

    background(getBackgroundColor(palette));
  };

  window.draw = function () {
    background(getBackgroundColor(palette));

    const cameraZ = (CONFIG.CANVAS_HEIGHT / 2) / Math.tan(Math.PI / 6) * CONFIG.CAMERA_DISTANCE_MULTIPLIER;
    camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);

    // Lighting — flat (ambient only) for Mondrian; directional for other painters
    if (activePainter.lightingMode === 'flat') {
      ambientLight(200);
    } else {
      colorMode(RGB, 255);
      ambientLight(255, 255, 255);
      directionalLight(25, 25, 25, 1, -1, -1);
      colorMode(HSB, 360, 100, 100);
    }

    updateAnimation(animState, shapes.length);
    applyRotation(animState);

    // Mouse parallax — Y-axis tilt, only after animation completes
    if (animState.phase === PHASE.COMPLETE && !isFrozen) {
      const mx = map(mouseX, 0, windowWidth, -PARALLAX_TILT_RANGE, PARALLAX_TILT_RANGE);
      rotateY(mx);
    }

    if (shouldAddShape(animState, shapes.length)) {
      shapes.push(createRandomShape());
    }

    for (const s of shapes) {
      DRAW_FUNCTIONS[s.type](s);
    }

    // Auto-stop export recording after animation completes
    if (exportMode && !exportStopped && animState.phase === PHASE.COMPLETE) {
      exportStopped = true;
      stopRecording();
      noLoop();
    }

    // Copy complete frame to offscreen 2D canvas then request capture — explicit timing, no race
    if (capturing && offscreenCtx && videoTrack) {
      offscreenCtx.drawImage(document.getElementById('defaultCanvas0'), 0, 0);
      videoTrack.requestFrame();
    }
  };

  window.keyPressed = function () {
    if (key === 'R' || key === 'r') {
      currentSeed = Math.floor(Math.random() * 1000000);
      isFrozen = false;
      initComposition();
      loop();
      return;
    }

    if (key === 'C' || key === 'c') {
      if (!capturing) {
        startRecording();
      } else {
        stopRecording();
      }
    }
  };

  window.mousePressed = function (event) {
    if (event && event.target && event.target.id === 'share-btn') return;
    if (animState && animState.phase === PHASE.COMPLETE) {
      isFrozen = !isFrozen;
      if (isFrozen) {
        noLoop();
      } else {
        loop();
      }
    }
  };
}
