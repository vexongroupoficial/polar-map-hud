// components/map2d/layers/drawSeismicAnomalies.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_SEISMIC_ANOMALIES } from '@/lib/seismicData';

// Función para tipografía blanca con borde negro contundente
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawSeismicAnomalies(
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
  const showSeismic =
    activeLayers?.seismicAnomalies ||
    activeLayers?.seismic ||
    activeLayers?.anomaliasSismicas ||
    false;

  if (!showSeismic) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (animTime || Date.now()) / 1000;

  GLOBAL_SEISMIC_ANOMALIES.forEach((item) => {
    const { x, y } = latLonToPolar(item.lat, item.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    const distFromCenter = Math.hypot(x, y);
    if (distFromCenter > mapRadius - 4) return;

    // =========================================================================
    // A. TRAZADO DE TRAYECTORIA DE RUPTURA / FALLAS EN TENSIÓN (VENEZUELA ETC.)
    // =========================================================================
    if (item.faultPath && item.faultPath.length > 1) {
      ctx.save();
      ctx.beginPath();

      item.faultPath.forEach(([fLat, fLon], idx) => {
        const fp = latLonToPolar(fLat, fLon, mapRadius, rotation);
        const fpx = centerX + fp.x;
        const fpy = centerY + fp.y;
        if (idx === 0) ctx.moveTo(fpx, fpy);
        else ctx.lineTo(fpx, fpy);
      });

      ctx.strokeStyle = item.color;
      ctx.lineWidth = isNeon ? 2.5 : 1.4;
      if (isNeon) {
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // B. SIMULACIÓN CINEMÁTICA DE ONDAS EXPANSIVAS SUPERSÓNICAS (SHOCKWAVES)
    // =========================================================================
    const waveSpeed = item.waveSpeed || 1.2;
    const waveCount = item.type === 'supershear_rupture' ? 3 : 2;

    for (let w = 0; w < waveCount; w++) {
      const cycle = (timeSec * waveSpeed + w * (1 / waveCount)) % 1.0;
      const maxR = Math.max(12, ((item.radiusKm || 180) / 111) * (mapRadius / 90));
      const currentR = cycle * maxR;
      const alpha = (1 - cycle) * 0.75;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, currentR, 0, Math.PI * 2);

      ctx.strokeStyle = `rgba(${hexToRgb(item.color)}, ${alpha})`;
      ctx.lineWidth = item.type === 'supershear_rupture' ? 2.0 : 1.2;
      if (item.type === 'supershear_rupture') {
        ctx.setLineDash([6, 3]); // Visualización de onda de choque quebrada
      }

      if (isNeon) {
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // C. DESTELLOS PLASMA DE LUCES DE TERREMOTO (EQL) E IONOSFERA
    // =========================================================================
    if (item.type === 'ionospheric_eql') {
      const sparkCount = 4;
      ctx.save();
      for (let s = 0; s < sparkCount; s++) {
        const angle = (timeSec * 3 + s * (Math.PI / 2)) % (Math.PI * 2);
        const rDist = 12 + Math.sin(timeSec * 4 + s) * 8;
        const spx = px + Math.cos(angle) * rDist;
        const spy = py + Math.sin(angle) * rDist;

        ctx.beginPath();
        ctx.arc(spx, spy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();
    }

    // =========================================================================
    // D. VECTOR PROPAGANTE POR EL NÚCLEO TERRESTRE (ATLÁNTICO NORTE -> AUSTRALIA)
    // =========================================================================
    if (item.type === 'core_propagation' && item.targetLat !== undefined) {
      const tgt = latLonToPolar(item.targetLat, item.targetLon, mapRadius, rotation);
      const tpx = centerX + tgt.x;
      const tpy = centerY + tgt.y;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(tpx, tpy);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 6]);
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // E. EPICENTRO Y ETIQUETA EN BLANCO PURA CON BORDE NEGRO
    // =========================================================================
    // Núcleo del Epicentro
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    if (isNeon) {
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 10;
    }
    ctx.fill();
    ctx.restore();

    // Rótulo Tipográfico
    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff'; // Letras blancas puras

    drawTextWithOutline(ctx, `⚡ ${item.name}`, px, py - 6, '#020617', 3.8);

    // Subtexto Informativo HUD
    ctx.font = 'bold 7.5px monospace';
    ctx.fillStyle = item.color;
    drawTextWithOutline(ctx, item.info.toUpperCase(), px, py + 12, '#020617', 3.2);

    ctx.restore();
  });

  ctx.restore();
}

// Convertidor Hex a RGB para transiciones de opacidad
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}