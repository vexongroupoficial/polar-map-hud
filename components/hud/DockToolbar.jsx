// components/hud/DockToolbar.jsx
'use client';

import { useState, useEffect } from 'react';
import { useWidgetStore } from './useWidgetStore';

export default function DockToolbar() {
  const store = useWidgetStore();
  const widgets = store?.widgets || {};
  const toggleWidget = store?.toggleWidget;
  const resetWidgets = store?.resetWidgets;

  const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);

  // Catálogo de widgets
  const WIDGET_CATALOG = {
    city: {
      label: 'Buscador',
      title: 'Buscador Geográfico',
      desc: 'Ciudades, aeropuertos e IATA',
      icon: '🔍',
      color: 'from-cyan-500/20 to-blue-500/10',
    },
    telemetry: {
      label: 'Telemetría',
      title: 'Telemetría Geodésica',
      desc: 'Coordenadas y husos UTC',
      icon: '📡',
      color: 'from-amber-500/20 to-yellow-500/10',
    },
    polarCoords: {
      label: 'Polares',
      title: 'Coordenadas Polares',
      desc: 'Radio (ρ) y Ángulo (θ)',
      icon: '📐',
      color: 'from-purple-500/20 to-indigo-500/10',
    },
    navigation2D: {
      label: 'Navegación',
      title: 'Navegación 2D',
      desc: 'Rotación y escala de zoom',
      icon: '🧭',
      color: 'from-sky-500/20 to-cyan-500/10',
    },
    luminaries: {
      label: 'Luminarias',
      title: 'Simulador Celeste',
      desc: 'Sol, Luna y efemérides',
      icon: '☀️',
      color: 'from-amber-500/25 to-orange-500/10',
    },
    erasHUD: {
      label: '12 Eras',
      title: 'Eras Precesionales',
      desc: 'Ciclo Gran Año (25,920A)',
      icon: '🏛️',
      color: 'from-rose-500/20 to-pink-500/10',
    },
  };

  const widgetKeys = Object.keys(widgets).filter((key) => key !== 'layersControl');
  const activeCount = widgetKeys.filter((key) => {
    const w = widgets[key];
    return typeof w === 'boolean' ? w : !!w?.visible;
  }).length;

  const handleToggle = (key) => {
    if (toggleWidget) toggleWidget(key);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileHubOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* A. MODO ESCRITORIO Y TABLET HORIZONTAL (CENTRADO ABSOLUTO EN EL ÁREA DEL MAPA) */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-40 items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)] font-mono text-xs select-none">
        <div className="px-3 py-1.5 text-[10px] font-black tracking-wider text-cyan-400 uppercase border-r border-slate-800 shrink-0 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>ESTACIÓN HUD</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {widgetKeys.map((key) => {
            const w = widgets[key];
            const config = WIDGET_CATALOG[key] || {
              label: w?.title || key,
              icon: '⚙️',
            };
            const isOpen = typeof w === 'boolean' ? w : !!w?.visible;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleToggle(key)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] whitespace-nowrap active:scale-95 ${
                  isOpen
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pl-1 border-l border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => resetWidgets && resetWidgets()}
            className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-extrabold uppercase transition cursor-pointer active:scale-95"
            title="Reiniciar ubicación y visibilidad"
          >
            🔄 REINICIAR
          </button>
        </div>
      </div>

      {/* B. MODO MÓVIL Y TABLET VERTICAL (FIXED CON MARGEN ELEVADO Y Z-INDEX ALTO) */}
      <div className="md:hidden fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-slate-950/95 backdrop-blur-lg border border-cyan-500/60 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] max-w-[96vw] font-mono select-none">
        <button
          type="button"
          onClick={() => setIsMobileHubOpen(true)}
          className="px-2.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 cursor-pointer shrink-0"
        >
          <span>⚡</span>
          <span>ESTACIÓN</span>
          <span className="bg-slate-950/80 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-md border border-cyan-400/40 font-bold">
            {activeCount}/{widgetKeys.length}
          </span>
        </button>

        {/* 4 ICONOS DE ACCESO RÁPIDO */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pr-0.5">
          {['city', 'navigation2D', 'luminaries', 'erasHUD'].map((key) => {
            const config = WIDGET_CATALOG[key];
            if (!config) return null;
            const w = widgets[key];
            const isOpen = typeof w === 'boolean' ? w : !!w?.visible;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleToggle(key)}
                className={`p-2 rounded-xl text-xs flex items-center justify-center border transition active:scale-95 shrink-0 ${
                  isOpen
                    ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
                title={config.title}
              >
                <span>{config.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* C. MODAL BOTTOM SHEET DE LA ESTACIÓN (MÓVIL) */}
      {isMobileHubOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md font-mono select-none">
          <div className="flex-1" onClick={() => setIsMobileHubOpen(false)} />

          <div className="bg-slate-900 border-t border-cyan-500/50 rounded-t-3xl p-4 shadow-[0_-10px_35px_rgba(6,182,212,0.25)] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 shrink-0" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎛️</span>
                <div>
                  <h2 className="text-sm font-extrabold text-cyan-300 tracking-wider uppercase">
                    ESTACIÓN CONTROL HUD
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Activa o desactiva mandos flotantes tácticos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileHubOpen(false)}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-sm font-bold border border-slate-700 active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-900">
              {widgetKeys.map((key) => {
                const w = widgets[key];
                const config = WIDGET_CATALOG[key] || {
                  title: key,
                  desc: 'Mando flotante',
                  icon: '⚙️',
                  color: 'from-slate-800 to-slate-900',
                };
                const isOpen = typeof w === 'boolean' ? w : !!w?.visible;

                return (
                  <div
                    key={key}
                    onClick={() => {
                      handleToggle(key);
                      if (!isOpen) setIsMobileHubOpen(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 bg-gradient-to-br active:scale-95 ${
                      isOpen
                        ? `${config.color} border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]`
                        : 'from-slate-950/80 to-slate-900/40 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{config.icon}</span>
                      <div
                        className={`w-3 h-3 rounded-full border transition-all ${
                          isOpen
                            ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_8px_#38bdf8]'
                            : 'bg-slate-800 border-slate-700'
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-cyan-200 uppercase truncate">
                        {config.title}
                      </h3>
                      <p className="text-[9px] text-slate-400 truncate leading-tight">
                        {config.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
                      <span className="text-slate-400 font-bold">ESTADO:</span>
                      <span
                        className={`font-black uppercase ${
                          isOpen ? 'text-cyan-300' : 'text-slate-500'
                        }`}
                      >
                        {isOpen ? '● ACTIVO' : '○ INACTIVO'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (resetWidgets) resetWidgets();
                }}
                className="flex-1 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold uppercase transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>🔄</span>
                <span>REINICIAR DISPOSICIÓN</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMobileHubOpen(false)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl text-xs uppercase transition active:scale-95"
              >
                VER MAPA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}