// components/map2d/layers/drawSacredGeometry.js
import { latLonToPolar } from '@/lib/polarMath';

export function drawSacredGeometry(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  animTime = 0,
  isNeon = true
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = animTime / 1000;

  // 1. FLOR DE LA VIDA (FlowerOfLifeGrid)
  if (activeLayers.FlowerOfLifeGrid || activeLayers.SeedOfLifeGrid) {
    const isSeed = !activeLayers.FlowerOfLifeGrid && activeLayers.SeedOfLifeGrid;
    const count = isSeed ? 6 : 12;
    const r = mapRadius * 0.35;

    ctx.lineWidth = isNeon ? 1.2 : 0.7;
    ctx.strokeStyle = isNeon ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.25)';
    if (isNeon) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 4;
    }

    for (let i = 0; i < count; i++) {
      const angle = (i * (360 / count) * Math.PI) / 180;
      const cx = centerX + r * Math.cos(angle);
      const cy = centerY + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 2. RED DE ENERGÍA TERRESTRE (EarthEnergyGrid / Becker-Hagens)
  if (activeLayers.EarthEnergyGrid) {
    const nodes = [
      { lat: 29.9792, lon: 31.1342 }, // Guiza
      { lat: -27.1127, lon: -109.3497 }, // Pascua
      { lat: 31.0675, lon: 81.3119 }, // Kailash
      { lat: 25.0, lon: -71.0 }, // Bermudas
      { lat: -13.1631, lon: -72.545 }, // Machu Picchu
      { lat: 51.1789, lon: -1.8262 }, // Stonehenge
    ];

    const projected = nodes.map((n) => {
      const p = latLonToPolar(n.lat, n.lon, mapRadius, rotation);
      return { x: centerX + p.x, y: centerY + p.y };
    });

    ctx.beginPath();
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[j].x, projected[j].y);
      }
    }
    ctx.strokeStyle = isNeon ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    if (isNeon) {
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 6;
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 3. ESPIRAL ÁUREA Y FIBONACCI (GoldenSpiralGrid / FibonacciSpiralGrid)
  if (activeLayers.GoldenSpiralGrid || activeLayers.FibonacciSpiralGrid) {
    ctx.beginPath();
    const isFib = activeLayers.FibonacciSpiralGrid;
    const b = isFib ? 0.12 : 0.16;
    const turnOffset = timeSec * 0.1;

    for (let theta = 0; theta < Math.PI * 10; theta += 0.04) {
      const r = 4 * Math.exp(b * theta);
      if (r > mapRadius) break;

      const angle = theta + turnOffset + (rotation * Math.PI) / 180;
      const sx = centerX + r * Math.cos(angle);
      const sy = centerY + r * Math.sin(angle);

      if (theta === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = isNeon ? 'rgba(245, 158, 11, 0.6)' : 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = isNeon ? 1.8 : 1.0;
    if (isNeon) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
    }
    ctx.stroke();
  }

  // 4. TORUS Y CAMPO TOROIDAL (TorusGrid)
  if (activeLayers.TorusGrid) {
    const rings = 8;
    for (let i = 1; i <= rings; i++) {
      const r = (mapRadius / rings) * i;
      const pulse = Math.sin(timeSec * 2 + i * 0.5) * 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.max(1, r + pulse), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 + (i / rings) * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // 5. MERKABA / TETRAHEDRO ESTRELLADO (MerkabaGrid)
  if (activeLayers.MerkabaGrid) {
    const r = mapRadius * 0.65;
    const rotSpeed = timeSec * 0.2;

    [0, Math.PI].forEach((phaseShift) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 120 * Math.PI) / 180 + rotSpeed + phaseShift;
        const px = centerX + r * Math.cos(angle);
        const py = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = isNeon ? 'rgba(236, 72, 153, 0.5)' : 'rgba(219, 39, 119, 0.3)';
      ctx.lineWidth = 1.5;
      if (isNeon) {
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 6;
      }
      ctx.stroke();
    });
  }

  // 6. CUBO DE METATRÓN (MetatronCubeGrid)
  if (activeLayers.MetatronCubeGrid) {
    const r = mapRadius * 0.4;
    const centers = [{ x: centerX, y: centerY }];

    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      centers.push({ x: centerX + r * Math.cos(angle), y: centerY + r * Math.sin(angle) });
      centers.push({ x: centerX + r * 2 * Math.cos(angle), y: centerY + r * 2 * Math.sin(angle) });
    }

    ctx.beginPath();
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        ctx.moveTo(centers[i].x, centers[i].y);
        ctx.lineTo(centers[j].x, centers[j].y);
      }
    }
    ctx.strokeStyle = isNeon ? 'rgba(34, 211, 238, 0.25)' : 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 7. YIN YANG Y EQUILIBRIO VECTORIAL (YinYangGrid / VectorEquilibriumGrid)
  if (activeLayers.YinYangGrid) {
    const r = mapRadius * 0.45;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((timeSec * 0.3) % (Math.PI * 2));

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = isNeon ? 'rgba(255, 255, 255, 0.4)' : 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -r / 2, r / 2, 0, Math.PI * 2);
    ctx.arc(0, r / 2, r / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}