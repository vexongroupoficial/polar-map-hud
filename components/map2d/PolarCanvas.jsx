// components/map2d/PolarCanvas.jsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// CAPAS CARTOGRÁFICAS Y GEOFÍSICAS
import { drawOcean } from './layers/drawOcean';
import { drawOceanLabels } from './layers/drawOceanLabels';
import { drawContinents } from './layers/drawContinents';
import { drawRelief } from './layers/drawRelief';
import { drawLabels } from './layers/drawLabels';

import { drawGraticule } from './layers/drawGraticule';
import { drawTimeZones } from './layers/drawTimeZones';
import { drawCompassRose } from './layers/drawCompassRose';
import { drawGreatCircle } from './layers/drawGreatCircle';
import { drawGeodesicRoutes } from './layers/drawGeodesicRoutes';
import { drawMeasurements } from './layers/drawMeasurements';
import { drawHarmonicAngles } from './layers/drawHarmonicAngles';

import { drawTectonics } from './layers/drawTectonics';
import { drawAnomalies } from './layers/drawAnomalies';
import { drawAuroraBorealis } from './layers/drawAuroraBorealis';
import { drawWindCurrents } from './layers/drawWindCurrents';
import { drawOceanCurrents } from './layers/drawOceanCurrents';
import { drawCurrents } from './layers/drawCurrents';
import { drawRadarSweep } from './layers/drawRadarSweep';

import { drawNaturalResources } from './layers/drawNaturalResources';
import { drawStrategicCrossings } from './layers/drawStrategicCrossings';
import { drawAirports } from './layers/drawAirports';
import { drawMigrationFlows } from './layers/drawMigrationFlows';
import { drawAncientSites } from './layers/drawAncientSites';

import { drawSunlight } from './layers/drawSunlight';
import { drawAstronomy } from './layers/drawAstronomy';
import { drawPlanets } from './layers/drawPlanets';
import { drawEnochCalendar } from './layers/drawEnochCalendar';
import { drawZodiacDecans } from './layers/drawZodiacDecans';
import { drawConstellations } from './layers/drawConstellations';
import { drawGrandAlignment } from './layers/drawGrandAlignment';

import { useGeoData } from './hooks/useGeoData';
import {
  getCountryAndContinentAtPoint,
  drawTargetingCrosshair,
  drawTropicsAndEquatorLayer,
} from '../../lib/geoUtils';

export default function PolarCanvas({
  activeLayers = {},
  rotation = 180,
  setRotation,
  zoom = 1,
  setZoom,
  offset = { x: 0, y: 0 },
  setOffset,
  simulatedTime = Date.now(),
  measurePoints = [],
  onAddMeasurePoint,
  onTelemetryUpdate,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { width, height } = dimensions;

  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);

  // 🎯 ESTADO LOCAL PARA DIBUJAR LA MIRILLA Y PUNTO ROJO
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

  const {
    countriesData,
    reliefData,
    tectonicsData,
    airportsData,
    anomaliesData,
  } = useGeoData();

  const mapRadius = (Math.min(width, height) / 2 - 80) * internalZoom;

  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const initialRotationRef = useRef(0);
  const panStartRef = useRef({ x: 0, y: 0 });

  const activePointersRef = useRef(new Map());
  const initialPinchDistRef = useRef(0);
  const initialPinchZoomRef = useRef(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        const size = Math.floor(Math.min(w, h - 10));
        if (size > 240) setDimensions({ width: size, height: size });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

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

  const updateOffset = useCallback(
    (valOrFn) => {
      if (typeof setOffset === 'function') setOffset(valOrFn);
    },
    [setOffset]
  );

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 2) {
      isDraggingRef.current = false;
      isPanningRef.current = false;
      const points = Array.from(activePointersRef.current.values());
      initialPinchDistRef.current = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
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
        updateZoom(initialPinchZoomRef.current * scale);
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

    const updatedPos = {
      lat,
      lon,
      rho,
      theta: thetaRad,
      canvasX: currentX,
      canvasY: currentY,
      country: geoInfo.country || 'Mar Abierto',
      continent: geoInfo.continent || 'Océano Global',
    };

    // 🎯 ACTUALIZAR MIRILLA LOCAL Y TELEMETRÍA PADRE
    setMousePos(updatedPos);
    if (typeof onTelemetryUpdate === 'function') {
      onTelemetryUpdate(updatedPos);
    }

    if (isPanningRef.current) {
      updateOffset({
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

    if (activePointersRef.current.size < 2) initialPinchDistRef.current = 0;
    if (activePointersRef.current.size === 0) {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    }
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const nextZoom = Math.min(Math.max(internalZoom * zoomFactor, 0.8), 10);

    const scaleChange = nextZoom / internalZoom;
    updateOffset((prevOffset) => ({
      x: mouseX - (mouseX - prevOffset.x) * scaleChange,
      y: mouseY - (mouseY - prevOffset.y) * scaleChange,
    }));

    updateZoom(nextZoom);
  };

  // Renderizado gráfico Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2 + offset.x;
    const centerY = height / 2 + offset.y;

    const isNeon = activeLayers?.neonMode ?? true;

    // Cuadrícula de Fondo
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

    // Capas Base
    drawOcean(ctx, centerX, centerY, mapRadius, isNeon);
    drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    

    if (activeLayers?.currents) {
      drawCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    }

    if (activeLayers?.continents && countriesData) {
      drawContinents(ctx, countriesData, centerX, centerY, mapRadius, internalRotation, internalZoom, isNeon);
    }

    if (activeLayers?.relief && reliefData) {
      drawRelief(ctx, reliefData, centerX, centerY, mapRadius, internalRotation, internalZoom);
    }

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

    if (activeLayers?.tectonics && tectonicsData) {
      drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
    }
    if (activeLayers?.labels && countriesData) {
      drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
    }

    drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, mapRadius, internalRotation);
    drawWindCurrents(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);
    

    drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
    drawAirports(ctx, airportsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
    drawStrategicCrossings(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    drawNaturalResources(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    drawMigrationFlows(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);
    drawGeodesicRoutes(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);

    if (activeLayers?.measure) {
      drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);
    }

    drawEnochCalendar(ctx, activeLayers, centerX, centerY, mapRadius);
    drawZodiacDecans(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);
    drawConstellations(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    drawGrandAlignment(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);

    drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);
    drawPlanets(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);

    if (activeLayers?.sunlight) {
      drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    }

    drawCompassRose(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
    drawAuroraBorealis(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, 3, simulatedTime);

    // 🎯 DIBUJAR MIRILLA / PUNTO ROJO
    drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos);

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
    measurePoints,
    internalRotation,
    internalZoom,
    offset,
    mousePos,
    simulatedTime,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex justify-center items-center bg-slate-950 p-1 overflow-hidden select-none touch-none"
    >
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