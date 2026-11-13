import React, { useEffect, useState } from 'react';
import {
  EquipmentSubsystemId,
  MissionSessionState,
} from '../../types/game';
import {
  getEffectiveSubsystemState,
  getPartById,
} from '../../data/equipmentSystems';
import { SubsystemLockNotice } from './SubsystemLockNotice';
import { CircuitWiringBoard } from '../interactive/CircuitWiringBoard';
import { sound } from '../../services/sound';
import {
  BatteryCharging,
  CheckCircle2,
  Droplets,
  Package,
  Power,
  Radio,
  Thermometer,
  Zap,
} from 'lucide-react';

interface IssSimulatorProps {
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onCompleteSubTask: (taskId: string, extras?: { photos?: number; samples?: number }) => void;
}

type IssTaskKey = 'A_power' | 'B_thermal' | 'C_comms' | 'D_resources';

interface SupplyCrate {
  id: string;
  label: string;
  targetModule: 'zvezda' | 'destiny' | 'veggie';
  kind: 'Nước & Oxy' | 'Thí nghiệm' | 'Thực phẩm';
}

const SUPPLY_CRATES: SupplyCrate[] = [
  { id: 'c_o2', label: 'Bình Oxy & Nước uống (Ưu tiên sinh mạng)', targetModule: 'zvezda', kind: 'Nước & Oxy' },
  { id: 'c_food', label: 'Hộp Lương thực & Y tế Phi hành đoàn', targetModule: 'zvezda', kind: 'Thực phẩm' },
  { id: 'c_water_lab', label: 'Bình nước tái chế cho Vườn cây Veggie', targetModule: 'veggie', kind: 'Nước & Oxy' },
  { id: 'c_filter', label: 'Bộ lọc không khí & Mẫu thí nghiệm Destiny', targetModule: 'destiny', kind: 'Thí nghiệm' },
];

