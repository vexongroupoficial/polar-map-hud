import { latLonToPolar } from '@/lib/polarMath';

/**
 * Calcula la posición aproximada de la Luna y su fase (0 a 1)
 */
function getMoonPositionAndPhase(date = new Date()) {
  const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 * 3600 * 1000;
  // Ciclo sinódico lunar aproximado = 29.53 días
  const lunarCycle = 29.5305877057;
  const knownNewMoon = new Date(2000, 0, 6); // Luna nueva de referencia
  const daysSinceNew = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phaseFraction = (daysSinceNew % lunarCycle) / lunarCycle; // 0 = Nueva, 0.5 = Llena

  // Posición simulada en órbita alrededor de la Tierra sobre el plano polar
  const moonLon = (phaseFraction * 360 - 180) % 360;
  const moonLat = -15 * Math.sin((phaseFraction * 2 * Math.PI)); // Oscilación orbital

  return { lat: moonLat, lon: moonLon, phase: phaseFraction };
}

/**
 * Dibuja el Analema (Figura de 8 del Sol durante el año)
 */
function drawAnalemma(ctx, centerX, centerY, mapRadius, rotation) {
  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'; // Dorado translúcido
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 2]);

  ctx.beginPath();
  for (let d = 0; d < 365; d += 3) {
    // Aproximación matemática del Analema (Declinación vs Ecuación del Tiempo)
    const t = (d / 365) * 2 * Math.PI;
    const declination = 23.44 * Math.sin(t); // Inclinación axial
    const eqTime = -7.65 * Math.sin(t) + 9.87 * Math.sin(2 * t + 2.06); // Ecuación del tiempo en minutos convertida a grados

    const lat = declination;
    const lon = eqTime * 0.25; // Escala de longitud

    const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
    const drawX = centerX + x;
    const drawY = centerY + y;

    if (d === 0) ctx.moveTo(drawX, drawY);
    else ctx.lineTo(drawX, drawY);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Renderizador Principal de la capa Astronómica Avanzada (Sol, Luna y Analema)
 */
export function drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.sunlight) return;

  const now = new Date();

  // 1. DIBUJAR ANALEMA
  if (activeLayers?.analemma) {
    drawAnalemma(ctx, centerX, centerY, mapRadius, rotation);
  }

  // 2. DIBUJAR LA LUNA
  if (activeLayers?.moon) {
    const moon = getMoonPositionAndPhase(now);
    const { x, y } = latLonToPolar(moon.lat, moon.lon, mapRadius, rotation);
    const moonX = centerX + x;
    const moonY = centerY + y;

    ctx.save();
    // Halo lunar
    const gradient = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 14);
    gradient.addColorStop(0, 'rgba(226, 232, 240, 0.9)');
    gradient.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 14, 0, 2 * Math.PI);
    ctx.fill();

    // Cuerpo de la Luna
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Etiqueta de Fase Lunar
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const phaseName = moon.phase < 0.05 || moon.phase > 0.95 ? 'Luna Nueva' :
                      moon.phase < 0.25 ? 'Creciente' :
                      moon.phase < 0.3 ? 'Cuarto Creciente' :
                      moon.phase < 0.5 ? 'Gibosa Creciente' :
                      moon.phase < 0.55 ? 'Luna Llena' :
                      moon.phase < 0.75 ? 'Gibosa Menguante' :
                      moon.phase < 0.8 ? 'Cuarto Menguante' : 'Menguante';

    ctx.fillText(`🌙 ${phaseName} (${Math.round(moon.phase * 100)}%)`, moonX + 12, moonY + 3);
    ctx.restore();
  }
}