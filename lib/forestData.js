// lib/forestData.js

// =========================================================================
// 1. ZONAS BIOCLIMÁTICAS FORESTALES PLANETARIAS
// =========================================================================
export const FOREST_BIOMES = [
  {
    id: 'tropical_forests',
    name: 'BOSQUES TROPICALES (45%)',
    info: 'Ecuador bioclimático | Alta densidad y biodiversidad',
    color: 'rgba(16, 185, 129, 0.22)',   // Esmeralda Neón sutil
    strokeColor: '#10b981',
    // Cinturón Ecuatorial Aproximado (Latitudes entre 15°N y 20°S)
    latNorth: 15,
    latSouth: -20,
  },
  {
    id: 'boreal_taiga',
    name: 'BOSQUES BOREALES / TAIGA (27%)',
    info: 'Hemisferio Norte (Rusia, Canadá, Escandinavia)',
    color: 'rgba(5, 150, 105, 0.25)',    // Verde Taiga Frío
    strokeColor: '#059669',
    // Cinturón Boreal Norte (Latitudes entre 50°N y 70°N)
    latNorth: 70,
    latSouth: 50,
  },
  {
    id: 'temperate_forests',
    name: 'BOSQUES TEMPLADOS (16%)',
    info: 'Latitudes medias | 4 estaciones',
    color: 'rgba(52, 211, 153, 0.18)',   // Menta Templado
    strokeColor: '#34d199',
    latNorth: 50,
    latSouth: 30,
  },
  {
    id: 'subtropical_forests',
    name: 'BOSQUES SUBTROPICALES (11%)',
    info: 'Franja de transición trópico-templada',
    color: 'rgba(110, 231, 183, 0.15)',
    strokeColor: '#6ee7b7',
    latNorth: 30,
    latSouth: 15,
  }
];

// =========================================================================
// 2. LOS 5 GRANDES BOSQUES DEL MUNDO Y POLÍGONOS DESTACADOS
// =========================================================================
export const GLOBAL_FORESTS = [
  // ---------------- LA TAIGA ----------------
  {
    id: 'taiga_siberia',
    name: 'LA TAIGA (SIBERIA Y CANADÁ)',
    type: 'boreal',
    info: 'El bioma forestal más extenso del planeta',
    lat: 62.0,
    lon: 90.0,
    color: 'rgba(16, 185, 129, 0.35)',
    strokeColor: '#10b981',
    polygon: [
      [68.0, 30.0], [70.0, 120.0], [60.0, 140.0], 
      [52.0, 110.0], [55.0, 60.0], [60.0, 35.0]
    ]
  },
  {
    id: 'taiga_canada',
    name: 'TAIGA CANADIENSE',
    type: 'boreal',
    info: 'Extensión de coníferas de Norteamérica',
    lat: 56.0,
    lon: -96.0,
    color: 'rgba(16, 185, 129, 0.35)',
    strokeColor: '#10b981',
    polygon: [
      [65.0, -125.0], [60.0, -80.0], [50.0, -75.0], 
      [52.0, -115.0]
    ]
  },

  // ---------------- LA SELVA AMAZÓNICA ----------------
  {
    id: 'amazon_rainforest',
    name: 'SELVA AMAZÓNICA',
    type: 'tropical',
    info: 'El bosque tropical más grande y biodiverso',
    lat: -3.5,
    lon: -62.0,
    color: 'rgba(5, 150, 105, 0.40)',
    strokeColor: '#34d199',
    polygon: [
      [4.0, -60.0], [1.0, -50.0], [-10.0, -52.0], 
      [-14.0, -66.0], [-8.0, -76.0], [2.0, -74.0]
    ]
  },

  // ---------------- EL BOSQUE DEL CONGO ----------------
  {
    id: 'congo_rainforest',
    name: 'BOSQUE DEL CONGO',
    type: 'tropical',
    info: 'Corazón verde de África Central',
    lat: -0.5,
    lon: 22.0,
    color: 'rgba(4, 120, 87, 0.40)',
    strokeColor: '#10b981',
    polygon: [
      [4.0, 14.0], [4.0, 28.0], [-5.0, 29.0], 
      [-7.0, 18.0], [-1.0, 12.0]
    ]
  },

  // ---------------- EL BOSQUE DE NUEVA GUINEA ----------------
  {
    id: 'new_guinea_forest',
    name: 'BOSQUE DE NUEVA GUINEA',
    type: 'tropical',
    info: 'Selva de gran riqueza bioclimática en Asia-Pacífico',
    lat: -5.0,
    lon: 140.0,
    color: 'rgba(16, 185, 129, 0.45)',
    strokeColor: '#6ee7b7',
    polygon: [
      [-2.5, 132.0], [-3.0, 142.0], [-9.0, 149.0], 
      [-8.0, 140.0], [-6.0, 135.0]
    ]
  },

  // ---------------- EL BOSQUE VALDIVIANO ----------------
  {
    id: 'valdivian_forest',
    name: 'BOSQUE VALDIVIANO',
    type: 'temperate',
    info: 'Bosque templado lluvioso (Sur de Chile y Argentina)',
    lat: -41.5,
    lon: -73.0,
    color: 'rgba(52, 211, 153, 0.45)',
    strokeColor: '#a7f3d0',
    polygon: [
      [-37.0, -73.5], [-38.0, -71.5], [-47.0, -72.5], 
      [-46.5, -75.0], [-41.0, -74.0]
    ]
  }
];