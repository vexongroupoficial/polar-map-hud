/**
 * Ray-Casting para detectar si un punto [lng, lat] está dentro de un polígono GeoJSON
 */
export function pointInPolygon(point, polygonCoordinates) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
    const [xi, yi] = polygonCoordinates[i];
    const [xj, yj] = polygonCoordinates[j];

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Búsqueda espacial de País y Continente en el GeoJSON
 */
export function getCountryAndContinentAtPoint(lat, lon, countriesGeoJSON) {
  if (!countriesGeoJSON || !countriesGeoJSON.features) {
    return { country: "Mar Abierto / Océano", continent: "Cuenca Global" };
  }

  const point = [lon, lat];

  for (const feature of countriesGeoJSON.features) {
    const geometry = feature.geometry;
    const properties = feature.properties || {};
    const countryName = properties.name || properties.ADMIN || properties.NAME || "Territorio Desconocido";
    const continentName = properties.continent || properties.REGION_UN || properties.CONTINENT || "Masa Continental";

    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) {
        if (pointInPolygon(point, ring)) {
          return { country: countryName, continent: continentName };
        }
      }
    } else if (geometry.type === "MultiPolygon") {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          if (pointInPolygon(point, ring)) {
            return { country: countryName, continent: continentName };
          }
        }
      }
    }
  }

  return { country: "Mar Abierto / Océano", continent: "Océano Global" };
}

/**
 * Dibuja la mira táctica sobre el cursor
 */
export function drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos) {
  if (!mousePos || mousePos.canvasX === undefined || mousePos.canvasY === undefined) return;

  const mx = mousePos.canvasX;
  const my = mousePos.canvasY;
  const dist = Math.hypot(mx - centerX, my - centerY);

  if (dist <= mapRadius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 4, my);
    ctx.moveTo(mx + 4, my); ctx.lineTo(mx + 12, my);
    ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my - 4);
    ctx.moveTo(mx, my + 4); ctx.lineTo(mx, my + 12);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mx, my, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2222';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Dibuja el Ecuador y los Trópicos
 */
export function drawTropicsAndEquatorLayer(ctx, centerX, centerY, maxRadius) {
  const parallels = [
    { name: 'CÁNCER (+23.43°)', lat: 23.43, color: 'rgba(56, 189, 248, 0.5)', dash: [4, 4] },
    { name: 'ECUADOR (0°)', lat: 0, color: 'rgba(239, 68, 68, 0.9)', dash: [] },
    { name: 'CAPRICORNIO (-23.43°)', lat: -23.43, color: 'rgba(56, 189, 248, 0.5)', dash: [4, 4] }
  ];

  parallels.forEach(p => {
    const radius = maxRadius * ((90 - p.lat) / 180);
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.lat === 0 ? 1.5 : 1;
    ctx.setLineDash(p.dash);
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.font = '9px monospace';
    ctx.fillText(p.name, centerX + 6, centerY - radius - 4);
    ctx.restore();
  });
}