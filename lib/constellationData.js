// lib/constellationData.js

export const ZODIAC_CONSTELLATIONS = [
  {
    id: 'aries',
    name: 'ARIES',
    symbol: '♈',
    mainStar: 'Hamal',
    color: '#ef4444', // Red Casa I (ASC) -> Sector 0° a 30° (Centroide lon = 15°)
    stars: [
      { name: 'Hamal (α Ari)', lat: 30.0, lon: 15.0, mag: 2.0 },
      { name: 'Sheratan (β Ari)', lat: 36.0, lon: 10.5, mag: 2.6 },
      { name: 'Mesarthim (γ Ari)', lat: 40.0, lon: 8.6, mag: 3.8 }
    ],
    lines: [[0, 1], [1, 2]]
  },
  {
    id: 'taurus',
    name: 'TAURO',
    symbol: '♉',
    mainStar: 'Aldebarán',
    color: '#f59e0b', // Ámbar Casa II -> Sector 30° a 60° (Centroide lon = 45°)
    stars: [
      { name: 'Aldebarán (α Tau)', lat: 35.0, lon: 45.0, mag: 0.85 },
      { name: 'Elnath (β Tau)', lat: 45.0, lon: 52.2, mag: 1.6 },
      { name: 'Alcyone (Pléyades)', lat: 40.0, lon: 38.7, mag: 2.8 },
      { name: 'Tianguan (ζ Tau)', lat: 28.0, lon: 50.4, mag: 3.0 }
    ],
    lines: [[0, 2], [0, 3], [1, 3]]
  },
  {
    id: 'gemini',
    name: 'GÉMINIS',
    symbol: '♊',
    mainStar: 'Pólux & Cástor',
    color: '#eab308', // Amarillo Casa III -> Sector 60° a 90° (Centroide lon = 75°)
    stars: [
      { name: 'Pólux (β Gem)', lat: 38.0, lon: 78.0, mag: 1.1 },
      { name: 'Cástor (α Gem)', lat: 44.0, lon: 74.0, mag: 1.58 },
      { name: 'Alhena (γ Gem)', lat: 24.0, lon: 70.0, mag: 1.9 },
      { name: 'Mebsuta (ε Gem)', lat: 32.0, lon: 67.0, mag: 3.0 }
    ],
    lines: [[1, 0], [1, 3], [0, 2]]
  },
  {
    id: 'cancer',
    name: 'CÁNCER',
    symbol: '♋',
    mainStar: 'Tarf',
    color: '#10b981', // Esmeralda Casa IV (IC) -> Sector 90° a 120° (Centroide lon = 105°)
    stars: [
      { name: 'Tarf (β Cnc)', lat: 25.0, lon: 102.0, mag: 3.5 },
      { name: 'Asellus Australis', lat: 34.0, lon: 105.0, mag: 3.9 },
      { name: 'Asellus Borealis', lat: 40.0, lon: 107.0, mag: 4.0 },
      { name: 'Acubens (α Cnc)', lat: 28.0, lon: 112.0, mag: 4.2 }
    ],
    lines: [[0, 1], [1, 2], [1, 3]]
  },
  {
    id: 'leo',
    name: 'LEO',
    symbol: '♌',
    mainStar: 'Regulus',
    color: '#06b6d4', // Cian Casa V -> Sector 120° a 150° (Centroide lon = 135°)
    stars: [
      { name: 'Regulus (α Leo)', lat: 26.0, lon: 132.0, mag: 1.35 },
      { name: 'Denebola (β Leo)', lat: 32.0, lon: 145.0, mag: 2.1 },
      { name: 'Algieba (γ Leo)', lat: 42.0, lon: 130.0, mag: 2.0 },
      { name: 'Zosma (δ Leo)', lat: 44.0, lon: 140.0, mag: 2.5 }
    ],
    lines: [[0, 2], [2, 3], [3, 1]]
  },
  {
    id: 'virgo',
    name: 'VIRGO',
    symbol: '♍',
    mainStar: 'Spica',
    color: '#38bdf8', // Azul Neón Casa VI -> Sector 150° a 180° (Centroide lon = 165°)
    stars: [
      { name: 'Spica (α Vir)', lat: 25.0, lon: 165.0, mag: 0.98 },
      { name: 'Porrima (γ Vir)', lat: 35.0, lon: 158.0, mag: 2.7 },
      { name: 'Vindemiatrix (ε Vir)', lat: 45.0, lon: 162.0, mag: 2.8 },
      { name: 'Heze (ζ Vir)', lat: 30.0, lon: 172.0, mag: 3.3 }
    ],
    lines: [[0, 1], [1, 2], [0, 3]]
  },
  {
    id: 'libra',
    name: 'LIBRA',
    symbol: '♎',
    mainStar: 'Zubeneschamali',
    color: '#3b82f6', // Azul Casa VII (DSC) -> Sector 180° a 210° (Centroide lon = 195°)
    stars: [
      { name: 'Zubeneschamali (β Lib)', lat: 38.0, lon: 195.0, mag: 2.6 },
      { name: 'Zubenelgenubi (α Lib)', lat: 28.0, lon: 188.0, mag: 2.7 },
      { name: 'Brachium (σ Lib)', lat: 45.0, lon: 202.0, mag: 3.2 }
    ],
    lines: [[0, 1], [0, 2], [1, 2]]
  },
  {
    id: 'scorpius',
    name: 'ESCORPIO',
    symbol: '♏',
    mainStar: 'Antares',
    color: '#6366f1', // Índigo Casa VIII -> Sector 210° a 240° (Centroide lon = 225°)
    stars: [
      { name: 'Antares (α Sco)', lat: 32.0, lon: 225.0, mag: 0.96 },
      { name: 'Shaula (λ Sco)', lat: 45.0, lon: 232.0, mag: 1.6 },
      { name: 'Sargas (θ Sco)', lat: 42.0, lon: 235.0, mag: 1.8 },
      { name: 'Dschubba (δ Sco)', lat: 26.0, lon: 218.0, mag: 2.3 }
    ],
    lines: [[3, 0], [0, 1], [1, 2]]
  },
  {
    id: 'sagittarius',
    name: 'SAGITARIO',
    symbol: '♐',
    mainStar: 'Kaus Australis',
    color: '#a855f7', // Púrpura Casa IX -> Sector 240° a 270° (Centroide lon = 255°)
    stars: [
      { name: 'Kaus Australis (ε Sgr)', lat: 30.0, lon: 255.0, mag: 1.7 },
      { name: 'Nunki (σ Sgr)', lat: 42.0, lon: 258.0, mag: 2.0 },
      { name: 'Ascella (ζ Sgr)', lat: 44.0, lon: 262.0, mag: 2.6 },
      { name: 'Kaus Media (δ Sgr)', lat: 32.0, lon: 248.0, mag: 2.7 }
    ],
    lines: [[3, 0], [0, 2], [2, 1], [1, 3]]
  },
  {
    id: 'capricornus',
    name: 'CAPRICORNIO',
    symbol: '♑',
    mainStar: 'Deneb Algedi',
    color: '#ec4899', // Rosa Casa X (MC) -> Sector 270° a 300° (Centroide lon = 285°)
    stars: [
      { name: 'Deneb Algedi (δ Cap)', lat: 35.0, lon: 285.0, mag: 2.8 },
      { name: 'Dabih (β Cap)', lat: 30.0, lon: 278.0, mag: 3.0 },
      { name: 'Algiedi (α Cap)', lat: 26.0, lon: 275.0, mag: 3.6 }
    ],
    lines: [[2, 1], [1, 0]]
  },
  {
    id: 'aquarius',
    name: 'ACUARIO',
    symbol: '♒',
    mainStar: 'Sadalsuud',
    color: '#f43f5e', // Rosa Neón Casa XI -> Sector 300° a 330° (Centroide lon = 315°)
    stars: [
      { name: 'Sadalsuud (β Aqr)', lat: 32.0, lon: 315.0, mag: 2.9 },
      { name: 'Sadalmelik (α Aqr)', lat: 38.0, lon: 310.0, mag: 2.95 },
      { name: 'Skat (δ Aqr)', lat: 44.0, lon: 322.0, mag: 3.2 }
    ],
    lines: [[0, 1], [1, 2]]
  },
  {
    id: 'pisces',
    name: 'PISCIS',
    symbol: '♓',
    mainStar: 'Alpherg',
    color: '#94a3b8', // Gris Plata Casa XII -> Sector 330° a 360° (Centroide lon = 345°)
    stars: [
      { name: 'Alpherg (η Psc)', lat: 32.0, lon: 345.0, mag: 3.6 },
      { name: 'Alrescha (α Psc)', lat: 26.0, lon: 350.0, mag: 3.8 },
      { name: 'Linteum (γ Psc)', lat: 38.0, lon: 338.0, mag: 3.7 }
    ],
    lines: [[2, 1], [1, 0]]
  }
];