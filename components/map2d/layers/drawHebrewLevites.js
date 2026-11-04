// components/map2d/layers/drawHebrewLevites.js

export const LEVITE_CLANS = [
  { id: 'east_kohanim', name: 'MOISÉS Y AARÓN (KOHANIM)', degStart: 315, degEnd: 45, color: '#fbbf24', symbol: '👑', desc: 'Custodios del Altar' },
  { id: 'south_kohath', name: 'CLAN DE COAT', degStart: 45, degEnd: 135, color: '#f87171', symbol: '📜', desc: 'Custodios del Arca y Menorá' },
  { id: 'west_gerson', name: 'CLAN DE GERSÓN', degStart: 135, degEnd: 225, color: '#34d399', symbol: '⛺', desc: 'Custodios de las Cortinas' },
  { id: 'north_merari', name: 'CLAN DE MERARI', degStart: 225, degEnd: 315, color: '#38bdf8', symbol: '🏛️', desc: 'Custodios de las Columnas' }
];

function drawCrispText(ctx, text, x, y, font, fillColor = '#ffffff', strokeColor = '#000000', strokeWidth = 3.5) {
  ctx.save();
  ctx.font = font;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  if (strokeColor && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Renderiza el Anillo Interior de los Levitas y el Tabernáculo Central.
 */
export function drawHebrewLevites(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation;

  // Normalización flexible de parámetros de entrada
  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = 0;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
  }

  // Verificación de activación desde el menú lateral (admite varios alias)
  const isEnabled =
    (activeLayers?.levites ||
      activeLayers?.hebrewLevites ||
      activeLayers?.levitas ||
      activeLayers?.tabernacle ||
      activeLayers?.clanesLeviticos) ?? true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRad = (rotation * Math.PI) / 180;
  const rInner = mapRadius * 0.18;
  const rOuter = mapRadius * 0.32;
  const rMid = mapRadius * 0.25;

  // 1. DIBUJAR CLANES LEVÍTICOS ALREDEDOR DEL CENTRO
  LEVITE_CLANS.forEach((clan) => {
    const radStart = (clan.degStart * Math.PI) / 180 + baseRad;
    let normalizedEnd = clan.degEnd < clan.degStart ? clan.degEnd + 360 : clan.degEnd;
    const radEnd = (normalizedEnd * Math.PI) / 180 + baseRad;

    ctx.beginPath();
    ctx.arc(centerX, centerY, rOuter, radStart, radEnd, false);
    ctx.arc(centerX, centerY, rInner, radEnd, radStart, true);
    ctx.closePath();

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.fill();
    ctx.strokeStyle = clan.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rótulo del Clan
    const midDeg = clan.degStart + (clan.degEnd < clan.degStart ? (clan.degEnd + 360 - clan.degStart) / 2 : (clan.degEnd - clan.degStart) / 2);
    const midRad = (midDeg * Math.PI) / 180 + baseRad;
    const cx = centerX + Math.cos(midRad) * rMid;
    const cy = centerY + Math.sin(midRad) * rMid;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, `${clan.symbol} ${clan.name}`, cx, cy - 5, 'bold 9.5px system-ui, sans-serif', clan.color, '#000000', 3.5);
    drawCrispText(ctx, clan.desc, cx, cy + 6, '500 7.5px system-ui, sans-serif', '#cbd5e1', '#000000', 2.5);
    ctx.restore();
  });

  // 2. TABERNÁCULO CENTRAL (MISHKÁN - PUNTO r = 0)
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, rInner * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.0;
  ctx.setLineDash([3, 3]);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawCrispText(ctx, '⛪ EL TABERNÁCULO', centerX, centerY - 4, 'bold 10px system-ui, sans-serif', '#ffffff', '#000000', 3.5);
  drawCrispText(ctx, 'HOLY OF HOLIES (r=0)', centerX, centerY + 6, 'bold 7.5px system-ui, monospace', '#fef08a', '#000000', 2.8);
  ctx.restore();

  ctx.restore();
}

export const drawLevitesLayer = drawHebrewLevites;
export default drawHebrewLevites;