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
  onNavigate,
  onSelectMission,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="rounded-3xl overflow-hidden bg-white border-2 border-sky-200 shadow-md p-6 sm:p-8 text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-sky-950 font-display leading-tight">
          Học Viện Vũ Trụ NASA
        </h1>

        <div className="rounded-3xl overflow-hidden border-2 border-sky-100 bg-sky-50 max-w-2xl mx-auto">
          <img
            src="/src/assets/images/sunny_space_hero_1794563132092.jpg"
            alt="Học Viện Vũ Trụ NASA"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-88 object-cover"
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
            className="w-full min-h-14 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xl rounded-2xl shadow-md shadow-sky-200 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Bắt đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
