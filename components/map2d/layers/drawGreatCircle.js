import { latLonToPolar } from '@/lib/polarMath';

// Puntos de ancla del Gran Círculo Antiguo (Guiza e Isla de Pascua)
const GIZA = { lat: 29.9792, lon: 31.1342 };
const EASTER_ISLAND = { lat: -27.1212, lon: -109.3497 };

/**
 * Convierte Coordenadas Geográficas (lat, lon) a Vector Unitario 3D en la Esfera
 */
function latLonToVector3D(latDeg, lonDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return {
    x: Math.cos(lat) * Math.cos(lon),
    y: Math.cos(lat) * Math.sin(lon),
    z: Math.sin(lat),
  };
}

/**
 * Convierte Vector Unitario 3D a Coordenadas Geográficas (lat, lon)
 */
function vector3DToLatLon(v) {
  const lat = Math.asin(Math.min(Math.max(v.z, -1), 1)) * (180 / Math.PI);
  const lon = Math.atan2(v.y, v.x) * (180 / Math.PI);
  return { lat, lon };
}

export function drawGreatCircle(ctx, activeLayers, centerX, centerY, mapRadius, rotation = 0) {
  if (!activeLayers?.greatCircle && !activeLayers?.ancientMeridian) return;

  ctx.save();

  // 1. Obtener Vectores Base de la Gran Alineación
  const v1 = latLonToVector3D(GIZA.lat, GIZA.lon);
  const v2 = latLonToVector3D(EASTER_ISLAND.lat, EASTER_ISLAND.lon);

  // Producto cruz para obtener el vector normal al plano del Gran Círculo
  const nx = v1.y * v2.z - v1.z * v2.y;
  const ny = v1.z * v2.x - v1.x * v2.z;
  const nz = v1.x * v2.y - v1.y * v2.x;
  const nLen = Math.hypot(nx, ny, nz);

  if (nLen === 0) {
    ctx.restore();
    return;
  }

  const n = { x: nx / nLen, y: ny / nLen, z: nz / nLen };

  // Sistema de ejes ortonormales en el plano del Círculo Máximo (u, w)
  const u = v1;
  const wx = n.y * u.z - n.z * u.y;
  const wy = n.z * u.x - n.x * u.z;
  const wz = n.x * u.y - n.y * u.x;
  const w = { x: wx, y: wy, z: wz };

  // 2. GENERAR Y DIBUJAR EL GRAN CÍRCULO CON EFECTO DORADO RESPLANDECIENTE
  const segments = 360;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    const px = Math.cos(t) * u.x + Math.sin(t) * w.x;
    const py = Math.cos(t) * u.y + Math.sin(t) * w.y;
    const pz = Math.cos(t) * u.z + Math.sin(t) * w.z;

    const geo = vector3DToLatLon({ x: px, y: py, z: pz });
    const p = latLonToPolar(geo.lat, geo.lon, mapRadius, rotation);

    points.push({ x: centerX + p.x, y: centerY + p.y });
  }

  // A. Halo Resplandeciente Dorado Exterior
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
  ctx.lineWidth = 10;
  ctx.stroke();

  // B. Brillo Intermedio Neón
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // C. Núcleo Dorado Intenso Punteado
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#fef08a'; // Amarillo reluciente
  ctx.lineWidth = 1.8;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. ETIQUETA TITULAR DEL GRAN CÍRCULO ANTIGUO
  const pGiza = latLonToPolar(GIZA.lat, GIZA.lon, mapRadius, rotation);
  const labelX = centerX + pGiza.x + 18;
  const labelY = centerY + pGiza.y - 18;

  ctx.font = 'bold italic 11px Georgia, serif';
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 6;
  ctx.fillText('✨ Gran Círculo Antiguo (Eje Guiza-Pascua)', labelX, labelY);

  ctx.restore();
}