const CIRCLE_SEGMENTS = 48;
const TEARDROP_SEGMENTS = 32;

export function drawTrapezoid(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);
  rotateZ(shape.rotation);

  const s = shape.size;
  const ht = shape.thickness / 2;

  // Top face
  ambientMaterial(shape.topColor);
  beginShape();
  normal(0, 0, 1);
  vertex(-s, -s / 2, ht);
  vertex(s, -s / 2, ht);
  vertex(s * 0.7, s / 2, ht);
  vertex(-s * 0.7, s / 2, ht);
  endShape(CLOSE);

  // Bottom face
  ambientMaterial(shape.baseColor);
  beginShape();
  normal(0, 0, -1);
  vertex(-s, -s / 2, -ht);
  vertex(-s * 0.7, s / 2, -ht);
  vertex(s * 0.7, s / 2, -ht);
  vertex(s, -s / 2, -ht);
  endShape(CLOSE);

  // Sides
  ambientMaterial(shape.sideColor);
  drawSideQuad(-s, -s / 2, s, -s / 2, ht);       // top edge
  drawSideQuad(s, -s / 2, s * 0.7, s / 2, ht);   // right edge
  drawSideQuad(s * 0.7, s / 2, -s * 0.7, s / 2, ht); // bottom edge
  drawSideQuad(-s * 0.7, s / 2, -s, -s / 2, ht); // left edge

  pop();
}

export function drawRectangle(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);
  rotateZ(shape.rotation);

  const hs = shape.size / 2;
  const ht = shape.thickness / 2;

  // Top face
  ambientMaterial(shape.topColor);
  beginShape();
  normal(0, 0, 1);
  vertex(-hs, -hs, ht);
  vertex(hs, -hs, ht);
  vertex(hs, hs, ht);
  vertex(-hs, hs, ht);
  endShape(CLOSE);

  // Bottom face
  ambientMaterial(shape.baseColor);
  beginShape();
  normal(0, 0, -1);
  vertex(-hs, -hs, -ht);
  vertex(-hs, hs, -ht);
  vertex(hs, hs, -ht);
  vertex(hs, -hs, -ht);
  endShape(CLOSE);

  // Sides
  ambientMaterial(shape.sideColor);
  drawSideQuad(-hs, -hs, hs, -hs, ht);  // top
  drawSideQuad(hs, -hs, hs, hs, ht);    // right
  drawSideQuad(hs, hs, -hs, hs, ht);    // bottom
  drawSideQuad(-hs, hs, -hs, -hs, ht);  // left

  pop();
}

export function drawCircle(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);

  const r = shape.size * 0.6;
  const ht = shape.thickness / 2;
  const step = TWO_PI / CIRCLE_SEGMENTS;

  // Top disc
  ambientMaterial(shape.topColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, 1);
  vertex(0, 0, ht);
  for (let i = 0; i <= CIRCLE_SEGMENTS; i++) {
    const a = i * step;
    vertex(r * cos(a), r * sin(a), ht);
  }
  endShape();

  // Bottom disc
  ambientMaterial(shape.baseColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, -1);
  vertex(0, 0, -ht);
  for (let i = CIRCLE_SEGMENTS; i >= 0; i--) {
    const a = i * step;
    vertex(r * cos(a), r * sin(a), -ht);
  }
  endShape();

  // Side wall
  ambientMaterial(shape.sideColor);
  for (let i = 0; i < CIRCLE_SEGMENTS; i++) {
    const a1 = i * step;
    const a2 = (i + 1) * step;
    const aMid = (a1 + a2) / 2;
    beginShape();
    normal(cos(aMid), sin(aMid), 0);
    vertex(r * cos(a1), r * sin(a1), ht);
    vertex(r * cos(a2), r * sin(a2), ht);
    vertex(r * cos(a2), r * sin(a2), -ht);
    vertex(r * cos(a1), r * sin(a1), -ht);
    endShape(CLOSE);
  }

  pop();
}

