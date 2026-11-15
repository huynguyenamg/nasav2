import { CadetProfile, CadetRank, Language, MissionDesign, MissionId } from '../types/game';

const PROFILE_KEY = 'space_academy_cadet_profile';
const LANG_KEY = 'space_academy_language';
const DESIGNS_KEY = 'space_academy_designs';

export const DEFAULT_CADET: CadetProfile = {
  name: 'Học viên NASA',
  callsign: 'Kỹ sư Tập sự',
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

export function getDisplayCadetName(name: string, lang: Language = 'vi'): string {
  if (lang === 'en' && (!name || name === DEFAULT_CADET.name)) {
    return 'NASA Student';
  }
  return name || DEFAULT_CADET.name;
}

export function getDisplayCallsign(callsign: string, lang: Language = 'vi'): string {
  if (lang === 'en' && (!callsign || callsign === DEFAULT_CADET.callsign)) {
    return 'Junior Engineer';
  }
  return callsign || DEFAULT_CADET.callsign;
}

export function getRankLabel(rank: CadetRank, lang: Language = 'vi'): string {
  if (lang === 'en') {
    switch (rank) {
      case 'Master Engineer':
        return 'Chief Engineer';
      case 'Professional Engineer':
        return 'Aerospace Engineer';
      case 'Junior Engineer':
        return 'Junior Engineer';
      case 'Intern':
      default:
        return 'Engineering Intern';
    }
  }
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
      const legacyNames = ['Leo', 'Bé Khám Phá'];
      const legacyCallsigns = ['AstroPioneer', 'Phi Hành Gia Nhí'];
      return {
        ...DEFAULT_CADET,
        ...parsed,
        name:
          !parsed?.name || legacyNames.includes(parsed.name)
            ? DEFAULT_CADET.name
            : parsed.name,
        callsign:
          !parsed?.callsign || legacyCallsigns.includes(parsed.callsign)
            ? DEFAULT_CADET.callsign
            : parsed.callsign,
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
    if (typeof window === 'undefined') return 'vi';
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi';
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

  resetProgress(): CadetProfile {
    const current = this.getCadetProfile();
    const resetProfile: CadetProfile = {
      name: current.name,
      callsign: current.callsign,
      avatar: current.avatar,
      ageMode: current.ageMode,
      xp: 0,
      rank: 'Intern',
      unlockedBadges: [],
      completedMissions: [],
      totalPhotosTaken: 0,
      totalSamplesAnalyzed: 0,
      anomaliesResolved: 0,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(resetProfile));
      // Remove saved spacecraft designs while keeping language, audio mute, and system configs intact
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DESIGNS_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }

    return resetProfile;
  },

  calculateRank(xp: number): CadetProfile['rank'] {
    if (xp >= 1500) return 'Master Engineer';
    if (xp >= 800) return 'Professional Engineer';
    if (xp >= 350) return 'Junior Engineer';
    return 'Intern';
  },
};
