import { latLonToPolar } from '@/lib/polarMath';

// 1. CENTROIDES DE MASA OCEÁNICA CON RADIOS DELIMITADOS (Evita traspasar continentes)
const OCEAN_BASINS = [
  { 
    id: 'atlantic_north',
    name: 'Océano Atlántico Norte', 
    lat: 32, 
    lon: -40, 
    maxRadiusRatio: 0.18, // Delimitado por América, Europa y África
    colorRgb: '56, 189, 248', 
    hex: '#38bdf8' 
  },
  { 
    id: 'atlantic_south',
    name: 'Océano Atlántico Sur', 
    lat: -25, 
    lon: -20, 
    maxRadiusRatio: 0.20, // Delimitado por Sudamérica y África
    colorRgb: '14, 165, 233', 
    hex: '#0ea5e9' 
  },
  { 
    id: 'pacific_north',
    name: 'Océano Pacífico Norte', 
    lat: 35, 
    lon: -155, 
    maxRadiusRatio: 0.26, // Delimitado por Asia, América del Norte y el borde exterior
    colorRgb: '6, 182, 212', 
    hex: '#06b6d4' 
  },
  { 
    id: 'pacific_south',
    name: 'Océano Pacífico Sur', 
    lat: -30, 
    lon: -130, 
    maxRadiusRatio: 0.28, // Delimitado por Oceanía, Sudamérica y la Antártida
    colorRgb: '2, 132, 199', 
    hex: '#0284c7' 
  },
  { 
    id: 'indian',
    name: 'Océano Índico', 
    lat: -20, 
    lon: 80, 
    maxRadiusRatio: 0.20, // Delimitado por África, India, Asia y Australia
    colorRgb: '20, 184, 166', 
    hex: '#14b8a6' 
  },
  { 
    id: 'arctic',
    name: 'Océano Ártico (Polo Norte)', 
    lat: 84, 
    lon: 0, 
    maxRadiusRatio: 0.12, // Confinado estrictamente al casquete norte central
    colorRgb: '103, 232, 249', 
    hex: '#67e8f9' 
  },
];

function getSubsolarPoint(timeMs) {
  const date = new Date(timeMs);
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lat = -23.44 * Math.cos(((dayOfYear + 10) / 365.25) * 2 * Math.PI);

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let lon = (12 - utcHours) * 15;
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;

  return { lat, lon };
}

export function drawOceanCurrents(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  time = Date.now()
) {
  if (!activeLayers?.oceanTides) return;

  ctx.save();

  // Máscara de recorte estricta del disco geodésico
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const subsolar = getSubsolarPoint(time);

  OCEAN_BASINS.forEach((basin) => {
    const { x, y } = latLonToPolar(basin.lat, basin.lon, mapRadius, rotation);
    const bx = centerX + x;
    const by = centerY + y;

    const deltaLat = Math.abs(basin.lat - subsolar.lat);
    let deltaLon = Math.abs(basin.lon - subsolar.lon);
    if (deltaLon > 180) deltaLon = 360 - deltaLon;

    const proximity = Math.max(0, 1 - Math.hypot(deltaLat / 40, deltaLon / 75));
    const isDirectlyExposed = proximity > 0.35;

    const waveCount = 3; // Menos ondas simultáneas para mayor limpieza visual
    const speed = isDirectlyExposed ? 0.000045 : 0.000028;
    const maxPixelRadius = mapRadius * basin.maxRadiusRatio;

    for (let w = 0; w < waveCount; w++) {
      const progress = ((time * speed) + (w / waveCount)) % 1;
      const currentRadius = progress * maxPixelRadius;

      // Desvanecimiento suave al alcanzar el límite de la cuenca
      const alphaBase = isDirectlyExposed ? 0.70 : 0.40;
      const alpha = Math.pow(Math.sin(progress * Math.PI), 1.5) * alphaBase;

      const strokeColor = isDirectlyExposed
        ? `rgba(253, 224, 71, ${alpha})`
        : `rgba(${basin.colorRgb}, ${alpha})`;

      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = (isDirectlyExposed ? 2.0 : 1.3) * (1 - progress * 0.2);
      ctx.shadowColor = isDirectlyExposed ? '#fde047' : `rgb(${basin.colorRgb})`;
      ctx.shadowBlur = isDirectlyExposed ? 8 : 4;

      ctx.beginPath();
      ctx.arc(bx, by, Math.max(2, currentRadius), 0, Math.PI * 2);
      ctx.stroke();

      // Rompiente costera exacta en el radio máximo de la cuenca
      if (progress > 0.75) {
        const coastFade = (progress - 0.75) / 0.25;
        const coastAlpha = Math.sin(coastFade * Math.PI) * alpha * 0.6;

        ctx.strokeStyle = `rgba(255, 255, 255, ${coastAlpha})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(bx, by, currentRadius + 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Onda de retorno / resaca contraída hacia el centro
      if (progress > 0.5) {
        const returnProgress = 1 - progress;
        const returnRadius = returnProgress * maxPixelRadius * 0.85;
        const returnAlpha = alpha * 0.3;

        ctx.strokeStyle = isDirectlyExposed
          ? `rgba(253, 224, 71, ${returnAlpha})`
          : `rgba(${basin.colorRgb}, ${returnAlpha})`;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([2, 5]);

        ctx.beginPath();
        ctx.arc(bx, by, Math.max(1, returnRadius), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Núcleo central del centroide
    ctx.fillStyle = isDirectlyExposed ? '#fde047' : basin.hex;
    ctx.shadowColor = isDirectlyExposed ? '#fde047' : basin.hex;
    ctx.shadowBlur = isDirectlyExposed ? 12 : 5;

    ctx.beginPath();
    ctx.arc(bx, by, isDirectlyExposed ? 3.2 : 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Etiqueta HUD de cuenca compacta
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
    ctx.font = 'bold 7px monospace';
    
    const labelText = isDirectlyExposed 
      ? `☀️⚡ ${basin.name.toUpperCase()} (INDUCIDO)` 
      : `🌊 ${basin.name.toUpperCase()}`;
      
    const tw = ctx.measureText(labelText).width;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
    ctx.strokeStyle = isDirectlyExposed ? '#fde047' : `rgba(${basin.colorRgb}, 0.4)`;
    ctx.lineWidth = isDirectlyExposed ? 1.1 : 0.7;

    ctx.beginPath();
    ctx.roundRect(bx - tw / 2 - 4, by - 14, tw + 8, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isDirectlyExposed ? '#fef08a' : '#e0f2fe';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, bx, by - 8);
  });

  ctx.restore();
}