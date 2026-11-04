// components/map2d/layers/drawHebrewRoshChodesh.js

import { HEBREW_MONTHS_DATA } from './drawHebrewCalendar';

/**
 * Helper para texto ultra-nítido con relleno blanco y borde negro.
 */
function drawOutlinedText(
  ctx,
  text,
  x,
  y,
  font = 'bold 9px system-ui, sans-serif',
  fillColor = '#ffffff',
  strokeColor = '#000000',
  strokeWidth = 3.5
) {
  ctx.save();
  ctx.font = font;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  if (strokeColor && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function drawHebrewRoshChodesh(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
  currentMonthIndex = 0,
  dayOfHebrewMonth = 1,
  animTime = 0
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = currentMonthIndex || 0;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
  }

  const isEnabled =
    activeLayers?.roshChodesh ||
    activeLayers?.hebrewRoshChodesh ||
    activeLayers?.conjunctionLayer ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;
  const rInnerHebrew = mapRadius * 0.97;
  const rOuterHebrew = mapRadius * 1.10;
  const rPortalRadius = mapRadius * 0.93;

  // =========================================================================
  // 1. RENDERIZADO DE LOS 12 PORTALES DE ROSH CHODESH AL INICIO DEL MES (DÍA 1)
  // Ubicados exactamente sobre degStart (Línea divisoria del comienzo del mes)
  // =========================================================================
  HEBREW_MONTHS_DATA.forEach((month, idx) => {
    // Ángulo de INICIO del mes (Día 1 / Rosh Chodesh)
    const startDeg = month.degStart < 0 ? month.degStart + 360 : month.degStart;
    const startRad = Math.PI + (startDeg * Math.PI) / 180 + baseRotationRad;

    const isCurrentActiveMonth = idx === currentMonthIndex;
    const isRoshChodeshToday = isCurrentActiveMonth && (dayOfHebrewMonth === 1 || dayOfHebrewMonth === 30);

    // A. Línea de demarcación neón en la frontera del Día 1
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(startRad) * (rInnerHebrew - 6), centerY + Math.sin(startRad) * (rInnerHebrew - 6));
    ctx.lineTo(centerX + Math.cos(startRad) * (rOuterHebrew + 4), centerY + Math.sin(startRad) * (rOuterHebrew + 4));
    ctx.strokeStyle = isRoshChodeshToday ? '#38bdf8' : 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = isRoshChodeshToday ? 2.2 : 1.2;
    ctx.setLineDash([2, 3]);
    ctx.stroke();

    // B. Marcador Glifo de Luna Nueva (🌑) al INICIO exacto del mes
    const px = centerX + Math.cos(startRad) * rPortalRadius;
    const py = centerY + Math.sin(startRad) * rPortalRadius;

    ctx.beginPath();
    ctx.arc(px, py, isRoshChodeshToday ? 5.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isRoshChodeshToday ? '#38bdf8' : 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = isRoshChodeshToday ? '#ffffff' : '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = isRoshChodeshToday ? 12 : 4;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // C. Etiqueta "🌑 R.CH. [MES]" posicionada en el INICIO DEL MES (startRad)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const monthShortName = month.hebrewName.split(' ')[0];
    const rcLabel = `🌑 R.CH. ${monthShortName}`;

    // Posición exterior proyectada exactamente sobre el vector de inicio (Día 1)
    const lx = centerX + Math.cos(startRad) * (rOuterHebrew + 22);
    const ly = centerY + Math.sin(startRad) * (rOuterHebrew + 22);

    drawOutlinedText(
      ctx,
      rcLabel,
      lx,
      ly,
      isRoshChodeshToday ? 'bold 9.5px system-ui, sans-serif' : '500 8.5px system-ui, sans-serif',
      '#ffffff', // Letra en blanco puro
      '#000000', // Borde negro sólido de 3.5px
      3.5
    );
    ctx.restore();
  });

  // =========================================================================
  // 2. CONJUNCIÓN ACTIVA DE ROSH CHODESH (DÍA 1 DEL MES EN CURSO)
  // =========================================================================
  if (dayOfHebrewMonth === 1 || dayOfHebrewMonth === 30) {
    const activeMonth = HEBREW_MONTHS_DATA[currentMonthIndex] || HEBREW_MONTHS_DATA[0];
    const activeDeg = activeMonth.degStart < 0 ? activeMonth.degStart + 360 : activeMonth.degStart;
    const activeRad = Math.PI + (activeDeg * Math.PI) / 180 + baseRotationRad;

    const pulseIntensity = 0.5 + Math.sin(animTime * 0.005) * 0.3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(activeRad) * (rOuterHebrew + 35), centerY + Math.sin(activeRad) * (rOuterHebrew + 35));
    ctx.strokeStyle = `rgba(56, 189, 248, ${pulseIntensity + 0.2})`;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.stroke();

    const hudX = centerX + Math.cos(activeRad) * (mapRadius * 0.65);
    const hudY = centerY + Math.sin(activeRad) * (mapRadius * 0.65);

    const titleText = `🌑 ROSH CHODESH ${activeMonth.hebrewName.toUpperCase()}`;
    const subText = `¡NUEVA LUNA LITÚRGICA! • DÍA 01 DE ${activeMonth.tribu.toUpperCase()}`;

    ctx.font = 'bold 10.5px system-ui, sans-serif';
    const w1 = ctx.measureText(titleText).width;
    ctx.font = '500 9px system-ui, sans-serif';
    const w2 = ctx.measureText(subText).width;

    const boxW = Math.max(w1, w2) + 20;
    const boxH = 32;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.roundRect(hudX - boxW / 2, hudY - boxH / 2, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    drawOutlinedText(ctx, titleText, hudX, hudY - 6, 'bold 10.5px system-ui, sans-serif', '#ffffff', '#000000', 3.8);
    drawOutlinedText(ctx, subText, hudX, hudY + 7, 'bold 8.5px system-ui, monospace', '#7dd3fc', '#000000', 3.0);

    ctx.restore();
  }

  ctx.restore();
}

export const drawRoshChodeshLayer = drawHebrewRoshChodesh;
export default drawHebrewRoshChodesh;