import {
  BudgetFailureInfo,
  CostHistoryEntry,
  DifficultyLevel,
  EngineeringPart,
  EquipmentSubsystemId,
  Language,
  MissionEconomyState,
  MissionEvaluationReport,
  MissionId,
  MissionSessionState,
  PartTier,
  SafetyCheckItem,
  SafetyGateReport,
  SubsystemBlueprint,
  SubsystemHealthStatus,
  SubsystemRuntimeState,
} from '../types/game';

export interface DifficultyProfile {
  level: DifficultyLevel;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  budgetFactor: number;
  initialFaultCount: number;
  operatingBaseCost: number;
  failurePenaltyCost: number;
  stressFactor: number;
}

export const DIFFICULTY_PROFILES: Record<DifficultyLevel, DifficultyProfile> = {
  1: {
    level: 1,
    title: 'Cấp 1: Làm quen',
    titleEn: 'Level 1: Orientation',
    subtitle: '1 lỗi rõ ràng · Ngân sách thoải mái · Dễ phân tích',
    subtitleEn: '1 clear fault · Generous budget · Guided diagnosis',
    budgetFactor: 1.32,
    initialFaultCount: 1,
    operatingBaseCost: 40,
    failurePenaltyCost: 60,
    stressFactor: 0.7,
  },
  2: {
    level: 2,
    title: 'Cấp 2: Kỹ thuật viên',
    titleEn: 'Level 2: Technician',
    subtitle: 'Nhiều triệu chứng · Phân biệt đúng bộ phận lỗi · Ngân sách vừa phải',
    subtitleEn: 'Multiple symptoms · Pinpoint root fault · Balanced budget',
    budgetFactor: 1.08,
    initialFaultCount: 2,
    operatingBaseCost: 70,
    failurePenaltyCost: 90,
    stressFactor: 1.0,
  },
  3: {
    level: 3,
    title: 'Cấp 3: Kỹ sư',
    titleEn: 'Level 3: Engineer',
    subtitle: 'Lỗi dây chuyền · Cân nhắc giá và độ bền · Cần lập kế hoạch',
    subtitleEn: 'Cascading faults · Balance price vs durability · Tight planning',
    budgetFactor: 0.94,
    initialFaultCount: 2,
    operatingBaseCost: 95,
    failurePenaltyCost: 130,
    stressFactor: 1.25,
  },
  4: {
    level: 4,
    title: 'Cấp 4: Chuyên gia',
    titleEn: 'Level 4: Specialist',
    subtitle: 'Nhiều sự cố đồng thời · Ngân sách eo hẹp · Rủi ro dài hạn',
    subtitleEn: 'Concurrent failures · Strict budget · High operational stress',
    budgetFactor: 0.84,
    initialFaultCount: 3,
    operatingBaseCost: 120,
    failurePenaltyCost: 170,
    stressFactor: 1.5,
  },
};

export const PART_TIER_LABELS: Record<PartTier, string> = {
  economy: 'Tiết kiệm',
  standard: 'Tiêu chuẩn',
  premium: 'Cao cấp',
};

export function getPartTierLabel(tier: PartTier, lang: Language = 'vi'): string {
  if (lang === 'en') {
    if (tier === 'economy') return 'Economy';
    if (tier === 'standard') return 'Standard';
    return 'Premium';
  }
  return PART_TIER_LABELS[tier];
}

export function getDifficultyProfile(level: DifficultyLevel, lang: Language = 'vi') {
  const p = DIFFICULTY_PROFILES[level];
  return {
    ...p,
    title: lang === 'en' ? p.titleEn : p.title,
    subtitle: lang === 'en' ? p.subtitleEn : p.subtitle,
  };
}

export function getSubsystemText(bp: SubsystemBlueprint, lang: Language = 'vi') {
  if (lang === 'en') {
    return {
      name: bp.nameEn || bp.name,
      role: bp.roleEn || bp.role,
      affectedFunctions: bp.affectedFunctionsEn || bp.affectedFunctions,
    };
  }
  return {
    name: bp.name,
    role: bp.role,
    affectedFunctions: bp.affectedFunctions,
  };
}

export function getPartText(part: EngineeringPart, lang: Language = 'vi') {
  if (lang === 'en') {
    return {
      name: part.nameEn || part.name,
      shortDesc: part.shortDescEn || part.shortDesc,
      tradeoffNote: part.tradeoffNoteEn || part.tradeoffNote,
      incompatibleReason: part.incompatibleReasonEn || part.incompatibleReason,
    };
  }
  return {
    name: part.name,
    shortDesc: part.shortDesc,
    tradeoffNote: part.tradeoffNote,
    incompatibleReason: part.incompatibleReason,
  };
}

