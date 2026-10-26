import { latLonToPolar } from '@/lib/polarMath';

/**
 * Renderiza la capa de relieve topográfico eliminando líneas huérfanas,
 * artefactos de cierre GeoJSON y diagonales del antimeridiano (±180°).
 */
export function drawRelief(ctx, reliefData, centerX, centerY, mapRadius, rotation, zoom) {
  if (!reliefData || !reliefData.features) return;

  ctx.save();

  // Función interna para trazar líneas continuas sin artefactos
  const drawCleanPath = (coords) => {
    if (!coords || coords.length < 2) return;

    ctx.beginPath();
    let isDrawing = false;

    for (let i = 0; i < coords.length; i++) {
      const [lon, lat] = coords[i];

      // 1. Filtrar puntos de borde sintéticos del GeoJSON (Bounding Box a ±180° o latitud Antártica extrema)
      if (Math.abs(lon) >= 179.5 || lat <= -85) {
        if (isDrawing) {
          ctx.stroke();
          ctx.beginPath();
          isDrawing = false;
        }
        continue;
      }

      // 2. Si el punto anterior existe, cortar trazado en saltos angulares bruscos
      if (i > 0 && isDrawing) {
        const [prevLon, prevLat] = coords[i - 1];

        let dLon = Math.abs(lon - prevLon);
        if (dLon > 180) dLon = 360 - dLon;

        // Si la distancia entre puntos consecutivos salta abruptamente, cortar segmento
        if (dLon > 60 || Math.abs(lat - prevLat) > 40) {
          ctx.stroke();
          ctx.beginPath();
          isDrawing = false;
        }
      }

      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const drawX = centerX + x;
      const drawY = centerY + y;

      if (!isDrawing) {
        ctx.moveTo(drawX, drawY);
        isDrawing = true;
      } else {
        // Interpolación fluida para adaptar segmentos largos a la curvatura polar
        const [prevLon, prevLat] = coords[i - 1];
        let dLon = lon - prevLon;
        while (dLon > 180) dLon -= 360;
        while (dLon < -180) dLon += 360;

        const distance = Math.hypot(dLon, lat - prevLat);

        if (distance > 3) {
          const steps = Math.min(8, Math.max(2, Math.ceil(distance / 2)));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const interpLat = prevLat + t * (lat - prevLat);
            let interpLon = prevLon + t * dLon;
            while (interpLon > 180) interpLon -= 360;
            while (interpLon < -180) interpLon += 360;

            const p = latLonToPolar(interpLat, interpLon, mapRadius, rotation);
            ctx.lineTo(centerX + p.x, centerY + p.y);
          }
        } else {
          ctx.lineTo(drawX, drawY);
        }
      }
    }

    if (isDrawing) {
      ctx.stroke();
    }
  };

  reliefData.features.forEach((feature) => {
    const { geometry, properties } = feature;
    if (!geometry) return;

    // Detectar altura para aplicar la paleta hipsométrica HUD
    const elevation = properties?.elevation || properties?.contour || properties?.level || 1000;

    let strokeColor = '#38bdf8'; // Turquesa cian
    let glowColor = '#38bdf8';
    let blur = 1;

    if (elevation >= 3000) {
      // 🏔️ Altas Cumbres (Andes / Himalayas) - Dorado Neón
      strokeColor = '#fbbf24';
      glowColor = '#f59e0b';
      blur = 4;
    } else if (elevation >= 1500) {
      // ⛰️ Sierras y Mesetas - Verde Esmeralda Neón
      strokeColor = '#34d399';
      glowColor = '#34d399';
      blur = 2;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(0.7, 1.1 * (zoom * 0.7));
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = blur;

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => drawCleanPath(ring));
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((poly) => {
        poly.forEach((ring) => drawCleanPath(ring));
      });
    } else if (geometry.type === 'LineString') {
      drawCleanPath(geometry.coordinates);
    } else if (geometry.type === 'MultiLineString') {
      geometry.coordinates.forEach((line) => drawCleanPath(line));
    }
  });

  ctx.restore();
}