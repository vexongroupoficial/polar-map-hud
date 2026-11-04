// components/map2d/layers/drawHebrewMishmarot.js

// 🏛️ MATRIZ DE LAS 24 GUARDIAS SACERDOLARES (1 Crónicas 24) ASOCIADAS A LAS 12 TRIBUS Y MESES
export const MISHMAROT_DATA = [
  // --- CICLO I: PRIMAVERA Y VERANO (0° a 180°) ---
  { id: 1, name: '1. Jehoiarib', degStart: 0, degEnd: 15, tribe: 'Judá 🦁', month: 'Nisán', cycle: 1, isAbijah: false },
  { id: 2, name: '2. Jedaías', degStart: 15, degEnd: 30, tribe: 'Judá 🦁', month: 'Nisán', cycle: 1, isAbijah: false },
  { id: 3, name: '3. Harim', degStart: 30, degEnd: 45, tribe: 'Isacar 📜', month: 'Iyar', cycle: 1, isAbijah: false },
  { id: 4, name: '4. Seorim', degStart: 45, degEnd: 60, tribe: 'Isacar 📜', month: 'Iyar', cycle: 1, isAbijah: false },
  { id: 5, name: '5. Malquías', degStart: 60, degEnd: 75, tribe: 'Zabulón ⛵', month: 'Siván', cycle: 1, isAbijah: false },
  { id: 6, name: '6. Mijamín', degStart: 75, degEnd: 90, tribe: 'Zabulón ⛵', month: 'Siván', cycle: 1, isAbijah: false },
  { id: 7, name: '7. Cos', degStart: 90, degEnd: 105, tribe: 'Rubén 👼', month: 'Tamuz', cycle: 1, isAbijah: false },
  { id: 8, name: '8. ABÍAS (ZACARÍAS)', degStart: 105, degEnd: 120, tribe: 'Rubén 👼', month: 'Tamuz', cycle: 1, isAbijah: true },
  { id: 9, name: '9. Jesúa', degStart: 120, degEnd: 135, tribe: 'Simeón 🗡️', month: 'Av', cycle: 1, isAbijah: false },
  { id: 10, name: '10. Secanías', degStart: 135, degEnd: 150, tribe: 'Simeón 🗡️', month: 'Av', cycle: 1, isAbijah: false },
  { id: 11, name: '11. Eliasib', degStart: 150, degEnd: 165, tribe: 'Gad ⛺', month: 'Elul', cycle: 1, isAbijah: false },
  { id: 12, name: '12. Jaquim', degStart: 165, degEnd: 180, tribe: 'Gad ⛺', month: 'Elul', cycle: 1, isAbijah: false },

  // --- CICLO II: OTOÑO E INVIERNO (180° a 360°) ---
  { id: 13, name: '13. Hupa', degStart: 180, degEnd: 195, tribe: 'Efraín 🐂', month: 'Tishrei', cycle: 2, isAbijah: false },
  { id: 14, name: '14. Jesebeab', degStart: 195, degEnd: 210, tribe: 'Efraín 🐂', month: 'Tishrei', cycle: 2, isAbijah: false },
  { id: 15, name: '15. Bilga', degStart: 210, degEnd: 225, tribe: 'Manasés 🌾', month: 'Jeshván', cycle: 2, isAbijah: false },
  { id: 16, name: '16. Imer', degStart: 225, degEnd: 240, tribe: 'Manasés 🌾', month: 'Jeshván', cycle: 2, isAbijah: false },
  { id: 17, name: '17. Hezir', degStart: 240, degEnd: 255, tribe: 'Benjamín 🐺', month: 'Kislev', cycle: 2, isAbijah: false },
  { id: 18, name: '18. Afses', degStart: 255, degEnd: 270, tribe: 'Benjamín 🐺', month: 'Kislev', cycle: 2, isAbijah: false },
  { id: 19, name: '19. Petafías', degStart: 270, degEnd: 285, tribe: 'Dan 🦅', month: 'Tevet', cycle: 2, isAbijah: false },
  { id: 20, name: '20. Ezequiel', degStart: 285, degEnd: 300, tribe: 'Dan 🦅', month: 'Tevet', cycle: 2, isAbijah: false },
  { id: 21, name: '21. Jaquín', degStart: 300, degEnd: 315, tribe: 'Aser 🫒', month: 'Shevat', cycle: 2, isAbijah: false },
  { id: 22, name: '22. Gamul', degStart: 315, degEnd: 330, tribe: 'Aser 🫒', month: 'Shevat', cycle: 2, isAbijah: false },
  { id: 23, name: '23. Delaía', degStart: 330, degEnd: 345, tribe: 'Neftalí 🦌', month: 'Adar', cycle: 2, isAbijah: false },
  { id: 24, name: '24. Maazías', degStart: 345, degEnd: 360, tribe: 'Neftalí 🦌', month: 'Adar', cycle: 2, isAbijah: false }
];

