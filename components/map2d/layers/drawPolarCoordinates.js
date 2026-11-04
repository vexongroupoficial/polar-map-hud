// components/map2d/layers/drawPolarCoordinates.js
import { latLonToPolar } from '@/lib/polarMath';

const SIGNIFICANT_PARALLELS = [
  { lat: 66.5, label: '66.5° N - CÍRCULO POLAR ÁRTICO', type: 'polar' },
  { lat: 23.5, label: '23.5° N - TRÓPICO DE CÁNCER', type: 'tropic' },
  { lat: 0, label: '0.0° - ECUADOR', type: 'equator' },
  { lat: -23.5, label: '23.5° S - TRÓPICO DE CAPRICORNIO', type: 'tropic' },
  { lat: -66.5, label: '66.5° S - CÍRCULO POLAR ANTÁRTICO', type: 'polar' },
];

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawClockBadge(ctx, x, y, text, isMainAxis = false, accentColor = '#38bdf8') {
  ctx.save();
  // Aumentamos ligeramente la fuente para mejor visibilidad sin exagerar
  ctx.font = isMainAxis ? 'bold 9.5px monospace' : 'bold 8.5px monospace';
  const textWidth = ctx.measureText(text).width;
  
  const paddingX = isMainAxis ? 7 : 5;
  const paddingY = isMainAxis ? 3.5 : 2.5;
  const boxW = textWidth + paddingX * 2;
  const boxH = isMainAxis ? 16 : 14;

  const rectX = x - boxW / 2;
  const rectY = y - boxH / 2;

  // Caja táctica de alto contraste
  ctx.fillStyle = isMainAxis ? 'rgba(2, 6, 23, 0.95)' : 'rgba(2, 6, 23, 0.85)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = isMainAxis ? 1.3 : 0.9;

  ctx.beginPath();
  ctx.roundRect(rectX, rectY, boxW, boxH, 3);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isMainAxis ? '#ffffff' : '#e2e8f0';
  drawTextWithOutline(ctx, text, x, y + 0.5, '#020617', 2.8);

  ctx.restore();
}

function getPositiveCycle(val) {
  return ((val % 1) + 1) % 1;
}

