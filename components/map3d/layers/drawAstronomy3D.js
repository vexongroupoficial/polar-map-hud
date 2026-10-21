import * as THREE from 'three';
import { latLonToPolar } from '@/lib/polarMath';

export function createAstronomyLayer(mapRadius = 4.5, date = new Date()) {
  const group = new THREE.Group();

  // Validar que 'date' sea una instancia de Date válida
  const now = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  // 1. Calcular punto subsolar (Latitud y Longitud) según fecha y hora UTC
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Declinación solar aproximada
  const sunLat = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 80));

  // Longitud según la hora UTC
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const sunLon = (12 - utcHours) * 15;

  // Coordenadas 3D del Sol
  const sunPos = latLonToPolar(sunLat, sunLon, mapRadius, 0);
  const sun3D = new THREE.Vector3(-sunPos.x, sunPos.y, 2.5);

  // 2. Esfera del Sol 3D y Halo
  const sunGeo = new THREE.SphereGeometry(0.22, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.copy(sun3D);
  group.add(sunMesh);

  // Halo Dorado
  const sunGlowGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfcb316,
    transparent: true,
    opacity: 0.3,
  });
  const sunGlowMesh = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  sunGlowMesh.position.copy(sun3D);
  group.add(sunGlowMesh);

  // Luz Direccional Principal del Sol
  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
  sunLight.position.copy(sun3D);
  group.add(sunLight);

  // 3. Esfera y Punto de la Luna
  const moonLat = -sunLat * 0.8;
  const moonLon = (sunLon + 180) % 360;
  const moonPos = latLonToPolar(moonLat, moonLon, mapRadius, 0);
  const moon3D = new THREE.Vector3(-moonPos.x, moonPos.y, 2.0);

  const moonGeo = new THREE.SphereGeometry(0.15, 24, 24);
  const moonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.copy(moon3D);
  group.add(moonMesh);

  // Luz Suave Azulina de la Luna
  const moonLight = new THREE.PointLight(0x38bdf8, 0.6, 10);
  moonLight.position.copy(moon3D);
  group.add(moonLight);

  return group;
}