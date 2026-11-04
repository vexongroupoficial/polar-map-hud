// components/map2d/layers/drawHebrewMazalot.js

// 🌌 1. CONSTELACIONES DEL MAZZAROTH (MAZALOT) EN HEBREO (Nisán / Aries comiensa en 0°)
export const HEBREW_MAZALOT_DATA = [
  { sector: 1, degStart: 0, degEnd: 30, hebrew: 'טָלֶה', name: 'Taléh', constellation: 'Aries', symbol: '♈', isEquinox: true, goldBorder: true },
  { sector: 2, degStart: 30, degEnd: 60, hebrew: 'שׁוֹר', name: 'Shor', constellation: 'Tauro', symbol: '♉', isEquinox: false, goldBorder: false },
  { sector: 3, degStart: 60, degEnd: 90, hebrew: 'תְּאוֹמִים', name: 'Teomim', constellation: 'Géminis', symbol: '♊', isEquinox: false, goldBorder: true },
  { sector: 4, degStart: 90, degEnd: 120, hebrew: 'סַרְטָן', name: 'Sartán', constellation: 'Cáncer', symbol: '♋', isEquinox: false, goldBorder: false },
  { sector: 5, degStart: 120, degEnd: 150, hebrew: 'אַרְיֵה', name: 'Ariéh', constellation: 'Leo', symbol: '♌', isEquinox: false, goldBorder: true },
  { sector: 6, degStart: 150, degEnd: 180, hebrew: 'בְּתוּלָה', name: 'Betuláh', constellation: 'Virgo', symbol: '♍', isEquinox: false, goldBorder: false },
  { sector: 7, degStart: 180, degEnd: 210, hebrew: 'מֹאזְנַיִם', name: 'Moznayim', constellation: 'Libra', symbol: '♎', isEquinox: true, goldBorder: true },
  { sector: 8, degStart: 210, degEnd: 240, hebrew: 'עַקְרָב', name: 'Akrav', constellation: 'Escorpio', symbol: '♏', isEquinox: false, goldBorder: false },
  { sector: 9, degStart: 240, degEnd: 270, hebrew: 'קֶשֶׁת', name: 'Keshet', constellation: 'Sagitario', symbol: '♐', isEquinox: false, goldBorder: true },
  { sector: 10, degStart: 270, degEnd: 300, hebrew: 'גְּדִי', name: 'Gedí', constellation: 'Capricornio', symbol: '♑', isEquinox: false, goldBorder: false },
  { sector: 11, degStart: 300, degEnd: 330, hebrew: 'דְּלִי', name: 'Dlí', constellation: 'Acuario', symbol: '♒', isEquinox: false, goldBorder: true },
  { sector: 12, degStart: 330, degEnd: 360, hebrew: 'דָּגִים', name: 'Dagím', constellation: 'Piscis', symbol: '♓', isEquinox: false, goldBorder: false }
];

// Helper para texto ultra-nítido con relleno blanco puro y contorno negro
function drawCrispText(
  ctx,
  text,
  x,
  y,
  font = 'bold 10.5px system-ui, sans-serif',
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

// Helper para dibujar arcos de la rueda exterior
function drawRingSector(ctx, centerX, centerY, rInner, rOuter, degStart, degEnd, baseRotationRad, fillColor, strokeColor, lineWidth = 1) {
  const radStart = (degStart * Math.PI) / 180 + baseRotationRad;
  let normalizedEnd = degEnd < degStart ? degEnd + 360 : degEnd;
  const radEnd = (normalizedEnd * Math.PI) / 180 + baseRotationRad;

  ctx.beginPath();
  ctx.arc(centerX, centerY, rOuter, radStart, radEnd, false);
  ctx.arc(centerX, centerY, rInner, radEnd, radStart, true);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Renderiza la Rueda Exterior de los Mazalot (Constelaciones en Hebreo).
 */
export function drawHebrewMazalot(
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
    activeLayers?.mazalot ||
    activeLayers?.hebrewMazalot ||
    activeLayers?.zodiacHebrew ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;

  // Radios concéntricos de la rueda exterior de los Mazalot
  const rInnerMazalot = mapRadius * 1.23;
  const rOuterMazalot = mapRadius * 1.35;
  const rMidMazalot = mapRadius * 1.29;

  // =========================================================================
  // DIBUJAR LA RUEDA CIRCULAR Y LOS 12 SECTORES DE LOS MAZALOT
  // =========================================================================
  HEBREW_MAZALOT_DATA.forEach((m) => {
    const isGold = m.goldBorder;
    const fillColor = m.isEquinox ? 'rgba(15, 23, 42, 0.96)' : 'rgba(2, 6, 23, 0.92)';
    const strokeColor = isGold ? '#fbbf24' : 'rgba(56, 189, 248, 0.45)';

    // Dibujar bloque de la rueda
    drawRingSector(
      ctx,
      centerX,
      centerY,
      rInnerMazalot,
      rOuterMazalot,
      m.degStart,
      m.degEnd,
      baseRotationRad,
      fillColor,
      strokeColor,
      isGold ? 1.8 : 1.0
    );

    // Calcular centro angular del sector
    const midDeg = m.degStart + 15;
    const midRad = (midDeg * Math.PI) / 180 + baseRotationRad;

    const mx = centerX + Math.cos(midRad) * rMidMazalot;
    const my = centerY + Math.sin(midRad) * rMidMazalot;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Rótulo formateado limpiamente: "♈ טָלֶה • Taléh (Aries)"
    const mainText = `${m.symbol} ${m.hebrew} • ${m.name} (${m.constellation})`;
    const font = m.isEquinox ? 'bold 10.5px system-ui, sans-serif' : 'bold 9.5px system-ui, sans-serif';
    const textColor = isGold ? '#fef08a' : '#ffffff';

    drawCrispText(ctx, mainText, mx, my, font, textColor, '#000000', 3.5);
    ctx.restore();
  });

  ctx.restore();
}

export default drawHebrewMazalot;