import { latLonToPolar } from '@/lib/polarMath';

export const OCEANS = [
  { name: 'OCÉANO PACÍFICO NORTE', lat: 30, lon: -155, fontSize: 13 },
  { name: 'OCÉANO PACÍFICO SUR', lat: -25, lon: -130, fontSize: 13 },
  { name: 'OCÉANO ATLÁNTICO NORTE', lat: 32, lon: -40, fontSize: 12 },
  { name: 'OCÉANO ATLÁNTICO SUR', lat: -25, lon: -18, fontSize: 12 },
  { name: 'OCÉANO ÍNDICO', lat: -15, lon: 80, fontSize: 12 },
  { name: 'OCÉANO ÁRTICO', lat: 84, lon: 0, fontSize: 11 },
  { name: 'OCÉANO ANTÁRTICO', lat: -68, lon: 45, fontSize: 12 },
  { name: 'MAR MEDITERRÁNEO', lat: 35, lon: 18, fontSize: 9 },
  { name: 'MAR CARIBE', lat: 15, lon: -75, fontSize: 9 },
];

export function drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, rotation = 0) {
  if (!activeLayers?.oceans && !activeLayers?.oceanLabels) return;

  ctx.save();

  OCEANS.forEach((ocean) => {
    const p = latLonToPolar(ocean.lat, ocean.lon, mapRadius, rotation);
    const x = centerX + p.x;
    const y = centerY + p.y;

    const dist = Math.hypot(p.x, p.y);
    if (dist > mapRadius) return;

    // Estilo Cartográfico Náutico en Cursiva Náutica
    ctx.font = `italic bold ${ocean.fontSize}px Georgia, serif`;
    ctx.fillStyle = 'rgba(186, 230, 253, 0.55)'; // Azul celeste marítimo translúcido
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(2, 6, 23, 0.9)';
    ctx.shadowBlur = 4;

    ctx.fillText(ocean.name, x, y);
  });

  ctx.restore();
}