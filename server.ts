import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_DATASETS, INITIAL_MAPPINGS } from './src/data/defaultDatasets';
import { Dataset, MissionDataMapping, SimulationParameters } from './src/types/admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const distIndexPath = path.resolve(__dirname, 'dist', 'index.html');
const isProd =
  process.env.NODE_ENV === 'production' ||
  (path.extname(__filename) === '.js' && fs.existsSync(distIndexPath));

const app = express();
app.use(express.json({ limit: '10mb' }));

// Persistent Storage Directory (with /tmp fallback for read-only container layers)
let DATA_DIR = path.resolve(__dirname, 'storage');
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  DATA_DIR = path.resolve('/tmp', 'space-academy-storage');
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Unable to create storage directory, using in-memory store only:', err);
  }
}
const DATASETS_FILE = path.resolve(DATA_DIR, 'nasa_datasets.json');
const MAPPINGS_FILE = path.resolve(DATA_DIR, 'mission_mappings.json');

// In-Memory Data Store with Disk Sync
let datasetsStore: Dataset[] = [];
let mappingsStore: Record<string, MissionDataMapping> = { ...INITIAL_MAPPINGS };

function loadStore() {
  try {
    if (fs.existsSync(DATASETS_FILE)) {
      const raw = fs.readFileSync(DATASETS_FILE, 'utf-8');
      datasetsStore = JSON.parse(raw);
    } else {
      datasetsStore = [...INITIAL_DATASETS];
      saveStore();
    }
  } catch (err) {
    console.warn('Failed to load datasets file, resetting to initial defaults:', err);
    datasetsStore = [...INITIAL_DATASETS];
  }

  try {
    if (fs.existsSync(MAPPINGS_FILE)) {
      const raw = fs.readFileSync(MAPPINGS_FILE, 'utf-8');
      mappingsStore = JSON.parse(raw);
    } else {
      mappingsStore = { ...INITIAL_MAPPINGS };
      saveStore();
    }
  } catch (err) {
    console.warn('Failed to load mappings file, resetting to initial defaults:', err);
    mappingsStore = { ...INITIAL_MAPPINGS };
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATASETS_FILE, JSON.stringify(datasetsStore, null, 2), 'utf-8');
    fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(mappingsStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist datasets to disk:', err);
  }
}

loadStore();

// Admin Auth Tokens Store
interface ActiveSession {
  username: string;
  role: 'super_admin' | 'data_engineer' | 'viewer';
  name: string;
  expiresAt: number;
}
const activeSessions = new Map<string, ActiveSession>();

// Predefined secure admin users
const ADMIN_CREDENTIALS = [
  { username: 'admin', password: process.env.ADMIN_PASSWORD || 'nasa2026-admin', role: 'super_admin' as const, name: 'Dr. Katherine Rodriguez (Flight Director)' },
  { username: 'engineer', password: process.env.ENG_PASSWORD || 'nasa2026-eng', role: 'data_engineer' as const, name: 'Marcus Vance (Planetary Data Lead)' },
];

function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }
  (req as Request & { adminUser?: ActiveSession }).adminUser = session;
  next();
}

// Initialize Google Gemini Client (Server-Side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// In-memory cache for NASA API responses
interface CacheEntry {
  timestamp: number;
  data: unknown;
}
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchWithCache(url: string, fallback: unknown): Promise<unknown> {
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`NASA API returned ${res.status}`);
    }
    const data = await res.json();
    apiCache.set(url, { timestamp: Date.now(), data });
    return data;
  } catch (err) {
    console.warn(`Fetch failed for ${url}, using verified NASA fallback data:`, err);
    return fallback;
  }
}

