// components/map2d/layers/drawWindCurrents.js
import { latLonToPolar } from '@/lib/polarMath';

// CINTURONES DE VIENTO CON SENTIDOS ALTERNADOS DE ROTACIÓN (dir: 1 Horario / dir: -1 Antihorario)
const WIND_BELTS = [
  { name: 'POLARES NORTE', lat: 72, waveAmplitude: 4, waveFreq: 3, speedDegPerSec: 12, dir: -1, count: 28, color: '#67e8f9' },
  { name: 'JET STREAM / OESTES', lat: 50, waveAmplitude: 7, waveFreq: 4, speedDegPerSec: 22, dir: 1, count: 36, color: '#38bdf8' },
  { name: 'ALISIOS DEL NORTE', lat: 20, waveAmplitude: 3, waveFreq: 3, speedDegPerSec: 10, dir: -1, count: 40, color: '#818cf8' },
  { name: 'ALISIOS DEL SUR', lat: -20, waveAmplitude: 3, waveFreq: 3, speedDegPerSec: 10, dir: -1, count: 40, color: '#818cf8' },
  { name: 'OESTES DEL SUR', lat: -50, waveAmplitude: 6, waveFreq: 4, speedDegPerSec: 20, dir: 1, count: 36, color: '#38bdf8' },
  { name: 'POLARES SUR', lat: -72, waveAmplitude: 4, waveFreq: 3, speedDegPerSec: 12, dir: -1, count: 28, color: '#67e8f9' },
];

export function drawWindCurrents(
  ctx,
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  animTime = 0,
  isNeon = true
) {
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = animTime / 1000;

  WIND_BELTS.forEach((belt) => {
    // Calculo del desplazamiento dinámico con dirección (dir: 1 o dir: -1)
    const shiftAngle = (timeSec * belt.speedDegPerSec * belt.dir) % 360;

    for (let i = 0; i < belt.count; i++) {
      const baseLon = ((i * (360 / belt.count) + shiftAngle) % 360) - 180;
      const lonRad = (baseLon * Math.PI) / 180;

      // Ondulaciones ondulatorias de Rossby
      const latWave = belt.lat + Math.sin(lonRad * belt.waveFreq + timeSec * 0.8) * belt.waveAmplitude;

      const { x, y } = latLonToPolar(latWave, baseLon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;

      // Estela posicionada siempre detrás de la cabeza según la dirección de movimiento
      const tailLon = baseLon - 5 * belt.dir;
      const tailLonRad = (tailLon * Math.PI) / 180;
      const tailLatWave = belt.lat + Math.sin(tailLonRad * belt.waveFreq + timeSec * 0.8) * belt.waveAmplitude;

      const tailPos = latLonToPolar(tailLatWave, tailLon, mapRadius, rotation);
      const tx = centerX + tailPos.x;
      const ty = centerY + tailPos.y;

      if (isNaN(px) || isNaN(py) || isNaN(tx) || isNaN(ty)) continue;

      // Gradiente del vector
      const grad = ctx.createLinearGradient(tx, ty, px, py);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(1, isNeon ? belt.color : 'rgba(148, 163, 184, 0.75)');

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(px, py);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isNeon ? 1.6 : 0.9;

      if (isNeon) {
        ctx.shadowColor = belt.color;
        ctx.shadowBlur = 5;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.stroke();

      // Cabeza del vector de viento
      ctx.beginPath();
      ctx.arc(px, py, isNeon ? 1.4 : 0.9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  });

  ctx.restore();
}