export function drawPolarCoordinates(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
  animTimeOrNeon = 0,
  isNeonParam = true,
  mousePos = null
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, animTime, isNeon;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 0;
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

  const showCoordinates =
    activeLayers?.polarCoordinates ||
    activeLayers?.coordinates ||
    activeLayers?.grid ||
    activeLayers?.coordenadasPolares ||
    true;

  if (!showCoordinates) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();

  // Base ángulo: 180° en el círculo estándar equivale a la Izquierda (-X) en Canvas 2D.
  const baseRotationRad = (rotation * Math.PI) / 180;

  // =========================================================================
  // 1. PARALELOS INTERMEDIOS CADA 15°
  // =========================================================================
  for (let lat = 75; lat >= -75; lat -= 15) {
    const r = ((90 - lat) / 180) * mapRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);
    ctx.strokeStyle = lat === 0 
      ? (isNeon ? 'rgba(56, 189, 248, 0.75)' : 'rgba(2, 132, 199, 0.5)') 
      : 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = lat === 0 ? 1.5 : 0.7;
    ctx.setLineDash(lat === 0 ? [] : [3, 4]);

    if (isNeon && lat === 0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. PARALELOS GEOGRÁFICOS DESTACADOS
  // =========================================================================
  SIGNIFICANT_PARALLELS.forEach((parallel) => {
    const r = ((90 - parallel.lat) / 180) * mapRadius;

    let lineColor = 'rgba(56, 189, 248, 0.5)';
    let dashStyle = [6, 3];

    if (parallel.type === 'tropic') {
      lineColor = isNeon ? 'rgba(250, 204, 21, 0.65)' : 'rgba(202, 138, 4, 0.45)';
      dashStyle = [8, 4];
    } else if (parallel.type === 'polar') {
      lineColor = isNeon ? 'rgba(168, 85, 247, 0.65)' : 'rgba(147, 51, 234, 0.45)';
      dashStyle = [4, 4];
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.2;
    ctx.setLineDash(dashStyle);
    ctx.stroke();

    const labelX = centerX;
    const labelY = centerY - r;

    drawClockBadge(ctx, labelX, labelY, parallel.label, false, lineColor);
    ctx.restore();
  });

  // =========================================================================
  // 3. MERIDIANOS Y RELOJ ASTRONÓMICO DE 24 HORAS
  //    ORIENTACIÓN: IZQUIERDA 0° (ESTE / NACIENTE), ABAJO 90°, DERECHA 180° (OESTE), ARRIBA 270°
  // =========================================================================
  for (let deg = 0; deg < 360; deg += 15) {
    // Math.PI asigna 0° a la Izquierda en nuestra proyección de reloj
    const angleRad = Math.PI + (deg * Math.PI) / 180 + baseRotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const isMainAxis = deg % 90 === 0;
    const isSubAxis = deg % 45 === 0;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + cosA * mapRadius, centerY + sinA * mapRadius);

    ctx.strokeStyle = isMainAxis
      ? (isNeon ? '#fbbf24' : '#d97706')
      : isSubAxis
      ? (isNeon ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.4)')
      : 'rgba(148, 163, 184, 0.2)';

    ctx.lineWidth = isMainAxis ? 1.6 : isSubAxis ? 1.0 : 0.7;
    ctx.setLineDash(isMainAxis ? [] : [4, 4]);

    if (isNeon && isMainAxis) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();

    const hourVal = Math.floor(deg / 15);
    let textLabel = '';

    if (deg === 0) {
      textLabel = '0° E • NACIENTE / PRIMAVERA [0:00h AMANECER]';
    } else if (deg === 90) {
      textLabel = '90° S • MEDIODÍA [6:00h]';
    } else if (deg === 180) {
      textLabel = '180° W • PONIENTE / OTOÑO [12:00h ATARDECER]';
    } else if (deg === 270) {
      textLabel = '270° N • MEDIANOCHE [18:00h]';
    } else {
      textLabel = `${deg}° (${hourVal}h)`;
    }

    const textDist = mapRadius - 16;
    const tx = centerX + cosA * textDist;
    const ty = centerY + sinA * textDist;

    const accent = isMainAxis ? '#fbbf24' : isSubAxis ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)';
    drawClockBadge(ctx, tx, ty, textLabel, isMainAxis, accent);
  }

  // =========================================================================
  // 4. TICKS CARTOGRÁFICOS EN LA CORONA PERIMETRAL (CADA 1° Y 5°)
  // =========================================================================
  ctx.save();
  for (let deg = 0; deg < 360; deg += 1) {
    const angleRad = Math.PI + (deg * Math.PI) / 180 + baseRotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const is5Deg = deg % 5 === 0;
    const is15Deg = deg % 15 === 0;
    const tickLen = is15Deg ? 9 : is5Deg ? 6 : 3;

    const xInner = centerX + cosA * (mapRadius - tickLen);
    const yInner = centerY + sinA * (mapRadius - tickLen);
    const xOuter = centerX + cosA * mapRadius;
    const yOuter = centerY + sinA * mapRadius;

    ctx.beginPath();
    ctx.moveTo(xInner, yInner);
    ctx.lineTo(xOuter, yOuter);
    ctx.strokeStyle = is15Deg
      ? '#fbbf24'
      : is5Deg
      ? (isNeon ? '#38bdf8' : '#0284c7')
      : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = is15Deg ? 1.5 : is5Deg ? 1.0 : 0.6;
    ctx.stroke();
  }
  ctx.restore();

  // =========================================================================
  // 5. TELEMETRÍA TÁCTICA DE CURSOR
  // =========================================================================
  if (mousePos && typeof mousePos.x === 'number' && typeof mousePos.y === 'number') {
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distPx = Math.hypot(dx, dy);

    if (distPx <= mapRadius) {
      const rawAngleRad = Math.atan2(dy, dx) - Math.PI - baseRotationRad;
      const azimutDeg = getPositiveCycle(rawAngleRad / (Math.PI * 2)) * 360;

      const cursorLat = 90 - (distPx / mapRadius) * 180;
      let cursorLon = azimutDeg > 180 ? azimutDeg - 360 : azimutDeg;

      const distKm = Math.round((distPx / mapRadius) * 20000);

      ctx.save();
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mousePos.x - 14, mousePos.y);
      ctx.lineTo(mousePos.x + 14, mousePos.y);
      ctx.moveTo(mousePos.x, mousePos.y - 14);
      ctx.lineTo(mousePos.x, mousePos.y + 14);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const hudText1 = `LAT: ${cursorLat.toFixed(2)}° | LON: ${cursorLon.toFixed(2)}°`;
      const hudText2 = `POLAR R: ${distKm} KM | AZ: ${Math.round(azimutDeg)}°`;

      const bx = mousePos.x + 16;
      const by = mousePos.y - 20;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.roundRect(bx, by, 165, 26, 4);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffffff';

      drawTextWithOutline(ctx, hudText1, bx + 6, by + 4, '#020617', 2.8);

      ctx.fillStyle = '#38bdf8';
      drawTextWithOutline(ctx, hudText2, bx + 6, by + 14, '#020617', 2.2);

      ctx.restore();
    }
  }

  ctx.restore();
}

export default drawPolarCoordinates;