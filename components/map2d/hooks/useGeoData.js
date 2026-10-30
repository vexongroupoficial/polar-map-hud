// hooks/useGeoData.js
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
    // Helper seguro que no rompe la carga si un archivo da 404 Not Found
    const safeFetch = (url) =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    Promise.all([
      safeFetch('/data/geojson/world_countries.geojson'),
      safeFetch('/data/geojson/world_relief.geojson'),
      safeFetch('/data/geojson/tectonic_plates.geojson'),
      safeFetch('/data/geojson/airports.geojson'),
      safeFetch('/data/geojson/anomalies.geojson'),
      safeFetch('/data/geojson/jet_streams.geojson'),
      safeFetch('/data/geojson/ocean_currents.geojson'),      
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

export default useGeoData;