// components/map2d/layers/drawPrecessionalEras.js
import { PRECESSIONAL_ERAS } from '@/lib/precessionData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 4.0) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawPrecessionalEras(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  selectedYearOrIsNeon = 0
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, animTime, isNeon;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 180;
    animTime = selectedYearOrIsNeon || 0;
    isNeon = true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    animTime = animTimeOrNeon;
    isNeon = true;
  }

  const showEras =
    activeLayers?.precessionalEras ||
    activeLayers?.eras ||
    activeLayers?.erasPrecesionales ||
    false;

  if (!showEras) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // 1. Extraer el año simulado desde activeLayers o el parámetro
  const currentSimYear =
    typeof activeLayers?.simulatedYear === 'number'
      ? activeLayers.simulatedYear
      : typeof activeLayers?.simulatedTime === 'number'
      ? (activeLayers.simulatedTime > 100000 || activeLayers.simulatedTime < -100000
          ? new Date(activeLayers.simulatedTime).getFullYear()
          : activeLayers.simulatedTime)
      : typeof selectedYearOrIsNeon === 'number'
      ? selectedYearOrIsNeon
      : 0;

  // 2. Buscar la era correspondiente en la matriz sincronizada
  const currentEra =
    PRECESSIONAL_ERAS.find(
      (e) => currentSimYear >= e.startYear && currentSimYear < e.endYear
    ) || PRECESSIONAL_ERAS[0];

  const rotationRad = ((rotation || 180) * Math.PI) / 180;

  // 3. Ángulos del sector (Alineado con Ascendente 0° a la izquierda)
  const startAngleRad = ((currentEra.startAngleDeg + 180) * Math.PI) / 180 + rotationRad;
  const endAngleRad = ((currentEra.endAngleDeg + 180) * Math.PI) / 180 + rotationRad;
  const midAngleRad = (startAngleRad + endAngleRad) / 2;

  const beamRadius = mapRadius * 0.96;

  // -------------------------------------------------------------
  // HAZ CONOIDAL DE LA ERA ACTIVA (DEGRADADO NEÓN)
  // -------------------------------------------------------------
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, beamRadius, startAngleRad, endAngleRad, false);
  ctx.closePath();

  const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, beamRadius);
  grad.addColorStop(0, `${currentEra.color}bb`);
  grad.addColorStop(0.5, `${currentEra.color}44`);
  grad.addColorStop(1, `${currentEra.color}05`);

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = currentEra.color;
  ctx.lineWidth = 2.0;
  if (isNeon) {
    ctx.shadowColor = currentEra.color;
    ctx.shadowBlur = 14;
  }
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // VECTOR INDICADOR CENTRAL DEL EQUINOCCIO
  // -------------------------------------------------------------
  const lineX = centerX + Math.cos(midAngleRad) * beamRadius;
  const lineY = centerY + Math.sin(midAngleRad) * beamRadius;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(lineX, lineY);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.0;
  ctx.setLineDash([6, 3]);
  if (isNeon) {
    ctx.shadowColor = currentEra.color;
    ctx.shadowBlur = 10;
  }
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // BADGE TÁCTICO HUD
  // -------------------------------------------------------------
  const badgeDist = mapRadius * 0.68;
  const bx = centerX + Math.cos(midAngleRad) * badgeDist;
  const by = centerY + Math.sin(midAngleRad) * badgeDist;

  ctx.save();
  ctx.font = 'bold 9px monospace';
  const labelText = `${currentEra.symbol} ${currentEra.era} (CASA ${currentEra.house})`;
  const tw = ctx.measureText(labelText).width;

  const boxW = tw + 16;
  const boxH = 24;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
  ctx.strokeStyle = currentEra.color;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.roundRect(bx - boxW / 2, by - boxH / 2, boxW, boxH, 4);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, labelText, bx, by, '#020617', 3.5);

  ctx.restore();
  ctx.restore();
}

export default drawPrecessionalEras;