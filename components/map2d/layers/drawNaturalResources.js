import { latLonToPolar } from '@/lib/polarMath';

// Puntos de interés de recursos estratégicos globales
const RESOURCES_DATA = [
  // --- PETRÓLEO Y GAS (Ámbar / Verde fluorescente) ---
  { id: 'orinoco', name: 'Faja del Orinoco (Venezuela)', lat: 8.5, lon: -63.5, type: 'oil', sub: 'Petróleo Extra Pesado' },
  { id: 'ghawar', name: 'Campo Ghawar (Arabia Saudita)', lat: 25.4, lon: 49.6, type: 'oil', sub: 'Reserva de Crudo' },
  { id: 'urengoy', name: 'Campo Urengoy / Siberia (Rusia)', lat: 66.0, lon: 78.0, type: 'gas', sub: 'Gas Natural Ártico' },
  { id: 'permian', name: 'Cuenca Permiana / Texas (EE. UU.)', lat: 31.8, lon: -102.3, type: 'oil', sub: 'Shale Oil / Gas' },
  
  // --- DIAMANTES (Cian / Blanco Neón) ---
  { id: 'mir', name: 'Mina Mir / Yakutia (Rusia)', lat: 62.53, lon: 113.9, type: 'diamond', sub: 'Diamantes Árticos' },
  { id: 'diavik', name: 'Mina Diavik (Canadá)', lat: 64.5, lon: -110.3, type: 'diamond', sub: 'Diamantes del Norte' },
  { id: 'argyle', name: 'Mina Argyle (Australia)', lat: -16.7, lon: 128.4, type: 'diamond', sub: 'Diamantes Rosa' },
  { id: 'jwaneng', name: 'Mina Jwaneng (Botsuana)', lat: -24.5, lon: 25.5, type: 'diamond', sub: 'Yacimiento Africano' },

  // --- ORO Y LITIO (Dorado / Amarillo Eléctrico) ---
  { id: 'lithium_triangle', name: 'Triángulo del Litio (Salar de Uyuni / Atacama)', lat: -20.2, lon: -67.5, type: 'lithium', sub: 'Reservas de Litio' },
  { id: 'witwatersrand', name: 'Witwatersrand (Sudáfrica)', lat: -26.2, lon: 28.0, type: 'gold', sub: 'Cinturón Aurífero' },
  { id: 'muruntau', name: 'Mina Muruntau (Uzbekistán)', lat: 41.5, lon: 64.5, type: 'gold', sub: 'Mina de Oro a Cielo Abierto' }
];

export function drawNaturalResources(ctx, activeLayers, centerX, centerY, mapRadius, rotation) {
  const showPetroleum = activeLayers?.petroleumGas;
  const showDiamonds = activeLayers?.diamondMines;
  const showGoldLithium = activeLayers?.goldAndLithium;

  if (!showPetroleum && !showDiamonds && !showGoldLithium) return;

  ctx.save();

  RESOURCES_DATA.forEach((res) => {
    // Filtrar por interruptor activo en el Sidebar
    if (res.type === 'oil' || res.type === 'gas') {
      if (!showPetroleum) return;
    } else if (res.type === 'diamond') {
      if (!showDiamonds) return;
    } else if (res.type === 'gold' || res.type === 'lithium') {
      if (!showGoldLithium) return;
    }

    const { x, y } = latLonToPolar(res.lat, res.lon, mapRadius, rotation);
    const drawX = centerX + x;
    const drawY = centerY + y;

    // Configurar color e icono según recurso
    let color = '#f59e0b'; // Ámbar por defecto
    let icon = '🛢️';

    if (res.type === 'oil') {
      color = '#f59e0b';
      icon = '🛢️';
    } else if (res.type === 'gas') {
      color = '#10b981';
      icon = '🔥';
    } else if (res.type === 'diamond') {
      color = '#06b6d4';
      icon = '💎';
    } else if (res.type === 'gold') {
      color = '#eab308';
      icon = '🏆';
    } else if (res.type === 'lithium') {
      color = '#a855f7';
      icon = '⚡';
    }

    // 1. ANILLO PULSANTE Y PUNTO CENTRAL
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(drawX, drawY, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(drawX, drawY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. ETIQUETA TELEMÉTRICA CON FONDO ANTI-SOLAPAMIENTO HUD
    ctx.shadowBlur = 0;
    ctx.font = 'bold 8px monospace';
    
    const titleText = `${icon} ${res.name}`;
    const subText = res.sub;
    
    const titleWidth = ctx.measureText(titleText).width;
    const subWidth = ctx.measureText(subText).width;
    const maxTextWidth = Math.max(titleWidth, subWidth);

    // Orientación según el hemisferio (Evita solapamientos laterales)
    const isWest = res.lon < 0;
    const boxX = isWest ? drawX - maxTextWidth - 14 : drawX + 10;
    const textX = isWest ? drawX - maxTextWidth - 10 : drawX + 12;

    // Dibujar cuadro de fondo (Caja de protección de contraste)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)'; // Fondo azul oscuro ultra opaco
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 0.8;
    
    ctx.beginPath();
    ctx.roundRect(boxX, drawY - 10, maxTextWidth + 8, 22, 3);
    ctx.fill();
    ctx.stroke();

    // Texto del Título
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.fillText(titleText, textX, drawY - 1);

    // Texto Secundario
    ctx.font = '7px monospace';
    ctx.fillStyle = color;
    ctx.fillText(subText, textX, drawY + 8);
  });

  ctx.restore();
}