'use client';

import { useState } from 'react';
import { MAP_LAYERS, MAP_LAYER_CATEGORIES } from '@/lib/mapLayers';
import MeasureTool from './MeasureTool'; // Importar el panel de medición

export default function Sidebar({
  activeLayers = {},
  onToggleLayer,
  measurePoints = [],
  onClearMeasurements,
}) {
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (catName) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const categories = Object.values(MAP_LAYER_CATEGORIES);

  const handleToggle = (e, layerId) => {
    e.stopPropagation();
    if (typeof onToggleLayer === 'function') {
      onToggleLayer(layerId);
    }
  };

  return (
    <aside className="w-80 h-full bg-slate-950/95 backdrop-blur-md border-r border-cyan-500/30 flex flex-col justify-between p-3 select-none z-20 shadow-[4px_0_24px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* CABECERA TÁCTICA */}
      <div className="mb-3 border-b border-cyan-500/30 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
            CONTROL DE CAPAS GEODÉSICAS
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-900">
          v2.4
        </span>
      </div>

      {/* ÁREA DE SCROLL CON MEDIDOR Y CATEGORÍAS */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-slate-950">
        
        {/* PANEL DE MEDIDOR (Se muestra cuando 'measure' está encendido) */}
        <MeasureTool
          isMeasureActive={!!activeLayers.measure}
          measurePoints={measurePoints}
          onClearMeasurements={onClearMeasurements}
        />

        {categories.map((catName) => {
          const layersInCat = MAP_LAYERS.filter((l) => l.category === catName);
          if (layersInCat.length === 0) return null;

          const isCollapsed = !!collapsedCategories[catName];
          const activeCount = layersInCat.filter((l) => !!activeLayers[l.id]).length;

          return (
            <div
              key={catName}
              className="border border-slate-800/90 rounded-lg bg-slate-900/50 overflow-hidden transition-all duration-200"
            >
              {/* ENCABEZADO DE CATEGORÍA COLAPSABLE */}
              <button
                type="button"
                onClick={() => toggleCategory(catName)}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800/70 border-b border-slate-800/60 transition cursor-pointer"
              >
                <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider">
                  {catName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
                    {activeCount}/{layersInCat.length}
                  </span>
                  <span className="text-slate-400 text-xs transform transition-transform duration-200">
                    {isCollapsed ? '►' : '▼'}
                  </span>
                </div>
              </button>

              {/* LISTA DE CAPAS */}
              {!isCollapsed && (
                <div className="p-1.5 space-y-1">
                  {layersInCat.map((layer) => {
                    const isActive = !!activeLayers[layer.id];

                    return (
                      <button
                        type="button"
                        key={layer.id}
                        onClick={(e) => handleToggle(e, layer.id)}
                        className={`w-full text-left group flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all duration-150 ${
                          isActive
                            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                        }`}
                      >
                        {/* INFORMACIÓN DE CAPA */}
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-base group-hover:scale-110 transition-transform">
                            {layer.icon}
                          </span>
                          <div className="truncate">
                            <div
                              className={`text-xs font-mono font-medium truncate transition-colors ${
                                isActive ? 'text-cyan-200 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            >
                              {layer.label}
                            </div>
                            <div className="text-[9px] font-mono text-slate-500 truncate">
                              {layer.description}
                            </div>
                          </div>
                        </div>

                        {/* TOGGLE INTERRUPTOR NEÓN */}
                        <div className="relative inline-flex items-center shrink-0 pointer-events-none">
                          <div
                            className={`w-8 h-4 rounded-full transition-colors duration-200 ease-in-out border ${
                              isActive
                                ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                                : 'bg-slate-800 border-slate-700'
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full transform transition-transform duration-200 ease-in-out mt-[1px] ${
                                isActive
                                  ? 'translate-x-4 bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                                  : 'translate-x-0.5 bg-slate-500'
                              }`}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          ESTACIONALIDAD: ACTIVA
        </span>
        <span className="text-slate-500">PROYECCIÓN POLAR</span>
      </div>
    </aside>
  );
}