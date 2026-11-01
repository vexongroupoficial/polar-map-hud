// lib/desertData.js

// =========================================================================
// 1. ANILLOS BIOCLIMÁTICOS ÁRIDOS SUBTROPICALES (Trópicos de Cáncer y Capricornio)
// =========================================================================
export const TROPICAL_ARID_BELTS = [
  {
    id: 'tropic_cancer_belt',
    name: 'CINTURÓN ÁRIDO SEPTENTRIONAL (TRÓPICO DE CÁNCER)',
    latNorth: 35.0,
    latSouth: 15.0,
    color: 'rgba(245, 158, 11, 0.12)',   // Ámbar neón sutil
    strokeColor: '#f59e0b',
  },
  {
    id: 'tropic_capricorn_belt',
    name: 'CINTURÓN ÁRIDO MERIDIONAL (TRÓPICO DE CAPRICORNIO)',
    latNorth: -15.0,
    latSouth: -35.0,
    color: 'rgba(217, 119, 6, 0.12)',    // Arena neón sutil
    strokeColor: '#d97706',
  }
];

// =========================================================================
// 2. DESIERTOS, MAR DE DUNAS Y MÉDANOS PLANETARIOS POR REGIONALES
// =========================================================================
export const GLOBAL_DESERTS = [
  // ---------------- ❄️ DESIERTOS POLARES (Fondo de Hielo) ----------------
  {
    id: 'arctic_polar_desert',
    name: 'DESIERTO ÁRTICO',
    category: 'polar',
    lat: 84.0, lon: -40.0,
    color: 'rgba(224, 242, 254, 0.30)',
    strokeColor: '#7dd3fc',
  },
  {
    id: 'antarctic_polar_desert',
    name: 'DESIERTO ANTÁRTICO',
    category: 'polar',
    lat: -78.0, lon: 0.0,
    color: 'rgba(240, 249, 255, 0.30)',
    strokeColor: '#bae6fd',
  },

  // ---------------- 🌍 ÁFRICA ----------------
  {
    id: 'sahara_desert',
    name: 'DESIERTO DEL SAHARA',
    category: 'hot',
    lat: 23.5, lon: 13.0,
    color: 'rgba(245, 158, 11, 0.35)',
    strokeColor: '#f59e0b',
    polygon: [
      [32.0, -15.0], [33.0, 32.0], [20.0, 36.0], 
      [15.0, 32.0], [14.0, -16.0]
    ]
  },
  {
    id: 'kalahari_desert',
    name: 'DESIERTO DEL KALAHARI',
    category: 'hot',
    lat: -23.0, lon: 22.0,
    color: 'rgba(217, 119, 6, 0.35)', strokeColor: '#d97706',
    polygon: [[-18.0, 19.0], [-19.0, 28.0], [-28.0, 26.0], [-27.0, 18.0]]
  },
  {
    id: 'namib_desert',
    name: 'DESIERTO DEL NAMIB',
    category: 'hot',
    lat: -24.5, lon: 15.0,
    color: 'rgba(245, 158, 11, 0.40)', strokeColor: '#f59e0b',
    polygon: [[-17.0, 11.5], [-17.5, 14.0], [-28.5, 16.5], [-28.5, 14.5]]
  },
  { id: 'danakil_desert', name: 'DESIERTO DE DANAKIL', category: 'hot', lat: 14.2, lon: 40.3, radiusKm: 120, color: 'rgba(239, 68, 68, 0.40)', strokeColor: '#ef4444' },
  { id: 'libyan_desert', name: 'DESIERTO DE LIBIA', category: 'hot', lat: 24.0, lon: 25.0, radiusKm: 350, color: 'rgba(245, 158, 11, 0.30)', strokeColor: '#f59e0b' },
  { id: 'nubian_desert', name: 'DESIERTO DE NUBIA', category: 'hot', lat: 20.5, lon: 33.0, radiusKm: 250, color: 'rgba(245, 158, 11, 0.30)', strokeColor: '#f59e0b' },
  { id: 'chalbi_desert', name: 'DESIERTO DE CHALBI', category: 'hot', lat: 2.3, lon: 37.5, radiusKm: 80, color: 'rgba(245, 158, 11, 0.30)', strokeColor: '#f59e0b' },
  { id: 'nyiri_desert', name: 'DESIERTO DE NYIRI', category: 'hot', lat: -2.4, lon: 37.1, radiusKm: 60, color: 'rgba(245, 158, 11, 0.30)', strokeColor: '#f59e0b' },
  { id: 'guban_desert', name: 'DESIERTO DE GUBAN', category: 'hot', lat: 10.5, lon: 45.0, radiusKm: 90, color: 'rgba(245, 158, 11, 0.30)', strokeColor: '#f59e0b' },
  { id: 'lompoul_desert', name: 'DESIERTO DE LOMPOUL', category: 'dunes', lat: 15.4, lon: -16.8, radiusKm: 40, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  // Ergs y Médanos de África
  { id: 'gran_erg_occidental', name: 'GRAN ERG OCCIDENTAL', category: 'dunes', lat: 30.5, lon: 0.0, radiusKm: 200, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'gran_erg_oriental', name: 'GRAN ERG ORIENTAL', category: 'dunes', lat: 31.0, lon: 7.5, radiusKm: 220, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'erg_chebbi', name: 'ERG CHEBBI Y CHIGAGA', category: 'dunes', lat: 31.1, lon: -4.0, radiusKm: 70, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'erg_bilma', name: 'ERG DE BILMA', category: 'dunes', lat: 18.5, lon: 13.0, radiusKm: 180, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'sossusvlei', name: 'MÉDANOS DE SOSSUSVLEI', category: 'dunes', lat: -24.7, lon: 15.3, radiusKm: 60, color: 'rgba(217, 119, 6, 0.50)', strokeColor: '#d97706' },

  // ---------------- 🌎 AMÉRICA ----------------
  {
    id: 'patagonian_desert',
    name: 'DESIERTO DE LA PATAGONIA',
    category: 'cold',
    lat: -45.0, lon: -69.0,
    color: 'rgba(180, 83, 9, 0.35)', strokeColor: '#b45309',
    polygon: [[-38.0, -68.0], [-40.0, -64.0], [-50.0, -68.0], [-48.0, -72.0]]
  },
  {
    id: 'great_basin_desert',
    name: 'DESIERTO DE LA GRAN CUENCA',
    category: 'cold',
    lat: 39.0, lon: -116.0,
    color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b',
    polygon: [[43.0, -120.0], [42.0, -112.0], [36.0, -114.0], [37.0, -119.0]]
  },
  { id: 'chihuahuan_desert', name: 'DESIERTO DE CHIHUAHUA', category: 'hot', lat: 28.5, lon: -104.0, radiusKm: 280, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'sonoran_desert', name: 'DESIERTO DE SONORA', category: 'hot', lat: 32.0, lon: -113.0, radiusKm: 250, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'atacama_desert', name: 'DESIERTO DE ATACAMA', category: 'hyperarid', lat: -23.5, lon: -69.5, radiusKm: 220, color: 'rgba(245, 158, 11, 0.45)', strokeColor: '#f59e0b' },
  { id: 'mojave_desert', name: 'DESIERTO DE MOJAVE (VALLE DE LA MUERTE)', category: 'hot', lat: 35.0, lon: -115.5, radiusKm: 140, color: 'rgba(245, 158, 11, 0.40)', strokeColor: '#f59e0b' },
  { id: 'sechura_desert', name: 'DESIERTO DE SECHURA', category: 'hot', lat: -6.0, lon: -80.5, radiusKm: 110, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'monte_desert', name: 'DESIERTO DEL MONTE', category: 'hot', lat: -32.0, lon: -67.5, radiusKm: 160, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'colorado_desert', name: 'DESIERTO DEL COLORADO', category: 'hot', lat: 33.0, lon: -115.0, radiusKm: 90, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'guajira_desert', name: 'DESIERTO DE LA GUAJIRA', category: 'hot', lat: 12.0, lon: -71.8, radiusKm: 85, color: 'rgba(245, 158, 11, 0.40)', strokeColor: '#f59e0b' },
  // Médanos de América
  { id: 'medanos_coro', name: 'MÉDANOS DE CORO Y PARAGUANÁ', category: 'dunes', lat: 11.6, lon: -69.7, radiusKm: 45, color: 'rgba(217, 119, 6, 0.55)', strokeColor: '#d97706' },
  { id: 'lencois_maranhenses', name: 'DUNAS DE LENÇÓIS MARANHENSES', category: 'dunes', lat: -2.5, lon: -43.1, radiusKm: 65, color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8' },
  { id: 'jalapao_dunes', name: 'DUNAS DE JALAPÃO', category: 'dunes', lat: -10.5, lon: -46.5, radiusKm: 50, color: 'rgba(217, 119, 6, 0.40)', strokeColor: '#d97706' },
  { id: 'gran_desierto_altar', name: 'GRAN DESIERTO DE ALTAR', category: 'dunes', lat: 31.8, lon: -114.0, radiusKm: 90, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'samalayuca_dunes', name: 'DUNAS DE SAMALAYUCA', category: 'dunes', lat: 31.3, lon: -106.5, radiusKm: 40, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'sand_mountain', name: 'DUNAS DE SAND MOUNTAIN', category: 'dunes', lat: 39.3, lon: -118.4, radiusKm: 30, color: 'rgba(217, 119, 6, 0.40)', strokeColor: '#d97706' },
  { id: 'tatacoa_desert', name: 'DESIERTO DE LA TATACOA', category: 'arid', lat: 3.2, lon: -75.1, radiusKm: 35, color: 'rgba(180, 83, 9, 0.45)', strokeColor: '#b45309' },
  { id: 'cafayate_dunes', name: 'MÉDANOS DE CAFAYATE', category: 'dunes', lat: -26.0, lon: -65.9, radiusKm: 35, color: 'rgba(217, 119, 6, 0.40)', strokeColor: '#d97706' },

  // ---------------- 🌏 ASIA ----------------
  {
    id: 'arabian_desert',
    name: 'DESIERTO DE ARABIA',
    category: 'hot',
    lat: 23.0, lon: 46.0,
    color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b',
    polygon: [[30.0, 38.0], [30.0, 48.0], [22.0, 58.0], [14.0, 53.0], [17.0, 42.0]]
  },
  {
    id: 'gobi_desert',
    name: 'DESIERTO DE GOBI',
    category: 'cold',
    lat: 44.0, lon: 105.0,
    color: 'rgba(180, 83, 9, 0.35)', strokeColor: '#b45309',
    polygon: [[47.0, 93.0], [46.0, 118.0], [40.0, 115.0], [41.0, 96.0]]
  },
  { id: 'taklamakan_desert', name: 'DESIERTO DE TAKLAMAKAN', category: 'cold', lat: 38.9, lon: 82.2, radiusKm: 280, color: 'rgba(217, 119, 6, 0.40)', strokeColor: '#d97706' },
  { id: 'thar_desert', name: 'DESIERTO DE THAR', category: 'hot', lat: 27.0, lon: 71.0, radiusKm: 210, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'syrian_desert', name: 'DESIERTO DE SIRIA', category: 'hot', lat: 33.0, lon: 38.0, radiusKm: 200, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'karakum_desert', name: 'DESIERTO DE KARAKUM', category: 'cold', lat: 39.0, lon: 60.0, radiusKm: 220, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'kyzylkum_desert', name: 'DESIERTO DE KYZYLKUM', category: 'cold', lat: 42.5, lon: 64.0, radiusKm: 230, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'dasht_e_lut', name: 'DASHT-E LUT', category: 'hyperarid', lat: 30.5, lon: 59.0, radiusKm: 180, color: 'rgba(239, 68, 68, 0.45)', strokeColor: '#ef4444' },
  { id: 'dasht_e_kavir', name: 'DASHT-E KAVIR', category: 'salt', lat: 34.5, lon: 54.5, radiusKm: 170, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'judean_negev', name: 'DESIERTO DE JUDEA Y NÉGUEV', category: 'hot', lat: 30.8, lon: 34.8, radiusKm: 80, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'registan_desert', name: 'DESIERTO DE REGISTAN', category: 'hot', lat: 30.4, lon: 65.4, radiusKm: 120, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'dashte_margo', name: 'DASHTE MARGO', category: 'hot', lat: 31.0, lon: 63.0, radiusKm: 110, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'lop_desert', name: 'DESIERTO DE LOP', category: 'cold', lat: 40.5, lon: 90.0, radiusKm: 130, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  // Ergs de Asia
  { id: 'rub_al_khali', name: 'RUB AL-JALI (MAR DE ARENA)', category: 'dunes', lat: 20.0, lon: 50.0, radiusKm: 320, color: 'rgba(217, 119, 6, 0.50)', strokeColor: '#d97706' },
  { id: 'an_nafud', name: 'AN-NAFUD Y AD-DAHNA', category: 'dunes', lat: 28.5, lon: 41.0, radiusKm: 160, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'shapotou_dunes', name: 'DUNAS DE SHAPOTOU', category: 'dunes', lat: 37.5, lon: 105.0, radiusKm: 45, color: 'rgba(217, 119, 6, 0.40)', strokeColor: '#d97706' },

  // ---------------- 🇦🇺 OCEANÍA (OUTBACK AUSTRALIANO) ----------------
  {
    id: 'great_australian_desert',
    name: 'BLOQUE DEL GRAN DESIERTO AUSTRALIANO',
    category: 'hot',
    lat: -25.0, lon: 130.0,
    color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b',
    polygon: [[-20.0, 120.0], [-19.0, 138.0], [-31.0, 140.0], [-32.0, 122.0]]
  },
  { id: 'great_victoria_desert', name: 'GRAN DESIERTO DE VICTORIA', category: 'hot', lat: -29.0, lon: 129.0, radiusKm: 240, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'great_sandy_desert', name: 'GRAN DESIERTO ARENOSO', category: 'hot', lat: -20.0, lon: 125.0, radiusKm: 220, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'gibson_desert', name: 'DESIERTO DE GIBSON', category: 'hot', lat: -23.0, lon: 127.0, radiusKm: 150, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'simpson_desert', name: 'DESIERTO DE SIMPSON (DUNAS ROJAS)', category: 'dunes', lat: -24.5, lon: 137.0, radiusKm: 180, color: 'rgba(239, 68, 68, 0.40)', strokeColor: '#ef4444' },
  { id: 'tanami_desert', name: 'DESIERTO DE TANAMI', category: 'hot', lat: -20.0, lon: 130.0, radiusKm: 140, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'sturt_pedirka_tirari', name: 'DESIERTOS DE STURT, PEDIRKA Y TIRARI', category: 'hot', lat: -28.0, lon: 138.5, radiusKm: 130, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },

  // ---------------- 🇪🇺 EUROPA ----------------
  { id: 'tabernas_desert', name: 'DESIERTO DE TABERNAS', category: 'semiarid', lat: 37.0, lon: -2.4, radiusKm: 30, color: 'rgba(245, 158, 11, 0.45)', strokeColor: '#f59e0b' },
  { id: 'bardenas_reales', name: 'BARDENAS REALES', category: 'semiarid', lat: 42.2, lon: -1.5, radiusKm: 30, color: 'rgba(245, 158, 11, 0.40)', strokeColor: '#f59e0b' },
  { id: 'oleshky_sands', name: 'ARENAS DE OLESHKY', category: 'dunes', lat: 46.6, lon: 32.7, radiusKm: 35, color: 'rgba(217, 119, 6, 0.45)', strokeColor: '#d97706' },
  { id: 'accona_desert', name: 'DESIERTO DE ACCONA', category: 'semiarid', lat: 43.1, lon: 11.5, radiusKm: 25, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' },
  { id: 'deliblato_sands', name: 'DESIERTO DE DELIBLATO', category: 'semiarid', lat: 44.9, lon: 21.1, radiusKm: 30, color: 'rgba(245, 158, 11, 0.35)', strokeColor: '#f59e0b' }
];