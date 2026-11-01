// components/map2d/layers/drawPolarCoordinates.js
import { latLonToPolar } from '@/lib/polarMath';

// Definición de paralelos de referencia astronómica y geográfica
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

function getPositiveCycle(val) {
  return ((val % 1) + 1) % 1;
}

export function drawPolarCoordinates(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true,
  mousePos = null // { x: number, y: number } opcional para telemetría activa
) {
  // -------------------------------------------------------------
  // NORMALIZACIÓN FLEXIBLE DE ARGUMENTOS
  // -------------------------------------------------------------
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

  // 🛑 EVALUACIÓN COMPLETA DE CLAVES
  const showCoordinates =
    activeLayers?.polarCoordinates ||
    activeLayers?.coordinates ||
    activeLayers?.grid ||
    activeLayers?.coordenadasPolares ||
    false;

  if (!showCoordinates) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const rotationRad = (rotation * Math.PI) / 180;

  // =========================================================================
  // 1. PARALELOS INTERMEDIOS CADA 15° (CIRCUNFERENCIAS CONCÉNTRICAS)
  // =========================================================================
  for (let lat = 75; lat >= -75; lat -= 15) {
    const r = ((90 - lat) / 180) * mapRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);
    ctx.strokeStyle = lat === 0 
      ? (isNeon ? 'rgba(56, 189, 248, 0.65)' : 'rgba(2, 132, 199, 0.4)') 
      : 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = lat === 0 ? 1.4 : 0.7;
    ctx.setLineDash(lat === 0 ? [] : [3, 4]);

    if (isNeon && lat === 0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. PARALELOS GEOGRÁFICOS DESTACADOS CON RÓTULOS
  // =========================================================================
  SIGNIFICANT_PARALLELS.forEach((parallel) => {
    const r = ((90 - parallel.lat) / 180) * mapRadius;

    let lineColor = 'rgba(56, 189, 248, 0.4)';
    let dashStyle = [6, 3];

    if (parallel.type === 'tropic') {
      lineColor = isNeon ? 'rgba(250, 204, 21, 0.5)' : 'rgba(202, 138, 4, 0.35)';
      dashStyle = [8, 4];
    } else if (parallel.type === 'polar') {
      lineColor = isNeon ? 'rgba(168, 85, 247, 0.5)' : 'rgba(147, 51, 234, 0.35)';
      dashStyle = [4, 4];
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.1;
    ctx.setLineDash(dashStyle);
    ctx.stroke();

    // Rótulo del Paralelo sobre el eje del Meridiano de Greenwich
    const labelX = centerX;
    const labelY = centerY - r;

    ctx.font = 'bold 7.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, parallel.label, labelX, labelY, '#020617', 3.0);
    ctx.restore();
  });

  // =========================================================================
  // 3. MERIDIANOS RADIALES CADA 15° Y GRADUACIÓN EN LA CORONA EXTERIOR
  // =========================================================================
  for (let deg = 0; deg < 360; deg += 15) {
    const angleRad = (deg * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const isMainAxis = deg % 90 === 0;

    // Rayo meridiano desde el centro al borde
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + cosA * mapRadius, centerY + sinA * mapRadius);

    ctx.strokeStyle = isMainAxis
      ? (isNeon ? 'rgba(56, 189, 248, 0.55)' : 'rgba(2, 132, 199, 0.35)')
      : 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = isMainAxis ? 1.3 : 0.7;
    ctx.setLineDash(isMainAxis ? [] : [4, 4]);

    if (isNeon && isMainAxis) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
    }
    ctx.stroke();
    ctx.restore();

    // Rótulo de Longitud en el extremo perimetral
    const lonVal = deg > 180 ? deg - 360 : deg;
    const lonLabel = lonVal === 0 
      ? '0° (GREENWICH)' 
      : lonVal === 180 || lonVal === -180
      ? '180° (ANTIMERIDIANO)'
      : `${Math.abs(lonVal)}°${lonVal > 0 ? 'E' : 'W'}`;

    const textDist = mapRadius - 14;
    const tx = centerX + cosA * textDist;
    const ty = centerY + sinA * textDist;

    ctx.save();
    ctx.font = isMainAxis ? 'bold 8.5px monospace' : 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, lonLabel, tx, ty, '#020617', 3.2);
    ctx.restore();
  }

  // =========================================================================
  // 4. TICKS CARTOGRÁFICOS EN LA CORONA PERIMETRAL (CADA 1° Y 5°)
  // =========================================================================
  ctx.save();
  for (let deg = 0; deg < 360; deg += 1) {
    const angleRad = (deg * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const is5Deg = deg % 5 === 0;
    const tickLen = is5Deg ? 7 : 3.5;

    const xInner = centerX + cosA * (mapRadius - tickLen);
    const yInner = centerY + sinA * (mapRadius - tickLen);
    const xOuter = centerX + cosA * mapRadius;
    const yOuter = centerY + sinA * mapRadius;

    ctx.beginPath();
    ctx.moveTo(xInner, yInner);
    ctx.lineTo(xOuter, yOuter);
    ctx.strokeStyle = is5Deg 
      ? (isNeon ? '#38bdf8' : '#0284c7') 
      : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = is5Deg ? 1.2 : 0.6;
    ctx.stroke();
  }
  ctx.restore();

  // =========================================================================
  // 5. TELEMETRÍA TÁCTICA DE CURSOR (SI MOUSEPOS ES PROPORCIONADO)
  // =========================================================================
  if (mousePos && typeof mousePos.x === 'number' && typeof mousePos.y === 'number') {
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distPx = Math.hypot(dx, dy);

    if (distPx <= mapRadius) {
      // Cálculo del Azimut ($\theta$) y Latitud/Longitud proyectada
      const rawAngleRad = Math.atan2(dy, dx) - rotationRad;
      const azimutDeg = getPositiveCycle(rawAngleRad / (Math.PI * 2)) * 360;

      const cursorLat = 90 - (distPx / mapRadius) * 180;
      let cursorLon = azimutDeg > 180 ? azimutDeg - 360 : azimutDeg;

      // Distancia Polar en Kilómetros (180° = ~20,000 km Polo a Polo)
      const distKm = Math.round((distPx / mapRadius) * 20000);

      // Retícula del Cursor
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

      // Cajetín HUD de Telemetría de Coordenadas
      const hudText1 = `LAT: ${cursorLat.toFixed(2)}° | LON: ${cursorLon.toFixed(2)}°`;
      const hudText2 = `POLAR R: ${distKm} KM | AZ: ${Math.round(azimutDeg)}°`;

      const bx = mousePos.x + 16;
      const by = mousePos.y - 20;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.0;
      ctx.roundRect(bx, by, 165, 26, 4);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 7.5px monospace';
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