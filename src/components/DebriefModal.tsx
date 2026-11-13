import React from 'react';
import {
  CadetProfile,
  Language,
  MissionConfig,
  MissionEvaluationReport,
} from '../types/game';
import { sound } from '../services/sound';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react';

interface DebriefModalProps {
  cadet: CadetProfile;
  lang: Language;
  mission: MissionConfig;
  report: MissionEvaluationReport | null;
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  onNextMission: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({
  mission,
  report,
  isOpen,
  onReplay,
  onNextMission,
}) => {
  if (!isOpen || !report) return null;

  const overBudget = report.totalCost > report.initialBudget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-2 border-sky-200 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Celebration / Outcome */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={
              report.passed
                ? '/src/assets/images/sunny_robot_celebration_1794563132184.jpg'
                : '/src/assets/images/sunny_robot_fix_retry_1794563132553.jpg'
            }
            alt={report.outcomeTitle}
            referrerPolicy="no-referrer"
            className="w-28 h-28 rounded-3xl object-cover border-2 border-sky-200 shrink-0"
          />

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm border border-amber-300 tabular-nums">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Điểm kỹ thuật: {report.finalScore}/100</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-100 text-sky-900 font-extrabold text-sm border border-sky-200 tabular-nums">
                <span>+{report.xpEarned} Kinh nghiệm</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-sky-950 font-display">
              {report.outcomeTitle}
            </h2>
            <p className="text-sm font-semibold text-sky-800">{mission.title.vi}</p>
          </div>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div
            className={`p-3 rounded-2xl border-2 text-center space-y-0.5 ${
              overBudget ? 'bg-rose-50 border-rose-200' : 'bg-sky-50 border-sky-200'
            }`}
          >
            <div className="text-[11px] font-bold text-sky-700 flex items-center justify-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>Tổng chi phí</span>
            </div>
            <div
              className={`text-sm font-extrabold tabular-nums ${
                overBudget ? 'text-rose-800' : 'text-sky-950'
              }`}
            >
              {report.totalCost} / {report.initialBudget} tr$
            </div>
          </div>

          <div className="p-3 rounded-2xl border-2 bg-sky-50 border-sky-200 text-center space-y-0.5">
            <div className="text-[11px] font-bold text-sky-700 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hiệu suất</span>
            </div>
            <div className="text-sm font-extrabold text-sky-950 tabular-nums">
              {report.performancePct}%
            </div>
          </div>

          <div className="p-3 rounded-2xl border-2 bg-sky-50 border-sky-200 text-center space-y-0.5">
            <div className="text-[11px] font-bold text-sky-700 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Độ an toàn</span>
            </div>
            <div className="text-sm font-extrabold text-sky-950 tabular-nums">
              {report.safetyPct}%
            </div>
          </div>

          <div className="p-3 rounded-2xl border-2 bg-sky-50 border-sky-200 text-center space-y-0.5">
            <div className="text-[11px] font-bold text-sky-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Hoàn thành</span>
            </div>
            <div className="text-sm font-extrabold text-sky-950 tabular-nums">
              {report.completionPct}% · Chẩn đoán {report.diagnosisAccuracyPct}%
            </div>
          </div>
        </div>

        {/* Good Choices & Suboptimal Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
            <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Những lựa chọn tốt</span>
            </div>
            <ul className="space-y-1.5 text-emerald-950 font-semibold list-disc pl-4">
              {report.goodChoices.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
            <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Điểm cần rút kinh nghiệm</span>
            </div>
            <ul className="space-y-1.5 text-amber-950 font-semibold list-disc pl-4">
              {report.suboptimalChoices.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Lesson */}
        <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-1">
          <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Bài học kỹ thuật NASA</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-sky-950 leading-relaxed">
            {report.technicalLesson}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onReplay();
            }}
            className="w-full sm:w-auto min-h-12 px-5 py-3 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại nhiệm vụ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSuccess();
              onNextMission();
            }}
            className="w-full flex-1 min-h-12 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Nhiệm vụ tiếp theo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
