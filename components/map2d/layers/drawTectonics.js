import { latLonToPolar } from '@/lib/polarMath';

export function drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, rotation, zoom) {
  if (!activeLayers?.tectonics || !tectonicsData) return;

  ctx.strokeStyle = '#f43f5e'; // Rojo rosado fluorescente para fallas y fallas tectónicas
  ctx.lineWidth = Math.max(0.8, 1.8 / Math.sqrt(zoom));
  ctx.setLineDash([4, 2]); // Línea discontinua técnica

  tectonicsData.features.forEach((feature) => {
    const { geometry } = feature;
    if (!geometry) return;

    const renderLine = (coordinates) => {
      ctx.beginPath();
      coordinates.forEach((coord, index) => {
        const [lon, lat] = coord;
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        const drawX = centerX + x;
        const drawY = centerY + y;

        if (index === 0) {
          ctx.moveTo(drawX, drawY);
        } else {
          ctx.lineTo(drawX, drawY);
        }
      });
      ctx.stroke();
    };

    if (geometry.type === 'LineString') {
      renderLine(geometry.coordinates);
    } else if (geometry.type === 'MultiLineString') {
      geometry.coordinates.forEach((line) => renderLine(line));
    }
  });

  ctx.setLineDash([]); // Restablecer línea continua
}