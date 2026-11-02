// components/map2d/layers/drawPolarSouthernConstellations.js
import { SOUTHERN_CONSTELLATIONS } from '@/lib/polarSouthernConstellationsData';

function drawOutlineText(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawBadgeHUD(ctx, x, y, symbol, title, color, isCrux = false) {
  ctx.save();
  ctx.font = isCrux ? 'bold 8.5px monospace' : 'bold 7px monospace';
  const labelText = `${symbol ? symbol + ' ' : ''}${title}`;
  const textWidth = ctx.measureText(labelText).width;

  const paddingX = isCrux ? 5 : 3;
  const paddingY = isCrux ? 3 : 1.5;
  const boxW = textWidth + paddingX * 2;
  const boxH = isCrux ? 15 : 12;

  const rectX = x - boxW / 2;
  const rectY = y - boxH / 2;

  ctx.fillStyle = isCrux ? 'rgba(2, 6, 23, 0.95)' : 'rgba(2, 6, 23, 0.82)';
  ctx.strokeStyle = color;
  ctx.lineWidth = isCrux ? 1.2 : 0.8;

  ctx.beginPath();
  ctx.roundRect(rectX, rectY, boxW, boxH, 3);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  drawOutlineText(ctx, labelText, x, y + 0.5, '#020617', 2.5);

  ctx.restore();
}

export function drawPolarSouthernConstellations(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  zoomOrAnimTime = 1,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, isNeon;

  // 1. Extraer los parámetros DENTRO de la función
  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = zoomOrAnimTime || 180;
    isNeon = isNeonParam ?? true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    isNeon = isNeonParam;
  }

  const isEnabled =
    activeLayers?.southernConstellations ||
    activeLayers?.australConstellations ||
    activeLayers?.constelacionesAustrales ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = ((rotation || 180) * Math.PI) / 180;

  // =========================================================================
  // ❄️ 1. ANILLO DELIMITADOR: PERIFERIA AUSTRAL (-90° DEC)
  // (¡AQUÍ SÍ EXISTE mapRadius PORQUE ESTÁ DENTRO DE LA FUNCIÓN!)
  // =========================================================================
  const rAustral = mapRadius * 0.78;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rAustral, 0, Math.PI * 2);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);

  if (isNeon) {
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#60a5fa';
  ctx.textAlign = 'center';
  drawOutlineText(ctx, '── ANILLO PERIFÉRICO AUSTRAL [-90° DEC] ──', centerX, centerY + rAustral + 14, '#020617', 2.5);
  ctx.restore();

  // =========================================================================
  // 🌌 2. RENDERIZADO DE LAS 32 CONSTELACIONES AUSTRALES
  // =========================================================================
  if (Array.isArray(SOUTHERN_CONSTELLATIONS)) {
    SOUTHERN_CONSTELLATIONS.forEach((constellation) => {
      if (!constellation.stars) return;

      const isCrux = constellation.id === 'crux' || constellation.id === 'octans';

      const projectedStars = constellation.stars.map((star) => {
        const dec = star.dec ?? -60;
        const ra = star.ra ?? 0;

        const r = ((90 - dec) / 180) * mapRadius * 0.78;
        const starAngleRad = ((ra + 180) * Math.PI) / 180 + baseRotationRad;

        return {
          px: centerX + Math.cos(starAngleRad) * r,
          py: centerY + Math.sin(starAngleRad) * r,
          mag: star.mag ?? 2.5,
          name: star.name
        };
      });

      // A. Asterismos
      if (Array.isArray(constellation.lines)) {
        ctx.save();
        constellation.lines.forEach(([i1, i2]) => {
          const p1 = projectedStars[i1];
          const p2 = projectedStars[i2];
          if (!p1 || !p2) return;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = constellation.color || '#38bdf8';
          ctx.lineWidth = isCrux ? 1.8 : 1.1;
          ctx.setLineDash(isCrux ? [] : [3, 3]);

          if (isNeon) {
            ctx.shadowColor = constellation.color || '#38bdf8';
            ctx.shadowBlur = isCrux ? 10 : 5;
          }
          ctx.stroke();
        });
        ctx.restore();
      }

      // B. Puntos Estelares
      projectedStars.forEach((star) => {
        const calculatedRadius = (4.5 - star.mag) * 1.4;
        const r = Math.min(Math.max(1.5, calculatedRadius), 4.5);

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.px, star.py, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        if (isNeon) {
          ctx.shadowColor = constellation.color || '#38bdf8';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.restore();
      });

      // C. Badges HUD de Nombres
      if (projectedStars.length > 0) {
        const avgX = projectedStars.reduce((acc, s) => acc + s.px, 0) / projectedStars.length;
        const avgY = projectedStars.reduce((acc, s) => acc + s.py, 0) / projectedStars.length;

        const angleFromCenter = Math.atan2(avgY - centerY, avgX - centerX);
        const badgeOffsetR = isCrux ? 0 : 8;

        const finalBadgeX = avgX + Math.cos(angleFromCenter) * badgeOffsetR;
        const finalBadgeY = avgY + Math.sin(angleFromCenter) * badgeOffsetR;

        drawBadgeHUD(
          ctx,
          finalBadgeX,
          finalBadgeY - 4,
          constellation.symbol || '',
          constellation.name,
          constellation.color || '#38bdf8',
          isCrux
        );
      }
    });
  }

  ctx.restore();
}

export default drawPolarSouthernConstellations;