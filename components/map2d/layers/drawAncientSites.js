import { latLonToPolar } from '@/lib/polarMath';

/**
 * Base de datos con coordenadas geodésicas (Latitud, Longitud)
 * de las principales pirámides y monumentos megalíticos del planeta.
 */
export const ANCIENT_SITES = [
  // PIRÁMIDES Y MONUMENTOS DE AMÉRICA
  { name: 'Teotihuacán (Sol y Luna)', lat: 19.6925, lon: -98.8437, region: 'Mesoamérica', icon: '🔺' },
  { name: 'Chichén Itzá (Kukulkán)', lat: 20.6843, lon: -88.5678, region: 'Mesoamérica', icon: '🔺' },
  { name: 'Tikal (Pirámide del Gran Jaguar)', lat: 17.2220, lon: -89.6237, region: 'Mesoamérica', icon: '🔺' },
  { name: 'Palenque (Templo Inscripciones)', lat: 17.4838, lon: -92.0461, region: 'Mesoamérica', icon: '🔺' },
  { name: 'Caral (Pirámides Sagradas)', lat: -10.8931, lon: -77.5203, region: 'Sudamérica', icon: '🔺' },
  { name: 'Machu Picchu / Saqsayhuamán', lat: -13.1631, lon: -72.5450, region: 'Sudamérica', icon: '🏛️' },
  { name: 'Puma Punku / Tiwanaku', lat: -16.5550, lon: -68.6795, region: 'Sudamérica', icon: '🗿' },
  { name: 'Moáis de Rapa Nui', lat: -27.1212, lon: -109.3497, region: 'Oceanía', icon: '🗿' },

  // PIRÁMIDES Y MONUMENTOS DE ÁFRICA Y ORIENTE MEDIO
  { name: 'Pirámides de Guiza', lat: 29.9792, lon: 31.1342, region: 'Egipto', icon: '🔺' },
  { name: 'Pirámide Escalonada de Saqqara', lat: 29.8713, lon: 31.2164, region: 'Egipto', icon: '🔺' },
  { name: 'Pirámides Nubias de Meroe', lat: 16.9380, lon: 33.7480, region: 'Sudán', icon: '🔺' },
  { name: 'Gran Zigurat de Ur', lat: 30.9628, lon: 46.1031, region: 'Mesopotamia', icon: '🏛️' },
  { name: 'Göbekli Tepe', lat: 37.2231, lon: 38.9225, region: 'Anatolia', icon: '🏛️' },
  { name: 'Monte Nemrut', lat: 37.9806, lon: 38.7408, region: 'Anatolia', icon: '🗿' },

  // ASIA Y EUROPA
  { name: 'Pirámides chinas de Xi\'an', lat: 34.3739, lon: 108.9811, region: 'Asia Oriental', icon: '🔺' },
  { name: 'Angkor Wat', lat: 13.4125, lon: 103.8670, region: 'Sudeste Asiático', icon: '🛕' },
  { name: 'Borobudur', lat: -7.6079, lon: 110.2038, region: 'Sudeste Asiático', icon: '🛕' },
  { name: 'Templo de Brihadisvara', lat: 10.7828, lon: 79.1318, region: 'India', icon: '🛕' },
  { name: 'Estructura Sumergida de Yonaguni', lat: 24.4331, lon: 123.0075, region: 'Pacífico', icon: '🌊' },
  { name: 'Stonehenge', lat: 51.1789, lon: -1.8262, region: 'Europa', icon: '🪨' },
  { name: 'Pirámide de Cayo Cestio', lat: 41.8765, lon: 12.4808, region: 'Europa', icon: '🔺' },
];

export function drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, rotation = 0, zoom = 1) {
  if (!activeLayers?.ancientSites && !activeLayers?.pyramids) return;

  ctx.save();

  ANCIENT_SITES.forEach((site) => {
    // Proyección de coordenadas geodésicas (lat, lon) a coordenadas polares del Canvas
    const p = latLonToPolar(site.lat, site.lon, mapRadius, rotation);
    const x = centerX + p.x;
    const y = centerY + p.y;

    // Descartar si queda fuera del disco
    const distToCenter = Math.hypot(p.x, p.y);
    if (distToCenter > mapRadius + 10) return;

    // A. Halo Resplandeciente Dorado
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.fill();

    // B. Marcador del Sitio (Pirámide / Diamante)
      ctx.beginPath();
      ctx.moveTo(x, y - 7);
      ctx.lineTo(x + 7, y);
      ctx.lineTo(x, y + 7);
      ctx.lineTo(x - 7, y);
      ctx.closePath();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Punto Central Resplandeciente
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();

    // C. Etiqueta con el Nombre del Monumento (Se adapta con Zoom)
if (zoom >= 0.95) {
  ctx.font = 'bold 9px monospace';
  const labelText = `${site.name.toUpperCase()}`;
  const coordsText = `${site.lat.toFixed(1)}°N ${site.lon.toFixed(1)}°E`;

  // Placa oscura tipo HUD
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.fillRect(x + 10, y - 10, 120, 22);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 10, y - 10, 120, 22);

  ctx.fillStyle = '#fbbf24';
  ctx.fillText(labelText, x + 14, y - 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '8px monospace';
  ctx.fillText(coordsText, x + 14, y + 8);
}

  });

  ctx.restore();
}