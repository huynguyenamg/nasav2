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
  BatteryCharging,
  CalendarClock,
  CheckCircle2,
  Compass,
  Crosshair,
  Eye,
  GripVertical,
  Search,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface HubbleSimulatorProps {
  session: MissionSessionState;
  lang: Language;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onCompleteSubTask: (
    taskId: string,
    extras?: { photos?: number; samples?: number },
    sessionPatch?: Partial<MissionSessionState>
  ) => void;
  onFailSubTask?: (taskId: string, sessionPatch?: Partial<MissionSessionState>) => void;
}

type HubbleTaskKey = 'A_optics' | 'B_guidance' | 'C_power' | 'D_schedule';
type OpticalFilter = 'uv' | 'visible' | 'ir';

interface SkyTargetItem {
  id: string;
  name: string;
  nameEn: string;
  energy: number;
  scienceRank: number;
  note: string;
  noteEn: string;
}

const INITIAL_SKY_TARGETS: SkyTargetItem[] = [
  {
    id: 'moon_test',
    name: 'Chụp thử Mặt Trăng (Quá sáng — Ít giá trị mới)',
    nameEn: 'Test-capture the Moon (Too bright — Low science value)',
    energy: 15,
    scienceRank: 4,
    note: 'Ánh sáng phản chiếu quá mạnh có thể gây chói cảm biến WFC3.',
    noteEn: 'Reflected glare is too strong and can saturate the WFC3 sensor.',
  },
  {
    id: 'galaxy',
    name: 'Thiên hà cổ cách 13 tỷ năm ánh sáng (Ưu tiên 3)',
    nameEn: 'Ancient Galaxy 13B Light-Years Away (Priority #3)',
    energy: 35,
    scienceRank: 3,
    note: 'Cần thời gian phơi sáng dài sau khi hiệu chỉnh xong ngoại hành tinh.',
    noteEn: 'Requires long exposure after completing the exoplanet window.',
  },
  {
    id: 'exoplanet',
    name: 'Khí quyển Ngoại hành tinh (Ưu tiên khoa học #1)',
    nameEn: 'Exoplanet Atmosphere Transit (Science Priority #1)',
    energy: 30,
    scienceRank: 1,
    note: 'Cửa sổ quá cảnh khí quyển ngắn — phải quan sát đầu tiên!',
    noteEn: 'Short atmospheric transit window — must observe first!',
  },
  {
    id: 'nebula',
    name: 'Tinh vân Đại Bàng hình thành sao (Ưu tiên #2)',
    nameEn: 'Eagle Nebula Star-Forming Pillars (Priority #2)',
    energy: 25,
    scienceRank: 2,
    note: 'Dùng dải phổ Khả kiến/Hồng ngoại xuyên bụi khí.',
    noteEn: 'Use Visible or Infrared band to peer through cosmic dust.',
  },
];

