// components/map2d/layers/drawZodiacDecans.js
import { ZODIAC_DECANS } from '@/lib/decansData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.0) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawZodiacDecans(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, animTime, isNeon;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 180;
    animTime = isNeonParam || 0;
    isNeon = true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    animTime = animTimeOrNeon;
    isNeon = isNeonParam;
  }

  const showDecans =
    activeLayers?.zodiacDecans ||
    activeLayers?.decanos ||
    activeLayers?.decanatos ||
    false;

  if (!showDecans) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const rotationRad = ((rotation || 180) * Math.PI) / 180;

  // Banda concéntrica para los 36 decanatos (Franja exterior ultra-precisa)
  const outerR = mapRadius * 0.995;
  const innerR = mapRadius * 0.94;

  // Fondo sutil para el anillo de decanatos
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2, false);
  ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
  ctx.fill();
  ctx.restore();

  // Renderizado de las 36 divisiones de 10°
  ZODIAC_DECANS.forEach((decan) => {
    // Offset de +180° para alinear el 0° con el Ascendente (horizontal izquierda)
    const startAngleRad = ((decan.startDeg + 180) * Math.PI) / 180 + rotationRad;
    const endAngleRad = ((decan.endDeg + 180) * Math.PI) / 180 + rotationRad;
    const midAngleRad = (startAngleRad + endAngleRad) / 2;

    // 1. Líneas divisorias de 10°
    const x1 = centerX + Math.cos(startAngleRad) * innerR;
    const y1 = centerY + Math.sin(startAngleRad) * innerR;
    const x2 = centerX + Math.cos(startAngleRad) * outerR;
    const y2 = centerY + Math.sin(startAngleRad) * outerR;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // 2. Rótulos D1 a D36 dentro de la banda exterior
    const midR = (innerR + outerR) / 2;
    const tx = centerX + Math.cos(midAngleRad) * midR;
    const ty = centerY + Math.sin(midAngleRad) * midR;

    ctx.save();
    ctx.font = 'bold 7.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, decan.label, tx, ty, '#020617', 2.8);
    ctx.restore();
  });

  // Bordes perimetrales del anillo
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export default drawZodiacDecans;