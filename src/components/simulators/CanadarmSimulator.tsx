import React, { useState } from 'react';
import {
  EquipmentSubsystemId,
  MissionSessionState,
} from '../../types/game';
import { getEffectiveSubsystemState } from '../../data/equipmentSystems';
import { SubsystemLockNotice } from './SubsystemLockNotice';
import { ProcedureSorter } from '../interactive/ProcedureSorter';
import { sound } from '../../services/sound';
import {
  Camera,
  CheckCircle2,
  Compass,
  Hand,
  Lock,
  UserCheck,
} from 'lucide-react';

interface CanadarmSimulatorProps {
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onCompleteSubTask: (taskId: string, extras?: { photos?: number; samples?: number }) => void;
}

type ArmTaskKey = 'A_calibrate' | 'B_cargo' | 'C_astronaut' | 'D_camera';

export const CanadarmSimulator: React.FC<CanadarmSimulatorProps> = ({
  session,
  onOpenRepair,
  onCompleteSubTask,
}) => {
  const [activeTask, setActiveTask] = useState<ArmTaskKey>('A_calibrate');

  // Task A: Procedure Sequence + 3-Joint Calibration
  const [calSequenceOk, setCalSequenceOk] = useState(false);
  const [shoulderBias, setShoulderBias] = useState(-2.5);
  const [elbowBias, setElbowBias] = useState(4.0);
  const [wristBias, setWristBias] = useState(-1.5);
  const [calFeedback, setCalFeedback] = useState<string | null>(null);

  // Task B: Multi-joint 2D forward kinematics with obstacle avoidance
  const [shoulderDeg, setShoulderDeg] = useState(-45);
  const [elbowDeg, setElbowDeg] = useState(55);
  const [wristOpen, setWristOpen] = useState(true);
  const [cargoGrabbed, setCargoGrabbed] = useState(false);
  const [cargoFeedback, setCargoFeedback] = useState<string | null>(null);

  // Task C: Physical EVA Support Console (Tether switch + Speed lever + Reach slider)
  const [tetherLocked, setTetherLocked] = useState(false);
  const [evaSpeedMs, setEvaSpeedMs] = useState(0.22);
  const [astroReach, setAstroReach] = useState(32);
  const [astroFeedback, setAstroFeedback] = useState<string | null>(null);

  // Task D: Interactive Pan / Tilt / Focus Camera Viewfinder
  const [camPanX, setCamPanX] = useState(-26);
  const [camTiltY, setCamTiltY] = useState(20);
  const [camFocus, setCamFocus] = useState(35);
  const [camFeedback, setCamFeedback] = useState<string | null>(null);

  const shoulderState = getEffectiveSubsystemState(session, 'arm_shoulder');
  const elbowState = getEffectiveSubsystemState(session, 'arm_elbow');
  const wristState = getEffectiveSubsystemState(session, 'arm_wrist');
  const camState = getEffectiveSubsystemState(session, 'arm_camera');

  const isDone = (k: ArmTaskKey) => session.completedSubTasks.includes(k);

  // Compute real 2D arm tip coordinates
  const baseX = 75;
  const baseY = 175;
  const l1 = 92;
  const l2 = 82;
  const rad1 = (shoulderDeg * Math.PI) / 180;
  const rad2 = ((shoulderDeg + elbowDeg) * Math.PI) / 180;
  const elbowX = baseX + l1 * Math.cos(rad1);
  const elbowY = baseY + l1 * Math.sin(rad1);
  const tipX = elbowX + l2 * Math.cos(rad2);
  const tipY = elbowY + l2 * Math.sin(rad2);

  // Obstacle box (Solar Truss Module) at x: 118..162, y: 18..72
  const nearObstacle = tipX >= 112 && tipX <= 168 && tipY >= 14 && tipY <= 76;

  // Cargo pickup pin at (225, 95); Harmony docking port at (195, 170)
  const cargoPin = { x: 225, y: 95 };
  const dockPort = { x: 195, y: 170 };
  const distToCargo = Math.hypot(tipX - cargoPin.x, tipY - cargoPin.y);
  const distToDock = Math.hypot(tipX - dockPort.x, tipY - dockPort.y);

  const handleCalibrate = () => {
    if (elbowState.status === 'failed' || shoulderState.status === 'failed') return;
    if (!calSequenceOk) {
      sound.playAlert();
      setCalFeedback('Hãy sắp xếp và thực thi đúng Quy trình hiệu chuẩn ở bước 1 trước!');
      return;
    }
    const ok =
      Math.abs(shoulderBias) <= 0.5 &&
      Math.abs(elbowBias) <= 0.5 &&
      Math.abs(wristBias) <= 0.5;
    if (ok) {
      sound.playSuccess();
      setCalFeedback('Cả 3 khớp Vai, Khuỷu và Cổ tay đã về chuẩn 0° (sai số ≤ 0.5°)!');
      onCompleteSubTask('A_calibrate');
    } else {
      sound.playAlert();
      setCalFeedback('Vẫn còn khớp lệch > 0.5°! Hãy đưa cả 3 thanh trượt về vùng -0.5° đến +0.5°.');
    }
  };

  const handleToggleGripper = () => {
    if (wristState.status === 'failed' || elbowState.status === 'failed') return;
    if (nearObstacle) {
      sound.playAlert();
      setCargoFeedback('Cảnh báo va chạm giàn pin Mặt Trời! Hãy gập khuỷu tránh vùng đỏ trước khi thao tác kẹp.');
      return;
    }
    if (!cargoGrabbed) {
      if (distToCargo <= 28) {
        sound.playEquip();
        setCargoGrabbed(true);
        setWristOpen(false);
        setCargoFeedback('Đã kẹp chặt chốt tàu hàng! Đưa đầu kẹp về Cổng nối ghép Harmony.');
      } else {
        sound.playAlert();
        setCargoFeedback(`Đầu kẹp cách chốt tàu hàng ${Math.round(distToCargo)} đơn vị. Hãy chỉnh Vai & Khuỷu lại gần chốt cam!`);
      }
    } else {
      if (distToDock <= 30) {
        sound.playSuccess();
        setWristOpen(true);
        setCargoGrabbed(false);
        setCargoFeedback('Tàu hàng đã được đưa vào Cổng Harmony an toàn không va chạm!');
        onCompleteSubTask('B_cargo');
      } else {
        sound.playAlert();
        setCargoFeedback('Chưa tới vị trí Cổng Harmony (vòng xanh lá)! Không nhả hàng giữa không gian.');
      }
    }
  };

  const handleSupportAstronaut = () => {
    if (wristState.status === 'failed' || elbowState.status === 'failed') return;
    if (!tetherLocked) {
      sound.playAlert();
      setAstroFeedback('Nguy hiểm! Hãy bật "Khóa dây an toàn EVA" trước khi di chuyển phi hành gia.');
      return;
    }
    if (evaSpeedMs > 0.08) {
      sound.playAlert();
      setAstroFeedback(
        `Tốc độ ${evaSpeedMs.toFixed(2)} m/s quá nhanh gây rung lắc nguy hiểm! Hãy kéo cần tốc độ xuống ≤ 0.08 m/s.`
      );
      return;
    }
    if (astroReach < 65 || astroReach > 85) {
      sound.playAlert();
      setAstroFeedback('Phi hành gia chưa tới đúng vùng sửa chữa tấm pin (65%–85%).');
      return;
    }
    sound.playSuccess();
    setAstroFeedback('Đã đưa phi hành gia tới vị trí sửa chữa ở tốc độ siêu êm an toàn tuyệt đối!');
    onCompleteSubTask('C_astronaut');
  };

  const camCentered = Math.abs(camPanX) <= 5 && Math.abs(camTiltY) <= 5;
  const camFocused = camFocus >= 75 && camFocus <= 92;

  const handleVerifyCamera = () => {
    if (camState.status === 'failed') return;
    if (!camCentered) {
      sound.playAlert();
      setCamFeedback('Tâm ngắm chữ thập vẫn lệch khỏi chốt neo LEE! Chỉnh Xoay ngang (Pan) & Ngẩng (Tilt) về gần 0.');
      return;
    }
    if (!camFocused) {
      sound.playAlert();
      setCamFeedback('Hình ảnh camera đang bị mờ! Kéo Vòng lấy nét vào vùng nét chuẩn (75–92%).');
      return;
    }
    sound.playSuccess();
    setCamFeedback('Đã căn giữa tâm ngắm LEE và lấy nét rõ từng vạch chia khoảng cách 0.42m!');
    onCompleteSubTask('D_camera', { photos: 1 });
  };

  const tasks: { key: ArmTaskKey; label: string; icon: React.ReactNode }[] = [
    { key: 'A_calibrate', label: 'A. Quy trình & Hiệu chỉnh', icon: <Compass className="w-4 h-4" /> },
    { key: 'B_cargo', label: 'B. Gắp tàu tránh va chạm', icon: <Hand className="w-4 h-4" /> },
    { key: 'C_astronaut', label: 'C. Cần gạt đưa phi hành gia', icon: <UserCheck className="w-4 h-4" /> },
    { key: 'D_camera', label: 'D. Xoay & Lấy nét Camera', icon: <Camera className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
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

      {/* TASK A: PROCEDURE SORTER + 3-JOINT ENCODER ALIGNMENT */}
      {activeTask === 'A_calibrate' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ A: Sắp xếp quy trình & Hiệu chỉnh 3 khớp Canadarm2
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_elbow"
            actionLabel="Khớp khuỷu Canadarm2"
            onOpenRepair={onOpenRepair}
          />
          <SubsystemLockNotice
            session={session}
            subsystemId="arm_shoulder"
            actionLabel="Khớp vai Canadarm2"
            onOpenRepair={onOpenRepair}
          />

          <ProcedureSorter
            title="Bước 1: Kéo thả sắp xếp đúng thứ tự quy trình hiệu chuẩn khớp"
            instruction="Thứ tự an toàn: Khóa phanh giữ tải -> Đọc sai số cảm biến -> Căn chỉnh về 0° -> Chạy thử không tải."
            disabled={elbowState.status === 'failed' || shoulderState.status === 'failed'}
            steps={[
              { id: 'test', label: 'Chạy thử chuyển động nhẹ không tải', criticalNote: 'Không được chạy thử khi chưa khóa phanh và hiệu chỉnh 0°!' },
              { id: 'brake', label: 'Khóa phanh tĩnh cố định tải trọng' },
              { id: 'zero', label: 'Căn chỉnh bù sai lệch khớp về 0°' },
              { id: 'read', label: 'Đọc dữ liệu cảm biến góc hiện tại' },
            ]}
            expectedOrder={['brake', 'read', 'zero', 'test']}
            onSuccess={() => setCalSequenceOk(true)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Bù lệch Khớp Vai', val: shoulderBias, setVal: setShoulderBias },
              { label: 'Bù lệch Khớp Khuỷu', val: elbowBias, setVal: setElbowBias },
              { label: 'Bù lệch Khớp Cổ tay', val: wristBias, setVal: setWristBias },
            ].map((j) => (
              <div key={j.label} className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-sky-950">
                  <span>{j.label}</span>
                  <span
                    className={`tabular-nums ${
                      Math.abs(j.val) <= 0.5 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {j.val > 0 ? `+${j.val}` : j.val}°
                  </span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={j.val}
                  disabled={elbowState.status === 'failed' || shoulderState.status === 'failed'}
                  onChange={(e) => j.setVal(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {calFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {calFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={elbowState.status === 'failed' || shoulderState.status === 'failed'}
            onClick={handleCalibrate}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Hoàn tất hiệu chuẩn 3 khớp
          </button>
        </div>
      )}

      {/* TASK B: MULTI-JOINT 2D FORWARD KINEMATICS + OBSTACLE AVOIDANCE */}
      {activeTask === 'B_cargo' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ B: Điều khiển khớp gắp tàu hàng & Tránh vùng va chạm giàn pin
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_wrist"
            actionLabel="Đầu kẹp LEE & Cổ tay"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-56 rounded-2xl bg-sky-50 border-2 border-sky-200 p-2">
              <svg viewBox="0 0 320 210" className="w-full h-full">
                {/* Forbidden Obstacle Zone */}
                <rect
                  x="118"
                  y="18"
                  width="44"
                  height="54"
                  rx="8"
                  fill={nearObstacle ? '#fecaca' : '#fee2e2'}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text x="140" y="48" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#991b1b">
                  Tránh va chạm
                </text>

                <rect x="20" y="160" width="85" height="32" rx="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
                <circle cx={dockPort.x} cy={dockPort.y} r="14" fill="#d1fae5" stroke="#059669" strokeWidth="3" strokeDasharray="4 3" />
                <text x={dockPort.x} y={dockPort.y + 26} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">
                  Cổng Harmony
                </text>

                {!cargoGrabbed && (
                  <g>
                    <rect x={cargoPin.x - 16} y={cargoPin.y - 28} width="32" height="24" rx="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                    <circle cx={cargoPin.x} cy={cargoPin.y} r="7" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                    <text x={cargoPin.x} y={cargoPin.y - 34} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9a3412">
                      Tàu hàng
                    </text>
                  </g>
                )}

                <line x1={baseX} y1={baseY} x2={elbowX} y2={elbowY} stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />
                <line x1={elbowX} y1={elbowY} x2={tipX} y2={tipY} stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                <circle cx={baseX} cy={baseY} r="9" fill="#fde047" stroke="#0c4a6e" strokeWidth="2.5" />
                <circle cx={elbowX} cy={elbowY} r="8" fill="#fde047" stroke="#0c4a6e" strokeWidth="2.5" />

                {cargoGrabbed && (
                  <rect x={tipX - 14} y={tipY - 14} width="28" height="22" rx="6" fill="#fb923c" stroke="#9a3412" strokeWidth="2" />
                )}
                <circle
                  cx={tipX}
                  cy={tipY}
                  r="9"
                  fill={nearObstacle ? '#ef4444' : wristOpen ? '#ffffff' : '#10b981'}
                  stroke="#0c4a6e"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Khớp Vai (Shoulder)</span>
                  <span className="tabular-nums text-sky-700">{shoulderDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-90}
                  max={10}
                  value={shoulderDeg}
                  disabled={shoulderState.status === 'failed' || elbowState.status === 'failed'}
                  onChange={(e) => setShoulderDeg(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Khớp Khuỷu (Elbow)</span>
                  <span className="tabular-nums text-sky-700">{elbowDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={135}
                  value={elbowDeg}
                  disabled={elbowState.status === 'failed' || shoulderState.status === 'failed'}
                  onChange={(e) => setElbowDeg(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                disabled={wristState.status === 'failed' || elbowState.status === 'failed'}
                onClick={handleToggleGripper}
                className="w-full min-h-12 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
              >
                {cargoGrabbed ? 'Đặt tàu hàng vào Cổng Harmony' : 'Kẹp chốt Tàu hàng'}
              </button>
            </div>
          </div>

          {cargoFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {cargoFeedback}
            </div>
          )}
        </div>
      )}

      {/* TASK C: PHYSICAL CONTROL CONSOLE FOR EVA ASTRONAUT */}
      {activeTask === 'C_astronaut' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ C: Bảng điều khiển trực tiếp đưa phi hành gia EVA an toàn
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_wrist"
            actionLabel="Khớp cổ tay giữ chân phi hành gia"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={wristState.status === 'failed'}
              onClick={() => {
                sound.playEquip();
                setTetherLocked((v) => !v);
                setAstroFeedback(null);
              }}
              className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-2 cursor-pointer ${
                tetherLocked
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div>
                <div className="text-xs font-extrabold">Công tắc Khóa dây an toàn EVA</div>
                <div className="text-sm font-black mt-0.5">
                  {tetherLocked ? 'ĐÃ KHÓA AN TOÀN ✓' : 'ĐANG MỞ (Bấm để khóa)'}
                </div>
              </div>
              <Lock className="w-5 h-5 shrink-0" />
            </button>

            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-sky-950">
                <span>Cần gạt tốc độ di chuyển (An toàn ≤ 0.08 m/s)</span>
                <span className={`tabular-nums ${evaSpeedMs <= 0.08 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {evaSpeedMs.toFixed(2)} m/s
                </span>
              </div>
              <input
                type="range"
                min={0.02}
                max={0.35}
                step={0.01}
                value={evaSpeedMs}
                disabled={wristState.status === 'failed'}
                onChange={(e) => setEvaSpeedMs(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold text-sky-950">
              <span>Vị trí tấm pin cần sửa (Đích: 65%–85%)</span>
              <span className="tabular-nums text-sky-700">{astroReach}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={astroReach}
              disabled={wristState.status === 'failed'}
              onChange={(e) => setAstroReach(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {astroFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {astroFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={wristState.status === 'failed'}
            onClick={handleSupportAstronaut}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Đưa phi hành gia vào vị trí sửa chữa
          </button>
        </div>
      )}

      {/* TASK D: INTERACTIVE PAN / TILT / FOCUS CAMERA VIEWFINDER */}
      {activeTask === 'D_camera' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ D: Xoay hướng & Lấy nét Camera đầu kẹp LEE tìm chốt neo
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_camera"
            actionLabel="Camera định vị đầu kẹp LEE"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-52 rounded-2xl bg-sky-950 border-2 border-sky-300 relative overflow-hidden flex items-center justify-center">
              {/* Target Grapple Fixture Pin */}
              <div
                className="w-12 h-12 rounded-full border-4 border-amber-400 bg-amber-300/20 flex items-center justify-center transition-all"
                style={{
                  transform: `translate(${camPanX * 2.2}px, ${camTiltY * 1.8}px)`,
                  filter:
                    camState.status !== 'ok'
                      ? 'blur(4px)'
                      : `blur(${Math.max(0, Math.round(Math.abs(83 - camFocus) / 10))}px)`,
                }}
              >
                <div className="w-3 h-3 rounded-full bg-amber-400" />
              </div>

              {/* Fixed Center Crosshair */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full border-2 ${
                    camCentered && camFocused ? 'border-emerald-400' : 'border-sky-300/70'
                  }`}
                />
                <div className="absolute w-24 h-0.5 bg-sky-300/50" />
                <div className="absolute h-24 w-0.5 bg-sky-300/50" />
              </div>

              <span className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-extrabold text-sky-950 tabular-nums">
                Độ lệch tâm: ({camPanX}, {camTiltY}) · Nét: {camFocus}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Xoay ngang Camera (Pan X — Đưa về 0)</span>
                  <span className="tabular-nums text-sky-700">{camPanX}</span>
                </div>
                <input
                  type="range"
                  min={-40}
                  max={40}
                  value={camPanX}
                  disabled={camState.status === 'failed'}
                  onChange={(e) => setCamPanX(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Ngẩng/Cúi Camera (Tilt Y — Đưa về 0)</span>
                  <span className="tabular-nums text-sky-700">{camTiltY}</span>
                </div>
                <input
                  type="range"
                  min={-40}
                  max={40}
                  value={camTiltY}
                  disabled={camState.status === 'failed'}
                  onChange={(e) => setCamTiltY(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>Vòng lấy nét (Focus — Vùng rõ: 75–92%)</span>
                  <span className="tabular-nums text-emerald-700">{camFocus}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={100}
                  value={camFocus}
                  disabled={camState.status === 'failed'}
                  onChange={(e) => setCamFocus(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                disabled={camState.status === 'failed'}
                onClick={handleVerifyCamera}
                className="w-full min-h-11 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
              >
                Khóa mục tiêu tâm ngắm LEE
              </button>
            </div>
          </div>

          {camFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {camFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
