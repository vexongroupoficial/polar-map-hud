'use client';

import { useState } from 'react';
import PolarCanvas from '@/components/map2d/PolarCanvas';
import PolarScene3D from '@/components/map3d/PolarScene3D';
import Sidebar from '@/components/ui/Sidebar';
import { INITIAL_ACTIVE_LAYERS } from '@/lib/mapLayers';

export default function Home() {
  const [layers, setLayers] = useState(INITIAL_ACTIVE_LAYERS);
  const [viewMode, setViewMode] = useState('2D');

  // CONTROL DE VISIBILIDAD MÓVIL Y COLAPSO PC
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [rotation, setRotation] = useState(180);
  const [zoom, setZoom] = useState(1.0);
  const [measurePoints, setMeasurePoints] = useState([]);

  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const handleAddMeasurePoint = (point) => {
    setMeasurePoints((prev) => {
      if (prev.length >= 2) return [point];
      return [...prev, point];
    });
  };

  const handleClearMeasurements = () => {
    setMeasurePoints([]);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* NAVBAR SUPERIOR */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          {/* BOTÓN TOGGLE PARA MÓVIL Y TABLET */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden p-1.5 bg-cyan-950/80 hover:bg-cyan-900 rounded-xl text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer"
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

        {/* CONTROLES VISTA 2D / 3D */}
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
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          activeLayers={layers}
          onToggleLayer={toggleLayer}
          measurePoints={measurePoints}
          onClearMeasurements={handleClearMeasurements}
        />

        <main className="flex-1 h-full relative flex justify-center items-center overflow-hidden bg-slate-950">
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