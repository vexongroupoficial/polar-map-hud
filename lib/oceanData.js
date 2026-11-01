// lib/oceanData.js

// =============================================================
// 1. REGIONES POLARES (Para la capa 'Masa Oceánica' - Capa Visual)
// =============================================================
// lib/oceanData.js
// lib/oceanData.js

export const POLAR_OCEAN_REGIONS = [
  {
    id: 'arctic_ocean',
    name: 'OCÉANO ÁRTICO',
    latNorth: 90,
    latSouth: 66.56,
    lonWest: -180,
    lonEast: 180,
    labelLat: 82.0,   // 👈 Desplazado al antimeridiano para no pisar el indicador del Polo Norte
    labelLon: 180.0,
    color: 'rgba(192, 132, 252, 0.15)',
    strokeColor: '#c084fc',
  },
  {
    id: 'pacific_north',
    name: 'OCÉANO PACÍFICO NORTE',
    latNorth: 66.56,
    latSouth: 0,
    lonWest: 120,
    lonEast: -70,
    labelLat: 35.0,   // 👈 Agua abierta del Pacífico Norte (Zona superior del mapa)
    labelLon: 170.0,
    color: 'rgba(14, 165, 233, 0.15)',
    strokeColor: '#0ea5e9',
  },
  {
    id: 'pacific_south',
    name: 'OCÉANO PACÍFICO SUR',
    latNorth: 0,
    latSouth: -60,
    lonWest: 120,
    lonEast: -70,
    labelLat: -30.0,  // 👈 Cuenca limpia del Pacífico Sur
    labelLon: -130.0,
    color: 'rgba(2, 132, 199, 0.15)',
    strokeColor: '#0284c7',
  },
  {
    id: 'atlantic_north',
    name: 'OCÉANO ATLÁNTICO NORTE',
    latNorth: 66.56,
    latSouth: 0,
    lonWest: -80,
    lonEast: 20,
    labelLat: 30.0,   // 👈 Atlántico Norte (Entre América y África/Europa)
    labelLon: -40.0,
    color: 'rgba(56, 189, 248, 0.15)',
    strokeColor: '#38bdf8',
  },
  {
    id: 'atlantic_south',
    name: 'OCÉANO ATLÁNTICO SUR',
    latNorth: 0,
    latSouth: -60,
    lonWest: -70,
    lonEast: 20,
    labelLat: -30.0,  // 👈 Atlántico Sur
    labelLon: -20.0,
    color: 'rgba(3, 105, 161, 0.15)',
    strokeColor: '#0369a1',
  },
  {
    id: 'indian_ocean',
    name: 'OCÉANO ÍNDICO',
    latNorth: 30,
    latSouth: -60,
    lonWest: 20,
    lonEast: 120,
    labelLat: -20.0,  // 👈 Océano Índico libre de tierra (Zona inferior izquierda)
    labelLon: 75.0,
    color: 'rgba(20, 184, 166, 0.15)',
    strokeColor: '#14b8a6',
  },
  {
    id: 'antarctic_ocean',
    name: 'OCÉANO ANTÁRTICO / AUSTRAL',
    latNorth: -60,
    latSouth: -90,
    lonWest: -180,
    lonEast: 180,
    labelLat: -68.0,  // 👈 Anillo polar exterior
    labelLon: 180.0,
    color: 'rgba(99, 102, 241, 0.15)',
    strokeColor: '#6366f1',
  },
];
// =============================================================
// 2. ETIQUETAS DE TEXTO (Para la capa 'Nombres de Océanos')
// =============================================================

