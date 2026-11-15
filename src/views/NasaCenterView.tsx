import React, { useEffect, useState } from 'react';
import { Language, MissionId } from '../types/game';
import { NASA_EQUIPMENT_PROFILES, getEquipmentProfileByMission } from '../data/nasaKnowledge';
import { getPrimaryDeviceAsset } from '../data/nasaMediaRegistry';
import { EquipmentReferenceCard } from '../components/NasaVisualBlocks';
import { sound } from '../services/sound';
import {
  ArrowLeft,
  Camera,
  Compass,
  Cpu,
  Orbit,
  Satellite,
  Telescope,
} from 'lucide-react';

interface NasaCenterViewProps {
  lang: Language;
  initialMissionId?: MissionId;
  onBack?: () => void;
}

const MISSION_SUPPORT_NOTES: Record<MissionId, { vi: string; en: string }> = {
  mission_01_mars_rover: {
    vi: 'Nguồn điện MMRTG giữ toàn bộ hệ thống hoạt động ổn định qua đêm lạnh và bão bụi Sao Hỏa. Khi điều hướng vào đá nhọn hoặc cần lấy mẫu đá, hãy ưu tiên bánh xe bền và kiểm tra khớp tay máy trước khi hạ mũi khoan.',
    en: 'The MMRTG nuclear power source keeps rover subsystems stable through cold Martian nights and dust storms. When traversing sharp rocks or drilling cores, prioritize durable wheels and verify robotic arm joints first.',
  },
  mission_02_earth_satellite: {
    vi: 'Vệ tinh Landsat 9 tách biệt ánh sáng phản xạ (OLI-2) và nhiệt bức xạ bề mặt (TIRS-2). Nếu dữ liệu nhiệt bất thường, cần phân biệt xem do nhiễu điểm ảnh cảm biến hay do biến động nhiệt thực tế trước khi điều chỉnh quỹ đạo.',
    en: 'Landsat 9 separates reflected sunlight (OLI-2) from thermal infrared radiation (TIRS-2). When thermal anomalies appear, distinguish sensor pixel noise from real surface heat before adjusting schedules.',
  },
  mission_03_space_station: {
    vi: 'ISS trải qua chu kỳ ngày – đêm khoảng 90 phút. Khi bước vào vùng tối, pin và van tuần hoàn nhiệt Amoniac phải phối hợp giữ nhiệt độ khoang ổn định để không làm gián đoạn hệ thống duy trì oxy và tái chế nước.',
    en: 'ISS experiences 90-minute orbital day-night cycles. During orbital eclipse, batteries and ammonia thermal control loops must coordinate to keep cabin temperatures stable for oxygen generation and water recovery.',
  },
  mission_04_robotic_arm: {
    vi: 'Canadarm2 gồm 7 khớp xoay phối hợp. Độ lệch nhỏ ở khớp khuỷu hoặc cổ tay sẽ nhân rộng ở đầu kẹp LEE; luôn đối chiếu góc camera đầu kẹp với vạch chuẩn trước khi khóa chốt tàu hàng.',
    en: 'Canadarm2 coordinates 7 motorized joints. Small offsets in the elbow or wrist joints amplify at the LEE end effector; always verify end-effector camera alignment before latching cargo.',
  },
  mission_05_space_telescope: {
    vi: 'Để chụp thiên hà mờ xa, cảm biến dẫn đường FGS và các con quay hồi chuyển phải khóa mục tiêu chính xác; bất kỳ rung động nào đều làm nhòe ảnh WFC3 trong quá trình phơi sáng dài.',
    en: 'To image faint distant galaxies, Fine Guidance Sensors (FGS) and gyroscopes must hold steady target lock; any jitter blurs WFC3 deep-sky long exposures.',
  },
};

const renderDeviceIcon = (missionId: MissionId, className = 'w-4 h-4') => {
  switch (missionId) {
    case 'mission_01_mars_rover':
      return <Compass className={className} />;
    case 'mission_02_earth_satellite':
      return <Satellite className={className} />;
    case 'mission_03_space_station':
      return <Orbit className={className} />;
    case 'mission_04_robotic_arm':
      return <Cpu className={className} />;
    case 'mission_05_space_telescope':
      return <Telescope className={className} />;
  }
};

export const NasaCenterView: React.FC<NasaCenterViewProps> = ({
  lang,
  initialMissionId,
  onBack,
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<MissionId>(
    initialMissionId || 'mission_01_mars_rover'
  );
  const [failedThumbUrls, setFailedThumbUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialMissionId) {
      setSelectedMissionId(initialMissionId);
    }
  }, [initialMissionId]);

  const activeProfile = getEquipmentProfileByMission(selectedMissionId);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
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
              className="min-h-10 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'en' ? 'Back' : 'Quay lại'}</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {lang === 'en' ? 'NASA Equipment Reference' : 'Dữ liệu Thiết bị NASA'}
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              {lang === 'en'
                ? 'Concise technical briefs for the 5 spacecraft featured in academy missions.'
                : 'Tài liệu kỹ thuật cô đọng về 5 thiết bị trong các màn nhiệm vụ.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Mission Device Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {NASA_EQUIPMENT_PROFILES.map((profile, idx) => {
          const isSelected = profile.missionId === selectedMissionId;
          const heroAsset = getPrimaryDeviceAsset(profile.missionId);
          const thumbSrc = heroAsset?.imageUrl || profile.heroImageUrl;
          const isImgFailed = Boolean(failedThumbUrls[thumbSrc]);

          return (
            <button
              key={profile.missionId}
              type="button"
              onClick={() => {
                sound.playClick();
                sound.stopSpeech();
                setSelectedMissionId(profile.missionId);
              }}
              className={`rounded-xl border overflow-hidden text-left transition-all cursor-pointer flex flex-col ${
                isSelected
                  ? 'bg-sky-600 border-sky-700 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-sky-400'
              }`}
            >
              <div className="relative h-24 w-full bg-slate-100">
                {!isImgFailed ? (
                  <img
                    src={thumbSrc}
                    alt={profile.preschool.simpleName[lang]}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedThumbUrls((prev) => ({ ...prev, [thumbSrc]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-white text-[11px] font-semibold">
                  {lang === 'en' ? `Mission 0${idx + 1}` : `Màn 0${idx + 1}`}
                </span>
              </div>
              <div className="p-3 flex items-start gap-2">
                {renderDeviceIcon(
                  profile.missionId,
                  `w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-sky-100' : 'text-sky-600'}`
                )}
                <span className="text-xs sm:text-sm font-bold leading-snug break-words">
                  {profile.preschool.simpleName[lang]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Focused A / B / C / D Technical Reference Card */}
      <EquipmentReferenceCard
        profile={activeProfile}
        lang={lang}
        missionSupportNote={MISSION_SUPPORT_NOTES[activeProfile.missionId][lang]}
      />
    </div>
  );
};

