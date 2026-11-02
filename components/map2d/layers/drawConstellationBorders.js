// components/map2d/layers/drawConstellationBorders.js

function drawOutlineText(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawConstellationBorders(ctx, activeLayers, centerX, centerY, mapRadius) {
  // Comprobación de visibilidad si se añade al Sidebar
  const showBorders = activeLayers?.constellationBorders ?? true;
  if (!showBorders) return;

  ctx.save();

  // Radios exactos de declinación en la proyección polar lineal
  const rBoreal = ((90 - 60) / 180) * mapRadius * 0.78;     // Corona Boreal (+60° Dec)
  const rEcuador = ((90 - 0) / 180) * mapRadius * 0.78;      // Ecuador Celeste (0° Dec)
  const rEcliptic = ((90 - (-30)) / 180) * mapRadius * 0.78; // Límite Eclíptico (-30° Dec)
  const rAustral = mapRadius * 0.78;                         // Periferia Austral (-90° Dec)

  const rings = [
    {
      radius: rBoreal,
      color: '#38bdf8',
      dash: [6, 4],
      label: '── ANILLO 1: NÚCLEO BOREAL [CIRCUMPOLAR +60° DEC] ──',
      textYOffset: -6
    },
    {
      radius: rEcuador,
      color: 'rgba(255, 255, 255, 0.4)',
      dash: [2, 4],
      label: '── ECUADOR CELESTE [0° DEC] ──',
      textYOffset: -6
    },
    {
      radius: rEcliptic,
      color: '#fbbf24',
      dash: [8, 4],
      label: '── ANILLO 2: BANDA ECLÍPTICA ZODIACAL [-30° DEC] ──',
      textYOffset: 14
    },
    {
      radius: rAustral,
      color: '#60a5fa',
      dash: [4, 4],
      label: '── ANILLO 3: ANILLO PERIFÉRICO AUSTRAL [-90° DEC] ──',
      textYOffset: 16
    }
  ];

  rings.forEach((ring) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 1.2;
    ctx.setLineDash(ring.dash);

    // Resplandor neón
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Etiqueta del anillo
    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = ring.color;
    ctx.textAlign = 'center';
    drawOutlineText(ctx, ring.label, centerX, centerY + ring.radius + ring.textYOffset, '#020617', 2.5);
    ctx.restore();
  });

  ctx.restore();
}

export default drawConstellationBorders;