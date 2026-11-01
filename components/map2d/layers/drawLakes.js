// components/map2d/layers/drawLakes.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_LAKES } from '@/lib/lakeData';

// Función para texto blanco con borde oscuro contundente
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawLakes(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1,
  isNeon = true
) {
  // 🛑 Verificación de seguridad: Se activa con 'lakes', 'lakesAndLagoons' o 'lagos'
  const showLakes = 
    activeLayers?.lakes || 
    activeLayers?.lakesAndLagoons || 
    activeLayers?.lagos || 
    false;
    
  if (!showLakes) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  GLOBAL_LAKES.forEach((lake) => {
    // -------------------------------------------------------------
    // 1. DIBUJAR LA GEOMETRÍA / ZONA DE REPRESENTACIÓN DEL LAGO
    // -------------------------------------------------------------
    if (lake.polygon && lake.polygon.length >= 3) {
      // Delineado poligonal para grandes lagos
      ctx.beginPath();
      lake.polygon.forEach(([lat, lon], idx) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        const px = centerX + x;
        const py = centerY + y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      ctx.fillStyle = isNeon ? lake.color : 'rgba(30, 58, 138, 0.4)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? lake.strokeColor : '#94a3b8';
      ctx.lineWidth = 1.2;
      if (isNeon) {
        ctx.shadowColor = lake.strokeColor;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (lake.radiusKm) {
      // Delineado circular para lagos volcánicos o de menor tamaño
      const { x, y } = latLonToPolar(lake.lat, lake.lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      const displayRadius = Math.max(4, (lake.radiusKm / 111) * (mapRadius / 90));

      ctx.beginPath();
      ctx.arc(px, py, displayRadius, 0, Math.PI * 2);
      ctx.fillStyle = isNeon ? lake.color : 'rgba(30, 58, 138, 0.4)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? lake.strokeColor : '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // -------------------------------------------------------------
    // 2. DIBUJAR NOMBRE EN BLANCO CON BORDE NEGRO
    // -------------------------------------------------------------
    const { x, y } = latLonToPolar(lake.lat, lake.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    // Control visual dentro del perímetro circular del mapa
    const dist = Math.hypot(x, y);
    if (dist > mapRadius - 10) return;

    ctx.save();
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff'; // 👈 Letras blancas puras

    // Doble pasada de delineado negro
    drawTextWithOutline(ctx, lake.name.toUpperCase(), px, py, '#020617', 3.8);

    ctx.restore();
  });

  ctx.restore();
}