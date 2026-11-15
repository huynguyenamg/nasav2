import React, { useEffect, useState } from 'react';
import {
  GalleryViewCategory,
  Language,
  MediaKind,
  MissionEquipmentProfile,
  NasaAssetType,
  PreschoolIllustrationKind,
  PreschoolPartItem,
  VerifiedNasaAsset,
} from '../types/game';
import { sound } from '../services/sound';
import { getDeviceComponentAssets, getPrimaryDeviceAsset } from '../data/nasaMediaRegistry';
import academyEmblemImg from '../assets/images/academy_telemetry_emblem_1794626910467.jpg';
import {
  ArrowRight,
  BatteryCharging,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  ExternalLink,
  Eye,
  HelpCircle,
  Layers,
  MapPin,
  Maximize2,
  Palette,
  Puzzle,
  Radio,
  RefreshCw,
  Rocket,
  Sliders,
  Sparkles,
  Square,
  Sun,
  Volume2,
  Wrench,
  X,
} from 'lucide-react';

export const renderNasaIcon = (iconName: string, className = 'w-5 h-5 text-sky-600') => {
  switch (iconName) {
    case 'Camera':
      return <Camera className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'BatteryCharging':
      return <BatteryCharging className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <Cpu className={className} />;
  }
};

/**
 * Honest Media Type Badge: strictly separates real NASA photos from diagrams and cartoon art.
 */
export const MediaBadge: React.FC<{
  mediaKind?: MediaKind;
  isRealPhoto?: boolean;
  lang: Language;
}> = ({ mediaKind, isRealPhoto = true, lang }) => {
  const resolved: MediaKind =
    mediaKind || (isRealPhoto ? 'real_photo' : 'illustration');

  if (resolved === 'real_photo') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-sm whitespace-nowrap">
        <Camera className="w-3.5 h-3.5 shrink-0" />
        <span>{lang === 'vi' ? 'Ảnh thật NASA' : 'Real NASA Photo'}</span>
      </span>
    );
  }

  if (resolved === 'technical_diagram') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-600 text-white font-extrabold text-xs shadow-sm whitespace-nowrap">
        <Layers className="w-3.5 h-3.5 shrink-0" />
        <span>{lang === 'vi' ? 'Sơ đồ kỹ thuật' : 'Technical Diagram'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-sky-950 font-extrabold text-xs shadow-sm whitespace-nowrap">
      <Palette className="w-3.5 h-3.5 shrink-0" />
      <span>{lang === 'vi' ? 'Hình minh họa' : 'Illustration'}</span>
    </span>
  );
};

export const getViewCategoryLabel = (category: GalleryViewCategory | undefined, lang: Language) => {
  switch (category) {
    case 'overview':
      return lang === 'vi' ? 'Toàn cảnh' : 'Overview';
    case 'closeup':
      return lang === 'vi' ? 'Cận cảnh bộ phận' : 'Part Close-Up';
    case 'operation':
      return lang === 'vi' ? 'Đang hoạt động' : 'In Action';
    case 'anatomy':
      return lang === 'vi' ? 'Sơ đồ cấu tạo' : 'Anatomy Diagram';
    case 'principle':
      return lang === 'vi' ? 'Nguyên lý hoạt động' : 'How It Works';
    case 'mission_result':
      return lang === 'vi' ? 'Kết quả nhiệm vụ' : 'Mission Result';
    default:
      return lang === 'vi' ? 'Hình ảnh NASA' : 'NASA Visual';
  }
};

export interface ZoomImagePayload {
  src: string;
  fallbackSrc?: string;
  title: string;
  caption?: string;
  sourceLabel?: string;
  locationNote?: string;
  mediaKind?: MediaKind;
  isRealPhoto?: boolean;
}

/**
 * Bright Light-UI Zoom Lightbox Modal for inspecting close-up NASA photos & diagrams.
 */
