// components/map2d/layers/drawMagneticAnomalies.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_MAGNETIC_ANOMALIES } from '@/lib/magneticData';

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

// Renderizador de Badge HUD con anticolisión
function drawBadgeHUD(ctx, anchorX, anchorY, dx, dy, icon, title, subtitle, color) {
  const targetX = anchorX + dx;
  const targetY = anchorY + dy;

  // 1. Línea indicadora si hay desfasaje
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

  // 2. Cálculo de dimensiones de caja
  ctx.save();
  ctx.font = 'bold 8.5px monospace';
  const t1 = `${icon} ${title}`;
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
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.roundRect(boxX, boxY, bw, bh, 3);
  ctx.fill();
  ctx.stroke();

  // 4. Textos
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#ffffff'; // Blanco Puro
  drawTextWithOutline(ctx, t1, targetX, boxY + 6, '#020617', 3.0);

  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = color;
  drawTextWithOutline(ctx, subtitle.toUpperCase(), targetX, boxY + 15, '#020617', 2.5);

  ctx.restore();
}

export function drawMagneticAnomalies(
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

  const showMagnetic =
    activeLayers?.magneticAnomalies ||
    activeLayers?.magnetic ||
    activeLayers?.anomaliasMagneticas ||
    false;

  if (!showMagnetic) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  GLOBAL_MAGNETIC_ANOMALIES.forEach((item) => {
    const { dx = 0, dy = 0 } = item.labelOffset || {};

    // A. POLÍGONO AAS (ATLÁNTICO SUR)
    if (item.polygon && item.polygon.length >= 3) {
      const vertices = item.polygon.map(([lat, lon]) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        return { px: centerX + x, py: centerY + y };
      });

      const pulseAlpha = 0.22 + Math.sin(timeSec * 2.0) * 0.08;

      ctx.save();
      ctx.beginPath();
      vertices.forEach((v, idx) => {
        if (idx === 0) ctx.moveTo(v.px, v.py);
        else ctx.lineTo(v.px, v.py);
      });
      ctx.closePath();

      ctx.fillStyle = `rgba(236, 72, 153, ${pulseAlpha})`;
      ctx.fill();

      ctx.strokeStyle = isNeon ? item.strokeColor : '#ec4899';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([8, 4]);
      if (isNeon) {
        ctx.shadowColor = item.glowColor;
        ctx.shadowBlur = 12;
      }
      ctx.stroke();
      ctx.restore();

      const { x: cx, y: cy } = latLonToPolar(item.centerLat, item.centerLon, mapRadius, rotation);
      if (Math.hypot(cx, cy) <= mapRadius - 6) {
        drawBadgeHUD(
          ctx,
          centerX + cx,
          centerY + cy,
          dx,
          dy,
          '🧲',
          item.name,
          item.info,
          item.strokeColor
        );
      }
      return;
    }

    // B. FRANJAS MAGNÉTICAS FONDO MARINO
    if (item.path && item.path.length > 1) {
      const polarPath = item.path.map(([lat, lon]) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        return { px: centerX + x, py: centerY + y };
      });

      const offsets = [-6, 0, 6];
      offsets.forEach((off, idx) => {
        ctx.save();
        ctx.beginPath();
        polarPath.forEach((pt, pIdx) => {
          if (pIdx === 0) ctx.moveTo(pt.px + off, pt.py);
          else ctx.lineTo(pt.px + off, pt.py);
        });

        const isReversed = idx % 2 !== 0;
        ctx.strokeStyle = isReversed ? '#c084fc' : '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 5]);
        if (isNeon) {
          ctx.shadowColor = isReversed ? '#c084fc' : '#38bdf8';
          ctx.shadowBlur = 6;
        }
        ctx.stroke();
        ctx.restore();
      });

      const midPt = polarPath[Math.floor(polarPath.length / 2)];
      if (midPt) {
        drawBadgeHUD(
          ctx,
          midPt.px,
          midPt.py,
          dx,
          dy,
          '🧲',
          item.name,
          item.info,
          item.color
        );
      }
      return;
    }

    // C. ANOMALÍAS PUNTUALES Y POLOS MAGNÉTICOS
    if (typeof item.lat === 'number' && typeof item.lon === 'number') {
      const { x, y } = latLonToPolar(item.lat, item.lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;

      if (Math.hypot(x, y) > mapRadius - 4) return;

      const baseR = Math.max(0.1, ((item.radiusKm || 200) / 111) * (mapRadius / 90));

      // Anillos de Pulso B-Field
      const waveCount = item.type === 'magnetic_pole' ? 3 : 2;
      for (let w = 0; w < waveCount; w++) {
        const cycle = getPositiveCycle(timeSec * 0.9 + w * 0.35);
        const currentR = baseR * (0.4 + cycle * 0.8);
        const alpha = (1 - cycle) * 0.65;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.1, currentR), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(item.color)}, ${alpha})`;
        ctx.lineWidth = 1.2;
        if (item.type === 'magnetic_pole') {
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Núcleo Epicentro
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 3.0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      if (isNeon) {
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.restore();

      // Badge HUD con Desplazamiento Anticolisión
      const icon = item.type === 'magnetic_pole' ? '🧭' : '🧲';
      drawBadgeHUD(ctx, px, py, dx, dy, icon, item.name, item.info, item.color);
    }
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