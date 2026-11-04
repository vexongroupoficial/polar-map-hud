'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// === IMPORTACIÓN DE ENGINES POR CATEGORÍA ===
// 1. Cartografía Base
import { drawOcean } from './layers/drawOcean';
import { drawContinents } from './layers/drawContinents';
import { drawGraticule } from './layers/drawGraticule';
import { drawLabels } from './layers/drawLabels';
import { drawTropicsAndEquatorLayer } from './layers/drawTropicsAndEquatorLayer';
import { drawCities } from './layers/drawCities';

// 2. Relieve e Hidrografía
import { drawOceanLabels } from './layers/drawOceanLabels';
import { drawRelief } from './layers/drawRelief';
import { drawHydrography } from './layers/drawHydrography';
import { drawLakes } from './layers/drawLakes';
import { drawGlaciers } from './layers/drawGlaciers';
import { drawForests } from './layers/drawForests';
import { drawAridZones } from './layers/drawAridZones';
import { drawMeanderLakes } from './layers/drawMeanderLakes'; 

// 3. Geofísica y Clima
import { drawWindCurrents } from './layers/drawWindCurrents';
import { drawOceanCurrents } from './layers/drawOceanCurrents';
import { drawTornadoAreas } from './layers/drawTornadoAreas';
import { drawTectonics } from './layers/drawTectonics';
import { drawAnomaliesTriangle } from './layers/drawAnomaliesTriangle';
import { drawAuroraBorealis } from './layers/drawAuroraBorealis';
import { drawCoriolisEffect } from './layers/drawCoriolisEffect';
import { drawVolcanicAnomalies } from './layers/drawVolcanicAnomalies';
import { drawSeismicAnomalies } from './layers/drawSeismicAnomalies';
import { drawEnsoAnomalies } from './layers/drawEnsoAnomalies'; 
import { drawMagneticAnomalies } from './layers/drawMagneticAnomalies'; 
import { drawRadarSweep } from './layers/drawRadarSweep';

// 4. Navegación y Medida
import { drawTimeZones } from './layers/drawTimeZones';
import { drawCompassRose } from './layers/drawCompassRose';
import { drawGreatCircle } from './layers/drawGreatCircle';
import { drawHarmonicAngles } from './layers/drawHarmonicAngles';
import { drawMeasurements } from './layers/drawMeasurements';
import { drawPolarCoordinates } from './layers/drawPolarCoordinates';

// 5. Geopolítica y Recursos
import { drawAirports } from './layers/drawAirports';
import { drawAncientSites } from './layers/drawAncientSites';
import { drawStrategicCrossings } from './layers/drawStrategicCrossings';
import { drawNaturalResources } from './layers/drawNaturalResources';
import { drawMigrationFlows } from './layers/drawMigrationFlows';
import { drawResourceDistribution } from './layers/drawResourceDistribution';

// 6. Astronomía y Simulación Celeste
import { drawSunlight } from './layers/drawSunlight';
import { drawAstronomy } from './layers/drawAstronomy';
import { drawPlanets } from './layers/drawPlanets';
import { drawEnochCalendar } from './layers/drawEnochCalendar';
import { drawZodiacDecans } from './layers/drawZodiacDecans';
import { drawConstellations } from './layers/drawConstellations';
import { drawPrecessionalEras } from './layers/drawPrecessionalEras';
import { drawMoonPhases } from './layers/drawMoonPhases';
import { drawZodiacHouses } from './layers/drawZodiacHouses';
import { drawPolarCoreConstellations } from './layers/drawPolarCoreConstellations';
import { drawPolarIntermediateConstellations } from './layers/drawPolarIntermediateConstellations';
import { drawPolarSouthernConstellations } from './layers/drawPolarSouthernConstellations';
import { drawConstellationBorders } from './layers/drawConstellationBorders';
import { drawSchumannResonance } from './layers/drawSchumannResonance';
import { drawAuroraAustral } from './layers/drawAuroraAustral';

//7. Calendario Hebreo
import { drawHebrewCalendar } from './layers/drawHebrewCalendar';
import { drawHebrewShabbat } from './layers/drawHebrewShabbat';
import { drawHebrewFeasts } from './layers/drawHebrewFeasts';
import { drawHebrewRoshChodesh } from './layers/drawHebrewRoshChodesh';
import { drawHebrewTribes } from './layers/drawHebrewTribes';


// 8. Geometría Sagrada
import { drawSacredGeometry } from './layers/drawSacredGeometry';