export const ImageZoomModal: React.FC<{
  item: ZoomImagePayload | null;
  lang: Language;
  onClose: () => void;
}> = ({ item, lang, onClose }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item?.src]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const displaySrc = failed && item.fallbackSrc ? item.fallbackSrc : item.src;

  return (
    <div
      className="fixed inset-0 z-50 bg-sky-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="max-w-4xl w-full rounded-3xl bg-white border-2 border-sky-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-sky-50 border-b border-sky-200 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <MediaBadge mediaKind={item.mediaKind} isRealPhoto={item.isRealPhoto} lang={lang} />
            <h3 className="text-base sm:text-lg font-extrabold text-sky-950 font-display leading-snug break-words">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label={lang === 'vi' ? 'Đóng ảnh phóng to' : 'Close zoom'}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-rose-50 text-sky-900 hover:text-rose-600 border-2 border-sky-200 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large zoom image canvas */}
        <div className="bg-sky-100/60 flex items-center justify-center p-3 sm:p-5 max-h-[68vh]">
          <img
            src={displaySrc}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="max-h-[60vh] w-auto max-w-full rounded-2xl object-contain shadow-sm bg-white"
          />
        </div>

        {/* Bottom description & source */}
        <div className="p-4 sm:p-5 bg-white border-t border-sky-100 space-y-2">
          {item.locationNote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-extrabold text-amber-900">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{item.locationNote}</span>
            </div>
          )}
          {item.caption && (
            <p className="text-sm sm:text-base text-sky-950 font-semibold leading-snug">
              {item.caption}
            </p>
          )}
          {item.sourceLabel && (
            <div className="text-xs font-bold text-sky-700">
              {lang === 'vi' ? 'Nguồn:' : 'Source:'} {item.sourceLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Cheerful sunny daylight cartoon vector illustrations for spacecraft parts.
 */
export const CartoonPartIllustration: React.FC<{
  kind?: PreschoolIllustrationKind;
  label: string;
}> = ({ kind, label }) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-amber-50 p-4 select-none"
      role="img"
      aria-label={label}
    >
      {kind === 'antenna' && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <circle cx="120" cy="90" r="72" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M90 148 L150 148 L136 122 L104 122 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <path d="M68 92 C68 124, 172 124, 172 92 Z" fill="#ffffff" stroke="#0ea5e9" strokeWidth="4" />
          <line x1="120" y1="92" x2="120" y2="52" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy="48" r="9" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M92 36 Q120 18 148 36" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <path d="M76 24 Q120 2 164 24" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="46" cy="54" r="5" fill="#fbbf24" />
          <circle cx="194" cy="60" r="5" fill="#fbbf24" />
        </svg>
      )}

      {kind === 'solar_wings' && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <circle cx="48" cy="44" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
          <line x1="48" y1="14" x2="48" y2="6" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="44" x2="86" y2="44" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="22" x2="76" y2="16" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <rect x="26" y="88" width="66" height="44" rx="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="3" />
          <line x1="48" y1="88" x2="48" y2="132" stroke="#e0f2fe" strokeWidth="2" />
          <line x1="70" y1="88" x2="70" y2="132" stroke="#e0f2fe" strokeWidth="2" />
          <line x1="26" y1="110" x2="92" y2="110" stroke="#e0f2fe" strokeWidth="2" />
          <rect x="148" y="88" width="66" height="44" rx="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="3" />
          <line x1="170" y1="88" x2="170" y2="132" stroke="#e0f2fe" strokeWidth="2" />
          <line x1="192" y1="88" x2="192" y2="132" stroke="#e0f2fe" strokeWidth="2" />
          <line x1="148" y1="110" x2="214" y2="110" stroke="#e0f2fe" strokeWidth="2" />
          <rect x="96" y="76" width="48" height="68" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="4" />
          <circle cx="120" cy="108" r="12" fill="#38bdf8" />
          <path d="M116 108 L120 100 L125 100 L121 110 L126 110 L118 121 L120 112 Z" fill="#fef08a" />
        </svg>
      )}

      {kind === 'battery' && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <circle cx="120" cy="94" r="72" fill="#dcfce7" />
          <rect x="98" y="28" width="44" height="14" rx="6" fill="#64748b" stroke="#ffffff" strokeWidth="3" />
          <rect x="74" y="40" width="92" height="114" rx="18" fill="#ffffff" stroke="#10b981" strokeWidth="5" />
          <rect x="86" y="54" width="68" height="86" rx="10" fill="#22c55e" />
          <path d="M126 68 L104 99 L120 99 L114 126 L138 92 L121 92 Z" fill="#fde047" stroke="#ffffff" strokeWidth="2" />
          <circle cx="48" cy="64" r="6" fill="#fbbf24" />
          <circle cx="192" cy="120" r="6" fill="#34d399" />
        </svg>
      )}

      {kind === 'camera_eye' && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <rect x="44" y="52" width="152" height="94" rx="22" fill="#ffffff" stroke="#0ea5e9" strokeWidth="5" />
          <rect x="88" y="34" width="64" height="20" rx="8" fill="#38bdf8" />
          <circle cx="120" cy="99" r="34" fill="#e0f2fe" stroke="#0284c7" strokeWidth="5" />
          <circle cx="120" cy="99" r="22" fill="#0ea5e9" />
          <circle cx="120" cy="99" r="10" fill="#0c4a6e" />
          <circle cx="111" cy="89" r="5" fill="#ffffff" />
          <circle cx="166" cy="70" r="7" fill="#fb923c" />
        </svg>
      )}

      {kind === 'balance_wheel' && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <circle cx="120" cy="90" r="58" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="6" />
          <circle cx="120" cy="90" r="38" fill="#ddd6fe" stroke="#0ea5e9" strokeWidth="4" />
          <circle cx="120" cy="90" r="14" fill="#fbbf24" stroke="#ffffff" strokeWidth="3" />
          <line x1="120" y1="34" x2="120" y2="146" stroke="#7c3aed" strokeWidth="4" />
          <line x1="64" y1="90" x2="176" y2="90" stroke="#7c3aed" strokeWidth="4" />
          <path d="M52 54 A78 78 0 0 1 98 22" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <path d="M188 126 A78 78 0 0 1 142 158" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}

      {(kind === 'truss' || !kind) && (
        <svg viewBox="0 0 240 180" className="w-full h-full max-w-[230px]">
          <rect x="28" y="72" width="184" height="36" rx="10" fill="#ffffff" stroke="#0ea5e9" strokeWidth="4" />
          <path d="M36 72 L64 108 L92 72 L120 108 L148 72 L176 108 L204 72" fill="none" stroke="#0284c7" strokeWidth="4" />
          <circle cx="120" cy="90" r="12" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.5" />
        </svg>
      )}
    </div>
  );
};

