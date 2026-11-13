import React, { useState } from 'react';
import { KnowledgeAccuracyTag, Language, MissionId } from '../types/game';
import { getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { sound } from '../services/sound';
import { PreschoolStoryExplorer } from './NasaVisualBlocks';
import { BookOpen, ChevronDown, ChevronUp, Database } from 'lucide-react';

interface MissionOpeningBriefingProps {
  missionId: MissionId;
  lang: Language;
  defaultExpanded?: boolean;
  onOpenNasaArchive?: (missionId: MissionId) => void;
}

export const AccuracyTagBadge: React.FC<{ tag: KnowledgeAccuracyTag; lang: Language }> = ({
  tag,
  lang,
}) => {
  if (tag === 'FACT') {
    return (
      <span
        title={
          lang === 'vi'
            ? 'Thông tin thực tế từ nguồn chính thức NASA / JPL / USGS / CSA'
            : 'Verified facts from NASA / JPL / USGS / CSA'
        }
        className="text-xs font-bold text-emerald-700"
      >
        {lang === 'vi' ? 'Thông tin thật NASA' : 'FACT'}
      </span>
    );
  }
  if (tag === 'SIMPLIFIED FOR LEARNING') {
    return (
      <span
        title={
          lang === 'vi'
            ? 'Diễn giải đơn giản, dễ hiểu cho bé dựa trên kiến thức NASA'
            : 'Child-friendly explanation grounded in real NASA science'
        }
        className="text-xs font-bold text-sky-700"
      >
        {lang === 'vi' ? 'Kiến thức cho bé' : 'SIMPLIFIED FOR LEARNING'}
      </span>
    );
  }
  return (
    <span
      title={
        lang === 'vi'
          ? 'Tình huống mô phỏng phục vụ trò chơi'
          : 'Simulated scenario created for gameplay learning'
      }
      className="text-xs font-bold text-amber-700"
    >
      {lang === 'vi' ? 'Mô phỏng trò chơi' : 'GAME SIMULATION'}
    </span>
  );
};

export const MissionOpeningBriefing: React.FC<MissionOpeningBriefingProps> = ({
  missionId,
  lang,
  defaultExpanded = true,
  onOpenNasaArchive,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const profile = getEquipmentProfileByMission(missionId);
  const kid = profile.preschool;

  return (
    <div className="rounded-3xl bg-white border-2 border-sky-200 shadow-sm overflow-hidden">
      {/* Cheerful Kid-Friendly Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-100 via-sky-50 to-amber-50/60 border-b border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-sky-200 text-2xl flex items-center justify-center shrink-0 shadow-sm">
            {kid.badgeEmoji}
          </div>
          <div>
            <div className="text-xs font-extrabold text-sky-600">
              {lang === 'vi'
                ? `Làm quen thiết bị màn ${profile.missionNumber}`
                : `Meet the Mission ${profile.missionNumber} Explorer`}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-sky-950 font-display leading-snug">
              {kid.simpleName[lang]}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenNasaArchive && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                sound.stopSpeech();
                onOpenNasaArchive(missionId);
              }}
              className="min-h-11 px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Database className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Xem dữ liệu NASA' : 'View NASA Data'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (expanded) sound.stopSpeech();
              setExpanded((prev) => !prev);
            }}
            className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>
              {expanded
                ? lang === 'vi'
                  ? 'Thu gọn'
                  : 'Hide'
                : lang === 'vi'
                ? 'Khám phá'
                : 'Explore'}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Single-Focus 4-Step Preschool Explorer */}
      {expanded && (
        <div className="p-3 sm:p-5 bg-sky-50/50">
          <PreschoolStoryExplorer profile={profile} lang={lang} />
        </div>
      )}
    </div>
  );
};
