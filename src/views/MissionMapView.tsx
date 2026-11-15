import React, { useState } from 'react';
import {
  CadetProfile,
  DifficultyLevel,
  Language,
  MissionConfig,
  MissionId,
} from '../types/game';
import { MISSIONS } from '../data/missions';
import { getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { getPrimaryDeviceAsset } from '../data/nasaMediaRegistry';
import {
  getMissionInitialBudget,
} from '../data/equipmentSystems';
import { getDifficultyText } from '../services/localization';
import { sound } from '../services/sound';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Compass,
  Cpu,
  Database,
  Gauge,
  Orbit,
  Satellite,
  Telescope,
} from 'lucide-react';
import { NovaVoiceBanner, VerifiedNasaImage } from '../components/NasaVisualBlocks';

interface MissionMapViewProps {
  cadet: CadetProfile;
  lang: Language;
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onSelectMission: (missionId: MissionId, difficulty?: DifficultyLevel) => void;
  onStartDesign: () => void;
  onBack?: () => void;
  onOpenNasaArchive?: (missionId: MissionId) => void;
}

const MISSION_ROLE_TAGS: Record<MissionId, { vi: string; en: string }> = {
  mission_01_mars_rover: {
    vi: 'Điều hướng · Địa hình · Lấy mẫu · Truyền thông',
    en: 'Navigation · Terrain · Rock Sampling · Telemetry',
  },
  mission_02_earth_satellite: {
    vi: 'Xử lý ảnh OLI-2 · Bản đồ nhiệt · Lịch quan sát',
    en: 'OLI-2 Imaging · Thermal Mapping · Orbit Schedule',
  },
  mission_03_space_station: {
    vi: 'Quản lý điện · Điều hòa nhiệt · Hỗ trợ sự sống',
    en: 'Power Bus · Thermal Loops · Life Support',
  },
  mission_04_robotic_arm: {
    vi: 'Điều khiển đa khớp · Kẹp tàu hàng · Camera',
    en: 'Multi-Joint Control · Cargo Grapple · Vision',
  },
  mission_05_space_telescope: {
    vi: 'Quang học WFC3 · Định hướng FGS · Lập lịch sao',
    en: 'WFC3 Optics · FGS Guidance · Star Scheduling',
  },
};

const renderMissionDeviceIcon = (missionId: MissionId, className = 'w-5 h-5') => {
  switch (missionId) {
    case 'mission_01_mars_rover':
      return <Compass className={className} />;
    case 'mission_02_earth_satellite':
      return <Satellite className={className} />;
    case 'mission_03_space_station':
      return <Orbit className={className} />;
    case 'mission_04_robotic_arm':
      return <Cpu className={className} />;
    case 'mission_05_space_telescope':
      return <Telescope className={className} />;
  }
};