/**
 * Verified NASA Image Viewer:
 * - Strictly renders verified NASA/USGS/CSA/ESA assets matched by deviceId/componentId.
 * - Shows honest asset classification + clickable source attribution.
 * - On load failure, renders an honest placeholder with retry button instead of swapping a wrong image.
 */
export const VerifiedNasaImage: React.FC<{
  asset: VerifiedNasaAsset;
  lang?: Language;
  heightClass?: string;
  onZoom?: (payload: ZoomImagePayload) => void;
}> = ({ asset, lang = 'vi', heightClass = 'h-64 sm:h-80', onZoom }) => {
  const [failed, setFailed] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    setFailed(false);
  }, [asset.assetId, asset.imageUrl]);

  const badgeMeta: Record<NasaAssetType, { label: string; cls: string }> = {
    REAL_PHOTO: { label: lang === 'en' ? 'Real NASA Photo' : 'Ảnh thật NASA', cls: 'bg-emerald-600 text-white' },
    TECHNICAL_DIAGRAM: { label: lang === 'en' ? 'Technical Diagram' : 'Sơ đồ kỹ thuật', cls: 'bg-sky-600 text-white' },
    SCIENTIFIC_DATA: { label: lang === 'en' ? 'Scientific Data' : 'Dữ liệu khoa học', cls: 'bg-indigo-600 text-white' },
    SIMPLIFIED_DIAGRAM: { label: lang === 'en' ? 'Simplified Diagram' : 'Sơ đồ đơn giản hóa', cls: 'bg-amber-600 text-white' },
    UI_ICON: { label: lang === 'en' ? 'Icon' : 'Biểu tượng', cls: 'bg-slate-700 text-white' },
  };

  const tag = badgeMeta[asset.imageType] || badgeMeta.REAL_PHOTO;
  const mediaKind: MediaKind =
    asset.imageType === 'TECHNICAL_DIAGRAM' || asset.imageType === 'SIMPLIFIED_DIAGRAM'
      ? 'technical_diagram'
      : 'real_photo';
  const displayTitle = lang === 'en' ? asset.titleEn || asset.title : asset.title;
  const displayCaption = lang === 'en' ? asset.captionEn || asset.caption : asset.caption;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
      <div className={`relative w-full ${heightClass} bg-slate-100`}>
        {!failed ? (
          <img
            key={`${asset.assetId}_${retryNonce}`}
            src={asset.imageUrl}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            onClick={() => {
              if (onZoom) {
                sound.playClick();
                onZoom({
                  src: asset.imageUrl,
                  title: displayTitle,
                  caption: displayCaption,
                  sourceLabel: `${asset.attribution} · ${asset.license}`,
                  mediaKind,
                  isRealPhoto: asset.imageType === 'REAL_PHOTO',
                });
              }
            }}
            className={`w-full h-full object-cover ${onZoom ? 'cursor-zoom-in' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-slate-50 space-y-2.5">
            <Camera className="w-8 h-8 text-slate-400" />
            <div className="text-sm font-semibold text-slate-800">
              {lang === 'en' ? 'Image temporarily unavailable' : 'Ảnh tạm thời không khả dụng'}
            </div>
            <p className="text-xs text-slate-600 max-w-md">{displayCaption}</p>
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setRetryNonce((n) => n + 1);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Retry' : 'Thử tải lại'}</span>
            </button>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs ${tag.cls}`}>
            {tag.label}
          </span>
          {!failed && onZoom && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onZoom({
                  src: asset.imageUrl,
                  title: displayTitle,
                  caption: displayCaption,
                  sourceLabel: `${asset.attribution} · ${asset.license}`,
                  mediaKind,
                  isRealPhoto: asset.imageType === 'REAL_PHOTO',
                });
              }}
              aria-label={lang === 'en' ? 'Zoom image' : 'Phóng to ảnh'}
              className="pointer-events-auto w-9 h-9 rounded-lg bg-white/95 hover:bg-sky-600 hover:text-white text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="text-sm font-semibold text-slate-900 leading-snug break-words">{displayTitle}</div>
          <p className="text-xs text-slate-600 leading-relaxed">{displayCaption}</p>
        </div>
        <a
          href={asset.sourcePage}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 shrink-0"
        >
          <span>{asset.attribution}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

/**
 * Technical Mentor Voice Banner with clear adult female Vietnamese voice guide.
 */
export const NovaVoiceBanner: React.FC<{
  speechText: string;
  lang: Language;
  accent?: 'cyan' | 'emerald' | 'amber' | 'violet';
  compact?: boolean;
}> = ({ speechText, lang, accent = 'cyan', compact = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSpeaking(false);
    sound.stopSpeech();
    return () => {
      sound.stopSpeech();
    };
  }, [speechText, lang]);

  const handleToggleVoice = () => {
    sound.playClick();
    if (isSpeaking) {
      sound.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      sound.speak(speechText, lang, () => setIsSpeaking(false));
    }
  };

  const accentClasses = {
    cyan: 'bg-slate-50 border-slate-200',
    emerald: 'bg-emerald-50/70 border-emerald-200',
    amber: 'bg-amber-50/70 border-amber-200',
    violet: 'bg-sky-50/70 border-sky-200',
  }[accent];

  return (
    <div
      className={`rounded-xl border ${accentClasses} ${
        compact ? 'p-3.5' : 'p-4'
      } flex flex-col sm:flex-row items-center gap-3.5`}
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1">
        <div className="relative shrink-0">
          <img
            src={academyEmblemImg}
            alt={lang === 'en' ? 'NOVA Technical Assistant' : 'NOVA Trợ lý Kỹ thuật'}
            className={`${
              compact ? 'w-12 h-12' : 'w-14 h-14'
            } rounded-lg object-cover border border-slate-300`}
          />
          <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-slate-900 text-sky-400 text-[10px] font-bold">
            NOVA
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
          {speechText}
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggleVoice}
        className={`w-full sm:w-auto shrink-0 h-10 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
          isSpeaking
            ? 'bg-rose-600 hover:bg-rose-700 text-white'
            : 'bg-sky-600 hover:bg-sky-700 text-white'
        }`}
      >
        {isSpeaking ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            <span>{lang === 'en' ? 'Stop' : 'Dừng đọc'}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'en' ? 'Listen' : 'Nghe hướng dẫn'}</span>
          </>
        )}
      </button>
    </div>
  );
};

