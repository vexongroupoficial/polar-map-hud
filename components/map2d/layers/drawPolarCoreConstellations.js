// components/map2d/layers/drawPolarCoreConstellations.js
import { POLARIS_STAR, CORE_CIRCUMPOLAR_CONSTELLATIONS } from '@/lib/polarCoreConstellationsData';

function drawOutlineText(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawConstellationBadge(ctx, x, y, symbol, title, color) {
  ctx.save();
  ctx.font = 'bold 8.5px monospace';
  const labelText = `${symbol ? symbol + ' ' : ''}${title}`;
  const textWidth = ctx.measureText(labelText).width;

  const paddingX = 6;
  const paddingY = 3;
  const boxW = textWidth + paddingX * 2;
  const boxH = 14;

  const rectX = x - boxW / 2;
  const rectY = y - boxH / 2;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;

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

export function drawPolarCoreConstellations(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
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
    rotation = animTimeOrNeon || 180;
    isNeon = true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    isNeon = isNeonParam;
  }

  // 2. Verificación de seguridad
  const isEnabled =
    activeLayers?.coreConstellations ||
    activeLayers?.polarConstellations ||
    activeLayers?.circumpolar ||
    activeLayers?.constelacionesPolares ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = ((rotation || 180) * Math.PI) / 180;

  // =========================================================================
  // 🔵 1. ANILLO DELIMITADOR: NÚCLEO BOREAL (+60° DEC)
  // (¡AQUÍ SÍ EXISTE mapRadius PORQUE ESTÁ DENTRO DE LA FUNCIÓN!)
  // =========================================================================
  const rBoreal = ((90 - 60) / 180) * mapRadius * 0.78;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rBoreal, 0, Math.PI * 2);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 4]);

  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  drawOutlineText(ctx, '── NÚCLEO BOREAL CIRCUMPOLAR [+60° DEC] ──', centerX, centerY - rBoreal - 5, '#020617', 2.5);
  ctx.restore();

  // =========================================================================
  // 🌟 2. POLARIS (0,0)
  // =========================================================================
  const polarisDec = POLARIS_STAR?.dec ?? 89.26;
  const polarisRa = POLARIS_STAR?.ra ?? 37.95;

  const polarisR = ((90 - polarisDec) / 180) * mapRadius * 0.78;
  const polarisAngleRad = ((polarisRa + 180) * Math.PI) / 180 + baseRotationRad;
  const px = centerX + Math.cos(polarisAngleRad) * polarisR;
  const py = centerY + Math.sin(polarisAngleRad) * polarisR;

  ctx.save();
  const glow = ctx.createRadialGradient(px, py, 1, px, py, 18);
  glow.addColorStop(0, '#ffffff');
  glow.addColorStop(0.4, POLARIS_STAR?.color || '#38bdf8');
  glow.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(px, py, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(px, py, 3.5, 0, Math.PI * 2);
  ctx.fill();

  drawConstellationBadge(ctx, px, py - 14, '★', 'POLARIS (0,0)', POLARIS_STAR?.color || '#38bdf8');
  ctx.restore();

  // =========================================================================
  // 🌌 3. CONSTELACIONES CIRCUMPOLARES
  // =========================================================================
  if (Array.isArray(CORE_CIRCUMPOLAR_CONSTELLATIONS)) {
    CORE_CIRCUMPOLAR_CONSTELLATIONS.forEach((constellation) => {
      if (!constellation.stars) return;

      const projectedStars = constellation.stars.map((star) => {
        const dec = star.dec ?? star.lat ?? 70;
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
          ctx.lineWidth = 1.3;
          ctx.setLineDash([3, 3]);

          if (isNeon) {
            ctx.shadowColor = constellation.color || '#38bdf8';
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
        });
        ctx.restore();
      }

      projectedStars.forEach((star) => {
        const r = Math.max(2.2, (4.5 - star.mag) * 1.4);
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.px, star.py, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        if (isNeon) {
          ctx.shadowColor = constellation.color || '#38bdf8';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      });

      if (projectedStars.length > 0) {
        const avgX = projectedStars.reduce((acc, s) => acc + s.px, 0) / projectedStars.length;
        const avgY = projectedStars.reduce((acc, s) => acc + s.py, 0) / projectedStars.length;

        drawConstellationBadge(
          ctx,
          avgX,
          avgY - 6,
          constellation.symbol || '',
          constellation.name,
          constellation.color || '#38bdf8'
        );
      }
    });
  }

  ctx.restore();
}

export default drawPolarCoreConstellations;