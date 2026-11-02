// lib/precessionData.js

export const PRECESSIONAL_ERAS = [
  {
    era: 'ERA DE ARIES',
    symbol: '♈',
    house: 1,
    startYear: -2160,
    endYear: 0,
    startAngleDeg: 0,   // Coincide exactamente con el Ascendente (0°)
    endAngleDeg: 30,
    color: '#ef4444',   // Rojo Neón Casa I
    description: 'Edad de Hierro, Grandes Imperios y el Equinoccio en Aries'
  },
  {
    era: 'ERA DE PISCIS',
    symbol: '♓',
    house: 12,
    startYear: 0,
    endYear: 2160,
    startAngleDeg: 330,
    endAngleDeg: 360,
    color: '#94a3b8',
    description: 'Era de la Fe, Navegación Polar y la Luz Psicológica'
  },
  {
    era: 'ERA DE ACUARIO',
    symbol: '♒',
    house: 11,
    startYear: 2160,
    endYear: 4320,
    startAngleDeg: 300,
    endAngleDeg: 330,
    color: '#f43f5e',
    description: 'Era de las Redes, Conciencia Global y Redes Neón'
  },
  {
    era: 'ERA DE CAPRICORNIO',
    symbol: '♑',
    house: 10,
    startYear: 4320,
    endYear: 6480,
    startAngleDeg: 270,
    endAngleDeg: 300,
    color: '#ec4899',
    description: 'Eje del Medio Cielo (MC) y Estructura Sideral'
  },
  {
    era: 'ERA DE SAGITARIO',
    symbol: '♐',
    house: 9,
    startYear: 6480,
    endYear: 8640,
    startAngleDeg: 240,
    endAngleDeg: 270,
    color: '#a855f7',
    description: 'Expansión Cartográfica y Coordenadas Polares'
  },
  {
    era: 'ERA DE ESCORPIO',
    symbol: '♏',
    house: 8,
    startYear: 8640,
    endYear: 10800,
    startAngleDeg: 210,
    endAngleDeg: 240,
    color: '#6366f1',
    description: 'Transformaciones Geofísicas y Magnetismo'
  },
  {
    era: 'ERA DE LIBRA',
    symbol: '♎',
    house: 7,
    startYear: 10800,
    endYear: 12960,
    startAngleDeg: 180,
    endAngleDeg: 210,
    color: '#3b82f6',
    description: 'Equilibrio Sideral en el Descendente (DSC)'
  },
  {
    era: 'ERA DE VIRGO',
    symbol: '♍',
    house: 6,
    startYear: 12960,
    endYear: 15120,
    startAngleDeg: 150,
    endAngleDeg: 180,
    color: '#38bdf8',
    description: 'Ordenamiento de la Bóveda Celeste'
  },
  {
    era: 'ERA DE LEO',
    symbol: '♌',
    house: 5,
    startYear: 15120,
    endYear: 17280,
    startAngleDeg: 120,
    endAngleDeg: 150,
    color: '#06b6d4',
    description: 'Apogeo Solar y Calendario Astronómico'
  },
  {
    era: 'ERA DE CÁNCER',
    symbol: '♋',
    house: 4,
    startYear: 17280,
    endYear: 19440,
    startAngleDeg: 90,
    endAngleDeg: 120,
    color: '#10b981',
    description: 'Base del Fondo del Cielo (IC) y Aguas Globales'
  },
  {
    era: 'ERA DE GÉMINIS',
    symbol: '♊',
    house: 3,
    startYear: 19440,
    endYear: 21600,
    startAngleDeg: 60,
    endAngleDeg: 90,
    color: '#eab308',
    description: 'Dualidad Trigonométrica y Proyección Polar'
  },
  {
    era: 'ERA DE TAURO',
    symbol: '♉',
    house: 2,
    startYear: 21600,
    endYear: 23760,
    startAngleDeg: 30,
    endAngleDeg: 60,
    color: '#f59e0b',
    description: 'Construcción Megalítica y Geodesia Antigua'
  }
];