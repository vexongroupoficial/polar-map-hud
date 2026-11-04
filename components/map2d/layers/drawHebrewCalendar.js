// components/map2d/layers/drawHebrewCalendar.js

// 📜 RUEDA INTERNA: MESES HEBREOS (Alineados exactamente con Equinoccios 0° / 180°)
// Nisán (0° - 30°), Siván (60° - 90°), Av (120° - 150°), Tishrei (180° - 210°), Kislev (240° - 270°), Shevat (300° - 330°)
export const HEBREW_MONTHS_DATA = [
  { sector: 1, degStart: 0, degEnd: 30, hebrewName: 'Nisán (נִיסָן)', tribu: 'Judá', gregorianSpan: '15 Mar ↔ 15 Abr', isEquinox: true, goldBorder: true },
  { sector: 2, degStart: 30, degEnd: 60, hebrewName: 'Iyar (אִיָּר)', tribu: 'Isacar', gregorianSpan: '15 Abr ↔ 15 May', isEquinox: false, goldBorder: false },
  { sector: 3, degStart: 60, degEnd: 90, hebrewName: 'Siván (סִיוָן)', tribu: 'Zabulón', gregorianSpan: '15 May ↔ 15 Jun', isEquinox: false, goldBorder: true },
  { sector: 4, degStart: 90, degEnd: 120, hebrewName: 'Tamuz (תַּמּוּז)', tribu: 'Rubén', gregorianSpan: '15 Jun ↔ 15 Jul', isEquinox: false, goldBorder: false },
  { sector: 5, degStart: 120, degEnd: 150, hebrewName: 'Av (אָב)', tribu: 'Simeón', gregorianSpan: '15 Jul ↔ 15 Ago', isEquinox: false, goldBorder: true },
  { sector: 6, degStart: 150, degEnd: 180, hebrewName: 'Elul (אֱלוּל)', tribu: 'Gad', gregorianSpan: '15 Ago ↔ 15 Sep', isEquinox: false, goldBorder: false },
  { sector: 7, degStart: 180, degEnd: 210, hebrewName: 'Tishrei (תִּשְׁרֵי)', tribu: 'Efraín', gregorianSpan: '15 Sep ↔ 15 Oct', isEquinox: true, goldBorder: true },
  { sector: 8, degStart: 210, degEnd: 240, hebrewName: 'Jeshván (חֶשְׁוָן)', tribu: 'Manasés', gregorianSpan: '15 Oct ↔ 15 Nov', isEquinox: false, goldBorder: false },
  { sector: 9, degStart: 240, degEnd: 270, hebrewName: 'Kislev (כִּסְלֵו)', tribu: 'Benjamín', gregorianSpan: '15 Nov ↔ 15 Dic', isEquinox: false, goldBorder: true },
  { sector: 10, degStart: 270, degEnd: 300, hebrewName: 'Tevet (טֵבֵת)', tribu: 'Dan', gregorianSpan: '15 Dic ↔ 15 Ene', isEquinox: false, goldBorder: false },
  { sector: 11, degStart: 300, degEnd: 330, hebrewName: 'Shevat (שְׁבָט)', tribu: 'Aser', gregorianSpan: '15 Ene ↔ 15 Feb', isEquinox: false, goldBorder: true },
  { sector: 12, degStart: 330, degEnd: 360, hebrewName: 'Adar (אֲדָר)', tribu: 'Neftalí', gregorianSpan: '15 Feb ↔ 15 Mar', isEquinox: false, goldBorder: false }
];

// 🏛️ RUEDA EXTERNA: MESES GRECORROMANOS (Sincronizados con el ciclo solar)
export const GREGORIAN_MONTHS_DATA = [
  { name: 'MARZO', degStart: 340, degEnd: 10 },
  { name: 'ABRIL', degStart: 10, degEnd: 40 },
  { name: 'MAYO', degStart: 40, degEnd: 70 },
  { name: 'JUNIO', degStart: 70, degEnd: 100 },
  { name: 'JULIO', degStart: 100, degEnd: 130 },
  { name: 'AGOSTO', degStart: 130, degEnd: 160 },
  { name: 'SEPTIEMBRE', degStart: 160, degEnd: 190 },
  { name: 'OCTUBRE', degStart: 190, degEnd: 220 },
  { name: 'NOVIEMBRE', degStart: 220, degEnd: 250 },
  { name: 'DICIEMBRE', degStart: 250, degEnd: 280 },
  { name: 'ENERO', degStart: 280, degEnd: 310 },
  { name: 'FEBRERO', degStart: 310, degEnd: 340 }
];

