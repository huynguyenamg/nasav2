import React, { useEffect, useRef, useState } from 'react';
import {
  EquipmentSubsystemId,
  Language,
  MissionSessionState,
} from '../../types/game';
import {
  getEffectiveSubsystemState,
  getPartById,
  getPartText,
} from '../../data/equipmentSystems';
import { SubsystemLockNotice } from './SubsystemLockNotice';
import { SubTaskStatusBar, SubTaskItem } from './SubTaskStatusBar';
import { CircuitWiringBoard } from '../interactive/CircuitWiringBoard';
import { sound } from '../../services/sound';
import {
  ArrowDown,
  ArrowUp,
  CalendarClock,
  Camera,
  CheckCircle2,
  Flame,
  Layers,
  Plus,
  Radio,
  Thermometer,
  Trash2,
} from 'lucide-react';

interface LandsatSimulatorProps {
  lang: Language;
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onCompleteSubTask: (
    taskId: string,
    extras?: { photos?: number; samples?: number },
    sessionPatch?: Partial<MissionSessionState>
  ) => void;
  onFailSubTask?: (taskId: string, sessionPatch?: Partial<MissionSessionState>) => void;
}

type LandsatTaskKey = 'A_imaging' | 'B_thermal' | 'C_schedule' | 'D_downlink';

interface ThermalMarker {
  id: string;
  name: string;
  xPct: number;
  yPct: number;
  band10C: number;
  band11C: number;
  expectedTag: 'fire' | 'sensor_fault' | 'normal';
}

interface ScheduleTarget {
  id: string;
  name: string;
  nameEn: string;
  mins: number;
  priority: number;
}

const ALL_SCHEDULE_TARGETS: ScheduleTarget[] = [
  { id: 'fire', name: 'Cháy rừng California (Khẩn cấp #1)', nameEn: 'California Wildfire (Priority #1)', mins: 5, priority: 1 },
  { id: 'storm', name: 'Siêu bão Biển Đông (Khẩn cấp #2)', nameEn: 'Super Typhoon (Priority #2)', mins: 4, priority: 2 },
  { id: 'ice', name: 'Băng tan Nam Cực', nameEn: 'Antarctic Ice Melt', mins: 5, priority: 3 },
  { id: 'city', name: 'Đô thị ban đêm (Phụ)', nameEn: 'Nighttime Urban Lights (Secondary)', mins: 4, priority: 4 },
];

