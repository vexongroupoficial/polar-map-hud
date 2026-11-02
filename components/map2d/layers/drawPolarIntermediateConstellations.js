// components/map2d/layers/drawPolarIntermediateConstellations.js
import { INTERMEDIATE_CONSTELLATIONS } from '@/lib/polarIntermediateConstellationsData';

function drawOutlineText(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawBadgeHUD(ctx, x, y, symbol, title, color, isZodiac = false) {
  ctx.save();
  ctx.font = isZodiac ? 'bold 8.5px monospace' : 'bold 7px monospace';
  const labelText = `${symbol ? symbol + ' ' : ''}${title}`;
  const textWidth = ctx.measureText(labelText).width;

  const paddingX = isZodiac ? 5 : 3;
  const paddingY = isZodiac ? 3 : 1.5;
  const boxW = textWidth + paddingX * 2;
  const boxH = isZodiac ? 15 : 12;

  const rectX = x - boxW / 2;
  const rectY = y - boxH / 2;

  ctx.fillStyle = isZodiac ? 'rgba(2, 6, 23, 0.92)' : 'rgba(2, 6, 23, 0.78)';
  ctx.strokeStyle = color;
  ctx.lineWidth = isZodiac ? 1.2 : 0.8;

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

export function drawPolarIntermediateConstellations(
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
  let centerX, centerY, mapRadius, rotation, zoom, isNeon;

  // 1. Extraer los parámetros DENTRO de la función
  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = zoomOrAnimTime || 180;
    zoom = animTimeOrNeon || 1;
    isNeon = isNeonParam ?? true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    zoom = zoomOrAnimTime || 1;
    isNeon = isNeonParam;
  }

  const isEnabled =
    activeLayers?.intermediateConstellations ||
    activeLayers?.zodiacDecans ||
    activeLayers?.constelacionesIntermedias ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = ((rotation || 180) * Math.PI) / 180;
  const currentZoom = typeof zoom === 'number' && zoom > 0 ? zoom : 1;

  // =========================================================================
  // 🟡 1. ANILLOS DELIMITADORES: ECUADOR (0° DEC) Y BANDA ECLÍPTICA (-30° DEC)
  // (¡AQUÍ SÍ EXISTE mapRadius PORQUE ESTÁ DENTRO DE LA FUNCIÓN!)
  // =========================================================================
  const rEcuador = ((90 - 0) / 180) * mapRadius * 0.78;
  const rEcliptic = ((90 - (-30)) / 180) * mapRadius * 0.78;

  // A. Ecuador Celeste (0° Dec)
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rEcuador, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([2, 4]);
  ctx.stroke();
  ctx.restore();

  // B. Límite Exterior Eclíptico (-30° Dec)
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rEcliptic, 0, Math.PI * 2);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([8, 4]);

  if (isNeon) {
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  drawOutlineText(ctx, '── BANDA ECLÍPTICA ZODIACAL [-30° DEC] ──', centerX, centerY + rEcliptic + 12, '#020617', 2.5);
  ctx.restore();

  // =========================================================================
  // 🌌 2. RENDERIZADO DE LAS 46 CONSTELACIONES INTERMEDIAS
  // =========================================================================
  if (Array.isArray(INTERMEDIATE_CONSTELLATIONS)) {
    INTERMEDIATE_CONSTELLATIONS.forEach((constellation) => {
      if (!constellation.stars) return;

      const isZodiac = constellation.category === 'zodiacal';

      const projectedStars = constellation.stars.map((star) => {
        const dec = star.dec ?? star.lat ?? 0;
        const ra = star.ra ?? star.lon ?? 0;

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
          ctx.strokeStyle = constellation.color || '#fbbf24';
          ctx.lineWidth = isZodiac ? 1.8 : 1.2;

          if (!isZodiac) {
            ctx.setLineDash([3, 3]);
          }

          if (isNeon) {
            ctx.shadowColor = constellation.color || '#fbbf24';
            ctx.shadowBlur = isZodiac ? 10 : 5;
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
          ctx.shadowColor = constellation.color || '#fbbf24';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.restore();
      });

      // C. Badges HUD de Nombres
      if (projectedStars.length > 0) {
        if (!isZodiac && currentZoom < 1.3) return;

        const avgX = projectedStars.reduce((acc, s) => acc + s.px, 0) / projectedStars.length;
        const avgY = projectedStars.reduce((acc, s) => acc + s.py, 0) / projectedStars.length;

        const angleFromCenter = Math.atan2(avgY - centerY, avgX - centerX);
        const badgeOffsetR = isZodiac ? 0 : 14; 

        const finalBadgeX = avgX + Math.cos(angleFromCenter) * badgeOffsetR;
        const finalBadgeY = avgY + Math.sin(angleFromCenter) * badgeOffsetR;

        drawBadgeHUD(
          ctx,
          finalBadgeX,
          finalBadgeY - 5,
          constellation.symbol || '',
          constellation.name,
          constellation.color || '#fbbf24',
          isZodiac
        );
      }
    });
  }

  ctx.restore();
}

export default drawPolarIntermediateConstellations;