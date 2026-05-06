import { CONFIG } from './config.js';

export function selectPalette(palettes) {
  return palettes[Math.floor(random(palettes.length))];
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

