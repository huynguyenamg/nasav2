import React, { useState, useEffect } from 'react';
import { CadetProfile, Language, MissionConfig, MissionSessionState } from '../types/game';
import { evaluateSystemSafety } from '../data/equipmentSystems';
import { sound } from '../services/sound';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Play,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

interface LaunchCenterViewProps {
  cadet: CadetProfile;
  lang: Language;
  mission: MissionConfig;
  session: MissionSessionState;
  onUpdateSession: (session: MissionSessionState) => void;
  onLaunchComplete: () => void;
  onBack?: () => void;
}

export const LaunchCenterView: React.FC<LaunchCenterViewProps> = ({
  lang,
  mission,
  session,
  onUpdateSession,
  onLaunchComplete,
  onBack,
}) => {
  const isEn = lang === 'en';
  const [countdown, setCountdown] = useState<number | null>(null);
  const [launchStage, setLaunchStage] = useState<'check' | 'pad' | 'countdown' | 'liftoff' | 'staging' | 'orbit'>('check');
  const [altitudeKm, setAltitudeKm] = useState(0);

  const safetyReport = evaluateSystemSafety(
    mission.id,
    session.subsystems,
    session.economy,
    lang
  );
  const isBudgetFailed = Boolean(session.budgetFailure?.failed);

  const handleConfirmCheckAndProceed = (acceptedRisk: boolean) => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    sound.playClick();
    onUpdateSession({
      ...session,
      safetyChecksRun: session.safetyChecksRun + 1,
      safetyWarningsIgnored: acceptedRisk
        ? session.safetyWarningsIgnored + 1
        : session.safetyWarningsIgnored,
      preDeployReport: safetyReport,
    });
    setLaunchStage('pad');
  };

  const startCountdown = () => {
    if (isBudgetFailed) {
      sound.playAlert();
      return;
    }
    sound.playClick();
    setCountdown(3);
    setLaunchStage('countdown');
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      sound.playClick();
      const timer = setTimeout(() => {
        setCountdown((c) => (c !== null ? c - 1 : null));
      }, 850);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      sound.playLaunchIgnition();
      setLaunchStage('liftoff');
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    if (launchStage !== 'liftoff' && launchStage !== 'staging') return;
    const interval = setInterval(() => {
      setAltitudeKm((prev) => {
        const next = prev + 30;
        if (next >= 120 && launchStage === 'liftoff') {
          setLaunchStage('staging');
          sound.playEquip();
        }
        if (next >= 420) {
          setLaunchStage('orbit');
          sound.playSuccess();
          clearInterval(interval);
          return 420;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [launchStage]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back' : 'Quay lại'}</span>
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          {isEn
            ? `Inspection & Deployment · ${mission.title.en}`
            : `Kiểm Tra & Triển Khai · ${mission.title.vi}`}
        </h1>
      </div>

      {launchStage === 'check' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {isEn
                  ? 'Pre-Deployment Safety Inspection'
                  : 'Kiểm tra an toàn trước khi triển khai'}
              </h2>
            </div>

            <span
              className={`px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 ${
                safetyReport.status === 'READY'
                  ? 'bg-emerald-600 text-white'
                  : safetyReport.status === 'WARNING'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {safetyReport.status === 'READY' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : safetyReport.status === 'WARNING' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <AlertOctagon className="w-4 h-4" />
              )}
              <span>
                {safetyReport.status === 'READY'
                  ? isEn
                    ? 'Passed · Ready'
                    : 'Đạt chuẩn · Sẵn sàng'
                  : safetyReport.status === 'WARNING'
                  ? isEn
                    ? 'Caution · Risk Detected'
                    : 'Cảnh báo rủi ro'
                  : isEn
                  ? 'Failed · Not Ready'
                  : 'Chưa đạt yêu cầu'}
              </span>
            </span>
          </div>

          <p
            className={`p-3.5 rounded-xl border text-sm font-semibold ${
              safetyReport.status === 'READY'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : safetyReport.status === 'WARNING'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {safetyReport.summary}
          </p>

          <div className="space-y-2.5">
            {safetyReport.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  {chk.level === 'ok' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : chk.level === 'warn' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-900">{chk.label}</div>
                    <div className="text-xs font-medium text-slate-600">{chk.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {safetyReport.status === 'FAILED' ? (
              onBack && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onBack();
                  }}
                  className="min-h-11 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{isEn ? 'Back to adjust components' : 'Quay lại chỉnh linh kiện'}</span>
                </button>
              )
            ) : safetyReport.status === 'WARNING' ? (
              <>
                {onBack && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onBack();
                    }}
                    className="min-h-11 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{isEn ? 'Back to upgrade' : 'Quay lại nâng cấp'}</span>
                  </button>
                )}
                <button
                  type="button"
                  disabled={isBudgetFailed}
                  onClick={() => handleConfirmCheckAndProceed(true)}
                  className="min-h-11 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {isEn ? 'Deploy anyway (accept risk)' : 'Vẫn triển khai (chấp nhận rủi ro)'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isBudgetFailed}
                onClick={() => handleConfirmCheckAndProceed(false)}
                className="min-h-11 px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isEn ? 'Confirm ready to deploy' : 'Xác nhận sẵn sàng triển khai'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Telemetry Orbital Launch Sequence */}
      {launchStage !== 'check' && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 h-[380px] sm:h-[440px] flex flex-col justify-between p-6 shadow-md">
          <div className="relative z-10 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-white">
              {isEn ? 'Deployment altitude' : 'Độ cao triển khai'}:{' '}
              <span className="text-sky-400 tabular-nums">{altitudeKm} km</span>
            </span>
            <div className="flex-1 max-w-xs h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (altitudeKm / 420) * 100)}%` }}
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-auto">
            {countdown !== null && (
              <div className="text-8xl sm:text-9xl font-black font-display text-sky-400">
                {countdown}
              </div>
            )}

            {launchStage === 'pad' && (
              <div className="text-center space-y-5">
                <div className="w-20 h-36 bg-gradient-to-t from-slate-700 via-slate-200 to-sky-400 rounded-t-full border-2 border-slate-300 flex items-center justify-center mx-auto shadow-lg">
                  <Rocket className="w-9 h-9 text-slate-900 -rotate-45" />
                </div>
                <button
                  type="button"
                  disabled={isBudgetFailed}
                  onClick={startCountdown}
                  className="min-h-13 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base rounded-xl shadow-md flex items-center gap-2.5 mx-auto transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isEn ? 'Initiate Launch' : 'Bắt đầu phóng'}</span>
                </button>
              </div>
            )}

            {(launchStage === 'liftoff' || launchStage === 'staging') && (
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-16 h-32 bg-gradient-to-t from-slate-700 via-slate-200 to-sky-400 rounded-t-full border-2 border-slate-300 flex items-center justify-center shadow-lg">
                  <Rocket className="w-8 h-8 text-slate-900 -rotate-45" />
                </div>
                <div className="w-10 h-16 bg-gradient-to-b from-amber-400 via-orange-500 to-transparent rounded-b-full" />
              </div>
            )}

            {launchStage === 'orbit' && (
              <div className="text-center space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg max-w-md animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                  <Rocket className="w-8 h-8 -rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {isEn ? 'Deployed to mission zone' : 'Đã triển khai vào khu vực nhiệm vụ'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onLaunchComplete();
                  }}
                  className="w-full min-h-11 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isEn ? 'Enter Operations Console' : 'Vào điều khiển thiết bị'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 text-xs font-medium text-slate-300 text-center">
            {mission.targetLocation[lang]}
          </div>
        </div>
      )}
    </div>
  );
};
