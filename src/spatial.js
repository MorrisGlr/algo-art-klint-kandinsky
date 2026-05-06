import { CONFIG } from './config.js';
import { KLINT_KANDINSKY } from './klint-kandinsky.js';

const { cols: GRID_COLS, rows: GRID_ROWS, skipProbability: CELL_SKIP_PROBABILITY, jitterFraction: CELL_JITTER_FRACTION } = KLINT_KANDINSKY.grid;

export function computeGridCells(canvasWidth, canvasHeight, cols, rows, margin) {
  const usableW = canvasWidth - 2 * margin;
  const usableH = canvasHeight - 2 * margin;
  const cellW = usableW / cols;
  const cellH = usableH / rows;
  const cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: -canvasWidth / 2 + margin + cellW * (c + 0.5),
        y: -canvasHeight / 2 + margin + cellH * (r + 0.5),
        cellW,
        cellH,
      });
    }
  }
  return cells;
}

export function computePlacementPositions() {
  const cells = computeGridCells(
    CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT,
    GRID_COLS, GRID_ROWS, CONFIG.MARGIN
  );

  // Skip cells probabilistically for negative space
  const surviving = cells.filter(() => random() > CELL_SKIP_PROBABILITY);

  // Jitter each cell position within bounds
  const jittered = surviving.map((cell) => ({
    x: cell.x + random(-cell.cellW * CELL_JITTER_FRACTION, cell.cellW * CELL_JITTER_FRACTION),
    y: cell.y + random(-cell.cellH * CELL_JITTER_FRACTION, cell.cellH * CELL_JITTER_FRACTION),
  }));

  // Fisher-Yates shuffle for non-obvious sequential order
  for (let i = jittered.length - 1; i > 0; i--) {
    const j = Math.floor(random(i + 1));
    [jittered[i], jittered[j]] = [jittered[j], jittered[i]];
  }

  return jittered.slice(0, CONFIG.MAX_SHAPES);
}