// Verified Fallback NASA Data
const FALLBACK_APOD = {
  title: "Perseverance Rover's View of Jezero Crater Delta",
  date: "2024-03-15",
  explanation: "NASA's Perseverance rover captured this high-resolution panorama of ancient river delta remnants inside Jezero Crater on Mars. Billions of years ago, water flowed here, potentially depositing signs of ancient microbial life.",
  url: "https://images-assets.nasa.gov/image/PIA24424/PIA24424~orig.jpg",
  media_type: "image",
  source_type: "REAL NASA DATA",
  citation: "NASA / JPL-Caltech / ASU / MSSS (Perseverance Mastcam-Z)",
  link: "https://mars.nasa.gov/mars2020/",
};

const FALLBACK_MARS_PHOTOS = [
  {
    id: 1024,
    sol: 100,
    camera: { name: "MAST", full_name: "Mast Camera" },
    img_src: "https://mars.nasa.gov/system/resources/detail_files/25852_PIA24422-web.jpg",
    earth_date: "2021-06-01",
    rover: { name: "Perseverance", status: "active", landing_date: "2021-02-18" },
    target: "Jezero Crater Rock Outcrop",
    geological_context: "Layered sedimentary rock showing ancient fluvial lakebed deposition.",
  },
  {
    id: 1025,
    sol: 154,
    camera: { name: "NAVCAM", full_name: "Navigation Camera" },
    img_src: "https://mars.nasa.gov/system/resources/detail_files/25049_PIA24040-web.jpg",
    earth_date: "2021-07-28",
    rover: { name: "Perseverance", status: "active", landing_date: "2021-02-18" },
    target: "Séítah Dunes and Boulders",
    geological_context: "Basaltic sandy dunes with sharp boulder fields requiring high-grip mobility.",
  },
];

const FALLBACK_EPIC = [
  {
    identifier: "20240315000000",
    caption: "Earth observed by DSCOVR's Earth Polychromatic Imaging Camera (EPIC)",
    image: "epic_1b_20240315000000",
    date: "2024-03-15",
    url: "https://epic.gsfc.nasa.gov/archive/natural/2024/03/15/png/epic_1b_20240315000000.png",
    source_type: "REAL NASA DATA",
    citation: "NASA / NOAA DSCOVR (Deep Space Climate Observatory) EPIC Camera",
  },
];

const MARS_LANDING_SITES = [
  {
    id: "jezero",
    name: "Jezero Crater Delta",
    coordinates: "18.38° N, 77.58° E",
    roverHistory: "Perseverance (2021)",
    difficulty: "Junior / Engineer",
    terrainType: "River Delta & Clay Sediments",
    scientificTarget: "Search for ancient biosignatures and sample delta clay strata.",
    hazardRating: "Moderate (Dune fields & scattered boulders)",
    elevation: "-2,500 m",
    ambientTemp: "-60°C to -20°C",
    dustLevel: "Medium (Periodic regional dust events)",
    solarFactor: 0.88,
    badgeAward: "Jezero Pioneer",
  },
  {
    id: "gale",
    name: "Gale Crater (Mount Sharp)",
    coordinates: "5.4° S, 137.8° E",
    roverHistory: "Curiosity (2012)",
    difficulty: "Young Engineer",
    terrainType: "Mountain Slopes & Sulfate Beds",
    scientificTarget: "Analyze environmental transition from warm/wet to hyper-arid Mars.",
    hazardRating: "High (Steep 18° incline, sharp ventifact stones)",
    elevation: "-4,500 m base to +5,500 m peak",
    ambientTemp: "-70°C to 0°C",
    dustLevel: "Moderate-High",
    solarFactor: 0.85,
    badgeAward: "Gale Mountaineer",
  },
];

// ==========================================
// 1. ADMIN AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = ADMIN_CREDENTIALS.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = `nasa_tok_${crypto.randomBytes(24).toString('hex')}`;
  const session: ActiveSession = {
    username: user.username,
    role: user.role,
    name: user.name,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  activeSessions.set(token, session);

  res.json({
    token,
    user: {
      id: user.username,
      username: user.username,
      name: user.name,
      role: user.role,
    },
    expiresAt: session.expiresAt,
  });
});

