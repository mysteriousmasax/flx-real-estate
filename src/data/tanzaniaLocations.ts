export interface AdminWard {
  name: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  landmarks?: string[];
}

export interface AdminDistrict {
  name: string;
  wards: AdminWard[];
  defaultLat?: number;
  defaultLng?: number;
}

export interface AdminRegion {
  name: string;
  capitalCity: string;
  zone: 'Coastal' | 'Northern' | 'Lake' | 'Central' | 'Southern Highlands' | 'Southern' | 'Western' | 'Zanzibar';
  districts: AdminDistrict[];
  defaultLat: number;
  defaultLng: number;
  postalCodePrefix: string;
}

export interface TanzaniaStreet {
  id: string;
  name: string;
  ward: string;
  district: string;
  region: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  landmarks?: string[];
  type?: 'Drive' | 'Road' | 'Avenue' | 'Street' | 'Way' | 'Boulevard' | 'Lane' | 'Crescent';
}

// Master Standardized National Administrative Structure of Tanzania (31 Regions)
export const TANZANIA_ADMIN_REGIONS: AdminRegion[] = [
  // --- 1. DAR ES SALAAM ---
  {
    name: 'Dar es Salaam',
    capitalCity: 'Dar es Salaam',
    zone: 'Coastal',
    defaultLat: -6.7720,
    defaultLng: 39.2400,
    postalCodePrefix: '11',
    districts: [
      {
        name: 'Kinondoni',
        defaultLat: -6.7580,
        defaultLng: 39.2500,
        wards: [
          { name: 'Masaki', postalCode: '14111', lat: -6.7495, lng: 39.2782, landmarks: ['Slipway Waterfront', 'Coral Beach Hotel', 'Sea Cliff'] },
          { name: 'Oysterbay', postalCode: '14112', lat: -6.7725, lng: 39.2741, landmarks: ['Coco Beach Promenade', 'US Embassy', 'Kenyatta Drive'] },
          { name: 'Msasani', postalCode: '14110', lat: -6.7610, lng: 39.2612, landmarks: ['Msasani Peninsula', 'Peninsula Bay', 'Shoppers Plaza'] },
          { name: 'Mikocheni', postalCode: '14113', lat: -6.7650, lng: 39.2400, landmarks: ['Regent Estate', 'Rose Garden', 'Kawe Club'] },
          { name: 'Kawe', postalCode: '14114', lat: -6.7350, lng: 39.2250, landmarks: ['Kawe Beach', 'Africana', 'Silver Sands'] },
          { name: 'Mbezi Beach', postalCode: '14115', lat: -6.7120, lng: 39.2150, landmarks: ['Jogoo', 'Africana View', 'Mbezi Coast'] },
          { name: 'Kijitonyama', postalCode: '14116', lat: -6.7780, lng: 39.2450, landmarks: ['Sayansi', 'Ali Maua', 'Millennium Towers'] },
          { name: 'Mwenge', postalCode: '14117', lat: -6.7720, lng: 39.2180, landmarks: ['Mwenge Woodcarvers', 'Mlimani City link'] },
          { name: 'Hananasif', postalCode: '14118', lat: -6.7910, lng: 39.2620 },
          { name: 'Kinondoni', postalCode: '14119', lat: -6.7850, lng: 39.2550, landmarks: ['Leaders Club', 'Biafra Grounds'] },
          { name: 'Wazo', postalCode: '14120', lat: -6.6850, lng: 39.1850 },
          { name: 'Kunduchi', postalCode: '14121', lat: -6.6680, lng: 39.2180, landmarks: ['Wet n Wild', 'Kunduchi Beach Hotel'] },
          { name: 'Bunju', postalCode: '14122', lat: -6.6250, lng: 39.1450 },
          { name: 'Mabwepande', postalCode: '14123', lat: -6.6120, lng: 39.1120 },
        ],
      },
      {
        name: 'Ilala',
        defaultLat: -6.8180,
        defaultLng: 39.2800,
        wards: [
          { name: 'Kivukoni', postalCode: '11101', lat: -6.8180, lng: 39.2940, landmarks: ['State House', 'Fish Market', 'Hyatt Kilimanjaro', 'Ferry'] },
          { name: 'Upanga East', postalCode: '11102', lat: -6.8040, lng: 39.2820, landmarks: ['UNDP Complex', 'Gymkhana Golf Club', 'Muhimbili'] },
          { name: 'Upanga West', postalCode: '11103', lat: -6.8090, lng: 39.2710, landmarks: ['Olympio', 'International School of Tanganyika'] },
          { name: 'Kisutu', postalCode: '11104', lat: -6.8140, lng: 39.2850, landmarks: ['Jamhuri Street', 'Mosque Street', 'India Street'] },
          { name: 'Kariakoo', postalCode: '11105', lat: -6.8190, lng: 39.2750, landmarks: ['Kariakoo Main Market', 'Msimbazi Street', 'Swahili Street'] },
          { name: 'Gerezani', postalCode: '11106', lat: -6.8250, lng: 39.2850, landmarks: ['Railway Station', 'Bandari Port Gate'] },
          { name: 'Ilala', postalCode: '11107', lat: -6.8310, lng: 39.2650, landmarks: ['Amana Hospital', 'Uhuru Street'] },
          { name: 'Buguruni', postalCode: '11108', lat: -6.8390, lng: 39.2480 },
          { name: 'Tabata', postalCode: '11109', lat: -6.8350, lng: 39.2210, landmarks: ['Tabata Bima', 'Mawenzi', 'Segerea link'] },
          { name: 'Segerea', postalCode: '11110', lat: -6.8480, lng: 39.1950 },
          { name: 'Kinyerezi', postalCode: '11111', lat: -6.8520, lng: 39.1720, landmarks: ['Kinyerezi Gas Plant', 'Residential Estates'] },
          { name: 'Ukonga', postalCode: '11112', lat: -6.8720, lng: 39.2080, landmarks: ['Julius Nyerere International Airport JNIA'] },
        ],
      },
      {
        name: 'Ubungo',
        defaultLat: -6.7820,
        defaultLng: 39.2050,
        wards: [
          { name: 'Sinza', postalCode: '16101', lat: -6.7810, lng: 39.2230, landmarks: ['Shekilango Road', 'Sinza Mori', 'Afrikana Plaza'] },
          { name: 'Mlimani (Chuo Kikuu)', postalCode: '16102', lat: -6.7720, lng: 39.2050, landmarks: ['University of Dar es Salaam', 'Mlimani City Mall'] },
          { name: 'Ubungo', postalCode: '16103', lat: -6.7890, lng: 39.2080, landmarks: ['Ubungo Interchange', 'Kibo Complex'] },
          { name: 'Kimara', postalCode: '16104', lat: -6.7920, lng: 39.1680, landmarks: ['Kimara Stopover', 'Morogoro Road Corridor'] },
          { name: 'Manzese', postalCode: '16105', lat: -6.7980, lng: 39.2310 },
          { name: 'Mabibo', postalCode: '16106', lat: -6.8120, lng: 39.2220, landmarks: ['NIT National Institute of Transport'] },
          { name: 'Goba', postalCode: '16107', lat: -6.7210, lng: 39.1580, landmarks: ['Goba Centre', 'Executive Hills'] },
        ],
      },
      {
        name: 'Kigamboni',
        defaultLat: -6.8500,
        defaultLng: 39.3200,
        wards: [
          { name: 'Somangila', postalCode: '17107', lat: -6.8520, lng: 39.3350, landmarks: ['South Beach Resort', 'Sunrise Beach', 'Dege Eco-Town'] },
          { name: 'Kigamboni Ferry', postalCode: '17101', lat: -6.8280, lng: 39.3010, landmarks: ['Nyerere Bridge Link', 'Kigamboni Navy Base'] },
          { name: 'Vijibweni', postalCode: '17102', lat: -6.8410, lng: 39.3090 },
          { name: 'Kimbiji', postalCode: '17103', lat: -6.9850, lng: 39.4850, landmarks: ['Ras Dege', 'Kimbiji Pristine Beachfront'] },
          { name: 'Tungi', postalCode: '17104', lat: -6.8620, lng: 39.3180 },
          { name: 'Kibada', postalCode: '17105', lat: -6.8820, lng: 39.3100 },
        ],
      },
      {
        name: 'Temeke',
        defaultLat: -6.8650,
        defaultLng: 39.2600,
        wards: [
          { name: 'Kurasini', postalCode: '15101', lat: -6.8450, lng: 39.2780, landmarks: ['Dar Port Container Terminal', 'Police College'] },
          { name: 'Chang\'ombe', postalCode: '15102', lat: -6.8520, lng: 39.2650, landmarks: ['National Stadium Mkapa', 'DUCE'] },
          { name: 'Temeke', postalCode: '15103', lat: -6.8620, lng: 39.2550 },
          { name: 'Mbagala', postalCode: '15104', lat: -6.9050, lng: 39.2600, landmarks: ['Mbagala Rangi Tatu BRT'] },
          { name: 'Toangoma', postalCode: '15105', lat: -6.9250, lng: 39.3100 },
        ],
      },
    ],
  },

  // --- 2. ZANZIBAR (MJINI MAGHARIBI) ---
  {
    name: 'Zanzibar (Mjini Magharibi)',
    capitalCity: 'Zanzibar',
    zone: 'Zanzibar',
    defaultLat: -6.1640,
    defaultLng: 39.1950,
    postalCodePrefix: '71',
    districts: [
      {
        name: 'Stone Town (Mjini)',
        defaultLat: -6.1620,
        defaultLng: 39.1890,
        wards: [
          { name: 'Shangani', postalCode: '71101', lat: -6.1645, lng: 39.1870, landmarks: ['Park Hyatt Zanzibar', 'Serena Stone Town', 'Old Fort'] },
          { name: 'Forodhani', postalCode: '71101', lat: -6.1610, lng: 39.1895, landmarks: ['Forodhani Seafront Night Market', 'House of Wonders'] },
          { name: 'Malindi', postalCode: '71102', lat: -6.1580, lng: 39.1910, landmarks: ['Zanzibar Port Ferry Jetty', 'Malindi Minaret'] },
          { name: 'Hurumzi', postalCode: '71101', lat: -6.1628, lng: 39.1912, landmarks: ['Emerson on Hurumzi', 'Gizenga Woodcarvers'] },
          { name: 'Mkunazini', postalCode: '71103', lat: -6.1635, lng: 39.1930, landmarks: ['Anglican Cathedral', 'Former Slave Market Site'] },
          { name: 'Vuga', postalCode: '71104', lat: -6.1670, lng: 39.1910, landmarks: ['Peace Memorial Museum', 'High Court of Zanzibar'] },
        ],
      },
      {
        name: 'Magharibi (West)',
        defaultLat: -6.2200,
        defaultLng: 39.2200,
        wards: [
          { name: 'Fumba', postalCode: '71108', lat: -6.3150, lng: 39.2250, landmarks: ['Fumba Town Eco-City', 'Menai Bay Marine Reserve'] },
          { name: 'Chukwani', postalCode: '71105', lat: -6.2420, lng: 39.2120, landmarks: ['Chukwani Executive Coast', 'Abeid Amani Karume Airport Link'] },
          { name: 'Mbweni', postalCode: '71106', lat: -6.2150, lng: 39.2080, landmarks: ['Mbweni Ruins Hotel', 'Botanical Enclave'] },
          { name: 'Kiembesamaki', postalCode: '71107', lat: -6.2050, lng: 39.2250 },
        ],
      },
    ],
  },

  // --- 3. ZANZIBAR NORTH (KASKAZINI UNGUJA) ---
  {
    name: 'Zanzibar North (Kaskazini Unguja)',
    capitalCity: 'Mkokotoni',
    zone: 'Zanzibar',
    defaultLat: -5.7400,
    defaultLng: 39.2950,
    postalCodePrefix: '71',
    districts: [
      {
        name: 'Kaskazini A',
        defaultLat: -5.7280,
        defaultLng: 39.2950,
        wards: [
          { name: 'Nungwi', postalCode: '71205', lat: -5.7258, lng: 39.2982, landmarks: ['Zuri Zanzibar Resort', 'Nungwi Lighthouse', 'Dhow Harbour'] },
          { name: 'Kendwa', postalCode: '71205', lat: -5.7530, lng: 39.2910, landmarks: ['Kendwa Rocks', 'Gold Zanzibar Beach House', 'Sunset Strip'] },
          { name: 'Matemwe', postalCode: '71208', lat: -5.8650, lng: 39.3520, landmarks: ['Mnemba Atoll Vista', 'Matemwe Retreat'] },
          { name: 'Pwani Mchangani', postalCode: '71209', lat: -5.9150, lng: 39.3550, landmarks: ['Ocean Paradise Resort', 'Neptune Pwani'] },
          { name: 'Mkokotoni', postalCode: '71201', lat: -5.8750, lng: 39.2550, landmarks: ['Mkokotoni Fish Quay', 'Tumbatu Island Gate'] },
        ],
      },
    ],
  },

  // --- 4. ZANZIBAR SOUTH (KUSINI UNGUJA) ---
  {
    name: 'Zanzibar South (Kusini Unguja)',
    capitalCity: 'Koani',
    zone: 'Zanzibar',
    defaultLat: -6.2600,
    defaultLng: 39.5200,
    postalCodePrefix: '71',
    districts: [
      {
        name: 'Kusini',
        defaultLat: -6.2800,
        defaultLng: 39.5200,
        wards: [
          { name: 'Paje', postalCode: '71302', lat: -6.2650, lng: 39.5340, landmarks: ['Paje Kitesurf Lagoon', 'The Rock Restaurant link', 'White Sands'] },
          { name: 'Jambiani', postalCode: '71303', lat: -6.3150, lng: 39.5450, landmarks: ['Jambiani Coral Coast', 'Kuza Cave Sanctuary'] },
          { name: 'Bwejuu', postalCode: '71301', lat: -6.2250, lng: 39.5280, landmarks: ['Baraza Resort', 'Breezes Beach Club'] },
          { name: 'Kizimkazi', postalCode: '71306', lat: -6.4450, lng: 39.4650, landmarks: ['Dolphin Safari Bay', 'Kizimkazi Mosque (1107 AD)'] },
          { name: 'Michamvi', postalCode: '71305', lat: -6.1480, lng: 39.4980, landmarks: ['Michamvi Sunset Bay', 'The Rock Peninsula'] },
        ],
      },
    ],
  },

  // --- 5. ARUSHA ---
  {
    name: 'Arusha',
    capitalCity: 'Arusha',
    zone: 'Northern',
    defaultLat: -3.3730,
    defaultLng: 36.6950,
    postalCodePrefix: '23',
    districts: [
      {
        name: 'Arusha City',
        defaultLat: -3.3710,
        defaultLng: 36.6920,
        wards: [
          { name: 'Sekei', postalCode: '23101', lat: -3.3685, lng: 36.6950, landmarks: ['Kibo Palace Hotel', 'Arusha Clock Tower', 'Gymkhana Club'] },
          { name: 'Themi', postalCode: '23102', lat: -3.3850, lng: 36.7020, landmarks: ['Themi Valley Drive', 'Impala Roundabout', 'Kanisa Road'] },
          { name: 'Njiro', postalCode: '23105', lat: -3.4120, lng: 36.7110, landmarks: ['Njiro Complex Cinema', 'ESAMI University', 'Coffee Estates'] },
          { name: 'Kaloleni', postalCode: '23103', lat: -3.3720, lng: 36.6850, landmarks: ['Old German Boma', 'Four Points by Sheraton'] },
          { name: 'Oloirien', postalCode: '23106', lat: -3.3980, lng: 36.7210, landmarks: ['Njiro Hill Ridge', 'Nanenane Grounds'] },
          { name: 'Kimandolu', postalCode: '23107', lat: -3.3610, lng: 36.7180 },
          { name: 'Sakina', postalCode: '23108', lat: -3.3510, lng: 36.6710, landmarks: ['Nairobi Highway Gate', 'Engira Hill'] },
          { name: 'Baraa', postalCode: '23109', lat: -3.3620, lng: 36.7450 },
        ],
      },
      {
        name: 'Arumeru / Meru',
        defaultLat: -3.3750,
        defaultLng: 36.8520,
        wards: [
          { name: 'USA River', postalCode: '23201', lat: -3.3750, lng: 36.8520, landmarks: ['Mount Meru Sanctuary', 'Lake Duluti Crater Lodge'] },
          { name: 'Maji ya Chai', postalCode: '23202', lat: -3.3820, lng: 36.9150, landmarks: ['Dolly Estate Polo & Airstrip'] },
          { name: 'Poli', postalCode: '23203', lat: -3.3250, lng: 36.8120 },
          { name: 'Ngurdoto', postalCode: '23204', lat: -3.3280, lng: 36.8720, landmarks: ['Arusha National Park Gate'] },
        ],
      },
      {
        name: 'Karatu',
        defaultLat: -3.3380,
        defaultLng: 35.6720,
        wards: [
          { name: 'Karatu Mjini', postalCode: '23401', lat: -3.3380, lng: 35.6720, landmarks: ['Ngorongoro Conservation Gate Corridor', 'Gibb\'s Farm'] },
          { name: 'Rhotia', postalCode: '23402', lat: -3.3150, lng: 35.7250, landmarks: ['Rhotia Valley View'] },
        ],
      },
    ],
  },

  // --- 6. KILIMANJARO ---
  {
    name: 'Kilimanjaro',
    capitalCity: 'Moshi',
    zone: 'Northern',
    defaultLat: -3.3400,
    defaultLng: 37.3300,
    postalCodePrefix: '25',
    districts: [
      {
        name: 'Moshi Urban',
        defaultLat: -3.3420,
        defaultLng: 37.3350,
        wards: [
          { name: 'Shanty Town', postalCode: '25102', lat: -3.3420, lng: 37.3250, landmarks: ['Kilimanjaro View Club', 'Moshi Golf Course', 'KCMC Referral'] },
          { name: 'Kibo Road (Central)', postalCode: '25101', lat: -3.3510, lng: 37.3390, landmarks: ['Moshi Clock Tower', 'Coffee Union Building'] },
          { name: 'Rau', postalCode: '25103', lat: -3.3350, lng: 37.3510, landmarks: ['Rau Forest Reserve Link'] },
          { name: 'Pasua', postalCode: '25104', lat: -3.3650, lng: 37.3450 },
          { name: 'Mawenzi', postalCode: '25105', lat: -3.3480, lng: 37.3350 },
          { name: 'Soweto', postalCode: '25106', lat: -3.3450, lng: 37.3180 },
        ],
      },
      {
        name: 'Hai',
        defaultLat: -3.2350,
        defaultLng: 37.2150,
        wards: [
          { name: 'Machame Kaskazini', postalCode: '25204', lat: -3.2350, lng: 37.2150, landmarks: ['Kilimanjaro Machame Climbing Gate', 'Chagga Coffee Highlands'] },
          { name: 'Machame Kusini', postalCode: '25205', lat: -3.2650, lng: 37.2250 },
          { name: 'Bomang\'ombe', postalCode: '25201', lat: -3.3620, lng: 37.1350, landmarks: ['Kilimanjaro International Airport KIA link'] },
        ],
      },
      {
        name: 'Rombo',
        defaultLat: -3.1250,
        defaultLng: 37.5550,
        wards: [
          { name: 'Mkuu', postalCode: '25301', lat: -3.1550, lng: 37.5850 },
          { name: 'Tarakea', postalCode: '25302', lat: -3.0250, lng: 37.5950, landmarks: ['Kenya Border Crossing', 'Mount Kilimanjaro North Slopes'] },
        ],
      },
    ],
  },

  // --- 7. DODOMA (NATIONAL CAPITAL) ---
  {
    name: 'Dodoma',
    capitalCity: 'Dodoma',
    zone: 'Central',
    defaultLat: -6.1730,
    defaultLng: 35.7410,
    postalCodePrefix: '41',
    districts: [
      {
        name: 'Dodoma City / Urban',
        defaultLat: -6.1730,
        defaultLng: 35.7410,
        wards: [
          { name: 'Mtumba', postalCode: '41107', lat: -6.0420, lng: 35.8920, landmarks: ['Mtumba Government City', 'Ministries Complex', 'State House Chamwino Wing'] },
          { name: 'Kikuyu', postalCode: '41101', lat: -6.1820, lng: 35.7480, landmarks: ['Dodoma Cathedral', 'St. John\'s University'] },
          { name: 'Kisasa', postalCode: '41104', lat: -6.1550, lng: 35.7720, landmarks: ['Kisasa Executive Villas', 'Medeli Diplomatic Enclave'] },
          { name: 'Area C & D', postalCode: '41102', lat: -6.1680, lng: 35.7520, landmarks: ['Bunge Parliament Link', 'Nyerere Square Corridor'] },
          { name: 'Makole', postalCode: '41103', lat: -6.1780, lng: 35.7420 },
          { name: 'Miyuji', postalCode: '41105', lat: -6.1420, lng: 35.7350 },
          { name: 'Nzuguni', postalCode: '41106', lat: -6.1350, lng: 35.8150, landmarks: ['Nanenane National Stadium Site'] },
        ],
      },
      {
        name: 'Chamwino',
        defaultLat: -6.0120,
        defaultLng: 35.9150,
        wards: [
          { name: 'Chamwino Ikulu', postalCode: '41201', lat: -6.0120, lng: 35.9150, landmarks: ['State House Presidential Palace'] },
          { name: 'Buigiri', postalCode: '41202', lat: -6.0850, lng: 35.9850 },
        ],
      },
    ],
  },

  // --- 8. MWANZA (ROCK CITY / LAKE VICTORIA) ---
  {
    name: 'Mwanza',
    capitalCity: 'Mwanza',
    zone: 'Lake',
    defaultLat: -2.5160,
    defaultLng: 32.9000,
    postalCodePrefix: '33',
    districts: [
      {
        name: 'Nyamagana',
        defaultLat: -2.5180,
        defaultLng: 32.8980,
        wards: [
          { name: 'Capri Point', postalCode: '33101', lat: -2.5180, lng: 32.8980, landmarks: ['Capri Point Waterfront', 'Mwanza Yacht Club', 'Bismarck Rock'] },
          { name: 'Isamilo', postalCode: '33102', lat: -2.5100, lng: 32.9050, landmarks: ['Isamilo International School', 'Gold Crest Hotel corridor'] },
          { name: 'Kirumba', postalCode: '33103', lat: -2.5020, lng: 32.9010, landmarks: ['CCM Kirumba Stadium'] },
          { name: 'Bugando', postalCode: '33104', lat: -2.5250, lng: 32.9150, landmarks: ['Bugando Medical Centre Referral Hospital'] },
          { name: 'Nyegezi', postalCode: '33105', lat: -2.5750, lng: 32.9250, landmarks: ['SAUT St. Augustine University'] },
        ],
      },
      {
        name: 'Ilemela',
        defaultLat: -2.4820,
        defaultLng: 32.9150,
        wards: [
          { name: 'Bwiru', postalCode: '33201', lat: -2.4820, lng: 32.9150, landmarks: ['Bwiru Peninsula Lake Vista'] },
          { name: 'Pasiansi', postalCode: '33202', lat: -2.4950, lng: 32.9200 },
          { name: 'Buswelu', postalCode: '33203', lat: -2.4550, lng: 32.9650, landmarks: ['Mwanza Airport Link'] },
        ],
      },
    ],
  },

  // --- 9. MARA (SERENGETI WILDLIFE & LAKE VICTORIA) ---
  {
    name: 'Mara',
    capitalCity: 'Musoma',
    zone: 'Lake',
    defaultLat: -2.3325,
    defaultLng: 34.8210,
    postalCodePrefix: '31',
    districts: [
      {
        name: 'Serengeti',
        defaultLat: -2.3325,
        defaultLng: 34.8210,
        wards: [
          { name: 'Fort Ikoma', postalCode: '31301', lat: -2.3325, lng: 34.8210, landmarks: ['Singita Sasakwa Lodge Corridor', 'Grumeti River Reserve'] },
          { name: 'Seronera', postalCode: '31305', lat: -2.4410, lng: 34.8320, landmarks: ['Seronera Valley Wildlife Airstrip', 'Serengeti Migration Ridge'] },
          { name: 'Mugumu', postalCode: '31302', lat: -1.8450, lng: 34.7050, landmarks: ['Serengeti District Capital Centre'] },
        ],
      },
      {
        name: 'Musoma Urban',
        defaultLat: -1.5000,
        defaultLng: 33.8000,
        wards: [
          { name: 'Mukendo', postalCode: '31101', lat: -1.5000, lng: 33.8000, landmarks: ['Musoma Waterfront'] },
          { name: 'Kitaji', postalCode: '31102', lat: -1.4920, lng: 33.8080 },
        ],
      },
    ],
  },

  // --- 10. TANGA ---
  {
    name: 'Tanga',
    capitalCity: 'Tanga',
    zone: 'Coastal',
    defaultLat: -5.0680,
    defaultLng: 39.0980,
    postalCodePrefix: '21',
    districts: [
      {
        name: 'Tanga City',
        defaultLat: -5.0680,
        defaultLng: 39.0980,
        wards: [
          { name: 'Raskazone', postalCode: '21101', lat: -5.0680, lng: 39.1150, landmarks: ['Raskazone Ocean Front Peninsula', 'Tanga Yacht Club'] },
          { name: 'Central (Ngamiani)', postalCode: '21102', lat: -5.0750, lng: 39.0980, landmarks: ['Old Tanga Boma', 'Clock Tower'] },
          { name: 'Usagara', postalCode: '21103', lat: -5.0850, lng: 39.0920 },
        ],
      },
      {
        name: 'Pangani',
        defaultLat: -5.4320,
        defaultLng: 38.9750,
        wards: [
          { name: 'Pangani Mjini', postalCode: '21201', lat: -5.4320, lng: 38.9750, landmarks: ['Historic Pangani River Mouth', 'Swahili Coast'] },
          { name: 'Ushongo Beach', postalCode: '21202', lat: -5.5250, lng: 38.9850, landmarks: ['Ushongo Beach Resorts', 'Maziwe Island Marine Park'] },
        ],
      },
      {
        name: 'Lushoto',
        defaultLat: -4.7950,
        defaultLng: 38.2910,
        wards: [
          { name: 'Lushoto Mjini', postalCode: '21401', lat: -4.7950, lng: 38.2910, landmarks: ['Irente Viewpoint', 'Usambara Cloud Mountains'] },
        ],
      },
    ],
  },

  // --- 11. MOROGORO ---
  {
    name: 'Morogoro',
    capitalCity: 'Morogoro',
    zone: 'Coastal',
    defaultLat: -6.8270,
    defaultLng: 37.6680,
    postalCodePrefix: '67',
    districts: [
      {
        name: 'Morogoro Urban',
        defaultLat: -6.8270,
        defaultLng: 37.6680,
        wards: [
          { name: 'Boma', postalCode: '67101', lat: -6.8270, lng: 37.6680, landmarks: ['Uluguru Mountain View', 'Sua Sokoine University'] },
          { name: 'Forest Hill', postalCode: '67102', lat: -6.8150, lng: 37.6550 },
        ],
      },
    ],
  },

  // --- 12. MBEYA ---
  {
    name: 'Mbeya',
    capitalCity: 'Mbeya',
    zone: 'Southern Highlands',
    defaultLat: -8.9090,
    defaultLng: 33.4600,
    postalCodePrefix: '53',
    districts: [
      {
        name: 'Mbeya City',
        defaultLat: -8.9090,
        defaultLng: 33.4600,
        wards: [
          { name: 'Sisimba', postalCode: '53101', lat: -8.9090, lng: 33.4600, landmarks: ['Mbeya Peak Ridge'] },
          { name: 'Forest', postalCode: '53102', lat: -8.8950, lng: 33.4750 },
          { name: 'Iyela', postalCode: '53103', lat: -8.9250, lng: 33.4450 },
        ],
      },
      {
        name: 'Kyela',
        defaultLat: -9.5850,
        defaultLng: 33.8550,
        wards: [
          { name: 'Matema Beach', postalCode: '53205', lat: -9.5250, lng: 34.0250, landmarks: ['Lake Nyasa / Lake Malawi Beachfront'] },
        ],
      },
    ],
  },

  // --- 13. PWANI (COAST) ---
  {
    name: 'Pwani (Coast)',
    capitalCity: 'Kibaha',
    zone: 'Coastal',
    defaultLat: -6.8950,
    defaultLng: 38.9350,
    postalCodePrefix: '61',
    districts: [
      {
        name: 'Bagamoyo',
        defaultLat: -6.4420,
        defaultLng: 38.9050,
        wards: [
          { name: 'Dunda (Historic)', postalCode: '61201', lat: -6.4420, lng: 38.9050, landmarks: ['Bagamoyo Old Boma', 'Caravan Serai', 'Ocean Drive'] },
          { name: 'Kaole', postalCode: '61202', lat: -6.4650, lng: 38.9250, landmarks: ['Kaole 13th Century Ruins', 'Mangrove Estuary'] },
          { name: 'Zinga', postalCode: '61203', lat: -6.5250, lng: 38.9850 },
        ],
      },
      {
        name: 'Kibaha Urban',
        defaultLat: -6.8950,
        defaultLng: 38.9350,
        wards: [
          { name: 'Maili Moja', postalCode: '61101', lat: -6.8950, lng: 38.9350 },
        ],
      },
    ],
  },

  // --- 14. IRINGA ---
  {
    name: 'Iringa',
    capitalCity: 'Iringa',
    zone: 'Southern Highlands',
    defaultLat: -7.7730,
    defaultLng: 35.6940,
    postalCodePrefix: '51',
    districts: [
      {
        name: 'Iringa Urban',
        defaultLat: -7.7730,
        defaultLng: 35.6940,
        wards: [
          { name: 'Gangilonga', postalCode: '51101', lat: -7.7730, lng: 35.6940, landmarks: ['Gangilonga Rock', 'Highlands Escarpment'] },
          { name: 'Kihesa', postalCode: '51102', lat: -7.7600, lng: 35.7050 },
        ],
      },
    ],
  },

  // --- 15. KIGOMA ---
  {
    name: 'Kigoma',
    capitalCity: 'Kigoma',
    zone: 'Western',
    defaultLat: -4.8760,
    defaultLng: 29.6260,
    postalCodePrefix: '47',
    districts: [
      {
        name: 'Kigoma Ujiji',
        defaultLat: -4.8760,
        defaultLng: 29.6260,
        wards: [
          { name: 'Kigoma Mjini', postalCode: '47101', lat: -4.8760, lng: 29.6260, landmarks: ['Lake Tanganyika Port', 'Historic German Railway Terminal'] },
          { name: 'Ujiji', postalCode: '47102', lat: -4.9050, lng: 29.6750, landmarks: ['Livingstone Memorial Museum'] },
        ],
      },
    ],
  },

  // --- 16. KAGERA ---
  {
    name: 'Kagera',
    capitalCity: 'Bukoba',
    zone: 'Lake',
    defaultLat: -1.3310,
    defaultLng: 31.8120,
    postalCodePrefix: '35',
    districts: [
      {
        name: 'Bukoba Urban',
        defaultLat: -1.3310,
        defaultLng: 31.8120,
        wards: [
          { name: 'Bakoba', postalCode: '35101', lat: -1.3310, lng: 31.8120, landmarks: ['Lake Victoria Shoreline', 'Coffee Estates'] },
        ],
      },
    ],
  },

  // --- 17. TABORA ---
  {
    name: 'Tabora',
    capitalCity: 'Tabora',
    zone: 'Western',
    defaultLat: -5.0160,
    defaultLng: 32.8000,
    postalCodePrefix: '45',
    districts: [
      {
        name: 'Tabora Urban',
        defaultLat: -5.0160,
        defaultLng: 32.8000,
        wards: [
          { name: 'Chemchem', postalCode: '45101', lat: -5.0160, lng: 32.8000 },
        ],
      },
    ],
  },

  // --- 18. MANYARA ---
  {
    name: 'Manyara',
    capitalCity: 'Babati',
    zone: 'Northern',
    defaultLat: -4.2150,
    defaultLng: 35.7480,
    postalCodePrefix: '27',
    districts: [
      {
        name: 'Babati Urban',
        defaultLat: -4.2150,
        defaultLng: 35.7480,
        wards: [
          { name: 'Babati', postalCode: '27101', lat: -4.2150, lng: 35.7480, landmarks: ['Lake Babati Hippo Sanctuary'] },
        ],
      },
    ],
  },

  // --- 19. MTWARA & LINDI ---
  {
    name: 'Mtwara',
    capitalCity: 'Mtwara',
    zone: 'Southern',
    defaultLat: -10.2730,
    defaultLng: 40.1820,
    postalCodePrefix: '63',
    districts: [
      {
        name: 'Mtwara Urban',
        defaultLat: -10.2730,
        defaultLng: 40.1820,
        wards: [
          { name: 'Shangani (Mtwara)', postalCode: '63101', lat: -10.2730, lng: 40.1820, landmarks: ['Mtwara Deep Sea Harbour', 'Ruvuma Bay'] },
        ],
      },
    ],
  },
  {
    name: 'Lindi',
    capitalCity: 'Lindi',
    zone: 'Southern',
    defaultLat: -9.9970,
    defaultLng: 39.7140,
    postalCodePrefix: '65',
    districts: [
      {
        name: 'Lindi Urban',
        defaultLat: -9.9970,
        defaultLng: 39.7140,
        wards: [
          { name: 'Rahaleo', postalCode: '65101', lat: -9.9970, lng: 39.7140, landmarks: ['Lindi Bay Coastal Promenade'] },
        ],
      },
    ],
  },
  {
    name: 'Ruvuma',
    capitalCity: 'Songea',
    zone: 'Southern',
    defaultLat: -10.6830,
    defaultLng: 35.6500,
    postalCodePrefix: '57',
    districts: [
      {
        name: 'Songea Urban',
        defaultLat: -10.6830,
        defaultLng: 35.6500,
        wards: [
          { name: 'Bombambili', postalCode: '57101', lat: -10.6830, lng: 35.6500, landmarks: ['Majimaji War Memorial'] },
        ],
      },
    ],
  },
];

