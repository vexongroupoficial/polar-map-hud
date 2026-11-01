// components/map2d/layers/drawMoonPhases.js
import { latLonToPolar } from '@/lib/polarMath';

const MOON_PHASES = [
  { name: 'LUNA NUEVA', icon: '🌑', minAngle: 0, maxAngle: 22.5 },
  { name: 'CRECIENTE CÓNCAVA', icon: '🌒', minAngle: 22.5, maxAngle: 67.5 },
  { name: 'CUARTO CRECIENTE', icon: '🌓', minAngle: 67.5, maxAngle: 112.5 },
  { name: 'CRECIENTE GIBOSA', icon: '🌔', minAngle: 112.5, maxAngle: 157.5 },
  { name: 'LUNA LLENA', icon: '🌕', minAngle: 157.5, maxAngle: 202.5 },
  { name: 'MENGUANTE GIBOSA', icon: '🌖', minAngle: 202.5, maxAngle: 247.5 },
  { name: 'CUARTO MENGUANTE', icon: '🌗', minAngle: 247.5, maxAngle: 292.5 },
  { name: 'MENGUANTE CÓNCAVA', icon: '🌘', minAngle: 292.5, maxAngle: 337.5 },
];

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function getPositiveCycle(val) {
  return ((val % 1) + 1) % 1;
}

export function drawMoonPhases(
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

  const showMoon =
    activeLayers?.moonPhases ||
    activeLayers?.moon ||
    activeLayers?.fasesDeLaLuna ||
    false;

  if (!showMoon) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  // 1. Simulación del ciclo orbital lunar (29.53 días simulados en tiempo)
  const synodicPeriod = 60; // 60 segundos por ciclo lunar completo en mapa
  const phaseCycle = getPositiveCycle(timeSec / synodicPeriod);
  const phaseAngleDeg = phaseCycle * 360;
  const illumination = Math.round((1 - Math.cos((phaseAngleDeg * Math.PI) / 180)) * 50);

  // Determinar nombre e ícono de la fase activa
  let currentPhase = MOON_PHASES[0];
  for (const phase of MOON_PHASES) {
    if (phaseAngleDeg >= phase.minAngle && phaseAngleDeg < phase.maxAngle) {
      currentPhase = phase;
      break;
    }
  }

  // 2. Posición orbital de la Luna sobre la eclíptica (Plano Ecuatorial / Trópicos)
  const orbitRadius = mapRadius * 0.65;
  const moonAngleRad = (phaseAngleDeg * Math.PI) / 180 + ((rotation || 180) * Math.PI) / 180;

  const moonX = centerX + Math.cos(moonAngleRad) * orbitRadius;
  const moonY = centerY + Math.sin(moonAngleRad) * orbitRadius;

  // Anillo de la Órbita Lunar
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
  ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.restore();

  // 3. Renderizado del Cuerpo Lunar y Sombra de Fase
  const moonSize = 14;
  ctx.save();
  
  // Resplandor neón lunar
  if (isNeon) {
    ctx.shadowColor = '#e2e8f0';
    ctx.shadowBlur = 12;
  }

  // Lado ilumando (Base plateada)
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonSize, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();

  // Sombra terminadora
  ctx.beginPath();
  const shadowTerminator = Math.cos((phaseAngleDeg * Math.PI) / 180);
  ctx.ellipse(
    moonX,
    moonY,
    Math.max(0.1, Math.abs(shadowTerminator) * moonSize),
    moonSize,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = shadowTerminator >= 0 ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 250, 252, 0.85)';
  ctx.fill();

  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 4. Badge HUD con Efemérides Lunares
  const hudX = moonX;
  const hudY = moonY + moonSize + 12;

  ctx.save();
  ctx.font = 'bold 8.5px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  drawTextWithOutline(ctx, `${currentPhase.icon} ${currentPhase.name}`, hudX, hudY, '#020617', 3.5);

  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = '#38bdf8';
  drawTextWithOutline(ctx, `ILUMINACIÓN: ${illumination}% | ÁNGULO: ${Math.round(phaseAngleDeg)}°`, hudX, hudY + 10, '#020617', 2.8);

  ctx.restore();

  ctx.restore();
}