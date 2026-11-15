import React, { useState, useEffect } from 'react';
import {
  AcademyZone,
  CadetProfile,
  DifficultyLevel,
  EquipmentSubsystemId,
  Language,
  MissionEvaluationReport,
  MissionId,
  MissionSessionState,
} from './types/game';
import { MISSIONS } from './data/missions';
import {
  createAssemblySession,
  createBudgetFailureReport,
  evaluateBudgetStatusAndFailure,
  evaluateMissionOutcome,
  getLocalizedBudgetFailure,
  getRemainingBudget,
} from './data/equipmentSystems';
import { getDisplayCadetName, storage } from './services/storage';
import { sound } from './services/sound';
import { Navbar } from './components/Navbar';
import { NovaChatModal } from './components/NovaChatModal';
import { CadetModal } from './components/CadetModal';
import { DebriefModal } from './components/DebriefModal';
import { LobbyView } from './views/LobbyView';
import { MissionMapView } from './views/MissionMapView';
import { DesignLabView } from './views/DesignLabView';
import { LaunchCenterView } from './views/LaunchCenterView';
import { SimulatorView } from './views/SimulatorView';
import { RepairShopView } from './views/RepairShopView';
import { NasaCenterView } from './views/NasaCenterView';
import { AchievementsView } from './views/AchievementsView';
import { AdminPortal } from './views/admin/AdminPortal';
import { Shield } from 'lucide-react';

