import { latLonToPolar } from '@/lib/polarMath';

// Lista principal de Continentes con centroides geográficos
const CONTINENT_LABELS = [
  { name: 'AMÉRICA DEL NORTE', lat: 42, lon: -100, minZoom: 0.8, maxZoom: 3.0 },
  { name: 'AMÉRICA DEL SUR', lat: -15, lon: -60, minZoom: 0.8, maxZoom: 3.0 },
  { name: 'EUROPA', lat: 50, lon: 15, minZoom: 0.8, maxZoom: 3.2 },
  { name: 'ÁFRICA', lat: 2, lon: 20, minZoom: 0.8, maxZoom: 3.0 },
  { name: 'ASIA', lat: 45, lon: 90, minZoom: 0.8, maxZoom: 2.8 },
  { name: 'OCEANÍA', lat: -25, lon: 135, minZoom: 0.8, maxZoom: 3.2 },
  { name: 'ANTÁRTIDA', lat: -80, lon: 0, minZoom: 0.8, maxZoom: 3.5 },
];

/**
 * Calcula un tamaño de fuente que escala de forma logarítmica/suave
 * evitando que la letra crezca desproporcionadamente o sea ilegible.
 */
function getClampedFontSize(baseSize, zoom, minPx = 9, maxPx = 18) {
  const computed = baseSize * Math.pow(zoom, 0.35);
  return Math.round(Math.min(Math.max(computed, minPx), maxPx));
}

/**
 * Dibuja texto con contorno (Stroke + Fill) para garantizar 100% de contraste
 * sobre cualquier fondo (océanos neón, continentes o geometría sagrada).
 */
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawLabels(
  ctx,
  countriesData,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1
) {
  if (!activeLayers?.labels) return;

  ctx.save();

  // 1. MÁSCARA DE RECORTE ESTRICTA DEL MAPA POLAR
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const isNeon = activeLayers?.neonMode ?? true;

  // =========================================================================
  // 1. ETIQUETAS DE CONTINENTES (Desvanecimiento suave al acercar el zoom)
  // =========================================================================
  if (activeLayers?.continentLabels !== false && zoom < 3.2) {
    ctx.save();
    
    // Transición de opacidad para ceder espacio a las etiquetas de países
    const opacity = zoom > 2.0 ? Math.max(0, 1 - (zoom - 2.0) * 0.8) : 1;
    ctx.globalAlpha = opacity;

    const fontSize = getClampedFontSize(12, zoom, 10, 18);
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isNeon ? '#38bdf8' : '#e2e8f0'; // Azul cian neón o blanco marfil

    CONTINENT_LABELS.forEach((cont) => {
      if (zoom < cont.minZoom || zoom > cont.maxZoom) return;

      const { x, y } = latLonToPolar(cont.lat, cont.lon, mapRadius, rotation);
      const dist = Math.hypot(x, y);
      if (dist > mapRadius - 10) return; // Evitar bordes exteriores

      const drawX = centerX + x;
      const drawY = centerY + y;

      // Renderizado con contorno para contraste perfecto sobre continentes
      drawTextWithOutline(ctx, cont.name, drawX, drawY, '#020617', 4);
    });

    ctx.restore();
  }

  // =========================================================================
  // 2. ETIQUETAS DE PAÍSES (Aparición progresiva según Nivel de Detalle / LOD)
  // =========================================================================
  if (countriesData?.features && zoom >= 1.2) {
    ctx.save();

    // Transición de entrada (Fade-in) entre zoom 1.2x y 1.5x
    const countryOpacity = Math.min(1, (zoom - 1.2) / 0.3);
    ctx.globalAlpha = countryOpacity;

    const fontCountrySize = getClampedFontSize(9, zoom, 8, 14);
    ctx.font = `bold ${fontCountrySize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8fafc';

    countriesData.features.forEach((feature) => {
      const props = feature.properties || {};
      const name = props.name || props.ADMIN || props.NAME;
      if (!name) return;

      // --- FILTRADO DE NIVEL DE DETALLE (LOD) ---
      // Si la característica tiene ranking o estimación de población, filtramos
      // territorios pequeños en zooms lejanos para evitar amontonamiento.
      const labelRank = props.LABELRANK ?? props.labelrank ?? 5;
      const popEst = props.POP_EST ?? props.pop_est ?? 10000000;

      if (zoom < 1.6 && labelRank > 3 && popEst < 20000000) return;
      if (zoom < 2.4 && labelRank > 6 && popEst < 5000000) return;

      // Obtención de coordenadas del centroide
      let lat = props.label_y ?? props.LAT;
      let lon = props.label_x ?? props.LON;

      if (lat === undefined || lon === undefined) {
        const bbox = feature.bbox;
        if (bbox && bbox.length >= 4) {
          lon = (bbox[0] + bbox[2]) / 2;
          lat = (bbox[1] + bbox[3]) / 2;
        } else {
          return;
        }
      }

      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const dist = Math.hypot(x, y);
      if (dist > mapRadius - 8) return; // Fuera del disco geodésico

      const drawX = centerX + x;
      const drawY = centerY + y;

      // Renderizado del nombre en mayúsculas con delineado nítido
      drawTextWithOutline(ctx, name.toUpperCase(), drawX, drawY, 'rgba(2, 6, 23, 0.9)', 3);
    });

    ctx.restore();
  }

  ctx.restore();
}