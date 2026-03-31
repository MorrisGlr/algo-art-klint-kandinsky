// Minimal p5.js global stubs for headless testing.
// Uses mulberry32 PRNG for deterministic random().

let _seed = null;
let _prng = Math.random;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

globalThis.randomSeed = function (s) {
  _seed = s;
  _prng = mulberry32(s);
};

globalThis.random = function (a, b) {
  if (a === undefined) return _prng();
  if (b === undefined) return _prng() * a;
  return a + _prng() * (b - a);
};

globalThis.constrain = function (v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
};

globalThis.map = function (value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

globalThis.millis = function () {
  return Date.now();
};

globalThis.sqrt = Math.sqrt;
globalThis.cos = Math.cos;
globalThis.sin = Math.sin;

globalThis.PI = Math.PI;
globalThis.TWO_PI = Math.PI * 2;
globalThis.HALF_PI = Math.PI / 2;

// Color stubs — represent colors as plain objects
globalThis.color = function (h, s, b) {
  if (s === undefined && b === undefined) {
    return { h: 0, s: 0, b: h, _isColor: true };
  }
  return { h, s, b, _isColor: true };
};

globalThis.hue = function (c) {
  return c._isColor ? c.h : 0;
};

globalThis.saturation = function (c) {
  return c._isColor ? c.s : 0;
};

globalThis.brightness = function (c) {
  return c._isColor ? c.b : 0;
};

globalThis.lerpColor = function (c1, c2, amt) {
  return {
    h: c1.h + (c2.h - c1.h) * amt,
    s: c1.s + (c2.s - c1.s) * amt,
    b: c1.b + (c2.b - c1.b) * amt,
    _isColor: true,
  };
};

globalThis.colorMode = function () {};

// Geometry stubs (no-ops for testing)
globalThis.push = function () {};
globalThis.pop = function () {};
globalThis.translate = function () {};
globalThis.rotateX = function () {};
globalThis.rotateY = function () {};
globalThis.rotateZ = function () {};
globalThis.beginShape = function () {};
globalThis.endShape = function () {};
globalThis.vertex = function () {};
globalThis.curveVertex = function () {};
globalThis.normal = function () {};
globalThis.fill = function () {};
globalThis.noStroke = function () {};
globalThis.ambientMaterial = function () {};
globalThis.CLOSE = 'close';
globalThis.TRIANGLE_FAN = 'triangle_fan';
globalThis.frameCount = 1;
