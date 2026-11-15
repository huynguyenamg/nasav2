import React from 'react';
import { AcademyZone, Language } from '../types/game';
import { sound } from '../services/sound';
import { Globe, Home, Rocket, Satellite, User } from 'lucide-react';

interface NavbarProps {
  currentZone: AcademyZone;
  onNavigate: (zone: AcademyZone) => void;
  lang: Language;
  onToggleLang?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentZone,
  onNavigate,
  lang,
  onToggleLang,
}) => {
  const isMissionActive =
    currentZone === 'mission_map' ||
    currentZone === 'design_lab' ||
    currentZone === 'launch_center' ||
    currentZone === 'simulator' ||
    currentZone === 'repair_shop';

  const navItems: {
    zone: AcademyZone;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  }[] = [
    {
      zone: 'lobby',
      label: lang === 'en' ? 'Home' : 'Trang chủ',
      icon: Home,
      isActive: currentZone === 'lobby' || currentZone === 'nasa_center',
    },
    {
      zone: 'mission_map',
      label: lang === 'en' ? 'Missions' : 'Nhiệm vụ',
      icon: Rocket,
      isActive: isMissionActive,
    },
    {
      zone: 'achievements',
      label: lang === 'en' ? 'Profile' : 'Hồ sơ',
      icon: User,
      isActive: currentZone === 'achievements',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-3 sm:px-6 md:px-8 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Aerospace Academy Brand Mark */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            sound.stopSpeech();
            onNavigate('lobby');
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer shrink-0 whitespace-nowrap"
          aria-label="NASA Technical Academy"
        >
          <span className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
            <Satellite className="w-5 h-5" />
          </span>
          <span className="hidden md:inline text-sm font-bold text-slate-900 tracking-tight">
            NASA Technical Academy
          </span>
        </button>

        {/* Strictly 3 Clean Main Navigation Items */}
        <nav
          aria-label={lang === 'en' ? 'Main navigation' : 'Điều hướng chính'}
          className="flex items-center justify-center gap-1 sm:gap-3 flex-1 md:flex-initial"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.zone}
                type="button"
                onClick={() => {
                  sound.playClick();
                  sound.stopSpeech();
                  onNavigate(item.zone);
                }}
                className={`h-10 px-2.5 sm:px-5 rounded-lg border text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  item.isActive
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                    : 'bg-transparent border-transparent text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    item.isActive ? 'text-sky-600' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* English / Vietnamese Interface Switcher */}
        {onToggleLang ? (
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={lang === 'vi' ? 'Switch interface to English' : 'Chuyển giao diện sang tiếng Việt'}
            title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            className="h-9 px-2.5 sm:px-3 rounded-lg border border-slate-300 bg-white hover:bg-sky-50 hover:border-sky-400 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Globe className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="sm:hidden">{lang === 'vi' ? 'EN' : 'VI'}</span>
            <span className="hidden sm:inline">{lang === 'vi' ? 'English' : 'Tiếng Việt'}</span>
          </button>
        ) : (
          <div className="hidden md:block w-8 shrink-0" aria-hidden="true" />
        )}
      </div>
    </header>
  );
};