// Master Street Database across Tanzania
export const TANZANIA_STREETS: TanzaniaStreet[] = [
  // --- DAR ES SALAAM -> KINONDONI -> MASAKI ---
  {
    id: 'tz-dar-kin-mas-001',
    name: 'Toure Drive',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7495,
    lng: 39.2782,
    landmarks: ['The Slipway Waterfront', 'Coral Beach Hotel', 'DoubleTree by Hilton'],
    type: 'Drive',
  },
  {
    id: 'tz-dar-kin-mas-002',
    name: 'Chole Road',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7538,
    lng: 39.2764,
    landmarks: ['RocoMamas Masaki', 'Chole Plaza', 'Mediterraneo'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-mas-003',
    name: 'Haile Selassie Road',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7562,
    lng: 39.2721,
    landmarks: ['George & Dragon', 'Elements Masaki', 'Village Supermarket'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-mas-004',
    name: 'Kahama Road',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7460,
    lng: 39.2815,
    landmarks: ['Sea Cliff Hotel', 'Karambezi Cafe', 'Masaki Diplomatic Enclave'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-mas-005',
    name: 'Slipway Road',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7508,
    lng: 39.2662,
    landmarks: ['Hotel Slipway Marina', 'Zanzibar Ferry Jetty', 'Artisan Craft Market'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-mas-006',
    name: 'Sea Cliff Way',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7431,
    lng: 39.2840,
    landmarks: ['Sea Cliff Casino & Suites', 'Ocean Frontage Cliff'],
    type: 'Way',
  },
  {
    id: 'tz-dar-kin-mas-007',
    name: 'Kimweri Avenue',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7584,
    lng: 39.2690,
    landmarks: ['French School of Dar es Salaam', 'Masaki Green Grounds'],
    type: 'Avenue',
  },
  {
    id: 'tz-dar-kin-mas-008',
    name: 'Coral Beach Road',
    ward: 'Masaki',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14111',
    lat: -6.7482,
    lng: 39.2801,
    landmarks: ['Coral Beach Peninsula Residences'],
    type: 'Road',
  },

  // --- DAR ES SALAAM -> KINONDONI -> OYSTERBAY ---
  {
    id: 'tz-dar-kin-oys-001',
    name: 'Kenyatta Drive',
    ward: 'Oysterbay',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14112',
    lat: -6.7725,
    lng: 39.2741,
    landmarks: ['Oysterbay Shopping Center', 'Coco Beach Promenade', 'Diplomatic Residences'],
    type: 'Drive',
  },
  {
    id: 'tz-dar-kin-oys-002',
    name: 'Ocean Road (Barack Obama Drive)',
    ward: 'Oysterbay',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14112',
    lat: -6.7820,
    lng: 39.2798,
    landmarks: ['State House Corridor', 'Oysterbay Beach Walk', 'Aga Khan Hospital Ocean Wing'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-oys-003',
    name: 'Karume Road',
    ward: 'Oysterbay',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14112',
    lat: -6.7690,
    lng: 39.2710,
    landmarks: ['US Embassy Compound', 'Oysterbay Club', 'International School of Tanganyika'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-oys-004',
    name: 'Ghana Avenue',
    ward: 'Oysterbay',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14112',
    lat: -6.7745,
    lng: 39.2685,
    landmarks: ['German Embassy', 'Oysterbay Villas'],
    type: 'Avenue',
  },
  {
    id: 'tz-dar-kin-oys-005',
    name: 'Kaunda Drive',
    ward: 'Oysterbay',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14112',
    lat: -6.7760,
    lng: 39.2730,
    landmarks: ['British High Commission Staff Enclave'],
    type: 'Drive',
  },

  // --- DAR ES SALAAM -> KINONDONI -> MSASANI ---
  {
    id: 'tz-dar-kin-msa-001',
    name: 'Msasani Peninsula Drive',
    ward: 'Msasani',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14110',
    lat: -6.7610,
    lng: 39.2612,
    landmarks: ['Msasani Beach Club', 'Peninsula Bay Marina'],
    type: 'Drive',
  },
  {
    id: 'tz-dar-kin-msa-002',
    name: 'Old Bagamoyo Road',
    ward: 'Msasani',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14110',
    lat: -6.7645,
    lng: 39.2550,
    landmarks: ['Shoppers Plaza Mikocheni', 'Kawe Roundabout Link'],
    type: 'Road',
  },
  {
    id: 'tz-dar-kin-msa-003',
    name: 'Bonde la Mpunga Road',
    ward: 'Msasani',
    district: 'Kinondoni',
    region: 'Dar es Salaam',
    city: 'Dar es Salaam',
    postalCode: '14110',
    lat: -6.7682,
    lng: 39.2605,
    landmarks: ['Msasani Mall', 'Mayfair Plaza'],
    type: 'Road',
  },

  // --- ZANZIBAR -> STONE TOWN (MJINI) ---
  {
    id: 'tz-znz-mji-sha-001',
    name: 'Shangani Street',
    ward: 'Shangani',
    district: 'Stone Town (Mjini)',
    region: 'Zanzibar (Mjini Magharibi)',
    city: 'Zanzibar',
    postalCode: '71101',
    lat: -6.1645,
    lng: 39.1870,
    landmarks: ['Park Hyatt Zanzibar', 'Serena Stone Town Hotel', 'Old Fort of Zanzibar'],
    type: 'Street',
  },
  {
    id: 'tz-znz-mji-for-001',
    name: 'Forodhani Seafront Promenade',
    ward: 'Forodhani',
    district: 'Stone Town (Mjini)',
    region: 'Zanzibar (Mjini Magharibi)',
    city: 'Zanzibar',
    postalCode: '71101',
    lat: -6.1610,
    lng: 39.1895,
    landmarks: ['Forodhani Gardens Night Food Market', 'House of Wonders', 'Palace Museum'],
    type: 'Boulevard',
  },
  {
    id: 'tz-znz-mji-giz-001',
    name: 'Gizenga Street',
    ward: 'Hurumzi',
    district: 'Stone Town (Mjini)',
    region: 'Zanzibar (Mjini Magharibi)',
    city: 'Zanzibar',
    postalCode: '71101',
    lat: -6.1628,
    lng: 39.1912,
    landmarks: ['Zanzibar Coffee House', 'Emerson on Hurumzi', 'Handcrafted Woodcarvers Row'],
    type: 'Street',
  },

  // --- ZANZIBAR -> NORTH (NUNGWI & KENDWA) ---
  {
    id: 'tz-znz-nor-nun-001',
    name: 'Nungwi Coral Reef Way',
    ward: 'Nungwi',
    district: 'Kaskazini A',
    region: 'Zanzibar North (Kaskazini Unguja)',
    city: 'Zanzibar',
    postalCode: '71205',
    lat: -5.7258,
    lng: 39.2982,
    landmarks: ['Zuri Zanzibar Resort', 'The Z Hotel', 'Nungwi Dhow Boatyard'],
    type: 'Way',
  },
  {
    id: 'tz-znz-nor-ken-001',
    name: 'Kendwa Rocks Boulevard',
    ward: 'Kendwa',
    district: 'Kaskazini A',
    region: 'Zanzibar North (Kaskazini Unguja)',
    city: 'Zanzibar',
    postalCode: '71205',
    lat: -5.7530,
    lng: 39.2910,
    landmarks: ['Kendwa Rocks Beach Club', 'Gold Zanzibar Beach House', 'Sunset Beach Promenade'],
    type: 'Boulevard',
  },

  // --- ZANZIBAR -> SOUTH (PAJE & JAMBIANI) ---
  {
    id: 'tz-znz-sou-paj-001',
    name: 'Paje Kite Lagoon Way',
    ward: 'Paje',
    district: 'Kusini',
    region: 'Zanzibar South (Kusini Unguja)',
    city: 'Zanzibar',
    postalCode: '71302',
    lat: -6.2650,
    lng: 39.5340,
    landmarks: ['Paje Kitesurfing Beach', 'The Rock Restaurant Corridor', 'White Sands Luxury Villas'],
    type: 'Way',
  },

  // --- ARUSHA -> CITY & SAFARI CORRIDOR ---
  {
    id: 'tz-aru-cit-sek-001',
    name: 'Old Moshi Road',
    ward: 'Sekei',
    district: 'Arusha City',
    region: 'Arusha',
    city: 'Arusha',
    postalCode: '23101',
    lat: -3.3685,
    lng: 36.6950,
    landmarks: ['Kibo Palace Hotel', 'Arusha Clock Tower Point', 'Arusha Gymkhana Golf Course'],
    type: 'Road',
  },
  {
    id: 'tz-aru-cit-sek-002',
    name: 'Goliondoi Road',
    ward: 'Sekei',
    district: 'Arusha City',
    region: 'Arusha',
    city: 'Arusha',
    postalCode: '23101',
    lat: -3.3712,
    lng: 36.6890,
    landmarks: ['Mount Meru Hotel', 'Old German Boma Museum', 'Four Points by Sheraton'],
    type: 'Road',
  },
  {
    id: 'tz-aru-cit-nji-001',
    name: 'Njiro Hill Boulevard',
    ward: 'Njiro',
    district: 'Arusha City',
    region: 'Arusha',
    city: 'Arusha',
    postalCode: '23105',
    lat: -3.4120,
    lng: 36.7110,
    landmarks: ['Njiro Complex Cinema', 'ESAMI University', 'Coffee Plantation Estates'],
    type: 'Boulevard',
  },

  // --- KILIMANJARO -> MOSHI & MACHAME ---
  {
    id: 'tz-kil-mos-sha-001',
    name: 'Shanty Town Boulevard',
    ward: 'Shanty Town',
    district: 'Moshi Urban',
    region: 'Kilimanjaro',
    city: 'Moshi',
    postalCode: '25102',
    lat: -3.3420,
    lng: 37.3250,
    landmarks: ['Kilimanjaro View Club', 'Moshi Golf Course', 'KCMC Referral Hospital link'],
    type: 'Boulevard',
  },
  {
    id: 'tz-kil-mos-kib-001',
    name: 'Kibo Road',
    ward: 'Kibo Road (Central)',
    district: 'Moshi Urban',
    region: 'Kilimanjaro',
    city: 'Moshi',
    postalCode: '25101',
    lat: -3.3510,
    lng: 37.3390,
    landmarks: ['Moshi Clock Tower', 'Chagga Cultural Centre', 'Coffee Union Building'],
    type: 'Road',
  },

  // --- DODOMA (CAPITAL) ---
  {
    id: 'tz-dod-urb-mtu-001',
    name: 'Mtumba Government City Boulevard',
    ward: 'Mtumba',
    district: 'Dodoma City / Urban',
    region: 'Dodoma',
    city: 'Dodoma',
    postalCode: '41107',
    lat: -6.0420,
    lng: 35.8920,
    landmarks: ['State House Chamwino Wing', 'Ministry Complexes', 'National Assembly Square'],
    type: 'Boulevard',
  },
  {
    id: 'tz-dod-urb-kik-001',
    name: 'Kikuyu Avenue',
    ward: 'Kikuyu',
    district: 'Dodoma City / Urban',
    region: 'Dodoma',
    city: 'Dodoma',
    postalCode: '41101',
    lat: -6.1820,
    lng: 35.7480,
    landmarks: ['Dodoma Cathedral', 'St. John’s University', 'Royal Village Hotel'],
    type: 'Avenue',
  },

  // --- MWANZA (ROCK CITY / LAKE VICTORIA) ---
  {
    id: 'tz-mwa-nya-cap-001',
    name: 'Capri Point Ridge Road',
    ward: 'Capri Point',
    district: 'Nyamagana',
    region: 'Mwanza',
    city: 'Mwanza',
    postalCode: '33101',
    lat: -2.5180,
    lng: 32.8980,
    landmarks: ['Capri Point Waterfront', 'Mwanza Yacht Club', 'Bismarck Rock Vista'],
    type: 'Road',
  },
  {
    id: 'tz-mwa-nya-isa-001',
    name: 'Isamilo Hill Road',
    ward: 'Isamilo',
    district: 'Nyamagana',
    region: 'Mwanza',
    city: 'Mwanza',
    postalCode: '33102',
    lat: -2.5100,
    lng: 32.9050,
    landmarks: ['Isamilo International School', 'Gold Crest Hotel corridor'],
    type: 'Road',
  },

  // --- MARA / SERENGETI ---
  {
    id: 'tz-mar-ser-gru-001',
    name: 'Grumeti River Reserve Track',
    ward: 'Fort Ikoma',
    district: 'Serengeti',
    region: 'Mara',
    city: 'Serengeti',
    postalCode: '31301',
    lat: -2.3325,
    lng: 34.8210,
    landmarks: ['Singita Sasakwa Lodge Corridor', 'Grumeti River Crossing', 'Serengeti Migration Ridge'],
    type: 'Way',
  },
];

// Unified Search Result Type for Administrative Search-As-You-Type
export interface CadastreSearchResult {
  level: 'ward' | 'district' | 'region' | 'street';
  primaryName: string;
  secondaryText: string;
  region: string;
  district: string;
  ward: string;
  street?: string;
  city: string;
  postalCode?: string;
  lat: number;
  lng: number;
}

// Universal Search-As-You-Type Across Tanzanian Administrative Hierarchy
export function searchNationalCadastre(query: string): CadastreSearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: CadastreSearchResult[] = [];

  // 1. Search Streets
  for (const st of TANZANIA_STREETS) {
    if (
      st.name.toLowerCase().includes(q) ||
      st.landmarks?.some((lm) => lm.toLowerCase().includes(q))
    ) {
      results.push({
        level: 'street',
        primaryName: st.name,
        secondaryText: `${st.ward} • ${st.district} • ${st.region}`,
        region: st.region,
        district: st.district,
        ward: st.ward,
        street: st.name,
        city: st.city,
        postalCode: st.postalCode,
        lat: st.lat,
        lng: st.lng,
      });
    }
  }

  // 2. Search Wards across all regions and districts
  for (const reg of TANZANIA_ADMIN_REGIONS) {
    for (const dist of reg.districts) {
      for (const w of dist.wards) {
        if (
          w.name.toLowerCase().includes(q) ||
          w.landmarks?.some((lm) => lm.toLowerCase().includes(q))
        ) {
          // Avoid duplicate if street already added
          const already = results.some(
            (r) => r.level === 'ward' && r.ward === w.name && r.district === dist.name
          );
          if (!already) {
            results.push({
              level: 'ward',
              primaryName: w.name,
              secondaryText: `Ward (Kata) in ${dist.name}, ${reg.name}`,
              region: reg.name,
              district: dist.name,
              ward: w.name,
              city: reg.capitalCity,
              postalCode: w.postalCode || `${reg.postalCodePrefix}000`,
              lat: w.lat || dist.defaultLat || reg.defaultLat,
              lng: w.lng || dist.defaultLng || reg.defaultLng,
            });
          }
        }
      }
    }
  }

  // 3. Search Districts
  for (const reg of TANZANIA_ADMIN_REGIONS) {
    for (const dist of reg.districts) {
      if (dist.name.toLowerCase().includes(q)) {
        results.push({
          level: 'district',
          primaryName: dist.name,
          secondaryText: `District (Wilaya) in ${reg.name} (${dist.wards.length} Wards)`,
          region: reg.name,
          district: dist.name,
          ward: dist.wards[0]?.name || '',
          city: reg.capitalCity,
          postalCode: `${reg.postalCodePrefix}000`,
          lat: dist.defaultLat || reg.defaultLat,
          lng: dist.defaultLng || reg.defaultLng,
        });
      }
    }
  }

  // 4. Search Regions
  for (const reg of TANZANIA_ADMIN_REGIONS) {
    if (reg.name.toLowerCase().includes(q)) {
      const firstDist = reg.districts[0];
      const firstWard = firstDist?.wards[0];
      results.push({
        level: 'region',
        primaryName: reg.name,
        secondaryText: `Region (Mkoa) • ${reg.zone} Zone (${reg.districts.length} Districts)`,
        region: reg.name,
        district: firstDist?.name || '',
        ward: firstWard?.name || '',
        city: reg.capitalCity,
        postalCode: `${reg.postalCodePrefix}000`,
        lat: reg.defaultLat,
        lng: reg.defaultLng,
      });
    }
  }

  return results.slice(0, 12);
}

// Find Nearest Known Tanzania Ward/Street by GPS coordinates
export function findNearestTanzaniaStreet(lat: number, lng: number): TanzaniaStreet | null {
  if (TANZANIA_STREETS.length === 0) return null;

  let closestStreet = TANZANIA_STREETS[0];
  let minDistanceSq = Number.MAX_VALUE;

  for (const street of TANZANIA_STREETS) {
    const dLat = street.lat - lat;
    const dLng = street.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestStreet = street;
    }
  }

  return closestStreet;
}

// Legacy search compatibility
export function searchTanzaniaLocations(query: string): TanzaniaStreet[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return TANZANIA_STREETS.filter((s) => {
    return (
      s.name.toLowerCase().includes(q) ||
      s.ward.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.landmarks?.some((lm) => lm.toLowerCase().includes(q))
    );
  }).slice(0, 10);
}

// Backward compatibility alias
export const TANZANIA_REGIONS = TANZANIA_ADMIN_REGIONS;

