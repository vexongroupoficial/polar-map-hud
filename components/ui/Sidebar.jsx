'use client';

import { useState, useMemo, memo } from 'react';
import { MAP_LAYERS, MAP_LAYER_CATEGORIES } from '@/lib/mapLayers';

function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  activeLayers = {},
  onToggleLayer,
}) {
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Pre-agrupar categorías una sola vez en memoria para evitar re-calculos y bucles
  const layersByCategory = useMemo(() => {
    const categories = Object.values(MAP_LAYER_CATEGORIES || {});
    const grouped = {};

    categories.forEach((catName) => {
      grouped[catName] = (MAP_LAYERS || []).filter((l) => l.category === catName);
    });

    return { categories, grouped };
  }, []);

  const toggleCategory = (catName) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleToggle = (e, layerId) => {
    e.stopPropagation();
    if (typeof onToggleLayer === 'function') {
      onToggleLayer(layerId);
    }
  };

  return (
    <>
      {/* OVERLAY PARA CERRAR EN MÓVIL Y TABLET */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          bg-slate-950/95 backdrop-blur-xl border-r border-cyan-500/30 shadow-[4px_0_24px_rgba(0,0,0,0.9)]
          flex flex-col justify-between p-3 select-none transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-20
          ${isCollapsed ? 'lg:w-16' : 'w-80'}
        `}
      >
        {/* ENCABEZADO CON BOTONES DE ACCIÓN */}
        <div className="mb-3 border-b border-cyan-500/30 pb-2 flex items-center justify-between shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee] shrink-0" />
              <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase truncate">
                CONTROL DE CAPAS
              </h2>
            </div>
          ) : (
            <div className="mx-auto text-cyan-400 font-bold text-sm">🌐</div>
          )}

          <div className="flex items-center gap-1">
            {/* Ocultar / Colapsar en PC */}
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir' : 'Colapsar'}
              className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs transition cursor-pointer"
            >
              {isCollapsed ? '⏩' : '⏪'}
            </button>

            {/* Cerrar en Móvil y Tablet */}
            <button
              type="button"
              onClick={onClose}
              title="Cerrar Menú"
              className="lg:hidden p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-mono font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* LISTADO DE CAPAS */}
        {!isCollapsed ? (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-slate-950">
            {layersByCategory.categories.map((catName) => {
              const layersInCat = layersByCategory.grouped[catName] || [];
              if (layersInCat.length === 0) return null;

              const isCategoryCollapsed = !!collapsedCategories[catName];
              const activeCount = layersInCat.filter((l) => !!activeLayers[l.id]).length;

              return (
                <div
                  key={catName}
                  className="border border-slate-800/90 rounded-lg bg-slate-900/50 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(catName)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800/70 border-b border-slate-800/60 transition cursor-pointer"
                  >
                    <span className="text-cyan-400 font-mono text-xs font-semibold tracking-wider truncate">
                      {catName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
                        {activeCount}/{layersInCat.length}
                      </span>
                      <span className="text-slate-400 text-xs transform transition-transform duration-200">
                        {isCategoryCollapsed ? '►' : '▼'}
                      </span>
                    </div>
                  </button>

                  {!isCategoryCollapsed && (
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
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className="text-base group-hover:scale-110 transition-transform">
                                {layer.icon}
                              </span>
                              <div className="truncate">
                                <div
                                  className={`text-xs font-mono font-medium truncate transition-colors ${
                                    isActive
                                      ? 'text-cyan-200 font-bold'
                                      : 'text-slate-400 group-hover:text-slate-200'
                                  }`}
                                >
                                  {layer.label}
                                </div>
                                <div className="text-[9px] font-mono text-slate-500 truncate">
                                  {layer.description}
                                </div>
                              </div>
                            </div>

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
        ) : (
          <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expandir Capas"
              className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-slate-800"
            >
              ⏩
            </button>
          </div>
        )}

        {/* PIE */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
          {!isCollapsed ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SISTEMA: ONLINE
              </span>
              <span className="text-slate-500">PROYECCIÓN POLAR</span>
            </>
          ) : (
            <span className="mx-auto text-emerald-400 font-bold">●</span>
          )}
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);