// Utilidades Geo
import { useGeoData } from './hooks/useGeoData';
import {
  getCountryAndContinentAtPoint,
  drawTargetingCrosshair,
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
  selectedCity=null,
  selectedOceanId = null,
  onAddMeasurePoint,
  onTelemetryUpdate,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const { width, height } = dimensions;

  const [internalRotation, setInternalRotation] = useState(rotation);
  const [internalZoom, setInternalZoom] = useState(zoom);

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

  // Resize Observer
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

  // Controladores de Puntero y Mouse
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

  // =========================================================================
  // BUCLE PRINCIPAL DE RENDERIZADO (ORGANIZADO POR CATEGORÍAS INDEPENDIENTES)
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const render = (timestamp) => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;

      // Reset Lienzo
      ctx.clearRect(0, 0, w, h);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      const centerX = w / 2 + offset.x;
      const centerY = h / 2 + offset.y;
      const isNeon = activeLayers?.neonMode ?? false;
      const animTime = timestamp;

      // -------------------------------------------------------------
      // 0. FONDO TÁCTICO HUD Y CUADRÍCULA
      // -------------------------------------------------------------
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // CATEGORÍA 1: CARTOGRAFÍA BASE
      // -------------------------------------------------------------
        drawOcean(
          ctx,
          activeLayers,      // 👈 Se pasa el objeto de capas del Sidebar (evalúa activeLayers.oceans)
          centerX,
          centerY,
          mapRadius,
          isNeon,
          selectedOceanId,     // ID de la cuenca seleccionada o null
          internalRotation,
          animTime
        );

      if (activeLayers?.continents && countriesData) {
        drawContinents(ctx, countriesData, centerX, centerY, mapRadius, internalRotation, internalZoom, isNeon);
      }
      if (activeLayers?.graticule) {
        drawGraticule(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

        
      }
      if (activeLayers?.equatorAndTropics || activeLayers?.ecuador || activeLayers?.tropics) {
        drawTropicsAndEquatorLayer(ctx, centerX, centerY, mapRadius, internalRotation, isNeon);
      }
              // 🏙️ RENDERIZADO DE CIUDADES Y OBJETIVO DE BÚSQUEDA
        if (activeLayers?.Cities) {
          drawCities(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            internalZoom,
            selectedCity,
            animTime
          );
        }
        if (activeLayers?.labels && countriesData) {
          drawLabels(ctx, countriesData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
        }

      // -------------------------------------------------------------
      // CATEGORÍA 2: RELIEVE E HIDROGRAFÍA
      // -------------------------------------------------------------
      drawOceanLabels(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);

      if (activeLayers?.relief && reliefData) {
        drawRelief(
          ctx,
          reliefData,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          internalZoom
         );
        }

      // Engine de Hidrografía (Ríos, Lagos, Glaciares, Bosques, Zonas Áridas)
        drawHydrography(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            internalZoom,
            isNeon,
            animTime // 👈 Pasa la marca de tiempo para la animación del flujo de partículas
      );

        drawLakes(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          internalZoom,
          isNeon
        )

        drawGlaciers(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          isNeon,
          animTime
        );

        // 🌲 Engine de Bosques y Cobertura Forestal
          drawForests(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            isNeon,
            internalZoom
          );

          // 🏜️ Engine de Zonas Áridas, Desiertos y Médanos
          drawAridZones(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            isNeon,
            internalZoom
          );

        drawMeanderLakes(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          isNeon,
          internalZoom
        );
      // -------------------------------------------------------------
      // CATEGORÍA 3: GEOFÍSICA Y CLIMA
      // -------------------------------------------------------------
      if (activeLayers?.windCurrents) {
        drawWindCurrents(
          ctx,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          animTime,
          isNeon
        );
      }
      if (activeLayers?.oceanTides) {
        drawOceanCurrents(
          ctx,
          centerX, 
          centerY,
          mapRadius, 
          internalRotation,
          animTime,
          isNeon
        );
      }
      if (activeLayers?.tornadoes) {
        drawTornadoAreas(
          ctx, 
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          animTime,
          isNeon
        );
      }
      if (activeLayers?.tectonics && tectonicsData) {
        drawTectonics(
          ctx,
          tectonicsData,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          internalZoom
        );
      }  

      if (activeLayers?.auroraAustral) {
        drawAuroraAustral(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation, 
          animTime
        );
      }
      if (activeLayers?.schumannResonance) {
        drawSchumannResonance(
          ctx, 
          activeLayers,
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation, 
          animTime
        );
      }
  
        // -------------------------------------------------------------
        // CATEGORÍA 4: ANOMALÍAS Y FENÓMENOS ATMOSFÉRICOS
        // -------------------------------------------------------------

      // 🔺 1. Triángulo de las Bermudas / Dragón
          if (activeLayers?.AnomaliesTriangle || activeLayers?.anomaliesTriangle || activeLayers?.anomalies) {
            drawAnomaliesTriangle(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          } 

          //  2. Anomalías Polar Aurora Boreal

         if (activeLayers?.polarAurora || activeLayers?.auroraBorealis) {
            drawAuroraBorealis(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }

          // ☁️ 2. Anomalías volcanicas
          if (activeLayers?.volcanicAnomalies) {
            drawVolcanicAnomalies(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }

          // ⚡ Engine de Anomalías Sísmicas y Rupturas Supersónicas
          if (activeLayers?.seismicAnomalies || activeLayers?.seismic || activeLayers?.anomaliasSismicas) {
            drawSeismicAnomalies(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }

          if (activeLayers?.atmosphericAnomalies || activeLayers?.tornadoes) {
            drawTornadoAreas(
              ctx, 
              activeLayers, 
              centerX, 
              centerY, 
              mapRadius, 
              internalRotation, 
              animTime, 
              isNeon
            );        
          }

          // 🌊 3. Anomalías ENSO
          if (activeLayers?.ensoAnomalies) 
            (
            activeLayers?.ensoAnomalies ||
            activeLayers?.EnsoAnomalies ||
            activeLayers?.enso ||
            activeLayers?.elNinoLaNina
   
          ) 
            
            {
            drawEnsoAnomalies(          
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }


          if (activeLayers?.coriolis || activeLayers?.coriolisEffect) {
            drawCoriolisEffect(
              ctx, 
              activeLayers, 
              centerX, 
              centerY, 
              mapRadius, 
              internalRotation, 
              animTime, 
              isNeon
            );
          }

          // 🧲 Engine de Anomalías Magnéticas Planetarias
          if (activeLayers?.magneticAnomalies || activeLayers?.magnetic || activeLayers?.anomaliasMagneticas) {
            drawMagneticAnomalies(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }

          // 📡 5. Radar Escáner 360°
          if (activeLayers?.radarSweep) {
            drawRadarSweep(
              ctx,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }



      // -------------------------------------------------------------
      // CATEGORÍA 4: NAVEGACIÓN Y MEDIDA
      // -------------------------------------------------------------
      if (activeLayers?.timeZones) {
        drawTimeZones(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      if (activeLayers?.greatCircle) {
        drawGreatCircle(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      drawHarmonicAngles(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      
      // 🛑 CONDICIÓN ESTRICTA: La Rosa de los Vientos y Coordenadas solo se dibujan si la capa está activa
      if (activeLayers?.graticule || activeLayers?.compassRose) {
        drawCompassRose(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation
        );
      }

      if (activeLayers?.measure) {
        drawMeasurements(
          ctx, 
          measurePoints, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation
        );
      }

      if (
          activeLayers?.radarSweep ||
          activeLayers?.radar ||
          activeLayers?.radarScanner ||
          activeLayers?.escner360
        ) {
          drawRadarSweep(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            animTime,
            isNeon
          );
        }

          if (
            activeLayers?.polarCoordinates ||
            activeLayers?.coordinates ||
            activeLayers?.grid ||
            activeLayers?.coordenadasPolares
          ) {
            drawPolarCoordinates(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon,
              mousePos // Pasa el estado del puntero (si existe) para la telemetría en tiempo real
            );
          }

          if (
            activeLayers?.resourceDistribution ||
            activeLayers?.resources ||
            activeLayers?.recursosEstrategicos ||
            activeLayers?.minerals
          ) {
            drawResourceDistribution(
              ctx,
              activeLayers,
              centerX,
              centerY,
              mapRadius,
              internalRotation,
              animTime,
              isNeon
            );
          }

      // -------------------------------------------------------------
      // CATEGORÍA 5: GEOPOLÍTICA Y RECURSOS
      // -------------------------------------------------------------
      drawAirports(ctx, airportsData, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawAncientSites(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawLakes(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, internalZoom);
      drawStrategicCrossings(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawNaturalResources(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      drawMigrationFlows(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);

      // -------------------------------------------------------------
      // CATEGORÍA 6: ASTRONOMÍA Y SIMULACIÓN CELESTE
      // -------------------------------------------------------------
      if (activeLayers?.sunlight) {
        drawSunlight(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation);
      }
      drawAstronomy(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime);
      drawPlanets(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, simulatedTime); 
      
        if (activeLayers?.constellations || activeLayers?.constelaciones) {
          drawConstellations(
            ctx,
            activeLayers,
            centerX,
            centerY,
            mapRadius,
            internalRotation,
            animTime,
            isNeon
          );
        }

      if (activeLayers?.precessionalEras || activeLayers?.eras) {
        drawPrecessionalEras(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation, 
          simulatedTime,
          
        );
      }

      if (
        activeLayers?.zodiacHouses ||
        activeLayers?.houses ||
        activeLayers?.casasZodiacales ||
        activeLayers?.casas
      ) {
        drawZodiacHouses(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          animTime,
          isNeon
        );
      }

        if (activeLayers?.moonPhases || activeLayers?.moon || activeLayers?.fasesDeLaLuna) {
          drawMoonPhases(
            ctx, 
            activeLayers, 
            centerX, 
            centerY, 
            mapRadius,
            internalRotation,
            animTime, 
            isNeon
          );
        }


        if (activeLayers?.zodiacDecans || activeLayers?.zodiac || activeLayers?.decanatosZodiacales) {
          drawZodiacDecans(
            ctx, 
            activeLayers, 
            centerX, 
            centerY, 
            mapRadius, 
            internalRotation, 
            animTime, 
            isNeon
          );
        }

        if (activeLayers?.coreConstellations || activeLayers?.constelacionesNuclearesPolos || activeLayers?.circumpolar) {
          drawPolarCoreConstellations(
            ctx,
            activeLayers,            
            centerX,
            centerY,
            mapRadius,
            internalRotation
          );
        }
      if (activeLayers?.interConstellations || activeLayers?.constelacionesIntermedias) {
        drawPolarIntermediateConstellations(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation,
          animTime,
          isNeon,
          internalZoom,
        );  
      }
      if (activeLayers?.southernConstellations || activeLayers?.australConstellations || activeLayers?.constelacionesAustrales) {
      drawPolarSouthernConstellations(
        ctx, 
        activeLayers, 
        centerX, 
        centerY, 
        mapRadius, 
        internalRotation, 
        internalZoom);
      }

      if (activeLayers?.constellationBorders || activeLayers?.bordesDeConstelaciones) {
        drawConstellationBorders(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius
        );
      }

      // -------------------------------------------------------------
      // CATEGORÍA 7: CALENDARIO HEBREO
      // -------------------------------------------------------------
        if (activeLayers?.enochCalendar || activeLayers?.enoch || activeLayers?.calendarioDeEnoc) {
          drawEnochCalendar(
            ctx, 
            activeLayers, 
            centerX, 
            centerY, 
            mapRadius, 
            internalRotation, 
            animTime, 
            isNeon
          );
        }

      if (activeLayers?.hebrewCalendar || activeLayers?.calendarioHebreo) { 
        drawHebrewCalendar(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation, 
          animTime
        );
      }

      
      if (activeLayers?.hebrewShabbat || activeLayers?.shabatHebreo) { 
        drawHebrewShabbat(
          ctx, 
          activeLayers, 
          centerX, 
          centerY, 
          mapRadius, 
          internalRotation, 
          animTime
        );
      }

      if (activeLayers?.hebrewFeasts || activeLayers?.fiestasHebreas) {
        drawHebrewFeasts(
          ctx,
          activeLayers,
          centerX,
          centerY,
          mapRadius,
          internalRotation,
          animTime,
          isNeon
        );
      }

    if (activeLayers?.hebrewRoshChodesh || activeLayers?.mesLunar) {
      drawHebrewRoshChodesh(
        ctx,
        activeLayers,
        centerX,
        centerY,
        mapRadius,
        internalRotation,
        animTime,
        isNeon
      );
    }

if (activeLayers?.hebrewTribes || activeLayers?.tribus || activeLayers?.tribusHebreas || activeLayers?.tribesLayer) {
  drawHebrewTribes(
    ctx,
    activeLayers,
    centerX,
    centerY,
    mapRadius,
    internalRotation,
    animTime,
    isNeon
  );
}

      // -------------------------------------------------------------
      // CATEGORÍA 7: GEOMETRÍA SAGRADA (ENGINE CENTRALIZADO)
      // -------------------------------------------------------------
      drawSacredGeometry(ctx, activeLayers, centerX, centerY, mapRadius, internalRotation, animTime, isNeon);

      // -------------------------------------------------------------
      // 8. INTERFAZ Y MIRILLA TÁCTICA HUD (SIEMPRE ARRIBA)
      // -------------------------------------------------------------
      drawTargetingCrosshair(ctx, centerX, centerY, mapRadius, mousePos);

      // Siguiente Fotograma (60 FPS)
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
    measurePoints,
    selectedCity,
    selectedOceanId,
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