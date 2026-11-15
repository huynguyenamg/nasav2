import React, { useEffect, useState } from 'react';
import { AgeMode, CadetProfile, Language } from '../types/game';
import { getTranslation } from '../services/localization';
import { sound } from '../services/sound';
import { getDisplayCallsign, getDisplayCadetName, storage } from '../services/storage';
import { Award, Check, Compass, Cpu, Rocket, ShieldCheck, X } from 'lucide-react';

interface CadetModalProps {
  cadet: CadetProfile;
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CadetProfile) => void;
}

const AVATARS: {
  id: string;
  label: { vi: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'astronaut', label: { vi: 'Điều hành', en: 'Operations' }, icon: ShieldCheck },
  { id: 'robot', label: { vi: 'Hệ thống', en: 'Systems' }, icon: Cpu },
  { id: 'engineer', label: { vi: 'Kỹ thuật', en: 'Engineering' }, icon: Compass },
  { id: 'explorer', label: { vi: 'Quỹ đạo', en: 'Orbital' }, icon: Rocket },
];

export const CadetModal: React.FC<CadetModalProps> = ({
  cadet,
  lang,
  isOpen,
  onClose,
  onSave,
}) => {
  const t = getTranslation(lang);
  const [name, setName] = useState(() => getDisplayCadetName(cadet.name, lang));
  const [callsign, setCallsign] = useState(() => getDisplayCallsign(cadet.callsign, lang));
  const [avatar, setAvatar] = useState(cadet.avatar);
  const [ageMode, setAgeMode] = useState<AgeMode>(cadet.ageMode);

  useEffect(() => {
    if (isOpen) {
      setName(getDisplayCadetName(cadet.name, lang));
      setCallsign(getDisplayCallsign(cadet.callsign, lang));
      setAvatar(cadet.avatar);
      setAgeMode(cadet.ageMode);
    }
  }, [isOpen, lang, cadet.name, cadet.callsign, cadet.avatar, cadet.ageMode]);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playSuccess();
    const updated: CadetProfile = {
      ...cadet,
      name: name.trim() || (lang === 'en' ? 'NASA Student' : 'Học viên NASA'),
      callsign: callsign.trim() || (lang === 'en' ? 'Junior Engineer' : 'Kỹ sư Tập sự'),
      avatar,
      ageMode,
      rank: storage.calculateRank(cadet.xp),
    };
    storage.saveCadetProfile(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-xl relative">
        <button
          type="button"
          aria-label={lang === 'en' ? 'Close' : 'Đóng'}
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.cadetTitle}</h2>
            <p className="text-xs font-semibold text-slate-600">
              {cadet.xp} {lang === 'en' ? 'experience points' : 'điểm kinh nghiệm'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.chooseAvatar}
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATARS.map((a) => {
                const IconComp = a.icon;
                const active = avatar === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setAvatar(a.id);
                    }}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-50 border-sky-500 text-sky-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-xs font-semibold">{a.label[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Full Name' : 'Họ và tên của bạn'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.enterName}
                maxLength={24}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'en' ? 'Technical Callsign' : 'Biệt hiệu kỹ thuật'}
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                placeholder={t.enterCallsign}
                maxLength={24}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.selectMode}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAgeMode('junior');
                }}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  ageMode === 'junior'
                    ? 'bg-sky-600 text-white border-sky-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">{t.modeJuniorTitle}</div>
                <div className={`text-xs ${ageMode === 'junior' ? 'text-sky-100' : 'text-slate-600'}`}>
                  {t.modeJuniorAge}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAgeMode('engineer');
                }}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  ageMode === 'engineer'
                    ? 'bg-sky-600 text-white border-sky-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">{t.modeEngineerTitle}</div>
                <div className={`text-xs ${ageMode === 'engineer' ? 'text-sky-100' : 'text-slate-600'}`}>
                  {t.modeEngineerAge}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSave}
            className="w-full h-11 px-5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'en' ? 'Save Profile' : 'Lưu hồ sơ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
