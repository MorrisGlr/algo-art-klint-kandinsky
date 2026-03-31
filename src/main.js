import { initSketch } from './sketch.js';

// Assign p5 global-mode lifecycle functions BEFORE loading p5,
// since p5 1.x detects window.setup/draw on load to auto-launch.
initSketch();

await import('p5');
