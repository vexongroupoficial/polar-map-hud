// components/map2d/hud/GrandAlignmentHUD.jsx
'use client';

import { useState } from 'react';

// El año ("year") representa la CÚSPIDE DE INICIO exacta de cada Era Precesional
const ALL_12_ERAS = [
  { id: 'pisces',     name: 'ERA DE PISCIS',     symbol: '♓', year: 1,      startYear: 1,     endYear: 2160,  range: '1 - 2160 d.C.' },
  { id: 'aquarius',   name: 'ERA DE ACUARIO',    symbol: '♒', year: 2160,   startYear: 2160,  endYear: 4320,  range: '2160 - 4320 d.C.' },
  { id: 'capricorn',  name: 'ERA DE CAPRICORNIO',symbol: '♑', year: 4320,   startYear: 4320,  endYear: 6480,  range: '4320 - 6480 d.C.' },
  { id: 'sagittarius',name: 'ERA DE SAGITARIO', symbol: '♐', year: 6480,   startYear: 6480,  endYear: 8640,  range: '6480 - 8640 d.C.' },
  { id: 'scorpio',    name: 'ERA DE ESCORPIO',   symbol: '♏', year: 8640,   startYear: 8640,  endYear: 10800, range: '8640 - 10800 d.C.' },
  { id: 'libra',      name: 'ERA DE LIBRA',     symbol: '♎', year: 10800,  startYear: 10800, endYear: 12960, range: '10800 - 12960 d.C.' },
  { id: 'virgo',      name: 'ERA DE VIRGO',     symbol: '♍', year: 12960,  startYear: 12960, endYear: 15120, range: '12960 - 15120 d.C.' },
  { id: 'leo',        name: 'ERA DE LEO',       symbol: '♌', year: 15120,  startYear: 15120, endYear: 17280, range: '15120 - 17280 d.C.' },
  { id: 'cancer',     name: 'ERA DE CÁNCER',    symbol: '♋', year: 17280,  startYear: 17280, endYear: 19440, range: '17280 - 19440 d.C.' },
  { id: 'gemini',     name: 'ERA DE GÉMINIS',   symbol: '♊', year: -6480,  startYear: -6480, endYear: -4320, range: '6480 - 4320 a.C.' },
  { id: 'taurus',     name: 'ERA DE TAURO',     symbol: '♉', year: -4320,  startYear: -4320, endYear: -2160, range: '4320 - 2160 a.C.' },
  { id: 'aries',      name: 'ERA DE ARIES',     symbol: '♈', year: -2160,  startYear: -2160, endYear: 1,     range: '2160 - 1 a.C.' },
];

export function GrandAlignmentHUD({ simulatedTime, setSimulatedTime }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentDate = new Date(simulatedTime);
  const currentYear = currentDate.getFullYear();

  const handleJumpToEra = (startYear) => {
    // Setea el tiempo simulado al Equinoccio de Primavera del primer año de la era
    const targetDate = new Date(startYear, 2, 21, 12, 0, 0);
    setSimulatedTime(targetDate.getTime());
  };

  return (
    <div className="absolute top-52 left-4 md:left-72 z-30 font-mono text-xs select-none w-72 transition-all duration-300">
      <div className="bg-slate-950/95 border border-amber-500/50 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-300 overflow-hidden">
        
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-amber-500/30">
          <div className="flex items-center gap-1.5 font-bold text-[10px] text-amber-400 tracking-wider">
            <span className="animate-pulse">🏛️</span> 12 ERAS PRECESIONALES
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-amber-950/80 border border-amber-600/60 px-1.5 py-0.5 rounded font-bold text-amber-300">
              25,920 AÑOS
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-amber-300 px-1 text-xs font-bold transition-colors"
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-2 flex flex-col gap-1.5 bg-slate-950/70 max-h-64 overflow-y-auto custom-scrollbar">
            <div className="text-[9px] text-slate-400 px-1 font-semibold tracking-wider">
              SELECCIONAR CÚSPIDE DE ERA:
            </div>

            <div className="grid grid-cols-1 gap-1">
              {ALL_12_ERAS.map((era) => {
                const isActive = currentYear >= era.startYear && currentYear < era.endYear;
                return (
                  <button
                    key={era.id}
                    onClick={() => handleJumpToEra(era.startYear)}
                    className={`px-2.5 py-1.5 border rounded text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-400 hover:text-amber-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-wide">
                      {era.symbol} {era.name}
                    </span>
                    <span className="text-[8px] opacity-80 font-mono">
                      {era.range}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default GrandAlignmentHUD;