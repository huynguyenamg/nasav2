import React, { useState, useEffect } from 'react';
import { GalleryViewCategory, Language, MissionId } from '../types/game';
import { NASA_EQUIPMENT_PROFILES, getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { INITIAL_DATASETS } from '../data/defaultDatasets';
import {
  ImageZoomModal,
  MediaBadge,
  PreschoolStoryExplorer,
  ZoomImagePayload,
  getViewCategoryLabel,
} from '../components/NasaVisualBlocks';
import { nasaService, ApodData, MarsPhoto, MarsLandingSite } from '../services/nasaService';
import { sound } from '../services/sound';
import {
  ArrowLeft,
  BookOpen,
  Camera,
  ChevronDown,
  Database,
  ExternalLink,
  Globe,
  Images,
  Loader2,
  MapPin,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface NasaCenterViewProps {
  lang: Language;
  initialMissionId?: MissionId;
  onBack?: () => void;
}

export const NasaCenterView: React.FC<NasaCenterViewProps> = ({
  lang,
  initialMissionId,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'apod' | 'mars_photos' | 'sites' | 'epic'>(
    'equipment'
  );
  const [selectedArchiveMissionId, setSelectedArchiveMissionId] = useState<MissionId>(
    initialMissionId || 'mission_01_mars_rover'
  );
  const [galleryFilter, setGalleryFilter] = useState<'all' | GalleryViewCategory>('all');
  const [showArchiveDatasets, setShowArchiveDatasets] = useState(false);
  const [zoomPayload, setZoomPayload] = useState<ZoomImagePayload | null>(null);
  const [failedThumbUrls, setFailedThumbUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialMissionId) {
      setSelectedArchiveMissionId(initialMissionId);
      setActiveTab('equipment');
    }
  }, [initialMissionId]);

  useEffect(() => {
    setGalleryFilter('all');
  }, [selectedArchiveMissionId]);

  const activeProfile = getEquipmentProfileByMission(selectedArchiveMissionId);
  const matchingDatasets = INITIAL_DATASETS.filter(
    (ds) => ds.missionId === selectedArchiveMissionId
  );

  const filteredGallery =
    galleryFilter === 'all'
      ? activeProfile.galleryImages
      : activeProfile.galleryImages.filter((g) => g.viewCategory === galleryFilter);

  const [apod, setApod] = useState<ApodData | null>(null);
  const [loadingApod, setLoadingApod] = useState(false);

  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]);
  const [selectedRover, setSelectedRover] = useState('perseverance');
  const [selectedCamera, setSelectedCamera] = useState('navcam');
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const [sites, setSites] = useState<MarsLandingSite[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'mars_photos') {
      setLoadingPhotos(true);
      nasaService
        .getMarsPhotos(selectedRover, selectedCamera, 100)
        .then((res) => {
          if (isMounted) setMarsPhotos(res.photos);
        })
        .finally(() => {
          if (isMounted) setLoadingPhotos(false);
        });
    } else if (activeTab === 'apod' && !apod) {
      setLoadingApod(true);
      nasaService
        .getApod()
        .then((res) => {
          if (isMounted) setApod(res.data);
        })
        .finally(() => {
          if (isMounted) setLoadingApod(false);
        });
    } else if (activeTab === 'sites' && sites.length === 0) {
      setLoadingSites(true);
      nasaService
        .getSites()
        .then((res) => {
          if (isMounted) setSites(res.sites);
        })
        .finally(() => {
          if (isMounted) setLoadingSites(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, selectedRover, selectedCamera]);

  const filterButtons: { key: 'all' | GalleryViewCategory; labelVi: string; labelEn: string }[] = [
    { key: 'all', labelVi: 'Tất cả góc nhìn', labelEn: 'All Views' },
    { key: 'overview', labelVi: 'Toàn cảnh', labelEn: 'Overview' },
    { key: 'closeup', labelVi: 'Cận cảnh bộ phận', labelEn: 'Close-Ups' },
    { key: 'operation', labelVi: 'Đang hoạt động', labelEn: 'In Action' },
    { key: 'anatomy', labelVi: 'Sơ đồ cấu tạo', labelEn: 'Diagrams' },
    { key: 'mission_result', labelVi: 'Kết quả nhiệm vụ', labelEn: 'Results' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                sound.stopSpeech();
                onBack();
              }}
              className="min-h-11 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border-2 border-sky-200 font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-950 font-display">
              {lang === 'vi' ? 'Dữ Liệu NASA Cho Bé' : 'NASA Discovery Corner'}
            </h1>
            <p className="text-sm text-sky-800/80 font-semibold">
              {lang === 'vi'
                ? 'Ngắm ảnh thật đa góc nhìn, sơ đồ dễ hiểu và nghe NOVA kể chuyện về 5 thiết bị NASA!'
                : 'Explore real multi-angle NASA photos, clear diagrams, and NOVA stories!'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sky-200 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('equipment');
          }}
          className={`min-h-11 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'equipment'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'vi' ? '5 Thiết bị NASA' : '5 NASA Explorers'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('mars_photos');
          }}
          className={`min-h-11 px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'mars_photos'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Ảnh Sao Hỏa' : 'Mars Photos'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('apod');
          }}
          className={`min-h-11 px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'apod'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Ảnh Thiên Văn' : 'Space Picture'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('sites');
          }}
          className={`min-h-11 px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'sites'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Địa điểm Sao Hỏa' : 'Mars Sites'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('epic');
          }}
          className={`min-h-11 px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'epic'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Ảnh Trái Đất' : 'Earth EPIC'}</span>
        </button>
      </div>

      {/* Tab 0: Simple 5 NASA Equipment Story Cards + Multi-Angle Gallery */}
      {activeTab === 'equipment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {NASA_EQUIPMENT_PROFILES.map((profile) => {
              const isSelected = profile.missionId === selectedArchiveMissionId;
              const thumbSrc = failedThumbUrls[profile.heroImageUrl]
                ? profile.fallbackImageUrl
                : profile.heroImageUrl;

              return (
                <button
                  key={profile.missionId}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    sound.stopSpeech();
                    setSelectedArchiveMissionId(profile.missionId);
                  }}
                  className={`rounded-3xl border-2 overflow-hidden text-left transition-all cursor-pointer flex flex-col shadow-sm ${
                    isSelected
                      ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-[1.02]'
                      : 'bg-white border-sky-200 text-sky-950 hover:border-sky-400'
                  }`}
                >
                  <div className="relative h-28 w-full bg-sky-100">
                    <img
                      src={thumbSrc}
                      alt={profile.preschool.simpleName[lang]}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedThumbUrls((prev) => ({ ...prev, [profile.heroImageUrl]: true }))
                      }
                      className="w-full h-full object-cover brightness-105"
                    />
                    <span className="absolute top-2 left-2 w-9 h-9 rounded-xl bg-white/95 border border-sky-200 text-xl flex items-center justify-center shadow-sm">
                      {profile.preschool.badgeEmoji}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <div className="text-sm sm:text-base font-extrabold leading-snug">
                      {profile.preschool.simpleName[lang]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <PreschoolStoryExplorer profile={activeProfile} lang={lang} />

          {/* Multi-Angle Photo & Diagram Gallery Grid */}
          <div className="rounded-3xl bg-white border-2 border-sky-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-sky-950 font-display">
                    {lang === 'vi'
                      ? `Thư Viện Ảnh Đa Góc Nhìn: ${activeProfile.preschool.simpleName.vi}`
                      : `Multi-Angle Gallery: ${activeProfile.preschool.simpleName.en}`}
                  </h2>
                  <p className="text-xs text-sky-800/80 font-semibold">
                    {lang === 'vi'
                      ? 'Chạm vào bất kỳ ảnh hoặc sơ đồ nào để phóng to xem chi tiết'
                      : 'Tap any photo or diagram to inspect a zoomed close-up view'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {filterButtons.map((btn) => {
                  const hasItems =
                    btn.key === 'all' ||
                    activeProfile.galleryImages.some((g) => g.viewCategory === btn.key);
                  if (!hasItems) return null;
                  const active = galleryFilter === btn.key;
                  return (
                    <button
                      key={btn.key}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setGalleryFilter(btn.key);
                      }}
                      className={`px-3 py-1.5 rounded-xl border-2 text-xs font-extrabold cursor-pointer whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      {lang === 'vi' ? btn.labelVi : btn.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGallery.map((img, i) => {
                const resolvedSrc = failedThumbUrls[img.url] ? img.fallbackUrl : img.url;
                const isReal =
                  img.mediaKind !== 'technical_diagram' && img.mediaKind !== 'illustration';
                return (
                  <button
                    key={img.url + i}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setZoomPayload({
                        src: resolvedSrc,
                        fallbackSrc: img.fallbackUrl,
                        title: img.title[lang],
                        caption: img.caption[lang],
                        sourceLabel: img.sourceLabel,
                        mediaKind: img.mediaKind,
                        isRealPhoto: isReal,
                      });
                    }}
                    className="group text-left rounded-3xl overflow-hidden bg-sky-50/50 border-2 border-sky-200 hover:border-sky-400 transition-all cursor-pointer flex flex-col shadow-xs hover:shadow-md"
                  >
                    <div className="relative h-44 w-full bg-sky-100 overflow-hidden">
                      <img
                        src={resolvedSrc}
                        alt={img.title[lang]}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedThumbUrls((prev) => ({ ...prev, [img.url]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <MediaBadge mediaKind={img.mediaKind} isRealPhoto={isReal} lang={lang} />
                        <span className="w-8 h-8 rounded-xl bg-white/95 text-sky-900 border border-sky-200 flex items-center justify-center shadow-xs">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-2 bg-white w-full">
                      <div>
                        <div className="text-[11px] font-extrabold text-sky-600 mb-0.5">
                          {getViewCategoryLabel(img.viewCategory, lang)}
                        </div>
                        <h3 className="text-sm font-extrabold text-sky-950 leading-snug">
                          {img.title[lang]}
                        </h3>
                        <p className="text-xs text-sky-900/75 font-semibold mt-1 line-clamp-2">
                          {img.caption[lang]}
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-sky-700 pt-1 border-t border-sky-100">
                        {img.sourceLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Project Curated Sources & Datasets ("Xem thêm nguồn tham khảo") */}
          <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 sm:p-5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowArchiveDatasets((prev) => !prev);
              }}
              className="w-full flex items-center justify-between gap-2 text-sm font-extrabold text-sky-950 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600" />
                <span>
                  {lang === 'vi'
                    ? 'Xem thêm nguồn tham khảo & Dữ liệu gốc trong dự án'
                    : 'View More Official Sources & Curated Project Datasets'}
                </span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-sky-600 transition-transform ${
                  showArchiveDatasets ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showArchiveDatasets && (
              <div className="mt-4 pt-4 border-t border-sky-100 space-y-4">
                {matchingDatasets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchingDatasets.map((ds) => (
                      <div
                        key={ds.id}
                        className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold">
                            {ds.type}
                          </span>
                          <span className="text-sky-700 font-bold">v{ds.version}</span>
                        </div>
                        <div className="font-extrabold text-sm text-sky-950">{ds.title}</div>
                        <p className="text-sky-900/80 font-semibold leading-snug">
                          {ds.description}
                        </p>
                        <div className="text-sky-700 font-bold">{ds.source}</div>
                        {ds.sourceUrl && (
                          <a
                            href={ds.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sky-600 font-extrabold hover:underline"
                          >
                            <span>{lang === 'vi' ? 'Mở nguồn dữ liệu gốc' : 'Open Source Data'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-semibold">
                    {lang === 'vi'
                      ? 'Màn chơi này sử dụng bộ tài liệu và đường dẫn nguồn chính thức từ NASA / ESA / CSA bên dưới (dữ liệu thông số bay mô phỏng bổ sung cho học tập).'
                      : 'This mission uses the official NASA / ESA / CSA reference sources listed below.'}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {activeProfile.sources.map((src) => (
                    <a
                      key={src.url + src.title}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs text-sky-900 font-bold"
                    >
                      <span className="text-sky-600">[{src.organization}]</span>
                      <span>{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 1: Mars Rover Photos */}
      {activeTab === 'mars_photos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border-2 border-sky-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sky-900 font-bold">Xe tự hành:</span>
                <select
                  value={selectedRover}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedRover(e.target.value);
                  }}
                  className="bg-sky-50 border-2 border-sky-200 rounded-xl px-3 py-1.5 text-sky-950 font-bold focus:outline-none focus:border-sky-500"
                >
                  <option value="perseverance">Perseverance (Sao Hỏa 2020)</option>
                  <option value="curiosity">Curiosity (Hố Gale)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sky-900 font-bold">Máy ảnh:</span>
                <select
                  value={selectedCamera}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedCamera(e.target.value);
                  }}
                  className="bg-sky-50 border-2 border-sky-200 rounded-xl px-3 py-1.5 text-sky-950 font-bold focus:outline-none focus:border-sky-500"
                >
                  <option value="navcam">Camera dẫn đường (NAVCAM)</option>
                  <option value="mcz_right">Camera thu phóng 3D (Mastcam-Z)</option>
                  <option value="front_hazcam_left_a">Camera tránh vật cản (HAZCAM)</option>
                </select>
              </div>
            </div>
          </div>

          {loadingPhotos ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-sky-700 text-sm font-bold">
              <Loader2 className="w-7 h-7 animate-spin text-sky-500" />
              <span>Đang tải ảnh từ Sao Hỏa...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marsPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setZoomPayload({
                      src: photo.img_src,
                      title: `${photo.rover.name} · ${photo.camera.full_name}`,
                      caption: photo.geological_context || photo.camera.full_name,
                      sourceLabel: `Ảnh Sao Hỏa NASA (${photo.earth_date})`,
                      mediaKind: 'real_photo',
                      isRealPhoto: true,
                    });
                  }}
                  className="text-left rounded-3xl overflow-hidden bg-white border-2 border-sky-200 hover:border-sky-400 flex flex-col justify-between shadow-sm cursor-pointer transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-sky-100">
                    <img
                      src={photo.img_src}
                      alt={photo.camera.full_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover brightness-105"
                    />
                    <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-white/95 text-sky-900 border border-sky-200 flex items-center justify-center shadow-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5 text-xs w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sky-950">Xe tự hành {photo.rover.name}</span>
                      <span className="text-sky-600 font-bold">{photo.earth_date}</span>
                    </div>
                    <p className="text-sky-900/80 font-semibold line-clamp-2">
                      {photo.geological_context || photo.camera.full_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: APOD */}
      {activeTab === 'apod' && (
        <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-sm space-y-4">
          {loadingApod ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-sky-700 text-sm font-bold">
              <Loader2 className="w-7 h-7 animate-spin text-sky-500" />
              <span>Đang tải ảnh thiên văn...</span>
            </div>
          ) : apod ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border-2 border-sky-100 bg-sky-50">
                <img
                  src={apod.url}
                  alt={apod.title}
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    sound.playClick();
                    setZoomPayload({
                      src: apod.url,
                      title: apod.title,
                      caption: apod.explanation,
                      sourceLabel: 'Ảnh thiên văn trong ngày của NASA',
                      mediaKind: 'real_photo',
                      isRealPhoto: true,
                    });
                  }}
                  className="w-full h-auto object-cover max-h-[440px] cursor-zoom-in"
                />
              </div>
              <div className="lg:col-span-5 space-y-4 text-sm">
                <h2 className="text-2xl font-bold text-sky-950 font-display">{apod.title}</h2>
                <p className="text-sky-900/85 font-semibold leading-relaxed">{apod.explanation}</p>
                <a
                  href={apod.link || 'https://apod.nasa.gov/'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-600 font-extrabold hover:underline"
                >
                  <span>Ảnh thiên văn NASA</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 3: Sites */}
      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loadingSites ? (
            <div className="col-span-3 h-48 flex items-center justify-center text-sky-700 font-bold">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải...
            </div>
          ) : (
            sites.map((site) => (
              <div
                key={site.id}
                className="p-5 rounded-3xl bg-white border-2 border-sky-200 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="text-xs font-extrabold text-sky-600 mb-1">{site.coordinates}</div>
                  <h3 className="text-lg font-bold text-sky-950 font-display">{site.name}</h3>
                  <p className="text-sm text-sky-900/80 font-semibold mt-1">{site.scientificTarget}</p>
                </div>
                <div className="text-xs text-sky-800 pt-2 border-t border-sky-100 font-bold">
                  {site.terrainType} · {site.roverHistory}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: EPIC Earth */}
      {activeTab === 'epic' && (
        <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-sky-950 font-display">
            Camera Quan Sát Trái Đất NASA EPIC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl overflow-hidden bg-sky-50 border-2 border-sky-100">
              <img
                src="/src/assets/images/satellite_earth_orbit_1794503041148.jpg"
                alt="Quan sát Trái Đất"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover brightness-105"
              />
            </div>
            <div className="space-y-4 text-base text-sky-900 font-semibold">
              <p className="leading-relaxed">
                Camera EPIC chụp ảnh Trái Đất xanh tròn từ xa giúp con người ngắm nhìn mây trắng, đại dương và rừng cây!
              </p>
              <a
                href="https://epic.gsfc.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 font-extrabold hover:underline inline-flex items-center gap-1"
              >
                <span>Trang ảnh NASA EPIC</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      <ImageZoomModal item={zoomPayload} lang={lang} onClose={() => setZoomPayload(null)} />
    </div>
  );
};

