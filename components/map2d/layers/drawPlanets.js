import { latLonToPolar } from '@/lib/polarMath';

const PLANET_CONFIG = {
  mercury: { name: 'MERCURIO', symbol: '☿', color: '#cbd5e1', orbitDays: 87.97,  synodicDays: 115.88, decAmp: 25.0, decOffset: 12 },
  venus:   { name: 'VENUS',    symbol: '♀', color: '#fef08a', orbitDays: 224.70, synodicDays: 583.92, decAmp: 27.5, decOffset: -18 },
  mars:    { name: 'MARTE',    symbol: '♂', color: '#f87171', orbitDays: 686.98, synodicDays: 779.94, decAmp: 25.5, decOffset: 20 },
  jupiter: { name: 'JÚPITER',  symbol: '♃', color: '#fb923c', orbitDays: 4332.59, synodicDays: 398.88, decAmp: 23.5, decOffset: -10 },
  saturn:  { name: 'SATURNO',  symbol: '♄', color: '#facc15', orbitDays: 10759.22, synodicDays: 378.09, decAmp: 22.5, decOffset: 5 },
};

function getPlanetData(planetKey, timeMs) {
  const date = new Date(timeMs);
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 0);
  const dayOfYear = (timeMs - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const utcHours = (timeMs % 86400000) / 3600000;

  const p = PLANET_CONFIG[planetKey];
  if (!p) return null;

  // Ángulo de Precesión de la Era Activa
  const precessionDeg = (((2000 - year) / 72) % 360 + 360) % 360;

  // Detección de Hito de Alineación Histórica (1 d.C., 2017 d.C., o inicio exacto de Era)
  const isEraBoundary = (Math.abs(dayOfYear - 80) < 15) || (year === 2017 && date.getMonth() === 8) || (year === 1);

  // Declinación (Latitud en el plano polar)
  const orbitPhase = ((2 * Math.PI) / p.orbitDays) * dayOfYear;
  const declination = p.decAmp * Math.sin(orbitPhase) + (isEraBoundary ? p.decOffset * 0.3 : 0);

  // Longitud Subplanetaria
  let lon;
  if (isEraBoundary) {
    // EN INICIO DE ERA: Las 7 esferas convergen en el haz precesional de la Era con pequeñas variaciones angulares
    const offsetMap = { mercury: -5, venus: -2, mars: 3, jupiter: 7, saturn: 12 };
    lon = (180 - precessionDeg) + (offsetMap[planetKey] || 0);
  } else {
    // MOVIMIENTO KINEMÁTICO ORDINARIO
    let solarLon = (12 - utcHours) * 15;
    const synodicPhase = ((2 * Math.PI) / p.synodicDays) * dayOfYear;
    const retroLoop = Math.sin(synodicPhase) * 15;
    lon = solarLon - ((dayOfYear / p.orbitDays) * 360) + retroLoop;
  }

  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  return {
    name: p.name,
    symbol: p.symbol,
    color: p.color,
    declination,
    lon,
    isAlignedInEra: isEraBoundary,
  };
}

export function drawPlanets(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  timeMs = Date.now()
) {
  const show = activeLayers?.planets ?? true;
  if (!show) return;

  const PLANET_KEYS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];

  ctx.save();

  PLANET_KEYS.forEach((key) => {
    const pData = getPlanetData(key, timeMs);
    if (!pData) return;

    const { x, y } = latLonToPolar(pData.declination, pData.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    // 1. RASTRO Y ENLACE DE ALINEACIÓN SI ESTÁ EN INICIO DE ERA
    if (pData.isAlignedInEra) {
      ctx.save();
      ctx.strokeStyle = pData.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = pData.color;
      ctx.shadowBlur = 10;
      ctx.setLineDash([4, 2]);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.restore();
    }

    // 2. ORBE NEÓN DEL PLANETA
    ctx.save();
    const glow = ctx.createRadialGradient(px, py, 1, px, py, 14);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.5, pData.color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = pData.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // SÍMBOLO Y NOMBRE (11PX)
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = pData.color;
    ctx.textAlign = 'center';
    ctx.fillText(`${pData.symbol} ${pData.name}`, px, py - 12);
    ctx.restore();
  });

  ctx.restore();
}

export default drawPlanets;