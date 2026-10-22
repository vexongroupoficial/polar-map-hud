'use client';

import { useState } from 'react';
import PolarCanvas from '@/components/map2d/PolarCanvas';
import PolarScene3D from '@/components/map3d/PolarScene3D';
import Sidebar from '@/components/ui/Sidebar';
import { INITIAL_ACTIVE_LAYERS } from '@/lib/mapLayers';

export default function Home() {
  // Estado único de capas inicializado desde la librería de capas
  const [layers, setLayers] = useState(INITIAL_ACTIVE_LAYERS);

  // Estado de navegación y orientación de la estación de mando
  const INITIAL_ROTATION = 180; // Orientación con Greenwich hacia abajo (UTC 0)
  const INITIAL_ZOOM = 1.00;
  const INITIAL_OFFSET = { x: 0, y: 0 };

  const [offset, setOffset] = useState(INITIAL_OFFSET);
  const [viewMode, setViewMode] = useState('2D');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [rotation, setRotation] = useState(INITIAL_ROTATION);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  // Función para restaurar la vista al punto inicial
  const handleResetView = () => {
    setOffset(INITIAL_OFFSET);
    setRotation(INITIAL_ROTATION);
    setZoom(INITIAL_ZOOM);
  };

  // Alternador dinámico de capas
  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  // Aplicar presets de capas rápidas
  const applyPreset = (presetLayers) => {
    setLayers((prev) => ({
      ...prev,
      ...presetLayers,
    }));
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* NAVBAR SUPERIOR HUD */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <span>🎛️</span>
            <span>Capas</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg">🌐</span>
            <h1 className="text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent uppercase">
              Proyección Polar HUD • Estación Geodésica
            </h1>
          </div>
        </div>

        {/* SWITCH DE VISTA 2D / 3D */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '2D' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D Planta
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '3D' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Visor
          </button>
        </div>
      </header>

      {/* ÁREA DE TRABAJO PANTALLA COMPLETA */}
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          layers={layers}
          activeLayers={layers}
          toggleLayer={toggleLayer}
          onToggleLayer={toggleLayer}
          onApplyPreset={applyPreset}
          rotation={rotation}
          zoom={zoom}
        />

        <main className="flex-1 h-full w-full relative flex justify-center items-center overflow-hidden bg-slate-950">
          {viewMode === '2D' ? (
            <PolarCanvas
              activeLayers={layers}
              rotation={rotation}
              setRotation={setRotation}
              zoom={zoom}
              setZoom={setZoom}
            />
          ) : (
            <div className="w-full h-full">
              <PolarScene3D
                rotation={rotation}
                zoom={zoom}
                activeLayers={layers}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}