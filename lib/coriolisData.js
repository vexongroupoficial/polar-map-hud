// lib/coriolisData.js

// =========================================================================
// 1. ZONAS Y ANILLOS DE INTENSIDAD DEL PARÁMETRO DE CORIOLIS (f = 2Ω sin φ)
// =========================================================================
export const CORIOLIS_BELTS = [
  {
    id: 'north_pole_max',
    name: 'POLO NORTE (f = f_max)',
    lat: 90,
    info: 'Deflexión máxima a la derecha | 2Ω sin(90°)',
    color: 'rgba(56, 189, 248, 0.4)',
    strokeColor: '#38bdf8',
  },
  {
    id: 'tropic_cancer',
    name: 'TRÓPICO DE CÁNCER (23.5°N)',
    lat: 23.5,
    info: 'Alta presión subtropical / Alisios del NE',
    color: 'rgba(245, 158, 11, 0.25)',
    strokeColor: '#f59e0b',
  },
  {
    id: 'equator_zero',
    name: 'ECUADOR TEÓRICO (f = 0)',
    lat: 0,
    info: 'Fuerza de Coriolis nula | ITCZ Zona de Calmas',
    color: 'rgba(239, 68, 68, 0.5)',
    strokeColor: '#ef4444',
  },
  {
    id: 'tropic_capricorn',
    name: 'TRÓPICO DE CAPRICORNIO (-23.5°S)',
    lat: -23.5,
    info: 'Alta presión subtropical / Alisios del SE',
    color: 'rgba(245, 158, 11, 0.25)',
    strokeColor: '#f59e0b',
  },
  {
    id: 'south_pole_max',
    name: 'PERÍMETRO ANTÁRTICO (-90°S)',
    lat: -90,
    info: 'Deflexión máxima a la izquierda | 2Ω sin(-90°)',
    color: 'rgba(168, 85, 247, 0.4)',
    strokeColor: '#c084fc',
  }
];

// =========================================================================
// 2. CÉLULAS DE CIRCULACIÓN ATMOSFÉRICA Y TRAZADOS VECTORIALES DE VIENTO
// =========================================================================
export const CORIOLIS_CIRCULATION_CELLS = [
  // ---------------- HEMISFERIO NORTE (Deflexión a la DERECHA) ----------------
  {
    id: 'polar_cell_north',
    name: 'CÉLULA POLAR NORTE',
    hemisphere: 'N',
    latStart: 90,
    latEnd: 60,
    windName: 'Vientos Polares del Este',
    deflectionDir: 1, // Derecha
    color: '#38bdf8',
    particleSpeed: 0.12,
  },
  {
    id: 'ferrel_cell_north',
    name: 'CÉLULA DE FERREL (NORTE)',
    hemisphere: 'N',
    latStart: 30,
    latEnd: 60,
    windName: 'Vientos del Oeste (Westerlies)',
    deflectionDir: 1, // Derecha
    color: '#60a5fa',
    particleSpeed: 0.15,
  },
  {
    id: 'hadley_cell_north',
    name: 'CÉLULA DE HADLEY (NORTE)',
    hemisphere: 'N',
    latStart: 30,
    latEnd: 0,
    windName: 'Alisios del Nordeste (NE Trades)',
    deflectionDir: 1, // Derecha
    color: '#f59e0b',
    particleSpeed: 0.18,
  },

  // ---------------- HEMISFERIO SUR (Deflexión a la IZQUIERDA) ----------------
  {
    id: 'hadley_cell_south',
    name: 'CÉLULA DE HADLEY (SUR)',
    hemisphere: 'S',
    latStart: 0,
    latEnd: -30,
    windName: 'Alisios del Sudeste (SE Trades)',
    deflectionDir: -1, // Izquierda
    color: '#f97316',
    particleSpeed: 0.18,
  },
  {
    id: 'ferrel_cell_south',
    name: 'CÉLULA DE FERREL (SUR)',
    hemisphere: 'S',
    latStart: -30,
    latEnd: -60,
    windName: 'Vientos del Oeste del Sur',
    deflectionDir: -1, // Izquierda
    color: '#a855f7',
    particleSpeed: 0.15,
  },
  {
    id: 'polar_cell_south',
    name: 'CÉLULA POLAR SUR',
    hemisphere: 'S',
    latStart: -60,
    latEnd: -90,
    windName: 'Vientos Polares del Sur',
    deflectionDir: -1, // Izquierda
    color: '#c084fc',
    particleSpeed: 0.12,
  }
];