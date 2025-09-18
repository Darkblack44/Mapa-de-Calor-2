// Ruta: mapa-config.js

// Variables globales del mapa
let map;
let markers = [];
let fullDataObject = {};
let currentData = {};
let isFullscreen = false;

// Coordenadas de países
const coordenadasPaises = {
    'Colombia': [4.5709, -74.2973],
    'Venezuela': [6.4238, -66.5897],
    'Republica de Corea': [37.5665, 126.9780]
};

// MAPEO DE 242 MUNICIPIOS con departamentos y coordenadas
const municipiosCompletos = {
    'La Vega': { departamento: 'Cundinamarca', coords: [4.99972, -74.33917] },
    'Pasca': { departamento: 'Cundinamarca', coords: [4.30722, -74.30056] },
    'Bogota, D.C.': { departamento: 'Bogota D.C.', coords: [4.60971, -74.08175] },
    'Facatativa': { departamento: 'Cundinamarca', coords: [4.81367, -74.35453] },
    'Silvania': { departamento: 'Cundinamarca', coords: [4.40372, -74.38672] },
    'Caqueza': { departamento: 'Cundinamarca', coords: [4.40611, -73.94694] },
    'Sibate': { departamento: 'Cundinamarca', coords: [4.49154, -74.26028] },
    'Fusagasuga': { departamento: 'Cundinamarca', coords: [4.33646, -74.36378] },
    'Tibacuy': { departamento: 'Cundinamarca', coords: [4.34722, -74.4525] },
    'Ramiriqui': { departamento: 'Boyaca', coords: [5.40023, -73.33543] },
    'Girardot': { departamento: 'Cundinamarca', coords: [4.30078, -74.80754] },
    'Ibague': { departamento: 'Tolima', coords: [4.43889, -75.23222] },
    'San Bernardo': { departamento: 'Cundinamarca', coords: [4.17833, -74.42222] },
    'Venecia': { departamento: 'Cundinamarca', coords: [4.08944, -74.4775] },
    'Neiva': { departamento: 'Huila', coords: [2.9273, -75.28188] },
    'Bucaramanga': { departamento: 'Santander', coords: [7.12539, -73.1198] },
    'Pereira': { departamento: 'Risaralda', coords: [4.81333, -75.69611] },
    'Arbelaez': { departamento: 'Cundinamarca', coords: [4.27246, -74.41522] },
    'Saravena': { departamento: 'Arauca', coords: [6.95587, -71.88139] },
    'Soacha': { departamento: 'Cundinamarca', coords: [4.57937, -74.21682] },
    'San Antonio del Tequendama': { departamento: 'Cundinamarca', coords: [4.61861, -74.35278] },
    'Medellin': { departamento: 'Antioquia', coords: [6.25184, -75.56359] },
    'Barranquilla': { departamento: 'Atlantico', coords: [10.96854, -74.78132] },
    'Cabrera': { departamento: 'Cundinamarca', coords: [3.97806, -74.48556] },
    'Concordia': { departamento: 'Antioquia', coords: [6.04639, -74.8325] },
    'Granada': { departamento: 'Cundinamarca', coords: [3.54639, -73.70694] },
    'Chiquinquira': { departamento: 'Boyaca', coords: [5.61474, -73.81747] },
    'Fomeque': { departamento: 'Cundinamarca', coords: [4.4858, -73.89745] },
    'Melgar': { departamento: 'Tolima', coords: [4.20475, -74.64075] },
    'Viota': { departamento: 'Cundinamarca', coords: [4.43727, -74.52153] },
    'Chaparral': { departamento: 'Tolima', coords: [3.72333, -75.48333] },
    'Santiago de Cali': { departamento: 'Valle del Cauca', coords: [3.43722, -76.5225] },
    'Belen': { departamento: 'Boyaca', coords: [5.98892, -72.87521] },
    'Pandi': { departamento: 'Cundinamarca', coords: [4.19104, -74.48782] },
    'Villavicencio': { departamento: 'Meta', coords: [4.142, -73.62664] },
    'Muzo': { departamento: 'Boyaca', coords: [5.53528, -74.10778] },
    'Florencia': { departamento: 'Caqueta', coords: [1.61438, -75.60623] },
    'Icononzo': { departamento: 'Tolima', coords: [4.17694, -74.5325] },
    'Calarca': { departamento: 'Quindio', coords: [4.52949, -75.64091] },
    'Choachi': { departamento: 'Cundinamarca', coords: [4.527, -73.9259] },
    'Landazuri': { departamento: 'Santander', coords: [6.21873, -73.81141] },
    'Tunja': { departamento: 'Boyaca', coords: [5.53528, -73.36778] },
    'San Jose de Cucuta': { departamento: 'Norte de Santander', coords: [7.89391, -72.50782] },
    'Madrid': { departamento: 'Cundinamarca', coords: [4.73245, -74.26419] },
    'Pitalito': { departamento: 'Huila', coords: [1.85367, -76.05071] },
    'Yacopi': { departamento: 'Cundinamarca', coords: [5.46208, -74.33907] },
    'Valledupar': { departamento: 'Cesar', coords: [10.46314, -73.25322] },
    'Anolaima': { departamento: 'Cundinamarca', coords: [4.76417, -74.465] },
    'Santa Marta': { departamento: 'Magdalena', coords: [11.24079, -74.19904] },
    'Bolivar': { departamento: 'Cauca', coords: [1.8404, -76.9664] },
    'Linares': { departamento: 'Narino', coords: [1.35, -75.66667] },
    'Garagoa': { departamento: 'Boyaca', coords: [5.08236, -73.36335] },
    'Supata': { departamento: 'Cundinamarca', coords: [5.06111, -74.23722] },
    'Flandes': { departamento: 'Tolima', coords: [4.29, -74.81611] },
    'Chipaque': { departamento: 'Cundinamarca', coords: [4.4425, -74.03417] },
    'Baraya': { departamento: 'Huila', coords: [3.1, -75.05] },
    'Zipaquira': { departamento: 'Cundinamarca', coords: [5.0221, -73.9947] },
    'San Cayetano': { departamento: 'Cundinamarca', coords: [5.30361, -74.07167] },
    'Guaduas': { departamento: 'Cundinamarca', coords: [5.069, -74.595] },
    'Mosquera': { departamento: 'Cundinamarca', coords: [4.70583, -74.23021] },
    'Pacho': { departamento: 'Cundinamarca', coords: [5.13278, -74.15978] },
    'Roldanillo': { departamento: 'Valle del Cauca', coords: [4.41256, -76.15457] },
    'Galeras': { departamento: 'Sucre', coords: [9.4158, -75.1947] },
    'Marquetalia': { departamento: 'Caldas', coords: [5.29667, -75.05361] },
    'Natagaima': { departamento: 'Tolima', coords: [3.6213, -75.0992] },
    'Duitama': { departamento: 'Boyaca', coords: [5.8245, -73.03408] },
    'Junin': { departamento: 'Cundinamarca', coords: [4.79056, -73.66111] },
    'San Francisco': { departamento: 'Cundinamarca', coords: [4.97972, -74.2925] },
    'Planadas': { departamento: 'Tolima', coords: [3.19698, -75.645] },
    'Valparaiso': { departamento: 'Caqueta', coords: [1.19889, -75.70778] },
    'Pasto': { departamento: 'Narino', coords: [1.21361, -77.28111] },
    'Aipe': { departamento: 'Huila', coords: [3.22222, -75.23667] },
    'Espinal': { departamento: 'Tolima', coords: [4.14924, -74.88429] },
    'Dolores': { departamento: 'Tolima', coords: [3.66917, -74.71333] },
    'Inirida': { departamento: 'Guainia', coords: [3.86528, -67.92389] },
    'Turmeque': { departamento: 'Boyaca', coords: [5.32357, -73.4907] },
    'Aguadas': { departamento: 'Caldas', coords: [5.61161, -75.45624] },
    'La Calera': { departamento: 'Cundinamarca', coords: [4.72055, -73.96977] },
    'Manizales': { departamento: 'Caldas', coords: [5.06889, -75.51738] },
    'La Salina': { departamento: 'Casanare', coords: [6.12722, -72.33722] },
    'Agua de Dios': { departamento: 'Cundinamarca', coords: [4.37639, -74.66944] },
    'Ubala': { departamento: 'Cundinamarca', coords: [4.74361, -73.53528] },
    'Tulua': { departamento: 'Valle del Cauca', coords: [4.08466, -76.19536] },
    'Palmira': { departamento: 'Valle del Cauca', coords: [3.53944, -76.30361] },
    'Guasca': { departamento: 'Cundinamarca', coords: [4.866, -73.87722] },
    'Tauramena': { departamento: 'Casanare', coords: [5.01794, -72.74675] },
    'Villanueva': { departamento: 'Casanare', coords: [5.28333, -71.96667] },
    'Quimbaya': { departamento: 'Quindio', coords: [4.62306, -75.76278] },
    'Cachipay': { departamento: 'Cundinamarca', coords: [4.72889, -74.43639] },
    'Maicao': { departamento: 'La Guajira', coords: [11.37837, -72.2395] },
    'Cartagena de Indias': { departamento: 'Bolivar', coords: [10.39972, -75.51444] },
    'Aguachica': { departamento: 'Cesar', coords: [8.30844, -73.6166] },
    'Villa de San Diego de Ubate': { departamento: 'Cundinamarca', coords: [5.30933, -73.81575] },
    'Tibirita': { departamento: 'Cundinamarca', coords: [5.0533, -73.5046] },
    'Mocoa': { departamento: 'Putumayo', coords: [1.14933, -76.6466] },
    'San Vicente del Caguan': { departamento: 'Caqueta', coords: [2.115, -74.7675] },
    'Tocaima': { departamento: 'Cundinamarca', coords: [4.4582, -74.6343] },
    'Purace': { departamento: 'Cauca', coords: [2.35, -76.5] },
    'San Jose del Guaviare': { departamento: 'Guaviare', coords: [2.57286, -72.64591] },
    'San Agustin': { departamento: 'Huila', coords: [1.87917, -76.26519] },
    'Corozal': { departamento: 'Sucre', coords: [9.31848, -75.29303] },
    'Villagomez': { departamento: 'Cundinamarca', coords: [5.27333, -74.19722] },
    'Chia': { departamento: 'Cundinamarca', coords: [4.85876, -74.05866] },
    'San Gil': { departamento: 'Santander', coords: [6.55952, -73.13645] },
    'Villapinzon': { departamento: 'Cundinamarca', coords: [5.215, -73.595] },
    'San Antonio': { departamento: 'Tolima', coords: [3.914, -75.48] },
    'Belalcazar': { departamento: 'Caldas', coords: [4.99528, -75.36278] },
    'Macheta': { departamento: 'Cundinamarca', coords: [5.08111, -73.60778] },
    'Paipa': { departamento: 'Boyaca', coords: [5.7802, -73.11739] },
    'Saboya': { departamento: 'Boyaca', coords: [5.69639, -73.765] },
    'Cunday': { departamento: 'Tolima', coords: [4.06259, -74.69215] },
    'Timana': { departamento: 'Huila', coords: [1.97194, -75.93278] },
    'Funza': { departamento: 'Cundinamarca', coords: [4.71638, -74.21195] },
    'Fredonia': { departamento: 'Antioquia', coords: [5.92583, -75.67056] },
    'Villeta': { departamento: 'Cundinamarca', coords: [5.00861, -74.47226] },
    'San Martin': { departamento: 'Meta', coords: [3.69637, -73.69958] },
    'Mogotes': { departamento: 'Santander', coords: [6.47594, -72.97012] },
    'El Colegio': { departamento: 'Cundinamarca', coords: [4.58069, -74.44349] },
    'Acevedo': { departamento: 'Huila', coords: [1.27736, -75.89622] },
    'Une': { departamento: 'Cundinamarca', coords: [4.99917, -74.02389] },
    'Armero': { departamento: 'Tolima', coords: [5.03, -74.884] },
    'Subachoque': { departamento: 'Cundinamarca', coords: [4.93067, -74.17269] },
    'Cucunuba': { departamento: 'Cundinamarca', coords: [5.25, -73.76639] },
    'Jesus Maria': { departamento: 'Santander', coords: [5.87774, -73.78838] },
    'Tausa': { departamento: 'Cundinamarca', coords: [5.19633, -73.88791] },
    'Carmen de Carupa': { departamento: 'Cundinamarca', coords: [5.35, -73.9] },
    'Simijaca': { departamento: 'Cundinamarca', coords: [5.50611, -73.85139] },
    'Fuquene': { departamento: 'Cundinamarca', coords: [5.405, -73.7975] },
    'Cajica': { departamento: 'Cundinamarca', coords: [4.91657, -74.02799] },
    'San Juan de Rioseco': { departamento: 'Cundinamarca', coords: [4.847, -74.621] },
    'Quetame': { departamento: 'Cundinamarca', coords: [4.332, -73.862] },
    'San Sebastian de Mariquita': { departamento: 'Tolima', coords: [5.19889, -74.89296] },
    'Puerto Asis': { departamento: 'Putumayo', coords: [0.51328, -76.50071] },
    'Ortega': { departamento: 'Tolima', coords: [3.93861, -75.2225] },
    'Guadalupe': { departamento: 'Huila', coords: [2.0275, -75.75889] },
    'Mapiripan': { departamento: 'Meta', coords: [2.88917, -72.13333] },
    'Tame': { departamento: 'Arauca', coords: [6.46065, -71.73618] },
    'Miraflores': { departamento: 'Boyaca', coords: [5.19611, -73.1447] },
    'El Rosal': { departamento: 'Cundinamarca', coords: [4.85389, -74.265] },
    'Rovira': { departamento: 'Tolima', coords: [4.23927, -75.24002] },
    'Moniquira': { departamento: 'Boyaca', coords: [5.87639, -73.57278] },
    'Honda': { departamento: 'Tolima', coords: [5.20866, -74.73584] },
    'Oiba': { departamento: 'Santander', coords: [6.26389, -73.29861] },
    'Barbacoas': { departamento: 'Narino', coords: [1.67152, -78.13977] },
    'Choconta': { departamento: 'Cundinamarca', coords: [5.14468, -73.6854] },
    'Balboa': { departamento: 'Narino', coords: [2.04194, -77.21694] },
    'Quinchia': { departamento: 'Risaralda', coords: [5.33957, -75.73019] },
    'Armenia': { departamento: 'Quindio', coords: [4.53389, -75.68111] },
    'La Mesa': { departamento: 'Cundinamarca', coords: [4.6323, -74.4619] },
    'Carmen de Apicala': { departamento: 'Tolima', coords: [4.1537, -74.7198] },
    'Barrancabermeja': { departamento: 'Santander', coords: [7.06528, -73.85472] },
    'El Penon': { departamento: 'Cundinamarca', coords: [6.054, -73.946] },
    'Cienaga': { departamento: 'Magdalena', coords: [11.00703, -74.24782] },
    'Gacheta': { departamento: 'Cundinamarca', coords: [4.693, -73.617] },
    'Caparrapi': { departamento: 'Cundinamarca', coords: [5.35028, -74.51556] },
    'Ricaurte': { departamento: 'Cundinamarca', coords: [4.28075, -74.76662] },
    'Santa Maria': { departamento: 'Boyaca', coords: [5.514, -73.263] },
    'Marinilla': { departamento: 'Antioquia', coords: [6.17361, -75.33616] },
    'Villarrica': { departamento: 'Tolima', coords: [3.93444, -74.9625] },
    'Tarapaca': { departamento: 'Amazonas', coords: [2.878, -69.744] },
    'Tabio': { departamento: 'Cundinamarca', coords: [4.91728, -74.09368] },
    'Mesetas': { departamento: 'Meta', coords: [3.3841, -74.0441] },
    'Guaranda': { departamento: 'Sucre', coords: [8.4622, -74.7547] },
    'Jerusalen': { departamento: 'Cundinamarca', coords: [4.56361, -74.696] },
    'Maripi': { departamento: 'Boyaca', coords: [5.55194, -74.00861] },
    'Bojaca': { departamento: 'Cundinamarca', coords: [4.73194, -74.34139] },
    'Boavita': { departamento: 'Boyaca', coords: [6.33031, -72.58517] },
    'Sincelejo': { departamento: 'Sucre', coords: [9.30472, -75.39778] },
    'Murillo': { departamento: 'Tolima', coords: [4.87361, -75.17139] },
    'San Andres de Sotavento': { departamento: 'Cordoba', coords: [9.145, -75.506] },
    'Puente Nacional': { departamento: 'Santander', coords: [5.87738, -73.67846] },
    'Cota': { departamento: 'Cundinamarca', coords: [4.80938, -74.098] },
    'Quipile': { departamento: 'Cundinamarca', coords: [4.745, -74.53333] },
    'Sutatausa': { departamento: 'Cundinamarca', coords: [5.24722, -73.85222] },
    'Arauca': { departamento: 'Arauca', coords: [7.08471, -70.75908] },
    'Susa': { departamento: 'Cundinamarca', coords: [5.45361, -73.81472] },
    'Lenguazaque': { departamento: 'Cundinamarca', coords: [5.30722, -73.71167] },
    'Caicedonia': { departamento: 'Valle del Cauca', coords: [4.3324, -75.82665] },
    'Tenza': { departamento: 'Boyaca', coords: [5.075, -73.421] },
    'Suesca': { departamento: 'Cundinamarca', coords: [5.103, -73.798] },
    'Anzoategui': { departamento: 'Tolima', coords: [4.63056, -75.09528] },
    'La Palma': { departamento: 'Cundinamarca', coords: [5.36, -73.96] },
    'Topaipi': { departamento: 'Cundinamarca', coords: [5.33472, -74.30278] },
    'San Benito Abad': { departamento: 'Sucre', coords: [8.92974, -75.0265] },
    'Sopo': { departamento: 'Cundinamarca', coords: [4.9075, -73.9405] },
    'El Tambo': { departamento: 'Cauca', coords: [2.452, -76.81] },
    'Valle del Guamuez': { departamento: 'Putumayo', coords: [0.4525, -76.91917] },
    'Vistahermosa': { departamento: 'Meta', coords: [3.12415, -73.7514] },
    'Samaniego': { departamento: 'Narino', coords: [1.335, -77.5957] },
    'Cubarral': { departamento: 'Meta', coords: [3.79536, -73.8406] },
    'Piendamo - Tunia': { departamento: 'Cauca', coords: [2.63972, -76.53472] },
    'Maria La Baja': { departamento: 'Bolivar', coords: [9.9832, -75.3016] },
    'Cumbal': { departamento: 'Narino', coords: [0.90875, -77.79139] },
    'Fresno': { departamento: 'Tolima', coords: [5.15264, -75.03624] },
    'Rondon': { departamento: 'Boyaca', coords: [5.35588, -73.20938] },
    'San Luis': { departamento: 'Tolima', coords: [4.134, -75.096] },
    'Rosas': { departamento: 'Cauca', coords: [2.26194, -76.74] },
    'Roncesvalles': { departamento: 'Tolima', coords: [4.56833, -75.60472] },
    'Yopal': { departamento: 'Casanare', coords: [5.33775, -72.39586] },
    'Guatavita': { departamento: 'Cundinamarca', coords: [4.967, -73.833] },
    'Zetaquira': { departamento: 'Boyaca', coords: [5.284, -73.169] },
    'Santa Isabel': { departamento: 'Tolima', coords: [4.716, -75.097] },
    'Popayan': { departamento: 'Cauca', coords: [2.43823, -76.61321] },
    'El Reten': { departamento: 'Magdalena', coords: [10.6111, -74.26824] },
    'Cartago': { departamento: 'Valle del Cauca', coords: [4.74639, -75.91167] },
    'El Doncello': { departamento: 'Caqueta', coords: [1.68333, -75.28333] },
    'San Sebastian': { departamento: 'Cauca', coords: [1.83639, -76.7725] },
    'Nemocon': { departamento: 'Cundinamarca', coords: [5.0675, -73.878] },
    'Anapoima': { departamento: 'Cundinamarca', coords: [4.552, -74.536] },
    'Anserma': { departamento: 'Caldas', coords: [5.23278, -75.79111] },
    'Puerto Rico': { departamento: 'Caqueta', coords: [1.91417, -75.159] },
    'Oporapa': { departamento: 'Huila', coords: [2.026, -76.262] },
    'Alban': { departamento: 'Cundinamarca', coords: [4.8775, -74.43778] },
    'Paicol': { departamento: 'Huila', coords: [2.45, -75.771] },
    'Puerto Boyaca': { departamento: 'Boyaca', coords: [5.97583, -74.58833] },
    'Prado': { departamento: 'Tolima', coords: [3.75, -74.92861] },
    'San Pablo de Borbur': { departamento: 'Boyaca', coords: [5.65139, -74.07333] },
    'Planeta Rica': { departamento: 'Cordoba', coords: [8.4115, -75.58508] },
    'Colombia': { departamento: 'Huila', coords: [1.185, -75.7878] },
    'Puerto Rondon': { departamento: 'Arauca', coords: [6.28055, -71.1] },
    'El Retorno': { departamento: 'Guaviare', coords: [2.33028, -72.62778] },
    'Guateque': { departamento: 'Boyaca', coords: [5.00621, -73.47144] },
    'Sabana de Torres': { departamento: 'Santander', coords: [7.3915, -73.49881] },
    'Libano': { departamento: 'Tolima', coords: [4.9218, -75.0623] },
    'Socorro': { departamento: 'Santander', coords: [6.46838, -73.26022] },
    'Caldas': { departamento: 'Antioquia', coords: [6.09106, -75.63569] },
    'Sogamoso': { departamento: 'Boyaca', coords: [5.71434, -72.93391] },
    'Garzon': { departamento: 'Huila', coords: [2.19593, -75.62777] },
    'Palocabildo': { departamento: 'Tolima', coords: [5.11667, -75.01667] },
    'La Argentina': { departamento: 'Huila', coords: [2.2, -75.98333] },
    'Filadelfia': { departamento: 'Caldas', coords: [5.29611, -75.5612] },
    'Puli': { departamento: 'Cundinamarca', coords: [4.69139, -74.95139] },
    'Barrancas': { departamento: 'La Guajira', coords: [10.95574, -72.78721] },
    'Leticia': { departamento: 'Amazonas', coords: [-4.21528, -69.94056] },
    'San Pablo': { departamento: 'Bolivar', coords: [7.47194, -74.26556] },
    'Soata': { departamento: 'Boyaca', coords: [6.34157, -72.68297] },
    'Coyaima': { departamento: 'Tolima', coords: [3.7994, -75.1946] },
    'La Plata': { departamento: 'Huila', coords: [2.39341, -75.89245] },
    'Monteria': { departamento: 'Cordoba', coords: [8.74798, -75.88143] },
    'Envigado': { departamento: 'Antioquia', coords: [6.17591, -75.59174] },
    'Cumaral': { departamento: 'Meta', coords: [4.27081, -73.48669] },
    'Trinidad': { departamento: 'Casanare', coords: [5.40861, -71.66204] }
};

