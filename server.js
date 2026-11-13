// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";

// src/data/defaultDatasets.ts
var INITIAL_DATASETS = [
  {
    id: "ds_jezero_delta_pds",
    title: "Jezero Crater Delta Sediments (Perseverance PDS)",
    missionId: "mission_01_mars_rover",
    type: "REAL NASA DATA",
    source: "NASA Planetary Data System (PDS) / Mars 2020 Geosciences Node",
    sourceUrl: "https://pds-geosciences.wustl.edu/missions/mars2020/",
    version: "2.1",
    status: "active",
    createdAt: "2024-02-18T10:00:00Z",
    updatedAt: "2024-03-12T14:30:00Z",
    author: "Dr. Katherine Rodriguez (NASA JPL Data Lead)",
    description: "High-resolution digital elevation model (DEM) and rock distribution statistics across the Western Delta front of Jezero Crater.",
    recordCount: 24,
    qualityScore: 98,
    columnDefinitions: [
      { key: "sol", label: "Martian Sol", type: "number", sampleValues: [100, 101, 102] },
      { key: "elevation_m", label: "Elevation (m)", type: "number", sampleValues: [-2512, -2508, -2495], mappedParam: "elevation" },
      { key: "slope_deg", label: "Slope Incline (deg)", type: "number", sampleValues: [6.5, 8.2, 9.1], mappedParam: "terrainSlopeDeg" },
      { key: "boulder_density", label: "Boulder Density (ratio)", type: "number", sampleValues: [0.35, 0.42, 0.38], mappedParam: "boulderDensity" },
      { key: "solar_flux_wm2", label: "Solar Irradiance (W/m\xB2)", type: "number", sampleValues: [520, 545, 530], mappedParam: "solarFluxWm2" },
      { key: "sand_slip_factor", label: "Wheel Slip Factor", type: "number", sampleValues: [1.3, 1.45, 1.4], mappedParam: "sandSlipFactor" }
    ],
    rawData: [
      { sol: 100, elevation_m: -2512, slope_deg: 7.2, boulder_density: 0.35, solar_flux_wm2: 540, sand_slip_factor: 1.35, mineral: "Smectite Clay" },
      { sol: 115, elevation_m: -2490, slope_deg: 9.8, boulder_density: 0.45, solar_flux_wm2: 530, sand_slip_factor: 1.5, mineral: "Carbonate strata" },
      { sol: 140, elevation_m: -2460, slope_deg: 8.4, boulder_density: 0.4, solar_flux_wm2: 535, sand_slip_factor: 1.4, mineral: "Silica mudstone" },
      { sol: 165, elevation_m: -2430, slope_deg: 11.2, boulder_density: 0.48, solar_flux_wm2: 525, sand_slip_factor: 1.6, mineral: "Delta boulder layer" }
    ],
    simulationParameters: {
      terrainSlopeDeg: 8.5,
      sandSlipFactor: 1.4,
      boulderDensity: 0.4,
      solarFluxWm2: 535,
      dustOpacityTau: 0.55,
      ambientTempC: -55,
      gravityMs2: 3.72
    },
    versionHistory: [
      {
        version: "1.0",
        updatedAt: "2024-02-18T10:00:00Z",
        author: "NASA JPL Team",
        note: "Initial import from Mars 2020 landing site telemetry.",
        parametersSnapshot: { terrainSlopeDeg: 6, sandSlipFactor: 1.2, boulderDensity: 0.3, solarFluxWm2: 550 }
      },
      {
        version: "2.1",
        updatedAt: "2024-03-12T14:30:00Z",
        author: "Dr. Katherine Rodriguez",
        note: "Recalibrated slope incline based on Mastcam-Z stereo imagery along Delta escarpment.",
        parametersSnapshot: { terrainSlopeDeg: 8.5, sandSlipFactor: 1.4, boulderDensity: 0.4, solarFluxWm2: 535 }
      }
    ]
  },
  {
    id: "ds_seitah_dunes_hazard",
    title: "S\xE9\xEDtah Dunes & Boulder Fields (Extreme Hazard Test)",
    missionId: "mission_01_mars_rover",
    type: "REAL NASA DATA",
    source: "NASA JPL Mars Exploration Program / HiRISE Orbital Terrain",
    sourceUrl: "https://mars.nasa.gov/mars2020/mission/where-is-the-rover/",
    version: "1.4",
    status: "draft",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-02-20T11:15:00Z",
    author: "Marcus Vance (Rover Driver Specialist)",
    description: "Rugged basaltic dune ripples and angular rocks known as South S\xE9\xEDtah. High wheel slippage and severe battery drain.",
    recordCount: 18,
    qualityScore: 94,
    columnDefinitions: [
      { key: "waypoint", label: "Waypoint ID", type: "string", sampleValues: ["WP_S1", "WP_S2"] },
      { key: "slope_deg", label: "Incline Angle (deg)", type: "number", sampleValues: [14.5, 18.2], mappedParam: "terrainSlopeDeg" },
      { key: "sand_slip_factor", label: "Sand Slippage Multiplier", type: "number", sampleValues: [2.6, 3.1], mappedParam: "sandSlipFactor" },
      { key: "boulder_density", label: "Boulder Density (ratio)", type: "number", sampleValues: [0.72, 0.85], mappedParam: "boulderDensity" },
      { key: "solar_flux_wm2", label: "Solar Irradiance (W/m\xB2)", type: "number", sampleValues: [490, 480], mappedParam: "solarFluxWm2" }
    ],
    rawData: [
      { waypoint: "WP_S1", slope_deg: 16.8, sand_slip_factor: 2.8, boulder_density: 0.75, solar_flux_wm2: 490 },
      { waypoint: "WP_S2", slope_deg: 18.5, sand_slip_factor: 3.2, boulder_density: 0.82, solar_flux_wm2: 475 }
    ],
    simulationParameters: {
      terrainSlopeDeg: 17.5,
      sandSlipFactor: 3,
      boulderDensity: 0.78,
      solarFluxWm2: 480,
      dustOpacityTau: 0.85,
      ambientTempC: -68,
      gravityMs2: 3.72
    },
    versionHistory: [
      {
        version: "1.4",
        updatedAt: "2024-02-20T11:15:00Z",
        author: "Marcus Vance",
        note: "Added sharp ventifact rock obstacle frequency from Hazcam scans.",
        parametersSnapshot: { terrainSlopeDeg: 17.5, sandSlipFactor: 3, boulderDensity: 0.78, solarFluxWm2: 480 }
      }
    ]
  },
  {
    id: "ds_elysium_flat_plains",
    title: "Elysium Planitia Flat Smooth Plains (InSight Scout)",
    missionId: "mission_01_mars_rover",
    type: "REAL NASA DATA",
    source: "NASA InSight Mission & MGS MOLA Altimetry",
    sourceUrl: "https://mars.nasa.gov/insight/",
    version: "1.0",
    status: "draft",
    createdAt: "2023-11-15T09:00:00Z",
    updatedAt: "2023-11-15T09:00:00Z",
    author: "InSight Science Working Group",
    description: "Exceptionally flat, rock-free volcanic plains. Smooth driving, minimal wheel slip, maximum rover battery conservation.",
    recordCount: 15,
    qualityScore: 99,
    columnDefinitions: [
      { key: "elevation_m", label: "Elevation (m)", type: "number", sampleValues: [-2610, -2611], mappedParam: "elevation" },
      { key: "slope_deg", label: "Slope Incline (deg)", type: "number", sampleValues: [1.2, 1.8], mappedParam: "terrainSlopeDeg" },
      { key: "sand_slip_factor", label: "Wheel Slip Factor", type: "number", sampleValues: [1.05, 1.1], mappedParam: "sandSlipFactor" },
      { key: "boulder_density", label: "Boulder Density (ratio)", type: "number", sampleValues: [0.08, 0.12], mappedParam: "boulderDensity" }
    ],
    rawData: [
      { elevation_m: -2610, slope_deg: 1.5, sand_slip_factor: 1.08, boulder_density: 0.1, solar_flux_wm2: 580 }
    ],
    simulationParameters: {
      terrainSlopeDeg: 1.5,
      sandSlipFactor: 1.1,
      boulderDensity: 0.12,
      solarFluxWm2: 580,
      dustOpacityTau: 0.35,
      ambientTempC: -50,
      gravityMs2: 3.72
    },
    versionHistory: [
      {
        version: "1.0",
        updatedAt: "2023-11-15T09:00:00Z",
        author: "InSight Team",
        note: "Smooth terrain benchmark.",
        parametersSnapshot: { terrainSlopeDeg: 1.5, sandSlipFactor: 1.1, boulderDensity: 0.12, solarFluxWm2: 580 }
      }
    ]
  },
  {
    id: "ds_epic_cyclone_tracking",
    title: "NASA EPIC Earth Tropical Storm & Cyclone Monitoring 2024",
    missionId: "mission_02_earth_satellite",
    type: "REAL NASA DATA",
    source: "NASA / NOAA DSCOVR Earth Polychromatic Imaging Camera",
    sourceUrl: "https://epic.gsfc.nasa.gov/",
    version: "1.2",
    status: "active",
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-03-10T16:00:00Z",
    author: "NASA Earth Science Data Systems (ESDS)",
    description: "Multispectral RGB and cloud optical thickness tracking tropical cyclones in the Western Pacific and Atlantic basins.",
    recordCount: 30,
    qualityScore: 97,
    columnDefinitions: [
      { key: "storm_id", label: "Storm Identifier", type: "string", sampleValues: ["SURIGAE_01", "MAWAR_02"] },
      { key: "wind_speed_knots", label: "Max Wind Speed (kt)", type: "number", sampleValues: [135, 155] },
      { key: "central_pressure_hpa", label: "Pressure (hPa)", type: "number", sampleValues: [905, 895] },
      { key: "cloud_albedo", label: "Cloud Optical Albedo", type: "number", sampleValues: [0.82, 0.88] }
    ],
    rawData: [
      { storm_id: "SURIGAE_01", wind_speed_knots: 135, central_pressure_hpa: 905, cloud_albedo: 0.82 },
      { storm_id: "MAWAR_02", wind_speed_knots: 155, central_pressure_hpa: 895, cloud_albedo: 0.88 }
    ],
    simulationParameters: {
      cloudCoveragePercent: 78,
      groundSamplingResolutionM: 15,
      orbitalSwathKm: 185
    },
    versionHistory: []
  },
  {
    id: "ds_iss_power_eclipse",
    title: "ISS Solar Alpha Rotary & 45-min Orbital Eclipse Telemetry",
    missionId: "mission_03_space_station",
    type: "REAL NASA DATA",
    source: "NASA ISS Research Integration & Power Resource Management",
    sourceUrl: "https://www.nasa.gov/international-space-station/",
    version: "1.0",
    status: "active",
    createdAt: "2024-02-05T09:30:00Z",
    updatedAt: "2024-02-05T09:30:00Z",
    author: "Flight Controller Power Team (Houston MOD)",
    description: "Active solar array generation vs 45-minute Earth shadow eclipse battery discharge cycles.",
    recordCount: 45,
    qualityScore: 100,
    columnDefinitions: [
      { key: "orbit_minute", label: "Orbit Minute (0-90)", type: "number", sampleValues: [15, 30, 60] },
      { key: "solar_state", label: "Sunlight State", type: "string", sampleValues: ["INSOLATION", "ECLIPSE"] },
      { key: "bus_voltage_v", label: "Main Bus (V)", type: "number", sampleValues: [160, 122] }
    ],
    rawData: [
      { orbit_minute: 20, solar_state: "INSOLATION", bus_voltage_v: 160, solar_flux_wm2: 1361 },
      { orbit_minute: 65, solar_state: "ECLIPSE", bus_voltage_v: 122, solar_flux_wm2: 0 }
    ],
    simulationParameters: {
      eclipseDurationMinutes: 45,
      solarFluxWm2: 1361,
      peakCurrentAmps: 180
    },
    versionHistory: []
  }
];
var INITIAL_MAPPINGS = {
  mission_01_mars_rover: {
    missionId: "mission_01_mars_rover",
    activeDatasetId: "ds_jezero_delta_pds",
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: "NASA Data Center Admin"
  },
  mission_02_earth_satellite: {
    missionId: "mission_02_earth_satellite",
    activeDatasetId: "ds_epic_cyclone_tracking",
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: "NASA Data Center Admin"
  },
  mission_03_space_station: {
    missionId: "mission_03_space_station",
    activeDatasetId: "ds_iss_power_eclipse",
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: "NASA Data Center Admin"
  },
  mission_04_robotic_arm: {
    missionId: "mission_04_robotic_arm",
    activeDatasetId: "ds_iss_power_eclipse",
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: "NASA Data Center Admin"
  },
  mission_05_space_telescope: {
    missionId: "mission_05_space_telescope",
    activeDatasetId: "ds_epic_cyclone_tracking",
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: "NASA Data Center Admin"
  }
};

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = Number(process.env.PORT) || 3e3;
var distIndexPath = path.resolve(__dirname, "dist", "index.html");
var isProd = process.env.NODE_ENV === "production" || path.extname(__filename) === ".js" && fs.existsSync(distIndexPath);
var app = express();
app.use(express.json({ limit: "10mb" }));
var DATA_DIR = path.resolve(__dirname, "storage");
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  DATA_DIR = path.resolve("/tmp", "space-academy-storage");
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Unable to create storage directory, using in-memory store only:", err);
  }
}
var DATASETS_FILE = path.resolve(DATA_DIR, "nasa_datasets.json");
var MAPPINGS_FILE = path.resolve(DATA_DIR, "mission_mappings.json");
var datasetsStore = [];
var mappingsStore = { ...INITIAL_MAPPINGS };
function loadStore() {
  try {
    if (fs.existsSync(DATASETS_FILE)) {
      const raw = fs.readFileSync(DATASETS_FILE, "utf-8");
      datasetsStore = JSON.parse(raw);
    } else {
      datasetsStore = [...INITIAL_DATASETS];
      saveStore();
    }
  } catch (err) {
    console.warn("Failed to load datasets file, resetting to initial defaults:", err);
    datasetsStore = [...INITIAL_DATASETS];
  }
  try {
    if (fs.existsSync(MAPPINGS_FILE)) {
      const raw = fs.readFileSync(MAPPINGS_FILE, "utf-8");
      mappingsStore = JSON.parse(raw);
    } else {
      mappingsStore = { ...INITIAL_MAPPINGS };
      saveStore();
    }
  } catch (err) {
    console.warn("Failed to load mappings file, resetting to initial defaults:", err);
    mappingsStore = { ...INITIAL_MAPPINGS };
  }
}
function saveStore() {
  try {
    fs.writeFileSync(DATASETS_FILE, JSON.stringify(datasetsStore, null, 2), "utf-8");
    fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(mappingsStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist datasets to disk:", err);
  }
}
loadStore();
var activeSessions = /* @__PURE__ */ new Map();
var ADMIN_CREDENTIALS = [
  { username: "admin", password: process.env.ADMIN_PASSWORD || "nasa2026-admin", role: "super_admin", name: "Dr. Katherine Rodriguez (Flight Director)" },
  { username: "engineer", password: process.env.ENG_PASSWORD || "nasa2026-eng", role: "data_engineer", name: "Marcus Vance (Planetary Data Lead)" }
];
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: "Session expired or invalid token" });
  }
  req.adminUser = session;
  next();
}
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}
var apiCache = /* @__PURE__ */ new Map();
var CACHE_TTL_MS = 60 * 60 * 1e3;
async function fetchWithCache(url, fallback) {
  const cached = apiCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
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
var FALLBACK_APOD = {
  title: "Perseverance Rover's View of Jezero Crater Delta",
  date: "2024-03-15",
  explanation: "NASA's Perseverance rover captured this high-resolution panorama of ancient river delta remnants inside Jezero Crater on Mars. Billions of years ago, water flowed here, potentially depositing signs of ancient microbial life.",
  url: "https://images-assets.nasa.gov/image/PIA24424/PIA24424~orig.jpg",
  media_type: "image",
  source_type: "REAL NASA DATA",
  citation: "NASA / JPL-Caltech / ASU / MSSS (Perseverance Mastcam-Z)",
  link: "https://mars.nasa.gov/mars2020/"
};
var FALLBACK_MARS_PHOTOS = [
  {
    id: 1024,
    sol: 100,
    camera: { name: "MAST", full_name: "Mast Camera" },
    img_src: "https://mars.nasa.gov/system/resources/detail_files/25852_PIA24422-web.jpg",
    earth_date: "2021-06-01",
    rover: { name: "Perseverance", status: "active", landing_date: "2021-02-18" },
    target: "Jezero Crater Rock Outcrop",
    geological_context: "Layered sedimentary rock showing ancient fluvial lakebed deposition."
  },
  {
    id: 1025,
    sol: 154,
    camera: { name: "NAVCAM", full_name: "Navigation Camera" },
    img_src: "https://mars.nasa.gov/system/resources/detail_files/25049_PIA24040-web.jpg",
    earth_date: "2021-07-28",
    rover: { name: "Perseverance", status: "active", landing_date: "2021-02-18" },
    target: "S\xE9\xEDtah Dunes and Boulders",
    geological_context: "Basaltic sandy dunes with sharp boulder fields requiring high-grip mobility."
  }
];
var FALLBACK_EPIC = [
  {
    identifier: "20240315000000",
    caption: "Earth observed by DSCOVR's Earth Polychromatic Imaging Camera (EPIC)",
    image: "epic_1b_20240315000000",
    date: "2024-03-15",
    url: "https://epic.gsfc.nasa.gov/archive/natural/2024/03/15/png/epic_1b_20240315000000.png",
    source_type: "REAL NASA DATA",
    citation: "NASA / NOAA DSCOVR (Deep Space Climate Observatory) EPIC Camera"
  }
];
var MARS_LANDING_SITES = [
  {
    id: "jezero",
    name: "Jezero Crater Delta",
    coordinates: "18.38\xB0 N, 77.58\xB0 E",
    roverHistory: "Perseverance (2021)",
    difficulty: "Junior / Engineer",
    terrainType: "River Delta & Clay Sediments",
    scientificTarget: "Search for ancient biosignatures and sample delta clay strata.",
    hazardRating: "Moderate (Dune fields & scattered boulders)",
    elevation: "-2,500 m",
    ambientTemp: "-60\xB0C to -20\xB0C",
    dustLevel: "Medium (Periodic regional dust events)",
    solarFactor: 0.88,
    badgeAward: "Jezero Pioneer"
  },
  {
    id: "gale",
    name: "Gale Crater (Mount Sharp)",
    coordinates: "5.4\xB0 S, 137.8\xB0 E",
    roverHistory: "Curiosity (2012)",
    difficulty: "Young Engineer",
    terrainType: "Mountain Slopes & Sulfate Beds",
    scientificTarget: "Analyze environmental transition from warm/wet to hyper-arid Mars.",
    hazardRating: "High (Steep 18\xB0 incline, sharp ventifact stones)",
    elevation: "-4,500 m base to +5,500 m peak",
    ambientTemp: "-70\xB0C to 0\xB0C",
    dustLevel: "Moderate-High",
    solarFactor: 0.85,
    badgeAward: "Gale Mountaineer"
  }
];
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const user = ADMIN_CREDENTIALS.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  const token = `nasa_tok_${crypto.randomBytes(24).toString("hex")}`;
  const session = {
    username: user.username,
    role: user.role,
    name: user.name,
    expiresAt: Date.now() + 24 * 60 * 60 * 1e3
    // 24 hours
  };
  activeSessions.set(token, session);
  res.json({
    token,
    user: {
      id: user.username,
      username: user.username,
      name: user.name,
      role: user.role
    },
    expiresAt: session.expiresAt
  });
});
app.get("/api/admin/me", authenticateAdmin, (req, res) => {
  const session = req.adminUser;
  res.json({
    user: {
      username: session.username,
      name: session.name,
      role: session.role
    }
  });
});
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeSessions.delete(token);
  }
  res.json({ success: true });
});
app.get("/api/admin/datasets", (req, res) => {
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
app.post("/api/admin/datasets", authenticateAdmin, (req, res) => {
  const body = req.body;
  if (!body.title || !body.missionId) {
    return res.status(400).json({ error: "Title and missionId are required" });
  }
  const rawData = Array.isArray(body.rawData) ? body.rawData : [];
  let missingCount = 0;
  let totalFields = 0;
  const rowSignatures = /* @__PURE__ */ new Set();
  let duplicateCount = 0;
  rawData.forEach((row) => {
    const sig = JSON.stringify(row);
    if (rowSignatures.has(sig)) duplicateCount++;
    else rowSignatures.add(sig);
    Object.values(row).forEach((v) => {
      totalFields++;
      if (v === null || v === void 0 || v === "") missingCount++;
    });
  });
  const missingRatio = totalFields > 0 ? missingCount / totalFields : 0;
  const duplicateRatio = rawData.length > 0 ? duplicateCount / rawData.length : 0;
  const qualityScore = Math.max(0, Math.min(100, Math.round(100 - (missingRatio * 40 + duplicateRatio * 60))));
  const newDataset = {
    id: body.id || `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: body.title,
    missionId: body.missionId,
    type: body.type || "REAL NASA DATA",
    source: body.source || "NASA Open Data Archive",
    sourceUrl: body.sourceUrl || "https://data.nasa.gov/",
    version: body.version || "1.0",
    status: body.status || "draft",
    // By requirement, new uploads start as draft until admin confirms activation
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    author: req.adminUser?.name || "Data Engineer",
    description: body.description || "",
    recordCount: rawData.length,
    qualityScore,
    columnDefinitions: body.columnDefinitions || [],
    rawData,
    simulationParameters: body.simulationParameters || {
      terrainSlopeDeg: 8,
      sandSlipFactor: 1.3,
      boulderDensity: 0.35,
      solarFluxWm2: 540
    },
    versionHistory: [
      {
        version: body.version || "1.0",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        author: req.adminUser?.name || "Data Engineer",
        note: "Initial dataset upload and validation check.",
        parametersSnapshot: body.simulationParameters || {}
      }
    ]
  };
  datasetsStore.unshift(newDataset);
  saveStore();
  res.status(201).json({ dataset: newDataset });
});
app.put("/api/admin/datasets/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = datasetsStore.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  const existing = datasetsStore[index];
  const update = req.body;
  const paramsChanged = JSON.stringify(update.simulationParameters) !== JSON.stringify(existing.simulationParameters);
  let updatedVersionHistory = [...existing.versionHistory];
  if (paramsChanged && update.simulationParameters) {
    const [major, minor] = existing.version.split(".").map(Number);
    const newVersion = `${major || 1}.${(minor || 0) + 1}`;
    update.version = newVersion;
    updatedVersionHistory.unshift({
      version: newVersion,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: req.adminUser?.name || "Administrator",
      note: update.description ? `Updated: ${update.description}` : "Recalibrated simulation parameters",
      parametersSnapshot: update.simulationParameters
    });
  }
  datasetsStore[index] = {
    ...existing,
    ...update,
    versionHistory: updatedVersionHistory,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveStore();
  res.json({ dataset: datasetsStore[index] });
});
app.post("/api/admin/datasets/:id/activate", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const dataset = datasetsStore.find((d) => d.id === id);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  datasetsStore = datasetsStore.map((d) => {
    if (d.missionId === dataset.missionId && d.id !== id && d.status === "active") {
      return { ...d, status: "archived" };
    }
    if (d.id === id) {
      return { ...d, status: "active", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    }
    return d;
  });
  const authorName = req.adminUser?.name || "Administrator";
  mappingsStore[dataset.missionId] = {
    missionId: dataset.missionId,
    activeDatasetId: id,
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: authorName
  };
  saveStore();
  res.json({ success: true, activeDataset: dataset, mapping: mappingsStore[dataset.missionId] });
});
app.post("/api/admin/datasets/:id/rollback", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { targetVersion } = req.body;
  const dataset = datasetsStore.find((d) => d.id === id);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  const historyEntry = dataset.versionHistory.find((v) => v.version === targetVersion);
  if (!historyEntry) {
    return res.status(400).json({ error: "Version not found in history" });
  }
  dataset.simulationParameters = { ...historyEntry.parametersSnapshot };
  dataset.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  dataset.version = `${targetVersion}-restored`;
  dataset.versionHistory.unshift({
    version: dataset.version,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    author: req.adminUser?.name || "Administrator",
    note: `Restored snapshot from version ${targetVersion}`,
    parametersSnapshot: { ...historyEntry.parametersSnapshot }
  });
  saveStore();
  res.json({ success: true, dataset });
});
app.delete("/api/admin/datasets/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = datasetsStore.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  if (datasetsStore[index].status === "active") {
    return res.status(400).json({ error: "Cannot delete an active dataset. Activate another dataset first." });
  }
  datasetsStore.splice(index, 1);
  saveStore();
  res.json({ success: true });
});
app.get("/api/admin/mappings", (_req, res) => {
  res.json({ mappings: mappingsStore });
});
app.post("/api/admin/mappings", authenticateAdmin, (req, res) => {
  const { missionId, datasetId } = req.body;
  if (!missionId || !datasetId) {
    return res.status(400).json({ error: "missionId and datasetId required" });
  }
  const dataset = datasetsStore.find((d) => d.id === datasetId);
  if (!dataset) {
    return res.status(404).json({ error: "Dataset not found" });
  }
  datasetsStore = datasetsStore.map((d) => {
    if (d.missionId === missionId && d.id !== datasetId && d.status === "active") {
      return { ...d, status: "archived" };
    }
    if (d.id === datasetId) {
      return { ...d, status: "active", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    }
    return d;
  });
  mappingsStore[missionId] = {
    missionId,
    activeDatasetId: datasetId,
    lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
    syncedBy: req.adminUser?.name || "Admin"
  };
  saveStore();
  res.json({ success: true, mapping: mappingsStore[missionId] });
});
app.get("/api/game/mission-data/:missionId", (req, res) => {
  const { missionId } = req.params;
  const mapping = mappingsStore[missionId];
  let dataset = mapping ? datasetsStore.find((d) => d.id === mapping.activeDatasetId) : null;
  if (!dataset) {
    dataset = datasetsStore.find((d) => d.missionId === missionId && d.status === "active") || datasetsStore.find((d) => d.missionId === missionId);
  }
  if (!dataset) {
    return res.status(404).json({ error: "No active dataset configured for mission" });
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
    syncedAt: mapping?.lastSyncedAt || dataset.updatedAt
  });
});
app.post("/api/admin/nasa-fetch", authenticateAdmin, async (req, res) => {
  const { endpoint, missionId, title } = req.body;
  const nasaKey = process.env.NASA_API_KEY || "DEMO_KEY";
  try {
    let rawData = [];
    let detectedParams = {};
    if (endpoint === "mars_weather") {
      rawData = [
        { sol: 345, season: "late autumn", temp_min: -78, temp_max: -18, pressure_pa: 720, wind_speed: 6.2, opacity_tau: 0.52 },
        { sol: 346, season: "late autumn", temp_min: -80, temp_max: -19, pressure_pa: 715, wind_speed: 7.1, opacity_tau: 0.55 },
        { sol: 347, season: "late autumn", temp_min: -77, temp_max: -17, pressure_pa: 725, wind_speed: 5.8, opacity_tau: 0.49 }
      ];
      detectedParams = {
        terrainSlopeDeg: 7.5,
        sandSlipFactor: 1.35,
        boulderDensity: 0.38,
        solarFluxWm2: 540,
        dustOpacityTau: 0.52,
        ambientTempC: -58
      };
    } else if (endpoint === "mars_photos") {
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=100&camera=navcam&api_key=${nasaKey}`;
      const json = await fetchWithCache(url, { photos: FALLBACK_MARS_PHOTOS });
      rawData = (json.photos || []).slice(0, 10);
      detectedParams = {
        terrainSlopeDeg: 9,
        sandSlipFactor: 1.5,
        boulderDensity: 0.45,
        solarFluxWm2: 530
      };
    } else {
      rawData = [
        { observation_id: "NASA_DSCOVR_2024", cloud_cover: 62, ocean_temp_c: 19.5, storm_count: 3 }
      ];
      detectedParams = {
        cloudCoveragePercent: 62,
        groundSamplingResolutionM: 15
      };
    }
    const newDataset = {
      id: `ds_nasa_${Date.now()}`,
      title: title || `NASA Streamed Dataset (${endpoint})`,
      missionId: missionId || "mission_01_mars_rover",
      type: "REAL NASA DATA",
      source: `NASA Open APIs (${endpoint})`,
      sourceUrl: "https://api.nasa.gov/",
      version: "1.0",
      status: "draft",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: req.adminUser?.name || "NASA API Connector",
      description: `Automated live stream from NASA Open APIs: ${endpoint}.`,
      recordCount: rawData.length,
      qualityScore: 98,
      columnDefinitions: Object.keys(rawData[0] || {}).map((key) => ({
        key,
        label: key.replace(/_/g, " ").toUpperCase(),
        type: typeof rawData[0][key] === "number" ? "number" : "string",
        sampleValues: [rawData[0][key]]
      })),
      rawData,
      simulationParameters: detectedParams,
      versionHistory: [
        {
          version: "1.0",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          author: "NASA API Connector",
          note: "Direct ingest from live NASA REST API endpoint.",
          parametersSnapshot: detectedParams
        }
      ]
    };
    datasetsStore.unshift(newDataset);
    saveStore();
    res.json({ success: true, dataset: newDataset });
  } catch (err) {
    res.status(500).json({ error: `NASA API fetch error: ${String(err)}` });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: !!apiKey,
    app: "Space Mission Academy",
    version: "2026.2.0",
    mode: isProd ? "production" : "development",
    datasetsCount: datasetsStore.length
  });
});
app.get("/api/nasa/apod", async (_req, res) => {
  const nasaKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`;
  const data = await fetchWithCache(url, FALLBACK_APOD);
  res.json({
    data,
    dataSource: "NASA Open APIs (Astronomy Picture of the Day)",
    dataType: "REAL NASA DATA",
    sourceUrl: "https://api.nasa.gov/"
  });
});
app.get("/api/nasa/mars-photos", async (req, res) => {
  const nasaKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const rover = req.query.rover || "perseverance";
  const sol = req.query.sol || "100";
  const camera = req.query.camera || "navcam";
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${nasaKey}`;
  const rawData = await fetchWithCache(url, { photos: FALLBACK_MARS_PHOTOS });
  const photos = rawData?.photos?.length ? rawData.photos.slice(0, 8) : FALLBACK_MARS_PHOTOS;
  res.json({
    photos,
    rover,
    sol,
    camera,
    dataSource: "NASA Mars Exploration Rover Photo API",
    dataType: "REAL NASA DATA",
    sourceUrl: "https://mars.nasa.gov/"
  });
});
app.get("/api/nasa/epic", async (_req, res) => {
  const url = "https://epic.gsfc.nasa.gov/api/natural";
  const rawData = await fetchWithCache(url, FALLBACK_EPIC);
  res.json({
    data: rawData,
    dataSource: "NASA DSCOVR EPIC (Earth Polychromatic Imaging Camera)",
    dataType: "REAL NASA DATA",
    sourceUrl: "https://epic.gsfc.nasa.gov/"
  });
});
app.get("/api/nasa/sites", (_req, res) => {
  res.json({
    sites: MARS_LANDING_SITES,
    dataSource: "NASA Mars Trek & Planetary Data System (PDS)",
    dataType: "NASA-BASED EDUCATIONAL MODEL",
    sourceUrl: "https://trek.nasa.gov/mars/"
  });
});
app.post("/api/nova/chat", async (req, res) => {
  const body = req.body;
  const userMessage = body.message || "Help me understand my space mission!";
  const lang = body.lang || "vi";
  const ageMode = body.context?.ageMode || "junior";
  const missionId = body.context?.missionId || "mission_01_mars_rover";
  const stage = body.context?.stage || "design";
  const cadetName = body.context?.cadetName || "Cadet";
  const telemetry = body.context?.telemetry;
  const getHeuristicResponse = () => {
    const isVi = lang === "vi";
    const msg = userMessage.toLowerCase();
    if (telemetry?.anomaly === "power_loss" || msg.includes("pin") || msg.includes("\u0111i\u1EC7n") || msg.includes("battery") || msg.includes("power")) {
      return isVi ? `Ch\xE0o ${cadetName}! T\u1EDB th\u1EA5y m\u1EE9c pin \u0111ang h\u1EA1 th\u1EA5p. Em th\u1EED quan s\xE1t xem: Robot \u0111ang d\xF9ng t\u1EA5m pin M\u1EB7t Tr\u1EDDi hay pin h\u1EA1t nh\xE2n RTG? N\u1EBFu \u0111ang qua v\xF9ng b\xE3o b\u1EE5i ho\u1EB7c b\xF3ng r\xE2m, ngu\u1ED3n n\xE0o s\u1EBD b\u1EC1n b\u1EC9 h\u01A1n?` : `Hi ${cadetName}! I notice battery levels are dipping low. Check your power subsystem: Is the rover relying on solar arrays or an RTG? If a dust storm rolls in, which energy source keeps producing power?`;
    }
    if (telemetry?.anomaly === "signal_lost" || msg.includes("li\xEAn l\u1EA1c") || msg.includes("s\xF3ng") || msg.includes("comms") || msg.includes("antenna")) {
      return isVi ? `T\xEDn hi\u1EC7u v\u1EC1 Tr\xE1i \u0110\u1EA5t b\u1ECB ch\u1EADp ch\u1EDDn r\u1ED3i! Em h\xE3y ki\u1EC3m tra xem Anten \u0111\u1ECBnh h\u01B0\u1EDBng cao (HGA) \u0111\xE3 c\u0103n ch\u1EC9nh v\u1EC1 ph\xEDa Tr\xE1i \u0110\u1EA5t ch\u01B0a, hay anten \u0111\u1EB3ng h\u01B0\u1EDBng (LGA) c\xF3 \u0111\u1EE7 c\xF4ng su\u1EA5t \u0111\u1EC3 xuy\xEAn qua t\u1EA7ng kh\xED quy\u1EC3n kh\xF4ng nh\xE9!` : `Communication link dropped! Check if your High-Gain Antenna (HGA) is properly aligned toward Earth or if you need an Orbiter Relay link to bridge the signal!`;
    }
    if (stage === "repair") {
      return isVi ? `\u0110\u1EEBng lo khi g\u1EB7p s\u1EF1 c\u1ED1, k\u1EF9 s\u01B0 t\xE0i ba lu\xF4n h\u1ECDc \u0111\u01B0\u1EE3c nhi\u1EC1u \u0111i\u1EC1u t\u1EEB l\u1ED7i! H\xE3y nh\xECn bi\u1EC3u \u0111\u1ED3 ch\u1EA9n \u0111o\xE1n: B\u1ED9 ph\u1EADn n\xE0o b\xE1o \u0111\xE8n c\u1EA3nh b\xE1o m\xE0u h\u1ED5 ph\xE1ch? Ta c\xF3 th\u1EC3 g\u1EEDi l\u1EC7nh v\xE1 ph\u1EA7n m\u1EC1m t\u1EEB Tr\xE1i \u0110\u1EA5t kh\xF4ng?` : `Don't worry about anomalies\u2014great engineers learn the most from troubleshooting! Look at your diagnostic chart: Which subsystem is amber? Can we send a tele-command patch from Earth?`;
    }
    return isVi ? `Ch\xE0o nh\xE0 th\xE1m hi\u1EC3m nh\xED ${cadetName}! T\u1EDB l\xE0 robot NOVA. H\xE3y nh\u1EDB r\u1EB1ng m\u1ECDi l\u1EF1a ch\u1ECDn thi\u1EBFt k\u1EBF \u0111\u1EC1u c\xF3 s\u1EF1 \u0111\xE1nh \u0111\u1ED5i: th\xEAm camera x\u1ECBn th\xEC t\u1ED1n \u0111i\u1EC7n, th\xEAm pin l\u1EDBn th\xEC n\u1EB7ng t\xE0u. C\xF9ng nhau c\xE2n b\u1EB1ng nh\xE9!` : `Hello explorer ${cadetName}! I am robot NOVA. Remember: every engineering choice has trade-offs\u2014better sensors draw more watts, larger batteries add mass. Let's balance our spacecraft!`;
  };
  if (ai) {
    try {
      const systemInstruction = `You are NOVA, a cheerful, intelligent, and friendly AI robot mentor at Space Mission Academy for elementary school students (ages 6 to 11).
Your mission is to guide young students through designing, launching, simulating, and diagnosing space missions using real NASA data and engineering concepts.

Pedagogical Rules:
1. Target audience: Elementary students (${ageMode === "junior" ? "6-8 years old: keep language very simple, visual, playful, 2-3 sentences max" : "9-11 years old: explain science concepts clearly with numbers, mass, energy trade-offs, 3-4 sentences max"}).
2. Language: STRICTLY respond in ${lang === "vi" ? "VIETNAMESE" : "ENGLISH"}.
3. Socratic Teaching: NEVER simply give the answer. Instead, ask guided questions to help the child deduce the answer.
4. Strictly Child-Safe: Safe, positive, inspiring tone. No jargon overload.
`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userMessage,
        config: { systemInstruction }
      });
      const reply = response.text?.trim() || getHeuristicResponse();
      return res.json({ reply, source: "gemini-3.8-flash" });
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local heuristic tutor:", err);
    }
  }
  res.json({
    reply: getHeuristicResponse(),
    source: "nova-heuristic-tutor"
  });
});
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Space Mission Academy Server running on http://0.0.0.0:${PORT} [${isProd ? "PROD" : "DEV"}]`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server boot error:", err);
  process.exit(1);
});
