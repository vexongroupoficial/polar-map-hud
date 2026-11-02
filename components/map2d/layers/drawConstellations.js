// components/map2d/layers/drawConstellations.js
import { ZODIAC_CONSTELLATIONS } from '@/lib/constellationData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawConstellationBadge(ctx, anchorX, anchorY, badgeX, badgeY, symbol, title, mainStar, color) {
  // Conector vectorial punteado desde las estrellas hacia el badge
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.lineTo(badgeX, badgeY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.0;
  ctx.setLineDash([3, 3]);
  ctx.globalAlpha = 0.7;
  ctx.stroke();

  // Nodo indicador central
  ctx.beginPath();
  ctx.arc(anchorX, anchorY, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Caja HUD
  ctx.save();
  ctx.font = 'bold 8.5px monospace';
  const textTitle = `${symbol} ${title}`;
  const width1 = ctx.measureText(textTitle).width;

  ctx.font = 'bold 7px monospace';
  const textSub = `ESTRELLA: ${mainStar.toUpperCase()}`;
  const width2 = ctx.measureText(textSub).width;

  const boxW = Math.max(width1, width2) + 12;
  const boxH = 22;

  const rectX = badgeX - boxW / 2;
  const rectY = badgeY - boxH / 2;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.0;

  ctx.beginPath();
  ctx.roundRect(rectX, rectY, boxW, boxH, 3);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, textTitle, badgeX, rectY + 6.0, '#020617', 3.0);

  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = color;
  drawTextWithOutline(ctx, textSub, badgeX, rectY + 15.0, '#020617', 2.5);

  ctx.restore();
}

export function drawConstellations(
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

  const showConstellations =
    activeLayers?.constellations ||
    activeLayers?.constelaciones ||
    false;

  if (!showConstellations) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;
  
  // 🎯 Sincronización Angular con el Ascendente (0° en la horizontal izquierda)
  const baseRotationRad = ((rotation || 180) * Math.PI) / 180;

  ZODIAC_CONSTELLATIONS.forEach((constellation) => {
    // Proyección trigonométrica polar directa respecto al eje del Ascendente
    const projectedStars = constellation.stars.map((star) => {
      // Radio proporcional a la latitud simulada
      const r = ((90 - star.lat) / 180) * mapRadius * 0.78;
      // Ángulo en radianes desfasado al Ascendente (0° a la izquierda)
      const starAngleRad = ((star.lon + 180) * Math.PI) / 180 + baseRotationRad;

      return {
        px: centerX + Math.cos(starAngleRad) * r,
        py: centerY + Math.sin(starAngleRad) * r,
        mag: star.mag,
        name: star.name
      };
    });

    const avgX = projectedStars.reduce((acc, s) => acc + s.px, 0) / projectedStars.length;
    const avgY = projectedStars.reduce((acc, s) => acc + s.py, 0) / projectedStars.length;

    if (Math.hypot(avgX - centerX, avgY - centerY) > mapRadius - 4) return;

    // 1. Trazado de Asterismos (Líneas neón entre estrellas)
    ctx.save();
    constellation.lines.forEach(([i1, i2]) => {
      const p1 = projectedStars[i1];
      const p2 = projectedStars[i2];
      if (!p1 || !p2) return;

      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.strokeStyle = constellation.color;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 2]);

      if (isNeon) {
        ctx.shadowColor = constellation.color;
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
    });
    ctx.restore();

    // 2. Renderizado de Estrellas físicamente ubicadas en la Casa
    projectedStars.forEach((star) => {
      const starRadius = Math.max(3.8, (4.5 - star.mag) * 2.2);
      const twinkle = 0.85 + Math.sin(timeSec * 3.5 + star.px) * 0.15;

      ctx.save();
      if (isNeon) {
        ctx.beginPath();
        ctx.arc(star.px, star.py, starRadius * 2.4 * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(constellation.color)}, 0.35)`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(star.px, star.py, starRadius * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';

      if (isNeon) {
        ctx.shadowColor = constellation.color;
        ctx.shadowBlur = 14;
      }
      ctx.fill();

      ctx.beginPath();
      ctx.arc(star.px, star.py, starRadius * twinkle, 0, Math.PI * 2);
      ctx.strokeStyle = constellation.color;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.restore();
    });

    // 3. Ubicación del Badge en la franja interna de su Casa
    const angleFromCenter = Math.atan2(avgY - centerY, avgX - centerX);
    const badgeRadius = mapRadius * 0.74;

    const badgeX = centerX + Math.cos(angleFromCenter) * badgeRadius;
    const badgeY = centerY + Math.sin(angleFromCenter) * badgeRadius;

    drawConstellationBadge(
      ctx,
      avgX,
      avgY,
      badgeX,
      badgeY,
      constellation.symbol,
      constellation.name,
      constellation.mainStar,
      constellation.color
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

export default drawConstellations;