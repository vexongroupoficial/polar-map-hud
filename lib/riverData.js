// lib/riverData.js

// =========================================================================
// 1. CUENCAS HIDROGRÁFICAS PLANETARIAS (Áreas de Captación)
// =========================================================================
export const GLOBAL_RIVER_BASINS = [
  {
    id: 'amazon_basin',
    name: 'CUENCA DEL AMAZONAS',
    area: '7.05 M km²',
    color: 'rgba(16, 185, 129, 0.12)',
    strokeColor: '#10b981',
    // Delimitación poligonal aproximada (Lat, Lon)
    boundary: [
      [-3.0, -78.0], [-10.0, -75.0], [-20.0, -65.0], [-15.0, -50.0],
      [0.0, -48.0], [5.0, -60.0], [2.0, -75.0]
    ]
  },
  {
    id: 'congo_basin',
    name: 'CUENCA DEL CONGO',
    area: '3.73 M km²',
    color: 'rgba(6, 182, 212, 0.12)',
    strokeColor: '#06b6d4',
    boundary: [
      [5.0, 15.0], [-10.0, 12.0], [-12.0, 30.0], [8.0, 30.0]
    ]
  },
  {
    id: 'plata_basin',
    name: 'CUENCA DEL RÍO DE LA PLATA',
    area: '4.14 M km²',
    color: 'rgba(59, 130, 246, 0.12)',
    strokeColor: '#3b82f6',
    boundary: [
      [-15.0, -58.0], [-22.0, -45.0], [-35.0, -58.0], [-20.0, -66.0]
    ]
  },
  {
    id: 'nile_basin',
    name: 'CUENCA DEL NILO',
    area: '3.25 M km²',
    color: 'rgba(245, 158, 11, 0.12)',
    strokeColor: '#f59e0b',
    boundary: [
      [-3.0, 35.0], [12.0, 38.0], [31.0, 31.0], [15.0, 24.0], [3.0, 29.0]
    ]
  },
  {
    id: 'mississippi_basin',
    name: 'CUENCA DEL MISISIPÍ-MISURI',
    area: '3.22 M km²',
    color: 'rgba(14, 165, 233, 0.12)',
    strokeColor: '#0ea5e9',
    boundary: [
      [48.0, -114.0], [48.0, -89.0], [30.0, -89.0], [29.0, -95.0], [38.0, -108.0]
    ]
  }
];