// 🕯️ CATÁLOGO DE FIESTAS Y FIESTAS LITÚRGICAS (Ángulos calculados por día de mes)
export const ALL_FEASTS_DATA = [
  // Fiestas de Primavera (Nisán 0° - 30°)
  { id: 'pesach', title: '14 NISÁN: PÉSAJ', subtitle: '31 MARZO / 01 ABRIL', deg: 13, radMult: 0.84, color: '#fbbf24' },
  { id: 'matzot', title: '15-21 NISÁN: MATZOT', subtitle: 'PANES SIN LEVADURA', deg: 18, radMult: 0.70, color: '#f59e0b' },
  { id: 'bikkurim', title: '16 NISÁN: PRIMICIAS', subtitle: 'BIKKURIM (02 ABRIL)', deg: 23, radMult: 0.56, color: '#34d399' },
  
  // Pentecostés (Siván 60° - 90°)
  { id: 'shavuot', title: '15 SIVÁN: SHAVUOT', subtitle: '15 JUNIO', deg: 75, radMult: 0.76, color: '#38bdf8' },

  // Fiesta de Verano (Av 120° - 150°) 🍇
  { id: 'tu_bav', title: "15 AV: TU B'AV", subtitle: 'DÍA DEL AMOR (01 AGO)', deg: 135, radMult: 0.76, color: '#f472b6' },

  // Fiestas de Otoño (Tishrei 180° - 210°)
  { id: 'rosh_hashana', title: '01 TISHREI: ROSH HASHANÁ', subtitle: '15 SEPTIEMBRE', deg: 180, radMult: 0.84, color: '#fbbf24' },
  { id: 'yom_kippur', title: '10 TISHREI: YOM KIPPUR', subtitle: '25 SEPTIEMBRE', deg: 189, radMult: 0.70, color: '#c084fc' },
  { id: 'sukkot', title: '15 TISHREI: SUKKOT', subtitle: '31 SEP / 01 OCT', deg: 195, radMult: 0.56, color: '#f43f5e' },

  // Fiestas de Invierno (Kislev, Shevat, Adar)
  { id: 'hanukkah', title: '25 KISLEV: JANUCÁ', subtitle: '11 DICIEMBRE', deg: 264, radMult: 0.76, color: '#38bdf8' },
  { id: 'tu_bishvat', title: '15 SHEVAT: TU BISHVAT', subtitle: 'AÑO NUEVO ÁRBOLES (01 FEB)', deg: 314, radMult: 0.76, color: '#4ade80' }, // 🌳
  { id: 'purim', title: '14 ADAR: PURIM', subtitle: '28 FEB / 01 MARZO', deg: 344, radMult: 0.76, color: '#34d399' }
];


