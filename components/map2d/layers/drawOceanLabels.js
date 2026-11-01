// components/map2d/layers/drawOceanLabels.js
import { latLonToPolar } from '@/lib/polarMath';
import { OCEAN_LABELS } from '@/lib/oceanData';

function getAdaptiveFontSize(baseSize, zoom, minPx = 8, maxPx = 20) {
  const computed = baseSize * Math.pow(zoom, 0.45);
  return Math.round(Math.min(Math.max(computed, minPx), maxPx));
}

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawOceanLabels(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1
) {
  // Solo se ejecuta si el interruptor 'Nombres de Océanos' está encendido
  if (!activeLayers?.oceanLabels) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const isNeon = activeLayers?.neonMode ?? true;

  OCEAN_LABELS.forEach((ocean) => {
    // UMBRALES LOD AJUSTADOS:
    // Tier 1 (Océanos Principales): Visibles siempre.
    // Tier 2 (Mares Regionales): Visibles en vista normal (zoom >= 0.8x).
    // Tier 3 (Mares Menores / Canales): Visibles al acercar ligeramente (zoom >= 1.2x).
    if (ocean.tier === 2 && zoom < 0.8) return;
    if (ocean.tier === 3 && zoom < 1.2) return;

    // Evita amontonamiento exclusivo en la zona polar central inmediata (rho < 90px)
    const rho = mapRadius * ((90 - ocean.lat) / 180);
    if (rho < 90 && ocean.tier > 2 && zoom < 1.4) return;

    const { x, y } = latLonToPolar(ocean.lat, ocean.lon, mapRadius, rotation);
    const dist = Math.hypot(x, y);
    if (dist > mapRadius - 6) return;

    const px = centerX + x;
    const py = centerY + y;

    if (isNaN(px) || isNaN(py)) return;

    const isMajor = ocean.tier === 1;
    const isMedium = ocean.tier === 2;

    const baseSize = isMajor ? 12 : isMedium ? 9.5 : 8.0;
    const minPx = isMajor ? 10 : isMedium ? 8.5 : 7.5;
    const maxPx = isMajor ? 20 : isMedium ? 15.0 : 12.0;

    const fontSize = getAdaptiveFontSize(baseSize, zoom, minPx, maxPx);

    ctx.save();
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isNeon) {
      ctx.fillStyle = isMajor ? '#38bdf8' : isMedium ? '#7dd3fc' : '#bae6fd';
      ctx.shadowColor = '#020617';
      ctx.shadowBlur = 4;
    } else {
      ctx.fillStyle = isMajor ? '#f8fafc' : isMedium ? '#e2e8f0' : '#cbd5e1';
      ctx.shadowBlur = 0;
    }

    drawTextWithOutline(ctx, ocean.name.toUpperCase(), px, py, '#020617', isMajor ? 3.5 : 2.5);

    ctx.restore();
  });

  ctx.restore();
}