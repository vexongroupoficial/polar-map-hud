// components/map2d/layers/drawZodiacDecans.js

const ZODIAC_SIGNS = [
  { name: 'ARIES', symbol: '♈', startDeg: 0, color: '#ef4444' },
  { name: 'TAURO', symbol: '♉', startDeg: 30, color: '#10b981' },
  { name: 'GÉMINIS', symbol: '♊', startDeg: 60, color: '#facc15' },
  { name: 'CÁNCER', symbol: '♋', startDeg: 90, color: '#38bdf8' },
  { name: 'LEO', symbol: '♌', startDeg: 120, color: '#f97316' },
  { name: 'VIRGO', symbol: '♍', startDeg: 150, color: '#84cc16' },
  { name: 'LIBRA', symbol: '♎', startDeg: 180, color: '#a855f7' },
  { name: 'ESCORPIO', symbol: '♏', startDeg: 210, color: '#ec4899' },
  { name: 'SAGITARIO', symbol: '♐', startDeg: 240, color: '#6366f1' },
  { name: 'CAPRICORNIO', symbol: '♑', startDeg: 270, color: '#64748b' },
  { name: 'ACUARIO', symbol: '♒', startDeg: 300, color: '#06b6d4' },
  { name: 'PISCIS', symbol: '♓', startDeg: 330, color: '#3b82f6' }
];

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawZodiacDecans(
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

  const showZodiac =
    activeLayers?.zodiacDecans ||
    activeLayers?.zodiac ||
    activeLayers?.decanatosZodiacales ||
    false;

  if (!showZodiac) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const rotationRad = ((rotation || 180) * Math.PI) / 180;
  const outerR = mapRadius * 0.96;
  const innerR = mapRadius * 0.88;

  // 1. Corona Perimetral del Zodíaco
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? 'rgba(168, 85, 247, 0.5)' : 'rgba(147, 51, 234, 0.3)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // 2. Trazado de los 36 Decanatos (Cada 10°) y 12 Signos (Cada 30°)
  for (let deg = 0; deg < 360; deg += 10) {
    const angleRad = (deg * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const isSignBoundary = deg % 30 === 0;

    const xStart = centerX + cosA * (isSignBoundary ? mapRadius * 0.2 : innerR);
    const yStart = centerY + sinA * (isSignBoundary ? mapRadius * 0.2 : innerR);
    const xEnd = centerX + cosA * outerR;
    const yEnd = centerY + sinA * outerR;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = isSignBoundary 
      ? (isNeon ? '#a855f7' : '#7e22ce')
      : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = isSignBoundary ? 1.4 : 0.7;
    ctx.setLineDash(isSignBoundary ? [] : [3, 3]);

    if (isNeon && isSignBoundary) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 6;
    }
    ctx.stroke();
    ctx.restore();

    // Rótulo del número de Decanato (1 a 36)
    const decanIndex = Math.floor(deg / 10) + 1;
    const midAngle = ((deg + 5) * Math.PI) / 180 + rotationRad;
    const decanTx = centerX + Math.cos(midAngle) * ((innerR + outerR) / 2);
    const decanTy = centerY + Math.sin(midAngle) * ((innerR + outerR) / 2);

    ctx.save();
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, `D${decanIndex}`, decanTx, decanTy, '#020617', 2.5);
    ctx.restore();
  }

  // 3. Rótulos de los 12 Signos Zodiacales
  ZODIAC_SIGNS.forEach((sign) => {
    const midSignDeg = sign.startDeg + 15;
    const signAngleRad = (midSignDeg * Math.PI) / 180 + rotationRad;
    const labelDist = mapRadius * 0.84;

    const lx = centerX + Math.cos(signAngleRad) * labelDist;
    const ly = centerY + Math.sin(signAngleRad) * labelDist;

    ctx.save();
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, `${sign.symbol} ${sign.name}`, lx, ly, '#020617', 3.8);

    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = sign.color;
    drawTextWithOutline(ctx, `${sign.startDeg}°-${sign.startDeg + 30}°`, lx, ly + 9, '#020617', 2.5);

    ctx.restore();
  });

  ctx.restore();
}