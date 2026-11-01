// lib/volcanicData.js

// =========================================================================
// 1. DELIMITACIÓN VECTORIAL DEL CINTURÓN DE FUEGO DEL PACÍFICO (>75% Volcanes)
// =========================================================================
export const PACIFIC_RING_OF_FIRE = [
  [-45.0, 170.0],  // Nueva Zelanda
  [-10.0, 150.0],  // Oceanía / Melanesia
  [-6.0,  105.0],  // Indonesia (Krakatoa / Sunda)
  [14.0,  121.0],  // Filipinas
  [35.0,  139.0],  // Japón (Fuji)
  [55.0,  160.0],  // Kamchatka
  [60.0, -150.0],  // Alaska / Aleutianas
  [45.0, -122.0],  // Costa Oeste de EE. UU. (Cascadas)
  [19.0,  -98.0],  // México (Eje Neovolcánico)
  [14.0,  -90.0],  // Centroamérica
  [-0.6,  -78.0],  // Andes del Norte (Ecuador)
  [-27.0, -68.0],  // Andes Centrales (Chile / Argentina)
  [-55.0, -68.0]   // Tierra del Fuego
];

// =========================================================================
// 2. CATÁLOGO GLOBAL DE VOLCANES CLASIFICADOS POR ESTADO
// =========================================================================
export const GLOBAL_VOLCANOES = [
  // ---------------- 🔴 VOLCANES ACTIVOS (Erupciones Recientes / Magma Vivo) ----------------
  // América
  {
    id: 'popocatepetl',
    name: 'POPOCATÉPETL',
    status: 'active',
    region: 'México',
    info: 'Erupciones constantes de ceniza y gases',
    lat: 19.02, lon: -98.62, heightM: 5426,
    color: '#ef4444' // Rojo Neón Alerta
  },
  {
    id: 'volcan_fuego',
    name: 'VOLCÁN DE FUEGO',
    status: 'active',
    region: 'Guatemala',
    info: 'Flujos piroclásticos frecuentes',
    lat: 14.47, lon: -90.88, heightM: 3763,
    color: '#ef4444'
  },
  {
    id: 'cotopaxi',
    name: 'COTOPAXI',
    status: 'active',
    region: 'Ecuador',
    info: 'Estratovolcán activo en la Cordillera Real',
    lat: -0.68, lon: -78.44, heightM: 5897,
    color: '#ef4444'
  },
  {
    id: 'ojos_del_salado',
    name: 'OJOS DEL SALADO',
    status: 'active',
    region: 'Chile / Argentina',
    info: 'Volcán activo más alto del mundo (6.893 m)',
    lat: -27.11, lon: -68.54, heightM: 6893,
    color: '#ef4444'
  },
  // Asia y Oceanía
  {
    id: 'anak_krakatoa',
    name: 'ANAK KRAKATOA',
    status: 'active',
    region: 'Indonesia',
    info: 'Hijo del Krakatoa / Actividad explosiva',
    lat: -6.10, lon: 105.42, heightM: 157,
    color: '#ef4444'
  },
  {
    id: 'monte_merapi',
    name: 'MONTE MERAPI',
    status: 'active',
    region: 'Indonesia',
    info: 'Uno de los volcanes más peligrosos del planeta',
    lat: -7.54, lon: 110.44, heightM: 2910,
    color: '#ef4444'
  },
  {
    id: 'kilauea',
    name: 'KĪLAUEA',
    status: 'active',
    region: 'Hawái (EE. UU.)',
    info: 'Lago de lava constante y coladas de basalto',
    lat: 19.42, lon: -155.29, heightM: 1247,
    color: '#ef4444'
  },
  {
    id: 'mauna_loa',
    name: 'MAUNA LOA',
    status: 'active',
    region: 'Hawái (EE. UU.)',
    info: 'Volcán más masivo de la Tierra',
    lat: 19.47, lon: -155.60, heightM: 4169,
    color: '#ef4444'
  },
  // Europa y África
  {
    id: 'etna',
    name: 'MONTE ETNA',
    status: 'active',
    region: 'Sicilia (Italia)',
    info: 'Volcán activo más alto de Europa',
    lat: 37.75, lon: 15.00, heightM: 3357,
    color: '#ef4444'
  },
  {
    id: 'estromboli',
    name: 'ESTRÓMBOLI',
    status: 'active',
    region: 'Italia',
    info: 'Faro del Mediterráneo / Erupciones estrombolianas',
    lat: 38.79, lon: 15.21, heightM: 926,
    color: '#ef4444'
  },
  {
    id: 'cumbre_vieja',
    name: 'CUMBRE VIEJA / TAJOGAITE',
    status: 'active',
    region: 'La Palma (España)',
    info: 'Dorsal volcánica activa de Canarias',
    lat: 28.61, lon: -17.86, heightM: 1949,
    color: '#ef4444'
  },
  {
    id: 'nyiragongo',
    name: 'MONTE NYIRAGONGO',
    status: 'active',
    region: 'R.D. del Congo',
    info: 'Lago de lava hiperfluido en el Valle del Rift',
    lat: -1.52, lon: 29.25, heightM: 3470,
    color: '#ef4444'
  },

  // ---------------- 🟠 VOLCANES DORMIDOS / LATENTES (Sistema Magmático Activo) ----------------
  {
    id: 'monte_fuji',
    name: 'MONTE FUJI',
    status: 'dormant',
    region: 'Japón',
    info: 'Estratovolcán latente / Última erupción en 1707',
    lat: 35.36, lon: 138.73, heightM: 3776,
    color: '#f59e0b' // Ámbar Neón
  },
  {
    id: 'teide',
    name: 'EL TEIDE',
    status: 'dormant',
    region: 'Tenerife (España)',
    info: 'Tercera estructura volcánica más alta del mundo',
    lat: 28.27, lon: -16.64, heightM: 3715,
    color: '#f59e0b'
  },
  {
    id: 'yellowstone',
    name: 'SUPERVOLCÁN YELLOWSTONE',
    status: 'dormant',
    region: 'Estados Unidos',
    info: 'Caldera magmática gigantesca latente',
    lat: 44.43, lon: -110.59, heightM: 2800,
    color: '#f59e0b'
  },

  // ---------------- 🟣 VOLCANES EXTINTOS (>25.000 años sin suministro) ----------------
  {
    id: 'chimborazo',
    name: 'VOLCÁN CHIMBORAZO',
    status: 'extinct',
    region: 'Ecuador',
    info: 'Punto más alejado del centro de la Tierra',
    lat: -1.46, lon: -78.81, heightM: 6263,
    color: '#a855f7' // Púrpura/Gris Neón
  },
  {
    id: 'kilimanjaro',
    name: 'KILIMANJARO (KIBO)',
    status: 'extinct',
    region: 'Tanzania',
    info: 'Cumbre más alta de África / Sistema inactivo',
    lat: -3.06, lon: 37.35, heightM: 5895,
    color: '#a855f7'
  }
];