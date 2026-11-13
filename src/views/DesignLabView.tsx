import React, { useEffect, useState } from 'react';
import {
  CadetProfile,
  EngineeringPart,
  EquipmentSubsystemId,
  Language,
  MissionConfig,
  MissionId,
  MissionSessionState,
} from '../types/game';
import {
  DIFFICULTY_PROFILES,
  INCOMPATIBLE_DECOY_PARTS,
  PART_TIER_LABELS,
  evaluateSystemSafety,
  getPartById,
  getPartsForSubsystem,
  getRemainingBudget,
  getSubsystemsForMission,
  getTotalEconomySpent,
} from '../data/equipmentSystems';
import { sound } from '../services/sound';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Coins,
  GripHorizontal,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

interface DesignLabViewProps {
  cadet: CadetProfile;
  lang: Language;
  mission: MissionConfig;
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onProceedToLaunch: () => void;
  onBack?: () => void;
}

const EquipmentSchematicSvg: React.FC<{
  missionId: MissionId;
  activeSubsystemId: EquipmentSubsystemId;
}> = ({ missionId, activeSubsystemId }) => {
  if (missionId === 'mission_02_earth_satellite') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        {/* Earth curve */}
        <path d="M20 210 Q210 155 400 210" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
        {/* Solar Wings */}
        <rect
          x="35"
          y="78"
          width="105"
          height="52"
          rx="8"
          fill={activeSubsystemId === 'sat_power' ? '#fde047' : '#38bdf8'}
          stroke="#0284c7"
          strokeWidth="3"
        />
        <rect
          x="280"
          y="78"
          width="105"
          height="52"
          rx="8"
          fill={activeSubsystemId === 'sat_power' ? '#fde047' : '#38bdf8'}
          stroke="#0284c7"
          strokeWidth="3"
        />
        <line x1="140" y1="104" x2="165" y2="104" stroke="#0284c7" strokeWidth="4" />
        <line x1="255" y1="104" x2="280" y2="104" stroke="#0284c7" strokeWidth="4" />
        {/* Satellite Core */}
        <rect
          x="165"
          y="64"
          width="90"
          height="82"
          rx="14"
          fill={activeSubsystemId === 'sat_processor' ? '#fde68a' : '#ffffff'}
          stroke="#0284c7"
          strokeWidth="3.5"
        />
        {/* OLI-2 & TIRS-2 Sensors */}
        <circle
          cx="192"
          cy="132"
          r="14"
          fill={activeSubsystemId === 'sat_oli' ? '#34d399' : '#0ea5e9'}
          stroke="#0369a1"
          strokeWidth="2.5"
        />
        <circle
          cx="228"
          cy="132"
          r="12"
          fill={activeSubsystemId === 'sat_tirs' ? '#fb923c' : '#f97316'}
          stroke="#9a3412"
          strokeWidth="2.5"
        />
        {/* X-Band Dish */}
        <path
          d="M195 54 Q210 38 225 54 Z"
          fill={activeSubsystemId === 'sat_comms' ? '#fde047' : '#e2e8f0'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        <text x="210" y="96" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          LANDSAT 9
        </text>
      </svg>
    );
  }

  if (missionId === 'mission_03_space_station') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        {/* Main Truss */}
        <line x1="40" y1="105" x2="380" y2="105" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
        {/* Solar Wings Left/Right */}
        <rect
          x="35"
          y="36"
          width="46"
          height="136"
          rx="6"
          fill={activeSubsystemId === 'iss_power' ? '#fde047' : '#0ea5e9'}
          stroke="#0369a1"
          strokeWidth="2.5"
        />
        <rect
          x="339"
          y="36"
          width="46"
          height="136"
          rx="6"
          fill={activeSubsystemId === 'iss_power' ? '#fde047' : '#0ea5e9'}
          stroke="#0369a1"
          strokeWidth="2.5"
        />
        {/* Pressurized Modules */}
        <rect
          x="145"
          y="85"
          width="130"
          height="42"
          rx="14"
          fill={activeSubsystemId === 'iss_lifesupport' ? '#86efac' : '#ffffff'}
          stroke="#0284c7"
          strokeWidth="3"
        />
        {/* Thermal Radiators */}
        <rect
          x="175"
          y="35"
          width="70"
          height="32"
          rx="6"
          fill={activeSubsystemId === 'iss_thermal' ? '#fdba74' : '#e0f2fe'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        {/* Ku-Band Dish */}
        <circle
          cx="295"
          cy="76"
          r="12"
          fill={activeSubsystemId === 'iss_comms' ? '#fde047' : '#cbd5e1'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        <text x="210" y="111" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          TRẠM ISS
        </text>
      </svg>
    );
  }

  if (missionId === 'mission_04_robotic_arm') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        <rect x="35" y="138" width="90" height="44" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
        {/* Shoulder Joint */}
        <circle
          cx="100"
          cy="142"
          r="14"
          fill={activeSubsystemId === 'arm_shoulder' ? '#fde047' : '#0ea5e9'}
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        {/* Upper Boom */}
        <line x1="100" y1="142" x2="205" y2="68" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
        <line x1="100" y1="142" x2="205" y2="68" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        {/* Elbow Joint & Camera */}
        <circle
          cx="205"
          cy="68"
          r="14"
          fill={activeSubsystemId === 'arm_elbow' ? '#fde047' : '#38bdf8'}
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        <rect
          x="194"
          y="40"
          width="22"
          height="14"
          rx="4"
          fill={activeSubsystemId === 'arm_camera' ? '#34d399' : '#fb923c'}
          stroke="#0c4a6e"
          strokeWidth="2"
        />
        {/* Forearm Boom */}
        <line x1="205" y1="68" x2="318" y2="122" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
        <line x1="205" y1="68" x2="318" y2="122" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
        {/* Wrist & LEE */}
        <circle
          cx="318"
          cy="122"
          r="15"
          fill={activeSubsystemId === 'arm_wrist' ? '#fde047' : '#10b981'}
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        <text x="210" y="196" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          CÁNH TAY ROBOT CANADARM2
        </text>
      </svg>
    );
  }

  if (missionId === 'mission_05_space_telescope') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        <circle cx="345" cy="52" r="14" fill="#fde047" opacity="0.6" />
        <circle cx="80" cy="48" r="3" fill="#0284c7" />
        <circle cx="310" cy="175" r="3" fill="#0284c7" />
        {/* Solar Wings */}
        <rect
          x="50"
          y="92"
          width="88"
          height="36"
          rx="6"
          fill={activeSubsystemId === 'hst_power' ? '#fde047' : '#38bdf8'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        <rect
          x="282"
          y="92"
          width="88"
          height="36"
          rx="6"
          fill={activeSubsystemId === 'hst_power' ? '#fde047' : '#38bdf8'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        {/* Optical Tube */}
        <rect
          x="145"
          y="72"
          width="130"
          height="76"
          rx="18"
          fill={activeSubsystemId === 'hst_computer' ? '#fde68a' : '#ffffff'}
          stroke="#0284c7"
          strokeWidth="3.5"
        />
        {/* Aperture / Optics */}
        <ellipse
          cx="265"
          cy="110"
          rx="14"
          ry="30"
          fill={activeSubsystemId === 'hst_optics' ? '#34d399' : '#bae6fd'}
          stroke="#0369a1"
          strokeWidth="3"
        />
        {/* FGS Guidance Block */}
        <rect
          x="165"
          y="132"
          width="58"
          height="24"
          rx="8"
          fill={activeSubsystemId === 'hst_guidance' ? '#fde047' : '#e0f2fe'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        <text x="206" y="114" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          HUBBLE
        </text>
      </svg>
    );
  }

  // Default: Mission 1 Mars Rover
  return (
    <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
      <line x1="20" y1="196" x2="400" y2="196" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
      {/* Rover Body */}
      <rect x="120" y="92" width="168" height="62" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="3.5" />
      {/* MMRTG Power */}
      <rect
        x="86"
        y="102"
        width="36"
        height="36"
        rx="8"
        fill={activeSubsystemId === 'rover_power' ? '#fde047' : '#fb923c'}
        stroke="#9a3412"
        strokeWidth="2.5"
      />
      {/* Mast Camera */}
      <line x1="230" y1="92" x2="230" y2="42" stroke="#0284c7" strokeWidth="4" />
      <rect
        x="212"
        y="24"
        width="36"
        height="22"
        rx="6"
        fill={activeSubsystemId === 'rover_camera' ? '#fde047' : '#38bdf8'}
        stroke="#0284c7"
        strokeWidth="2.5"
      />
      {/* Antenna */}
      <path
        d="M150 66 Q165 50 180 66 Z"
        fill={activeSubsystemId === 'rover_comms' ? '#fde047' : '#e2e8f0'}
        stroke="#0284c7"
        strokeWidth="2.5"
      />
      <line x1="165" y1="66" x2="165" y2="92" stroke="#0284c7" strokeWidth="3" />
      {/* Robotic Arm */}
      <path
        d="M288 118 L334 94 L354 128"
        fill="none"
        stroke={activeSubsystemId === 'rover_arm' ? '#eab308' : '#10b981'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 6 Wheels */}
      {[120, 204, 286].map((wx) => (
        <circle
          key={wx}
          cx={wx}
          cy="176"
          r="19"
          fill={activeSubsystemId === 'rover_mobility' ? '#fde047' : '#ffffff'}
          stroke="#0284c7"
          strokeWidth="4"
        />
      ))}
      <text x="204" y="128" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
        PERSEVERANCE
      </text>
    </svg>
  );
};

