/**
 * Renderiza el Rueda del Calendario Solar de Enoc (364 días) en la corona exterior.
 */
export function drawEnochCalendar(ctx, activeLayers, centerX, centerY, mapRadius) {
  if (!activeLayers?.enochCalendar) return;

  ctx.save();

  const outerRadius = mapRadius + 14;
  const innerRadius = mapRadius + 4;

  // 1. DIBUJAR ANILLO CORONA
  ctx.strokeStyle = '#eab308'; // Dorado solar
  ctx.lineWidth = 1;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 2. DIBUJAR 4 PORTALES CARDINALES (ESTACIONES DE 91 DÍAS)
  const PORTALS = [
    { name: 'PORTAL 1 (PRIMAVERA)', angleDeg: 0, color: '#22c55e' },
    { name: 'PORTAL 2 (VERANO)', angleDeg: 90, color: '#eab308' },
    { name: 'PORTAL 3 (OTOÑO)', angleDeg: 180, color: '#f97316' },
    { name: 'PORTAL 4 (INVIERNO)', angleDeg: 270, color: '#38bdf8' },
  ];

  PORTALS.forEach((portal) => {
    const rad = ((portal.angleDeg - 90) * Math.PI) / 180;
    const px = centerX + (outerRadius + 10) * Math.cos(rad);
    const py = centerY + (outerRadius + 10) * Math.sin(rad);

    ctx.strokeStyle = portal.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + innerRadius * Math.cos(rad), centerY + innerRadius * Math.sin(rad));
    ctx.lineTo(centerX + (outerRadius + 8) * Math.cos(rad), centerY + (outerRadius + 8) * Math.sin(rad));
    ctx.stroke();

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = portal.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(portal.name, px, py);
  });

  ctx.restore();
}