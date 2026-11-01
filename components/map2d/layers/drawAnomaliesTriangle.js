// components/map2d/layers/drawAnomaliesTriangle.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_ANOMALIES } from '@/lib/anomalyData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawAnomaliesTriangle(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  animTime = 0,
  isNeon = true
) {
  // 🛑 Verificación de seguridad del interruptor
  const showAnomalies =
    activeLayers?.bermudaTriangle ||
    activeLayers?.anomaliesTriangle ||
    activeLayers?.AnomaliesTriangle ||
    activeLayers?.anomalies ||
    false;

  if (!showAnomalies) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (animTime || Date.now()) / 1000;

  GLOBAL_ANOMALIES.forEach((item) => {
    if (!item.polygon || item.polygon.length < 3) return;

    // A. Proyección polar de los vértices
    const polarVertices = item.polygon.map(([lat, lon]) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      return { px: centerX + x, py: centerY + y };
    });

    // B. Dibuja el triángulo anómalo
    ctx.save();
    ctx.beginPath();
    polarVertices.forEach((v, idx) => {
      if (idx === 0) ctx.moveTo(v.px, v.py);
      else ctx.lineTo(v.px, v.py);
    });
    ctx.closePath();

    ctx.fillStyle = isNeon ? item.color : 'rgba(127, 29, 29, 0.25)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? item.strokeColor : '#ef4444';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 3]);

    if (isNeon) {
      ctx.shadowColor = item.glowColor;
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();

    // C. Onda de pulso cinemático central
    const { x: cx, y: cy } = latLonToPolar(item.centerLat, item.centerLon, mapRadius, rotation);
    const centerPx = centerX + cx;
    const centerPy = centerY + cy;

    const pulseCycle = (timeSec * 0.8) % 1;
    const pulseRadius = 8 + pulseCycle * 28;
    const pulseAlpha = (1 - pulseCycle) * 0.6;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerPx, centerPy, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = item.strokeColor;
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = pulseAlpha;
    ctx.stroke();
    ctx.restore();

    // D. Etiqueta en blanco con contorno negro
    const distCenter = Math.hypot(cx, cy);
    if (distCenter <= mapRadius - 6) {
      ctx.save();
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      drawTextWithOutline(ctx, `⚠️ ${item.name}`, centerPx, centerPy - 6, '#020617', 3.8);

      ctx.font = 'bold 7.5px monospace';
      ctx.fillStyle = isNeon ? item.glowColor : '#e2e8f0';
      drawTextWithOutline(ctx, item.info.toUpperCase(), centerPx, centerPy + 6, '#020617', 3.2);

      ctx.restore();
    }
  });

  ctx.restore();
}