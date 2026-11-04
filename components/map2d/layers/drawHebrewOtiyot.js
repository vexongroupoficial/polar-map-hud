// components/map2d/layers/drawHebrewOtiyot.js

// 1. LAS 3 LETRAS MADRES (אִמּוֹת) - CÉNIT Y EJES CENTRALES
export const MOTHER_LETTERS = [
  { letter: 'א', name: 'Alef', val: 1, eq: 'Muda', info: 'Aire (Ruach)', deg: 0, rFactor: 0.0, color: '#fef08a' },
  { letter: 'ש', name: 'Shin', val: 300, eq: 'SH / S', info: 'Fuego (Esh)', deg: 90, rFactor: 0.32, color: '#f87171' },
  { letter: 'מ', name: 'Mem', val: 40, eq: 'M', info: 'Agua (Mayim)', deg: 270, rFactor: 0.32, color: '#38bdf8' }
];

// 2. LAS 7 LETRAS DOBLES (כְּפוּלוֹת) - ÓRBITAS PLANETARIAS
export const DOUBLE_LETTERS = [
  { letter: 'כ', name: 'Kaf', val: 20, eq: 'K / J', info: 'Sol (Chamah)', deg: 0, rFactor: 0.58, color: '#fbbf24' },
  { letter: 'ת', name: 'Tav', val: 400, eq: 'T', info: 'Luna (Levanah)', deg: 51.4, rFactor: 0.42, color: '#e2e8f0' },
  { letter: 'ד', name: 'Dalet', val: 4, eq: 'D', info: 'Marte (Ma\'adim)', deg: 102.8, rFactor: 0.64, color: '#ef4444' },
  { letter: 'ר', name: 'Resh', val: 200, eq: 'R', info: 'Mercurio (Kokhav)', deg: 154.2, rFactor: 0.48, color: '#38bdf8' },
  { letter: 'ג', name: 'Gimel', val: 3, eq: 'G', info: 'Júpiter (Tzedek)', deg: 205.6, rFactor: 0.70, color: '#a855f7' },
  { letter: 'פ', name: 'Pe', val: 80, eq: 'P / F', info: 'Venus (Nogah)', deg: 257.0, rFactor: 0.52, color: '#f472b6' },
  { letter: 'ב', name: 'Bet', val: 2, eq: 'B / V', info: 'Saturno (Shabbatai)', deg: 308.4, rFactor: 0.76, color: '#94a3b8' }
];

// 3. LAS 12 LETRAS SIMPLES (פְּשׁוּטוֹת) - PERIFÉRICAS (12 MAZALOT)
export const SIMPLE_LETTERS = [
  { degStart: 0, degEnd: 30, letter: 'ה', name: 'Hei', val: 5, eq: 'H', monthHeb: 'נִיסָן', monthEs: 'Nisán', signEs: 'Aries', sense: 'Vista' },
  { degStart: 30, degEnd: 60, letter: 'ו', name: 'Vav', val: 6, eq: 'V / W / O', monthHeb: 'אִיָּיר', monthEs: 'Iyar', signEs: 'Tauro', sense: 'Oído' },
  { degStart: 60, degEnd: 90, letter: 'ז', name: 'Zayin', val: 7, eq: 'Z', monthHeb: 'סִיוָן', monthEs: 'Siván', signEs: 'Géminis', sense: 'Marcha' },
  { degStart: 90, degEnd: 120, letter: 'ח', name: 'Chet', val: 8, eq: 'J (gutural)', monthHeb: 'תַּמּוּז', monthEs: 'Tamuz', signEs: 'Cáncer', sense: 'Tacto' },
  { degStart: 120, degEnd: 150, letter: 'ט', name: 'Tet', val: 9, eq: 'T', monthHeb: 'אָב', monthEs: 'Av', signEs: 'Leo', sense: 'Escucha' },
  { degStart: 150, degEnd: 180, letter: 'י', name: 'Yod', val: 10, eq: 'Y / I', monthHeb: 'אֱלוּל', monthEs: 'Elul', signEs: 'Virgo', sense: 'Acción' },
  { degStart: 180, degEnd: 210, letter: 'ל', name: 'Lamed', val: 30, eq: 'L', monthHeb: 'תִּשְׁרֵי', monthEs: 'Tishrei', signEs: 'Libra', sense: 'Unión' },
  { degStart: 210, degEnd: 240, letter: 'נ', name: 'Nun', val: 50, eq: 'N', monthHeb: 'חֶשְׁוָן', monthEs: 'Jeshván', signEs: 'Escorpio', sense: 'Olfato' },
  { degStart: 240, degEnd: 270, letter: 'ס', name: 'Samekh', val: 60, eq: 'S', monthHeb: 'כִּסְלֵו', monthEs: 'Kislev', signEs: 'Sagitario', sense: 'Sueño' },
  { degStart: 270, degEnd: 300, letter: 'ע', name: 'Ayin', val: 70, eq: 'Gutural', monthHeb: 'טֵבֵת', monthEs: 'Tevet', signEs: 'Capricornio', sense: 'Juicio' },
  { degStart: 300, degEnd: 330, letter: 'צ', name: 'Tzadi', val: 90, eq: 'TS / TZ', monthHeb: 'שְׁבָט', monthEs: 'Shevat', signEs: 'Acuario', sense: 'Alimento' },
  { degStart: 330, degEnd: 360, letter: 'ק', name: 'Kof', val: 100, eq: 'K / Q', monthHeb: 'אֲדָר', monthEs: 'Adar', signEs: 'Piscis', sense: 'Risa' }
];

