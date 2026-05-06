// Painter registry — the single place that knows which profiles exist.
// To add a new painter: import its profile here and add it to PAINTERS.
// The active profile is selected at runtime via ?painter=<key> in the URL.
import { KLINT_KANDINSKY } from './klint-kandinsky.js';
import { MONDRIAN } from './mondrian.js';

export const PAINTERS = {
  'klint-kandinsky': KLINT_KANDINSKY,
  'mondrian': MONDRIAN,
};

export const DEFAULT_PAINTER = 'klint-kandinsky';
