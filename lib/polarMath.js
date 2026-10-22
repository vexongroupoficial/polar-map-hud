import proj4 from 'proj4';

/**
 * Convierte Latitud y Longitud a Coordenadas Cartesianas (x, y) de Canvas
 * para una Proyección Azimutal Equidistante Polar Norte.
 * 
 * @param {number} lat - Latitud (-90 a 90)
 * @param {number} lon - Longitud (-180 a 180)
 * @param {number} mapRadius - Radio del círculo exterior en píxeles
 * @param {number} rotationAngle - Rotación en grados (0 a 360)
 */
export function latLonToPolar(lat, lon, mapRadius = 500, rotationAngle = 0) {
  // 1. Radio proporcional desde el Polo Norte (0 a mapRadius)
  const rho = mapRadius * ((90 - lat) / 180);

  // 2. Ángulo polar con rotación
  const angleDeg = lon + rotationAngle;
  const thetaRad = (angleDeg * Math.PI) / 180;

  // 3. Conversión a Canvas (Multiplicamos por -1 en X para corregir el reflejo especular Este/Oeste)
  const x = -rho * Math.sin(thetaRad);
  const y = -rho * Math.cos(thetaRad);

  return { rho, thetaRad, x, y };
}

      // lib/polarMath.js (Ampliación)

      /**
       * Convierte coordenadas de Canvas (x, y) a Lat/Lon usando Proyección Azimutal Polar
       */
      export function canvasToLatLon(canvasX, canvasY, centerX, centerY, mapRadius) {
        const dx = canvasX - centerX;
        const dy = canvasY - centerY;
        const rho = Math.hypot(dx, dy);

        if (rho > mapRadius) return null; // Fuera del disco terrestre

        // Ángulo azimutal desde el norte (eje Y negativo en canvas)
        let theta = Math.atan2(dx, -dy);
        if (theta < 0) theta += Math.PI * 2;

        // En una proyección azimutal equidistante polar centrada en el Polo Norte:
        // El radio normalizado (0 a 1) representa la distancia cenital (90 - Latitud)
        const normalizedRadius = rho / mapRadius;
        const lat = 90 - (normalizedRadius * 90);
        const lon = (theta * 180) / Math.PI;

        return {
          lat,
          lon: lon > 180 ? lon - 360 : lon,
          rho,
          theta
        };
      }

export function utmToPolar(easting, northing, zone, isNorthern = true, mapRadius = 500, rotationAngle = 0) {
  const hemi = isNorthern ? '+north' : '+south';
  const utmProj = `+proj=utm +zone=${zone} ${hemi} +datum=WGS84 +units=m +no_defs`;
  const wgs84Proj = '+proj=longlat +datum=WGS84 +no_defs';

  const [lon, lat] = proj4(utmProj, wgs84Proj, [easting, northing]);

  return latLonToPolar(lat, lon, mapRadius, rotationAngle);
}