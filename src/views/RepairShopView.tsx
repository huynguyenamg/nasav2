import React, { useEffect, useState } from 'react';
import {
  CadetProfile,
  EngineeringPart,
  EquipmentSubsystemId,
  Language,
  MissionConfig,
  MissionSessionState,
  SafetyGateReport,
} from '../types/game';
import {
  DIFFICULTY_PROFILES,
  INCOMPATIBLE_DECOY_PARTS,
  PART_TIER_LABELS,
  evaluateSystemSafety,
  getEffectiveSubsystemState,
  getPartById,
  getPartsForSubsystem,
  getRemainingBudget,
  getSubsystemsForMission,
  getTotalEconomySpent,
} from '../data/equipmentSystems';
import { getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { sound } from '../services/sound';
import { NovaVoiceBanner } from '../components/NasaVisualBlocks';
import { CircuitWiringBoard } from '../components/interactive/CircuitWiringBoard';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Coins,
  GripHorizontal,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

interface RepairShopViewProps {
  cadet: CadetProfile;
  lang: Language;
  mission: MissionConfig;
  session: MissionSessionState;
  initialTargetSubsystem?: EquipmentSubsystemId | null;
  onUpdateSession: (session: MissionSessionState) => void;
  onResolved: (xpBonus?: number) => void;
  onReturnToSim: () => void;
}

interface WorkbenchProgress {
  unbolted: boolean;
  stagedMode: 'none' | 'repair_current' | 'swap_part';
  stagedPartId?: string;
  alignAngle: number;
  aligned: boolean;
  wired: boolean;
}

const DEFAULT_PROGRESS: WorkbenchProgress = {
  unbolted: false,
  stagedMode: 'none',
  alignAngle: 26,
  aligned: false,
  wired: false,
};

export const RepairShopView: React.FC<RepairShopViewProps> = ({
  lang,
  mission,
  session,
  initialTargetSubsystem,
  onUpdateSession,
  onResolved,
  onReturnToSim,
}) => {
  const subsystems = getSubsystemsForMission(mission.id);
  const equipmentProfile = getEquipmentProfileByMission(mission.id);

  const firstFaultySub =
    subsystems.find((s) => session.subsystems[s.id]?.status !== 'ok')?.id || subsystems[0]?.id;

  const [activeSubId, setActiveSubId] = useState<EquipmentSubsystemId>(
    initialTargetSubsystem || firstFaultySub
  );
  const [workbenchBySub, setWorkbenchBySub] = useState<Record<string, WorkbenchProgress>>({});
  const [dragPartId, setDragPartId] = useState<string | null>(null);
  const [dropHover, setDropHover] = useState(false);

  const [safetyReport, setSafetyReport] = useState<SafetyGateReport | null>(
    session.preDeployReport
  );
  const [unverifiedPrompt, setUnverifiedPrompt] = useState(false);
  const [actionNotice, setActionNotice] = useState<{
    type: 'ok' | 'warn' | 'error';
    text: string;
  } | null>(null);
  const [trialStage, setTrialStage] = useState<'editing' | 'testing' | 'passed' | 'failed'>('editing');
  const [trialMessage, setTrialMessage] = useState<string>('');
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const target =
      initialTargetSubsystem && subsystems.some((s) => s.id === initialTargetSubsystem)
        ? initialTargetSubsystem
        : subsystems.find((s) => session.subsystems[s.id]?.status !== 'ok')?.id ||
          subsystems[0]?.id;
    setActiveSubId(target);
    setActionNotice(null);
    setUnverifiedPrompt(false);
    setTrialStage('editing');
    setImgFailed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id, initialTargetSubsystem]);

  const activeSub = subsystems.find((s) => s.id === activeSubId) || subsystems[0];
  const activeRaw = session.subsystems[activeSub.id];
  const activeEff = getEffectiveSubsystemState(session, activeSub.id);
  const currentPart = getPartById(activeRaw?.partId || '');
  const candidateParts = getPartsForSubsystem(activeSub.id);
  const decoyPart = INCOMPATIBLE_DECOY_PARTS[mission.id];

  const wb = workbenchBySub[activeSub.id] || DEFAULT_PROGRESS;
  const updateWb = (patch: Partial<WorkbenchProgress>) => {
    setWorkbenchBySub((prev) => ({
      ...prev,
      [activeSub.id]: {
        ...(prev[activeSub.id] || DEFAULT_PROGRESS),
        ...patch,
      },
    }));
  };

  const remainingBudget = getRemainingBudget(session.economy);
  const totalSpent = getTotalEconomySpent(session.economy);
  const diffProfile = DIFFICULTY_PROFILES[session.difficulty];

  const totalFaultCount = subsystems.filter(
    (s) => getEffectiveSubsystemState(session, s.id).status !== 'ok'
  ).length;

  const repairCostForCurrent =
    currentPart?.tier === 'premium' ? 50 : currentPart?.tier === 'standard' ? 40 : 35;

  const isFaultyRaw = Boolean(activeRaw && activeRaw.status !== 'ok');

  const handleUnboltBroken = () => {
    sound.playRepairTool();
    updateWb({
      unbolted: true,
      stagedMode: 'none',
      stagedPartId: undefined,
      alignAngle: 26,
      aligned: false,
      wired: false,
    });
    setActionNotice({
      type: 'ok',
      text: `Đã tháo ${activeSub.name} ra khỏi ngàm! Hãy kéo hoặc chọn linh kiện để lắp và căn chỉnh.`,
    });
  };

  const handleStageCandidate = (mode: 'repair_current' | 'swap_part', candidate?: EngineeringPart) => {
    if (candidate && !candidate.compatibleMissions.includes(mission.id)) {
      sound.playAlert();
      setActionNotice({
        type: 'error',
        text: `Không thể lắp "${candidate.name}": ${
          candidate.incompatibleReason || 'Sai chuẩn kết nối của thiết bị NASA này!'
        }`,
      });
      return;
    }

    if (mode === 'swap_part' && candidate && activeRaw?.partId === candidate.id && !isFaultyRaw) {
      return;
    }

    if (isFaultyRaw && !wb.unbolted) {
      sound.playAlert();
      setActionNotice({
        type: 'warn',
        text: 'Hãy bấm "1. Tháo bộ phận hỏng" khỏi thân thiết bị trước khi lắp linh kiện mới!',
      });
      return;
    }

    sound.playClick();
    updateWb({
      unbolted: true,
      stagedMode: mode,
      stagedPartId: candidate?.id,
      alignAngle: mode === 'repair_current' ? -24 : 28,
      aligned: false,
      wired: false,
    });
    setActionNotice({
      type: 'ok',
      text:
        mode === 'repair_current'
          ? 'Đã vệ sinh & đưa bộ phận vào khe! Hãy xoay góc khớp về 0° rồi nối mạch kiểm tra.'
          : `Đã đưa "${candidate?.name}" vào khe lắp! Hãy xoay căn chỉnh góc khớp về 0° và nối dây kiểm tra.`,
    });
  };

  const handleDropOnBay = (partIdFromDrop?: string) => {
    setDropHover(false);
    const pid = partIdFromDrop || dragPartId;
    setDragPartId(null);
    if (!pid) return;
    if (decoyPart && decoyPart.id === pid) {
      handleStageCandidate('swap_part', decoyPart);
      return;
    }
    const found = candidateParts.find((p) => p.id === pid);
    if (found) {
      handleStageCandidate('swap_part', found);
    }
  };

  const handleCommitAfterWiring = () => {
    if (!activeRaw) return;
    const isRepairCurrent = wb.stagedMode === 'repair_current';
    const newPart = wb.stagedPartId ? getPartById(wb.stagedPartId) : undefined;

    if (isRepairCurrent) {
      sound.playSuccess();
      const restoredHealth = currentPart?.tier === 'economy' ? 86 : 96;
      const nextSession: MissionSessionState = {
        ...session,
        subsystems: {
          ...session.subsystems,
          [activeSub.id]: {
            ...activeRaw,
            health: restoredHealth,
            status: 'ok',
            faultTitle: undefined,
            faultCause: undefined,
            diagnosed: true,
          },
        },
        economy: {
          ...session.economy,
          repairCost: session.economy.repairCost + repairCostForCurrent,
        },
        diagnosisAttempts: session.diagnosisAttempts + 1,
        diagnosisCorrect: session.diagnosisCorrect + (isFaultyRaw ? 1 : 0),
        preDeployReport: null,
      };
      onUpdateSession(nextSession);
      setSafetyReport(null);
      setUnverifiedPrompt(false);
      updateWb({
        unbolted: false,
        stagedMode: 'none',
        stagedPartId: undefined,
        aligned: true,
        wired: true,
      });
      setActionNotice({
        type: 'ok',
        text: `Đã sửa & khóa mạch ${activeSub.name} thành công (Phí sửa: ${repairCostForCurrent} tr$)! Hãy bấm Kiểm tra an toàn trước khi chạy thử.`,
      });
      return;
    }

    if (newPart) {
      const tradeInCredit = currentPart ? Math.round(currentPart.purchaseCost * 0.45) : 0;
      const swapCost = Math.max(25, newPart.purchaseCost - tradeInCredit);
      const maintDelta = newPart.maintenanceCost - (currentPart?.maintenanceCost || 0);
      const wasBlockedOnly =
        !isFaultyRaw && Boolean(activeEff.blockedBy || activeEff.degradedBy);

      sound.playSuccess();
      const nextSession: MissionSessionState = {
        ...session,
        subsystems: {
          ...session.subsystems,
          [activeSub.id]: {
            subsystemId: activeSub.id,
            partId: newPart.id,
            health: 100,
            status: 'ok',
            diagnosed: true,
          },
        },
        economy: {
          ...session.economy,
          partsCost: session.economy.partsCost + swapCost,
          maintenanceCost: Math.max(0, session.economy.maintenanceCost + maintDelta),
        },
        diagnosisAttempts: session.diagnosisAttempts + 1,
        diagnosisCorrect: session.diagnosisCorrect + (isFaultyRaw ? 1 : 0),
        preDeployReport: null,
      };
      onUpdateSession(nextSession);
      setSafetyReport(null);
      setUnverifiedPrompt(false);
      updateWb({
        unbolted: false,
        stagedMode: 'none',
        stagedPartId: undefined,
        aligned: true,
        wired: true,
      });

      if (wasBlockedOnly) {
        setActionNotice({
          type: 'warn',
          text: `Đã lắp & thông mạch "${newPart.name}" (${swapCost} tr$), nhưng bộ phận này trước đó chỉ bị gián tiếp bởi ${
            activeEff.blockedBy || activeEff.degradedBy
          }. Hãy sửa hệ thống gốc!`,
        });
      } else {
        setActionNotice({
          type: 'ok',
          text: `Đã lắp, căn chỉnh và thông mạch "${newPart.name}" (${PART_TIER_LABELS[newPart.tier]} · Phí đổi: ${swapCost} tr$).`,
        });
      }
    }
  };

  const handleRunSafetyCheck = () => {
    sound.playClick();
    const report = evaluateSystemSafety(mission.id, session.subsystems, session.economy);
    setSafetyReport(report);
    setUnverifiedPrompt(false);

    onUpdateSession({
      ...session,
      safetyChecksRun: session.safetyChecksRun + 1,
      preDeployReport: report,
    });

    if (report.status === 'READY') {
      sound.playSuccess();
    } else {
      sound.playAlert();
    }
  };

  const executeTestRun = (ignoredWarning: boolean) => {
    setUnverifiedPrompt(false);
    setTrialStage('testing');
    sound.playRepairTool();

    const freshReport = evaluateSystemSafety(mission.id, session.subsystems, session.economy);

    setTimeout(() => {
      if (freshReport.status === 'FAILED') {
        sound.playAlert();
        const penalty = diffProfile.failurePenaltyCost;
        onUpdateSession({
          ...session,
          economy: {
            ...session.economy,
            failurePenalty: session.economy.failurePenalty + penalty,
          },
          safetyWarningsIgnored: session.safetyWarningsIgnored + (ignoredWarning ? 1 : 0),
          preDeployReport: freshReport,
        });
        setTrialStage('failed');
        setTrialMessage(
          `${freshReport.summary} Chạy thử thất bại gây thiệt hại thêm ${penalty} tr$.`
        );
        return;
      }

      if (freshReport.status === 'WARNING' && ignoredWarning) {
        onUpdateSession({
          ...session,
          safetyWarningsIgnored: session.safetyWarningsIgnored + 1,
          preDeployReport: freshReport,
        });
      }

      sound.playSuccess();
      setTrialStage('passed');
      setTrialMessage(
        freshReport.status === 'READY'
          ? 'Thiết bị đạt chuẩn an toàn và hiệu suất! Mọi hệ thống phụ thuộc đã phục hồi.'
          : 'Thiết bị đủ điều kiện vận hành có kiểm soát (lưu ý cảnh báo vàng trên bảng an toàn).'
      );
      onResolved(freshReport.status === 'READY' ? 40 : 15);
    }, 700);
  };

  const handleTestRunClick = () => {
    if (!safetyReport) {
      sound.playAlert();
      setUnverifiedPrompt(true);
      return;
    }
    executeTestRun(safetyReport.status === 'WARNING');
  };

  const previewImg = imgFailed
    ? equipmentProfile.fallbackImageUrl
    : equipmentProfile.heroImageUrl;

  const voiceHint =
    isFaultyRaw && activeRaw?.faultTitle
      ? `Phát hiện lỗi: ${activeRaw.faultTitle}. Hãy tháo bộ phận hỏng, kéo linh kiện vào khe, xoay khớp về 0 độ và nối mạch kiểm tra!`
      : activeEff.blockedBy
      ? `${activeSub.name} đang bị khóa do ${activeEff.blockedBy} bị hỏng. Hãy sửa hệ thống gốc trước!`
      : `Kéo linh kiện mới vào ảnh thiết bị để thay thế, rồi bấm Kiểm tra an toàn trước khi quay lại nhiệm vụ nhé!`;

  if (trialStage === 'passed' || trialStage === 'failed') {
    const isWin = trialStage === 'passed';
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
        <div
          className={`rounded-3xl bg-white border-2 p-6 sm:p-8 shadow-md space-y-5 text-center ${
            isWin ? 'border-emerald-300' : 'border-rose-300'
          }`}
        >
          <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-sky-100 bg-sky-50">
            <img
              src={
                isWin
                  ? '/src/assets/images/sunny_robot_celebration_1794563132184.jpg'
                  : '/src/assets/images/sunny_robot_fix_retry_1794563132553.jpg'
              }
              alt={trialMessage}
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-sky-950 font-display">
            {isWin ? 'Chạy thử thành công!' : 'Chạy thử chưa đạt chuẩn!'}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-sky-900 max-w-xl mx-auto">
            {trialMessage}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {isWin ? (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onReturnToSim();
                }}
                className="min-h-12 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Quay lại vận hành thiết bị</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTrialStage('editing');
                }}
                className="min-h-12 px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sky-950 font-extrabold text-base flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Wrench className="w-5 h-5" />
                <span>Quay lại sửa tiếp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-5 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              sound.stopSpeech();
              onReturnToSim();
            }}
            className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại nhiệm vụ</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-sky-950 font-display">
              Xưởng Tháo Lắp & Sửa Chữa: {mission.title.vi}
            </h1>
            <p className="text-xs sm:text-sm text-sky-800 font-semibold">
              {diffProfile.title} · Còn {totalFaultCount} hệ thống cần xử lý
            </p>
          </div>
        </div>

        {/* Live Budget */}
        <div
          className={`min-h-11 px-4 py-2 rounded-2xl border-2 text-sm font-extrabold flex items-center gap-2 ${
            remainingBudget < 0
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : remainingBudget < 60
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-sky-200 text-sky-950'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="tabular-nums">
            Ngân sách còn: {remainingBudget} tr$ (Đã chi {totalSpent}/{session.economy.initialBudget} tr$)
          </span>
        </div>
      </div>

      {/* Voice Clue */}
      <NovaVoiceBanner speechText={voiceHint} lang={lang} accent="amber" compact />

      {/* Main 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT: Interactive Drop Target NASA Photo + Subsystem List */}
        <div className="lg:col-span-4 rounded-3xl bg-white border-2 border-sky-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-sky-950 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>1. Sơ đồ thiết bị & Thả linh kiện</span>
            </h2>
            <span className="text-xs font-bold text-sky-700">{subsystems.length} cụm</span>
          </div>

          {/* Drop Zone NASA Photo with Clickable Pins */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDropHover(true);
            }}
            onDragLeave={() => setDropHover(false)}
            onDrop={(e) => {
              e.preventDefault();
              const transferred = e.dataTransfer.getData('text/plain');
              handleDropOnBay(transferred || undefined);
            }}
            className={`relative rounded-2xl overflow-hidden border-2 h-52 transition-all ${
              dropHover
                ? 'border-amber-400 ring-4 ring-amber-200 bg-amber-50'
                : 'border-sky-200 bg-sky-50'
            }`}
          >
            <img
              src={previewImg}
              alt={equipmentProfile.equipmentName.vi}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />

            {subsystems.map((sub) => {
              const eff = getEffectiveSubsystemState(session, sub.id);
              const isSelected = activeSub.id === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveSubId(sub.id);
                    setActionNotice(null);
                  }}
                  style={{
                    left: `${sub.hotspotCoords.x}%`,
                    top: `${sub.hotspotCoords.y}%`,
                  }}
                  title={sub.name}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer transition-transform ${
                    eff.status === 'failed'
                      ? 'bg-rose-500 text-white'
                      : eff.status === 'degraded'
                      ? 'bg-amber-400 text-sky-950'
                      : 'bg-emerald-500 text-white'
                  } ${isSelected ? 'scale-125 ring-4 ring-sky-400 z-20' : 'hover:scale-110 z-10'}`}
                >
                  {eff.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : eff.status === 'degraded' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <AlertOctagon className="w-4 h-4" />
                  )}
                </button>
              );
            })}

            <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-white/90 text-[11px] font-extrabold text-sky-950 text-center">
              {dropHover
                ? `Thả linh kiện vào vị trí "${activeSub.name}"`
                : 'Kéo thẻ linh kiện ở giữa thả vào đây hoặc bấm chọn bên dưới'}
            </div>
          </div>

          {/* Clickable Subsystem List */}
          <div className="space-y-2">
            {subsystems.map((sub) => {
              const raw = session.subsystems[sub.id];
              const eff = getEffectiveSubsystemState(session, sub.id);
              const part = getPartById(raw?.partId || '');
              const isSelected = activeSub.id === sub.id;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveSubId(sub.id);
                    setActionNotice(null);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 shadow-sm'
                      : 'bg-white border-sky-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-sky-950">{sub.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-extrabold ${
                        eff.status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : eff.status === 'degraded'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {eff.status === 'failed'
                        ? `Hỏng (${eff.health}%)`
                        : eff.status === 'degraded'
                        ? `Suy giảm (${eff.health}%)`
                        : `Tốt (${eff.health}%)`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-sky-800 flex items-center justify-between gap-2">
                    <span className="truncate">{part?.name}</span>
                    <span className="text-sky-600 shrink-0">
                      {part ? PART_TIER_LABELS[part.tier] : ''}
                    </span>
                  </div>
                  {(eff.blockedBy || eff.degradedBy) && (
                    <div className="text-[11px] font-bold text-rose-700">
                      Bị ảnh hưởng từ: {eff.blockedBy || eff.degradedBy}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Physical Remove -> Stage/Drag -> Align Angle -> Wire Continuity Test */}
        <div className="lg:col-span-5 rounded-3xl bg-white border-2 border-sky-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-sky-950 font-display flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              <span>2. Xử lý trực tiếp: {activeSub.name}</span>
            </h2>
            <p className="text-xs text-sky-800 font-semibold mt-0.5">{activeSub.role}</p>
          </div>

          {/* Step 1: Fault Status + Unbolt */}
          <div
            className={`p-3.5 rounded-2xl border-2 space-y-2 ${
              isFaultyRaw
                ? 'bg-rose-50 border-rose-300'
                : activeEff.status !== 'ok'
                ? 'bg-amber-50 border-amber-300'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            {isFaultyRaw ? (
              <>
                <div className="text-sm font-extrabold text-rose-900">
                  Lỗi gốc: {activeRaw?.faultTitle}
                </div>
                <p className="text-xs font-semibold text-rose-800">{activeRaw?.faultCause}</p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {!wb.unbolted ? (
                    <button
                      type="button"
                      onClick={handleUnboltBroken}
                      className="min-h-10 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Bước 1: Tháo bộ phận hỏng ra khỏi khung</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStageCandidate('repair_current')}
                      className="min-h-10 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Bước 2: Bảo dưỡng & gắn lại bộ phận cũ ({repairCostForCurrent} tr$)</span>
                    </button>
                  )}
                </div>
              </>
            ) : activeEff.blockedBy || activeEff.degradedBy ? (
              <>
                <div className="text-sm font-extrabold text-amber-950">
                  Linh kiện này đang tốt, nhưng bị ảnh hưởng dây chuyền!
                </div>
                <p className="text-xs font-semibold text-amber-900">
                  Nguyên nhân từ: <strong>{activeEff.blockedBy || activeEff.degradedBy}</strong>.
                  Không cần tốn tiền thay thế ở đây — hãy chọn đúng bộ phận gốc bên trái để tháo sửa!
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-extrabold text-emerald-900">
                  Hệ thống này đang hoạt động ổn định ({activeRaw?.health}%).
                </div>
                <p className="text-xs font-semibold text-emerald-800">
                  Chức năng phụ thuộc: {activeSub.affectedFunctions.join(' · ')}.
                </p>
              </>
            )}
          </div>

          {/* Physical Stage 3 & 4: Align Connector + Wire Continuity Test */}
          {wb.stagedMode !== 'none' && (
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-400 space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                    <RotateCw className="w-4 h-4 text-sky-600" />
                    <span>Bước 3: Xoay căn chỉnh góc khớp nối về 0° (±6°)</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums ${
                      Math.abs(wb.alignAngle) <= 6
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-200 text-amber-950'
                    }`}
                  >
                    {wb.alignAngle > 0 ? `+${wb.alignAngle}°` : `${wb.alignAngle}°`}
                  </span>
                </div>

                {/* Rotating Alignment Gauge */}
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0 bg-white rounded-2xl border border-sky-200">
                    <circle cx="40" cy="40" r="28" fill="none" stroke="#bae6fd" strokeWidth="4" />
                    <line x1="40" y1="8" x2="40" y2="20" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                    <g transform={`rotate(${wb.alignAngle} 40 40)`}>
                      <line x1="40" y1="40" x2="40" y2="14" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="40" cy="40" r="5" fill="#0284c7" />
                    </g>
                  </svg>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    value={wb.alignAngle}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const isOk = Math.abs(val) <= 6;
                      if (isOk && !wb.aligned) sound.playEquip();
                      updateWb({ alignAngle: val, aligned: isOk });
                    }}
                    className="flex-1 accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Step 4: Quick 2-Wire Continuity Test */}
              {Math.abs(wb.alignAngle) <= 6 ? (
                <CircuitWiringBoard
                  title="Bước 4: Nối dây kiểm tra thông mạch & chốt khóa"
                  instruction={`Nối đúng Cổng Nguồn và Cổng Tín hiệu cho ${activeSub.name} rồi bật công tắc nguồn để hoàn tất lắp đặt.`}
                  leftNodes={[
                    { id: 'pwr_in', label: 'Nguồn Bus chính', color: '#f59e0b' },
                    { id: 'sig_in', label: 'Cáp dữ liệu trung tâm', color: '#0ea5e9' },
                  ]}
                  rightNodes={[
                    { id: 'sig_port', label: 'Chân nhận lệnh', color: '#0ea5e9' },
                    { id: 'pwr_port', label: 'Chân cấp nguồn', color: '#f59e0b' },
                  ]}
                  expectedConnections={[
                    {
                      fromId: 'pwr_in',
                      toId: 'pwr_port',
                      errorHint: 'Nhầm cực! Nguồn Bus chính phải nối vào Chân cấp nguồn.',
                    },
                    {
                      fromId: 'sig_in',
                      toId: 'sig_port',
                      errorHint: 'Sai cổng! Cáp dữ liệu phải nối vào Chân nhận lệnh.',
                    },
                  ]}
                  onSuccess={handleCommitAfterWiring}
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-100/80 text-xs font-bold text-amber-950">
                  Hãy xoay thanh góc khớp về gần 0° để mở cổng đấu dây kiểm tra!
                </div>
              )}
            </div>
          )}

          {/* Action Feedback */}
          {actionNotice && (
            <div
              className={`p-3 rounded-2xl border-2 text-xs font-bold ${
                actionNotice.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : actionNotice.type === 'warn'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {actionNotice.text}
            </div>
          )}

          {/* Draggable 3-Tier Replacement Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5">
              <GripHorizontal className="w-4 h-4 text-sky-600" />
              <span>Kéo linh kiện thả vào ảnh thiết bị bên trái hoặc bấm Lắp:</span>
            </div>

            {candidateParts.map((part) => {
              const isEquipped = activeRaw?.partId === part.id && !isFaultyRaw;
              const isStaged = wb.stagedPartId === part.id;
              const tradeInCredit = currentPart ? Math.round(currentPart.purchaseCost * 0.45) : 0;
              const swapCost = Math.max(25, part.purchaseCost - tradeInCredit);

              return (
                <div
                  key={part.id}
                  draggable={!isEquipped}
                  onDragStart={(e) => {
                    setDragPartId(part.id);
                    e.dataTransfer.setData('text/plain', part.id);
                  }}
                  onDragEnd={() => {
                    setDragPartId(null);
                    setDropHover(false);
                  }}
                  className={`p-3.5 rounded-2xl border-2 space-y-2 transition-all ${
                    isStaged
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : isEquipped
                      ? 'bg-sky-50 border-sky-500'
                      : 'bg-white border-sky-200 hover:border-sky-400 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg text-[11px] font-extrabold mb-1 ${
                          part.tier === 'premium'
                            ? 'bg-amber-100 text-amber-900'
                            : part.tier === 'standard'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {PART_TIER_LABELS[part.tier]}
                      </span>
                      <h3 className="text-sm font-extrabold text-sky-950">{part.name}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-sky-950 tabular-nums">
                        {isEquipped ? `${part.purchaseCost} tr$` : `Đổi: ${swapCost} tr$`}
                      </div>
                      <div className="text-[11px] font-semibold text-sky-700 tabular-nums">
                        Bảo trì {part.maintenanceCost} tr$
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-sky-900/85">{part.shortDesc}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-sky-800 tabular-nums">
                      <span>Bền: {part.durability}%</span>
                      <span>· Hiệu suất: {part.performance}%</span>
                      <span>· Tin cậy: {part.reliability}%</span>
                    </div>

                    <button
                      type="button"
                      disabled={isEquipped}
                      onClick={() => handleStageCandidate('swap_part', part)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                        isEquipped
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : isStaged
                          ? 'bg-amber-500 text-white'
                          : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                      }`}
                    >
                      {isEquipped ? 'Đang gắn tốt' : isStaged ? 'Đang chờ căn chỉnh' : 'Đưa vào khe lắp'}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Draggable Incompatible Decoy Warning Card */}
            {decoyPart && decoyPart.subsystemId === activeSub.id && (
              <div
                draggable
                onDragStart={(e) => {
                  setDragPartId(decoyPart.id);
                  e.dataTransfer.setData('text/plain', decoyPart.id);
                }}
                onDragEnd={() => {
                  setDragPartId(null);
                  setDropHover(false);
                }}
                className="p-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50/70 space-y-2 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-extrabold">
                    <Ban className="w-3.5 h-3.5" />
                    <span>Không tương thích</span>
                  </span>
                  <span className="text-xs font-bold text-rose-800 tabular-nums">
                    {decoyPart.purchaseCost} tr$ (Rẻ nhưng sai chuẩn)
                  </span>
                </div>
                <div className="text-sm font-extrabold text-rose-950">{decoyPart.name}</div>
                <p className="text-xs font-semibold text-rose-900">{decoyPart.shortDesc}</p>
                <button
                  type="button"
                  onClick={() => handleStageCandidate('swap_part', decoyPart)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-950 text-xs font-extrabold cursor-pointer"
                >
                  Thử lắp linh kiện sai chuẩn
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Economy Summary + Pre-Deploy Safety Check Gate + Test Run */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 shadow-sm space-y-2.5">
            <div className="text-sm font-extrabold text-sky-950 font-display flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Chi phí sứ mệnh</span>
            </div>
            <div className="space-y-1 text-xs font-semibold text-sky-900 tabular-nums">
              <div className="flex justify-between">
                <span>Linh kiện lắp đặt:</span>
                <span>{session.economy.partsCost} tr$</span>
              </div>
              <div className="flex justify-between">
                <span>Sửa chữa kỹ thuật:</span>
                <span>{session.economy.repairCost} tr$</span>
              </div>
              <div className="flex justify-between">
                <span>Bảo trì & Vận hành:</span>
                <span>
                  {session.economy.maintenanceCost + session.economy.operatingCost} tr$
                </span>
              </div>
              {session.economy.failurePenalty > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Phạt sự cố chạy thử:</span>
                  <span>{session.economy.failurePenalty} tr$</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-sky-100 flex justify-between font-extrabold text-sky-950">
                <span>Tổng / Ngân sách:</span>
                <span>
                  {totalSpent} / {session.economy.initialBudget} tr$
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-extrabold text-sky-950 font-display flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>3. Kiểm tra an toàn</span>
            </h2>

            <button
              type="button"
              onClick={handleRunSafetyCheck}
              className="w-full min-h-11 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Kiểm tra trước chạy thử</span>
            </button>

            {safetyReport && (
              <div className="space-y-2">
                <div
                  className={`p-3 rounded-2xl border-2 text-xs font-extrabold ${
                    safetyReport.status === 'READY'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : safetyReport.status === 'WARNING'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {safetyReport.summary}
                </div>

                <div className="space-y-1.5">
                  {safetyReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-2 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-extrabold text-sky-950">
                        <span>{chk.label}</span>
                        <span
                          className={
                            chk.level === 'ok'
                              ? 'text-emerald-600'
                              : chk.level === 'warn'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }
                        >
                          {chk.level === 'ok'
                            ? 'Đạt'
                            : chk.level === 'warn'
                            ? 'Cảnh báo'
                            : 'Lỗi'}
                        </span>
                      </div>
                      <p className="text-sky-800 font-medium">{chk.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unverifiedPrompt && (
              <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 text-xs">
                <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Bạn chưa bấm Kiểm tra an toàn!</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleRunSafetyCheck}
                    className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold cursor-pointer"
                  >
                    Kiểm tra ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => executeTestRun(true)}
                    className="w-full py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-extrabold cursor-pointer"
                  >
                    Cứ chạy thử (Rủi ro)
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={trialStage === 'testing'}
              onClick={handleTestRunClick}
              className="w-full min-h-12 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>
                {trialStage === 'testing'
                  ? 'Đang chạy thử hệ thống...'
                  : 'Chạy thử & Trở về nhiệm vụ'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
