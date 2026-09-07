import { Property, Lead } from '../types';

export const TEAM_AGENTS = [
  {
    id: 'agent-01',
    name: 'Juma Mkwawa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+255 754 220 190',
    email: 'j.mkwawa@flxrealestate.com',
    license: 'TAREAA-TZ9042',
    role: 'Principal Partner & Founder (Dar es Salaam Desk)'
  },
  {
    id: 'agent-02',
    name: 'Neema Kimaro',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+255 784 551 230',
    email: 'n.kimaro@flxrealestate.com',
    license: 'BRELA-TZ4821',
    role: 'Investment Portfolio Director (Zanzibar Desk)'
  },
  {
    id: 'agent-03',
    name: 'Baraka Mwangi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+255 768 334 910',
    email: 'b.mwangi@flxrealestate.com',
    license: 'TAREAA-TZ6180',
    role: 'East Africa Safari & Luxury Associate (Arusha Desk)'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-flx-001',
    created_at: '2026-08-28T14:20:00Z',
    title: 'The Masaki Ocean Peninsula Villa',
    property_type: 'Live',
    status: 'Approved',
    price: 4850000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_resolution: '4K Ultra HD',
    thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -6.7495,
      lng: 39.2782,
      address: '14 Toure Drive, Masaki Peninsula',
      city: 'Dar es Salaam',
      state: 'Tanzania',
      zip: '14111',
      neighborhood: 'Masaki Waterfront'
    },
    agent: TEAM_AGENTS[0],
    metadata: {
      beds: 5,
      baths: 6.5,
      sqft: 7200,
      lot_size: '0.65 Acres Oceanfront',
      year_built: 2024,
      cap_rate: 7.4,
      gross_yield: 9.8,
      projected_monthly_rent: 32000,
      projected_annual_cashflow: 250000,
      occupancy_rate: 96,
      short_term_rental_allowed: true,
      estimated_appreciation_5yr: 38,
      luxury_finishes: [
        'Direct Indian Ocean Deepwater Mooring',
        'Bookmatched Italian Travertine & Mvule Hardwood',
        'Cantilevered Ocean Infinity Pool',
        'Full Crestron Home Automation',
        'Dual 100kVA Soundproof Backup Generators & Solar'
      ],
      walk_score: 86,
      school_rating: 9,
      hoa_monthly: 350
    },
    description: 'An architectural masterwork commanding uninterrupted panoramic views of the Indian Ocean on the coveted Masaki Peninsula in Dar es Salaam. Floor-to-ceiling hurricane-rated thermal glass, infinity-edge cliffside pool, and private boat landing.',
    featured: true,
    intake_notes: 'Surveyed on-site via drone LiDAR in Masaki. Clean Tanzanian Ministry of Lands title deed verified.'
  },
  {
    id: 'prop-flx-002',
    created_at: '2026-08-30T09:15:00Z',
    title: 'Kendwa Azure Luxury Resort Villa',
    property_type: 'Invest',
    status: 'Approved',
    price: 3400000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_resolution: '4K Ultra HD',
    thumbnail_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -5.7485,
      lng: 39.2905,
      address: 'Kendwa Beach Marine Frontage',
      city: 'Zanzibar',
      state: 'Tanzania',
      zip: '71101',
      neighborhood: 'Kendwa Beach / North Coast'
    },
    agent: TEAM_AGENTS[1],
    metadata: {
      beds: 8,
      baths: 8,
      sqft: 7800,
      lot_size: '0.85 Acres White Sand Frontage',
      year_built: 2023,
      cap_rate: 12.8,
      gross_yield: 16.5,
      projected_monthly_rent: 38000,
      projected_annual_cashflow: 340000,
      occupancy_rate: 94,
      short_term_rental_allowed: true,
      estimated_appreciation_5yr: 44,
      luxury_finishes: [
        'Direct Non-Tidal Turquoise Beach Access',
        'Turnkey High-Yield Boutique Resort Setup',
        'Private Plunge Pools for All 8 Suites',
        'Desalination Water Facility & Solar Microgrid'
      ],
      walk_score: 90,
      school_rating: 8,
      hoa_monthly: 0
    },
    description: 'High-performing Class A turnkey hospitality asset positioned on Zanzibar’s premier non-tidal white sand coastline. Fully leased with high international traveler yields, fully staffed boutique management, and audited 12.8% capitalization rate.',
    featured: true,
    intake_notes: 'Zanzibar ZIPA tourism concession investment certificate and audited hotel yield ledger verified.'
  },
  {
    id: 'prop-flx-003',
    created_at: '2026-09-01T11:40:00Z',
    title: 'Mount Meru Coffee Estate & Sanctuary',
    property_type: 'Live',
    status: 'Approved',
    price: 2850000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    video_resolution: '8K Mastered',
    thumbnail_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -3.3667,
      lng: 36.8500,
      address: 'Old Moshi Road, USA River Ridge',
      city: 'Arusha',
      state: 'Tanzania',
      zip: '23100',
      neighborhood: 'Mount Meru Foothills'
    },
    agent: TEAM_AGENTS[2],
    metadata: {
      beds: 5,
      baths: 5.5,
      sqft: 6400,
      lot_size: '14 Acres Organic Arabica Coffee',
      year_built: 2024,
      cap_rate: 6.8,
      gross_yield: 8.9,
      projected_monthly_rent: 22000,
      projected_annual_cashflow: 180000,
      occupancy_rate: 91,
      short_term_rental_allowed: true,
      estimated_appreciation_5yr: 36,
      luxury_finishes: [
        'Unobstructed Mount Meru & Kilimanjaro Vistas',
        'Private Arabica Coffee Processing Facility',
        'Natural Spring-Fed Heated Infinity Pool',
        'Architectural African Teak & Volcanic Stone Hearth'
      ],
      walk_score: 55,
      school_rating: 9,
      hoa_monthly: 200
    },
    description: 'An extraordinary sanctuary set amongst 14 acres of active organic specialty coffee in the foothills of Mount Meru, Arusha. Features panoramic mountain views, private helipad, and seamless blend of modern Scandinavian and Swahili architectural craft.',
    featured: true,
    intake_notes: 'Exclusive off-market Arusha coffee plantation listing imported by FLX Safari VIP Desk.'
  },
  {
    id: 'prop-flx-004',
    created_at: '2026-09-02T16:00:00Z',
    title: 'The Oyster Bay Diplomatic Compound',
    property_type: 'Invest',
    status: 'Approved',
    price: 5600000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    video_resolution: '4K Ultra HD',
    thumbnail_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -6.7820,
      lng: 39.2710,
      address: 'Ocean Road / Kenyatta Drive Enclave',
      city: 'Dar es Salaam',
      state: 'Tanzania',
      zip: '14101',
      neighborhood: 'Oyster Bay'
    },
    agent: TEAM_AGENTS[0],
    metadata: {
      beds: 6,
      baths: 7,
      sqft: 8100,
      lot_size: '1.2 Acres Landscaped Grounds',
      year_built: 2023,
      cap_rate: 9.6,
      gross_yield: 12.2,
      projected_monthly_rent: 45000,
      projected_annual_cashflow: 410000,
      occupancy_rate: 98,
      short_term_rental_allowed: false,
      estimated_appreciation_5yr: 32,
      luxury_finishes: [
        'UN & Embassy Level High-Security Perimeter',
        'Reinforced Ballistic Windows & Safe Room',
        'Floodlit Championship Tennis Court & Lap Pool',
        'Dual 150kVA Generators & Industrial Water Filtration'
      ],
      walk_score: 78,
      school_rating: 10,
      hoa_monthly: 500
    },
    description: 'Premier diplomatic residential compound in historic Oyster Bay, Dar es Salaam. Long-term corporate lease to G7 sovereign diplomatic mission with inflation-indexed USD rent payments and zero vacancy risk.',
    featured: true,
    intake_notes: 'Diplomatic lease verified. Surveyed coordinates verified on Tanzania Cadastre.'
  },
  {
    id: 'prop-flx-005',
    created_at: '2026-09-04T08:30:00Z',
    title: 'Serengeti Migration Eco-Reserve Lodge',
    property_type: 'Invest',
    status: 'Approved',
    price: 8900000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    video_resolution: '4K Cinema',
    thumbnail_url: 'https://images.unsplash.com/photo-1502005229762-ee152da92e06?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee152da92e06?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -2.2500,
      lng: 34.6800,
      address: 'Grumeti Wildlife Corridor Concession',
      city: 'Serengeti',
      state: 'Tanzania',
      zip: '31201',
      neighborhood: 'Western Serengeti Concession'
    },
    agent: TEAM_AGENTS[2],
    metadata: {
      beds: 10,
      baths: 12,
      sqft: 11500,
      lot_size: '1,800 Hectares Private Conservancy',
      year_built: 2023,
      cap_rate: 14.2,
      gross_yield: 18.0,
      projected_monthly_rent: 95000,
      projected_annual_cashflow: 820000,
      occupancy_rate: 92,
      short_term_rental_allowed: true,
      estimated_appreciation_5yr: 48,
      luxury_finishes: [
        'Private 1,200m All-Weather Airstrip & Aircraft Hangar',
        'Front-Row Views of the Great Migration Crossing',
        'Off-Grid Tesla Industrial Solar & Battery Microgrid',
        'Cantilevered Canvas & Teak Infinity Pool Suites'
      ],
      walk_score: 20,
      school_rating: 8,
      hoa_monthly: 0
    },
    description: 'An irreplaceable safari hospitality trophy situated in the Grumeti ecosystem of the Serengeti. Over 1,800 hectares of private conservancy rights yielding peerless high-ticket ecotourism revenues from global luxury clientele.',
    featured: false,
    intake_notes: 'TANAPA and Ministry of Natural Resources & Tourism concession audit passed.'
  },
  {
    id: 'prop-flx-006',
    created_at: '2026-09-05T13:10:00Z',
    title: 'Kilimanjaro Cloud Forest Chalet',
    property_type: 'Live',
    status: 'Pending',
    price: 2450000,
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    video_resolution: '4K Ultra HD',
    thumbnail_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    location: {
      lat: -3.2200,
      lng: 37.2800,
      address: 'Machame Forest Escarpment',
      city: 'Kilimanjaro',
      state: 'Tanzania',
      zip: '25101',
      neighborhood: 'Moshi / Machame Ridge'
    },
    agent: TEAM_AGENTS[1],
    metadata: {
      beds: 4,
      baths: 4.5,
      sqft: 5200,
      lot_size: '3.5 Acres Indigenous Alpine Forest',
      year_built: 2024,
      cap_rate: 7.8,
      gross_yield: 10.4,
      projected_monthly_rent: 24000,
      projected_annual_cashflow: 190000,
      occupancy_rate: 88,
      short_term_rental_allowed: true,
      estimated_appreciation_5yr: 40,
      luxury_finishes: [
        'Heated Geothermal Mountain Spring Jacuzzi',
        'Carved Volcanic Stone Central Fireplaces',
        'Direct Private Trail Access to Kilimanjaro Forest Reserve',
        'Off-Grid Micro-Hydro & Solar Power Integration'
      ],
      walk_score: 35,
      school_rating: 9,
      hoa_monthly: 250
    },
    description: 'Nestled on the high-altitude forested slopes of Mount Kilimanjaro in Machame. Architectural glass and volcanic stone pavilions framed by afro-alpine vegetation and uninterrupted views of Kibo Peak.',
    featured: true,
    intake_notes: 'Submitted from field agent mobile portal in Moshi. Geotagged at altitude 1,840m.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    property_id: 'prop-flx-001',
    property_title: 'The Masaki Ocean Peninsula Villa',
    client_name: 'Damon Sterling',
    client_email: 'sterling.capital@investments.com',
    client_phone: '+255 754 441 901',
    inquiry_type: 'Tour',
    intent: 'Buy',
    budget: '$4.5M - $5.5M',
    preferred_date: '2026-09-12 16:30',
    message: 'Requesting private boat arrival at the Masaki deepwater mooring for sunset inspection. Proof of funds verified with Standard Chartered Private Wealth.',
    status: 'Tour_Scheduled',
    created_at: '2026-09-05T18:40:00Z',
    notes: 'Pre-qualified family office principal. Escort via Dar es Salaam Yacht Club tender arranged.'
  },
  {
    id: 'lead-102',
    property_id: 'prop-flx-002',
    property_title: 'Kendwa Azure Luxury Resort Villa',
    client_name: 'Kavita Patel',
    client_email: 'k.patel@horizonholdings.org',
    client_phone: '+255 784 302 819',
    inquiry_type: 'Investor_Deck',
    intent: 'Buy',
    budget: '$3.0M - $4.0M',
    message: 'Seeking full ZIPA tax concession documentation, audited occupancy reports, and trailing ADR numbers for a commercial acquisition in Zanzibar.',
    status: 'New',
    created_at: '2026-09-06T07:15:00Z',
    notes: 'Institutional hospitality investor evaluating Zanzibar expansion.'
  },
  {
    id: 'lead-103',
    property_id: 'prop-flx-004',
    property_title: 'The Oyster Bay Diplomatic Compound',
    client_name: 'Braden O’Connor',
    client_email: 'b.oconnor@desertgroup.io',
    client_phone: '+255 768 891 233',
    inquiry_type: 'Make_Offer',
    intent: 'Buy',
    budget: '$5.4M - $5.8M',
    message: 'Client prepared to place all-cash offer at $5.5M for the Oyster Bay diplomatic asset with immediate handover of sovereign lease assignment.',
    status: 'Offer_Placed',
    created_at: '2026-09-04T12:00:00Z',
    notes: 'Ministry of Foreign Affairs tenant liaison confirmed.'
  }
];
