// components/map2d/hud/LayersControlHUD.jsx
'use client';

export function LayersControlHUD({ activeLayers = {}, onToggleLayer }) {
  const CATEGORIES = [
    {
      name: 'Cartografía y Geodesia',
      layers: [
        { id: 'continents', label: 'Polígonos Continentales' },
        { id: 'graticule', label: 'Malla Geodésica / Meridianos' },
        { id: 'tropics', label: 'Ecuador y Trópicos' },
        { id: 'cardinal', label: 'Rosa de los Vientos' },
      ],
    },
    {
      name: 'Mecánica Celeste',
      layers: [
        { id: 'sunReal', label: 'Día / Noche (Sol Real)' },
        { id: 'lunarPhase', label: 'Fases Lunares y Nodos' },
        { id: 'zodiacHouses', label: 'Casas Zodiacales (12 Sectores)' },
        { id: 'precessionalEras', label: 'Eras Precesionales (25,920 Años)' },
      ],
    },
  ];

  return (
    <div className="w-64 max-h-80 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
      {CATEGORIES.map((cat, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="text-[10px] text-cyan-400/80 font-bold tracking-wider uppercase border-b border-cyan-900/40 pb-1">
            {cat.name}
          </div>
          <div className="space-y-1">
            {cat.layers.map((layer) => {
              const isActive = activeLayers[layer.id];
              return (
                <button
                  key={layer.id}
                  onClick={() => onToggleLayer && onToggleLayer(layer.id)}
                  className={`w-full px-2 py-1.5 rounded flex items-center justify-between transition-all text-left text-[11px] cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{layer.label}</span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-700'}`} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LayersControlHUD;