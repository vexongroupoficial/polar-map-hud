// components/map2d/layers/drawForests.js
import { latLonToPolar } from '@/lib/polarMath';
import { FOREST_BIOMES, GLOBAL_FORESTS } from '@/lib/forestData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawForests(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true,
  zoom = 1
) {
  // 🛑 Verificación de activación (Responde a 'forests', 'bosques' o 'forestCover')
  const showForests = activeLayers?.forests ?? activeLayers?.bosques ?? activeLayers?.forestCover ?? false;
  if (!showForests) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // =========================================================================
  // 1. DIBUJAR POLÍGONOS DE LOS 5 GRANDES MACIZOS FORESTALES
  // =========================================================================
  GLOBAL_FORESTS.forEach((forest) => {
    if (!forest.polygon || forest.polygon.length < 3) return;

    ctx.save();
    ctx.beginPath();
    forest.polygon.forEach(([lat, lon], idx) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();

    ctx.fillStyle = isNeon ? forest.color : 'rgba(20, 83, 45, 0.4)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? forest.strokeColor : '#4ade80';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 3]);
    if (isNeon) {
      ctx.shadowColor = forest.strokeColor;
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();

    // -------------------------------------------------------------
    // RÓTULO EN BLANCO Y BORDE NEGRO
    // -------------------------------------------------------------
    const { x, y } = latLonToPolar(forest.lat, forest.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    const dist = Math.hypot(x, y);
    if (dist <= mapRadius - 10) {
      ctx.save();
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff'; // Letras blancas puras

      drawTextWithOutline(ctx, forest.name.toUpperCase(), px, py, '#020617', 4.0);
      ctx.restore();
    }
  });

  ctx.restore();
}