import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CadetProfile,
  EquipmentSubsystemId,
  Language,
  MissionConfig,
  MissionEvaluationReport,
  MissionSessionState,
} from '../types/game';
import {
  activateMissionArrivalFaults,
  evaluateMissionOutcome,
  getEffectiveSubsystemState,
  getFaultText,
  getRemainingBudget,
  getSubsystemText,
  getSubsystemsForMission,
} from '../data/equipmentSystems';
import { getDifficultyText } from '../services/localization';
import { sound } from '../services/sound';
import { PerseveranceSimulator } from '../components/simulators/PerseveranceSimulator';
import { LandsatSimulator } from '../components/simulators/LandsatSimulator';
import { IssSimulator } from '../components/simulators/IssSimulator';
import { CanadarmSimulator } from '../components/simulators/CanadarmSimulator';
import { HubbleSimulator } from '../components/simulators/HubbleSimulator';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Coins,
  Wrench,
} from 'lucide-react';

interface SimulatorViewProps {
  cadet: CadetProfile;
  lang: Language;
  mission: MissionConfig;
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onOpenRepair: (targetSubsystem?: EquipmentSubsystemId) => void;
  onBack?: () => void;
  onMissionDebrief: (
    report: MissionEvaluationReport,
    extras?: { photos: number; samples: number }
  ) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  lang,
  mission,
  session,
  onUpdateSession,
  onOpenRepair,
  onBack,
  onMissionDebrief,
}) => {
  const [photosCaptured, setPhotosCaptured] = useState(0);
  const [samplesCollected, setSamplesCollected] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  // Trigger deterministic orbital/planetary faults upon entering operation if none triggered yet
  useEffect(() => {
    if (session.incidentsTriggered === 0) {
      const withFaults = activateMissionArrivalFaults(session, lang);
      onUpdateSession(withFaults);
      sound.playAlert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id, session.incidentsTriggered]);

  // Reset local telemetry counters when switching missions
  useEffect(() => {
    setPhotosCaptured(0);
    setSamplesCollected(0);
    setIsFinishing(false);
  }, [mission.id]);

  const isEn = lang === 'en';
  const subsystems = getSubsystemsForMission(mission.id);
  const remainingBudget = getRemainingBudget(session.economy);
  const diffProfile = getDifficultyText(session.difficulty, lang);
  const isBudgetFailed = Boolean(session.budgetFailure?.failed);

  const activeIssues = subsystems.filter(
    (s) => getEffectiveSubsystemState(session, s.id, lang).status !== 'ok'
  );

  const handleCompleteSubTask = (
    taskId: string,
    extras?: { photos?: number; samples?: number },
    sessionPatch?: Partial<MissionSessionState>
  ) => {
    if (isBudgetFailed) return;
    if (extras?.photos) setPhotosCaptured((p) => p + extras.photos!);
    if (extras?.samples) setSamplesCollected((s) => s + extras.samples!);

    const nextCompleted = session.completedSubTasks.includes(taskId)
      ? session.completedSubTasks
      : [...session.completedSubTasks, taskId];
    const nextFailed = (session.failedSubTasks || []).filter((id) => id !== taskId);

    onUpdateSession({
      ...session,
      ...sessionPatch,
      completedSubTasks: nextCompleted,
      failedSubTasks: nextFailed,
    });
  };

  const handleFailSubTask = (
    taskId: string,
    sessionPatch?: Partial<MissionSessionState>
  ) => {
    if (isBudgetFailed) return;
    const isAlreadyDone = session.completedSubTasks.includes(taskId);
    const currentFailed = session.failedSubTasks || [];
    const nextFailed = isAlreadyDone
      ? currentFailed
      : currentFailed.includes(taskId)
      ? currentFailed
      : [...currentFailed, taskId];

    if (!sessionPatch && nextFailed === currentFailed) return;

    onUpdateSession({
      ...session,
      ...sessionPatch,
      failedSubTasks: nextFailed,
    });
  };

  const handleFinishMission = () => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    sound.playClick();
    setIsFinishing(true);
    setTimeout(() => {
      const extras = {
        photos: photosCaptured,
        samples: samplesCollected,
        totalSubTasks: 4,
      };
      const report = evaluateMissionOutcome(session, extras, lang);
      if (report.passed) {
        sound.playSuccess();
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } else {
        sound.playAlert();
      }
      onMissionDebrief(report, { photos: photosCaptured, samples: samplesCollected });
      setIsFinishing(false);
    }, 650);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
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
              <span>{isEn ? 'Back' : 'Quay lại'}</span>
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {mission.title[lang]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {diffProfile.title} ·{' '}
              {isEn
                ? `Completed ${session.completedSubTasks.length}/4 tasks`
                : `Hoàn thành ${session.completedSubTasks.length}/4 nhiệm vụ`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Remaining Budget Indicator */}
          <div
            className={`min-h-10 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
              remainingBudget < 0
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : remainingBudget < 60
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums">
              {remainingBudget >= 0
                ? `${isEn ? 'Remaining' : 'Còn dư'}: ${remainingBudget} ${isEn ? 'M$' : 'tr$'}`
                : `${isEn ? 'Overrun' : 'Vượt'}: ${Math.abs(remainingBudget)} ${isEn ? 'M$' : 'tr$'}`}
            </span>
          </div>

          <button
            type="button"
            disabled={isBudgetFailed}
            onClick={() => {
              sound.playClick();
              const firstFaulty = activeIssues[0]?.id;
              onOpenRepair(firstFaulty);
            }}
            className={`min-h-10 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              activeIssues.length > 0 ? 'ring-2 ring-amber-300' : ''
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>
              {isEn ? 'Repair' : 'Sửa chữa'} {activeIssues.length > 0 ? `(${activeIssues.length})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={handleFinishMission}
            disabled={isBudgetFailed || isFinishing || session.completedSubTasks.length === 0}
            className={`min-h-10 px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              !isBudgetFailed && session.completedSubTasks.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isFinishing
                ? isEn
                  ? 'Evaluating...'
                  : 'Đang tổng kết...'
                : isEn
                ? 'Complete'
                : 'Hoàn thành'}
            </span>
          </button>
        </div>
      </div>

      {/* Live Subsystem Health & Functional Dependency Strip */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">
            {isEn
              ? 'Subsystem Health (select any faulted system to diagnose & repair):'
              : 'Tình trạng các hệ thống (chọn hệ thống lỗi để chẩn đoán & sửa):'}
          </span>
          <span className="text-xs font-semibold text-sky-700 tabular-nums">
            {isEn
              ? `Progress: ${session.completedSubTasks.length}/4 tasks`
              : `Tiến độ: ${session.completedSubTasks.length}/4 nhiệm vụ`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {subsystems.map((sub) => {
            const eff = getEffectiveSubsystemState(session, sub.id, lang);
            const raw = session.subsystems[sub.id];
            const subText = getSubsystemText(sub, lang);
            const faultText = getFaultText(sub.id, raw, lang);
            const isFail = eff.status === 'failed';
            const isDeg = eff.status === 'degraded';

            return (
              <button
                key={sub.id}
                type="button"
                disabled={isBudgetFailed}
                onClick={() => {
                  sound.playClick();
                  onOpenRepair(sub.id);
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer space-y-1 disabled:opacity-60 ${
                  isFail
                    ? 'bg-rose-50 border-rose-300 hover:border-rose-400'
                    : isDeg
                    ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
                    : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-snug break-words">
                    {subText.name}
                  </span>
                  {isFail ? (
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : isDeg ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="text-xs font-semibold flex items-center justify-between gap-1">
                  <span
                    className={
                      isFail
                        ? 'text-rose-700'
                        : isDeg
                        ? 'text-amber-800'
                        : 'text-emerald-700'
                    }
                  >
                    {isFail
                      ? isEn
                        ? 'Failed / Offline'
                        : 'Hỏng / Ngừng'
                      : isDeg
                      ? isEn
                        ? 'Degraded'
                        : 'Suy giảm'
                      : isEn
                      ? 'Nominal'
                      : 'Hoạt động tốt'}
                  </span>
                  <span className="tabular-nums text-slate-900">{eff.health}%</span>
                </div>

                {(eff.blockedBy || eff.degradedBy) && (
                  <p className="text-[11px] font-semibold text-rose-700 leading-snug">
                    {isEn ? 'Affected by' : 'Ảnh hưởng từ'}: {eff.blockedBy || eff.degradedBy}
                  </p>
                )}
                {!eff.blockedBy && !eff.degradedBy && faultText.faultTitle && eff.status !== 'ok' && (
                  <p className="text-[11px] font-medium text-slate-700 leading-snug break-words">
                    {faultText.faultTitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specialized Equipment Simulator */}
      {mission.id === 'mission_01_mars_rover' && (
        <PerseveranceSimulator
          lang={lang}
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
          onFailSubTask={handleFailSubTask}
        />
      )}

      {mission.id === 'mission_02_earth_satellite' && (
        <LandsatSimulator
          lang={lang}
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
          onFailSubTask={handleFailSubTask}
        />
      )}

      {mission.id === 'mission_03_space_station' && (
        <IssSimulator
          lang={lang}
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
          onFailSubTask={handleFailSubTask}
        />
      )}

      {mission.id === 'mission_04_robotic_arm' && (
        <CanadarmSimulator
          lang={lang}
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
          onFailSubTask={handleFailSubTask}
        />
      )}

      {mission.id === 'mission_05_space_telescope' && (
        <HubbleSimulator
          lang={lang}
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
          onFailSubTask={handleFailSubTask}
        />
      )}
    </div>
  );
};
