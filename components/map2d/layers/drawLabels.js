import { latLonToPolar } from '@/lib/polarMath';

// Lista principal de Continentes con centroides geográficos
const CONTINENT_LABELS = [
  { name: 'AMÉRICA DEL NORTE', lat: 42, lon: -100 },
  { name: 'AMÉRICA DEL SUR', lat: -15, lon: -60 },
  { name: 'EUROPA', lat: 50, lon: 15 },
  { name: 'ÁFRICA', lat: 2, lon: 20 },
  { name: 'ASIA', lat: 45, lon: 90 },
  { name: 'OCEANÍA', lat: -25, lon: 135 },
  { name: 'ANTÁRTIDA', lat: -80, lon: 0 },
];

export function drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, rotation, zoom) {
  if (!activeLayers?.labels) return;

  // =========================================================================
  // 1. ETIQUETAS DE CONTINENTES (Siempre visibles, destacan en zoom lejano)
  // =========================================================================
  if (activeLayers?.continentLabels !== false) {
    ctx.save();
    ctx.fillStyle = '#38bdf8'; // Cian brillante
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontContSize = Math.min(Math.max(10, 12 * Math.sqrt(zoom)), 20);
    ctx.font = `bold ${fontContSize}px monospace`;
    ctx.shadowColor = '#020617';
    ctx.shadowBlur = 6;

    CONTINENT_LABELS.forEach((cont) => {
      const { x, y, thetaRad } = latLonToPolar(cont.lat, cont.lon, mapRadius, rotation);
      const drawX = centerX + x;
      const drawY = centerY + y;

      ctx.save();
      ctx.translate(drawX, drawY);

      // Rotación adaptativa para lectura horizontal/radial
      let angle = thetaRad + Math.PI / 2;
      if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        angle += Math.PI;
      }
      ctx.rotate(angle);

      ctx.fillText(cont.name, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  // =========================================================================
  // 2. ETIQUETAS DE PAÍSES (Aparecen limpiamente con zoom >= 1.4x)
  // =========================================================================
  if (countriesData?.features && zoom >= 1.4) {
    ctx.save();
    ctx.fillStyle = '#f8fafc'; // Blanco / Gris claro
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontCountrySize = Math.min(Math.max(9, 7.5 * Math.sqrt(zoom)), 15);
    ctx.font = `bold ${fontCountrySize}px monospace`;
    ctx.shadowColor = '#020617';
    ctx.shadowBlur = 5;

    countriesData.features.forEach((feature) => {
      const props = feature.properties || {};
      const name = props.name || props.ADMIN || props.NAME;
      if (!name) return;

      // Obtener latitud y longitud del centroide o propiedad
      let lat = props.label_y ?? props.LAT;
      let lon = props.label_x ?? props.LON;

      // Fallback a Bounding Box si no tiene propiedad LAT/LON
      if (lat === undefined || lon === undefined) {
        const bbox = feature.bbox;
        if (bbox && bbox.length >= 4) {
          lon = (bbox[0] + bbox[2]) / 2;
          lat = (bbox[1] + bbox[3]) / 2;
        } else {
          return;
        }
      }

      const { x, y, thetaRad } = latLonToPolar(lat, lon, mapRadius, rotation);
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

      ctx.fillText(name.toUpperCase(), 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }
}