import { latLonToPolar } from '@/lib/polarMath';

/**
 * Dibuja las zonas horarias UTC alrededor del perímetro exterior de la circunferencia del mapa polar.
 */
function getZoneColor(utcOffset) {
  const normalized = (utcOffset + 12) / 24; // Transición cromática de 0 a 1
  const hue = Math.round(normalized * 360);
  return {
    fill: `hsla(${hue}, 60%, 45%, 0.035)`,       // Relleno ultra translúcido (mantiene legibles los continentes)
    border: `hsla(${hue}, 70%, 60%, 0.25)`,      // Líneas divisorias radiales
    labelBg: `hsla(${hue}, 80%, 10%, 0.92)`,     // Fondo oscuro nítido para la píldora
    labelFg: `hsl(${hue}, 95%, 75%)`,            // Texto brillante de alta visibilidad
    badgeBorder: `hsl(${hue}, 80%, 55%)`,
  };
}

export function drawTimeZones(ctx, activeLayers, centerX, centerY, mapRadius, rotation = 0) {
  if (!activeLayers?.timeZones) return;

  ctx.save();

  // Radio para posicionar los badges fuera del borde exterior del mapa
  const outerPerimeterRadius = mapRadius + 24;

  // 1. DIBUJAR LOS 24 SECTORES RADIALES (15° cada uno)
  for (let i = 0; i < 24; i++) {
    let utc = i <= 12 ? i : i - 24;

    const startLon = utc * 15 - 7.5;
    const endLon = utc * 15 + 7.5;

    const colors = getZoneColor(utc);

    // Convertir orientación a ángulos polares del Canvas
    const angleStart = ((startLon + rotation - 90) * Math.PI) / 180;
    const angleEnd = ((endLon + rotation - 90) * Math.PI) / 180;

    // A. Relleno suave del huso horario
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, mapRadius, angleStart, angleEnd);
    ctx.closePath();
    ctx.fillStyle = colors.fill;
    ctx.fill();

    // B. Línea divisoria radial (de centro a borde exterior)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + mapRadius * Math.cos(angleStart),
      centerY + mapRadius * Math.sin(angleStart)
    );
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. HIGHLIGHT: MERIDIANO DE GREENWICH (UTC 0)
  const angleG0 = ((0 + rotation - 90) * Math.PI) / 180;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + mapRadius * Math.cos(angleG0), centerY + mapRadius * Math.sin(angleG0));
  ctx.strokeStyle = '#34d399'; // Verde esmeralda brillante
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. ETIQUETAS / BADGES UTC EN EL PERÍMETRO EXTERIOR
  for (let utc = -11; utc <= 12; utc++) {
    const centerLon = utc * 15;
    const angleRad = ((centerLon + rotation - 90) * Math.PI) / 180;

    // Posición exacta sobre la circunferencia exterior
    const labelX = centerX + outerPerimeterRadius * Math.cos(angleRad);
    const labelY = centerY + outerPerimeterRadius * Math.sin(angleRad);

    const colors = getZoneColor(utc);
    const labelText = utc === 0 ? 'UTC 0' : utc > 0 ? `UTC+${utc}` : `UTC${utc}`;

    // Tipografía más grande y clara
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    const textMetrics = ctx.measureText(labelText);
    const badgeWidth = textMetrics.width + 12;
    const badgeHeight = 18;

    // Fondo de la Píldora
    ctx.beginPath();
    ctx.roundRect(
      labelX - badgeWidth / 2,
      labelY - badgeHeight / 2,
      badgeWidth,
      badgeHeight,
      5
    );
    ctx.fillStyle = colors.labelBg;
    ctx.fill();
    ctx.strokeStyle = colors.badgeBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Texto de la Zona Horaria
    ctx.fillStyle = utc === 0 ? '#34d399' : colors.labelFg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, labelX, labelY);
  }

  ctx.restore();
}