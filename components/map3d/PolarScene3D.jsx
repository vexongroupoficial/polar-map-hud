'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { initOrbitControls } from './controls/useOrbitControls';
import { createOceanLayer } from './layers/drawOcean3D';
import { createContinentsLayer } from './layers/drawContinents3D';
import { createReliefLayer } from './layers/drawRelief3D';
import { createGraticuleLayer } from './layers/drawGraticule3D';
import { createAstronomyLayer } from './layers/drawAstronomy3D';

export default function PolarScene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Escena, Cámara y Renderizador WebGL
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 7, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 2. Controles de Órbita Modulares
    const controls = initOrbitControls(camera, renderer.domElement);

    // 3. Iluminación Ambiental Suave (Para el contraste de sombra/noche)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.4);
    scene.add(ambientLight);

    // 4. Grupo Base Polar (Acostado horizontalmente)
    const mapGroup = new THREE.Group();
    mapGroup.rotation.x = -Math.PI / 2;
    scene.add(mapGroup);

    const mapRadius = 4.5;

    // A. Océano Base y Anillo de la Antártida
    mapGroup.add(createOceanLayer(mapRadius));

    // B. Gráticula 3D (Línea del Ecuador en Rojo, Trópicos y Meridianos)
    mapGroup.add(createGraticuleLayer(mapRadius));

    // C. Sol, Luna y Ciclo Día/Noche en Tiempo Real
    mapGroup.add(createAstronomyLayer(mapRadius));

    // D. Continentes y Cordilleras Topográficas en Verde Esmeralda
    Promise.all([
      fetch('/data/geojson/world_countries.geojson').then((res) => res.json()),
      fetch('/data/geojson/world_relief.geojson').then((res) => res.json()).catch(() => null),
    ]).then(([countriesData, reliefData]) => {
      mapGroup.add(createContinentsLayer(countriesData, mapRadius));
      if (reliefData) {
        mapGroup.add(createReliefLayer(reliefData, mapRadius));
      }
    });

    // 5. Loop de Renderizado
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 6. Redimensionamiento Responsivo
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex justify-center items-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3.5 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 pointer-events-none space-y-1">
        <div className="font-semibold text-emerald-400">🌐 Visor 3D Polar Profesional:</div>
        <div>🔴 <span className="text-slate-200">Línea del Ecuador:</span> Anillo concéntrico en rojo ($0^\circ$).</div>
        <div>🏔️ <span className="text-slate-200">Relieve Topográfico:</span> Cordilleras elevadas en verde.</div>
        <div>☀️ <span className="text-slate-200">Astronomía 3D:</span> Sol, Luna e iluminación de Día/Noche en tiempo real.</div>
      </div>
    </div>
  );
}