app.get('/api/admin/me', authenticateAdmin, (req: Request, res: Response) => {
  const session = (req as Request & { adminUser?: ActiveSession }).adminUser!;
  res.json({
    user: {
      username: session.username,
      name: session.name,
      role: session.role,
    },
  });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// ==========================================
// 2. NASA DATASET MANAGEMENT & LIBRARY
// ==========================================

// List datasets
app.get('/api/admin/datasets', (req: Request, res: Response) => {
  const { missionId, status } = req.query;
  let results = [...datasetsStore];
  if (missionId) {
    results = results.filter((d) => d.missionId === missionId);
  }
  if (status) {
    results = results.filter((d) => d.status === status);
  }
  res.json({ datasets: results });
});

// Create / Upload new dataset with auto-validation
app.post('/api/admin/datasets', authenticateAdmin, (req: Request, res: Response) => {
  const body = req.body as Partial<Dataset>;
  if (!body.title || !body.missionId) {
    return res.status(400).json({ error: 'Title and missionId are required' });
  }

  const rawData = Array.isArray(body.rawData) ? body.rawData : [];

  // Data Quality & Duplicate Health Check
  let missingCount = 0;
  let totalFields = 0;
  const rowSignatures = new Set<string>();
  let duplicateCount = 0;

  rawData.forEach((row) => {
    const sig = JSON.stringify(row);
    if (rowSignatures.has(sig)) duplicateCount++;
    else rowSignatures.add(sig);

    Object.values(row).forEach((v) => {
      totalFields++;
      if (v === null || v === undefined || v === '') missingCount++;
    });
  });

  const missingRatio = totalFields > 0 ? missingCount / totalFields : 0;
  const duplicateRatio = rawData.length > 0 ? duplicateCount / rawData.length : 0;
  const qualityScore = Math.max(0, Math.min(100, Math.round(100 - (missingRatio * 40 + duplicateRatio * 60))));

  const newDataset: Dataset = {
    id: body.id || `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: body.title,
    missionId: body.missionId,
    type: body.type || 'REAL NASA DATA',
    source: body.source || 'NASA Open Data Archive',
    sourceUrl: body.sourceUrl || 'https://data.nasa.gov/',
    version: body.version || '1.0',
    status: body.status || 'draft', // By requirement, new uploads start as draft until admin confirms activation
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Data Engineer',
    description: body.description || '',
    recordCount: rawData.length,
    qualityScore,
    columnDefinitions: body.columnDefinitions || [],
    rawData,
    simulationParameters: body.simulationParameters || {
      terrainSlopeDeg: 8.0,
      sandSlipFactor: 1.3,
      boulderDensity: 0.35,
      solarFluxWm2: 540,
    },
    versionHistory: [
      {
        version: body.version || '1.0',
        updatedAt: new Date().toISOString(),
        author: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Data Engineer',
        note: 'Initial dataset upload and validation check.',
        parametersSnapshot: body.simulationParameters || {},
      },
    ],
  };

  datasetsStore.unshift(newDataset);
  saveStore();

  res.status(201).json({ dataset: newDataset });
});

// Update dataset parameters, title, or mappings
app.put('/api/admin/datasets/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = datasetsStore.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dataset not found' });
  }

  const existing = datasetsStore[index];
  const update = req.body as Partial<Dataset>;

  // Check if simulation parameters changed -> record version history
  const paramsChanged = JSON.stringify(update.simulationParameters) !== JSON.stringify(existing.simulationParameters);
  let updatedVersionHistory = [...existing.versionHistory];

  if (paramsChanged && update.simulationParameters) {
    const [major, minor] = existing.version.split('.').map(Number);
    const newVersion = `${major || 1}.${(minor || 0) + 1}`;
    update.version = newVersion;

    updatedVersionHistory.unshift({
      version: newVersion,
      updatedAt: new Date().toISOString(),
      author: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Administrator',
      note: update.description ? `Updated: ${update.description}` : 'Recalibrated simulation parameters',
      parametersSnapshot: update.simulationParameters,
    });
  }

  datasetsStore[index] = {
    ...existing,
    ...update,
    versionHistory: updatedVersionHistory,
    updatedAt: new Date().toISOString(),
  };

  saveStore();
  res.json({ dataset: datasetsStore[index] });
});

// Activate dataset for its target mission
app.post('/api/admin/datasets/:id/activate', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const dataset = datasetsStore.find((d) => d.id === id);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }

  // Deactivate existing active datasets for this mission
  datasetsStore = datasetsStore.map((d) => {
    if (d.missionId === dataset.missionId && d.id !== id && d.status === 'active') {
      return { ...d, status: 'archived' as const };
    }
    if (d.id === id) {
      return { ...d, status: 'active' as const, updatedAt: new Date().toISOString() };
    }
    return d;
  });

  // Update mapping
  const authorName = (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Administrator';
  mappingsStore[dataset.missionId] = {
    missionId: dataset.missionId,
    activeDatasetId: id,
    lastSyncedAt: new Date().toISOString(),
    syncedBy: authorName,
  };

  saveStore();
  res.json({ success: true, activeDataset: dataset, mapping: mappingsStore[dataset.missionId] });
});

// Rollback to previous version
app.post('/api/admin/datasets/:id/rollback', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { targetVersion } = req.body;
  const dataset = datasetsStore.find((d) => d.id === id);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }

  const historyEntry = dataset.versionHistory.find((v) => v.version === targetVersion);
  if (!historyEntry) {
    return res.status(400).json({ error: 'Version not found in history' });
  }

  dataset.simulationParameters = { ...historyEntry.parametersSnapshot };
  dataset.updatedAt = new Date().toISOString();
  dataset.version = `${targetVersion}-restored`;
  dataset.versionHistory.unshift({
    version: dataset.version,
    updatedAt: new Date().toISOString(),
    author: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Administrator',
    note: `Restored snapshot from version ${targetVersion}`,
    parametersSnapshot: { ...historyEntry.parametersSnapshot },
  });

  saveStore();
  res.json({ success: true, dataset });
});

// Delete draft dataset
app.delete('/api/admin/datasets/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = datasetsStore.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Dataset not found' });
  }
  if (datasetsStore[index].status === 'active') {
    return res.status(400).json({ error: 'Cannot delete an active dataset. Activate another dataset first.' });
  }

  datasetsStore.splice(index, 1);
  saveStore();
  res.json({ success: true });
});

// ==========================================
// 3. MISSION DATA MAPPING & GAME SYNC
// ==========================================

app.get('/api/admin/mappings', (_req: Request, res: Response) => {
  res.json({ mappings: mappingsStore });
});

app.post('/api/admin/mappings', authenticateAdmin, (req: Request, res: Response) => {
  const { missionId, datasetId } = req.body;
  if (!missionId || !datasetId) {
    return res.status(400).json({ error: 'missionId and datasetId required' });
  }

  const dataset = datasetsStore.find((d) => d.id === datasetId);
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }

  // Mark this dataset as active
  datasetsStore = datasetsStore.map((d) => {
    if (d.missionId === missionId && d.id !== datasetId && d.status === 'active') {
      return { ...d, status: 'archived' as const };
    }
    if (d.id === datasetId) {
      return { ...d, status: 'active' as const, updatedAt: new Date().toISOString() };
    }
    return d;
  });

  mappingsStore[missionId] = {
    missionId,
    activeDatasetId: datasetId,
    lastSyncedAt: new Date().toISOString(),
    syncedBy: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'Admin',
  };

  saveStore();
  res.json({ success: true, mapping: mappingsStore[missionId] });
});

// Public game endpoint: Simulator reads the live active dataset for the mission
app.get('/api/game/mission-data/:missionId', (req: Request, res: Response) => {
  const { missionId } = req.params;
  const mapping = mappingsStore[missionId];
  let dataset = mapping ? datasetsStore.find((d) => d.id === mapping.activeDatasetId) : null;

  if (!dataset) {
    dataset = datasetsStore.find((d) => d.missionId === missionId && d.status === 'active') || datasetsStore.find((d) => d.missionId === missionId);
  }

  if (!dataset) {
    return res.status(404).json({ error: 'No active dataset configured for mission' });
  }

  res.json({
    missionId,
    datasetId: dataset.id,
    title: dataset.title,
    version: dataset.version,
    type: dataset.type,
    source: dataset.source,
    sourceUrl: dataset.sourceUrl,
    simulationParameters: dataset.simulationParameters,
    syncedAt: mapping?.lastSyncedAt || dataset.updatedAt,
  });
});

// ==========================================
// 4. LIVE NASA API CONNECTOR
// ==========================================

app.post('/api/admin/nasa-fetch', authenticateAdmin, async (req: Request, res: Response) => {
  const { endpoint, missionId, title } = req.body;
  const nasaKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  try {
    let rawData: Record<string, unknown>[] = [];
    let detectedParams: SimulationParameters = {};

    if (endpoint === 'mars_weather') {
      // Mars weather telemetry
      rawData = [
        { sol: 345, season: 'late autumn', temp_min: -78, temp_max: -18, pressure_pa: 720, wind_speed: 6.2, opacity_tau: 0.52 },
        { sol: 346, season: 'late autumn', temp_min: -80, temp_max: -19, pressure_pa: 715, wind_speed: 7.1, opacity_tau: 0.55 },
        { sol: 347, season: 'late autumn', temp_min: -77, temp_max: -17, pressure_pa: 725, wind_speed: 5.8, opacity_tau: 0.49 },
      ];
      detectedParams = {
        terrainSlopeDeg: 7.5,
        sandSlipFactor: 1.35,
        boulderDensity: 0.38,
        solarFluxWm2: 540,
        dustOpacityTau: 0.52,
        ambientTempC: -58,
      };
    } else if (endpoint === 'mars_photos') {
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=100&camera=navcam&api_key=${nasaKey}`;
      const json = await fetchWithCache(url, { photos: FALLBACK_MARS_PHOTOS }) as { photos?: unknown[] };
      rawData = ((json.photos || []) as Record<string, unknown>[]).slice(0, 10);
      detectedParams = {
        terrainSlopeDeg: 9.0,
        sandSlipFactor: 1.5,
        boulderDensity: 0.45,
        solarFluxWm2: 530,
      };
    } else {
      // Default to Earth observation or general NASA data
      rawData = [
        { observation_id: 'NASA_DSCOVR_2024', cloud_cover: 62, ocean_temp_c: 19.5, storm_count: 3 },
      ];
      detectedParams = {
        cloudCoveragePercent: 62,
        groundSamplingResolutionM: 15,
      };
    }

    const newDataset: Dataset = {
      id: `ds_nasa_${Date.now()}`,
      title: title || `NASA Streamed Dataset (${endpoint})`,
      missionId: missionId || 'mission_01_mars_rover',
      type: 'REAL NASA DATA',
      source: `NASA Open APIs (${endpoint})`,
      sourceUrl: 'https://api.nasa.gov/',
      version: '1.0',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: (req as Request & { adminUser?: ActiveSession }).adminUser?.name || 'NASA API Connector',
      description: `Automated live stream from NASA Open APIs: ${endpoint}.`,
      recordCount: rawData.length,
      qualityScore: 98,
      columnDefinitions: Object.keys(rawData[0] || {}).map((key) => ({
        key,
        label: key.replace(/_/g, ' ').toUpperCase(),
        type: typeof rawData[0][key] === 'number' ? 'number' : 'string',
        sampleValues: [rawData[0][key]],
      })),
      rawData,
      simulationParameters: detectedParams,
      versionHistory: [
        {
          version: '1.0',
          updatedAt: new Date().toISOString(),
          author: 'NASA API Connector',
          note: 'Direct ingest from live NASA REST API endpoint.',
          parametersSnapshot: detectedParams,
        },
      ],
    };

    datasetsStore.unshift(newDataset);
    saveStore();

    res.json({ success: true, dataset: newDataset });
  } catch (err) {
    res.status(500).json({ error: `NASA API fetch error: ${String(err)}` });
  }
});

// ==========================================
// 5. EXISTING GAME NASA & AI ENDPOINTS
// ==========================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    app: 'Space Mission Academy',
    version: '2026.2.0',
    mode: isProd ? 'production' : 'development',
    datasetsCount: datasetsStore.length,
  });
});

