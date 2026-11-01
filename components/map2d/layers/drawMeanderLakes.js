// components/map2d/layers/drawMeanderLakes.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_MEANDER_LAKES } from '@/lib/meanderLakeData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawMeanderLakes(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true,
  zoom = 1
) {
  // 🛑 Verificación de seguridad: Responde a 'meanderLakes', 'lakesInMeander' o 'oxbowLakes'
  const showMeander = 
    activeLayers?.meanderLakes || 
    activeLayers?.lakesInMeandro || 
    activeLayers?.lakesInMeander || 
    activeLayers?.oxbowLakes || 
    false;
    
  if (!showMeander) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  GLOBAL_MEANDER_LAKES.forEach((lake) => {
    const { x, y } = latLonToPolar(lake.lat, lake.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    const dist = Math.hypot(x, y);
    if (dist > mapRadius - 6) return;

    // Escalar la forma de herradura según el zoom y radio polar
    const displayRadius = Math.max(6, ((lake.arcRadiusKm || 12) / 111) * (mapRadius / 90));

    // -------------------------------------------------------------
    // 1. DIBUJAR TRAZADO EN FORMACIÓN HORSESHOE (HERRADURA / BRAZO MUERTO)
    // -------------------------------------------------------------
    ctx.save();
    ctx.beginPath();

    const startRad = ((lake.startAngle || 0) * Math.PI) / 180;
    const endRad = ((lake.endAngle || 180) * Math.PI) / 180;

    // Arco semicircular en U
    ctx.arc(px, py, displayRadius, startRad, endRad, false);

    ctx.strokeStyle = isNeon ? lake.strokeColor : '#0284c7';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';

    if (isNeon) {
      ctx.shadowColor = lake.strokeColor;
      ctx.shadowBlur = 8;
    }

    ctx.stroke();

    // Relleno interior de la cuenca meándrica
    ctx.fillStyle = isNeon ? lake.color : 'rgba(14, 165, 233, 0.3)';
    ctx.fill();

    // Remates de corte de meandro en los extremos del arco
    const xEnd = px + displayRadius * Math.cos(endRad);
    const yEnd = py + displayRadius * Math.sin(endRad);

    ctx.beginPath();
    ctx.arc(xEnd, yEnd, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();

    // -------------------------------------------------------------
    // 2. RÓTULO DE NOMBRES EN BLANCO PURA CON BORDE NEGRO
    // -------------------------------------------------------------
    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff'; // Letras blancas puras

    drawTextWithOutline(ctx, lake.name.toUpperCase(), px, py - displayRadius - 3, '#020617', 3.8);
    ctx.restore();
  });

  ctx.restore();
}