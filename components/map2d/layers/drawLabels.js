import { latLonToPolar } from '@/lib/polarMath';

// Centroides y desplazamientos optimizados para etiquetas continentales
const CONTINENT_LABELS = [
  { name: 'AMÉRICA DEL NORTE', lat: 40, lon: -100 },
  { name: 'AMÉRICA DEL SUR', lat: -15, lon: -60 },
  { name: 'EUROPA', lat: 48, lon: 15 },
  { name: 'ÁFRICA', lat: 5, lon: 20 },
  { name: 'ASIA', lat: 45, lon: 85 },
  { name: 'OCEANÍA', lat: -22, lon: 135 },
  { name: 'ANTÁRTIDA', lat: -82, lon: -45 },
];

export function drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, rotation, zoom) {
  if (!activeLayers?.labels) return;

  // --- 1. ETIQUETAS DE CONTINENTES ---
  if (activeLayers?.continentLabels !== false) {
    ctx.fillStyle = '#38bdf8'; // Azul cian brillante
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    CONTINENT_LABELS.forEach((cont) => {
      const { x, y, thetaRad } = latLonToPolar(cont.lat, cont.lon, mapRadius, rotation);
      const drawX = centerX + x;
      const drawY = centerY + y;

      ctx.save();
      ctx.translate(drawX, drawY);

      // Rotación adaptativa de lectura
      let angle = thetaRad + Math.PI / 2;
      if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        angle += Math.PI;
      }
      ctx.rotate(angle);

      const fontSize = Math.max(9, Math.min(16, 11 * Math.sqrt(zoom)));
      ctx.font = `bold ${fontSize}px sans-serif`;

      // Sombra oscura para destacar sobre masa continental y gráticual
      ctx.shadowColor = '#020617';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(cont.name, 0, 0);
      ctx.restore();
    });
  }

  // --- 2. ETIQUETAS DE PAÍSES (Aparecen al acercarse con Zoom >= 1.5x) ---
  if (countriesData && zoom >= 1.5) {
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    countriesData.features.forEach((feature) => {
      const name = feature.properties?.ADMIN || feature.properties?.NAME || '';
      const bbox = feature.bbox;

      let lat, lon;
      if (bbox && bbox.length >= 4) {
        lon = (bbox[0] + bbox[2]) / 2;
        lat = (bbox[1] + bbox[3]) / 2;
      } else if (feature.geometry?.coordinates) {
        const coords = feature.geometry.type === 'Polygon'
          ? feature.geometry.coordinates[0][0]
          : feature.geometry.coordinates[0][0][0];
        lon = coords[0];
        lat = coords[1];
      }

      if (lat === undefined || lon === undefined) return;

      const { x, y, thetaRad } = latLonToPolar(lat, lon, mapRadius, rotation);
      const drawX = centerX + x;
      const drawY = centerY + y;

      ctx.save();
      ctx.translate(drawX, drawY);

      let angle = thetaRad + Math.PI / 2;
      if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        angle += Math.PI;
      }
      ctx.rotate(angle);

      const fontSize = Math.max(8, Math.min(12, 8.5 * Math.sqrt(zoom - 0.5)));
      ctx.font = `${fontSize}px sans-serif`;

      ctx.shadowColor = '#020617';
      ctx.shadowBlur = 4;
      ctx.fillText(name, 0, 0);
      ctx.restore();
    });
  }
}