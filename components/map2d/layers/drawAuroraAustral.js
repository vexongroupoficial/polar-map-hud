// components/map2d/layers/drawAuroraAustral.js

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawAuroraAustral(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
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

  const isEnabled =
    activeLayers?.auroraAustral ||
    activeLayers?.aurora ||
    activeLayers?.auroraSur ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const time = typeof animTime === 'number' ? animTime : Date.now() * 0.001;

  // Radios para la franja periférica antártica
  const rAuroraCenter = ((90 - (-68)) / 180) * mapRadius;
  const rAuroraInner = ((90 - (-62)) / 180) * mapRadius;
  const rAuroraOuter = ((90 - (-74)) / 180) * mapRadius;

  ctx.save();
  
  // Gradiente Radial de Luz Auroral
  const auroraGlow = ctx.createRadialGradient(
    centerX, centerY, rAuroraInner,
    centerX, centerY, rAuroraOuter
  );

  const pulseOpacity = 0.35 + Math.sin(time * 1.5) * 0.15;
  auroraGlow.addColorStop(0, 'rgba(74, 222, 128, 0)');
  auroraGlow.addColorStop(0.5, `rgba(74, 222, 128, ${pulseOpacity})`);
  auroraGlow.addColorStop(0.8, `rgba(168, 85, 247, ${pulseOpacity * 0.6})`);
  auroraGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');

  ctx.beginPath();
  ctx.arc(centerX, centerY, rAuroraOuter, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, rAuroraInner, 0, Math.PI * 2, true);
  ctx.fillStyle = auroraGlow;
  ctx.fill();

  // Cortina discontinua de plasma animada
  ctx.beginPath();
  ctx.arc(centerX, centerY, rAuroraCenter, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(74, 222, 128, ${pulseOpacity + 0.25})`;
  ctx.lineWidth = 2.0;
  ctx.setLineDash([12, 8, 4, 8]);
  ctx.lineDashOffset = -time * 18;

  if (isNeon) {
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 14;
  }
  ctx.stroke();

  // Etiqueta HUD
  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'center';
  drawTextWithOutline(
    ctx,
    '── CORONA AURORAL AUSTRAL [-68° DEC SUR] ──',
    centerX,
    centerY + rAuroraCenter + 14,
    '#020617',
    2.8
  );

  ctx.restore();
  ctx.restore();
}

export default drawAuroraAustral;