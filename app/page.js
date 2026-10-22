'use client';

import { useState } from 'react';
import PolarCanvas from '@/components/map2d/PolarCanvas';
import PolarScene3D from '@/components/map3d/PolarScene3D';
import Sidebar from '@/components/ui/Sidebar';
import { INITIAL_ACTIVE_LAYERS } from '@/lib/mapLayers';

export default function Home() {
  // Estado de capas inicializado
  const [layers, setLayers] = useState(INITIAL_ACTIVE_LAYERS);

  // Estado de navegación y orientación
  const INITIAL_ROTATION = 180;
  const INITIAL_ZOOM = 1.00;
  const INITIAL_OFFSET = { x: 0, y: 0 };

  const [offset, setOffset] = useState(INITIAL_OFFSET);
  const [viewMode, setViewMode] = useState('2D');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [rotation, setRotation] = useState(INITIAL_ROTATION);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  // Puntos de Medición de Distancia
  const [measurePoints, setMeasurePoints] = useState([]);

  const handleAddMeasurePoint = (point) => {
    setMeasurePoints((prev) => {
      if (prev.length >= 2) return [point];
      return [...prev, point];
    });
  };

  const handleClearMeasurements = () => {
    setMeasurePoints([]);
  };

  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

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
            type="button"
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
            type="button"
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '2D' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D Planta
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '3D' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Visor
          </button>
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeLayers={layers}
          onToggleLayer={toggleLayer}
          onApplyPreset={applyPreset}
          measurePoints={measurePoints}
          onClearMeasurements={handleClearMeasurements}
        />  

        <main className="flex-1 h-full w-full relative flex justify-center items-center overflow-hidden bg-slate-950">
          {viewMode === '2D' ? (
            <PolarCanvas
              activeLayers={layers}
              rotation={rotation}
              setRotation={setRotation}
              zoom={zoom}
              setZoom={setZoom}
              measurePoints={measurePoints}
              onAddMeasurePoint={handleAddMeasurePoint}
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