export const LandsatSimulator: React.FC<LandsatSimulatorProps> = ({
  lang,
  session,
  onOpenRepair,
  onCompleteSubTask,
  onFailSubTask,
}) => {
  const isEn = lang === 'en';
  const [activeTask, setActiveTask] = useState<LandsatTaskKey>('A_imaging');

  // Task A: Interactive Scan Box + Layers + Before/After Compare Slider + Signal Probe
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [scanRegion, setScanRegion] = useState({ xPct: 38, yPct: 45 });
  const [draggingRegion, setDraggingRegion] = useState(false);
  const [layerRgb, setLayerRgb] = useState(true);
  const [layerNir, setLayerNir] = useState(false);
  const [layerRawGrid, setLayerRawGrid] = useState(false);
  const [compareSplitPct, setCompareSplitPct] = useState(50);
  const [testedProbe, setTestedProbe] = useState<'oli' | 'processor' | null>(null);
  const [oliFeedback, setOliFeedback] = useState<string | null>(null);

  // Task B: Heatmap Threshold Slider + Interactive Pin Tagging
  const [heatThresholdC, setHeatThresholdC] = useState(40);
  const [selectedThermalId, setSelectedThermalId] = useState<string>('zone_fire');
  const [thermalTags, setThermalTags] = useState<Record<string, 'fire' | 'sensor_fault' | 'normal'>>({});
  const [thermalFeedback, setThermalFeedback] = useState<string | null>(null);

  // Task C: Drag & Drop + Reorderable Orbital Timeline
  const [queueIds, setQueueIds] = useState<string[]>(['storm']);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);

  // Task D: X-Band Circuit Wiring + Ground Station Pass Lock
  const [xBandWired, setXBandWired] = useState(false);
  const [orbitLatDeg, setOrbitLatDeg] = useState(25);
  const [downlinkFeedback, setDownlinkFeedback] = useState<string | null>(null);

  const oliState = getEffectiveSubsystemState(session, 'sat_oli', lang);
  const tirsState = getEffectiveSubsystemState(session, 'sat_tirs', lang);
  const procState = getEffectiveSubsystemState(session, 'sat_processor', lang);
  const powerState = getEffectiveSubsystemState(session, 'sat_power', lang);
  const commsState = getEffectiveSubsystemState(session, 'sat_comms', lang);

  const powerPart = getPartById(session.subsystems.sat_power?.partId || '');
  const powerPartName = powerPart ? getPartText(powerPart, lang).name : '';
  const maxPowerSlots = powerPart?.tier === 'economy' ? 2 : powerPart?.tier === 'standard' ? 3 : 4;
  const isDone = (k: LandsatTaskKey) => session.completedSubTasks.includes(k);

  useEffect(() => {
    setOliFeedback(null);
    setThermalFeedback(null);
    setScheduleFeedback(null);
    setDownlinkFeedback(null);
  }, [lang]);

  const thermalMarkers: ThermalMarker[] = [
    {
      id: 'zone_forest',
      name: isEn ? 'Amazon Rainforest' : 'Rừng Amazon',
      xPct: 24,
      yPct: 58,
      band10C: 29,
      band11C: 28,
      expectedTag: 'normal',
    },
    {
      id: 'zone_fire',
      name: isEn ? 'California Wildfire' : 'Vùng cháy California',
      xPct: 52,
      yPct: 38,
      band10C: 54,
      band11C: 53,
      expectedTag: 'fire',
    },
    {
      id: 'zone_pixel',
      name: isEn ? 'Scan Strip #4 (Ocean)' : 'Điểm sọc #4 (Đại dương)',
      xPct: 78,
      yPct: 68,
      band10C: tirsState.status !== 'ok' ? 92 : 21,
      band11C: 21,
      expectedTag: tirsState.status !== 'ok' ? 'sensor_fault' : 'normal',
    },
  ];

  const handleScanMove = (clientX: number, clientY: number) => {
    const box = imgContainerRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const xPct = Math.max(12, Math.min(88, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(15, Math.min(85, ((clientY - rect.top) / rect.height) * 100));
    setScanRegion({ xPct: Math.round(xPct), yPct: Math.round(yPct) });
  };

  const handleRunProbe = (probe: 'oli' | 'processor') => {
    sound.playClick();
    setTestedProbe(probe);
    if (probe === 'oli') {
      const broken = session.subsystems.sat_oli?.status !== 'ok';
      setOliFeedback(
        broken
          ? isEn
            ? 'OLI-2 Probe: Blue & infrared channels lost signal! Open Repair Bay for OLI-2 Sensor.'
            : 'Đầu dò OLI-2: Kênh thu ánh sáng xanh & hồng ngoại bị mất tín hiệu! Cần vào Sửa chữa cảm biến OLI-2.'
          : isEn
          ? 'OLI-2 Probe: Optical lens telemetry at 100% nominal.'
          : 'Đầu dò OLI-2: Tín hiệu ống kính đạt chuẩn 100%.'
      );
    } else {
      const broken = session.subsystems.sat_processor?.status !== 'ok';
      setOliFeedback(
        broken
          ? isEn
            ? 'Processor Probe: Buffer overflow corrupted packets, stalling image pipeline! Repair Data Processor.'
            : 'Đầu dò Bộ xử lý: Bộ nhớ đệm bị tràn bit lỗi, làm nghẽn toàn bộ ảnh chụp! Cần sửa Bộ xử lý.'
          : isEn
          ? 'Processor Probe: 14-bit image compression running smoothly.'
          : 'Đầu dò Bộ xử lý: Nén ảnh 14-bit hoạt động mượt mà.'
      );
    }
  };

  const handleCaptureProcessedImage = () => {
    if (oliState.status === 'failed' || procState.status === 'failed') {
      sound.playAlert();
      onFailSubTask?.('A_imaging');
      setOliFeedback(
        isEn
          ? 'Sensor or Processor still has a fault! Run a probe check and visit Repair Bay first.'
          : 'Cảm biến hoặc Bộ xử lý vẫn đang lỗi! Hãy dùng đầu dò kiểm tra rồi vào Sửa chữa trước.'
      );
      return;
    }
    if (!layerNir) {
      sound.playAlert();
      onFailSubTask?.('A_imaging');
      setOliFeedback(
        isEn
          ? 'Enable the "Near-Infrared (NIR)" layer and position the scan region to analyze vegetation before saving!'
          : 'Hãy bật thêm lớp "Cận hồng ngoại (NIR)" và kéo vùng quét để phân tích thảm thực vật trước khi lưu!'
      );
      return;
    }
    sound.playSuccess();
    setOliFeedback(
      isEn
        ? 'Verified Before/After layers, isolated NIR spectrum, and saved high-resolution Earth imagery!'
        : 'Đã đối chiếu ảnh Trước/Sau, tách lớp NIR thành công và lưu ảnh Trái Đất độ nét cao!'
    );
    onCompleteSubTask('A_imaging', { photos: 2 });
  };

  const handleTagThermal = (tag: 'fire' | 'sensor_fault' | 'normal') => {
    sound.playClick();
    setThermalTags((prev) => ({ ...prev, [selectedThermalId]: tag }));
    setThermalFeedback(null);
  };

  const handleVerifyThermalMap = () => {
    if (tirsState.status === 'failed') return;

    const allTagged = thermalMarkers.every((m) => Boolean(thermalTags[m.id]));
    if (!allTagged) {
      sound.playAlert();
      onFailSubTask?.('B_thermal');
      setThermalFeedback(
        isEn
          ? 'Tap each hotspot on the map, adjust °C threshold to compare Band 10 vs 11, and tag all 3 regions!'
          : 'Hãy chạm từng điểm trên bản đồ nhiệt, chỉnh ngưỡng °C quan sát 2 băng sóng và gắn thẻ cho cả 3 vùng!'
      );
      return;
    }

    const allCorrect = thermalMarkers.every((m) => thermalTags[m.id] === m.expectedTag);
    const diagPatch = {
      diagnosisAttempts: session.diagnosisAttempts + 1,
      diagnosisCorrect: session.diagnosisCorrect + (allCorrect ? 1 : 0),
    };

    if (allCorrect) {
      sound.playSuccess();
      setThermalFeedback(
        isEn
          ? 'Accurate thermal classification! You separated real wildfire heat (high in both Bands 10 & 11) from a sensor artifact.'
          : 'Phân tích bản đồ nhiệt chuẩn xác! Bạn đã phân biệt được cháy rừng thật (cả Band 10 & 11 đều cao) với điểm lỗi cảm biến.'
      );
      onCompleteSubTask('B_thermal', undefined, diagPatch);
    } else {
      sound.playAlert();
      onFailSubTask?.('B_thermal', diagPatch);
      setThermalFeedback(
        isEn
          ? 'Classification mismatch! Tip: true wildfire stays hot in both Band 10 and Band 11 (~54°C), while 92°C vs 21°C indicates a Sensor Fault.'
          : 'Thẻ phân loại chưa khớp dữ liệu 2 băng nhiệt! Mẹo: cháy rừng thật thì Band 10 và Band 11 cùng nóng (~54°C), còn lệch 92°C vs 21°C là Lỗi cảm biến.'
      );
    }
  };

  // Drag & Reorder Schedule Helpers
  const addToQueue = (id: string) => {
    if (procState.status === 'failed' || queueIds.includes(id)) return;
    sound.playEquip();
    setQueueIds((prev) => [...prev, id]);
    setScheduleFeedback(null);
  };

  const removeFromQueue = (id: string) => {
    sound.playClick();
    setQueueIds((prev) => prev.filter((x) => x !== id));
    setScheduleFeedback(null);
  };

  const moveQueueItem = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= queueIds.length) return;
    sound.playClick();
    setQueueIds((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(nextIdx, 0, item);
      return next;
    });
    setScheduleFeedback(null);
  };

  const handleConfirmSchedule = () => {
    if (procState.status === 'failed' || powerState.status === 'failed') return;
    const totalMins = queueIds.reduce(
      (s, id) => s + (ALL_SCHEDULE_TARGETS.find((t) => t.id === id)?.mins || 0),
      0
    );

    if (queueIds.length > maxPowerSlots) {
      sound.playAlert();
      onFailSubTask?.('C_schedule');
      setScheduleFeedback(
        isEn
          ? `Power supply (${powerPartName}) only supports up to ${maxPowerSlots} zones per orbit!`
          : `Nguồn điện (${powerPartName}) chỉ đủ quét tối đa ${maxPowerSlots} vùng mỗi vòng quỹ đạo!`
      );
      return;
    }

    if (totalMins > 14) {
      sound.playAlert();
      onFailSubTask?.('C_schedule');
      setScheduleFeedback(
        isEn
          ? `Total scan time (${totalMins}/14 min) exceeds the orbital pass window!`
          : `Tổng thời gian (${totalMins}/14 phút) vượt khung bay qua vùng quan sát!`
      );
      return;
    }

    if (!queueIds.includes('fire') || !queueIds.includes('storm')) {
      sound.playAlert();
      onFailSubTask?.('C_schedule');
      setScheduleFeedback(
        isEn
          ? 'Schedule must include both urgent targets (California Wildfire & Super Typhoon)!'
          : 'Lịch chưa bao gồm 2 mục tiêu khẩn cấp (Cháy rừng California & Siêu bão Biển Đông)!'
      );
      return;
    }

    if (queueIds[0] !== 'fire') {
      sound.playAlert();
      onFailSubTask?.('C_schedule');
      setScheduleFeedback(
        isEn
          ? 'Place "California Wildfire (Priority #1)" at position #1 in the schedule!'
          : 'Cần xếp "Cháy rừng California (Khẩn cấp #1)" lên vị trí ưu tiên đầu tiên trong lịch!'
      );
      return;
    }

    sound.playSuccess();
    setScheduleFeedback(
      isEn
        ? `Prioritized observation timeline (${queueIds.length} zones · ${totalMins}/14 min) uploaded to Landsat 9!`
        : `Lịch quan sát theo thứ tự ưu tiên (${queueIds.length} vùng · ${totalMins}/14 phút) đã nạp vào Landsat 9!`
    );
    onCompleteSubTask('C_schedule', { photos: queueIds.length });
  };

  const inSvalbardWindow = orbitLatDeg >= 68 && orbitLatDeg <= 86;

  const handlePolarDownlink = () => {
    if (commsState.status === 'failed') return;
    if (!xBandWired) {
      sound.playAlert();
      onFailSubTask?.('D_downlink');
      setDownlinkFeedback(
        isEn
          ? 'X-Band transmitter wiring in Step 1 is not completed and powered on!'
          : 'Mạch truyền Băng tần X ở Bước 1 chưa được nối và bật nguồn!'
      );
      return;
    }
    if (!inSvalbardWindow) {
      sound.playAlert();
      onFailSubTask?.('D_downlink');
      setDownlinkFeedback(
        isEn
          ? `Satellite is at ${orbitLatDeg}°N — outside the Svalbard polar station coverage (68°N–86°N)! Move satellite north.`
          : `Vệ tinh đang ở vĩ độ ${orbitLatDeg}°N — chưa vào vùng phủ sóng của trạm cực Bắc Svalbard (68°N–86°N)! Hãy kéo vệ tinh lên vùng cực.`
      );
      return;
    }

    sound.playSuccess();
    setDownlinkFeedback(
      isEn
        ? 'X-Band beam locked onto Svalbard Station (Norway) and downloaded full optical & thermal imagery!'
        : 'Đã khóa chùm sóng X-Band với Trạm Svalbard (Na Uy) và truyền toàn bộ dữ liệu ảnh & nhiệt!'
    );
    onCompleteSubTask('D_downlink');
  };

  const tasks: SubTaskItem<LandsatTaskKey>[] = [
    {
      key: 'A_imaging',
      label: isEn ? 'A. OLI-2 Spectral View' : 'A. Phân tích ảnh OLI-2',
      icon: <Camera className="w-4 h-4" />,
      hasError: oliState.status === 'failed' || procState.status === 'failed',
    },
    {
      key: 'B_thermal',
      label: isEn ? 'B. TIRS-2 Thermal Map' : 'B. Bản đồ nhiệt TIRS-2',
      icon: <Thermometer className="w-4 h-4" />,
      hasError: tirsState.status === 'failed',
    },
    {
      key: 'C_schedule',
      label: isEn ? 'C. Scan Timeline' : 'C. Kéo thả lịch quét',
      icon: <CalendarClock className="w-4 h-4" />,
      hasError: procState.status === 'failed' || powerState.status === 'failed',
    },
    {
      key: 'D_downlink',
      label: isEn ? 'D. X-Band & Svalbard' : 'D. Mạch & Trạm Svalbard',
      icon: <Radio className="w-4 h-4" />,
      hasError: commsState.status === 'failed',
    },
  ];

  const selectedMarker = thermalMarkers.find((m) => m.id === selectedThermalId) || thermalMarkers[0];

  return (
    <div className="space-y-5">
      <SubTaskStatusBar
        tasks={tasks}
        activeTask={activeTask}
        completedTasks={session.completedSubTasks}
        failedTasks={session.failedSubTasks}
        lang={lang}
        onSelect={setActiveTask}
      />

      {/* TASK A: INTERACTIVE SATELLITE LAYER & BEFORE/AFTER INSPECTOR */}
      {activeTask === 'A_imaging' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                {isEn
                  ? 'Task A: OLI-2 Spectral Layer Analysis & Hardware Probe'
                  : 'Nhiệm vụ A: Phân tích lớp phổ ảnh OLI-2 & Dò lỗi phần cứng'}
              </h2>
              <p className="text-xs text-sky-800/85 font-medium">
                {isEn
                  ? 'Drag the scan box, enable the Near-Infrared (NIR) layer, slide Before/After comparison, and probe hardware.'
                  : 'Kéo khung vùng ảnh, bật lớp dữ liệu cận hồng ngoại (NIR), kéo thanh so sánh Trước/Sau và dùng đầu dò kiểm tra cảm biến.'}
              </p>
            </div>
          </div>

          <SubsystemLockNotice
            lang={lang}
            session={session}
            subsystemId="sat_oli"
            actionLabel={isEn ? 'OLI-2 Optical Sensor' : 'Cảm biến ảnh OLI-2'}
            onOpenRepair={onOpenRepair}
          />
          <SubsystemLockNotice
            lang={lang}
            session={session}
            subsystemId="sat_processor"
            actionLabel={isEn ? 'Satellite Data Processor' : 'Bộ xử lý dữ liệu vệ tinh'}
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Interactive Image Stage */}
            <div className="lg:col-span-7 space-y-3">
              <div
                ref={imgContainerRef}
                onPointerMove={(e) => {
                  if (draggingRegion) handleScanMove(e.clientX, e.clientY);
                }}
                onPointerUp={() => setDraggingRegion(false)}
                onPointerCancel={() => setDraggingRegion(false)}
                className="relative h-60 rounded-2xl overflow-hidden border-2 border-sky-200 bg-sky-950 select-none touch-none"
              >
                {/* Processed / After Layer */}
                <img
                  src="/src/assets/images/satellite_earth_orbit_1794503041148.jpg"
                  alt={isEn ? 'Processed Landsat 9 view' : 'Ảnh sau xử lý Landsat 9'}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all ${
                    !layerRgb ? 'grayscale' : ''
                  } ${layerNir ? 'hue-rotate-[295deg] saturate-150 contrast-115' : ''}`}
                />

                {/* Raw / Before Overlay clipped by compareSplitPct */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${compareSplitPct}%` }}
                >
                  <img
                    src="/src/assets/images/satellite_earth_orbit_1794503041148.jpg"
                    alt={isEn ? 'Unprocessed raw frame' : 'Ảnh gốc trước xử lý'}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${
                      oliState.status !== 'ok' || procState.status !== 'ok'
                        ? 'grayscale contrast-150 brightness-75 blur-[1.5px]'
                        : 'brightness-90 contrast-95'
                    }`}
                  />
                  {layerRawGrid && (
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(14,165,233,0.3)_0px,rgba(14,165,233,0.3)_3px,transparent_3px,transparent_12px)]" />
                  )}
                </div>

                {/* Split Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow pointer-events-none"
                  style={{ left: `${compareSplitPct}%` }}
                />

                {/* Draggable Scan Crop Box */}
                <div
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggingRegion(true);
                  }}
                  style={{ left: `${scanRegion.xPct}%`, top: `${scanRegion.yPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-20 rounded-xl border-3 border-amber-300 bg-amber-300/15 cursor-grab active:cursor-grabbing flex items-end justify-center p-1"
                >
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-sky-950 text-[10px] font-extrabold whitespace-nowrap">
                    {isEn ? 'Scan' : 'Vùng quét'} ({scanRegion.xPct}%, {scanRegion.yPct}%)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>
                    {isEn
                      ? 'Before Processing (Left) / Spectral Split (Right)'
                      : 'So sánh Trước xử lý (trái) / Sau tách lớp phổ (phải)'}
                  </span>
                  <span className="tabular-nums">{compareSplitPct}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={compareSplitPct}
                  onChange={(e) => setCompareSplitPct(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Spectral Layer Toggles & Hardware Signal Probes */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>{isEn ? 'Toggle spectral observation layers:' : 'Bật/tắt lớp dữ liệu quan sát:'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLayerRgb((v) => !v);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      layerRgb ? 'bg-sky-500 text-white border-sky-600' : 'bg-white text-sky-800 border-sky-200'
                    }`}
                  >
                    {isEn ? 'Natural Color (RGB)' : 'Màu tự nhiên (RGB)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLayerNir((v) => !v);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      layerNir ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-sky-800 border-sky-200'
                    }`}
                  >
                    {isEn ? 'Near-Infrared (NIR)' : 'Cận hồng ngoại (NIR)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLayerRawGrid((v) => !v);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      layerRawGrid ? 'bg-amber-400 text-sky-950 border-amber-500' : 'bg-white text-sky-800 border-sky-200'
                    }`}
                  >
                    {isEn ? 'Raw Scan Banding' : 'Lớp sọc cảm biến thô'}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="text-xs font-extrabold text-sky-950">
                  {isEn ? 'Live hardware signal probes:' : 'Đầu dò kiểm tra phần cứng trực tiếp:'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunProbe('oli')}
                    className={`p-2.5 rounded-xl border-2 text-xs font-extrabold cursor-pointer ${
                      testedProbe === 'oli'
                        ? 'bg-white border-sky-500 text-sky-950'
                        : 'bg-white border-sky-200 text-sky-800 hover:border-sky-400'
                    }`}
                  >
                    {isEn ? 'Probe OLI-2 Signal' : 'Đo tín hiệu OLI-2'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunProbe('processor')}
                    className={`p-2.5 rounded-xl border-2 text-xs font-extrabold cursor-pointer ${
                      testedProbe === 'processor'
                        ? 'bg-white border-sky-500 text-sky-950'
                        : 'bg-white border-sky-200 text-sky-800 hover:border-sky-400'
                    }`}
                  >
                    {isEn ? 'Probe Processor Buffer' : 'Đo Bộ nhớ xử lý'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCaptureProcessedImage}
                className="w-full min-h-11 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer shadow-sm"
              >
                {isEn ? 'Save & Verify High-Res Image' : 'Lưu & Xác nhận ảnh chất lượng cao'}
              </button>
            </div>
          </div>

          {oliFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {oliFeedback}
            </div>
          )}
        </div>
      )}

      {/* TASK B: THERMAL SCALE SLIDER & INTERACTIVE MAP MARKER TAGGING */}
      {activeTask === 'B_thermal' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                {isEn
                  ? 'Task B: Tune TIRS-2 Thermal Threshold & Tag Map Hotspots'
                  : 'Nhiệm vụ B: Điều chỉnh thang nhiệt độ TIRS-2 & Gắn thẻ trực tiếp trên bản đồ'}
              </h2>
              <p className="text-xs text-sky-800/85 font-medium">
                {isEn
                  ? 'Slide the temperature threshold, inspect Band 10 vs Band 11 readings, and classify each marker!'
                  : 'Kéo thanh lọc ngưỡng nhiệt độ, bấm kiểm tra từng điểm (Band 10 vs Band 11) và gắn thẻ phân loại trực tiếp!'}
              </p>
            </div>
            <span className="text-xs font-extrabold text-orange-700 tabular-nums">
              {isEn ? `Alert threshold: ≥ ${heatThresholdC}°C` : `Ngưỡng cảnh báo: ≥ ${heatThresholdC}°C`}
            </span>
          </div>

          <SubsystemLockNotice
            lang={lang}
            session={session}
            subsystemId="sat_tirs"
            actionLabel={isEn ? 'TIRS-2 Thermal Sensor' : 'Cảm biến nhiệt TIRS-2'}
            onOpenRepair={onOpenRepair}
          />

          <div className="space-y-1">
            <input
              type="range"
              min={15}
              max={85}
              value={heatThresholdC}
              onChange={(e) => setHeatThresholdC(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Interactive Thermal Heatmap Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 relative h-56 rounded-2xl overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-emerald-100 via-amber-100 to-sky-200">
              {thermalMarkers.map((m) => {
                const isHot = m.band10C >= heatThresholdC;
                const active = selectedThermalId === m.id;
                const tag = thermalTags[m.id];

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedThermalId(m.id);
                    }}
                    style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer shadow-md ${
                      active ? 'scale-110 ring-4 ring-sky-400 z-20' : 'z-10'
                    } ${
                      isHot
                        ? 'bg-rose-500 text-white border-white'
                        : 'bg-white text-sky-950 border-sky-300'
                    }`}
                  >
                    <div className="text-[11px] font-extrabold leading-tight max-w-[140px]">{m.name}</div>
                    <div className="text-sm font-black tabular-nums flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 shrink-0" />
                      <span>{m.band10C}°C</span>
                    </div>
                    {tag && (
                      <div className="text-[10px] font-bold bg-sky-950/85 text-white px-1.5 py-0.5 rounded mt-1 leading-tight max-w-[140px]">
                        {tag === 'fire'
                          ? isEn
                            ? 'Tag: True Wildfire'
                            : 'Thẻ: Cháy rừng thật'
                          : tag === 'sensor_fault'
                          ? isEn
                            ? 'Tag: Sensor Fault'
                            : 'Thẻ: Lỗi cảm biến'
                          : isEn
                          ? 'Tag: Normal'
                          : 'Thẻ: Bình thường'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Marker Probe & Pin Action */}
            <div className="md:col-span-5 rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 space-y-3">
              <div className="text-sm font-extrabold text-sky-950">{selectedMarker.name}</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold tabular-nums">
                <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                  <span className="text-sky-700 block">{isEn ? 'Band 10 Channel' : 'Kênh Band 10'}</span>
                  <span className="text-base font-black text-orange-600">{selectedMarker.band10C}°C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                  <span className="text-sky-700 block">{isEn ? 'Band 11 Channel' : 'Kênh Band 11'}</span>
                  <span className="text-base font-black text-sky-700">{selectedMarker.band11C}°C</span>
                </div>
              </div>

              <div className="text-xs font-extrabold text-sky-900">
                {isEn ? 'Assign classification tag:' : 'Gắn nhãn lên điểm này:'}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  disabled={tirsState.status === 'failed'}
                  onClick={() => handleTagThermal('fire')}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold cursor-pointer ${
                    thermalTags[selectedThermalId] === 'fire'
                      ? 'bg-orange-500 text-white border-orange-600'
                      : 'bg-white text-sky-900 border-sky-200'
                  }`}
                >
                  {isEn ? 'Tag: Real Wildfire' : 'Đánh dấu: Cháy rừng thật'}
                </button>
                <button
                  type="button"
                  disabled={tirsState.status === 'failed'}
                  onClick={() => handleTagThermal('sensor_fault')}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold cursor-pointer ${
                    thermalTags[selectedThermalId] === 'sensor_fault'
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white text-sky-900 border-sky-200'
                  }`}
                >
                  {isEn ? 'Tag: Sensor Pixel Fault' : 'Đánh dấu: Lỗi điểm ảnh cảm biến'}
                </button>
                <button
                  type="button"
                  disabled={tirsState.status === 'failed'}
                  onClick={() => handleTagThermal('normal')}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold cursor-pointer ${
                    thermalTags[selectedThermalId] === 'normal'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white text-sky-900 border-sky-200'
                  }`}
                >
                  {isEn ? 'Tag: Nominal Temperature' : 'Đánh dấu: Nhiệt độ ổn định'}
                </button>
              </div>
            </div>
          </div>

          {thermalFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {thermalFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={tirsState.status === 'failed'}
            onClick={handleVerifyThermalMap}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            {isEn ? 'Submit TIRS-2 Thermal Map' : 'Chốt bản đồ phân loại nhiệt TIRS-2'}
          </button>
        </div>
      )}

      {/* TASK C: DRAG & DROP + REORDER OBSERVATION TIMELINE */}
      {activeTask === 'C_schedule' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                {isEn
                  ? 'Task C: Drag & Prioritize Observation Pass Schedule'
                  : 'Nhiệm vụ C: Kéo thả & Sắp xếp thứ tự ưu tiên lịch quan sát'}
              </h2>
              <p className="text-xs text-sky-800/85 font-medium">
                {isEn
                  ? 'Drag or add zones into the Orbital Schedule, and move Priority #1 (California Wildfire) to slot 1!'
                  : 'Kéo hoặc bấm thêm vùng vào Lịch quỹ đạo, rồi xếp vùng khẩn cấp #1 (Cháy rừng California) lên đầu tiên!'}
              </p>
            </div>
            <span className="text-xs font-extrabold text-sky-800 tabular-nums">
              {isEn
                ? `Power cap: max ${maxPowerSlots} zones · Orbit pass: ≤ 14 min`
                : `Điện khả dụng: tối đa ${maxPowerSlots} vùng · Quỹ đạo: ≤ 14 phút`}
            </span>
          </div>

          <SubsystemLockNotice
            lang={lang}
            session={session}
            subsystemId="sat_processor"
            actionLabel={isEn ? 'Observation Scheduler' : 'Bộ lập lịch quan sát'}
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Available Targets Pool */}
            <div className="rounded-2xl bg-sky-50/70 border-2 border-sky-200 p-3.5 space-y-2">
              <div className="text-xs font-extrabold text-sky-900">
                {isEn ? 'Target Pool (Drag or click +):' : 'Kho vùng cần quan sát (Kéo hoặc bấm +):'}
              </div>
              {ALL_SCHEDULE_TARGETS.filter((t) => !queueIds.includes(t.id)).map((t) => (
                <div
                  key={t.id}
                  draggable={procState.status !== 'failed'}
                  onDragStart={() => setDragTargetId(t.id)}
                  onDragEnd={() => setDragTargetId(null)}
                  className="p-3 rounded-xl bg-white border-2 border-sky-200 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-sky-950">{isEn ? t.nameEn : t.name}</div>
                    <div className="text-[11px] font-semibold text-sky-700">
                      {isEn ? `Scan duration: ${t.mins} min` : `Thời gian quét: ${t.mins} phút`}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={procState.status === 'failed'}
                    onClick={() => addToQueue(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Add' : 'Thêm'}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Active Dropzone Priority Queue */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragTargetId) addToQueue(dragTargetId);
                setDragTargetId(null);
              }}
              className="rounded-2xl bg-emerald-50/50 border-2 border-dashed border-emerald-300 p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-extrabold text-emerald-950">
                <span>{isEn ? 'Satellite Priority Queue:' : 'Lịch chụp ưu tiên trên vệ tinh:'}</span>
                <span className="tabular-nums">
                  {queueIds.length}/{maxPowerSlots} {isEn ? 'zones' : 'vùng'} ·{' '}
                  {queueIds.reduce(
                    (s, id) => s + (ALL_SCHEDULE_TARGETS.find((x) => x.id === id)?.mins || 0),
                    0
                  )}
                  /14 {isEn ? 'min' : 'phút'}
                </span>
              </div>

              {queueIds.length === 0 && (
                <div className="py-6 text-center text-xs font-bold text-emerald-800/70">
                  {isEn ? 'Drag observation targets here!' : 'Kéo thả vùng quan sát vào đây!'}
                </div>
              )}

              {queueIds.map((id, idx) => {
                const item = ALL_SCHEDULE_TARGETS.find((t) => t.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="p-2.5 rounded-xl bg-white border-2 border-emerald-300 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-sky-950 leading-snug break-words">
                          {isEn ? item.nameEn : item.name}
                        </div>
                        <div className="text-[11px] font-semibold text-sky-700">
                          {item.mins} {isEn ? 'min' : 'phút'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveQueueItem(idx, -1)}
                        className="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 disabled:opacity-35 flex items-center justify-center cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-sky-800" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === queueIds.length - 1}
                        onClick={() => moveQueueItem(idx, 1)}
                        className="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 disabled:opacity-35 flex items-center justify-center cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-sky-800" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromQueue(id)}
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {scheduleFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {scheduleFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={procState.status === 'failed' || queueIds.length === 0}
            onClick={handleConfirmSchedule}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            {isEn ? 'Upload Schedule to Landsat 9' : 'Nạp lịch quan sát lên Landsat 9'}
          </button>
        </div>
      )}

      {/* TASK D: X-BAND CIRCUIT WIRING + POLAR GROUND PASS LOCK */}
      {activeTask === 'D_downlink' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            {isEn
              ? 'Task D: Wire X-Band Transmitter & Lock Polar Ground Pass'
              : 'Nhiệm vụ D: Nối mạch phát X-Band & Đón trạm mặt đất vùng cực'}
          </h2>

          <SubsystemLockNotice
            lang={lang}
            session={session}
            subsystemId="sat_comms"
            actionLabel={isEn ? 'X-Band Downlink Antenna' : 'Ăng-ten băng tần X'}
            onOpenRepair={onOpenRepair}
          />

          <CircuitWiringBoard
            lang={lang}
            title={isEn ? 'Step 1: Wire X-Band downlink transmitter' : 'Bước 1: Đấu nối mạch phát sóng Băng tần X'}
            instruction={
              isEn
                ? 'Connect 28V Power Bus and OLI/TIRS Data Cache to the matching X-Band ports.'
                : 'Nối Nguồn Bus, Bộ nhớ ảnh OLI/TIRS và Bộ phát sóng X-Band đúng cổng.'
            }
            disabled={commsState.status === 'failed'}
            leftNodes={[
              { id: 'mem', label: isEn ? '14-bit Image Cache' : 'Kho ảnh nén 14-bit', color: '#0284c7', sublabel: isEn ? 'OLI/TIRS Payload' : 'Dữ liệu OLI/TIRS' },
              { id: 'pwr', label: isEn ? '28V Power Bus' : 'Bus nguồn 28V', color: '#f59e0b', sublabel: isEn ? 'Transmitter Power' : 'Cấp máy phát' },
            ]}
            rightNodes={[
              { id: 'x_pwr', label: isEn ? 'X-Band Power Pin' : 'Chân nguồn X-Band', color: '#f59e0b', sublabel: isEn ? 'Amplifier' : 'Bộ khuếch đại' },
              { id: 'x_in', label: isEn ? 'RF Data Port' : 'Cổng dữ liệu phát', color: '#0284c7', sublabel: '8.2 GHz TX' },
            ]}
            expectedConnections={[
              {
                fromId: 'mem',
                toId: 'x_in',
                errorHint: isEn
                  ? 'Image Cache must connect to the 8.2 GHz RF Data Port!'
                  : 'Kho ảnh phải nối vào Cổng dữ liệu phát 8.2 GHz!',
              },
              { fromId: 'pwr', toId: 'x_pwr' },
            ]}
            onSuccess={() => setXBandWired(true)}
          />

          <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-sky-950">
                {isEn
                  ? 'Step 2: Steer polar orbit position into Svalbard Ground Station window (68°N–86°N)'
                  : 'Bước 2: Điều chỉnh vị trí quỹ đạo cực để bắt sóng Trạm Svalbard (Vùng 68°N–86°N)'}
              </span>
              <span className={`text-xs font-extrabold tabular-nums ${inSvalbardWindow ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isEn ? `Latitude: ${orbitLatDeg}°N` : `Vĩ độ hiện tại: ${orbitLatDeg}°N`} (
                {inSvalbardWindow
                  ? isEn
                    ? 'Inside Svalbard footprint ✓'
                    : 'Trong vùng phủ sóng Svalbard ✓'
                  : isEn
                  ? 'Out of range'
                  : 'Ngoài tầm bắt sóng'}
                )
              </span>
            </div>

            <div className="h-14 rounded-xl bg-white border border-sky-200 relative overflow-hidden flex items-center px-3">
              <div
                style={{ left: '72%', width: '20%' }}
                className="absolute top-1 bottom-1 rounded-lg bg-emerald-100 border-2 border-dashed border-emerald-500 flex items-center justify-center text-[10px] font-extrabold text-emerald-900"
              >
                Svalbard (68–86°N)
              </div>
              <div
                className="absolute w-8 h-8 rounded-full bg-sky-500 border-2 border-white shadow flex items-center justify-center text-[10px] font-black text-white transition-all"
                style={{ left: `${((orbitLatDeg - 5) / 85) * 92}%` }}
              >
                L9
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={90}
              value={orbitLatDeg}
              disabled={commsState.status === 'failed'}
              onChange={(e) => setOrbitLatDeg(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {downlinkFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {downlinkFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={commsState.status === 'failed'}
            onClick={handlePolarDownlink}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            {isEn ? 'Downlink Payload to Svalbard' : 'Phát sóng tải dữ liệu xuống Trạm Svalbard'}
          </button>
        </div>
      )}
    </div>
  );
};
