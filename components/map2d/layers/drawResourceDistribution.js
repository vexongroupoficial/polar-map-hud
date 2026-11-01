// components/map2d/layers/drawResourceDistribution.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_RESOURCES } from '@/lib/resourceData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
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

// Cajetín HUD Anticolisión con conector vectorial
function drawResourceBadge(ctx, anchorX, anchorY, dx, dy, symbol, title, subtitle, color) {
  const targetX = anchorX + dx;
  const targetY = anchorY + dy;

  // 1. Línea indicadora táctica
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.9;
    ctx.setLineDash([3, 3]);
    ctx.globalAlpha = 0.75;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  // 2. Cálculo de dimensiones del badge HUD
  ctx.save();
  ctx.font = 'bold 8.5px monospace';
  const t1 = `${symbol} ${title}`;
  const tw1 = ctx.measureText(t1).width;
  ctx.font = 'bold 7px monospace';
  const tw2 = ctx.measureText(subtitle).width;
  const bw = Math.max(tw1, tw2) + 12;
  const bh = 22;

  const boxX = targetX - bw / 2;
  const boxY = targetY - bh / 2;

  // 3. Fondo oscuro translúcido
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.0;

  ctx.beginPath();
  ctx.roundRect(boxX, boxY, bw, bh, 3);
  ctx.fill();
  ctx.stroke();

  // 4. Textos en Blanco con Borde Negro
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#ffffff'; // Letras Blancas Puras
  drawTextWithOutline(ctx, t1, targetX, boxY + 6, '#020617', 3.0);

  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = color;
  drawTextWithOutline(ctx, subtitle.toUpperCase(), targetX, boxY + 15, '#020617', 2.5);

  ctx.restore();
}

export function drawResourceDistribution(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  // Normalización flexible de parámetros
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

  // 🛑 EVALUACIÓN COMPLETA DE CLAVES DE INTERRUPTOR
  const showResources =
    activeLayers?.resourceDistribution ||
    activeLayers?.resources ||
    activeLayers?.recursosEstrategicos ||
    activeLayers?.minerals ||
    false;

  if (!showResources) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  GLOBAL_RESOURCES.forEach((item) => {
    const { x, y } = latLonToPolar(item.lat, item.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    if (Math.hypot(x, y) > mapRadius - 4) return;

    const baseR = Math.max(0.1, ((item.radiusKm || 200) / 111) * (mapRadius / 90));
    const { dx = 0, dy = 0 } = item.labelOffset || {};

    // A. Pulso cinemático de extracción
    const pulseCycle = getPositiveCycle(timeSec * 0.8 + Math.abs(item.lat));
    const pulseR = Math.max(0.1, baseR * (0.5 + pulseCycle * 0.7));
    const pulseAlpha = (1 - pulseCycle) * 0.6;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${hexToRgb(item.color)}, ${pulseAlpha})`;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.restore();

    // B. Núcleo central del yacimiento
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    if (isNeon) {
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.restore();

    // C. Badge HUD con datos estratégicos
    drawResourceBadge(
      ctx,
      px,
      py,
      dx,
      dy,
      item.symbol,
      item.name,
      item.valueStr,
      item.color
    );
  });

  ctx.restore();
}

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}