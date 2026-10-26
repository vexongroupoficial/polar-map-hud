'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ============================================================================
// 1. COMPONENTES HUD Y CONTROLES INTERACTIVOS
// ============================================================================
import Map2DControls from './controls/Map2DControls';
import HUDTelemetryOverlay from './hud/HUDTelemetryOverlay';
import TimeControls from './controls/TimeControls';
import EclipseDetectorHUD from './hud/EclipseDetectorHUD';
import GrandAlignmentHUD from './hud/GrandAlignmentHUD';
import CitySearch from '../ui/CitySearch';

// ============================================================================
// 2. CAPAS DE RENDERIZADO (POR DOMINIO Y PROFUNDIDAD)
// ============================================================================
// --- A. Cartografía Base e Hidrografía ---
import { drawOcean } from './layers/drawOcean';
import { drawOceanLabels } from './layers/drawOceanLabels';
import { drawContinents } from './layers/drawContinents';
import { drawRelief } from './layers/drawRelief';
import { drawLabels } from './layers/drawLabels';

// --- B. Malla Geodésica, Coordenadas y Husos ---
import { drawGraticule } from './layers/drawGraticule';
import { drawTimeZones } from './layers/drawTimeZones';
import { drawCompassRose } from './layers/drawCompassRose';
import { drawGreatCircle } from './layers/drawGreatCircle';
import { drawGeodesicRoutes } from './layers/drawGeodesicRoutes';
import { drawMeasurements } from './layers/drawMeasurements';
import { drawHarmonicAngles } from './layers/drawHarmonicAngles';

// --- C. Geofísica, Clima y Fenómenos Naturales ---
import { drawTectonics } from './layers/drawTectonics';
import { drawAnomalies } from './layers/drawAnomalies';
import { drawAuroraBorealis } from './layers/drawAuroraBorealis';
import { drawWindCurrents } from './layers/drawWindCurrents';
import { drawOceanCurrents } from './layers/drawOceanCurrents';
import { drawCurrents } from './layers/drawCurrents';
import { drawRadarSweep } from './layers/drawRadarSweep';

// --- D. Infraestructura, Recursos y Vías de Comunicación ---
import { drawNaturalResources } from './layers/drawNaturalResources';
import { drawStrategicCrossings } from './layers/drawStrategicCrossings';
import { drawAirports } from './layers/drawAirports';
import { drawMigrationFlows } from './layers/drawMigrationFlows';
import { drawAncientSites } from './layers/drawAncientSites';

// --- E. Mecánica Celeste, Enoc, Zodíaco y Eras Precesionales ---
import { drawSunlight } from './layers/drawSunlight';
import { drawAstronomy } from './layers/drawAstronomy';
import { drawPlanets } from './layers/drawPlanets';
import { drawEnochCalendar } from './layers/drawEnochCalendar';
import { drawZodiacDecans } from './layers/drawZodiacDecans';
import { drawConstellations } from './layers/drawConstellations';
import { drawGrandAlignment } from './layers/drawGrandAlignment';

// ============================================================================
// 3. UTILIDADES GEODÉSICAS Y DATOS GEOESPACIALES
// ============================================================================
import { useGeoData } from './hooks/useGeoData';
import {
  getCountryAndContinentAtPoint,
  drawTargetingCrosshair,
  drawTropicsAndEquatorLayer,
} from '../../lib/geoUtils';

