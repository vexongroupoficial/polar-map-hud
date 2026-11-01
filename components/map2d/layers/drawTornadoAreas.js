// components/map2d/layers/drawTornadoAreas.js
import { latLonToPolar } from '@/lib/polarMath';

// =========================================================================
// CORREDORES DE CICLOGÉNESIS Y TRAYECTORIAS DE TORNADOS (GÉNESIS -> DISIPACIÓN)
// =========================================================================
const TORNADO_CORRIDORS = [
  {
    id: 'tornado_alley_usa',
    name: 'TORNADO ALLEY (EE.UU.)',
    intensity: 'EF4 / EF5',
    color: '#ef4444', // Rojo Alerta Neón
    dir: 1, // Sentido Ciclónico (H. Norte)
    speed: 0.08, // Velocidad de desplazamiento a lo largo del corredor
    // Trayectoria: Texas -> Oklahoma -> Kansas -> Nebraska
    start: { lat: 31.5, lon: -99.0 },  // Punto de Génesis
    end:   { lat: 41.5, lon: -96.0 },  // Punto de Disipación
  },
  {
    id: 'dixie_alley_usa',
    name: 'DIXIE ALLEY (EE.UU.)',
    intensity: 'EF3 / EF4',
    color: '#f97316', // Naranja Neón
    dir: 1,
    speed: 0.10,
    // Trayectoria: Luisiana -> Misisipi -> Alabama
    start: { lat: 30.5, lon: -92.0 },
    end:   { lat: 34.8, lon: -86.5 },
  },
  {
    id: 'pasillo_tornados_sa',
    name: 'PASILLO DE LOS TORNADOS (SUDAMÉRICA)',
    intensity: 'EF3 / EF4',
    color: '#f59e0b', // Ámbar
    dir: -1, // Sentido Ciclónico (H. Sur)
    speed: 0.09,
    // Trayectoria: La Pampa / Santa Fe (Argentina) -> Uruguay / Sur de Brasil
    start: { lat: -34.0, lon: -63.0 },
    end:   { lat: -28.0, lon: -54.0 },
  },
  {
    id: 'bangladesh_corridor',
    name: 'CORREDOR BANGLADESH',
    intensity: 'EF4 / EF5 EXTREMA',
    color: '#dc2626',
    dir: 1,
    speed: 0.12,
    // Trayectoria: Bahía de Bengala -> Bangladesh Central
    start: { lat: 21.8, lon: 89.2 },
    end:   { lat: 25.5, lon: 91.5 },
  },
  {
    id: 'southeastern_australia',
    name: 'SUDESTE AUSTRALIA',
    intensity: 'EF2 / EF3',
    color: '#eab308',
    dir: -1,
    speed: 0.07,
    // Trayectoria: Victoria -> Nueva Gales del Sur
    start: { lat: -37.5, lon: 142.0 },
    end:   { lat: -32.0, lon: 150.0 },
  },
  {
    id: 'europe_central',
    name: 'CORREDOR EUROPEO CENTRAL',
    intensity: 'EF2 / EF3',
    color: '#eab308',
    dir: 1,
    speed: 0.08,
    // Trayectoria: Norte de Francia / Bélgica -> Alemania / Polonia
    start: { lat: 49.0, lon: 3.5 },
    end:   { lat: 52.5, lon: 15.0 },
  },
];