export default function App() {
  const [currentZone, setCurrentZone] = useState<AcademyZone>('lobby');
  const [lang, setLang] = useState<Language>('vi');
  const [cadet, setCadet] = useState<CadetProfile>(storage.getCadetProfile());
  const [currentMissionId, setCurrentMissionId] = useState<MissionId>('mission_01_mars_rover');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(1);
  const [missionSession, setMissionSession] = useState<MissionSessionState>(() =>
    createAssemblySession('mission_01_mars_rover', 1, undefined, storage.getLanguage())
  );
  const [repairTargetSubsystem, setRepairTargetSubsystem] =
    useState<EquipmentSubsystemId | null>(null);
  const [nasaInitialMissionId, setNasaInitialMissionId] =
    useState<MissionId>('mission_01_mars_rover');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [syncNonce, setSyncNonce] = useState(0);

  // Modals
  const [isNovaOpen, setIsNovaOpen] = useState(false);
  const [isCadetModalOpen, setIsCadetModalOpen] = useState(false);
  const [debriefReport, setDebriefReport] = useState<MissionEvaluationReport | null>(null);
  const [lastMissionExtras, setLastMissionExtras] = useState<{ photos: number; samples: number }>({
    photos: 0,
    samples: 0,
  });

  // Load language & profile from storage on mount
  useEffect(() => {
    const savedLang = storage.getLanguage();
    setLang(savedLang);
    const savedProfile = storage.getCadetProfile();
    setCadet(savedProfile);
  }, []);

  // Recompute open debrief report cleanly when toggling language
  useEffect(() => {
    if (!debriefReport) return;
    if (missionSession.budgetFailure?.failed || debriefReport.budgetExceeded) {
      setDebriefReport(createBudgetFailureReport(missionSession, lang));
    } else {
      setDebriefReport(
        evaluateMissionOutcome(
          missionSession,
          { ...lastMissionExtras, totalSubTasks: 4 },
          lang
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleToggleLang = () => {
    sound.playClick();
    sound.stopSpeech();
    const next: Language = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    storage.saveLanguage(next);
  };

  const currentMission = MISSIONS.find((m) => m.id === currentMissionId) || MISSIONS[0];

  const handleUpdateSession = (rawNextSession: MissionSessionState) => {
    if (currentZone === 'design_lab') {
      setMissionSession({
        ...rawNextSession,
        budgetFailure: null,
      });
      return;
    }

    if (
      missionSession.budgetFailure?.failed &&
      rawNextSession.missionId === missionSession.missionId &&
      rawNextSession.difficulty === missionSession.difficulty
    ) {
      if (!debriefReport) {
        setDebriefReport(createBudgetFailureReport(missionSession, lang));
      }
      return;
    }

    const evaluated = rawNextSession.budgetFailure?.failed
      ? rawNextSession
      : evaluateBudgetStatusAndFailure(rawNextSession, undefined, lang);

    setMissionSession(evaluated);

    if (evaluated.budgetFailure?.failed) {
      sound.playAlert();
      sound.stopSpeech();
      setDebriefReport(createBudgetFailureReport(evaluated, lang));
    }
  };

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    setDebriefReport(null);
    setSelectedDifficulty(level);
    setMissionSession(createAssemblySession(currentMissionId, level, undefined, lang));
    setRepairTargetSubsystem(null);
  };

  const handleSelectMission = (id: MissionId, difficulty?: DifficultyLevel) => {
    setDebriefReport(null);
    const effDiff = difficulty ?? selectedDifficulty;
    if (difficulty !== undefined) {
      setSelectedDifficulty(difficulty);
    }
    setCurrentMissionId(id);
    setMissionSession(createAssemblySession(id, effDiff, undefined, lang));
    setRepairTargetSubsystem(null);
  };

  const handleOpenRepair = (targetSubsystem?: EquipmentSubsystemId) => {
    if (missionSession.budgetFailure?.failed) {
      setDebriefReport(createBudgetFailureReport(missionSession, lang));
      return;
    }
    setRepairTargetSubsystem(targetSubsystem || null);
    setCurrentZone('repair_shop');
  };

  const handleMissionDebrief = (
    report: MissionEvaluationReport,
    extras?: { photos: number; samples: number }
  ) => {
    if (extras) setLastMissionExtras(extras);
    if (missionSession.budgetFailure?.failed || report.budgetExceeded) {
      setDebriefReport(createBudgetFailureReport(missionSession, lang));
      return;
    }

    setDebriefReport(report);

    const newXp = cadet.xp + report.xpEarned;
    const newRank = storage.calculateRank(newXp);
    const badges = report.passed
      ? Array.from(new Set([...cadet.unlockedBadges, currentMission.badgeId]))
      : cadet.unlockedBadges;
    const completed = report.passed
      ? Array.from(new Set([...cadet.completedMissions, currentMission.id]))
      : cadet.completedMissions;

    const updatedProfile: CadetProfile = {
      ...cadet,
      xp: newXp,
      rank: newRank,
      unlockedBadges: badges,
      completedMissions: completed,
      totalPhotosTaken: cadet.totalPhotosTaken + report.photos,
      totalSamplesAnalyzed: cadet.totalSamplesAnalyzed + report.samples,
    };

    setCadet(updatedProfile);
    storage.saveCadetProfile(updatedProfile);
  };

  const handleAnomalyResolved = (bonusXp = 30) => {
    if (missionSession.budgetFailure?.failed) return;
    const updated = {
      ...cadet,
      xp: Math.max(0, cadet.xp + bonusXp),
      anomaliesResolved: cadet.anomaliesResolved + 1,
      unlockedBadges: Array.from(new Set([...cadet.unlockedBadges, 'badge_diagnostic_master'])),
    };
    setCadet(updated);
    storage.saveCadetProfile(updated);
  };

  const handleReplayMission = () => {
    setDebriefReport(null);
    setMissionSession(createAssemblySession(currentMissionId, selectedDifficulty, undefined, lang));
    setRepairTargetSubsystem(null);
    setCurrentZone('design_lab');
  };

  const handleNextMission = () => {
    setDebriefReport(null);
    const currentIndex = MISSIONS.findIndex((m) => m.id === currentMissionId);
    const nextIndex = (currentIndex + 1) % MISSIONS.length;
    const nextMission = MISSIONS[nextIndex];
    handleSelectMission(nextMission.id, selectedDifficulty);
    setCurrentZone('design_lab');
  };

  const handleResetProgress = () => {
    const resetProfile = storage.resetProgress();
    setCadet(resetProfile);
    setCurrentMissionId('mission_01_mars_rover');
    setSelectedDifficulty(1);
    setMissionSession(createAssemblySession('mission_01_mars_rover', 1, undefined, lang));
    setRepairTargetSubsystem(null);
    setDebriefReport(null);
    setLastMissionExtras({ photos: 0, samples: 0 });
  };

  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-200 selection:text-slate-900">
        <AdminPortal
          lang={lang}
          onExit={() => setIsAdminOpen(false)}
          onDataSynced={() => setSyncNonce((prev) => prev + 1)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-200 selection:text-slate-900">
      {/* Minimalist 3-Item Top Taskbar */}
      <Navbar
        currentZone={currentZone}
        onNavigate={setCurrentZone}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {currentZone === 'lobby' && (
          <LobbyView
            cadet={cadet}
            lang={lang}
            onNavigate={setCurrentZone}
            onSelectMission={handleSelectMission}
            onOpenCadetModal={() => setIsCadetModalOpen(true)}
          />
        )}

        {currentZone === 'mission_map' && (
          <MissionMapView
            cadet={cadet}
            lang={lang}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={handleSelectDifficulty}
            onSelectMission={handleSelectMission}
            onStartDesign={() => setCurrentZone('design_lab')}
            onBack={() => setCurrentZone('lobby')}
            onOpenNasaArchive={(missionId) => {
              setNasaInitialMissionId(missionId);
              setCurrentZone('nasa_center');
            }}
          />
        )}

        {currentZone === 'design_lab' && (
          <DesignLabView
            cadet={cadet}
            lang={lang}
            mission={currentMission}
            session={missionSession}
            onUpdateSession={handleUpdateSession}
            onProceedToLaunch={() => {
              if (getRemainingBudget(missionSession.economy) < 0) {
                sound.playAlert();
                return;
              }
              setCurrentZone('launch_center');
            }}
            onBack={() => setCurrentZone('mission_map')}
          />
        )}

        {currentZone === 'launch_center' && (
          <LaunchCenterView
            cadet={cadet}
            lang={lang}
            mission={currentMission}
            session={missionSession}
            onUpdateSession={handleUpdateSession}
            onLaunchComplete={() => {
              if (missionSession.budgetFailure?.failed) {
                setDebriefReport(createBudgetFailureReport(missionSession, lang));
                return;
              }
              setCurrentZone('simulator');
            }}
            onBack={() => setCurrentZone('design_lab')}
          />
        )}

        {currentZone === 'simulator' && (
          <SimulatorView
            key={`sim_${currentMissionId}_${selectedDifficulty}_${syncNonce}`}
            cadet={cadet}
            lang={lang}
            mission={currentMission}
            session={missionSession}
            onUpdateSession={handleUpdateSession}
            onOpenRepair={handleOpenRepair}
            onBack={() => setCurrentZone('mission_map')}
            onMissionDebrief={handleMissionDebrief}
          />
        )}

        {currentZone === 'repair_shop' && (
          <RepairShopView
            cadet={cadet}
            lang={lang}
            mission={currentMission}
            session={missionSession}
            initialTargetSubsystem={repairTargetSubsystem}
            onUpdateSession={handleUpdateSession}
            onResolved={handleAnomalyResolved}
            onReturnToSim={() => setCurrentZone('simulator')}
          />
        )}

        {currentZone === 'nasa_center' && (
          <NasaCenterView
            lang={lang}
            initialMissionId={nasaInitialMissionId}
            onBack={() => setCurrentZone('lobby')}
          />
        )}

        {currentZone === 'achievements' && (
          <AchievementsView
            cadet={cadet}
            lang={lang}
            onOpenCadetModal={() => setIsCadetModalOpen(true)}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Clean Technical Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 md:px-8 py-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">NASA Technical Academy</span>
            <span aria-hidden="true">·</span>
            <span>
              {lang === 'en'
                ? 'Aerospace Engineering Simulation (Middle School)'
                : 'Mô phỏng Kỹ thuật Không gian (THCS)'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsAdminOpen(true);
              }}
              className="text-slate-600 hover:text-sky-600 flex items-center gap-1 transition-colors cursor-pointer font-semibold"
            >
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>{lang === 'en' ? 'Data Manager' : 'Quản lý dữ liệu'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating NOVA Technical Assistant */}
      <NovaChatModal
        lang={lang}
        cadetName={getDisplayCadetName(cadet.name, lang)}
        ageMode={cadet.ageMode}
        currentMissionId={currentMissionId}
        currentStage={currentZone}
        isOpen={isNovaOpen}
        onClose={() => setIsNovaOpen((prev) => !prev)}
        telemetryContext={{
          difficulty: selectedDifficulty,
          remainingBudget: getRemainingBudget(missionSession.economy),
          completedTasks: missionSession.completedSubTasks.length,
          zone: currentZone,
        }}
      />

      {/* Cadet Profile Setup Modal */}
      <CadetModal
        cadet={cadet}
        lang={lang}
        isOpen={isCadetModalOpen}
        onClose={() => setIsCadetModalOpen(false)}
        onSave={setCadet}
      />

      {/* Mission Debrief & Budget Overrun Modal */}
      <DebriefModal
        cadet={cadet}
        lang={lang}
        mission={currentMission}
        report={debriefReport}
        budgetFailure={getLocalizedBudgetFailure(missionSession, lang)}
        isOpen={debriefReport !== null}
        onClose={() => setDebriefReport(null)}
        onReplay={handleReplayMission}
        onNextMission={handleNextMission}
      />
    </div>
  );
}
