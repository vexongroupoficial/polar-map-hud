// lib/mapLayers.js

import { Hud } from "@react-three/drei";
import { Triangle } from "lucide-react";
import { TriangleBlurShader } from "three/examples/jsm/Addons.js";

// 1. DICCIONARIO DE CATEGORÍAS PRINCIPALES
export const MAP_LAYER_CATEGORIES = {
  CARTOGRAPHY: 'CARTOGRAFÍA BASE',
  RELIEF_HYDROGRAPHY: 'RELIEVE E HIDROGRAFÍA',
  GEOPHYSICS: 'GEOFÍSICA Y CLIMA',
  NAVIGATION: 'NAVEGACIÓN Y MEDIDA',
  GEOPOLITICS: 'GEOPOLÍTICA Y RECURSOS',
  ASTRONOMY: 'ASTRONOMÍA Y SIMULACIÓN CELESTE',
  GEOMETRY: 'GEOMETRÍA SAGRADA',
  ANOMALIES: 'ANOMALÍAS GEOPHÍSICAS'
  
};

// 2. ESTADO INICIAL DE VISIBILIDAD DE CAPAS
export const INITIAL_ACTIVE_LAYERS = {

// Configuración Estética
  neonMode: false,

// Cartografía Base
  neonMode: false,
  continents: true,
  graticule: false,
  equatorAndTropics: false,
  labels: false,
  Cities: false,

  // Relieve e Hidrografía
  oceans: false,
  rivers: false,
  lakes: false,
  glaciers: false,
  relief: false,
  bosques: false,
  zonasAridas: false,
  meanderLakes: false,

  // Geofísica y Clima
  windCurrents: false,
  oceanTides: false,
  tornadoes: false,
  tectonics: false,
  auroraBorealis: false,
  cachesoriolisEffect: false,
  volcanicAnomalies: false,
  
  // Anomalías Geofísicas
  magneticAnomalies: false,
  gravityAnomalies: false,
  thermalAnomalies: false,
  seismicAnomalies: false,  
  meteoriteImpactAnomalies: false, 
  ensoAnomalies: false,  
  anomaliesTriangle: false,
  

  // Navegación y Medida
  timeZones: false,
  polarCoordinates: false,
  harmonicAngles: false,
  measure: false,
  greatCircle: false,

  // Geopolítica y Recursos
  airports: false,
  ancientSites: false,
  strategicCrossings: false,
  naturalResources: false,
  migrationFlows: false,
  radarSweep: false,


  // Astronomía y Simulación Celeste
  sunlight: false,
  fasesLuna: false,
  planets: false,
  enochCalendar: false,
  zodiacDecans: false,
  constellations: false,
  grandAlignment: false,
  zodiacHouses: false,
  precessionalEras: false,

  // Geometría Sagrada
  EarthEnergyGrid: false,
  FlowerOfLifeGrid: false,
  MetatronCubeGrid: false,
  SriYantraGrid: false,
  TorusGrid: false,
  MerkabaGrid: false,
  SeedOfLifeGrid: false,
  PlatonicSolidsGrid: false,
  FractalGrid: false,
  VesicaPiscisGrid: false,
  GoldenRatioGrid: false,
  FibonacciSpiralGrid: false,
  GoldenSpiralGrid: false,
  VectorEquilibriumGrid: false,
  YinYangGrid: false,

};