export const MissionMapView: React.FC<MissionMapViewProps> = ({
  cadet,
  lang,
  selectedDifficulty,
  onSelectDifficulty,
  onSelectMission,
  onStartDesign,
  onOpenNasaArchive,
}) => {
  const [selectedId, setSelectedId] = useState<MissionId>('mission_01_mars_rover');
  const [step, setStep] = useState<'list' | 'intro'>('list');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const selectedMission = MISSIONS.find((m) => m.id === selectedId) || MISSIONS[0];
  const selectedProfile = getEquipmentProfileByMission(selectedMission.id);
  const selectedHeroAsset = getPrimaryDeviceAsset(selectedMission.id);

  const handleOpenMission = (m: MissionConfig) => {
    sound.playClick();
    sound.stopSpeech();
    setSelectedId(m.id);
    onSelectMission(m.id, selectedDifficulty);
    setStep('intro');
  };

  if (step === 'intro') {
    const budget = getMissionInitialBudget(selectedMission.id, selectedDifficulty);

    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            sound.stopSpeech();
            setStep('list');
          }}
          className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back' : 'Quay lại'}</span>
        </button>

        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm p-5 sm:p-6 space-y-5">
          {selectedHeroAsset && (
            <VerifiedNasaImage asset={selectedHeroAsset} heightClass="h-60 sm:h-72" lang={lang} />
          )}

          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
              {renderMissionDeviceIcon(selectedMission.id, 'w-3.5 h-3.5 text-sky-600')}
              <span>
                {lang === 'en' ? 'Mission' : 'Màn'} {selectedMission.number} · {selectedProfile.agency}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {selectedProfile.preschool.simpleName[lang]}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              {selectedProfile.preschool.usedForShort[lang]}
            </p>
            <p className="text-xs font-semibold text-sky-700">
              {MISSION_ROLE_TAGS[selectedMission.id][lang]}
            </p>
          </div>

          <NovaVoiceBanner
            speechText={`${selectedProfile.preschool.whatIsItSpeech[lang]} ${selectedProfile.preschool.usedForSpeech[lang]}`}
            lang={lang}
            accent="cyan"
            compact
          />

          {/* 4-Level Difficulty & Budget Selector */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-600" />
                <span>{lang === 'en' ? 'Select technical difficulty' : 'Chọn cấp độ kỹ thuật'}</span>
              </span>
              <span className="text-sm font-bold text-emerald-700 tabular-nums">
                {lang === 'en' ? `Max Budget: ${budget} M $` : `Ngân sách tối đa: ${budget} triệu $`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {([1, 2, 3, 4] as DifficultyLevel[]).map((lvl) => {
                const prof = getDifficultyText(lvl, lang);
                const isActive = selectedDifficulty === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSelectDifficulty(lvl);
                      onSelectMission(selectedMission.id, lvl);
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer space-y-1 ${
                      isActive
                        ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                        : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="text-sm font-bold">{prof.title}</div>
                    <div
                      className={`text-xs font-medium leading-snug ${
                        isActive ? 'text-sky-100' : 'text-slate-600'
                      }`}
                    >
                      {prof.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                sound.stopSpeech();
                onStartDesign();
              }}
              className="w-full sm:w-auto min-w-[240px] min-h-12 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>
                {lang === 'en'
                  ? 'Continue to Assembly Lab'
                  : 'Tiếp tục vào phòng lắp ráp'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            {lang === 'en' ? 'Select Technical Mission' : 'Chọn Nhiệm Vụ Kỹ Thuật'}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {lang === 'en'
              ? 'Choose a NASA system to configure components, run safety checks, and troubleshoot operations.'
              : 'Chọn thiết bị NASA để cấu hình linh kiện, kiểm tra an toàn và vận hành xử lý sự cố.'}
          </p>
        </div>

        {onOpenNasaArchive && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              sound.stopSpeech();
              onOpenNasaArchive(selectedId);
            }}
            className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4 text-sky-600" />
            <span>{lang === 'en' ? 'NASA Data' : 'Dữ liệu NASA'}</span>
          </button>
        )}
      </div>

      {/* 5 Verified NASA Equipment Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MISSIONS.map((m) => {
          const isCompleted = cadet.completedMissions.includes(m.id);
          const profile = getEquipmentProfileByMission(m.id);
          const primaryAsset = getPrimaryDeviceAsset(m.id);
          const imageUrl = primaryAsset?.imageUrl || profile.heroImageUrl;
          const isImgFailed = Boolean(failedImages[imageUrl]);

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleOpenMission(m)}
              className="group rounded-2xl bg-white border border-slate-200 hover:border-sky-500 overflow-hidden text-left transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col"
            >
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {!isImgFailed ? (
                  <img
                    src={imageUrl}
                    alt={profile.preschool.simpleName[lang]}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({
                        ...prev,
                        [imageUrl]: true,
                      }))
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-500 bg-slate-50 p-4 text-center">
                    <Camera className="w-7 h-7 text-slate-400" />
                    <span className="text-xs font-semibold">
                      {lang === 'en'
                        ? 'Image temporarily unavailable'
                        : 'Ảnh tạm thời không khả dụng'}
                    </span>
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900/90 text-white'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>
                    {isCompleted
                      ? lang === 'en'
                        ? 'Completed'
                        : 'Đã hoàn thành'
                      : `${lang === 'en' ? 'Mission' : 'Màn'} ${m.number}`}
                  </span>
                </span>
              </div>

              <div className="p-4 flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-sky-600 flex items-center justify-center shrink-0">
                  {renderMissionDeviceIcon(m.id, 'w-5 h-5')}
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-base font-bold text-slate-900 leading-snug break-words">
                    {profile.preschool.simpleName[lang]}
                  </div>
                  <div className="text-xs font-medium text-slate-600 leading-snug break-words">
                    {MISSION_ROLE_TAGS[m.id][lang]}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
