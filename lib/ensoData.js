// lib/ensoData.js

// =========================================================================
// 1. PACÍFICO ECUATORIAL (EL NIÑO / LA NIÑA - ENSO)
// =========================================================================
export const ENSO_ANOMALIES_REGIONS = {
  elNino: {
    id: 'el_nino_warm_pool',
    name: 'EL NIÑO (FASE CÁLIDA)',
    info: 'Debilitamiento de Alisios | Calentamiento SST en Sudamérica',
    color: 'rgba(239, 68, 68, 0.35)',
    strokeColor: '#ef4444',
    glowColor: '#f87171',
    polygon: [
      [10.0, -170.0], [10.0, -85.0], [2.0, -78.0],
      [-15.0, -78.0], [-15.0, -140.0], [-5.0, -170.0]
    ],
    centerLat: -2.0,
    centerLon: -120.0,
    windSpeed: 0.05
  },
  laNina: {
    id: 'la_nina_cold_tongue',
    name: 'LA NIÑA (FASE FRÍA)',
    info: 'Alisios Intensificados | Afloramiento Frío Perú/Ecuador',
    color: 'rgba(6, 182, 212, 0.35)',
    strokeColor: '#06b6d4',
    glowColor: '#38bdf8',
    polygon: [
      [8.0, -140.0], [6.0, -82.0], [-4.0, -80.0],
      [-18.0, -75.0], [-12.0, -120.0], [-4.0, -140.0]
    ],
    centerLat: -4.0,
    centerLon: -105.0,
    westWarmPool: {
      lat: 2.0, lon: 135.0, radiusKm: 280,
      color: 'rgba(245, 158, 11, 0.4)', strokeColor: '#f59e0b'
    },
    windSpeed: 0.22
  }
};

export const EQUATORIAL_TRADE_WINDS = [
  { latStart: 8.0, lonStart: -85.0, latEnd: 0.0, lonEnd: -160.0 },
  { latStart: 0.0, lonStart: -90.0, latEnd: -5.0, lonEnd: -170.0 },
  { latStart: -10.0, lonStart: -75.0, latEnd: -12.0, lonEnd: -150.0 }
];

// =========================================================================
// 2. VECTORES DE LA CORRIENTE DEL GOLFO / AMOC (CINTA TRANSPORTADORA)
// =========================================================================
export const GULF_STREAM_AMOC_PATH = [
  { lat: 24.5, lon: -80.5 }, // Estrecho de Florida / Caribe
  { lat: 32.0, lon: -78.0 }, // Costa Este de EE. UU. (Hatteras)
  { lat: 38.5, lon: -65.0 }, // Deriva del Atlántico Norte
  { lat: 45.0, lon: -40.0 }, // Giro Subpolar Central
  { lat: 54.0, lon: -20.0 }, // Aproximación a Europa / Reino Unido
  { lat: 62.0, lon: -10.0 }  // Mar de Noruega / Ártico
];

// =========================================================================
// 3. ANOMALÍAS OCEÁNICAS GLOBALES (ÍNDICO, ATLÁNTICO Y PACÍFICO NORTE)
// =========================================================================
export const OTHER_OCEANIC_ANOMALIES = [
  // ---------------- DIPOLO DEL OCÉANO ÍNDICO (IOD) ----------------
  {
    id: 'indian_ocean_dipole',
    name: 'DIPOLO DEL ÍNDICO (IOD)',
    region: 'Océano Índico (África - Indonesia)',
    info: 'El Niño del Índico | Oscilación Térmica Ecuatorial',
    lat: -3.0,
    lon: 75.0,
    color: 'rgba(245, 158, 11, 0.30)',
    strokeColor: '#f59e0b',
    glowColor: '#fbbf24',
    polygon: [
      [5.0, 50.0], [8.0, 95.0], [-10.0, 105.0],
      [-15.0, 80.0], [-10.0, 48.0]
    ]
  },

  // ---------------- ANOMALÍA DEL ATLÁNTICO NORTE (NAO / AMO / CORRIENTE DEL GOLFO) ----------------
  {
    id: 'atlantic_multidecadal',
    name: 'ANOMALÍA DEL ATLÁNTICO NORTE (NAO / AMO)',
    region: 'Atlántico Norte (Azores - Islandia)',
    info: 'Transporte Térmico AMOC & Corriente del Golfo',
    lat: 38.0,
    lon: -42.0,
    color: 'rgba(56, 189, 248, 0.28)',
    strokeColor: '#38bdf8',
    glowColor: '#7dd3fc',
    polygon: [
      [58.0, -45.0], [48.0, -18.0], [25.0, -32.0],
      [20.0, -62.0], [42.0, -58.0]
    ],
    // Cold Blob al sur de Groenlandia
    coldBlob: {
      lat: 56.0,
      lon: -35.0,
      radiusKm: 260,
      color: 'rgba(14, 165, 233, 0.35)',
      strokeColor: '#0284c7'
    }
  },

  // ---------------- OLA DE CALOR MARINA "THE BLOB" ----------------
  {
    id: 'pacific_the_blob',
    name: 'OLA DE CALOR "THE BLOB"',
    region: 'Pacífico Norte (Alaska / Cascadia)',
    info: 'Anomalía Térmica Marina de Alta Intensidad',
    lat: 48.0,
    lon: -140.0,
    color: 'rgba(239, 68, 68, 0.38)',
    strokeColor: '#ef4444',
    glowColor: '#f87171',
    radiusKm: 320
  }
];