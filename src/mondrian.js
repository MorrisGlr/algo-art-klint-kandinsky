// Painter profile: Piet Mondrian
// Covers both his Classic Neoplasticism period (1920s–30s) and late
// Boogie-Woogie period (1942–44). HSB values derived from the source paintings.
// Tight variation values honor Mondrian's color precision.
// shapeTypes restricts to rectangles only — his mature work uses no diagonals or curves.
export const MONDRIAN = {
  gradientLerpAmount: 0,
  lightingMode: 'flat',
  palettes: [
    {
      name: 'Mondrian Red Yellow Blue',
      source: 'Composition with Red, Blue and Yellow (1930)',
      background: [40, 5, 97],  // near-white with slight warmth
      colors: [
        [2, 95, 80],    // primary red
        [50, 96, 98],   // primary yellow
        [220, 92, 62],  // deep ultramarine blue
        [0, 0, 8],      // near-black
        [40, 5, 93],    // off-white (large neutral planes)
      ],
      variation: { hue: 2, saturation: 3, brightness: 3 },
    },
    {
      name: 'Mondrian Composition A',
      source: 'Composition A (1923)',
      background: [0, 0, 98],   // pure white
      colors: [
        [218, 90, 68],  // deep blue (large plane)
        [3, 95, 80],    // red
        [50, 95, 96],   // yellow
        [0, 0, 6],      // black
        [0, 0, 70],     // mid gray
      ],
      variation: { hue: 2, saturation: 3, brightness: 3 },
    },
    {
      name: 'Mondrian Tableau I',
      source: 'Tableau I (1921)',
      background: [45, 8, 96],  // warm cream-white
      colors: [
        [4, 94, 78],    // red
        [48, 95, 96],   // yellow
        [222, 88, 60],  // blue
        [0, 0, 7],      // black
        [35, 8, 78],    // warm gray
      ],
      variation: { hue: 2, saturation: 3, brightness: 3 },
    },
    {
      name: 'Mondrian Broadway Boogie-Woogie',
      source: 'Broadway Boogie-Woogie (1942–43)',
      background: [42, 12, 95], // warm cream
      colors: [
        [52, 96, 98],   // vivid yellow (dominant grid color)
        [2, 95, 85],    // red
        [218, 90, 72],  // blue
        [28, 88, 90],   // warm orange accent
        [0, 0, 72],     // light gray
      ],
      variation: { hue: 2, saturation: 3, brightness: 4 },
    },
    {
      name: 'Mondrian Victory Boogie-Woogie',
      source: 'Victory Boogie-Woogie (1944)',
      background: [45, 10, 94], // cream
      colors: [
        [50, 95, 98],   // yellow
        [8, 92, 85],    // red-orange
        [215, 88, 72],  // blue
        [128, 72, 65],  // green accent
        [35, 8, 75],    // warm gray
      ],
      variation: { hue: 2, saturation: 3, brightness: 4 },
    },
  ],
  grid: {
    cols: 4,
    rows: 6,
    skipProbability: 0.4,
    jitterFraction: 0.15,
  },
  shapeTypes: ['rectangle'],
  rotationMode: 'fixed',
};
