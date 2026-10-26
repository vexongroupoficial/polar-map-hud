import { latLonToPolar } from '@/lib/polarMath';

const STRATEGIC_CROSSINGS = [
  { name: 'Tapón del Darién', lat: 8.0, lon: -77.7, type: 'isthmus', label: 'Conexión Sur/Centroamérica' },
  { name: 'Estrecho de Bering', lat: 65.8, lon: -168.9, type: 'strait', label: 'Paso Ártico Eurasia/América' },
  { name: 'Estrecho del Bósforo', lat: 41.1, lon: 29.0, type: 'strait', label: 'Puente Europa/Asia' },
  { name: 'Corredor Sinaí / Israel / Suez', lat: 29.9, lon: 32.5, type: 'chokepoint', label: 'Paso Mar Rojo / Mediterráneo' },
  { name: 'Estrecho de Gibraltar', lat: 35.9, lon: -5.6, type: 'strait', label: 'Acceso Atlántico/Mediterráneo' },
  { name: 'Estrecho de Malaca', lat: 2.5, lon: 101.8, type: 'chokepoint', label: 'Ruta Comercial Índico/Pacífico' },
  { name: 'Bab el-Mandeb', lat: 12.5, lon: 43.3, type: 'chokepoint', label: 'Paso Mar Rojo / Cuerno de África' }
];

export function drawStrategicCrossings(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.strategicCrossings) return;

  ctx.save();

  STRATEGIC_CROSSINGS.forEach((item) => {
    const { x, y } = latLonToPolar(item.lat, item.lon, mapRadius, rotation);
    const drawX = centerX + x;
    const drawY = centerY + y;

    // Marcador Táctico (Cruz / Objetivo en Rojo/Naranja)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 10;

    // Retícula
    ctx.beginPath();
    ctx.arc(drawX, drawY, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(drawX - 11, drawY);
    ctx.lineTo(drawX + 11, drawY);
    ctx.moveTo(drawX, drawY - 11);
    ctx.lineTo(drawX, drawY + 11);
    ctx.stroke();

    // Etiqueta HUD
    ctx.shadowBlur = 0;
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#fca5a5';
    ctx.textAlign = 'left';
    ctx.fillText(`🌉 ${item.name.toUpperCase()}`, drawX + 13, drawY - 2);

    ctx.font = '8px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(item.label, drawX + 13, drawY + 8);
  });

  ctx.restore();
}