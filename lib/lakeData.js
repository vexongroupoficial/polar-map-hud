// lib/lakeData.js

export const GLOBAL_LAKES = [
  // =========================================================================
  // 1. LOS 5 LAGOS MÁS GRANDES DEL MUNDO (POR SUPERFICIE)
  // =========================================================================
  {
    id: 'caspian_sea',
    name: 'MAR CASPIO',
    info: '371,000 km² | El más grande del planeta',
    lat: 41.5,
    lon: 51.5,
    color: 'rgba(14, 165, 233, 0.35)',
    strokeColor: '#38bdf8',
    // Polígono de contorno de la cuenca endorreica del Caspio
    polygon: [
      [47.1, 51.8], [44.5, 50.3], [40.2, 53.0], [36.8, 52.5],
      [37.4, 49.9], [40.5, 49.8], [44.0, 47.2], [46.5, 48.0]
    ]
  },
  {
    id: 'lake_superior',
    name: 'LAGO SUPERIOR',
    info: '82,103 km² | Canadá / EE.UU.',
    lat: 47.7,
    lon: -87.5,
    color: 'rgba(56, 189, 248, 0.40)',
    strokeColor: '#7dd3fc',
    polygon: [
      [48.0, -89.5], [48.8, -87.5], [47.5, -84.5], 
      [46.5, -84.7], [46.4, -88.5], [47.0, -90.5]
    ]
  },
  {
    id: 'lake_victoria',
    name: 'LAGO VICTORIA',
    info: '69,485 km² | Kenia / Tanzania / Uganda',
    lat: -1.0,
    lon: 33.0,
    color: 'rgba(6, 182, 212, 0.40)',
    strokeColor: '#22d3ee',
    polygon: [
      [0.4, 32.5], [0.3, 34.0], [-1.5, 34.2], 
      [-2.8, 33.0], [-2.3, 31.8], [-0.8, 31.7]
    ]
  },
  {
    id: 'lake_huron',
    name: 'LAGO HURÓN',
    info: '59,596 km² | Canadá / EE.UU.',
    lat: 44.8,
    lon: -82.4,
    color: 'rgba(56, 189, 248, 0.38)',
    strokeColor: '#38bdf8',
    polygon: [
      [46.2, -84.0], [45.8, -81.2], [43.5, -82.3], 
      [43.8, -83.7], [45.5, -84.7]
    ]
  },
  {
    id: 'lake_michigan',
    name: 'LAGO MICHIGAN',
    info: '57,750 km² | Estados Unidos',
    lat: 43.8,
    lon: -87.1,
    color: 'rgba(56, 189, 248, 0.38)',
    strokeColor: '#38bdf8',
    polygon: [
      [45.8, -85.5], [44.0, -86.3], [41.6, -87.5], 
      [42.5, -87.9], [45.3, -87.6]
    ]
  },

  // =========================================================================
  // 2. LAGOS POR RÉCORDS GEOGRÁFICOS
  // =========================================================================
  {
    id: 'lake_baikal',
    name: 'LAGO BAIKAL',
    info: '1,680m prof. | El más profundo y antiguo',
    lat: 53.5,
    lon: 108.0,
    color: 'rgba(99, 102, 241, 0.45)',
    strokeColor: '#818cf8',
    polygon: [
      [55.8, 109.8], [54.0, 108.5], [51.7, 104.8], 
      [51.8, 103.8], [53.5, 107.0], [55.5, 109.0]
    ]
  },
  {
    id: 'lake_titicaca',
    name: 'LAGO TITICACA',
    info: '3,812m s.n.m. | El más alto navegable',
    lat: -15.8,
    lon: -69.4,
    color: 'rgba(14, 165, 233, 0.45)',
    strokeColor: '#38bdf8',
    polygon: [
      [-15.2, -69.8], [-15.5, -68.8], [-16.2, -68.6], 
      [-16.5, -69.1], [-16.0, -70.0]
    ]
  },

  // =========================================================================
  // 3. LAGOS DESTACADOS EN AMÉRICA LATINA
  // =========================================================================
  {
    id: 'lake_maracaibo',
    name: 'LAGO DE MARACAIBO',
    info: 'Venezuela | Cuenca ancestral y petrolera',
    lat: 9.8,
    lon: -71.5,
    color: 'rgba(20, 184, 166, 0.45)',
    strokeColor: '#2dd4bf',
    polygon: [
      [10.9, -71.6], [10.2, -71.0], [9.1, -71.1], 
      [9.2, -71.8], [10.0, -71.8]
    ]
  },
  {
    id: 'lake_cocibolca',
    name: 'LAGO COCIBOLCA',
    info: 'Nicaragua | El más grande de C.A.',
    lat: 11.5,
    lon: -85.5,
    color: 'rgba(14, 165, 233, 0.42)',
    strokeColor: '#38bdf8',
    polygon: [
      [12.1, -86.0], [11.8, -85.0], [11.1, -84.7], 
      [11.0, -85.4], [11.6, -86.1]
    ]
  },
  {
    id: 'lake_atitlan',
    name: 'LAGO ATITLÁN',
    info: 'Guatemala | Cráter volcánico',
    lat: 14.7,
    lon: -91.2,
    color: 'rgba(56, 189, 248, 0.50)',
    strokeColor: '#7dd3fc',
    radiusKm: 18 // Representación de cuerpo menor de alta altitud
  },
  {
    id: 'laguna_colorada',
    name: 'LAGUNA COLORADA',
    info: 'Bolivia | Lago salado rojizo del altiplano',
    lat: -22.2,
    lon: -67.8,
    color: 'rgba(244, 63, 94, 0.50)', // Tono rojizo característico
    strokeColor: '#fb7185',
    radiusKm: 22
  }
];