export const DesignLabView: React.FC<DesignLabViewProps> = ({
  mission,
  session,
  onUpdateSession,
  onProceedToLaunch,
  onBack,
}) => {
  const subsystems = getSubsystemsForMission(mission.id);
  const [activeSubsystemId, setActiveSubsystemId] = useState<EquipmentSubsystemId>(
    subsystems[0]?.id || 'rover_power'
  );
  const [blockedPartNotice, setBlockedPartNotice] = useState<string | null>(null);
  const [dragPartId, setDragPartId] = useState<string | null>(null);
  const [dropZoneHover, setDropZoneHover] = useState(false);

  useEffect(() => {
    const first = getSubsystemsForMission(mission.id)[0];
    if (first) setActiveSubsystemId(first.id);
    setBlockedPartNotice(null);
    setDragPartId(null);
    setDropZoneHover(false);
  }, [mission.id]);

  const activeBlueprint = subsystems.find((s) => s.id === activeSubsystemId) || subsystems[0];
  const candidateParts = getPartsForSubsystem(activeBlueprint.id);
  const incompatibleDecoy = INCOMPATIBLE_DECOY_PARTS[mission.id];
  const showIncompatibleDecoy =
    incompatibleDecoy && incompatibleDecoy.subsystemId === activeBlueprint.id;

  const safety = evaluateSystemSafety(mission.id, session.subsystems, session.economy);
  const totalSpent = getTotalEconomySpent(session.economy);
  const remainingBudget = getRemainingBudget(session.economy);
  const diffProfile = DIFFICULTY_PROFILES[session.difficulty];

  const handleSelectPart = (part: EngineeringPart) => {
    if (!part.compatibleMissions.includes(mission.id)) {
      sound.playAlert();
      setBlockedPartNotice(
        `Không thể lắp "${part.name}": ${part.incompatibleReason || 'Không tương thích với thiết bị này!'}`
      );
      return;
    }

    setBlockedPartNotice(null);
    sound.playEquip();

    const updatedSubsystems = {
      ...session.subsystems,
      [part.subsystemId]: {
        subsystemId: part.subsystemId,
        partId: part.id,
        health: 100,
        status: 'ok' as const,
      },
    };

    let newPartsCost = 0;
    let newMaintCost = 0;
    Object.values(updatedSubsystems).forEach((rt) => {
      const p = getPartById(rt.partId);
      if (p) {
        newPartsCost += p.purchaseCost;
        newMaintCost += p.maintenanceCost;
      }
    });

    onUpdateSession({
      ...session,
      subsystems: updatedSubsystems,
      economy: {
        ...session.economy,
        partsCost: newPartsCost,
        maintenanceCost: newMaintCost,
      },
    });
  };

  const handleDropOnSchematic = (droppedId?: string) => {
    setDropZoneHover(false);
    const pid = droppedId || dragPartId;
    setDragPartId(null);
    if (!pid) return;
    if (incompatibleDecoy && incompatibleDecoy.id === pid) {
      handleSelectPart(incompatibleDecoy);
      return;
    }
    const found = candidateParts.find((p) => p.id === pid);
    if (found) {
      handleSelectPart(found);
    }
  };

  const canProceed = remainingBudget >= 0 && safety.netPowerW >= -15;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-950 font-display">
              Lắp Ráp · {mission.title.vi}
            </h1>
            <p className="text-sm text-sky-800/80 font-medium">
              {diffProfile.title} · Chọn phân khúc linh kiện cân bằng giữa chi phí, độ bền và an toàn
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!canProceed) {
              sound.playAlert();
              return;
            }
            sound.playSuccess();
            onProceedToLaunch();
          }}
          disabled={!canProceed}
          className={`min-h-12 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-sky-100 text-sky-400 border border-sky-200 cursor-not-allowed'
          }`}
        >
          <span>Tiếp tục</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Economy + Engineering Telemetry Strip */}
      <div className="p-4 rounded-3xl bg-white border-2 border-sky-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1.5">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Ngân sách (Gồm vận hành & bảo trì)</span>
              </span>
              <span className={`tabular-nums ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {totalSpent} / {session.economy.initialBudget} tr$
              </span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-sky-100">
              <div
                className={`h-full rounded-full transition-all ${
                  remainingBudget < 0 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, (totalSpent / session.economy.initialBudget) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] font-bold mt-1 text-sky-800">
              {remainingBudget >= 0
                ? `Còn dự phòng: ${remainingBudget} triệu $`
                : `Vượt ngân sách ${Math.abs(remainingBudget)} triệu $!`}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-sky-600" />
                <span>Cân bằng năng lượng</span>
              </span>
              <span className={`tabular-nums ${safety.netPowerW < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {safety.netPowerW >= 0 ? `+${safety.netPowerW}` : safety.netPowerW} W
              </span>
            </div>
            <div className="text-xs font-medium text-sky-800/85">
              {safety.netPowerW >= 15
                ? 'Nguồn điện ổn định cho toàn bộ hệ thống'
                : safety.netPowerW >= -15
                ? 'Điện năng sát ngưỡng — hạn chế tải nặng đồng thời'
                : 'Thiếu điện nghiêm trọng! Cần nâng cấp nguồn điện'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Độ bền · Hiệu suất · Tin cậy</span>
              </span>
            </div>
            <div className="text-sm font-extrabold text-sky-950 tabular-nums">
              {safety.durabilityPct}% · {safety.performancePct}% · {safety.reliabilityPct}%
            </div>
          </div>
        </div>

        {!canProceed && (
          <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-2.5 text-xs sm:text-sm font-bold text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              {remainingBudget < 0
                ? 'Chi phí lắp ráp và bảo trì đang vượt quá ngân sách! Hãy hạ phân khúc một số bộ phận phụ để giữ dự phòng vận hành.'
                : 'Thiếu điện năng nghiêm trọng! Hãy nâng cấp bộ phận nguồn điện.'}
            </span>
          </div>
        )}
      </div>

      {/* Main Assembly Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Equipment Schematic + Subsystem Slots */}
        <div className="lg:col-span-5 bg-white border-2 border-sky-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <h2 className="text-lg font-bold text-sky-950 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              <span>Cấu trúc {mission.title.vi}</span>
            </h2>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDropZoneHover(true);
            }}
            onDragLeave={() => setDropZoneHover(false)}
            onDrop={(e) => {
              e.preventDefault();
              const transferred = e.dataTransfer.getData('text/plain');
              handleDropOnSchematic(transferred || undefined);
            }}
            className={`relative h-56 w-full rounded-2xl border-2 flex items-center justify-center p-3 transition-all ${
              dropZoneHover
                ? 'border-amber-400 ring-4 ring-amber-200 bg-amber-50'
                : 'border-sky-100 bg-gradient-to-b from-sky-100/70 via-sky-50 to-amber-50/60'
            }`}
          >
            <EquipmentSchematicSvg
              missionId={mission.id}
              activeSubsystemId={activeBlueprint.id}
            />
            <div className="pointer-events-none absolute bottom-1.5 inset-x-3 text-center text-[11px] font-extrabold text-sky-800/85 bg-white/80 rounded-lg py-0.5">
              {dropZoneHover
                ? `Thả để lắp ngay vào cụm "${activeBlueprint.name}"`
                : 'Kéo thẻ linh kiện bên phải thả vào sơ đồ hoặc bấm Chọn'}
            </div>
          </div>

          {/* Subsystem Selector */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-sky-800">
              Chọn bộ phận để cấu hình ({subsystems.length} cụm):
            </div>
            {subsystems.map((sub) => {
              const rt = session.subsystems[sub.id];
              const equippedPart = rt ? getPartById(rt.partId) : undefined;
              const isSelected = activeBlueprint.id === sub.id;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveSubsystemId(sub.id);
                    setBlockedPartNotice(null);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 shadow-xs'
                      : 'bg-white border-sky-200 hover:border-sky-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-sky-950 truncate">{sub.name}</div>
                    <div className="text-xs font-semibold text-sky-700 truncate">
                      {equippedPart ? equippedPart.name : 'Chưa chọn'}
                    </div>
                  </div>
                  {equippedPart && (
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-extrabold shrink-0 ${
                        equippedPart.tier === 'premium'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : equippedPart.tier === 'standard'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-sky-100 text-sky-800 border border-sky-300'
                      }`}
                    >
                      {PART_TIER_LABELS[equippedPart.tier]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: 3-Tier Part Choices + Compatibility Guard */}
        <div className="lg:col-span-7 bg-white border-2 border-sky-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-sky-100 space-y-1">
            <h2 className="text-lg font-bold text-sky-950 font-display flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              <span>{activeBlueprint.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-800/85 font-medium">
              {activeBlueprint.role}
            </p>
            {activeBlueprint.affectedFunctions.length > 0 && (
              <div className="text-xs font-bold text-sky-700">
                Chức năng phụ thuộc: {activeBlueprint.affectedFunctions.join(' · ')}
              </div>
            )}
          </div>

          {blockedPartNotice && (
            <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-800 animate-in fade-in">
              <Ban className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{blockedPartNotice}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-xs font-extrabold text-sky-800 flex items-center gap-1.5">
              <GripHorizontal className="w-4 h-4 text-sky-600" />
              <span>Kéo linh kiện thả vào sơ đồ bên trái hoặc bấm Chọn:</span>
            </div>
            {candidateParts.map((part) => {
              const isSelected = session.subsystems[activeBlueprint.id]?.partId === part.id;
              return (
                <div
                  key={part.id}
                  draggable={!isSelected}
                  onDragStart={(e) => {
                    setDragPartId(part.id);
                    e.dataTransfer.setData('text/plain', part.id);
                  }}
                  onDragEnd={() => {
                    setDragPartId(null);
                    setDropZoneHover(false);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                      : 'bg-sky-50/40 border-sky-200 hover:border-sky-400 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-[200px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                            part.tier === 'premium'
                              ? 'bg-amber-200 text-amber-950'
                              : part.tier === 'standard'
                              ? 'bg-emerald-200 text-emerald-950'
                              : 'bg-sky-200 text-sky-950'
                          }`}
                        >
                          {PART_TIER_LABELS[part.tier]}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-sky-950">
                          {part.name}
                        </h3>
                      </div>
                      <p className="text-xs text-sky-900/80 font-medium">{part.shortDesc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPart(part)}
                      className={`min-h-10 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      <span>{isSelected ? 'Đang chọn' : `Chọn (${part.purchaseCost} tr$)`}</span>
                    </button>
                  </div>

                  {/* Key Engineering Attributes */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-sky-100">
                      <span className="text-sky-600 font-bold block">Giá mua</span>
                      <span className="font-extrabold text-sky-950 tabular-nums">{part.purchaseCost} tr$</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-sky-100">
                      <span className="text-sky-600 font-bold block">Bảo trì</span>
                      <span className="font-extrabold text-sky-950 tabular-nums">{part.maintenanceCost} tr$</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-sky-100">
                      <span className="text-sky-600 font-bold block">Độ bền</span>
                      <span className="font-extrabold text-sky-950 tabular-nums">{part.durability}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-sky-100">
                      <span className="text-sky-600 font-bold block">Hiệu suất</span>
                      <span className="font-extrabold text-sky-950 tabular-nums">{part.performance}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-sky-100">
                      <span className="text-sky-600 font-bold block">Độ tin cậy</span>
                      <span className="font-extrabold text-sky-950 tabular-nums">{part.reliability}%</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-sky-800">
                    Đánh đổi kỹ thuật: {part.tradeoffNote}
                  </div>
                </div>
              );
            })}

            {/* Incompatible Part Guard */}
            {showIncompatibleDecoy && (
              <div
                draggable
                onDragStart={(e) => {
                  setDragPartId(incompatibleDecoy.id);
                  e.dataTransfer.setData('text/plain', incompatibleDecoy.id);
                }}
                onDragEnd={() => {
                  setDragPartId(null);
                  setDropZoneHover(false);
                }}
                className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/60 space-y-2 cursor-grab active:cursor-grabbing"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-rose-200 text-rose-900 text-xs font-extrabold">
                        Không tương thích
                      </span>
                      <span className="text-sm font-extrabold text-rose-950">
                        {incompatibleDecoy.name}
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 font-medium">
                      {incompatibleDecoy.shortDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPart(incompatibleDecoy)}
                    className="min-h-10 px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Không lắp được ({incompatibleDecoy.purchaseCost} tr$)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
