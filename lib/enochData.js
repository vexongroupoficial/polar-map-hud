

export const ENOCH_GATES = [
  { gate: 1, name: 'PUERTA 1 (Solsticio Invierno)', relRadius: 0.85, color: '#ec4899', latitude: -23.44 },
  { gate: 2, name: 'PUERTA 2', relRadius: 0.77, color: '#a855f7', latitude: -15.6 },
  { gate: 3, name: 'PUERTA 3', relRadius: 0.69, color: '#3b82f6', latitude: -7.8 },
  { gate: 4, name: 'PUERTA 4 (Equinoccios)', relRadius: 0.61, color: '#ef4444', latitude: 0.0 },
  { gate: 5, name: 'PUERTA 5', relRadius: 0.53, color: '#f59e0b', latitude: 11.7 },
  { gate: 6, name: 'PUERTA 6 (Solsticio Verano)', relRadius: 0.45, color: '#10b981', latitude: 23.44 }
];

export const ENOCH_STASIONS = [
  { id: 1, name: 'EQUINOCCIO DE PRIMAVERA', day: 1,   gate: 4, lat: 0.00,   color: '#ef4444', deg: 0 },
  { id: 2, name: 'SOLSTICIO DE VERANO',    day: 91,  gate: 6, lat: +23.44, color: '#10b981', deg: 90 },
  { id: 3, name: 'EQUINOCCIO DE OTOÑO',     day: 182, gate: 4, lat: 0.00,   color: '#3b82f6', deg: 180 },
  { id: 4, name: 'SOLSTICIO DE INVIERNO',   day: 273, gate: 1, lat: -23.44, color: '#ec4899', deg: 270 }
];

export const ENOCH_CALENDAR_SECTORS = [
  {
    id: 'spring',
    name: 'PRIMAVERA (TEKUFAH 1)',
    gateText: 'PUERTA 4 ➔ 5 ➔ 6',
    days: 91,
    startDeg: 0,    // Ascendente (0° izquierda)
    endDeg: 90,    // Fondo del Cielo (90°)
    color: '#ef4444'
  },
  {
    id: 'summer',
    name: 'VERANO (TEKUFAH 2)',
    gateText: 'PUERTA 6 ➔ 5 ➔ 4',
    days: 91,
    startDeg: 90,   // Fondo del Cielo (90°)
    endDeg: 180,   // Descendente (180°)
    color: '#10b981'
  },
  {
    id: 'autumn',
    name: 'OTOÑO (TEKUFAH 3)',
    gateText: 'PUERTA 4 ➔ 3 ➔ 2',
    days: 91,
    startDeg: 180,  // Descendente (180°)
    endDeg: 270,   // Medio Cielo (270°)
    color: '#3b82f6'
  },
  {
    id: 'winter',
    name: 'INVIERNO (TEKUFAH 4)',
    gateText: 'PUERTA 2 ➔ 1 ➔ 4',
    days: 91,
    startDeg: 270,  // Medio Cielo (270°)
    endDeg: 360,   // Ascendente (360°)
    color: '#ec4899'
  }
];