export const HubbleSimulator: React.FC<HubbleSimulatorProps> = ({
  session,
  lang,
  onOpenRepair,
  onCompleteSubTask,
  onFailSubTask,
}) => {
  const isEn = lang === 'en';
  const [activeTask, setActiveTask] = useState<HubbleTaskKey>('A_optics');

  // Task A: Optics Focus, Exposure, Filter, Before/After Compare, Zoom/Pan & Anomaly Mark
  const [focusPct, setFocusPct] = useState(44);
  const [exposureSec, setExposureSec] = useState(18);
  const [activeFilter, setActiveFilter] = useState<OpticalFilter>('uv');
  const [compareSplit, setCompareSplit] = useState(65);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [artifactMasked, setArtifactMasked] = useState(false);
  const [imgFallback, setImgFallback] = useState(false);
  const [opticsFeedback, setOpticsFeedback] = useState<string | null>(null);

  // Task B: FGS Star Lock trackpad + live orbital drift
  const [pitchDrift, setPitchDrift] = useState(16);
  const [yawDrift, setYawDrift] = useState(-14);
  const [starLocked, setStarLocked] = useState(false);
  const [guidanceFeedback, setGuidanceFeedback] = useState<string | null>(null);
  const starPadRef = useRef<HTMLDivElement>(null);
  const [isDraggingPad, setIsDraggingPad] = useState(false);

  // Task C: Power breakers + sliders + CircuitWiringBoard
  const [breakers, setBreakers] = useState({
    fgs: true,
    wfc3: true,
    heater: true,
    gyroBackup: false,
  });
  const [allocFgs, setAllocFgs] = useState(38);
  const [allocWfc3, setAllocWfc3] = useState(40);
  const [allocHeater, setAllocHeater] = useState(14);
  const [allocGyro, setAllocGyro] = useState(12);
  const [wiringOk, setWiringOk] = useState(false);
  const [powerFeedback, setPowerFeedback] = useState<string | null>(null);

  // Task D: Drag/reorder target queue + selection
  const [targetQueue, setTargetQueue] = useState<SkyTargetItem[]>(INITIAL_SKY_TARGETS);
  const [enabledTargets, setEnabledTargets] = useState<string[]>(['exoplanet', 'nebula']);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);

  const opticsState = getEffectiveSubsystemState(session, 'hst_optics', lang);
  const guidanceState = getEffectiveSubsystemState(session, 'hst_guidance', lang);
  const powerState = getEffectiveSubsystemState(session, 'hst_power', lang);
  const compState = getEffectiveSubsystemState(session, 'hst_computer', lang);

  const powerPart = getPartById(session.subsystems.hst_power?.partId || '');
  const maxObsTargets = powerPart?.tier === 'economy' ? 2 : 3;

  useEffect(() => {
    setOpticsFeedback(null);
    setGuidanceFeedback(null);
    setPowerFeedback(null);
    setScheduleFeedback(null);
  }, [lang]);

  const isDone = (k: HubbleTaskKey) => session.completedSubTasks.includes(k);

  // Subtle orbital micro-drift when guidance tab is open and unlocked
  useEffect(() => {
    if (activeTask !== 'B_guidance' || guidanceState.status === 'failed' || starLocked || isDraggingPad) {
      return;
    }
    const timer = window.setInterval(() => {
      setPitchDrift((p) => {
        const step = guidanceState.status === 'degraded' ? 2 : 1;
        const delta = Math.random() > 0.5 ? step : -step;
        return Math.max(-24, Math.min(24, p + delta));
      });
      setYawDrift((y) => {
        const step = guidanceState.status === 'degraded' ? 2 : 1;
        const delta = Math.random() > 0.5 ? step : -step;
        return Math.max(-24, Math.min(24, y + delta));
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [activeTask, guidanceState.status, starLocked, isDraggingPad]);

  // Derived optics visual quality
  const focusError = Math.abs(focusPct - 82);
  const exposureOptimal = exposureSec >= 35 && exposureSec <= 65;
  const filterGood = activeFilter === 'visible' || activeFilter === 'ir';
  const liveBlurPx =
    opticsState.status !== 'ok' ? 4.5 : Math.max(0, Number((focusError * 0.14).toFixed(1)));
  const liveBrightness =
    exposureSec < 25 ? 0.55 + exposureSec / 55 : exposureSec > 75 ? 1.45 : 1.05;

  const handleCaptureDeepSpace = () => {
    if (opticsState.status === 'failed') return;
    if (opticsState.status === 'degraded') {
      sound.playAlert();
      onFailSubTask?.('A_optics');
      setOpticsFeedback(
        isEn
          ? 'The nebula image is still blurred because WFC3 optics or FGS guidance is degraded! Repair before capturing.'
          : 'Ảnh tinh vân vẫn bị mờ do gương WFC3 hoặc hệ định hướng FGS đang suy giảm! Hãy sửa trước khi chụp.'
      );
      return;
    }
    if (focusError > 6) {
      sound.playAlert();
      onFailSubTask?.('A_optics');
      setOpticsFeedback(
        isEn
          ? `Mirror focus is misaligned (${focusPct}% — optimal 76%–88%). Drag the Focus slider until stars are sharp!`
          : `Tiêu cự gương đang lệch (${focusPct}% — tối ưu 76%–88%). Hãy kéo thanh Tiêu cự cho sao hết nhòe!`
      );
      return;
    }
    if (!exposureOptimal) {
      sound.playAlert();
      onFailSubTask?.('A_optics');
      setOpticsFeedback(
        exposureSec < 35
          ? isEn
            ? `Exposure ${exposureSec}s is too short and underexposed! Increase to 35s–65s.`
            : `Phơi sáng ${exposureSec}s quá ngắn, tinh vân bị tối! Hãy tăng lên 35s–65s.`
          : isEn
          ? `Exposure ${exposureSec}s is too long and overexposed! Reduce to 35s–65s.`
          : `Phơi sáng ${exposureSec}s quá lâu, ảnh bị cháy sáng! Hãy giảm về 35s–65s.`
      );
      return;
    }
    if (!filterGood) {
      sound.playAlert();
      onFailSubTask?.('A_optics');
      setOpticsFeedback(
        isEn
          ? 'The UV filter is blocked by thick nebula dust! Switch to Visible or Infrared.'
          : 'Bộ lọc Cực tím bị bụi khí tinh vân che mờ! Hãy chuyển sang Bộ lọc Khả kiến hoặc Hồng ngoại.'
      );
      return;
    }
    if (!artifactMasked) {
      sound.playAlert();
      onFailSubTask?.('A_optics');
      setOpticsFeedback(
        isEn
          ? 'Cosmic-ray hot pixel detected on the sensor! Zoom in (≥ 1.5x) and tap the glowing magenta artifact directly to filter it out.'
          : 'Phát hiện đốm nhiễu tia vũ trụ trên cảm biến! Hãy phóng to 2x–3x và chạm trực tiếp vào đốm nhiễu xanh tím để lọc bỏ.'
      );
      return;
    }
    sound.playSuccess();
    setOpticsFeedback(
      isEn
        ? 'Captured razor-sharp Eagle Nebula imagery with cosmic-ray noise removed!'
        : 'Đã thu ảnh Tinh vân Đại Bàng sắc nét tuyệt đối và loại bỏ xong điểm nhiễu!'
    );
    onCompleteSubTask('A_optics', { photos: 2 });
  };

  const updatePointerAlignment = (clientX: number, clientY: number) => {
    if (!starPadRef.current || guidanceState.status === 'failed') return;
    const rect = starPadRef.current.getBoundingClientRect();
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
    // Target center is (0,0) -> drift is inverted offset from center
    setYawDrift(Math.round(Math.max(-25, Math.min(25, nx * 25))));
    setPitchDrift(Math.round(Math.max(-25, Math.min(25, ny * 25))));
    setStarLocked(false);
  };

  const handleLockGuideStar = () => {
    if (guidanceState.status === 'failed') return;
    if (guidanceState.status === 'degraded') {
      sound.playAlert();
      onFailSubTask?.('B_guidance');
      setGuidanceFeedback(
        isEn
          ? 'FGS sensor is degraded, causing pointing jitter! Repair it first to stabilize.'
          : 'Cảm biến FGS đang suy giảm nên góc bị rung lắc! Hãy vào sửa chữa để ổn định.'
      );
      return;
    }
    if (Math.abs(pitchDrift) <= 2 && Math.abs(yawDrift) <= 2) {
      sound.playSuccess();
      setStarLocked(true);
      setGuidanceFeedback(
        isEn
          ? 'Guide star locked steadily (pointing jitter < 0.015 arcsec)!'
          : 'Đã khóa chặt ngôi sao dẫn đường (sai số < 0.015 giây cung)!'
      );
      onCompleteSubTask('B_guidance');
    } else {
      sound.playAlert();
      onFailSubTask?.('B_guidance');
      setGuidanceFeedback(
        isEn
          ? 'Reticle is still off the guide star! Drag directly on the starfield pad to center it.'
          : 'Tâm ngắm vẫn lệch khỏi ngôi sao dẫn đường! Hãy kéo trực tiếp trên màn hình ngắm về tâm.'
      );
    }
  };

  const activePowerTotal =
    (breakers.fgs ? allocFgs : 0) +
    (breakers.wfc3 ? allocWfc3 : 0) +
    (breakers.heater ? allocHeater : 0) +
    (breakers.gyroBackup ? allocGyro : 0);
  const powerBudget = powerPart?.tier === 'economy' ? 85 : 105;

  const handleConfirmPower = () => {
    if (powerState.status === 'failed') return;
    if (!breakers.fgs || !breakers.wfc3) {
      sound.playAlert();
      onFailSubTask?.('C_power');
      setPowerFeedback(
        isEn
          ? 'Cannot open FGS or WFC3 circuit breakers during science observations!'
          : 'Không thể ngắt cầu dao FGS hoặc WFC3 khi đang quan sát khoa học!'
      );
      return;
    }
    if (!wiringOk) {
      sound.playAlert();
      onFailSubTask?.('C_power');
      setPowerFeedback(
        isEn
          ? 'Connect all cables on the power bus board and turn on the power switch first!'
          : 'Hãy nối đủ dây trên bảng mạch phân phối điện và bật nguồn kiểm tra trước!'
      );
      return;
    }
    if (activePowerTotal > powerBudget) {
      sound.playAlert();
      onFailSubTask?.('C_power');
      setPowerFeedback(
        isEn
          ? `Battery bus load exceeded (${activePowerTotal}% > ${powerBudget}%)! Open backup circuits or lower sliders.`
          : `Vượt công suất tổ hợp pin (${activePowerTotal}% > ${powerBudget}%)! Hãy ngắt thiết bị phụ hoặc hạ thanh kéo.`
      );
      return;
    }
    if (allocFgs < 35 || allocWfc3 < 35) {
      sound.playAlert();
      onFailSubTask?.('C_power');
      setPowerFeedback(
        isEn
          ? 'Supply at least 35% power to FGS Guidance and 35% to the WFC3 Camera.'
          : 'Cần cấp tối thiểu 35% điện cho Hệ định hướng FGS và 35% cho Camera WFC3.'
      );
      return;
    }
    sound.playSuccess();
    setPowerFeedback(
      isEn
        ? 'Power buses wired and balanced for the deep-sky observation shift!'
        : 'Đã nối mạch và cân bằng điện năng hoàn hảo cho ca chụp ảnh thiên văn sâu!'
    );
    onCompleteSubTask('C_power');
  };

  const moveTarget = (from: number, to: number) => {
    if (to < 0 || to >= targetQueue.length || from === to) return;
    sound.playClick();
    setScheduleFeedback(null);
    setTargetQueue((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const toggleTargetEnabled = (id: string) => {
    sound.playClick();
    setScheduleFeedback(null);
    setEnabledTargets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirmSchedule = () => {
    if (compState.status === 'failed') return;
    const activeOrdered = targetQueue.filter((t) => enabledTargets.includes(t.id));
    if (activeOrdered.length === 0) {
      sound.playAlert();
      onFailSubTask?.('D_schedule');
      setScheduleFeedback(
        isEn
          ? 'Select at least 2 astronomical targets for the observation schedule!'
          : 'Hãy chọn ít nhất 2 mục tiêu thiên văn vào lịch quan sát!'
      );
      return;
    }
    if (activeOrdered.length > maxObsTargets) {
      sound.playAlert();
      onFailSubTask?.('D_schedule');
      const powerPartName = powerPart
        ? getPartText(powerPart, lang).name
        : isEn
        ? 'Power System'
        : 'Hệ thống nguồn';
      setScheduleFeedback(
        isEn
          ? `Power pack (${powerPartName}) supports at most ${maxObsTargets} targets in this shift!`
          : `Nguồn điện (${powerPartName}) chỉ đủ chạy tối đa ${maxObsTargets} mục tiêu trong ca này!`
      );
      return;
    }
    if (activeOrdered.some((t) => t.id === 'moon_test')) {
      sound.playAlert();
      onFailSubTask?.('D_schedule');
      setScheduleFeedback(
        isEn
          ? 'Imaging the bright Moon risks blinding the WFC3 sensor! Deselect this target.'
          : 'Chụp Mặt Trăng quá sáng sẽ làm chói cảm biến WFC3! Hãy bỏ chọn mục tiêu này.'
      );
      return;
    }
    if (!enabledTargets.includes('exoplanet') || !enabledTargets.includes('nebula')) {
      sound.playAlert();
      onFailSubTask?.('D_schedule');
      setScheduleFeedback(
        isEn
          ? 'Keep the top 2 priority targets selected: Exoplanet Atmosphere and Eagle Nebula!'
          : 'Hãy giữ lại 2 mục tiêu ưu tiên hàng đầu: Ngoại hành tinh và Tinh vân Đại Bàng!'
      );
      return;
    }
    const exoIdx = activeOrdered.findIndex((t) => t.id === 'exoplanet');
    const nebIdx = activeOrdered.findIndex((t) => t.id === 'nebula');
    if (exoIdx > nebIdx) {
      sound.playAlert();
      onFailSubTask?.('D_schedule');
      setScheduleFeedback(
        isEn
          ? 'Exoplanet transit window is short — move it to #1 ahead of the Eagle Nebula!'
          : 'Ngoại hành tinh có cửa sổ quá cảnh ngắn — hãy kéo lên vị trí ưu tiên #1 trước Tinh vân!'
      );
      return;
    }
    sound.playSuccess();
    setScheduleFeedback(
      isEn
        ? `Prioritized observation schedule (${activeOrdered.length} targets) locked in!`
        : `Lịch quan sát theo thứ tự ưu tiên (${activeOrdered.length} mục tiêu) đã khóa thành công!`
    );
    onCompleteSubTask('D_schedule');
  };

  const tasks: SubTaskItem<HubbleTaskKey>[] = [
    {
      key: 'A_optics',
      label: isEn ? 'A. Optics & Noise Filter' : 'A. Soi & Chỉnh quang học',
      icon: <Eye className="w-4 h-4" />,
      hasError: opticsState.status === 'failed',
    },
    {
      key: 'B_guidance',
      label: isEn ? 'B. FGS Star Lock' : 'B. Bắt sao FGS',
      icon: <Compass className="w-4 h-4" />,
      hasError: guidanceState.status === 'failed',
    },
    {
      key: 'C_power',
      label: isEn ? 'C. Power Bus & Breakers' : 'C. Mạch & Cầu dao điện',
      icon: <BatteryCharging className="w-4 h-4" />,
      hasError: powerState.status === 'failed',
    },
    {
      key: 'D_schedule',
      label: isEn ? 'D. Observation Queue' : 'D. Kéo-thả lịch sao',
      icon: <CalendarClock className="w-4 h-4" />,
      hasError: compState.status === 'failed',
    },
  ];

  const photoSrc = imgFallback
    ? '/src/assets/images/satellite_earth_orbit_1794503041148.jpg'
    : 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~medium.jpg';

  const pointingErrorArcsec = (Math.hypot(pitchDrift, yawDrift) * 0.025).toFixed(2);

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

      {/* TASK A: INTERACTIVE OPTICS + BEFORE/AFTER + ZOOM/PAN ANOMALY */}
      {activeTask === 'A_optics' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-sky-950 font-display flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-sky-600" />
              <span>
                {isEn
                  ? 'Task A: Adjust WFC3 Optics, Compare Before/After & Filter Noise'
                  : 'Nhiệm vụ A: Chỉnh quang học WFC3, So sánh Trước/Sau & Lọc nhiễu ảnh'}
              </span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setZoomLevel((z) => Math.max(1, Number((z - 0.5).toFixed(1))));
                  if (zoomLevel <= 1.5) setPanOffset({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{isEn ? 'Out' : 'Thu'}</span>
              </button>
              <span className="px-2.5 py-1.5 rounded-xl bg-sky-100 text-sky-950 text-xs font-extrabold tabular-nums">
                {zoomLevel.toFixed(1)}x
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setZoomLevel((z) => Math.min(3, Number((z + 0.5).toFixed(1))));
                }}
                className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isEn ? 'Zoom' : 'Phóng to'}</span>
              </button>
            </div>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="hst_optics"
            actionLabel={isEn ? 'WFC3 Mirror & Sensor' : 'Gương & Cảm biến WFC3'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />
          <SubsystemLockNotice
            session={session}
            subsystemId="hst_guidance"
            actionLabel={isEn ? 'FGS Guidance System' : 'Hệ định hướng FGS'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          {/* Before / After Comparison + Zoomable Nebula Viewport */}
          <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-sky-300 bg-sky-950 select-none">
            {/* Base UNCALIBRATED ("Trước") layer */}
            <img
              src={photoSrc}
              alt={isEn ? 'Uncalibrated raw nebula image' : 'Ảnh gốc chưa hiệu chỉnh'}
              referrerPolicy="no-referrer"
              onError={() => setImgFallback(true)}
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                filter: 'blur(5px) brightness(0.65) grayscale(35%)',
              }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
            />

            {/* Tuned CALIBRATED ("Sau") layer clipped by compareSplit */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${100 - compareSplit}%)` }}
            >
              <img
                src={photoSrc}
                alt={isEn ? 'Calibrated nebula image' : 'Ảnh tinh vân sau hiệu chỉnh'}
                referrerPolicy="no-referrer"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  filter: `blur(${liveBlurPx}px) brightness(${liveBrightness}) ${
                    activeFilter === 'ir'
                      ? 'sepia(35%) saturate(150%)'
                      : activeFilter === 'uv'
                      ? 'hue-rotate(190deg) saturate(70%)'
                      : 'saturate(115%)'
                  }`,
                }}
                className="w-full h-full object-cover transition-transform duration-200"
              />

              {/* Cosmic Ray Dead-Pixel Cluster Marker inside zoomed image */}
              <button
                type="button"
                onClick={() => {
                  if (zoomLevel < 1.5) {
                    sound.playAlert();
                    setOpticsFeedback(
                      isEn
                        ? 'Click Zoom (≥ 1.5x) to spot and tap the cosmic-ray artifact!'
                        : 'Hãy bấm Phóng to (≥ 1.5x) để soi rõ và chạm lọc đốm nhiễu tia vũ trụ!'
                    );
                    return;
                  }
                  sound.playSuccess();
                  setArtifactMasked(true);
                  setOpticsFeedback(
                    isEn
                      ? 'Cosmic-ray hot-pixel cluster masked and removed from the sensor!'
                      : 'Đã đánh dấu & lọc bỏ thành công đốm nhiễu tia vũ trụ trên cảm biến!'
                  );
                }}
                style={{
                  left: `calc(64% + ${panOffset.x * zoomLevel}px)`,
                  top: `calc(38% + ${panOffset.y * zoomLevel}px)`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  artifactMasked
                    ? 'w-7 h-7 bg-emerald-500/85 border-white text-white'
                    : 'w-8 h-8 bg-fuchsia-500/80 border-amber-300 text-white animate-pulse'
                }`}
                title={isEn ? 'Cosmic-ray noise artifact — Tap to filter' : 'Đốm nhiễu tia vũ trụ — Chạm để lọc bỏ'}
              >
                {artifactMasked ? <CheckCircle2 className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            {/* Split Divider Line */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-amber-300 shadow-[0_0_8px_#fcd34d]"
              style={{ left: `${100 - compareSplit}%` }}
            />

            <div className="pointer-events-none absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-extrabold text-sky-950">
              {isEn ? 'BEFORE (Raw)' : 'TRƯỚC (Chưa chỉnh)'}
            </div>
            <div className="pointer-events-none absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/95 text-[11px] font-extrabold text-white">
              {isEn ? `AFTER (Focus ${focusPct}% · ${exposureSec}s)` : `SAU (Tiêu cự ${focusPct}% · ${exposureSec}s)`}
            </div>

            {zoomLevel > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPanOffset((p) => ({ ...p, x: Math.min(40, p.x + 15) }))}
                  className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-extrabold cursor-pointer"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => setPanOffset((p) => ({ ...p, y: Math.min(30, p.y + 12) }))}
                  className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-extrabold cursor-pointer"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setPanOffset((p) => ({ ...p, y: Math.max(-30, p.y - 12) }))}
                  className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-extrabold cursor-pointer"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => setPanOffset((p) => ({ ...p, x: Math.max(-40, p.x - 15) }))}
                  className="px-2 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-extrabold cursor-pointer"
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* Optical Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-sky-950">
                <span>{isEn ? 'Mirror Focus' : 'Tiêu cự gương (Focus)'}</span>
                <span className="tabular-nums text-sky-700">{focusPct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={focusPct}
                onChange={(e) => {
                  setFocusPct(Number(e.target.value));
                  setOpticsFeedback(null);
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="text-[11px] font-semibold text-sky-800">
                {focusError <= 6
                  ? isEn
                    ? 'Crisp focus ✓'
                    : 'Tiêu cự sắc nét ✓'
                  : isEn
                  ? 'Blurry — adjust until crisp'
                  : 'Đang bị mờ — chỉnh cho ảnh rõ'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-sky-950">
                <span>{isEn ? 'Exposure Time' : 'Phơi sáng (Exposure)'}</span>
                <span className="tabular-nums text-sky-700">{exposureSec}s</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                value={exposureSec}
                onChange={(e) => {
                  setExposureSec(Number(e.target.value));
                  setOpticsFeedback(null);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[11px] font-semibold text-sky-800">
                {exposureOptimal
                  ? isEn
                    ? 'Balanced exposure ✓'
                    : 'Ánh sáng cân bằng ✓'
                  : exposureSec < 35
                  ? isEn
                    ? 'Too dark'
                    : 'Quá tối'
                  : isEn
                  ? 'Overexposed'
                  : 'Cháy sáng'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-sky-950">
                <span>{isEn ? 'Before / After Split' : 'Thanh so sánh Trước / Sau'}</span>
                <span className="tabular-nums text-sky-700">{compareSplit}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                value={compareSplit}
                onChange={(e) => setCompareSplit(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex gap-1.5 pt-0.5">
                {([
                  { id: 'uv', label: isEn ? 'UV' : 'Cực tím' },
                  { id: 'visible', label: isEn ? 'Visible' : 'Khả kiến' },
                  { id: 'ir', label: isEn ? 'Infrared' : 'Hồng ngoại' },
                ] as { id: OpticalFilter; label: string }[]).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveFilter(f.id);
                      setOpticsFeedback(null);
                    }}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                      activeFilter === f.id
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-sky-900 border border-sky-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {opticsFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {opticsFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={opticsState.status === 'failed'}
            onClick={handleCaptureDeepSpace}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer shadow-sm"
          >
            {isEn ? 'Capture & Save Deep-Sky Image' : 'Chụp & Lưu ảnh thiên hà sâu'}
          </button>
        </div>
      )}

      {/* TASK B: FGS GUIDANCE INTERACTIVE TRACKPAD */}
      {activeTask === 'B_guidance' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-sky-950 font-display">
              {isEn
                ? 'Task B: Drag FGS Crosshair to Lock Onto Guide Star'
                : 'Nhiệm vụ B: Kéo tâm ngắm FGS bắt chặt ngôi sao dẫn đường'}
            </h2>
            <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-900 text-xs font-extrabold tabular-nums">
              {isEn ? `Pointing offset: ${pointingErrorArcsec}″` : `Sai lệch hiện tại: ${pointingErrorArcsec}″`}
            </span>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="hst_guidance"
            actionLabel={isEn ? 'FGS Sensor & Gyroscopes' : 'Cảm biến định hướng FGS & Con quay'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Pointer-Interactive Star Trackpad */}
            <div
              ref={starPadRef}
              onPointerDown={(e) => {
                if (guidanceState.status === 'failed') return;
                setIsDraggingPad(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                updatePointerAlignment(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (!isDraggingPad) return;
                updatePointerAlignment(e.clientX, e.clientY);
              }}
              onPointerUp={() => setIsDraggingPad(false)}
              onPointerCancel={() => setIsDraggingPad(false)}
              className="h-52 rounded-2xl bg-sky-950 border-2 border-sky-400 relative flex items-center justify-center overflow-hidden touch-none cursor-crosshair select-none"
            >
              {/* Background Stars */}
              <div className="pointer-events-none absolute top-6 left-10 w-1 h-1 rounded-full bg-white/70" />
              <div className="pointer-events-none absolute bottom-8 right-12 w-1.5 h-1.5 rounded-full bg-sky-200/80" />
              <div className="pointer-events-none absolute top-14 right-20 w-1 h-1 rounded-full bg-white/60" />

              {/* Guide Star Lock Zone */}
              <div className="pointer-events-none w-24 h-24 rounded-full border-2 border-dashed border-sky-400/60 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_16px_#fcd34d]" />
              </div>

              {/* Moving Reticle */}
              <div
                className={`pointer-events-none absolute w-11 h-11 rounded-full border-2 flex items-center justify-center transition-transform duration-75 ${
                  Math.abs(pitchDrift) <= 2 && Math.abs(yawDrift) <= 2
                    ? 'border-emerald-400 bg-emerald-400/20'
                    : 'border-orange-400 bg-orange-400/10'
                }`}
                style={{
                  transform: `translate(${yawDrift * 4}px, ${pitchDrift * 3}px)`,
                }}
              >
                <Crosshair className="w-5 h-5 text-white" />
              </div>

              <div className="pointer-events-none absolute bottom-2 left-3 text-[11px] font-bold text-sky-200">
                {isEn
                  ? 'Tap or drag inside the pad to center the reticle on the amber star'
                  : 'Chạm hoặc kéo trong khung để lái ống kính về ngôi sao vàng'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>{isEn ? 'Pitch Axis (Bring to 0)' : 'Góc Ngẩng (Pitch — Đưa về 0)'}</span>
                  <span className="tabular-nums text-sky-700">{pitchDrift}</span>
                </div>
                <input
                  type="range"
                  min={-25}
                  max={25}
                  value={pitchDrift}
                  disabled={guidanceState.status === 'failed'}
                  onChange={(e) => {
                    setStarLocked(false);
                    setPitchDrift(Number(e.target.value));
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>{isEn ? 'Yaw Axis (Bring to 0)' : 'Góc Xoay Ngang (Yaw — Đưa về 0)'}</span>
                  <span className="tabular-nums text-sky-700">{yawDrift}</span>
                </div>
                <input
                  type="range"
                  min={-25}
                  max={25}
                  value={yawDrift}
                  disabled={guidanceState.status === 'failed'}
                  onChange={(e) => {
                    setStarLocked(false);
                    setYawDrift(Number(e.target.value));
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                disabled={guidanceState.status === 'failed'}
                onClick={handleLockGuideStar}
                className="w-full min-h-12 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer shadow-sm"
              >
                {isEn ? 'Lock Guide Star' : 'Khóa ngôi sao dẫn đường'}
              </button>
            </div>
          </div>

          {guidanceFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {guidanceFeedback}
            </div>
          )}
        </div>
      )}

      {/* TASK C: CIRCUIT WIRING + BREAKERS + SLIDERS */}
      {activeTask === 'C_power' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-sky-950 font-display">
              {isEn
                ? 'Task C: Wire Hubble Power Bus & Balance Circuit Breakers'
                : 'Nhiệm vụ C: Nối mạch & Điều phối cầu dao năng lượng Hubble'}
            </h2>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-extrabold tabular-nums ${
                activePowerTotal > powerBudget
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isEn ? `Total Load: ${activePowerTotal}% / ${powerBudget}%` : `Tổng tải: ${activePowerTotal}% / ${powerBudget}%`}
            </span>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="hst_power"
            actionLabel={isEn ? 'Solar Arrays & Batteries' : 'Pin Mặt Trời & Tổ hợp Pin'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          <CircuitWiringBoard
            title={isEn ? 'Hubble 28V DC Power Bus Patch Panel' : 'Bảng đấu nối thanh cái điện Hubble (28V DC)'}
            instruction={
              isEn
                ? 'Connect each battery rail to FGS, WFC3 Camera, and Mirror Heater, then flip the main power switch.'
                : 'Kéo hoặc chạm nối đúng dây từ Cụm Pin tới FGS, Camera WFC3 và Sưởi ống kính rồi bật nguồn.'
            }
            lang={lang}
            disabled={powerState.status === 'failed'}
            leftNodes={[
              { id: 'bus_guidance', label: isEn ? '28V FGS Supply Rail' : 'Đường nguồn FGS 28V', color: '#0ea5e9' },
              { id: 'bus_optics', label: isEn ? 'WFC3 High-Voltage Line' : 'Đường cao áp WFC3', color: '#10b981' },
              { id: 'bus_thermal', label: isEn ? 'Heater Thermal Line' : 'Cáp sưởi ổn nhiệt', color: '#f59e0b' },
            ]}
            rightNodes={[
              { id: 'port_optics', label: isEn ? 'WFC3 Camera Port' : 'Cổng Camera WFC3', color: '#10b981' },
              { id: 'port_thermal', label: isEn ? 'Mirror Heater Ring' : 'Vòng sưởi gương', color: '#f59e0b' },
              { id: 'port_guidance', label: isEn ? 'FGS Sensor Port' : 'Cổng Cảm biến FGS', color: '#0ea5e9' },
            ]}
            expectedConnections={[
              {
                fromId: 'bus_guidance',
                toId: 'port_guidance',
                errorHint: isEn
                  ? 'The FGS Port requires the regulated 28V FGS Supply Rail!'
                  : 'Cổng FGS cần đúng đường nguồn FGS 28V ổn áp!',
              },
              {
                fromId: 'bus_optics',
                toId: 'port_optics',
                errorHint: isEn
                  ? 'The WFC3 Camera must connect to the WFC3 High-Voltage Line!'
                  : 'Camera WFC3 cần đấu vào đường cao áp WFC3!',
              },
              {
                fromId: 'bus_thermal',
                toId: 'port_thermal',
                errorHint: isEn
                  ? 'The Mirror Heater Ring must connect to the Heater Thermal Line!'
                  : 'Vòng sưởi gương phải nối với Cáp sưởi ổn nhiệt!',
              },
            ]}
            onSuccess={() => setWiringOk(true)}
            onFault={(msg) => {
              setWiringOk(false);
              setPowerFeedback(msg);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                key: 'fgs' as const,
                label: isEn ? 'FGS Guidance (≥ 35%)' : 'Hệ định hướng FGS (≥ 35%)',
                val: allocFgs,
                setVal: setAllocFgs,
                min: 15,
                max: 60,
              },
              {
                key: 'wfc3' as const,
                label: isEn ? 'WFC3 Camera (≥ 35%)' : 'Camera WFC3 (≥ 35%)',
                val: allocWfc3,
                setVal: setAllocWfc3,
                min: 15,
                max: 60,
              },
              {
                key: 'heater' as const,
                label: isEn ? 'Optics Shroud Heater' : 'Sưởi ấm vỏ ống kính',
                val: allocHeater,
                setVal: setAllocHeater,
                min: 5,
                max: 35,
              },
              {
                key: 'gyroBackup' as const,
                label: isEn ? 'Backup Gyroscope #4' : 'Con quay dự phòng #4',
                val: allocGyro,
                setVal: setAllocGyro,
                min: 5,
                max: 30,
              },
            ].map((bus) => {
              const on = breakers[bus.key];
              return (
                <div
                  key={bus.key}
                  className={`p-3 rounded-2xl border-2 space-y-2 ${
                    on ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-sky-950">{bus.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setBreakers((prev) => ({ ...prev, [bus.key]: !prev[bus.key] }));
                        setPowerFeedback(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                        on ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-800'
                      }`}
                    >
                      {on ? (isEn ? 'CLOSED (ON)' : 'ĐANG BẬT') : isEn ? 'OPEN (OFF)' : 'ĐÃ NGẮT'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={bus.min}
                      max={bus.max}
                      disabled={!on}
                      value={bus.val}
                      onChange={(e) => {
                        bus.setVal(Number(e.target.value));
                        setPowerFeedback(null);
                      }}
                      className="flex-1 accent-sky-500 cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-sky-900 tabular-nums w-9 text-right">
                      {on ? `${bus.val}%` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {powerFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {powerFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={powerState.status === 'failed'}
            onClick={handleConfirmPower}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer shadow-sm"
          >
            {isEn ? 'Confirm Hubble Power Grid' : 'Xác nhận lưới điện Hubble'}
          </button>
        </div>
      )}

      {/* TASK D: DRAG & REORDER ASTRONOMICAL TIMELINE */}
      {activeTask === 'D_schedule' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                {isEn
                  ? 'Task D: Drag & Reorder Science Observation Queue'
                  : 'Nhiệm vụ D: Kéo & Sắp xếp lịch quan sát thiên văn'}
              </h2>
              <p className="text-xs font-semibold text-sky-800">
                {isEn
                  ? `Select valid targets (max ${maxObsTargets}) and move Urgent Priority #1 to the top of the queue!`
                  : `Chọn mục tiêu hợp lý (tối đa ${maxObsTargets} mục tiêu) và kéo mục tiêu khẩn cấp #1 lên đầu hàng đợi!`}
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-900 text-xs font-extrabold">
              {isEn ? `Selected: ${enabledTargets.length} / ${maxObsTargets}` : `Đã bật: ${enabledTargets.length} / ${maxObsTargets}`}
            </span>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="hst_computer"
            actionLabel={isEn ? 'Observation Flight Computer' : 'Máy tính lập lịch quan sát'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          <div className="space-y-2.5">
            {targetQueue.map((target, index) => {
              const isEnabled = enabledTargets.includes(target.id);
              return (
                <div
                  key={target.id}
                  draggable={compState.status !== 'failed'}
                  onDragStart={() => setDragIdx(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx !== null) moveTarget(dragIdx, index);
                    setDragIdx(null);
                  }}
                  onDragEnd={() => setDragIdx(null)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-3 transition-all ${
                    isEnabled
                      ? 'bg-emerald-50/70 border-emerald-400'
                      : 'bg-sky-50/40 border-sky-200 opacity-80'
                  } ${dragIdx === index ? 'ring-2 ring-amber-400' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <GripVertical className="w-4 h-4 text-sky-500 shrink-0 cursor-grab" />
                    <span className="w-7 h-7 rounded-xl bg-sky-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-sky-950 leading-snug break-words">
                        {isEn ? target.nameEn : target.name}
                      </div>
                      <div className="text-[11px] font-medium text-sky-800">
                        {isEn ? target.noteEn : target.note} ·{' '}
                        {isEn ? `Uses ${target.energy}% battery` : `Tiêu thụ ${target.energy}% pin`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0 || compState.status === 'failed'}
                      onClick={() => moveTarget(index, index - 1)}
                      aria-label={isEn ? 'Move target up' : 'Đưa mục tiêu lên'}
                      className="w-8 h-8 rounded-lg bg-white border border-sky-200 text-sky-900 disabled:opacity-35 flex items-center justify-center cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === targetQueue.length - 1 || compState.status === 'failed'}
                      onClick={() => moveTarget(index, index + 1)}
                      aria-label={isEn ? 'Move target down' : 'Đưa mục tiêu xuống'}
                      className="w-8 h-8 rounded-lg bg-white border border-sky-200 text-sky-900 disabled:opacity-35 flex items-center justify-center cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={compState.status === 'failed'}
                      onClick={() => toggleTargetEnabled(target.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-sky-900 border border-sky-200'
                      }`}
                    >
                      {isEnabled
                        ? isEn
                          ? 'In Queue ✓'
                          : 'Đã đưa vào lịch ✓'
                        : isEn
                        ? 'Add to Queue'
                        : 'Thêm vào lịch'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {scheduleFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {scheduleFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={compState.status === 'failed'}
            onClick={handleConfirmSchedule}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer shadow-sm"
          >
            {isEn ? 'Execute Observation Plan' : 'Chạy kế hoạch quan sát'}
          </button>
        </div>
      )}
    </div>
  );
};
