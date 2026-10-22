// config/mapLayers.js

export const MAP_LAYER_CATEGORIES = {
  CARTOGRAPHY: 'CARTOGRAFÍA Y PAÍSES',
  GEODESY: 'ASTRONOMÍA Y RED GEODÉSICA',
  NAVIGATION: 'NAVEGACIÓN Y AMBIENTE',
  ANOMALIES: 'ANOMALÍAS Y ALINEACIONES',
};

export const MAP_LAYERS = [
  // --- CARTOGRAFÍA Y PAÍSES ---
  {
    id: 'continents',
    label: 'Continentes y Masa Terrestre',
    description: 'Polígonos continentales WGS84',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🗺️',
    defaultActive: true,
  },
  {
    id: 'labels',
    label: 'Nombres de Países y Ciudades',
    description: 'Nombres geográficos y fronteras',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🏷️',
    defaultActive: true,
  },
  {
    id: 'relief',
    label: 'Relieve y Cordilleras',
    description: 'Sombra topográfica y elevación',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🏔️',
    defaultActive: true,
  },
  {
    id: 'tectonics',
    label: 'Placas Tectónicas y Fosas',
    description: 'Límites geológicos y cinturón de fuego',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🌋',
    defaultActive: false,
  },

  // --- RED GEODÉSICA Y ASTRONOMÍA ---
  {
    id: 'graticule',
    label: 'Meridianos y Paralelos',
    description: 'Red de gráticula geodésica',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '🌐',
    defaultActive: true,
  },
  {
    id: 'equatorAndTropics',
    label: 'Ecuador y Trópicos',
    description: 'Paralelos clave a 0° y ±23.43°',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '📏',
    defaultActive: true,
  },
  {
    id: 'timeZones',
    label: 'Zonas Horarias (UTC)',
    description: 'Limbo graduado y husos de 15°',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '🕒',
    defaultActive: true,
  },
  {
    id: 'sunlight',
    label: 'Día / Noche (Sol Real)',
    description: 'Iluminación solar y proyección de noche',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '☀️',
    defaultActive: true,
  },

  // --- NAVEGACIÓN Y AMBIENTE ---
  {
    id: 'windCurrents',
    label: 'Vientos y Corrientes Chorro',
    description: 'Sistemas de viento global en tiempo real',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '💨',
    defaultActive: false,
  },
  {
    id: 'oceanTides',
    label: 'Mareas y Corrientes Oceánicas',
    description: 'Flujos marinos y cuencas térmicas',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '🌊',
    defaultActive: false,
  },
  {
    id: 'airports',
    label: 'Aeropuertos y Rutas Aéreas',
    description: 'Nodos IATA y ortodrómicas polares',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '✈️',
    defaultActive: false,
  },

  // --- ANOMALÍAS Y ALINEACIONES ---
  {
    id: 'bermudaTriangle',
    label: 'Triángulo de las Bermudas y Anomalías',
    description: 'Zonas de interferencia y fosas profundas',
    category: MAP_LAYER_CATEGORIES.ANOMALIES,
    icon: '⚠️',
    defaultActive: false,
  },
  {
    id: 'ancientSites',
    label: 'Pirámides y Sitios Antiguos',
    description: 'Marcadores de monumentos megalíticos',
    category: MAP_LAYER_CATEGORIES.ANOMALIES,
    icon: '🏛️',
    defaultActive: false,
  },
  {
    id: 'radarSweep',
    label: 'Escáner Radar Táctico',
    description: 'Haz de barrido rotativo de 360°',
    category: MAP_LAYER_CATEGORIES.ANOMALIES,
    icon: '📡',
    defaultActive: true,
  },
];

// Estado inicial unificado para React
export const INITIAL_ACTIVE_LAYERS = MAP_LAYERS.reduce((acc, layer) => {
  acc[layer.id] = layer.defaultActive;
  return acc;
}, {});