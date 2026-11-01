// components/map2d/layers/drawAridZones.js
import { latLonToPolar } from '@/lib/polarMath';
import { TROPICAL_ARID_BELTS, GLOBAL_DESERTS } from '@/lib/desertData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawAridZones(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true,
  zoom = 1
) {
  // 🛑 Verificación de seguridad: Responde a 'aridZones', 'deserts' o 'zonasAridas'
  const showArid = activeLayers?.aridZones ?? activeLayers?.deserts ?? activeLayers?.zonasAridas ?? false;
  if (!showArid) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // =========================================================================
  // 1. DIBUJAR ANILLOS BIOCLIMÁTICOS ÁRIDOS SUBTROPICALES (TRÓPICOS)
  // =========================================================================
  TROPICAL_ARID_BELTS.forEach((belt) => {
    const rMin = mapRadius * ((90 - belt.latNorth) / 180);
    const rMax = mapRadius * ((90 - belt.latSouth) / 180);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, rMax, 0, Math.PI * 2, false);
    ctx.arc(centerX, centerY, rMin, 0, Math.PI * 2, true);
    ctx.closePath();

    ctx.fillStyle = isNeon ? belt.color : 'rgba(180, 83, 9, 0.15)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? belt.strokeColor : '#d97706';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  });

  // =========================================================================
  // 2. DIBUJAR DESIERTOS, ERGS Y MÉDANOS INDIVIDUALES
  // =========================================================================
  GLOBAL_DESERTS.forEach((desert) => {
    // A. Delineado Poligonal
    if (desert.polygon && desert.polygon.length >= 3) {
      ctx.save();
      ctx.beginPath();
      desert.polygon.forEach(([lat, lon], idx) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        const px = centerX + x;
        const py = centerY + y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      ctx.fillStyle = isNeon ? desert.color : 'rgba(120, 53, 15, 0.3)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? desert.strokeColor : '#f59e0b';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([5, 3]);
      if (isNeon) {
        ctx.shadowColor = desert.strokeColor;
        ctx.shadowBlur = 6;
      }
      ctx.stroke();
      ctx.restore();
    }
    // B. Delineado Circular Radial para Campos de Dunas o Desiertos Menores
    else if (desert.radiusKm) {
      const { x, y } = latLonToPolar(desert.lat, desert.lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      const displayRadius = Math.max(4, (desert.radiusKm / 111) * (mapRadius / 90));

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, displayRadius, 0, Math.PI * 2);
      ctx.fillStyle = isNeon ? desert.color : 'rgba(120, 53, 15, 0.3)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? desert.strokeColor : '#f59e0b';
      ctx.lineWidth = 1.0;
      if (isNeon) {
        ctx.shadowColor = desert.strokeColor;
        ctx.shadowBlur = 6;
      }
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // 3. ETIQUETAS TIPOGRÁFICAS EN BLANCO CON BORDE NEGRO
    // =========================================================================
    const { x, y } = latLonToPolar(desert.lat, desert.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    const dist = Math.hypot(x, y);
    if (dist <= mapRadius - 6) {
      ctx.save();
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff'; // Letras blancas puras

      drawTextWithOutline(ctx, desert.name.toUpperCase(), px, py, '#020617', 3.8);
      ctx.restore();
    }
  });

  ctx.restore();
}