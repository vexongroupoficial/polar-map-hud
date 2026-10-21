import * as THREE from 'three';
import { latLonToPolar } from '@/lib/polarMath';

export function createGraticuleLayer(mapRadius = 4.5) {
  const group = new THREE.Group();
  const lineZ = 0.06; // Elevado justo sobre continentes y relieve

  // 1. PARALELOS CONCÉNTRICOS Y ECUADOR
  for (let lat = 75; lat >= -75; lat -= 15) {
    const { rho } = latLonToPolar(lat, 0, mapRadius, 0);
    const points = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = rho * Math.sin(theta);
      const y = rho * Math.cos(theta);
      points.push(new THREE.Vector3(x, y, lineZ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    let color = 0x334155;
    let opacity = 0.4;

    // Línea del Ecuador (0°) destacada en Rojo
    if (lat === 0) {
      color = 0xef4444; // Rojo intenso
      opacity = 0.95;
    } else if (Math.abs(lat) === 23.5) {
      color = 0xf59e0b; // Ámbar para trópicos
      opacity = 0.7;
    }

    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });

    group.add(new THREE.Line(geometry, material));
  }

  // 2. MERIDIANOS RADIALES
  for (let lon = -180; lon < 180; lon += 15) {
    const { x, y } = latLonToPolar(-90, lon, mapRadius, 0);
    const points = [
      new THREE.Vector3(0, 0, lineZ),
      new THREE.Vector3(-x, y, lineZ),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.35,
    });

    group.add(new THREE.Line(geometry, material));
  }

  return group;
}