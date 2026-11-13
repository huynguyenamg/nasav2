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
  mission,
  session,
  onUpdateSession,
  onLaunchComplete,
  onBack,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [launchStage, setLaunchStage] = useState<'check' | 'pad' | 'countdown' | 'liftoff' | 'staging' | 'orbit'>('check');
  const [altitudeKm, setAltitudeKm] = useState(0);

  const safetyReport = evaluateSystemSafety(mission.id, session.subsystems, session.economy);

  const handleConfirmCheckAndProceed = (acceptedRisk: boolean) => {
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
            className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-950 font-display">
          Kiểm Tra & Triển Khai · {mission.title.vi}
        </h1>
      </div>

      {launchStage === 'check' && (
        <div className="rounded-3xl bg-white border-2 border-sky-200 p-6 shadow-md space-y-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              <h2 className="text-xl font-bold text-sky-950 font-display">
                Kiểm tra an toàn trước khi triển khai
              </h2>
            </div>

            <span
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 ${
                safetyReport.status === 'READY'
                  ? 'bg-emerald-500 text-white'
                  : safetyReport.status === 'WARNING'
                  ? 'bg-amber-400 text-sky-950'
                  : 'bg-rose-500 text-white'
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
                  ? 'READY · Sẵn sàng'
                  : safetyReport.status === 'WARNING'
                  ? 'WARNING · Cảnh báo rủi ro'
                  : 'FAILED · Không đạt'}
              </span>
            </span>
          </div>

          <p
            className={`p-3.5 rounded-2xl border-2 text-sm font-bold ${
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
                className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200 flex items-start justify-between gap-3"
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
                    <div className="text-sm font-extrabold text-sky-950">{chk.label}</div>
                    <div className="text-xs font-semibold text-sky-800/85">{chk.detail}</div>
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
                  className="min-h-12 px-7 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại chỉnh linh kiện</span>
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
                    className="min-h-12 px-6 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại nâng cấp</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleConfirmCheckAndProceed(true)}
                  className="min-h-12 px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sky-950 font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Vẫn triển khai (chấp nhận rủi ro)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleConfirmCheckAndProceed(false)}
                className="min-h-12 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Xác nhận sẵn sàng triển khai</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sunny Daytime Sky Launch Canvas */}
      {launchStage !== 'check' && (
        <div className="relative rounded-3xl overflow-hidden border-2 border-sky-200 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 h-[380px] sm:h-[440px] flex flex-col justify-between p-6 shadow-md">
          <div className="relative z-10 p-3.5 rounded-2xl bg-white/90 border border-sky-200 flex items-center justify-between gap-4 shadow-sm">
            <span className="text-sm font-bold text-sky-950">
              Độ cao triển khai: <span className="text-sky-600 tabular-nums">{altitudeKm} km</span>
            </span>
            <div className="flex-1 max-w-xs h-3 bg-sky-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (altitudeKm / 420) * 100)}%` }}
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-auto">
            {countdown !== null && (
              <div className="text-8xl sm:text-9xl font-black font-display text-orange-500 drop-shadow-sm">
                {countdown}
              </div>
            )}

            {launchStage === 'pad' && (
              <div className="text-center space-y-5">
                <div className="w-20 h-36 bg-gradient-to-t from-sky-500 via-white to-orange-400 rounded-t-full border-4 border-white flex items-center justify-center mx-auto shadow-lg">
                  <Rocket className="w-9 h-9 text-sky-900 -rotate-45" />
                </div>
                <button
                  type="button"
                  onClick={startCountdown}
                  className="min-h-14 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-md flex items-center gap-2.5 mx-auto transition-transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Bắt đầu phóng</span>
                </button>
              </div>
            )}

            {(launchStage === 'liftoff' || launchStage === 'staging') && (
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-16 h-32 bg-gradient-to-t from-sky-500 via-white to-orange-400 rounded-t-full border-4 border-white flex items-center justify-center shadow-lg">
                  <Rocket className="w-8 h-8 text-sky-900 -rotate-45" />
                </div>
                <div className="w-10 h-16 bg-gradient-to-b from-amber-400 via-orange-400 to-transparent rounded-b-full" />
              </div>
            )}

            {launchStage === 'orbit' && (
              <div className="text-center space-y-4 bg-white/95 p-6 rounded-3xl border-2 border-emerald-300 shadow-md max-w-md animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
                  <Rocket className="w-9 h-9 -rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-sky-950 font-display">
                  Đã triển khai vào khu vực nhiệm vụ!
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onLaunchComplete();
                  }}
                  className="w-full min-h-12 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 text-xs font-bold text-sky-900/80 text-center">
            {mission.targetLocation.vi}
          </div>
        </div>
      )}
    </div>
  );
};
