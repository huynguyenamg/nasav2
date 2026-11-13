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
  DIFFICULTY_PROFILES,
  activateMissionArrivalFaults,
  evaluateMissionOutcome,
  getEffectiveSubsystemState,
  getRemainingBudget,
  getSubsystemsForMission,
} from '../data/equipmentSystems';
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
  onMissionDebrief: (report: MissionEvaluationReport) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
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
      const withFaults = activateMissionArrivalFaults(session);
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

  const subsystems = getSubsystemsForMission(mission.id);
  const remainingBudget = getRemainingBudget(session.economy);
  const diffProfile = DIFFICULTY_PROFILES[session.difficulty];

  const activeIssues = subsystems.filter(
    (s) => getEffectiveSubsystemState(session, s.id).status !== 'ok'
  );

  const handleCompleteSubTask = (
    taskId: string,
    extras?: { photos?: number; samples?: number }
  ) => {
    if (extras?.photos) setPhotosCaptured((p) => p + extras.photos!);
    if (extras?.samples) setSamplesCollected((s) => s + extras.samples!);

    if (!session.completedSubTasks.includes(taskId)) {
      onUpdateSession({
        ...session,
        completedSubTasks: [...session.completedSubTasks, taskId],
      });
    }
  };

  const handleFinishMission = () => {
    sound.playClick();
    setIsFinishing(true);
    setTimeout(() => {
      const report = evaluateMissionOutcome(session, {
        photos: photosCaptured,
        samples: samplesCollected,
        totalSubTasks: 4,
      });
      if (report.passed) {
        sound.playSuccess();
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } else {
        sound.playAlert();
      }
      onMissionDebrief(report);
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
              className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-sky-950 font-display">
              {mission.title.vi}
            </h1>
            <p className="text-xs sm:text-sm text-sky-800 font-semibold">
              {diffProfile.title} · Hoàn thành {session.completedSubTasks.length}/4 nhiệm vụ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Remaining Budget Pill */}
          <div
            className={`min-h-11 px-3.5 py-2 rounded-2xl border-2 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 ${
              remainingBudget < 0
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : remainingBudget < 60
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-sky-200 text-sky-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums">
              {remainingBudget >= 0
                ? `Còn dư: ${remainingBudget} tr$`
                : `Vượt: ${Math.abs(remainingBudget)} tr$`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              const firstFaulty = activeIssues[0]?.id;
              onOpenRepair(firstFaulty);
            }}
            className={`min-h-11 px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-sm ${
              activeIssues.length > 0 ? 'ring-4 ring-amber-300 animate-pulse' : ''
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>
              Sửa chữa {activeIssues.length > 0 ? `(${activeIssues.length})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={handleFinishMission}
            disabled={isFinishing || session.completedSubTasks.length === 0}
            className={`min-h-11 px-5 py-2 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition-colors cursor-pointer ${
              session.completedSubTasks.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                : 'bg-sky-100 text-sky-400 border border-sky-200 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isFinishing ? 'Đang tổng kết...' : 'Hoàn thành'}</span>
          </button>
        </div>
      </div>

      {/* Live Subsystem Health & Functional Dependency Strip */}
      <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-sky-900">
            Tình trạng các hệ thống (chạm vào hệ thống lỗi để chẩn đoán & sửa):
          </span>
          <span className="text-xs font-bold text-sky-700 tabular-nums">
            Tiến độ: {session.completedSubTasks.length}/4 nhiệm vụ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {subsystems.map((sub) => {
            const eff = getEffectiveSubsystemState(session, sub.id);
            const raw = session.subsystems[sub.id];
            const isFail = eff.status === 'failed';
            const isDeg = eff.status === 'degraded';

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenRepair(sub.id);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                  isFail
                    ? 'bg-rose-50 border-rose-300 hover:border-rose-400'
                    : isDeg
                    ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
                    : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-extrabold text-sky-950 truncate">
                    {sub.name}
                  </span>
                  {isFail ? (
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : isDeg ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>

                <div className="text-xs font-bold flex items-center justify-between gap-1">
                  <span
                    className={
                      isFail
                        ? 'text-rose-700'
                        : isDeg
                        ? 'text-amber-800'
                        : 'text-emerald-700'
                    }
                  >
                    {isFail ? 'Hỏng / Ngừng' : isDeg ? 'Suy giảm' : 'Hoạt động tốt'}
                  </span>
                  <span className="tabular-nums text-sky-900">{eff.health}%</span>
                </div>

                {(eff.blockedBy || eff.degradedBy) && (
                  <p className="text-[11px] font-bold text-rose-700 leading-tight">
                    Ảnh hưởng từ: {eff.blockedBy || eff.degradedBy}
                  </p>
                )}
                {!eff.blockedBy && !eff.degradedBy && raw?.faultTitle && eff.status !== 'ok' && (
                  <p className="text-[11px] font-semibold text-sky-900/80 line-clamp-1">
                    {raw.faultTitle}
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
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
        />
      )}

      {mission.id === 'mission_02_earth_satellite' && (
        <LandsatSimulator
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
        />
      )}

      {mission.id === 'mission_03_space_station' && (
        <IssSimulator
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
        />
      )}

      {mission.id === 'mission_04_robotic_arm' && (
        <CanadarmSimulator
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
        />
      )}

      {mission.id === 'mission_05_space_telescope' && (
        <HubbleSimulator
          session={session}
          onUpdateSession={onUpdateSession}
          onOpenRepair={onOpenRepair}
          onCompleteSubTask={handleCompleteSubTask}
        />
      )}
    </div>
  );
};
