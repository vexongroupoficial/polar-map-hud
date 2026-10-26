'use client';

import { useState, useEffect } from 'react';

export function useGeoData() {
  const [geoData, setGeoData] = useState({
    countriesData: null,
    reliefData: null,
    tectonicsData: null,
    airportsData: null,
    anomaliesData: null,
    jetStreamsData: null,
  });

  useEffect(() => {
    Promise.all([
      fetch('/data/geojson/world_countries.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/world_relief.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/tectonic_plates.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/airports.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/anomalies.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/jet_streams.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/ancient_sites.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/gold_and_lithium.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/petroleum_gas.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/diamond_mines.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/bermuda_triangle.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/south_atlantic_anomaly.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/radar_sweep.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/labels.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/strategic_crossings.geojson').then(r => r.json()).catch(() => null),
      fetch('/data/geojson/migration_routes.geojson').then(r => r.json()).catch(() => null),
      

    ]).then(([countries, relief, tectonics, airports, anomalies, jetStreams, ancientSites, goldAndLithium, petroleumGas, diamondMines, bermudaTriangle, southAtlanticAnomaly, radarSweep, labels, strategicCrossings, migrationRoutes]) => {
      setGeoData({
        countriesData: countries,
        reliefData: relief,
        tectonicsData: tectonics,
        airportsData: airports,
        anomaliesData: anomalies,
        jetStreamsData: jetStreams,
        ancientSitesData: ancientSites,
        goldAndLithiumData: goldAndLithium,
        petroleumGasData: petroleumGas,
        diamondMinesData: diamondMines,
        bermudaTriangleData: bermudaTriangle,
        southAtlanticAnomalyData: southAtlanticAnomaly,
        radarSweepData: radarSweep,
        labelsData: labels,
        strategicCrossingsData: strategicCrossings,
        migrationRoutesData: migrationRoutes,
      });
    });
  }, []);

  return geoData;
}