export const SUBSYSTEM_BLUEPRINTS: SubsystemBlueprint[] = [
  // ================= MISSION 1: PERSEVERANCE =================
  {
    id: 'rover_power',
    missionId: 'mission_01_mars_rover',
    name: 'Nguồn MMRTG & Pin',
    nameEn: 'MMRTG Power & Battery',
    role: 'Cung cấp điện liên tục cho bánh xe, camera, cánh tay và ăng-ten',
    roleEn: 'Supplies continuous electricity to wheels, cameras, robotic arm, and antennas',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Cấp điện di chuyển', 'Vận hành cánh tay lấy mẫu', 'Phát sóng liên lạc'],
    affectedFunctionsEn: ['Mobility power', 'Sampling arm power', 'Telemetry transmission'],
    hotspotCoords: { x: 22, y: 58 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'rover_mobility',
    missionId: 'mission_01_mars_rover',
    name: 'Hệ Bánh Xe & Động Cơ',
    nameEn: 'Wheels & Drive Motors',
    role: 'Di chuyển vượt đá, leo dốc và thoát vùng cát lún trên Sao Hỏa',
    roleEn: 'Drives over rocks, climbs slopes, and escapes soft Martian sand traps',
    icon: 'CircleDot',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Di chuyển robot', 'Khảo sát địa hình xa'],
    affectedFunctionsEn: ['Rover driving', 'Remote terrain survey'],
    hotspotCoords: { x: 50, y: 78 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'rover_camera',
    missionId: 'mission_01_mars_rover',
    name: 'Camera Mastcam-Z & Navcam',
    nameEn: 'Mastcam-Z & Navcam Cameras',
    role: 'Quan sát địa hình, phát hiện đá lớn và vùng cát nguy hiểm',
    roleEn: 'Inspects terrain, spots large boulders, and flags soft sand hazards',
    icon: 'Camera',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Chụp ảnh khảo sát', 'Phân tích địa hình an toàn'],
    affectedFunctionsEn: ['Survey photography', 'Safe path navigation'],
    hotspotCoords: { x: 58, y: 24 },
    criticality: 'support',
    idealTier: 'standard',
  },
  {
    id: 'rover_arm',
    missionId: 'mission_01_mars_rover',
    name: 'Cánh Tay Robot Lấy Mẫu',
    nameEn: 'Robotic Sampling Arm',
    role: 'Vươn tới tảng đá, khoan lõi và lưu trữ ống mẫu Sao Hỏa',
    roleEn: 'Extends to target rocks, drills core samples, and seals Mars sample tubes',
    icon: 'Wrench',
    dependsOn: ['rover_power', 'rover_camera'],
    affectedFunctions: ['Thu thập mẫu đá', 'Khoan và niêm phong mẫu'],
    affectedFunctionsEn: ['Rock core collection', 'Drilling & sealing'],
    hotspotCoords: { x: 76, y: 56 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'rover_comms',
    missionId: 'mission_01_mars_rover',
    name: 'Ăng-ten UHF & HGA',
    nameEn: 'UHF & HGA Antennas',
    role: 'Chuyển tiếp dữ liệu qua vệ tinh quỹ đạo MRO về Trái Đất',
    roleEn: 'Relays photos and science telemetry via the MRO orbiter back to Earth',
    icon: 'Radio',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Gửi ảnh và dữ liệu mẫu đá về Trái Đất'],
    affectedFunctionsEn: ['Downlink photos & sample data to Earth'],
    hotspotCoords: { x: 36, y: 42 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 2: LANDSAT 9 =================
  {
    id: 'sat_power',
    missionId: 'mission_02_earth_satellite',
    name: 'Cánh Pin Mặt Trời & Pin',
    nameEn: 'Solar Wing & Battery',
    role: 'Cung cấp điện cho cảm biến ảnh, nhiệt kế và máy phát sóng',
    roleEn: 'Powers the optical imager, thermal sensor, and X-Band transmitter',
    icon: 'Sun',
    dependsOn: [],
    affectedFunctions: ['Số lần chụp trong lịch quan sát', 'Truyền dữ liệu công suất cao'],
    affectedFunctionsEn: ['Orbital imaging capacity', 'High-power data downlink'],
    hotspotCoords: { x: 20, y: 52 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'sat_processor',
    missionId: 'mission_02_earth_satellite',
    name: 'Bộ Xử Lý & Lập Lịch Dữ Liệu',
    nameEn: 'Data Processor & Scheduler',
    role: 'Nén ảnh vệ tinh, ghép dải phổ và điều phối lịch quét Trái Đất',
    roleEn: 'Compresses imagery, aligns spectral bands, and runs Earth scan schedules',
    icon: 'Cpu',
    dependsOn: ['sat_power'],
    affectedFunctions: ['Lưu và xử lý ảnh OLI-2', 'Thực thi lịch quan sát'],
    affectedFunctionsEn: ['Store & process OLI-2 imagery', 'Execute observation schedule'],
    hotspotCoords: { x: 50, y: 52 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'sat_oli',
    missionId: 'mission_02_earth_satellite',
    name: 'Cảm Biến Ảnh OLI-2',
    nameEn: 'OLI-2 Optical Imager',
    role: 'Chụp ảnh đa phổ bề mặt rừng, biển và thành phố Trái Đất',
    roleEn: 'Captures multispectral imagery of forests, oceans, and cities on Earth',
    icon: 'Camera',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Chụp ảnh quang học Trái Đất'],
    affectedFunctionsEn: ['Earth optical imaging'],
    hotspotCoords: { x: 64, y: 40 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'sat_tirs',
    missionId: 'mission_02_earth_satellite',
    name: 'Cảm Biến Nhiệt TIRS-2',
    nameEn: 'TIRS-2 Thermal Sensor',
    role: 'Đo nhiệt độ bề mặt đất, đại dương và phát hiện cháy rừng',
    roleEn: 'Measures land/sea surface temperatures and detects active wildfires',
    icon: 'Compass',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Đọc bản đồ nhiệt độ bề mặt'],
    affectedFunctionsEn: ['Surface thermal mapping'],
    hotspotCoords: { x: 64, y: 66 },
    criticality: 'support',
    idealTier: 'standard',
  },
  {
    id: 'sat_comms',
    missionId: 'mission_02_earth_satellite',
    name: 'Ăng-ten Băng Tần X',
    nameEn: 'X-Band Downlink Antenna',
    role: 'Truyền dữ liệu ảnh và bản đồ nhiệt về các trạm mặt đất',
    roleEn: 'Downlinks optical imagery and thermal maps to polar ground stations',
    icon: 'Radio',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Truyền dữ liệu vệ tinh về Trái Đất'],
    affectedFunctionsEn: ['Downlink satellite data to Earth'],
    hotspotCoords: { x: 82, y: 50 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 3: ISS =================
  {
    id: 'iss_power',
    missionId: 'mission_03_space_station',
    name: 'Mảng Pin Mặt Trời & Pin Lưu Trữ',
    nameEn: 'Solar Arrays & Storage Batteries',
    role: 'Cấp điện qua 16 chu kỳ ngày-đêm mỗi ngày quanh Trái Đất',
    roleEn: 'Supplies power across 16 orbital day-night cycles every day',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Tổng công suất toàn trạm', 'Vận hành hệ thống điều hòa nhiệt và dưỡng khí'],
    affectedFunctionsEn: ['Total station power output', 'Thermal & life-support operation'],
    hotspotCoords: { x: 18, y: 46 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'iss_thermal',
    missionId: 'mission_03_space_station',
    name: 'Hệ Thống Điều Hòa Nhiệt',
    nameEn: 'Thermal Control System',
    role: 'Bơm dung dịch Amoniac tản nhiệt từ các khoang thí nghiệm ra không gian',
    roleEn: 'Pumps ammonia coolant to reject excess heat from station labs into space',
    icon: 'Sun',
    dependsOn: ['iss_power'],
    affectedFunctions: ['Giữ nhiệt độ an toàn cho khoang ở và máy tính'],
    affectedFunctionsEn: ['Keep crew modules & electronics cooled'],
    hotspotCoords: { x: 52, y: 34 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'iss_lifesupport',
    missionId: 'mission_03_space_station',
    name: 'Hệ Hỗ Trợ Sự Sống & Tài Nguyên',
    nameEn: 'Life Support (ECLSS) & Resources',
    role: 'Tái chế nước sạch, tạo oxy và phân bổ vật tư cho phi hành đoàn',
    roleEn: 'Recycles clean water, generates breathable oxygen, and tracks crew supplies',
    icon: 'BatteryCharging',
    dependsOn: ['iss_power', 'iss_thermal'],
    affectedFunctions: ['Duy trì nước, oxy và sinh hoạt phi hành gia'],
    affectedFunctionsEn: ['Maintain crew oxygen, water, and habitation'],
    hotspotCoords: { x: 48, y: 64 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'iss_comms',
    missionId: 'mission_03_space_station',
    name: 'Hệ Thống Liên Lạc Ku/S-Band',
    nameEn: 'Ku/S-Band Communications',
    role: 'Giữ đường truyền liên tục giữa ISS và Trung tâm Điều khiển Houston',
    roleEn: 'Maintains continuous link between ISS and Mission Control Houston',
    icon: 'Radio',
    dependsOn: ['iss_power'],
    affectedFunctions: ['Trao đổi dữ liệu và chỉ dẫn khẩn cấp'],
    affectedFunctionsEn: ['Voice, telemetry & emergency downlink'],
    hotspotCoords: { x: 78, y: 42 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 4: CANADARM2 =================
  {
    id: 'arm_shoulder',
    missionId: 'mission_04_robotic_arm',
    name: 'Cụm Khớp Vai (Shoulder)',
    nameEn: 'Shoulder Joint Assembly',
    role: 'Xoay cánh tay dài 17m tiếp cận vùng làm việc ngoài thân trạm',
    roleEn: 'Rotates the 17m manipulator boom toward exterior station worksites',
    icon: 'Compass',
    dependsOn: [],
    affectedFunctions: ['Xoay tầm với toàn cánh tay', 'Định vị vị trí thô'],
    affectedFunctionsEn: ['Full-boom sweep rotation', 'Coarse positioning'],
    hotspotCoords: { x: 24, y: 66 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'arm_elbow',
    missionId: 'mission_04_robotic_arm',
    name: 'Khớp Khuỷu Tay (Elbow)',
    nameEn: 'Elbow Pitch Joint',
    role: 'Gập mở chính xác tầm vươn tránh va chạm các mô-đun trạm',
    roleEn: 'Articulates reach distance smoothly while avoiding station modules',
    icon: 'Wrench',
    dependsOn: ['arm_shoulder'],
    affectedFunctions: ['Vươn gập khoảng cách chuẩn xác', 'Tránh vật cản'],
    affectedFunctionsEn: ['Precision reach articulation', 'Obstacle clearance'],
    hotspotCoords: { x: 50, y: 36 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'arm_wrist',
    missionId: 'mission_04_robotic_arm',
    name: 'Khớp Cổ Tay & Đầu Kẹp LEE',
    nameEn: 'Wrist Joint & LEE Grapple',
    role: 'Khóa chốt neo tàu hàng và hỗ trợ phi hành gia đi bộ không gian',
    roleEn: 'Latches onto visiting cargo vehicles and anchors spacewalking astronauts',
    icon: 'Shield',
    dependsOn: ['arm_elbow'],
    affectedFunctions: ['Kẹp giữ tàu hàng', 'Cố định thiết bị và phi hành gia'],
    affectedFunctionsEn: ['Cargo vehicle capture', 'EVA astronaut & payload hold'],
    hotspotCoords: { x: 76, y: 58 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'arm_camera',
    missionId: 'mission_04_robotic_arm',
    name: 'Camera Định Vị Trên Cánh Tay',
    nameEn: 'Arm Alignment Camera',
    role: 'Quan sát trực tiếp tâm ngắm chốt neo và khoảng cách va chạm',
    roleEn: 'Provides boresight target alignment and clearance visibility',
    icon: 'Camera',
    dependsOn: [],
    affectedFunctions: ['Quan sát tâm ngắm kẹp hàng', 'Kiểm tra an toàn vùng làm việc'],
    affectedFunctionsEn: ['Grapple crosshair view', 'Workzone clearance check'],
    hotspotCoords: { x: 64, y: 46 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 5: HUBBLE =================
  {
    id: 'hst_power',
    missionId: 'mission_05_space_telescope',
    name: 'Pin Mặt Trời & Tổ Hợp Pin',
    nameEn: 'Solar Wings & Battery Pack',
    role: 'Cấp nguồn ổn định cho camera thiên văn, máy sưởi gương và con quay',
    roleEn: 'Supplies steady power to science cameras, mirror heaters, and gyroscopes',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Thời lượng chụp ảnh liên tục', 'Cấp điện cảm biến khoa học'],
    affectedFunctionsEn: ['Continuous exposure capacity', 'Science sensor power'],
    hotspotCoords: { x: 24, y: 50 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'hst_guidance',
    missionId: 'mission_05_space_telescope',
    name: 'Hệ Định Hướng FGS & Con Quay',
    nameEn: 'FGS Guidance & Gyroscopes',
    role: 'Giữ ống kính khóa chặt vào ngôi sao dẫn đường sai số dưới 0.01 giây cung',
    roleEn: 'Locks telescope aim on guide stars within 0.01 arcseconds',
    icon: 'Compass',
    dependsOn: ['hst_power'],
    affectedFunctions: ['Khóa mục tiêu sao chuẩn xác', 'Chống rung nhòe khi phơi sáng lâu'],
    affectedFunctionsEn: ['Precision guide-star lock', 'Prevent long-exposure blur'],
    hotspotCoords: { x: 52, y: 66 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'hst_optics',
    missionId: 'mission_05_space_telescope',
    name: 'Gương & Cảm Biến WFC3',
    nameEn: 'Primary Mirror & WFC3 Camera',
    role: 'Thu nhận ánh sáng yếu từ các thiên hà cổ đại và tinh vân xa xôi',
    roleEn: 'Collects faint light from ancient galaxies and distant nebulae',
    icon: 'Camera',
    dependsOn: ['hst_power', 'hst_guidance'],
    affectedFunctions: ['Chụp ảnh thiên văn sắc nét', 'Phân tích quang phổ'],
    affectedFunctionsEn: ['Sharp deep-space imaging', 'Spectral analysis'],
    hotspotCoords: { x: 68, y: 36 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'hst_computer',
    missionId: 'mission_05_space_telescope',
    name: 'Máy Tính Lập Lịch Quan Sát',
    nameEn: 'Observation Flight Computer',
    role: 'Sắp xếp thứ tự mục tiêu thiên văn theo quỹ đạo và ngân sách điện',
    roleEn: 'Schedules deep-sky target sequence within orbit and power limits',
    icon: 'Cpu',
    dependsOn: ['hst_power'],
    affectedFunctions: ['Lập kế hoạch quan sát khoa học'],
    affectedFunctionsEn: ['Science observation planning'],
    hotspotCoords: { x: 46, y: 38 },
    criticality: 'support',
    idealTier: 'standard',
  },
];

export const ENGINEERING_PARTS: EngineeringPart[] = [
  // ---------- PERSEVERANCE ----------
  // rover_power
  {
    id: 'p_rover_power_eco',
    subsystemId: 'rover_power',
    tier: 'economy',
    name: 'Pin Mặt Trời Nhỏ Gọn',
    nameEn: 'Compact Solar Array',
    shortDesc: 'Giá rẻ, đủ điện cơ bản nhưng sụt áp nhanh khi bám bụi Sao Hỏa.',
    shortDescEn: 'Low cost with basic power, but voltage drops quickly under Martian dust.',
    tradeoffNote: 'Rẻ nhất nhưng dễ tụt điện khi lái xa hoặc dùng cánh tay robot.',
    tradeoffNoteEn: 'Cheapest option, yet risks brownouts during long drives or arm drills.',
    purchaseCost: 110,
    maintenanceCost: 45,
    durability: 58,
    performance: 62,
    reliability: 60,
    powerDrawW: 0,
    powerGenW: 110,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_power_std',
    subsystemId: 'rover_power',
    tier: 'standard',
    name: 'Bộ Pin Lai Năng Lượng Mặt Trời',
    nameEn: 'Hybrid Solar-Battery Pack',
    shortDesc: 'Cân bằng tốt giữa giá tiền và lượng điện lưu trữ qua đêm lạnh.',
    shortDescEn: 'Well-balanced cost and overnight energy storage for cold Martian nights.',
    tradeoffNote: 'Đáp ứng ổn định hầu hết chặng ngắn và trung bình.',
    tradeoffNoteEn: 'Handles short and medium rover traverses reliably.',
    purchaseCost: 185,
    maintenanceCost: 30,
    durability: 78,
    performance: 80,
    reliability: 82,
    powerDrawW: 0,
    powerGenW: 145,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_power_pro',
    subsystemId: 'rover_power',
    tier: 'premium',
    name: 'Máy Phát Nhiệt Hạt Nhân MMRTG',
    nameEn: 'MMRTG Nuclear Generator',
    shortDesc: 'Phát điện liên tục ngày đêm, miễn nhiễm bão bụi Sao Hỏa.',
    shortDescEn: 'Delivers continuous day-and-night electricity, immune to Mars dust storms.',
    tradeoffNote: 'Chi phí đầu tư cao nhưng cực kỳ an toàn cho sứ mệnh dài ngày.',
    tradeoffNoteEn: 'High upfront cost, yet vital safety margin for long-duration missions.',
    purchaseCost: 270,
    maintenanceCost: 15,
    durability: 98,
    performance: 96,
    reliability: 97,
    powerDrawW: 0,
    powerGenW: 185,
    compatibleMissions: ['mission_01_mars_rover'],
  },

  // rover_mobility
  {
    id: 'p_rover_mob_eco',
    subsystemId: 'rover_mobility',
    tier: 'economy',
    name: 'Cụm 4 Bánh Nhôm Mỏng',
    nameEn: '4-Wheel Thin Aluminum Set',
    shortDesc: 'Tiết kiệm chi phí nhưng dễ trượt trên cát mịn và mau mòn.',
    shortDescEn: 'Saves budget upfront, but slips easily in soft sand and wears faster.',
    tradeoffNote: 'Dễ phát sinh lỗi trượt bánh nếu chạy qua vùng cát.',
    tradeoffNoteEn: 'Likely to trigger wheel-slip faults across sandy dunes.',
    purchaseCost: 95,
    maintenanceCost: 45,
    durability: 55,
    performance: 60,
    reliability: 58,
    powerDrawW: 45,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_mob_std',
    subsystemId: 'rover_mobility',
    tier: 'standard',
    name: 'Hệ 6 Bánh Rocker-Bogie Chuẩn',
    nameEn: 'Standard 6-Wheel Rocker-Bogie',
    shortDesc: 'Vượt đá sỏi tốt, lực kéo ổn định và chi phí bảo trì vừa phải.',
    shortDescEn: 'Clears gravel reliably with steady traction and moderate maintenance.',
    tradeoffNote: 'Lựa chọn cân bằng nhất cho địa hình Jezero Crater.',
    tradeoffNoteEn: 'Best value choice for mixed Jezero Crater terrain.',
    purchaseCost: 165,
    maintenanceCost: 25,
    durability: 84,
    performance: 85,
    reliability: 86,
    powerDrawW: 40,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_mob_pro',
    subsystemId: 'rover_mobility',
    tier: 'premium',
    name: 'Bánh Titan Dẻo Tự Phục Hồi',
    nameEn: 'Shape-Memory Titanium Wheels',
    shortDesc: 'Siêu bền trước đá sắc nhọn, bám cát cực tốt nhưng rất đắt.',
    shortDescEn: 'Ultra-durable against sharp rocks with superior sand grip, at high cost.',
    tradeoffNote: 'Chất lượng đỉnh cao, nên cân nhắc nếu ngân sách đang eo hẹp.',
    tradeoffNoteEn: 'Top-tier durability; weigh carefully when budget is tight.',
    purchaseCost: 255,
    maintenanceCost: 15,
    durability: 98,
    performance: 96,
    reliability: 96,
    powerDrawW: 36,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },

  // rover_camera
  {
    id: 'p_rover_cam_eco',
    subsystemId: 'rover_camera',
    tier: 'economy',
    name: 'Camera Navcam Cơ Bản',
    nameEn: 'Basic Navcam Optics',
    shortDesc: 'Đủ chụp ảnh đường đi gần nhưng độ nét giảm khi ánh sáng yếu.',
    shortDescEn: 'Fine for close obstacle checks, loses sharpness in low light.',
    tradeoffNote: 'Rẻ, phù hợp khi muốn dồn tiền cho bộ phận lấy mẫu.',
    tradeoffNoteEn: 'Budget-friendly when prioritizing funds for the sampling arm.',
    purchaseCost: 75,
    maintenanceCost: 30,
    durability: 62,
    performance: 64,
    reliability: 65,
    powerDrawW: 18,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_cam_std',
    subsystemId: 'rover_camera',
    tier: 'standard',
    name: 'Camera Màu Kép Hazcam + Mastcam',
    nameEn: 'Dual Hazcam + Color Mastcam',
    shortDesc: 'Phân biệt rõ đá nhọn và cát lún, ảnh màu sắc nét.',
    shortDescEn: 'Clearly distinguishes sharp rocks from soft sand in crisp color.',
    tradeoffNote: 'Đáp ứng tốt cả khảo sát địa hình và dẫn hướng cánh tay.',
    tradeoffNoteEn: 'Solid performance for both terrain surveys and arm guidance.',
    purchaseCost: 135,
    maintenanceCost: 20,
    durability: 84,
    performance: 86,
    reliability: 85,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_cam_pro',
    subsystemId: 'rover_camera',
    tier: 'premium',
    name: 'Mastcam-Z Quang Phổ Cao Cấp',
    nameEn: 'Mastcam-Z Multispectral Zoom',
    shortDesc: 'Thu phóng cực xa, nhận diện khoáng vật từ khoảng cách lớn.',
    shortDescEn: 'Long-range optical zoom identifying minerals from afar.',
    tradeoffNote: 'Hiệu suất cao nhưng ngốn điện và giá mua cao.',
    tradeoffNoteEn: 'High science output, but draws more power at a steeper price.',
    purchaseCost: 215,
    maintenanceCost: 15,
    durability: 95,
    performance: 98,
    reliability: 94,
    powerDrawW: 34,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },

  // rover_arm
  {
    id: 'p_rover_arm_eco',
    subsystemId: 'rover_arm',
    tier: 'economy',
    name: 'Tay Gắp Mũi Khoan Nhẹ',
    nameEn: 'Light-Duty Rotary Drill Arm',
    shortDesc: 'Khoan được đá mềm nhưng dễ rung và kẹt khi gặp đá bazan cứng.',
    shortDescEn: 'Drills soft sediment, yet vibrates and jams on hard basalt.',
    tradeoffNote: 'Tiềm ẩn rủi ro hỏng đầu khoan khi lấy nhiều mẫu.',
    tradeoffNoteEn: 'Higher risk of drill jamming across multiple core samples.',
    purchaseCost: 100,
    maintenanceCost: 45,
    durability: 56,
    performance: 58,
    reliability: 55,
    powerDrawW: 35,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_arm_std',
    subsystemId: 'rover_arm',
    tier: 'standard',
    name: 'Cánh Tay Khoan Mẫu Tiêu Chuẩn',
    nameEn: 'Standard Coring Arm Assembly',
    shortDesc: 'Độ chính xác tốt, kèm cảm biến lực bảo vệ mũi khoan.',
    shortDescEn: 'Accurate positioning with force sensors to protect the drill bit.',
    tradeoffNote: 'Hoạt động ổn định nếu camera và nguồn điện khỏe.',
    tradeoffNoteEn: 'Dependable when paired with healthy power and optics.',
    purchaseCost: 170,
    maintenanceCost: 25,
    durability: 82,
    performance: 82,
    reliability: 84,
    powerDrawW: 32,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_arm_pro',
    subsystemId: 'rover_arm',
    tier: 'premium',
    name: 'Hệ Khoan Lõi Siêu Âm SHERLOC',
    nameEn: 'SHERLOC Precision Coring Turret',
    shortDesc: 'Khoan đá cứng chính xác milimét, tự niêm phong ống mẫu an toàn.',
    shortDescEn: 'Millimeter-accurate hard-rock drilling with sealed sample tubes.',
    tradeoffNote: 'Rất đáng đầu tư để tránh mất mẫu quý giá.',
    tradeoffNoteEn: 'Worthwhile core investment to protect irreplaceable samples.',
    purchaseCost: 245,
    maintenanceCost: 15,
    durability: 97,
    performance: 97,
    reliability: 96,
    powerDrawW: 30,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },

  // rover_comms
  {
    id: 'p_rover_comms_eco',
    subsystemId: 'rover_comms',
    tier: 'economy',
    name: 'Ăng-ten Sóng Ngắn LGA',
    nameEn: 'Low-Gain Omni Antenna (LGA)',
    shortDesc: 'Truyền dữ liệu chậm, dễ mất gói tin khi vệ tinh chuyển tiếp bay xa.',
    shortDescEn: 'Slow data rate; drops packets when relay orbiters pass far overhead.',
    tradeoffNote: 'Rẻ, đủ dùng nếu chỉ gửi ít gói dữ liệu.',
    tradeoffNoteEn: 'Low cost; suitable only for lightweight telemetry batches.',
    purchaseCost: 70,
    maintenanceCost: 30,
    durability: 64,
    performance: 58,
    reliability: 64,
    powerDrawW: 16,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_comms_std',
    subsystemId: 'rover_comms',
    tier: 'standard',
    name: 'Ăng-ten Tiếp Sóng UHF MRO',
    nameEn: 'MRO UHF Relay Antenna',
    shortDesc: 'Tốc độ truyền ảnh tốt qua vệ tinh bay quanh Sao Hỏa.',
    shortDescEn: 'Strong image transfer speed via Mars orbital relay satellites.',
    tradeoffNote: 'Cân bằng hoàn hảo giữa giá thành và độ ổn định.',
    tradeoffNoteEn: 'Ideal balance between price and link stability.',
    purchaseCost: 125,
    maintenanceCost: 20,
    durability: 85,
    performance: 86,
    reliability: 86,
    powerDrawW: 22,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },
  {
    id: 'p_rover_comms_pro',
    subsystemId: 'rover_comms',
    tier: 'premium',
    name: 'Chảo Định Hướng Cao HGA + UHF Kép',
    nameEn: 'Dual HGA Dish + UHF Array',
    shortDesc: 'Liên lạc thẳng về Trái Đất lẫn qua vệ tinh với băng thông cực lớn.',
    shortDescEn: 'Direct-to-Earth and orbiter relay links with massive bandwidth.',
    tradeoffNote: 'Đắt và tốn điện hơn mức cần thiết nếu ngân sách hạn hẹp.',
    tradeoffNoteEn: 'Expensive and power-hungry if mission funds are tight.',
    purchaseCost: 205,
    maintenanceCost: 15,
    durability: 96,
    performance: 97,
    reliability: 97,
    powerDrawW: 34,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
  },

  // ---------- LANDSAT 9 ----------
  // sat_power
  {
    id: 'p_sat_power_eco',
    subsystemId: 'sat_power',
    tier: 'economy',
    name: 'Pin Mặt Trời Silicon Cũ',
    nameEn: 'Legacy Silicon Solar Wing',
    shortDesc: 'Đủ cấp điện cho 2 vùng quan sát mỗi vòng quỹ đạo, nhanh chai pin.',
    shortDescEn: 'Powers up to 2 scan targets per orbit; degrades quickly over time.',
    tradeoffNote: 'Giá thấp nhưng buộc phải cắt giảm lịch chụp ảnh.',
    tradeoffNoteEn: 'Low cost, but limits total Earth scan targets per orbit.',
    purchaseCost: 90,
    maintenanceCost: 35,
    durability: 60,
    performance: 60,
    reliability: 62,
    powerDrawW: 0,
    powerGenW: 105,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_power_std',
    subsystemId: 'sat_power',
    tier: 'standard',
    name: 'Cánh Pin GaAs Tiêu Chuẩn',
    nameEn: 'Standard GaAs Solar Wing',
    shortDesc: 'Cấp điện bền bỉ cho cảm biến OLI-2, TIRS-2 và phát sóng băng X.',
    shortDescEn: 'Steady power for OLI-2, TIRS-2, and X-Band downlink passes.',
    tradeoffNote: 'Cân bằng chi phí, đủ tải lịch quan sát chuẩn.',
    tradeoffNoteEn: 'Cost-effective capacity for standard orbital schedules.',
    purchaseCost: 155,
    maintenanceCost: 20,
    durability: 84,
    performance: 84,
    reliability: 86,
    powerDrawW: 0,
    powerGenW: 145,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_power_pro',
    subsystemId: 'sat_power',
    tier: 'premium',
    name: 'Cánh Pin Ba Lớp Hiệu Suất Cao',
    nameEn: 'Triple-Junction Solar Array',
    shortDesc: 'Công suất dư dả cho mọi nhiệm vụ quét liên tục và truyền dữ liệu.',
    shortDescEn: 'Surplus output supporting continuous full-orbit scans and telemetry.',
    tradeoffNote: 'Giá cao; chỉ cần thiết nếu mở hết tất cả vùng chụp cùng lúc.',
    tradeoffNoteEn: 'Pricey; mainly needed when scheduling every region at once.',
    purchaseCost: 235,
    maintenanceCost: 12,
    durability: 96,
    performance: 98,
    reliability: 96,
    powerDrawW: 0,
    powerGenW: 185,
    compatibleMissions: ['mission_02_earth_satellite'],
  },

  // sat_processor
  {
    id: 'p_sat_proc_eco',
    subsystemId: 'sat_processor',
    tier: 'economy',
    name: 'Bộ Nhớ Nén Dữ Liệu Cơ Bản',
    nameEn: 'Basic Compression Buffer',
    shortDesc: 'Tốc độ xử lý chậm, đôi khi gây sọc ảnh khi chụp đa kênh.',
    shortDescEn: 'Slow throughput; occasionally creates scan-line artifacts in multi-band mode.',
    tradeoffNote: 'Dễ nghẽn cổ chai ảnh hưởng đến cả OLI-2 và TIRS-2.',
    tradeoffNoteEn: 'Can bottleneck both OLI-2 and TIRS-2 data streams.',
    purchaseCost: 95,
    maintenanceCost: 40,
    durability: 58,
    performance: 58,
    reliability: 57,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_proc_std',
    subsystemId: 'sat_processor',
    tier: 'standard',
    name: 'Máy Tính Quỹ Đạo Chống Nhiễu',
    nameEn: 'Shielded Orbital Flight Computer',
    shortDesc: 'Xử lý ổn định dữ liệu quang học lẫn bản đồ nhiệt 14-bit.',
    shortDescEn: 'Steadily handles 14-bit optical imagery and thermal mapping.',
    tradeoffNote: 'Đáp ứng tốt ở mức Cấp 1 và Cấp 2.',
    tradeoffNoteEn: 'Reliable for Orientation and Technician mission tiers.',
    purchaseCost: 165,
    maintenanceCost: 22,
    durability: 82,
    performance: 83,
    reliability: 85,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_proc_pro',
    subsystemId: 'sat_processor',
    tier: 'premium',
    name: 'Bộ Xử Lý RAD-Hardened Tốc Độ Cao',
    nameEn: 'High-Speed RAD-Hardened Processor',
    shortDesc: 'Tự sửa lỗi bit do tia vũ trụ, xếp lịch chụp thông minh không độ trễ.',
    shortDescEn: 'Auto-corrects cosmic-ray bit flips and schedules scans with zero lag.',
    tradeoffNote: 'Rất hiệu quả cho bộ não vệ tinh ở Cấp 3–4.',
    tradeoffNoteEn: 'Ideal core upgrade for Level 3–4 orbital workloads.',
    purchaseCost: 240,
    maintenanceCost: 12,
    durability: 97,
    performance: 97,
    reliability: 98,
    powerDrawW: 26,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },

  // sat_oli
  {
    id: 'p_sat_oli_eco',
    subsystemId: 'sat_oli',
    tier: 'economy',
    name: 'Cảm Biến Quang Học 4 Kênh',
    nameEn: '4-Band Optical Imager',
    shortDesc: 'Chi phí thấp nhưng ảnh mờ ở vùng nhiều mây và thiếu kênh cận hồng ngoại.',
    shortDescEn: 'Low cost, but hazy over clouds and lacks near-infrared sensitivity.',
    tradeoffNote: 'Giảm độ sắc nét ảnh vệ tinh.',
    tradeoffNoteEn: 'Reduces Earth observation image clarity.',
    purchaseCost: 105,
    maintenanceCost: 40,
    durability: 60,
    performance: 60,
    reliability: 60,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_oli_std',
    subsystemId: 'sat_oli',
    tier: 'standard',
    name: 'Cảm Biến OLI-2 Tiêu Chuẩn',
    nameEn: 'Standard OLI-2 Imager',
    shortDesc: 'Ghi hình 9 dải phổ rõ nét, phát hiện thảm thực vật và bờ biển tốt.',
    shortDescEn: 'Crisp 9-band imaging for forests, coastlines, and vegetation health.',
    tradeoffNote: 'Tin cậy và đủ chuẩn nghiên cứu khí hậu.',
    tradeoffNoteEn: 'Trustworthy climate-research imaging baseline.',
    purchaseCost: 175,
    maintenanceCost: 22,
    durability: 84,
    performance: 86,
    reliability: 85,
    powerDrawW: 32,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_oli_pro',
    subsystemId: 'sat_oli',
    tier: 'premium',
    name: 'Cảm Biến OLI-2 Chuẩn 14-Bit Siêu Nét',
    nameEn: 'Ultra-Sharp 14-Bit OLI-2 Suite',
    shortDesc: 'Độ phân giải 15m sắc nét vượt trội, nhận diện cháy rừng sớm nhất.',
    shortDescEn: 'Superior 15m resolution for early wildfire and drought detection.',
    tradeoffNote: 'Cốt lõi sứ mệnh chụp ảnh Landsat 9.',
    tradeoffNoteEn: 'Core payload defining Landsat 9 image science.',
    purchaseCost: 255,
    maintenanceCost: 15,
    durability: 96,
    performance: 98,
    reliability: 97,
    powerDrawW: 36,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },

  // sat_tirs
  {
    id: 'p_sat_tirs_eco',
    subsystemId: 'sat_tirs',
    tier: 'economy',
    name: 'Nhiệt Kế Hồng Ngoại Đơn Kênh',
    nameEn: 'Single-Channel IR Radiometer',
    shortDesc: 'Dễ sai lệch 3–5°C khi bay qua vùng chuyển ngày đêm.',
    shortDescEn: 'Drifts 3–5°C across day-night terminator transitions.',
    tradeoffNote: 'Rẻ nhưng có nguy cơ báo nhiệt độ giả.',
    tradeoffNoteEn: 'Inexpensive, yet prone to false thermal readings.',
    purchaseCost: 85,
    maintenanceCost: 35,
    durability: 58,
    performance: 60,
    reliability: 60,
    powerDrawW: 20,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_tirs_std',
    subsystemId: 'sat_tirs',
    tier: 'standard',
    name: 'Cảm Biến Nhiệt TIRS-2 Kép',
    nameEn: 'Dual-Band TIRS-2 Thermal Sensor',
    shortDesc: 'Đo chính xác nhiệt độ bề mặt đất và biển với 2 băng nhiệt.',
    shortDescEn: 'Measures land and ocean temperatures accurately across 2 thermal bands.',
    tradeoffNote: 'Phân biệt tốt giữa lỗi cảm biến và biến đổi nhiệt thực tế.',
    tradeoffNoteEn: 'Distinguishes sensor glitches from real surface heat anomalies.',
    purchaseCost: 145,
    maintenanceCost: 20,
    durability: 85,
    performance: 86,
    reliability: 86,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_tirs_pro',
    subsystemId: 'sat_tirs',
    tier: 'premium',
    name: 'TIRS-2 Làm Lạnh Chủ Động Cryo',
    nameEn: 'Cryo-Cooled TIRS-2 Precision Array',
    shortDesc: 'Chính xác tuyệt đối ±0.2°C nhưng tiêu thụ điện và giá thành cao.',
    shortDescEn: 'Pinpoint ±0.2°C accuracy with higher power demand and purchase price.',
    tradeoffNote: 'Thích hợp khi ưu tiên dữ liệu nhiệt chuyên sâu.',
    tradeoffNoteEn: 'Best reserved when deep thermal precision is critical.',
    purchaseCost: 225,
    maintenanceCost: 14,
    durability: 96,
    performance: 98,
    reliability: 95,
    powerDrawW: 34,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },

  // sat_comms
  {
    id: 'p_sat_comms_eco',
    subsystemId: 'sat_comms',
    tier: 'economy',
    name: 'Bộ Phát Băng S Tốc Độ Thấp',
    nameEn: 'Low-Rate S-Band Transmitter',
    shortDesc: 'Tải ảnh lớn chậm, dễ mất tín hiệu khi thời tiết trạm mặt đất xấu.',
    shortDescEn: 'Slow image download; drops signal in poor ground-station weather.',
    tradeoffNote: 'Rẻ, chỉ hợp gửi gói tin nhỏ.',
    tradeoffNoteEn: 'Cheaper unit suited only to small telemetry files.',
    purchaseCost: 75,
    maintenanceCost: 30,
    durability: 62,
    performance: 60,
    reliability: 63,
    powerDrawW: 18,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_comms_std',
    subsystemId: 'sat_comms',
    tier: 'standard',
    name: 'Ăng-ten Băng Tần X Chuẩn NASA',
    nameEn: 'NASA Standard X-Band Downlink',
    shortDesc: 'Truyền trực tiếp ảnh phân giải cao xuống Svalbard & Alaska.',
    shortDescEn: 'Streams high-resolution imagery directly to Svalbard & Alaska.',
    tradeoffNote: 'Hiệu quả và tiết kiệm nhất cho vệ tinh quan sát.',
    tradeoffNoteEn: 'Most efficient downlink value for Earth observation.',
    purchaseCost: 135,
    maintenanceCost: 18,
    durability: 86,
    performance: 88,
    reliability: 88,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },
  {
    id: 'p_sat_comms_pro',
    subsystemId: 'sat_comms',
    tier: 'premium',
    name: 'Hệ Truyền Dữ Liệu Laser Quang Học',
    nameEn: 'Optical Laser Comms Link',
    shortDesc: 'Tốc độ truyền siêu nhanh gấp 4 lần, giá rất cao.',
    shortDescEn: '4x faster optical downlink throughput at a premium price.',
    tradeoffNote: 'Dư thừa nhẹ so với nhu cầu truyền ảnh thông thường.',
    tradeoffNoteEn: 'Over-spec for routine orbital downlink passes.',
    purchaseCost: 215,
    maintenanceCost: 15,
    durability: 94,
    performance: 99,
    reliability: 94,
    powerDrawW: 32,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
  },

  // ---------- ISS ----------
  // iss_power
  {
    id: 'p_iss_power_eco',
    subsystemId: 'iss_power',
    tier: 'economy',
    name: 'Pin Ni-H2 Đời Cũ & Tấm Pin Mòn',
    nameEn: 'Aging Ni-H2 Cells & Worn Wings',
    shortDesc: 'Dự trữ điện ít trong 45 phút bay đêm, dễ sụt áp khi bật nhiều khoang.',
    shortDescEn: 'Low reserve during 45-minute orbital nights; sags under multi-lab loads.',
    tradeoffNote: 'Rủi ro thiếu điện hỗ trợ sự sống rất cao.',
    tradeoffNoteEn: 'High risk of power shortfall for life-support systems.',
    purchaseCost: 120,
    maintenanceCost: 50,
    durability: 54,
    performance: 58,
    reliability: 55,
    powerDrawW: 0,
    powerGenW: 120,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_power_std',
    subsystemId: 'iss_power',
    tier: 'standard',
    name: 'Tổ Hợp Pin Li-Ion Chuẩn ISS',
    nameEn: 'ISS Standard Li-Ion Battery Bank',
    shortDesc: 'Cấp điện ổn định cho sinh hoạt và thí nghiệm cơ bản.',
    shortDescEn: 'Steady electrical supply for crew quarters and routine labs.',
    tradeoffNote: 'Cần phân bổ điện khéo léo trong vùng tối.',
    tradeoffNoteEn: 'Requires careful power balancing during orbital eclipse.',
    purchaseCost: 205,
    maintenanceCost: 25,
    durability: 82,
    performance: 82,
    reliability: 84,
    powerDrawW: 0,
    powerGenW: 165,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_power_pro',
    subsystemId: 'iss_power',
    tier: 'premium',
    name: 'Cánh Pin Cuộn iROSA + Pin Li-Ion Cao Cấp',
    nameEn: 'Upgraded iROSA Wings + Li-Ion Pro',
    shortDesc: 'Tăng 30% công suất điện trạm, bảo vệ an toàn tối đa cho phi hành gia.',
    shortDescEn: 'Boosts station power by 30% for maximum crew life-support safety.',
    tradeoffNote: 'Khoản đầu tư then chốt giúp trạm không mất điện.',
    tradeoffNoteEn: 'Critical core investment preventing station blackouts.',
    purchaseCost: 290,
    maintenanceCost: 15,
    durability: 98,
    performance: 97,
    reliability: 98,
    powerDrawW: 0,
    powerGenW: 215,
    compatibleMissions: ['mission_03_space_station'],
  },

  // iss_thermal
  {
    id: 'p_iss_therm_eco',
    subsystemId: 'iss_thermal',
    tier: 'economy',
    name: 'Van Tản Nhiệt Cơ Học Đơn',
    nameEn: 'Single Mechanical Radiator Valve',
    shortDesc: 'Tản nhiệt chậm khi trạm hướng thẳng Mặt Trời, dễ quá nhiệt.',
    shortDescEn: 'Slow heat rejection in direct sunlight; prone to overheating.',
    tradeoffNote: 'Có thể làm giảm hiệu suất các khoang thí nghiệm.',
    tradeoffNoteEn: 'May throttle science labs during high solar exposure.',
    purchaseCost: 95,
    maintenanceCost: 40,
    durability: 58,
    performance: 60,
    reliability: 60,
    powerDrawW: 22,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_therm_std',
    subsystemId: 'iss_thermal',
    tier: 'standard',
    name: 'Vòng Tuần Hoàn Amoniac Kép',
    nameEn: 'Dual Ammonia Coolant Loops',
    shortDesc: 'Giữ nhiệt độ khoang ổn định 20–24°C suốt chu kỳ ngày đêm.',
    shortDescEn: 'Holds cabin temperature steady at 20–24°C across day and night.',
    tradeoffNote: 'Lựa chọn cân bằng, tin cậy cao.',
    tradeoffNoteEn: 'Reliable, well-balanced thermal regulation.',
    purchaseCost: 165,
    maintenanceCost: 20,
    durability: 86,
    performance: 86,
    reliability: 87,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_therm_pro',
    subsystemId: 'iss_thermal',
    tier: 'premium',
    name: 'Bơm Tản Nhiệt Dự Phòng Tự Động',
    nameEn: 'Auto-Redundant Thermal Pump',
    shortDesc: 'Tự chuyển mạch khi nghẽn van, không bao giờ quá nhiệt.',
    shortDescEn: 'Automatically switches loops on valve blockage to prevent overheating.',
    tradeoffNote: 'Chi phí cao, nên ưu tiên nếu ngân sách còn dư.',
    tradeoffNoteEn: 'Premium price; pick when extra budget remains after power.',
    purchaseCost: 245,
    maintenanceCost: 12,
    durability: 97,
    performance: 96,
    reliability: 97,
    powerDrawW: 32,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },

  // iss_lifesupport
  {
    id: 'p_iss_life_eco',
    subsystemId: 'iss_lifesupport',
    tier: 'economy',
    name: 'Bộ Lọc Oxy & Nước Tiêu Hao',
    nameEn: 'Consumable O2 & Water Filters',
    shortDesc: 'Tỷ lệ tái chế nước thấp (70%), tốn vật tư bổ sung liên tục.',
    shortDescEn: 'Low 70% water recovery; demands constant resupply cartridges.',
    tradeoffNote: 'Không khuyến khích cho trạm có phi hành đoàn.',
    tradeoffNoteEn: 'Not recommended for crewed long-duration station life support.',
    purchaseCost: 110,
    maintenanceCost: 50,
    durability: 56,
    performance: 58,
    reliability: 58,
    powerDrawW: 35,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_life_std',
    subsystemId: 'iss_lifesupport',
    tier: 'standard',
    name: 'Hệ ECLSS Tái Chế 88%',
    nameEn: '88%-Recovery ECLSS System',
    shortDesc: 'Cung cấp đủ O2 và nước sạch ổn định cho 6 phi hành gia.',
    shortDescEn: 'Supplies steady oxygen and clean water for a 6-astronaut crew.',
    tradeoffNote: 'Đáp ứng chuẩn an toàn nếu điện và nhiệt ổn định.',
    tradeoffNoteEn: 'Meets safety standards alongside stable power and cooling.',
    purchaseCost: 185,
    maintenanceCost: 25,
    durability: 84,
    performance: 84,
    reliability: 85,
    powerDrawW: 38,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_life_pro',
    subsystemId: 'iss_lifesupport',
    tier: 'premium',
    name: 'Hệ Hỗ Trợ Sự Sống Khép Kín 98%',
    nameEn: '98% Closed-Loop ECLSS Suite',
    shortDesc: 'Tái chế gần như hoàn toàn nước và khí thở, an toàn sinh mạng tối đa.',
    shortDescEn: 'Near-total water and air recycling for peak astronaut life safety.',
    tradeoffNote: 'Bộ phận bảo vệ tính mạng con người đáng đầu tư nhất trên ISS.',
    tradeoffNoteEn: 'Highest-priority crew life-safety investment aboard ISS.',
    purchaseCost: 265,
    maintenanceCost: 12,
    durability: 98,
    performance: 98,
    reliability: 98,
    powerDrawW: 40,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },

  // iss_comms
  {
    id: 'p_iss_comms_eco',
    subsystemId: 'iss_comms',
    tier: 'economy',
    name: 'Máy Thu Phát S-Band Dự Phòng',
    nameEn: 'Backup S-Band Transceiver',
    shortDesc: 'Chỉ truyền được giọng nói và chỉ số cơ bản, hay nhiễu.',
    shortDescEn: 'Voice and basic telemetry only; prone to static interference.',
    tradeoffNote: 'Tiết kiệm tiền cho các hệ thống sinh tồn.',
    tradeoffNoteEn: 'Frees budget for higher-priority life-support units.',
    purchaseCost: 75,
    maintenanceCost: 28,
    durability: 64,
    performance: 62,
    reliability: 65,
    powerDrawW: 16,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_comms_std',
    subsystemId: 'iss_comms',
    tier: 'standard',
    name: 'Hệ Ku-Band & S-Band Chuẩn',
    nameEn: 'Standard Ku-Band & S-Band Array',
    shortDesc: 'Liên lạc rõ ràng với Trái Đất qua mạng vệ tinh TDRS.',
    shortDescEn: 'Clear voice and data links to Houston via TDRS relay satellites.',
    tradeoffNote: 'Hợp lý nhất về chi phí và tốc độ dữ liệu.',
    tradeoffNoteEn: 'Best balance of downlink bandwidth and cost.',
    purchaseCost: 135,
    maintenanceCost: 18,
    durability: 86,
    performance: 87,
    reliability: 88,
    powerDrawW: 22,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },
  {
    id: 'p_iss_comms_pro',
    subsystemId: 'iss_comms',
    tier: 'premium',
    name: 'Cụm Anten Đa Băng Tần Tốc Độ Cao',
    nameEn: 'High-Speed Multi-Band Antenna',
    shortDesc: 'Truyền video HD và dữ liệu thí nghiệm liên tục không ngắt quãng.',
    shortDescEn: 'Uninterrupted HD video and continuous lab telemetry streams.',
    tradeoffNote: 'Giá cao, cân nhắc nếu ngân sách đang dành cho hệ sinh tồn.',
    tradeoffNoteEn: 'Costly; prioritize life support first if funds are limited.',
    purchaseCost: 210,
    maintenanceCost: 12,
    durability: 96,
    performance: 97,
    reliability: 96,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_03_space_station'],
  },

  // ---------- CANADARM2 ----------
  // arm_shoulder
  {
    id: 'p_arm_sh_eco',
    subsystemId: 'arm_shoulder',
    tier: 'economy',
    name: 'Mô-tơ Khớp Vai Cơ Bản',
    nameEn: 'Basic Shoulder Drive Motor',
    shortDesc: 'Xoay chậm và có độ rơ 2°, cần hiệu chỉnh kỹ trước khi vươn.',
    shortDescEn: 'Rotates slowly with 2° backlash; demands extra angle trimming.',
    tradeoffNote: 'Giá rẻ nhưng mất thêm thời gian căn góc.',
    tradeoffNoteEn: 'Inexpensive, though alignment takes longer.',
    purchaseCost: 90,
    maintenanceCost: 35,
    durability: 60,
    performance: 62,
    reliability: 63,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_sh_std',
    subsystemId: 'arm_shoulder',
    tier: 'standard',
    name: 'Cụm Khớp Vai Harmonic Chuẩn',
    nameEn: 'Standard Harmonic Shoulder Joint',
    shortDesc: 'Chịu tải tốt tàu hàng nhiều tấn, chuyển động êm và ổn định.',
    shortDescEn: 'Handles multi-ton cargo vehicles smoothly and steadily.',
    tradeoffNote: 'Lựa chọn chuẩn mực cho phần gốc cánh tay.',
    tradeoffNoteEn: 'Dependable baseline actuator for the arm base.',
    purchaseCost: 155,
    maintenanceCost: 20,
    durability: 86,
    performance: 86,
    reliability: 87,
    powerDrawW: 26,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_sh_pro',
    subsystemId: 'arm_shoulder',
    tier: 'premium',
    name: 'Khớp Vai Kép Dự Phòng Độ Chính Xác Cao',
    nameEn: 'Dual-Redundant Precision Shoulder',
    shortDesc: 'Không có độ rơ cơ khí, chống rung tuyệt đối khi xoay tải nặng.',
    shortDescEn: 'Zero mechanical backlash and rock-solid stability with heavy loads.',
    tradeoffNote: 'Chi phí cao hơn mức chuẩn cho thao tác gốc.',
    tradeoffNoteEn: 'Higher price than needed for coarse base rotation.',
    purchaseCost: 235,
    maintenanceCost: 12,
    durability: 97,
    performance: 97,
    reliability: 97,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },

  // arm_elbow
  {
    id: 'p_arm_el_eco',
    subsystemId: 'arm_elbow',
    tier: 'economy',
    name: 'Khớp Khuỷu Vòng Bi Phổ Thông',
    nameEn: 'Economy Bearing Elbow Joint',
    shortDesc: 'Dễ bị giật nhẹ khi đổi chiều chuyển động giữa nắng và bóng tối.',
    shortDescEn: 'Jitters slightly when reversing direction across thermal extremes.',
    tradeoffNote: 'Có thể làm lệch quỹ đạo đầu kẹp.',
    tradeoffNoteEn: 'May drift the end-effector trajectory off target.',
    purchaseCost: 95,
    maintenanceCost: 40,
    durability: 56,
    performance: 60,
    reliability: 58,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_el_std',
    subsystemId: 'arm_elbow',
    tier: 'standard',
    name: 'Khớp Khuỷu Servo Chống Nhiệt',
    nameEn: 'Thermal-Shielded Servo Elbow',
    shortDesc: 'Gập mở chính xác, ít bị ảnh hưởng bởi chênh lệch nhiệt độ quỹ đạo.',
    shortDescEn: 'Accurate folding pitch with minimal orbital temperature drift.',
    tradeoffNote: 'Đáp ứng tốt phần lớn thao tác bắt tàu hàng.',
    tradeoffNoteEn: 'Solid match for standard cargo grapple maneuvers.',
    purchaseCost: 165,
    maintenanceCost: 22,
    durability: 84,
    performance: 85,
    reliability: 86,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_el_pro',
    subsystemId: 'arm_elbow',
    tier: 'premium',
    name: 'Khớp Khuỷu Cảm Biến Quang Học 0.1°',
    nameEn: '0.1° Optical-Encoder Elbow',
    shortDesc: 'Điều khiển mượt mà từng 0.1 độ, giữ an toàn tối đa khi hỗ trợ phi hành gia.',
    shortDescEn: 'Silky 0.1° control protecting astronauts during spacewalk support.',
    tradeoffNote: 'Rất đáng đầu tư cho độ chính xác toàn cánh tay.',
    tradeoffNoteEn: 'Valuable precision upgrade for the entire robotic boom.',
    purchaseCost: 245,
    maintenanceCost: 12,
    durability: 98,
    performance: 98,
    reliability: 98,
    powerDrawW: 26,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },

  // arm_wrist
  {
    id: 'p_arm_wr_eco',
    subsystemId: 'arm_wrist',
    tier: 'economy',
    name: 'Đầu Kẹp Cơ Khí Đơn Giản',
    nameEn: 'Basic Mechanical Grapple End',
    shortDesc: 'Khóa chốt chậm, dễ báo lỗi trượt nếu lệch góc dù chỉ 2 độ.',
    shortDescEn: 'Latches slowly and triggers slip errors if misaligned by just 2°.',
    tradeoffNote: 'Rủi ro cao khi bắt tàu hàng hoặc phi hành gia.',
    tradeoffNoteEn: 'High operational risk during cargo capture or EVA holds.',
    purchaseCost: 105,
    maintenanceCost: 45,
    durability: 55,
    performance: 58,
    reliability: 56,
    powerDrawW: 22,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_wr_std',
    subsystemId: 'arm_wrist',
    tier: 'standard',
    name: 'Cổ Tay & Đầu Kẹp LEE Tiêu Chuẩn',
    nameEn: 'Standard Wrist & LEE Snare',
    shortDesc: 'Siết cáp kẹp chặt chuẩn NASA, có cảm biến tiếp xúc an toàn.',
    shortDescEn: 'NASA-spec snare cable lock with contact force feedback.',
    tradeoffNote: 'Ổn định cho nhiệm vụ gắp hàng hóa.',
    tradeoffNoteEn: 'Reliable baseline for cargo visiting-vehicle capture.',
    purchaseCost: 175,
    maintenanceCost: 22,
    durability: 84,
    performance: 85,
    reliability: 85,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_wr_pro',
    subsystemId: 'arm_wrist',
    tier: 'premium',
    name: 'Đầu Kẹp LEE Tự Cân Bằng Lực',
    nameEn: 'Force-Compliant Auto-Level LEE',
    shortDesc: 'Tự hấp thụ va chạm nhẹ, khóa chốt an toàn tuyệt đối cho phi hành gia.',
    shortDescEn: 'Dampens contact bump and locks securely for cargo and EVA crews.',
    tradeoffNote: 'Đầu tư xứng đáng cho bộ phận tiếp xúc trực tiếp.',
    tradeoffNoteEn: 'Smart investment on the primary payload contact interface.',
    purchaseCost: 255,
    maintenanceCost: 14,
    durability: 97,
    performance: 98,
    reliability: 98,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },

  // arm_camera
  {
    id: 'p_arm_cam_eco',
    subsystemId: 'arm_camera',
    tier: 'economy',
    name: 'Camera Đơn Sắc Độ Nét Thường',
    nameEn: 'Standard Monochrome Camera',
    shortDesc: 'Hơi chói khi gặp ánh nắng gắt, khó nhìn rõ vạch căn chốt.',
    shortDescEn: 'Glares in harsh orbital sunlight, making alignment marks harder to see.',
    tradeoffNote: 'Tiết kiệm chi phí, phù hợp khi các khớp tay đã rất chuẩn.',
    tradeoffNoteEn: 'Saves funds when shoulder and elbow actuators are high-grade.',
    purchaseCost: 70,
    maintenanceCost: 28,
    durability: 64,
    performance: 64,
    reliability: 65,
    powerDrawW: 14,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_cam_std',
    subsystemId: 'arm_camera',
    tier: 'standard',
    name: 'Camera Tâm Ngắm Đầu Kẹp HD',
    nameEn: 'HD Boresight Target Camera',
    shortDesc: 'Hiển thị rõ tâm chữ thập và đo khoảng cách tới chốt tàu hàng.',
    shortDescEn: 'Displays crisp alignment crosshairs and range to the grapple pin.',
    tradeoffNote: 'Cân bằng hoàn hảo giữa chi phí và tầm nhìn.',
    tradeoffNoteEn: 'Optimal balance of visibility and cost.',
    purchaseCost: 125,
    maintenanceCost: 18,
    durability: 86,
    performance: 88,
    reliability: 87,
    powerDrawW: 18,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },
  {
    id: 'p_arm_cam_pro',
    subsystemId: 'arm_camera',
    tier: 'premium',
    name: 'Hệ Camera 3D LiDAR + Hồng Ngoại',
    nameEn: '3D LiDAR + Infrared Vision Suite',
    shortDesc: 'Quét khoảng cách laser chính xác từng milimét cả trong bóng tối.',
    shortDescEn: 'Millimeter-accurate laser rangefinding even in orbital night.',
    tradeoffNote: 'Giá đắt, nên cân nhắc với ngân sách khớp tay.',
    tradeoffNoteEn: 'Expensive; weigh against joint actuator budget.',
    purchaseCost: 205,
    maintenanceCost: 12,
    durability: 95,
    performance: 98,
    reliability: 95,
    powerDrawW: 26,
    powerGenW: 0,
    compatibleMissions: ['mission_04_robotic_arm'],
  },

  // ---------- HUBBLE ----------
  // hst_power
  {
    id: 'p_hst_power_eco',
    subsystemId: 'hst_power',
    tier: 'economy',
    name: 'Pin Ni-H2 Dung Lượng Nhỏ',
    nameEn: 'Small-Capacity Ni-H2 Battery',
    shortDesc: 'Chỉ đủ chạy 1–2 mục tiêu quan sát ngắn trong một phiên.',
    shortDescEn: 'Only supports 1–2 brief observation targets per orbit session.',
    tradeoffNote: 'Buộc phải tắt bớt cảm biến phụ khi kính vào vùng tối.',
    tradeoffNoteEn: 'Forces secondary sensors off during orbital shadow.',
    purchaseCost: 95,
    maintenanceCost: 38,
    durability: 58,
    performance: 60,
    reliability: 60,
    powerDrawW: 0,
    powerGenW: 110,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_power_std',
    subsystemId: 'hst_power',
    tier: 'standard',
    name: 'Tấm Pin Cứng + Pin Li-Ion Chuẩn',
    nameEn: 'Rigid Solar Wings + Standard Li-Ion',
    shortDesc: 'Cung cấp điện ổn định cho cả hệ định hướng và camera khoa học.',
    shortDescEn: 'Steady power for guidance sensors and deep-space cameras.',
    tradeoffNote: 'Hiệu quả kinh tế cao cho kính thiên văn.',
    tradeoffNoteEn: 'High value power baseline for orbital astronomy.',
    purchaseCost: 165,
    maintenanceCost: 20,
    durability: 85,
    performance: 85,
    reliability: 86,
    powerDrawW: 0,
    powerGenW: 155,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_power_pro',
    subsystemId: 'hst_power',
    tier: 'premium',
    name: 'Tổ Hợp Năng Lượng Siêu Bền NASA',
    nameEn: 'NASA Heavy-Duty Power Suite',
    shortDesc: 'Dư điện cho nhiều ca phơi sáng liên tiếp suốt nhiều giờ.',
    shortDescEn: 'Abundant reserve for back-to-back multi-hour deep exposures.',
    tradeoffNote: 'Đắt đỏ, cân nhắc dành tiền cho gương quang học và định hướng.',
    tradeoffNoteEn: 'Expensive; consider reserving funds for optics and guidance.',
    purchaseCost: 245,
    maintenanceCost: 12,
    durability: 97,
    performance: 97,
    reliability: 97,
    powerDrawW: 0,
    powerGenW: 195,
    compatibleMissions: ['mission_05_space_telescope'],
  },

  // hst_guidance
  {
    id: 'p_hst_guid_eco',
    subsystemId: 'hst_guidance',
    tier: 'economy',
    name: 'Bộ 2 Con Quay Hồi Chuyển Cơ Bản',
    nameEn: 'Basic 2-Gyroscope Attitude Unit',
    shortDesc: 'Dễ trôi hướng khi kính quay sang mục tiêu mới, gây vệt sao mờ.',
    shortDescEn: 'Drifts after slewing to new targets, causing smeared star trails.',
    tradeoffNote: 'Rủi ro ảnh bị nhòe khi chụp phơi sáng lâu.',
    tradeoffNoteEn: 'High risk of blurred long-exposure galaxy frames.',
    purchaseCost: 110,
    maintenanceCost: 48,
    durability: 54,
    performance: 58,
    reliability: 56,
    powerDrawW: 26,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_guid_std',
    subsystemId: 'hst_guidance',
    tier: 'standard',
    name: 'Cụm 3 Con Quay & Cảm Biến FGS',
    nameEn: '3-Gyroscope & Standard FGS Unit',
    shortDesc: 'Khóa sao ổn định tốt cho phần lớn các thiên hà sáng.',
    shortDescEn: 'Holds steady star lock for most bright galaxies and nebulae.',
    tradeoffNote: 'Tin cậy ở Cấp 1–2, cần chỉnh tinh thêm ở Cấp 3–4.',
    tradeoffNoteEn: 'Reliable for Levels 1–2; needs extra trimming at Levels 3–4.',
    purchaseCost: 185,
    maintenanceCost: 24,
    durability: 83,
    performance: 84,
    reliability: 85,
    powerDrawW: 28,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_guid_pro',
    subsystemId: 'hst_guidance',
    tier: 'premium',
    name: 'Hệ FGS Quang Học Kép & Con Quay Khí Động',
    nameEn: 'Dual Optical FGS + Gas-Bearing Gyros',
    shortDesc: 'Khóa sao chuẩn 0.007 giây cung, ảnh sâu không bao giờ bị rung.',
    shortDescEn: 'Locks onto guide stars within 0.007 arcseconds with zero jitter.',
    tradeoffNote: 'Trái tim giữ ảnh Hubble sắc nét tuyệt đối.',
    tradeoffNoteEn: 'Essential heart of Hubble’s razor-sharp pointing.',
    purchaseCost: 265,
    maintenanceCost: 14,
    durability: 98,
    performance: 99,
    reliability: 98,
    powerDrawW: 30,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },

  // hst_optics
  {
    id: 'p_hst_opt_eco',
    subsystemId: 'hst_optics',
    tier: 'economy',
    name: 'Cảm Biến Ảnh Đời Đầu',
    nameEn: 'First-Gen Astronomy Sensor',
    shortDesc: 'Nhiễu hạt cao khi chụp tinh vân tối, thiếu dải tia cực tím.',
    shortDescEn: 'Grainy noise on faint nebulae and lacks ultraviolet sensitivity.',
    tradeoffNote: 'Chất lượng dữ liệu thiên văn bị giới hạn.',
    tradeoffNoteEn: 'Caps overall scientific depth of Hubble observations.',
    purchaseCost: 115,
    maintenanceCost: 45,
    durability: 58,
    performance: 58,
    reliability: 60,
    powerDrawW: 30,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_opt_std',
    subsystemId: 'hst_optics',
    tier: 'standard',
    name: 'Camera Trường Rộng WFPC2',
    nameEn: 'Wide Field Planetary Camera 2 (WFPC2)',
    shortDesc: 'Ảnh rõ nét trên cả dải ánh sáng nhìn thấy và hồng ngoại gần.',
    shortDescEn: 'Sharp imagery across visible light and near-infrared wavelengths.',
    tradeoffNote: 'Cân bằng giá và chất lượng ảnh thiên văn.',
    tradeoffNoteEn: 'Great mid-tier balance of price and imaging clarity.',
    purchaseCost: 190,
    maintenanceCost: 22,
    durability: 84,
    performance: 85,
    reliability: 85,
    powerDrawW: 34,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_opt_pro',
    subsystemId: 'hst_optics',
    tier: 'premium',
    name: 'Camera WFC3 Siêu Nhạy & Gương Hiệu Chỉnh',
    nameEn: 'Ultra-Sensitive WFC3 + Corrective Optics',
    shortDesc: 'Chụp rõ những thiên hà xa hàng tỷ năm ánh sáng và bầu khí quyển ngoại hành tinh.',
    shortDescEn: 'Resolves galaxies billions of light-years away and exoplanet atmospheres.',
    tradeoffNote: 'Hiệu suất khoa học cao nhất cho kính Hubble.',
    tradeoffNoteEn: 'Top scientific return for Hubble deep-sky missions.',
    purchaseCost: 270,
    maintenanceCost: 14,
    durability: 97,
    performance: 99,
    reliability: 97,
    powerDrawW: 38,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },

  // hst_computer
  {
    id: 'p_hst_comp_eco',
    subsystemId: 'hst_computer',
    tier: 'economy',
    name: 'Bộ Xử Lý Lưu Trữ Băng Từ Cũ',
    nameEn: 'Legacy Tape-Buffer Computer',
    shortDesc: 'Chỉ lưu tối đa 2 mục tiêu quan sát mỗi phiên, dễ treo lệnh.',
    shortDescEn: 'Stores at most 2 science targets per session and can stall queues.',
    tradeoffNote: 'Hạn chế kế hoạch quan sát khoa học.',
    tradeoffNoteEn: 'Restricts multi-target astronomical scheduling.',
    purchaseCost: 75,
    maintenanceCost: 30,
    durability: 60,
    performance: 60,
    reliability: 62,
    powerDrawW: 18,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_comp_std',
    subsystemId: 'hst_computer',
    tier: 'standard',
    name: 'Máy Tính Điều Phối Lịch Quỹ Đạo',
    nameEn: 'Orbital Schedule Flight Computer',
    shortDesc: 'Sắp xếp mượt mà lịch chụp nhiều tinh vân và tối ưu pin.',
    shortDescEn: 'Smoothly orders nebula targets while managing battery reserve.',
    tradeoffNote: 'Chi phí hợp lý, đủ đáp ứng mọi ca quan sát.',
    tradeoffNoteEn: 'Fairly priced and capable for any observation shift.',
    purchaseCost: 135,
    maintenanceCost: 18,
    durability: 86,
    performance: 87,
    reliability: 87,
    powerDrawW: 20,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
  {
    id: 'p_hst_comp_pro',
    subsystemId: 'hst_computer',
    tier: 'premium',
    name: 'Máy Tính Tự Động Hóa AI Quỹ Đạo',
    nameEn: 'Autonomous Sun-Avoidance Computer',
    shortDesc: 'Tự tính góc tránh Mặt Trời và tối ưu thời gian phơi sáng từng giây.',
    shortDescEn: 'Auto-plots Sun avoidance angles and optimizes exposure timing.',
    tradeoffNote: 'Giá cao, vượt quá mức cần thiết nếu bạn đã tự lập lịch giỏi.',
    tradeoffNoteEn: 'High cost; unnecessary if you already schedule targets cleanly.',
    purchaseCost: 215,
    maintenanceCost: 12,
    durability: 96,
    performance: 98,
    reliability: 96,
    powerDrawW: 24,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
  },
];

// Cross-device incompatible parts shown as safety guards (cannot be installed!)
export const INCOMPATIBLE_DECOY_PARTS: Record<MissionId, EngineeringPart> = {
  mission_01_mars_rover: {
    id: 'incompat_for_rover',
    subsystemId: 'rover_camera',
    tier: 'economy',
    name: 'Ống Kính Kính Thiên Văn Quỹ Đạo L2',
    nameEn: 'Deep-Space L2 Telescope Lens',
    shortDesc: 'Thiết kế cho chân không lạnh sâu, sẽ bám bụi và kẹt ngàm ngay trên Sao Hỏa.',
    shortDescEn: 'Built for deep-space vacuum; clogs with dust and fails rover mount.',
    tradeoffNote: 'Không tương thích kích thước ngàm và môi trường bụi Sao Hỏa.',
    tradeoffNoteEn: 'Incompatible mechanical mount and Martian dust climate.',
    purchaseCost: 80,
    maintenanceCost: 90,
    durability: 20,
    performance: 10,
    reliability: 10,
    powerDrawW: 40,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
    incompatibleReason: 'Sai chuẩn kết nối cơ khí và không chống được bụi mịn Sao Hỏa.',
    incompatibleReasonEn: 'Wrong mechanical interface and lacks sealing against fine Martian dust.',
  },
  mission_02_earth_satellite: {
    id: 'incompat_for_landsat',
    subsystemId: 'sat_oli',
    tier: 'economy',
    name: 'Cụm Bánh Xe Địa Hình Rover',
    nameEn: 'Mars Rover Wheel Assembly',
    shortDesc: 'Bánh xe chạy trên đất đá — hoàn toàn vô dụng trên vệ tinh bay quanh Trái Đất!',
    shortDescEn: 'Ground rover wheels — completely useless on an orbiting satellite!',
    tradeoffNote: 'Không tương thích với vệ tinh quỹ đạo Landsat 9.',
    tradeoffNoteEn: 'Incompatible with the Landsat 9 orbital spacecraft.',
    purchaseCost: 90,
    maintenanceCost: 90,
    durability: 10,
    performance: 0,
    reliability: 10,
    powerDrawW: 45,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
    incompatibleReason: 'Vệ tinh quỹ đạo không dùng bánh xe mặt đất và sai giao thức bus điện.',
    incompatibleReasonEn: 'Orbital satellites do not use ground wheels and use a different power bus.',
  },
  mission_03_space_station: {
    id: 'incompat_for_iss',
    subsystemId: 'iss_thermal',
    tier: 'economy',
    name: 'Quạt Gió Tản Nhiệt Khí Quyển Trái Đất',
    nameEn: 'Earth Atmospheric Cooling Fan',
    shortDesc: 'Không gian bên ngoài ISS là chân không — quạt gió không thể thổi nhiệt ra ngoài!',
    shortDescEn: 'Space outside ISS is a vacuum — air fans cannot blow heat away!',
    tradeoffNote: 'Không tương thích môi trường chân không quỹ đạo.',
    tradeoffNoteEn: 'Incompatible with orbital space vacuum.',
    purchaseCost: 60,
    maintenanceCost: 90,
    durability: 15,
    performance: 0,
    reliability: 10,
    powerDrawW: 30,
    powerGenW: 0,
    compatibleMissions: [],
    incompatibleReason: 'Ngoài trạm vũ trụ không có không khí để tản nhiệt đối lưu.',
    incompatibleReasonEn: 'There is no air outside the space station for convective fan cooling.',
  },
  mission_04_robotic_arm: {
    id: 'incompat_for_canadarm',
    subsystemId: 'arm_wrist',
    tier: 'economy',
    name: 'Mũi Khoan Đá Bazan Perseverance',
    nameEn: 'Perseverance Basalt Rock Drill',
    shortDesc: 'Dùng để khoan đá Sao Hỏa, không thể kẹp chốt neo tàu hàng Cygnus/Dragon.',
    shortDescEn: 'Designed to drill Mars rock — cannot snare Cygnus or Dragon cargo pins.',
    tradeoffNote: 'Sai chuẩn đầu kẹp LEE của trạm ISS.',
    tradeoffNoteEn: 'Wrong end-effector interface for ISS Canadarm2.',
    purchaseCost: 85,
    maintenanceCost: 90,
    durability: 15,
    performance: 0,
    reliability: 10,
    powerDrawW: 35,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
    incompatibleReason: 'Không có cáp siết chốt neo LEE; nguy cơ làm hư hỏng tàu hàng tiếp tế.',
    incompatibleReasonEn: 'Lacks LEE snare cables; would damage visiting cargo spacecraft.',
  },
  mission_05_space_telescope: {
    id: 'incompat_for_hubble',
    subsystemId: 'hst_optics',
    tier: 'economy',
    name: 'Camera Góc Rộng Chụp Đất Nông Nghiệp',
    nameEn: 'Wide-Angle Agricultural Earth Lens',
    shortDesc: 'Ống kính góc rộng nhìn gần, không thể hội tụ ánh sáng sao xa hàng triệu năm ánh sáng.',
    shortDescEn: 'Short-range wide-angle lens — cannot focus light from distant galaxies.',
    tradeoffNote: 'Không tương thích quang học thiên văn sâu của Hubble.',
    tradeoffNoteEn: 'Incompatible with Hubble deep-space optics.',
    purchaseCost: 75,
    maintenanceCost: 90,
    durability: 20,
    performance: 5,
    reliability: 10,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
    incompatibleReason: 'Tiêu cự không phù hợp gương chính 2.4m của kính thiên văn Hubble.',
    incompatibleReasonEn: 'Focal length does not match Hubble’s 2.4 m primary mirror.',
  },
};

export function getSubsystemsForMission(missionId: MissionId): SubsystemBlueprint[] {
  return SUBSYSTEM_BLUEPRINTS.filter((s) => s.missionId === missionId);
}

export function getPartsForSubsystem(subsystemId: EquipmentSubsystemId): EngineeringPart[] {
  return ENGINEERING_PARTS.filter((p) => p.subsystemId === subsystemId);
}

export function getPartById(partId: string): EngineeringPart | undefined {
  return (
    ENGINEERING_PARTS.find((p) => p.id === partId) ||
    Object.values(INCOMPATIBLE_DECOY_PARTS).find((p) => p.id === partId)
  );
}

export function getSubsystemBlueprint(subsystemId: EquipmentSubsystemId): SubsystemBlueprint | undefined {
  return SUBSYSTEM_BLUEPRINTS.find((s) => s.id === subsystemId);
}

export function getStandardBaselineCost(missionId: MissionId): number {
  const subs = getSubsystemsForMission(missionId);
  return subs.reduce((sum, s) => {
    const std = getPartsForSubsystem(s.id).find((p) => p.tier === 'standard');
    return sum + (std ? std.purchaseCost + std.maintenanceCost : 180);
  }, 0);
}

export function getMissionInitialBudget(missionId: MissionId, difficulty: DifficultyLevel): number {
  const profile = DIFFICULTY_PROFILES[difficulty];
  const baseline = getStandardBaselineCost(missionId) + profile.operatingBaseCost;
  return Math.round((baseline * profile.budgetFactor) / 10) * 10;
}

export function getTotalEconomySpent(economy: MissionEconomyState): number {
  return (
    economy.partsCost +
    economy.repairCost +
    economy.maintenanceCost +
    economy.operatingCost +
    economy.failurePenalty
  );
}

export function getRemainingBudget(economy: MissionEconomyState): number {
  return economy.initialBudget - getTotalEconomySpent(economy);
}

/**
 * Functional dependency calculation:
 * If any upstream dependency is 'failed', dependent subsystem cannot function ('failed').
 * If any upstream dependency is 'degraded', dependent subsystem performance degrades ('degraded').
 */
export function getEffectiveSubsystemState(
  session: MissionSessionState,
  subsystemId: EquipmentSubsystemId,
  lang: Language = 'vi'
): {
  status: SubsystemHealthStatus;
  health: number;
  blockedBy?: string;
  degradedBy?: string;
} {
  const runtime = session.subsystems[subsystemId];
  const bp = getSubsystemBlueprint(subsystemId);
  if (!runtime || !bp) {
    return { status: 'ok', health: 100 };
  }

  let effectiveStatus: SubsystemHealthStatus = runtime.status;
  let effectiveHealth = runtime.health;
  let blockedBy: string | undefined;
  let degradedBy: string | undefined;

  for (const depId of bp.dependsOn) {
    const depRuntime = session.subsystems[depId];
    const depBp = getSubsystemBlueprint(depId);
    if (!depRuntime || !depBp) continue;
    const depName = getSubsystemText(depBp, lang).name;

    if (depRuntime.status === 'failed') {
      effectiveStatus = 'failed';
      effectiveHealth = Math.min(effectiveHealth, 15);
      blockedBy = depName;
      break;
    }
    if (depRuntime.status === 'degraded' && effectiveStatus === 'ok') {
      effectiveStatus = 'degraded';
      effectiveHealth = Math.min(effectiveHealth, 65);
      degradedBy = depName;
    }
  }

  return { status: effectiveStatus, health: effectiveHealth, blockedBy, degradedBy };
}

interface FaultTemplate {
  subsystemId: EquipmentSubsystemId;
  status: SubsystemHealthStatus;
  health: number;
  faultTitle: string;
  faultTitleEn: string;
  faultCause: string;
  faultCauseEn: string;
}

const MISSION_FAULT_TEMPLATES: Record<MissionId, FaultTemplate[]> = {
  mission_01_mars_rover: [
    {
      subsystemId: 'rover_mobility',
      status: 'failed',
      health: 22,
      faultTitle: 'Kẹt mô-tơ bánh trước trái',
      faultTitleEn: 'Front-Left Wheel Drive Motor Jam',
      faultCause: 'Bụi đá Jezero làm kẹt hộp số dẫn động bánh xe, robot không thể lăn bánh bình thường.',
      faultCauseEn: 'Jezero crater grit jammed the wheel drive gearbox, preventing normal rover driving.',
    },
    {
      subsystemId: 'rover_camera',
      status: 'degraded',
      health: 52,
      faultTitle: 'Ống kính Mastcam-Z bám bụi mờ',
      faultTitleEn: 'Dust Haze on Mastcam-Z Lens',
      faultCause: 'Gió bụi làm mờ cảm biến dẫn đường, không thể khảo sát an toàn địa hình đá và cát.',
      faultCauseEn: 'Windblown Martian dust clouded the optical sensor, blocking safe rock and sand terrain surveys.',
    },
    {
      subsystemId: 'rover_arm',
      status: 'failed',
      health: 28,
      faultTitle: 'Lệch trục khớp cánh tay khoan',
      faultTitleEn: 'Coring Arm Joint Misalignment',
      faultCause: 'Cảm biến lực cánh tay mất chuẩn khiến mũi khoan không thể hạ đúng vào mẫu đá.',
      faultCauseEn: 'Arm force sensor drift prevents the drill bit from seating squarely onto rock targets.',
    },
    {
      subsystemId: 'rover_comms',
      status: 'degraded',
      health: 48,
      faultTitle: 'Ăng-ten UHF suy giảm tín hiệu',
      faultTitleEn: 'UHF Relay Antenna Signal Attenuation',
      faultCause: 'Khớp xoay hướng bị kẹt nhẹ làm tốc độ chuyển tiếp ảnh về vệ tinh MRO sụt mạnh.',
      faultCauseEn: 'Partial gimbal binding sharply reduced image relay throughput to the Mars Reconnaissance Orbiter.',
    },
  ],
  mission_02_earth_satellite: [
    {
      subsystemId: 'sat_oli',
      status: 'failed',
      health: 25,
      faultTitle: 'Sọc nhiễu cảm biến ảnh OLI-2',
      faultTitleEn: 'OLI-2 Focal Plane Banding Noise',
      faultCause: 'Kênh thu ánh sáng xanh và cận hồng ngoại bị lỗi đồng bộ làm thiếu dải ảnh Trái Đất.',
      faultCauseEn: 'Blue and near-infrared readout channels lost sync, leaving gaps across Earth imagery strips.',
    },
    {
      subsystemId: 'sat_tirs',
      status: 'degraded',
      health: 46,
      faultTitle: 'Sai lệch điểm ảnh nhiệt TIRS-2',
      faultTitleEn: 'TIRS-2 Thermal Pixel Calibration Drift',
      faultCause: 'Bộ làm lạnh cảm biến nhiệt không ổn định tạo ra vùng nhiệt độ giả trên bản đồ.',
      faultCauseEn: 'Cryocooler instability introduced false temperature hot spots on the thermal map.',
    },
    {
      subsystemId: 'sat_processor',
      status: 'failed',
      health: 30,
      faultTitle: 'Tràn bộ nhớ đệm xử lý dữ liệu',
      faultTitleEn: 'Data Processor Buffer Overflow',
      faultCause: 'Tia vũ trụ làm lỗi bộ xử lý trung tâm, khiến cả ảnh chụp và lịch quan sát bị ngắt.',
      faultCauseEn: 'Cosmic radiation upset the central processor, interrupting both image capture and observation scheduling.',
    },
    {
      subsystemId: 'sat_comms',
      status: 'degraded',
      health: 50,
      faultTitle: 'Suy hao bộ phát băng tần X',
      faultTitleEn: 'X-Band Transmitter Power Drop',
      faultCause: 'Công suất phát sóng yếu khiến trạm Svalbard không nhận đủ gói tin ảnh vệ tinh.',
      faultCauseEn: 'Weak RF output kept the Svalbard ground station from receiving complete satellite image packets.',
    },
  ],
  mission_03_space_station: [
    {
      subsystemId: 'iss_thermal',
      status: 'failed',
      health: 24,
      faultTitle: 'Tắc van tuần hoàn nhiệt Amoniac',
      faultTitleEn: 'Ammonia Thermal Loop Valve Blockage',
      faultCause: 'Nhiệt độ phòng thí nghiệm tăng vượt 33°C, buộc các hệ thống khác phải tự giảm tải.',
      faultCauseEn: 'Lab module temperature climbed past 33°C, forcing downstream systems to shed load.',
    },
    {
      subsystemId: 'iss_power',
      status: 'degraded',
      health: 50,
      faultTitle: 'Sụt áp tổ hợp pin khi vào bóng tối',
      faultTitleEn: 'Eclipse Battery Bus Voltage Sag',
      faultCause: 'Pin lưu trữ suy giảm dung lượng khiến lưới điện thiếu hụt 35% công suất khi khuất nắng.',
      faultCauseEn: 'Degraded battery cells reduced station bus capacity by 35% during orbital night.',
    },
    {
      subsystemId: 'iss_comms',
      status: 'degraded',
      health: 54,
      faultTitle: 'Mất khóa hướng ăng-ten Ku-Band',
      faultTitleEn: 'Ku-Band Antenna Pointing Lock Loss',
      faultCause: 'Ăng-ten không bám kịp vệ tinh chuyển tiếp TDRS làm gián đoạn truyền dữ liệu.',
      faultCauseEn: 'High-gain dish failed to track TDRS relay satellites, interrupting telemetry downlink.',
    },
    {
      subsystemId: 'iss_lifesupport',
      status: 'degraded',
      health: 45,
      faultTitle: 'Nghẽn lọc tái chế nước sạch',
      faultTitleEn: 'Water Recovery Filter Clog',
      faultCause: 'Áp suất bơm tái chế giảm mạnh làm lượng nước dự trữ cho phi hành đoàn tụt nhanh.',
      faultCauseEn: 'Recovery pump pressure dropped steeply, depleting crew potable water reserves.',
    },
  ],
  mission_04_robotic_arm: [
    {
      subsystemId: 'arm_elbow',
      status: 'failed',
      health: 25,
      faultTitle: 'Sai lệch cảm biến góc khớp khuỷu',
      faultTitleEn: 'Elbow Joint Angle Encoder Offset',
      faultCause: 'Khớp khuỷu bị giật lệch 4.5° khiến đầu kẹp không thể vươn đúng tọa độ tàu hàng.',
      faultCauseEn: 'A 4.5° elbow joint offset prevents the end effector from reaching cargo grapple coordinates.',
    },
    {
      subsystemId: 'arm_camera',
      status: 'failed',
      health: 30,
      faultTitle: 'Mất hình camera đầu kẹp LEE',
      faultTitleEn: 'LEE End-Effector Camera Feed Loss',
      faultCause: 'Nhiễu tín hiệu hình ảnh từ đầu kẹp khiến phi hành gia không nhìn thấy tâm chốt neo.',
      faultCauseEn: 'Video interference on the LEE camera hides the cargo grapple pin alignment target.',
    },
    {
      subsystemId: 'arm_wrist',
      status: 'degraded',
      health: 48,
      faultTitle: 'Lỏng cáp siết đầu kẹp cổ tay',
      faultTitleEn: 'Wrist LEE Snare Cable Slack',
      faultCause: 'Lực kẹp giảm còn 50%, không đủ an toàn để khóa tàu tiếp tế hoặc hỗ trợ phi hành gia.',
      faultCauseEn: 'Capture grip force dropped to 50%, unsafe for locking resupply craft or supporting EVA crew.',
    },
    {
      subsystemId: 'arm_shoulder',
      status: 'degraded',
      health: 55,
      faultTitle: 'Ma sát tăng ở khớp vai',
      faultTitleEn: 'Elevated Shoulder Joint Friction',
      faultCause: 'Chênh lệch nhiệt độ làm khớp vai xoay chậm và lệch trục nhẹ.',
      faultCauseEn: 'Thermal gradients slowed shoulder rotation and introduced slight axial drift.',
    },
  ],
  mission_05_space_telescope: [
    {
      subsystemId: 'hst_guidance',
      status: 'failed',
      health: 22,
      faultTitle: 'Trôi con quay hồi chuyển FGS',
      faultTitleEn: 'FGS Gyroscope Pointing Drift',
      faultCause: 'Kính thiên văn bị rung và trôi khỏi ngôi sao dẫn đường, không thể phơi sáng.',
      faultCauseEn: 'Telescope jittered off its guide star lock, preventing long-exposure imaging.',
    },
    {
      subsystemId: 'hst_optics',
      status: 'degraded',
      health: 48,
      faultTitle: 'Nhiễu cảm biến ảnh WFC3',
      faultTitleEn: 'WFC3 Detector Dark-Current Noise',
      faultCause: 'Bức xạ quỹ đạo làm mờ dải thu sáng cực tím và nhiễu hạt ảnh tinh vân.',
      faultCauseEn: 'Orbital radiation degraded ultraviolet sensitivity and speckled nebula exposures.',
    },
    {
      subsystemId: 'hst_power',
      status: 'degraded',
      health: 52,
      faultTitle: 'Sụt điện pin mặt trời khi qua bóng Trái Đất',
      faultTitleEn: 'Solar Array Bus Sag in Earth Shadow',
      faultCause: 'Nguồn điện dự trữ thấp khiến không thể bật đồng thời hệ định hướng và sưởi kính.',
      faultCauseEn: 'Low reserve voltage prevents running FGS pointing and optical heaters simultaneously.',
    },
    {
      subsystemId: 'hst_computer',
      status: 'failed',
      health: 32,
      faultTitle: 'Lỗi hàng đợi lập lịch quan sát',
      faultTitleEn: 'Observation Queue Scheduler Fault',
      faultCause: 'Bộ nhớ điều phối bị treo lệnh, không thể sắp xếp ưu tiên các mục tiêu thiên văn.',
      faultCauseEn: 'Command memory stalled, preventing prioritization of astronomical observation targets.',
    },
  ],
};

export function getFaultText(
  subsystemId: EquipmentSubsystemId,
  rt?: SubsystemRuntimeState,
  lang: Language = 'vi'
): { faultTitle: string; faultCause: string } {
  const allTemplates = Object.values(MISSION_FAULT_TEMPLATES).flat();
  const tpl = allTemplates.find((f) => f.subsystemId === subsystemId);
  if (lang === 'en') {
    return {
      faultTitle: rt?.faultTitleEn || tpl?.faultTitleEn || rt?.faultTitle || '',
      faultCause: rt?.faultCauseEn || tpl?.faultCauseEn || rt?.faultCause || '',
    };
  }
  return {
    faultTitle: rt?.faultTitle || tpl?.faultTitle || '',
    faultCause: rt?.faultCause || tpl?.faultCause || '',
  };
}

function buildBudgetSafeLoadout(
  missionId: MissionId,
  difficulty: DifficultyLevel,
  initialBudget: number,
  operatingBaseCost: number,
  selectedPartIds?: Record<string, string>
): {
  chosenMap: Record<string, EngineeringPart>;
  partsCost: number;
  maintenanceCost: number;
} {
  const subs = getSubsystemsForMission(missionId);
  const chosenMap: Record<string, EngineeringPart> = {};

  subs.forEach((s) => {
    const parts = getPartsForSubsystem(s.id);
    const preferredId = selectedPartIds?.[s.id];
    const defaultTier: PartTier =
      difficulty === 4
        ? 'economy'
        : difficulty === 3 && s.criticality === 'support'
        ? 'economy'
        : 'standard';

    const chosen =
      (preferredId ? parts.find((p) => p.id === preferredId) : undefined) ||
      parts.find((p) => p.tier === defaultTier) ||
      parts[0];
    chosenMap[s.id] = chosen;
  });

  const calcTotals = () => {
    let partsCost = 0;
    let maintenanceCost = 0;
    Object.values(chosenMap).forEach((p) => {
      partsCost += p.purchaseCost;
      maintenanceCost += p.maintenanceCost;
    });
    return {
      partsCost,
      maintenanceCost,
      total: partsCost + maintenanceCost + operatingBaseCost,
    };
  };

  if (!selectedPartIds) {
    let totals = calcTotals();
    if (totals.total > initialBudget) {
      const orderedDown = [...subs].sort((a, b) => {
        if (a.criticality !== b.criticality) return a.criticality === 'support' ? -1 : 1;
        return a.dependsOn.length - b.dependsOn.length;
      });
      for (const s of orderedDown) {
        if (totals.total <= initialBudget) break;
        const econ = getPartsForSubsystem(s.id).find((p) => p.tier === 'economy');
        if (econ && chosenMap[s.id].id !== econ.id) {
          chosenMap[s.id] = econ;
          totals = calcTotals();
        }
      }
    }
  }

  const finalTotals = calcTotals();
  return {
    chosenMap,
    partsCost: finalTotals.partsCost,
    maintenanceCost: finalTotals.maintenanceCost,
  };
}

export function createInitialMissionSession(
  missionId: MissionId,
  difficulty: DifficultyLevel,
  selectedPartIds?: Record<string, string>,
  lang: Language = 'vi'
): MissionSessionState {
  const subs = getSubsystemsForMission(missionId);
  const profile = DIFFICULTY_PROFILES[difficulty];
  const initialBudget = getMissionInitialBudget(missionId, difficulty);
  const faultPool = MISSION_FAULT_TEMPLATES[missionId] || [];
  const activeFaults = faultPool.slice(0, Math.min(profile.initialFaultCount, faultPool.length));

  const { chosenMap, partsCost, maintenanceCost } = buildBudgetSafeLoadout(
    missionId,
    difficulty,
    initialBudget,
    profile.operatingBaseCost,
    selectedPartIds
  );

  const subsystems: Record<string, SubsystemRuntimeState> = {};
  const costHistory: CostHistoryEntry[] = [
    {
      id: 'init_operating',
      label: `Chi phí vận hành nhiệm vụ (${profile.title})`,
      labelEn: `Mission operating cost (${profile.titleEn})`,
      category: 'operating',
      amount: profile.operatingBaseCost,
    },
  ];

  subs.forEach((s) => {
    const chosen = chosenMap[s.id];
    subsystems[s.id] = {
      subsystemId: s.id,
      partId: chosen.id,
      health: 100,
      status: 'ok',
    };
    costHistory.push({
      id: `init_part_${s.id}`,
      label: `${s.name}: ${chosen.name} (mua + bảo trì)`,
      labelEn: `${getSubsystemText(s, 'en').name}: ${getPartText(chosen, 'en').name} (purchase + maintenance)`,
      category: 'purchase',
      amount: chosen.purchaseCost + chosen.maintenanceCost,
    });
  });

  for (const fault of activeFaults) {
    const current = subsystems[fault.subsystemId];
    if (current) {
      const part = getPartById(current.partId);
      const bonus = part?.tier === 'premium' ? 14 : part?.tier === 'economy' ? -8 : 0;
      const adjHealth = Math.max(15, Math.min(85, fault.health + bonus));
      subsystems[fault.subsystemId] = {
        ...current,
        health: adjHealth,
        status: fault.status,
        faultTitle: fault.faultTitle,
        faultTitleEn: fault.faultTitleEn,
        faultCause: fault.faultCause,
        faultCauseEn: fault.faultCauseEn,
        diagnosed: false,
      };
    }
  }

  return evaluateBudgetStatusAndFailure(
    {
      missionId,
      difficulty,
      subsystems,
      economy: {
        difficulty,
        initialBudget,
        partsCost,
        repairCost: 0,
        maintenanceCost,
        operatingCost: profile.operatingBaseCost,
        failurePenalty: 0,
      },
      costHistory,
      budgetFailure: null,
      completedSubTasks: [],
      failedSubTasks: [],
      diagnosisAttempts: 0,
      diagnosisCorrect: 0,
      incidentsTriggered: activeFaults.length,
      safetyWarningsIgnored: 0,
      safetyChecksRun: 0,
      preDeployReport: null,
    },
    undefined,
    lang
  );
}

/**
 * Clean assembly-phase session for DesignLabView & LaunchCenterView (all newly mounted parts start at 100% health).
 */
export function createAssemblySession(
  missionId: MissionId,
  difficulty: DifficultyLevel,
  selectedPartIds?: Record<string, string>,
  lang: Language = 'vi'
): MissionSessionState {
  const subs = getSubsystemsForMission(missionId);
  const profile = DIFFICULTY_PROFILES[difficulty];
  const initialBudget = getMissionInitialBudget(missionId, difficulty);

  const { chosenMap, partsCost, maintenanceCost } = buildBudgetSafeLoadout(
    missionId,
    difficulty,
    initialBudget,
    profile.operatingBaseCost,
    selectedPartIds
  );

  const subsystems: Record<string, SubsystemRuntimeState> = {};
  const costHistory: CostHistoryEntry[] = [
    {
      id: 'asm_operating',
      label: `Chi phí vận hành nhiệm vụ (${profile.title})`,
      labelEn: `Mission operating cost (${profile.titleEn})`,
      category: 'operating',
      amount: profile.operatingBaseCost,
    },
  ];

  subs.forEach((s) => {
    const chosen = chosenMap[s.id];
    subsystems[s.id] = {
      subsystemId: s.id,
      partId: chosen.id,
      health: 100,
      status: 'ok',
    };
    costHistory.push({
      id: `asm_part_${s.id}`,
      label: `${s.name}: ${chosen.name} (mua + bảo trì)`,
      labelEn: `${getSubsystemText(s, 'en').name}: ${getPartText(chosen, 'en').name} (purchase + maintenance)`,
      category: 'purchase',
      amount: chosen.purchaseCost + chosen.maintenanceCost,
    });
  });

  return {
    missionId,
    difficulty,
    subsystems,
    economy: {
      difficulty,
      initialBudget,
      partsCost,
      repairCost: 0,
      maintenanceCost,
      operatingCost: profile.operatingBaseCost,
      failurePenalty: 0,
    },
    costHistory,
    budgetFailure: null,
    completedSubTasks: [],
    failedSubTasks: [],
    diagnosisAttempts: 0,
    diagnosisCorrect: 0,
    incidentsTriggered: 0,
    safetyWarningsIgnored: 0,
    safetyChecksRun: 0,
    preDeployReport: null,
  };
}

/**
 * Pure recalculation for initial assembly component choices.
 * Always computes partsCost, maintenanceCost, and costHistory strictly from the
 * currently equipped components (never accumulating replaced/cancelled selections)
 * and never triggers mission failure during initial assembly.
 */
export function applyAssemblyPartSelection(
  session: MissionSessionState,
  part: EngineeringPart
): MissionSessionState {
  if (!part.compatibleMissions.includes(session.missionId)) {
    return session;
  }

  const updatedSubsystems: Record<string, SubsystemRuntimeState> = {
    ...session.subsystems,
    [part.subsystemId]: {
      subsystemId: part.subsystemId,
      partId: part.id,
      health: 100,
      status: 'ok',
    },
  };

  let newPartsCost = 0;
  let newMaintCost = 0;
  const profile = DIFFICULTY_PROFILES[session.difficulty];
  const rebuiltHistory: CostHistoryEntry[] = [
    {
      id: 'asm_operating',
      label: `Chi phí vận hành nhiệm vụ (${profile.title})`,
      labelEn: `Mission operating cost (${profile.titleEn})`,
      category: 'operating',
      amount: session.economy.operatingCost,
    },
  ];

  const subs = getSubsystemsForMission(session.missionId);
  subs.forEach((s) => {
    const rt = updatedSubsystems[s.id];
    const p = rt ? getPartById(rt.partId) : undefined;
    if (!p) return;
    newPartsCost += p.purchaseCost;
    newMaintCost += p.maintenanceCost;
    rebuiltHistory.push({
      id: `asm_part_${s.id}`,
      label: `${s.name}: ${p.name} (mua + bảo trì)`,
      labelEn: `${getSubsystemText(s, 'en').name}: ${getPartText(p, 'en').name} (purchase + maintenance)`,
      category: 'purchase',
      amount: p.purchaseCost + p.maintenanceCost,
    });
  });

  return {
    ...session,
    subsystems: updatedSubsystems,
    economy: {
      ...session.economy,
      partsCost: newPartsCost,
      maintenanceCost: newMaintCost,
    },
    costHistory: rebuiltHistory,
    budgetFailure: null,
  };
}

/**
 * Validates whether the initial assembly can proceed to Launch Center.
 * Requires totalSpent <= initialBudget (overrun <= 0) and netPowerW >= -15.
 */
export function canCompleteInitialAssembly(
  session: MissionSessionState,
  lang: Language = 'vi'
): {
  allowed: boolean;
  isOverBudget: boolean;
  initialBudget: number;
  totalSpent: number;
  remainingBudget: number;
  overrunAmount: number;
  netPowerW: number;
} {
  const economy = session.economy;
  const initialBudget = economy.initialBudget;
  const totalSpent = getTotalEconomySpent(economy);
  const remainingBudget = initialBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;
  const overrunAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
  const safety = evaluateSystemSafety(session.missionId, session.subsystems, economy, lang);

  return {
    allowed: !isOverBudget && safety.netPowerW >= -15,
    isOverBudget,
    initialBudget,
    totalSpent,
    remainingBudget,
    overrunAmount,
    netPowerW: safety.netPowerW,
  };
}


function buildLocalizedBudgetFailureData(
  session: MissionSessionState,
  lang: Language,
  triggerDecision?: string,
  triggerDecisionEn?: string
): BudgetFailureInfo {
  const isEn = lang === 'en';
  const totalCost = getTotalEconomySpent(session.economy);
  const initialBudget = session.economy.initialBudget;
  const overrunAmount = Math.max(1, totalCost - initialBudget);
  const subs = getSubsystemsForMission(session.missionId);
  const unitShort = isEn ? 'M$' : 'triệu $';

  const partExpenses: { label: string; amount: number }[] = subs
    .map((s) => {
      const rt = session.subsystems[s.id];
      const part = rt ? getPartById(rt.partId) : undefined;
      if (!part) return null;
      const sName = getSubsystemText(s, lang).name;
      const pName = getPartText(part, lang).name;
      const tierLabel = getPartTierLabel(part.tier, lang);
      return {
        label: `${sName}: ${pName} (${tierLabel})`,
        amount: part.purchaseCost + part.maintenanceCost,
      };
    })
    .filter((item): item is { label: string; amount: number } => Boolean(item));

  if (session.economy.repairCost > 0) {
    partExpenses.push({
      label: isEn
        ? 'In-mission part repairs & emergency replacements'
        : 'Chi phí sửa chữa & thay thế linh kiện trong nhiệm vụ',
      amount: session.economy.repairCost,
    });
  }
  if (session.economy.failurePenalty > 0) {
    partExpenses.push({
      label: isEn
        ? 'Incident recovery cost from unverified operations'
        : 'Chi phí khắc phục sự cố do chạy thử chưa đạt chuẩn',
      amount: session.economy.failurePenalty,
    });
  }
  partExpenses.push({
    label: isEn
      ? 'Fixed mission operations cost by difficulty level'
      : 'Chi phí vận hành cố định theo cấp độ nhiệm vụ',
    amount: session.economy.operatingCost,
  });

  const topExpenses = [...partExpenses].sort((a, b) => b.amount - a.amount).slice(0, 4);

  const historyDecisions = (session.costHistory || [])
    .filter((h) => h.category === 'repair' || h.category === 'penalty' || h.id.startsWith('upgrade_'))
    .map((h) => `${isEn ? h.labelEn || h.label : h.label} (+${h.amount} ${unitShort})`);

  const resolvedTrigger = isEn
    ? triggerDecisionEn ||
      session.budgetFailure?.triggerDecisionEn ||
      historyDecisions[historyDecisions.length - 1] ||
      'An upgrade or repair decision pushed total cost above the mission budget cap.'
    : triggerDecision ||
      session.budgetFailure?.triggerDecision ||
      historyDecisions[historyDecisions.length - 1] ||
      'Quyết định nâng cấp hoặc sửa chữa làm tổng chi phí vượt trần ngân sách';

  const overBudgetDecisions = Array.from(
    new Set([
      ...historyDecisions.slice(-3),
      ...(resolvedTrigger ? [resolvedTrigger] : []),
    ])
  );

  return {
    failed: true,
    initialBudget,
    totalCost,
    overrunAmount,
    triggerDecision: resolvedTrigger,
    triggerDecisionEn:
      triggerDecisionEn || session.budgetFailure?.triggerDecisionEn,
    topExpenses,
    overBudgetDecisions:
      overBudgetDecisions.length > 0 ? overBudgetDecisions : [resolvedTrigger],
    advice: isEn
      ? 'Prioritize Premium components for critical core subsystems, select Standard or Economy parts for support modules, and pass the safety check before deployment to avoid penalty charges.'
      : 'Hãy ưu tiên linh kiện Cao cấp cho bộ phận cốt lõi, chọn mức Tiêu chuẩn hoặc Tiết kiệm cho bộ phận phụ và hoàn thành kiểm tra an toàn trước khi vận hành để tránh phát sinh chi phí phạt.',
  };
}

/**
 * Dynamically resolves BudgetFailureInfo in the active UI language so toggling VI <-> EN updates open warnings and reports immediately.
 */
export function getLocalizedBudgetFailure(
  session: MissionSessionState,
  lang: Language = 'vi'
): BudgetFailureInfo | null {
  if (!session.budgetFailure?.failed) return null;
  return buildLocalizedBudgetFailureData(session, lang);
}

/**
 * Strict Immediate Budget Overrun Detector.
 * Rules:
 * - totalCost === initialBudget (remainingBudget === 0) => ALLOWED, NOT a failure.
 * - totalCost > initialBudget => IMMEDIATE MISSION FAILURE, locks cost actions, captures expense breakdown.
 */
export function evaluateBudgetStatusAndFailure(
  session: MissionSessionState,
  triggerDecision?: string,
  lang: Language = 'vi',
  triggerDecisionEn?: string
): MissionSessionState {
  const totalCost = getTotalEconomySpent(session.economy);
  const initialBudget = session.economy.initialBudget;

  if (totalCost <= initialBudget) {
    if (!session.budgetFailure) return session;
    return { ...session, budgetFailure: null };
  }

  if (session.budgetFailure?.failed) {
    return session;
  }

  const budgetFailure = buildLocalizedBudgetFailureData(
    session,
    lang,
    triggerDecision,
    triggerDecisionEn
  );

  return {
    ...session,
    budgetFailure,
  };
}

export function createBudgetFailureReport(
  session: MissionSessionState,
  lang: Language = 'vi'
): MissionEvaluationReport {
  const isEn = lang === 'en';
  const totalCost = getTotalEconomySpent(session.economy);
  const initialBudget = session.economy.initialBudget;
  const overrunAmount = Math.max(1, totalCost - initialBudget);
  const bf = getLocalizedBudgetFailure(session, lang);
  const unitM = isEn ? 'M$' : 'triệu $';

  return {
    xpEarned: 0,
    finalScore: 0,
    passed: false,
    budgetExceeded: true,
    overrunAmount,
    outcomeTitle: isEn
      ? 'MISSION FAILED — Authorized Budget Exceeded'
      : 'NHIỆM VỤ THẤT BẠI — Vượt quá ngân sách cho phép',
    totalCost,
    initialBudget,
    performancePct: session.preDeployReport?.performancePct ?? 0,
    safetyPct: session.preDeployReport?.safetyPct ?? 0,
    completionPct: Math.round((session.completedSubTasks.length / 4) * 100),
    diagnosisAccuracyPct:
      session.diagnosisAttempts > 0
        ? Math.round((session.diagnosisCorrect / session.diagnosisAttempts) * 100)
        : 100,
    goodChoices: [
      isEn
        ? 'Halted mission operations per protocol when expenses exceeded the budget cap.'
        : 'Dừng nhiệm vụ đúng quy trình khi hệ thống vượt giới hạn tài chính.',
    ],
    suboptimalChoices: bf
      ? [
          isEn
            ? `Overrun trigger: ${bf.triggerDecision}`
            : `Quyết định vượt trần: ${bf.triggerDecision}`,
          ...bf.topExpenses.slice(0, 2).map((e) =>
            isEn
              ? `Major expense: ${e.label} (${e.amount} ${unitM})`
              : `Khoản chi lớn: ${e.label} (${e.amount} ${unitM})`
          ),
        ]
      : [
          isEn
            ? `Total cost (${totalCost} ${unitM}) exceeded the authorized budget (${initialBudget} ${unitM}).`
            : `Tổng chi phí (${totalCost} ${unitM}) vượt giới hạn ngân sách (${initialBudget} ${unitM}).`,
        ],
    technicalLesson:
      bf?.advice ||
      (isEn
        ? 'In real aerospace engineering, every mission operates under a strict budget ceiling. If upgrades or repairs exceed that cap, the team must halt and rebalance toward a more cost-effective hardware plan.'
        : 'Trong kỹ thuật hàng không vũ trụ thực tế, mỗi dự án có ngân sách cố định. Nếu chi phí vượt trần khi nâng cấp hoặc sửa chữa, nhiệm vụ phải dừng lại để tái phân bổ phương án kinh tế hơn.'),
    photos: 0,
    samples: 0,
  };
}

/**
 * Applies deterministic orbital/planetary arrival faults when entering simulation,
 * influenced by difficulty level and chosen part durability/tier.
 */
export function activateMissionArrivalFaults(
  session: MissionSessionState,
  _lang: Language = 'vi'
): MissionSessionState {
  if (session.incidentsTriggered > 0) return session;

  const profile = DIFFICULTY_PROFILES[session.difficulty];
  const faultPool = MISSION_FAULT_TEMPLATES[session.missionId] || [];
  const activeFaults = faultPool.slice(0, Math.min(profile.initialFaultCount, faultPool.length));

  const updatedSubsystems = { ...session.subsystems };
  let incidents = 0;

  for (const fault of activeFaults) {
    const current = updatedSubsystems[fault.subsystemId];
    if (!current) continue;
    const part = getPartById(current.partId);
    const tier = part?.tier || 'standard';

    const status: SubsystemHealthStatus =
      tier === 'economy'
        ? 'failed'
        : tier === 'premium' && fault.status === 'degraded' && session.difficulty <= 2
        ? 'degraded'
        : fault.status;

    const health =
      tier === 'economy'
        ? Math.max(15, fault.health - 10)
        : tier === 'premium'
        ? Math.min(68, fault.health + 16)
        : fault.health;

    updatedSubsystems[fault.subsystemId] = {
      ...current,
      health,
      status,
      faultTitle: fault.faultTitle,
      faultTitleEn: fault.faultTitleEn,
      faultCause:
        tier === 'economy'
          ? `${fault.faultCause} (Linh kiện Tiết kiệm có độ bền thấp nên hư hại nặng hơn.)`
          : fault.faultCause,
      faultCauseEn:
        tier === 'economy'
          ? `${fault.faultCauseEn} (Economy-tier part suffered heavier damage under load.)`
          : fault.faultCauseEn,
      diagnosed: false,
    };
    incidents++;
  }

  return {
    ...session,
    subsystems: updatedSubsystems,
    incidentsTriggered: incidents,
  };
}

/**
 * Deterministic wear/failure if an economy part is pushed under heavy mission stress.
 */
export function triggerStressIncident(
  session: MissionSessionState,
  subsystemId: EquipmentSubsystemId,
  faultTitle: string,
  faultCause: string,
  faultTitleEn?: string,
  faultCauseEn?: string
): MissionSessionState {
  const current = session.subsystems[subsystemId];
  if (!current || current.status === 'failed') return session;

  return {
    ...session,
    subsystems: {
      ...session.subsystems,
      [subsystemId]: {
        ...current,
        health: 34,
        status: 'degraded',
        faultTitle,
        faultTitleEn: faultTitleEn || faultTitle,
        faultCause,
        faultCauseEn: faultCauseEn || faultCause,
        diagnosed: false,
      },
    },
    incidentsTriggered: session.incidentsTriggered + 1,
  };
}

/**
 * Computes comprehensive Pre-Deploy Safety Report checking:
 * - Subsystem status, Compatibility, Durability, Reliability, Performance, Net Power, Budget & Safety.
 */
export function evaluateSystemSafety(
  missionId: MissionId,
  subsystems: Record<string, SubsystemRuntimeState>,
  economy: MissionEconomyState,
  lang: Language = 'vi'
): SafetyGateReport {
  const isEn = lang === 'en';
  const blueprints = getSubsystemsForMission(missionId);
  const runtimes = blueprints.map((bp) => subsystems[bp.id]).filter(Boolean);
  const parts = runtimes
    .map((rt) => getPartById(rt.partId))
    .filter((p): p is EngineeringPart => Boolean(p));

  const allCompatible = parts.every((p) => p.compatibleMissions.includes(missionId));
  const failedSubs = blueprints.filter((bp) => subsystems[bp.id]?.status === 'failed');
  const degradedSubs = blueprints.filter((bp) => subsystems[bp.id]?.status === 'degraded');

  const avgDurability = parts.length
    ? Math.round(parts.reduce((s, p) => s + p.durability, 0) / parts.length)
    : 0;
  const avgPerformance = parts.length
    ? Math.round(parts.reduce((s, p) => s + p.performance, 0) / parts.length)
    : 0;
  const avgReliability = parts.length
    ? Math.round(parts.reduce((s, p) => s + p.reliability, 0) / parts.length)
    : 0;

  const totalPowerGen = parts.reduce((s, p) => s + p.powerGenW, 0);
  const totalPowerDraw = parts.reduce((s, p) => s + p.powerDrawW, 0);
  const netPowerW = totalPowerGen > 0 ? totalPowerGen - totalPowerDraw : 45;

  const remainingBudget = getRemainingBudget(economy);

  const avgHealth = runtimes.length
    ? Math.round(runtimes.reduce((s, r) => s + r.health, 0) / runtimes.length)
    : 0;
  const safetyPct = Math.max(
    0,
    Math.min(100, Math.round(avgHealth * 0.45 + avgReliability * 0.35 + avgDurability * 0.2))
  );

  const failedNames = failedSubs.map((b) => getSubsystemText(b, lang).name).join(', ');
  const degradedNames = degradedSubs.map((b) => getSubsystemText(b, lang).name).join(', ');
  const unitM = isEn ? 'M$' : 'triệu $';

  const checks: SafetyCheckItem[] = [
    {
      id: 'compat',
      label: isEn ? '1. Hardware Compatibility' : '1. Độ tương thích thiết bị',
      level: allCompatible ? 'ok' : 'fail',
      detail: allCompatible
        ? isEn
          ? `All ${parts.length}/${blueprints.length} components match this spacecraft interface.`
          : `Tất cả ${parts.length}/${blueprints.length} bộ phận tương thích chuẩn với thiết bị.`
        : isEn
        ? 'Incompatible component detected for this NASA spacecraft!'
        : 'Phát hiện linh kiện không tương thích với thiết bị NASA này!',
    },
    {
      id: 'health',
      label: isEn ? '2. Critical Subsystem Health' : '2. Tình trạng bộ phận trọng yếu',
      level: failedSubs.length > 0 ? 'fail' : degradedSubs.length > 0 ? 'warn' : 'ok',
      detail:
        failedSubs.length > 0
          ? isEn
            ? `${failedSubs.length} subsystem(s) failed: ${failedNames}.`
            : `Có ${failedSubs.length} bộ phận đang hỏng: ${failedNames}.`
          : degradedSubs.length > 0
          ? isEn
            ? `${degradedSubs.length} subsystem(s) degraded: ${degradedNames}.`
            : `Có ${degradedSubs.length} bộ phận suy giảm nhẹ: ${degradedNames}.`
          : isEn
          ? 'All subsystems are operating nominally.'
          : 'Mọi bộ phận đều ở trạng thái hoạt động tốt.',
    },
    {
      id: 'quality',
      label: isEn
        ? '3. Durability · Performance · Reliability'
        : '3. Độ bền · Hiệu suất · Độ tin cậy',
      level:
        avgDurability < 55 || avgReliability < 55
          ? 'fail'
          : avgDurability < 75 || avgReliability < 75
          ? 'warn'
          : 'ok',
      detail: isEn
        ? `Durability ${avgDurability}% · Performance ${avgPerformance}% · Reliability ${avgReliability}%.`
        : `Độ bền ${avgDurability}% · Hiệu suất ${avgPerformance}% · Tin cậy ${avgReliability}%.`,
    },
    {
      id: 'power',
      label: isEn ? '4. Power Bus Balance' : '4. Cân bằng năng lượng',
      level: netPowerW < -15 ? 'fail' : netPowerW < 15 ? 'warn' : 'ok',
      detail:
        totalPowerGen > 0
          ? isEn
            ? `Supply ${totalPowerGen}W / Draw ${totalPowerDraw}W (Margin ${netPowerW >= 0 ? `+${netPowerW}` : netPowerW}W).`
            : `Nguồn cấp ${totalPowerGen}W / Tiêu thụ ${totalPowerDraw}W (Dư ${netPowerW >= 0 ? `+${netPowerW}` : netPowerW}W).`
          : isEn
          ? 'Powered directly by the ISS station bus (nominal).'
          : 'Dùng nguồn điện trung tâm từ Trạm Vũ trụ ISS (ổn định).',
    },
    {
      id: 'budget',
      label: isEn ? '5. Budget & Safety Reserve' : '5. Ngân sách & Dự phòng an toàn',
      level: remainingBudget < 0 ? 'fail' : remainingBudget < 60 ? 'warn' : 'ok',
      detail:
        remainingBudget < 0
          ? isEn
            ? `Over budget by ${Math.abs(remainingBudget)} ${unitM}! Choose a more balanced configuration.`
            : `Vượt ngân sách ${Math.abs(remainingBudget)} ${unitM}! Hãy chọn phương án cân bằng hơn.`
          : remainingBudget < 60
          ? isEn
            ? `${remainingBudget} ${unitM} remaining — minimal repair contingency reserve.`
            : `Còn dư ${remainingBudget} ${unitM} — dự phòng sửa chữa rất mỏng.`
          : isEn
          ? `${remainingBudget} ${unitM} operational reserve remaining.`
          : `Còn dư ${remainingBudget} ${unitM} dự phòng vận hành.`,
    },
  ];

  const hasFail = checks.some((c) => c.level === 'fail');
  const hasWarn = checks.some((c) => c.level === 'warn');

  if (hasFail) {
    return {
      status: 'FAILED',
      checks,
      summary: isEn
        ? 'FAILED: Minimum readiness not met. Cannot deploy with failed subsystems, power deficit, or budget overrun!'
        : 'CHƯA ĐẠT: Không đạt yêu cầu tối thiểu. Không thể triển khai khi còn bộ phận hỏng, mất cân bằng điện hoặc vượt ngân sách!',
      safetyPct,
      performancePct: avgPerformance,
      durabilityPct: avgDurability,
      reliabilityPct: avgReliability,
      netPowerW,
    };
  }

  if (hasWarn) {
    return {
      status: 'WARNING',
      checks,
      summary: isEn
        ? 'CAUTION: Capable of limited operation, but carries risk of degradation or faults under heavy load.'
        : 'CẢNH BÁO: Có thể hoạt động trong điều kiện hạn chế nhưng tồn tại rủi ro suy giảm hoặc phát sinh sự cố khi chạy tải nặng.',
      safetyPct,
      performancePct: avgPerformance,
      durabilityPct: avgDurability,
      reliabilityPct: avgReliability,
      netPowerW,
    };
  }

  return {
    status: 'READY',
    checks,
    summary: isEn
      ? 'PASSED: Spacecraft meets all technical, power, and safety standards for deployment!'
      : 'ĐẠT CHUẨN: Thiết bị đạt đầy đủ tiêu chuẩn kỹ thuật, năng lượng và an toàn để triển khai!',
    safetyPct,
    performancePct: avgPerformance,
    durabilityPct: avgDurability,
    reliabilityPct: avgReliability,
    netPowerW,
  };
}

/**
 * Evaluates full post-mission performance, cost balance (penalizing wasteful max-spending!),
 * safety discipline, and generates constructive engineering lessons.
 */
export function evaluateMissionOutcome(
  session: MissionSessionState,
  extras: { photos: number; samples: number; totalSubTasks?: number },
  lang: Language = 'vi'
): MissionEvaluationReport {
  const isEn = lang === 'en';
  const totalTasks = extras.totalSubTasks || 4;
  const completedCount = session.completedSubTasks.length;
  const completionPct = Math.round((completedCount / totalTasks) * 100);

  const safetyReport = evaluateSystemSafety(
    session.missionId,
    session.subsystems,
    session.economy,
    lang
  );
  const totalCost = getTotalEconomySpent(session.economy);
  const initialBudget = session.economy.initialBudget;
  const remaining = initialBudget - totalCost;

  const blueprints = getSubsystemsForMission(session.missionId);
  const chosenParts = blueprints
    .map((bp) => getPartById(session.subsystems[bp.id]?.partId || ''))
    .filter((p): p is EngineeringPart => Boolean(p));

  const premiumCount = chosenParts.filter((p) => p.tier === 'premium').length;
  const standardCount = chosenParts.filter((p) => p.tier === 'standard').length;
  const economyCount = chosenParts.filter((p) => p.tier === 'economy').length;
  const allPremiumWasteful = premiumCount === blueprints.length;

  const diagnosisAccuracyPct =
    session.diagnosisAttempts > 0
      ? Math.round((session.diagnosisCorrect / session.diagnosisAttempts) * 100)
      : 100;

  const completionScore = (completedCount / totalTasks) * 40;
  const safetyScore =
    (safetyReport.safetyPct / 100) * 18 +
    (diagnosisAccuracyPct / 100) * 7 -
    session.safetyWarningsIgnored * 5;
  const perfScore = (safetyReport.performancePct / 100) * 15;

  let costScore = 0;
  if (remaining < 0) {
    costScore = Math.max(0, 6 - Math.floor(Math.abs(remaining) / 30));
  } else {
    const reserveRatio = remaining / initialBudget;
    costScore = 14 + Math.min(6, Math.round(reserveRatio * 35));
    if (allPremiumWasteful) {
      costScore = Math.max(4, costScore - 12);
    } else if (premiumCount >= 1 && standardCount >= 1) {
      costScore = Math.min(20, costScore + 2);
    }
  }

  const penaltyDeduction = session.economy.failurePenalty > 0 ? 6 : 0;
  const finalScore = Math.max(
    0,
    Math.min(100, Math.round(completionScore + safetyScore + perfScore + costScore - penaltyDeduction))
  );

  const passed = completionPct >= 75 && remaining >= -50;
  const unitM = isEn ? 'M$' : 'triệu $';

  const goodChoices: string[] = [];
  const suboptimalChoices: string[] = [];

  if (completedCount === totalTasks) {
    goodChoices.push(
      isEn
        ? `Successfully completed all ${totalTasks}/${totalTasks} specialized spacecraft objectives.`
        : `Hoàn thành xuất sắc toàn bộ ${totalTasks}/${totalTasks} nhiệm vụ chuyên môn của thiết bị.`
    );
  } else if (completedCount > 0) {
    suboptimalChoices.push(
      isEn
        ? `Only completed ${completedCount}/${totalTasks} mission objectives.`
        : `Mới hoàn thành ${completedCount}/${totalTasks} nhiệm vụ của thiết bị.`
    );
  }

  if (!allPremiumWasteful && premiumCount >= 1 && (standardCount >= 1 || economyCount >= 1) && remaining >= 0) {
    goodChoices.push(
      isEn
        ? 'Smart budget allocation: invested in Premium hardware for core subsystems and Standard/Economy for support modules.'
        : 'Phân bổ ngân sách thông minh: đầu tư Cao cấp cho bộ phận cốt lõi và Tiêu chuẩn/Tiết kiệm cho bộ phận phụ.'
    );
  }

  if (allPremiumWasteful) {
    suboptimalChoices.push(
      isEn
        ? 'Budget overspending: selected Premium parts for every slot even where Standard grade was sufficient.'
        : 'Lãng phí ngân sách: chọn linh kiện Cao cấp cho mọi vị trí dù một số bộ phận chỉ cần mức Tiêu chuẩn.'
    );
  }

  if (remaining < 0) {
    suboptimalChoices.push(
      isEn
        ? `Overspent budget by ${Math.abs(remaining)} ${unitM} — reduce maintenance overhead or downgrade secondary subsystems.`
        : `Chi tiêu vượt ngân sách ${Math.abs(remaining)} ${unitM} — cần cắt giảm chi phí bảo trì hoặc hạ phân khúc bộ phận phụ.`
    );
  } else if (remaining >= Math.round(initialBudget * 0.1)) {
    goodChoices.push(
      isEn
        ? `Preserved ${remaining} ${unitM} in contingency reserve for extended operations.`
        : `Giữ lại được ${remaining} ${unitM} ngân sách dự phòng cho vận hành dài hạn.`
    );
  }

  if (session.safetyWarningsIgnored > 0) {
    suboptimalChoices.push(
      isEn
        ? `Bypassed pre-operation safety warnings ${session.safetyWarningsIgnored} time(s).`
        : `Đã bỏ qua cảnh báo an toàn ${session.safetyWarningsIgnored} lần trước khi triển khai.`
    );
  } else if (session.safetyChecksRun > 0) {
    goodChoices.push(
      isEn
        ? 'Strictly followed Pre-Operation Safety Check procedures before deployment.'
        : 'Tuân thủ nghiêm ngặt quy trình Kiểm tra an toàn trước khi vận hành.'
    );
  }

  if (economyCount >= 2 && session.incidentsTriggered > DIFFICULTY_PROFILES[session.difficulty].initialFaultCount) {
    suboptimalChoices.push(
      isEn
        ? 'Using multiple Economy parts in high-stress positions triggered extra failures and repair costs.'
        : 'Sử dụng nhiều linh kiện Tiết kiệm ở vị trí chịu tải cao gây hỏng hóc phát sinh tốn phí sửa chữa.'
    );
  }

  if (session.economy.failurePenalty > 0) {
    suboptimalChoices.push(
      isEn
        ? `Incurred ${session.economy.failurePenalty} ${unitM} in failure recovery penalties from running unverified tests.`
        : `Phát sinh ${session.economy.failurePenalty} ${unitM} chi phí sự cố do chạy thử khi hệ thống chưa đạt chuẩn.`
    );
  }

  if (goodChoices.length === 0) {
    goodChoices.push(
      isEn
        ? 'Completed fault diagnosis and hands-on NASA spacecraft operations.'
        : 'Đã tham gia chẩn đoán và thực hành vận hành hệ thống NASA.'
    );
  }
  if (suboptimalChoices.length === 0) {
    suboptimalChoices.push(
      isEn
        ? 'No significant waste or safety risk detected — very well-balanced engineering solution!'
        : 'Không phát hiện lãng phí hay rủi ro đáng kể — giải pháp rất cân bằng!'
    );
  }

  const lessonsByMission: Record<MissionId, string> = isEn
    ? {
        mission_01_mars_rover:
          'On Mars, every kilogram and every Watt matters: engineers must prioritize power and sampling precision while choosing durable wheels within budget.',
        mission_02_earth_satellite:
          'Earth-observing satellites depend on the data processor and OLI-2/TIRS-2 sensors: always distinguish sensor artifacts from real thermal anomalies before scheduling captures.',
        mission_03_space_station:
          'Aboard the ISS, crew safety comes first: during power deficits or overheating across 90-minute orbital day/night cycles, prioritize life support and thermal cooling over auxiliary payloads.',
        mission_04_robotic_arm:
          'Multi-joint robotic arms require tenth-of-a-degree precision at the elbow and wrist plus clear LEE camera alignment to berth cargo spacecraft safely without collisions.',
        mission_05_space_telescope:
          'Space telescopes require ultra-stable FGS pointing so distant stars do not blur; buying the most expensive part everywhere is less effective than balancing power and observation scheduling.',
      }
    : {
        mission_01_mars_rover:
          'Trên Sao Hỏa, mỗi kilôgam và mỗi Watt điện đều quý giá: kỹ sư phải ưu tiên nguồn điện và cánh tay lấy mẫu chính xác, đồng thời chọn bánh xe bền bỉ nhưng vừa ngân sách.',
        mission_02_earth_satellite:
          'Vệ tinh quan sát Trái Đất phụ thuộc vào bộ xử lý dữ liệu và cảm biến OLI-2/TIRS-2: luôn phân biệt lỗi cảm biến với biến động nhiệt thật trước khi lập lịch chụp.',
        mission_03_space_station:
          'Trên Trạm Vũ trụ ISS, sinh mạng phi hành gia luôn đứng đầu: khi thiếu điện hay quá nhiệt trong chu kỳ ngày-đêm 90 phút, phải ưu tiên dưỡng khí và làm mát trước các thiết bị phụ.',
        mission_04_robotic_arm:
          'Cánh tay robot nhiều khớp đòi hỏi độ chính xác từng phần mười độ ở khuỷu và cổ tay cùng tầm nhìn camera rõ nét để kẹp tàu hàng an toàn không va chạm.',
        mission_05_space_telescope:
          'Kính thiên văn không gian cần hệ định hướng FGS siêu ổn định mới chụp được sao xa không bị nhòe; mua linh kiện đắt nhất ở mọi chỗ không tốt bằng cân bằng điện năng và lịch quan sát.',
      };

  const xpEarned = Math.max(80, Math.round(finalScore * (2.2 + session.difficulty * 0.45)));

  return {
    xpEarned,
    finalScore,
    passed,
    outcomeTitle: isEn
      ? finalScore >= 85
        ? 'Outstanding Engineer! Optimal Balanced Solution'
        : passed
        ? 'Mission Completed Successfully'
        : 'Partial Completion — Needs Optimization'
      : finalScore >= 85
      ? 'Kỹ sư Xuất sắc! Giải pháp cân bằng tối ưu'
      : passed
      ? 'Hoàn thành nhiệm vụ thành công'
      : 'Hoàn thành một phần — Cần tối ưu thêm',
    totalCost,
    initialBudget,
    performancePct: safetyReport.performancePct,
    safetyPct: safetyReport.safetyPct,
    completionPct,
    diagnosisAccuracyPct,
    goodChoices,
    suboptimalChoices,
    technicalLesson: lessonsByMission[session.missionId],
    photos: extras.photos,
    samples: extras.samples,
  };
}
