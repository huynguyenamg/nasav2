import { MissionId } from './game';

export type AdminRole = 'super_admin' | 'data_engineer' | 'viewer';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export type DatasetSourceType = 'REAL NASA DATA' | 'NASA-BASED EDUCATIONAL MODEL' | 'SIMULATED GAME DATA';
export type DatasetStatus = 'active' | 'draft' | 'archived';

export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'number' | 'string' | 'boolean';
  sampleValues: unknown[];
  mappedParam?: string;
}

export interface SimulationParameters {
  terrainSlopeDeg?: number; // 0 to 25 deg
  sandSlipFactor?: number; // 1.0 (firm) to 3.5 (deep dune sink)
  boulderDensity?: number; // 0.1 (sparse) to 0.9 (hazard field)
  solarFluxWm2?: number; // 350 to 590 W/m² on Mars
  dustOpacityTau?: number; // 0.3 (clear) to 3.0 (dust storm)
  ambientTempC?: number; // -120 to +20 °C
  gravityMs2?: number; // 3.72 m/s² on Mars
  atmosphereDensity?: number;
  [key: string]: unknown;
}

export interface VersionEntry {
  version: string;
  updatedAt: string;
  author: string;
  note: string;
  parametersSnapshot: SimulationParameters;
}

export interface Dataset {
  id: string;
  title: string;
  missionId: MissionId;
  type: DatasetSourceType;
  source: string;
  sourceUrl: string;
  version: string;
  status: DatasetStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  description: string;
  recordCount: number;
  qualityScore: number; // 0 to 100%
  columnDefinitions: ColumnDefinition[];
  rawData: Record<string, unknown>[];
  simulationParameters: SimulationParameters;
  versionHistory: VersionEntry[];
}

export interface MissionDataMapping {
  missionId: MissionId;
  activeDatasetId: string;
  lastSyncedAt: string;
  syncedBy: string;
}
