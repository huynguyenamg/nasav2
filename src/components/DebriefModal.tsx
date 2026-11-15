import React from 'react';
import {
  BudgetFailureInfo,
  CadetProfile,
  Language,
  MissionConfig,
  MissionEvaluationReport,
} from '../types/game';
import { sound } from '../services/sound';
import {
  AlertOctagon,
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
  budgetFailure?: BudgetFailureInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  onNextMission: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({
  lang,
  mission,
  report,
  budgetFailure,
  isOpen,
  onReplay,
  onNextMission,
}) => {
  if (!isOpen || !report) return null;

  const isEn = lang === 'en';
  const unitM = isEn ? 'M $' : 'triệu $';
  const unitShort = isEn ? 'M$' : 'tr$';
  const isBudgetFailure = Boolean(report.budgetExceeded || budgetFailure?.failed);
  const overBudget = report.totalCost > report.initialBudget;
  const overrunAmount =
    report.overrunAmount ??
    budgetFailure?.overrunAmount ??
    Math.max(0, report.totalCost - report.initialBudget);

  // Dedicated Clear Budget Overrun Failure Report Screen
  if (isBudgetFailure) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? 'MISSION FAILED' : 'NHIỆM VỤ THẤT BẠI'}
          className="w-full max-w-2xl bg-white border-2 border-rose-300 rounded-xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Red Header Alert */}
          <div className="p-4 sm:p-5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-9 h-9" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                {mission.title[lang]}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-rose-900">
                {isEn ? 'MISSION FAILED' : 'NHIỆM VỤ THẤT BẠI'}
              </h2>
              <p className="text-sm font-semibold text-rose-800">
                {isEn
                  ? 'You have exceeded the authorized budget.'
                  : 'Bạn đã vượt quá ngân sách cho phép.'}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 leading-relaxed">
            {isEn
              ? 'This equipment cannot continue repairs within the budget limits of this mission.'
              : 'Thiết bị không thể tiếp tục được sửa chữa trong giới hạn ngân sách của nhiệm vụ này.'}
          </p>

          {/* 3 Mandatory Financial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-600">
                {isEn ? 'Max Budget' : 'Ngân sách tối đa'}
              </div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {report.initialBudget} {unitM}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-center space-y-1">
              <div className="text-xs font-semibold text-rose-700">
                {isEn ? 'Total Cost' : 'Tổng chi phí'}
              </div>
              <div className="text-lg font-bold text-rose-800 tabular-nums">
                {report.totalCost} {unitM}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-600 text-white text-center space-y-1">
              <div className="text-xs font-semibold text-rose-100">
                {isEn ? 'Over Budget' : 'Vượt ngân sách'}
              </div>
              <div className="text-lg font-bold tabular-nums">
                +{overrunAmount} {unitM}
              </div>
            </div>
          </div>

          {/* Breakdown: Decisions causing overrun + Largest expense items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {isEn ? 'Budget Overrun Decisions' : 'Quyết định làm vượt ngân sách'}
                </span>
              </div>
              <ul className="space-y-1.5 text-rose-950 list-disc pl-4">
                {(budgetFailure?.overBudgetDecisions || report.suboptimalChoices).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isEn ? 'Largest Expenses' : 'Các khoản chi lớn nhất'}</span>
              </div>
              {budgetFailure?.topExpenses && budgetFailure.topExpenses.length > 0 ? (
                <ul className="space-y-1.5 text-slate-800">
                  {budgetFailure.topExpenses.map((exp, i) => (
                    <li key={i} className="flex items-start justify-between gap-2">
                      <span className="leading-snug flex-1 min-w-0 break-words">{exp.label}</span>
                      <span className="font-bold text-slate-900 tabular-nums shrink-0">
                        {exp.amount} {unitShort}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-700">
                  {isEn
                    ? `Total parts and repair expenses exceeded the ${report.initialBudget} M$ cap.`
                    : `Tổng chi phí linh kiện và sửa chữa vượt mức tối đa ${report.initialBudget} triệu $.`}
                </p>
              )}
            </div>
          </div>

          {/* Budgeting Advice */}
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 space-y-1">
            <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {isEn
                  ? 'Budget Optimization Advice'
                  : 'Gợi ý phân bổ ngân sách hợp lý hơn'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {budgetFailure?.advice || report.technicalLesson}
            </p>
          </div>

          {/* Replay Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="w-full h-11 px-5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Replay Mission' : 'Chơi lại nhiệm vụ'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Realistic Aerospace Outcome Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={
              report.passed
                ? '/src/assets/images/mission_success_orbit_1794626911408.jpg'
                : '/src/assets/images/mission_calibration_bench_1794626912229.jpg'
            }
            alt={report.outcomeTitle}
            referrerPolicy="no-referrer"
            className="w-28 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
          />

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-900 font-semibold text-xs border border-amber-200 tabular-nums">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isEn ? 'Engineering Score' : 'Điểm kỹ thuật'}: {report.finalScore}/100
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-sky-50 text-sky-900 font-semibold text-xs border border-sky-200 tabular-nums">
                <span>
                  +{report.xpEarned} {isEn ? 'XP' : 'điểm kinh nghiệm'}
                </span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {report.outcomeTitle}
            </h2>
            <p className="text-sm font-medium text-slate-600">{mission.title[lang]}</p>
          </div>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div
            className={`p-3 rounded-lg border text-center space-y-0.5 ${
              overBudget ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>{isEn ? 'Total Cost' : 'Tổng chi phí'}</span>
            </div>
            <div
              className={`text-sm font-bold tabular-nums ${
                overBudget ? 'text-rose-800' : 'text-slate-900'
              }`}
            >
              {report.totalCost} / {report.initialBudget} {unitShort}
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-center space-y-0.5">
            <div className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEn ? 'Performance' : 'Hiệu suất'}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {report.performancePct}%
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-center space-y-0.5">
            <div className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? 'Safety' : 'Độ an toàn'}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {report.safetyPct}%
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 text-center space-y-0.5">
            <div className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{isEn ? 'Completion' : 'Hoàn thành'}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {report.completionPct}% · {isEn ? 'Diagnosis' : 'Chẩn đoán'} {report.diagnosisAccuracyPct}%
            </div>
          </div>
        </div>

        {/* Good Choices & Suboptimal Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isEn ? 'Effective Decisions' : 'Lựa chọn hiệu quả'}</span>
            </div>
            <ul className="space-y-1.5 text-emerald-950 list-disc pl-4">
              {report.goodChoices.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isEn ? 'Areas to Improve' : 'Điểm cần rút kinh nghiệm'}</span>
            </div>
            <ul className="space-y-1.5 text-amber-950 list-disc pl-4">
              {report.suboptimalChoices.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Lesson */}
        <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 space-y-1">
          <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{isEn ? 'NASA Engineering Takeaway' : 'Bài học kỹ thuật NASA'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
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
            className="w-full sm:w-auto h-11 px-5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Replay Mission' : 'Làm lại nhiệm vụ'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSuccess();
              onNextMission();
            }}
            className="w-full flex-1 h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isEn ? 'Next Mission' : 'Nhiệm vụ tiếp theo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
