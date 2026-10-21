export function getElevationProfileData(p1, p2, reliefData) {
  if (!p1 || !p2 || !reliefData) return [];
  const samples = 30;
  const profile = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = p1.lat + (p2.lat - p1.lat) * t;
    const lon = p1.lon + (p2.lon - p1.lon) * t;
    
    // Simulación de perfil topográfico basada en interpolación de lat/lon
    // En un entorno de producción se cruza con las alturas del GeoJSON de relieve
    const elevation = Math.sin(t * Math.PI) * 2500 + (Math.random() * 200 - 100);
    profile.push({ distanceRatio: t, lat, lon, elevation: Math.round(elevation) });
  }
  return profile;
}