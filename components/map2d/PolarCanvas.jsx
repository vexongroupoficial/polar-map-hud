'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Map2DControls from './controls/Map2DControls';
import HUDTelemetryOverlay from './hud/HUDTelemetryOverlay';
import { drawOcean } from './layers/drawOcean';
import { drawOceanLabels } from './layers/drawOceanLabels';
import { drawContinents } from './layers/drawContinents';
import { drawRelief } from './layers/drawRelief';
import { drawAncientSites } from './layers/drawAncientSites';
import { drawGreatCircle } from './layers/drawGreatCircle';
import { drawGraticule } from './layers/drawGraticule';
import { drawLabels } from './layers/drawLabels';
import { drawTectonics } from './layers/drawTectonics';
import { drawSunlight } from './layers/drawSunlight';
import { drawMeasurements } from './layers/drawMeasurements';
import { drawCurrents } from './layers/drawCurrents';
import { drawTimeZones } from './layers/drawTimeZones';
import { drawAstronomy } from './layers/drawAstronomy';
import { drawHarmonicAngles } from './layers/drawHarmonicAngles';
import { drawRadarSweep } from './layers/drawRadarSweep';

/**
 * Dibuja la mira/retícula de apuntado sobre el ratón (sin haz de radar duplicado)
 */
function drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos) {
  if (!mousePos || mousePos.canvasX === undefined || mousePos.canvasY === undefined) return;

  const mx = mousePos.canvasX;
  const my = mousePos.canvasY;
  const dist = Math.hypot(mx - centerX, my - centerY);

  if (dist <= mapRadius) {
    ctx.save();
    // Anillo de enfoque
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    // Cruz carmesí
    ctx.beginPath();
    ctx.moveTo(mx - 14, my); ctx.lineTo(mx - 4, my);
    ctx.moveTo(mx + 4, my); ctx.lineTo(mx + 14, my);
    ctx.moveTo(mx, my - 14); ctx.lineTo(mx, my - 4);
    ctx.moveTo(mx, my + 4); ctx.lineTo(mx, my + 14);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.restore();
  }
}