export default function PolarCanvas({
  activeLayers,
  rotation = 180,
  setRotation,
  zoom = 1,
  setZoom,
  measurePoints = [],
  onAddMeasurePoint,
  onToggleLayer,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // --------------------------------------------------------------------------
  // ESTADOS PRINCIPALES DE INTERFAZ Y NAVEGACIÓN
  // --------------------------------------------------------------------------
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { width, height } = dimensions;

  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);
  const [internalNeonMode, setInternalNeonMode] = useState(
    activeLayers?.neonMode ?? true
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [mousePos, setMousePos] = useState({
    lat: 0,
    lon: 0,
    rho: 0,
    theta: 0,
    canvasX: 400,
    canvasY: 400,
    country: 'Mar Abierto',
    continent: 'Océano Global',
  });

  // --------------------------------------------------------------------------
  // MOTOR KINEMÁTICO TEMPORAL (60 FPS)
  // --------------------------------------------------------------------------
  const [simulatedTime, setSimulatedTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const simulatedTimeRef = useRef(simulatedTime);
  const isPausedRef = useRef(isPaused);
  const speedMultiplierRef = useRef(speedMultiplier);
  const lastFrameTimeRef = useRef(performance.now());

  // Sincronización continua de referencias mutables
  useEffect(() => {
    simulatedTimeRef.current = simulatedTime;
  }, [simulatedTime]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    if (activeLayers?.neonMode !== undefined) {
      setInternalNeonMode(activeLayers.neonMode);
    }
  }, [activeLayers?.neonMode]);

  const handleToggleNeon = useCallback(() => {
    setInternalNeonMode((prev) => !prev);
    if (typeof onToggleLayer === 'function') {
      onToggleLayer('neonMode');
    }
  }, [onToggleLayer]);

  const handleResetRealTime = () => {
    const now = Date.now();
    simulatedTimeRef.current = now;
    setSimulatedTime(now);
    setSpeedMultiplier(1);
    setIsPaused(false);
  };

  // Carga de datos vectoriales geoespaciales
  const {
    countriesData,
    reliefData,
    tectonicsData,
    airportsData,
    anomaliesData,
    jetStreamsData,
  } = useGeoData();

  const mapRadius = (Math.min(width, height) / 2 - 80) * internalZoom;

  // Referencias para eventos táctiles y de ratón (Pinch / Pan / Rotate)
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const initialRotationRef = useRef(0);
  const panStartRef = useRef({ x: 0, y: 0 });

  const activePointersRef = useRef(new Map());
  const initialPinchDistRef = useRef(0);
  const initialPinchZoomRef = useRef(1);

  // --------------------------------------------------------------------------
  // RESPONSIVIDAD DEL CONTENEDOR CANVAS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        const size = Math.floor(Math.min(w, h - 10));
        if (size > 280) setDimensions({ width: size, height: size });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => setInternalRotation(rotation), [rotation]);
  useEffect(() => setInternalZoom(zoom), [zoom]);

  // --------------------------------------------------------------------------
  // HANDLERS DE TRANSFORMACIÓN Y NAVEGACIÓN 2D
  // --------------------------------------------------------------------------
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

  const handleSelectCity = (lat, lon) => {
    const targetRotation = (180 - lon + 360) % 360;
    updateRotation(targetRotation);

    const targetZoom = 2.8;
    const currentMapRadius = (Math.min(width, height) / 2 - 45) * targetZoom;
    const radius = currentMapRadius * ((90 - lat) / 180);
    const thetaRad = ((lon + (targetRotation - 180)) * Math.PI) / 180;

    const targetX = radius * Math.sin(thetaRad);
    const targetY = radius * Math.cos(thetaRad);

    setOffset({
      x: -targetX,
      y: -targetY,
    });

    updateZoom(targetZoom);
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2) {
      isDraggingRef.current = false;
      isPanningRef.current = false;

      const points = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = internalZoom;
      return;
    }

    if (activePointersRef.current.size === 1) {
      const rect = canvas.getBoundingClientRect();
      const centerX = width / 2 + offset.x;
      const centerY = height / 2 + offset.y;
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const distToCenter = Math.hypot(clickX - centerX, clickY - centerY);

      if (distToCenter > mapRadius * 0.82 && distToCenter <= mapRadius * 1.15) {
        isDraggingRef.current = true;
        isPanningRef.current = false;
        const angleRad = Math.atan2(clickY - centerY, clickX - centerX);
        rotateStartAngleRef.current = (angleRad * 180) / Math.PI;
        initialRotationRef.current = internalRotation;
      } else {
        isPanningRef.current = true;
        isDraggingRef.current = false;
        panStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      }
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2) {
      const points = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

      if (initialPinchDistRef.current > 0) {
        const scale = currentDist / initialPinchDistRef.current;
        const nextZoom = initialPinchZoomRef.current * scale;
        updateZoom(nextZoom);
      }
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const dx = currentX - centerX;
    const dy = currentY - centerY;
    const rho = Math.hypot(dx, dy);

    const lat = 90 - (rho / mapRadius) * 180;
    let thetaRad = Math.atan2(dx, dy);
    let thetaDeg = (thetaRad * 180) / Math.PI;

    let lon = thetaDeg - (internalRotation - 180);
    lon = (((lon + 180) % 360) + 360) % 360 - 180;

    const geoInfo = getCountryAndContinentAtPoint(lat, lon, countriesData);

    setMousePos({
      lat,
      lon,
      rho,
      theta: thetaRad,
      canvasX: currentX,
      canvasY: currentY,
      country: geoInfo.country,
      continent: geoInfo.continent,
    });

    if (isPanningRef.current) {
      setOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    if (isDraggingRef.current) {
      const currentAngleRad = Math.atan2(currentY - centerY, currentX - centerX);
      const currentAngleDeg = (currentAngleRad * 180) / Math.PI;
      const deltaAngle = currentAngleDeg - rotateStartAngleRef.current;
      updateRotation(initialRotationRef.current + deltaAngle);
    }
  };

  const handlePointerUp = (e) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size < 2) {
      initialPinchDistRef.current = 0;
    }
    if (activePointersRef.current.size === 0) {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    }
  };

  const handleResetOffset = () => {
    setOffset({ x: 0, y: 0 });
    updateRotation(180);
    updateZoom(1.0);
  };

  const handleClick = (e) => {
    if (!activeLayers?.measure) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;

    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;

    const rho = Math.hypot(clickX, clickY);
    if (rho > mapRadius) return;

    const lat = 90 - (rho / mapRadius) * 180;
    let thetaRad = Math.atan2(clickX, clickY);
    let lon = (thetaRad * 180) / Math.PI - (internalRotation - 180);
    lon = (((lon + 180) % 360) + 360) % 360 - 180;

    if (typeof onAddMeasurePoint === 'function') {
      onAddMeasurePoint({ lat, lon });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const nextZoom = Math.min(Math.max(internalZoom * zoomFactor, 0.8), 10);

    const scaleChange = nextZoom / internalZoom;
    setOffset((prevOffset) => ({
      x: mouseX - (mouseX - prevOffset.x) * scaleChange,
      y: mouseY - (mouseY - prevOffset.y) * scaleChange,
    }));

    updateZoom(nextZoom);
  };

  // --------------------------------------------------------------------------
  // BUCLE DE RENDERIZADO FLUIDO (CANVAS 2D A 60 FPS)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    lastFrameTimeRef.current = performance.now();

    const renderFrame = (now) => {
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Avanzar el reloj de simulación si no está en pausa
      if (!isPausedRef.current && deltaMs > 0) {
        simulatedTimeRef.current += deltaMs * speedMultiplierRef.current;
        setSimulatedTime(simulatedTimeRef.current);
      }

      const currentSimTime = simulatedTimeRef.current;

      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2 + offset.x;
      const centerY = height / 2 + offset.y;

      // --- 1. Fondo de Cuadrícula Táctica ---
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

      // --- 2. Cartografía Base y Geografía ---
      drawOcean(ctx, centerX, centerY, mapRadius);
      drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      if (activeLayers?.currents) {
        drawCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      if (activeLayers?.continents && countriesData) {
        drawContinents(
          ctx,
          countriesData,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          internalZoom,
          internalNeonMode
        );
      }

      if (activeLayers?.relief && reliefData) {
        drawRelief(ctx, reliefData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      // --- 3. Malla Geodésica y Guías Tácticas ---
      drawRadarSweep(ctx, activeLayers, centerX, centerY, mapRadius);

      if (activeLayers?.graticule) {
        drawGraticule(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.equatorAndTropics) {
        drawTropicsAndEquatorLayer(ctx, centerX, centerY, mapRadius);
      }
      if (activeLayers?.timeZones) {
        drawTimeZones(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      drawHarmonicAngles(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawGreatCircle(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      // --- 4. Capas Geofísicas y Fenómenos ---
      if (activeLayers?.tectonics && tectonicsData) {
        drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.labels && countriesData) {
        drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawWindCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);
      drawOceanCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      // --- 5. Infraestructura, Puntos de Interés y Rutas ---
      drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawAirports(ctx, airportsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawStrategicCrossings(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawNaturalResources(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawMigrationFlows(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);
      drawGeodesicRoutes(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);

      if (activeLayers?.measure) {
        drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      // --- 6. Mecánica Celeste, Zodíaco, Enoc y Eras Precesionales ---
      drawEnochCalendar(ctx, activeLayers, centerX, centerY, mapRadius);
      drawZodiacDecans(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);
      drawConstellations(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawGrandAlignment(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);

      drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);
      drawPlanets(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, currentSimTime);

      if (activeLayers?.sunlight) {
        drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      // --- 7. Indicadores de Cierre y Mirilla Táctica ---
      drawCompassRose(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAuroraBorealis(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, 3, currentSimTime);
      drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos);

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

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
    airportsData,
    anomaliesData,
    jetStreamsData,
    measurePoints,
    internalRotation,
    internalZoom,
    internalNeonMode,
    offset,
    mousePos,
  ]);

  // --------------------------------------------------------------------------
  // LAYOUT GENERAL Y MÓDULOS FLOTANTES HUD
  // --------------------------------------------------------------------------
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex justify-center items-center bg-slate-950 p-1 overflow-hidden select-none touch-none"
    >
      {/* 1. BUSCADOR DE CIUDADES / AEROPUERTOS Y TELEMETRÍA GEOGRÁFICA (SUPERIOR IZQUIERDA) */}
      <div className="absolute top-4 left-4 md:left-72 z-30">
        <CitySearch onSelectLocation={handleSelectCity} airportsData={airportsData} />
      </div>

      {/* 2. PANEL DE ALINEACIONES Y ERAS PRECESIONALES (DEBAJO DEL BUSCADOR) */}
      <GrandAlignmentHUD
        simulatedTime={simulatedTime}
        setSimulatedTime={(t) => {
          simulatedTimeRef.current = t;
          setSimulatedTime(t);
        }}
      />

      {/* 3. DETECTOR DE ECLIPSES Y NODOS LUNARES (SUPERIOR DERECHA) */}
      <EclipseDetectorHUD simulatedTime={simulatedTime} />

      {/* 4. REPRODUCTOR KINEMÁTICO TEMPORAL (ESQUINA INFERIOR DERECHA) */}
      <TimeControls
        simulatedTime={simulatedTime}
        setSimulatedTime={(timeOrFn) => {
          const nextTime = typeof timeOrFn === 'function' ? timeOrFn(simulatedTimeRef.current) : timeOrFn;
          simulatedTimeRef.current = nextTime;
          setSimulatedTime(nextTime);
        }}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        speedMultiplier={speedMultiplier}
        setSpeedMultiplier={setSpeedMultiplier}
        onResetRealTime={handleResetRealTime}
      />

      {/* 5. TELEMETRÍA DE COORDENADAS POLARES (ESQUINA INFERIOR IZQUIERDA) */}
      <HUDTelemetryOverlay
        rotation={internalRotation}
        zoom={internalZoom}
        mousePos={mousePos}
      />

      {/* 6. CONSOLA DE NAVEGACIÓN 2D Y ROTACIÓN (ESQUINA SUPERIOR DERECHA) */}
      <Map2DControls
        rotation={internalRotation}
        onRotateChange={updateRotation}
        zoom={internalZoom}
        onZoomChange={updateZoom}
        onResetView={handleResetOffset}
        activeLayers={{ ...activeLayers, neonMode: internalNeonMode }}
        onToggleLayer={handleToggleNeon}
      />

      {/* LIENZO PRINCIPAL POLAR CANVAS */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleClick}
        onWheel={handleWheel}
        style={{ cursor: 'none' }}
        className="rounded-full touch-none z-10"
      />
    </div>
  );
}