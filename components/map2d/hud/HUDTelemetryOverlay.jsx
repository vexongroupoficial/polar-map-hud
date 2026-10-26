'use client';

import { useState, useEffect, useRef } from 'react';

export default function HUDTelemetryOverlay({
  rotation = 0,
  zoom = 1,
  mousePos = { lat: 0, lon: 0, rho: 0, theta: 0 },
}) {
  const [fps, setFps] = useState(60);
  const [utcTime, setUtcTime] = useState('');
  const canvasWaveRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;
    let phase = 0;

    const animateWave = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      const canvas = canvasWaveRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        phase += 0.06;

        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.08 + phase) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(animateWave);
    };

    animId = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden font-mono select-none">
      {/* TELEMETRÍA SUPERIOR IZQUIERDA (Para no colisionar con los controles de la derecha) */}
      <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-sky-500/30 p-3 rounded-xl shadow-2xl min-w-[210px] space-y-1 text-[10px]">
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-1 mb-1">
          <span className="text-sky-400 font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TELEMETRÍA GEODÉSICA
          </span>
          <span className="text-emerald-400 font-bold">{fps} FPS</span>
        </div>

        <div className="space-y-0.5 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">HORA UTC:</span>
            <span className="text-sky-300 font-bold">{utcTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">LATITUD:</span>
            <span className="text-emerald-300 font-bold">
              {mousePos.lat !== null && !isNaN(mousePos.lat) ? `${mousePos.lat.toFixed(4)}° N` : '--'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">LONGITUD:</span>
            <span className="text-emerald-300 font-bold">
              {mousePos.lon !== null && !isNaN(mousePos.lon) ? `${mousePos.lon.toFixed(4)}° E` : '--'}
            </span>
          </div>
          {/* Sección de Telemetría Cartográfica Táctica */}
          <div className="border-t border-cyan-500/30 pt-2 space-y-1.5 text-[10px] font-mono transition-all duration-150">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">CONTINENTE:</span>
              <span className="text-sky-300 font-bold tracking-wide truncate max-w-[150px] bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
                {mousePos?.continent || 'Océano Global'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">REGIÓN / PAÍS:</span>
              <span className="text-amber-300 font-bold tracking-wide truncate max-w-[150px] bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                {mousePos?.country || 'Mar Abierto'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COORDENADAS POLARES INFERIOR IZQUIERDA */}
      <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md border border-sky-500/30 p-3 rounded-xl shadow-2xl min-w-[210px] space-y-1 text-[10px]">
        <div className="text-amber-400 font-bold tracking-wider border-b border-amber-500/20 pb-1 mb-1">
          📐 COORDENADAS POLARES (ρ, θ)
        </div>
        <div className="space-y-0.5 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">RADIO POLAR (ρ):</span>
            <span className="text-amber-300 font-bold">
              {mousePos.rho ? `${mousePos.rho.toFixed(1)} px` : '0 px'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">ÁNGULO AZIMUT (θ):</span>
            <span className="text-amber-300 font-bold">
              {mousePos.theta ? `${((mousePos.theta * 180) / Math.PI).toFixed(1)}°` : '0°'}
            </span>
          </div>
        </div>
      </div>
     

      {/* OSCILOSCOPIO INFERIOR DERECHO 
      {/*
      <div className="absolute bottom-4 right-4 bg-slate-950/85 backdrop-blur-md border border-sky-500/30 p-2.5 rounded-xl shadow-2xl min-w-[180px] space-y-1 text-[9px]">
        <div className="text-sky-400 font-bold tracking-wider border-b border-sky-500/20 pb-1 flex items-center justify-between">
          <span>VECTOR FRECUENCIA</span>
          <span className="text-emerald-400 text-[8px] animate-pulse">LIVE</span>
        </div>
        <canvas ref={canvasWaveRef} width={160} height={32} className="w-full h-8 rounded bg-slate-900/60" />
      </div>*/}
    </div>
    
  );
}