// components/map2d/layers/drawCoriolisEffect.js
import { latLonToPolar } from '@/lib/polarMath';
import { CORIOLIS_BELTS, CORIOLIS_CIRCULATION_CELLS } from '@/lib/coriolisData';

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function drawCoriolisCard(ctx, x, y, title, subtitle, color, isNeon = true) {
  ctx.save();
  ctx.font = 'bold 9px monospace';
  const tw1 = ctx.measureText(title).width;
  ctx.font = 'bold 8px monospace';
  const tw2 = ctx.measureText(subtitle).width;
  const bw = Math.max(tw1, tw2) + 18;
  const bh = 28;

  const rectX = x - bw / 2;
  const rectY = y - bh / 2;

  // Fondo HUD táctico antirruido visual
  ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;

  if (isNeon) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }

  ctx.beginPath();
  ctx.roundRect(rectX, rectY, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0; // Limpieza de sombra para nitidez de texto
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, title, x, y - 5, '#020617', 2.8);

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = color;
  drawTextWithOutline(ctx, subtitle, x, y + 6, '#020617', 2.2);

  ctx.restore();
}

export function drawCoriolisEffect(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  animTime = 0,
  isNeon = true
) {
  // 🛑 EVALUACIÓN FLEXIBLE DEL INTERRUPTOR
  const showCoriolis =
    activeLayers?.coriolis ||
    activeLayers?.coriolisEffect ||
    activeLayers?.efectoCoriolis ||
    true;

  if (!showCoriolis) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  // 🌊 RESPALDO DE TIEMPO ANIMADO (Asegura movimiento armónico continuo)
  const timeSec = (typeof animTime === 'number' && animTime > 0)
    ? animTime / 1000
    : Date.now() / 1000;

  // =========================================================================
  // 1. ANILLOS DE MAGNITUD Y FRONTERAS ATMOSFÉRICAS (ECUADOR / TRÓPICOS / POLOS)
  // =========================================================================
  CORIOLIS_BELTS.forEach((belt) => {
    const rBelt = mapRadius * ((90 - belt.lat) / 180);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, rBelt, 0, Math.PI * 2);

    if (belt.lat === 0) {
      // Línea del Ecuador (Fuerza de Coriolis f = 0 -> Cambio de Polaridad)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([8, 4]);
    } else {
      ctx.strokeStyle = isNeon ? belt.strokeColor : '#94a3b8';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([4, 4]);
    }

    if (isNeon) {
      ctx.shadowColor = belt.lat === 0 ? '#ef4444' : belt.strokeColor;
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();

    // Rótulo del cinturón sobre el paralelo
    const { x, y } = latLonToPolar(belt.lat, -45, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    ctx.save();
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Badge tipo HUD para etiquetas de paralelos clave
    const textW = ctx.measureText(belt.name).width;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
    ctx.strokeStyle = belt.lat === 0 ? '#ef4444' : belt.strokeColor;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(px - textW / 2 - 4, py - 6, textW + 8, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    drawTextWithOutline(ctx, belt.name, px, py + 0.5, '#020617', 2.8);
    ctx.restore();
  });

  // =========================================================================
  // 2. VECTOR FIELD Y CURVAS DE DEFLEXIÓN EN CÉLULAS DE CIRCULACIÓN
  // =========================================================================
  const longitudeSteps = 12;

  CORIOLIS_CIRCULATION_CELLS.forEach((cell) => {
    const deflection = cell.deflectionDir; // 1 = Derecha (Norte), -1 = Izquierda (Sur)

    for (let i = 0; i < longitudeSteps; i++) {
      const baseLon = -180 + (i * 360) / longitudeSteps;

      const pointsCount = 14;
      const curvePoints = [];

      for (let p = 0; p <= pointsCount; p++) {
        const t = p / pointsCount;
        const currentLat = cell.latStart + (cell.latEnd - cell.latStart) * t;

        const absLatRad = (Math.abs(currentLat) * Math.PI) / 180;
        const coriolisFactor = Math.sin(absLatRad);
        const lonOffset = t * t * 24 * deflection * (coriolisFactor + 0.2);

        const currentLon = baseLon + lonOffset;
        const { x, y } = latLonToPolar(currentLat, currentLon, mapRadius, rotation);
        curvePoints.push({ px: centerX + x, py: centerY + y });
      }

      // A. Trazado curvo de la corriente
      ctx.save();
      ctx.beginPath();
      curvePoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      });

      ctx.strokeStyle = cell.color;
      ctx.lineWidth = isNeon ? 1.5 : 1.0;
      ctx.globalAlpha = 0.75;
      if (isNeon) {
        ctx.shadowColor = cell.color;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();

      // B. Flecha de dirección en la punta del vector
      const lastPt = curvePoints[curvePoints.length - 1];
      const prevPt = curvePoints[curvePoints.length - 2];
      if (lastPt && prevPt) {
        const angle = Math.atan2(lastPt.py - prevPt.py, lastPt.px - prevPt.px);
        const arrowSize = 6.5;

        ctx.save();
        ctx.translate(lastPt.px, lastPt.py);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, -arrowSize / 1.8);
        ctx.lineTo(-arrowSize, arrowSize / 1.8);
        ctx.closePath();
        ctx.fillStyle = cell.color;
        if (isNeon) {
          ctx.shadowColor = cell.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.restore();
      }

      // C. MOVIMIENTO ARMÓNICO DE PARTÍCULAS (Giro y flujo dinámico activo)
      const speed = cell.particleSpeed || 0.8;
      const cycle = (timeSec * speed + i * 0.15) % 1.0;
      const particleIdx = Math.floor(cycle * (curvePoints.length - 1));
      const pSegProgress = (cycle * (curvePoints.length - 1)) % 1.0;

      const p1 = curvePoints[particleIdx];
      const p2 = curvePoints[Math.min(particleIdx + 1, curvePoints.length - 1)];

      if (p1 && p2) {
        const partX = p1.px + (p2.px - p1.px) * pSegProgress;
        const partY = p1.py + (p2.py - p1.py) * pSegProgress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(partX, partY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        if (isNeon) {
          ctx.shadowColor = cell.color;
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.restore();
      }
    }
  });

  // =========================================================================
  // 3. TARJETAS HUD INFORMATIVAS DE POLARIDAD Y GIRO
  // =========================================================================
  const northPos = latLonToPolar(45, -90, mapRadius, rotation);
  drawCoriolisCard(
    ctx,
    centerX + northPos.x,
    centerY + northPos.y,
    'HEMISFERIO NORTE (+)',
    'DESVIACIÓN A LA DERECHA ➔',
    '#38bdf8',
    isNeon
  );

  const southPos = latLonToPolar(-45, 90, mapRadius, rotation);
  drawCoriolisCard(
    ctx,
    centerX + southPos.x,
    centerY + southPos.y,
    'HEMISFERIO SUR (-)',
    '⬅ DESVIACIÓN A LA IZQUIERDA',
    '#c084fc',
    isNeon
  );

  // Tarjeta central en el Ecuador (Fuerza = 0 / Línea Neutra)
  const eqPos = latLonToPolar(0, 180, mapRadius, rotation);
  drawCoriolisCard(
    ctx,
    centerX + eqPos.x,
    centerY + eqPos.y,
    'ECUADOR (f = 0)',
    'CAMBIO DE POLARIDAD',
    '#ef4444',
    isNeon
  );

  ctx.restore();
}

export default drawCoriolisEffect;