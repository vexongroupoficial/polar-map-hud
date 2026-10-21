import * as THREE from 'three';

export function createOceanLayer(mapRadius = 4.5) {
  const group = new THREE.Group();

  // Océano Base a Nivel Cero del Mar
  const oceanGeo = new THREE.CircleGeometry(mapRadius, 64);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.7,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  oceanMesh.position.z = -0.02;
  group.add(oceanMesh);

  // Círculo Central (Polo Norte)
  const northPoleGeo = new THREE.RingGeometry(0, 0.3, 32);
  const northPoleMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
  const northPoleMesh = new THREE.Mesh(northPoleGeo, northPoleMat);
  northPoleMesh.position.z = 0.01;
  group.add(northPoleMesh);

  // Anillo Exterior (Antártida / Polo Sur)
  const antarcticGeo = new THREE.RingGeometry(mapRadius - 0.2, mapRadius, 64);
  const antarcticMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
  const antarcticMesh = new THREE.Mesh(antarcticGeo, antarcticMat);
  antarcticMesh.position.z = 0.01;
  group.add(antarcticMesh);

  return group;
}