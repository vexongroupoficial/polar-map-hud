// components/map2d/hud/GrandAlignmentHUD.jsx
'use client';

export const ERAS_DATA = [
  { id: 'piscis', name: 'ERA DE PISCIS', startYear: 1, endYear: 2160, midYear: 1080, icon: '♓' },
  { id: 'aquarius', name: 'ERA DE ACUARIO', startYear: 2160, endYear: 4320, midYear: 3240, icon: '♒' },
  { id: 'capricorn', name: 'ERA DE CAPRICORNIO', startYear: 4320, endYear: 6480, midYear: 5400, icon: '♑' },
  { id: 'sagittarius', name: 'ERA DE SAGITARIO', startYear: 6480, endYear: 8640, midYear: 7560, icon: '♐' },
  { id: 'scorpio', name: 'ERA DE ESCORPIO', startYear: 8640, endYear: 10800, midYear: 9720, icon: '♏' },
  { id: 'libra', name: 'ERA DE LIBRA', startYear: 10800, endYear: 12960, midYear: 11880, icon: '♎' },
  { id: 'virgo', name: 'ERA DE VIRGO', startYear: 12960, endYear: 15120, midYear: 14040, icon: '♍' },
  { id: 'leo', name: 'ERA DE LEO', startYear: 15120, endYear: 17280, midYear: 16200, icon: '♌' },
  { id: 'cancer', name: 'ERA DE CÁNCER', startYear: 17280, endYear: 19440, midYear: 18360, icon: '♋' },
  { id: 'gemini', name: 'ERA DE GÉMINIS', startYear: 19440, endYear: 21600, midYear: 20520, icon: '♊' },
  { id: 'taurus', name: 'ERA DE TAURO', startYear: 21600, endYear: 23760, midYear: 22680, icon: '♉' },
  { id: 'aries', name: 'ERA DE ARIES', startYear: 23760, endYear: 25920, midYear: 24840, icon: '♈' },
];

export default function GrandAlignmentHUD({
  simulatedTime = Date.now(),
  setSimulatedTime,
  activeLayers = {},
  onToggleLayer,
}) {
  const date = new Date(simulatedTime);
  const currentYear = isNaN(date.getFullYear()) ? 2026 : date.getFullYear();

  // Era activa derivada del año simulado
  const currentEra =
    ERAS_DATA.find((e) => currentYear >= e.startYear && currentYear < e.endYear) ||
    ERAS_DATA[0];

  const handleSelectEra = (era) => {
    if (typeof setSimulatedTime === 'function') {
      const targetDate = new Date(simulatedTime);
      targetDate.setFullYear(era.midYear);
      setSimulatedTime(targetDate.getTime());
    }

    if (typeof onToggleLayer === 'function') {
      if (!activeLayers?.precessionalEras) onToggleLayer('precessionalEras');
      if (!activeLayers?.zodiacHouses) onToggleLayer('zodiacHouses');
    }
  };

  return (
    <div className="font-mono text-xs select-none space-y-3 text-cyan-300 w-72 p-1">
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-cyan-900/50">
        <span className="text-[10px] text-slate-400 font-bold uppercase">AÑO SIMULADO:</span>
        <span className="text-amber-300 font-extrabold tabular-nums bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
          {currentYear} d.C.
        </span>
      </div>

      <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-cyan-900/40">
        <div className="flex justify-between items-center text-[10px] pb-1 border-b border-slate-800">
          <span className="text-slate-400 font-bold">SELECCIONAR CÚSPIDE DE ERA:</span>
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
                  <span>{era.icon}</span>
                  <span className="truncate">{era.name}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono shrink-0">
                  {era.startYear} - {era.endYear} d.C.
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}