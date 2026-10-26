// En lib/mapLayers.js

export const MAP_LAYER_CATEGORIES = {
  CARTOGRAPHY: 'CARTOGRAFÍA Y PAÍSES',
  GEODESY: 'ASTRONOMÍA Y RED GEODÉSICA',
  CELESTIAL: 'MECÁNICA CELESTE',
  PHENOMENA: 'FENÓMENOS NATURALES Y ANOMALÍAS',
  RESOURCES: 'RECURSOS NATURALES Y ENERGÍA',
  CROSSINGS: 'PASAJES CONTINENTALES Y MIGRACIÓN',
  NAVIGATION: 'NAVEGACIÓN Y AMBIENTE',
};

export const MAP_LAYERS = [
  // ==========================================================================
  // 1. ASTRONOMÍA Y RED GEODÉSICA
  // ==========================================================================
  {
    id: 'measure',
    label: 'Medidor de Distancia (P1-P2)',
    description: 'Cálculo ortodrómico en km y millas náuticas',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '📏',
    defaultActive: false,
  },
  {
    id: 'graticule',
    label: 'Meridianos y Paralelos',
    description: 'Red de gráticula geodésica polar',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '🌐',
    defaultActive: false,
  },
  {
    id: 'equatorAndTropics',
    label: 'Ecuador y Trópicos',
    description: 'Paralelos clave a 0° y ±23.43°',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '📐',
    defaultActive: false,
  },
  {
    id: 'timeZones',
    label: 'Zonas Horarias (UTC)',
    description: 'Limbo graduado y husos de 15°',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '🕒',
    defaultActive: false,
  },

  {
    id: 'compassRose',
    label: 'Puntos Cardinales y Rosa de los Vientos',
    description: 'Marcadores N, S, E, W, ángulos de 0° a 360° y orientaciones',
    category: MAP_LAYER_CATEGORIES.GEODESY,
    icon: '🧭',
    defaultActive: false,
  },

  // ==========================================================================
  // 2. MECÁNICA CELESTE Y CALENDARIO DE ENOC
  // ==========================================================================
  
      {
        id: 'sunlight',
        label: 'Día / Noche (Sol Real)',
        description: 'Iluminación solar y proyección del cono de sombra.',
        category: MAP_LAYER_CATEGORIES.CELESTIAL,
        icon: '☀️',
        defaultActive: false,
      },

      {
        id: 'moonPhases',
        label: 'Fases Lunares y Nodos',
        description: 'Desfasaje angular Sol-Luna (12.2°/día) y Nodos ☊/☋.',
        category: MAP_LAYER_CATEGORIES.CELESTIAL,
        icon: '🌙',
        defaultActive: false,
      },

      {
        id: 'planets', // <--- NUEVA CAPA AÑADIDA
        label: 'Planetas Clásicos y Retrogradación',
        description: 'Efemérides kinemáticas de Mercurio ☿, Venus ♀, Marte ♂, Júpiter ♃ y Saturno ♄ con lazos de retrogradación.',
        category: MAP_LAYER_CATEGORIES.CELESTIAL,
        icon: '🪐',
        defaultActive: false,
      },
      {
            id: 'zodiacHouses', // <--- NUEVA CAPA
            label: 'Casas Zodiacales (12 Sectores 30°)',
            description: 'División del marco celeste en los 12 signos del Zodíaco.',
            category: MAP_LAYER_CATEGORIES.CELESTIAL,
            icon: '♈',
            defaultActive: false,
          }, 

          {
          id: 'precessionalEras', // <--- NUEVA CAPA
          label: 'Eras Precesionales (Vector ~2160 Años)',
          description: 'Indicador precesional equinoccial del Gran Año de 25,920 años.',
          category: MAP_LAYER_CATEGORIES.CELESTIAL, 
          icon: '🏛️',
          defaultActive: false,
        },
 
        {
          id: 'enochCalendar',
          label: 'Calendario Solar de Enoc (364 Días)',
          description: 'Ciclo 30-30-31, 4 Portales de transición y días de solsticio',
          category: MAP_LAYER_CATEGORIES.CELESTIAL,
          icon: '🏛️',
          defaultActive: false,
        },



  // ==========================================================================
  // 3. FENÓMENOS NATURALES Y ANOMALÍAS
  // ==========================================================================
  {
    id: 'auroraBorealis',
    label: 'Óvalo Auroral Boreal',
    description: 'Anillo de plasma electromagnético, Kp y observatorios polares',
    category: MAP_LAYER_CATEGORIES.PHENOMENA,
    icon: '🌌',
    defaultActive: false,
  },
  {
    id: 'bermudaTriangle',
    label: 'Triángulo de las Bermudas y Mar del Diablo',
    description: 'Zonas de interferencia magnética y fosas profundas',
    category: MAP_LAYER_CATEGORIES.PHENOMENA,
    icon: '⚠️',
    defaultActive: false,
  },
  {
    id: 'southAtlanticAnomaly',
    label: 'Anomalía del Atlántico Sur (SAA)',
    description: 'Depresión del campo magnético y radiación espacial',
    category: MAP_LAYER_CATEGORIES.PHENOMENA,
    icon: '🧲',
    defaultActive: false,
  },
  {
    id: 'radarSweep',
    label: 'Escáner Radar Táctico',
    description: 'Haz de barrido rotativo de 360°',
    category: MAP_LAYER_CATEGORIES.PHENOMENA,
    icon: '📡',
    defaultActive: false,
  },

  // ==========================================================================
  // 4. RECURSOS NATURALES Y ENERGÍA
  // ==========================================================================
  {
    id: 'petroleumGas',
    label: 'Reservas de Petróleo y Gas Natural',
    description: 'Faja del Orinoco, Golfo Pérsico, Siberia y Cuenca Permiana',
    category: MAP_LAYER_CATEGORIES.RESOURCES,
    icon: '🛢️',
    defaultActive: false,
  },
  {
    id: 'diamondMines',
    label: 'Yacimientos de Diamantes',
    description: 'Minas principales en Yakutia (Mir), Canadá, Australia y Botsuana',
    category: MAP_LAYER_CATEGORIES.RESOURCES,
    icon: '💎',
    defaultActive: false,
  },
  {
    id: 'goldAndLithium',
    label: 'Reservas de Oro y Triángulo del Litio',
    description: 'Cinturones auríferos globales y depósitos de litio',
    category: MAP_LAYER_CATEGORIES.RESOURCES,
    icon: '🏆',
    defaultActive: false,
  },

  // ==========================================================================
  // 5. PASAJES CONTINENTALES Y MIGRACIÓN
  // ==========================================================================
  {
    id: 'strategicCrossings',
    label: 'Puntos Clave y Estrechos',
    description: 'Tapón del Darién, Estrecho de Bering, Bósforo, Israel/Suez y Gibraltar',
    category: MAP_LAYER_CATEGORIES.CROSSINGS,
    icon: '🌉',
    defaultActive: false,
  },
  {
    id: 'migrationRoutes',
    label: 'Rutas Migratorias e Históricas',
    description: 'Corredores humanos continentales y la Ruta de la Seda',
    category: MAP_LAYER_CATEGORIES.CROSSINGS,
    icon: '👣',
    defaultActive: false,
  },

  // ==========================================================================
  // 6. NAVEGACIÓN Y AMBIENTE
  // ==========================================================================
  {
    id: 'windCurrents',
    label: 'Vientos y Corrientes Chorro',
    description: 'Sistemas de viento global y jet streams en tiempo real',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '💨',
    defaultActive: false,
  },
  {
    id: 'oceanTides',
    label: 'Mareas y Corrientes Oceánicas',
    description: 'Flujos marinos, Corriente del Golfo y cuencas térmicas',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '🌊',
    defaultActive: false,
  },
  {
    id: 'airports',
    label: 'Aeropuertos y Rutas Aéreas',
    description: 'Nodos IATA y ortodrómicas polares intercontinentales',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    icon: '✈️',
    defaultActive: false,
  },

  // ==========================================================================
  // 7. CARTOGRAFÍA Y PAÍSES
  // ==========================================================================
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
    defaultActive: false,
  },
  {
    id: 'relief',
    label: 'Relieve y Cordilleras',
    description: 'Sombra topográfica y elevación',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🏔️',
    defaultActive: false,
  },
  {
    id: 'tectonics',
    label: 'Placas Tectónicas y Fosas',
    description: 'Límites geológicos y cinturón de fuego',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🌋',
    defaultActive: false,
  },
  {
    id: 'ancientSites',
    label: 'Pirámides y Sitios Antiguos',
    description: 'Marcadores de monumentos megalíticos y alineaciones',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    icon: '🏛️',
    defaultActive: false,
  },
];

// Estado inicial derivado automáticamente de defaultActive
export const INITIAL_ACTIVE_LAYERS = MAP_LAYERS.reduce((acc, layer) => {
  acc[layer.id] = layer.defaultActive;
  return acc;
}, {});