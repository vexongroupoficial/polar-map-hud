// components/map2d/layers/drawGlaciers.js
import { latLonToPolar } from '@/lib/polarMath';
import { POLAR_GLACIERS } from '@/lib/glacierData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.8) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawGlaciers(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true,
  animTime = 0
) {
  // 🛑 Seguridad: Se activa con 'glaciers' o 'glaciares'
  const showGlaciers = activeLayers?.glaciers ?? activeLayers?.glaciares ?? false;
  if (!showGlaciers) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  POLAR_GLACIERS.forEach((item) => {
    // -------------------------------------------------------------
    // A. CASQUETE CENTRAL ÁRTICO (Centro: 90°N -> 74°N)
    // -------------------------------------------------------------
    if (item.type === 'central_cap') {
      const rCap = mapRadius * ((90 - item.latSouth) / 180);

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, rCap, 0, Math.PI * 2);
      ctx.fillStyle = isNeon ? item.color : 'rgba(226, 232, 240, 0.3)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? item.strokeColor : '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 3]);
      if (isNeon) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // B. ANILLO PERIFÉRICO ANTÁRTICO (Borde Exterior: -60°S -> -90°S)
    // -------------------------------------------------------------
    if (item.type === 'outer_ring') {
      const rInner = mapRadius * ((90 - item.latNorth) / 180); // Lat -60°S -> 150/180
      const rOuter = mapRadius; // Borde externo del mapa

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, rOuter, 0, Math.PI * 2, false);
      ctx.arc(centerX, centerY, rInner, 0, Math.PI * 2, true);
      ctx.closePath();

      ctx.fillStyle = isNeon ? item.color : 'rgba(203, 213, 225, 0.25)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? item.strokeColor : '#cbd5e1';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 4]);
      if (isNeon) {
        ctx.shadowColor = '#bae6fd';
        ctx.shadowBlur = 12;
      }
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // C. POLÍGONOS DE GRANDES MASA HELADAS (Inlandsis de Groenlandia)
    // -------------------------------------------------------------
    if (item.type === 'polygon' && item.polygon && item.polygon.length >= 3) {
      ctx.save();
      ctx.beginPath();
      item.polygon.forEach(([lat, lon], idx) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        const px = centerX + x;
        const py = centerY + y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      ctx.fillStyle = isNeon ? item.color : 'rgba(148, 163, 184, 0.35)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? item.strokeColor : '#94a3b8';
      ctx.lineWidth = 1.2;
      if (isNeon) {
        ctx.shadowColor = item.strokeColor;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // D. GLACIARES REGIONALES / ALPINOS (Puntos Radiales)
    // -------------------------------------------------------------
    if (item.radiusKm) {
      const { x, y } = latLonToPolar(item.lat, item.lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      const displayRadius = Math.max(5, (item.radiusKm / 111) * (mapRadius / 90));

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, displayRadius, 0, Math.PI * 2);
      ctx.fillStyle = isNeon ? item.color : 'rgba(226, 232, 240, 0.5)';
      ctx.fill();

      ctx.strokeStyle = isNeon ? item.strokeColor : '#ffffff';
      ctx.lineWidth = 1.4;
      if (isNeon) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // E. ETIQUETAS EN BLANCO PURA CON BORDE NEGRO
    // -------------------------------------------------------------
    const labelLat = item.labelLat ?? item.lat;
    const labelLon = item.labelLon ?? item.lon;

    if (labelLat !== undefined && labelLon !== undefined) {
      const { x, y } = latLonToPolar(labelLat, labelLon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;

      const dist = Math.hypot(x, y);
      if (dist <= mapRadius - 4) {
        ctx.save();
        ctx.font = 'bold 9.5px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff'; // Letras blancas puras
        drawTextWithOutline(ctx, item.name.toUpperCase(), px, py, '#020617', 3.8);
        ctx.restore();
      }
    }
  });

  ctx.restore();
}