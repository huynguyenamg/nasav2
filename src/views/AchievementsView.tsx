import React, { useState } from 'react';
import { AcademyZone, CadetProfile, Language } from '../types/game';
import { BADGES } from '../data/missions';
import { sound } from '../services/sound';
import { getRankLabel } from '../services/storage';
import {
  Award,
  CheckCircle2,
  Compass,
  Cpu,
  Globe,
  Lock,
  Pencil,
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
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  cadet,
  onOpenCadetModal,
}) => {
  const [muted, setMuted] = useState(sound.getMuted());

  const handleMuteToggle = () => {
    const next = sound.toggleMute();
    setMuted(next);
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
      {/* Player Profile Card: Name, Rank Level, Points */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-100 via-white to-amber-50 border-2 border-sky-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-sky-200 flex items-center justify-center text-4xl shadow-sm shrink-0">
            {cadet.avatar === 'robot' ? '🤖' : cadet.avatar === 'engineer' ? '👩‍🔬' : '🧑‍🚀'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-sky-950">{cadet.name}</h1>
              {onOpenCadetModal && (
                <button
                  type="button"
                  aria-label="Đổi tên nhân vật"
                  onClick={() => {
                    sound.playClick();
                    onOpenCadetModal();
                  }}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm font-bold text-sky-800">{getRankLabel(cadet.rank)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMuteToggle}
            className="h-11 px-4 rounded-2xl bg-white hover:bg-sky-50 border-2 border-sky-200 flex items-center gap-2 cursor-pointer text-sm font-bold text-sky-900"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-600" />
            )}
            <span>{muted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}</span>
          </button>

          <div className="px-5 py-2.5 rounded-2xl bg-amber-400 text-sky-950 font-black text-lg tabular-nums shadow-sm">
            {cadet.xp} Điểm
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-sky-950">Huy hiệu đạt được</h2>
          <span className="text-sm font-bold text-sky-700 tabular-nums">
            {cadet.unlockedBadges.length} / {BADGES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = cadet.unlockedBadges.includes(badge.id) || cadet.xp >= 350;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border-2 flex items-start gap-4 transition-all shadow-sm ${
                  isUnlocked
                    ? 'bg-white border-amber-300'
                    : 'bg-sky-50/70 border-sky-200 opacity-75'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                    isUnlocked
                      ? 'bg-amber-100 border-amber-300 text-amber-600'
                      : 'bg-white border-sky-200 text-sky-400'
                  }`}
                >
                  {isUnlocked ? getBadgeIcon(badge.id) : <Lock className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sky-950 text-base">{badge.name.vi}</h3>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-sky-800/80 font-medium leading-relaxed">
                    {badge.desc.vi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

