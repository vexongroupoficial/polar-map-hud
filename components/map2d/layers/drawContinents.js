import { latLonToPolar } from '@/lib/polarMath';

export function drawContinents(ctx, countriesData, centerX, centerY, mapRadius, rotation, zoom) {
  if (!countriesData) return;

  ctx.fillStyle = '#0f2942';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = Math.max(0.4, 0.8 / Math.sqrt(zoom));

  countriesData.features.forEach((feature) => {
    const { geometry } = feature;
    if (!geometry) return;

    const renderPolygon = (coordinates) => {
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
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => renderPolygon(ring));
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => renderPolygon(ring));
      });
    }
  });
}