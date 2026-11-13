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
import {
  DIFFICULTY_PROFILES,
  getMissionInitialBudget,
} from '../data/equipmentSystems';
import { sound } from '../services/sound';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, Gauge } from 'lucide-react';
import { MediaBadge, NovaVoiceBanner } from '../components/NasaVisualBlocks';

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

const MISSION_ROLE_TAGS: Record<MissionId, string> = {
  mission_01_mars_rover: 'Lái xe · Địa hình · Lấy mẫu · Truyền thông',
  mission_02_earth_satellite: 'Xử lý ảnh OLI-2 · Bản đồ nhiệt · Lịch quan sát',
  mission_03_space_station: 'Quản lý điện · Điều hòa nhiệt · Tài nguyên phi hành gia',
  mission_04_robotic_arm: 'Điều khiển đa khớp · Gắp tàu hàng · Camera',
  mission_05_space_telescope: 'Quang học WFC3 · Định hướng FGS · Lập lịch sao',
};

export const MissionMapView: React.FC<MissionMapViewProps> = ({
  cadet,
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

  const handleOpenMission = (m: MissionConfig) => {
    sound.playClick();
    sound.stopSpeech();
    setSelectedId(m.id);
    onSelectMission(m.id, selectedDifficulty);
    setStep('intro');
  };

  if (step === 'intro') {
    const heroSrc = failedImages[selectedProfile.heroImageUrl]
      ? selectedProfile.fallbackImageUrl
      : selectedProfile.heroImageUrl;
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
          className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="rounded-3xl bg-white border-2 border-sky-200 overflow-hidden shadow-md">
          <div className="relative h-60 sm:h-72 w-full bg-sky-100">
            <img
              src={heroSrc}
              alt={selectedProfile.preschool.simpleName.vi}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedImages((prev) => ({
                  ...prev,
                  [selectedProfile.heroImageUrl]: true,
                }))
              }
              className="w-full h-full object-cover brightness-105"
            />
            <div className="absolute top-3 left-3">
              <MediaBadge mediaKind="real_photo" isRealPhoto={true} lang="vi" />
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-sky-950 font-display">
                {selectedProfile.preschool.simpleName.vi}
              </h1>
              <p className="text-base text-sky-900/85 font-medium max-w-2xl mx-auto">
                {selectedProfile.preschool.usedForShort.vi}
              </p>
              <p className="text-xs font-bold text-sky-600">
                {MISSION_ROLE_TAGS[selectedMission.id]}
              </p>
            </div>

            <NovaVoiceBanner
              speechText={`${selectedProfile.preschool.whatIsItSpeech.vi} ${selectedProfile.preschool.usedForSpeech.vi}`}
              lang="vi"
              accent="cyan"
              compact
            />

            {/* 4-Level Difficulty & Budget Selector */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-600" />
                  <span>Chọn cấp độ kỹ thuật</span>
                </span>
                <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                  Ngân sách nhiệm vụ: {budget} triệu $
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {([1, 2, 3, 4] as DifficultyLevel[]).map((lvl) => {
                  const prof = DIFFICULTY_PROFILES[lvl];
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
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 ${
                        isActive
                          ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                          : 'bg-sky-50/60 text-sky-950 border-sky-200 hover:border-sky-400'
                      }`}
                    >
                      <div className="text-sm font-extrabold">{prof.title}</div>
                      <div
                        className={`text-xs font-medium leading-snug ${
                          isActive ? 'text-sky-50' : 'text-sky-800/80'
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
                className="w-full sm:w-auto min-w-[240px] min-h-14 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-950 font-display">
          Chọn Nhiệm Vụ
        </h1>

        {onOpenNasaArchive && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              sound.stopSpeech();
              onOpenNasaArchive(selectedId);
            }}
            className="min-h-11 px-5 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Database className="w-4 h-4 text-sky-600" />
            <span>Dữ liệu NASA</span>
          </button>
        )}
      </div>

      {/* 5 Large Photo Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MISSIONS.map((m) => {
          const isCompleted = cadet.completedMissions.includes(m.id);
          const profile = getEquipmentProfileByMission(m.id);
          const cardImg = failedImages[profile.heroImageUrl]
            ? profile.fallbackImageUrl
            : profile.heroImageUrl;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleOpenMission(m)}
              className="group rounded-3xl bg-white border-2 border-sky-200 hover:border-sky-400 overflow-hidden text-left transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="relative h-48 w-full bg-sky-100 overflow-hidden">
                <img
                  src={cardImg}
                  alt={profile.preschool.simpleName.vi}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [profile.heroImageUrl]: true,
                    }))
                  }
                  className="w-full h-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/95 text-sky-800 border border-sky-200'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  <span>{isCompleted ? 'Đã xong' : `Màn ${m.number}`}</span>
                </span>
              </div>

              <div className="p-4 flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-sky-100 text-2xl flex items-center justify-center shrink-0">
                  {profile.preschool.badgeEmoji}
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-bold text-sky-950 leading-snug">
                    {profile.preschool.simpleName.vi}
                  </div>
                  <div className="text-xs font-medium text-sky-700 truncate">
                    {MISSION_ROLE_TAGS[m.id]}
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