// 3. CATÁLOGO COMPLETO DE CAPAS CON DETALLES Y CATEGORÍAS
export const MAP_LAYERS = [
  // ==========================================
  // CATEGORÍA: CARTOGRAFÍA BASE
  // ==========================================
  { id: 'neonMode',
    label: 'Modo Neón',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Activar o desactivar el modo neón para la estética del mapa',
    icon: '🌟',
  }, 

    {
    id: 'continents',
    label: 'Continentes y Masa Terrestre',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Polígonos continentales y límites territoriales',
    icon: '🌍',
  },
 
  {
    id: 'graticule',
    label: 'Gráticula y Meridianos',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Malla de paralelos de latitud y meridianos polares',
    icon: '🌐',
  },
  
 {
    id: 'equatorAndTropics',
    label: 'Ecuador y Trópicos',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Línea ecuatorial y trópicos Cáncer / Capricornio',
    icon: '📏',
  },
  {
    id: 'labels',
    label: 'Nombres de Países',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Topónimos y demarcaciones geopolíticas',
    icon: '🏷️',
  },

  {
    id: 'Cities',
    label: 'Ciudades',
    category: MAP_LAYER_CATEGORIES.CARTOGRAPHY,
    description: 'Nombres de ciudades y asentamientos',
    icon: '🏷️',
  },

  // ==========================================
  // CATEGORÍA: Relieve e Hidrografía
  // ==========================================

  {
    id: 'oceans',
    label: 'Masa Oceánica',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Fondo marino y cuencas oceánicas',
    icon: '🌊',
  },

  {
      id: 'oceanLabels',
      label: 'Nombres de Océanos',
      category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
      description: 'Nombres de océanos y mares en cursiva neón',
      icon: '🧭',
  },


  {
    id: 'rivers',
    label: 'Ríos y Cuencas',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Red hidrográfica y cuencas fluviales',
    icon: '🏞️',
  },

  {
    id: 'lakes',
    label: 'Lagos y Lagunas',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Cuerpos de agua dulce en el mapa',
    icon: '🏞️',
  },

  {
    id: 'glaciers',
    label: 'Glaciares',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Masa de hielo y glaciares en el mapa',
    icon: '🧊',
  },

  {
    id: 'relief',
    label: 'Relieve Topográfico',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Elevaciones, cordilleras y perfil morfológico',
    icon: '⛰️',
  },

  {
    id: 'bosques',
    label: 'Bosques',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Cobertura de bosques en el mapa',
    icon: '🌳',
  },

    {
    id: 'zonasAridas',
    label: 'Zonas Áridas',
    category: MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Cobertura de zonas áridas en el mapa',
    icon: '�️',
  },

  
  {
    id: 'meanderLakes',
    label: 'Lagos en Meandro',      
    category:   MAP_LAYER_CATEGORIES.RELIEF_HYDROGRAPHY,
    description: 'Cuerpos de agua dulce y embalses',
    icon: '🏞️',
  },


  // ==========================================
  // CATEGORÍA: GEOFÍSICA Y CLIMA
  // ==========================================
  {
    id: 'windCurrents',
    label: 'Vientos y Jet Streams',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Circulación atmosférica y ondas de Rossby',
    icon: '💨',
  },
  {
    id: 'oceanTides',
    label: 'Mareas y Corrientes',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Giros oceánicos por cuenca y pulsos marinos',
    icon: '🌊',
  },
  {
    id: 'tornadoes',
    label: 'Áreas de Tornados',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Vórtices cinemáticos y corredores de ciclogénesis',
    icon: '🌪️',
  },
  {
    id: 'tectonics',
    label: 'Placas Tectónicas',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Límites de placas, fallas y Cinturón de Fuego',
    icon: '🌋',
  },

  {
    id: 'auroraBorealis',
    label: 'Auroras Boreales',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Óvalo auroral dinámico e interacción solar',
    icon: '🌌',
  },
  {
    id: 'coriolisEffect',
    label: 'Efecto Coriolis',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Efectos Coriolis en la dinámica atmosférica',
    icon: '🌍',
  },


   // ==========================================
  // CATEGORÍA: ANOMALIAS GEOPHYSICS
  // ==========================================
  {
    id: 'anomaliesTriangle',
    label: 'Triángulo de las Bermudas',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Zona de anomalías geofísicas y desapariciones misteriosas',
    icon: '🔺',
  },
  {
    id: 'volcanicAnomalies',
    label: 'Anomalías Volcánicas',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Zonas con actividad volcánica inusual',
    icon: '🌋',
  },

  {
    id: 'seismicAnomalies',
    label: 'Anomalías Sísmicas',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Zonas con actividad sísmica inusual',
    icon: '🌐',
  },
  
  {
    id: 'ensoAnomalies',
    label: 'El Niño / La Niña (ENSO)',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Oscilación del Pacífico Ecuatorial, vientos Alisios y anomalías térmicas SST',
    icon: '🌊',
  },

  {
    id: 'magneticAnomalies',
    label: 'Anomalías Magnéticas',
    category: MAP_LAYER_CATEGORIES.GEOPHYSICS,
    description: 'Variaciones inusuales del campo magnético',
    icon: '🧲',
  },

  // ==========================================
  // CATEGORÍA: NAVEGACIÓN Y MEDIDA
  // ==========================================
  {
    id: 'timeZones',
    label: 'Husos Horarios UTC',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    description: 'Líneas meridianas de tiempo universal coordinado',
    icon: '🕒',
  },
  
  {
  id: 'polarCoordinates',
  label: 'Coordenadas y Retícula Polar',
  category: MAP_LAYER_CATEGORIES.NAVIGATION,
  description: 'Paralelos geográficos, meridianos graduados, ticks perimetrales y telemetría táctica',
  icon: '🌐',
  },

  {
    id: 'harmonicAngles',
    label: 'Ángulos Armónicos',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    description: 'Geometría radial y nodos polares angulares',
    icon: '📐',
  },
  {
    id: 'measure',
    label: 'Medidor Geodésico',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    description: 'Cálculo dinámico de distancias y azimut',
    icon: '📏',
  },

    {
    id: 'radarSweep',
    label: 'Radar Escáner 360°',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    description: 'Barrido rotativo táctico continuo',
    icon: '📡',
  },


   
  // ==========================================
  // CATEGORÍA: GEOPOLÍTICA Y RECURSOS
  // ==========================================
 
  {
    id: 'airports',
    label: 'Aeropuertos e IATA',
    category: MAP_LAYER_CATEGORIES.GEOPOLITICS,
    description: 'Nodos de conectividad aérea internacional',
    icon: '🛫',
  },


  {
    id: 'ancientSites',
    label: 'Sitios Antiguos',
    category: MAP_LAYER_CATEGORIES.GEOPOLITICS,
    description: 'Centros megalíticos y alineaciones históricas',
    icon: '🏛️',
  },
  {
    id: 'strategicCrossings',
    label: 'Pasos Estratégicos',
    category: MAP_LAYER_CATEGORIES.GEOPOLITICS,
    description: 'Estrechos, canales e istmos marítimos',
    icon: '⚓',
  },
  {
    id: 'resourceDistribution',
    label: 'Distribución de Recursos Estratégicos',
    category: MAP_LAYER_CATEGORIES.GEOPOLITICS,
    description: 'Reservas probadas de Petróleo, Oro, Diamantes y Minerales Críticos (Litio, Cobalto, Tierras Raras)',
    icon: '🛢️',
  },

  {
    id: 'migrationFlows',
    label: 'Flujos de Migración',
    category: MAP_LAYER_CATEGORIES.GEOPOLITICS,
    description: 'Vectores demográficos y corredores humanos',
    icon: '🔄',
  },

    {
    id: 'greatCircle',
    label: 'Gran Círculo',
    category: MAP_LAYER_CATEGORIES.NAVIGATION,
    description: 'Proyección del Gran Círculo de navegación',
    icon: '🌐',
  },  


  // ==========================================
  // CATEGORÍA: ASTRONOMÍA Y SIMULACIÓN CELESTE
  // ==========================================
  {
    id: 'sunlight',
    label: 'Luz Solar y Solsticios',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Terminador día/noche e iluminación en vivo',
    icon: '☀️',
  },
  {
    id: 'moonPhases',
    label: 'Fases de la Luna',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Ciclo lunisolar sinódico, iluminación porcentual y terminador de sombra',
    icon: '🌙',
  },
  {
    id: 'planets',
    label: 'Planetas Visibles',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Proyección ecuatorial de cuerpos del sistema solar',
    icon: '🪐',
  },
    {
      id: 'enochCalendar',
      label: 'Calendario de Enoc',
      category: MAP_LAYER_CATEGORIES.ASTRONOMY,
      description: 'Cuadrantes equinocciales de 364 días y los 6 Portales del Sol',
      icon: '📅',
    },
  
    {
      id: 'zodiacDecans',
      label: 'Decanatos Zodiacales',
      category: MAP_LAYER_CATEGORIES.ASTRONOMY,
      description: 'División sideral de 36 sectores de 10° y los 12 Signos Zodiacales',
      icon: '♈',
    },
  {
    id: 'constellations',
    label: 'Constelaciones',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Bóveda estelar y astrometría proyectada',
    icon: '✨',
  },
  {
    id: 'grandAlignment',
    label: 'Gran Alineación / Haz',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Vector conoidal de iluminación de Era',
    icon: '🔱',
  },

  {
    id: 'zodiacHouses',
    label: 'Casas Zodiacales',
    category: MAP_LAYER_CATEGORIES.ASTRONOMY,
    description: 'Rueda perimetral de los 12 signos celestes',
    icon: '♓',
  },


   // ==========================================
  // CATEGORÍA: GEOMETRIA SAGRADA
  // ==========================================
 /*
  {
    id: 'EarthEnergyGrid',
    label: 'Red de Energía Terrestre',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de energía y geometría sagrada en la Tierra',
    icon: '🌐',
    
  },
  
   {
    id: 'FlowerOfLifeGrid',
    label: 'Flor de la Vida',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Flor de la Vida en la geometría sagrada',
    icon: '🌸',
   
  },

   {
    id: 'MetatronCubeGrid',
    label: 'Cubo de Metatrón',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones del Cubo de Metatrón en la geometría sagrada',
    icon: '🔷',
  },

  {
    id: 'SriYantraGrid',
    label: 'Sri Yantra',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones del Sri Yantra en la geometría sagrada',
    icon: '🔺',
  },

  {
    id: 'TorusGrid',
    label: 'Torus',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones del Toro en la geometría sagrada',
    icon: '🌀',
  },

  {
    id: 'MerkabaGrid',
    label: 'Merkaba',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Merkaba en la geometría sagrada',
    icon: '🔯',
  },

  {
    id: 'SeedOfLifeGrid',
    label: 'Semilla de la Vida',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Semilla de la Vida en la geometría sagrada',
    icon: '🌱',
  },

  {
    id: 'PlatonicSolidsGrid',
    label: 'Sólidos Platónicos',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de los Sólidos Platónicos en la geometría sagrada',
    icon: '🔺',
  },

  {
    id: 'FractalGrid',
    label: 'Fractales',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones fractales en la geometría sagrada',
    icon: '🌀',
  },

  {
    id: 'VesicaPiscisGrid',
    label: 'Vesica Piscis',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Vesica Piscis en la geometría sagrada',
    icon: '🔵',
  },

  {
    id: 'GoldenRatioGrid',
    label: 'Proporción Áurea',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Proporción Áurea en la geometría sagrada',
    icon: 'φ',
  },

    {
    id: 'FibonacciSpiralGrid',
    label: 'Espiral de Fibonacci',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Espiral de Fibonacci en la geometría sagrada',
    icon: '🌪',
  },

  {
    id: 'GoldenSpiralGrid',
    label: 'Espiral Áurea',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones de la Espiral Áurea en la geometría sagrada',
    icon: '🌟',
  },
  
  {
    id: 'VectorEquilibriumGrid',
    label: 'Equilibrio Vectorial',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones del Equilibrio Vectorial en la geometría sagrada',
    icon: '⚖️',
  },

  {
    id: 'YinYangGrid',
    label: 'Yin Yang',
    category: MAP_LAYER_CATEGORIES.GEOMETRY,
    description: 'Patrones del Yin Yang en la geometría sagrada',
    icon: '☯️',
  },
*/
];