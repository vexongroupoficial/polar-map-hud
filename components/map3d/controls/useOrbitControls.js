import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initOrbitControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Limitar para no pasar por debajo del plano
  return controls;
}