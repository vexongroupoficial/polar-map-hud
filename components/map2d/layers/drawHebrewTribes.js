// components/map2d/layers/drawHebrewTribes.js

// 🏛️ 1. LOS 4 GRANDES ESTANDARTES EMBLEMÁTICOS Y CAMPAMENTOS (4 SECTORES DE 90°)
export const DEGALIM_CAMPS = [
  {
    id: 'east',
    name: 'ORIENTE (MIZRACH)',
    leader: 'Judá',
    banner: '🦁 LEÓN',
    exactDeg: 0,        // 0° Equinoccio de Primavera (Inicio de Judá, Isacar, Zabulón)
    degStart: 0,
    degEnd: 90,
    color: '#fbbf24',
    bgFill: 'rgba(251, 191, 36, 0.12)'
  },
  {
    id: 'south',
    name: 'SUR (DAROM)',
    leader: 'Rubén',
    banner: '👼 HOMBRE',
    exactDeg: 90,       // 90° Solsticio de Verano (Inicio de Rubén, Simeón, Gad)
    degStart: 90,
    degEnd: 180,
    color: '#f87171',
    bgFill: 'rgba(248, 113, 113, 0.12)'
  },
  {
    id: 'west',
    name: "OCCIDENTE (MA'ARAV)",
    leader: 'Efraín',
    banner: '🐂 TORO',
    exactDeg: 180,      // 180° Equinoccio de Otoño (Inicio de Efraín, Manasés, Benjamín)
    degStart: 180,
    degEnd: 270,
    color: '#34d399',
    bgFill: 'rgba(52, 211, 153, 0.12)'
  },
  {
    id: 'north',
    name: 'NORTE (TZAFON)',
    leader: 'Dan',
    banner: '🦅 ÁGUILA',
    exactDeg: 270,      // 270° Solsticio de Invierno (Inicio de Dan, Aser, Neftalí)
    degStart: 270,
    degEnd: 360,
    color: '#38bdf8',
    bgFill: 'rgba(56, 189, 248, 0.12)'
  }
];

// 💎 2. MATRIZ DE LAS 12 TRIBUS (3 TRIBUS POR CAMPAMENTO CARDINAL)
export const TRIBES_HOSHEN_DATA = [
  // 🦁 ORIENTE (0° - 90°) - Equinoccio de Primavera
  { sector: 1, degStart: 0, degEnd: 30, tribu: 'Judá', camp: 'Oriente', banner: '🦁', stone: 'Nófej (Granate)', stoneColor: '#e11d48' },
  { sector: 2, degStart: 30, degEnd: 60, tribu: 'Isacar', camp: 'Oriente', banner: '🦁', stone: 'Pitdáh (Topacio)', stoneColor: '#facc15' },
  { sector: 3, degStart: 60, degEnd: 90, tribu: 'Zabulón', camp: 'Oriente', banner: '🦁', stone: 'Bareket (Esmeralda)', stoneColor: '#10b981' },

  // 👼 SUR (90° - 180°) - Solsticio de Verano
  { sector: 4, degStart: 90, degEnd: 120, tribu: 'Rubén', camp: 'Sur', banner: '👼', stone: 'Odem (Cornalina)', stoneColor: '#ef4444' },
  { sector: 5, degStart: 120, degEnd: 150, tribu: 'Simeón', camp: 'Sur', banner: '👼', stone: 'Sapir (Zafiro)', stoneColor: '#2563eb' },
  { sector: 6, degStart: 150, degEnd: 180, tribu: 'Gad', camp: 'Sur', banner: '👼', stone: 'Jalom (Diamante)', stoneColor: '#f8fafc' },

  // 🐂 OCCIDENTE (180° - 270°) - Equinoccio de Otoño
  { sector: 7, degStart: 180, degEnd: 210, tribu: 'Efraín', camp: 'Occidente', banner: '🐂', stone: 'Leshem (Jacinto)', stoneColor: '#f97316' },
  { sector: 8, degStart: 210, degEnd: 240, tribu: 'Manasés', camp: 'Occidente', banner: '🐂', stone: 'Shevo (Ágata)', stoneColor: '#a855f7' },
  { sector: 9, degStart: 240, degEnd: 270, tribu: 'Benjamín', camp: 'Occidente', banner: '🐂', stone: 'Ajlamah (Amatista)', stoneColor: '#c084fc' },

  // 🦅 NORTE (270° - 360°) - Solsticio de Invierno
  { sector: 10, degStart: 270, degEnd: 300, tribu: 'Dan', camp: 'Norte', banner: '🦅', stone: 'Tarshish (Crisólito)', stoneColor: '#06b6d4' },
  { sector: 11, degStart: 300, degEnd: 330, tribu: 'Aser', camp: 'Norte', banner: '🦅', stone: 'Shoham (Ónice)', stoneColor: '#64748b' },
  { sector: 12, degStart: 330, degEnd: 360, tribu: 'Neftalí', camp: 'Norte', banner: '🦅', stone: 'Yashfeh (Jaspe)', stoneColor: '#059669' }
];

