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
  evaluateBudgetStatusAndFailure,
  evaluateSystemSafety,
  getEffectiveSubsystemState,
  getFaultText,
  getPartById,
  getPartText,
  getPartsForSubsystem,
  getRemainingBudget,
  getSubsystemText,
  getSubsystemsForMission,
  getTotalEconomySpent,
} from '../data/equipmentSystems';
import { getDifficultyText, getPartTierText } from '../services/localization';
import { getPrimaryDeviceAsset } from '../data/nasaMediaRegistry';
import { getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { sound } from '../services/sound';
import { CircuitWiringBoard } from '../components/interactive/CircuitWiringBoard';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Coins,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Wrench,
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
  const isEn = lang === 'en';
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

  useEffect(() => {
    if (safetyReport) {
      setSafetyReport(evaluateSystemSafety(mission.id, session.subsystems, session.economy, lang));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const activeSub = subsystems.find((s) => s.id === activeSubId) || subsystems[0];
  const activeSubText = getSubsystemText(activeSub, lang);
  const activeSubVi = getSubsystemText(activeSub, 'vi');
  const activeSubEn = getSubsystemText(activeSub, 'en');
  const activeRaw = session.subsystems[activeSub.id];
  const activeEff = getEffectiveSubsystemState(session, activeSub.id, lang);
  const activeFaultText = getFaultText(activeSub.id, activeRaw, lang);
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
  const diffText = getDifficultyText(session.difficulty, lang);

  const totalFaultCount = subsystems.filter(
    (s) => getEffectiveSubsystemState(session, s.id, lang).status !== 'ok'
  ).length;

  const repairCostForCurrent =
    currentPart?.tier === 'premium' ? 50 : currentPart?.tier === 'standard' ? 40 : 35;

  const isFaultyRaw = Boolean(activeRaw && activeRaw.status !== 'ok');
  const isBudgetFailed = Boolean(session.budgetFailure?.failed);
  const unitM = isEn ? 'M$' : 'tr$';

  const handleUnboltBroken = () => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
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
      text: isEn
        ? `Unbolted ${activeSubText.name}. Choose to service the existing unit or stage a replacement part below.`
        : `Đã tháo ${activeSubText.name} khỏi khung. Hãy chọn bảo dưỡng bộ phận cũ hoặc chọn linh kiện thay thế bên dưới.`,
    });
  };

  const handleStageCandidate = (mode: 'repair_current' | 'swap_part', candidate?: EngineeringPart) => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    if (candidate && !candidate.compatibleMissions.includes(mission.id)) {
      const candText = getPartText(candidate, lang);
      sound.playAlert();
      setActionNotice({
        type: 'error',
        text: isEn
          ? `Cannot install "${candText.name}": ${
              candText.incompatibleReason || 'Incompatible interface for this NASA spacecraft.'
            }`
          : `Không thể lắp "${candText.name}": ${
              candText.incompatibleReason || 'Sai chuẩn kết nối của thiết bị NASA này.'
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
        text: isEn
          ? 'Unbolt the damaged unit first before installing a replacement part.'
          : 'Hãy bấm "Tháo bộ phận hỏng" trước khi lắp linh kiện mới.',
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
    const candName = candidate ? getPartText(candidate, lang).name : '';
    setActionNotice({
      type: 'ok',
      text:
        mode === 'repair_current'
          ? isEn
            ? 'Cleaned & seated unit. Align joint angle to 0° and wire the continuity test below.'
            : 'Đã vệ sinh & đưa bộ phận vào khe. Xoay góc khớp về 0° và nối mạch kiểm tra bên dưới.'
          : isEn
          ? `Staged "${candName}". Align joint angle to 0° and wire the continuity test below.`
          : `Đã đưa "${candName}" vào khe lắp. Xoay góc khớp về 0° và nối mạch kiểm tra bên dưới.`,
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
    if (!activeRaw || isBudgetFailed) return;
    const isRepairCurrent = wb.stagedMode === 'repair_current';
    const newPart = wb.stagedPartId ? getPartById(wb.stagedPartId) : undefined;

    if (isRepairCurrent) {
      const restoredHealth = currentPart?.tier === 'economy' ? 86 : 96;
      const triggerVi = `Bảo dưỡng & sửa chữa ${activeSubVi.name} (+${repairCostForCurrent} triệu $)`;
      const triggerEn = `Service & repair ${activeSubEn.name} (+$${repairCostForCurrent}M)`;
      const nextSession = evaluateBudgetStatusAndFailure(
        {
          ...session,
          subsystems: {
            ...session.subsystems,
            [activeSub.id]: {
              ...activeRaw,
              health: restoredHealth,
              status: 'ok',
              faultTitle: undefined,
              faultTitleEn: undefined,
              faultCause: undefined,
              faultCauseEn: undefined,
              diagnosed: true,
            },
          },
          economy: {
            ...session.economy,
            repairCost: session.economy.repairCost + repairCostForCurrent,
          },
          costHistory: [
            ...(session.costHistory || []),
            {
              id: `repair_${activeSub.id}_${Date.now()}`,
              label: `Sửa chữa ${activeSubVi.name}`,
              labelEn: `Repair ${activeSubEn.name}`,
              category: 'repair',
              amount: repairCostForCurrent,
            },
          ],
          diagnosisAttempts: session.diagnosisAttempts + 1,
          diagnosisCorrect: session.diagnosisCorrect + (isFaultyRaw ? 1 : 0),
          preDeployReport: null,
        },
        triggerVi,
        lang,
        triggerEn
      );
      onUpdateSession(nextSession);
      if (nextSession.budgetFailure?.failed) return;

      sound.playSuccess();
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
        text: isEn
          ? `Repaired ${activeSubText.name} (${repairCostForCurrent} M$). Run Safety Check before returning.`
          : `Đã sửa xong ${activeSubText.name} (${repairCostForCurrent} tr$). Bấm Kiểm tra an toàn trước khi chạy thử.`,
      });
      return;
    }

    if (newPart) {
      const newPartVi = getPartText(newPart, 'vi');
      const newPartEn = getPartText(newPart, 'en');
      const newPartText = getPartText(newPart, lang);
      const tradeInCredit = currentPart ? Math.round(currentPart.purchaseCost * 0.45) : 0;
      const swapCost = Math.max(25, newPart.purchaseCost - tradeInCredit);
      const maintDelta = newPart.maintenanceCost - (currentPart?.maintenanceCost || 0);
      const wasBlockedOnly =
        !isFaultyRaw && Boolean(activeEff.blockedBy || activeEff.degradedBy);

      const totalAdded = swapCost + Math.max(0, maintDelta);
      const triggerVi = `Thay thế ${activeSubVi.name} bằng ${newPartVi.name} (+${totalAdded} triệu $)`;
      const triggerEn = `Replace ${activeSubEn.name} with ${newPartEn.name} (+$${totalAdded}M)`;
      const nextSession = evaluateBudgetStatusAndFailure(
        {
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
          costHistory: [
            ...(session.costHistory || []),
            {
              id: `repair_swap_${activeSub.id}_${Date.now()}`,
              label: `Thay ${activeSubVi.name} -> ${newPartVi.name}`,
              labelEn: `Swap ${activeSubEn.name} -> ${newPartEn.name}`,
              category: 'repair',
              amount: totalAdded,
            },
          ],
          diagnosisAttempts: session.diagnosisAttempts + 1,
          diagnosisCorrect: session.diagnosisCorrect + (isFaultyRaw ? 1 : 0),
          preDeployReport: null,
        },
        triggerVi,
        lang,
        triggerEn
      );
      onUpdateSession(nextSession);
      if (nextSession.budgetFailure?.failed) return;

      sound.playSuccess();
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
          text: isEn
            ? `Installed "${newPartText.name}" (${swapCost} M$), but this slot was only blocked by ${
                activeEff.blockedBy || activeEff.degradedBy
              }. Fix the root subsystem.`
            : `Đã lắp "${newPartText.name}" (${swapCost} tr$), nhưng bộ phận này chỉ bị ảnh hưởng bởi ${
                activeEff.blockedBy || activeEff.degradedBy
              }. Hãy sửa hệ thống gốc.`,
        });
      } else {
        setActionNotice({
          type: 'ok',
          text: isEn
            ? `Installed "${newPartText.name}" (${getPartTierText(newPart.tier, lang)} · ${swapCost} M$).`
            : `Đã lắp đặt "${newPartText.name}" (${getPartTierText(newPart.tier, lang)} · ${swapCost} tr$).`,
        });
      }
    }
  };

  const handleRunSafetyCheck = () => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    sound.playClick();
    const report = evaluateSystemSafety(mission.id, session.subsystems, session.economy, lang);
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
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    setUnverifiedPrompt(false);
    setTrialStage('testing');
    sound.playRepairTool();

    const freshReport = evaluateSystemSafety(mission.id, session.subsystems, session.economy, lang);

    setTimeout(() => {
      if (freshReport.status === 'FAILED') {
        sound.playAlert();
        const penalty = diffProfile.failurePenaltyCost;
        const nextSession = evaluateBudgetStatusAndFailure(
          {
            ...session,
            economy: {
              ...session.economy,
              failurePenalty: session.economy.failurePenalty + penalty,
            },
            costHistory: [
              ...(session.costHistory || []),
              {
                id: `penalty_${Date.now()}`,
                label: 'Chi phí khắc phục sự cố khi chạy thử chưa đạt chuẩn',
                labelEn: 'Test-run incident recovery penalty',
                category: 'penalty',
                amount: penalty,
              },
            ],
            safetyWarningsIgnored: session.safetyWarningsIgnored + (ignoredWarning ? 1 : 0),
            preDeployReport: freshReport,
          },
          `Phạt chạy thử khi hệ thống chưa đạt chuẩn (+${penalty} triệu $)`,
          lang,
          `Penalty for test-running an uncertified system (+$${penalty}M)`
        );
        onUpdateSession(nextSession);
        if (nextSession.budgetFailure?.failed) {
          setTrialStage('editing');
          return;
        }
        setTrialStage('failed');
        setTrialMessage(
          isEn
            ? `${freshReport.summary} Failed test run caused +$${penalty}M in recovery costs.`
            : `${freshReport.summary} Chạy thử thất bại gây thiệt hại thêm ${penalty} tr$.`
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
          ? isEn
            ? 'Spacecraft passed all safety and performance benchmarks. All dependent subsystems restored.'
            : 'Thiết bị đạt chuẩn an toàn và hiệu suất. Mọi hệ thống phụ thuộc đã phục hồi.'
          : isEn
          ? 'Spacecraft cleared for controlled operation (watch the yellow warnings on the safety panel).'
          : 'Thiết bị đủ điều kiện vận hành có kiểm soát (lưu ý cảnh báo vàng trên bảng an toàn).'
      );
      onResolved(freshReport.status === 'READY' ? 40 : 15);
    }, 700);
  };

  const handleTestRunClick = () => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    if (!safetyReport) {
      sound.playAlert();
      setUnverifiedPrompt(true);
      return;
    }
    executeTestRun(safetyReport.status === 'WARNING');
  };

  const primaryAsset = getPrimaryDeviceAsset(mission.id);
  const previewImg = primaryAsset?.imageUrl || equipmentProfile.heroImageUrl;

  if (trialStage === 'passed' || trialStage === 'failed') {
    const isWin = trialStage === 'passed';
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
        <div
          className={`rounded-2xl bg-white border p-6 sm:p-8 shadow-sm space-y-5 text-center ${
            isWin ? 'border-emerald-300' : 'border-rose-300'
          }`}
        >
          <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            <img
              src={
                isWin
                  ? '/src/assets/images/mission_success_orbit_1794626911408.jpg'
                  : '/src/assets/images/mission_calibration_bench_1794626912229.jpg'
              }
              alt={trialMessage}
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-display">
            {isWin
              ? isEn
                ? 'Test Run Passed'
                : 'Chạy thử thành công'
              : isEn
              ? 'Test Run Failed Standards'
              : 'Chạy thử chưa đạt chuẩn'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 max-w-xl mx-auto">
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
                className="min-h-11 px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isEn ? 'Return to Operations' : 'Quay lại vận hành thiết bị'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTrialStage('editing');
                }}
                className="min-h-11 px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Wrench className="w-4 h-4" />
                <span>{isEn ? 'Continue Repairs' : 'Quay lại sửa tiếp'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Clean Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              sound.stopSpeech();
              onReturnToSim();
            }}
            className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Mission' : 'Quay lại nhiệm vụ'}</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {isEn
                ? `Repair Bay · ${mission.title.en}`
                : `Xưởng Sửa Chữa · ${mission.title.vi}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {diffText.title} ·{' '}
              {isEn
                ? totalFaultCount > 0
                  ? `${totalFaultCount} subsystem(s) need attention`
                  : 'All subsystems nominal'
                : totalFaultCount > 0
                ? `${totalFaultCount} bộ phận cần xử lý`
                : 'Tất cả bộ phận đều ổn định'}
            </p>
          </div>
        </div>

        {/* Remaining & Total Budget */}
        <div
          className={`min-h-10 px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 tabular-nums ${
            remainingBudget < 0
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : remainingBudget < 60
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {isEn
              ? `Remaining: ${remainingBudget} M$ · Spent: ${totalSpent}/${session.economy.initialBudget} M$`
              : `Còn lại: ${remainingBudget} tr$ · Đã chi: ${totalSpent}/${session.economy.initialBudget} tr$`}
          </span>
        </div>
      </div>

      {/* Balanced 2-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Subsystems, Interactive Drop Schematic, Cost Summary */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {isEn ? 'Subsystems' : 'Các bộ phận'}
              </h2>
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                {subsystems.length} {isEn ? 'modules' : 'cụm'}
              </span>
            </div>

            <div className="space-y-2">
              {subsystems.map((sub) => {
                const raw = session.subsystems[sub.id];
                const eff = getEffectiveSubsystemState(session, sub.id, lang);
                const subText = getSubsystemText(sub, lang);
                const part = getPartById(raw?.partId || '');
                const partText = part ? getPartText(part, lang) : null;
                const isSelected = activeSub.id === sub.id;

                const statusLabel =
                  eff.status === 'failed'
                    ? isEn
                      ? `Failed · ${eff.health}%`
                      : `Hỏng · ${eff.health}%`
                    : eff.status === 'degraded'
                    ? isEn
                      ? `Degraded · ${eff.health}%`
                      : `Suy giảm · ${eff.health}%`
                    : isEn
                    ? `Nominal · ${eff.health}%`
                    : `Tốt · ${eff.health}%`;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveSubId(sub.id);
                      setActionNotice(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 leading-snug break-words">
                        {subText.name}
                      </span>
                      <span
                        className={`text-xs font-semibold tabular-nums shrink-0 ${
                          eff.status === 'failed'
                            ? 'text-rose-700'
                            : eff.status === 'degraded'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-1">
                      <span className="break-words">{partText?.name}</span>
                      {part && (
                        <span className="text-slate-500 font-medium">
                          {getPartTierText(part.tier, lang)}
                        </span>
                      )}
                    </div>

                    {(eff.blockedBy || eff.degradedBy) && (
                      <div className="text-[11px] font-semibold text-rose-700">
                        {isEn ? 'Blocked by: ' : 'Ảnh hưởng từ: '}
                        {eff.blockedBy || eff.degradedBy}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Drop-Zone Diagram */}
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
            className={`rounded-2xl border overflow-hidden transition-all bg-white p-3 space-y-2 ${
              dropHover ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'
            }`}
          >
            <div className="relative rounded-xl overflow-hidden h-40 bg-slate-100">
              {imgFailed || !previewImg ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 px-4 text-center">
                  <Wrench className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-medium">
                    {isEn ? 'Diagram unavailable' : 'Sơ đồ tạm thời không khả dụng'}
                  </span>
                </div>
              ) : (
                <img
                  src={previewImg}
                  alt={equipmentProfile.equipmentName[lang]}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              {subsystems.map((sub) => {
                const eff = getEffectiveSubsystemState(session, sub.id, lang);
                const subText = getSubsystemText(sub, lang);
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
                    title={subText.name}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow cursor-pointer transition-transform ${
                      eff.status === 'failed'
                        ? 'bg-rose-600 text-white'
                        : eff.status === 'degraded'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    } ${isSelected ? 'scale-125 ring-2 ring-sky-400 z-20' : 'hover:scale-110 z-10'}`}
                  >
                    {eff.status === 'ok' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : eff.status === 'degraded' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] font-medium text-slate-600 text-center">
              {dropHover
                ? isEn
                  ? `Drop part into ${activeSubText.name}`
                  : `Thả linh kiện vào ${activeSubText.name}`
                : isEn
                ? 'Click a pin or drag a replacement part here'
                : 'Chọn vị trí trên sơ đồ hoặc kéo linh kiện thả vào đây'}
            </p>
          </div>

          {/* Concise Mission Cost Breakdown */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900">
              {isEn ? 'Cost Breakdown' : 'Chi phí nhiệm vụ'}
            </h2>
            <div className="space-y-1.5 text-xs text-slate-600 tabular-nums">
              <div className="flex justify-between">
                <span>{isEn ? 'Parts' : 'Linh kiện'}</span>
                <span className="font-semibold text-slate-900">
                  {session.economy.partsCost} {unitM}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isEn ? 'Repairs' : 'Sửa chữa'}</span>
                <span className="font-semibold text-slate-900">
                  {session.economy.repairCost} {unitM}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isEn ? 'Maint & Operations' : 'Bảo trì & Vận hành'}</span>
                <span className="font-semibold text-slate-900">
                  {session.economy.maintenanceCost + session.economy.operatingCost} {unitM}
                </span>
              </div>
              {session.economy.failurePenalty > 0 && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>{isEn ? 'Test penalties' : 'Phạt chạy thử'}</span>
                  <span>
                    {session.economy.failurePenalty} {unitM}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                <span>{isEn ? 'Total / Cap' : 'Tổng / Giới hạn'}</span>
                <span className={remainingBudget < 0 ? 'text-rose-700' : 'text-slate-900'}>
                  {totalSpent} / {session.economy.initialBudget} {unitM}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT WORKBENCH: Selected Subsystem, Parts, Calibration & Safety Test */}
        <section className="lg:col-span-8 space-y-5">
          {/* Active Subsystem Status & Primary Repair Action */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  {activeSubText.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">{activeSubText.role}</p>
              </div>
              {currentPart && (
                <div className="text-right text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">
                    {getPartText(currentPart, lang).name}
                  </span>
                  <span>{getPartTierText(currentPart.tier, lang)}</span>
                </div>
              )}
            </div>

            {/* Single Focused Status Block */}
            <div
              className={`p-4 rounded-xl border space-y-2.5 ${
                isFaultyRaw
                  ? 'bg-rose-50/70 border-rose-200'
                  : activeEff.status !== 'ok'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              {isFaultyRaw ? (
                <>
                  <div className="text-sm font-bold text-rose-900">
                    {isEn ? 'Detected Fault: ' : 'Lỗi phát hiện: '}
                    {activeFaultText.faultTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                    {activeFaultText.faultCause}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2.5">
                    {!wb.unbolted ? (
                      <button
                        type="button"
                        onClick={handleUnboltBroken}
                        className="min-h-10 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>
                          {isEn ? '1. Unbolt damaged unit' : '1. Tháo bộ phận hỏng'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStageCandidate('repair_current')}
                        className="min-h-10 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>
                          {isEn
                            ? `2. Repair existing unit (${repairCostForCurrent} M$)`
                            : `2. Sửa & dùng lại bộ phận cũ (${repairCostForCurrent} tr$)`}
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ) : activeEff.blockedBy || activeEff.degradedBy ? (
                <>
                  <div className="text-sm font-bold text-amber-950">
                    {isEn
                      ? 'Affected by another subsystem'
                      : 'Bị ảnh hưởng dây chuyền từ bộ phận khác'}
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {isEn
                      ? `Blocked by: ${activeEff.blockedBy || activeEff.degradedBy}. Repair that root subsystem on the left instead of spending extra budget here.`
                      : `Nguyên nhân từ: ${activeEff.blockedBy || activeEff.degradedBy}. Hãy chọn sửa đúng bộ phận gốc bên trái để tiết kiệm ngân sách.`}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-emerald-900">
                    {isEn
                      ? `Operating normally (${activeRaw?.health}% health)`
                      : `Đang hoạt động ổn định (${activeRaw?.health}% độ bền)`}
                  </div>
                  <p className="text-xs text-emerald-800">
                    {isEn ? 'Functions: ' : 'Chức năng: '}
                    {activeSubText.affectedFunctions.join(' · ')}
                  </p>
                </>
              )}
            </div>

            {/* Conditional Notice */}
            {actionNotice && (
              <div
                className={`p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                  actionNotice.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : actionNotice.type === 'warn'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {actionNotice.text}
              </div>
            )}

            {/* Progressive Calibration & Wiring Bench (shown only when a unit/part is staged) */}
            {wb.stagedMode !== 'none' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4 text-sky-600" />
                      <span>
                        {isEn
                          ? 'Align connector angle to 0° (±6°)'
                          : 'Xoay căn chỉnh góc khớp về 0° (±6°)'}
                      </span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold tabular-nums ${
                        Math.abs(wb.alignAngle) <= 6
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-200 text-amber-950'
                      }`}
                    >
                      {wb.alignAngle > 0 ? `+${wb.alignAngle}°` : `${wb.alignAngle}°`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <svg
                      viewBox="0 0 80 80"
                      className="w-14 h-14 shrink-0 bg-white rounded-xl border border-slate-200"
                    >
                      <circle cx="40" cy="40" r="28" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                      <line
                        x1="40"
                        y1="8"
                        x2="40"
                        y2="20"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <g transform={`rotate(${wb.alignAngle} 40 40)`}>
                        <line
                          x1="40"
                          y1="40"
                          x2="40"
                          y2="14"
                          stroke="#0284c7"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <circle cx="40" cy="40" r="5" fill="#0f172a" />
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
                      className="flex-1 accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>

                {Math.abs(wb.alignAngle) <= 6 ? (
                  <CircuitWiringBoard
                    lang={lang}
                    title={
                      isEn
                        ? 'Connect wires & finalize installation'
                        : 'Nối mạch & hoàn tất lắp đặt'
                    }
                    instruction={
                      isEn
                        ? `Connect Power and Telemetry lines for ${activeSubText.name}, then switch on power.`
                        : `Nối đúng Cổng Nguồn và Cổng Tín hiệu cho ${activeSubText.name} rồi bật công tắc.`
                    }
                    leftNodes={[
                      {
                        id: 'pwr_in',
                        label: isEn ? 'Main Power Bus' : 'Nguồn Bus chính',
                        color: '#f59e0b',
                      },
                      {
                        id: 'sig_in',
                        label: isEn ? 'Core Data Cable' : 'Cáp dữ liệu trung tâm',
                        color: '#0ea5e9',
                      },
                    ]}
                    rightNodes={[
                      {
                        id: 'sig_port',
                        label: isEn ? 'Command Port' : 'Chân nhận lệnh',
                        color: '#0ea5e9',
                      },
                      {
                        id: 'pwr_port',
                        label: isEn ? 'Power Pin' : 'Chân cấp nguồn',
                        color: '#f59e0b',
                      },
                    ]}
                    expectedConnections={[
                      {
                        fromId: 'pwr_in',
                        toId: 'pwr_port',
                        errorHint: isEn
                          ? 'Polarity mismatch! Connect Main Power Bus to Power Pin.'
                          : 'Nhầm cực! Nguồn Bus chính phải nối vào Chân cấp nguồn.',
                      },
                      {
                        fromId: 'sig_in',
                        toId: 'sig_port',
                        errorHint: isEn
                          ? 'Wrong port! Connect Core Data Cable to Command Port.'
                          : 'Sai cổng! Cáp dữ liệu phải nối vào Chân nhận lệnh.',
                      },
                    ]}
                    onSuccess={handleCommitAfterWiring}
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                    {isEn
                      ? 'Rotate the alignment slider close to 0° to unlock wire verification.'
                      : 'Xoay thanh góc khớp về gần 0° để mở bước nối mạch kiểm tra.'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Replacement Options Grid */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {isEn ? 'Replacement Parts' : 'Tùy chọn thay thế linh kiện'}
              </h2>
              <span className="text-xs text-slate-500">
                {isEn
                  ? 'Select a component or drag it onto the schematic'
                  : 'Chọn linh kiện hoặc kéo thả vào sơ đồ bên trái'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidateParts.map((part) => {
                const partText = getPartText(part, lang);
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
                    className={`p-4 rounded-xl border space-y-2.5 transition-colors flex flex-col justify-between ${
                      isStaged
                        ? 'bg-amber-50/70 border-amber-400'
                        : isEquipped
                        ? 'bg-sky-50/60 border-sky-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                            {getPartTierText(part.tier, lang)}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {partText.name}
                          </h3>
                        </div>

                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-sm font-bold text-slate-900">
                            {isEquipped
                              ? `${part.purchaseCost} ${unitM}`
                              : isEn
                              ? `${swapCost} M$`
                              : `${swapCost} tr$`}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isEn
                              ? `Maint: ${part.maintenanceCost} M$`
                              : `Bảo trì: ${part.maintenanceCost} tr$`}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {partText.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold text-slate-600 tabular-nums">
                        {isEn ? 'Dur' : 'Bền'} {part.durability}% ·{' '}
                        {isEn ? 'Perf' : 'Hiệu'} {part.performance}% ·{' '}
                        {isEn ? 'Rel' : 'Tin cậy'} {part.reliability}%
                      </div>

                      <button
                        type="button"
                        disabled={isEquipped}
                        onClick={() => handleStageCandidate('swap_part', part)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                            : isStaged
                            ? 'bg-amber-500 text-white'
                            : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                      >
                        {isEquipped
                          ? isEn
                            ? 'Installed'
                            : 'Đang lắp'
                          : isStaged
                          ? isEn
                            ? 'Staged'
                            : 'Đang chờ'
                          : isEn
                          ? 'Select'
                          : 'Chọn lắp'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {decoyPart && decoyPart.subsystemId === activeSub.id && (() => {
              const decoyText = getPartText(decoyPart, lang);
              return (
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
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-wrap items-center justify-between gap-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="space-y-0.5 flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <Ban className="w-3.5 h-3.5 shrink-0" />
                      <span>{decoyText.name}</span>
                      <span className="tabular-nums text-rose-700">
                        ({decoyPart.purchaseCost} {unitM})
                      </span>
                    </div>
                    <p className="text-xs text-rose-700">{decoyText.shortDesc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStageCandidate('swap_part', decoyPart)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    {isEn ? 'Test compatibility' : 'Thử tương thích'}
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Safety Verification & Test Run Bar */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isEn ? 'Safety Check & Confirmation' : 'Kiểm tra an toàn & Xác nhận'}
                </h2>
                <p className="text-xs text-slate-600">
                  {isEn
                    ? 'Verify all subsystems and power limits before returning to mission operations.'
                    : 'Kiểm tra toàn bộ hệ thống và giới hạn năng lượng trước khi quay lại vận hành.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRunSafetyCheck}
                  className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>{isEn ? 'Run Safety Check' : 'Kiểm tra an toàn'}</span>
                </button>

                <button
                  type="button"
                  disabled={trialStage === 'testing'}
                  onClick={handleTestRunClick}
                  className="min-h-10 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {trialStage === 'testing'
                      ? isEn
                        ? 'Testing...'
                        : 'Đang chạy thử...'
                      : isEn
                      ? 'Test Run & Return'
                      : 'Chạy thử & Trở về'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {unverifiedPrompt && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="font-semibold text-amber-950 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isEn
                      ? 'Safety Check has not been run yet.'
                      : 'Bạn chưa chạy Kiểm tra an toàn.'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunSafetyCheck}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs cursor-pointer"
                  >
                    {isEn ? 'Check Now' : 'Kiểm tra ngay'}
                  </button>
                  <button
                    type="button"
                    onClick={() => executeTestRun(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold text-xs cursor-pointer"
                  >
                    {isEn ? 'Test Anyway' : 'Chạy thử ngay'}
                  </button>
                </div>
              </div>
            )}

            {safetyReport && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold ${
                    safetyReport.status === 'READY'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : safetyReport.status === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {safetyReport.summary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {safetyReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{chk.label}</span>
                        <span
                          className={
                            chk.level === 'ok'
                              ? 'text-emerald-700'
                              : chk.level === 'warn'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }
                        >
                          {chk.level === 'ok'
                            ? isEn
                              ? 'Pass'
                              : 'Đạt'
                            : chk.level === 'warn'
                            ? isEn
                              ? 'Warn'
                              : 'Cảnh báo'
                            : isEn
                            ? 'Fail'
                            : 'Lỗi'}
                        </span>
                      </div>
                      <p className="text-slate-600">{chk.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
