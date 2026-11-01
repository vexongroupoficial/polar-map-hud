// lib/resourceData.js

export const GLOBAL_RESOURCES = [
  // =========================================================================
  // 1. PETRÓLEO (RESERVAS PROBADAS MUNDIALES) 🛢️
  // =========================================================================
  {
    id: 'oil_venezuela',
    name: 'FAJA DEL ORINOCO (VENEZUELA)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '303,200M bbl (#1 Mundial)',
    lat: 8.5, lon: -63.5,
    color: '#f59e0b', // Ámbar Neón
    radiusKm: 320,
    labelOffset: { dx: -60, dy: -25 }
  },
  {
    id: 'oil_saudi',
    name: 'CAMPO GHAWAR (ARABIA SAUDITA)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '267,200M bbl (#2 Mundial)',
    lat: 25.0, lon: 49.5,
    color: '#f59e0b',
    radiusKm: 300,
    labelOffset: { dx: 45, dy: -15 }
  },
  {
    id: 'oil_iran',
    name: 'CUENCA AHVAZ (IRÁN)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '208,600M bbl (#3 Mundial)',
    lat: 31.3, lon: 48.7,
    color: '#f59e0b',
    radiusKm: 270,
    labelOffset: { dx: 50, dy: -25 }
  },
  {
    id: 'oil_canada',
    name: 'ATHABASCA TAR SANDS (CANADÁ)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '163,100M bbl (Arenas Bituminosas)',
    lat: 57.0, lon: -111.5,
    color: '#f59e0b',
    radiusKm: 280,
    labelOffset: { dx: -55, dy: -20 }
  },
  {
    id: 'oil_iraq',
    name: 'CAMPO RUMAILA (IRAK)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '145,000M bbl (#5 Mundial)',
    lat: 30.5, lon: 47.3,
    color: '#f59e0b',
    radiusKm: 250,
    labelOffset: { dx: 40, dy: 15 }
  },
  {
    id: 'oil_uae',
    name: 'ABU DHABI (E.A.U.)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '113,000M bbl',
    lat: 24.4, lon: 54.3,
    color: '#f59e0b',
    radiusKm: 230,
    labelOffset: { dx: 45, dy: 20 }
  },
  {
    id: 'oil_kuwait',
    name: 'CAMPO BURGAN (KUWAIT)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '101,500M bbl',
    lat: 29.0, lon: 47.9,
    color: '#f59e0b',
    radiusKm: 220,
    labelOffset: { dx: -45, dy: 20 }
  },
  {
    id: 'oil_russia',
    name: 'SIBERIA OCCIDENTAL (RUSIA)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '80,000M bbl',
    lat: 61.0, lon: 73.0,
    color: '#f59e0b',
    radiusKm: 260,
    labelOffset: { dx: 55, dy: -10 }
  },
  {
    id: 'oil_usa',
    name: 'PERMIAN BASIN (EE. UU.)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '74,400M bbl (Líder Shale Oil)',
    lat: 31.8, lon: -102.3,
    color: '#f59e0b',
    radiusKm: 250,
    labelOffset: { dx: -55, dy: 20 }
  },
  {
    id: 'oil_libya',
    name: 'CUENCA DE SIRTE (LIBIA)',
    category: 'oil',
    symbol: '🛢️',
    valueStr: '48,400M bbl (#1 África)',
    lat: 29.0, lon: 19.0,
    color: '#f59e0b',
    radiusKm: 210,
    labelOffset: { dx: -45, dy: -25 }
  },

  // =========================================================================
  // 2. ORO (PRODUCCIÓN Y RESERVAS MINERAS) 🪙
  // =========================================================================
  {
    id: 'gold_china',
    name: 'SHANDONG / ZHAOYUAN (CHINA)',
    category: 'gold',
    symbol: '🪙',
    valueStr: '384 t/año (#1 Productor 10% Global)',
    lat: 36.5, lon: 118.0,
    color: '#eab308', // Dorado Neón
    radiusKm: 260,
    labelOffset: { dx: 50, dy: -20 }
  },
  {
    id: 'gold_russia',
    name: 'KRASNOYARSK / OLYMPIADA (RUSIA)',
    category: 'gold',
    symbol: '🪙',
    valueStr: '345 t/año (#2 Producción)',
    lat: 59.5, lon: 92.8,
    color: '#eab308',
    radiusKm: 250,
    labelOffset: { dx: 55, dy: 15 }
  },
  {
    id: 'gold_australia',
    name: 'KALGOORLIE (AUSTRALIA)',
    category: 'gold',
    symbol: '🪙',
    valueStr: '293 t/año (Reserva: 13,000 t #1)',
    lat: -30.7, lon: 121.4,
    color: '#eab308',
    radiusKm: 270,
    labelOffset: { dx: 50, dy: 20 }
  },
  {
    id: 'gold_peru',
    name: 'YANACOCHA / CAJAMARCA (PERÚ)',
    category: 'gold',
    symbol: '🪙',
    valueStr: '208 t/año (#1 Latinoamérica)',
    lat: -7.0, lon: -78.5,
    color: '#eab308',
    radiusKm: 230,
    labelOffset: { dx: -55, dy: -15 }
  },
  {
    id: 'gold_ghana',
    name: 'CINTURÓN ASHANTI (GHANA)',
    category: 'gold',
    symbol: '🪙',
    valueStr: '187 t/año (#1 África)',
    lat: 6.2, lon: -1.6,
    color: '#eab308',
    radiusKm: 220,
    labelOffset: { dx: -45, dy: 20 }
  },

  // =========================================================================
  // 3. DIAMANTES (CRATONES Y RESERVAS MASIVAS) 💎
  // =========================================================================
  {
    id: 'diamond_russia',
    name: 'YAKUTIA / MINA MIR (RUSIA)',
    category: 'diamond',
    symbol: '💎',
    valueStr: '44% Reservas Mundiales (#1 Vol.)',
    lat: 62.5, lon: 114.0,
    color: '#06b6d4', // Cian Diamante Neón
    radiusKm: 290,
    labelOffset: { dx: 55, dy: -25 }
  },
  {
    id: 'diamond_botswana',
    name: 'ORAPA / JWANENG (BOTSUANA)',
    category: 'diamond',
    symbol: '💎',
    valueStr: '#1 Valor de Mercado (Gema Pura)',
    lat: -24.5, lon: 24.7,
    color: '#06b6d4',
    radiusKm: 250,
    labelOffset: { dx: 45, dy: 20 }
  },
  {
    id: 'diamond_drc',
    name: 'MBUJI-MAYI (R.D. CONGO)',
    category: 'diamond',
    symbol: '💎',
    valueStr: 'Gran Volumen Grado Industrial',
    lat: -6.1, lon: 23.6,
    color: '#06b6d4',
    radiusKm: 240,
    labelOffset: { dx: 45, dy: -20 }
  },

  // =========================================================================
  // 4. MINERALES INDUSTRIALES Y TRANSICIÓN ENERGÉTICA ⚒️
  // =========================================================================
  {
    id: 'lithium_triangle',
    name: 'TRIÁNGULO DEL LITIO (CHILE/BOLIVIA)',
    category: 'critical_minerals',
    symbol: '🔋',
    valueStr: '25% Reserva Global (Atacama/Uyuni)',
    lat: -22.5, lon: -67.5,
    color: '#10b981', // Esmeralda Neón
    radiusKm: 270,
    labelOffset: { dx: -60, dy: 15 }
  },
  {
    id: 'cobalt_drc',
    name: 'CINTURÓN KATANGA (R.D. CONGO)',
    category: 'critical_minerals',
    symbol: '⚡',
    valueStr: '50% Reserva Global de Cobalto',
    lat: -11.5, lon: 27.5,
    color: '#a855f7', // Púrpura Batería
    radiusKm: 260,
    labelOffset: { dx: 50, dy: 15 }
  },
  {
    id: 'rare_earths_china',
    name: 'BAYAN OBO (CHINA)',
    category: 'critical_minerals',
    symbol: '🧲',
    valueStr: '52% Reservas Tierras Raras',
    lat: 41.7, lon: 110.0,
    color: '#ec4899', // Rosa Neón Tech
    radiusKm: 270,
    labelOffset: { dx: 55, dy: 20 }
  },
  {
    id: 'phosphate_morocco',
    name: 'KHOURIBGA (MARRUECOS)',
    category: 'critical_minerals',
    symbol: '🌱',
    valueStr: '69% Reservas de Fosfato',
    lat: 32.8, lon: -6.9,
    color: '#84cc16', // Verde Lima Fertilizante
    radiusKm: 280,
    labelOffset: { dx: -55, dy: -20 }
  },
  {
    id: 'nickel_indonesia',
    name: 'SULAWESI (INDONESIA)',
    category: 'critical_minerals',
    symbol: '⚙️',
    valueStr: '44% Reservas de Níquel',
    lat: -2.5, lon: 121.5,
    color: '#64748b',
    radiusKm: 250,
    labelOffset: { dx: 50, dy: -15 }
  },
  {
    id: 'copper_chile',
    name: 'MINA ESCONDIDA (CHILE)',
    category: 'critical_minerals',
    symbol: '🔌',
    valueStr: '21% Reservas Mundiales Cobre',
    lat: -24.2, lon: -69.1,
    color: '#f97316', // Naranja Cobre
    radiusKm: 250,
    labelOffset: { dx: -55, dy: -20 }
  },
  {
    id: 'iron_australia',
    name: 'PILBARA (AUSTRALIA)',
    category: 'critical_minerals',
    symbol: '🏗️',
    valueStr: '31% Reservas Mundiales Hierro',
    lat: -22.5, lon: 118.5,
    color: '#ef4444',
    radiusKm: 280,
    labelOffset: { dx: 55, dy: -20 }
  },
  {
    id: 'bauxite_guinea',
    name: 'BOKÉ (GUINEA)',
    category: 'critical_minerals',
    symbol: '📦',
    valueStr: '26% Reservas de Bauxita (Aluminio)',
    lat: 10.9, lon: -14.3,
    color: '#e11d48',
    radiusKm: 230,
    labelOffset: { dx: -50, dy: 15 }
  }
];