// Helper para texto nítido con relleno blanco puro y contorno negro de alto contraste
function drawCrispText(
  ctx,
  text,
  x,
  y,
  font = 'bold 11px system-ui, sans-serif',
  fillColor = '#ffffff',
  strokeColor = '#000000',
  strokeWidth = 4.0
) {
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
 * Renderiza los 4 Campamentos Cardinales (3 tribus cada uno) sincronizados con Equinoccios y Solsticios.
 */
export function drawHebrewTribes(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
  animTimeOrNeon = 0
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 0;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
  }

  const isEnabled =
    activeLayers?.tribesLayer ||
    activeLayers?.tribus ||
    activeLayers?.hebrewTribes ||
    activeLayers?.degalimLayer ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;

  const rInnerCamp = mapRadius * 0.72;
  const rOuterCamp = mapRadius * 0.85;
  const rMidCamp = mapRadius * 0.785;
  const rBannerRadius = mapRadius * 0.58;

  // =========================================================================
  // 1. RENDERIZADO DE LOS 4 SECTORES DE 90° (CAMPAMENTOS)
  // =========================================================================
  DEGALIM_CAMPS.forEach((camp) => {
    const radStart = Math.PI + (camp.degStart * Math.PI) / 180 + baseRotationRad;
    const radEnd = Math.PI + (camp.degEnd * Math.PI) / 180 + baseRotationRad;

    // Arco de fondo de 90° para las 3 tribus del campamento
    ctx.beginPath();
    ctx.arc(centerX, centerY, rOuterCamp, radStart, radEnd, false);
    ctx.arc(centerX, centerY, rInnerCamp, radEnd, radStart, true);
    ctx.closePath();
    ctx.fillStyle = camp.bgFill;
    ctx.fill();

    ctx.strokeStyle = camp.color;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Estandarte Emblemático Principal en el Inicio del Eje Cardinal (0°, 90°, 180°, 270°)
    const bannerRad = Math.PI + (camp.exactDeg * Math.PI) / 180 + baseRotationRad;
    const bx = centerX + Math.cos(bannerRad) * rBannerRadius;
    const by = centerY + Math.sin(bannerRad) * rBannerRadius;

    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.strokeStyle = camp.color;
    ctx.lineWidth = 2.0;
    ctx.shadowColor = camp.color;
    ctx.shadowBlur = 10;

    const bannerText = `${camp.banner} ${camp.name}`;
    ctx.font = 'bold 11.5px system-ui, sans-serif';
    const bw = ctx.measureText(bannerText).width + 22;
    const bh = 26;

    ctx.beginPath();
    ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 5);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, bannerText, bx, by, 'bold 11.5px system-ui, sans-serif', '#ffffff', '#000000', 4.0);
    ctx.restore();
  });

  // =========================================================================
  // 2. RENDERIZADO DE LAS 12 TRIBUS Y SUS GEMAS DEL PECTORAL (HOSHEN)
  // =========================================================================
  TRIBES_HOSHEN_DATA.forEach((item) => {
    const midDeg = item.degStart + 15;
    const midRad = Math.PI + (midDeg * Math.PI) / 180 + baseRotationRad;

    const tx = centerX + Math.cos(midRad) * rMidCamp;
    const ty = centerY + Math.sin(midRad) * rMidCamp;

    // Gema del Pectoral
    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty - 8, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = item.stoneColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = item.stoneColor;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Rótulos
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Nombre de la Tribu con su estandarte emblemático correspondiente
    drawCrispText(ctx, `${item.banner} Tribu de ${item.tribu}`, tx, ty + 4, 'bold 11px system-ui, sans-serif', '#ffffff', '#000000', 4.0);
    // Gema del Pectoral
    drawCrispText(ctx, `💎 ${item.stone}`, tx, ty + 17, 'bold 9.5px system-ui, monospace', '#fef08a', '#000000', 3.2);

    ctx.restore();
  });

  ctx.restore();
}


export default drawHebrewTribes;