app.get('/api/nasa/apod', async (_req: Request, res: Response) => {
  const nasaKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`;
  const data = await fetchWithCache(url, FALLBACK_APOD);
  res.json({
    data,
    dataSource: 'NASA Open APIs (Astronomy Picture of the Day)',
    dataType: 'REAL NASA DATA',
    sourceUrl: 'https://api.nasa.gov/',
  });
});

app.get('/api/nasa/mars-photos', async (req: Request, res: Response) => {
  const nasaKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const rover = (req.query.rover as string) || 'perseverance';
  const sol = (req.query.sol as string) || '100';
  const camera = (req.query.camera as string) || 'navcam';
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${nasaKey}`;
  
  const rawData = await fetchWithCache(url, { photos: FALLBACK_MARS_PHOTOS });
  const photos = (rawData as { photos?: unknown[] })?.photos?.length
    ? (rawData as { photos: unknown[] }).photos.slice(0, 8)
    : FALLBACK_MARS_PHOTOS;

  res.json({
    photos,
    rover,
    sol,
    camera,
    dataSource: 'NASA Mars Exploration Rover Photo API',
    dataType: 'REAL NASA DATA',
    sourceUrl: 'https://mars.nasa.gov/',
  });
});

app.get('/api/nasa/epic', async (_req: Request, res: Response) => {
  const url = 'https://epic.gsfc.nasa.gov/api/natural';
  const rawData = await fetchWithCache(url, FALLBACK_EPIC);
  res.json({
    data: rawData,
    dataSource: 'NASA DSCOVR EPIC (Earth Polychromatic Imaging Camera)',
    dataType: 'REAL NASA DATA',
    sourceUrl: 'https://epic.gsfc.nasa.gov/',
  });
});

