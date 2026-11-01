// components/map2d/layers/drawGraticule.js
import { latLonToPolar } from '@/lib/polarMath';

/**
 * Dibuja la malla de Gráticula Táctica HUD (Meridianos y Paralelos):
 * - Retícula Central del Polo Norte con núcleo rojo neón de origen.
 * - Paralelos concéntricos de latitud con etiquetado angular (+75°, +60°, etc.).
 * - Meridianos radiales de longitud con subdivisión adaptativa por zoom (LOD).
 * - Eje Principal Greenwich (0° GMT) - Antimeridiano (180°) resaltado en verde esmeralda neón.
 * - Etiquetas perimetrales de grados de longitud.
 */
export function drawGraticule(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1
) {
  if (!activeLayers?.graticule) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  const isNeon = activeLayers?.neonMode ?? true;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // -------------------------------------------------------------
  // 1. NIVEL DE DETALLE ADAPTATIVO POR ZOOM (LOD)
  // -------------------------------------------------------------
  let latStep = 15;
  let lonStep = 30;

  if (zoom >= 3.0) {
    latStep = 5;
    lonStep = 10;
  } else if (zoom >= 1.5) {
    latStep = 10;
    lonStep = 15;
  }

  // -------------------------------------------------------------
  // 2. PARALELOS CONCÉNTRICOS (LATITUDES)
  // -------------------------------------------------------------
  ctx.lineWidth = isNeon ? 1.0 : 0.7;
  ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.25)';

  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 4;
  } else {
    ctx.shadowBlur = 0;
  }

  for (let lat = 80; lat >= -80; lat -= latStep) {
    const rho = mapRadius * ((90 - lat) / 180);
    if (rho <= 0 || rho > mapRadius) continue;

    ctx.beginPath();
    ctx.arc(centerX, centerY, rho, 0, Math.PI * 2);
    ctx.stroke();

    // Etiquetas de Grados de Latitud sobre el radio Norte
    if (lat % 15 === 0) {
      ctx.shadowBlur = 0;
      ctx.font = 'bold 8.5px monospace';
      ctx.fillStyle = isNeon ? '#7dd3fc' : '#94a3b8';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const latStr = `${lat > 0 ? '+' : ''}${lat}°`;
      ctx.fillText(latStr, centerX + 5, centerY - rho);
    }
  }

  // -------------------------------------------------------------
  // 3. MERIDIANOS RADIALES ESTÁNDAR (LONGITUDES)
  // -------------------------------------------------------------
  for (let lon = -180; lon < 180; lon += lonStep) {
    // Excluir Greenwich (0° / 180°) para dibujarlo resaltado después
    if (lon === 0 || lon === -180 || lon === 180) continue;

    const rad = ((lon + (rotation - 180)) * Math.PI) / 180;
    const xEnd = centerX + mapRadius * Math.sin(rad);
    const yEnd = centerY - mapRadius * Math.cos(rad);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    // Etiquetas de Longitud en el Perímetro HUD
    if (lon % 30 === 0) {
      const labelR = mapRadius - 14;
      const lx = centerX + labelR * Math.sin(rad);
      const ly = centerY - labelR * Math.cos(rad);

      ctx.shadowBlur = 0;
      ctx.font = 'bold 8.5px monospace';
      ctx.fillStyle = isNeon ? '#38bdf8' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lonText = `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`;
      ctx.fillText(lonText, lx, ly);
    }
  }

  // -------------------------------------------------------------
  // 4. MERIDIANO DE GREENWICH - ANTIMERIDIANO (0° - 180°) RESALTADO
  // -------------------------------------------------------------
  ctx.strokeStyle = isNeon ? '#4ade80' : '#22c55e'; // Verde esmeralda neón brillante
  ctx.lineWidth = isNeon ? 1.8 : 1.2;
  ctx.setLineDash([5, 3]);

  if (isNeon) {
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 8;
  }

  const gRad = ((0 + (rotation - 180)) * Math.PI) / 180;
  const gx1 = centerX + mapRadius * Math.sin(gRad);
  const gy1 = centerY - mapRadius * Math.cos(gRad);
  const gx2 = centerX - mapRadius * Math.sin(gRad);
  const gy2 = centerY + mapRadius * Math.cos(gRad);

  ctx.beginPath();
  ctx.moveTo(gx1, gy1);
  ctx.lineTo(gx2, gy2);
  ctx.stroke();
  ctx.setLineDash([]); // Restablecer trazo continuo

  // Badges Tácticos para Greenwich (0° GMT) y Antimeridiano (180°)
  ctx.shadowBlur = 0;
  ctx.font = 'bold 9px monospace';
  const badgeR = mapRadius - 16;

  // Placa 0° GMT
  const lx0 = centerX + badgeR * Math.sin(gRad);
  const ly0 = centerY - badgeR * Math.cos(gRad);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(lx0 - 22, ly0 - 7, 44, 14, 3);
  } else {
    ctx.rect(lx0 - 22, ly0 - 7, 44, 14);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0° GMT', lx0, ly0);

  // Placa 180°
  const lx180 = centerX - badgeR * Math.sin(gRad);
  const ly180 = centerY + badgeR * Math.cos(gRad);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(lx180 - 18, ly180 - 7, 36, 14, 3);
  } else {
    ctx.rect(lx180 - 18, ly180 - 7, 36, 14);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ade80';
  ctx.fillText('180°', lx180, ly180);

  // -------------------------------------------------------------
  // 5. RETÍCULA RADAR Y NÚCLEO EN EL POLO NORTE (ORIGEN CENTRO)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(centerX, centerY);

  // Anillo giratorio interno
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? '#38bdf8' : 'rgba(56, 189, 248, 0.8)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 3]);
  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
  }
  ctx.stroke();

  // Retícula en Cruz
  ctx.beginPath();
  ctx.moveTo(-24, 0); ctx.lineTo(24, 0);
  ctx.moveTo(0, -24); ctx.lineTo(0, 24);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.stroke();

  // Núcleo central de Origen (Punto Rojo)
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  if (isNeon) {
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
  }
  ctx.fill();

  ctx.restore();

  ctx.restore();
}