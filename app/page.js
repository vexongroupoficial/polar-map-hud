// app/page.js
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/ui/Sidebar';
import { INITIAL_ACTIVE_LAYERS } from '@/lib/mapLayers';

// TIENDA Y COMPONENTES DE WIDGETS FLOTANTES
import { useWidgetStore } from '@/components/hud/useWidgetStore';
import DraggableWidget from '@/components/hud/DraggableWidget';
import DockToolbar from '@/components/hud/DockToolbar';

// CONTENIDOS DE LAS VENTANAS HUD
import CitySearchHUD from '@/components/map2d/hud/CitySearchHUD';
import TelemetryHUD from '@/components/map2d/hud/TelemetryHUD';
import PolarCoordsHUD from '@/components/map2d/hud/PolarCoordsHUD';
import NavigationHUD from '@/components/map2d/hud/NavigationHUD';
import LuminariesHUD from '@/components/map2d/hud/LuminariesHUD';
import GrandAlignmentHUD from '@/components/map2d/hud/GrandAlignmentHUD';

const PolarCanvas = dynamic(() => import('@/components/map2d/PolarCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono text-xs">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <span>INICIALIZANDO ESTACIÓN GEODÉSICA...</span>
    </div>
  ),
});

const PolarScene3D = dynamic(() => import('@/components/map3d/PolarScene3D'), {
  ssr: false,
});

