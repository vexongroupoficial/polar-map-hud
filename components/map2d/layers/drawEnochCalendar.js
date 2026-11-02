// components/map2d/layers/drawEnochCalendar.js
import { ENOCH_GATES, ENOCH_CALENDAR_SECTORS } from '@/lib/enochData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

// 🧮 Cálculo matemático del Tránsito Solar de Enoc por Día (1 a 364)
function getEnochSunState(enochDay) {
  const day = ((enochDay - 1) % 364) + 1; // Rango 1 - 364 días
  const angleDeg = ((day - 1) / 364) * 360;

  let latitude = 0;
  // Oscilación exacta de Latitud entre Trópico de Cáncer (+23.44°) y Capricornio (-23.44°)
  if (day <= 91) {
    // Primavera: Puerta 4 (Ecuador 0°) ➔ Puerta 6 (Cáncer +23.44°)
    latitude = (day / 91) * 23.44;
  } else if (day <= 182) {
    // Verano: Puerta 6 (Cáncer +23.44°) ➔ Puerta 4 (Ecuador 0°)
    latitude = 23.44 - ((day - 91) / 91) * 23.44;
  } else if (day <= 273) {
    // Otoño: Puerta 4 (Ecuador 0°) ➔ Puerta 1 (Capricornio -23.44°)
    latitude = -((day - 182) / 91) * 23.44;
  } else {
    // Invierno: Puerta 1 (Capricornio -23.44°) ➔ Puerta 4 (Ecuador 0°)
    latitude = -23.44 + ((day - 273) / 91) * 23.44;
  }

  // Mapeo mensual estricto de las 6 Puertas según Enoc (30 días por mes)
  const month = Math.floor((day - 1) / 30.33) + 1;
  const gateMapping = [4, 5, 6, 6, 5, 4, 4, 3, 2, 1, 2, 3];
  const gateNumber = gateMapping[Math.min(Math.max(month - 1, 0), 11)];

  return { day, angleDeg, latitude, gateNumber, month };
}

