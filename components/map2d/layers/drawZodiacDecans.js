// components/map2d/layers/drawZodiacDecans.js
import { latLonToPolar } from '@/lib/polarMath';

const ZODIAC_HOUSES = [
  { name: 'PISCIS', symbol: '♓', startDeg: 330, endDeg: 360, color: '#38bdf8' },
  { name: 'ACUARIO', symbol: '♒', startDeg: 300, endDeg: 330, color: '#22d3ee' },
  { name: 'CAPRICORNIO', symbol: '♑', startDeg: 270, endDeg: 300, color: '#94a3b8' },
  { name: 'SAGITARIO', symbol: '♐', startDeg: 240, endDeg: 270, color: '#fbbf24' },
  { name: 'ESCORPIO', symbol: '♏', startDeg: 210, endDeg: 240, color: '#e11d48' },
  { name: 'LIBRA', symbol: '♎', startDeg: 180, endDeg: 210, color: '#f472b6' },
  { name: 'VIRGO', symbol: '♍', startDeg: 150, endDeg: 180, color: '#a7f3d0' },
  { name: 'LEO', symbol: '♌', startDeg: 120, endDeg: 150, color: '#fb923c' },
  { name: 'CÁNCER', symbol: '♋', startDeg: 90, endDeg: 120, color: '#c084fc' },
  { name: 'GÉMINIS', symbol: '♊', startDeg: 60, endDeg: 90, color: '#fef08a' },
  { name: 'TAURO', symbol: '♉', startDeg: 30, endDeg: 60, color: '#4ade80' },
  { name: 'ARIES', symbol: '♈', startDeg: 0, endDeg: 30, color: '#f87171' },
];

export function drawZodiacDecans(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  timeMs = Date.now()
) {
  const showHouses = activeLayers?.zodiacHouses;
  const showDecans = activeLayers?.decans;

  if (!showHouses && !showDecans) return;

  ctx.save();

  const rOuter = mapRadius * 1.18;
  const rMid = mapRadius * 1.06;
  const rInner = mapRadius * 0.98;
  const rotRad = (rotation * Math.PI) / 180;

  if (showHouses) {
    ctx.save();
    ZODIAC_HOUSES.forEach((house) => {
      const startAngle = (house.startDeg * Math.PI) / 180 + rotRad;
      const endAngle = (house.endDeg * Math.PI) / 180 + rotRad;

      ctx.beginPath();
      ctx.arc(centerX, centerY, rOuter, startAngle, endAngle);
      ctx.arc(centerX, centerY, rInner, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fill();
      ctx.strokeStyle = house.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      ctx.stroke();

      const midAngle = (startAngle + endAngle) / 2;
      const labelR = (rInner + rOuter) / 2;
      const lx = centerX + labelR * Math.cos(midAngle);
      const ly = centerY + labelR * Math.sin(midAngle);

      ctx.globalAlpha = 1.0;
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = house.color;
      ctx.shadowColor = house.color;
      ctx.shadowBlur = 8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${house.symbol} ${house.name}`, lx, ly);
    });
    ctx.restore();
  }

  if (showDecans) {
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1;

    for (let deg = 0; deg < 360; deg += 10) {
      const angle = (deg * Math.PI) / 180 + rotRad;
      const x1 = centerX + rInner * Math.cos(angle);
      const y1 = centerY + rInner * Math.sin(angle);
      const x2 = centerX + rMid * Math.cos(angle);
      const y2 = centerY + rMid * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

export default drawZodiacDecans;