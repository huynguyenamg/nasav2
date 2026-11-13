import React, { useEffect, useRef, useState } from 'react';
import {
  EquipmentSubsystemId,
  MissionSessionState,
} from '../../types/game';
import {
  getEffectiveSubsystemState,
  getPartById,
  triggerStressIncident,
} from '../../data/equipmentSystems';
import { SubsystemLockNotice } from './SubsystemLockNotice';
import { CircuitWiringBoard } from '../interactive/CircuitWiringBoard';
import { VirtualJoystick } from '../interactive/VirtualJoystick';
import { sound } from '../../services/sound';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  CheckCircle2,
  Compass,
  Flag,
  MapPin,
  Radio,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface PerseveranceSimulatorProps {
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onCompleteSubTask: (taskId: string, extras?: { photos?: number; samples?: number }) => void;
}

type RoverTaskKey = 'A_mobility' | 'B_terrain' | 'C_sample' | 'D_comms';

interface SurveyZone {
  id: 'sand' | 'rock' | 'safe';
  label: string;
  xPct: number;
  yPct: number;
  clue: string;
  isHazard: boolean;
}

const SURVEY_ZONES: SurveyZone[] = [
  {
    id: 'sand',
    label: 'Vùng cát mịn',
    xPct: 32,
    yPct: 68,
    clue: 'Cảnh báo: Lớp cát mịn dày dễ làm sa lầy bánh xe.',
    isHazard: true,
  },
  {
    id: 'rock',
    label: 'Bãi đá sắc 48cm',
    xPct: 58,
    yPct: 32,
    clue: 'Cảnh báo: Đá nhọn vượt quá khoảng sáng gầm 40cm của xe.',
    isHazard: true,
  },
  {
    id: 'safe',
    label: 'Sườn đất nén phẳng',
    xPct: 78,
    yPct: 65,
    clue: 'An toàn: Nền đá trầm tích phẳng, độ dốc chỉ 4°.',
    isHazard: false,
  },
];

