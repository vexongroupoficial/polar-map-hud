// components/map2d/layers/drawENSO.js
import { latLonToPolar } from '@/lib/polarMath';
import {
  ENSO_ANOMALIES_REGIONS,
  EQUATORIAL_TRADE_WINDS,
  OTHER_OCEANIC_ANOMALIES,
  GULF_STREAM_AMOC_PATH
} from '@/lib/ensoData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
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

export function drawEnsoAnomalies(
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

  const showENSO =
    activeLayers?.oceanicAnomalies ||
    activeLayers?.oceanAnomalies ||
    activeLayers?.anomaliasOceanicas ||
    activeLayers?.ensoAnomalies ||
    activeLayers?.enso ||
    false;

  if (!showENSO) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  // =========================================================================
  // 1. PACÍFICO ECUATORIAL (EL NIÑO / LA NIÑA - ENSO)
  // =========================================================================
  const ensoPhaseCycle = getPositiveCycle(timeSec * 0.05);
  const isElNinoPhase = ensoPhaseCycle < 0.5;
  const currentData = isElNinoPhase ? ENSO_ANOMALIES_REGIONS.elNino : ENSO_ANOMALIES_REGIONS.laNina;

  if (currentData.polygon && currentData.polygon.length >= 3) {
    const polarVertices = currentData.polygon.map(([lat, lon]) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      return { px: centerX + x, py: centerY + y };
    });

    ctx.save();
    ctx.beginPath();
    polarVertices.forEach((v, idx) => {
      if (idx === 0) ctx.moveTo(v.px, v.py);
      else ctx.lineTo(v.px, v.py);
    });
    ctx.closePath();

    ctx.fillStyle = isNeon ? currentData.color : 'rgba(30, 58, 138, 0.3)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? currentData.strokeColor : '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 3]);

    if (isNeon) {
      ctx.shadowColor = currentData.glowColor;
      ctx.shadowBlur = 12;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Vientos Alisios del Pacífico
  EQUATORIAL_TRADE_WINDS.forEach((wind, i) => {
    const pStart = latLonToPolar(wind.latStart, wind.lonStart, mapRadius, rotation);
    const pEnd = latLonToPolar(wind.latEnd, wind.lonEnd, mapRadius, rotation);

    const sx = centerX + (isElNinoPhase ? pEnd.x : pStart.x);
    const sy = centerY + (isElNinoPhase ? pEnd.y : pStart.y);
    const ex = centerX + (isElNinoPhase ? pStart.x : pEnd.x);
    const ey = centerY + (isElNinoPhase ? pStart.y : pEnd.y);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = isElNinoPhase ? '#f87171' : '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.restore();

    const speed = currentData.windSpeed;
    const cycle = getPositiveCycle(timeSec * speed + i * 0.3);
    const partX = sx + (ex - sx) * cycle;
    const partY = sy + (ey - sy) * cycle;

    ctx.save();
    ctx.beginPath();
    ctx.arc(partX, partY, Math.max(0.1, 2.4), 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    if (isNeon) {
      ctx.shadowColor = isElNinoPhase ? '#ef4444' : '#06b6d4';
      ctx.shadowBlur = 8;
    }
    ctx.fill();
    ctx.restore();
  });

  // Etiqueta ENSO
  const { x: cx, y: cy } = latLonToPolar(currentData.centerLat, currentData.centerLon, mapRadius, rotation);
  if (Math.hypot(cx, cy) <= mapRadius - 6) {
    ctx.save();
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    const icon = isElNinoPhase ? '🔥' : '❄️';
    drawTextWithOutline(ctx, `${icon} ${currentData.name}`, centerX + cx, centerY + cy - 6, '#020617', 3.8);

    ctx.font = 'bold 7.5px monospace';
    ctx.fillStyle = currentData.glowColor;
    drawTextWithOutline(ctx, currentData.info.toUpperCase(), centerX + cx, centerY + cy + 6, '#020617', 3.2);
    ctx.restore();
  }

  // =========================================================================
  // 2. DIPOLO DEL OCÉANO ÍNDICO (IOD)
  // =========================================================================
  const iodCycle = getPositiveCycle(timeSec * 0.08);
  const isPositiveIOD = iodCycle < 0.5;

  const africaNode = { lat: 0.0, lon: 52.0 };
  const indonesiaNode = { lat: -8.0, lon: 98.0 };

  const pAfrica = latLonToPolar(africaNode.lat, africaNode.lon, mapRadius, rotation);
  const pIndo = latLonToPolar(indonesiaNode.lat, indonesiaNode.lon, mapRadius, rotation);

  const ax = centerX + pAfrica.x;
  const ay = centerY + pAfrica.y;
  const ix = centerX + pIndo.x;
  const iy = centerY + pIndo.y;

  const iodItem = OTHER_OCEANIC_ANOMALIES.find((a) => a.id === 'indian_ocean_dipole');
  if (iodItem && iodItem.polygon) {
    const vertices = iodItem.polygon.map(([lat, lon]) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      return { px: centerX + x, py: centerY + y };
    });

    const iodAlpha = 0.25 + Math.sin(timeSec * 2.5) * 0.12;

    ctx.save();
    ctx.beginPath();
    vertices.forEach((v, idx) => {
      if (idx === 0) ctx.moveTo(v.px, v.py);
      else ctx.lineTo(v.px, v.py);
    });
    ctx.closePath();

    ctx.fillStyle = isPositiveIOD
      ? `rgba(245, 158, 11, ${iodAlpha})`
      : `rgba(6, 182, 212, ${iodAlpha})`;
    ctx.fill();

    ctx.strokeStyle = isPositiveIOD ? '#f59e0b' : '#06b6d4';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 3]);
    if (isNeon) {
      ctx.shadowColor = isPositiveIOD ? '#fbbf24' : '#38bdf8';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();

    // Partículas del Índico
    for (let s = 0; s < 3; s++) {
      const streamOffset = s / 3;
      const pStart = isPositiveIOD ? { x: ix, y: iy } : { x: ax, y: ay };
      const pEnd = isPositiveIOD ? { x: ax, y: ay } : { x: ix, y: iy };
      const yOffset = (s - 1) * 10;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y + yOffset);
      ctx.lineTo(pEnd.x, pEnd.y + yOffset);
      ctx.strokeStyle = isPositiveIOD ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.restore();

      const pCycle = getPositiveCycle(timeSec * 0.35 + streamOffset);
      const px = pStart.x + (pEnd.x - pStart.x) * pCycle;
      const py = (pStart.y + yOffset) + ((pEnd.y + yOffset) - (pStart.y + yOffset)) * pCycle;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      if (isNeon) {
        ctx.shadowColor = isPositiveIOD ? '#f59e0b' : '#06b6d4';
        ctx.shadowBlur = 8;
      }
      ctx.fill();
      ctx.restore();
    }

    const { x: ox, y: oy } = latLonToPolar(iodItem.lat, iodItem.lon, mapRadius, rotation);
    if (Math.hypot(ox, oy) <= mapRadius - 6) {
      ctx.save();
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      const iodPhaseName = isPositiveIOD ? 'IOD+ (FASE CÁLIDA)' : 'IOD- (FASE FRÍA)';
      drawTextWithOutline(ctx, `🌊 ${iodItem.name}`, centerX + ox, centerY + oy - 6, '#020617', 3.8);

      ctx.font = 'bold 7.5px monospace';
      ctx.fillStyle = isPositiveIOD ? '#fef08a' : '#7dd3fc';
      drawTextWithOutline(ctx, `${iodPhaseName} | FLUJO ECUATORIAL`, centerX + ox, centerY + oy + 6, '#020617', 3.2);
      ctx.restore();
    }
  }

  // =========================================================================
  // 3. ANOMALÍA DEL ATLÁNTICO NORTE (CORRIENTE DEL GOLFO AMOC & GREENLAND COLD BLOB)
  // =========================================================================
  const atlanticItem = OTHER_OCEANIC_ANOMALIES.find((a) => a.id === 'atlantic_multidecadal');
  if (atlanticItem) {
    // A. Polígono de la Zona del Atlántico Norte
    if (atlanticItem.polygon) {
      const vertices = atlanticItem.polygon.map(([lat, lon]) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        return { px: centerX + x, py: centerY + y };
      });

      ctx.save();
      ctx.beginPath();
      vertices.forEach((v, idx) => {
        if (idx === 0) ctx.moveTo(v.px, v.py);
        else ctx.lineTo(v.px, v.py);
      });
      ctx.closePath();

      ctx.fillStyle = isNeon ? atlanticItem.color : 'rgba(30, 58, 138, 0.3)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? atlanticItem.strokeColor : '#38bdf8';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 3]);
      if (isNeon) {
        ctx.shadowColor = atlanticItem.glowColor;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();
    }

    // B. Vector Dinámico de la Corriente del Golfo / AMOC (Caribe -> Europa)
    if (GULF_STREAM_AMOC_PATH && GULF_STREAM_AMOC_PATH.length > 1) {
      const polarPath = GULF_STREAM_AMOC_PATH.map((pt) => {
        const { x, y } = latLonToPolar(pt.lat, pt.lon, mapRadius, rotation);
        return { px: centerX + x, py: centerY + y };
      });

      // Línea de la Corriente del Golfo
      ctx.save();
      ctx.beginPath();
      polarPath.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      });

      ctx.strokeStyle = '#f97316'; // Naranja Térmico Neón
      ctx.lineWidth = isNeon ? 2.2 : 1.2;
      ctx.setLineDash([6, 4]);
      if (isNeon) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.restore();

      // Partículas cálidas fluyendo a lo largo de la Corriente del Golfo
      const numParticles = 4;
      for (let p = 0; p < numParticles; p++) {
        const pCycle = getPositiveCycle(timeSec * 0.25 + p / numParticles);
        const segTotal = polarPath.length - 1;
        const rawIdx = pCycle * segTotal;
        const segIdx = Math.floor(rawIdx);
        const segT = rawIdx - segIdx;

        const p1 = polarPath[segIdx];
        const p2 = polarPath[Math.min(segIdx + 1, segTotal)];

        if (p1 && p2) {
          const partX = p1.px + (p2.px - p1.px) * segT;
          const partY = p1.py + (p2.py - p1.py) * segT;

          ctx.save();
          ctx.beginPath();
          ctx.arc(partX, partY, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          if (isNeon) {
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 10;
          }
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // C. Cold Blob al Sur de Groenlandia (Anomalía de Enfriamiento Subpolar)
    if (atlanticItem.coldBlob) {
      const { lat, lon, radiusKm, color, strokeColor } = atlanticItem.coldBlob;
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      const baseR = Math.max(0.1, (radiusKm / 111) * (mapRadius / 90));

      const coldPulse = getPositiveCycle(timeSec * 0.8);
      const pulseR = baseR * (0.85 + coldPulse * 0.4);
      const pulseAlpha = (1 - coldPulse) * 0.55;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulseAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, baseR, 0, Math.PI * 2);
      ctx.fillStyle = isNeon ? color : 'rgba(14, 165, 233, 0.3)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? strokeColor : '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Rótulo de la Burbuja Fría de Groenlandia
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      drawTextWithOutline(ctx, '❄️ COLD BLOB GROENLANDIA', px, py, '#020617', 3.0);

      ctx.restore();
    }

    // Rótulo Principal del Atlántico Norte
    const { x: ax, y: ay } = latLonToPolar(atlanticItem.lat, atlanticItem.lon, mapRadius, rotation);
    if (Math.hypot(ax, ay) <= mapRadius - 6) {
      ctx.save();
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      drawTextWithOutline(ctx, `🌊 ${atlanticItem.name}`, centerX + ax, centerY + ay - 6, '#020617', 3.8);

      ctx.font = 'bold 7.5px monospace';
      ctx.fillStyle = isNeon ? atlanticItem.glowColor : '#7dd3fc';
      drawTextWithOutline(ctx, atlanticItem.info.toUpperCase(), centerX + ax, centerY + ay + 6, '#020617', 3.2);

      ctx.restore();
    }
  }

  // =========================================================================
  // 4. OLA DE CALOR MARINA "THE BLOB" (PACÍFICO NORTE)
  // =========================================================================
  const blobItem = OTHER_OCEANIC_ANOMALIES.find((a) => a.id === 'pacific_the_blob');
  if (blobItem && blobItem.radiusKm) {
    const { x, y } = latLonToPolar(blobItem.lat, blobItem.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;
    const baseR = Math.max(0.1, (blobItem.radiusKm / 111) * (mapRadius / 90));

    const blobPulse = getPositiveCycle(timeSec * 0.9);
    const pulseR = baseR * (0.8 + blobPulse * 0.5);
    const pulseAlpha = (1 - blobPulse) * 0.6;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, baseR, 0, Math.PI * 2);
    ctx.fillStyle = isNeon ? blobItem.color : 'rgba(239, 68, 68, 0.3)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? blobItem.strokeColor : '#ef4444';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    if (isNeon) {
      ctx.shadowColor = blobItem.glowColor;
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();

    const { x: ox, y: oy } = latLonToPolar(blobItem.lat, blobItem.lon, mapRadius, rotation);
    if (Math.hypot(ox, oy) <= mapRadius - 6) {
      ctx.save();
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      drawTextWithOutline(ctx, `🌊 ${blobItem.name}`, centerX + ox, centerY + oy - 5, '#020617', 3.8);

      ctx.font = 'bold 7.5px monospace';
      ctx.fillStyle = isNeon ? blobItem.glowColor : '#e2e8f0';
      drawTextWithOutline(ctx, blobItem.info.toUpperCase(), centerX + ox, centerY + oy + 5, '#020617', 3.2);

      ctx.restore();
    }
  }

  ctx.restore();
}