// components/map2d/layers/drawZodiacHouses.js
import { latLonToPolar } from '@/lib/polarMath';

// Asignación 1:1 de Casas con sus Signos/Constelaciones en orden de rueda (0° a 360°)
const ZODIAC_HOUSES = [
  { house: 1, name: 'CASA I (ASCENDENTE)', label: 'ASC • ARIES ♈', color: '#ef4444', isAngular: true },
  { house: 2, name: 'CASA II', label: 'C-II • TAURO ♉', color: '#f59e0b', isAngular: false },
  { house: 3, name: 'CASA III', label: 'C-III • GÉMINIS ♊', color: '#eab308', isAngular: false },
  { house: 4, name: 'CASA IV (FONDO CIELO)', label: 'IC • CÁNCER ♋', color: '#10b981', isAngular: true },
  { house: 5, name: 'CASA V', label: 'C-V • LEO ♌', color: '#06b6d4', isAngular: false },
  { house: 6, name: 'CASA VI', label: 'C-VI • VIRGO ♍', color: '#38bdf8', isAngular: false },
  { house: 7, name: 'CASA VII (DESCENDENTE)', label: 'DSC • LIBRA ♎', color: '#3b82f6', isAngular: true },
  { house: 8, name: 'CASA VIII', label: 'C-VIII • ESCORPIO ♏', color: '#6366f1', isAngular: false },
  { house: 9, name: 'CASA IX', label: 'C-IX • SAGITARIO ♐', color: '#a855f7', isAngular: false },
  { house: 10, name: 'CASA X (MEDIO CIELO)', label: 'MC • CAPRICORNIO ♑', color: '#ec4899', isAngular: true },
  { house: 11, name: 'CASA XI', label: 'C-XI • ACUARIO ♒', color: '#f43f5e', isAngular: false },
  { house: 12, name: 'CASA XII', label: 'C-XII • PISCIS ♓', color: '#94a3b8', isAngular: false }
];

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 4.0) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function getPositiveCycle(val) {
  return ((val % 1) + 1) % 1;
}

export function drawZodiacHouses(
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

  const showHouses =
    activeLayers?.zodiacHouses ||
    activeLayers?.houses ||
    activeLayers?.casasZodiacales ||
    activeLayers?.casas ||
    false;

  if (!showHouses) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;
  
  // Eje de referencia alineado con el Ascendente (0° en la horizontal izquierda)
  const rotationRad = ((rotation || 180) * Math.PI) / 180;

  const outerR = mapRadius * 0.98;
  const innerR = mapRadius * 0.81;
  const coreR = mapRadius * 0.16;

  // -------------------------------------------------------------
  // 1. RUEDA PERIMETRAL EXTERIOR CON FONDO TRANSLÚCIDO
  // -------------------------------------------------------------
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2, false);
  ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 1.5;
  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.5)' : 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 2. SECTORES ANGULARES DE LAS 12 CASAS (CÚSPIDES)
  // -------------------------------------------------------------
  ZODIAC_HOUSES.forEach((item, index) => {
    // Avance de 30° comenzando desde el Ascendente (0° a la izquierda)
    const startDeg = index * 30;
    const angleRad = ((startDeg + 180) * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const xStart = centerX + cosA * coreR;
    const yStart = centerY + sinA * coreR;
    const xEnd = centerX + cosA * outerR;
    const yEnd = centerY + sinA * outerR;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);

    if (item.isAngular) {
      ctx.strokeStyle = isNeon ? item.color : '#0284c7';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([]);
      if (isNeon) {
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 10;
      }
    } else {
      ctx.strokeStyle = isNeon ? 'rgba(168, 85, 247, 0.45)' : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([5, 4]);
    }
    ctx.stroke();
    ctx.restore();

    // -------------------------------------------------------------
    // 3. ETIQUETAS EN LA CORONA EXTERIOR
    // -------------------------------------------------------------
    const midAngleDeg = startDeg + 15;
    const midAngleRad = ((midAngleDeg + 180) * Math.PI) / 180 + rotationRad;
    const midCos = Math.cos(midAngleRad);
    const midSin = Math.sin(midAngleRad);

    const labelDist = (innerR + outerR) / 2;
    const tx = centerX + midCos * labelDist;
    const ty = centerY + midSin * labelDist;

    ctx.save();
    const mainFontSize = Math.max(9.0, Math.min(12, mapRadius * 0.030));
    const subFontSize = Math.max(7.0, Math.min(9.0, mapRadius * 0.022));

    ctx.font = `bold ${mainFontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff'; // Blanco Puro

    drawTextWithOutline(ctx, item.label, tx, ty - 5, '#020617', 4.0);

    ctx.font = `bold ${subFontSize}px monospace`;
    ctx.fillStyle = item.color;
    drawTextWithOutline(ctx, `CASA ${item.house}`, tx, ty + 6, '#020617', 3.0);

    ctx.restore();
  });

  // -------------------------------------------------------------
  // 4. INDICADOR TÁCTICO DEL ASCENDENTE (0°)
  // -------------------------------------------------------------
  const ascPulseCycle = getPositiveCycle(timeSec * 0.4);
  const ascAngleRad = Math.PI + rotationRad;
  const ascX = centerX + Math.cos(ascAngleRad) * (outerR + 4);
  const ascY = centerY + Math.sin(ascAngleRad) * (outerR + 4);

  ctx.save();
  ctx.beginPath();
  ctx.arc(ascX, ascY, 4.0 + ascPulseCycle * 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  if (isNeon) {
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
  }
  ctx.fill();

  const fontSize = Math.max(8.5, Math.min(11, mapRadius * 0.026));
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, 'ASCENDENTE (0°) ◄', ascX - 8, ascY, '#020617', 3.5);
  ctx.restore();

  ctx.restore();
}