export const PerseveranceSimulator: React.FC<PerseveranceSimulatorProps> = ({
  session,
  onUpdateSession,
  onOpenRepair,
  onCompleteSubTask,
}) => {
  const [activeTask, setActiveTask] = useState<RoverTaskKey>('A_mobility');

  // Task A: Rover physics & terrain
  const [roverX, setRoverX] = useState(72);
  const [roverY, setRoverY] = useState(195);
  const [roverAngle, setRoverAngle] = useState(0);
  const [batteryPct, setBatteryPct] = useState(100);
  const [stabilityPct, setStabilityPct] = useState(98);
  const [terrainTypeLabel, setTerrainTypeLabel] = useState('Nền đất cứng Jezero');
  const [driveFeedback, setDriveFeedback] = useState(
    'Kéo cần joystick ảo hoặc bấm mũi tên/WASD để lái Perseverance tới Cờ mục tiêu.'
  );
  const lastJoyMoveRef = useRef(0);

  // Task B: Draggable Navcam viewfinder + Hazard tagging
  const mapRef = useRef<HTMLDivElement>(null);
  const [framePos, setFramePos] = useState({ xPct: 24, yPct: 35 });
  const [draggingFrame, setDraggingFrame] = useState(false);
  const [scannedZones, setScannedZones] = useState<string[]>([]);
  const [taggedHazards, setTaggedHazards] = useState<string[]>([]);
  const [terrainFeedback, setTerrainFeedback] = useState<string | null>(null);

  // Task C: Arm + Drill + Seal
  const [armReach, setArmReach] = useState(38);
  const [drillDepth, setDrillDepth] = useState(28);
  const [drillRpm, setDrillRpm] = useState(65);
  const [coreDrilled, setCoreDrilled] = useState(false);
  const [sampleFeedback, setSampleFeedback] = useState<string | null>(null);

  // Task D: UHF Circuit Wiring + Moving MRO Satellite Tracking
  const [uhfWired, setUhfWired] = useState(false);
  const [mroAngle, setMroAngle] = useState(40);
  const [dishAngle, setDishAngle] = useState(75);
  const [commsFeedback, setCommsFeedback] = useState<string | null>(null);

  const mobState = getEffectiveSubsystemState(session, 'rover_mobility');
  const camState = getEffectiveSubsystemState(session, 'rover_camera');
  const armState = getEffectiveSubsystemState(session, 'rover_arm');
  const commsState = getEffectiveSubsystemState(session, 'rover_comms');

  const mobPart = getPartById(session.subsystems.rover_mobility?.partId || '');
  const armPart = getPartById(session.subsystems.rover_arm?.partId || '');
  const isDone = (k: RoverTaskKey) => session.completedSubTasks.includes(k);

  // Animate MRO orbiter arc in Task D
  useEffect(() => {
    if (activeTask !== 'D_comms') return;
    const timer = setInterval(() => {
      setMroAngle((prev) => {
        const next = prev + 2.5;
        return next > 125 ? 20 : next;
      });
    }, 350);
    return () => clearInterval(timer);
  }, [activeTask]);

  const moveRover = (dx: number, dy: number, facingDeg: number) => {
    if (mobState.status === 'failed') {
      sound.playAlert();
      setDriveFeedback('Bánh xe hoặc nguồn điện đang hỏng! Hãy sửa trước khi di chuyển.');
      return;
    }

    if (batteryPct <= 8) {
      sound.playAlert();
      setDriveFeedback('Pin yếu! Hãy tạm dừng vài giây để hệ thống sạc bù.');
      return;
    }

    sound.playRoverMove();
    const inSand = roverX >= 145 && roverX <= 265 && roverY >= 120 && roverY <= 220;
    const inSlope = roverX >= 280 && roverX <= 385 && roverY >= 45 && roverY <= 145;

    const baseMult =
      mobState.status === 'degraded' ? 0.55 : mobPart?.tier === 'premium' ? 1.15 : 1.0;
    const terrainMult = inSand ? 0.55 : inSlope ? 0.78 : 1.0;

    const nextX = Math.max(36, Math.min(460, roverX + Math.round(dx * baseMult * terrainMult)));
    const nextY = Math.max(38, Math.min(225, roverY + Math.round(dy * baseMult * terrainMult)));

    setRoverX(nextX);
    setRoverY(nextY);
    setRoverAngle(facingDeg);
    setBatteryPct((b) => Math.max(5, +(b - (inSand ? 2.4 : inSlope ? 1.8 : 1.0)).toFixed(1)));
    setStabilityPct(inSlope ? 74 : inSand ? 82 : 98);
    setTerrainTypeLabel(
      inSand
        ? 'Hố cát mịn (Tốc độ -45% · Hao pin)'
        : inSlope
        ? 'Dốc đá 22° (Giảm ổn định)'
        : 'Nền đất cứng Jezero'
    );

    if (inSand && mobPart?.tier === 'economy' && session.difficulty >= 2 && !isDone('A_mobility')) {
      const stressed = triggerStressIncident(
        session,
        'rover_mobility',
        'Sa lầy trên cát do bánh Tiết kiệm',
        'Bánh nhôm mỏng mất độ bám khi đi xuyên vùng cát mịn, cần vào Sửa chữa kiểm tra hoặc thay bánh.'
      );
      onUpdateSession(stressed);
      sound.playAlert();
      setDriveFeedback('Cảnh báo: Xe bị sa lầy trong hố cát! Hãy né hố cát hoặc nâng cấp bánh xe.');
      return;
    }

    const reachedGoal = Math.hypot(nextX - 420, nextY - 82) <= 42;
    if (reachedGoal && mobState.status === 'ok' && !isDone('A_mobility')) {
      sound.playSuccess();
      setDriveFeedback('Tuyệt vời! Robot đã vượt địa hình và tới đúng Cờ mục tiêu Jezero!');
      onCompleteSubTask('A_mobility');
    } else if (reachedGoal && mobState.status === 'degraded') {
      setDriveFeedback('Đã tới Cờ mục tiêu, nhưng bánh xe đang suy giảm — nên vào Sửa chữa để đạt điểm cao!');
    }
  };

  useEffect(() => {
    if (activeTask !== 'A_mobility') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        moveRover(0, -22, -90);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        moveRover(0, 22, 90);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        moveRover(-22, 0, 180);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        moveRover(22, 0, 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // Viewfinder pointer drag
  const updateFrameFromPointer = (clientX: number, clientY: number) => {
    const map = mapRef.current;
    if (!map || camState.status === 'failed') return;
    const rect = map.getBoundingClientRect();
    const xPct = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(14, Math.min(86, ((clientY - rect.top) / rect.height) * 100));
    setFramePos({ xPct: Math.round(xPct), yPct: Math.round(yPct) });
  };

  const zoneInsideFrame = SURVEY_ZONES.find(
    (z) => Math.hypot(z.xPct - framePos.xPct, z.yPct - framePos.yPct) <= 18
  );

  const handleScanFrame = () => {
    if (camState.status === 'failed') return;
    sound.playCamera();
    if (!zoneInsideFrame) {
      setTerrainFeedback('Khung ngắm chưa phủ lên điểm khảo sát nào! Hãy kéo khung vào các vòng tròn trên bản đồ.');
      return;
    }
    if (!scannedZones.includes(zoneInsideFrame.id)) {
      setScannedZones((prev) => [...prev, zoneInsideFrame.id]);
    }
    setTerrainFeedback(`${zoneInsideFrame.label}: ${zoneInsideFrame.clue}`);
  };

  const handleToggleHazardTag = (zoneId: string) => {
    if (camState.status === 'failed') return;
    sound.playClick();
    setTaggedHazards((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  };

  const handleVerifySurveyMap = () => {
    if (camState.status === 'failed') return;
    if (scannedZones.length < 3) {
      sound.playAlert();
      setTerrainFeedback(`Hãy kéo khung quét và chụp ảnh đủ cả 3 vùng trên bản đồ (${scannedZones.length}/3)!`);
      return;
    }
    const correctTags =
      taggedHazards.includes('sand') &&
      taggedHazards.includes('rock') &&
      !taggedHazards.includes('safe');

    onUpdateSession({
      ...session,
      diagnosisAttempts: session.diagnosisAttempts + 1,
      diagnosisCorrect: session.diagnosisCorrect + (correctTags ? 1 : 0),
    });

    if (correctTags) {
      sound.playSuccess();
      setTerrainFeedback('Đã đánh dấu chính xác 2 chướng ngại vật (Cát mịn & Đá nhọn) và mở tuyến đường an toàn!');
      onCompleteSubTask('B_terrain', { photos: 3 });
    } else {
      sound.playAlert();
      setTerrainFeedback('Đánh dấu chưa chuẩn! Chỉ gắn cờ cảnh báo cho Cát mịn và Bãi đá sắc 48cm, giữ trống Sườn đất phẳng.');
    }
  };

  const handleDrillCore = () => {
    if (armState.status === 'failed') return;
    const reachOk = armReach >= 68 && armReach <= 86;
    const depthOk = drillDepth >= 58 && drillDepth <= 78;
    const rpmOk = drillRpm >= 45 && drillRpm <= 80;

    if (!reachOk || !depthOk) {
      sound.playAlert();
      setSampleFeedback('Mũi khoan chưa chạm đúng lõi đá mục tiêu! Chỉnh Vươn tay (68–86%) và Độ sâu (58–78%).');
      return;
    }

    if (!rpmOk) {
      sound.playAlert();
      setSampleFeedback(
        drillRpm > 80
          ? 'Tốc độ quay quá cao gây nóng và rung mũi khoan! Giảm RPM về vùng 45–80%.'
          : 'Lực khoan quá yếu chưa xuyên được vỏ đá! Tăng RPM lên 45–80%.'
      );
      return;
    }

    if (armPart?.tier === 'economy' && session.difficulty >= 3 && armState.status === 'ok') {
      const stressed = triggerStressIncident(
        session,
        'rover_arm',
        'Rung đầu khoan khi gặp đá Bazan cứng',
        'Cánh tay Tiết kiệm bị rung lắc khi khoan đá cứng, cần vào Sửa chữa để hiệu chỉnh.'
      );
      onUpdateSession(stressed);
      sound.playAlert();
      setSampleFeedback('Đầu khoan Tiết kiệm bị kẹt nhẹ trước đá cứng! Hãy vào Sửa chữa để xử lý.');
      return;
    }

    sound.playRepairTool();
    setCoreDrilled(true);
    setSampleFeedback('Đã khoan thành công lõi đá đất sét cổ! Bấm "Niêm phong ống mẫu" để cất giữ.');
  };

  const handleSealTube = () => {
    if (!coreDrilled || armState.status === 'failed') return;
    sound.playSuccess();
    setSampleFeedback('Ống mẫu #07 đã được niêm phong kín vào khoang lưu trữ của Perseverance!');
    onCompleteSubTask('C_sample', { samples: 1 });
  };

  const mroSignalAligned = Math.abs(dishAngle - mroAngle) <= 14;

  const handleTransmitUhf = () => {
    if (commsState.status === 'failed') return;
    if (!uhfWired) {
      sound.playAlert();
      setCommsFeedback('Chưa nối xong mạch điện ăng-ten UHF ở bước 1!');
      return;
    }
    if (!mroSignalAligned) {
      sound.playAlert();
      setCommsFeedback(
        `Chảo ăng-ten (${dishAngle}°) chưa bắt kịp vệ tinh MRO (đang ở ${Math.round(mroAngle)}°)! Hãy kéo thanh góc bám theo MRO.`
      );
      return;
    }

    sound.playSuccess();
    setCommsFeedback('Tín hiệu khóa MRO đạt 96%! Toàn bộ dữ liệu ảnh và mẫu đá đã truyền về Trái Đất.');
    onCompleteSubTask('D_comms');
  };

  const tasks: { key: RoverTaskKey; label: string; icon: React.ReactNode }[] = [
    { key: 'A_mobility', label: 'A. Lái xe thực địa', icon: <Compass className="w-4 h-4" /> },
    { key: 'B_terrain', label: 'B. Quét & Ghim bản đồ', icon: <Camera className="w-4 h-4" /> },
    { key: 'C_sample', label: 'C. Khoan & Lưu mẫu', icon: <Wrench className="w-4 h-4" /> },
    { key: 'D_comms', label: 'D. Nối mạch & Bắt sóng', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Sub-Mission Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {tasks.map((t) => {
          const active = activeTask === t.key;
          const done = isDone(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTask(t.key);
              }}
              className={`min-h-12 px-3.5 py-2.5 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer transition-all ${
                active
                  ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                  : done
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-sky-950 border-sky-200 hover:border-sky-400'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {t.icon}
                <span className="truncate">{t.label}</span>
              </span>
              {done && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* TASK A: INTERACTIVE JOYSTICK + TERRAIN PHYSICS */}
      {activeTask === 'A_mobility' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                Nhiệm vụ A: Điều khiển trực tiếp Perseverance vượt địa hình Jezero
              </h2>
              <p className="text-xs sm:text-sm text-sky-800/85 font-medium">{driveFeedback}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-extrabold text-sky-900 tabular-nums">
              <span>Pin: {batteryPct}%</span>
              <span>·</span>
              <span>Ổn định: {stabilityPct}%</span>
              <span>·</span>
              <span className="text-sky-700">{terrainTypeLabel}</span>
            </div>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="rover_mobility"
            actionLabel="Điều khiển bánh xe"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border-2 border-sky-200 bg-amber-50 h-[265px] select-none">
              <img
                src="/src/assets/images/sunny_mars_playground_1794563133433.jpg"
                alt="Bề mặt Sao Hỏa"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />

              {/* Sand Trap Zone */}
              <div
                style={{ left: '145px', top: '120px', width: '120px', height: '100px' }}
                className="absolute rounded-2xl bg-amber-300/65 border-2 border-dashed border-amber-700 flex items-center justify-center text-[11px] font-extrabold text-amber-950 text-center p-1"
              >
                Hố cát lún (Chậm · Hao pin)
              </div>

              {/* Steep Rock Slope */}
              <div
                style={{ left: '280px', top: '45px', width: '105px', height: '100px' }}
                className="absolute rounded-2xl bg-orange-300/60 border-2 border-dashed border-orange-700 flex items-center justify-center text-[11px] font-extrabold text-orange-950 text-center p-1"
              >
                Dốc đá 22°
              </div>

              {/* Goal Checkpoint */}
              <div
                style={{ left: '420px', top: '82px', transform: 'translate(-50%, -50%)' }}
                className="absolute px-3 py-1.5 rounded-xl bg-emerald-500 text-white border-2 border-white text-xs font-extrabold shadow-md flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Mục tiêu</span>
              </div>

              {/* Rover Avatar */}
              <div
                className="absolute transition-all duration-100 pointer-events-none"
                style={{
                  left: `${roverX}px`,
                  top: `${roverY}px`,
                  transform: `translate(-50%, -50%) rotate(${roverAngle}deg)`,
                }}
              >
                <div className="w-13 h-13 rounded-2xl bg-sky-500 border-4 border-white text-white flex items-center justify-center shadow-lg font-extrabold text-[11px]">
                  ROVER
                </div>
              </div>
            </div>

            {/* Virtual Joystick + D-Pad Controls */}
            <div className="lg:col-span-4 rounded-2xl bg-sky-50/70 border-2 border-sky-200 p-4 flex flex-col items-center gap-3">
              <VirtualJoystick
                disabled={mobState.status === 'failed'}
                onVectorMove={(dxN, dyN, deg) => {
                  const now = Date.now();
                  if (now - lastJoyMoveRef.current < 140) return;
                  lastJoyMoveRef.current = now;
                  moveRover(Math.round(dxN * 24), Math.round(dyN * 24), deg);
                }}
              />

              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  disabled={mobState.status === 'failed'}
                  onClick={() => moveRover(0, -22, -90)}
                  aria-label="Tiến lên"
                  className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white flex items-center justify-center cursor-pointer"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={mobState.status === 'failed'}
                    onClick={() => moveRover(-22, 0, 180)}
                    aria-label="Sang trái"
                    className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    disabled={mobState.status === 'failed'}
                    onClick={() => moveRover(0, 22, 90)}
                    aria-label="Lùi xuống"
                    className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    disabled={mobState.status === 'failed'}
                    onClick={() => moveRover(22, 0, 0)}
                    aria-label="Sang phải"
                    className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TASK B: DRAGGABLE NAVCAM SCANNER & MAP HAZARD PINNING */}
      {activeTask === 'B_terrain' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-sky-950 font-display">
                Nhiệm vụ B: Kéo khung quan sát Navcam & Đánh dấu chướng ngại vật
              </h2>
              <p className="text-xs text-sky-800/85 font-medium">
                Kéo khung ngắm xanh đến từng vòng tròn để chụp ảnh phân tích, sau đó chạm nút đánh dấu các khu vực nguy hiểm.
              </p>
            </div>
            <span className="text-xs font-extrabold text-sky-700 tabular-nums">
              Đã quét: {scannedZones.length}/3 vùng
            </span>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="rover_camera"
            actionLabel="Camera quan sát địa hình"
            onOpenRepair={onOpenRepair}
          />

          {/* Interactive Draggable Viewfinder Map */}
          <div
            ref={mapRef}
            onPointerMove={(e) => {
              if (draggingFrame) updateFrameFromPointer(e.clientX, e.clientY);
            }}
            onPointerUp={() => setDraggingFrame(false)}
            onPointerCancel={() => setDraggingFrame(false)}
            className="relative h-64 rounded-2xl overflow-hidden border-2 border-sky-200 bg-amber-100 select-none touch-none"
          >
            <img
              src="/src/assets/images/mars_jezero_delta_1794503039436.jpg"
              alt="Bản đồ địa hình Jezero"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                camState.status !== 'ok' ? 'blur-[3px] opacity-75' : ''
              }`}
            />

            {SURVEY_ZONES.map((z) => {
              const scanned = scannedZones.includes(z.id);
              const flagged = taggedHazards.includes(z.id);

              return (
                <div
                  key={z.id}
                  style={{ left: `${z.xPct}%`, top: `${z.yPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                >
                  <button
                    type="button"
                    disabled={camState.status === 'failed' || !scanned}
                    onClick={() => handleToggleHazardTag(z.id)}
                    className={`px-2.5 py-1.5 rounded-xl border-2 text-xs font-extrabold flex items-center gap-1 shadow-md cursor-pointer ${
                      flagged
                        ? 'bg-rose-500 text-white border-white'
                        : scanned
                        ? 'bg-white text-sky-950 border-sky-400'
                        : 'bg-white/85 text-sky-800 border-amber-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{z.label}</span>
                  </button>
                  {scanned && (
                    <span className="px-2 py-0.5 rounded-lg bg-sky-950/85 text-white text-[10px] font-bold whitespace-nowrap">
                      {flagged ? 'Đã gắn cờ Nguy hiểm' : 'Chạm để gắn cờ nguy hiểm'}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Draggable Camera Frame */}
            <div
              onPointerDown={(e) => {
                if (camState.status === 'failed') return;
                e.currentTarget.setPointerCapture(e.pointerId);
                setDraggingFrame(true);
              }}
              style={{ left: `${framePos.xPct}%`, top: `${framePos.yPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-24 rounded-2xl border-4 border-sky-400 bg-sky-400/15 shadow-lg cursor-grab active:cursor-grabbing flex items-end justify-center p-1"
            >
              <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-extrabold whitespace-nowrap">
                Khung quét Navcam
              </span>
            </div>
          </div>

          {terrainFeedback && (
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm font-bold text-sky-950">
              {terrainFeedback}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={camState.status === 'failed'}
              onClick={handleScanFrame}
              className="min-h-11 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Chụp & Quét tại khung</span>
            </button>

            <button
              type="button"
              disabled={camState.status === 'failed'}
              onClick={handleVerifySurveyMap}
              className="min-h-11 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
            >
              Xác nhận bản đồ chướng ngại vật
            </button>
          </div>
        </div>
      )}

      {/* TASK C: ARM ALIGNMENT + DRILL RPM + TUBE SEAL */}
      {activeTask === 'C_sample' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ C: Căn chỉnh cánh tay, kiểm soát lực khoan & niêm phong mẫu
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="rover_arm"
            actionLabel="Cánh tay khoan mẫu đá"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-52 rounded-2xl bg-sky-50 border-2 border-sky-200 p-3 flex items-center justify-center">
              <svg viewBox="0 0 320 180" className="w-full h-full">
                <line x1="15" y1="155" x2="305" y2="155" stroke="#d97706" strokeWidth="3" />
                <polygon
                  points="220,155 240,122 268,130 278,155"
                  fill={coreDrilled ? '#34d399' : '#fbbf24'}
                  stroke="#92400e"
                  strokeWidth="2.5"
                />
                <circle cx="244" cy="134" r="6" fill="#ef4444" opacity="0.75" />
                <rect x="28" y="96" width="84" height="44" rx="10" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2.5" />
                {(() => {
                  const tipX = 112 + (armReach / 100) * 165;
                  const tipY = 85 + (drillDepth / 100) * 65;
                  const elbowX = (112 + tipX) / 2;
                  const elbowY = 58;
                  return (
                    <g>
                      <line x1="112" y1="110" x2={elbowX} y2={elbowY} stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />
                      <line x1={elbowX} y1={elbowY} x2={tipX} y2={tipY} stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
                      <circle cx={elbowX} cy={elbowY} r="7" fill="#fde047" stroke="#0c4a6e" strokeWidth="2" />
                      <circle cx={tipX} cy={tipY} r="6" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Độ vươn cánh tay (Vùng mẫu: 68–86%)</span>
                  <span className="tabular-nums text-sky-600">{armReach}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={armReach}
                  disabled={armState.status === 'failed'}
                  onChange={(e) => setArmReach(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Độ hạ mũi khoan (Vùng mẫu: 58–78%)</span>
                  <span className="tabular-nums text-sky-600">{drillDepth}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={95}
                  value={drillDepth}
                  disabled={armState.status === 'failed'}
                  onChange={(e) => setDrillDepth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Tốc độ & Lực mũi khoan (An toàn: 45–80%)</span>
                  <span className="tabular-nums text-orange-600">{drillRpm}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={drillRpm}
                  disabled={armState.status === 'failed'}
                  onChange={(e) => setDrillRpm(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={armState.status === 'failed'}
                  onClick={handleDrillCore}
                  className="flex-1 min-h-11 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>1. Khoan lõi đá</span>
                </button>

                <button
                  type="button"
                  disabled={armState.status === 'failed' || !coreDrilled}
                  onClick={handleSealTube}
                  className="flex-1 min-h-11 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>2. Niêm phong ống mẫu</span>
                </button>
              </div>
            </div>
          </div>

          {sampleFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {sampleFeedback}
            </div>
          )}
        </div>
      )}

      {/* TASK D: CIRCUIT WIRING + MOVING MRO DISH TRACKING */}
      {activeTask === 'D_comms' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ D: Nối mạch phát sóng UHF & Quay chảo bắt vệ tinh MRO
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="rover_comms"
            actionLabel="Ăng-ten truyền dữ liệu"
            onOpenRepair={onOpenRepair}
          />

          <CircuitWiringBoard
            title="Bước 1: Nối mạch truyền tin UHF"
            instruction="Kéo hoặc chạm nối Nguồn điện -> Khuếch đại UHF -> Chảo ăng-ten đúng cực."
            disabled={commsState.status === 'failed'}
            leftNodes={[
              { id: 'pwr', label: 'Nguồn 28V MMRTG', color: '#f59e0b', sublabel: 'Cấp điện RF' },
              { id: 'data', label: 'Dữ liệu Mastcam', color: '#0284c7', sublabel: 'Gói ảnh & mẫu' },
              { id: 'gnd', label: 'Dây tiếp địa', color: '#64748b', sublabel: 'Chống nhiễu' },
            ]}
            rightNodes={[
              { id: 'in_data', label: 'Bộ điều chế UHF', color: '#0284c7', sublabel: 'Nhận gói ảnh' },
              { id: 'in_gnd', label: 'Vỏ khung tiếp địa', color: '#64748b', sublabel: 'Khử tĩnh điện' },
              { id: 'in_pwr', label: 'Chân nguồn UHF', color: '#f59e0b', sublabel: '28V DC' },
            ]}
            expectedConnections={[
              { fromId: 'pwr', toId: 'in_pwr', errorHint: 'Nguồn 28V phải nối vào Chân nguồn UHF (tránh cháy bộ điều chế)!' },
              { fromId: 'data', toId: 'in_data', errorHint: 'Dữ liệu Mastcam phải nối vào Bộ điều chế UHF!' },
              { fromId: 'gnd', toId: 'in_gnd' },
            ]}
            onSuccess={() => setUhfWired(true)}
          />

          {/* Step 2: Live Satellite Tracking Radar */}
          <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-sky-950">
                Bước 2: Quay góc chảo ăng-ten bám theo vệ tinh MRO đang bay qua (Sai số ≤ 14°)
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${
                  mroSignalAligned ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                Vệ tinh MRO: {Math.round(mroAngle)}° · Chảo xe: {dishAngle}°
              </span>
            </div>

            <div className="h-24 rounded-xl bg-white border border-sky-200 relative overflow-hidden">
              {/* MRO Satellite Indicator */}
              <div
                className="absolute top-3 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-amber-400 text-sky-950 text-[11px] font-extrabold shadow transition-all"
                style={{ left: `${((mroAngle - 15) / 115) * 100}%` }}
              >
                Vệ tinh MRO
              </div>
              {/* Dish Aim Beam */}
              <div
                className={`absolute bottom-2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  mroSignalAligned ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                }`}
                style={{ left: `${((dishAngle - 15) / 115) * 100}%` }}
              >
                Hướng chảo UHF ({dishAngle}°)
              </div>
            </div>

            <input
              type="range"
              min={20}
              max={125}
              value={dishAngle}
              disabled={commsState.status === 'failed'}
              onChange={(e) => setDishAngle(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {commsFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {commsFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={commsState.status === 'failed'}
            onClick={handleTransmitUhf}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Phát sóng truyền dữ liệu qua MRO
          </button>
        </div>
      )}
    </div>
  );
};
