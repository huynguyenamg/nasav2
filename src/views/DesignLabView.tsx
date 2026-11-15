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
  INCOMPATIBLE_DECOY_PARTS,
  applyAssemblyPartSelection,
  canCompleteInitialAssembly,
  evaluateSystemSafety,
  getPartById,
  getPartText,
  getPartsForSubsystem,
  getSubsystemText,
  getSubsystemsForMission,
} from '../data/equipmentSystems';
import { getDifficultyText, getPartTierText } from '../services/localization';
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
  lang: Language;
}> = ({ missionId, activeSubsystemId, lang }) => {
  if (missionId === 'mission_02_earth_satellite') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        <path d="M20 210 Q210 155 400 210" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
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
        <line x1="40" y1="105" x2="380" y2="105" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
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
        <circle
          cx="295"
          cy="76"
          r="12"
          fill={activeSubsystemId === 'iss_comms' ? '#fde047' : '#cbd5e1'}
          stroke="#0284c7"
          strokeWidth="2.5"
        />
        <text x="210" y="111" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          {lang === 'en' ? 'ISS STATION' : 'TRẠM ISS'}
        </text>
      </svg>
    );
  }

  if (missionId === 'mission_04_robotic_arm') {
    return (
      <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
        <rect x="35" y="138" width="90" height="44" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
        <circle
          cx="100"
          cy="142"
          r="14"
          fill={activeSubsystemId === 'arm_shoulder' ? '#fde047' : '#0ea5e9'}
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        <line x1="100" y1="142" x2="205" y2="68" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
        <line x1="100" y1="142" x2="205" y2="68" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
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
        <line x1="205" y1="68" x2="318" y2="122" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
        <line x1="205" y1="68" x2="318" y2="122" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
        <circle
          cx="318"
          cy="122"
          r="15"
          fill={activeSubsystemId === 'arm_wrist' ? '#fde047' : '#10b981'}
          stroke="#0c4a6e"
          strokeWidth="3"
        />
        <text x="210" y="196" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0c4a6e">
          {lang === 'en' ? 'CANADARM2 ROBOTIC ARM' : 'CÁNH TAY ROBOT CANADARM2'}
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
        <ellipse
          cx="265"
          cy="110"
          rx="14"
          ry="30"
          fill={activeSubsystemId === 'hst_optics' ? '#34d399' : '#bae6fd'}
          stroke="#0369a1"
          strokeWidth="3"
        />
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

  return (
    <svg viewBox="0 0 420 220" className="w-full h-full max-w-md">
      <line x1="20" y1="196" x2="400" y2="196" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
      <rect x="120" y="92" width="168" height="62" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="3.5" />
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
      <path
        d="M150 66 Q165 50 180 66 Z"
        fill={activeSubsystemId === 'rover_comms' ? '#fde047' : '#e2e8f0'}
        stroke="#0284c7"
        strokeWidth="2.5"
      />
      <line x1="165" y1="66" x2="165" y2="92" stroke="#0284c7" strokeWidth="3" />
      <path
        d="M288 118 L334 94 L354 128"
        fill="none"
        stroke={activeSubsystemId === 'rover_arm' ? '#eab308' : '#10b981'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  lang,
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
  const [blockedPart, setBlockedPart] = useState<EngineeringPart | null>(null);
  const [dragPartId, setDragPartId] = useState<string | null>(null);
  const [dropZoneHover, setDropZoneHover] = useState(false);
  const [proceedBlockedNotice, setProceedBlockedNotice] = useState(false);

  useEffect(() => {
    const first = getSubsystemsForMission(mission.id)[0];
    if (first) setActiveSubsystemId(first.id);
    setBlockedPart(null);
    setDragPartId(null);
    setDropZoneHover(false);
    setProceedBlockedNotice(false);
  }, [mission.id]);

  const activeBlueprint = subsystems.find((s) => s.id === activeSubsystemId) || subsystems[0];
  const activeBpText = getSubsystemText(activeBlueprint, lang);
  const candidateParts = getPartsForSubsystem(activeBlueprint.id);
  const incompatibleDecoy = INCOMPATIBLE_DECOY_PARTS[mission.id];
  const showIncompatibleDecoy =
    incompatibleDecoy && incompatibleDecoy.subsystemId === activeBlueprint.id;

  const safety = evaluateSystemSafety(mission.id, session.subsystems, session.economy, lang);
  const assemblyValidation = canCompleteInitialAssembly(session, lang);
  const { totalSpent, remainingBudget, isOverBudget, overrunAmount, initialBudget } =
    assemblyValidation;
  const diffText = getDifficultyText(session.difficulty, lang);

  useEffect(() => {
    if (!isOverBudget && proceedBlockedNotice) {
      setProceedBlockedNotice(false);
    }
  }, [isOverBudget, proceedBlockedNotice]);

  const blockedPartNotice = blockedPart
    ? (() => {
        const pt = getPartText(blockedPart, lang);
        return lang === 'en'
          ? `Cannot install "${pt.name}": ${pt.incompatibleReason || 'Incompatible with this NASA spacecraft.'}`
          : `Không thể lắp "${pt.name}": ${pt.incompatibleReason || 'Không tương thích với thiết bị này.'}`;
      })()
    : null;

  const handleSelectPart = (part: EngineeringPart) => {
    if (!part.compatibleMissions.includes(mission.id)) {
      sound.playAlert();
      setBlockedPart(part);
      return;
    }

    setBlockedPart(null);
    sound.playEquip();
    onUpdateSession(applyAssemblyPartSelection(session, part));
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

  const hasPowerDeficit = safety.netPowerW < -15;
  const canProceed = assemblyValidation.allowed;

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
              className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'en' ? 'Back' : 'Quay lại'}</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {lang === 'en' ? `Assembly · ${mission.title.en}` : `Lắp Ráp · ${mission.title.vi}`}
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              {diffText.title} ·{' '}
              {lang === 'en'
                ? 'Select component tiers to balance cost, durability, and safety'
                : 'Chọn phân khúc linh kiện cân bằng giữa chi phí, độ bền và an toàn'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (hasPowerDeficit) {
              sound.playAlert();
              return;
            }
            if (isOverBudget) {
              sound.playAlert();
              setProceedBlockedNotice(true);
              return;
            }
            sound.playSuccess();
            onProceedToLaunch();
          }}
          disabled={hasPowerDeficit}
          aria-disabled={!canProceed}
          className={`min-h-11 px-6 py-2.5 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            canProceed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : isOverBudget && !hasPowerDeficit
              ? 'bg-amber-100 hover:bg-amber-200/80 text-amber-950 border border-amber-300'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <span>{lang === 'en' ? 'Continue' : 'Tiếp tục'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Economy + Engineering Telemetry Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>
                  {lang === 'en'
                    ? 'Budget (Includes ops & maintenance)'
                    : 'Ngân sách (Gồm vận hành & bảo trì)'}
                </span>
              </span>
              <span className={`tabular-nums font-bold ${isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                {totalSpent} / {initialBudget} {lang === 'en' ? 'M$' : 'tr$'}
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  isOverBudget ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
                style={{
                  width: `${Math.min(100, (totalSpent / initialBudget) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] font-semibold mt-1 text-slate-700 tabular-nums">
              {!isOverBudget
                ? lang === 'en'
                  ? `Reserve remaining: $${remainingBudget}M`
                  : `Còn dự phòng: ${remainingBudget} triệu $`
                : lang === 'en'
                ? `Over budget by $${overrunAmount}M`
                : `Vượt ngân sách ${overrunAmount} triệu $`}
            </div>
            <div className="text-[11px] font-medium mt-0.5 text-slate-500 tabular-nums">
              {lang === 'en'
                ? `Parts: $${session.economy.partsCost}M · Maint: $${session.economy.maintenanceCost}M · Ops: $${session.economy.operatingCost}M`
                : `Linh kiện: ${session.economy.partsCost} · Bảo trì: ${session.economy.maintenanceCost} · Vận hành: ${session.economy.operatingCost} tr$`}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-sky-600" />
                <span>{lang === 'en' ? 'Power Balance' : 'Cân bằng năng lượng'}</span>
              </span>
              <span className={`tabular-nums font-bold ${safety.netPowerW < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {safety.netPowerW >= 0 ? `+${safety.netPowerW}` : safety.netPowerW} W
              </span>
            </div>
            <div className="text-xs font-medium text-slate-600">
              {safety.netPowerW >= 15
                ? lang === 'en'
                  ? 'Stable power across all subsystems'
                  : 'Nguồn điện ổn định cho toàn bộ hệ thống'
                : safety.netPowerW >= -15
                ? lang === 'en'
                  ? 'Near power threshold — limit simultaneous peak loads'
                  : 'Điện năng sát ngưỡng — hạn chế tải nặng đồng thời'
                : lang === 'en'
                ? 'Critical power deficit — upgrade power subsystem'
                : 'Thiếu điện nghiêm trọng — cần nâng cấp nguồn điện'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'en'
                    ? 'Durability · Performance · Reliability'
                    : 'Độ bền · Hiệu suất · Tin cậy'}
                </span>
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {safety.durabilityPct}% · {safety.performancePct}% · {safety.reliabilityPct}%
            </div>
          </div>
        </div>

        {isOverBudget && (
          <div
            role="alert"
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm transition-colors ${
              proceedBlockedNotice
                ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="font-bold">
                {lang === 'en'
                  ? 'Budget Warning — Adjust Components Before Continuing'
                  : 'Cảnh báo vượt ngân sách — Cần điều chỉnh linh kiện trước khi tiếp tục'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 tabular-nums">
                <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-amber-200">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    {lang === 'en' ? 'Maximum budget' : 'Ngân sách tối đa'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {initialBudget} {lang === 'en' ? 'M$' : 'triệu $'}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-amber-200">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    {lang === 'en' ? 'Current assembly cost' : 'Tổng chi phí lắp ráp hiện tại'}
                  </span>
                  <span className="font-bold text-rose-700">
                    {totalSpent} {lang === 'en' ? 'M$' : 'triệu $'}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-amber-200">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    {lang === 'en' ? 'Over budget by' : 'Số tiền vượt ngân sách'}
                  </span>
                  <span className="font-bold text-rose-700">
                    {overrunAmount} {lang === 'en' ? 'M$' : 'triệu $'}
                  </span>
                </div>
              </div>
              <p className="font-medium leading-relaxed">
                {proceedBlockedNotice
                  ? lang === 'en'
                    ? 'Cannot complete initial assembly while total cost exceeds the maximum budget. Replace expensive parts with Standard or Economy options so spending stays within budget.'
                    : 'Chưa thể hoàn tất lắp ráp khi tổng chi phí vẫn vượt ngân sách tối đa. Hãy thay thế linh kiện đắt tiền bằng lựa chọn Tiêu chuẩn hoặc Tiết kiệm để tổng chi phí không vượt ngân sách.'
                  : lang === 'en'
                  ? 'Assembly does not fail here — swap to Standard or Economy components in any slot until total cost is within budget to continue.'
                  : 'Nhiệm vụ chưa bị tính thua — hãy thay thế linh kiện sang mức Tiêu chuẩn hoặc Tiết kiệm ở các cụm để đưa tổng chi phí về trong mức ngân sách trước khi hoàn tất.'}
              </p>
            </div>
          </div>
        )}

        {safety.netPowerW < -15 && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              {lang === 'en'
                ? 'Critical power deficit. Upgrade the power source subsystem.'
                : 'Thiếu điện năng nghiêm trọng. Hãy nâng cấp bộ phận nguồn điện.'}
            </span>
          </div>
        )}
      </div>

      {/* Main Assembly Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Equipment Schematic + Subsystem Slots */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>
                {lang === 'en' ? `${mission.title.en} Architecture` : `Cấu trúc ${mission.title.vi}`}
              </span>
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
            className={`relative h-56 w-full rounded-xl border flex items-center justify-center p-3 transition-all ${
              dropZoneHover
                ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <EquipmentSchematicSvg
              missionId={mission.id}
              activeSubsystemId={activeBlueprint.id}
              lang={lang}
            />
            <div className="pointer-events-none absolute bottom-1.5 inset-x-3 text-center text-[11px] font-semibold text-slate-700 bg-white/90 rounded-md py-0.5">
              {dropZoneHover
                ? lang === 'en'
                  ? `Drop to install in "${activeBpText.name}"`
                  : `Thả để lắp ngay vào cụm "${activeBpText.name}"`
                : lang === 'en'
                ? 'Drag a component card onto the schematic or click Select'
                : 'Kéo thẻ linh kiện bên phải thả vào sơ đồ hoặc bấm Chọn'}
            </div>
          </div>

          {/* Subsystem Selector */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600">
              {lang === 'en'
                ? `Select subsystem to configure (${subsystems.length} slots):`
                : `Chọn bộ phận để cấu hình (${subsystems.length} cụm):`}
            </div>
            {subsystems.map((sub) => {
              const rt = session.subsystems[sub.id];
              const equippedPart = rt ? getPartById(rt.partId) : undefined;
              const isSelected = activeBlueprint.id === sub.id;
              const subText = getSubsystemText(sub, lang);
              const eqPartText = equippedPart ? getPartText(equippedPart, lang) : null;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveSubsystemId(sub.id);
                    setBlockedPart(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 leading-snug break-words">
                      {subText.name}
                    </div>
                    <div className="text-xs font-medium text-slate-600 leading-snug break-words">
                      {eqPartText ? eqPartText.name : lang === 'en' ? 'Not selected' : 'Chưa chọn'}
                    </div>
                  </div>
                  {equippedPart && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 border ${
                        equippedPart.tier === 'premium'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : equippedPart.tier === 'standard'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {getPartTierText(equippedPart.tier, lang)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: 3-Tier Part Choices + Compatibility Guard */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 space-y-1">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Wrench className="w-5 h-5 text-sky-600" />
              <span>{activeBpText.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {activeBpText.role}
            </p>
            {activeBpText.affectedFunctions.length > 0 && (
              <div className="text-xs font-semibold text-sky-700">
                {lang === 'en' ? 'Dependent functions: ' : 'Chức năng phụ thuộc: '}
                {activeBpText.affectedFunctions.join(' · ')}
              </div>
            )}
          </div>

          {blockedPartNotice && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-800 animate-in fade-in">
              <Ban className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{blockedPartNotice}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <GripHorizontal className="w-4 h-4 text-sky-600" />
              <span>
                {lang === 'en'
                  ? 'Drag a component onto the schematic on the left or click Select:'
                  : 'Kéo linh kiện thả vào sơ đồ bên trái hoặc bấm Chọn:'}
              </span>
            </div>
            {candidateParts.map((part) => {
              const isSelected = session.subsystems[activeBlueprint.id]?.partId === part.id;
              const pText = getPartText(part, lang);
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
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-400'
                      : 'bg-slate-50/50 border-slate-200 hover:border-sky-400 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-[200px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            part.tier === 'premium'
                              ? 'bg-amber-100 text-amber-900'
                              : part.tier === 'standard'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {getPartTierText(part.tier, lang)}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {pText.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{pText.shortDesc}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => handleSelectPart(part)}
                      className={`min-h-10 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60 ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-sky-600 hover:bg-sky-700 text-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      <span>
                        {isSelected
                          ? lang === 'en'
                            ? 'Installed'
                            : 'Đang chọn'
                          : lang === 'en'
                          ? `Select ($${part.purchaseCost}M)`
                          : `Chọn (${part.purchaseCost} tr$)`}
                      </span>
                    </button>
                  </div>

                  {/* Key Engineering Attributes */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 font-medium block">
                        {lang === 'en' ? 'Purchase' : 'Giá mua'}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {part.purchaseCost} {lang === 'en' ? 'M$' : 'tr$'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 font-medium block">
                        {lang === 'en' ? 'Maintenance' : 'Bảo trì'}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {part.maintenanceCost} {lang === 'en' ? 'M$' : 'tr$'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 font-medium block">
                        {lang === 'en' ? 'Durability' : 'Độ bền'}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{part.durability}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 font-medium block">
                        {lang === 'en' ? 'Performance' : 'Hiệu suất'}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{part.performance}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 font-medium block">
                        {lang === 'en' ? 'Reliability' : 'Độ tin cậy'}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{part.reliability}%</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-slate-600">
                    {lang === 'en' ? 'Engineering tradeoff: ' : 'Đánh đổi kỹ thuật: '}
                    {pText.tradeoffNote}
                  </div>
                </div>
              );
            })}

            {/* Incompatible Part Guard */}
            {showIncompatibleDecoy && (() => {
              const decoyText = getPartText(incompatibleDecoy, lang);
              return (
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
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-xs font-semibold">
                          {lang === 'en' ? 'Incompatible' : 'Không tương thích'}
                        </span>
                        <span className="text-sm font-bold text-rose-950">
                          {decoyText.name}
                        </span>
                      </div>
                      <p className="text-xs text-rose-800 font-medium">
                        {decoyText.shortDesc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectPart(incompatibleDecoy)}
                      className="min-h-9 px-3.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4" />
                      <span>
                        {lang === 'en'
                          ? `Incompatible ($${incompatibleDecoy.purchaseCost}M)`
                          : `Không lắp được (${incompatibleDecoy.purchaseCost} tr$)`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
