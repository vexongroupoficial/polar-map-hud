// lib/magneticData.js

export const GLOBAL_MAGNETIC_ANOMALIES = [
  // =========================================================================
  // 1. GRANDES ANOMALÍAS REGIONALES Y GLOBALES
  // =========================================================================
  {
    id: 'south_atlantic_anomaly',
    name: 'ANOMALÍA DEL ATLÁNTICO SUR (AAS)',
    type: 'global_depression',
    region: 'Sudamérica - Atlántico Sur',
    info: 'Depresión del Campo Magnético | Penetración Radiación Solar',
    color: 'rgba(236, 72, 153, 0.30)',
    strokeColor: '#ec4899',
    glowColor: '#f472b6',
    polygon: [
      [-5.0, -65.0], [5.0, -35.0], [-15.0, 15.0],
      [-45.0, 20.0], [-50.0, -30.0], [-35.0, -68.0]
    ],
    centerLat: -24.0,
    centerLon: -25.0,
    labelOffset: { dx: 0, dy: 22 } // Abajo del polígono
  },
  {
    id: 'kursk_anomaly',
    name: 'ANOMALÍA DE KURSK',
    type: 'ore_deposit',
    region: 'Rusia',
    info: 'Depósito Masivo de Hierro',
    lat: 51.75,
    lon: 36.15,
    color: '#ec4899',
    radiusKm: 280,
    labelOffset: { dx: 45, dy: 15 } // Desplazado a la derecha
  },
  {
    id: 'bangui_anomaly',
    name: 'ANOMALÍA DE BANGUI',
    type: 'impact_crater_ore',
    region: 'Rep. Centroafricana',
    info: 'Corteza de Alto Hierro / Impacto',
    lat: 4.35,
    lon: 18.55,
    color: '#ec4899',
    radiusKm: 260,
    labelOffset: { dx: 55, dy: -10 } // Desplazado hacia África oriental
  },

  // =========================================================================
  // 2. ANOMALÍAS LOCALES Y YACIMIENTOS DE MAGNETITA
  // =========================================================================
  {
    id: 'kiruna_anomaly',
    name: 'ANOMALÍA DE KIRUNA',
    type: 'local_magnetite',
    region: 'Suecia',
    info: 'Montaña de Magnetita Neón',
    lat: 67.85,
    lon: 20.22,
    color: '#f43f5e',
    radiusKm: 180,
    labelOffset: { dx: 40, dy: -25 } // Arriba a la derecha
  },
  {
    id: 'temagami_anomaly',
    name: 'ANOMALÍA DE TEMAGAMI',
    type: 'local_shield',
    region: 'Canadá (Ontario)',
    info: 'Escudo Canadiense Magnético',
    lat: 47.06,
    lon: -79.78,
    color: '#f43f5e',
    radiusKm: 190,
    labelOffset: { dx: -50, dy: -20 } // Arriba a la izquierda (América N.)
  },

  // =========================================================================
  // 3. ANOMALÍAS TECTÓNICAS Y OCEÁNICAS
  // =========================================================================
  {
    id: 'gulf_mexico_magnetic',
    name: 'ANOMALÍA GOLFO DE MÉXICO',
    type: 'tectonic_rift',
    region: 'Golfo de México',
    info: 'Fragmentación de Pangea',
    lat: 25.0,
    lon: -90.0,
    color: '#a855f7',
    radiusKm: 270,
    labelOffset: { dx: -60, dy: 20 } // Abajo a la izquierda
  },
  {
    id: 'mid_atlantic_stripes',
    name: 'FRANJAS MAGNÉTICAS FONDO MARINO',
    type: 'seafloor_stripes',
    region: 'Dorsal Mesoatlántica',
    info: 'Inversiones Geológicas Simétricas',
    color: '#c084fc',
    path: [
      [65.0, -18.0], [45.0, -28.0], [25.0, -45.0],
      [0.0, -25.0], [-25.0, -14.0], [-50.0, -10.0]
    ],
    labelOffset: { dx: -55, dy: 0 } // Desplazado al Atlántico occidental
  },

  // =========================================================================
  // 4. POLOS MAGNÉTICOS (CONVERGENCIA POLAR)
  // =========================================================================
  {
    id: 'north_magnetic_pole',
    name: 'POLO NORTE MAGNÉTICO',
    type: 'magnetic_pole',
    region: 'Océano Ártico',
    info: 'Inclinación Vertical | Fuerza Horiz. Nula',
    lat: 86.5,
    lon: 160.0,
    color: '#38bdf8',
    radiusKm: 320,
    labelOffset: { dx: 0, dy: -35 } // Arriba en el centro del polo
  },
  {
    id: 'south_magnetic_pole',
    name: 'POLO SUR MAGNÉTICO',
    type: 'convergencia_antartica',
    region: 'Antártida / Océano Antártico',
    info: 'Inclinación Vertical | Brújula Nula',
    lat: -64.0,
    lon: 136.0,
    color: '#38bdf8',
    radiusKm: 320,
    labelOffset: { dx: 0, dy: -25 }
  }
];