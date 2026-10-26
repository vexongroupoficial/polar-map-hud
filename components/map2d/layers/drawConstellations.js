import { latLonToPolar } from '@/lib/polarMath';

// Catálogo de estrellas principales y líneas de asterismo para las 12 constelaciones zodiacales
const ZODIAC_CONSTELLATIONS = [
  {
    id: 'aries', name: 'ARIES', symbol: '♈', color: '#f87171',
    stars: [
      { name: 'Hamal', ra: 31.7, dec: 23.4, mag: 2.0 },
      { name: 'Sheratan', ra: 28.7, dec: 20.8, mag: 2.6 },
      { name: 'Mesarthim', ra: 27.9, dec: 19.3, mag: 3.8 },
      { name: '41 Arietis', ra: 42.4, dec: 27.3, mag: 3.6 }
    ],
    lines: [[0, 1], [1, 2], [0, 3]]
  },
  {
    id: 'taurus', name: 'TAURO', symbol: '♉', color: '#4ade80',
    stars: [
      { name: 'Aldebarán', ra: 68.9, dec: 16.5, mag: 0.85 },
      { name: 'Elnath', ra: 81.6, dec: 28.6, mag: 1.65 },
      { name: 'Tianguan', ra: 84.4, dec: 21.1, mag: 3.0 },
      { name: 'Ain', ra: 67.1, dec: 19.2, mag: 3.5 },
      { name: 'Alcyone (Pléyades)', ra: 56.9, dec: 24.1, mag: 2.8 }
    ],
    lines: [[0, 3], [3, 4], [0, 2], [2, 1]]
  },
  {
    id: 'gemini', name: 'GÉMINIS', symbol: '♊', color: '#fef08a',
    stars: [
      { name: 'Pólux', ra: 116.2, dec: 28.0, mag: 1.14 },
      { name: 'Cástor', ra: 113.6, dec: 31.9, mag: 1.58 },
      { name: 'Alhena', ra: 99.4, dec: 16.4, mag: 1.9 },
      { name: 'Wasat', ra: 110.0, dec: 21.9, mag: 3.5 },
      { name: 'Mebsuta', ra: 100.9, dec: 25.1, mag: 3.0 }
    ],
    lines: [[1, 0], [0, 3], [3, 2], [1, 4]]
  },
  {
    id: 'cancer', name: 'CÁNCER', symbol: '♋', color: '#c084fc',
    stars: [
      { name: 'Tarf', ra: 124.1, dec: 9.2, mag: 3.5 },
      { name: 'Asellus Australis', ra: 128.6, dec: 18.1, mag: 3.9 },
      { name: 'Asellus Borealis', ra: 128.3, dec: 21.5, mag: 4.6 },
      { name: 'Acubens', ra: 134.7, dec: 11.8, mag: 4.2 }
    ],
    lines: [[0, 1], [1, 2], [1, 3]]
  },
  {
    id: 'leo', name: 'LEO', symbol: '♌', color: '#fb923c',
    stars: [
      { name: 'Régulo', ra: 152.1, dec: 11.9, mag: 1.36 },
      { name: 'Denebola', ra: 177.3, dec: 14.6, mag: 2.14 },
      { name: 'Algieba', ra: 155.0, dec: 19.8, mag: 2.0 },
      { name: 'Zosma', ra: 168.5, dec: 20.5, mag: 2.56 },
      { name: 'Adhafera', ra: 154.2, dec: 23.8, mag: 3.4 }
    ],
    lines: [[0, 2], [2, 4], [2, 3], [3, 1], [0, 1]]
  },
  {
    id: 'virgo', name: 'VIRGO', symbol: '♍', color: '#a7f3d0',
    stars: [
      { name: 'Espica', ra: 201.3, dec: -11.2, mag: 0.98 },
      { name: 'Porrima', ra: 190.4, dec: -1.4, mag: 2.74 },
      { name: 'Vindemiatrix', ra: 195.5, dec: 10.9, mag: 2.8 },
      { name: 'Zavijava', ra: 177.7, dec: 1.8, mag: 3.6 },
      { name: 'Heze', ra: 203.1, dec: -0.6, mag: 3.4 }
    ],
    lines: [[0, 4], [4, 1], [1, 3], [1, 2]]
  },
  {
    id: 'libra', name: 'LIBRA', symbol: '♎', color: '#f472b6',
    stars: [
      { name: 'Zubeneschamali', ra: 229.2, dec: -9.4, mag: 2.6 },
      { name: 'Zubenelgenubi', ra: 222.7, dec: -16.0, mag: 2.75 },
      { name: 'Zubenelhakrabi', ra: 233.1, dec: -14.8, mag: 3.9 },
      { name: 'Brachium', ra: 226.6, dec: -25.2, mag: 3.2 }
    ],
    lines: [[1, 0], [0, 2], [2, 1], [1, 3]]
  },
  {
    id: 'scorpius', name: 'ESCORPIO', symbol: '♏', color: '#e11d48',
    stars: [
      { name: 'Antares', ra: 247.4, dec: -26.4, mag: 1.05 },
      { name: 'Graffias', ra: 241.3, dec: -19.8, mag: 2.5 },
      { name: 'Dschubba', ra: 240.1, dec: -22.6, mag: 2.2 },
      { name: 'Sargas', ra: 264.3, dec: -43.0, mag: 1.86 },
      { name: 'Shaula', ra: 263.4, dec: -37.1, mag: 1.62 }
    ],
    lines: [[1, 2], [2, 0], [0, 4], [4, 3]]
  },
  {
    id: 'sagittarius', name: 'SAGITARIO', symbol: '♐', color: '#fbbf24',
    stars: [
      { name: 'Kaus Australis', ra: 276.0, dec: -34.4, mag: 1.79 },
      { name: 'Nunki', ra: 283.8, dec: -26.3, mag: 2.05 },
      { name: 'Ascella', ra: 286.2, dec: -29.9, mag: 2.6 },
      { name: 'Kaus Media', ra: 275.2, dec: -29.8, mag: 2.7 },
      { name: 'Kaus Borealis', ra: 277.0, dec: -25.4, mag: 2.82 }
    ],
    lines: [[0, 3], [3, 4], [4, 1], [1, 2], [2, 0], [3, 1]]
  },
  {
    id: 'capricornus', name: 'CAPRICORNIO', symbol: '♑', color: '#94a3b8',
    stars: [
      { name: 'Deneb Algedi', ra: 326.8, dec: -16.1, mag: 2.8 },
      { name: 'Dabih', ra: 305.2, dec: -14.8, mag: 3.0 },
      { name: 'Algedi', ra: 304.5, dec: -12.5, mag: 3.5 },
      { name: 'Nashira', ra: 325.2, dec: -16.6, mag: 3.68 }
    ],
    lines: [[2, 1], [1, 3], [3, 0]]
  },
  {
    id: 'aquarius', name: 'ACUARIO', symbol: '22d3ee', color: '#22d3ee',
    stars: [
      { name: 'Sadalsuud', ra: 323.0, dec: -5.6, mag: 2.9 },
      { name: 'Sadalmelik', ra: 331.4, dec: -0.3, mag: 2.95 },
      { name: 'Skaat', ra: 342.2, dec: -15.8, mag: 3.2 },
      { name: 'Sadachbia', ra: 335.9, dec: -1.4, mag: 3.8 }
    ],
    lines: [[0, 1], [1, 3], [3, 2]]
  },
  {
    id: 'pisces', name: 'PISCIS', symbol: '♓', color: '#38bdf8',
    stars: [
      { name: 'Alrescha', ra: 30.0, dec: 2.7, mag: 3.8 },
      { name: 'Fum al Samakah', ra: 345.0, dec: 7.6, mag: 4.5 },
      { name: 'Linteum', ra: 22.0, dec: 8.0, mag: 4.3 },
      { name: 'Kaht', ra: 1.0, dec: 15.3, mag: 4.2 }
    ],
    lines: [[1, 3], [3, 0], [0, 2]]
  }
];

