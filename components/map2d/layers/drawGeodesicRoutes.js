import { latLonToPolar } from '@/lib/polarMath';

/**
 * Calcula la distancia ortodrómica en km usando la fórmula de Haversine
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Interpola puntos en la ruta ortodrómica geodésica entre dos coordenadas
 */
function interpolateGeodesicRoute(lat1, lon1, lat2, lon2, steps = 30) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    // Interpolar coordenadas en esfera geodésica
    const lat = lat1 + (lat2 - lat1) * f;
    const lon = lon1 + (lon2 - lon1) * f;
    points.push({ lat, lon });
  }
  return points;
}

export function drawGeodesicRoutes(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, rotation) {
  if (!activeLayers?.measure || measurePoints.length < 2) return;

  ctx.save();

  for (let i = 0; i < measurePoints.length - 1; i++) {
    const p1 = measurePoints[i];
    const p2 = measurePoints[i + 1];

    const routePoints = interpolateGeodesicRoute(p1.lat, p1.lon, p2.lat, p2.lon, 40);
    const distKm = calculateHaversineDistance(p1.lat, p1.lon, p2.lat, p2.lon);
    const distNM = distKm * 0.539957; // Millas Náuticas

    // Dibujar trayectoria geodésica en curva polar
    ctx.beginPath();
    routePoints.forEach((pt, idx) => {
      const radius = mapRadius * ((90 - pt.lat) / 180);
      const thetaRad = ((pt.lon + (rotation - 180)) * Math.PI) / 180;
      const x = centerX + radius * Math.sin(thetaRad);
      const y = centerY + radius * Math.cos(thetaRad);

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#ec4899'; // Rosa cian neón táctico
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Etiqueta de distancia en el punto medio de la ruta
    const midPt = routePoints[Math.floor(routePoints.length / 2)];
    const radius = mapRadius * ((90 - midPt.lat) / 180);
    const thetaRad = ((midPt.lon + (rotation - 180)) * Math.PI) / 180;
    const midX = centerX + radius * Math.sin(thetaRad);
    const midY = centerY + radius * Math.cos(thetaRad);

    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 10px monospace';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(`✈️ ${Math.round(distKm)} km (${Math.round(distNM)} NM)`, midX + 8, midY - 4);
  }

  ctx.restore();
}