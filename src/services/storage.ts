import { CadetProfile, CadetRank, Language, MissionDesign, MissionId } from '../types/game';

const PROFILE_KEY = 'space_academy_cadet_profile';
const LANG_KEY = 'space_academy_language';
const DESIGNS_KEY = 'space_academy_designs';

export const DEFAULT_CADET: CadetProfile = {
  name: 'Bé Khám Phá',
  callsign: 'Phi Hành Gia Nhí',
  avatar: 'astronaut',
  ageMode: 'junior',
  xp: 150,
  rank: 'Intern',
  unlockedBadges: [],
  completedMissions: [],
  totalPhotosTaken: 0,
  totalSamplesAnalyzed: 0,
  anomaliesResolved: 0,
};

export function getRankLabel(rank: CadetRank): string {
  switch (rank) {
    case 'Master Engineer':
      return 'Kỹ sư Trưởng';
    case 'Professional Engineer':
      return 'Kỹ sư Vũ trụ';
    case 'Junior Engineer':
      return 'Kỹ sư Tập sự';
    case 'Intern':
    default:
      return 'Thực tập sinh';
  }
}

export const storage = {
  getCadetProfile(): CadetProfile {
    if (typeof window === 'undefined') return DEFAULT_CADET;
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_CADET;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CADET,
        ...parsed,
        name: parsed?.name === 'Leo' ? 'Bé Khám Phá' : parsed?.name || DEFAULT_CADET.name,
        callsign:
          parsed?.callsign === 'AstroPioneer'
            ? 'Phi Hành Gia Nhí'
            : parsed?.callsign || DEFAULT_CADET.callsign,
      };
    } catch {
      return DEFAULT_CADET;
    }
  },

  saveCadetProfile(profile: CadetProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getLanguage(): Language {
    return 'vi';
  },

  saveLanguage(lang: Language): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LANG_KEY, lang);
  },

  getDesign(missionId: MissionId): MissionDesign | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${DESIGNS_KEY}_${missionId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveDesign(missionId: MissionId, design: MissionDesign): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${DESIGNS_KEY}_${missionId}`, JSON.stringify(design));
  },

  calculateRank(xp: number): CadetProfile['rank'] {
    if (xp >= 1500) return 'Master Engineer';
    if (xp >= 800) return 'Professional Engineer';
    if (xp >= 350) return 'Junior Engineer';
    return 'Intern';
  },
};
