import { latLonToPolar } from '@/lib/polarMath';

// Definición de bandas de viento con velocidad media calibrada
const WIND_BELTS = [
  {
    name: 'Chorro Polar Norte',
    latBase: 62,
    amplitude: 6,
    waves: 4,
    speed: 0.0008,
    direction: 1,
    color: '#06b6d4',
    particleCount: 22,
  },
  {
    name: 'Chorro Subtropical Norte',
    latBase: 32,
    amplitude: 4,
    waves: 5,
    speed: 0.0006,
    direction: 1,
    color: '#38bdf8',
    particleCount: 18,
  },
  {
    name: 'Vientos Alisios del Norte',
    latBase: 15,
    amplitude: 2,
    waves: 3,
    speed: -0.0004,
    direction: -1,
    color: '#34d399',
    particleCount: 16,
  },
  {
    name: 'Chorro Subtropical Sur',
    latBase: -32,
    amplitude: 5,
    waves: 5,
    speed: 0.0006,
    direction: 1,
    color: '#38bdf8',
    particleCount: 18,
  },
  {
    name: 'Chorro Polar Sur',
    latBase: -60,
    amplitude: 7,
    waves: 4,
    speed: 0.0007,
    direction: 1,
    color: '#06b6d4',
    particleCount: 22,
  },
];

export function drawWindCurrents(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  time = Date.now()
) {
  if (!activeLayers?.windCurrents) return;

  ctx.save();

  WIND_BELTS.forEach((belt) => {
    // 1. LÍNEA BASE GUÍA (ONDA DE ROSSBY)
    ctx.strokeStyle = belt.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.globalAlpha = 0.3;

    ctx.beginPath();
    const steps = 180;
    for (let i = 0; i <= steps; i++) {
      const lon = -180 + (i / steps) * 360;
      const radAngle = (lon * Math.PI) / 180;

      const wave = Math.sin(radAngle * belt.waves + time * belt.speed * belt.direction) * belt.amplitude;
      const lat = belt.latBase + wave;

      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      if (i === 0) ctx.moveTo(centerX + x, centerY + y);
      else ctx.lineTo(centerX + x, centerY + y);
    }
    ctx.closePath();
    ctx.stroke();

    // 2. PARTÍCULAS / VECTORES DE VIENTO CINÉTICO
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = belt.color;
    ctx.shadowBlur = 5;

    for (let p = 0; p < belt.particleCount; p++) {
      const particleOffset = (p / belt.particleCount) * 360;
      const currentLon = ((time * belt.speed * 35 * belt.direction + particleOffset) % 360) - 180;

      const radAngle = (currentLon * Math.PI) / 180;
      const wave = Math.sin(radAngle * belt.waves + time * belt.speed * belt.direction) * belt.amplitude;
      const lat = belt.latBase + wave;

      const { x, y } = latLonToPolar(lat, currentLon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;

      const prevLon = currentLon - (3 * belt.direction);
      const prevRad = (prevLon * Math.PI) / 180;
      const prevWave = Math.sin(prevRad * belt.waves + time * belt.speed * belt.direction) * belt.amplitude;
      const prevLat = belt.latBase + prevWave;

      const { x: px2, y: py2 } = latLonToPolar(prevLat, prevLon, mapRadius, rotation);
      const tailX = centerX + px2;
      const tailY = centerY + py2;

      const grad = ctx.createLinearGradient(tailX, tailY, px, py);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, belt.color);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. ETIQUETA TELEMÉTRICA HUD
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    const labelLon = ((time * belt.speed * 12 * belt.direction) % 360) - 180;
    const { x: lx, y: ly } = latLonToPolar(belt.latBase, labelLon, mapRadius, rotation);

    const labelX = centerX + lx;
    const labelY = centerY + ly;

    ctx.font = 'bold 8px monospace';
    const text = `💨 ${belt.name.toUpperCase()}`;
    const tw = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.strokeStyle = belt.color;
    ctx.lineWidth = 0.8;
    ctx.roundRect(labelX - tw / 2 - 4, labelY - 7, tw + 8, 14, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = belt.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, labelX, labelY);
  });

  ctx.restore();
}