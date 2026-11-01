// lib/citiesData.js

export const WORLD_CITIES = [
  // ==========================================
  // SURAMÉRICA
  // ==========================================
  // Venezuela
  { id: 'caracas', name: 'Caracas', country: 'Venezuela', lat: 10.4806, lon: -66.9036, tier: 1 },
  { id: 'maracaibo', name: 'Maracaibo', country: 'Venezuela', lat: 10.6427, lon: -71.6125, tier: 2 },
  { id: 'valencia_ve', name: 'Valencia', country: 'Venezuela', lat: 10.1620, lon: -68.0077, tier: 2 },
  { id: 'barquisimeto', name: 'Barquisimeto', country: 'Venezuela', lat: 10.0678, lon: -69.3470, tier: 3 },
  { id: 'ciudad_guayana', name: 'Ciudad Guayana', country: 'Venezuela', lat: 8.3558, lon: -62.6372, tier: 3 },

  // Colombia
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', lat: 4.7110, lon: -74.0721, tier: 1 },
  { id: 'medellin', name: 'Medellín', country: 'Colombia', lat: 6.2442, lon: -75.5812, tier: 2 },
  { id: 'cali', name: 'Cali', country: 'Colombia', lat: 3.4516, lon: -76.5320, tier: 2 },
  { id: 'cartagena', name: 'Cartagena', country: 'Colombia', lat: 10.3997, lon: -75.5144, tier: 3 },

  // Argentina & Chile
  { id: 'buenos_aires', name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, tier: 1 },
  { id: 'cordoba_ar', name: 'Córdoba', country: 'Argentina', lat: -31.4201, lon: -64.1888, tier: 2 },
  { id: 'mendoza', name: 'Mendoza', country: 'Argentina', lat: -32.8895, lon: -68.8458, tier: 3 },
  { id: 'santiago', name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693, tier: 1 },
  { id: 'valparaiso', name: 'Valparaíso', country: 'Chile', lat: -33.0472, lon: -71.6127, tier: 3 },

  // Brasil
  { id: 'sao_paulo', name: 'São Paulo', country: 'Brasil', lat: -23.5505, lon: -46.6333, tier: 1 },
  { id: 'rio_de_janeiro', name: 'Río de Janeiro', country: 'Brasil', lat: -22.9068, lon: -43.1729, tier: 1 },
  { id: 'brasilia', name: 'Brasilia', country: 'Brasil', lat: -15.7975, lon: -47.8919, tier: 1 },
  { id: 'salvador_br', name: 'Salvador', country: 'Brasil', lat: -12.9777, lon: -38.5016, tier: 2 },
  { id: 'manaus', name: 'Manaos', country: 'Brasil', lat: -3.1190, lon: -60.0217, tier: 2 },

  // Perú, Ecuador, Bolivia, Uruguay, Paraguay
  { id: 'lima', name: 'Lima', country: 'Perú', lat: -12.0464, lon: -77.0428, tier: 1 },
  { id: 'cusco', name: 'Cusco', country: 'Perú', lat: -13.5319, lon: -71.9675, tier: 3 },
  { id: 'quito', name: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678, tier: 1 },
  { id: 'guayaquil', name: 'Guayaquil', country: 'Ecuador', lat: -2.1894, lon: -79.8891, tier: 2 },
  { id: 'la_paz', name: 'La Paz', country: 'Bolivia', lat: -16.4897, lon: -68.1193, tier: 1 },
  { id: 'santa_cruz_bo', name: 'Santa Cruz', country: 'Bolivia', lat: -17.7833, lon: -63.1821, tier: 2 },
  { id: 'montevideo', name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lon: -56.1645, tier: 1 },
  { id: 'asuncion', name: 'Asunción', country: 'Paraguay', lat: -25.2637, lon: -57.5759, tier: 1 },

  // ==========================================
  // NORTE Y CENTROAMÉRICA / CARIBE
  // ==========================================
  { id: 'mexico_city', name: 'Ciudad de México', country: 'México', lat: 19.4326, lon: -99.1332, tier: 1 },
  { id: 'guadalajara', name: 'Guadalajara', country: 'México', lat: 20.6597, lon: -103.3496, tier: 2 },
  { id: 'monterrey', name: 'Monterrey', country: 'México', lat: 25.6866, lon: -100.3161, tier: 2 },
  { id: 'cancun', name: 'Cancún', country: 'México', lat: 21.1619, lon: -86.8515, tier: 3 },

  { id: 'washington', name: 'Washington D.C.', country: 'EE.UU.', lat: 38.9072, lon: -77.0369, tier: 1 },
  { id: 'new_york', name: 'Nueva York', country: 'EE.UU.', lat: 40.7128, lon: -74.0060, tier: 1 },
  { id: 'los_angeles', name: 'Los Ángeles', country: 'EE.UU.', lat: 34.0522, lon: -118.2437, tier: 1 },
  { id: 'chicago', name: 'Chicago', country: 'EE.UU.', lat: 41.8781, lon: -87.6298, tier: 1 },
  { id: 'houston', name: 'Houston', country: 'EE.UU.', lat: 29.7604, lon: -95.3698, tier: 2 },
  { id: 'miami', name: 'Miami', country: 'EE.UU.', lat: 25.7617, lon: -80.1918, tier: 2 },
  { id: 'san_francisco', name: 'San Francisco', country: 'EE.UU.', lat: 37.7749, lon: -122.4194, tier: 2 },
  { id: 'seattle', name: 'Seattle', country: 'EE.UU.', lat: 47.6062, lon: -122.3321, tier: 2 },

  { id: 'toronto', name: 'Toronto', country: 'Canadá', lat: 43.6532, lon: -79.3832, tier: 1 },
  { id: 'vancouver', name: 'Vancouver', country: 'Canadá', lat: 49.2827, lon: -123.1207, tier: 2 },
  { id: 'montreal', name: 'Montreal', country: 'Canadá', lat: 45.5017, lon: -73.5673, tier: 2 },

  { id: 'la_habana', name: 'La Habana', country: 'Cuba', lat: 23.1136, lon: -82.3666, tier: 1 },
  { id: 'santo_domingo', name: 'Santo Domingo', country: 'Rep. Dominicana', lat: 18.4861, lon: -69.9312, tier: 2 },
  { id: 'san_juan_pr', name: 'San Juan', country: 'Puerto Rico', lat: 18.4655, lon: -66.1057, tier: 2 },
  { id: 'panama_city', name: 'Ciudad de Panamá', country: 'Panamá', lat: 8.9824, lon: -79.5199, tier: 1 },
  { id: 'san_jose_cr', name: 'San José', country: 'Costa Rica', lat: 9.9281, lon: -84.0907, tier: 2 },

  // ==========================================
  // EUROPA
  // ==========================================
  { id: 'madrid', name: 'Madrid', country: 'España', lat: 40.4168, lon: -3.7038, tier: 1 },
  { id: 'barcelona', name: 'Barcelona', country: 'España', lat: 41.3851, lon: 2.1734, tier: 2 },
  { id: 'paris', name: 'París', country: 'Francia', lat: 48.8566, lon: 2.3522, tier: 1 },
  { id: 'marseille', name: 'Marsella', country: 'Francia', lat: 43.2965, lon: 5.3698, tier: 3 },
  { id: 'london', name: 'Londres', country: 'Reino Unido', lat: 51.5074, lon: -0.1278, tier: 1 },
  { id: 'edinburgh', name: 'Edimburgo', country: 'Reino Unido', lat: 55.9533, lon: -3.1883, tier: 3 },
  { id: 'berlin', name: 'Berlín', country: 'Alemania', lat: 52.5200, lon: 13.4050, tier: 1 },
  { id: 'munich', name: 'Múnich', country: 'Alemania', lat: 48.1351, lon: 11.5820, tier: 2 },
  { id: 'frankfurt', name: 'Fráncfort', country: 'Alemania', lat: 50.1109, lon: 8.6821, tier: 2 },
  { id: 'rome', name: 'Roma', country: 'Italia', lat: 41.9028, lon: 12.4964, tier: 1 },
  { id: 'milan', name: 'Milán', country: 'Italia', lat: 45.4642, lon: 9.1900, tier: 2 },
  { id: 'amsterdam', name: 'Ámsterdam', country: 'Países Bajos', lat: 52.3676, lon: 4.9041, tier: 1 },
  { id: 'brussels', name: 'Bruselas', country: 'Bélgica', lat: 50.8503, lon: 4.3517, tier: 1 },
  { id: 'moscow', name: 'Moscú', country: 'Rusia', lat: 55.7558, lon: 37.6173, tier: 1 },
  { id: 'saint_petersburg', name: 'San Petersburgo', country: 'Rusia', lat: 59.9343, lon: 30.3351, tier: 2 },
  { id: 'athens', name: 'Atenas', country: 'Grecia', lat: 37.9838, lon: 23.7275, tier: 1 },
  { id: 'lisbon', name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393, tier: 1 },
  { id: 'vienna', name: 'Viena', country: 'Austria', lat: 48.2082, lon: 16.3738, tier: 1 },
  { id: 'prague', name: 'Praga', country: 'Rep. Checa', lat: 50.0755, lon: 14.4378, tier: 2 },
  { id: 'istanbul', name: 'Estambul', country: 'Turquía', lat: 41.0082, lon: 28.9784, tier: 1 },

  // ==========================================
  // ASIA Y ORIENTE MEDIO
  // ==========================================
  { id: 'tokyo', name: 'Tokio', country: 'Japón', lat: 35.6762, lon: 139.6503, tier: 1 },
  { id: 'osaka', name: 'Osaka', country: 'Japón', lat: 34.6937, lon: 135.5023, tier: 2 },
  { id: 'beijing', name: 'Pekín', country: 'China', lat: 39.9042, lon: 116.4074, tier: 1 },
  { id: 'shanghai', name: 'Shanghái', country: 'China', lat: 31.2304, lon: 121.4737, tier: 1 },
  { id: 'hong_kong', name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, tier: 1 },
  { id: 'seoul', name: 'Seúl', country: 'Corea del Sur', lat: 37.5665, lon: 126.9780, tier: 1 },
  { id: 'singapore', name: 'Singapur', country: 'Singapur', lat: 1.3521, lon: 103.8198, tier: 1 },
  { id: 'bangkok', name: 'Bangkok', country: 'Tailandia', lat: 13.7563, lon: 100.5018, tier: 1 },
  { id: 'jakarta', name: 'Yakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456, tier: 1 },
  { id: 'manila', name: 'Manila', country: 'Filipinas', lat: 14.5995, lon: 120.9842, tier: 1 },
  { id: 'new_delhi', name: 'Nueva Delhi', country: 'India', lat: 28.6139, lon: 77.2090, tier: 1 },
  { id: 'mumbai', name: 'Bombay', country: 'India', lat: 19.0760, lon: 72.8777, tier: 1 },
  { id: 'dubai', name: 'Dubái', country: 'EAU', lat: 25.2048, lon: 55.2708, tier: 1 },
  { id: 'riyadh', name: 'Riad', country: 'Arabia Saudita', lat: 24.7136, lon: 46.6753, tier: 1 },
  { id: 'tehran', name: 'Teherán', country: 'Irán', lat: 35.6892, lon: 51.3890, tier: 2 },

  // ==========================================
  // ÁFRICA
  // ==========================================
  { id: 'cairo', name: 'El Cairo', country: 'Egipto', lat: 30.0444, lon: 31.2357, tier: 1 },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, tier: 1 },
  { id: 'johannesburg', name: 'Johannesburgo', country: 'Sudáfrica', lat: -26.2041, lon: 28.0473, tier: 1 },
  { id: 'cape_town', name: 'Ciudad del Cabo', country: 'Sudáfrica', lat: -33.9249, lon: 18.4241, tier: 2 },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenia', lat: -1.2921, lon: 36.8219, tier: 1 },
  { id: 'casablanca', name: 'Casablanca', country: 'Marruecos', lat: 33.5731, lon: -7.5898, tier: 2 },
  { id: 'addis_ababa', name: 'Adís Abeba', country: 'Etiopía', lat: 9.0300, lon: 38.7400, tier: 2 },

  // ==========================================
  // OCEANÍA Y REGIONES POLARES
  // ==========================================
  { id: 'sydney', name: 'Sídney', country: 'Australia', lat: -33.8688, lon: 151.2093, tier: 1 },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, tier: 2 },
  { id: 'perth', name: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605, tier: 3 },
  { id: 'auckland', name: 'Auckland', country: 'Nueva Zelanda', lat: -36.8485, lon: 174.7633, tier: 1 },
  { id: 'honolulu', name: 'Honolulú', country: 'EE.UU.', lat: 21.3069, lon: -157.8583, tier: 2 },
  { id: 'mcmurdo', name: 'Base McMurdo', country: 'Antártida', lat: -77.8460, lon: 166.6680, tier: 3 },
];