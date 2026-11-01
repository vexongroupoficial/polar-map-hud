// components/map2d/layers/drawHarmonicAngles.js
import { latLonToPolar } from '@/lib/polarMath';

// Ángulos armónicos clave (en grados) y su importancia proporcional
const HARMONIC_ANGLES = [
  { deg: 0, label: '0° (NORTE)', importance: 'primary' },
  { deg: 30, label: '30° (DODECÁGONO)', importance: 'secondary' },
  { deg: 45, label: '45° (OCTÓGONO)', importance: 'primary' },
  { deg: 60, label: '60° (HEXÁGONO)', importance: 'secondary' },
  { deg: 72, label: '72° (PENTÁGONO / Φ)', importance: 'golden' },
  { deg: 90, label: '90° (CUADRANTE)', importance: 'primary' },
  { deg: 108, label: '108° (ÁNGULO ÁUREO)', importance: 'golden' },
  { deg: 120, label: '120° (TRIGONO)', importance: 'secondary' },
  { deg: 135, label: '135° (OCTÓGONO)', importance: 'secondary' },
  { deg: 144, label: '144° (PENTAGRAMA / Φ)', importance: 'golden' },
  { deg: 180, label: '180° (SUR / OPOSICIÓN)', importance: 'primary' },
  { deg: 216, label: '216° (ARMÓNICO)', importance: 'golden' },
  { deg: 225, label: '225° (OCTÓGONO)', importance: 'secondary' },
  { deg: 240, label: '240° (TRIGONO)', importance: 'secondary' },
  { deg: 270, label: '270° (OESTE)', importance: 'primary' },
  { deg: 288, label: '288° (PENTÁGONO)', importance: 'golden' },
  { deg: 315, label: '315° (OCTÓGONO)', importance: 'secondary' },
  { deg: 330, label: '330° (DODECÁGONO)', importance: 'secondary' },
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

export function drawHarmonicAngles(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true,
  customScaleRatio = 0.92 // 👈 Escala ajustable del anillo armónico (0.5 a 1.0)
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

  // 🛑 EVALUACIÓN FLEXIBLE DE CLAVES DE INTERRUPTOR
  const showHarmonics =
    activeLayers?.harmonicAngles ||
    activeLayers?.sacredGeometry ||
    activeLayers?.angulosArmonicos ||
    activeLayers?.geometriaSagrada ||
    false;

  if (!showHarmonics) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  // -------------------------------------------------------------
  // CONTROL DE TAMAÑO Y RADIO EFECTIVO
  // -------------------------------------------------------------
  const scaleRatio = Math.min(1.0, Math.max(0.3, customScaleRatio));
  const effectiveRadius = mapRadius * scaleRatio;
  const innerRadius = effectiveRadius * 0.15; // Límite del núcleo central

  // -------------------------------------------------------------
  // 1. CÍRCULOS ARMÓNICOS CONCÉNTRICOS Y PROPORCIÓN ÁUREA (Φ)
  // -------------------------------------------------------------
  const phiRatios = [0.382, 0.618, 0.854, 1.0]; // Proporciones derivadas de Phi (Φ)
  
  phiRatios.forEach((ratio) => {
    const r = effectiveRadius * ratio;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);

    ctx.strokeStyle = ratio === 1.0 
      ? (isNeon ? '#38bdf8' : '#0284c7')
      : (isNeon ? 'rgba(168, 85, 247, 0.35)' : 'rgba(147, 51, 234, 0.2)');
    ctx.lineWidth = ratio === 1.0 ? 1.5 : 0.8;
    ctx.setLineDash(ratio === 1.0 ? [] : [4, 4]);

    if (isNeon && ratio === 1.0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.restore();
  });

  // -------------------------------------------------------------
  // 2. RENDEREADO DE VECTORES Y ÁNGULOS ARMÓNICOS
  // -------------------------------------------------------------
  const rotationRad = (rotation * Math.PI) / 180;

  HARMONIC_ANGLES.forEach((item) => {
    const angleRad = (item.deg * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const startX = centerX + cosA * innerRadius;
    const startY = centerY + sinA * innerRadius;
    const endX = centerX + cosA * effectiveRadius;
    const endY = centerY + sinA * effectiveRadius;

    // Configuración de estilo según categoría armónica
    let lineColor = 'rgba(148, 163, 184, 0.3)';
    let lineWidth = 0.8;
    let dashStyle = [3, 3];

    if (item.importance === 'primary') {
      lineColor = isNeon ? '#38bdf8' : '#0284c7';
      lineWidth = 1.4;
      dashStyle = [];
    } else if (item.importance === 'golden') {
      lineColor = isNeon ? '#eab308' : '#ca8a04'; // Dorado Áureo
      lineWidth = 1.2;
      dashStyle = [6, 2];
    } else if (item.importance === 'secondary') {
      lineColor = isNeon ? 'rgba(168, 85, 247, 0.45)' : 'rgba(147, 51, 234, 0.3)';
      lineWidth = 0.9;
      dashStyle = [4, 4];
    }

    // Trazo del Rayo Vectorial
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dashStyle);

    if (isNeon && item.importance !== 'secondary') {
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = item.importance === 'primary' ? 8 : 5;
    }
    ctx.stroke();
    ctx.restore();

    // -------------------------------------------------------------
    // 3. ETIQUETAS DE GRADOS EN TEXTO BLANCO SOBRE BORDE NEGRO
    // -------------------------------------------------------------
    const labelOffsetRadius = effectiveRadius + 12;
    const labelX = centerX + cosA * labelOffsetRadius;
    const labelY = centerY + sinA * labelOffsetRadius;

    // Solo dibujar si la etiqueta permanece dentro del canvas
    if (Math.hypot(labelX - centerX, labelY - centerY) <= mapRadius - 2) {
      ctx.save();
      // Tamaño tipográfico escalado dinámicamente según el tamaño del mapa
      const fontSize = Math.max(7, Math.min(10, mapRadius * 0.024));
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#ffffff'; // Letras blancas puras

      drawTextWithOutline(ctx, item.label, labelX, labelY, '#020617', 3.2);

      ctx.restore();
    }
  });

  // -------------------------------------------------------------
  // 4. PULSO DINÁMICO NÚCLEO ARMÓNICO CENTRAL
  // -------------------------------------------------------------
  const pulseCycle = getPositiveCycle(timeSec * 0.6);
  const pulseR = innerRadius * (0.8 + pulseCycle * 0.4);
  const pulseAlpha = (1 - pulseCycle) * 0.5;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, pulseR, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(234, 179, 8, ${pulseAlpha})`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}