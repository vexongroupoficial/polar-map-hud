/**
 * Capa de Escáner Radar Táctico (360°)
 */
export function drawRadarSweep(ctx, activeLayers, centerX, centerY, mapRadius) {
  // Si la capa está desactivada en el sidebar, NO dibujar nada
  if (!activeLayers?.radarSweep) return;

  ctx.save();

  // Ángulo de barrido único según tiempo real
  const time = performance.now() * 0.001;
  const sweepAngle = (time * 0.9) % (Math.PI * 2);

  const sweepX = centerX + mapRadius * Math.cos(sweepAngle);
  const sweepY = centerY + mapRadius * Math.sin(sweepAngle);

  // 1. Abanico Gradiente
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, mapRadius, sweepAngle - 0.35, sweepAngle);
  ctx.closePath();

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    10,
    centerX,
    centerY,
    mapRadius
  );
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.06)');
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

  ctx.fillStyle = gradient;
  ctx.fill();

  // 2. Línea principal de barrido neón cian
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(sweepX, sweepY);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 3. Destello de borde
  ctx.beginPath();
  ctx.arc(sweepX, sweepY, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();

  ctx.restore();
}