import { latLonToPolar } from '@/lib/polarMath';

/**
 * Renderiza los Puntos Cardinales y la Rosa de los Vientos con espacio amplio.
 */
export function drawCompassRose(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (activeLayers?.compassRose === false && activeLayers?.graticule === false) return;

  ctx.save();

  // PUNTOS CARDINALES Y SU CONFIGURACIÓN
  const CARDINAL_POINTS = [
    { label: 'N • 0°', sub: 'GREENWICH', angleDeg: 0, color: '#38bdf8', isMain: true },
    { label: 'E • 90°E', sub: 'ORIENTE', angleDeg: 90, color: '#f59e0b', isMain: true },
    { label: 'S • 180°', sub: 'ANTIMERIDIANO', angleDeg: 180, color: '#ef4444', isMain: true },
    { label: 'W • 90°W', sub: 'OCCIDENTE', angleDeg: 270, color: '#f59e0b', isMain: true },
    { label: 'NE • 45°', sub: '', angleDeg: 45, color: '#94a3b8', isMain: false },
    { label: 'SE • 135°', sub: '', angleDeg: 135, color: '#94a3b8', isMain: false },
    { label: 'SW • 225°', sub: '', angleDeg: 225, color: '#94a3b8', isMain: false },
    { label: 'NW • 315°', sub: '', angleDeg: 315, color: '#94a3b8', isMain: false },
  ];

  // Distancia del texto adaptada al nuevo radio contraído
  const labelRadius = mapRadius + 28;

  CARDINAL_POINTS.forEach((pt) => {
    const totalAngleDeg = pt.angleDeg + (rotation || 0);
    const angleRad = ((totalAngleDeg - 90) * Math.PI) / 180;

    const x = centerX + labelRadius * Math.cos(angleRad);
    const y = centerY + labelRadius * Math.sin(angleRad);

    // MUESCAS TÁCTICAS
    const notchInnerX = centerX + mapRadius * Math.cos(angleRad);
    const notchInnerY = centerY + mapRadius * Math.sin(angleRad);
    const notchOuterX = centerX + (mapRadius + (pt.isMain ? 12 : 6)) * Math.cos(angleRad);
    const notchOuterY = centerY + (mapRadius + (pt.isMain ? 12 : 6)) * Math.sin(angleRad);

    ctx.strokeStyle = pt.color;
    ctx.lineWidth = pt.isMain ? 2 : 1;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = pt.isMain ? 8 : 0;

    ctx.beginPath();
    ctx.moveTo(notchInnerX, notchInnerY);
    ctx.lineTo(notchOuterX, notchOuterY);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // FUENTE Y TAMAÑO DE CAJA ADAPTADO
    const fontSize = pt.isMain ? 'bold 13px' : 'bold 10px';
    ctx.font = `${fontSize} monospace`;

    const textWidth = ctx.measureText(pt.label).width;
    const boxWidth = textWidth + 12;
    const boxHeight = pt.sub ? 26 : 18;

    // CAJA HUD CON BORDE NEÓN
    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.strokeStyle = pt.color;
    ctx.lineWidth = pt.isMain ? 1.2 : 0.8;

    ctx.beginPath();
    ctx.roundRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 3);
    ctx.fill();
    ctx.stroke();

    // TEXTO
    ctx.fillStyle = pt.isMain ? '#f8fafc' : pt.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pt.label, x, pt.sub ? y - 4 : y);

    if (pt.sub) {
      ctx.font = '7.5px monospace';
      ctx.fillStyle = pt.color;
      ctx.fillText(pt.sub, x, y + 6);
    }
  });

  // INDICADOR CENTRAL (POLO NORTE - 90°N)
  ctx.fillStyle = '#0284c7';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.font = 'bold 11px monospace';

  const northText = 'ORIGEN: POLO NORTE (90°N)';
  const northWidth = ctx.measureText(northText).width;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(centerX - northWidth / 2 - 5, centerY - 26, northWidth + 10, 16, 3);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#67e8f9';
  ctx.textAlign = 'center';
  ctx.fillText(northText, centerX, centerY - 18);

  ctx.restore();
}