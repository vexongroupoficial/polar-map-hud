// components/map2d/layers/drawEnochCalendar.js
import { latLonToPolar } from '@/lib/polarMath';

// Los 6 Portales del Sol según el Calendario de Enoc (Libro de la Astronomía)
const ENOCH_GATES = [
  { id: 1, name: 'PORTAL 1 (SOLSTICIO INVIERNO)', lat: -23.5, color: '#38bdf8' },
  { id: 2, name: 'PORTAL 2 (EQUINOCCIO MENGUANTE)', lat: -14.1, color: '#60a5fa' },
  { id: 3, name: 'PORTAL 3 (PORTAL INTERMEDIO S.)', lat: -4.7, color: '#34d399' },
  { id: 4, name: 'PORTAL 4 (EQUINOCCIO PRIMAVERA)', lat: 4.7, color: '#facc15' },
  { id: 5, name: 'PORTAL 5 (PORTAL INTERMEDIO N.)', lat: 14.1, color: '#fb923c' },
  { id: 6, name: 'PORTAL 6 (SOLSTICIO VERANO)', lat: 23.5, color: '#ef4444' }
];

const ENOCH_SEASONS = [
  { deg: 0, name: 'TEKUFAH PRIMAVERA (DÍA 91)', gate: 4 },
  { deg: 90, name: 'TEKUFAH VERANO (DÍA 182)', gate: 6 },
  { deg: 180, name: 'TEKUFAH OTOÑO (DÍA 273)', gate: 4 },
  { deg: 270, name: 'TEKUFAH INVIERNO (DÍA 364)', gate: 1 }
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
    activeLayers?.calendarioDeEnoc ||
    false;

  if (!showEnoch) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (typeof animTime === 'number' && !isNaN(animTime) ? animTime : Date.now()) / 1000;

  // Ciclo solar de 364 días (Simulado en 120 segundos)
  const enochYearCycle = getPositiveCycle(timeSec / 120);
  const currentEnochDay = Math.floor(enochYearCycle * 364) + 1;

  // Determinar Portal Solar activo (Oscilación norte-sur entre Portales 1 al 6)
  const gateOscillation = (Math.sin(enochYearCycle * Math.PI * 2) + 1) / 2; // Rango 0.0 a 1.0
  const activeGateIndex = Math.min(5, Math.floor(gateOscillation * 6));
  const activeGate = ENOCH_GATES[activeGateIndex];

  // 1. Trazado de los 6 Portales Concéntricos (Líneas de la trayectoria del Sol)
  ENOCH_GATES.forEach((gate, idx) => {
    const r = ((90 - gate.lat) / 180) * mapRadius;
    const isActive = idx === activeGateIndex;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0.1, r), 0, Math.PI * 2);
    ctx.strokeStyle = isActive 
      ? (isNeon ? gate.color : '#ffffff')
      : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = isActive ? 2.2 : 0.8;
    ctx.setLineDash(isActive ? [] : [6, 3]);

    if (isNeon && isActive) {
      ctx.shadowColor = gate.color;
      ctx.shadowBlur = 12;
    }
    ctx.stroke();

    // Rótulo del Portal en el margen izquierdo
    ctx.font = isActive ? 'bold 8px monospace' : 'bold 7px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, gate.name, centerX - r - 6, centerY, '#020617', 3.0);
    ctx.restore();
  });

  // 2. Cuadrantes Equinocciales y Solsticiales (Tekufot)
  const rotationRad = ((rotation || 180) * Math.PI) / 180;
  ENOCH_SEASONS.forEach((season) => {
    const angleRad = (season.deg * Math.PI) / 180 + rotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const startX = centerX + cosA * (mapRadius * 0.2);
    const startY = centerY + sinA * (mapRadius * 0.2);
    const endX = centerX + cosA * (mapRadius * 0.95);
    const endY = centerY + sinA * (mapRadius * 0.95);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#facc15'; // Amarillo Solar
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Rótulo de Tekufah
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    drawTextWithOutline(ctx, `☀️ ${season.name}`, endX, endY, '#020617', 3.5);
    ctx.restore();
  });

  // 3. Posición Táctica del Sol en su Portal Activo
  const sunAngleRad = enochYearCycle * Math.PI * 2 + rotationRad;
  const sunR = ((90 - activeGate.lat) / 180) * mapRadius;
  const sunX = centerX + Math.cos(sunAngleRad) * sunR;
  const sunY = centerY + Math.sin(sunAngleRad) * sunR;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  if (isNeon) {
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 15;
  }
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Telemetría del Sol de Enoc
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  drawTextWithOutline(ctx, `DÍA ${currentEnochDay} / 364 | ${activeGate.name}`, sunX, sunY + 10, '#020617', 3.0);
  ctx.restore();

  ctx.restore();
}