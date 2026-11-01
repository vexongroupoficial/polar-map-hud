// components/map2d/layers/drawHydrography.js
import { latLonToPolar } from '@/lib/polarMath';
import { GLOBAL_RIVER_BASINS, GLOBAL_RIVERS } from '@/lib/riverData';

// Función auxiliar para dibujar texto con borde negro de alto contraste
function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3.5) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawHydrography(
  ctx,
  activeLayers = {},
  centerX,
  centerY,
  mapRadius,
  rotation = 180,
  isNeon = true,
  animTime = 0
) {
  // 🛑 Verificación de seguridad: Solo dibuja si 'Ríos y Cuencas' está activo
  const showRivers = activeLayers?.rivers ?? activeLayers?.hydrography ?? false;
  if (!showRivers) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number') return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.clip();

  const timeSec = (animTime || Date.now()) / 1000;

  // =========================================================================
  // 1. DIBUJAR CUENCAS HIDROGRÁFICAS (Áreas de Captación Continentales)
  // =========================================================================
  GLOBAL_RIVER_BASINS.forEach((basin) => {
    if (!basin.boundary || basin.boundary.length < 3) return;

    ctx.beginPath();
    basin.boundary.forEach(([lat, lon], idx) => {
      const { x, y } = latLonToPolar(lat, lon, mapRadius, rotation);
      const px = centerX + x;
      const py = centerY + y;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();

    // Relleno sutil neón para delinear el área de la cuenca
    ctx.fillStyle = isNeon ? basin.color : 'rgba(30, 41, 59, 0.2)';
    ctx.fill();

    ctx.strokeStyle = isNeon ? basin.strokeColor : '#64748b';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // =========================================================================
  // 2. DIBUJAR VENAS FLUVIALES (Ríos con grosor progresivo y pulso pausado)
  // =========================================================================
  GLOBAL_RIVERS.forEach((river) => {
    if (!river.path || river.path.length < 2) return;

    // A. Proyectar puntos polares del curso fluvial
    const polarPoints = river.path.map((pt) => {
      const { x, y } = latLonToPolar(pt.lat, pt.lon, mapRadius, rotation);
      return { px: centerX + x, py: centerY + y };
    });

    // B. Renderizado por segmentos con grosor progresivo (efecto "vena")
    for (let i = 0; i < polarPoints.length - 1; i++) {
      const p1 = polarPoints[i];
      const p2 = polarPoints[i + 1];

      // El grosor aumenta de la fuente (inicio) a la desembocadura (final)
      const progress = i / (polarPoints.length - 1);
      const lineWidth = 1.0 + progress * 2.8;

      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);

      ctx.strokeStyle = isNeon ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isNeon) {
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 6;
      }
      ctx.stroke();
    }

    // C. Partícula Flotante Animada (Velocidad reducida para un flujo constante y lento)
    const totalSegments = polarPoints.length - 1;
    const cycle = (timeSec * 0.18) % 1; // 👈 Velocidad desacelerada (0.18 en lugar de 0.6)
    const currentSegmentIndex = Math.floor(cycle * totalSegments);
    const segmentProgress = (cycle * totalSegments) % 1;

    const segStart = polarPoints[currentSegmentIndex];
    const segEnd = polarPoints[Math.min(currentSegmentIndex + 1, totalSegments)];

    if (segStart && segEnd) {
      const particleX = segStart.px + (segEnd.px - segStart.px) * segmentProgress;
      const particleY = segStart.py + (segEnd.py - segStart.py) * segmentProgress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(particleX, particleY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // D. Etiquetas en Blanco con Borde Negro (Igualadas con el estándar visual)
    const midIdx = Math.floor(polarPoints.length / 2);
    const labelPt = polarPoints[midIdx];

    ctx.save();
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff'; // 👈 Letras blancas puras sobre todo el trazado
    
    drawTextWithOutline(ctx, river.name, labelPt.px, labelPt.py - 3, '#020617', 3.5);
    ctx.restore();
  });

  ctx.restore();
}