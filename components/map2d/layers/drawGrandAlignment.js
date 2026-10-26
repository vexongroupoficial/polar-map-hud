// components/map2d/layers/drawGrandAlignment.js

export function drawGrandAlignment(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  timeMs = Date.now()
) {
  if (!activeLayers?.precessionalEras && !activeLayers?.grandAlignment) return;

  ctx.save();

  const date = new Date(timeMs);
  const year = date.getFullYear();

  // Relación matemática exacta: 2,160 años por cada casa de 30°
  // Cúspide de INICIO de la Era de Piscis (Año 1 d.C.) = 360° (Límite con Aries)
  const baseYear = 1; 
  const baseAngle = 360; 
  const degPerYear = 30 / 2160;
  
  // Cálculo retrógrado del ángulo precesional
  let precessionDeg = baseAngle - (year - baseYear) * degPerYear;
  precessionDeg = ((precessionDeg % 360) + 360) % 360;

  const rotRad = (rotation * Math.PI) / 180;
  const angleRad = (precessionDeg * Math.PI) / 180 + rotRad;

  const rMax = mapRadius * 1.18;
  const vx = centerX + rMax * Math.cos(angleRad);
  const vy = centerY + rMax * Math.sin(angleRad);

  // 1. HAZ VECTORIAL
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 18;
  ctx.setLineDash([8, 4]);

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(vx, vy);
  ctx.stroke();
  ctx.restore();

  // 2. CONO DE RESPLANDOR SECTORIAL (30°)
  ctx.save();
  const halfSectorRad = (15 * Math.PI) / 180;
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    mapRadius * 0.1,
    centerX,
    centerY,
    rMax
  );
  gradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  gradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.08)');
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, rMax, angleRad - halfSectorRad, angleRad + halfSectorRad);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. ETIQUETA SÍNCRONA
  const ZODIAC_HOUSES_ORDER = [
    'PISCIS', 'ACUARIO', 'CAPRICORNIO', 'SAGITARIO',
    'ESCORPIO', 'LIBRA', 'VIRGO', 'LEO',
    'CÁNCER', 'GÉMINIS', 'TAURO', 'ARIES'
  ];
  
  // Mapeo por bloques exactos de 30° evaluando la casa en curso
  const normalizedDeg = (360 - precessionDeg) % 360;
  const houseIdx = Math.floor((normalizedDeg + 1) / 30) % 12;
  const eraName = `ERA DE ${ZODIAC_HOUSES_ORDER[houseIdx] || 'PISCIS'}`;

  const labelX = centerX + (mapRadius * 1.25) * Math.cos(angleRad);
  const labelY = centerY + (mapRadius * 1.25) * Math.sin(angleRad);

  ctx.save();
  ctx.font = 'bold 11px monospace';
  const textWidth = ctx.measureText(`🏛️ ${eraName}`).width + 12;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.roundRect(labelX - textWidth / 2, labelY - 10, textWidth, 20, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🏛️ ${eraName}`, labelX, labelY);
  ctx.restore();

  ctx.restore();
}

export default drawGrandAlignment;