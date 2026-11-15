import React, { useEffect, useState } from 'react';
import {
  EquipmentSubsystemId,
  Language,
  MissionSessionState,
} from '../../types/game';
import { getEffectiveSubsystemState } from '../../data/equipmentSystems';
import { SubsystemLockNotice } from './SubsystemLockNotice';
import { SubTaskStatusBar, SubTaskItem } from './SubTaskStatusBar';
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

type ArmTaskKey = 'A_calibrate' | 'B_cargo' | 'C_astronaut' | 'D_camera';

export const CanadarmSimulator: React.FC<CanadarmSimulatorProps> = ({
  session,
  lang,
  onOpenRepair,
  onCompleteSubTask,
  onFailSubTask,
}) => {
  const isEn = lang === 'en';
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

  const shoulderState = getEffectiveSubsystemState(session, 'arm_shoulder', lang);
  const elbowState = getEffectiveSubsystemState(session, 'arm_elbow', lang);
  const wristState = getEffectiveSubsystemState(session, 'arm_wrist', lang);
  const camState = getEffectiveSubsystemState(session, 'arm_camera', lang);

  useEffect(() => {
    setCalFeedback(null);
    setCargoFeedback(null);
    setAstroFeedback(null);
    setCamFeedback(null);
  }, [lang]);

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
      onFailSubTask?.('A_calibrate');
      setCalFeedback(
        isEn
          ? 'Please sort and run the correct Calibration Procedure in Step 1 first!'
          : 'Hãy sắp xếp và thực thi đúng Quy trình hiệu chuẩn ở bước 1 trước!'
      );
      return;
    }
    const ok =
      Math.abs(shoulderBias) <= 0.5 &&
      Math.abs(elbowBias) <= 0.5 &&
      Math.abs(wristBias) <= 0.5;
    if (ok) {
      sound.playSuccess();
      setCalFeedback(
        isEn
          ? 'Shoulder, Elbow, and Wrist joints are calibrated to 0° (tolerance ≤ 0.5°)!'
          : 'Cả 3 khớp Vai, Khuỷu và Cổ tay đã về chuẩn 0° (sai số ≤ 0.5°)!'
      );
      onCompleteSubTask('A_calibrate');
    } else {
      sound.playAlert();
      onFailSubTask?.('A_calibrate');
      setCalFeedback(
        isEn
          ? 'A joint is still off by > 0.5°! Move all 3 sliders into the -0.5° to +0.5° zone.'
          : 'Vẫn còn khớp lệch > 0.5°! Hãy đưa cả 3 thanh trượt về vùng -0.5° đến +0.5°.'
      );
    }
  };

  const handleToggleGripper = () => {
    if (wristState.status === 'failed' || elbowState.status === 'failed') return;
    if (nearObstacle) {
      sound.playAlert();
      onFailSubTask?.('B_cargo');
      setCargoFeedback(
        isEn
          ? 'Solar truss collision warning! Fold the elbow clear of the red keep-out zone before operating the grapple.'
          : 'Cảnh báo va chạm giàn pin Mặt Trời! Hãy gập khuỷu tránh vùng đỏ trước khi thao tác kẹp.'
      );
      return;
    }
    if (!cargoGrabbed) {
      if (distToCargo <= 28) {
        sound.playEquip();
        setCargoGrabbed(true);
        setWristOpen(false);
        setCargoFeedback(
          isEn
            ? 'Cargo pin captured! Move the grapple tip over to the Harmony Docking Port.'
            : 'Đã kẹp chặt chốt tàu hàng! Đưa đầu kẹp về Cổng nối ghép Harmony.'
        );
      } else {
        sound.playAlert();
        onFailSubTask?.('B_cargo');
        setCargoFeedback(
          isEn
            ? `Grapple tip is ${Math.round(distToCargo)} units from the cargo pin. Adjust Shoulder & Elbow closer to the orange pin!`
            : `Đầu kẹp cách chốt tàu hàng ${Math.round(distToCargo)} đơn vị. Hãy chỉnh Vai & Khuỷu lại gần chốt cam!`
        );
      }
    } else {
      if (distToDock <= 30) {
        sound.playSuccess();
        setWristOpen(true);
        setCargoGrabbed(false);
        setCargoFeedback(
          isEn
            ? 'Cargo spacecraft berthed safely at Harmony Port with zero collision!'
            : 'Tàu hàng đã được đưa vào Cổng Harmony an toàn không va chạm!'
        );
        onCompleteSubTask('B_cargo');
      } else {
        sound.playAlert();
        onFailSubTask?.('B_cargo');
        setCargoFeedback(
          isEn
            ? 'Not yet aligned with Harmony Port (green ring)! Do not release cargo in open space.'
            : 'Chưa tới vị trí Cổng Harmony (vòng xanh lá)! Không nhả hàng giữa không gian.'
        );
      }
    }
  };

  const handleSupportAstronaut = () => {
    if (wristState.status === 'failed' || elbowState.status === 'failed') return;
    if (!tetherLocked) {
      sound.playAlert();
      onFailSubTask?.('C_astronaut');
      setAstroFeedback(
        isEn
          ? 'Hazard! Engage the "EVA Safety Tether Lock" before translating the astronaut.'
          : 'Nguy hiểm! Hãy bật "Khóa dây an toàn EVA" trước khi di chuyển phi hành gia.'
      );
      return;
    }
    if (evaSpeedMs > 0.08) {
      sound.playAlert();
      onFailSubTask?.('C_astronaut');
      setAstroFeedback(
        isEn
          ? `Speed ${evaSpeedMs.toFixed(2)} m/s is too fast and causes dangerous oscillation! Lower the speed lever to ≤ 0.08 m/s.`
          : `Tốc độ ${evaSpeedMs.toFixed(2)} m/s quá nhanh gây rung lắc nguy hiểm! Hãy kéo cần tốc độ xuống ≤ 0.08 m/s.`
      );
      return;
    }
    if (astroReach < 65 || astroReach > 85) {
      sound.playAlert();
      onFailSubTask?.('C_astronaut');
      setAstroFeedback(
        isEn
          ? 'Astronaut has not reached the solar array repair zone (65%–85%).'
          : 'Phi hành gia chưa tới đúng vùng sửa chữa tấm pin (65%–85%).'
      );
      return;
    }
    sound.playSuccess();
    setAstroFeedback(
      isEn
        ? 'Astronaut positioned at the repair site at ultra-smooth safe speed!'
        : 'Đã đưa phi hành gia tới vị trí sửa chữa ở tốc độ siêu êm an toàn tuyệt đối!'
    );
    onCompleteSubTask('C_astronaut');
  };

  const camCentered = Math.abs(camPanX) <= 5 && Math.abs(camTiltY) <= 5;
  const camFocused = camFocus >= 75 && camFocus <= 92;

  const handleVerifyCamera = () => {
    if (camState.status === 'failed') return;
    if (!camCentered) {
      sound.playAlert();
      onFailSubTask?.('D_camera');
      setCamFeedback(
        isEn
          ? 'Crosshair is still off the LEE grapple pin! Adjust Pan X & Tilt Y toward 0.'
          : 'Tâm ngắm chữ thập vẫn lệch khỏi chốt neo LEE! Chỉnh Xoay ngang (Pan) & Ngẩng (Tilt) về gần 0.'
      );
      return;
    }
    if (!camFocused) {
      sound.playAlert();
      onFailSubTask?.('D_camera');
      setCamFeedback(
        isEn
          ? 'Camera image is blurry! Move the Focus Ring into the sharp zone (75–92%).'
          : 'Hình ảnh camera đang bị mờ! Kéo Vòng lấy nét vào vùng nét chuẩn (75–92%).'
      );
      return;
    }
    sound.playSuccess();
    setCamFeedback(
      isEn
        ? 'LEE crosshair centered and range markings clearly focused at 0.42 m!'
        : 'Đã căn giữa tâm ngắm LEE và lấy nét rõ từng vạch chia khoảng cách 0.42m!'
    );
    onCompleteSubTask('D_camera', { photos: 1 });
  };

  const tasks: SubTaskItem<ArmTaskKey>[] = [
    {
      key: 'A_calibrate',
      label: isEn ? 'A. Procedure & Calibrate' : 'A. Quy trình & Hiệu chỉnh',
      icon: <Compass className="w-4 h-4" />,
      hasError: elbowState.status === 'failed' || shoulderState.status === 'failed',
    },
    {
      key: 'B_cargo',
      label: isEn ? 'B. Berth Cargo Safely' : 'B. Gắp tàu tránh va chạm',
      icon: <Hand className="w-4 h-4" />,
      hasError: wristState.status === 'failed' || elbowState.status === 'failed',
    },
    {
      key: 'C_astronaut',
      label: isEn ? 'C. EVA Support Console' : 'C. Cần gạt đưa phi hành gia',
      icon: <UserCheck className="w-4 h-4" />,
      hasError: wristState.status === 'failed' || elbowState.status === 'failed',
    },
    {
      key: 'D_camera',
      label: isEn ? 'D. LEE Camera Aim & Focus' : 'D. Xoay & Lấy nét Camera',
      icon: <Camera className="w-4 h-4" />,
      hasError: camState.status === 'failed',
    },
  ];

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

      {/* TASK A: PROCEDURE SORTER + 3-JOINT ENCODER ALIGNMENT */}
      {activeTask === 'A_calibrate' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            {isEn
              ? 'Task A: Sort Calibration Procedure & Zero 3 Canadarm2 Joints'
              : 'Nhiệm vụ A: Sắp xếp quy trình & Hiệu chỉnh 3 khớp Canadarm2'}
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_elbow"
            actionLabel={isEn ? 'Canadarm2 Elbow Joint' : 'Khớp khuỷu Canadarm2'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />
          <SubsystemLockNotice
            session={session}
            subsystemId="arm_shoulder"
            actionLabel={isEn ? 'Canadarm2 Shoulder Joint' : 'Khớp vai Canadarm2'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          <ProcedureSorter
            title={
              isEn
                ? 'Step 1: Arrange the joint calibration procedure in the right order'
                : 'Bước 1: Kéo thả sắp xếp đúng thứ tự quy trình hiệu chuẩn khớp'
            }
            instruction={
              isEn
                ? 'Safe sequence: Lock holding brakes -> Read joint encoders -> Zero joint offsets -> Run unloaded test.'
                : 'Thứ tự an toàn: Khóa phanh giữ tải -> Đọc sai số cảm biến -> Căn chỉnh về 0° -> Chạy thử không tải.'
            }
            lang={lang}
            disabled={elbowState.status === 'failed' || shoulderState.status === 'failed'}
            steps={[
              {
                id: 'test',
                label: isEn ? 'Run low-speed unloaded motion test' : 'Chạy thử chuyển động nhẹ không tải',
                criticalNote: isEn
                  ? 'Never run motion tests before locking brakes and zeroing offsets!'
                  : 'Không được chạy thử khi chưa khóa phanh và hiệu chỉnh 0°!',
              },
              {
                id: 'brake',
                label: isEn ? 'Engage static brakes to hold payload' : 'Khóa phanh tĩnh cố định tải trọng',
              },
              {
                id: 'zero',
                label: isEn ? 'Zero joint angle offset to 0°' : 'Căn chỉnh bù sai lệch khớp về 0°',
              },
              {
                id: 'read',
                label: isEn ? 'Read current joint angle sensor data' : 'Đọc dữ liệu cảm biến góc hiện tại',
              },
            ]}
            expectedOrder={['brake', 'read', 'zero', 'test']}
            onSuccess={() => setCalSequenceOk(true)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: isEn ? 'Shoulder Joint Offset' : 'Bù lệch Khớp Vai', val: shoulderBias, setVal: setShoulderBias },
              { label: isEn ? 'Elbow Joint Offset' : 'Bù lệch Khớp Khuỷu', val: elbowBias, setVal: setElbowBias },
              { label: isEn ? 'Wrist Joint Offset' : 'Bù lệch Khớp Cổ tay', val: wristBias, setVal: setWristBias },
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
            {isEn ? 'Complete 3-Joint Calibration' : 'Hoàn tất hiệu chuẩn 3 khớp'}
          </button>
        </div>
      )}

      {/* TASK B: MULTI-JOINT 2D FORWARD KINEMATICS + OBSTACLE AVOIDANCE */}
      {activeTask === 'B_cargo' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            {isEn
              ? 'Task B: Grapple Cargo Vehicle & Avoid Solar Array Collision'
              : 'Nhiệm vụ B: Điều khiển khớp gắp tàu hàng & Tránh vùng va chạm giàn pin'}
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_wrist"
            actionLabel={isEn ? 'LEE Grapple & Wrist Joint' : 'Đầu kẹp LEE & Cổ tay'}
            lang={lang}
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-56 rounded-2xl bg-sky-50 border-2 border-sky-200 p-2">
              <svg viewBox="0 0 320 210" className="w-full h-full">
                {/* Forbidden Obstacle Zone */}
                <rect
                  x="104"
                  y="18"
                  width="72"
                  height="54"
                  rx="8"
                  fill={nearObstacle ? '#fecaca' : '#fee2e2'}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text x="140" y="48" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#991b1b">
                  {isEn ? 'No-Fly' : 'Tránh va chạm'}
                </text>

                <rect x="20" y="160" width="85" height="32" rx="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
                <circle cx={dockPort.x} cy={dockPort.y} r="14" fill="#d1fae5" stroke="#059669" strokeWidth="3" strokeDasharray="4 3" />
                <text x={dockPort.x} y={dockPort.y + 26} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">
                  {isEn ? 'Harmony Port' : 'Cổng Harmony'}
                </text>

                {!cargoGrabbed && (
                  <g>
                    <rect x={cargoPin.x - 16} y={cargoPin.y - 28} width="32" height="24" rx="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                    <circle cx={cargoPin.x} cy={cargoPin.y} r="7" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                    <text x={cargoPin.x} y={cargoPin.y - 34} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9a3412">
                      {isEn ? 'Cargo' : 'Tàu hàng'}
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
                  <span>{isEn ? 'Shoulder Joint' : 'Khớp Vai (Shoulder)'}</span>
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
                  <span>{isEn ? 'Elbow Joint' : 'Khớp Khuỷu (Elbow)'}</span>
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
                {cargoGrabbed
                  ? isEn
                    ? 'Berth Cargo at Harmony Port'
                    : 'Đặt tàu hàng vào Cổng Harmony'
                  : isEn
                  ? 'Grapple Cargo Pin'
                  : 'Kẹp chốt Tàu hàng'}
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
            {isEn
              ? 'Task C: Direct Control Console for Safe EVA Astronaut Support'
              : 'Nhiệm vụ C: Bảng điều khiển trực tiếp đưa phi hành gia EVA an toàn'}
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_wrist"
            actionLabel={isEn ? 'Astronaut Foot Restraint & Wrist' : 'Khớp cổ tay giữ chân phi hành gia'}
            lang={lang}
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
                <div className="text-xs font-extrabold">
                  {isEn ? 'EVA Safety Tether Lock Switch' : 'Công tắc Khóa dây an toàn EVA'}
                </div>
                <div className="text-sm font-black mt-0.5">
                  {tetherLocked
                    ? isEn
                      ? 'LOCKED SECURELY ✓'
                      : 'ĐÃ KHÓA AN TOÀN ✓'
                    : isEn
                    ? 'UNLOCKED (Click to lock)'
                    : 'ĐANG MỞ (Bấm để khóa)'}
                </div>
              </div>
              <Lock className="w-5 h-5 shrink-0" />
            </button>

            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-sky-950">
                <span>
                  {isEn
                    ? 'Translation Speed Lever (Safe ≤ 0.08 m/s)'
                    : 'Cần gạt tốc độ di chuyển (An toàn ≤ 0.08 m/s)'}
                </span>
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
              <span>
                {isEn
                  ? 'Solar Array Worksite Reach (Target: 65%–85%)'
                  : 'Vị trí tấm pin cần sửa (Đích: 65%–85%)'}
              </span>
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
            {isEn ? 'Move Astronaut to Repair Position' : 'Đưa phi hành gia vào vị trí sửa chữa'}
          </button>
        </div>
      )}

      {/* TASK D: INTERACTIVE PAN / TILT / FOCUS CAMERA VIEWFINDER */}
      {activeTask === 'D_camera' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            {isEn
              ? 'Task D: Pan, Tilt & Focus LEE Camera on Grapple Pin'
              : 'Nhiệm vụ D: Xoay hướng & Lấy nét Camera đầu kẹp LEE tìm chốt neo'}
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="arm_camera"
            actionLabel={isEn ? 'LEE Targeting Camera' : 'Camera định vị đầu kẹp LEE'}
            lang={lang}
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
                {isEn
                  ? `Offset: (${camPanX}, ${camTiltY}) · Focus: ${camFocus}%`
                  : `Độ lệch tâm: (${camPanX}, ${camTiltY}) · Nét: ${camFocus}%`}
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold text-sky-900">
                  <span>{isEn ? 'Camera Pan X (Bring to 0)' : 'Xoay ngang Camera (Pan X — Đưa về 0)'}</span>
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
                  <span>{isEn ? 'Camera Tilt Y (Bring to 0)' : 'Ngẩng/Cúi Camera (Tilt Y — Đưa về 0)'}</span>
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
                  <span>{isEn ? 'Focus Ring (Sharp: 75–92%)' : 'Vòng lấy nét (Focus — Vùng rõ: 75–92%)'}</span>
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
                {isEn ? 'Lock LEE Crosshair Target' : 'Khóa mục tiêu tâm ngắm LEE'}
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
