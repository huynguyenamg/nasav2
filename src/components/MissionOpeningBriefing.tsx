import React, { useState } from 'react';
import { KnowledgeAccuracyTag, Language, MissionId } from '../types/game';
import { getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { sound } from '../services/sound';
import { PreschoolStoryExplorer } from './NasaVisualBlocks';
import { BookOpen, ChevronDown, ChevronUp, Cpu, Database } from 'lucide-react';

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
        className="text-xs font-semibold text-emerald-700"
      >
        {lang === 'vi' ? 'Thông tin thật NASA' : 'Verified NASA Fact'}
      </span>
    );
  }
  if (tag === 'SIMPLIFIED FOR LEARNING') {
    return (
      <span
        title={
          lang === 'vi'
            ? 'Diễn giải kỹ thuật chuẩn xác cho học sinh THCS dựa trên tài liệu NASA'
            : 'Clear engineering summary grounded in NASA science'
        }
        className="text-xs font-semibold text-sky-700"
      >
        {lang === 'vi' ? 'Tóm tắt kỹ thuật' : 'Technical Summary'}
      </span>
    );
  }
  return (
    <span
      title={
        lang === 'vi'
          ? 'Tình huống mô phỏng kỹ thuật phục vụ thực hành'
          : 'Simulated engineering scenario for training'
      }
      className="text-xs font-semibold text-amber-700"
    >
      {lang === 'vi' ? 'Mô phỏng kỹ thuật' : 'Engineering Simulation'}
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
  const info = profile.preschool;

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-700">
              {lang === 'en'
                ? `Equipment Overview · Mission ${profile.missionNumber}`
                : `Tổng quan thiết bị · Nhiệm vụ ${profile.missionNumber}`}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {info.simpleName[lang]}
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
              className="min-h-10 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>{lang === 'en' ? 'NASA Data' : 'Dữ liệu NASA'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (expanded) sound.stopSpeech();
              setExpanded((prev) => !prev);
            }}
            className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{expanded ? (lang === 'en' ? 'Collapse' : 'Thu gọn') : lang === 'en' ? 'Expand' : 'Mở rộng'}</span>
            {expanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 sm:p-5 bg-slate-50/50">
          <PreschoolStoryExplorer profile={profile} lang={lang} />
        </div>
      )}
    </div>
  );
};
