// components/map2d/layers/drawCities.js
import { latLonToPolar } from '@/lib/polarMath';
import { WORLD_CITIES } from '@/lib/citiesData';

export function drawCities(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  zoom = 1,
  selectedCity = null,
  animTime = 0
) {
  if (!activeLayers?.Cities) return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const isNeon = activeLayers?.neonMode ?? true;
  const timeSec = animTime / 1000;

  // Tamaño de fuente clamping logarítmico
  const fontSize = Math.round(Math.min(Math.max(8 * Math.pow(zoom, 0.35), 8), 13));
  ctx.font = `600 ${fontSize}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  WORLD_CITIES.forEach((city) => {
    // Nivel de detalle (LOD): Ciudades tier 2 solo aparecen con zoom >= 1.8x   
    if (zoom < 1.3 && city.tier > 1) return;
    if (zoom < 2.4 && city.tier > 2) return;    
    const { x, y } = latLonToPolar(city.lat, city.lon, mapRadius, rotation);
    const px = centerX + x;
    const py = centerY + y;

    if (isNaN(px) || isNaN(py)) return;

    const isSelected = selectedCity && selectedCity.id === city.id;

    // 1. DIBUJO DEL PUNTO DE LA CIUDAD
    ctx.beginPath();
    ctx.arc(px, py, isSelected ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#ef4444' : isNeon ? '#38bdf8' : '#e2e8f0';

    if (isNeon || isSelected) {
      ctx.shadowColor = isSelected ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = isSelected ? 12 : 6;
    }
    ctx.fill();

    // 2. RENDERIZADO DEL NOMBRE CON DELINEADO DE CONTRASTE
    ctx.shadowBlur = 0;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.lineWidth = 3;
    ctx.strokeText(city.name.toUpperCase(), px + 6, py);

    ctx.fillStyle = isSelected ? '#fef08a' : '#f8fafc';
    ctx.fillText(city.name.toUpperCase(), px + 6, py);

    // 3. ANILLO OBJETIVO ANIMADO PARA LA CIUDAD BUSCADA / SELECCIONADA
    if (isSelected) {
      const pulseProgress = (timeSec * 2) % 1;
      const pulseRadius = 8 + pulseProgress * 16;
      const pulseAlpha = (1 - pulseProgress) * 0.9;

      // Anillo concéntrico expandible
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Cruz reticular táctica sobre el objetivo
      ctx.beginPath();
      ctx.moveTo(px - 14, py); ctx.lineTo(px - 6, py);
      ctx.moveTo(px + 6, py);  ctx.lineTo(px + 14, py);
      ctx.moveTo(px, py - 14); ctx.lineTo(px, py - 6);
      ctx.moveTo(px, py + 6);  ctx.lineTo(px, py + 14);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  });

  ctx.restore();
}