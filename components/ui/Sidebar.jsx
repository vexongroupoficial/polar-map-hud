'use client';

import { useState, useEffect } from 'react';
import LayerToggleGroup from './LayerToggleGroup';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  layers,
  toggleLayer,
  onApplyPreset,
  rotation = 0,
  zoom = 1,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [utcTime, setUtcTime] = useState('');

  // Actualizar Reloj UTC en el Header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Contar capas activas
  const activeCount = Object.values(layers).filter(Boolean).length;
  const totalCount = Object.keys(layers).length;

  return (
    <>
      {/* OVERLAY PARA MÓVILES (Backdrop oscuro al abrir en teléfonos) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* PANEL LATERAL SIDEBAR */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 shadow-2xl
          flex flex-col justify-between transition-all duration-300 ease-in-out select-none
          ${/* Móvil: Drawer deslizable */ ''}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${/* PC: Fijo en el lado izquierdo con ancho variable */ ''}
          lg:translate-x-0 lg:static lg:z-30
          ${isCollapsed ? 'lg:w-16' : 'w-[320px] sm:w-[360px]'}
        `}
      >
        {/* ================================================================= */}
        {/* 1. HEADER (ENCABEZADO TÁCTICO) */}
        {/* ================================================================= */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-black text-sm shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-sky-400 opacity-20"></span>
                🌐
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs tracking-wider text-slate-100 uppercase truncate">
                    Control Cartográfico
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{utcTime || '00:00:00 UTC'}</span>
                  <span>•</span>
                  <span className="text-sky-400">{activeCount}/{totalCount} Capas</span>
                </div>
              </div>
            </div>
          ) : (
            // Modo PC Colapsado (Solo Icono)
            <div className="mx-auto flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xs">
                🌐
              </div>
            </div>
          )}

          {/* Botones de Control del Header */}
          <div className="flex items-center gap-1">
            {/* Ocultar / Colapsar en PC */}
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir Menú' : 'Colapsar Menú'}
              className="hidden lg:flex p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 border border-slate-700/50 transition"
            >
              {isCollapsed ? '⏩' : '⏪'}
            </button>

            {/* Cerrar en Móvil */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. NAV / CUERPO (PRESETS, BÚSQUEDA Y CAPAS) */}
        {/* ================================================================= */}
        {!isCollapsed ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* Buscador de Capas */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar capa (ej. Pirámides, UTC...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Presets Rápidos (Accesos directos) */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                ⚡ Presets Rápidos
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() =>
                    onApplyPreset?.({
                      ancientSites: true,
                      greatCircle: true,
                      harmonicAngles: true,
                      graticule: true,
                    })
                  }
                  className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-medium transition flex flex-col items-center gap-0.5 text-center"
                >
                  <span>🏛️ Antiguo</span>
                </button>

                <button
                  onClick={() =>
                    onApplyPreset?.({
                      sunlight: true,
                      moon: true,
                      analemma: true,
                      timeZones: true,
                    })
                  }
                  className="px-2 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-medium transition flex flex-col items-center gap-0.5 text-center"
                >
                  <span>🌌 Cosmos</span>
                </button>

                <button
                  onClick={() =>
                    onApplyPreset?.({
                      continents: true,
                      relief: true,
                      tectonics: true,
                      currents: true,
                    })
                  }
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium transition flex flex-col items-center gap-0.5 text-center"
                >
                  <span>🌍 Físico</span>
                </button>
              </div>
            </div>

            {/* Lista de Capas Categorizadas */}
            <LayerToggleGroup
              layers={layers}
              toggleLayer={toggleLayer}
              searchTerm={searchTerm}
            />
          </div>
        ) : (
          // Vista Minimizada PC (Barra de accesos directos por iconos)
          <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            <button
              onClick={onToggleCollapse}
              title="Expandir Capas"
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-sky-500/20 text-sky-400 border border-slate-700/60 transition"
            >
              🗺️
            </button>
            <button
              onClick={() => toggleLayer?.('ancientSites')}
              title="Pirámides"
              className={`p-2.5 rounded-xl border transition ${
                layers.ancientSites
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/40 text-slate-500 border-slate-800'
              }`}
            >
              🔺
            </button>
            <button
              onClick={() => toggleLayer?.('timeZones')}
              title="Zonas UTC"
              className={`p-2.5 rounded-xl border transition ${
                layers.timeZones
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/40 text-slate-500 border-slate-800'
              }`}
            >
              🕒
            </button>
            <button
              onClick={() => toggleLayer?.('greatCircle')}
              title="Gran Círculo"
              className={`p-2.5 rounded-xl border transition ${
                layers.greatCircle
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-slate-800/40 text-slate-500 border-slate-800'
              }`}
            >
              ✨
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. FOOTER (TELEMETRÍA Y CRÉDITOS DE SISTEMA) */}
        {/* ================================================================= */}
        {!isCollapsed ? (
          <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex flex-col gap-2 text-[10px] font-mono text-slate-400">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ORIENTACIÓN:</span>
              <span className="text-sky-300 font-bold">{Math.round(rotation)}°</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ESCALA ZOOM:</span>
              <span className="text-emerald-400 font-bold">{zoom.toFixed(2)}x</span>
            </div>
            <div className="pt-1 border-t border-slate-800/50 flex items-center justify-between text-[9px] text-slate-400">
              <span>Proyección: WGS84 Polar</span>
              <span className="text-amber-400/80">v2.4 HUD</span>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-800/80 flex justify-center text-[10px] font-mono text-sky-400">
            {Math.round(rotation)}°
          </div>
        )}
      </aside>
    </>
  );
}