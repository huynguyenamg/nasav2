import React from 'react';
import { AcademyZone, CadetProfile, Language, MissionId } from '../types/game';
import { sound } from '../services/sound';
import { Play } from 'lucide-react';

interface LobbyViewProps {
  cadet: CadetProfile;
  lang: Language;
  onNavigate: (zone: AcademyZone) => void;
  onSelectMission: (missionId: MissionId) => void;
  onOpenCadetModal: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  lang,
  onNavigate,
  onSelectMission,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-sky-300 text-xs font-semibold tracking-wider uppercase">
            {lang === 'en'
              ? 'Aerospace Engineering Academy'
              : 'Học viện Kỹ thuật Hàng không Vũ trụ'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-display leading-tight">
            NASA Technical Academy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            {lang === 'en'
              ? 'Simulate fault diagnosis, optimize subsystems, and manage mission budgets across 5 real NASA spacecraft.'
              : 'Mô phỏng chẩn đoán sự cố, tối ưu linh kiện và quản lý ngân sách cho 5 thiết bị thực tế của NASA.'}
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-w-2xl mx-auto">
          <img
            src="/src/assets/images/academy_mission_control_hero_1794626911283.jpg"
            alt="NASA Technical Academy"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        <div className="max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              sound.playSuccess();
              sound.stopSpeech();
              onSelectMission('mission_01_mars_rover');
              onNavigate('mission_map');
            }}
            className="w-full min-h-13 px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{lang === 'en' ? 'Start' : 'Bắt đầu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
