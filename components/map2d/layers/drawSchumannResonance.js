// components/map2d/layers/drawSchumannResonance.js

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawSchumannResonance(
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

  // Normalización flexible de parámetros
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
    activeLayers?.schumannResonance ||
    activeLayers?.schumann ||
    activeLayers?.resonancia ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const time = typeof animTime === 'number' ? animTime : Date.now() * 0.001;

  // 🌊 Velocidad ajustada (0.15) para evitar el parpadeo estroboscópico
  const speedFactor = 0.0007083;
  const waveCount = 3;

  for (let i = 0; i < waveCount; i++) {
    const phaseOffset = i / waveCount;
    const schumannPhase = ((time * speedFactor) + phaseOffset) % 1;
    const waveRadius = schumannPhase * mapRadius;
    const opacity = (1 - schumannPhase) * 0.55;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, waveRadius), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`; // Violeta Neón Schumann
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 5]);

    if (isNeon) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();

    // Etiqueta HUD de frecuencia [7.83 Hz] sobre la onda expansiva
    if (i === 0 && schumannPhase > 0.25 && schumannPhase < 0.75) {
      const labelText = `⚡ RESONANCIA SCHUMANN [7.83 Hz]`;
      ctx.font = 'bold 8px monospace';
      
      const textWidth = ctx.measureText(labelText).width;
      const boxW = textWidth + 8;
      const boxH = 13;
      const boxX = centerX - boxW / 2;
      const boxY = centerY - waveRadius - boxH / 2 - 2;

      // Fondo HUD oscuro para máxima nitidez
      ctx.fillStyle = `rgba(2, 6, 23, ${opacity * 0.9})`;
      ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(216, 180, 254, ${opacity + 0.35})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawTextWithOutline(
        ctx,
        labelText,
        centerX,
        boxY + boxH / 2 + 0.5,
        '#020617',
        2.5
      );
    }
    ctx.restore();
  }

  ctx.restore();
}

export default drawSchumannResonance;