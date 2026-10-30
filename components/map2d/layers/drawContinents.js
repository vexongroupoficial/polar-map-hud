// components/map2d/layers/drawContinents.js
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
    // ⚡ MODO NEÓN: Masa azul marino + Bordes blanco nítido con Resplandor Cian
    ctx.fillStyle = '#0f2942';      // Masa terrestre azul profundo
    ctx.strokeStyle = '#3ed1db';    // Línea de costa en blanco nítido
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';    // Resplandor cian eléctrico
    ctx.shadowBlur = 10;            // Halo luminoso alrededor de las costas
  } else {
    // 📐 MODO TÉCNICO: Trazo cian técnico sobrio sin dispersión ni sombras
    ctx.fillStyle = '#061526';      // Masa terrestre azul oscuro cartográfico
    ctx.strokeStyle = '#38bdf8';    // Delineado cian plano sin brillo
    ctx.lineWidth = 0.9;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;             // Desactiva el brillo/glow completamente
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