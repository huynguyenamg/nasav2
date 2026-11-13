import { AdminSession, AdminUser, Dataset, MissionDataMapping, SimulationParameters } from '../types/admin';
import { MissionId } from '../types/game';

const TOKEN_KEY = 'nasa_admin_bearer_token';

class AdminService {
  private token: string | null = null;
  private currentUser: AdminUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem(TOKEN_KEY);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  private authHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  public async login(username: string, password: string): Promise<AdminSession> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Authentication error');
    }

    const session: AdminSession = await res.json();
    this.token = session.token;
    this.currentUser = session.user;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, session.token);
    }

    return session;
  }

  public async verifySession(): Promise<AdminUser | null> {
    if (!this.token) return null;
    try {
      const res = await fetch('/api/admin/me', {
        headers: this.authHeaders(),
      });
      if (!res.ok) {
        this.logout();
        return null;
      }
      const data = await res.json();
      this.currentUser = data.user;
      return data.user;
    } catch {
      this.logout();
      return null;
    }
  }

  public async logout(): Promise<void> {
    if (this.token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.authHeaders(),
      }).catch(() => {});
    }
    this.token = null;
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  // Datasets CRUD
  public async getDatasets(missionId?: string, status?: string): Promise<Dataset[]> {
    const query = new URLSearchParams();
    if (missionId) query.set('missionId', missionId);
    if (status) query.set('status', status);

    const res = await fetch(`/api/admin/datasets?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    const data = await res.json();
    return data.datasets || [];
  }

  public async createDataset(dataset: Partial<Dataset>): Promise<Dataset> {
    const res = await fetch('/api/admin/datasets', {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(dataset),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Create failed' }));
      throw new Error(err.error || 'Failed to create dataset');
    }
    const data = await res.json();
    return data.dataset;
  }

  public async updateDataset(id: string, updates: Partial<Dataset>): Promise<Dataset> {
    const res = await fetch(`/api/admin/datasets/${id}`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Failed to update dataset');
    }
    const data = await res.json();
    return data.dataset;
  }

  public async activateDataset(id: string): Promise<{ activeDataset: Dataset; mapping: MissionDataMapping }> {
    const res = await fetch(`/api/admin/datasets/${id}/activate`, {
      method: 'POST',
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Activation failed' }));
      throw new Error(err.error || 'Failed to activate dataset');
    }
    return await res.json();
  }

  public async rollbackDataset(id: string, targetVersion: string): Promise<Dataset> {
    const res = await fetch(`/api/admin/datasets/${id}/rollback`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify({ targetVersion }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Rollback failed' }));
      throw new Error(err.error || 'Failed to rollback version');
    }
    const data = await res.json();
    return data.dataset;
  }

  public async deleteDataset(id: string): Promise<void> {
    const res = await fetch(`/api/admin/datasets/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(err.error || 'Failed to delete dataset');
    }
  }

  // Mappings
  public async getMappings(): Promise<Record<string, MissionDataMapping>> {
    const res = await fetch('/api/admin/mappings');
    if (!res.ok) throw new Error('Failed to fetch mappings');
    const data = await res.json();
    return data.mappings || {};
  }

  public async updateMapping(missionId: MissionId, datasetId: string): Promise<MissionDataMapping> {
    const res = await fetch('/api/admin/mappings', {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify({ missionId, datasetId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Mapping update failed' }));
      throw new Error(err.error || 'Failed to update mission mapping');
    }
    const data = await res.json();
    return data.mapping;
  }

  // Live NASA API Connector
  public async fetchNasaApi(endpoint: string, missionId: string, title?: string): Promise<Dataset> {
    const res = await fetch('/api/admin/nasa-fetch', {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify({ endpoint, missionId, title }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'NASA fetch failed' }));
      throw new Error(err.error || 'Failed to fetch from NASA API');
    }
    const data = await res.json();
    return data.dataset;
  }

  // Public Game Engine integration: Read live active dataset & simulation parameters
  public async getActiveMissionData(missionId: MissionId): Promise<{
    missionId: string;
    datasetId: string;
    title: string;
    version: string;
    type: string;
    source: string;
    sourceUrl: string;
    simulationParameters: SimulationParameters;
    syncedAt: string;
  }> {
    const res = await fetch(`/api/game/mission-data/${missionId}`);
    if (!res.ok) {
      throw new Error(`Failed to load mission data for ${missionId}`);
    }
    return await res.json();
  }
}

export const adminService = new AdminService();
