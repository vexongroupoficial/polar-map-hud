'use client';

// Sincronización 1:1 con Casa I (ASC / Aries a 0°) ha ciclo precesional (-2160 a.C. guive)
export const ERAS_DATA = [
  { id: 'aries', name: 'ERA DE ARIES', startYear: -2160, endYear: 0, midYear: -1080, icon: '♈', house: 1, color: '#ef4444' },
  { id: 'piscis', name: 'ERA DE PISCIS', startYear: 0, endYear: 2160, midYear: 1080, icon: '♓', house: 12, color: '#94a3b8' },
  { id: 'aquarius', name: 'ERA DE ACUARIO', startYear: 2160, endYear: 4320, midYear: 3240, icon: '♒', house: 11, color: '#f43f5e' },
  { id: 'capricorn', name: 'ERA DE CAPRICORNIO', startYear: 4320, endYear: 6480, midYear: 5400, icon: '♑', house: 10, color: '#ec4899' },
  { id: 'sagittarius', name: 'ERA DE SAGITARIO', startYear: 6480, endYear: 8640, midYear: 7560, icon: '♐', house: 9, color: '#a855f7' },
  { id: 'scorpio', name: 'ERA DE ESCORPIO', startYear: 8640, endYear: 10800, midYear: 9720, icon: '♏', house: 8, color: '#6366f1' },
  { id: 'libra', name: 'ERA DE LIBRA', startYear: 10800, endYear: 12960, midYear: 11880, icon: '♎', house: 7, color: '#3b82f6' },
  { id: 'virgo', name: 'ERA DE VIRGO', startYear: 12960, endYear: 15120, midYear: 14040, icon: '♍', house: 6, color: '#38bdf8' },
  { id: 'leo', name: 'ERA DE LEO', startYear: 15120, endYear: 17280, midYear: 16200, icon: '♌', house: 5, color: '#06b6d4' },
  { id: 'cancer', name: 'ERA DE CÁNCER', startYear: 17280, endYear: 19440, midYear: 18360, icon: '♋', house: 4, color: '#10b981' },
  { id: 'gemini', name: 'ERA DE GÉMINIS', startYear: 19440, endYear: 21600, midYear: 20520, icon: '♊', house: 3, color: '#eab308' },
  { id: 'taurus', name: 'ERA DE TAURO', startYear: 21600, endYear: 23760, midYear: 22680, icon: '♉', house: 2, color: '#f59e0b' },
];

export default function GrandAlignmentHUD({
  simulatedTime = Date.now(),
  setSimulatedTime,
  activeLayers = {},
  onToggleLayer,
}) {
  // Manejo de fecha o año directo (soporta a.C. y d.C.)
  const currentYear = typeof simulatedTime === 'number'
    ? (simulatedTime > 100000 || simulatedTime < -100000
        ? new Date(simulatedTime).getFullYear()
        : simulatedTime)
    : new Date(simulatedTime || Date.now()).getFullYear();

  // Era activa oñembosa'yva año simulado rehe
  const currentEra =
    ERAS_DATA.find((e) => currentYear >= e.startYear && currentYear < e.endYear) ||
    ERAS_DATA[0];

  const handleSelectEra = (era) => {
    if (typeof setSimulatedTime === 'function') {
      // Si pasa un año directo o timestamp
      setSimulatedTime(era.midYear);
    }

    if (typeof onToggleLayer === 'function') {
      if (!activeLayers?.precessionalEras) onToggleLayer('precessionalEras');
      if (!activeLayers?.zodiacHouses) onToggleLayer('zodiacHouses');
    }
  };

  return (
    <div className="font-mono text-xs select-none space-y-3 text-cyan-300 w-76 p-1">
      {/* Indicador de año */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-cyan-900/50">
        <span className="text-[10px] text-slate-400 font-bold uppercase">AÑO SIMULADO:</span>
        <span className="text-amber-300 font-extrabold tabular-nums bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
          {currentYear >= 0 ? `${currentYear} d.C.` : `${Math.abs(currentYear)} a.C.`}
        </span>
      </div>

      {/* Selector de Eras */}
      <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-cyan-900/40">
        <div className="flex justify-between items-center text-[10px] pb-1 border-b border-slate-800">
          <span className="text-slate-400 font-bold uppercase">SELECCIONAR CÚSPIDE DE ERA:</span>
          <span className="text-cyan-400 font-bold">25,920 AÑOS</span>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1 pt-1 pr-1 scrollbar-thin scrollbar-thumb-cyan-900">
          {ERAS_DATA.map((era) => {
            const isSelected = currentEra.id === era.id;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => handleSelectEra(era)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-left font-bold transition flex items-center justify-between text-[11px] cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span style={{ color: era.color }}>{era.icon}</span>
                  <span className="truncate">{era.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-slate-400 font-mono">
                    {era.startYear >= 0 ? `${era.startYear}` : `${Math.abs(era.startYear)} a.C.`}
                  </span>
                  <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-bold text-cyan-400">
                    CASA {era.house}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}