export function drawConstellations(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation
) {
  if (!activeLayers?.constellations) return;

  ctx.save();

  ZODIAC_CONSTELLATIONS.forEach((constellation) => {
    // 1. Convertir estrellas celestes a coordenadas del lienzo polar Canvas
    const canvasStars = constellation.stars.map((star) => {
      const pos = latLonToPolar(star.dec, star.ra - 180, mapRadius, rotation);
      return {
        x: centerX + pos.x,
        y: centerY + pos.y,
        mag: star.mag,
        name: star.name
      };
    });

    // 2. Trazo de líneas de asterismo en Neón
    ctx.save();
    ctx.strokeStyle = constellation.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    ctx.setLineDash([2, 2]);

    constellation.lines.forEach(([startIndex, endIndex]) => {
      const p1 = canvasStars[startIndex];
      const p2 = canvasStars[endIndex];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
    ctx.restore();

    // 3. Renderizado de estrellas (Puntos luminosos con resplandor)
    canvasStars.forEach((star) => {
      const starRadius = Math.max(1.2, 3.8 - star.mag * 0.6);

      ctx.save();
      const glow = ctx.createRadialGradient(star.x, star.y, 0.5, star.x, star.y, starRadius * 3);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.4, constellation.color);
      glow.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(star.x, star.y, starRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, starRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Etiqueta con Símbolo e Ideograma en el centro ideológico de la constelación
    if (canvasStars.length > 0) {
      const avgX = canvasStars.reduce((sum, s) => sum + s.x, 0) / canvasStars.length;
      const avgY = canvasStars.reduce((sum, s) => sum + s.y, 0) / canvasStars.length;

      ctx.save();
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = constellation.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = constellation.color;
      ctx.shadowBlur = 8;
      ctx.fillText(`${constellation.symbol} ${constellation.name}`, avgX, avgY - 8);
      ctx.restore();
    }
  });

  ctx.restore();
}

// Exportación por defecto para asegurar compatibilidad total
export default drawConstellations;