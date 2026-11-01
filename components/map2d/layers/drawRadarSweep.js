// components/map2d/layers/drawRadarSweep.js
import { latLonToPolar } from '@/lib/polarMath';

// Contactos tácticos simulados (Estaciones y puntos de interés geofísico)
const SIMULATED_TARGETS = [
  { id: 'target_1', lat: 78.22, lon: 15.65, name: 'SVALBARD HUD' },
  { id: 'target_2', lat: 35.68, lon: 139.76, name: 'TOKIO RADAR' },
  { id: 'target_3', lat: 25.76, lon: -80.19, name: 'BERMUDA NODE' },
  { id: 'target_4', lat: -33.45, lon: -70.66, name: 'SANTIAGO CHILE' },
  { id: 'target_5', lat: 0.0, lon: 25.0, name: 'EQUATORIAL HUB' },
  { id: 'target_6', lat: -77.85, lon: 166.66, name: 'MCMURDO BASE' },
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

export function playRadarPing(audioCtx) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // Frecuencia alta aguda
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

export function drawRadarSweep(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  // -------------------------------------------------------------
  // NORMALIZACIÓN FLEXIBLE DE ARGUMENTOS
  // -------------------------------------------------------------
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

  // 🛑 EVALUACIÓN COMPLETA DE CLAVES
  const showRadar =
    activeLayers?.radarSweep ||
    activeLayers?.radar ||
    activeLayers?.radarScanner ||
    activeLayers?.escner360 ||
    false;

  if (!showRadar) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  // -------------------------------------------------------------
  // 1. CÍRCULOS DE RANGO TÁCTICO Y RETÍCULA POLAR (2500, 5000, 7500 KM)
  // -------------------------------------------------------------
  const rings = [0.25, 0.5, 0.75, 1.0];
  ctx.save();
  rings.forEach((ratio) => {
    const r = Math.max(0.1, mapRadius * ratio);
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = ratio === 1.0 ? 1.5 : 0.8;
    ctx.setLineDash(ratio === 1.0 ? [] : [4, 4]);

    if (isNeon && ratio === 1.0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();

    // Rótulo de distancia táctica sobre eje vertical
    if (ratio < 1.0) {
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      drawTextWithOutline(ctx, `${Math.round(ratio * 10000)} KM`, centerX + 4, centerY - r, '#020617', 3.0);
    }
  });

  // Ejes Cardinales en Cruz (+ N-S / E-O)
  ctx.beginPath();
  ctx.moveTo(centerX - mapRadius, centerY);
  ctx.lineTo(centerX + mapRadius, centerY);
  ctx.moveTo(centerX, centerY - mapRadius);
  ctx.lineTo(centerX, centerY + mapRadius);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([2, 4]);
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 2. AGUJA DE BARRIDO ROTATORIO 360° Y SECTOR DE ESTELA
  // -------------------------------------------------------------
  const speed = 1.2; // Radianes por segundo
  const currentAngle = getPositiveCycle((timeSec * speed) / (Math.PI * 2)) * Math.PI * 2;
  const trailAngle = Math.PI / 3; // 60 grados de abanico de estela

  // Sector degradado del barrido (Estela luminosa)
  const segments = 25;
  for (let i = 0; i < segments; i++) {
    const stepAngle = currentAngle - (i / segments) * trailAngle;
    const alpha = (1 - i / segments) * 0.22;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      mapRadius,
      stepAngle - trailAngle / segments,
      stepAngle,
      false
    );
    ctx.closePath();
    ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  // Aguja principal de barrido
  const sweepX = centerX + Math.cos(currentAngle) * mapRadius;
  const sweepY = centerY + Math.sin(currentAngle) * mapRadius;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(sweepX, sweepY);
  ctx.strokeStyle = '#38bdf8'; // Cian Neón
  ctx.lineWidth = isNeon ? 2.0 : 1.2;

  if (isNeon) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
  }
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 3. CONTACTOS TÁCTICOS Y DETECCIÓN LUMINOSA AL PASO DEL RADAR
  // -------------------------------------------------------------
  SIMULATED_TARGETS.forEach((target) => {
    const { x, y } = latLonToPolar(target.lat, target.lon, mapRadius, rotation);
    const tx = centerX + x;
    const ty = centerY + y;

    if (Math.hypot(x, y) > mapRadius - 4) return;

    // Ángulo polar del objetivo respecto al centro
    const targetAngle = getPositiveCycle(Math.atan2(y, x) / (Math.PI * 2)) * Math.PI * 2;
    
    // Diferencia angular relativa al barrido actual
    let angleDiff = getPositiveCycle((currentAngle - targetAngle) / (Math.PI * 2)) * Math.PI * 2;

    let pingAlpha = 0.2;
    let pingSize = 2.5;

    if (angleDiff < trailAngle) {
      const factor = 1 - angleDiff / trailAngle;
      pingAlpha = 0.2 + factor * 0.8;
      pingSize = 2.5 + factor * 3.5;
    }

    // Dibujo del punto de contacto
    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty, Math.max(0.1, pingSize), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${pingAlpha})`;

    if (isNeon && pingAlpha > 0.4) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
    }
    ctx.fill();

    // Anillo expansivo de detección
    if (angleDiff < 0.2) {
      ctx.beginPath();
      ctx.arc(tx, ty, 8 * (1 - angleDiff / 0.2), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${1 - angleDiff / 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Rótulo HUD del blanco
    if (pingAlpha > 0.35) {
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff'; // Blanco Puro
      drawTextWithOutline(ctx, target.name, tx, ty + 5, '#020617', 2.8);
    }

    ctx.restore();
  });

  ctx.restore();
}