// Sistema de notificaciones optimizado
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// Función para limpiar y normalizar texto
function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text.trim();
}

// Función para obtener departamento por municipio
function getDepartamentoPorMunicipio(municipio) {
    if (!municipio) return 'Sin especificar';
    return municipiosCompletos[municipio]?.departamento || 'Otros departamentos';
}

// Función para obtener coordenadas por municipio
function getCoordenadasPorMunicipio(municipio) {
    if (!municipio) return null;
    return municipiosCompletos[municipio]?.coords || null;
}

// FUNCIÓN DE NAVEGACIÓN OPTIMIZADA Y FLUIDA
function centrarEnLugar(nombre, tipo, zoomLevel = null) {
    let coords, zoom;
    
    if (tipo === 'pais') {
        coords = coordenadasPaises[nombre];
        zoom = zoomLevel || (nombre === 'Republica de Corea' ? 7 : 6);
    } else {
        coords = getCoordenadasPorMunicipio(nombre);
        zoom = zoomLevel || 12;
    }
    
    if (coords && map) {
        // ANIMACIÓN OPTIMIZADA - MÁS RÁPIDA Y FLUIDA
        map.flyTo(coords, zoom, { 
            animate: true, 
            duration: 0.8,  // Reducido de 1.5s a 0.8s
            easeLinearity: 0.1  // Animación más suave
        });
        
        // Notificación más rápida
        showNotification(`📍 ${nombre}`, 'info');
        
        // Highlight temporal del marcador
        setTimeout(() => {
            highlightMarkerByLocation(coords);
        }, 400);
    } else {
        showNotification(`❌ No se encontraron coordenadas para ${nombre}`, 'error');
    }
}