// 4 NODOS CARDINALES DE TEKUFAH (UBICADOS ESTRICTAMENTE FUERA DEL MAPA)
export const TEKUFAH_NODES = [
  { deg: 0, weekNum: 1, name: 'TEKUFAH NISÁN (0° ESTE)', festival: '🌸 Equinoccio Primavera • Pesaj (S1)', color: '#fbbf24', rFactor: 1.30 },
  { deg: 90, weekNum: 14, name: 'TEKUFAH TAMUZ (90° SUR)', festival: '☀️ Solsticio Verano • Shavuot (S14)', color: '#f87171', rFactor: 1.30 },
  { deg: 180, weekNum: 27, name: 'TEKUFAH TISHREI (180° OESTE)', festival: '🍁 Equinoccio Otoño • Sukkot (S27)', color: '#34d399', rFactor: 1.30 },
  { deg: 270, weekNum: 40, name: 'TEKUFAH TEVET (270° NORTE)', festival: '❄️ Solsticio Invierno • Janucá (S40)', color: '#38bdf8', rFactor: 1.30 }
];

// 🌟 EVENTOS BÍBLICOS MESIÁNICOS (UBICADOS INTERIORMENTE EN EL MAPA CON LIBRO Y VERSÍCULO)
export const MESSIANIC_EVENTS = [
  {
    id: 'abijah_service',
    weekNum: 9,
    deg: 112.5,
    rFactor: 0.58,
    color: '#eab308',
    glowColor: '#facc15',
    title: '⚡ 8ª GUARDIA DE ABÍAS (S9)',
    subtitle: 'Servicio de Zacarías • Tamuz',
    scripture: '📖 Lucas 1:5, 23'
  },
  {
    id: 'visitation_conception',
    weekNum: 40,
    deg: 270,
    rFactor: 0.44,
    color: '#38bdf8',
    glowColor: '#60a5fa',
    title: '✨ VISITACIÓN & CONCEPCIÓN (S40)',
    subtitle: 'Juan salta (Mes 6 Isabel) • Janucá',
    scripture: '📖 Lucas 1:26, 36, 41-44'
  },
  {
    id: 'john_birth',
    weekNum: 1,
    deg: 0,
    rFactor: 0.52,
    color: '#fbbf24',
    glowColor: '#fde047',
    title: '🕊️ NACIMIENTO JUAN BAUTISTA (S1)',
    subtitle: '15 Nisán • Pesaj (Primavera)',
    scripture: '📖 Lucas 1:57 • Mal. 4:5'
  },
  {
    id: 'jesus_birth',
    weekNum: 27,
    deg: 180,
    rFactor: 0.36,
    color: '#34d399',
    glowColor: '#4ade80',
    title: '👑 NACIMIENTO DE YESHUA (S27)',
    subtitle: '15 Tishrei • Sukkot (Otoño)',
    scripture: '📖 Lucas 2:1-7 • Juan 1:14'
  },
  {
    id: 'circumcision',
    weekNum: 28,
    deg: 187.5,
    rFactor: 0.62,
    color: '#f43f5e',
    glowColor: '#fb7185',
    title: '🩸 CIRCUNCISIÓN 8º DÍA (S28)',
    subtitle: '13ª Guardia: Hupa • 22 Tishrei',
    scripture: '📖 Lucas 2:21 • Lev. 12:3'
  },
  {
    id: 'presentation',
    weekNum: 30,
    deg: 235,
    rFactor: 0.55,
    color: '#c084fc',
    glowColor: '#e879f9',
    title: '🏛️ PRESENTACIÓN TEMPLO (S30)',
    subtitle: '16ª Guardia: Imer • Simeón y Ana',
    scripture: '📖 Lucas 2:22-38 • Lev. 12:4'
  },
  {
    id: 'john_beheading',
    weekNum: 51,
    deg: 345,
    rFactor: 0.58,
    color: '#ef4444',
    glowColor: '#f87171',
    title: '⚔️ MARTIRIO DE JUAN (S51)',
    subtitle: 'Finales de Adar (Pre-Pesaj)',
    scripture: '📖 Mateo 14:1-12 • Juan 6:4'
  }
];

