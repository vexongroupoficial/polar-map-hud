// lib/glacierData.js

export const POLAR_GLACIERS = [
  // =========================================================================
  // 1. CASQUETE POLAR ÁRTICO (Centro del Mapa Polar: 90°N -> 70°N)
  // =========================================================================
  {
    id: 'arctic_ice_cap',
    name: 'CASQUETE POLAR ÁRTICO',
    type: 'central_cap',
    latNorth: 90,
    latSouth: 74,
    color: 'rgba(224, 242, 254, 0.22)',
    strokeColor: '#7dd3fc',
    labelLat: 83.0,
    labelLon: -140.0,
  },

  // =========================================================================
  // 2. INLANDSIS DE GROENLANDIA (Masa Continental Central)
  // =========================================================================
  {
    id: 'greenland_ice_sheet',
    name: 'INLANDSIS DE GROENLANDIA',
    type: 'polygon',
    color: 'rgba(186, 230, 253, 0.35)',
    strokeColor: '#38bdf8',
    labelLat: 72.0,
    labelLon: -40.0,
    polygon: [
      [81.0, -40.0], [78.0, -20.0], [70.0, -25.0], [61.0, -45.0],
      [65.0, -52.0], [76.0, -60.0], [81.0, -60.0]
    ]
  },

  // =========================================================================
  // 3. ANILLO GLACIAR ANTÁRTICO (Borde Periférico Exterior del Mapa: -60°S -> -90°S)
  // =========================================================================
  {
    id: 'antarctic_ice_ring',
    name: 'BARRERA DE HIELO ANTÁRTICA (OCÉANO AUSTRAL)',
    type: 'outer_ring',
    latNorth: -60,
    latSouth: -90,
    color: 'rgba(240, 249, 255, 0.25)',
    strokeColor: '#bae6fd',
    labelLat: -72.0,
    labelLon: -90.0,
  },

  // =========================================================================
  // 4. GLACIARES ALPINOS Y REGIONALES DESTACADOS
  // =========================================================================
  {
    id: 'vatnajokull',
    name: 'Glaciar Vatnajökull',
    region: 'Islandia',
    lat: 64.4,
    lon: -16.8,
    color: 'rgba(186, 230, 253, 0.55)',
    strokeColor: '#38bdf8',
    radiusKm: 80
  },
  {
    id: 'perito_moreno',
    name: 'Glaciar Perito Moreno',
    region: 'Patagonia (Argentina / Chile)',
    lat: -50.5,
    lon: -73.0,
    color: 'rgba(186, 230, 253, 0.55)',
    strokeColor: '#38bdf8',
    radiusKm: 65
  },
  {
    id: 'hubbard_glacier',
    name: 'Glaciar Hubbard',
    region: 'Alaska (EE.UU. / Canadá)',
    lat: 60.0,
    lon: -139.5,
    color: 'rgba(186, 230, 253, 0.55)',
    strokeColor: '#38bdf8',
    radiusKm: 60
  },
  {
    id: 'siachen_glacier',
    name: 'Glaciar Siachen',
    region: 'Karakóram / Himalaya',
    lat: 35.4,
    lon: 77.1,
    color: 'rgba(186, 230, 253, 0.55)',
    strokeColor: '#38bdf8',
    radiusKm: 50
  }
];