export function drawEnochCalendar(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
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
    rotation = animTimeOrNeon || 180;
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

  const showEnoch =
    activeLayers?.enochCalendar ||
    activeLayers?.enoch ||
    activeLayers?.calendarioEnoc ||
    false;

  if (!showEnoch) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;
  const rotationRad = ((rotation || 180) * Math.PI) / 180;

  const outerR = mapRadius * 0.95;
  const innerR = mapRadius * 0.88;

  // -------------------------------------------------------------
  // 1. ANILLO PERIMETRAL DE LAS 4 ESTACIONES (91 DÍAS / TEKUFOT)
  // -------------------------------------------------------------
  ENOCH_CALENDAR_SECTORS.forEach((sector) => {
    const startAngleRad = ((sector.startDeg + 180) * Math.PI) / 180 + rotationRad;
    const endAngleRad = ((sector.endDeg + 180) * Math.PI) / 180 + rotationRad;
    const midAngleRad = (startAngleRad + endAngleRad) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerR, startAngleRad, endAngleRad, false);
    ctx.arc(centerX, centerY, innerR, endAngleRad, startAngleRad, true);
    ctx.closePath();

    ctx.fillStyle = `${sector.color}22`;
    ctx.fill();

    ctx.strokeStyle = sector.color;
    ctx.lineWidth = 1.2;
    if (isNeon) {
      ctx.shadowColor = sector.color;
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();

    // Textos de las Estaciones
    const textRadius = (innerR + outerR) / 2;
    const tx = centerX + Math.cos(midAngleRad) * textRadius;
    const ty = centerY + Math.sin(midAngleRad) * textRadius;

    ctx.save();
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, sector.name, tx, ty - 4, '#020617', 3.0);

    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = sector.color;
    drawTextWithOutline(ctx, sector.gateText, tx, ty + 5, '#020617', 2.5);
    ctx.restore();
  });

  // -------------------------------------------------------------
  // 2. RUTAS DE LAS 6 PUERTAS SOLARES CONCÉNTRICAS (ENOCH P1 - P6)
  // -------------------------------------------------------------
  ENOCH_GATES.forEach((gate) => {
    const gateR = mapRadius * gate.relRadius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, gateR, 0, Math.PI * 2);
    ctx.strokeStyle = gate.color;
    ctx.lineWidth = gate.gate === 4 || gate.gate === 1 || gate.gate === 6 ? 1.5 : 0.8;
    ctx.setLineDash(gate.gate === 4 ? [] : [4, 4]);

    if (isNeon) {
      ctx.shadowColor = gate.color;
      ctx.shadowBlur = 6;
    }
    ctx.stroke();

    // Etiqueta P1 a P6 cerca del Ascendente (izquierda)
    const labelAngleRad = Math.PI + rotationRad - 0.08;
    const lx = centerX + Math.cos(labelAngleRad) * gateR;
    const ly = centerY + Math.sin(labelAngleRad) * gateR;

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = gate.color;
    ctx.textAlign = 'right';
    drawTextWithOutline(ctx, `P${gate.gate}`, lx - 4, ly, '#020617', 2.5);
    ctx.restore();
  });

  // -------------------------------------------------------------
  // 3. MOVIMIENTO FLUIDO Y PAUSADO DEL SOL (120 SEGUNDOS POR AÑO)
  // -------------------------------------------------------------
  // 🕒 Duración de 1 año (364 días) = 120 segundos reales para lectura cómoda
  const cycleSeconds = 120;
  const currentEnochDay = Math.floor(((timeSec % cycleSeconds) / cycleSeconds) * 364) + 1;
  const sunState = getEnochSunState(currentEnochDay);

  // Conversión de latitud (-23.44° a +23.44°) a radio polar continuo
  const sunRadiusRatio = 0.65 - (sunState.latitude / 23.44) * 0.20;
  const sunRadius = mapRadius * sunRadiusRatio;

  // Ángulo azimutal desfasado +180° para iniciar en la Casa I (Ascendente a la izquierda)
  const sunAngleRad = ((sunState.angleDeg + 180) * Math.PI) / 180 + rotationRad;
  const sunX = centerX + Math.cos(sunAngleRad) * sunRadius;
  const sunY = centerY + Math.sin(sunAngleRad) * sunRadius;

  // Render del Orbe Solar Neón
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sunX, sunY, 7.0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  if (isNeon) {
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 20;
  }
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 4. INSIGNIA HUD DE NAVEGACIÓN SOLAR 100% LEGIBLE
  // -------------------------------------------------------------
  const gateInfo = ENOCH_GATES.find((g) => g.gate === sunState.gateNumber) || ENOCH_GATES[3];

  ctx.save();
  const hudW = 140;
  const hudH = 36;

  // Posicionar la tarjeta desfasada radialmente hacia afuera del Sol
  const hudAngle = sunAngleRad + 0.20;
  const hudX = sunX + Math.cos(hudAngle) * 55;
  const hudY = sunY + Math.sin(hudAngle) * 55;

  // Línea conector neón sutil
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(hudX, hudY);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([2, 2]);
  ctx.stroke();

  // Caja HUD
  const rectX = hudX - hudW / 2;
  const rectY = hudY - hudH / 2;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
  ctx.strokeStyle = gateInfo.color || '#ef4444';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(rectX, rectY, hudW, hudH, 4);
  ctx.fill();
  ctx.stroke();

  // Textos Tácticos con contraste
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, `SOL ENOC • DÍA ${sunState.day} / 364`, hudX, rectY + 8, '#020617', 3.0);

  ctx.font = 'bold 7.5px monospace';
  ctx.fillStyle = gateInfo.color || '#ef4444';
  drawTextWithOutline(
    ctx,
    `PUERTA ${sunState.gateNumber} • LAT: ${sunState.latitude >= 0 ? '+' : ''}${sunState.latitude.toFixed(1)}°`,
    hudX,
    rectY + 18,
    '#020617',
    2.5
  );

  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = '#94a3b8';
  drawTextWithOutline(
    ctx,
    (gateInfo?.name || 'PUERTA SOLAR').toUpperCase(),
    hudX,
    rectY + 28,
    '#020617',
    2.0
  );

  ctx.restore();

  // -------------------------------------------------------------
  // 5. MARCADOR DEL EQUINOCCIO DE PRIMAVERA (0° ASCENDENTE - IZQUIERDA)
  // -------------------------------------------------------------
  const springAngleRad = Math.PI + rotationRad;
  const springX = centerX + Math.cos(springAngleRad) * (mapRadius * 0.94);
  const springY = centerY + Math.sin(springAngleRad) * (mapRadius * 0.94);

  ctx.save();
  ctx.beginPath();
  ctx.arc(springX, springY, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  if (isNeon) {
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
  }
  ctx.fill();

  ctx.font = 'bold 8.5px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, '🌸 EQUINOCCIO DÍA 1 (PUERTA 4) ◄', springX - 10, springY, '#020617', 3.5);
  ctx.restore();

  ctx.restore();
}

export default drawEnochCalendar;