// Helper para texto nítido con contorno negro
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
 * Renderiza la Capa Sacerdotal con Eventos Bíblicos (Libro y Versículo) al INTERIOR y Tekufot al EXTERIOR.
 */
export function drawHebrewMishmarot(
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
    activeLayers?.mishmarot ||
    activeLayers?.guardiasSacerdolares ||
    activeLayers?.priestlyOrder ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const baseRotationRad = (rotation * Math.PI) / 180;

  // Escala de Radios Concéntricos Organizada
  const rInnerRay = mapRadius * 0.25;
  const rMishmarInner = mapRadius * 0.78;
  const rMishmarOuter = mapRadius * 0.92;
  const rMishmarMid = mapRadius * 0.85;

  const rWeekRingInner = mapRadius * 0.93;
  const rWeekRingOuter = mapRadius * 1.05;
  const rWeekNumberRadius = mapRadius * 0.99;
  const rOuterRay = mapRadius * 1.25;

  const highlightedWeeks = MESSIANIC_EVENTS.map((e) => e.weekNum);

  // =========================================================================
  // 1. LÍNEAS SEMITRANSPARENTES RADIALES HACIA CADA TURNO (CADA 15°)
  // =========================================================================
  for (let deg = 0; deg < 360; deg += 15) {
    const rad = (deg * Math.PI) / 180 + baseRotationRad;
    const x1 = centerX + Math.cos(rad) * rInnerRay;
    const y1 = centerY + Math.sin(rad) * rInnerRay;
    const x2 = centerX + Math.cos(rad) * rOuterRay;
    const y2 = centerY + Math.sin(rad) * rOuterRay;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = deg % 90 === 0 ? 'rgba(251, 191, 36, 0.50)' : 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = deg % 90 === 0 ? 2.0 : 0.8;
    if (deg % 90 !== 0) ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. RENDERIZADO DE LAS 24 GUARDIAS SACERDOLARES (HORIZONTALES)
  // =========================================================================
  MISHMAROT_DATA.forEach((m) => {
    const radStart = (m.degStart * Math.PI) / 180 + baseRotationRad;
    const radEnd = (m.degEnd * Math.PI) / 180 + baseRotationRad;

    ctx.beginPath();
    ctx.arc(centerX, centerY, rMishmarOuter, radStart, radEnd, false);
    ctx.arc(centerX, centerY, rMishmarInner, radEnd, radStart, true);
    ctx.closePath();

    ctx.fillStyle = m.isAbijah
      ? 'rgba(234, 179, 8, 0.45)'
      : m.cycle === 1
      ? 'rgba(15, 23, 42, 0.94)'
      : 'rgba(30, 41, 59, 0.94)';
    ctx.fill();

    ctx.strokeStyle = m.isAbijah ? '#facc15' : 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = m.isAbijah ? 2.4 : 1.0;
    ctx.stroke();

    const midDeg = m.degStart + 7.5;
    const midRad = (midDeg * Math.PI) / 180 + baseRotationRad;
    const tx = centerX + Math.cos(midRad) * rMishmarMid;
    const ty = centerY + Math.sin(midRad) * rMishmarMid;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainFont = m.isAbijah ? 'bold 10.5px system-ui, sans-serif' : 'bold 9px system-ui, sans-serif';
    const textColor = m.isAbijah ? '#fef08a' : '#ffffff';

    drawCrispText(ctx, m.name, tx, ty - 4, mainFont, textColor, '#000000', 3.8);
    drawCrispText(ctx, `${m.tribe} • ${m.month}`, tx, ty + 6, 'bold 7.5px system-ui, sans-serif', '#93c5fd', '#000000', 2.8);
    ctx.restore();
  });

  // =========================================================================
  // 3. ANILLO DEDICADO DE 52 CELDAS INDIVIDUALES (NUMERACIÓN 1-52)
  // =========================================================================
  const weekStep = 360 / 52;

  for (let w = 0; w < 52; w++) {
    const weekNum = w + 1;
    const wDegStart = w * weekStep;
    const wDegEnd = (w + 1) * weekStep;
    const radStart = (wDegStart * Math.PI) / 180 + baseRotationRad;
    const radEnd = (wDegEnd * Math.PI) / 180 + baseRotationRad;

    const isHighlighted = highlightedWeeks.includes(weekNum);
    const isSolemnTekufah = [1, 14, 27, 40].includes(weekNum);

    ctx.beginPath();
    ctx.arc(centerX, centerY, rWeekRingOuter, radStart, radEnd, false);
    ctx.arc(centerX, centerY, rWeekRingInner, radEnd, radStart, true);
    ctx.closePath();

    ctx.fillStyle = isSolemnTekufah
      ? 'rgba(251, 191, 36, 0.35)'
      : isHighlighted
      ? 'rgba(56, 189, 248, 0.25)'
      : 'rgba(15, 23, 42, 0.85)';
    ctx.fill();

    ctx.strokeStyle = isSolemnTekufah
      ? '#fbbf24'
      : isHighlighted
      ? '#38bdf8'
      : 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = isHighlighted ? 2.0 : 0.9;
    ctx.stroke();

    const midWeekDeg = wDegStart + weekStep / 2;
    const midWeekRad = (midWeekDeg * Math.PI) / 180 + baseRotationRad;
    const nx = centerX + Math.cos(midWeekRad) * rWeekNumberRadius;
    const ny = centerY + Math.sin(midWeekRad) * rWeekNumberRadius;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isSolemnTekufah) {
      drawCrispText(ctx, `S${weekNum}`, nx, ny, 'bold 11px system-ui, sans-serif', '#fbbf24', '#000000', 4.0);
    } else if (isHighlighted) {
      drawCrispText(ctx, `S${weekNum}`, nx, ny, 'bold 10px system-ui, sans-serif', '#38bdf8', '#000000', 3.5);
    } else {
      drawCrispText(ctx, `${weekNum}`, nx, ny, 'bold 8.5px system-ui, monospace', '#cbd5e1', '#000000', 3.0);
    }
    ctx.restore();
  }

  // =========================================================================
  // 4. TEKUFOT HACIA AFUERA DEL MAPA (CONECTORES DE EXTENSIÓN EXTERIORES)
  // =========================================================================
  TEKUFAH_NODES.forEach((tek) => {
    const tRad = (tek.deg * Math.PI) / 180 + baseRotationRad;
    const pinX = centerX + Math.cos(tRad) * rWeekRingOuter;
    const pinY = centerY + Math.sin(tRad) * rWeekRingOuter;

    const boxX = centerX + Math.cos(tRad) * (mapRadius * tek.rFactor);
    const boxY = centerY + Math.sin(tRad) * (mapRadius * tek.rFactor);

    // Puntero neón exterior
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pinX, pinY);
    ctx.lineTo(boxX, boxY);
    ctx.strokeStyle = tek.color;
    ctx.lineWidth = 2.0;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();

    // Tarjeta exterior de Tekufah
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.96)';
    ctx.strokeStyle = tek.color;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = tek.color;
    ctx.shadowBlur = 10;

    const bw = 215;
    const bh = 34;

    ctx.beginPath();
    ctx.roundRect(boxX - bw / 2, boxY - bh / 2, bw, bh, 6);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCrispText(ctx, tek.name, boxX, boxY - 6, 'bold 10.5px system-ui, sans-serif', tek.color, '#000000', 3.8);
    drawCrispText(ctx, tek.festival, boxX, boxY + 7, 'bold 9px system-ui, sans-serif', '#ffffff', '#000000', 3.0);
    ctx.restore();
  });

  // =========================================================================
  // 5. ARCOS SUTILES INTERIORES DE CONEXIÓN CRONOLÓGICA
  // =========================================================================
  const radAbijah = (112.5 * Math.PI) / 180 + baseRotationRad;
  const radVisitation = (270 * Math.PI) / 180 + baseRotationRad;
  const radJohnBirth = (360 * Math.PI) / 180 + baseRotationRad;
  const radJesusBirth = (180 * Math.PI) / 180 + baseRotationRad;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius * 0.44, radAbijah, radVisitation, false);
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius * 0.38, radVisitation, radJohnBirth, false);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius * 0.32, radVisitation, radJesusBirth, true);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2.0;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.restore();

  // =========================================================================
  // 6. EVENTOS BÍBLICOS MESIÁNICOS HACIA ADENTRO DEL MAPA (CON LIBRO Y VERSÍCULO)
  // =========================================================================
  MESSIANIC_EVENTS.forEach((ev) => {
    const evRad = (ev.deg * Math.PI) / 180 + baseRotationRad;

    // Punto sobre el anillo sacerdotal/semanal
    const pinX = centerX + Math.cos(evRad) * rMishmarInner;
    const pinY = centerY + Math.sin(evRad) * rMishmarInner;

    // Ubicación INTERIOR de la tarjeta bíblica
    const cardX = centerX + Math.cos(evRad) * (mapRadius * ev.rFactor);
    const cardY = centerY + Math.sin(evRad) * (mapRadius * ev.rFactor);

    // A. Línea de extensión interior desde el anillo hacia el centro
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pinX, pinY);
    ctx.lineTo(cardX, cardY);
    ctx.strokeStyle = ev.glowColor;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([3, 3]);
    ctx.shadowColor = ev.glowColor;
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Ancla luminosa interior
    ctx.beginPath();
    ctx.arc(pinX, pinY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = ev.glowColor;
    ctx.fill();
    ctx.restore();

    // B. Tarjeta HUD Bíblica Interior con Título, Fecha y Cita Bíblica (Libro + Versículo)
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.96)';
    ctx.strokeStyle = ev.glowColor;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = ev.glowColor;
    ctx.shadowBlur = 10;

    const bw = 230;
    const bh = 42;

    ctx.beginPath();
    ctx.roundRect(cardX - bw / 2, cardY - bh / 2, bw, bh, 6);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Línea 1: Título del Evento
    drawCrispText(ctx, ev.title, cardX, cardY - 11, 'bold 10px system-ui, sans-serif', '#ffffff', '#000000', 3.8);
    // Línea 2: Subtítulo / Mes
    drawCrispText(ctx, ev.subtitle, cardX, cardY, '500 8px system-ui, sans-serif', '#e2e8f0', '#000000', 2.8);
    // Línea 3: Libro y Versículo (Cita Bíblica destacada)
    drawCrispText(ctx, ev.scripture, cardX, cardY + 11, 'bold 9px system-ui, monospace', ev.glowColor, '#000000', 3.2);

    ctx.restore();
  });

  ctx.restore();
}

export const drawMishmarotLayer = drawHebrewMishmarot;
export default drawHebrewMishmarot;