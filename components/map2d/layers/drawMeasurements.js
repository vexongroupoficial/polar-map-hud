import { latLonToPolar } from '@/lib/polarMath';

/**
 * Calcula la distancia ortodrómica real en km (Fórmula de Haversine)
 */

// Distancia terrestre en km (Haversine)
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio medio terrestre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.measure || !measurePoints || measurePoints.length === 0) return;

  // 1. Dibujar Puntos Marcados (P1 y P2)
  const projectedPoints = measurePoints.map((point) => {
    const { x, y } = latLonToPolar(point.lat, point.lon, mapRadius, rotation);
    return {
      ...point,
      drawX: centerX + x,
      drawY: centerY + y,
    };
  });

  projectedPoints.forEach((point, index) => {
    ctx.beginPath();
    ctx.arc(point.drawX, point.drawY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = index === 0 ? '#38bdf8' : '#f43f5e'; // P1 Celeste, P2 Rosa
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.shadowColor = '#020617';
    ctx.shadowBlur = 6;
    ctx.fillText(index === 0 ? ' P1' : ' P2', point.drawX + 8, point.drawY - 8);
    ctx.shadowBlur = 0;
  });

  // 2. Trazar línea de medición directa (Interpolación cartesiana en el plano polar)
  if (projectedPoints.length === 2) {
    const p1 = projectedPoints[0];
    const p2 = projectedPoints.length > 1 ? projectedPoints[1] : null;

    if (p2) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);

      ctx.beginPath();
      ctx.moveTo(p1.drawX, p1.drawY);
      ctx.lineTo(p2.drawX, p2.drawY);
      ctx.stroke();
      ctx.restore();

      // Calcular punto medio para mostrar los km en el mapa
      const midX = (p1.drawX + p2.drawX) / 2;
      const midY = (p1.drawY + p2.drawY) / 2;
      const distanceKm = calculateHaversineDistance(p1.lat, p1.lon, p2.lat, p2.lon);

      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      
      const text = `${distanceKm.toLocaleString()} km`;
      ctx.font = 'bold 11px monospace';
      const textWidth = ctx.measureText(text).width;

      // Dibujar etiqueta de texto con fondo oscuro
      ctx.fillRect(midX - textWidth / 2 - 6, midY - 10, textWidth + 12, 20);
      ctx.strokeRect(midX - textWidth / 2 - 6, midY - 10, textWidth + 12, 20);

      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, midX, midY);
      ctx.restore();
    }
  }
}