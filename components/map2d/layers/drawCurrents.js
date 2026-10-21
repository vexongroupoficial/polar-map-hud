import { latLonToPolar } from '@/lib/polarMath';

export function drawCurrents(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.currents) return;

  // Simulación vectorial de corrientes oceánicas circulares en espiral polar
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // Cian translúcido
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);

  for (let rFraction = 0.25; rFraction <= 0.85; rFraction += 0.2) {
    const currentRadius = mapRadius * rFraction;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}