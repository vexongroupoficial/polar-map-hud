// components/map2d/layers/drawOceanBasins.js
import { latLonToPolar } from '@/lib/polarMath';
import { OCEAN_TELEMETRY } from '@/lib/oceanData';

export function drawOceanBasins(
  ctx,
  oceanGeoJSON,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1,
  selectedOceanId = null,
  animTime = 0
) {
  if (!activeLayers?.oceans || !oceanGeoJSON?.features) return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const isNeon = activeLayers?.neonMode ?? true;

  oceanGeoJSON.features.forEach((feature) => {
    const props = feature.properties || {};
    const oceanId = props.id || props.OCEAN_ID;
    const telemetry = OCEAN_TELEMETRY[oceanId] || {
      name: props.NAME || 'CUENCA OCEÁNICA',
      color: 'rgba(56, 189, 248, 0.15)',
      strokeColor: '#38bdf8',
    };

    const isSelected = selectedOceanId === oceanId;

    // Función auxiliar para proyectar cada anillo de coordenadas polares
    const drawPolygonRing = (ringCoords) => {
      ctx.beginPath();
      ringCoords.forEach(([lon, lat], idx) => {
        const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
        const px = centerX + x;
        const py = centerY + y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // Relleno reactivo a la selección
      ctx.fillStyle = isSelected
        ? 'rgba(56, 189, 248, 0.40)'
        : isNeon
        ? telemetry.color
        : 'rgba(15, 23, 42, 0.3)';

      if (isSelected && isNeon) {
        ctx.shadowColor = telemetry.strokeColor;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();

      // Trazado de límites costeros/oceánicos
      ctx.strokeStyle = isSelected ? '#ffffff' : telemetry.strokeColor;
      ctx.lineWidth = isSelected ? 2.0 : 0.8;
      ctx.setLineDash(isSelected ? [6, 3] : [3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Procesar geometría GeoJSON (Polygon / MultiPolygon)
    const geometry = feature.geometry;
    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach(drawPolygonRing);
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((poly) => poly.forEach(drawPolygonRing));
    }
  });

  ctx.restore();
}