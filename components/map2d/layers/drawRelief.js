import { latLonToPolar } from '@/lib/polarMath';

export function drawRelief(ctx, reliefData, centerX, centerY, mapRadius, rotation, zoom) {
  if (!reliefData) return;

  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = Math.max(0.3, 0.6 / Math.sqrt(zoom));

  reliefData.features.forEach((feature) => {
    const { geometry, properties } = feature;
    if (!geometry) return;

    const featureType = properties?.featurecla || '';
    if (
      featureType.includes('Sierra') ||
      featureType.includes('Range') ||
      featureType.includes('Plateau') ||
      featureType.includes('Mountains')
    ) {
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
    }
  });
}