export const IssSimulator: React.FC<IssSimulatorProps> = ({
  session,
  onOpenRepair,
  onCompleteSubTask,
}) => {
  const [activeTask, setActiveTask] = useState<IssTaskKey>('A_power');

  // Task A: Breaker Switches + Power Distribution
  const [lifeOn, setLifeOn] = useState(true);
  const [thermOn, setThermOn] = useState(true);
  const [labOn, setLabOn] = useState(true);
  const [auxOn, setAuxOn] = useState(true);
  const [allocLife, setAllocLife] = useState(50);
  const [allocThermal, setAllocThermal] = useState(25);
  const [allocScience, setAllocScience] = useState(25);
  const [allocAux, setAllocAux] = useState(15);
  const [powerFeedback, setPowerFeedback] = useState<string | null>(null);

  // Task B: Real-time Thermal Loop Simulation
  const [valveLoopA, setValveLoopA] = useState(true);
  const [valveLoopB, setValveLoopB] = useState(false);
  const [pumpOn, setPumpOn] = useState(false);
  const [flowRateLpm, setFlowRateLpm] = useState(40);
  const [destinyTempC, setDestinyTempC] = useState(33.5);
  const [thermalFeedback, setThermalFeedback] = useState<string | null>(null);

  // Task C: Ku-Band Circuit Wiring + TDRS Gimbal Dish
  const [kuWired, setKuWired] = useState(false);
  const [tdrsAimDeg, setTdrsAimDeg] = useState(45);
  const [commsFeedback, setCommsFeedback] = useState<string | null>(null);

  // Task D: Drag-and-Drop Supply Crates to ISS Modules
  const [crateAssignments, setCrateAssignments] = useState<Record<string, 'zvezda' | 'destiny' | 'veggie'>>({});
  const [draggingCrateId, setDraggingCrateId] = useState<string | null>(null);
  const [selectedCrateId, setSelectedCrateId] = useState<string | null>(null);
  const [resourceFeedback, setResourceFeedback] = useState<string | null>(null);

  const powerState = getEffectiveSubsystemState(session, 'iss_power');
  const thermState = getEffectiveSubsystemState(session, 'iss_thermal');
  const commsState = getEffectiveSubsystemState(session, 'iss_comms');
  const lifeState = getEffectiveSubsystemState(session, 'iss_lifesupport');

  const powerPart = getPartById(session.subsystems.iss_power?.partId || '');
  const eclipseBudgetPct =
    powerState.status === 'failed'
      ? 50
      : powerState.status === 'degraded'
      ? 80
      : powerPart?.tier === 'economy'
      ? 85
      : powerPart?.tier === 'standard'
      ? 100
      : 120;

  const isDone = (k: IssTaskKey) => session.completedSubTasks.includes(k);

  const totalPowerAllocated =
    (lifeOn ? allocLife : 0) +
    (thermOn ? allocThermal : 0) +
    (labOn ? allocScience : 0) +
    (auxOn ? allocAux : 0);

  // Live thermal tick simulation in Task B
  useEffect(() => {
    if (activeTask !== 'B_thermal') return;
    const timer = setInterval(() => {
      setDestinyTempC((prev) => {
        if (thermState.status === 'failed') {
          return Math.min(36, +(prev + 0.3).toFixed(1));
        }
        const coolingActive = !valveLoopA && valveLoopB && pumpOn && flowRateLpm >= 65;
        if (coolingActive) {
          return Math.max(21.5, +(prev - 0.8).toFixed(1));
        }
        if (valveLoopB && pumpOn) {
          return Math.max(26.5, +(prev - 0.2).toFixed(1));
        }
        return Math.min(36, +(prev + 0.25).toFixed(1));
      });
    }, 550);
    return () => clearInterval(timer);
  }, [activeTask, thermState.status, valveLoopA, valveLoopB, pumpOn, flowRateLpm]);

  const handleConfirmPower = () => {
    if (powerState.status === 'failed') return;

    if (totalPowerAllocated > eclipseBudgetPct) {
      sound.playAlert();
      setPowerFeedback(
        `Cảnh báo quá tải (${totalPowerAllocated}% > ${eclipseBudgetPct}%)! Hãy ngắt cầu dao khoang phụ hoặc giảm công suất Phòng thí nghiệm.`
      );
      return;
    }

    if (!lifeOn || allocLife < 45 || !thermOn || allocThermal < 20) {
      sound.playAlert();
      setPowerFeedback(
        'Nguy hiểm! Hệ Hỗ trợ sự sống (≥45%) và Điều hòa nhiệt (≥20%) bắt buộc phải bật và đủ điện.'
      );
      return;
    }

    sound.playSuccess();
    setPowerFeedback(
      `Lưới điện cân bằng an toàn (${totalPowerAllocated}/${eclipseBudgetPct}%) trong suốt 45 phút bóng tối!`
    );
    onCompleteSubTask('A_power');
  };

  const handleVerifyThermal = () => {
    if (thermState.status === 'failed') return;
    if (valveLoopA) {
      sound.playAlert();
      setThermalFeedback('Van Vòng A đang bị tắc nghẽn gây kẹt áp suất! Hãy đóng Van A và mở Van Vòng B dự phòng.');
      return;
    }
    if (!valveLoopB || !pumpOn || flowRateLpm < 65) {
      sound.playAlert();
      setThermalFeedback('Hãy mở Van Vòng B, bật Bơm Amoniac và tăng lưu lượng ≥ 65 L/phút để hạ nhiệt khoang Destiny.');
      return;
    }
    if (destinyTempC > 24.5) {
      sound.playClick();
      setThermalFeedback(`Nhiệt độ đang hạ xuống (${destinyTempC}°C)... Chờ thêm vài giây về mức an toàn ≤ 24.5°C rồi xác nhận!`);
      return;
    }
    sound.playSuccess();
    setThermalFeedback(`Khoang Destiny đã hạ nhiệt ổn định về ${destinyTempC}°C!`);
    onCompleteSubTask('B_thermal');
  };

  const tdrsLocked = Math.abs(tdrsAimDeg - 95) <= 10;

  const handleLockHouston = () => {
    if (commsState.status === 'failed') return;
    if (!kuWired) {
      sound.playAlert();
      setCommsFeedback('Mạch điện bộ phát Ku-Band chưa nối xong hoặc chưa bật nguồn kiểm tra!');
      return;
    }
    if (!tdrsLocked) {
      sound.playAlert();
      setCommsFeedback(`Chảo ăng-ten (${tdrsAimDeg}°) chưa hướng trúng vệ tinh TDRS (85°–105°)!`);
      return;
    }
    sound.playSuccess();
    setCommsFeedback('Đã khóa liên lạc liên tục qua vệ tinh TDRS với Trung tâm Điều khiển Houston!');
    onCompleteSubTask('C_comms');
  };

  const assignCrateToModule = (crateId: string, mod: 'zvezda' | 'destiny' | 'veggie') => {
    if (lifeState.status === 'failed') return;
    sound.playEquip();
    setCrateAssignments((prev) => ({ ...prev, [crateId]: mod }));
    setDraggingCrateId(null);
    setSelectedCrateId(null);
    setResourceFeedback(null);
  };

  const handleConfirmResources = () => {
    if (lifeState.status === 'failed') return;
    const assignedCount = Object.keys(crateAssignments).length;
    if (assignedCount < SUPPLY_CRATES.length) {
      sound.playAlert();
      setResourceFeedback(`Hãy kéo thả hoặc gán đủ cả ${SUPPLY_CRATES.length} thùng vật tư vào đúng khoang ISS (${assignedCount}/${SUPPLY_CRATES.length}).`);
      return;
    }

    const allMatched = SUPPLY_CRATES.every((c) => crateAssignments[c.id] === c.targetModule);
    if (!allMatched) {
      sound.playAlert();
      setResourceFeedback('Một số vật tư đặt sai khoang nhu cầu! Nhớ đưa Oxy/Lương thực vào Khoang Ở Zvezda, nước tái chế vào Vườn cây Veggie và bộ lọc thí nghiệm vào Destiny.');
      return;
    }

    sound.playSuccess();
    setResourceFeedback('Tất cả nước sạch, oxy và vật tư đã được phân phối chính xác cho phi hành đoàn ISS!');
    onCompleteSubTask('D_resources');
  };

  const tasks: { key: IssTaskKey; label: string; icon: React.ReactNode }[] = [
    { key: 'A_power', label: 'A. Sơ đồ cầu dao điện', icon: <Zap className="w-4 h-4" /> },
    { key: 'B_thermal', label: 'B. Van & Bơm làm mát', icon: <Thermometer className="w-4 h-4" /> },
    { key: 'C_comms', label: 'C. Mạch & Chảo TDRS', icon: <Radio className="w-4 h-4" /> },
    { key: 'D_resources', label: 'D. Kéo thả vật tư', icon: <Droplets className="w-4 h-4" /> },
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

      {/* TASK A: INTERACTIVE BREAKER PANEL & POWER BUS */}
      {activeTask === 'A_power' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-sky-950 font-display">
              Nhiệm vụ A: Đóng ngắt cầu dao & Phân phối điện trạm ISS
            </h2>
            <span
              className={`text-xs font-extrabold tabular-nums flex items-center gap-1 ${
                totalPowerAllocated > eclipseBudgetPct ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              <BatteryCharging className="w-4 h-4" />
              <span>
                Tải tiêu thụ: {totalPowerAllocated}% / Nguồn cung tối đa: {eclipseBudgetPct}%
              </span>
            </span>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="iss_power"
            actionLabel="Mảng pin Mặt Trời & Pin lưu trữ"
            onOpenRepair={onOpenRepair}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: 'Hỗ trợ sự sống & Oxy (Tối thiểu 45%)',
                on: lifeOn,
                toggle: () => setLifeOn((v) => !v),
                val: allocLife,
                setVal: setAllocLife,
                min: 30,
                max: 70,
              },
              {
                label: 'Điều hòa nhiệt Amoniac (Tối thiểu 20%)',
                on: thermOn,
                toggle: () => setThermOn((v) => !v),
                val: allocThermal,
                setVal: setAllocThermal,
                min: 10,
                max: 45,
              },
              {
                label: 'Giá thí nghiệm Columbus',
                on: labOn,
                toggle: () => setLabOn((v) => !v),
                val: allocScience,
                setVal: setAllocScience,
                min: 5,
                max: 45,
              },
              {
                label: 'Đèn chiếu sáng & Thiết bị phụ',
                on: auxOn,
                toggle: () => setAuxOn((v) => !v),
                val: allocAux,
                setVal: setAllocAux,
                min: 5,
                max: 30,
              },
            ].map((bus) => (
              <div
                key={bus.label}
                className={`p-3.5 rounded-2xl border-2 space-y-2 ${
                  bus.on ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-sky-950">{bus.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      bus.toggle();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer ${
                      bus.on ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-800'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{bus.on ? 'ĐANG BẬT' : 'ĐÃ NGẮT'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={bus.min}
                    max={bus.max}
                    disabled={!bus.on}
                    value={bus.val}
                    onChange={(e) => bus.setVal(Number(e.target.value))}
                    className="flex-1 accent-sky-500 cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-sky-900 tabular-nums w-10 text-right">
                    {bus.on ? `${bus.val}%` : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {powerFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {powerFeedback}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmPower}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer"
          >
            Áp dụng cấu hình điện ISS
          </button>
        </div>
      )}

      {/* TASK B: AMMONIA VALVE & COOLING LOOP LIVE SIMULATION */}
      {activeTask === 'B_thermal' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ B: Điều chỉnh van tản nhiệt Amoniac & Theo dõi hạ nhiệt trực tiếp
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="iss_thermal"
            actionLabel="Hệ thống điều hòa nhiệt Amoniac"
            onOpenRepair={onOpenRepair}
          />

          {/* Module Temperatures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { name: 'Khoang Destiny', temp: `${destinyTempC}°C`, hot: destinyTempC > 26 },
              { name: 'Khoang Harmony', temp: `${Math.max(21, +(destinyTempC - 6).toFixed(1))}°C`, hot: false },
              { name: 'Khoang Columbus', temp: '21.8°C', hot: false },
              { name: 'Khoang Zvezda', temp: '22.4°C', hot: false },
            ].map((mod) => (
              <div
                key={mod.name}
                className={`p-3.5 rounded-2xl border-2 ${
                  mod.hot ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="text-xs font-extrabold text-sky-950">{mod.name}</div>
                <div className={`text-lg font-black tabular-nums mt-1 ${mod.hot ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {mod.temp}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Cooling Control Board */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={thermState.status === 'failed'}
              onClick={() => {
                sound.playClick();
                setValveLoopA((v) => !v);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer disabled:opacity-45 ${
                valveLoopA ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="text-xs font-extrabold text-sky-950">Van Vòng A (Có cặn tắc)</div>
              <div className="text-sm font-black mt-1 text-rose-700">
                {valveLoopA ? 'ĐANG MỞ (Nghẽn áp suất)' : 'ĐÃ KHÓA CÁCH LY ✓'}
              </div>
            </button>

            <button
              type="button"
              disabled={thermState.status === 'failed'}
              onClick={() => {
                sound.playClick();
                setValveLoopB((v) => !v);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer disabled:opacity-45 ${
                valveLoopB ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-sky-200'
              }`}
            >
              <div className="text-xs font-extrabold text-sky-950">Van Vòng B (Dự phòng)</div>
              <div className={`text-sm font-black mt-1 ${valveLoopB ? 'text-emerald-700' : 'text-slate-600'}`}>
                {valveLoopB ? 'ĐANG MỞ THÔNG SUỐT ✓' : 'ĐANG ĐÓNG (Chạm để mở)'}
              </div>
            </button>

            <button
              type="button"
              disabled={thermState.status === 'failed'}
              onClick={() => {
                sound.playClick();
                setPumpOn((v) => !v);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer disabled:opacity-45 ${
                pumpOn ? 'bg-sky-50 border-sky-500' : 'bg-white border-sky-200'
              }`}
            >
              <div className="text-xs font-extrabold text-sky-950">Bơm Tuần Hoàn Amoniac</div>
              <div className={`text-sm font-black mt-1 ${pumpOn ? 'text-sky-700' : 'text-slate-600'}`}>
                {pumpOn ? 'ĐANG BƠM CHỦ ĐỘNG ✓' : 'ĐANG TẮT (Chạm để bật)'}
              </div>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold text-sky-950">
              <span>Lưu lượng tản nhiệt Amoniac (Mục tiêu ≥ 65 L/phút)</span>
              <span className="tabular-nums text-sky-700">{flowRateLpm} L/phút</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={flowRateLpm}
              disabled={thermState.status === 'failed'}
              onChange={(e) => setFlowRateLpm(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {thermalFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {thermalFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={thermState.status === 'failed'}
            onClick={handleVerifyThermal}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Xác nhận nhiệt độ đã về mức an toàn
          </button>
        </div>
      )}

      {/* TASK C: KU-BAND CIRCUIT + TDRS GIMBAL TRACKING */}
      {activeTask === 'C_comms' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-sky-950 font-display">
            Nhiệm vụ C: Nối mạch Ku-Band & Quay chảo khóa vệ tinh TDRS
          </h2>

          <SubsystemLockNotice
            session={session}
            subsystemId="iss_comms"
            actionLabel="Hệ thống liên lạc Ku/S-Band"
            onOpenRepair={onOpenRepair}
          />

          <CircuitWiringBoard
            title="Bước 1: Đấu nối mạch truyền tin trạm ISS"
            instruction="Nối Bus nguồn 120V DC, Kênh dữ liệu điều khiển và Chân chảo phát Ku-Band."
            disabled={commsState.status === 'failed'}
            leftNodes={[
              { id: 'bus', label: 'Bus điện ISS 120V', color: '#f59e0b', sublabel: 'Nguồn trạm' },
              { id: 'voice', label: 'Tín hiệu điều khiển', color: '#0284c7', sublabel: 'Âm thanh & Dữ liệu' },
            ]}
            rightNodes={[
              { id: 'ku_data', label: 'Bộ phát Ku-Band', color: '#0284c7', sublabel: 'Truyền dữ liệu cao' },
              { id: 'ku_pwr', label: 'Nguồn bộ khuếch đại', color: '#f59e0b', sublabel: '120V Input' },
            ]}
            expectedConnections={[
              { fromId: 'bus', toId: 'ku_pwr', errorHint: 'Bus điện 120V phải nối vào Nguồn bộ khuếch đại!' },
              { fromId: 'voice', toId: 'ku_data' },
            ]}
            onSuccess={() => setKuWired(true)}
          />

          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2.5">
            <div className="flex flex-wrap justify-between text-xs font-extrabold text-sky-950">
              <span>Bước 2: Quay góc chảo bám vệ tinh TDRS quỹ đạo địa tĩnh (85°–105°)</span>
              <span className={`tabular-nums ${tdrsLocked ? 'text-emerald-700' : 'text-amber-700'}`}>
                Góc chảo: {tdrsAimDeg}° {tdrsLocked ? '· BẮT SÓNG TDRS ✓' : '· Lệch hướng'}
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              value={tdrsAimDeg}
              disabled={commsState.status === 'failed'}
              onChange={(e) => setTdrsAimDeg(Number(e.target.value))}
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
            onClick={handleLockHouston}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Khóa kết nối Houston qua TDRS
          </button>
        </div>
      )}

      {/* TASK D: DRAG & DROP SUPPLIES INTO ISS MODULES */}
      {activeTask === 'D_resources' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-sky-950 font-display">
              Nhiệm vụ D: Kéo thả vật tư thiết yếu vào từng khoang trạm ISS
            </h2>
            <p className="text-xs text-sky-800/85 font-medium">
              Kéo (hoặc chạm chọn thùng rồi chạm vào khoang) để phân bổ nước, oxy và thiết bị đúng nơi cần.
            </p>
          </div>

          <SubsystemLockNotice
            session={session}
            subsystemId="iss_lifesupport"
            actionLabel="Hệ hỗ trợ sự sống & tài nguyên"
            onOpenRepair={onOpenRepair}
          />

          {/* Unassigned Supply Crates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SUPPLY_CRATES.map((crate) => {
              const assignedTo = crateAssignments[crate.id];
              const isSelected = selectedCrateId === crate.id;

              return (
                <div
                  key={crate.id}
                  draggable={lifeState.status !== 'failed'}
                  onDragStart={() => setDraggingCrateId(crate.id)}
                  onDragEnd={() => setDraggingCrateId(null)}
                  onClick={() => {
                    if (lifeState.status === 'failed') return;
                    sound.playClick();
                    setSelectedCrateId(isSelected ? null : crate.id);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left cursor-grab active:cursor-grabbing transition-all space-y-1 ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : assignedTo
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-sky-50/70 border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs font-extrabold text-sky-700">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>{crate.kind}</span>
                    </span>
                    {assignedTo && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-extrabold text-sky-950">{crate.label}</div>
                </div>
              );
            })}
          </div>

          {/* 3 ISS Module Dropzones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                {
                  id: 'zvezda',
                  title: 'Khoang Ở Zvezda',
                  need: 'Nhu cầu: Nước uống, Oxy & Lương thực phi hành gia',
                },
                {
                  id: 'destiny',
                  title: 'Phòng Thí Nghiệm Destiny',
                  need: 'Nhu cầu: Bộ lọc không khí & Mẫu thí nghiệm',
                },
                {
                  id: 'veggie',
                  title: 'Vườn Cây Veggie',
                  need: 'Nhu cầu: Bình nước tái chế trồng rau xanh',
                },
              ] as const
            ).map((mod) => {
              const itemsHere = SUPPLY_CRATES.filter((c) => crateAssignments[c.id] === mod.id);

              return (
                <div
                  key={mod.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingCrateId) assignCrateToModule(draggingCrateId, mod.id);
                  }}
                  onClick={() => {
                    if (selectedCrateId) assignCrateToModule(selectedCrateId, mod.id);
                  }}
                  className={`p-4 rounded-2xl border-2 border-dashed min-h-32 transition-all space-y-2 ${
                    selectedCrateId
                      ? 'bg-amber-50/40 border-amber-400 cursor-pointer'
                      : 'bg-sky-50/40 border-sky-300'
                  }`}
                >
                  <div className="text-sm font-extrabold text-sky-950">{mod.title}</div>
                  <div className="text-[11px] font-semibold text-sky-800">{mod.need}</div>
                  <div className="space-y-1 pt-1">
                    {itemsHere.map((c) => (
                      <div
                        key={c.id}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900"
                      >
                        ✓ {c.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {resourceFeedback && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm font-bold text-sky-950">
              {resourceFeedback}
            </div>
          )}

          <button
            type="button"
            disabled={lifeState.status === 'failed'}
            onClick={handleConfirmResources}
            className="min-h-12 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm cursor-pointer"
          >
            Chốt phân bổ vật tư trên ISS
          </button>
        </div>
      )}
    </div>
  );
};
