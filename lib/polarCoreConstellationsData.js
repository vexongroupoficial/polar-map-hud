// lib/dataPolarCoreConstellations.js

export const POLARIS_STAR = {
  id: 'polaris',
  name: 'Polaris (α UMi)',
  ra: 37.95,
  dec: 89.26,
  mag: 1.98,
  color: '#38bdf8'
};

export const CORE_CIRCUMPOLAR_CONSTELLATIONS = [
  // 1. Osa Menor
  {
    id: 'ursa_minor_body',
    name: 'OSA MENOR',
    symbol: '🐻‍❄️',
    color: '#38bdf8',
    stars: [
      { name: 'Yildun', ra: 264.5, dec: 86.6, mag: 4.3 },
      { name: 'Epsilon UMi', ra: 254.0, dec: 82.0, mag: 4.2 },
      { name: 'Zeta UMi', ra: 237.0, dec: 77.8, mag: 4.3 },
      { name: 'Kochab', ra: 222.9, dec: 74.1, mag: 2.08 }
    ],
    lines: [[0, 1], [1, 2], [2, 3]]
  },

  // 2. Osa Mayor
  {
    id: 'ursa_major',
    name: 'OSA MAYOR',
    symbol: '🐻',
    color: '#67e8f9',
    stars: [
      { name: 'Dubhe', ra: 165.9, dec: 61.75, mag: 1.79 },
      { name: 'Merak', ra: 165.4, dec: 56.38, mag: 2.37 },
      { name: 'Phecda', ra: 178.4, dec: 53.69, mag: 2.44 },
      { name: 'Megrez', ra: 183.8, dec: 57.03, mag: 3.31 },
      { name: 'Alioth', ra: 193.5, dec: 55.96, mag: 1.77 },
      { name: 'Mizar', ra: 200.9, dec: 54.92, mag: 2.23 },
      { name: 'Alkaid', ra: 206.8, dec: 49.31, mag: 1.86 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
  },

  // 3. Casiopea
  {
    id: 'cassiopeia',
    name: 'CASIOPEA',
    symbol: '👑',
    color: '#a5f3fc',
    stars: [
      { name: 'Segin', ra: 28.6, dec: 63.67, mag: 3.35 },
      { name: 'Ruchbah', ra: 20.2, dec: 60.23, mag: 2.68 },
      { name: 'Gama Cas', ra: 14.2, dec: 60.72, mag: 2.15 },
      { name: 'Schedar', ra: 10.1, dec: 56.54, mag: 2.24 },
      { name: 'Caph', ra: 2.3, dec: 59.15, mag: 2.28 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },

  // 4. Cefeo
  {
    id: 'cepheus',
    name: 'CEFEO',
    symbol: '🏠',
    color: '#38bdf8',
    stars: [
      { name: 'Alderamin', ra: 319.6, dec: 62.58, mag: 2.45 },
      { name: 'Alfirk', ra: 321.7, dec: 70.56, mag: 3.23 },
      { name: 'Errai', ra: 359.8, dec: 77.63, mag: 3.21 },
      { name: 'Iota Cephei', ra: 342.3, dec: 66.2, mag: 3.5 },
      { name: 'Zeta Cephei', ra: 332.7, dec: 58.2, mag: 3.35 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
  },

  // 5. El Dragón
  {
    id: 'draco',
    name: 'EL DRAGÓN',
    symbol: '🐉',
    color: '#0284c7',
    stars: [
      { name: 'Eltanin', ra: 269.7, dec: 51.48, mag: 2.24 },
      { name: 'Rastaban', ra: 262.6, dec: 52.3, mag: 2.79 },
      { name: 'Grumium', ra: 263.3, dec: 56.87, mag: 3.75 },
      { name: 'Thuban', ra: 209.6, dec: 64.37, mag: 3.67 },
      { name: 'Edasich', ra: 231.2, dec: 68.99, mag: 3.29 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },

  // 6. La Jirafa
  {
    id: 'camelopardalis',
    name: 'LA JIRAFA',
    symbol: '🦒',
    color: '#7dd3fc',
    stars: [
      { name: 'β Cam', ra: 76.3, dec: 60.43, mag: 4.03 },
      { name: 'α Cam', ra: 74.3, dec: 66.34, mag: 4.29 },
      { name: 'γ Cam', ra: 57.3, dec: 71.33, mag: 4.61 }
    ],
    lines: [[0, 1], [1, 2]]
  },

  // 7. El Lince (Sector Norte)
  {
    id: 'lynx',
    name: 'EL LINCE',
    symbol: '🐆',
    color: '#0ea5e9',
    stars: [
      { name: 'α Lyncis', ra: 140.3, dec: 64.38, mag: 3.14 },
      { name: '38 Lyncis', ra: 139.7, dec: 66.8, mag: 3.82 }
    ],
    lines: [[0, 1]]
  },

  // 8. El Cisne (Sector Septentrional)
  {
    id: 'cygnus_north',
    name: 'EL CISNE (NORTE)',
    symbol: '🦢',
    color: '#06b6d4',
    stars: [
      { name: 'Deneb', ra: 310.4, dec: 65.28, mag: 1.25 },
      { name: 'Sadr', ra: 305.6, dec: 60.26, mag: 2.23 }
    ],
    lines: [[0, 1]]
  },

  // 9. El Lagarto
  {
    id: 'lacerta',
    name: 'EL LAGARTO',
    symbol: '🦎',
    color: '#67e8f9',
    stars: [
      { name: 'α Lacertae', ra: 337.8, dec: 60.28, mag: 3.76 },
      { name: 'β Lacertae', ra: 337.2, dec: 62.22, mag: 4.43 }
    ],
    lines: [[0, 1]]
  }
];