// 🎨 Renderizado de texto ultra-nítido: Relleno Blanco (#ffffff) con Contorno Negro (#000000)
function drawCrispText(
  ctx,
  text,
  x,
  y,
  font = 'bold 11px system-ui, sans-serif',
  color = '#ffffff',
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
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Dibujado de arcos de sector (Bandas circulares)
function drawRingSector(ctx, centerX, centerY, rInner, rOuter, degStart, degEnd, baseRotationRad, fillColor, strokeColor, lineWidth = 1) {
  const radStart = Math.PI + (degStart * Math.PI) / 180 + baseRotationRad;
  let normalizedEnd = degEnd < degStart ? degEnd + 360 : degEnd;
  const radEnd = Math.PI + (normalizedEnd * Math.PI) / 180 + baseRotationRad;

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

export function drawHebrewCalendar(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, animTime, isNeon;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 0;
    animTime = isNeonParam || 0;
    isNeon = true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    animTime = animTimeOrNeon;
    isNeon = isNeonParam;
  }

  const isEnabled =
    activeLayers?.hebrewCalendar ||
    activeLayers?.calendarioHebreo ||
    activeLayers?.biblicalCalendar ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;

  // Radios concéntricos de alta legibilidad
  const rInnerHebrew = mapRadius * 0.97;
  const rOuterHebrew = mapRadius * 1.10;
  const rMidHebrew = mapRadius * 1.035;

  const rInnerGreg = mapRadius * 1.115;
  const rOuterGreg = mapRadius * 1.21;
  const rMidGreg = mapRadius * 1.162;

  // =========================================================================
  // 1. RUEDA EXTERNA: MESES GRECORROMANOS
  // =========================================================================
  GREGORIAN_MONTHS_DATA.forEach((gMonth) => {
    drawRingSector(
      ctx,
      centerX,
      centerY,
      rInnerGreg,
      rOuterGreg,
      gMonth.degStart,
      gMonth.degEnd,
      baseRotationRad,
      'rgba(2, 6, 23, 0.92)',
      'rgba(56, 189, 248, 0.55)',
      1.2
    );

    let midDeg = gMonth.degStart + 15;
    const midRad = Math.PI + (midDeg * Math.PI) / 180 + baseRotationRad;
    const gx = centerX + Math.cos(midRad) * rMidGreg;
    const gy = centerY + Math.sin(midRad) * rMidGreg;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (isNeon) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 5;
    }
    drawCrispText(ctx, gMonth.name, gx, gy, 'bold 10.5px system-ui, sans-serif', '#ffffff', '#000000', 3.5);
    ctx.restore();
  });

  // =========================================================================
  // 2. RUEDA INTERNA: MESES HEBREOS (BORDE DORADO ALTERNADO)
  // =========================================================================
  HEBREW_MONTHS_DATA.forEach((month) => {
    const isEquinox = month.isEquinox;
    const isGold = month.goldBorder;

    const fillColor = isEquinox ? 'rgba(15, 23, 42, 0.96)' : 'rgba(2, 6, 23, 0.92)';
    const strokeColor = isGold ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)';

    drawRingSector(
      ctx,
      centerX,
      centerY,
      rInnerHebrew,
      rOuterHebrew,
      month.degStart,
      month.degEnd,
      baseRotationRad,
      fillColor,
      strokeColor,
      isGold ? 2.0 : 1.0
    );

    const midDeg = month.degStart + 15;
    const midRad = Math.PI + (midDeg * Math.PI) / 180 + baseRotationRad;
    const hx = centerX + Math.cos(midRad) * rMidHebrew;
    const hy = centerY + Math.sin(midRad) * rMidHebrew;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainFont = isEquinox ? 'bold 11px system-ui, sans-serif' : 'bold 10px system-ui, sans-serif';
    const mainColor = '#ffffff';
    
    if (isNeon && isGold) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 7;
    }
    drawCrispText(ctx, `${month.hebrewName} | ${month.tribu}`, hx, hy - 5, mainFont, mainColor, '#000000', 3.5);

    const subColor = isGold ? '#fef08a' : '#cbd5e1';
    drawCrispText(ctx, `[${month.gregorianSpan}]`, hx, hy + 6, '500 9px system-ui, sans-serif', subColor, '#000000', 3.0);
    ctx.restore();
  });

  // =========================================================================
  // 3. EJE HORIZONTAL DE EQUINOCCIOS (0° - 180° / PRIMAVERA - OTOÑO)
  // =========================================================================
  const rad0 = Math.PI + baseRotationRad;         // 0° (Derecha / Nisán)
  const rad180 = (2 * Math.PI) + baseRotationRad; // 180° (Izquierda / Tishrei)

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX + Math.cos(rad0) * (rOuterGreg + 6), centerY + Math.sin(rad0) * (rOuterGreg + 6));
  ctx.lineTo(centerX + Math.cos(rad180) * (rOuterGreg + 6), centerY + Math.sin(rad180) * (rOuterGreg + 6));
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.0;
  if (isNeon) {
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  // Rótulos de Equinoccios (Letras Blancas con Contorno Negro)
  const x0 = centerX + Math.cos(rad0) * (rOuterGreg + 10);
  const y0 = centerY + Math.sin(rad0) * (rOuterGreg + 10);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  drawCrispText(ctx, '🌸 EQUINOCCIO PRIMAVERA (0°) • NISÁN 01', x0 + 8, y0 - 12, 'bold 11px system-ui, sans-serif', '#ffffff', '#000000', 4.0);

  const x180 = centerX + Math.cos(rad180) * (rOuterGreg + 10);
  const y180 = centerY + Math.sin(rad180) * (rOuterGreg + 10);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  drawCrispText(ctx, '🍁 EQUINOCCIO OTOÑO (180°) • TISHREI 01', x180 - 8, y180 - 12, 'bold 11px system-ui, sans-serif', '#ffffff', '#000000', 4.0);
  ctx.restore();

  // =========================================================================
  // 4. EJE VERTICAL DE SOLSTICIOS (90° - 270° / VERANO - INVIERNO)
  // =========================================================================
  const rad90 = Math.PI + (90 * Math.PI) / 180 + baseRotationRad;   // 90° (Abajo / Tamuz)
  const rad270 = Math.PI + (270 * Math.PI) / 180 + baseRotationRad; // 270° (Arriba / Tevet)

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX + Math.cos(rad90) * (rOuterGreg + 6), centerY + Math.sin(rad90) * (rOuterGreg + 6));
  ctx.lineTo(centerX + Math.cos(rad270) * (rOuterGreg + 6), centerY + Math.sin(rad270) * (rOuterGreg + 6));
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
  }
  ctx.stroke();

  // Solsticio de Verano (90°)
  const x90 = centerX + Math.cos(rad90) * (rOuterGreg + 10);
  const y90 = centerY + Math.sin(rad90) * (rOuterGreg + 10);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  drawCrispText(ctx, '☀️ SOLSTICIO DE VERANO (90°) • TAMUZ 01', x90, y90 + 6, 'bold 10.5px system-ui, sans-serif', '#ffffff', '#000000', 3.8);
  drawCrispText(ctx, '[DÍA MÁS LARGO EN H. NORTE]', x90, y90 + 20, '500 8.5px system-ui, sans-serif', '#7dd3fc', '#000000', 2.8);

  // Solsticio de Invierno (270°)
  const x270 = centerX + Math.cos(rad270) * (rOuterGreg + 10);
  const y270 = centerY + Math.sin(rad270) * (rOuterGreg + 10);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  drawCrispText(ctx, '❄️ SOLSTICIO DE INVIERNO (270°) • TEVET 01', x270, y270 - 20, 'bold 10.5px system-ui, sans-serif', '#ffffff', '#000000', 3.8);
  drawCrispText(ctx, '[NOCHE MÁS LARGA EN H. NORTE]', x270, y270 - 6, '500 8.5px system-ui, sans-serif', '#cffafe', '#000000', 2.8);
  ctx.restore();

  // =========================================================================
  // 5. INSIGNIAS HUD DE TODAS LAS FIESTAS DENTRO DEL MAPA
  // =========================================================================
  ALL_FEASTS_DATA.forEach((feast) => {
    const fRad = Math.PI + (feast.deg * Math.PI) / 180 + baseRotationRad;
    const innerRadius = mapRadius * feast.radMult;
    const fx = centerX + Math.cos(fRad) * innerRadius;
    const fy = centerY + Math.sin(fRad) * innerRadius;

    const dotX = centerX + Math.cos(fRad) * rInnerHebrew;
    const dotY = centerY + Math.sin(fRad) * rInnerHebrew;

    // Línea conector punteada
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.lineTo(fx, fy);
    ctx.strokeStyle = feast.color;
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 3]);
    ctx.stroke();

    // Punto origen neón
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = feast.color;
    if (isNeon) {
      ctx.shadowColor = feast.color;
      ctx.shadowBlur = 6;
    }
    ctx.fill();

    // Tarjeta HUD Interior
    ctx.font = 'bold 10.5px system-ui, sans-serif';
    const text1 = feast.title;
    const text2 = feast.subtitle;

    const w1 = ctx.measureText(text1).width;
    ctx.font = '500 9px system-ui, sans-serif';
    const w2 = ctx.measureText(text2).width;

    const boxW = Math.max(w1, w2) + 16;
    const boxH = 28;

    ctx.fillStyle = 'rgba(10, 15, 30, 0.95)';
    ctx.strokeStyle = feast.color;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.roundRect(fx - boxW / 2, fy - boxH / 2, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    drawCrispText(ctx, text1, fx, fy - 5, 'bold 10px system-ui, sans-serif', '#ffffff', '#000000', 3.2);
    drawCrispText(ctx, text2, fx, fy + 6, '500 9px system-ui, sans-serif', feast.color, '#000000', 2.8);

    ctx.restore();
  });

  ctx.restore();
}

export default drawHebrewCalendar;