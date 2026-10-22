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
    ]).then(([countries, relief, tectonics, airports, anomalies, jetStreams]) => {
      setGeoData({
        countriesData: countries,
        reliefData: relief,
        tectonicsData: tectonics,
        airportsData: airports,
        anomaliesData: anomalies,
        jetStreamsData: jetStreams,
      });
    });
  }, []);

  return geoData;
}