export default function Home() {
  // Estado inicial de capas garantizando neonMode en true
  const [layers, setLayers] = useState(() => ({
    ...INITIAL_ACTIVE_LAYERS,
    neonMode: true,
  }));

  const [viewMode, setViewMode] = useState('2D');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // TRANSFORMACIÓN DE CÁMARA
  const [rotation, setRotation] = useState(180);
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // DATOS KINEMÁTICOS Y GEODÉSICOS
  const [simulatedTime, setSimulatedTime] = useState(Date.now());
  const [mousePos, setMousePos] = useState({
    lat: 0,
    lon: 0,
    country: '',
    continent: '',
  });
  const [measurePoints, setMeasurePoints] = useState([]);

  // TIENDA DE ZUSTAND (UNIFICADA)
  const store = useWidgetStore();
  const closeWidget = store?.closeWidget;

  const isWidgetOpen = (id) => {
    if (typeof store?.isWidgetOpen === 'function') {
      return store.isWidgetOpen(id);
    }
    return !!store?.widgets?.[id]?.visible;
  };

  // 🎯 SINCRONIZACIÓN AUTOMÁTICA: Encender el anillo gráfico de las Eras al abrir el widget desde la Estación HUD
  const isErasOpen = isWidgetOpen('erasHUD');
  useEffect(() => {
    if (isErasOpen) {
      setLayers((prev) => {
        if (!prev.precessionalEras || !prev.zodiacHouses) {
          return {
            ...prev,
            precessionalEras: true,
            zodiacHouses: true,
          };
        }
        return prev;
      });
    }
  }, [isErasOpen]);

  // Manejador defensivo de alternancia de capas
  const toggleLayer = (layerName) => {
    setLayers((prev) => {
      const currentVal =
        prev[layerName] ?? (layerName === 'neonMode' ? true : false);
      return {
        ...prev,
        [layerName]: !currentVal,
      };
    });
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

  // 🎯 BÚSQUEDA Y CENTRADO DE CIUDAD
  const handleSelectLocation = (lat, lon) => {
    const targetZoom = 3.5;
    setZoom(targetZoom);

    const targetRotation = ((180 - lon) % 360 + 360) % 360;
    setRotation(targetRotation);

    const size =
      typeof window !== 'undefined'
        ? Math.min(window.innerWidth, window.innerHeight)
        : 800;
    const mapRadius = (size / 2 - 80) * targetZoom;
    const rho = mapRadius * ((90 - lat) / 180);

    setOffset({
      x: 0,
      y: -rho,
    });
  };

  const handleResetView = () => {
    setOffset({ x: 0, y: 0 });
    setRotation(180);
    setZoom(1.0);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* CABECERA DE LA ESTACIÓN */}
      <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
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

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '2D'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D Planta
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === '3D'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Visor
          </button>
        </div>
      </header>

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
            <>
              {/* LIENZO DE MAPA POLAR 2D */}
              <PolarCanvas
                activeLayers={layers}
                rotation={rotation}
                setRotation={setRotation}
                zoom={zoom}
                setZoom={setZoom}
                offset={offset}
                setOffset={setOffset}
                simulatedTime={simulatedTime}
                measurePoints={measurePoints}
                onAddMeasurePoint={handleAddMeasurePoint}
                onTelemetryUpdate={setMousePos}
              />

              {/* 1. BUSCADOR DE CIUDAD / AEROPUERTO */}
              {isWidgetOpen('city') && (
                <DraggableWidget
                  id="city"
                  title="BUSCAR CIUDAD / AEROPUERTO"
                  icon="🔍"
                  defaultPosition={{ x: 340, y: 60 }}
                  onClose={() => closeWidget('city')}
                >
                  <CitySearchHUD onSelectLocation={handleSelectLocation} />
                </DraggableWidget>
              )}

              {/* 2. TELEMETRÍA GEODÉSICA */}
              {isWidgetOpen('telemetry') && (
                <DraggableWidget
                  id="telemetry"
                  title="TELEMETRÍA GEODÉSICA"
                  icon="📡"
                  defaultPosition={{ x: 340, y: 220 }}
                  onClose={() => closeWidget('telemetry')}
                >
                  <TelemetryHUD
                    mousePos={mousePos}
                    simulatedTime={simulatedTime}
                  />
                </DraggableWidget>
              )}

              {/* 3. COORDENADAS POLARES */}
              {isWidgetOpen('polarCoords') && (
                <DraggableWidget
                  id="polarCoords"
                  title="COORDENADAS POLARES (Ρ, Θ)"
                  icon="📐"
                  defaultPosition={{ x: 340, y: 440 }}
                  onClose={() => closeWidget('polarCoords')}
                >
                  <PolarCoordsHUD mousePos={mousePos} />
                </DraggableWidget>
              )}

              {/* 4. CONSOLA DE NAVEGACIÓN 2D */}
              {isWidgetOpen('navigation2D') && (
                <DraggableWidget
                  id="navigation2D"
                  title="NAVEGACIÓN 2D"
                  icon="🧭"
                  defaultPosition={{ x: 720, y: 60 }}
                  onClose={() => closeWidget('navigation2D')}
                >
                  <NavigationHUD
                    rotation={rotation}
                    setRotation={setRotation}
                    onRotateChange={setRotation}
                    zoom={zoom}
                    setZoom={setZoom}
                    onZoomChange={setZoom}
                    onResetView={handleResetView}
                  />
                </DraggableWidget>
              )}

              {/* 5. SIMULADOR DE LUMINARIAS */}
              {isWidgetOpen('luminaries') && (
                <DraggableWidget
                  id="luminaries"
                  title="SIMULADOR DE LUMINARIAS"
                  icon="☀️"
                  defaultPosition={{ x: 720, y: 380 }}
                  onClose={() => closeWidget('luminaries')}
                >
                  <LuminariesHUD
                    simulatedTime={simulatedTime}
                    setSimulatedTime={setSimulatedTime}
                    activeLayers={layers}
                    onToggleLayer={toggleLayer}
                  />
                </DraggableWidget>
              )}

              {/* 6. 12 ERAS PRECESIONALES */}
              {isWidgetOpen('erasHUD') && (
                <DraggableWidget
                  id="erasHUD"
                  title="12 ERAS PRECESIONALES"
                  icon="🏛️"
                  defaultPosition={{ x: 340, y: 60 }}
                  onClose={() => closeWidget('erasHUD')}
                >
                  <GrandAlignmentHUD
                    simulatedTime={simulatedTime}
                    setSimulatedTime={setSimulatedTime}
                    activeLayers={layers}
                    onToggleLayer={toggleLayer}
                  />
                </DraggableWidget>
              )}

              {/* BARRA DOCK Y CONTROL HUB MÓVIL (ESTACIÓN HUD) */}
              <DockToolbar />
            </>
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