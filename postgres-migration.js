import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/flx_real_estate';
const sqlPath = path.join(__dirname, 'data', 'postgres-schema.sql');

const defaultProperties = [
  {
    title: 'Mlimani Comfort Hostel',
    city: 'UDSM West • Dar es Salaam',
    price: 'TZS 280k/sem',
    period: '2 Bed • Wi-Fi',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    badge: 'Verified',
    tag: 'Water 24/7',
    verification: 'Clean ministry title deed',
    status: 'Verified',
    description: 'Fully furnished student housing with 24/7 security, high-speed fiber internet, and a verified title deed in the UDSM corridor.',
  },
  {
    title: 'Posta Golden Tower',
    city: 'CBD • Dar es Salaam',
    price: 'TZS 1.8M/mo',
    period: 'Commercial Office',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    badge: 'Hot',
    tag: 'Backup Generator',
    verification: 'Power backup ready',
    status: 'Hot',
    description: 'Prime commercial tower suite with backup power, monitored security, and parking access close to the city center.',
  },
  {
    title: 'Gezaulo Coastal Parcel',
    city: 'Kigamboni • Dar es Salaam',
    price: 'TZS 38M',
    period: 'Land • 80sqm',
    image: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
    tag: 'Title Deed',
    verification: 'Surveyed parcel',
    status: 'New',
    description: 'Coastal parcel with a clear title and strong upside for a boutique residence or short-stay holiday investment.',
  },
];

const defaultUsers = [
  ['Aisha Mtega', 'client@flx.local', 'client123', 'Client'],
  ['Neema Joseph', 'owner@flx.local', 'owner123', 'Owner'],
  ['Baraka Hassan', 'agent@flx.local', 'agent123', 'Agent'],
  ['Daniel Kimaro', 'investor@flx.local', 'investor123', 'Investor'],
  ['FLX Admin', 'admin@flx.local', 'admin123', 'Admin'],
];

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  price VARCHAR(120) NOT NULL,
  period VARCHAR(120) NOT NULL,
  image TEXT NOT NULL,
  badge VARCHAR(120) NOT NULL,
  tag VARCHAR(120) NOT NULL,
  verification TEXT NOT NULL,
  status VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_listings (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  property_id INTEGER NOT NULL,
  UNIQUE(user_email, property_id)
);

CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL,
  status VARCHAR(120) NOT NULL,
  amount VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS owner_metrics (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(120) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_summary (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(120) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  avg_price INTEGER NOT NULL,
  avg_yield DOUBLE PRECISION NOT NULL,
  demand_score INTEGER NOT NULL,
  trend VARCHAR(80) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_data (
  key_name VARCHAR(120) PRIMARY KEY,
  key_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const run = async () => {
  fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
  fs.writeFileSync(sqlPath, schema.trim() + '\n');

  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query(schema);

  const listingCount = await client.query('SELECT COUNT(*)::int AS count FROM listings');
  if (listingCount.rows[0].count === 0) {
    await client.query(
      `INSERT INTO listings (title, city, price, period, image, badge, tag, verification, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [defaultProperties[0].title, defaultProperties[0].city, defaultProperties[0].price, defaultProperties[0].period, defaultProperties[0].image, defaultProperties[0].badge, defaultProperties[0].tag, defaultProperties[0].verification, defaultProperties[0].status, defaultProperties[0].description],
    );
    for (const property of defaultProperties.slice(1)) {
      await client.query(
        `INSERT INTO listings (title, city, price, period, image, badge, tag, verification, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [property.title, property.city, property.price, property.period, property.image, property.badge, property.tag, property.verification, property.status, property.description],
      );
    }
  }

  const userCount = await client.query('SELECT COUNT(*)::int AS count FROM users');
  if (userCount.rows[0].count === 0) {
    for (const [name, email, password, role] of defaultUsers) {
      await client.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, password, role]);
    }
  }

  const marketCount = await client.query('SELECT COUNT(*)::int AS count FROM market_summary');
  if (marketCount.rows[0].count === 0) {
    await client.query(
      `INSERT INTO market_summary (key_name, key_value) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8)`,
      [
        'overview', JSON.stringify({ averageAskingPrice: 'TZS 32.8M', averageYield: '9.6%', hottestMarket: 'Dar es Salaam', activeAreas: '18 micro-markets' }),
        'hotspots', JSON.stringify([
          { city: 'Dar es Salaam', label: 'Best overall momentum', value: '11.4% average yield', tone: 'strong' },
          { city: 'Arusha', label: 'Fastest investor demand', value: '9.8% average yield', tone: 'neutral' },
          { city: 'Dodoma', label: 'Affordable growth zone', value: '7.6% avg rental yield', tone: 'warm' },
        ]),
        'recommendations', JSON.stringify([
          'Student housing in UDSM and Mbezi remains highly liquid for rent-first buyers.',
          'Commercial office inventory in CBD is outperforming for investor-focused clients.',
          'Coastal and peri-urban land is gaining momentum as a diversification strategy.',
        ]),
        'lastUpdated', new Date().toISOString(),
      ],
    );
  }

  const appDataCount = await client.query('SELECT COUNT(*)::int AS count FROM app_data');
  if (appDataCount.rows[0].count === 0) {
    await client.query(
      `INSERT INTO app_data (key_name, key_value) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8)`,
      [
        'clientDashboard', JSON.stringify({ resident: { name: 'Juma Bakari', property: 'Mlimani Comfort Hostel', room: 'Room 204-B', status: 'Lease active' }, stats: [{ label: 'Water usage', value: '114 L/day', meta: '7% below average' }, { label: 'Guest access', value: '2 passes', meta: 'Approved for tonight' }, { label: 'Household spend', value: 'TZS 82,000', meta: 'Food & essentials' }, { label: 'Support', value: 'On-call', meta: 'Guard / caretaker active' }], reminders: [{ time: 'Thu 10:00', title: 'Laundry pickup slot', body: 'Next slot available in Block B utility bay.' }, { time: 'Fri 18:30', title: 'Visitor pre-check', body: 'Auntie Mariam, guest pass approved and QR ready.' }, { time: 'Sun 08:30', title: 'Room inspection', body: 'Checklist review with caretaker and student admin.' }], tickets: [{ id: 1, title: 'Desk lamp socket fix', status: 'In progress', eta: 'ETA 3:00 PM' }, { id: 2, title: 'Water pressure check', status: 'Queued', eta: 'Assigned: Facilities team' }] }),
        'agentDashboard', JSON.stringify({ profile: { name: 'Daudi M.', title: 'BRELA No. RLCA-2024-TZ-8841 • FLX Verified' }, stats: [{ label: 'Active Leads', value: '28', delta: '+5' }, { label: 'Target Hit', value: '82%', delta: 'Mtd' }, { label: 'Conversion', value: '34%', delta: 'Top 5%' }], leads: [{ id: 1, title: 'UDSM Hostel Hunt', note: '4 students ready tonight' }, { id: 2, title: 'CBD Office Search', note: '2 legal teams' }, { id: 3, title: 'Diaspora Land Buyers', note: '1 high-value lead' }, { id: 4, title: 'Kigamboni Family Plot', note: '3 matches' }], deals: [{ id: 1, title: 'Kassim & Friends (4 Scholars)', status: 'Urgent SLA 15m', note: 'Active lead with strong conversion signal.' }, { id: 2, title: 'Adv. Brenda K. (LexAfrica TZ)', status: 'Walkthrough Today', note: 'Active lead with strong conversion signal.' }, { id: 3, title: 'Dr. Josephat M. (UK Diaspora)', status: 'Drone Verification', note: 'Active lead with strong conversion signal.' }], contracts: [{ id: 1, title: 'Lease Draft', note: '3 pending' }, { id: 2, title: 'Addendum', note: '1 ready' }, { id: 3, title: 'RTA Add-on', note: '2 synced' }, { id: 4, title: 'Shareable PDF', note: '4 generated' }] }),
        'ownerDashboard', JSON.stringify({ portfolio: { totalRevenue: 'TZS 14,800,000', occupancy: '94.1%', paymentBalance: 'TZS 3,200,000', units: [{ name: 'Room 102-A', label: 'Mlimani Comfort Hostel', value: 'TZS 1,200,000 / sem', status: 'Ready' }, { name: 'Bed 204-B', label: 'Mlimani Comfort Hostel', value: 'TZS 280,000 / sem', status: 'Vacant' }, { name: 'Suite 4B', label: 'Posta Office Suites', value: 'TZS 2,000,000 / month', status: 'Leased' }] }, maintenance: [{ title: 'Water pressure fix', location: 'Mlimani Comfort Hostel', state: 'Waiting for plumber' }, { title: 'Gate sensor replacement', location: 'Kijitonyama Apartments', state: 'Technician on site' }, { title: 'Roof leak inspection', location: 'Posta Office Suites', state: 'Approved by owner' }] }),
        'opsDashboard', JSON.stringify({ queue: [{ label: 'Parcel #492 (Gezaulole, Kigamboni)', status: 'CADASTRAL DRONE LOCK', details: 'RTK-GPS drone telemetry confirmed against Ministry registry.' }, { label: 'Mlimani Comfort Hostel Block B', status: 'PHYSICAL INSPECTION PASSED', details: 'Inspector Kavish: Physical geotagged checklist valid.' }, { label: 'Juma Bakari', status: 'STUDENT KYC', details: 'UDSM Law #2022-04-1184 • NIDA verified.' }], paymentSummary: { balance: 'TZS 142,500,000', flags: '0 Security Flags • 100% Reconciled' }, disputes: [{ title: 'Ocean View Apartment Masaki', summary: 'Duplicate match: Cape Town Listing #921', action: 'Ban & Freeze Account' }] }),
      ],
    );
  }

  console.log('Postgres schema migrated successfully.');
  console.log('SQL file written to:', sqlPath);
  await client.end();
};

run().catch((error) => {
  console.error('Postgres migration failed:', error.message);
  process.exit(1);
});
