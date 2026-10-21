import { latLonToPolar } from '@/lib/polarMath';

/**
 * Calcula la posición subsolar (latitud y longitud donde el Sol cae verticalmente)
 */
function getSubsolarPoint(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
  
  // Declinación aproximada del sol (-23.45° a +23.45°)
  const lat = -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  
  // Longitud subsolar basada en la hora UTC (12:00 UTC = Longitud 0°)
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lon = (12 - utcHours) * 15;

  return { lat, lon };
}

export function drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.sunlight) return;

  const now = new Date();
  const subsolar = getSubsolarPoint(now);

  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.55)'; // Sombra de noche translúcida

  // Trazado circular de la zona nocturna sobre la gráticual polar
  ctx.beginPath();
  for (let angle = 0; angle <= 360; angle += 2) {
    const lon = angle - 180;
    // Cálculo simplificado del límite del día/noche (terminador solar)
    const subsolarRad = (subsolar.lat * Math.PI) / 180;
    const lonDiffRad = ((lon - subsolar.lon) * Math.PI) / 180;
    
    // Latitud donde el Sol está en el horizonte
    let lat = Math.atan(-Math.cos(lonDiffRad) / Math.tan(subsolarRad)) * (180 / Math.PI);
    if (isNaN(lat)) lat = 0;

    const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
    const drawX = centerX + x;
    const drawY = centerY + y;

    if (angle === 0) {
      ctx.moveTo(drawX, drawY);
    } else {
      ctx.lineTo(drawX, drawY);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Dibujar ícono/marcador del Sol en su punto subsolar
  const sunPos = latLonToPolar(subsolar.lat, subsolar.lon, mapRadius, rotation);
  ctx.beginPath();
  ctx.arc(centerX + sunPos.x, centerY + sunPos.y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
}