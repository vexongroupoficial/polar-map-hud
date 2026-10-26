import { latLonToPolar } from '@/lib/polarMath';

export function drawContinents(
  ctx, 
  countriesData, 
  centerX, 
  centerY, 
  mapRadius, 
  rotation, 
  zoom, 
  isNeonMode = true
) {
  if (!countriesData || !countriesData.features) return;

  ctx.save();

  if (isNeonMode) {
    // ⚡ MODO NEÓN / HUD CINEMÁTICO (GLOW ACTIVADO)
    ctx.fillStyle = '#0f2942';      // Relleno azul profundo
    ctx.strokeStyle = '#ffffff';    // Línea de costa en blanco nítido
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';    // Resplandor azul cian neón
    ctx.shadowBlur = 10;            // Halo luminoso
  } else {
    // 📐 MODO TÉCNICO / VISTA CARTOGRÁFICA LIMPIA (SIN RESPLANDOR)
    ctx.fillStyle = '#091e32';      // Relleno azul sobrio
    ctx.strokeStyle = '#38bdf8';    // Trazo cian técnico
    ctx.lineWidth = 0.9;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;            // Sin dispersión de luz
  }

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

  ctx.restore();
}