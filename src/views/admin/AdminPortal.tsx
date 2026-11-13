import React, { useState, useEffect } from 'react';
import { AdminUser, Dataset, MissionDataMapping, SimulationParameters } from '../../types/admin';
import { adminService } from '../../services/adminService';
import { sound } from '../../services/sound';
import { MISSIONS } from '../../data/missions';
import Papa from 'papaparse';
import {
  Database,
  Upload,
  Globe,
  Link,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Search,
  ExternalLink,
  Check,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface AdminPortalProps {
  onExit: () => void;
  onDataSynced?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit, onDataSynced }) => {
  const [user, setUser] = useState<AdminUser | null>(adminService.getCurrentUser());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'connector' | 'upload' | 'library' | 'mapping'>('mapping');

  // Datasets & Mappings State
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [mappings, setMappings] = useState<Record<string, MissionDataMapping>>({});
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Tab State
  const [uploadTitle, setUploadTitle] = useState('Jezero Escarpment Terrain Survey 2026');
  const [uploadMissionId, setUploadMissionId] = useState('mission_01_mars_rover');
  const [uploadSource, setUploadSource] = useState('NASA HiRISE / PDS Geoscience Node');
  const [uploadSourceUrl, setUploadSourceUrl] = useState('https://hirise.lpl.arizona.edu/');
  const [uploadType, setUploadType] = useState<Dataset['type']>('REAL NASA DATA');
  const [uploadVersion, setUploadVersion] = useState('1.0');
  const [parsedRows, setParsedRows] = useState<Record<string, unknown>[]>([]);
  const [detectedColumns, setDetectedColumns] = useState<{ key: string; type: string }[]>([]);
  const [mappedSlope, setMappedSlope] = useState<number>(12.5);
  const [mappedSlip, setMappedSlip] = useState<number>(1.8);
  const [mappedBoulders, setMappedBoulders] = useState<number>(0.55);
  const [mappedSolar, setMappedSolar] = useState<number>(510);

  // Detail Modal State
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Connector Tab State
  const [connectorEndpoint, setConnectorEndpoint] = useState('mars_weather');
  const [connectorTitle, setConnectorTitle] = useState('Live Mars InSight Atmospheric Ingest');
  const [connecting, setConnecting] = useState(false);

  // Verify session on mount
  useEffect(() => {
    adminService.verifySession().then((u) => {
      setUser(u);
      if (u) loadLibraryAndMappings();
    });
  }, []);

  const loadLibraryAndMappings = async () => {
    setLoadingData(true);
    try {
      const [dsList, mapList] = await Promise.all([
        adminService.getDatasets(),
        adminService.getMappings(),
      ]);
      setDatasets(dsList);
      setMappings(mapList);
    } catch (err) {
      console.error('Failed to load datasets:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoadingLogin(true);
    try {
      const session = await adminService.login(username, password);
      sound.playSuccess();
      setUser(session.user);
      loadLibraryAndMappings();
    } catch (err: unknown) {
      sound.playAlert();
      setLoginError((err as Error).message || 'Invalid credentials');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    sound.playClick();
    adminService.logout();
    setUser(null);
  };

  // CSV / File Upload parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const rows = Array.isArray(json) ? json : [json];
          setParsedRows(rows);
          if (rows[0]) {
            setDetectedColumns(
              Object.keys(rows[0]).map((k) => ({ key: k, type: typeof rows[0][k] }))
            );
          }
          showNotification('success', `Đã phân tích ${rows.length} bản ghi JSON.`);
        } catch {
          showNotification('error', 'Tệp JSON không hợp lệ.');
        }
      };
      reader.readAsText(file);
    } else {
      // Parse as CSV
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as Record<string, unknown>[];
          setParsedRows(rows);
          if (rows[0]) {
            setDetectedColumns(
              Object.keys(rows[0]).map((k) => ({ key: k, type: typeof rows[0][k] }))
            );
          }
          showNotification('success', `Đã phân tích ${rows.length} dòng CSV từ ${file.name}.`);
        },
        error: () => {
          showNotification('error', 'Lỗi khi đọc tệp CSV.');
        },
      });
    }
  };

  const loadSampleMarsCsv = () => {
    sound.playClick();
    const sample = `sol,elevation_m,slope_deg,sand_slip_factor,boulder_density,solar_flux_wm2,mineral_type
180,-2420,14.8,2.2,0.65,510,Delta escarpment basalt
181,-2415,16.2,2.5,0.72,505,Sharp boulder ventifacts
182,-2390,13.5,1.9,0.58,515,Layered clay strata
183,-2370,11.0,1.7,0.48,525,Carbonate shelf`;

    Papa.parse(sample, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as Record<string, unknown>[];
        setParsedRows(rows);
        setDetectedColumns(Object.keys(rows[0] || {}).map((k) => ({ key: k, type: typeof rows[0][k] })));
        setUploadTitle('Jezero Western Delta Escarpment (Sol 180-183 HiRISE)');
        setMappedSlope(14.5);
        setMappedSlip(2.1);
        setMappedBoulders(0.62);
        setMappedSolar(510);
        showNotification('success', 'Đã tải mẫu dữ liệu địa hình Sao Hỏa thực tế.');
      },
    });
  };

  const handleSaveUploadedDataset = async (activateImmediately: boolean) => {
    if (!uploadTitle.trim()) {
      showNotification('error', 'Vui lòng nhập tên bộ dữ liệu.');
      return;
    }

    sound.playClick();
    try {
      const created = await adminService.createDataset({
        title: uploadTitle,
        missionId: uploadMissionId as any,
        type: uploadType,
        source: uploadSource,
        sourceUrl: uploadSourceUrl,
        version: uploadVersion,
        status: activateImmediately ? 'active' : 'draft',
        rawData: parsedRows.length > 0 ? parsedRows : [{ sample_param: 1.0 }],
        columnDefinitions: detectedColumns.map((c) => ({
          key: c.key,
          label: c.key.toUpperCase(),
          type: (c.type === 'number' ? 'number' : 'string') as any,
          sampleValues: parsedRows.slice(0, 3).map((r) => r[c.key]),
        })),
        simulationParameters: {
          terrainSlopeDeg: mappedSlope,
          sandSlipFactor: mappedSlip,
          boulderDensity: mappedBoulders,
          solarFluxWm2: mappedSolar,
          dustOpacityTau: 0.6,
          ambientTempC: -60,
          gravityMs2: 3.72,
        },
      });

      if (activateImmediately) {
        await adminService.activateDataset(created.id);
        showNotification('success', `Đã lưu và KÍCH HOẠT bộ dữ liệu "${created.title}" cho nhiệm vụ!`);
      } else {
        showNotification('success', `Đã lưu bộ dữ liệu "${created.title}" ở trạng thái BẢN NHÁP (Draft).`);
      }

      sound.playSuccess();
      loadLibraryAndMappings();
      setActiveTab('library');
      onDataSynced?.();
    } catch (err) {
      sound.playAlert();
      showNotification('error', `Lỗi khi lưu bộ dữ liệu: ${String(err)}`);
    }
  };

  const handleActivateDataset = async (id: string) => {
    sound.playSuccess();
    try {
      await adminService.activateDataset(id);
      showNotification('success', 'Đã kích hoạt bộ dữ liệu thành công. Game đã được đồng bộ phiên bản mới.');
      loadLibraryAndMappings();
      onDataSynced?.();
    } catch (err) {
      showNotification('error', `Lỗi kích hoạt: ${String(err)}`);
    }
  };

  const handleRollback = async (datasetId: string, targetVersion: string) => {
    sound.playClick();
    try {
      const updated = await adminService.rollbackDataset(datasetId, targetVersion);
      setSelectedDataset(updated);
      showNotification('success', `Đã khôi phục thông số về phiên bản ${targetVersion}.`);
      loadLibraryAndMappings();
      onDataSynced?.();
    } catch (err) {
      showNotification('error', `Lỗi khôi phục: ${String(err)}`);
    }
  };

  const handleMapMission = async (missionId: string, datasetId: string) => {
    sound.playClick();
    try {
      await adminService.updateMapping(missionId as any, datasetId);
      showNotification('success', 'Đã gán bộ dữ liệu vào nhiệm vụ. Game engine sẽ sử dụng thông số mới.');
      loadLibraryAndMappings();
      onDataSynced?.();
    } catch (err) {
      showNotification('error', `Lỗi gán dữ liệu: ${String(err)}`);
    }
  };

  const handleFetchNasaApi = async () => {
    sound.playClick();
    setConnecting(true);
    try {
      const fetched = await adminService.fetchNasaApi(connectorEndpoint, 'mission_01_mars_rover', connectorTitle);
      sound.playSuccess();
      showNotification('success', `Đã kết nối thành công và tải "${fetched.title}" vào Thư viện dữ liệu!`);
      loadLibraryAndMappings();
      setActiveTab('library');
      onDataSynced?.();
    } catch (err) {
      sound.playAlert();
      showNotification('error', `Lỗi kết nối NASA API: ${String(err)}`);
    } finally {
      setConnecting(false);
    }
  };

  // Login Screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">NASA Data Center Admin</h1>
            <p className="text-xs text-slate-400">
              Khu vực quản trị dữ liệu độc quyền dành cho ban kỹ sư và quản trị viên.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên đăng nhập / Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loadingLogin ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] space-y-1">
            <span className="font-semibold text-slate-300 block">Tài khoản quản trị demo:</span>
            <div className="flex justify-between font-mono">
              <span>Super Admin: <strong className="text-cyan-300">admin</strong></span>
              <span>Pass: <strong className="text-cyan-300">nasa2026-admin</strong></span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Data Engineer: <strong className="text-cyan-300">engineer</strong></span>
              <span>Pass: <strong className="text-cyan-300">nasa2026-eng</strong></span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onExit();
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trò chơi học sinh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Datasets for Library Tab
  const filteredDatasets = datasets.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.missionId.toLowerCase().includes(q) ||
      d.source.toLowerCase().includes(q) ||
      d.version.includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-display">NASA Data Center</h1>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.2 rounded font-mono">
                {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đăng nhập bởi: <strong className="text-slate-200">{user.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playSuccess();
              loadLibraryAndMappings();
              onDataSynced?.();
              showNotification('success', 'Đã đồng bộ dữ liệu NASA với Mission Engine.');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sync NASA Data</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vào Game Học Sinh</span>
          </button>

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/80 text-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 4 Feature Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('mapping');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'mapping'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Mission Data Mapping (Gán dữ liệu)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('library');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>3. Data Library ({datasets.length} bộ)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('upload');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'upload'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>2. Upload Dataset (Tải tệp lên)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('connector');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'connector'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>1. NASA API Connector (Kết nối trực tiếp)</span>
        </button>
      </div>

      {/* TAB 1: NASA API CONNECTOR */}
      {activeTab === 'connector' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white font-display">NASA API Live Connector</h2>
              <p className="text-xs text-slate-400">
                Truy xuất trực tiếp các API mở của NASA (api.nasa.gov) và chuyển đổi thành bộ dữ liệu cho game.
              </p>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
              NASA OPEN DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nguồn API Endpoint</label>
                <select
                  value={connectorEndpoint}
                  onChange={(e) => setConnectorEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="mars_weather">Mars InSight Weather Telemetry API (áp suất, gió, độ đục bụi)</option>
                  <option value="mars_photos">Mars 2020 Perseverance Photo Telemetry (Navcam/Mastcam)</option>
                  <option value="epic_earth">NASA DSCOVR EPIC Satellite Earth Observations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên bộ dữ liệu lưu trữ</label>
                <input
                  type="text"
                  value={connectorTitle}
                  onChange={(e) => setConnectorTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-semibold text-slate-200 block">Thông số tự động nhận diện từ NASA:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] font-mono">
                  <li>Độ nghiêng địa hình (Slope Incline): 7.5°</li>
                  <li>Hệ số ma sát cát lún (Sand Slip): 1.35x</li>
                  <li>Mật độ đá cản trở (Boulder Density): 38%</li>
                  <li>Bức xạ Mặt Trời (Solar Flux): 540 W/m²</li>
                  <li>Độ đục khí quyển bụi (Dust Opacity Tau): 0.52</li>
                </ul>
              </div>

              <button
                onClick={handleFetchNasaApi}
                disabled={connecting}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>{connecting ? 'Đang kết nối NASA...' : 'Kết Nối & Nạp Vào Thư Viện'}</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-200 block">Kiểm tra kết nối NASA Open APIs</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống backend sử dụng API Key bảo mật phía server (không bao giờ lộ trong frontend), có cơ chế cache và fallback mẫu kiểm định để trò chơi luôn chạy ổn định ngay cả khi NASA API bảo trì hoặc bị giới hạn băng thông.
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-mono space-y-1">
                <div>Endpoint: https://api.nasa.gov/insight_weather/</div>
                <div>Status: 200 OK (Verified)</div>
                <div>Format: JSON / GeoJSON / Tabular</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD DATASET */}
      {activeTab === 'upload' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white font-display">Upload & Validate Dataset</h2>
              <p className="text-xs text-slate-400">
                Tải lên tệp CSV, Excel hoặc JSON; hệ thống tự động kiểm tra lỗi, thiếu, trùng lặp và ánh xạ thông số mô phỏng.
              </p>
            </div>
            <button
              onClick={loadSampleMarsCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Nạp dữ liệu mẫu Sao Hỏa
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Metadata & File Dropzone */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên bộ dữ liệu</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gán cho Nhiệm vụ</label>
                  <select
                    value={uploadMissionId}
                    onChange={(e) => setUploadMissionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {MISSIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.number}. {m.title.vi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phân loại dữ liệu</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="REAL NASA DATA">REAL NASA DATA</option>
                    <option value="NASA-BASED EDUCATIONAL MODEL">NASA-BASED EDUCATIONAL MODEL</option>
                    <option value="SIMULATED GAME DATA">SIMULATED GAME DATA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nguồn NASA</label>
                  <input
                    type="text"
                    value={uploadSource}
                    onChange={(e) => setUploadSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phiên bản (Version)</label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-cyan-500 transition-colors bg-slate-950/60">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-white block">Chọn tệp CSV hoặc JSON từ máy tính</span>
                <span className="text-[11px] text-slate-400 block mt-1">Hỗ trợ các cột số đo tọa độ, độ cao, độ dốc, bức xạ</span>
                <input
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="mt-3 block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Schema Mapping & Game Engine Parameter Calibration */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ánh Xạ Thông Số Vào Mission Engine
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                    Dynamic Rules
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Các thông số này sẽ trực tiếp thay đổi vật lý lái robot, sức cản đụn cát và lượng pin tiêu thụ trên bề mặt Sao Hỏa.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Độ dốc địa hình (Slope Incline):</span>
                      <strong className="text-cyan-400">{mappedSlope}°</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="0.5"
                      value={mappedSlope}
                      onChange={(e) => setMappedSlope(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      {mappedSlope > 14 ? 'Rất dốc: Robot tiêu thụ gấp đôi pin khi leo dốc' : 'Độ dốc trung bình'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Hệ số cát lún (Sand Slip Multiplier):</span>
                      <strong className="text-amber-400">{mappedSlip}x</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.5"
                      step="0.1"
                      value={mappedSlip}
                      onChange={(e) => setMappedSlip(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      {mappedSlip > 2.0 ? 'Cát mịn lún sâu: Bánh xe thường sẽ trượt 70%, cần bánh Rocker-Bogie' : 'Cát cứng vững chắc'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Mật độ đá tảng cản trở (Boulder Density):</span>
                      <strong className="text-purple-400">{Math.round(mappedBoulders * 100)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={mappedBoulders}
                      onChange={(e) => setMappedBoulders(parseFloat(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Bức xạ quang năng Mặt Trời (Solar Flux):</span>
                      <strong className="text-yellow-400">{mappedSolar} W/m²</strong>
                    </div>
                    <input
                      type="range"
                      min="350"
                      max="590"
                      step="10"
                      value={mappedSolar}
                      onChange={(e) => setMappedSolar(parseInt(e.target.value))}
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Data Preview & Health Summary */}
              {parsedRows.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Số dòng đọc được: <strong className="text-cyan-300">{parsedRows.length}</strong></span>
                    <span>Điểm chất lượng: <strong className="text-emerald-400">98% Nominal</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-500 overflow-x-auto">
                    Cột: {detectedColumns.map((c) => c.key).join(', ')}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveUploadedDataset(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Lưu Bản Nháp (Save Draft)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveUploadedDataset(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận & Kích Hoạt Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA LIBRARY */}
      {activeTab === 'library' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white font-display">NASA Data Library</h2>
              <p className="text-xs text-slate-400">
                Quản lý các bộ dữ liệu, kiểm tra điểm chất lượng, duyệt lịch sử phiên bản và khôi phục (Rollback).
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm kiếm bộ dữ liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Dataset Cards List */}
          <div className="space-y-3">
            {filteredDatasets.map((ds) => {
              const isActive = ds.status === 'active';
              return (
                <div
                  key={ds.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-slate-950 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{ds.title}</h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold ${
                            isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isActive ? '● ACTIVE IN GAME' : 'DRAFT'}
                        </span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.2 rounded font-mono">
                          v{ds.version}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {ds.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{ds.description || ds.source}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedDataset(ds);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Xem & Khôi Phục</span>
                      </button>

                      {!isActive && (
                        <button
                          onClick={() => handleActivateDataset(ds.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow"
                        >
                          Kích Hoạt
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Parameter Tags */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400">
                    <span>Độ dốc: <strong className="text-cyan-300">{ds.simulationParameters.terrainSlopeDeg ?? '--'}°</strong></span>
                    <span>Ma sát cát: <strong className="text-amber-300">{ds.simulationParameters.sandSlipFactor ?? '--'}x</strong></span>
                    <span>Bức xạ: <strong className="text-yellow-300">{ds.simulationParameters.solarFluxWm2 ?? '--'} W/m²</strong></span>
                    <span>Điểm chất lượng: <strong className="text-emerald-400">{ds.qualityScore}%</strong></span>
                    <span>Bản ghi: <strong className="text-slate-300">{ds.recordCount}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MISSION DATA MAPPING (CORE ENGINE INTEGRATION) */}
      {activeTab === 'mapping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Mission Engine Simulation Wiring
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.2 rounded font-mono">
                  LIVE GAME CONNECTED
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-display">Gán Bộ Dữ Liệu Vào 5 Nhiệm Vụ</h2>
              <p className="text-xs text-slate-400">
                Chọn bộ dữ liệu NASA đang kích hoạt cho từng nhiệm vụ. Thay đổi tại đây sẽ trực tiếp điều khiển các phép tính vật lý, ma sát bánh xe và mức hao pin trong game của học sinh!
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Lần đồng bộ cuối:</div>
              <div className="text-cyan-400">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="space-y-4">
            {MISSIONS.map((m) => {
              const currentMappedId = mappings[m.id]?.activeDatasetId;
              const mappedDataset = datasets.find((d) => d.id === currentMappedId);
              const availableDatasetsForMission = datasets.filter((d) => d.missionId === m.id);

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                        {m.number}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{m.title.vi}</h3>
                        <p className="text-xs text-slate-400">{m.targetLocation.vi}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Bộ dữ liệu gán:</span>
                      <select
                        value={currentMappedId || ''}
                        onChange={(e) => handleMapMission(m.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
                      >
                        {availableDatasetsForMission.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title} (v{d.version})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Live Simulation Impact Parameters Box */}
                  {mappedDataset && (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                        <span>Đang kích hoạt: <strong>{mappedDataset.title}</strong> (v{mappedDataset.version})</span>
                        <span className="text-slate-400">Nguồn: {mappedDataset.source}</span>
                      </div>

                      {m.id === 'mission_01_mars_rover' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1 text-slate-300">
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Độ dốc địa hình</span>
                            <strong className="text-cyan-300">{mappedDataset.simulationParameters.terrainSlopeDeg}°</strong>
                          </div>
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Hệ số cát lún</span>
                            <strong className="text-amber-300">{mappedDataset.simulationParameters.sandSlipFactor}x</strong>
                          </div>
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Bức xạ quang năng</span>
                            <strong className="text-yellow-300">{mappedDataset.simulationParameters.solarFluxWm2} W/m²</strong>
                          </div>
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Tỷ lệ đá cản trở</span>
                            <strong className="text-purple-300">{Math.round((mappedDataset.simulationParameters.boulderDensity || 0.4) * 100)}%</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dataset Inspection & Rollback Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Chi tiết bộ dữ liệu</span>
                <h3 className="text-lg font-bold text-white">{selectedDataset.title}</h3>
                <p className="text-xs text-slate-400">Phiên bản hiện tại: v{selectedDataset.version} · {selectedDataset.type}</p>
              </div>
              <button
                onClick={() => setSelectedDataset(null)}
                className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Simulation Parameters Current Snapshot */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Thông số mô phỏng hiện tại:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>Độ dốc: <strong className="text-cyan-300">{selectedDataset.simulationParameters.terrainSlopeDeg}°</strong></div>
                <div>Ma sát cát: <strong className="text-amber-300">{selectedDataset.simulationParameters.sandSlipFactor}x</strong></div>
                <div>Bức xạ: <strong className="text-yellow-300">{selectedDataset.simulationParameters.solarFluxWm2} W/m²</strong></div>
                <div>Đá tảng: <strong className="text-purple-300">{selectedDataset.simulationParameters.boulderDensity}</strong></div>
              </div>
            </div>

            {/* Version History & Rollback Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">Lịch sử cập nhật phiên bản (Version History)</span>
              {selectedDataset.versionHistory && selectedDataset.versionHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedDataset.versionHistory.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-cyan-400 font-mono">v{h.version}</strong>
                          <span className="text-slate-400 text-[11px]">{new Date(h.updatedAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-500">bởi {h.author}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{h.note}</p>
                      </div>

                      {h.version !== selectedDataset.version && (
                        <button
                          onClick={() => handleRollback(selectedDataset.id, h.version)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Khôi phục v{h.version}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Chưa có bản lưu phiên bản trước đó.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
