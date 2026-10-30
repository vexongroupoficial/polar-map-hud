// components/hud/DraggableWidget.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useWidgetStore } from './useWidgetStore';

export default function DraggableWidget({
  id,
  title,
  icon = '🎛️',
  defaultPosition = { x: 20, y: 70 },
  onClose,
  children,
}) {
  const store = useWidgetStore();
  const widgetState = store?.widgets?.[id] || {};
  const updatePosition = store?.updatePosition;
  const bringToFront = store?.bringToFront;

  const [isCollapsed, setIsCollapsed] = useState(widgetState.isCollapsed || false);
  const [mounted, setMounted] = useState(false);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const rawX = widgetState.x ?? defaultPosition.x;
  const rawY = widgetState.y ?? defaultPosition.y;
  const zIndex = widgetState.zIndex ?? 10;

  const [clampedPos, setClampedPos] = useState({ x: rawX, y: rawY });

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    const widgetWidth = isMobile ? Math.min(320, window.innerWidth - 24) : 320;

    let safeX = rawX;
    let safeY = rawY;

    if (rawX + widgetWidth > window.innerWidth || rawX < 0) {
      safeX = isMobile
        ? Math.max(12, Math.floor((window.innerWidth - widgetWidth) / 2))
        : Math.min(Math.max(10, rawX), window.innerWidth - 330);
    }

    if (rawY > window.innerHeight - 80 || rawY < 50) {
      safeY = 70;
    }

    setClampedPos({ x: safeX, y: safeY });
  }, [rawX, rawY]);

  // Garantiza render idéntico al SSR durante la hidratación inicial
  const activePos = mounted ? clampedPos : { x: rawX, y: rawY };

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    if (bringToFront) bringToFront(id);

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - activePos.x,
      y: e.clientY - activePos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;

    const maxX = Math.max(10, window.innerWidth - 280);
    const maxY = Math.max(10, window.innerHeight - 100);
    const safeX = Math.min(Math.max(10, nextX), maxX);
    const safeY = Math.min(Math.max(50, nextY), maxY);

    setClampedPos({ x: safeX, y: safeY });
    if (updatePosition) updatePosition(id, safeX, safeY);
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${activePos.x}px, ${activePos.y}px, 0)`,
        zIndex,
      }}
      className="fixed top-0 left-0 w-[92vw] max-w-xs sm:w-auto bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden select-none touch-none transition-transform duration-75"
    >
      {/* BARRA SUPERIOR ARRASTRABLE */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="px-3 py-2 bg-slate-950/90 border-b border-cyan-900/50 flex items-center justify-between cursor-grab active:cursor-grabbing text-xs font-mono"
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="text-base">{icon}</span>
          <span className="font-extrabold tracking-wider text-cyan-300 uppercase truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 transition text-[11px] font-bold border border-slate-800"
            title={isCollapsed ? 'Expandir' : 'Minimizar'}
          >
            {isCollapsed ? '┼' : '─'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-950/70 hover:bg-red-900 text-red-300 transition text-[11px] font-bold border border-red-800/50"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* CONTENIDO INTERNO */}
      {!isCollapsed && (
        <div className="p-2.5 overflow-y-auto max-h-[50vh] sm:max-h-[70vh] scrollbar-thin scrollbar-thumb-cyan-900">
          {children}
        </div>
      )}
    </div>
  );
}