// Helper para renderizar texto ultra-nítido con contorno negro
function drawCrispText(
  ctx,
  text,
  x,
  y,
  font = 'bold 11px system-ui, sans-serif',
  fillColor = '#ffffff',
  strokeColor = '#000000',
  strokeWidth = 3.5
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
 * Helper para dibujar el Nodo Circular de la Letra Hebrea
 */
function drawHebrewLetterCircle(
  ctx,
  x,
  y,
  letter,
  radius = 16,
  strokeColor = '#facc15',
  glowColor = '#facc15',
  letterColor = '#ffffff'
) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.2;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = Math.round(radius * 1.15);
  drawCrispText(
    ctx,
    letter,
    x,
    y - 1,
    `bold ${fontSize}px "Times New Roman", serif`,
    letterColor,
    '#000000',
    4.0
  );

  ctx.restore();
}

/**
 * Renderiza la Capa Completa con Textos Desplazados hacia Abajo del Círculo
 */
export function drawHebrewOtiyot(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation;

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

  const isEnabled =
    (activeLayers?.otiyot ||
      activeLayers?.hebrewLetters ||
      activeLayers?.seferYetzirah) ?? true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;

  // =========================================================================
  // 1. LAS 3 LETRAS MADRES (א, מ, ش)
  // =========================================================================
  MOTHER_LETTERS.forEach((m) => {
    const rad = (m.deg * Math.PI) / 180 + baseRotationRad;
    const mx = m.rFactor === 0 ? centerX : centerX + Math.cos(rad) * (mapRadius * m.rFactor);
    const my = m.rFactor === 0 ? centerY : centerY + Math.sin(rad) * (mapRadius * m.rFactor);

    drawHebrewLetterCircle(ctx, mx, my, m.letter, 18, m.color, m.color, m.color);

    // Textos colocados holgadamente por debajo del círculo grande (Radio 18 + offset)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, `${m.info} • [${m.val}]`, mx, my + 26, 'bold 9px system-ui, sans-serif', m.color, '#000000', 3.0);
    drawCrispText(ctx, `Español: ${m.eq}`, mx, my + 37, '500 8px system-ui, sans-serif', '#ffffff', '#000000', 2.5);
    ctx.restore();
  });

  // =========================================================================
  // 2. LAS 7 LETRAS DOBLES (PLANETARIAS)
  // =========================================================================
  DOUBLE_LETTERS.forEach((d) => {
    const dRad = (d.deg * Math.PI) / 180 + baseRotationRad;
    const rOrbit = mapRadius * d.rFactor;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, rOrbit, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 4]);
    ctx.stroke();
    ctx.restore();

    const dx = centerX + Math.cos(dRad) * rOrbit;
    const dy = centerY + Math.sin(dRad) * rOrbit;

    drawHebrewLetterCircle(ctx, dx, dy, d.letter, 15, d.color, d.color, '#ffffff');

    // Textos por debajo del círculo (Radio 15 + offset)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, `${d.info} [=${d.val}]`, dx, dy + 23, 'bold 8.5px system-ui, sans-serif', d.color, '#000000', 2.8);
    drawCrispText(ctx, `Español: "${d.eq}"`, dx, dy + 33, '500 7.5px system-ui, sans-serif', '#e2e8f0', '#000000', 2.2);
    ctx.restore();
  });

  // =========================================================================
  // 3. LAS 12 LETRAS SIMPLES (PERIFÉRICAS)
  // =========================================================================
  const rSimplePos = mapRadius * 1.07;

  SIMPLE_LETTERS.forEach((s) => {
    const midDeg = s.degStart + 15;
    const midRad = (midDeg * Math.PI) / 180 + baseRotationRad;

    const sx = centerX + Math.cos(midRad) * rSimplePos;
    const sy = centerY + Math.sin(midRad) * rSimplePos;

    drawHebrewLetterCircle(ctx, sx, sy, s.letter, 16, '#fbbf24', '#fbbf24', '#fef08a');

    // Textos ordenados verticalmente por debajo del nodo circular (Radio 16 + offset)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, `${s.monthHeb} • ${s.monthEs} (${s.signEs})`, sx, sy + 24, 'bold 9px system-ui, sans-serif', '#fef08a', '#000000', 3.0);
    drawCrispText(ctx, `Gematría: ${s.val} | Fonética: "${s.eq}"`, sx, sy + 35, 'bold 8px system-ui, monospace', '#38bdf8', '#000000', 2.5);
    drawCrispText(ctx, `Sentido: ${s.sense}`, sx, sy + 45, '500 7.5px system-ui, sans-serif', '#93c5fd', '#000000', 2.2);
    ctx.restore();
  });

  ctx.restore();
}

export const drawOtiyotLayer = drawHebrewOtiyot;
export default drawHebrewOtiyot;