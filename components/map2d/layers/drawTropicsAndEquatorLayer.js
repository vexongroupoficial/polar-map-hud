// components/map2d/layers/drawTropicsAndEquatorLayer.js
import { latLonToPolar } from '@/lib/polarMath';

/**
 * Dibuja las líneas climáticas y astronómicas clave de latitud:
 * - Círculo Polar Ártico (+66.56°)
 * - Trópico de Cáncer (+23.44°)
 * - Ecuador (0.0°)
 * - Trópico de Capricornio (-23.44°)
 * - Círculo Polar Antártico (-66.56°)
 * 
 * Incluye badges HUD flotantes con placas tácticas y soporte para Modo Neón.
 */
export function drawTropicsAndEquatorLayer(
  ctx,
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true
) {
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const KEY_PARALLELS = [
    {
      id: 'arctic',
      name: 'CÍRCULO POLAR ÁRTICO (+66.56°)',
      lat: 66.56,
      color: '#38bdf8',
      dash: [4, 4],
      lineWidth: 1.2,
    },
    {
      id: 'cancer',
      name: 'TRÓPICO DE CÁNCER (+23.44°)',
      lat: 23.44,
      color: '#fbbf24',
      dash: [6, 4],
      lineWidth: 1.4,
    },
    {
      id: 'equator',
      name: 'ECUADOR (0.0° EQ)',
      lat: 0.0,
      color: '#ef4444',
      dash: [], // Línea sólida destacada
      lineWidth: 2.0,
    },
    {
      id: 'capricorn',
      name: 'TRÓPICO DE CAPRICORNIO (-23.44°)',
      lat: -23.44,
      color: '#f97316',
      dash: [6, 4],
      lineWidth: 1.4,
    },
    {
      id: 'antarctic',
      name: 'CÍRCULO POLAR ANTÁRTICO (-66.56°)',
      lat: -66.56,
      color: '#c084fc',
      dash: [4, 4],
      lineWidth: 1.2,
    },
  ];

  KEY_PARALLELS.forEach((line) => {
    // Conversión de latitud a radio polar: r = mapRadius * (90 - lat) / 180
    const r = mapRadius * ((90 - line.lat) / 180);
    if (r <= 0 || r > mapRadius) return;

    // 1. DIBUJO DEL ANILLO DE LATITUD
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.lineWidth;
    ctx.setLineDash(line.dash);

    if (isNeon) {
      ctx.shadowColor = line.color;
      ctx.shadowBlur = line.lat === 0 ? 10 : 6;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.stroke();
    ctx.setLineDash([]); // Restablecer patrón de línea a continuo

    // 2. PLACAS TÁCTICAS Y BADGES FLOTANTES HUD (Eje Norte-Sur)
    ctx.shadowBlur = 0;
    ctx.font = 'bold 8.5px monospace';
    const labelText = line.name;
    const tw = ctx.measureText(labelText).width;

    // Colocar placas orientadas a 0° y 180° del sistema radial
    [0, 180].forEach((angleDeg) => {
      const rad = ((angleDeg + (rotation - 180)) * Math.PI) / 180;
      const lx = centerX + r * Math.sin(rad);
      const ly = centerY - r * Math.cos(rad);

      if (isNaN(lx) || isNaN(ly)) return;

      // Fondo oscuro de la placa
      ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(lx - tw / 2 - 5, ly - 7, tw + 10, 14, 3);
      } else {
        ctx.rect(lx - tw / 2 - 5, ly - 7, tw + 10, 14);
      }
      ctx.fill();
      ctx.stroke();

      // Texto en blanco brillante
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, lx, ly);
    });
  });

  ctx.restore();
}