export const OCEAN_LABELS = [
  // TIER 1: OCÉANOS PRINCIPALES PLANETARIOS (Visibles siempre a zoom >= 1.0)
  { id: 'pacific_north', name: 'OCÉANO PACÍFICO NORTE', lat: 25.0, lon: -165.0, tier: 1 },
  { id: 'pacific_south', name: 'OCÉANO PACÍFICO SUR', lat: -25.0, lon: -125.0, tier: 1 },
  { id: 'atlantic_north', name: 'OCÉANO ATLÁNTICO NORTE', lat: 30.0, lon: -40.0, tier: 1 },
  { id: 'atlantic_south', name: 'OCÉANO ATLÁNTICO SUR', lat: -25.0, lon: -15.0, tier: 1 },
  { id: 'indian_ocean', name: 'OCÉANO ÍNDICO', lat: -20.0, lon: 80.0, tier: 1 },
  { id: 'arctic_ocean', name: 'OCÉANO ÁRTICO', lat: 84.0, lon: 0.0, tier: 1 },
  { id: 'antarctic_ocean', name: 'OCÉANO ANTÁRTICO / AUSTRAL', lat: -65.0, lon: 0.0, tier: 1 },

  // TIER 2: MARES CONTINENTALES Y REGIONALES (Aparecen únicamente con zoom >= 1.3x)
  // Europa / África
  { id: 'mediterranean_sea', name: 'MAR MEDITERRÁNEO', lat: 35.0, lon: 18.0, tier: 2 },
  { id: 'black_sea', name: 'MAR NEGRO', lat: 43.5, lon: 34.0, tier: 2 },
  { id: 'baltic_sea', name: 'MAR BÁLTICO', lat: 58.0, lon: 20.0, tier: 2 },
  { id: 'north_sea', name: 'MAR DEL NORTE', lat: 56.0, lon: 3.0, tier: 2 },
  { id: 'barents_sea', name: 'MAR DE BARENTS', lat: 75.0, lon: 40.0, tier: 2 },
  { id: 'red_sea', name: 'MAR ROJO', lat: 20.0, lon: 38.0, tier: 2 },

  // América
  { id: 'caribbean_sea', name: 'MAR CARIBE', lat: 14.5, lon: -75.0, tier: 2 },
  { id: 'mar_argentino', name: 'MAR ARGENTINO', lat: -46.0, lon: -62.0, tier: 2 },
  { id: 'mar_chileno', name: 'MAR CHILENO', lat: -38.0, lon: -76.0, tier: 2 },
  { id: 'mar_de_grau', name: 'MAR DE GRAU', lat: -12.0, lon: -80.0, tier: 2 },
  { id: 'hudson_bay', name: 'BAHÍA DE HUDSON', lat: 60.0, lon: -85.0, tier: 2 },
  { id: 'beaufort_sea', name: 'MAR DE BEAUFORT', lat: 72.0, lon: -137.0, tier: 2 },
  { id: 'greenland_sea', name: 'MAR DE GROENLANDIA', lat: 76.0, lon: -18.0, tier: 2 },
  { id: 'labrador_sea', name: 'MAR DE LABRADOR', lat: 56.0, lon: -52.0, tier: 2 },
  { id: 'sargasso_sea', name: 'MAR DE LOS SARGAZOS', lat: 28.0, lon: -66.0, tier: 2 },
  { id: 'great_lakes', name: 'GRANDES LAGOS', lat: 45.0, lon: -84.0, tier: 2 },
  { id: 'bering_sea', name: 'MAR DE BERING', lat: 57.5, lon: -175.0, tier: 2 },
  { id: 'chukchi_sea', name: 'MAR DE CHUKOTKA', lat: 68.0, lon: -170.0, tier: 2 },

  // Asia
  { id: 'arabian_sea', name: 'MAR DE ARABIA', lat: 15.0, lon: 65.0, tier: 2 },
  { id: 'caspian_sea', name: 'MAR CASPIO', lat: 41.5, lon: 51.5, tier: 2 },
  { id: 'andaman_sea', name: 'MAR DE ANDAMÁN', lat: 10.0, lon: 95.0, tier: 2 },
  { id: 'south_china_sea', name: 'MAR DE CHINA MERIDIONAL', lat: 14.0, lon: 114.0, tier: 2 },
  { id: 'east_china_sea', name: 'MAR DE CHINA ORIENTAL', lat: 29.0, lon: 125.0, tier: 2 },
  { id: 'yellow_sea', name: 'MAR AMARILLO', lat: 35.0, lon: 123.0, tier: 2 },
  { id: 'philippine_sea', name: 'MAR DE FILIPINAS', lat: 18.0, lon: 132.0, tier: 2 },
  { id: 'sea_of_japan', name: 'MAR DE JAPÓN', lat: 39.5, lon: 134.5, tier: 2 },
  { id: 'sea_of_okhotsk', name: 'MAR DE OJOTSK', lat: 54.0, lon: 150.0, tier: 2 },
  { id: 'east_siberian_sea', name: 'MAR DE SIBERIA ORIENTAL', lat: 72.0, lon: 164.0, tier: 2 },
  { id: 'kara_sea', name: 'MAR DE KARA', lat: 74.0, lon: 75.0, tier: 2 },
  { id: 'laptev_sea', name: 'MAR DE LÁPTEV', lat: 75.0, lon: 125.0, tier: 2 },

  // Oceanía
  { id: 'coral_sea', name: 'MAR DEL CORAL', lat: -18.0, lon: 155.0, tier: 2 },
  { id: 'tasman_sea', name: 'MAR DE TASMANIA', lat: -37.0, lon: 160.0, tier: 2 },
  { id: 'arafura_sea', name: 'MAR DE ARAFURA', lat: -9.0, lon: 135.0, tier: 2 },
  { id: 'timor_sea', name: 'MAR DE TIMOR', lat: -10.0, lon: 127.0, tier: 2 },

  // TIER 3: MARES MENORES Y CANALES (Aparecen únicamente con zoom >= 2.0x)
  // Europa
  { id: 'adriatic_sea', name: 'MAR ADRIÁTICO', lat: 42.5, lon: 15.5, tier: 3 },
  { id: 'white_sea', name: 'MAR BLANCO', lat: 65.5, lon: 37.5, tier: 3 },
  { id: 'english_channel', name: 'CANAL DE LA MANCHA', lat: 50.0, lon: -2.0, tier: 3 },
  { id: 'cantabrian_sea', name: 'MAR CANTÁBRICO', lat: 44.5, lon: -4.5, tier: 3 },
  { id: 'celtic_sea', name: 'MAR CELTA', lat: 50.5, lon: -7.5, tier: 3 },
  { id: 'alboran_sea', name: 'MAR DE ALBORÁN', lat: 36.0, lon: -3.0, tier: 3 },
  { id: 'azov_sea', name: 'MAR DE AZOV', lat: 46.0, lon: 36.5, tier: 3 },
  { id: 'wadden_sea', name: 'MAR DE FRISIA', lat: 53.5, lon: 6.0, tier: 3 },
  { id: 'irish_sea', name: 'MAR DE IRLANDA', lat: 53.5, lon: -5.5, tier: 3 },
  { id: 'marmara_sea', name: 'MAR DE MÁRMARA', lat: 40.7, lon: 28.0, tier: 3 },
  { id: 'aegean_sea', name: 'MAR EGEO', lat: 38.5, lon: 25.0, tier: 3 },
  { id: 'ionian_sea', name: 'MAR JÓNICO', lat: 38.0, lon: 18.0, tier: 3 },
  { id: 'tyrrhenian_sea', name: 'MAR TIRENO', lat: 40.0, lon: 12.0, tier: 3 },

  // América
  { id: 'cortes_sea', name: 'MAR DE CORTÉS', lat: 27.0, lon: -111.0, tier: 3 },
  { id: 'ansenuza_sea', name: 'MAR DE ANSENUZA', lat: -30.6, lon: -62.6, tier: 3 },

  // Asia
  { id: 'aral_sea', name: 'MAR DE ARAL', lat: 45.0, lon: 59.0, tier: 3 },
  { id: 'banda_sea', name: 'MAR DE BANDA', lat: -5.5, lon: 127.5, tier: 3 },
  { id: 'celebes_sea', name: 'MAR DE CÉLEBES', lat: 3.5, lon: 122.0, tier: 3 },
  { id: 'sulu_sea', name: 'MAR DE SULU', lat: 8.0, lon: 120.0, tier: 3 },
  { id: 'seto_inland_sea', name: 'MAR INTERIOR DE SETO', lat: 34.3, lon: 133.5, tier: 3 },
  { id: 'dead_sea', name: 'MAR MUERTO', lat: 31.5, lon: 35.5, tier: 3 },

  // Oceanía
  { id: 'bismarck_sea', name: 'MAR DE BISMARCK', lat: -4.0, lon: 148.0, tier: 3 },
  { id: 'halmahera_sea', name: 'MAR DE HALMAHERA', lat: -0.5, lon: 128.5, tier: 3 },
  { id: 'solomon_sea', name: 'MAR DE SALOMÓN', lat: -8.0, lon: 153.0, tier: 3 },
];
