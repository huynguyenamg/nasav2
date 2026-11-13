import React, { useState } from 'react';
import { AgeMode, CadetProfile, Language } from '../types/game';
import { getTranslation } from '../services/localization';
import { sound } from '../services/sound';
import { storage } from '../services/storage';
import { X, Check, Award } from 'lucide-react';

interface CadetModalProps {
  cadet: CadetProfile;
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CadetProfile) => void;
}

const AVATARS = [
  { id: 'astronaut', emoji: '🧑‍🚀', label: 'Phi hành gia' },
  { id: 'robot', emoji: '🤖', label: 'Rô-bốt NOVA' },
  { id: 'engineer', emoji: '👩‍🔬', label: 'Kỹ sư nhí' },
  { id: 'explorer', emoji: '🚀', label: 'Thám hiểm' },
];

export const CadetModal: React.FC<CadetModalProps> = ({
  cadet,
  isOpen,
  onClose,
  onSave,
}) => {
  const t = getTranslation('vi');
  const [name, setName] = useState(cadet.name);
  const [callsign, setCallsign] = useState(cadet.callsign);
  const [avatar, setAvatar] = useState(cadet.avatar);
  const [ageMode, setAgeMode] = useState<AgeMode>(cadet.ageMode);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playSuccess();
    const updated: CadetProfile = {
      ...cadet,
      name: name.trim() || 'Bé Khám Phá',
      callsign: callsign.trim() || 'Phi Hành Gia Nhí',
      avatar,
      ageMode,
      rank: storage.calculateRank(cadet.xp),
    };
    storage.saveCadetProfile(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-xl relative">
        <button
          type="button"
          aria-label="Đóng"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-sky-600 hover:text-sky-950 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-sky-950 font-display">{t.cadetTitle}</h2>
            <p className="text-xs font-bold text-sky-700">{cadet.xp} Điểm</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-sky-900 mb-2 uppercase tracking-wider">
              {t.chooseAvatar}
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAvatar(a.id);
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    avatar === a.id
                      ? 'bg-sky-100 border-sky-500 scale-105 shadow-sm'
                      : 'bg-sky-50/50 border-sky-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-[11px] text-sky-950 font-extrabold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-sky-900 mb-1">
                Tên của bé
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.enterName}
                maxLength={20}
                className="w-full bg-sky-50 border-2 border-sky-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-sky-950 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-sky-900 mb-1">
                Bí danh
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder={t.enterCallsign}
                maxLength={20}
                className="w-full bg-sky-50 border-2 border-sky-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-sky-950 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-sky-900 mb-2 uppercase tracking-wider">
              {t.selectMode}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAgeMode('junior');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  ageMode === 'junior'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-sky-50 text-sky-950 border-sky-200'
                }`}
              >
                <div className="text-sm font-extrabold">Nhà Thám Hiểm Nhí</div>
                <div className={`text-xs font-bold ${ageMode === 'junior' ? 'text-sky-100' : 'text-sky-700'}`}>
                  Mầm non – 8 tuổi
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAgeMode('engineer');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  ageMode === 'engineer'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-sky-50 text-sky-950 border-sky-200'
                }`}
              >
                <div className="text-sm font-extrabold">Kỹ Sư Nhí</div>
                <div className={`text-xs font-bold ${ageMode === 'engineer' ? 'text-sky-100' : 'text-sky-700'}`}>
                  9 – 11 tuổi
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-sky-100">
          <button
            type="button"
            onClick={handleSave}
            className="w-full min-h-12 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Lưu lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