// Delineado tipográfico de alta legibilidad
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawTornadoAreas(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 180,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  // -------------------------------------------------------------
  // NORMALIZACIÓN DE PARÁMETROS (COMPATIBILIDAD FLEXIBLE)
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

  // 🛑 Verificación de seguridad
  const showTornadoes = activeLayers?.tornadoes ?? activeLayers?.tornadoAreas ?? true;
  if (!showTornadoes) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' ? animTime : Date.now()) / 1000;

  TORNADO_CORRIDORS.forEach((corridor) => {
    // -------------------------------------------------------------
    // 1. DIBUJAR RUTA VECTORIAL DEL CORREDOR (GÉNESIS -> DISIPACIÓN)
    // -------------------------------------------------------------
    const pStart = latLonToPolar(corridor.start.lat, corridor.start.lon, mapRadius, rotation);
    const pEnd = latLonToPolar(corridor.end.lat, corridor.end.lon, mapRadius, rotation);

    const sx = centerX + pStart.x;
    const sy = centerY + pStart.y;
    const ex = centerX + pEnd.x;
    const ey = centerY + pEnd.y;

    // Línea de trayectoria del corredor
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = isNeon ? corridor.color : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.restore();

    // Marcador de punto de Génesis (Origen)
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = corridor.color;
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------
    // 2. SIMULACIÓN DE VÓRTICES EN DESPLAZAMIENTO (2 VÓRTICES DESFASADOS)
    // -------------------------------------------------------------
    const numVortices = 2; // Cantidad de superceldas viajando por el corredor

    for (let v = 0; v < numVortices; v++) {
      const phaseOffset = v / numVortices;
      // Avance del tornado desde 0.0 (naciente) hasta 1.0 (disipación)
      const progress = (timeSec * corridor.speed + phaseOffset) % 1.0;

      // Posición interpolada en coordenadas polares
      const currentLat = corridor.start.lat + (corridor.end.lat - corridor.start.lat) * progress;
      const currentLon = corridor.start.lon + (corridor.end.lon - corridor.start.lon) * progress;

      const pCurrent = latLonToPolar(currentLat, currentLon, mapRadius, rotation);
      const vx = centerX + pCurrent.x;
      const vy = centerY + pCurrent.y;

      const distFromCenter = Math.hypot(pCurrent.x, pCurrent.y);
      if (distFromCenter > mapRadius - 4) continue;

      // -------------------------------------------------------------
      // 3. CICLO DE VIDA Y FASES DEL TORNADO (TAMAÑO Y OPACIDAD)
      // -------------------------------------------------------------
      let scale = 1.0;
      let alpha = 1.0;
      let phaseText = 'MADURO';

      if (progress < 0.2) {
        // Fase 1: Génesis (Formación del embudo descendente)
        const tFactor = progress / 0.2;
        scale = 0.3 + tFactor * 0.7;
        alpha = tFactor;
        phaseText = 'GÉNESIS';
      } else if (progress > 0.75) {
        // Fase 3: Disipación (El embudo se eleva y rompe)
        const tFactor = (progress - 0.75) / 0.25;
        scale = 1.0 - tFactor * 0.6;
        alpha = 1.0 - tFactor;
        phaseText = 'DISIPACIÓN';
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const maxRadius = mapRadius * 0.045 * scale;

      // ONDA DE CHOQUE/PRESIÓN EXTENSIBLES (ANILLO DE SUCCIÓN)
      const pulseProgress = (timeSec * 2 + v * 0.5) % 1;
      const pulseR = maxRadius * (0.8 + pulseProgress * 0.6);
      const pulseA = (1 - pulseProgress) * 0.5;

      ctx.beginPath();
      ctx.arc(vx, vy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${hexToRgb(corridor.color)}, ${pulseA})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ESPIRAL DE VIENTO Y POLVO (VÓRTICE CINEMÁTICO GIRATORIO)
      const arms = 3;
      const turns = 2.2;

      for (let arm = 0; arm < arms; arm++) {
        const armOffset = (arm * Math.PI * 2) / arms;
        ctx.beginPath();

        for (let step = 0; step <= 30; step++) {
          const t = step / 30;
          const r = t * maxRadius;
          const angle =
            armOffset +
            t * turns * Math.PI * 2 * corridor.dir +
            timeSec * 4 * corridor.dir;

          const px = vx + Math.cos(angle) * r;
          const py = vy + Math.sin(angle) * r;

          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = corridor.color;
        ctx.lineWidth = isNeon ? 1.5 : 0.9;
        if (isNeon) {
          ctx.shadowColor = corridor.color;
          ctx.shadowBlur = 6;
        }
        ctx.stroke();
      }

      // NÚCLEO CENTRAL DEL EMBUDO (OJAL BLANCO)
      ctx.beginPath();
      ctx.arc(vx, vy, 2.2 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      if (isNeon) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      }
      ctx.fill();

      // -------------------------------------------------------------
      // 4. ETIQUETA DINÁMICA HUD SIGUIENDO AL VÓRTICE EN MOVIMIENTO
      // -------------------------------------------------------------
      if (progress > 0.08 && progress < 0.92) {
        ctx.shadowBlur = 0;
        ctx.font = 'bold 8px monospace';
        const labelText = `🌪️ ${corridor.name} [${phaseText}]`;
        const tw = ctx.measureText(labelText).width;

        const boxW = tw + 10;
        const boxH = 14;
        const boxX = vx - boxW / 2;
        const boxY = vy + maxRadius + 4;

        ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
        ctx.strokeStyle = corridor.color;
        ctx.lineWidth = 0.9;

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawTextWithOutline(ctx, labelText, vx, boxY + 7, '#020617', 2.5);
      }

      ctx.restore();
    }
  });

  ctx.restore();
}

// Convertidor Hex a RGB para opacidades dinámicas
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}