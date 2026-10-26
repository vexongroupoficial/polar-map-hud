import { latLonToPolar } from '@/lib/polarMath';

// CORREDORES MIGRATORIOS GLOBALES PRINCIPALES
const MIGRATION_CORRIDORS = [
  {
    id: 'mesoamerica_usa',
    name: 'CORREDOR MESOAMÉRICA - NORTEAMÉRICA',
    origin: { lat: 9, lon: -79, label: 'Centroamérica / Darién' },
    destination: { lat: 32, lon: -106, label: 'Norteamérica' },
    curvature: 0.25,
    color: '#f97316', // Naranja Neón
    glowColor: '#fb923c',
    intensity: 1.0,
  },
  {
    id: 'mediterranean_europe',
    name: 'CORREDOR TRANSMEDITERRÁNEO',
    origin: { lat: 25, lon: 15, label: 'África del Norte' },
    destination: { lat: 42, lon: 12, label: 'Europa Meridional' },
    curvature: -0.2,
    color: '#f43f5e', // Rosa Neón
    glowColor: '#fb7185',
    intensity: 0.9,
  },
  {
    id: 'middle_east_europe',
    name: 'RUTA ORIENTAL / BALCÁNICA',
    origin: { lat: 33, lon: 36, label: 'Medio Oriente' },
    destination: { lat: 48, lon: 16, label: 'Europa Central' },
    curvature: 0.2,
    color: '#fbbf24', // Ámbar
    glowColor: '#fde047',
    intensity: 0.85,
  },
  {
    id: 'south_asia_gulf',
    name: 'CORREDOR SUR ASIA - GOLFO',
    origin: { lat: 20, lon: 78, label: 'Sur de Asia' },
    destination: { lat: 24, lon: 54, label: 'Península Arábiga' },
    curvature: -0.18,
    color: '#38bdf8', // Cian
    glowColor: '#7dd3fc',
    intensity: 0.8,
  },
  {
    id: 'south_america_routes',
    name: 'FLUJO SUDAMÉRICA',
    origin: { lat: 7, lon: -66, label: 'Sudamérica Norte' },
    destination: { lat: -33, lon: -70, label: 'Cono Sur' },
    curvature: 0.22,
    color: '#a855f7', // Púrpura Neón
    glowColor: '#c084fc',
    intensity: 0.75,
  },
  {
    id: 'asia_pacific_oceania',
    name: 'RUTA ASIA - OCEANÍA',
    origin: { lat: 14, lon: 121, label: 'Sudeste Asiático' },
    destination: { lat: -25, lon: 133, label: 'Australia / Pacífico' },
    curvature: -0.25,
    color: '#2dd4bf', // Turquesa
    glowColor: '#5eead4',
    intensity: 0.7,
  },
];

export function drawMigrationFlows(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  time = Date.now()
) {
  // Detección flexible de la clave activa proveniente del menú lateral
  const isEnabled = 
    activeLayers?.migrationRoutes || 
    activeLayers?.migrationFlows || 
    activeLayers?.migration || 
    activeLayers?.historicRoutes;

  if (!isEnabled) return;

  ctx.save();

  MIGRATION_CORRIDORS.forEach((corridor) => {
    const origPolar = latLonToPolar(corridor.origin.lat, corridor.origin.lon, mapRadius, rotation);
    const destPolar = latLonToPolar(corridor.destination.lat, corridor.destination.lon, mapRadius, rotation);

    const x1 = centerX + origPolar.x;
    const y1 = centerY + origPolar.y;
    const x2 = centerX + destPolar.x;
    const y2 = centerY + destPolar.y;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;

    const ctrlX = midX - dy * corridor.curvature;
    const ctrlY = midY + dx * corridor.curvature;

    // 1. Arco guía translúcido
    ctx.save();
    ctx.strokeStyle = corridor.color;
    ctx.lineWidth = 1.4 * corridor.intensity;
    ctx.globalAlpha = 0.4;
    ctx.shadowColor = corridor.glowColor;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    ctx.stroke();
    ctx.restore();

    // 2. Partículas animadas
    const particleCount = 4;
    const flowSpeed = 0.0004;

    for (let p = 0; p < particleCount; p++) {
      const t = ((time * flowSpeed) + (p / particleCount)) % 1;

      const px = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * ctrlX + Math.pow(t, 2) * x2;
      const py = Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * ctrlY + Math.pow(t, 2) * y2;

      const pAlpha = Math.sin(t * Math.PI);

      ctx.save();
      ctx.fillStyle = corridor.glowColor;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = pAlpha * 0.95;

      ctx.beginPath();
      ctx.arc(px, py, 2.5 * corridor.intensity, 0, Math.PI * 2);
      ctx.fill();

      // Estela
      const prevT = Math.max(0, t - 0.05);
      const prevPx = Math.pow(1 - prevT, 2) * x1 + 2 * (1 - prevT) * prevT * ctrlX + Math.pow(prevT, 2) * x2;
      const prevPy = Math.pow(1 - prevT, 2) * y1 + 2 * (1 - prevT) * prevT * ctrlY + Math.pow(prevT, 2) * y2;

      ctx.strokeStyle = corridor.color;
      ctx.lineWidth = 2.0 * corridor.intensity;
      ctx.globalAlpha = pAlpha * 0.6;

      ctx.beginPath();
      ctx.moveTo(prevPx, prevPy);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.restore();
    }

    // 3. Nodo de Origen
    const pulseRadius = 3 + Math.sin(time * 0.004 + origPolar.x) * 2;
    ctx.save();
    ctx.strokeStyle = corridor.color;
    ctx.fillStyle = corridor.glowColor;
    ctx.shadowColor = corridor.color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(x1, y1, Math.max(1, pulseRadius + 3), 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Nodo de Destino
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = corridor.glowColor;
    ctx.shadowColor = corridor.glowColor;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(x2, y2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Etiquetas tácticas HUD
    ctx.save();
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const origText = `🚩 ${corridor.origin.label.toUpperCase()}`;
    const twOrig = ctx.measureText(origText).width;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
    ctx.strokeStyle = corridor.color;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(x1 - twOrig / 2 - 4, y1 - 15, twOrig + 8, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.fillText(origText, x1, y1 - 9);

    const destText = `🎯 ${corridor.destination.label.toUpperCase()}`;
    const twDest = ctx.measureText(destText).width;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
    ctx.strokeStyle = corridor.glowColor;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(x2 - twDest / 2 - 4, y2 + 5, twDest + 8, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.fillText(destText, x2, y2 + 11);

    ctx.restore();
  });

  ctx.restore();
}