export function drawSemiCircle(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);
  rotateZ(shape.rotation);

  const r = shape.size;
  const ht = shape.thickness / 2;
  const segments = 32;
  const step = PI / segments;

  // Top half-disc
  ambientMaterial(shape.topColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, 1);
  vertex(0, 0, ht);
  for (let i = 0; i <= segments; i++) {
    const a = i * step;
    vertex(r * cos(a), r * sin(a), ht);
  }
  endShape();

  // Bottom half-disc
  ambientMaterial(shape.baseColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, -1);
  vertex(0, 0, -ht);
  for (let i = segments; i >= 0; i--) {
    const a = i * step;
    vertex(r * cos(a), r * sin(a), -ht);
  }
  endShape();

  // Curved side wall
  ambientMaterial(shape.sideColor);
  for (let i = 0; i < segments; i++) {
    const a1 = i * step;
    const a2 = (i + 1) * step;
    const aMid = (a1 + a2) / 2;
    beginShape();
    normal(cos(aMid), sin(aMid), 0);
    vertex(r * cos(a1), r * sin(a1), ht);
    vertex(r * cos(a2), r * sin(a2), ht);
    vertex(r * cos(a2), r * sin(a2), -ht);
    vertex(r * cos(a1), r * sin(a1), -ht);
    endShape(CLOSE);
  }

  // Flat diameter edge (straight side)
  drawSideQuad(r, 0, -r, 0, ht);

  pop();
}

export function drawTriangle(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);
  rotateZ(shape.rotation);

  const hs = shape.size / 2;
  const ht = shape.thickness / 2;

  // Top face
  ambientMaterial(shape.topColor);
  beginShape();
  normal(0, 0, 1);
  vertex(-hs, -hs, ht);
  vertex(hs, -hs, ht);
  vertex(0, hs, ht);
  endShape(CLOSE);

  // Bottom face
  ambientMaterial(shape.baseColor);
  beginShape();
  normal(0, 0, -1);
  vertex(-hs, -hs, -ht);
  vertex(0, hs, -ht);
  vertex(hs, -hs, -ht);
  endShape(CLOSE);

  // Sides
  ambientMaterial(shape.sideColor);
  drawSideQuad(-hs, -hs, hs, -hs, ht);  // base
  drawSideQuad(hs, -hs, 0, hs, ht);     // right
  drawSideQuad(0, hs, -hs, -hs, ht);    // left

  pop();
}

export function drawTeardrop(shape) {
  push();
  noStroke();
  translate(shape.x, shape.y, shape.z);
  rotateZ(shape.rotation);

  const s = shape.size;
  const ht = shape.thickness / 2;
  const step = TWO_PI / TEARDROP_SEGMENTS;

  // Generate teardrop outline points using a cardioid-like parametric curve
  const points = [];
  for (let i = 0; i <= TEARDROP_SEGMENTS; i++) {
    const t = i * step;
    // Parametric teardrop: x = sin(t), y = -cos(t) - sin^2(t)/2
    const px = s * 0.5 * sin(t);
    const py = s * 0.5 * (-cos(t) - (sin(t) * sin(t)) / 2);
    points.push({ x: px, y: py });
  }

  // Top face
  ambientMaterial(shape.topColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, 1);
  // Center is approximate centroid
  vertex(0, -s * 0.15, ht);
  for (const p of points) {
    vertex(p.x, p.y, ht);
  }
  endShape();

  // Bottom face
  ambientMaterial(shape.baseColor);
  beginShape(TRIANGLE_FAN);
  normal(0, 0, -1);
  vertex(0, -s * 0.15, -ht);
  for (let i = points.length - 1; i >= 0; i--) {
    vertex(points[i].x, points[i].y, -ht);
  }
  endShape();

  // Side wall
  ambientMaterial(shape.sideColor);
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    // Outward normal: perpendicular to edge, pointing away from center
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = sqrt(dx * dx + dy * dy);
    if (len < 0.001) continue;
    const nx = dy / len;
    const ny = -dx / len;
    beginShape();
    normal(nx, ny, 0);
    vertex(p1.x, p1.y, ht);
    vertex(p2.x, p2.y, ht);
    vertex(p2.x, p2.y, -ht);
    vertex(p1.x, p1.y, -ht);
    endShape(CLOSE);
  }

  pop();
}

// Helper: draw a side quad between two edge points with proper outward normal
function drawSideQuad(x1, y1, x2, y2, ht) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = sqrt(dx * dx + dy * dy);
  if (len < 0.001) return;
  const nx = dy / len;
  const ny = -dx / len;
  beginShape();
  normal(nx, ny, 0);
  vertex(x1, y1, ht);
  vertex(x2, y2, ht);
  vertex(x2, y2, -ht);
  vertex(x1, y1, -ht);
  endShape(CLOSE);
}