/**
 * Multi-angle NASA Photo & Technical Diagram Viewer with zoom & honest labeling.
 */
export const EquipmentPhotoShowcase: React.FC<{
  profile: MissionEquipmentProfile;
  lang: Language;
  heightClass?: string;
  showAngleStrip?: boolean;
}> = ({ profile, lang, heightClass = 'h-64 sm:h-80', showAngleStrip = true }) => {
  const images = profile.galleryImages;
  const [idx, setIdx] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setIdx(0);
    setZoomOpen(false);
  }, [profile.missionId]);

  const current = images[idx] || images[0];
  const imgSrc = current
    ? failedUrls[current.url]
      ? current.fallbackUrl
      : current.url
    : profile.fallbackImageUrl;

  return (
    <div className="space-y-2.5">
      <div className="rounded-3xl overflow-hidden bg-white border-2 border-sky-200 shadow-md">
        <div className={`relative w-full ${heightClass} bg-sky-100 group`}>
          <img
            src={imgSrc}
            alt={current?.title[lang] || profile.preschool.simpleName[lang]}
            referrerPolicy="no-referrer"
            onClick={() => {
              sound.playClick();
              setZoomOpen(true);
            }}
            onError={() => current && setFailedUrls((prev) => ({ ...prev, [current.url]: true }))}
            className="w-full h-full object-cover brightness-105 contrast-105 cursor-zoom-in"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-950/75 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <MediaBadge
                mediaKind={current?.mediaKind}
                isRealPhoto={current?.mediaKind !== 'technical_diagram' && current?.mediaKind !== 'illustration'}
                lang={lang}
              />
              {current?.viewCategory && (
                <span className="px-2.5 py-1 rounded-xl bg-white/95 text-sky-900 text-xs font-extrabold border border-sky-200 shadow-sm">
                  {getViewCategoryLabel(current.viewCategory, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {images.length > 1 && (
                <span className="px-2.5 py-1 rounded-xl bg-white/95 text-sky-950 text-xs font-extrabold border border-sky-200 shadow-sm tabular-nums">
                  {idx + 1} / {images.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setZoomOpen(true);
                }}
                aria-label={lang === 'vi' ? 'Phóng to ảnh' : 'Zoom photo'}
                className="w-9 h-9 rounded-xl bg-white/95 hover:bg-sky-500 hover:text-white text-sky-900 border border-sky-200 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setIdx((prev) => (prev - 1 + images.length) % images.length);
                }}
                aria-label={lang === 'vi' ? 'Ảnh trước' : 'Previous photo'}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/95 hover:bg-sky-500 hover:text-white text-sky-900 border-2 border-sky-200 flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setIdx((prev) => (prev + 1) % images.length);
                }}
                aria-label={lang === 'vi' ? 'Ảnh tiếp' : 'Next photo'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/95 hover:bg-sky-500 hover:text-white text-sky-900 border-2 border-sky-200 flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
            <div>
              <div className="text-sm sm:text-base font-extrabold text-white drop-shadow">
                {current?.title[lang]}
              </div>
              {current?.caption[lang] && (
                <div className="text-xs text-sky-100 font-semibold leading-snug drop-shadow">
                  {current.caption[lang]}
                </div>
              )}
            </div>
            <span className="text-[11px] text-sky-100 font-semibold hidden sm:inline whitespace-nowrap">
              {current?.sourceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Angle Quick-Switch Strip */}
      {showAngleStrip && images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((item, i) => {
            const active = i === idx;
            return (
              <button
                key={item.url + i}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIdx(i);
                }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-sky-900 border-sky-200 hover:border-sky-400'
                }`}
              >
                {getViewCategoryLabel(item.viewCategory, lang)}
              </button>
            );
          })}
        </div>
      )}

      <ImageZoomModal
        item={
          zoomOpen && current
            ? {
                src: imgSrc,
                fallbackSrc: current.fallbackUrl,
                title: current.title[lang],
                caption: current.caption[lang],
                sourceLabel: current.sourceLabel,
                mediaKind: current.mediaKind,
                isRealPhoto: current.mediaKind !== 'technical_diagram' && current.mediaKind !== 'illustration',
              }
            : null
        }
        lang={lang}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
};

/**
 * Interactive Anatomical Position Callout Map for parts on the spacecraft diagram.
 */
const PartLocationDiagram: React.FC<{
  profile: MissionEquipmentProfile;
  parts: PreschoolPartItem[];
  activeIndex: number;
  lang: Language;
  onSelectPart: (idx: number) => void;
  onZoomDiagram: () => void;
}> = ({ profile, parts, activeIndex, lang, onSelectPart, onZoomDiagram }) => {
  const [imgErr, setImgErr] = useState(false);
  const diagramSrc = !imgErr
    ? profile.anatomyImageUrl || profile.heroImageUrl
    : profile.fallbackImageUrl;

  useEffect(() => {
    setImgErr(false);
  }, [profile.missionId]);

  const activePart = parts[activeIndex] || parts[0];

  return (
    <div className="rounded-3xl bg-sky-50/70 border-2 border-sky-200 p-3.5 sm:p-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-sky-950">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>
            {lang === 'vi'
              ? 'Vị trí các bộ phận trên thiết bị (chạm vào chấm tròn):'
              : 'Where each part lives (tap a pin):'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onZoomDiagram();
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-xs font-extrabold text-sky-800 flex items-center gap-1 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Phóng to sơ đồ' : 'Zoom'}</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-sky-200 aspect-[16/9] max-h-64 w-full">
        <img
          src={diagramSrc}
          alt={profile.preschool.simpleName[lang]}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="w-full h-full object-contain bg-white"
        />

        {parts.map((p, i) => {
          if (!p.hotspotCoords) return null;
          const isCurrent = i === activeIndex;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectPart(i);
              }}
              style={{
                left: `${p.hotspotCoords.x}%`,
                top: `${p.hotspotCoords.y}%`,
              }}
              title={p.simpleName[lang]}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isCurrent
                  ? 'bg-amber-400 border-white text-sky-950 scale-125 ring-4 ring-sky-400/70 z-20'
                  : 'bg-sky-500/90 hover:bg-sky-600 border-white text-white z-10'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {activePart?.locationCallout && (
        <div className="px-3.5 py-2 rounded-2xl bg-white border border-amber-200 flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-950">
          <span className="w-6 h-6 rounded-full bg-amber-400 text-sky-950 text-xs font-extrabold flex items-center justify-center shrink-0">
            {activeIndex + 1}
          </span>
          <span>
            <strong className="text-sky-950">{activePart.simpleName[lang]}: </strong>
            {activePart.locationCallout[lang]}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Focused 1-Part Card with clean Light UI styling + close-up zoom.
 */
const FocusedPartCard: React.FC<{
  part: PreschoolPartItem;
  partIndex: number;
  totalParts: number;
  lang: Language;
  onPrevPart: () => void;
  onNextPart: () => void;
  onZoomPart: (payload: ZoomImagePayload) => void;
}> = ({ part, partIndex, totalParts, lang, onPrevPart, onNextPart, onZoomPart }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [part.id]);

  const hasImageUrl = Boolean(part.imageUrl) && !imgError;
  const resolvedMediaKind: MediaKind =
    hasImageUrl
      ? part.mediaKind || (part.isRealPhoto ? 'real_photo' : 'technical_diagram')
      : 'illustration';

  return (
    <div className="rounded-3xl bg-white border-2 border-amber-200 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        <div className="md:col-span-6 relative h-60 sm:h-72 bg-sky-50 border-b md:border-b-0 md:border-r border-sky-100">
          {hasImageUrl && part.imageUrl ? (
            <img
              src={part.imageUrl}
              alt={part.simpleName[lang]}
              referrerPolicy="no-referrer"
              onClick={() => {
                sound.playClick();
                onZoomPart({
                  src: part.imageUrl!,
                  title: part.simpleName[lang],
                  caption: part.shortRole[lang],
                  locationNote: part.locationCallout?.[lang],
                  mediaKind: resolvedMediaKind,
                  isRealPhoto: resolvedMediaKind === 'real_photo',
                });
              }}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover brightness-105 cursor-zoom-in"
            />
          ) : (
            <CartoonPartIllustration
              kind={part.illustrationKind}
              label={part.simpleName[lang]}
            />
          )}

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <MediaBadge
              mediaKind={resolvedMediaKind}
              isRealPhoto={resolvedMediaKind === 'real_photo'}
              lang={lang}
            />
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-xl bg-white/95 text-sky-950 text-xs font-extrabold border border-sky-200 tabular-nums">
                {partIndex + 1} / {totalParts}
              </span>
              {hasImageUrl && part.imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onZoomPart({
                      src: part.imageUrl!,
                      title: part.simpleName[lang],
                      caption: part.shortRole[lang],
                      locationNote: part.locationCallout?.[lang],
                      mediaKind: resolvedMediaKind,
                      isRealPhoto: resolvedMediaKind === 'real_photo',
                    });
                  }}
                  aria-label={lang === 'vi' ? 'Phóng to ảnh bộ phận' : 'Zoom part photo'}
                  className="w-8 h-8 rounded-xl bg-white/95 hover:bg-sky-500 hover:text-white text-sky-900 border border-sky-200 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between gap-4 bg-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0">
                {renderNasaIcon(part.icon, 'w-7 h-7 text-amber-600')}
              </div>
              {part.locationCallout && (
                <span className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800">
                  {part.locationCallout[lang]}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-sky-950 font-display leading-tight">
              {part.simpleName[lang]}
            </h3>
            <p className="text-base sm:text-lg text-sky-900/85 font-semibold leading-relaxed">
              {part.shortRole[lang]}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onPrevPart();
              }}
              className="flex-1 min-h-12 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNextPart();
              }}
              className="flex-1 min-h-12 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sky-950 font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <span>{lang === 'vi' ? 'Tiếp tục' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4-Step Single-Focus Story Explorer designed specifically for ages 4–6 (Light Sunny Theme).
 */
export const PreschoolStoryExplorer: React.FC<{
  profile: MissionEquipmentProfile;
  lang: Language;
}> = ({ profile, lang }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [partIndex, setPartIndex] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [zoomItem, setZoomItem] = useState<ZoomImagePayload | null>(null);

  useEffect(() => {
    setStep(0);
    setPartIndex(0);
    setZoomItem(null);
    sound.stopSpeech();
  }, [profile.missionId]);

  const kid = profile.preschool;
  const activePart = kid.parts[partIndex] || kid.parts[0];
  const workflowArrows = profile.introKid.workflowSteps.slice(0, 4);

  const stepsMeta = [
    {
      idx: 0 as const,
      label: lang === 'vi' ? '1. Thiết bị' : '1. Overview',
      icon: Camera,
      activeBg: 'bg-sky-600 text-white border-sky-700',
    },
    {
      idx: 1 as const,
      label: lang === 'vi' ? '2. Nguyên lý' : '2. How it works',
      icon: Rocket,
      activeBg: 'bg-emerald-600 text-white border-emerald-700',
    },
    {
      idx: 2 as const,
      label: lang === 'vi' ? '3. Bộ phận' : '3. Main Parts',
      icon: Puzzle,
      activeBg: 'bg-slate-900 text-white border-slate-900',
    },
    {
      idx: 3 as const,
      label: lang === 'vi' ? '4. Thông tin thêm' : '4. Key Notes',
      icon: Sparkles,
      activeBg: 'bg-sky-700 text-white border-sky-800',
    },
  ];

  const currentSpeech =
    step === 0
      ? kid.whatIsItSpeech[lang]
      : step === 1
      ? kid.usedForSpeech[lang]
      : step === 2
      ? activePart.voiceLine[lang]
      : kid.funFactSpeech[lang];

  const currentAccent =
    step === 0 ? 'cyan' : step === 1 ? 'emerald' : step === 2 ? 'amber' : 'violet';

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stepsMeta.map((item) => {
          const IconComp = item.icon;
          const isActive = step === item.idx;
          return (
            <button
              key={item.idx}
              type="button"
              onClick={() => {
                sound.playClick();
                setStep(item.idx);
              }}
              className={`min-h-11 py-2 px-4 rounded-lg border font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isActive
                  ? item.activeBg
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <NovaVoiceBanner speechText={currentSpeech} lang={lang} accent={currentAccent} />

      <div className="min-h-[260px]">
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <EquipmentPhotoShowcase profile={profile} lang={lang} heightClass="h-64 sm:h-80" />
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {kid.simpleName[lang]}
              </h3>
              <p className="text-sm font-medium text-slate-600">
                {profile.agency} · {profile.whereItOperates[lang]}
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-6">
                <EquipmentPhotoShowcase
                  profile={profile}
                  lang={lang}
                  heightClass="h-60 sm:h-72"
                  showAngleStrip={false}
                />
              </div>
              <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-emerald-50 border-2 border-emerald-200 space-y-3 text-center lg:text-left">
                <div className="inline-flex w-13 h-13 rounded-2xl bg-emerald-500 text-white items-center justify-center shadow-sm">
                  <Rocket className="w-7 h-7" />
                </div>
                <div className="text-sm font-extrabold text-emerald-700">
                  {lang === 'vi' ? 'Thiết bị này dùng để làm gì?' : 'What does it do?'}
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-sky-950 leading-snug">
                  {kid.usedForShort[lang]}
                </p>
              </div>
            </div>

            {/* Simple Arrow Flow Diagram: How It Works */}
            <div className="p-4 sm:p-5 rounded-3xl bg-sky-50/70 border-2 border-sky-200 space-y-3">
              <div className="text-xs sm:text-sm font-extrabold text-sky-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>
                  {lang === 'vi'
                    ? 'Sơ đồ cách hoạt động (theo chiều mũi tên):'
                    : 'How it works (follow the arrows):'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-stretch">
                {workflowArrows.map((wf, idx) => (
                  <div key={wf.step} className="flex items-center gap-2">
                    <div className="flex-1 h-full p-3.5 rounded-2xl bg-white border-2 border-sky-200 flex flex-col items-center text-center gap-2 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                        {renderNasaIcon(wf.icon, 'w-5 h-5 text-sky-600')}
                      </div>
                      <div className="text-xs font-extrabold text-sky-600">
                        {lang === 'vi' ? `Bước ${wf.step}` : `Step ${wf.step}`}
                      </div>
                      <div className="text-sm font-extrabold text-sky-950 leading-tight">
                        {wf.title[lang]}
                      </div>
                    </div>
                    {idx < workflowArrows.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-sky-500 shrink-0 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {kid.parts.map((part, idx) => {
                const isSelected = idx === partIndex;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPartIndex(idx);
                    }}
                    className={`min-h-14 p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-sky-950 border-amber-500 shadow-sm'
                        : 'bg-sky-50 text-sky-900 border-sky-200 hover:border-amber-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs ${
                        isSelected ? 'bg-white/75 text-sky-950' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm leading-snug break-words">
                      {part.simpleName[lang]}
                    </span>
                  </button>
                );
              })}
            </div>

            <FocusedPartCard
              part={activePart}
              partIndex={partIndex}
              totalParts={kid.parts.length}
              lang={lang}
              onPrevPart={() =>
                setPartIndex((prev) => (prev - 1 + kid.parts.length) % kid.parts.length)
              }
              onNextPart={() => setPartIndex((prev) => (prev + 1) % kid.parts.length)}
              onZoomPart={(payload) => setZoomItem(payload)}
            />

            <PartLocationDiagram
              profile={profile}
              parts={kid.parts}
              activeIndex={partIndex}
              lang={lang}
              onSelectPart={(idx) => setPartIndex(idx)}
              onZoomDiagram={() =>
                setZoomItem({
                  src: profile.anatomyImageUrl || profile.heroImageUrl,
                  fallbackSrc: profile.fallbackImageUrl,
                  title:
                    lang === 'vi'
                      ? `Sơ đồ cấu tạo: ${kid.simpleName.vi}`
                      : `Anatomy: ${kid.simpleName.en}`,
                  caption: profile.shortTypeSummary[lang],
                  sourceLabel: profile.agency,
                  mediaKind: profile.anatomyImageUrl ? 'technical_diagram' : 'real_photo',
                  isRealPhoto: !profile.anatomyImageUrl,
                })
              }
            />
          </div>
        )}

        {step === 3 && (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-4 animate-in fade-in duration-150">
            <div className="inline-flex w-12 h-12 rounded-lg bg-sky-600 text-white items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              {lang === 'en' ? 'Key Engineering Note' : 'Thông tin kỹ thuật đáng chú ý'}
            </div>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 max-w-2xl mx-auto leading-snug">
              {kid.funFact[lang]}
            </p>
            <div className="max-w-md mx-auto">
              <EquipmentPhotoShowcase
                profile={profile}
                lang={lang}
                heightClass="h-44 sm:h-52"
                showAngleStrip={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Big Bottom Step Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-sky-100">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => {
            sound.playClick();
            setStep((prev) => Math.max(0, prev - 1) as 0 | 1 | 2 | 3);
          }}
          className="min-h-12 px-5 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 disabled:opacity-40 disabled:cursor-not-allowed text-sky-900 font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>

        <div className="text-sm font-extrabold text-sky-700 tabular-nums">
          {step + 1} / 4
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setStep((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
          }}
          className="min-h-12 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <span>{lang === 'vi' ? 'Tiếp tục' : 'Continue'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Collapsible Official Sources ("Xem thêm nguồn tham khảo") */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowSources((prev) => !prev);
          }}
          className="px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs text-sky-800 font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>
            {lang === 'vi'
              ? 'Xem thêm nguồn tham khảo NASA / JPL / USGS / CSA'
              : 'View More Official NASA / JPL / USGS / CSA Sources'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showSources ? 'rotate-180' : ''}`}
          />
        </button>

        {showSources && (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.sources.map((src) => (
              <a
                key={src.url + src.title}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs text-sky-800 font-semibold"
              >
                <span className="text-sky-600 font-bold">[{src.organization}]</span>
                <span>{src.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>

      <ImageZoomModal item={zoomItem} lang={lang} onClose={() => setZoomItem(null)} />
    </div>
  );
};

/**
 * Concise 4-Part Equipment Reference Sheet strictly for the NASA Data Center (Dữ liệu NASA):
 * A. Hình ảnh chính (verified NASA/USGS/CSA photo + attribution)
 * B. Thông tin cơ bản (Tên, Công dụng, Môi trường, Vai trò)
 * C. Các bộ phận chính (3-5 key parts with verified images)
 * D. Kiến thức hỗ trợ nhiệm vụ (diagnostic clues without direct answer spoilers)
 */
export const EquipmentReferenceCard: React.FC<{
  profile: MissionEquipmentProfile;
  lang: Language;
  missionSupportNote: string;
}> = ({ profile, lang, missionSupportNote }) => {
  const [zoomItem, setZoomItem] = useState<ZoomImagePayload | null>(null);
  const heroAsset = getPrimaryDeviceAsset(profile.missionId);
  const componentAssets = getDeviceComponentAssets(profile.missionId);
  const parts = profile.preschool.parts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* A. Hình ảnh chính */}
      {heroAsset && (
        <section className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
            {lang === 'en' ? 'A. Equipment Image' : 'A. Hình ảnh thiết bị'}
          </div>
          <VerifiedNasaImage
            asset={heroAsset}
            lang={lang}
            heightClass="h-64 sm:h-88"
            onZoom={(payload) => setZoomItem(payload)}
          />
        </section>
      )}

      {/* B. Thông tin cơ bản */}
      <section className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
          {lang === 'en' ? 'B. Basic Information' : 'B. Thông tin cơ bản'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {profile.equipmentName[lang]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              {lang === 'en' ? 'Purpose & Role' : 'Công dụng & vai trò'}
            </div>
            <p className="text-slate-800 font-medium">{profile.preschool.usedForShort[lang]}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              {lang === 'en' ? 'Operating Environment' : 'Môi trường hoạt động'}
            </div>
            <p className="text-slate-800 font-medium">
              {profile.whereItOperates[lang]} · {profile.agency}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{profile.introKid.whatIsIt[lang]}</p>
      </section>

      {/* C. Các bộ phận chính (3-5 bộ phận) */}
      <section className="rounded-xl bg-white border border-slate-200 p-5 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
          {lang === 'en'
            ? `C. Main Subsystems (${parts.length} core units)`
            : `C. Các bộ phận chính (${parts.length} cụm cốt lõi)`}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parts.map((part) => {
            const matchedAsset = componentAssets.find((a) => a.componentId === part.id);
            return (
              <div
                key={part.id}
                className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex flex-col"
              >
                {matchedAsset ? (
                  <VerifiedNasaImage
                    asset={matchedAsset}
                    lang={lang}
                    heightClass="h-44"
                    onZoom={(payload) => setZoomItem(payload)}
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center bg-slate-100 border-b border-slate-200">
                    {renderNasaIcon(part.icon, 'w-8 h-8 text-sky-600')}
                  </div>
                )}
                <div className="p-3.5 space-y-1 flex-1 bg-white">
                  <div className="flex items-center gap-2">
                    {renderNasaIcon(part.icon, 'w-4 h-4 text-sky-600 shrink-0')}
                    <h3 className="text-sm font-bold text-slate-900">
                      {part.simpleName[lang]}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{part.shortRole[lang]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. Kiến thức hỗ trợ nhiệm vụ */}
      <section className="rounded-xl bg-sky-50 border border-sky-200 p-5 space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
          {lang === 'en' ? 'D. Mission Support Knowledge' : 'D. Kiến thức hỗ trợ nhiệm vụ'}
        </div>
        <p className="text-sm font-medium text-slate-900 leading-relaxed">{missionSupportNote}</p>
        <p className="text-xs text-slate-700 leading-relaxed">
          {profile.detailedArchive.technicalHighlight.content[lang]}
        </p>
      </section>

      <ImageZoomModal item={zoomItem} lang={lang} onClose={() => setZoomItem(null)} />
    </div>
  );
};


