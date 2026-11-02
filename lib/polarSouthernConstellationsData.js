// lib/dataPolarSouthernConstellations.js

/**
 * ANILLO PERIFÉRICO AUSTRAL: 32 CONSTELACIONES (-30° Dec a -90° Dec)
 */

export const SOUTHERN_CONSTELLATIONS = [
  // 1. La Cruz del Sur (Eje Guía Austral)
  {
    id: 'crux',
    name: 'CRUZ DEL SUR',
    symbol: '✝️',
    color: '#38bdf8',
    stars: [
      { name: 'Acrux (α Cru)', ra: 186.6, dec: -63.1, mag: 0.77 },
      { name: 'Mimosa (β Cru)', ra: 191.9, dec: -59.7, mag: 1.25 },
      { name: 'Gacrux (γ Cru)', ra: 187.8, dec: -57.1, mag: 1.64 },
      { name: 'Imai (δ Cru)', ra: 183.8, dec: -58.7, mag: 2.79 }
    ],
    lines: [[0, 2], [1, 3]]
  },

  // 2. Centauro (Cuerpo Principal Austral)
  {
    id: 'centaurus_south',
    name: 'CENTAURO (SUR)',
    symbol: '🐎',
    color: '#60a5fa',
    stars: [
      { name: 'Alfa Centauri (Rigil Kent)', ra: 219.9, dec: -60.8, mag: -0.27 },
      { name: 'Hadar (β Centauri)', ra: 210.9, dec: -60.4, mag: 0.61 },
      { name: 'Menkent (θ Centauri)', ra: 211.7, dec: -36.4, mag: 2.06 }
    ],
    lines: [[0, 1], [1, 2]]
  },

  // 3. Carina (La Quilla)
  {
    id: 'carina',
    name: 'CARINA',
    symbol: '⛵',
    color: '#38bdf8',
    stars: [
      { name: 'Canopus (α Car)', ra: 95.9, dec: -52.7, mag: -0.74 },
      { name: 'Miaplacidus (β Car)', ra: 138.3, dec: -69.7, mag: 1.67 },
      { name: 'Avior (ε Car)', ra: 125.6, dec: -59.5, mag: 1.86 }
    ],
    lines: [[0, 2], [2, 1]]
  },

  // 4. Vela
  {
    id: 'vela',
    name: 'VELA',
    symbol: '⛵',
    color: '#93c5fd',
    stars: [
      { name: 'Suhail (λ Vel)', ra: 137.0, dec: -43.4, mag: 2.23 },
      { name: 'Koo She (δ Vel)', ra: 139.7, dec: -54.7, mag: 1.96 },
      { name: 'Markeb (κ Vel)', ra: 140.5, dec: -55.0, mag: 2.47 }
    ],
    lines: [[0, 1], [1, 2]]
  },

  // 5. Puppis (La Popa)
  {
    id: 'puppis',
    name: 'PUPPIS',
    symbol: '🚢',
    color: '#bfdbfe',
    stars: [
      { name: 'Naos (ζ Pup)', ra: 120.9, dec: -40.0, mag: 2.21 },
      { name: 'Ahadi (ρ Pup)', ra: 122.7, dec: -24.3, mag: 2.83 }
    ],
    lines: [[0, 1]]
  },

  // 6. Octans (El Octante - Polo Sur Celeste Exacto)
  {
    id: 'octans',
    name: 'OCTANS (POLO SUR)',
    symbol: '🌐',
    color: '#0284c7',
    stars: [
      { name: 'Sigma Octantis (Polaris Australis)', ra: 317.2, dec: -88.9, mag: 5.42 },
      { name: 'Nu Octantis', ra: 320.5, dec: -77.4, mag: 3.73 },
      { name: 'Beta Octantis', ra: 337.0, dec: -81.4, mag: 4.13 }
    ],
    lines: [[0, 1], [1, 2], [2, 0]]
  },

  // 7. Erídano (Sector Sur / Achernar)
  {
    id: 'eridanus_south',
    name: 'ERÍDANO (SUR)',
    symbol: '🌊',
    color: '#38bdf8',
    stars: [
      { name: 'Achernar (α Eri)', ra: 24.4, dec: -57.2, mag: 0.45 },
      { name: 'Acamar (θ Eri)', ra: 44.5, dec: -40.3, mag: 2.88 }
    ],
    lines: [[0, 1]]
  },

  // 8. Tucana (El Tucán)
  {
    id: 'tucana',
    name: 'TUCANA',
    symbol: '🦜',
    color: '#7dd3fc',
    stars: [
      { name: 'α Tucanae', ra: 334.6, dec: -60.2, mag: 2.87 },
      { name: 'γ Tucanae', ra: 348.8, dec: -58.2, mag: 3.99 }
    ],
    lines: [[0, 1]]
  },

  // 9. Pavo (El Pavo Real)
  {
    id: 'pavo',
    name: 'PAVO REAL',
    symbol: '🦚',
    color: '#38bdf8',
    stars: [
      { name: 'Peacock (α Pav)', ra: 306.4, dec: -56.7, mag: 1.94 },
      { name: 'β Pavonis', ra: 311.2, dec: -66.2, mag: 3.42 }
    ],
    lines: [[0, 1]]
  },

  // 10. Grus (La Grulla)
  {
    id: 'grus',
    name: 'LA GRULLA',
    symbol: '🦩',
    color: '#60a5fa',
    stars: [
      { name: 'Alnair (α Gru)', ra: 332.1, dec: -46.9, mag: 1.73 },
      { name: 'Tiaki (β Gru)', ra: 340.7, dec: -46.9, mag: 2.13 }
    ],
    lines: [[0, 1]]
  },

  // 11. Phoenix (El Fénix)
  {
    id: 'phoenix',
    name: 'EL FÉNIX',
    symbol: '🔥',
    color: '#f97316',
    stars: [
      { name: 'Ankaa (α Phe)', ra: 6.6, dec: -42.3, mag: 2.4 },
      { name: 'β Phoenicis', ra: 16.6, dec: -46.7, mag: 3.32 }
    ],
    lines: [[0, 1]]
  },

  // 12. Dorado (El Pez Dorado)
  {
    id: 'dorado',
    name: 'DORADO',
    symbol: '🐟',
    color: '#fbbf24',
    stars: [
      { name: 'α Doradus', ra: 68.0, dec: -55.0, mag: 3.3 },
      { name: 'β Doradus', ra: 83.4, dec: -62.5, mag: 3.76 }
    ],
    lines: [[0, 1]]
  },

  // 13. Columba (La Paloma)
  {
    id: 'columba',
    name: 'LA PALOMA',
    symbol: '🕊️',
    color: '#93c5fd',
    stars: [
      { name: 'Phact (α Col)', ra: 84.9, dec: -34.1, mag: 2.65 },
      { name: 'Wazn (β Col)', ra: 87.7, dec: -35.8, mag: 3.12 }
    ],
    lines: [[0, 1]]
  },

  // 14. Hydrus (Hidra Macho)
  {
    id: 'hydrus',
    name: 'HIDRA MACHO',
    symbol: '🐍',
    color: '#38bdf8',
    stars: [
      { name: 'β Hydri', ra: 6.4, dec: -77.3, mag: 2.8 },
      { name: 'α Hydri', ra: 29.7, dec: -61.6, mag: 2.86 }
    ],
    lines: [[0, 1]]
  },

  // 15. Horologium (El Reloj)
  {
    id: 'horologium',
    name: 'EL RELOJ',
    symbol: '🕰️',
    color: '#94a3b8',
    stars: [
      { name: 'α Horologii', ra: 48.6, dec: -42.3, mag: 3.85 },
      { name: 'δ Horologii', ra: 62.1, dec: -41.9, mag: 4.93 }
    ],
    lines: [[0, 1]]
  },

  // 16. Reticulum (La Red)
  {
    id: 'reticulum',
    name: 'LA RED',
    symbol: '🕸️',
    color: '#cbd5e1',
    stars: [
      { name: 'α Reticuli', ra: 56.1, dec: -62.5, mag: 3.33 },
      { name: 'β Reticuli', me: 55.3, dec: -64.8, mag: 3.84 }
    ],
    lines: [[0, 1]]
  },

  // 17. Mensa (La Mesa / Monte Mesa)
  {
    id: 'mensa',
    name: 'LA MESA',
    symbol: '🏔️',
    color: '#64748b',
    stars: [
      { name: 'α Mensae', ra: 94.4, dec: -74.7, mag: 5.08 },
      { name: 'γ Mensae', ra: 84.3, dec: -76.3, mag: 5.18 }
    ],
    lines: [[0, 1]]
  },

  // 18. Volans (El Pez Volador)
  {
    id: 'volans',
    name: 'PEZ VOLADOR',
    symbol: '✈️',
    color: '#38bdf8',
    stars: [
      { name: 'γ2 Volantis', ra: 107.1, dec: -70.8, mag: 3.78 },
      { name: 'β Volantis', ra: 126.4, dec: -66.1, mag: 3.77 }
    ],
    lines: [[0, 1]]
  },

  // 19. Chamaeleon (El Camaleón)
  {
    id: 'chamaeleon',
    name: 'EL CAMALEÓN',
    symbol: '🦎',
    color: '#4ade80',
    stars: [
      { name: 'γ Chamaeleontis', ra: 161.8, dec: -78.6, mag: 4.11 },
      { name: 'α Chamaeleontis', ra: 124.7, dec: -76.9, mag: 4.05 }
    ],
    lines: [[0, 1]]
  },

  // 20. Musca (La Mosca)
  {
    id: 'musca',
    name: 'LA MOSCA',
    symbol: '🪰',
    color: '#a7f3d0',
    stars: [
      { name: 'α Muscae', ra: 189.3, dec: -69.1, mag: 2.69 },
      { name: 'β Muscae', ra: 191.6, dec: -68.1, mag: 3.04 }
    ],
    lines: [[0, 1]]
  },

  // 21. Apus (El Ave del Paraíso)
  {
    id: 'apus',
    name: 'AVE DEL PARAÍSO',
    symbol: '🐦',
    color: '#f472b6',
    stars: [
      { name: 'α Apodis', ra: 221.9, dec: -79.0, mag: 3.83 },
      { name: 'γ Apodis', ra: 248.4, dec: -78.9, mag: 3.86 }
    ],
    lines: [[0, 1]]
  },

  // 22. Triangulum Australe (Triángulo Austral)
  {
    id: 'triangulum_australe',
    name: 'TRIÁNGULO AUSTRAL',
    symbol: '🔻',
    color: '#60a5fa',
    stars: [
      { name: 'Atria (α TrA)', ra: 252.2, dec: -69.0, mag: 1.91 },
      { name: 'β Trianguli Australis', ra: 238.8, dec: -63.4, mag: 2.83 },
      { name: 'γ Trianguli Australis', ra: 230.9, dec: -68.7, mag: 2.87 }
    ],
    lines: [[0, 1], [1, 2], [2, 0]]
  },

  // 23. Circinus (El Compás)
  {
    id: 'circinus',
    name: 'EL COMPÁS',
    symbol: '📐',
    color: '#38bdf8',
    stars: [
      { name: 'α Circini', ra: 220.6, dec: -64.9, mag: 3.19 },
      { name: 'β Circini', ra: 229.3, dec: -58.8, mag: 4.07 }
    ],
    lines: [[0, 1]]
  },

  // 24. Norma (La Regla)
  {
    id: 'norma',
    name: 'LA REGLA',
    symbol: '📏',
    color: '#94a3b8',
    stars: [
      { name: 'γ2 Normae', ra: 244.9, dec: -50.1, mag: 4.01 },
      { name: 'γ1 Normae', ra: 244.3, dec: -50.1, mag: 4.97 }
    ],
    lines: [[0, 1]]
  },

  // 25. Lupus (Sector Sur)
  {
    id: 'lupus_south',
    name: 'LOBO (SUR)',
    symbol: '🐺',
    color: '#e11d48',
    stars: [
      { name: 'α Lupi', ra: 219.8, dec: -47.4, mag: 2.3 },
      { name: 'β Lupi', ra: 224.6, dec: -43.1, mag: 2.68 }
    ],
    lines: [[0, 1]]
  },

  // 26. Ara (El Altar - Cuerpo Principal Sur)
  {
    id: 'ara_south',
    name: 'ALTAR (SUR)',
    symbol: '🏛️',
    color: '#fbbf24',
    stars: [
      { name: 'β Arae', ra: 261.3, dec: -55.5, mag: 2.85 },
      { name: 'α Arae', ra: 263.4, dec: -49.8, mag: 2.93 }
    ],
    lines: [[0, 1]]
  },

  // 27. Corona Australis (Corona Austral)
  {
    id: 'corona_australis',
    name: 'CORONA AUSTRAL',
    symbol: '👑',
    color: '#38bdf8',
    stars: [
      { name: 'Meridiana (α CrA)', ra: 287.3, dec: -37.9, mag: 4.1 },
      { name: 'β Coronae Australis', ra: 287.6, dec: -39.3, mag: 4.11 }
    ],
    lines: [[0, 1]]
  },

  // 28. Telescopium (El Telescopio)
  {
    id: 'telescopium',
    name: 'EL TELESCOPIO',
    symbol: '🔭',
    color: '#06b6d4',
    stars: [
      { name: 'α Telescopii', ra: 277.4, dec: -45.9, mag: 3.49 },
      { name: 'ζ Telescopii', ra: 277.2, dec: -49.0, mag: 4.1 }
    ],
    lines: [[0, 1]]
  },

  // 29. Microscopium (El Microcopio)
  {
    id: 'microscopium',
    name: 'EL MICROSCOPIO',
    symbol: '🔬',
    color: '#64748b',
    stars: [
      { name: 'γ Microscopii', ra: 315.3, dec: -32.2, mag: 4.67 },
      { name: 'α Microscopii', ra: 314.9, dec: -33.8, mag: 4.89 }
    ],
    lines: [[0, 1]]
  },

  // 30. Caelum (El Cincel)
  {
    id: 'caelum',
    name: 'EL CINCEL',
    symbol: '🔨',
    color: '#cbd5e1',
    stars: [
      { name: 'α Caeli', ra: 70.1, dec: -41.8, mag: 4.45 },
      { name: 'γ1 Caeli', ra: 72.7, dec: -35.5, mag: 4.55 }
    ],
    lines: [[0, 1]]
  },

  // 31. Sculptor (Sector Sur)
  {
    id: 'sculptor_south',
    name: 'ESCULTOR (SUR)',
    symbol: '🗿',
    color: '#38bdf8',
    stars: [
      { name: 'α Sculptoris', ra: 14.6, dec: -29.3, mag: 4.31 },
      { name: 'β Sculptoris', ra: 357.2, dec: -37.8, mag: 4.38 }
    ],
    lines: [[0, 1]]
  },

  // 32. Fornax (El Horno)
  {
    id: 'fornax',
    name: 'EL HORNO',
    symbol: '🌋',
    color: '#f97316',
    stars: [
      { name: 'Dalim (α For)', ra: 48.0, dec: -32.3, mag: 3.87 },
      { name: 'β Fornacis', ra: 42.3, dec: -32.4, mag: 4.46 }
    ],
    lines: [[0, 1]]
  }
];