// =========================================================================
// 2. REDES FLUVIALES PRINCIPALES POR CONTINENTE (Naciente -> Desembocadura)
// =========================================================================
export const GLOBAL_RIVERS = [
  // ---------------- AMÉRICA DEL SUR ----------------
  {
    id: 'amazon',
    name: 'Río Amazonas',
    basinId: 'amazon_basin',
    path: [
      { lat: -15.5, lon: -71.7 }, // Naciente en los Andes
      { lat: -4.4,  lon: -73.2 }, // Iquitos
      { lat: -3.1,  lon: -60.0 }, // Manaos
      { lat: -1.9,  lon: -54.7 }, // Óbidos
      { lat: 0.0,   lon: -49.0 }  // Desembocadura en el Océano Atlántico
    ]
  },
  {
    id: 'orinoco',
    name: 'Río Orinoco',
    basinId: 'amazon_basin',
    path: [
      { lat: 2.3, lon: -63.3 },
      { lat: 5.6, lon: -67.6 },
      { lat: 8.1, lon: -63.5 },
      { lat: 8.6, lon: -60.5 } // Delta del Orinoco -> Atlántico
    ]
  },
  {
    id: 'parana_paraguay',
    name: 'Sistema Paraná - Paraguay',
    basinId: 'plata_basin',
    path: [
      { lat: -18.0, lon: -56.0 },
      { lat: -25.3, lon: -57.6 }, // Asunción
      { lat: -27.4, lon: -58.8 }, // Resistencia
      { lat: -32.9, lon: -60.6 }, // Rosario
      { lat: -34.8, lon: -57.9 }  // Río de la Plata -> Atlántico Sur
    ]
  },
  {
    id: 'magdalena',
    name: 'Río Magdalena',
    path: [
      { lat: 1.9,  lon: -76.6 },
      { lat: 6.2,  lon: -74.4 },
      { lat: 11.1, lon: -74.8 } // Desembocadura Mar Caribe
    ]
  },

  // ---------------- AMÉRICA DEL NORTE ----------------
  {
    id: 'mississippi',
    name: 'Río Misisipí - Misuri',
    basinId: 'mississippi_basin',
    path: [
      { lat: 45.9, lon: -111.5 }, // Naciente Misuri
      { lat: 38.8, lon: -90.1 },  // Confluencia St. Louis
      { lat: 35.1, lon: -90.0 },  // Memphis
      { lat: 29.1, lon: -89.2 }   // Delta del Misisipí -> Golfo de México
    ]
  },
  {
    id: 'yukon',
    name: 'Río Yukón',
    path: [
      { lat: 60.3, lon: -134.6 },
      { lat: 64.0, lon: -139.4 },
      { lat: 62.5, lon: -164.8 } // Desembocadura Mar de Bering
    ]
  },
  {
    id: 'rio_grande',
    name: 'Río Grande / Bravo',
    path: [
      { lat: 37.8, lon: -107.2 },
      { lat: 31.7, lon: -106.4 }, // El Paso / Juárez
      { lat: 25.9, lon: -97.1 }   // Golfo de México
    ]
  },
  {
    id: 'colorado_na',
    name: 'Río Colorado',
    path: [
      { lat: 40.4, lon: -105.8 },
      { lat: 36.1, lon: -113.2 }, // Gran Cañón
      { lat: 31.8, lon: -114.8 }  // Golfo de California
    ]
  },
  {
    id: 'saint_lawrence',
    name: 'Río San Lorenzo',
    path: [
      { lat: 44.2, lon: -76.4 },
      { lat: 45.5, lon: -73.5 }, // Montreal
      { lat: 49.0, lon: -64.5 }  // Golfo de San Lorenzo -> Atlántico
    ]
  },

  // ---------------- ÁFRICA ----------------
  {
    id: 'nile',
    name: 'Río Nilo',
    basinId: 'nile_basin',
    path: [
      { lat: -2.5,  lon: 32.9 },  // Lago Victoria
      { lat: 15.6,  lon: 32.5 },  // Jartum (Nilo Blanco + Azul)
      { lat: 24.0,  lon: 32.9 },  // Asuán
      { lat: 31.5,  lon: 31.2 }   // Delta en el Mar Mediterráneo
    ]
  },
  {
    id: 'congo',
    name: 'Río Congo',
    basinId: 'congo_basin',
    path: [
      { lat: -11.5, lon: 26.5 },
      { lat: 0.5,   lon: 25.2 },  // Boyoma Falls
      { lat: -4.3,  lon: 15.3 },  // Kinshasa / Brazzaville
      { lat: -6.0,  lon: 12.4 }   // Desembocadura Océano Atlántico
    ]
  },
  {
    id: 'niger',
    name: 'Río Níger',
    path: [
      { lat: 9.1,  lon: -10.7 },
      { lat: 16.8, lon: -3.0 },   // Tombuctú
      { lat: 4.3,  lon: 6.1 }     // Delta en el Golfo de Guinea
    ]
  },
  {
    id: 'zambezi',
    name: 'Río Zambeze',
    path: [
      { lat: -17.6, lon: 24.2 }, // cataratas Victoria
      { lat: -15.6, lon: 29.8 },
      { lat: -18.8, lon: 36.3 }  // Canal de Mozambique -> Océano Índico
    ]
  },

  // ---------------- ASIA ----------------
  {
    id: 'yangtze',
    name: 'Río Yangtsé',
    path: [
      { lat: 33.0, lon: 91.1 },   // Meseta Tibetana
      { lat: 29.5, lon: 106.5 },  // Chongqing
      { lat: 30.6, lon: 114.3 },  // Wuhan
      { lat: 31.4, lon: 121.9 }   // Desembocadura Mar de China Oriental
    ]
  },
  {
    id: 'ganges',
    name: 'Río Ganges',
    path: [
      { lat: 30.9, lon: 78.9 },   // Himalaya
      { lat: 25.3, lon: 83.0 },   // Varanasi
      { lat: 22.1, lon: 89.8 }   // Delta del Ganges / Sundarbans -> Golfo de Bengala
    ]
  },
  {
    id: 'indus',
    name: 'Río Indo',
    path: [
      { lat: 31.2, lon: 81.7 },
      { lat: 34.1, lon: 74.8 },
      { lat: 23.9, lon: 67.4 }   // Mar de Arabia
    ]
  },
  {
    id: 'mekong',
    name: 'Río Mekong',
    path: [
      { lat: 33.7, lon: 94.2 },
      { lat: 17.9, lon: 102.6 }, // Vientián
      { lat: 10.2, lon: 105.8 }  // Delta del Mekong -> Mar de China Meridional
    ]
  },
  {
    id: 'ob_river',
    name: 'Río Obi',
    path: [
      { lat: 52.4, lon: 85.0 },
      { lat: 61.0, lon: 69.0 },
      { lat: 66.5, lon: 72.5 }   // Golfo del Obi -> Océano Ártico
    ]
  },
  {
    id: 'yenisei',
    name: 'Río Yeniséi',
    path: [
      { lat: 51.7, lon: 94.4 },
      { lat: 61.6, lon: 90.1 },
      { lat: 71.8, lon: 82.7 }   // Océano Ártico (Mar de Kara)
    ]
  },
  {
    id: 'lena',
    name: 'Río Lena',
    path: [
      { lat: 53.9, lon: 108.1 },
      { lat: 62.0, lon: 129.7 }, // Yakutsk
      { lat: 73.2, lon: 126.6 }  // Océano Ártico (Mar de Láptev)
    ]
  },
  {
    id: 'huang_he',
    name: 'Río Amarillo (Huang He)',
    path: [
      { lat: 35.0, lon: 96.0 },
      { lat: 37.8, lon: 108.0 },
      { lat: 37.8, lon: 119.3 }  // Mar Bohai / Mar Amarillo
    ]
  },
  {
    id: 'tigris_euphrates',
    name: 'Sistema Tigris y Éufrates',
    path: [
      { lat: 38.4, lon: 39.2 },  // Anatolia
      { lat: 33.3, lon: 44.4 },  // Bagdad
      { lat: 29.9, lon: 48.6 }   // Shatt al-Arab -> Golfo Pérsico
    ]
  },

  // ---------------- EUROPA ----------------
  {
    id: 'volga',
    name: 'Río Volga',
    path: [
      { lat: 57.2, lon: 32.4 },   // Colinas de Valdái
      { lat: 55.8, lon: 49.1 },   // Kazán
      { lat: 46.3, lon: 48.0 }    // Delta en el Mar Caspio
    ]
  },
  {
    id: 'danube',
    name: 'Río Danubio',
    path: [
      { lat: 47.9, lon: 8.1 },    // Selva Negra
      { lat: 48.2, lon: 16.3 },   // Viena
      { lat: 44.8, lon: 20.4 },   // Belgrado
      { lat: 45.2, lon: 29.7 }    // Delta en el Mar Negro
    ]
  },
  {
    id: 'rhine',
    name: 'Río Rin',
    path: [
      { lat: 46.6, lon: 8.6 },    // Alpes Suizos
      { lat: 50.0, lon: 8.2 },    // Frankfurt / Mainz
      { lat: 51.9, lon: 4.1 }     // Mar del Norte
    ]
  },
  {
    id: 'seine',
    name: 'Río Sena',
    path: [
      { lat: 47.5, lon: 4.7 },
      { lat: 48.8, lon: 2.35 },   // París
      { lat: 49.4, lon: 0.1 }     // Canal de la Mancha
    ]
  },
  {
    id: 'tagus',
    name: 'Río Tajo',
    path: [
      { lat: 40.3, lon: -1.7 },
      { lat: 39.8, lon: -4.0 },   // Toledo
      { lat: 38.7, lon: -9.1 }    // Lisboa -> Océano Atlántico
    ]
  },

  // ---------------- OCEANÍA ----------------
  {
    id: 'murray_darling',
    name: 'Sistema Murray - Darling',
    path: [
      { lat: -29.9, lon: 146.9 }, // Naciente Darling
      { lat: -34.1, lon: 141.9 }, // Confluencia Murray
      { lat: -35.5, lon: 138.9 }  // Gran Bahía Australiana -> Océano Índico
    ]
  }
];