import React, { useState } from 'react';
import { AcademyZone, CadetProfile, Language } from '../types/game';
import { BADGES, MISSIONS } from '../data/missions';
import { sound } from '../services/sound';
import { getDisplayCadetName, getRankLabel } from '../services/storage';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Compass,
  Cpu,
  Globe,
  Lock,
  Pencil,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
  Zap,
} from 'lucide-react';

interface AchievementsViewProps {
  cadet: CadetProfile;
  lang: Language;
  onBack?: () => void;
  onToggleLang?: () => void;
  onOpenCadetModal?: () => void;
  onNavigate?: (zone: AcademyZone) => void;
  onResetProgress?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  cadet,
  lang,
  onOpenCadetModal,
  onResetProgress,
}) => {
  const isEn = lang === 'en';
  const [muted, setMuted] = useState(sound.getMuted());
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleMuteToggle = () => {
    const next = sound.toggleMute();
    setMuted(next);
  };

  const handleConfirmReset = () => {
    sound.playClick();
    onResetProgress?.();
    setIsResetModalOpen(false);
    setResetSuccess(true);
  };

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case 'badge_mars_explorer':
        return <Compass className="w-7 h-7" />;
      case 'badge_earth_observer':
        return <Globe className="w-7 h-7" />;
      case 'badge_energy_guardian':
        return <Zap className="w-7 h-7" />;
      case 'badge_robotics_expert':
        return <Cpu className="w-7 h-7" />;
      case 'badge_space_visionary':
        return <Sparkles className="w-7 h-7" />;
      case 'badge_diagnostic_master':
        return <Wrench className="w-7 h-7" />;
      default:
        return <Award className="w-7 h-7" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Player Profile Card: Name, Rank Level, Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0">
              {cadet.avatar === 'robot' ? (
                <Cpu className="w-8 h-8" />
              ) : cadet.avatar === 'engineer' ? (
                <Wrench className="w-8 h-8" />
              ) : (
                <Compass className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {getDisplayCadetName(cadet.name, lang)}
                </h1>
                {onOpenCadetModal && (
                  <button
                    type="button"
                    aria-label={isEn ? 'Edit profile' : 'Chỉnh sửa hồ sơ'}
                    onClick={() => {
                      sound.playClick();
                      onOpenCadetModal();
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 flex items-center justify-center text-sky-600 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm font-semibold text-sky-700">{getRankLabel(cadet.rank, lang)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleMuteToggle}
              className="h-10 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-rose-600" />
              ) : (
                <Volume2 className="w-4 h-4 text-sky-600" />
              )}
              <span>
                {isEn
                  ? muted
                    ? 'Audio: Off'
                    : 'Audio: On'
                  : muted
                  ? 'Âm thanh: Tắt'
                  : 'Âm thanh: Bật'}
              </span>
            </button>

            {onResetProgress && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setResetSuccess(false);
                  setIsResetModalOpen(true);
                }}
                className="h-10 px-4 rounded-lg bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isEn ? 'Reset Progress' : 'Đặt lại tiến độ'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-xs font-medium text-slate-600">
              {isEn ? 'Experience Points' : 'Điểm kinh nghiệm'}
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">{cadet.xp} XP</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-xs font-medium text-slate-600">
              {isEn ? 'Missions Completed' : 'Nhiệm vụ hoàn thành'}
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {cadet.completedMissions.length} / {MISSIONS.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-xs font-medium text-slate-600">
              {isEn ? 'Faults Resolved' : 'Sự cố đã khắc phục'}
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {cadet.anomaliesResolved}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <div className="text-xs font-medium text-slate-600">
              {isEn ? 'Photos & Samples' : 'Ảnh & Mẫu thu thập'}
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {cadet.totalPhotosTaken + cadet.totalSamplesAnalyzed}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Notice After Reset */}
      {resetSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {isEn
              ? 'Your mission progress and achievements have been reset to their initial state.'
              : 'Toàn bộ tiến độ nhiệm vụ và thành tích chơi đã được đặt lại về trạng thái ban đầu.'}
          </span>
        </div>
      )}

      {/* Badges Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isEn ? 'Technical Badges' : 'Huy hiệu kỹ thuật'}
          </h2>
          <span className="text-sm font-semibold text-slate-600 tabular-nums">
            {cadet.unlockedBadges.length} / {BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = cadet.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-xl border flex items-start gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-50 border-amber-300 text-amber-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? getBadgeIcon(badge.id) : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {badge.name[lang]}
                    </h3>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {badge.desc[lang]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-progress-title"
            className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 id="reset-progress-title" className="text-lg font-bold text-slate-900">
                  {isEn ? 'Reset Progress?' : 'Đặt lại tiến độ?'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isEn
                    ? 'Your mission progress and achievements will be reset. Are you sure you want to start over?'
                    : 'Toàn bộ tiến độ nhiệm vụ và thành tích chơi hiện tại sẽ được đặt lại. Bạn có chắc chắn muốn bắt đầu lại từ đầu không?'}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsResetModalOpen(false);
                }}
                className="w-full sm:w-auto min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="w-full sm:w-auto min-h-10 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm cursor-pointer"
              >
                {isEn ? 'Confirm Reset' : 'Xác nhận đặt lại'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
