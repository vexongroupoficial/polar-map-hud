'use client';

export default function LayerToggleGroup({ layers, toggleLayer, searchTerm = '' }) {
  const matchesSearch = (label, desc = '') => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return label.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  return (
    <div className="space-y-5">
      {/* SECCIÓN 1: CARTOGRAFÍA TERRESTRE Y FÍSICA */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
          <span>🌍 Cartografía y Países</span>
          <span className="text-emerald-400/80">WGS84</span>
        </h3>
        <div className="space-y-1.5">
          {matchesSearch('Continentes y Países', 'fronteras tierra masa continental') && (
            <ToggleRow
              icon="🗺️"
              label="Continentes y Masa Terrestre"
              desc="Polígonos continentales WGS84"
              checked={!!layers.continents}
              onChange={() => toggleLayer('continents')}
              accentColor="sky"
            />
          )}

          {matchesSearch('Nombres de Países y Ciudades', 'etiquetas labels capitales') && (
            <ToggleRow
              icon="🏷️"
              label="Nombres de Países y Ciudades"
              desc="Nombres geográficos y fronteras"
              checked={!!layers.labels}
              onChange={() => toggleLayer('labels')}
              accentColor="sky"
            />
          )}

          {matchesSearch('Nombres de Océanos y Mares', 'pacifico atlantico indico') && (
            <ToggleRow
              icon="🌊"
              label="Nombres de Océanos y Mares"
              desc="Rotulación náutica de cuencas"
              checked={!!layers.oceans}
              onChange={() => toggleLayer('oceans')}
              accentColor="cyan"
            />
          )}

          {matchesSearch('Relieve y Cordilleras', 'montañas topografia elevacion') && (
            <ToggleRow
              icon="🏔️"
              label="Relieve y Cordilleras"
              desc="Sombra topográfica y elevación"
              checked={!!layers.relief}
              onChange={() => toggleLayer('relief')}
              accentColor="emerald"
            />
          )}

          {matchesSearch('Placas Tectónicas', 'fosas fallas sismos') && (
            <ToggleRow
              icon="🌋"
              label="Placas Tectónicas y Fosas"
              desc="Límites geológicos y cinturón de fuego"
              checked={!!layers.tectonics}
              onChange={() => toggleLayer('tectonics')}
              accentColor="rose"
            />
          )}

          {matchesSearch('Herramienta de Medición de Distancias', 'distancia calculo regla geodesica') && (
            <ToggleRow
              icon="📏"
              label="Medición de Distancias"
              desc="Haz clic en el mapa para medir líneas geodésicas"
              checked={!!layers.measure}
              onChange={() => toggleLayer('measure')}
              accentColor="amber"
            />
          )}
        </div>
      </div>

      {/* SECCIÓN 2: ARQUEOLOGÍA Y GEOMETRÍA SAGRADA */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
          <span>✨ Arqueología y Alineaciones</span>
          <span className="text-amber-400/80">Especial</span>
        </h3>
        <div className="space-y-1.5">
          {matchesSearch('Pirámides y Sitios Antiguos', 'guiza teotihuacan caral tikal') && (
            <ToggleRow
              icon="🔺"
              label="Pirámides y Sitios Antiguos"
              desc="Marcadores de monumentos megalíticos"
              checked={!!layers.ancientSites}
              onChange={() => toggleLayer('ancientSites')}
              accentColor="amber"
            />
          )}

          {matchesSearch('Gran Círculo Antiguo', 'eje dorado alineacion guiza pascua') && (
            <ToggleRow
              icon="✨"
              label="Gran Círculo Antiguo"
              desc="Eje dorado de alineación global"
              checked={!!layers.greatCircle}
              onChange={() => toggleLayer('greatCircle')}
              accentColor="yellow"
            />
          )}

          {matchesSearch('Ángulos Armónicos', '30 60 90 120 grados red') && (
            <ToggleRow
              icon="📐"
              label="Ángulos Armónicos (30°, 60°, 90°, 120°)"
              desc="Subdivisiones radiónicas del plano"
              checked={!!layers.harmonicAngles}
              onChange={() => toggleLayer('harmonicAngles')}
              accentColor="cyan"
            />
          )}

          {matchesSearch('Escáner Radar Táctico', 'radar barrido escaneo sweep') && (
            <ToggleRow
              icon="📡"
              label="Escáner Radar Táctico"
              desc="Haz de barrido rotativo de 360°"
              checked={!!layers.radarSweep}
              onChange={() => toggleLayer('radarSweep')}
              accentColor="cyan"
            />
          )}
        </div>
      </div>

      {/* SECCIÓN 3: ASTRONOMÍA Y RED GEODÉSICA */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
          <span>🕒 Astronomía y Red Geodésica</span>
          <span className="text-sky-400/80">UTC</span>
        </h3>
        <div className="space-y-1.5">
          {matchesSearch('Zonas Horarias (Abanico UTC)', 'husos 15 grados badges') && (
            <ToggleRow
              icon="🕒"
              label="Zonas Horarias (Abanico UTC)"
              desc="Limbo graduado y husos de 15°"
              checked={!!layers.timeZones}
              onChange={() => toggleLayer('timeZones')}
              accentColor="emerald"
            />
          )}

          {matchesSearch('Meridianos y Paralelos', 'graticula ecuador tropicos') && (
            <ToggleRow
              icon="🌐"
              label="Meridianos y Paralelos"
              desc="Red de gráticula geodésica"
              checked={!!layers.graticule}
              onChange={() => toggleLayer('graticule')}
              accentColor="sky"
            />
          )}

          {matchesSearch('Día / Noche (Sol Real)', 'sol sombra luz dia noche') && (
            <ToggleRow
              icon="☀️"
              label="Día / Noche (Sol Real)"
              desc="Iluminación solar y proyección de noche"
              checked={!!layers.sunlight}
              onChange={() => toggleLayer('sunlight')}
              accentColor="yellow"
            />
          )}

          {matchesSearch('Órbita y Fases de la Luna', 'luna satelite fase') && (
            <ToggleRow
              icon="🌙"
              label="Órbita y Fases de la Luna"
              desc="Posición lunar instantánea"
              checked={!!layers.moon}
              onChange={() => toggleLayer('moon')}
              accentColor="slate"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, desc, checked, onChange, accentColor = 'sky' }) {
  const colorMap = {
    amber: 'peer-checked:bg-amber-500 text-amber-300',
    yellow: 'peer-checked:bg-yellow-500 text-yellow-300',
    cyan: 'peer-checked:bg-cyan-500 text-cyan-300',
    emerald: 'peer-checked:bg-emerald-500 text-emerald-300',
    sky: 'peer-checked:bg-sky-500 text-sky-300',
    rose: 'peer-checked:bg-rose-500 text-rose-300',
    slate: 'peer-checked:bg-slate-400 text-slate-200',
  };

  return (
    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 transition cursor-pointer group">
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <span className="text-sm shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-200 group-hover:text-slate-100 transition truncate">
            {label}
          </div>
          {desc && <div className="text-[9.5px] text-slate-400 truncate">{desc}</div>}
        </div>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`w-8 h-4.5 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer ${colorMap[accentColor]} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all`} />
      </div>
    </label>
  );
}