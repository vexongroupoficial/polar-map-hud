// lib/dataPolarIntermediateConstellations.js

export const INTERMEDIATE_CONSTELLATIONS = [
  // SECTOR 1: ARIES (RA ~0° a 30°)
  { id: 'aries', name: 'ARIES', symbol: '♈', category: 'zodiacal', color: '#f87171', stars: [{ ra: 31.7, dec: 23.4, mag: 2.0 }, { ra: 28.7, dec: 20.8, mag: 2.6 }], lines: [[0, 1]] },
  { id: 'triangulum', name: 'EL TRIÁNGULO', symbol: '🔺', category: 'decanal', color: '#ef4444', stars: [{ ra: 27.2, dec: 29.6, mag: 3.4 }, { ra: 32.1, dec: 34.9, mag: 3.0 }], lines: [[0, 1]] },
  { id: 'andromeda_south', name: 'ANDRÓMEDA', symbol: '👸', category: 'decanal', color: '#fca5a5', stars: [{ ra: 2.1, dec: 29.1, mag: 2.06 }, { ra: 17.4, dec: 35.6, mag: 2.07 }], lines: [[0, 1]] },
  { id: 'perseus_south', name: 'PERSEO', symbol: '🛡️', category: 'decanal', color: '#f87171', stars: [{ ra: 51.1, dec: 49.8, mag: 1.79 }, { ra: 47.0, dec: 40.9, mag: 2.09 }], lines: [[0, 1]] },

  // SECTOR 2: TAURO (RA ~30° a 60°)
  { id: 'taurus', name: 'TAURO', symbol: '♉', category: 'zodiacal', color: '#4ade80', stars: [{ ra: 68.9, dec: 16.5, mag: 0.85 }, { ra: 81.6, dec: 28.6, mag: 1.65 }], lines: [[0, 1]] },
  { id: 'orion', name: 'ORIÓN', symbol: '🏹', category: 'decanal', color: '#22c55e', stars: [{ ra: 88.8, dec: 7.4, mag: 0.5 }, { ra: 78.6, dec: -8.2, mag: 0.13 }], lines: [[0, 1]] },
  { id: 'auriga', name: 'AURIGA', symbol: '🛷', category: 'decanal', color: '#86efac', stars: [{ ra: 79.2, dec: 46.0, mag: 0.08 }, { ra: 89.9, dec: 44.9, mag: 1.9 }], lines: [[0, 1]] },
  { id: 'eridanus_north', name: 'ERÍDANO', symbol: '🌊', category: 'decanal', color: '#4ade80', stars: [{ ra: 72.0, dec: -5.1, mag: 2.78 }, { ra: 59.5, dec: -13.5, mag: 2.97 }], lines: [[0, 1]] },

  // SECTOR 3: GÉMINIS (RA ~60° a 90°)
  { id: 'gemini', name: 'GÉMINIS', symbol: '♊', category: 'zodiacal', color: '#fef08a', stars: [{ ra: 116.2, dec: 28.0, mag: 1.14 }, { ra: 113.6, dec: 31.9, mag: 1.58 }], lines: [[0, 1]] },
  { id: 'canis_minor', name: 'CAN MENOR', symbol: '🐕', category: 'decanal', color: '#eab308', stars: [{ ra: 114.8, dec: 5.2, mag: 0.38 }, { ra: 111.8, dec: 8.3, mag: 2.89 }], lines: [[0, 1]] },
  { id: 'monoceros', name: 'UNICORNIO', symbol: '🦄', category: 'decanal', color: '#fde047', stars: [{ ra: 115.3, dec: -9.6, mag: 3.93 }, { ra: 93.7, dec: -6.3, mag: 3.98 }], lines: [[0, 1]] },
  { id: 'lepus', name: 'LA LIEBRE', symbol: '🐇', category: 'decanal', color: '#fef08a', stars: [ { ra: 83.2, dec: -17.8, mag: 2.58 },{ ra: 82.1, dec: -20.8, mag: 2.84 } ],lines: [[0, 1]] },
  
  // SECTOR 4: CÁNCER (RA ~90° a 120°)
  { id: 'cancer', name: 'CÁNCER', symbol: '♋', category: 'zodiacal', color: '#c084fc', stars: [{ ra: 124.1, dec: 9.2, mag: 3.5 }, { ra: 128.6, dec: 18.1, mag: 3.9 }], lines: [[0, 1]] },
  { id: 'canis_major', name: 'CAN MAYOR', symbol: '🌟', category: 'decanal', color: '#a855f7', stars: [{ ra: 101.3, dec: -16.7, mag: -1.46 }, { ra: 104.9, dec: -28.9, mag: 1.5 }], lines: [[0, 1]] },
  { id: 'hydra_head', name: 'HIDRA (CABEZA)', symbol: '🐍', category: 'decanal', color: '#c084fc', stars: [{ ra: 134.8, dec: 5.9, mag: 3.1 }, { ra: 128.7, dec: 6.4, mag: 3.4 }], lines: [[0, 1]] },
  { id: 'leo_minor', name: 'LEO MENOR', symbol: '🦁', category: 'decanal', color: '#e9d5ff', stars: [{ ra: 160.8, dec: 34.2, mag: 3.8 }, { ra: 157.0, dec: 36.7, mag: 4.2 }], lines: [[0, 1]] },

  // SECTOR 5: LEO (RA ~120° a 150°)
  { id: 'leo', name: 'LEO', symbol: '♌', category: 'zodiacal', color: '#fb923c', stars: [{ ra: 152.1, dec: 11.9, mag: 1.36 }, { ra: 177.3, dec: 14.6, mag: 2.14 }], lines: [[0, 1]] },
  { id: 'crater', name: 'LA COPA', symbol: '🍷', category: 'decanal', color: '#f97316', stars: [{ ra: 169.9, dec: -18.3, mag: 3.56 }, { ra: 171.8, dec: -22.8, mag: 4.0 }], lines: [[0, 1]] },
  { id: 'sextans', name: 'EL SEXTANTE', symbol: '📐', category: 'decanal', color: '#fdba74', stars: [{ ra: 153.2, dec: -0.4, mag: 4.48 }, { ra: 156.4, dec: -8.4, mag: 5.0 }], lines: [[0, 1]] },
  { id: 'coma_berenices', name: 'CABELLERA BERENICE', symbol: '💇‍♀️', category: 'decanal', color: '#ffedd5', stars: [{ ra: 197.8, dec: 27.1, mag: 4.2 }, { ra: 195.4, dec: 24.1, mag: 4.3 }], lines: [[0, 1]] },

  // SECTOR 6: VIRGO (RA ~150° a 180°)
  { id: 'virgo', name: 'VIRGO', symbol: '♍', category: 'zodiacal', color: '#a7f3d0', stars: [{ ra: 201.3, dec: -11.2, mag: 0.98 }, { ra: 190.4, dec: -1.4, mag: 2.74 }], lines: [[0, 1]] },
  { id: 'corvus', name: 'EL CUERVO', symbol: '🐦', category: 'decanal', color: '#34d399', stars: [{ ra: 187.0, dec: -24.7, mag: 2.58 }, { ra: 184.6, dec: -17.5, mag: 2.65 }], lines: [[0, 1]] },
  { id: 'bootes', name: 'BOOTES', symbol: '🌾', category: 'decanal', color: '#6ee7b7', stars: [{ ra: 213.9, dec: 19.1, mag: -0.05 }, { ra: 225.0, dec: 27.1, mag: 2.68 }], lines: [[0, 1]] },
  { id: 'centaurus_north', name: 'CENTAURO (NORTE)', symbol: '🐎', category: 'decanal', color: '#059669', stars: [{ ra: 206.9, dec: -27.8, mag: 2.06 }, { ra: 212.1, dec: -22.1, mag: 3.1 }], lines: [[0, 1]] },

  // SECTOR 7: LIBRA (RA ~180° a 210°)
  { id: 'libra', name: 'LIBRA', symbol: '♎', category: 'zodiacal', color: '#f472b6', stars: [{ ra: 229.2, dec: -9.4, mag: 2.6 }, { ra: 222.7, dec: -16.0, mag: 2.75 }], lines: [[0, 1]] },
  { id: 'serpens', name: 'SERPIENTE', symbol: '🐍', category: 'decanal', color: '#ec4899', stars: [{ ra: 236.1, dec: 6.4, mag: 2.63 }, { ra: 233.1, dec: 15.4, mag: 3.65 }], lines: [[0, 1]] },
  { id: 'corona_borealis', name: 'CORONA BOREAL', symbol: '👑', category: 'decanal', color: '#fbcfe8', stars: [{ ra: 233.7, dec: 26.7, mag: 2.22 }, { ra: 231.1, dec: 29.1, mag: 3.66 }], lines: [[0, 1]] },
  { id: 'lupus_north', name: 'LOBO (NORTE)', symbol: '🐺', category: 'decanal', color: '#db2777', stars: [{ ra: 222.0, dec: -29.8, mag: 3.4 }, { ra: 227.1, dec: -28.2, mag: 3.5 }], lines: [[0, 1]] },

  // SECTOR 8: ESCORPIO (RA ~210° a 240°)
  { id: 'scorpius', name: 'ESCORPIO', symbol: '♏', category: 'zodiacal', color: '#e11d48', stars: [{ ra: 247.4, dec: -26.4, mag: 1.05 }, { ra: 240.1, dec: -22.6, mag: 2.2 }], lines: [[0, 1]] },
  { id: 'ophiuchus', name: 'OFIUCO', symbol: '⚕️', category: 'decanal', color: '#be123c', stars: [{ ra: 263.7, dec: 12.5, mag: 2.08 }, { ra: 247.6, dec: -4.7, mag: 2.43 }], lines: [[0, 1]] },
  { id: 'hercules', name: 'HÉRCULES', symbol: '🏋️', category: 'decanal', color: '#fda4af', stars: [{ ra: 243.6, dec: 14.4, mag: 2.78 }, { ra: 257.2, dec: 31.6, mag: 2.81 }], lines: [[0, 1]] },
  { id: 'ara_north', name: 'ALTAR (NORTE)', symbol: '🏛️', category: 'decanal', color: '#9f1239', stars: [{ ra: 254.4, dec: -29.5, mag: 3.6 }, { ra: 256.0, dec: -28.0, mag: 4.0 }], lines: [[0, 1]] },

  // SECTOR 9: SAGITARIO (RA ~240° a 270°)
  { id: 'sagittarius', name: 'SAGITARIO', symbol: '♐', category: 'zodiacal', color: '#fbbf24', stars: [{ ra: 276.0, dec: -34.4, mag: 1.79 }, { ra: 283.8, dec: -26.3, mag: 2.05 }], lines: [[0, 1]] },
  { id: 'lyra', name: 'LA LIRA', symbol: '🪕', category: 'decanal', color: '#fef08a', stars: [{ ra: 279.2, dec: 38.7, mag: 0.03 }, { ra: 283.0, dec: 33.4, mag: 3.25 }], lines: [[0, 1]] },
  { id: 'aquila', name: 'EL ÁGUILA', symbol: '🦅', category: 'decanal', color: '#f59e0b', stars: [{ ra: 297.7, dec: 8.8, mag: 0.77 }, { ra: 298.8, dec: 10.6, mag: 2.72 }], lines: [[0, 1]] },
  { id: 'sagitta', name: 'LA FLECHA', symbol: '🏹', category: 'decanal', color: '#d97706', stars: [{ ra: 294.7, dec: 18.9, mag: 3.51 }, { ra: 296.6, dec: 19.5, mag: 4.37 }], lines: [[0, 1]] },

  // SECTOR 10: CAPRICORNIO (RA ~270° a 300°)
  { id: 'capricornus', name: 'CAPRICORNIO', symbol: '♑', category: 'zodiacal', color: '#94a3b8', stars: [{ ra: 326.8, dec: -16.1, mag: 2.8 }, { ra: 305.2, dec: -14.8, mag: 3.0 }], lines: [[0, 1]] },
  { id: 'vulpecula', name: 'LA ZORRILLA', symbol: '🦊', category: 'decanal', color: '#cbd5e1', stars: [{ ra: 296.3, dec: 24.6, mag: 4.44 }, { ra: 304.5, dec: 27.2, mag: 4.6 }], lines: [[0, 1]] },
  { id: 'delphinus', name: 'EL DELFÍN', symbol: '🐬', category: 'decanal', color: '#64748b', stars: [{ ra: 309.8, dec: 15.9, mag: 3.63 }, { ra: 309.1, dec: 14.6, mag: 3.82 }], lines: [[0, 1]] },
  { id: 'equuleus', name: 'EL CABALLITO', symbol: '🐴', category: 'decanal', color: '#475569', stars: [{ ra: 318.9, dec: 5.2, mag: 3.92 }, { ra: 319.4, dec: 10.1, mag: 4.47 }], lines: [[0, 1]] },

  // SECTOR 11: ACUARIO (RA ~300° a 330°)
  { id: 'aquarius', name: 'ACUARIO', symbol: '♒', category: 'zodiacal', color: '#22d3ee', stars: [{ ra: 323.0, dec: -5.6, mag: 2.9 }, { ra: 331.4, dec: -0.3, mag: 2.95 }], lines: [[0, 1]] },
  { id: 'pegasus', name: 'PEGASO', symbol: '🦄', category: 'decanal', color: '#06b6d4', stars: [{ ra: 345.9, dec: 15.2, mag: 2.49 }, { ra: 344.4, dec: 28.1, mag: 2.42 }], lines: [[0, 1]] },
  { id: 'piscis_austrinus', name: 'PEZ AUSTRAL', symbol: '🐟', category: 'decanal', color: '#67e8f9', stars: [{ ra: 344.4, dec: -29.6, mag: 1.17 }, { ra: 331.7, dec: -32.4, mag: 4.2 }], lines: [[0, 1]] },
  { id: 'cetus_north', name: 'LA BALLENA (NORTE)', symbol: '🐋', category: 'decanal', color: '#0891b2', stars: [{ ra: 45.6, dec: 4.1, mag: 2.54 }, { ra: 39.8, dec: -10.3, mag: 3.5 }], lines: [[0, 1]] },

  // SECTOR 12: PISCIS (RA ~330° a 360°)
  { id: 'pisces', name: 'PISCIS', symbol: '♓', category: 'zodiacal', color: '#38bdf8', stars: [{ ra: 30.0, dec: 2.7, mag: 3.8 }, { ra: 345.0, dec: 7.6, mag: 4.5 }], lines: [[0, 1]] },
  { id: 'sculptor_north', name: 'ESCULTOR (NORTE)', symbol: '🗿', category: 'decanal', color: '#7dd3fc', stars: [{ ra: 14.5, dec: -29.3, mag: 4.3 }, { ra: 23.4, dec: -25.0, mag: 4.4 }], lines: [[0, 1]] }
];