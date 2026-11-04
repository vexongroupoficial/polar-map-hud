// components/map2d/layers/drawHebrewShabbat.js

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

// Generación de los ~52 Shabbats semanales distribuidos en los 360° del año lunisolar
const SHABBAT_EVENTS = Array.from({ length: 52 }, (_, i) => {
  const deg = (i * (360 / 52)).toFixed(2);
  const weekNum = i + 1;
  return {
    deg: parseFloat(deg),
    label: `SHABBAT N° ${weekNum}`,
    isHighShabbat: false
  };
});

// Adición de los Shabbats Festivos Especiales (Levítico 23)
const HIGH_SHABBATS = [
  { deg: 15, label: '🕯️ HIGH SHABBAT: 15 NISÁN (MATZOT)', isHighShabbat: true },
  { deg: 21, label: '🕯️ HIGH SHABBAT: 21 NISÁN (MATZOT)', isHighShabbat: true },
  { deg: 65, label: '📜 HIGH SHABBAT: 6 SIVÁN (SHAVUOT)', isHighShabbat: true },
  { deg: 180, label: '📯 HIGH SHABBAT: 1 TISHREI (TERUÁH)', isHighShabbat: true },
  { deg: 190, label: '⚖️ HIGH SHABBAT: 10 TISHREI (KIPPUR)', isHighShabbat: true },
  { deg: 195, label: '⛺ HIGH SHABBAT: 15 TISHREI (SUKKOT)', isHighShabbat: true },
  { deg: 202, label: '👑 HIGH SHABBAT: 22 TISHREI (SHMINI ATZERET)', isHighShabbat: true }
];

export function drawHebrewShabbat(
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
    activeLayers?.hebrewShabbat ||
    activeLayers?.shabbat ||
    activeLayers?.sabadosBiblicos ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const time = typeof animTime === 'number' ? animTime : Date.now() * 0.001;
  const baseRotationRad = (rotation * Math.PI) / 180;
  const pulseOpacity = 0.5 + Math.sin(time * 2) * 0.2; // Pulso armónico tenue

  // =========================================================================
  // 1. DIBUJADO DE SHABBATS SEMANALES (52 RAYOS RADIALES DESDE EL CENTRO)
  // =========================================================================
  SHABBAT_EVENTS.forEach((shabbat) => {
    // Ángulo desde el Naciente (Izquierda) en sentido horario
    const angleRad = Math.PI + (shabbat.deg * Math.PI) / 180 + baseRotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const endX = centerX + cosA * (mapRadius * 0.88);
    const endY = centerY + sinA * (mapRadius * 0.88);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); // Nace en Polaris (0,0)
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = `rgba(253, 224, 71, ${pulseOpacity * 0.45})`; // Dorado translúcido
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 4]);

    if (isNeon) {
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 4;
    }
    ctx.stroke();
    ctx.restore();
  });

  // =========================================================================
  // 2. DIBUJADO DE SHABBATS FESTIVOS ESPECIALES (HIGH SHABBATS DESTACADOS)
  // =========================================================================
  HIGH_SHABBATS.forEach((highShabbat) => {
    const angleRad = Math.PI + (highShabbat.deg * Math.PI) / 180 + baseRotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const endX = centerX + cosA * (mapRadius * 0.92);
    const endY = centerY + sinA * (mapRadius * 0.92);

    // Vector Rayo Dorado Neón Fuerte
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;

    if (isNeon) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();

    // Badge HUD Informativo en la punta del vector
    const labelX = centerX + cosA * (mapRadius * 0.78);
    const labelY = centerY + sinA * (mapRadius * 0.78);

    ctx.font = 'bold 8px monospace';
    const textWidth = ctx.measureText(highShabbat.label).width;
    const boxW = textWidth + 10;
    const boxH = 14;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(labelX - boxW / 2, labelY - boxH / 2, boxW, boxH, 3);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    drawTextWithOutline(ctx, highShabbat.label, labelX, labelY + 0.5, '#020617', 2.5);

    ctx.restore();
  });

  ctx.restore();
}

export default drawHebrewShabbat;