// Función para resaltar marcador temporalmente
function highlightMarkerByLocation(coords) {
    if (!coords || !map) return;
    
    markers.forEach(marker => {
        const markerCoords = marker.getLatLng();
        if (Math.abs(markerCoords.lat - coords[0]) < 0.001 && 
            Math.abs(markerCoords.lng - coords[1]) < 0.001) {
            
            // Animación de pulse
            const originalRadius = marker.getRadius();
            let pulseCount = 0;
            
            const pulseInterval = setInterval(() => {
                if (pulseCount < 6) {
                    const newRadius = pulseCount % 2 === 0 ? originalRadius * 1.5 : originalRadius;
                    marker.setRadius(newRadius);
                    pulseCount++;
                } else {
                    marker.setRadius(originalRadius);
                    clearInterval(pulseInterval);
                }
            }, 150);
        }
    });
}

// Función principal de parsing de datos
function parseData(rawData, filtroPais = 'Todos', filtroNivel = 'Todos', filtroDepartamento = 'Todos', filtroRango = 'Todos') {
    if (!rawData || typeof rawData !== 'string') {
        console.error('Datos no válidos para parsing');
        return createEmptyDataObject();
    }

    const lines = rawData.trim().split('\n');
    if (lines.length < 2) {
        console.error('Datos insuficientes para procesar');
        return createEmptyDataObject();
    }

    const headers = lines[0].split('\t');
    if (headers.length < 5) {
        console.error('Formato de headers incorrecto');
        return createEmptyDataObject();
    }
    
    const data = createEmptyDataObject();
    const tempMunicipios = {};
    
    // Recopilar datos únicos en primera pasada
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split('\t');
        if (row.length < 5) continue;
        
        const pais = normalizeText(row[1]) || 'Sin especificar';
        const municipio = normalizeText(row[3]) || 'Sin especificar';
        const departamentoInferido = getDepartamentoPorMunicipio(municipio);
        
        data.paisesUnicos.add(pais);
        if (pais === 'Colombia' && departamentoInferido !== 'Sin especificar') {
            data.departamentosUnicos.add(departamentoInferido);
        }
    }
    
    // Procesar datos con filtros en segunda pasada
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split('\t');
        if (row.length < 5) continue;
        
        const pais = normalizeText(row[1]) || 'Sin especificar';
        const municipio = normalizeText(row[3]) || 'Sin especificar';
        const nivel = normalizeText(row[4]) || 'Sin especificar';
        const departamento = getDepartamentoPorMunicipio(municipio);
        
        // Aplicar filtros
        if (filtroPais !== 'Todos' && pais !== filtroPais) continue;
        if (filtroNivel !== 'Todos' && nivel !== filtroNivel) continue;
        if (filtroDepartamento !== 'Todos' && departamento !== filtroDepartamento) continue;
        
        data.registrosTotales++;
        
        // Procesar niveles académicos
        if (nivel === 'Pregrado') data.nivelesAcademicos.Pregrado++;
        if (nivel === 'Posgrado') data.nivelesAcademicos.Posgrado++;
        
        // Procesar países
        if (!data.paises[pais]) {
            data.paises[pais] = {
                total: 0,
                niveles: { 'Pregrado': 0, 'Posgrado': 0 }
            };
        }
        data.paises[pais].total++;
        if (data.paises[pais].niveles[nivel] !== undefined) {
            data.paises[pais].niveles[nivel]++;
        }
        
        // Procesar departamentos de Colombia
        if (pais === 'Colombia' && departamento !== 'Sin especificar') {
            if (!data.departamentos[departamento]) {
                data.departamentos[departamento] = {
                    total: 0,
                    pais: pais,
                    niveles: { 'Pregrado': 0, 'Posgrado': 0 }
                };
            }
            data.departamentos[departamento].total++;
            if (data.departamentos[departamento].niveles[nivel] !== undefined) {
                data.departamentos[departamento].niveles[nivel]++;
            }
        }
        
        // Procesar municipios de Colombia temporalmente
        if (pais === 'Colombia' && municipio !== 'Sin especificar') {
            if (!tempMunicipios[municipio]) {
                tempMunicipios[municipio] = {
                    total: 0,
                    departamento: departamento,
                    pais: pais,
                    niveles: { 'Pregrado': 0, 'Posgrado': 0 }
                };
            }
            tempMunicipios[municipio].total++;
            if (tempMunicipios[municipio].niveles[nivel] !== undefined) {
                tempMunicipios[municipio].niveles[nivel]++;
            }
        }
    }
    
    // Aplicar filtro de rango a municipios
    Object.entries(tempMunicipios).forEach(([municipio, info]) => {
        const total = info.total;
        let cumpleFiltroRango = true;
        
        if (filtroRango !== 'Todos') {
            switch (filtroRango) {
                case '1-10':
                    cumpleFiltroRango = total >= 1 && total <= 10;
                    break;
                case '11-50':
                    cumpleFiltroRango = total >= 11 && total <= 50;
                    break;
                case '51-100':
                    cumpleFiltroRango = total >= 51 && total <= 100;
                    break;
                case '100+':
                    cumpleFiltroRango = total > 100;
                    break;
            }
        }
        
        if (cumpleFiltroRango) {
            data.municipios[municipio] = info;
        }
    });
    
    // Generar rankings ordenados
    data.topPaises = Object.entries(data.paises)
        .map(([nombre, info]) => ({ nombre, total: info.total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    
    data.topDepartamentos = Object.entries(data.departamentos)
        .map(([nombre, info]) => ({ nombre, total: info.total, pais: info.pais }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    
    data.topMunicipios = Object.entries(data.municipios)
        .map(([nombre, info]) => ({ nombre, total: info.total, departamento: info.departamento, pais: info.pais }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    
    data.paisesUnicos = Array.from(data.paisesUnicos);
    data.departamentosUnicos = Array.from(data.departamentosUnicos);
    
    console.log('✅ Parsing completado:', {
        registros: data.registrosTotales,
        paises: data.paisesUnicos.length,
        departamentos: data.departamentosUnicos.length,
        municipios: Object.keys(data.municipios).length
    });
    
    return data;
}

// Función para crear objeto de datos vacío
function createEmptyDataObject() {
    return {
        registrosTotales: 0,
        paisesUnicos: new Set(),
        departamentosUnicos: new Set(),
        departamentos: {},
        municipios: {},
        paises: {},
        nivelesAcademicos: {
            'Pregrado': 0,
            'Posgrado': 0
        },
        topPaises: [],
        topDepartamentos: [],
        topMunicipios: []
    };
}

// Función para actualizar la interfaz de usuario
function updateUI(data) {
    const elements = {
        totalRegistros: document.getElementById('totalRegistros'),
        totalPregrado: document.getElementById('totalPregrado'),
        totalPosgrado: document.getElementById('totalPosgrado'),
        totalMunicipios: document.getElementById('totalMunicipios'),
        totalDepartamentos: document.getElementById('totalDepartamentos'),
        totalPaises: document.getElementById('totalPaises')
    };
    
    // Validar elementos antes de actualizar
    Object.entries(elements).forEach(([key, element]) => {
        if (!element) {
            console.warn(`Elemento ${key} no encontrado en el DOM`);
            return;
        }
        
        switch (key) {
            case 'totalRegistros':
                element.textContent = data.registrosTotales.toLocaleString();
                break;
            case 'totalPregrado':
                element.textContent = data.nivelesAcademicos.Pregrado.toLocaleString();
                break;
            case 'totalPosgrado':
                element.textContent = data.nivelesAcademicos.Posgrado.toLocaleString();
                break;
            case 'totalMunicipios':
                element.textContent = Object.keys(data.municipios).length;
                break;
            case 'totalDepartamentos':
                element.textContent = Object.keys(data.departamentos).length;
                break;
            case 'totalPaises':
                element.textContent = data.paisesUnicos.length;
                break;
        }
    });
    
    updateCountryNavigation(data);
    updateTopRankings(data);
    updateMap(data);
}

// Función para actualizar la navegación por países CON NAVEGACIÓN INTERACTIVA
function updateCountryNavigation(data) {
    const container = document.getElementById('listaPaises');
    if (!container) return;
    
    container.innerHTML = '';
    
    data.topPaises.forEach((pais, index) => {
        const percentage = (data.registrosTotales > 0) ? 
            ((pais.total / data.registrosTotales) * 100).toFixed(1) : 0;
        const colors = ['#dc2626', '#ea580c', '#d97706'];
        const color = colors[index] || '#6b7280';
        
        const paisElement = document.createElement('div');
        paisElement.className = 'country-item p-4 rounded-lg cursor-pointer hover-smooth';
        paisElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-4 h-4 rounded-full" style="background-color: ${color};"></div>
                    <div>
                        <div class="font-medium text-gray-800">${pais.nombre}</div>
                        <div class="text-sm text-gray-500">${pais.total.toLocaleString()} registros</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-gray-800">${percentage}%</div>
                </div>
            </div>
            <div class="progress-bar mt-2">
                <div class="progress-fill" style="width: ${(data.topPaises[0]?.total > 0 ? (pais.total / data.topPaises[0].total * 100) : 0)}%; background-color: ${color};"></div>
            </div>
        `;
        
        // NAVEGACIÓN INTERACTIVA MEJORADA
        paisElement.addEventListener('click', () => {
            navegarAPais(pais.nombre);
            paisElement.classList.add('active');
            setTimeout(() => paisElement.classList.remove('active'), 1200);
        });
        
        container.appendChild(paisElement);
    });
}

// Función para actualizar rankings principales
function updateTopRankings(data) {
    updateTopList('topDepartamentos', data.topDepartamentos, data.registrosTotales, 'departamento');
    updateTopList('topMunicipios', data.topMunicipios, data.registrosTotales, 'municipio');
}

// FUNCIÓN MEJORADA PARA RANKINGS INTERACTIVOS
function updateTopList(containerId, items, total, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const percentage = (total > 0) ? ((item.total / total) * 100).toFixed(1) : 0;
        const progressWidth = items.length > 0 && items[0]?.total > 0 ? (item.total / items[0].total * 100) : 0;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'top-item p-3 rounded-lg cursor-pointer hover-smooth interactive-ranking';
        itemElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">${index + 1}</div>
                    <div>
                        <div class="font-medium text-gray-800">${item.nombre}</div>
                        ${type === 'municipio' ? `<div class="text-xs text-gray-500">${item.departamento}, ${item.pais}</div>` : 
                          type === 'departamento' ? `<div class="text-xs text-gray-500">${item.pais}</div>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-gray-800">${item.total.toLocaleString()}</div>
                    <div class="text-xs text-gray-500">${percentage}%</div>
                </div>
            </div>
            <div class="progress-bar mt-2">
                <div class="progress-fill" style="width: ${progressWidth}%;"></div>
            </div>
        `;
        
        // ✅ NAVEGACIÓN INTERACTIVA FUNCIONAL PARA RANKINGS
        itemElement.addEventListener('click', () => {
            if (type === 'municipio') {
                centrarEnLugar(item.nombre, 'municipio');
            } else if (type === 'departamento') {
                // Para departamentos, centramos en el primer municipio del departamento
                const municipioDept = Object.keys(currentData.municipios).find(mun => 
                    currentData.municipios[mun].departamento === item.nombre
                );
                if (municipioDept) {
                    centrarEnLugar(municipioDept, 'municipio', 8); // Zoom más amplio para departamento
                }
            }
            
            // Efecto visual de click
            itemElement.classList.add('active');
            setTimeout(() => itemElement.classList.remove('active'), 1200);
        });
        
        container.appendChild(itemElement);
    });
}

// Función para actualizar el mapa con marcadores TODOS LOS MUNICIPIOS
function updateMap(data) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    if (!map) {
        console.error('Mapa no inicializado');
        return;
    }
    
    // Limpiar marcadores existentes
    markers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    markers = [];
    
    // AGREGAR MARCADORES PARA TODOS LOS MUNICIPIOS DE COLOMBIA CON DATOS
    Object.entries(data.municipios).forEach(([municipio, info]) => {
        const coords = getCoordenadasPorMunicipio(municipio);
        if (!coords) {
            console.warn(`⚠️ Coordenadas no encontradas para: ${municipio}`);
            return;
        }
        
        const total = info.total;
        const maxTotal = Math.max(...Object.values(data.municipios).map(m => m.total));
        const radio = Math.max(4, Math.min(30, (total / maxTotal) * 25));
        
        // Colores mejorados basados en cantidad
        let color;
        if (total > 100) { color = '#dc2626'; }
        else if (total > 50) { color = '#ef4444'; }
        else if (total > 20) { color = '#f97316'; }
        else if (total > 10) { color = '#f59e0b'; }
        else if (total > 5) { color = '#eab308'; }
        else { color = '#84cc16'; }
        
        const marker = L.circleMarker(coords, {
            radius: radio,
            fillColor: color,
            color: '#ffffff',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        const percentage = (data.registrosTotales > 0) ?
            ((total / data.registrosTotales) * 100).toFixed(2) : 0;
        
        // Tooltip mejorado con más información
        marker.bindTooltip(`
            <div class="bg-white p-4 rounded-lg shadow-lg border-0 max-w-xs">
                <div class="font-bold text-lg text-gray-800 mb-2">${municipio}</div>
                <div class="space-y-1">
                    <div class="flex justify-between gap-4">
                        <span class="text-gray-600">Departamento:</span>
                        <span class="font-semibold text-red-600">${info.departamento}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Registros:</span>
                        <span class="font-semibold text-red-600">${total.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Porcentaje:</span>
                        <span class="font-semibold text-orange-600">${percentage}%</span>
                    </div>
                    <hr class="my-2 border-gray-200">
                    <div class="text-xs text-gray-600 space-y-1">
                        <div>📚 Pregrado: <strong>${info.niveles.Pregrado}</strong></div>
                        <div>🎓 Posgrado: <strong>${info.niveles.Posgrado}</strong></div>
                    </div>
                </div>
            </div>
        `, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip',
            sticky: true
        });
        
        // NAVEGACIÓN INTERACTIVA MEJORADA AL HACER CLICK EN MARCADOR
        marker.on('click', () => {
            centrarEnLugar(municipio, 'municipio', 13);
        });
        
        marker.addTo(map);
        markers.push(marker);
    });
    
    // Agregar marcadores para países internacionales
    data.topPaises.forEach(pais => {
        if (pais.nombre !== 'Colombia') {
            const coords = coordenadasPaises[pais.nombre];
            if (coords) {
                const maxTotal = Math.max(...data.topPaises.map(p => p.total));
                const radio = Math.max(15, (pais.total / maxTotal) * 40);
                
                const marker = L.circleMarker(coords, {
                    radius: radio,
                    fillColor: pais.nombre === 'Venezuela' ? '#f59e0b' : '#8b5cf6',
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                
                const percentage = (data.registrosTotales > 0) ?
                    ((pais.total / data.registrosTotales) * 100).toFixed(2) : 0;
                
                marker.bindTooltip(`
                    <div class="bg-white p-4 rounded-lg shadow-lg border-0">
                        <div class="font-bold text-lg text-gray-800 mb-2">${pais.nombre}</div>
                        <div class="space-y-1">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Registros:</span>
                                <span class="font-semibold text-blue-600">${pais.total.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Porcentaje:</span>
                                <span class="font-semibold text-purple-600">${percentage}%</span>
                            </div>
                        </div>
                    </div>
                `, {
                    permanent: false,
                    direction: 'top',
                    className: 'custom-tooltip',
                    sticky: true
                });
                
                marker.on('click', () => {
                    centrarEnLugar(pais.nombre, 'pais');
                });
                
                marker.addTo(map);
                markers.push(marker);
            }
        }
    });
    
    console.log(`✅ Mapa actualizado con ${markers.length} marcadores`);
}

// Función para navegación a países específicos
function navegarAPais(nombrePais) {
    centrarEnLugar(nombrePais, 'pais');
}

// Función para alternar pantalla completa
function toggleFullscreen() {
    const mapContainer = document.getElementById('map-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!mapContainer || !fullscreenBtn) return;
    
    isFullscreen = !isFullscreen;
    
    document.body.classList.toggle('map-fullscreen-active', isFullscreen);
    mapContainer.classList.toggle('map-container-fullscreen', isFullscreen);
    
    if (isFullscreen) {
        fullscreenBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg> Salir`;
        showNotification('Modo pantalla completa activado', 'info');
    } else {
        fullscreenBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg> Pantalla completa`;
        showNotification('Modo normal restaurado', 'info');
    }
    
    // Redimensionar mapa después del cambio
    setTimeout(() => {
        if (map) {
            window.requestAnimationFrame(() => {
                map.invalidateSize(true);
                map.getContainer().style.height = isFullscreen ? '100vh' : '600px';
                map.invalidateSize(true);
            });
        }
    }, 350);
}

// Función para inicializar el mapa base
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elemento de mapa no encontrado');
        return;
    }

    try {
        map = L.map('map').setView([4.5709, -74.2973], 6);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
        
        console.log('✅ Mapa inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar el mapa:', error);
        showNotification('Error al inicializar el mapa', 'error');
    }
}

// ✨ FUNCIÓN DE NAVEGACIÓN AUTOMÁTICA POR FILTROS OPTIMIZADA
function autoNavegacionPorFiltros(filtroPais, filtroNivel, filtroDepartamento, filtroRango) {
    // Solo navegar automáticamente si hay filtros específicos activos
    const hayFiltrosEspecificos = filtroPais !== 'Todos' || filtroDepartamento !== 'Todos' || filtroRango !== 'Todos';
    
    if (!hayFiltrosEspecificos) return;
    
    try {
        // 1. PRIORIDAD: Filtro por país específico
        if (filtroPais !== 'Todos' && coordenadasPaises[filtroPais]) {
            setTimeout(() => {
                centrarEnLugar(filtroPais, 'pais');
                showNotification(`🌍 Enfocando ${filtroPais}`, 'info');
            }, 400);
            return;
        }
        
        // 2. PRIORIDAD: Filtro por departamento específico  
        if (filtroDepartamento !== 'Todos') {
            // Buscar primer municipio del departamento filtrado con más registros
            const municipiosDelDept = Object.entries(currentData.municipios)
                .filter(([mun, info]) => info.departamento === filtroDepartamento)
                .sort(([,a], [,b]) => b.total - a.total);
                
            if (municipiosDelDept.length > 0) {
                const municipioPrincipal = municipiosDelDept[0][0];
                setTimeout(() => {
                    centrarEnLugar(municipioPrincipal, 'municipio', 8);
                    showNotification(`📍 Enfocando ${filtroDepartamento}`, 'info');
                }, 400);
                return;
            }
        }
        
        // 3. FILTRO POR RANGO: Ajustar zoom según el rango
        if (filtroRango !== 'Todos') {
            const municipiosFiltrados = Object.entries(currentData.municipios)
                .sort(([,a], [,b]) => b.total - a.total);
                
            if (municipiosFiltrados.length > 0) {
                const municipioPrincipal = municipiosFiltrados[0][0];
                
                // Ajustar zoom según el rango seleccionado
                let zoomLevel = 7;
                let mensaje = '';
                
                switch (filtroRango) {
                    case '1-10':
                        zoomLevel = 9;
                        mensaje = '🔍 Enfocando municipios con pocos registros';
                        break;
                    case '11-50':
                        zoomLevel = 8;
                        mensaje = '📊 Enfocando municipios medianos';
                        break;
                    case '51-100':
                        zoomLevel = 7;
                        mensaje = '📈 Enfocando municipios grandes';
                        break;
                    case '100+':
                        zoomLevel = 10;
                        mensaje = '🏆 Enfocando municipios principales';
                        break;
                }
                
                setTimeout(() => {
                    centrarEnLugar(municipioPrincipal, 'municipio', zoomLevel);
                    showNotification(mensaje, 'info');
                }, 400);
                return;
            }
        }
        
        // 4. FALLBACK: Centrar en área con mayor concentración de datos filtrados
        if (Object.keys(currentData.municipios).length > 0) {
            const topMunicipio = Object.entries(currentData.municipios)
                .sort(([,a], [,b]) => b.total - a.total)[0];
                
            if (topMunicipio) {
                setTimeout(() => {
                    centrarEnLugar(topMunicipio[0], 'municipio', 9);
                    showNotification(`🎯 Enfocando área principal`, 'info');
                }, 400);
            }
        }
        
    } catch (error) {
        console.warn('Error en navegación automática:', error);
    }
}

// ✨ FUNCIÓN PARA EFECTOS VISUALES EN FILTROS
function aplicarEfectosVisualesFiltros() {
    const filtros = ['filtroPais', 'filtroNivel', 'filtroDepartamento', 'filtroRango'];
    
    filtros.forEach(filtroId => {
        const elemento = document.getElementById(filtroId);
        if (elemento) {
            // Remover clases previas
            elemento.classList.remove('filter-active', 'filter-loading');
            
            // Agregar clase activa si no es "Todos"
            if (elemento.value !== 'Todos') {
                elemento.classList.add('filter-active');
                
                // Efecto temporal de loading
                elemento.classList.add('filter-loading');
                setTimeout(() => {
                    elemento.classList.remove('filter-loading');
                }, 800);
            }
        }
    });
    
    // Aplicar highlight a los resúmenes estadísticos
    const statsElements = [
        'totalRegistros', 'totalPregrado', 'totalPosgrado', 
        'totalMunicipios', 'totalDepartamentos', 'totalPaises'
    ];
    
    statsElements.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.parentElement?.classList.add('highlight-filter');
            setTimeout(() => {
                elemento.parentElement?.classList.remove('highlight-filter');
            }, 1500);
        }
    });
}
// Función principal para actualizar visualización con filtros MEJORADA
function actualizarVisualizacion() {
    try {
        const filtroPais = document.getElementById('filtroPais')?.value || 'Todos';
        const filtroNivel = document.getElementById('filtroNivel')?.value || 'Todos';
        const filtroDepartamento = document.getElementById('filtroDepartamento')?.value || 'Todos';
        const filtroRango = document.getElementById('filtroRango')?.value || 'Todos';
        
        // ✨ APLICAR EFECTOS VISUALES EN FILTROS
        aplicarEfectosVisualesFiltros();
        
        currentData = parseData(window.datosColombiaTexto, filtroPais, filtroNivel, filtroDepartamento, filtroRango);
        
        if (currentData.registrosTotales === 0) {
            showNotification('Sin datos para mostrar con los filtros aplicados', 'warning');
        } else {
            // ✨ NAVEGACIÓN AUTOMÁTICA CUANDO HAY FILTROS ESPECÍFICOS
            autoNavegacionPorFiltros(filtroPais, filtroNivel, filtroDepartamento, filtroRango);
        }
        
        updateUI(currentData);
        updateFiltrosActivos();
        updateResultadosFiltros();
        
        // Actualizar gráficos si están visibles
        const dashboardOpen = document.getElementById('overlay-dashboard')?.classList.contains('show');
        const statsOpen = document.getElementById('overlay-stats')?.classList.contains('show');
        
        if (dashboardOpen && typeof updateDashboardCharts === 'function') {
            updateDashboardCharts();
        }
        
        if (statsOpen && typeof updateStatsCharts === 'function') {
            updateStatsCharts();
        }
        
        // Notificación de filtros aplicados
        const activeFilters = getActiveFilters();
        let filterMessage = 'Visualización actualizada';
        if (activeFilters.length > 0) {
            filterMessage += ` - Filtros: ${activeFilters.join(', ')}`;
        }
        
        // Solo mostrar notificación si no se activó la navegación automática
        const hayFiltrosEspecificos = filtroPais !== 'Todos' || filtroDepartamento !== 'Todos' || filtroRango !== 'Todos';
        if (!hayFiltrosEspecificos) {
            showNotification(filterMessage, 'success');
        }
        
    } catch (error) {
        console.error('❌ Error al actualizar visualización:', error);
        showNotification('Error al actualizar visualización', 'error');
    }
}

// Función para obtener filtros activos
function getActiveFilters() {
    const filters = [];
    const filtroPais = document.getElementById('filtroPais')?.value;
    const filtroNivel = document.getElementById('filtroNivel')?.value;
    const filtroDepartamento = document.getElementById('filtroDepartamento')?.value;
    const filtroRango = document.getElementById('filtroRango')?.value;
    
    if (filtroPais && filtroPais !== 'Todos') filters.push(`País: ${filtroPais}`);
    if (filtroNivel && filtroNivel !== 'Todos') filters.push(`Nivel: ${filtroNivel}`);
    if (filtroDepartamento && filtroDepartamento !== 'Todos') filters.push(`Departamento: ${filtroDepartamento}`);
    if (filtroRango && filtroRango !== 'Todos') filters.push(`Rango: ${filtroRango}`);
    
    return filters;
}

// Función para actualizar contador de filtros activos
function updateFiltrosActivos() {
    const activeFilters = getActiveFilters();
    const contador = document.getElementById('filtrosActivos');
    if (!contador) return;
    
    if (activeFilters.length === 0) {
        contador.textContent = 'Sin filtros activos';
        contador.className = 'text-sm text-gray-500';
    } else {
        contador.textContent = `${activeFilters.length} filtro${activeFilters.length > 1 ? 's' : ''} activo${activeFilters.length > 1 ? 's' : ''}`;
        contador.className = 'text-sm text-red-600 font-semibold';
    }
}

// Función para actualizar indicador de resultados
function updateResultadosFiltros() {
    const resultadosDiv = document.getElementById('resultadosFiltros');
    const textoResultados = document.getElementById('textoResultados');
    if (!resultadosDiv || !textoResultados) return;
    
    const activeFilters = getActiveFilters();
    
    if (activeFilters.length > 0) {
        const municipios = Object.keys(currentData.municipios).length;
        const departamentos = Object.keys(currentData.departamentos).length;
        const paises = currentData.paisesUnicos.length;
        
        textoResultados.textContent = `✓ Resultados filtrados: ${currentData.registrosTotales.toLocaleString()} registros en ${municipios} municipios, ${departamentos} departamentos y ${paises} países`;
        resultadosDiv.classList.remove('hidden');
    } else {
        resultadosDiv.classList.add('hidden');
    }
}

// Función para limpiar todos los filtros MEJORADA
function limpiarFiltros() {
    const elementos = ['filtroPais', 'filtroNivel', 'filtroDepartamento', 'filtroRango'];
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.value = 'Todos';
            // ✨ REMOVER EFECTOS VISUALES AL LIMPIAR
            elemento.classList.remove('filter-active', 'filter-loading');
        }
    });
    
    actualizarVisualizacion();
    
    // ✨ REGRESAR A VISTA INICIAL DE COLOMBIA AL LIMPIAR FILTROS
    setTimeout(() => {
        if (map) {
            map.flyTo([4.5709, -74.2973], 6, { 
                animate: true, 
                duration: 1.0,
                easeLinearity: 0.1
            });
            showNotification('🔄 Vista inicial restaurada', 'info');
        }
    }, 300);
}

// Función para llenar opciones de departamentos
function llenarFiltrosDepartamentos() {
    const filtroDepartamentoSelect = document.getElementById('filtroDepartamento');
    if (!filtroDepartamentoSelect || !fullDataObject.departamentosUnicos) return;
    
    // Limpiar opciones excepto "Todos"
    while (filtroDepartamentoSelect.children.length > 1) {
        filtroDepartamentoSelect.removeChild(filtroDepartamentoSelect.lastChild);
    }
    
    // Agregar departamentos ordenados
    const departamentos = Array.from(fullDataObject.departamentosUnicos).sort();
    departamentos.forEach(departamento => {
        const option = document.createElement('option');
        option.value = departamento;
        option.textContent = departamento;
        filtroDepartamentoSelect.appendChild(option);
    });
}

// Función de verificación de datos
function verificarDatos() {
    console.log('🔍 Verificando disponibilidad de datos...');
    
    if (typeof window.datosColombiaTexto === 'undefined') {
        console.error('❌ window.datosColombiaTexto no está definido');
        return false;
    }
    
    if (!window.datosColombiaTexto || window.datosColombiaTexto.trim().length === 0) {
        console.error('❌ Los datos están vacíos');
        return false;
    }
    
    const lineas = window.datosColombiaTexto.trim().split('\n');
    if (lineas.length < 2) {
        console.error('❌ Datos insuficientes - menos de 2 líneas');
        return false;
    }
    
    // Verificar formato de headers
    const headers = lineas[0].split('\t');
    if (headers.length < 5) {
        console.error('❌ Formato de headers incorrecto. Headers encontrados:', headers);
        return false;
    }
    
    // Verificar algunas líneas de datos
    let lineasValidas = 0;
    for (let i = 1; i < Math.min(10, lineas.length); i++) {
        const row = lineas[i].split('\t');
        if (row.length >= 5) {
            lineasValidas++;
        }
    }
    
    if (lineasValidas === 0) {
        console.error('❌ No se encontraron líneas de datos válidas');
        return false;
    }
    
    console.log(`✅ Datos verificados: ${lineas.length} líneas encontradas, ${lineasValidas} líneas válidas verificadas`);
    return true;
}

// Función principal de inicialización
function initApp() {
    console.log('🚀 Iniciando aplicación...');
    
    // Verificar disponibilidad de datos
    if (!verificarDatos()) {
        showNotification('Error: No se encontraron los datos', 'error');
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = '<p class="text-red-600 font-bold">❌ Error al cargar datos.js</p>';
        }
        return;
    }
    
    // Inicializar mapa
    initMap();
    
    // Procesar datos iniciales
    try {
        fullDataObject = parseData(window.datosColombiaTexto);
        console.log('✅ Datos procesados correctamente:', fullDataObject.registrosTotales, 'registros');
        
        // Llenar filtros
        const filtroPaisSelect = document.getElementById('filtroPais');
        if (filtroPaisSelect && fullDataObject.paisesUnicos) {
            fullDataObject.paisesUnicos.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais;
                option.textContent = pais;
                filtroPaisSelect.appendChild(option);
            });
        }
        
        llenarFiltrosDepartamentos();
        
        // Cargar visualización inicial con retraso
        setTimeout(() => {
            actualizarVisualizacion();
            showNotification('✅ Aplicación cargada exitosamente', 'success');
        }, 500);
        
    } catch (error) {
        console.error('❌ Error al procesar datos iniciales:', error);
        showNotification('Error al procesar datos', 'error');
        return;
    }
    
    // Configurar event listeners
    setupEventListeners();
}

// Función para configurar event listeners MEJORADA
function setupEventListeners() {
    // Botón de pantalla completa
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // ✨ FILTROS CON NAVEGACIÓN AUTOMÁTICA INMEDIATA
    const filtros = ['filtroPais', 'filtroNivel', 'filtroDepartamento', 'filtroRango'];
    filtros.forEach(filtroId => {
        const elemento = document.getElementById(filtroId);
        if (elemento) {
            // Remover listeners previos si existen
            elemento.removeEventListener('change', actualizarVisualizacion);
            
            // Agregar listener optimizado con navegación automática
            elemento.addEventListener('change', (event) => {
                const nombreFiltro = event.target.options[event.target.selectedIndex].text;
                
                // Mostrar feedback inmediato
                if (event.target.value !== 'Todos') {
                    showNotification(`🔍 Filtrando por ${nombreFiltro}...`, 'info');
                }
                
                // Actualizar visualización con navegación automática
                setTimeout(() => {
                    actualizarVisualizacion();
                }, 100);
            });
        }
    });
    
    // Botón limpiar filtros
    const limpiarBtn = document.getElementById('limpiarFiltros');
    if (limpiarBtn) {
        limpiarBtn.removeEventListener('click', limpiarFiltros);
        limpiarBtn.addEventListener('click', limpiarFiltros);
    }
    
    console.log('✅ Event listeners configurados con navegación automática');
}

// Función para destruir todos los gráficos
function destroyAllCharts() {
    if (typeof charts !== 'undefined') {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        charts = {};
    }
}

// Función para redimensionar gráficos
function resizeCharts() {
    if (typeof charts !== 'undefined') {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM cargado, verificando disponibilidad de datos...');
    
    // Esperar a que los datos estén completamente cargados
    if (window.datosColombiaListo) {
        initApp();
    } else {
        // Verificar periódicamente si los datos están listos
        let intentos = 0;
        const maxIntentos = 50;
        
        const checkDataInterval = setInterval(() => {
            intentos++;
            
            if (window.datosColombiaListo && window.datosColombiaTexto) {
                clearInterval(checkDataInterval);
                initApp();
            } else if (intentos >= maxIntentos) {
                clearInterval(checkDataInterval);
                console.error('❌ Timeout esperando datos');
                showNotification('Error: Timeout cargando datos', 'error');
            }
        }, 100);
    }
});

// Listener para redimensionamiento de ventana
window.addEventListener('resize', () => {
    setTimeout(resizeCharts, 250);
});