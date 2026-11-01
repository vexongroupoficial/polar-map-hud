// components/map2d/layers/drawVolcanicAnomalies.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_VOLCANOES, PACIFIC_RING_OF_FIRE } from '@/lib/volcanicData';

// Función para tipografía blanca con borde negro continuo
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

// Función auxiliar para garantizar siempre un ciclo normalizado entre 0 y 1 positivo
function getPositiveCycle(val) {
  return ((val % 1) + 1) % 1;
}

export function drawVolcanicAnomalies(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  animTime = 0,
  isNeon = true
) {
  // 🛑 EVALUACIÓN FLEXIBLE DEL INTERRUPTOR
  const showVolcanoes =
    activeLayers?.volcanicAnomalies ||
    activeLayers?.volcanoes ||
    activeLayers?.anomaliasVolcanicas ||
    false;

  if (!showVolcanoes) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (animTime || Date.now()) / 1000;

  // =========================================================================
  // 1. TRAZADO ANIMADO DEL CINTURÓN DE FUEGO DEL PACÍFICO (RING OF FIRE)
  // =========================================================================
  if (PACIFIC_RING_OF_FIRE && PACIFIC_RING_OF_FIRE.length > 1) {
    ctx.save();
    ctx.beginPath();

    PACIFIC_RING_OF_FIRE.forEach(([lat, lon], idx) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    ctx.strokeStyle = isNeon ? 'rgba(239, 68, 68, 0.65)' : 'rgba(220, 38, 38, 0.4)';
    ctx.lineWidth = isNeon ? 2.2 : 1.2;
    ctx.setLineDash([8, 4]);

    if (isNeon) {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();

    // Pulso luminoso de energía a lo largo del Cinturón
    const beltPulse = getPositiveCycle(timeSec * 1.2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${Math.max(0, 0.8 - beltPulse * 0.6)})`;
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. RENDERIZADO DE CONOS VOLCÁNICOS Y PULSO MAGMÁTICO
  // =========================================================================
  GLOBAL_VOLCANOES.forEach((volcano) => {
    const { x, y } = latLonToPolar(volcano.lat, volcano.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    const distFromCenter = Math.hypot(x, y);
    if (distFromCenter > mapRadius - 6) return;

    // A. Pulso y Emisión de Calor según estado
    if (volcano.status === 'active') {
      // Onda expansiva de erupción / gas (Normalizada positiva)
      const pulseCycle = getPositiveCycle(timeSec * 2.0 + Math.abs(volcano.lat));
      const pulseR = Math.max(0.1, 6 + pulseCycle * 14);
      const pulseA = Math.max(0, (1 - pulseCycle) * 0.7);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulseA})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    } else if (volcano.status === 'dormant') {
      // Pulso sutil de respiración magmática (Fix del residuo negativo de la longitud)
      const pulseCycle = getPositiveCycle(timeSec * 0.8 + (volcano.lon + 180) / 360);
      const pulseR = Math.max(0.1, 5 + pulseCycle * 8);
      const pulseA = Math.max(0, (1 - pulseCycle) * 0.4);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 158, 11, ${pulseA})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();
    }

    // B. Ícono Vectorial (Triángulo/Cono Volcánico)
    const coneSize = volcano.status === 'active' ? 7 : 5.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px, py - coneSize);                 // Cúspide
    ctx.lineTo(px + coneSize, py + coneSize * 0.8); // Esquina derecha
    ctx.lineTo(px - coneSize, py + coneSize * 0.8); // Esquina izquierda
    ctx.closePath();

    ctx.fillStyle = isNeon ? volcano.color : '#b91c1c';
    if (isNeon) {
      ctx.shadowColor = volcano.color;
      ctx.shadowBlur = volcano.status === 'active' ? 12 : 6;
    }
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // =========================================================================
    // 3. ETIQUETA EN BLANCO CON BORDE NEGRO DE ALTO CONTRASTE
    // =========================================================================
    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff';

    const statusIcon = volcano.status === 'active' ? '🌋' : volcano.status === 'dormant' ? '⚠️' : '💤';
    const labelText = `${statusIcon} ${volcano.name}`;

    drawTextWithOutline(ctx, labelText, px, py - coneSize - 3, '#020617', 3.8);

    ctx.font = 'bold 7.5px monospace';
    ctx.fillStyle = volcano.color;
    drawTextWithOutline(ctx, `${volcano.heightM}m | ${volcano.region.toUpperCase()}`, px, py + coneSize + 10, '#020617', 3.2);

    ctx.restore();
  });

  ctx.restore();
}