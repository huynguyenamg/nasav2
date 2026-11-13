import React from 'react';
import { AcademyZone, Language } from '../types/game';
import { sound } from '../services/sound';
import { Home, Rocket, Sun, User } from 'lucide-react';

interface NavbarProps {
  currentZone: AcademyZone;
  onNavigate: (zone: AcademyZone) => void;
  lang: Language;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentZone,
  onNavigate,
  lang,
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
      label: 'Trang chủ',
      icon: Home,
      isActive: currentZone === 'lobby' || currentZone === 'nasa_center',
    },
    {
      zone: 'mission_map',
      label: 'Nhiệm vụ',
      icon: Rocket,
      isActive: isMissionActive,
    },
    {
      zone: 'achievements',
      label: 'Hồ sơ',
      icon: User,
      isActive: currentZone === 'achievements',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sky-200 px-3 sm:px-6 md:px-8 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Compact Brand Mark */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            sound.stopSpeech();
            onNavigate('lobby');
          }}
          className="flex items-center gap-2 text-left cursor-pointer shrink-0 whitespace-nowrap"
          aria-label="Học Viện Vũ Trụ NASA"
        >
          <span className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-amber-500">
            <Sun className="w-5 h-5" />
          </span>
          <span className="hidden md:inline text-base font-bold text-sky-950 tracking-tight">
            Học Viện Vũ Trụ NASA
          </span>
        </button>

        {/* Strictly 3 Clean Main Navigation Items */}
        <nav
          aria-label="Điều hướng chính"
          className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 flex-1 md:flex-initial"
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
                className={`h-10 px-3.5 sm:px-5 rounded-xl border text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  item.isActive
                    ? 'bg-sky-100 border-sky-300 text-sky-800 font-bold'
                    : 'bg-transparent border-transparent text-sky-900/75 font-medium hover:bg-sky-50 hover:text-sky-950'
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    item.isActive ? 'text-sky-600' : 'text-sky-700/70'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block w-8 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
};