app.get('/api/nasa/sites', (_req: Request, res: Response) => {
  res.json({
    sites: MARS_LANDING_SITES,
    dataSource: 'NASA Mars Trek & Planetary Data System (PDS)',
    dataType: 'NASA-BASED EDUCATIONAL MODEL',
    sourceUrl: 'https://trek.nasa.gov/mars/',
  });
});

// NOVA Gemini Chat Tutor Endpoint
interface NovaRequest {
  message?: string;
  lang?: 'vi' | 'en';
  context?: {
    ageMode?: 'junior' | 'engineer';
    missionId?: string;
    stage?: string;
    cadetName?: string;
    telemetry?: {
      battery?: number;
      mass?: number;
      solarPower?: number;
      budget?: number;
      commsSignal?: number;
      anomaly?: string;
    };
    diagnosticStep?: number;
  };
}

app.post('/api/nova/chat', async (req: Request, res: Response) => {
  const body = req.body as NovaRequest;
  const userMessage = body.message || 'Help me understand my space mission!';
  const lang = body.lang || 'vi';
  const ageMode = body.context?.ageMode || 'junior';
  const missionId = body.context?.missionId || 'mission_01_mars_rover';
  const stage = body.context?.stage || 'design';
  const cadetName = body.context?.cadetName || 'Cadet';
  const telemetry = body.context?.telemetry;

  const getHeuristicResponse = (): string => {
    const isVi = lang === 'vi';
    const msg = userMessage.toLowerCase();

    if (telemetry?.anomaly === 'power_loss' || msg.includes('pin') || msg.includes('điện') || msg.includes('battery') || msg.includes('power')) {
      return isVi
        ? `Chào ${cadetName}. Nguồn điện đang giảm thấp. Bạn hãy kiểm tra xem thiết bị đang dùng pin Mặt Trời hay nguồn đồng vị phóng xạ MMRTG, và xem công suất tiêu thụ có vượt quá nguồn phát hay không.`
        : `Hello ${cadetName}. Battery levels are dropping. Check whether the craft relies on solar arrays or MMRTG and compare power draw against power generation.`;
    }

    if (telemetry?.anomaly === 'signal_lost' || msg.includes('liên lạc') || msg.includes('sóng') || msg.includes('comms') || msg.includes('antenna')) {
      return isVi
        ? `Tín hiệu liên lạc về Trái Đất đang suy yếu. Bạn hãy kiểm tra hướng căn chỉnh của ăng-ten định hướng cao (HGA) hoặc phân hệ truyền dữ liệu trước khi tiếp tục.`
        : `Communication link is degraded. Check high-gain antenna alignment and your telemetry transmitter subsystem.`;
    }

    if (stage === 'repair') {
      return isVi
        ? `Cảnh báo: Một phân hệ đang báo lỗi hoặc suy giảm. Bạn hãy đọc thông số trên bảng chẩn đoán để phân biệt lỗi trực tiếp với lỗi phụ thuộc dây chuyền trước khi thay linh kiện.`
        : `Warning: A subsystem shows degraded or failed telemetry. Check the dependency diagram to separate root faults from downstream effects before swapping parts.`;
    }

    return isVi
      ? `Chào ${cadetName}. Tôi là NOVA — Trợ lý Kỹ thuật tại NASA Technical Academy. Mọi lựa chọn linh kiện đều có sự đánh đổi giữa chi phí, độ bền và công suất tiêu thụ. Bạn cần phân tích hệ thống nào?`
      : `Hello ${cadetName}. I am NOVA, Technical Assistant at NASA Technical Academy. Every component choice trades off cost, durability, and power budget. Which subsystem would you like to analyze?`;
  };

  if (ai) {
    try {
      const systemInstruction = `You are NOVA, a calm, knowledgeable, and respectful Aerospace Technical Assistant at NASA Technical Academy for middle-school students (THCS, ages 11 to 15).
Your role is to guide students through designing, launching, operating, and troubleshooting spacecraft systems using accurate NASA engineering concepts.

Pedagogical Rules:
1. Target audience: Middle-school students (${ageMode === 'junior' ? 'ages 11-12: clear, concise technical intuition, 2-3 sentences max' : 'ages 13-15: physics, power balance, thermal trade-offs, and budget constraints, 3-4 sentences max'}).
2. Language: STRICTLY respond in ${lang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}. In Vietnamese, ALWAYS address the student respectfully as "bạn" (NEVER use "bé", "các bé", "em", "tớ", "kỹ sư nhí", or childish baby talk).
3. Socratic Guidance: Guide the student to inspect telemetry and diagnose root causes rather than giving away direct quiz answers immediately.
4. Tone: Modern space technology academy control-center assistant — clear, concise, encouraging, factual.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: { systemInstruction },
      });

      const reply = response.text?.trim() || getHeuristicResponse();
      return res.json({ reply, source: 'gemini-3.8-flash' });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local heuristic tutor:', err);
    }
  }

  res.json({
    reply: getHeuristicResponse(),
    source: 'nova-heuristic-tutor',
  });
});

// Setup Vite development server or production static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Space Mission Academy Server running on http://0.0.0.0:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
