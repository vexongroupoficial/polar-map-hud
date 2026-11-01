// lib/anomalyData.js

export const GLOBAL_ANOMALIES = [
  // =========================================================================
  // 1. TRIÁNGULO DE LAS BERMUDAS (Caribe / Atlántico Norte)
  // =========================================================================
  {
    id: 'bermuda_triangle',
    name: 'TRIÁNGULO DE LAS BERMUDAS',
    region: 'Caribe / Atlántico Norte',
    info: 'Anomalía Magnética y Gravitacional',
    color: 'rgba(244, 63, 94, 0.28)',    // Rosa/Rojo Neón sutil
    strokeColor: '#f43f5e',
    glowColor: '#fb7185',
    // Vértices exactos: Miami (EE.UU.), Bermudas, San Juan (Puerto Rico)
    polygon: [
      [25.76, -80.19], // Miami
      [32.30, -64.77], // Islas Bermudas
      [18.46, -66.10]  // San Juan, Puerto Rico
    ],
    centerLat: 25.5,
    centerLon: -70.3
  },

  // =========================================================================
  // 2. TRIÁNGULO DEL DRAGÓN / MAR DEL DIABLO (Asia / Océano Pacífico)
  // =========================================================================
  {
    id: 'dragons_triangle',
    name: 'TRIÁNGULO DEL DRAGÓN (MAR DEL DIABLO)',
    region: 'Asia / Océano Pacífico (Japón - Guam - Taiwán)',
    info: 'Vórtice Electromagnético y Volcánico',
    color: 'rgba(168, 85, 247, 0.28)',   // Violeta/Púrpura Neón sutil
    strokeColor: '#a855f7',
    glowColor: '#c084fc',
    // Vértices exactos: Costa de Tokio (Japón), Guam, Taiwán / Luzón
    polygon: [
      [35.68, 139.76], // Tokio, Japón
      [13.44, 144.79], // Isla de Guam
      [22.50, 121.50]  // Taiwán / Mar de Filipinas
    ],
    centerLat: 23.8,
    centerLon: 135.3
  }
];