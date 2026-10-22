'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Map2DControls from './controls/Map2DControls';
import HUDTelemetryOverlay from './hud/HUDTelemetryOverlay';

// Capas de renderizado
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
import { drawAirports } from './layers/drawAirports';
import { drawAnomalies } from './layers/drawAnomalies';
import { drawWindCurrents } from './layers/drawWindCurrents';
import { drawGeodesicRoutes } from './layers/drawGeodesicRoutes';
import CitySearch from '../ui/CitySearch';

// Módulos independientes
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
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // 1. Estado de Dimensiones
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { width, height } = dimensions;

  // 2. Estados de Navegación e Interactividad
  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);
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

  // 3. Carga limpia de Datos GeoJSON mediante Hook
  const {
    countriesData,
    reliefData,
    tectonicsData,
    airportsData,
    anomaliesData,
    jetStreamsData,
  } = useGeoData();

  // 4. Radio de Mapeo
  const mapRadius = (Math.min(width, height) / 2 - 45) * internalZoom;

  // Referencias para la interacción del Mouse/Touch
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const initialRotationRef = useRef(0);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Referencias exclusivas para control Táctil Multi-touch (Pinch-to-Zoom de 2 Puntos)
  const activePointersRef = useRef(new Map());
  const initialPinchDistRef = useRef(0);
  const initialPinchZoomRef = useRef(1);

  // Redimensionamiento Responsivo
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

  // Actualizadores
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

  // CENTRADO FOCAL EN CIUDAD/AEROPUERTO
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

  // MANEJADORES POINTER TÁCTILES Y DE RATÓN
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // CASO A: DOS DEDOS (ZOOM TÁCTIL)
    if (activePointersRef.current.size === 2) {
      isDraggingRef.current = false;
      isPanningRef.current = false;

      const points = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = internalZoom;
      return;
    }

    // CASO B: UN SOLO DEDO O CURSOR DE RATÓN
    if (activePointersRef.current.size === 1) {
      const rect = canvas.getBoundingClientRect();
      const centerX = width / 2 + offset.x;
      const centerY = height / 2 + offset.y;
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const distToCenter = Math.hypot(clickX - centerX, clickY - centerY);

      // Si se toca el anillo exterior (perímetro), se activa la ROTACIÓN Azimutal
      if (distToCenter > mapRadius * 0.82 && distToCenter <= mapRadius * 1.15) {
        isDraggingRef.current = true;
        isPanningRef.current = false;
        const angleRad = Math.atan2(clickY - centerY, clickX - centerX);
        rotateStartAngleRef.current = (angleRad * 180) / Math.PI;
        initialRotationRef.current = internalRotation;
      } else {
        // En cualquier otra zona interior, 1 dedo DESPLAZA EL PLANO en 4 direcciones (Pan)
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

    // CASO 1: PINCH TO ZOOM DE DOS DEDOS
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

// CASO 2: DESPLAZAMIENTO (PAN) / ROTACIÓN DE UN DEDO Y TELEMETRÍA
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

    // Desplazamiento del plano en 4 direcciones
    if (isPanningRef.current) {
      setOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

// Rotación sobre el compás
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

  // 5. Bucle de Renderizado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2 + offset.x;
      const centerY = height / 2 + offset.y;

      // Fondo HUD
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

      // Renderizado de capas
      drawOcean(ctx, centerX, centerY, mapRadius);
      drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      if (activeLayers?.currents) drawCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      if (activeLayers?.continents && countriesData) drawContinents(ctx, countriesData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      if (activeLayers?.relief && reliefData) drawRelief(ctx, reliefData, centerX, centerY, mapRadius, internalRotation, internalZoom);

      drawRadarSweep(ctx, activeLayers, centerX, centerY, mapRadius);

      if (activeLayers?.graticule) drawGraticule(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      if (activeLayers?.equatorAndTropics) drawTropicsAndEquatorLayer(ctx, centerX, centerY, mapRadius);
      if (activeLayers?.timeZones) drawTimeZones(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);

      drawHarmonicAngles(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawGreatCircle(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      if (activeLayers?.tectonics && tectonicsData) drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      if (activeLayers?.labels && countriesData) drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      drawWindCurrents(ctx, jetStreamsData, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAirports(ctx, airportsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawGeodesicRoutes(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);

      if (activeLayers?.sunlight) drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      if (activeLayers?.sunlight || activeLayers?.moon || activeLayers?.analemma) drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      if (activeLayers?.measure) drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);

      // DIBUJAR LA MIRA TÁCTICA SOBRE EL CURSOR EN TIEMPO REAL
      drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos);

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
    airportsData,
    anomaliesData,
    jetStreamsData,
    measurePoints,
    internalRotation,
    internalZoom,
    offset,
    mousePos,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex justify-center items-center bg-slate-950 p-1 overflow-hidden select-none touch-none"
    >
      <CitySearch onSelectLocation={handleSelectCity} airportsData={airportsData} />

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
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleClick}
        onWheel={handleWheel}
        style={{ cursor: 'none' }}
        className="rounded-full touch-none z-10"
      />
    </div>
  );
}