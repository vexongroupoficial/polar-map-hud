
import { POLAR_OCEAN_REGIONS } from '@/lib/oceanData';

export function drawOcean(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  selectedOceanId = null,
  rotation = 180,
  animTime = 0
) {
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  const showOceans = activeLayers?.oceans ?? false;
  if (!showOceans) return;

  const isNeon = activeLayers?.neonMode ?? true;
  const timeSec = animTime / 1000;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  POLAR_OCEAN_REGIONS.forEach((region) => {
    const isSelected = selectedOceanId === region.id;

    const rMin = mapRadius * ((90 - region.latNorth) / 180);
    const rMax = mapRadius * ((90 - region.latSouth) / 180);

    let startDeg = region.lonWest;
    let endDeg = region.lonEast;
    if (endDeg <= startDeg) endDeg += 360;

    const startRad = ((startDeg + (rotation - 180)) * Math.PI) / 180;
    const endRad = ((endDeg + (rotation - 180)) * Math.PI) / 180;

    // Trazar sector anular
    ctx.beginPath();
    if (rMin <= 1) {
      ctx.arc(centerX, centerY, rMax, startRad, endRad, false);
      ctx.lineTo(centerX, centerY);
    } else {
      ctx.arc(centerX, centerY, rMax, startRad, endRad, false);
      ctx.arc(centerX, centerY, rMin, endRad, startRad, true);
    }
    ctx.closePath();

    ctx.fillStyle = isSelected
      ? 'rgba(56, 189, 248, 0.40)'
      : isNeon
      ? region.color
      : 'rgba(15, 23, 42, 0.25)';

    if (isNeon) {
      ctx.shadowColor = region.strokeColor;
      ctx.shadowBlur = isSelected ? 20 : 4;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#ffffff' : region.strokeColor;
    ctx.lineWidth = isSelected ? 2.0 : 0.8;
    ctx.setLineDash(isSelected ? [6, 3] : [4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pulso batimétrico animado al seleccionar
    if (isSelected) {
      const rMid = (rMin + rMax) / 2;
      const aMid = (startRad + endRad) / 2;
      const cx = centerX + rMid * Math.sin(aMid);
      const cy = centerY - rMid * Math.cos(aMid);

      ctx.save();
      const waveRadius = (timeSec * 25) % 45;
      ctx.beginPath();
      ctx.arc(cx, cy, waveRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 0.7 - waveRadius / 45)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }
  });

  ctx.restore();
}