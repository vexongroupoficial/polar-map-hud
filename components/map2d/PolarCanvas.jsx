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

// Nuevas capas
import { drawAirports } from './layers/drawAirports';
import { drawAnomalies } from './layers/drawAnomalies';
import { drawWindCurrents } from './layers/drawWindCurrents';

/**
 * Algoritmo Ray-Casting para detectar si un punto [lng, lat] está dentro de un polígono GeoJSON
 */
function pointInPolygon(point, polygonCoordinates) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
    const [xi, yi] = polygonCoordinates[i];
    const [xj, yj] = polygonCoordinates[j];

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Realiza la búsqueda espacial en los datos GeoJSON de los países
 */
function getCountryAndContinentAtPoint(lat, lon, countriesGeoJSON) {
  if (!countriesGeoJSON || !countriesGeoJSON.features) {
    return { country: "Mar Abierto / Océano", continent: "Cuenca Global" };
  }

  const point = [lon, lat];

  for (const feature of countriesGeoJSON.features) {
    const geometry = feature.geometry;
    const properties = feature.properties || {};
    const countryName = properties.name || properties.ADMIN || properties.NAME || "Territorio Desconocido";
    const continentName = properties.continent || properties.REGION_UN || properties.CONTINENT || "Masa Continental";

    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) {
        if (pointInPolygon(point, ring)) {
          return { country: countryName, continent: continentName };
        }
      }
    } else if (geometry.type === "MultiPolygon") {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          if (pointInPolygon(point, ring)) {
            return { country: countryName, continent: continentName };
          }
        }
      }
    }
  }

  return { country: "Mar Abierto / Océano", continent: "Océano Global" };
}

/**
 * Dibuja la mira táctica sobre el cursor
 */
function drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos) {
  if (!mousePos || mousePos.canvasX === undefined || mousePos.canvasY === undefined) return;

  const mx = mousePos.canvasX;
  const my = mousePos.canvasY;
  const dist = Math.hypot(mx - centerX, my - centerY);

  if (dist <= mapRadius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 4, my);
    ctx.moveTo(mx + 4, my); ctx.lineTo(mx + 12, my);
    ctx.moveTo(mx, my - 12); ctx.lineTo(mx, my - 4);
    ctx.moveTo(mx, my + 4); ctx.lineTo(mx, my + 12);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mx, my, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2222';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Dibuja el Ecuador y los Trópicos
 */
function drawTropicsAndEquatorLayer(ctx, centerX, centerY, maxRadius) {
  const parallels = [
    { name: 'CÁNCER (+23.43°)', lat: 23.43, color: 'rgba(56, 189, 248, 0.5)', dash: [4, 4] },
    { name: 'ECUADOR (0°)', lat: 0, color: 'rgba(239, 68, 68, 0.9)', dash: [] },
    { name: 'CAPRICORNIO (-23.43°)', lat: -23.43, color: 'rgba(56, 189, 248, 0.5)', dash: [4, 4] }
  ];

  parallels.forEach(p => {
    const radius = maxRadius * ((90 - p.lat) / 180);
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.lat === 0 ? 1.5 : 1;
    ctx.setLineDash(p.dash);
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.font = '9px monospace';
    ctx.fillText(p.name, centerX + 6, centerY - radius - 4);
    ctx.restore();
  });
}

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

  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const [mousePos, setMousePos] = useState({ 
    lat: 0, lon: 0, rho: 0, theta: 0, 
    country: 'Mar Abierto', continent: 'Océano Global' 
  });

  const { width, height } = dimensions;

  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);

  // Datos GeoJSON
  const [countriesData, setCountriesData] = useState(null);
  const [reliefData, setReliefData] = useState(null);
  const [tectonicsData, setTectonicsData] = useState(null);
  const [airportsData, setAirportsData] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [jetStreamsData, setJetStreamsData] = useState(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const mapRadius = (Math.min(width, height) / 2 - 45) * internalZoom;

  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const initialRotationRef = useRef(0);
  const panStartRef = useRef({ x: 0, y: 0 });

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

    fetch('/data/geojson/airports.geojson')
      .then((res) => res.json())
      .then((data) => setAirportsData(data))
      .catch((err) => console.error('Error cargando aeropuertos:', err));

    fetch('/data/geojson/anomalies.geojson')
      .then((res) => res.json())
      .then((data) => setAnomaliesData(data))
      .catch((err) => console.error('Error cargando anomalías:', err));

    fetch('/data/geojson/jet_streams.geojson')
      .then((res) => res.json())
      .then((data) => setJetStreamsData(data))
      .catch((err) => console.error('Error cargando vientos:', err));
  }, []);

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
    const rho = Math.hypot(dx, dy);

    if (rho > mapRadius) return;

    const lat = 90 - (rho / mapRadius) * 180;
    let thetaRad = Math.atan2(dx, dy);
    let thetaDeg = (thetaRad * 180) / Math.PI;

    let lon = thetaDeg - (internalRotation - 180);
    lon = ((lon + 180) % 360 + 360) % 360 - 180;

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

  const handleResetOffset = () => {
    setOffset({ x: 0, y: 0 });
    updateRotation(180);
    updateZoom(1.00);
  };

  const handleClick = (e) => {
    if (!activeLayers?.measure || typeof onAddMeasurePoint !== 'function' || isDraggingRef.current) return;
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
    lon = ((lon + 180) % 360 + 360) % 360 - 180;

    onAddMeasurePoint({ lat, lon });
  };

  // RENDER FRAME
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
      if (activeLayers?.continents && countriesData) {
        drawContinents(ctx, countriesData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.relief && reliefData) {
        drawRelief(ctx, reliefData, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      // C. ESCÁNER RADAR TÁCTICO
      drawRadarSweep(ctx, activeLayers, centerX, centerY, mapRadius);

      // D. Red Geodésica, Husos Horarios y Geometría
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
      drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      if (activeLayers?.tectonics && tectonicsData) {
        drawTectonics(ctx, tectonicsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }
      if (activeLayers?.labels && countriesData) {
        drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      }

      // E. Nuevas Capas Tácticas
      drawWindCurrents(ctx, jetStreamsData, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawAirports(ctx, airportsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      // F. Astronomía y Medición
      if (activeLayers?.sunlight) {
        drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.sunlight || activeLayers?.moon || activeLayers?.analemma) {
        drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.measure) {
        drawMeasurements(ctx, measurePoints, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }

      // G. Mira Táctica sobre el Cursor
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