export default function PolarCanvas({
  activeLayers,
  rotation = 0,
  setRotation,
  zoom = 1,
  setZoom,
  measurePoints = [],
  onAddMeasurePoint,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const [mousePos, setMousePos] = useState({ lat: 0, lon: 0, rho: 0, theta: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.floor(Math.min(width, height - 10));
        if (size > 280) {
          setDimensions({ width: size, height: size });
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const { width, height } = dimensions;

  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);

  const [countriesData, setCountriesData] = useState(null);
  const [reliefData, setReliefData] = useState(null);
  const [tectonicsData, setTectonicsData] = useState(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const mapRadius = (Math.min(width, height) / 2 - 45) * internalZoom;

  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const initialRotationRef = useRef(0);
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => setInternalRotation(rotation), [rotation]);
  useEffect(() => setInternalZoom(zoom), [zoom]);

  const updateRotation = useCallback(
    (valOrFn) => {
      const computeNext = (current) => {
        const newVal = typeof valOrFn === 'function' ? valOrFn(current) : valOrFn;
        return ((newVal % 360) + 360) % 360;
      };
      setInternalRotation((prev) => computeNext(prev));
      if (typeof setRotation === 'function') setRotation((prev) => computeNext(prev));
    },
    [setRotation]
  );

  /**
 * Dibuja el puntal rojo táctico en la posición exacta del ratón
 */
function drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos) {
  if (!mousePos || mousePos.canvasX === undefined || mousePos.canvasY === undefined) return;

  const mx = mousePos.canvasX;
  const my = mousePos.canvasY;
  const dist = Math.hypot(mx - centerX, my - centerY);

  // Solo dibujar el puntal si el cursor está sobre la superficie del mapa
  if (dist <= mapRadius) {
    ctx.save();

    // 1. Anillo Neón de Enfoque Cian (Suave)
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    // 2. Retícula Táctica Carmesí (Cruz de Precisión)
    ctx.beginPath();
    ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 4, my);
    ctx.moveTo(mx + 4, my); ctx.lineTo(mx + 12, my);
    ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my - 4);
    ctx.moveTo(mx, my + 4); ctx.lineTo(mx, my + 12);
    ctx.strokeStyle = '#ef4444'; // Rojo carmesí
    ctx.lineWidth = 1.2;
    ctx.setLineDash([]);
    ctx.stroke();

    // 3. PUNTAL ROJO RESPLANDECIENTE (Punto central táctico)
    // Halo difuso rojo
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fill();

    // Núcleo rojo brillante
    ctx.beginPath();
    ctx.arc(mx, my, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2222';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fill();

    ctx.restore();
  }
}

  const updateZoom = useCallback(
    (valOrFn) => {
      const computeNext = (current) => {
        const newVal = typeof valOrFn === 'function' ? valOrFn(current) : valOrFn;
        return Number(Math.min(Math.max(newVal, 0.8), 10).toFixed(2));
      };
      setInternalZoom((prev) => computeNext(prev));
      if (typeof setZoom === 'function') setZoom((prev) => computeNext(prev));
    },
    [setZoom]
  );

  useEffect(() => {
    fetch('/data/geojson/world_countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountriesData(data))
      .catch((err) => console.error('Error cargando países:', err));

    fetch('/data/geojson/world_relief.geojson')
      .then((res) => res.json())
      .then((data) => setReliefData(data))
      .catch((err) => console.error('Error cargando relieve:', err));

    fetch('/data/geojson/tectonic_plates.geojson')
      .then((res) => res.json())
      .then((data) => setTectonicsData(data))
      .catch((err) => console.error('Error cargando placas tectónicas:', err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelNative = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      updateZoom((prev) => prev * zoomFactor);
    };

    canvas.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheelNative);
  }, [updateZoom]);

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (e.ctrlKey || e.button === 1) {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      return;
    }

    if (e.button === 0) {
      isDraggingRef.current = true;
      const angleRad = Math.atan2(clickY - centerY, clickX - centerX);
      rotateStartAngleRef.current = (angleRad * 180) / Math.PI;
      initialRotationRef.current = internalRotation;
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - centerX;
    const dy = currentY - centerY;
    const rho = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(-dx, -dy);
    const lat = 90 - (rho / mapRadius) * 180;
    let lon = (theta * 180) / Math.PI - internalRotation;

    setMousePos({
      lat,
      lon,
      rho,
      theta,
      canvasX: currentX,
      canvasY: currentY,
    });

    if (isDraggingRef.current) {
      const currentAngleRad = Math.atan2(currentY - centerY, currentX - centerX);
      const currentAngleDeg = (currentAngleRad * 180) / Math.PI;
      const deltaAngle = currentAngleDeg - rotateStartAngleRef.current;
      updateRotation(initialRotationRef.current + deltaAngle);
      return;
    }

    if (isPanningRef.current) {
      setOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handlePointerUp = (e) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleContextMenu = (e) => e.preventDefault();
  const handleResetOffset = () => setOffset({ x: 0, y: 0 });

  const handleClick = (e) => {
    if (!activeLayers?.measure || typeof onAddMeasurePoint !== 'function' || isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;
    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;

    const rho = Math.sqrt(clickX * clickX + clickY * clickY);
    if (rho > mapRadius) return;

    const lat = 90 - (rho / mapRadius) * 180;
    const thetaRad = Math.atan2(-clickX, -clickY);
    let lon = (thetaRad * 180) / Math.PI - internalRotation;

    onAddMeasurePoint({ lat, lon });
  };

  // LOOP DE RENDERIZADO UNIFICADO
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2 + offset.x;
      const centerY = height / 2 + offset.y;

      // A. Malla HUD de fondo
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.restore();

      // B. Océanos y Continentes
      drawOcean(ctx, centerX, centerY, mapRadius);
      drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      if (activeLayers?.currents) {
        drawCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.continents) {
        drawContinents(ctx, countriesData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.relief) {
        drawRelief(ctx, reliefData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      // C. ESCÁNER RADAR TÁCTICO (Única llamada controlada)
      drawRadarSweep(ctx, activeLayers, centerX, centerY, mapRadius);

      // D. Red Geodésica, Husos Horarios y Geometría
      if (activeLayers?.graticule || activeLayers?.ecuador || activeLayers?.tropics) {
        drawGraticule(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.timeZones) {
        drawTimeZones(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      drawHarmonicAngles(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawGreatCircle(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      if (activeLayers?.tectonics) {
        drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.labels) {
        drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      // E. Astronomía y Medición
      if (activeLayers?.sunlight) {
        drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.sunlight || activeLayers?.moon || activeLayers?.analemma) {
        drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.measure) {
        drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      // F. Mira Táctica sobre el Cursor
      drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos);

      // Siguiente fotograma de animación
      animId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [
    width,
    height,
    activeLayers,
    mapRadius,
    countriesData,
    reliefData,
    tectonicsData,
    measurePoints,
    internalRotation,
    internalZoom,
    offset,
    mousePos,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex justify-center items-center bg-slate-950 p-1 overflow-hidden select-none"
    >
      <HUDTelemetryOverlay
        rotation={internalRotation}
        zoom={internalZoom}
        mousePos={mousePos}
      />

      <Map2DControls
        rotation={internalRotation}
        onRotateChange={updateRotation}
        zoom={internalZoom}
        onZoomChange={updateZoom}
        onResetView={handleResetOffset}
      />

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        style={{ cursor: 'none' }} 
        className="cursor-grab active:cursor-grabbing rounded-full touch-none z-10"
      />
    </div>
  );
}