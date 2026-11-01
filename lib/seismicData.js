// lib/seismicData.js

export const GLOBAL_SEISMIC_ANOMALIES = [
  // =========================================================================
  // 1. ANOMALÍAS DE RUPTURA SUPERSÓNICA Y DOBLETES SÍSMICOS
  // =========================================================================
  {
    id: 'venezuela_supersonic_2026',
    name: 'DOBLETE SUPERSÓNICO (VENEZUELA)',
    type: 'supershear_rupture',
    region: 'Falla Boconó - San Sebastián',
    info: 'Ruptura multidoble continental/submarina (5.5 km/s)',
    lat: 10.5,
    lon: -67.0,
    color: '#ef4444', // Rojo Neón Explosivo
    waveSpeed: 2.2,
    faultPath: [
      [8.8, -71.2],  // Falla de Boconó (Mérida)
      [10.2, -67.5], // Punto de Salto de Ruptura
      [10.6, -65.5]  // Falla de San Sebastián (Caribe)
    ]
  },

  // =========================================================================
  // 2. TERREMOTOS INTRAPLACA (ZONAS ESTABLES FRIAS)
  // =========================================================================
  {
    id: 'new_madrid_intraplate',
    name: 'ZONA INTRAPLATE NEW MADRID',
    type: 'intraplate_anom',
    region: 'Centro de EE. UU.',
    info: 'Transferencia telúrica severa en corteza fría estable',
    lat: 36.6,
    lon: -89.6,
    color: '#f59e0b', // Ámbar Neón
    radiusKm: 210
  },

  // =========================================================================
  // 3. ANOMALÍAS PRECURSORAS (TÉRMICAS E IONOSFÉRICAS) & LUCES EQL
  // =========================================================================
  {
    id: 'japan_trench_ionosphere',
    name: 'FOSA DE JAPÓN (ANOMALÍA IONOSFÉRICA / EQL)',
    type: 'ionospheric_eql',
    region: 'Pacífico Noroeste',
    info: 'Ionización atmosférica & destellos de luz piezoeléctrica (EQL)',
    lat: 38.0,
    lon: 142.5,
    color: '#06b6d4', // Cian Neón Plasma
    radiusKm: 280
  },
  {
    id: 'peru_chile_trench',
    name: 'FOSA PERÚ-CHILE (ANOMALÍA TÉRMICA)',
    type: 'thermal_precursor',
    region: 'Sudamérica Pacífico',
    info: 'Incremento infrarrojo en el suelo previo a megaterremoto',
    lat: -30.0,
    lon: -72.0,
    color: '#f97316', // Naranja Térmico
    radiusKm: 320
  },
  {
    id: 'cascadia_ets',
    name: 'CASCADIA ETS (DESLIZAMIENTO SILENCIOSO)',
    type: 'silent_tremor',
    region: 'EE. UU. / Canadá',
    info: 'Episodios de temblor lento y liberación constante',
    lat: 45.0,
    lon: -124.5,
    color: '#10b981', // Esmeralda Neón
    radiusKm: 250
  },

  // =========================================================================
  // 4. COLISIONES CONTINENTALES Y ANOMALÍAS GRAVITACIONALES
  // =========================================================================
  {
    id: 'himalaya_megathrust',
    name: 'MEGATHERRAMIENTO HIMALAYO',
    type: 'continental_collision',
    region: 'India / Nepal / China',
    info: 'Retardo de ondas por hiper-grosor cortical',
    lat: 28.5,
    lon: 84.5,
    color: '#ef4444',
    radiusKm: 300
  },
  {
    id: 'puerto_rico_trench',
    name: 'FOSA DE PUERTO RICO',
    type: 'gravimetric_anom',
    region: 'Caribe Septentrional',
    info: 'Variaciones gravitacionales & dipolos electromagnéticos',
    lat: 19.5,
    lon: -66.5,
    color: '#a855f7', // Púrpura Neón
    radiusKm: 220
  },

  // =========================================================================
  // 5. ONDAS DE NÚCLEO (MICROSÍSMICA POR TORMENTAS CONTINENTALES)
  // =========================================================================
  {
    id: 'north_atlantic_pkp',
    name: 'ONDAS DE NÚCLEO PKP (ATLÁNTICO N. -> AUSTRALIA)',
    type: 'core_propagation',
    region: 'Groenlandia / Núcleo Terrestre',
    info: 'Ruido tormentoso enfocado a través del núcleo terrestre',
    lat: 62.0,
    lon: -35.0,
    color: '#3b82f6', // Azul Neón
    targetLat: -34.0,
    targetLon: 145.0
  }
];