// lib/meanderLakeData.js

export const GLOBAL_MEANDER_LAKES = [
  // =========================================================================
  // 🇺🇸 NORTEAMÉRICA (Cuenca del Río Misisipi, Misuri y Connecticut)
  // =========================================================================
  {
    id: 'lake_chicot',
    name: 'LAGO CHICOT',
    region: 'Arkansas, EE. UU. (Río Misisipi)',
    info: 'El lago en meandro más grande de Norteamérica',
    lat: 33.3, lon: -91.2,
    arcRadiusKm: 18, startAngle: 40, endAngle: 220,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'the_oxbow',
    name: 'THE OXBOW',
    region: 'Massachusetts, EE. UU. (Río Connecticut)',
    info: 'Histórico meandro aislado recreativo',
    lat: 42.3, lon: -72.6,
    arcRadiusKm: 10, startAngle: 30, endAngle: 210,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_horseshoe',
    name: 'LAGO HORSESHOE',
    region: 'Arkansas / Tennessee (Río Misisipi)',
    info: 'Forma perfecta de herradura fluvial',
    lat: 35.1, lon: -90.2,
    arcRadiusKm: 14, startAngle: 10, endAngle: 190,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_reelfoot',
    name: 'LAGO REELFOOT',
    region: 'Tennessee, EE. UU. (Río Misisipi)',
    info: 'Creado por alteración sísmica en 1811',
    lat: 36.4, lon: -89.4,
    arcRadiusKm: 16, startAngle: 60, endAngle: 240,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_eagle',
    name: 'LAGO EAGLE',
    region: 'Misisipi / Luisiana (Río Misisipi)',
    info: 'Enclave territorial aislado entre estados',
    lat: 32.5, lon: -91.0,
    arcRadiusKm: 12, startAngle: 0, endAngle: 180,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_carter',
    name: 'LAGO CARTER',
    region: 'Iowa / Nebraska (Río Misuri)',
    info: 'Meandro que aisló a la ciudad en el cauce opuesto',
    lat: 41.28, lon: -95.91,
    arcRadiusKm: 10, startAngle: 50, endAngle: 230,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_grand_lakeview',
    name: 'LAGO LAKEVIEW / GRAND LAKE',
    region: 'Arkansas, EE. UU. (Río Misisipi)',
    info: 'Humedal meándrico estratégico',
    lat: 33.05, lon: -91.2,
    arcRadiusKm: 12, startAngle: 20, endAngle: 200,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },

  // =========================================================================
  // 🌎 SUDAMÉRICA (Cochas, Tipishcas y Madreviejas)
  // =========================================================================
  {
    id: 'lago_sandoval',
    name: 'LAGO SANDOVAL (COCHA)',
    region: 'Madre de Dios, Perú (Río Madre de Dios)',
    info: 'Cocha megabiodiversa de la Amazonía',
    lat: -12.6, lon: -69.0,
    arcRadiusKm: 15, startAngle: 45, endAngle: 225,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },
  {
    id: 'lago_tres_chimbadas',
    name: 'LAGO TRES CHIMBADAS',
    region: 'Tambopata, Perú (Río Tambopata)',
    info: 'Refugio protegido del lobo de río gigante',
    lat: -12.8, lon: -69.3,
    arcRadiusKm: 12, startAngle: 30, endAngle: 210,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },
  {
    id: 'laguna_rimachi',
    name: 'LAGUNA RIMACHI',
    region: 'Loreto, Perú (Río Pastaza)',
    info: 'Complejo masivo de meandros amazónicos',
    lat: -4.4, lon: -76.7,
    arcRadiusKm: 22, startAngle: 0, endAngle: 180,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },
  {
    id: 'lagunas_yarinacocha',
    name: 'LAGUNAS DE YARINACOCHA',
    region: 'Ucayali, Perú (Río Ucayali)',
    info: 'Antiguo meandro masivo urbano y turístico',
    lat: -8.35, lon: -74.57,
    arcRadiusKm: 20, startAngle: 60, endAngle: 240,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },
  {
    id: 'lago_limoncocha',
    name: 'LAGO LIMONCOCHA',
    region: 'Sucumbíos, Ecuador (Río Napo)',
    info: 'Reserva biológica en brazo muerto amazónico',
    lat: -0.4, lon: -76.6,
    arcRadiusKm: 14, startAngle: 15, endAngle: 195,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },
  {
    id: 'laguna_mandiore',
    name: 'LAGUNA DE MANDIORÉ',
    region: 'Frontera Brasil-Bolivia (Río Paraguay)',
    info: 'Meandro alimentado por la dinámica del Pantanal',
    lat: -18.1, lon: -57.5,
    arcRadiusKm: 25, startAngle: 80, endAngle: 260,
    color: 'rgba(14, 165, 233, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'madrevieja_chinchina',
    name: 'MADREVIEJA DE CHINCHINÁ',
    region: 'Caldas, Colombia (Río Cauca)',
    info: 'Humedal semicircular andino',
    lat: 5.0, lon: -75.6,
    arcRadiusKm: 10, startAngle: 40, endAngle: 220,
    color: 'rgba(16, 185, 129, 0.50)', strokeColor: '#34d199'
  },

  // =========================================================================
  // 🌏 ASIA (Ganges, Mekong, Yangtsé y Siberianos)
  // =========================================================================
  {
    id: 'lake_kanwar',
    name: 'LAGO KANWAR / KABAR TAAL',
    region: 'Bihar, India (Río Burhi Gandak / Ganges)',
    info: 'Uno de los meandros cerrados más grandes de Asia',
    lat: 25.6, lon: 86.1,
    arcRadiusKm: 18, startAngle: 20, endAngle: 200,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'ho_tay_west_lake',
    name: 'LAGO DEL OESTE (HỒ TÂY)',
    region: 'Hanói, Vietnam (Río Rojo)',
    info: 'Icónico meandro gigante transformado en lago urbano',
    lat: 21.05, lon: 105.83,
    arcRadiusKm: 15, startAngle: 30, endAngle: 210,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'lake_vynthala',
    name: 'LAGO VYNTHALA',
    region: 'Kerala, India (Río Chalakudy)',
    info: 'Único meandro en herradura geológico catalogado del sur de India',
    lat: 10.3, lon: 76.3,
    arcRadiusKm: 10, startAngle: 10, endAngle: 190,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'tunguska_meander_lakes',
    name: 'LAGOS DEL BAJO TUNGUSKA',
    region: 'Siberia, Rusia (Río Bajo Tunguska)',
    info: 'Meandramientos polares sobre permafrost congelado',
    lat: 64.0, lon: 95.0,
    arcRadiusKm: 24, startAngle: 0, endAngle: 180,
    color: 'rgba(186, 230, 253, 0.50)', strokeColor: '#7dd3fc'
  },
  {
    id: 'amur_meander_lakes',
    name: 'LAGOS DEL RÍO AMUR',
    region: 'Frontera Rusia-China (Río Amur)',
    info: 'Brazos muertos extensos de Manchuria',
    lat: 48.5, lon: 135.0,
    arcRadiusKm: 20, startAngle: 45, endAngle: 225,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },

  // =========================================================================
  // 🇪🇺 EUROPA (Rin, Danubio, Volga y Bug Occidental)
  // =========================================================================
  {
    id: 'kuhkopf_knoblochsaue',
    name: 'KÜHKOPF-KNOBLOCHSAUE',
    region: 'Hesse, Alemania (Río Rin)',
    info: 'Meandro cortado artificialmente en 1828',
    lat: 49.8, lon: 8.46,
    arcRadiusKm: 14, startAngle: 50, endAngle: 230,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'altrhein_lakes',
    name: 'LAGOS DE ALTRHEIN',
    region: 'Alemania / Francia (Río Rin)',
    info: 'Cadena de meandros que marcan el antiguo curso fronterizo',
    lat: 49.0, lon: 8.3,
    arcRadiusKm: 16, startAngle: 30, endAngle: 210,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'srebarna_lake',
    name: 'LAGO SREBARNA',
    region: 'Bulgaria (Río Danubio)',
    info: 'Brazo muerto reserva de la biósfera',
    lat: 44.1, lon: 27.1,
    arcRadiusKm: 12, startAngle: 20, endAngle: 200,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'kopacki_rit',
    name: 'LAGOS DE KOPAČKI RIT',
    region: 'Croacia (Ríos Danubio / Drava)',
    info: 'Gran humedal saturado de brazos muertos',
    lat: 45.6, lon: 18.8,
    arcRadiusKm: 18, startAngle: 40, endAngle: 220,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'bug_meander_lakes',
    name: 'BRAZOS DEL RÍO BUG OCCIDENTAL',
    region: 'Frontera Polonia-Bielorrusia',
    info: 'Dinamica salvaje de meandros fluviales sin rectificar',
    lat: 52.1, lon: 23.5,
    arcRadiusKm: 15, startAngle: 10, endAngle: 190,
    color: 'rgba(56, 189, 248, 0.45)', strokeColor: '#38bdf8'
  },

  // =========================================================================
  // 🇦🇺 OCEANÍA (Los Billabongs de Australia)
  // =========================================================================
  {
    id: 'cullen_billabong',
    name: 'CULLEN BILLABONG',
    region: 'Territorio del Norte, Australia (Río Daly)',
    info: 'Humedal tropical semicircular permanente',
    lat: -13.8, lon: 131.2,
    arcRadiusKm: 14, startAngle: 45, endAngle: 225,
    color: 'rgba(6, 182, 212, 0.50)', strokeColor: '#22d3ee'
  },
  {
    id: 'yanderra_billabong',
    name: 'YANDERRA BILLABONG',
    region: 'Queensland, Australia (Río Fitzroy)',
    info: 'Refugio de vida silvestre en el Outback',
    lat: -23.5, lon: 149.8,
    arcRadiusKm: 15, startAngle: 30, endAngle: 210,
    color: 'rgba(6, 182, 212, 0.50)', strokeColor: '#22d3ee'
  },
  {
    id: 'narran_billabongs',
    name: 'NARRAN LAKES / BILLABONGS',
    region: 'Nueva Gales del Sur, Australia (Río Darling)',
    info: 'Sistema meándrico de llanura aluvial',
    lat: -29.9, lon: 147.4,
    arcRadiusKm: 20, startAngle: 60, endAngle: 240,
    color: 'rgba(6, 182, 212, 0.50)', strokeColor: '#22d3ee'
  },
  {
    id: 'yellow_water_billabong',
    name: 'YELLOW WATER BILLABONG',
    region: 'Parque Nacional Kakadu, Australia (Río South Alligator)',
    info: 'El billabong más emblemático de Australia',
    lat: -12.9, lon: 132.5,
    arcRadiusKm: 16, startAngle: 20, endAngle: 200,
    color: 'rgba(6, 182, 212, 0.50)', strokeColor: '#22d3ee'
  },

  // =========================================================================
  // 🌍 ÁFRICA (Delta del Níger, Caprivi y El Sudd)
  // =========================================================================
  {
    id: 'niger_inland_delta_lakes',
    name: 'LAGOS DEL DELTA INTERIOR DEL NÍGER',
    region: 'Malí (Río Níger)',
    info: 'Miles de meandros en U en zona semidesértica',
    lat: 15.0, lon: -4.0,
    arcRadiusKm: 22, startAngle: 10, endAngle: 190,
    color: 'rgba(245, 158, 11, 0.45)', strokeColor: '#f59e0b'
  },
  {
    id: 'caprivi_strip_lakes',
    name: 'LAGOS DE LA FRANJA DE CAPRIVI',
    region: 'Namibia / Botsuana (Río Zambeze / Cuando)',
    info: 'Brazos muertos que alimentan el Okavango',
    lat: -17.8, lon: 24.5,
    arcRadiusKm: 18, startAngle: 30, endAngle: 210,
    color: 'rgba(14, 165, 233, 0.45)', strokeColor: '#38bdf8'
  },
  {
    id: 'sudd_meander_lakes',
    name: 'LAGOS DEL SUDD',
    region: 'Sudán del Sur (Río Nilo Blanco)',
    info: 'Pantano gigantesco formado por meandros entrelazados',
    lat: 8.0, lon: 31.0,
    arcRadiusKm: 26, startAngle: 0, endAngle: 180,
    color: 'rgba(16, 185, 129, 0.45)', strokeColor: '#34d199'
  }
];