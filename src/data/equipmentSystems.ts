import {
  DifficultyLevel,
  EngineeringPart,
  EquipmentSubsystemId,
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
  subtitle: string;
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
    subtitle: '1 lỗi rõ ràng · Ngân sách thoải mái · Dễ phân tích',
    budgetFactor: 1.32,
    initialFaultCount: 1,
    operatingBaseCost: 40,
    failurePenaltyCost: 60,
    stressFactor: 0.7,
  },
  2: {
    level: 2,
    title: 'Cấp 2: Kỹ thuật viên',
    subtitle: 'Nhiều triệu chứng · Phân biệt đúng bộ phận lỗi · Ngân sách vừa phải',
    budgetFactor: 1.08,
    initialFaultCount: 2,
    operatingBaseCost: 70,
    failurePenaltyCost: 90,
    stressFactor: 1.0,
  },
  3: {
    level: 3,
    title: 'Cấp 3: Kỹ sư',
    subtitle: 'Lỗi dây chuyền · Cân nhắc giá và độ bền · Cần lập kế hoạch',
    budgetFactor: 0.94,
    initialFaultCount: 2,
    operatingBaseCost: 95,
    failurePenaltyCost: 130,
    stressFactor: 1.25,
  },
  4: {
    level: 4,
    title: 'Cấp 4: Chuyên gia',
    subtitle: 'Nhiều sự cố đồng thời · Ngân sách eo hẹp · Rủi ro dài hạn',
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

export const SUBSYSTEM_BLUEPRINTS: SubsystemBlueprint[] = [
  // ================= MISSION 1: PERSEVERANCE =================
  {
    id: 'rover_power',
    missionId: 'mission_01_mars_rover',
    name: 'Nguồn MMRTG & Pin',
    role: 'Cung cấp điện liên tục cho bánh xe, camera, cánh tay và ăng-ten',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Cấp điện di chuyển', 'Vận hành cánh tay lấy mẫu', 'Phát sóng liên lạc'],
    hotspotCoords: { x: 22, y: 58 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'rover_mobility',
    missionId: 'mission_01_mars_rover',
    name: 'Hệ Bánh Xe & Động Cơ',
    role: 'Di chuyển vượt đá, leo dốc và thoát vùng cát lún trên Sao Hỏa',
    icon: 'CircleDot',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Di chuyển robot', 'Khảo sát địa hình xa'],
    hotspotCoords: { x: 50, y: 78 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'rover_camera',
    missionId: 'mission_01_mars_rover',
    name: 'Camera Mastcam-Z & Navcam',
    role: 'Quan sát địa hình, phát hiện đá lớn và vùng cát nguy hiểm',
    icon: 'Camera',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Chụp ảnh khảo sát', 'Phân tích địa hình an toàn'],
    hotspotCoords: { x: 58, y: 24 },
    criticality: 'support',
    idealTier: 'standard',
  },
  {
    id: 'rover_arm',
    missionId: 'mission_01_mars_rover',
    name: 'Cánh Tay Robot Lấy Mẫu',
    role: 'Vươn tới tảng đá, khoan lõi và lưu trữ ống mẫu Sao Hỏa',
    icon: 'Wrench',
    dependsOn: ['rover_power', 'rover_camera'],
    affectedFunctions: ['Thu thập mẫu đá', 'Khoan và niêm phong mẫu'],
    hotspotCoords: { x: 76, y: 56 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'rover_comms',
    missionId: 'mission_01_mars_rover',
    name: 'Ăng-ten UHF & HGA',
    role: 'Chuyển tiếp dữ liệu qua vệ tinh quỹ đạo MRO về Trái Đất',
    icon: 'Radio',
    dependsOn: ['rover_power'],
    affectedFunctions: ['Gửi ảnh và dữ liệu mẫu đá về Trái Đất'],
    hotspotCoords: { x: 36, y: 42 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 2: LANDSAT 9 =================
  {
    id: 'sat_power',
    missionId: 'mission_02_earth_satellite',
    name: 'Cánh Pin Mặt Trời & Pin',
    role: 'Cung cấp điện cho cảm biến ảnh, nhiệt kế và máy phát sóng',
    icon: 'Sun',
    dependsOn: [],
    affectedFunctions: ['Số lần chụp trong lịch quan sát', 'Truyền dữ liệu công suất cao'],
    hotspotCoords: { x: 20, y: 52 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'sat_processor',
    missionId: 'mission_02_earth_satellite',
    name: 'Bộ Xử Lý & Lập Lịch Dữ Liệu',
    role: 'Nén ảnh vệ tinh, ghép dải phổ và điều phối lịch quét Trái Đất',
    icon: 'Cpu',
    dependsOn: ['sat_power'],
    affectedFunctions: ['Lưu và xử lý ảnh OLI-2', 'Thực thi lịch quan sát'],
    hotspotCoords: { x: 50, y: 52 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'sat_oli',
    missionId: 'mission_02_earth_satellite',
    name: 'Cảm Biến Ảnh OLI-2',
    role: 'Chụp ảnh đa phổ bề mặt rừng, biển và thành phố Trái Đất',
    icon: 'Camera',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Chụp ảnh quang học Trái Đất'],
    hotspotCoords: { x: 64, y: 40 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'sat_tirs',
    missionId: 'mission_02_earth_satellite',
    name: 'Cảm Biến Nhiệt TIRS-2',
    role: 'Đo nhiệt độ bề mặt đất, đại dương và phát hiện cháy rừng',
    icon: 'Compass',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Đọc bản đồ nhiệt độ bề mặt'],
    hotspotCoords: { x: 64, y: 66 },
    criticality: 'support',
    idealTier: 'standard',
  },
  {
    id: 'sat_comms',
    missionId: 'mission_02_earth_satellite',
    name: 'Ăng-ten Băng Tần X',
    role: 'Truyền dữ liệu ảnh và bản đồ nhiệt về các trạm mặt đất',
    icon: 'Radio',
    dependsOn: ['sat_power', 'sat_processor'],
    affectedFunctions: ['Truyền dữ liệu vệ tinh về Trái Đất'],
    hotspotCoords: { x: 82, y: 50 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 3: ISS =================
  {
    id: 'iss_power',
    missionId: 'mission_03_space_station',
    name: 'Mảng Pin Mặt Trời & Pin Lưu Trữ',
    role: 'Cấp điện qua 16 chu kỳ ngày-đêm mỗi ngày quanh Trái Đất',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Tổng công suất toàn trạm', 'Vận hành hệ thống điều hòa nhiệt và dưỡng khí'],
    hotspotCoords: { x: 18, y: 46 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'iss_thermal',
    missionId: 'mission_03_space_station',
    name: 'Hệ Thống Điều Hòa Nhiệt',
    role: 'Bơm dung dịch Amoniac tản nhiệt từ các khoang thí nghiệm ra không gian',
    icon: 'Sun',
    dependsOn: ['iss_power'],
    affectedFunctions: ['Giữ nhiệt độ an toàn cho khoang ở và máy tính'],
    hotspotCoords: { x: 52, y: 34 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'iss_lifesupport',
    missionId: 'mission_03_space_station',
    name: 'Hệ Hỗ Trợ Sự Sống & Tài Nguyên',
    role: 'Tái chế nước sạch, tạo oxy và phân bổ vật tư cho phi hành đoàn',
    icon: 'BatteryCharging',
    dependsOn: ['iss_power', 'iss_thermal'],
    affectedFunctions: ['Duy trì nước, oxy và sinh hoạt phi hành gia'],
    hotspotCoords: { x: 48, y: 64 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'iss_comms',
    missionId: 'mission_03_space_station',
    name: 'Hệ Thống Liên Lạc Ku/S-Band',
    role: 'Giữ đường truyền liên tục giữa ISS và Trung tâm Điều khiển Houston',
    icon: 'Radio',
    dependsOn: ['iss_power'],
    affectedFunctions: ['Trao đổi dữ liệu và chỉ dẫn khẩn cấp'],
    hotspotCoords: { x: 78, y: 42 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 4: CANADARM2 =================
  {
    id: 'arm_shoulder',
    missionId: 'mission_04_robotic_arm',
    name: 'Cụm Khớp Vai (Shoulder)',
    role: 'Xoay cánh tay dài 17m tiếp cận vùng làm việc ngoài thân trạm',
    icon: 'Compass',
    dependsOn: [],
    affectedFunctions: ['Xoay tầm với toàn cánh tay', 'Định vị vị trí thô'],
    hotspotCoords: { x: 24, y: 66 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'arm_elbow',
    missionId: 'mission_04_robotic_arm',
    name: 'Khớp Khuỷu Tay (Elbow)',
    role: 'Gập mở chính xác tầm vươn tránh va chạm các mô-đun trạm',
    icon: 'Wrench',
    dependsOn: ['arm_shoulder'],
    affectedFunctions: ['Vươn gập khoảng cách chuẩn xác', 'Tránh vật cản'],
    hotspotCoords: { x: 50, y: 36 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'arm_wrist',
    missionId: 'mission_04_robotic_arm',
    name: 'Khớp Cổ Tay & Đầu Kẹp LEE',
    role: 'Khóa chốt neo tàu hàng và hỗ trợ phi hành gia đi bộ không gian',
    icon: 'Shield',
    dependsOn: ['arm_elbow'],
    affectedFunctions: ['Kẹp giữ tàu hàng', 'Cố định thiết bị và phi hành gia'],
    hotspotCoords: { x: 76, y: 58 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'arm_camera',
    missionId: 'mission_04_robotic_arm',
    name: 'Camera Định Vị Trên Cánh Tay',
    role: 'Quan sát trực tiếp tâm ngắm chốt neo và khoảng cách va chạm',
    icon: 'Camera',
    dependsOn: [],
    affectedFunctions: ['Quan sát tâm ngắm kẹp hàng', 'Kiểm tra an toàn vùng làm việc'],
    hotspotCoords: { x: 64, y: 46 },
    criticality: 'support',
    idealTier: 'standard',
  },

  // ================= MISSION 5: HUBBLE =================
  {
    id: 'hst_power',
    missionId: 'mission_05_space_telescope',
    name: 'Pin Mặt Trời & Tổ Hợp Pin',
    role: 'Cấp nguồn ổn định cho camera thiên văn, máy sưởi gương và con quay',
    icon: 'Zap',
    dependsOn: [],
    affectedFunctions: ['Thời lượng chụp ảnh liên tục', 'Cấp điện cảm biến khoa học'],
    hotspotCoords: { x: 24, y: 50 },
    criticality: 'core',
    idealTier: 'standard',
  },
  {
    id: 'hst_guidance',
    missionId: 'mission_05_space_telescope',
    name: 'Hệ Định Hướng FGS & Con Quay',
    role: 'Giữ ống kính khóa chặt vào ngôi sao dẫn đường sai số dưới 0.01 giây cung',
    icon: 'Compass',
    dependsOn: ['hst_power'],
    affectedFunctions: ['Khóa mục tiêu sao chuẩn xác', 'Chống rung nhòe khi phơi sáng lâu'],
    hotspotCoords: { x: 52, y: 66 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'hst_optics',
    missionId: 'mission_05_space_telescope',
    name: 'Gương & Cảm Biến WFC3',
    role: 'Thu nhận ánh sáng yếu từ các thiên hà cổ đại và tinh vân xa xôi',
    icon: 'Camera',
    dependsOn: ['hst_power', 'hst_guidance'],
    affectedFunctions: ['Chụp ảnh thiên văn sắc nét', 'Phân tích quang phổ'],
    hotspotCoords: { x: 68, y: 36 },
    criticality: 'core',
    idealTier: 'premium',
  },
  {
    id: 'hst_computer',
    missionId: 'mission_05_space_telescope',
    name: 'Máy Tính Lập Lịch Quan Sát',
    role: 'Sắp xếp thứ tự mục tiêu thiên văn theo quỹ đạo và ngân sách điện',
    icon: 'Cpu',
    dependsOn: ['hst_power'],
    affectedFunctions: ['Lập kế hoạch quan sát khoa học'],
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
    shortDesc: 'Giá rẻ, đủ điện cơ bản nhưng sụt áp nhanh khi bám bụi Sao Hỏa.',
    tradeoffNote: 'Rẻ nhất nhưng dễ tụt điện khi lái xa hoặc dùng cánh tay robot.',
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
    shortDesc: 'Cân bằng tốt giữa giá tiền và lượng điện lưu trữ qua đêm lạnh.',
    tradeoffNote: 'Đáp ứng ổn định hầu hết chặng ngắn và trung bình.',
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
    shortDesc: 'Phát điện liên tục ngày đêm, miễn nhiễm bão bụi Sao Hỏa.',
    tradeoffNote: 'Chi phí đầu tư cao nhưng cực kỳ an toàn cho sứ mệnh dài ngày.',
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
    shortDesc: 'Tiết kiệm chi phí nhưng dễ trượt trên cát mịn và mau mòn.',
    tradeoffNote: 'Dễ phát sinh lỗi trượt bánh nếu chạy qua vùng cát.',
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
    shortDesc: 'Vượt đá sỏi tốt, lực kéo ổn định và chi phí bảo trì vừa phải.',
    tradeoffNote: 'Lựa chọn cân bằng nhất cho địa hình Jezero Crater.',
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
    shortDesc: 'Siêu bền trước đá sắc nhọn, bám cát cực tốt nhưng rất đắt.',
    tradeoffNote: 'Chất lượng đỉnh cao, nên cân nhắc nếu ngân sách đang eo hẹp.',
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
    shortDesc: 'Đủ chụp ảnh đường đi gần nhưng độ nét giảm khi ánh sáng yếu.',
    tradeoffNote: 'Rẻ, phù hợp khi muốn dồn tiền cho bộ phận lấy mẫu.',
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
    shortDesc: 'Phân biệt rõ đá nhọn và cát lún, ảnh màu sắc nét.',
    tradeoffNote: 'Đáp ứng tốt cả khảo sát địa hình và dẫn hướng cánh tay.',
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
    shortDesc: 'Thu phóng cực xa, nhận diện khoáng vật từ khoảng cách lớn.',
    tradeoffNote: 'Hiệu suất cao nhưng ngốn điện và giá mua cao.',
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
    shortDesc: 'Khoan được đá mềm nhưng dễ rung và kẹt khi gặp đá bazan cứng.',
    tradeoffNote: 'Tiềm ẩn rủi ro hỏng đầu khoan khi lấy nhiều mẫu.',
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
    shortDesc: 'Độ chính xác tốt, kèm cảm biến lực bảo vệ mũi khoan.',
    tradeoffNote: 'Hoạt động ổn định nếu camera và nguồn điện khỏe.',
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
    shortDesc: 'Khoan đá cứng chính xác milimét, tự niêm phong ống mẫu an toàn.',
    tradeoffNote: 'Rất đáng đầu tư để tránh mất mẫu quý giá.',
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
    shortDesc: 'Truyền dữ liệu chậm, dễ mất gói tin khi vệ tinh chuyển tiếp bay xa.',
    tradeoffNote: 'Rẻ, đủ dùng nếu chỉ gửi ít gói dữ liệu.',
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
    shortDesc: 'Tốc độ truyền ảnh tốt qua vệ tinh bay quanh Sao Hỏa.',
    tradeoffNote: 'Cân bằng hoàn hảo giữa giá thành và độ ổn định.',
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
    shortDesc: 'Liên lạc thẳng về Trái Đất lẫn qua vệ tinh với băng thông cực lớn.',
    tradeoffNote: 'Đắt và tốn điện hơn mức cần thiết nếu ngân sách hạn hẹp.',
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
    shortDesc: 'Đủ cấp điện cho 2 vùng quan sát mỗi vòng quỹ đạo, nhanh chai pin.',
    tradeoffNote: 'Giá thấp nhưng buộc phải cắt giảm lịch chụp ảnh.',
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
    shortDesc: 'Cấp điện bền bỉ cho cảm biến OLI-2, TIRS-2 và phát sóng băng X.',
    tradeoffNote: 'Cân bằng chi phí, đủ tải lịch quan sát chuẩn.',
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
    shortDesc: 'Công suất dư dả cho mọi nhiệm vụ quét liên tục và truyền dữ liệu.',
    tradeoffNote: 'Giá cao; chỉ cần thiết nếu mở hết tất cả vùng chụp cùng lúc.',
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
    shortDesc: 'Tốc độ xử lý chậm, đôi khi gây sọc ảnh khi chụp đa kênh.',
    tradeoffNote: 'Dễ nghẽn cổ chai ảnh hưởng đến cả OLI-2 và TIRS-2.',
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
    shortDesc: 'Xử lý ổn định dữ liệu quang học lẫn bản đồ nhiệt 14-bit.',
    tradeoffNote: 'Đáp ứng tốt ở mức Cấp 1 và Cấp 2.',
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
    shortDesc: 'Tự sửa lỗi bit do tia vũ trụ, xếp lịch chụp thông minh không độ trễ.',
    tradeoffNote: 'Rất hiệu quả cho bộ não vệ tinh ở Cấp 3–4.',
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
    shortDesc: 'Chi phí thấp nhưng ảnh mờ ở vùng nhiều mây và thiếu kênh cận hồng ngoại.',
    tradeoffNote: 'Giảm độ sắc nét ảnh vệ tinh.',
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
    shortDesc: 'Ghi hình 9 dải phổ rõ nét, phát hiện thảm thực vật và bờ biển tốt.',
    tradeoffNote: 'Tin cậy và đủ chuẩn nghiên cứu khí hậu.',
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
    shortDesc: 'Độ phân giải 15m sắc nét vượt trội, nhận diện cháy rừng sớm nhất.',
    tradeoffNote: 'Cốt lõi sứ mệnh chụp ảnh Landsat 9.',
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
    shortDesc: 'Dễ sai lệch 3–5°C khi bay qua vùng chuyển ngày đêm.',
    tradeoffNote: 'Rẻ nhưng có nguy cơ báo nhiệt độ giả.',
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
    shortDesc: 'Đo chính xác nhiệt độ bề mặt đất và biển với 2 băng nhiệt.',
    tradeoffNote: 'Phân biệt tốt giữa lỗi cảm biến và biến đổi nhiệt thực tế.',
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
    shortDesc: 'Chính xác tuyệt đối ±0.2°C nhưng tiêu thụ điện và giá thành cao.',
    tradeoffNote: 'Thích hợp khi ưu tiên dữ liệu nhiệt chuyên sâu.',
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
    shortDesc: 'Tải ảnh lớn chậm, dễ mất tín hiệu khi thời tiết trạm mặt đất xấu.',
    tradeoffNote: 'Rẻ, chỉ hợp gửi gói tin nhỏ.',
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
    shortDesc: 'Truyền trực tiếp ảnh phân giải cao xuống Svalbard & Alaska.',
    tradeoffNote: 'Hiệu quả và tiết kiệm nhất cho vệ tinh quan sát.',
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
    shortDesc: 'Tốc độ truyền siêu nhanh gấp 4 lần, giá rất cao.',
    tradeoffNote: 'Dư thừa nhẹ so với nhu cầu truyền ảnh thông thường.',
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
    shortDesc: 'Dự trữ điện ít trong 45 phút bay đêm, dễ sụt áp khi bật nhiều khoang.',
    tradeoffNote: 'Rủi ro thiếu điện hỗ trợ sự sống rất cao.',
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
    shortDesc: 'Cấp điện ổn định cho sinh hoạt và thí nghiệm cơ bản.',
    tradeoffNote: 'Cần phân bổ điện khéo léo trong vùng tối.',
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
    shortDesc: 'Tăng 30% công suất điện trạm, bảo vệ an toàn tối đa cho phi hành gia.',
    tradeoffNote: 'Khoản đầu tư then chốt giúp trạm không mất điện.',
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
    shortDesc: 'Tản nhiệt chậm khi trạm hướng thẳng Mặt Trời, dễ quá nhiệt.',
    tradeoffNote: 'Có thể làm giảm hiệu suất các khoang thí nghiệm.',
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
    shortDesc: 'Giữ nhiệt độ khoang ổn định 20–24°C suốt chu kỳ ngày đêm.',
    tradeoffNote: 'Lựa chọn cân bằng, tin cậy cao.',
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
    shortDesc: 'Tự chuyển mạch khi nghẽn van, không bao giờ quá nhiệt.',
    tradeoffNote: 'Chi phí cao, nên ưu tiên nếu ngân sách còn dư.',
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
    shortDesc: 'Tỷ lệ tái chế nước thấp (70%), tốn vật tư bổ sung liên tục.',
    tradeoffNote: 'Không khuyến khích cho trạm có phi hành đoàn.',
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
    shortDesc: 'Cung cấp đủ O2 và nước sạch ổn định cho 6 phi hành gia.',
    tradeoffNote: 'Đáp ứng chuẩn an toàn nếu điện và nhiệt ổn định.',
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
    shortDesc: 'Tái chế gần như hoàn toàn nước và khí thở, an toàn sinh mạng tối đa.',
    tradeoffNote: 'Bộ phận bảo vệ tính mạng con người đáng đầu tư nhất trên ISS.',
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
    shortDesc: 'Chỉ truyền được giọng nói và chỉ số cơ bản, hay nhiễu.',
    tradeoffNote: 'Tiết kiệm tiền cho các hệ thống sinh tồn.',
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
    shortDesc: 'Liên lạc rõ ràng với Trái Đất qua mạng vệ tinh TDRS.',
    tradeoffNote: 'Hợp lý nhất về chi phí và tốc độ dữ liệu.',
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
    shortDesc: 'Truyền video HD và dữ liệu thí nghiệm liên tục không ngắt quãng.',
    tradeoffNote: 'Giá cao, cân nhắc nếu ngân sách đang dành cho hệ sinh tồn.',
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
    shortDesc: 'Xoay chậm và có độ rơ 2°, cần hiệu chỉnh kỹ trước khi vươn.',
    tradeoffNote: 'Giá rẻ nhưng mất thêm thời gian căn góc.',
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
    shortDesc: 'Chịu tải tốt tàu hàng nhiều tấn, chuyển động êm và ổn định.',
    tradeoffNote: 'Lựa chọn chuẩn mực cho phần gốc cánh tay.',
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
    shortDesc: 'Không có độ rơ cơ khí, chống rung tuyệt đối khi xoay tải nặng.',
    tradeoffNote: 'Chi phí cao hơn mức chuẩn cho thao tác gốc.',
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
    shortDesc: 'Dễ bị giật nhẹ khi đổi chiều chuyển động giữa nắng và bóng tối.',
    tradeoffNote: 'Có thể làm lệch quỹ đạo đầu kẹp.',
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
    shortDesc: 'Gập mở chính xác, ít bị ảnh hưởng bởi chênh lệch nhiệt độ quỹ đạo.',
    tradeoffNote: 'Đáp ứng tốt phần lớn thao tác bắt tàu hàng.',
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
    shortDesc: 'Điều khiển mượt mà từng 0.1 độ, giữ an toàn tối đa khi hỗ trợ phi hành gia.',
    tradeoffNote: 'Rất đáng đầu tư cho độ chính xác toàn cánh tay.',
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
    shortDesc: 'Khóa chốt chậm, dễ báo lỗi trượt nếu lệch góc dù chỉ 2 độ.',
    tradeoffNote: 'Rủi ro cao khi bắt tàu hàng hoặc phi hành gia.',
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
    shortDesc: 'Siết cáp kẹp chặt chuẩn NASA, có cảm biến tiếp xúc an toàn.',
    tradeoffNote: 'Ổn định cho nhiệm vụ gắp hàng hóa.',
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
    shortDesc: 'Tự hấp thụ va chạm nhẹ, khóa chốt an toàn tuyệt đối cho phi hành gia.',
    tradeoffNote: 'Đầu tư xứng đáng cho bộ phận tiếp xúc trực tiếp.',
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
    shortDesc: 'Hơi chói khi gặp ánh nắng gắt, khó nhìn rõ vạch căn chốt.',
    tradeoffNote: 'Tiết kiệm chi phí, phù hợp khi các khớp tay đã rất chuẩn.',
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
    shortDesc: 'Hiển thị rõ tâm chữ thập và đo khoảng cách tới chốt tàu hàng.',
    tradeoffNote: 'Cân bằng hoàn hảo giữa chi phí và tầm nhìn.',
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
    shortDesc: 'Quét khoảng cách laser chính xác từng milimét cả trong bóng tối.',
    tradeoffNote: 'Giá đắt, nên cân nhắc với ngân sách khớp tay.',
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
    shortDesc: 'Chỉ đủ chạy 1–2 mục tiêu quan sát ngắn trong một phiên.',
    tradeoffNote: 'Buộc phải tắt bớt cảm biến phụ khi kính vào vùng tối.',
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
    shortDesc: 'Cung cấp điện ổn định cho cả hệ định hướng và camera khoa học.',
    tradeoffNote: 'Hiệu quả kinh tế cao cho kính thiên văn.',
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
    shortDesc: 'Dư điện cho nhiều ca phơi sáng liên tiếp suốt nhiều giờ.',
    tradeoffNote: 'Đắt đỏ, cân nhắc dành tiền cho gương quang học và định hướng.',
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
    shortDesc: 'Dễ trôi hướng khi kính quay sang mục tiêu mới, gây vệt sao mờ.',
    tradeoffNote: 'Rủi ro ảnh bị nhòe khi chụp phơi sáng lâu.',
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
    shortDesc: 'Khóa sao ổn định tốt cho phần lớn các thiên hà sáng.',
    tradeoffNote: 'Tin cậy ở Cấp 1–2, cần chỉnh tinh thêm ở Cấp 3–4.',
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
    shortDesc: 'Khóa sao chuẩn 0.007 giây cung, ảnh sâu không bao giờ bị rung.',
    tradeoffNote: 'Trái tim giữ ảnh Hubble sắc nét tuyệt đối.',
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
    shortDesc: 'Nhiễu hạt cao khi chụp tinh vân tối, thiếu dải tia cực tím.',
    tradeoffNote: 'Chất lượng dữ liệu thiên văn bị giới hạn.',
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
    shortDesc: 'Ảnh rõ nét trên cả dải ánh sáng nhìn thấy và hồng ngoại gần.',
    tradeoffNote: 'Cân bằng giá và chất lượng ảnh thiên văn.',
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
    shortDesc: 'Chụp rõ những thiên hà xa hàng tỷ năm ánh sáng và bầu khí quyển ngoại hành tinh.',
    tradeoffNote: 'Hiệu suất khoa học cao nhất cho kính Hubble.',
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
    shortDesc: 'Chỉ lưu tối đa 2 mục tiêu quan sát mỗi phiên, dễ treo lệnh.',
    tradeoffNote: 'Hạn chế kế hoạch quan sát khoa học.',
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
    shortDesc: 'Sắp xếp mượt mà lịch chụp nhiều tinh vân và tối ưu pin.',
    tradeoffNote: 'Chi phí hợp lý, đủ đáp ứng mọi ca quan sát.',
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
    shortDesc: 'Tự tính góc tránh Mặt Trời và tối ưu thời gian phơi sáng từng giây.',
    tradeoffNote: 'Giá cao, vượt quá mức cần thiết nếu bạn đã tự lập lịch giỏi.',
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
    shortDesc: 'Thiết kế cho chân không lạnh sâu, sẽ bám bụi và kẹt ngàm ngay trên Sao Hỏa.',
    tradeoffNote: 'Không tương thích kích thước ngàm và môi trường bụi Sao Hỏa.',
    purchaseCost: 80,
    maintenanceCost: 90,
    durability: 20,
    performance: 10,
    reliability: 10,
    powerDrawW: 40,
    powerGenW: 0,
    compatibleMissions: ['mission_05_space_telescope'],
    incompatibleReason: 'Sai chuẩn kết nối cơ khí và không chống được bụi mịn Sao Hỏa.',
  },
  mission_02_earth_satellite: {
    id: 'incompat_for_landsat',
    subsystemId: 'sat_oli',
    tier: 'economy',
    name: 'Cụm Bánh Xe Địa Hình Rover',
    shortDesc: 'Bánh xe chạy trên đất đá — hoàn toàn vô dụng trên vệ tinh bay quanh Trái Đất!',
    tradeoffNote: 'Không tương thích với vệ tinh quỹ đạo Landsat 9.',
    purchaseCost: 90,
    maintenanceCost: 90,
    durability: 10,
    performance: 0,
    reliability: 10,
    powerDrawW: 45,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
    incompatibleReason: 'Vệ tinh quỹ đạo không dùng bánh xe mặt đất và sai giao thức bus điện.',
  },
  mission_03_space_station: {
    id: 'incompat_for_iss',
    subsystemId: 'iss_thermal',
    tier: 'economy',
    name: 'Quạt Gió Tản Nhiệt Khí Quyển Trái Đất',
    shortDesc: 'Không gian bên ngoài ISS là chân không — quạt gió không thể thổi nhiệt ra ngoài!',
    tradeoffNote: 'Không tương thích môi trường chân không quỹ đạo.',
    purchaseCost: 60,
    maintenanceCost: 90,
    durability: 15,
    performance: 0,
    reliability: 10,
    powerDrawW: 30,
    powerGenW: 0,
    compatibleMissions: [],
    incompatibleReason: 'Ngoài trạm vũ trụ không có không khí để tản nhiệt đối lưu.',
  },
  mission_04_robotic_arm: {
    id: 'incompat_for_canadarm',
    subsystemId: 'arm_wrist',
    tier: 'economy',
    name: 'Mũi Khoan Đá Bazan Perseverance',
    shortDesc: 'Dùng để khoan đá Sao Hỏa, không thể kẹp chốt neo tàu hàng Cygnus/Dragon.',
    tradeoffNote: 'Sai chuẩn đầu kẹp LEE của trạm ISS.',
    purchaseCost: 85,
    maintenanceCost: 90,
    durability: 15,
    performance: 0,
    reliability: 10,
    powerDrawW: 35,
    powerGenW: 0,
    compatibleMissions: ['mission_01_mars_rover'],
    incompatibleReason: 'Không có cáp siết chốt neo LEE; nguy cơ làm hư hỏng tàu hàng tiếp tế.',
  },
  mission_05_space_telescope: {
    id: 'incompat_for_hubble',
    subsystemId: 'hst_optics',
    tier: 'economy',
    name: 'Camera Góc Rộng Chụp Đất Nông Nghiệp',
    shortDesc: 'Ống kính góc rộng nhìn gần, không thể hội tụ ánh sáng sao xa hàng triệu năm ánh sáng.',
    tradeoffNote: 'Không tương thích quang học thiên văn sâu của Hubble.',
    purchaseCost: 75,
    maintenanceCost: 90,
    durability: 20,
    performance: 5,
    reliability: 10,
    powerDrawW: 25,
    powerGenW: 0,
    compatibleMissions: ['mission_02_earth_satellite'],
    incompatibleReason: 'Tiêu cự không phù hợp gương chính 2.4m của kính thiên văn Hubble.',
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
  subsystemId: EquipmentSubsystemId
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

    if (depRuntime.status === 'failed') {
      effectiveStatus = 'failed';
      effectiveHealth = Math.min(effectiveHealth, 15);
      blockedBy = depBp.name;
      break;
    }
    if (depRuntime.status === 'degraded' && effectiveStatus === 'ok') {
      effectiveStatus = 'degraded';
      effectiveHealth = Math.min(effectiveHealth, 65);
      degradedBy = depBp.name;
    }
  }

  return { status: effectiveStatus, health: effectiveHealth, blockedBy, degradedBy };
}

interface FaultTemplate {
  subsystemId: EquipmentSubsystemId;
  status: SubsystemHealthStatus;
  health: number;
  faultTitle: string;
  faultCause: string;
}

const MISSION_FAULT_TEMPLATES: Record<MissionId, FaultTemplate[]> = {
  mission_01_mars_rover: [
    {
      subsystemId: 'rover_mobility',
      status: 'failed',
      health: 22,
      faultTitle: 'Kẹt mô-tơ bánh trước trái',
      faultCause: 'Bụi đá Jezero làm kẹt hộp số dẫn động bánh xe, robot không thể lăn bánh bình thường.',
    },
    {
      subsystemId: 'rover_camera',
      status: 'degraded',
      health: 52,
      faultTitle: 'Ống kính Mastcam-Z bám bụi mờ',
      faultCause: 'Gió bụi làm mờ cảm biến dẫn đường, không thể khảo sát an toàn địa hình đá và cát.',
    },
    {
      subsystemId: 'rover_arm',
      status: 'failed',
      health: 28,
      faultTitle: 'Lệch trục khớp cánh tay khoan',
      faultCause: 'Cảm biến lực cánh tay mất chuẩn khiến mũi khoan không thể hạ đúng vào mẫu đá.',
    },
    {
      subsystemId: 'rover_comms',
      status: 'degraded',
      health: 48,
      faultTitle: 'Ăng-ten UHF suy giảm tín hiệu',
      faultCause: 'Khớp xoay hướng bị kẹt nhẹ làm tốc độ chuyển tiếp ảnh về vệ tinh MRO sụt mạnh.',
    },
  ],
  mission_02_earth_satellite: [
    {
      subsystemId: 'sat_oli',
      status: 'failed',
      health: 25,
      faultTitle: 'Sọc nhiễu cảm biến ảnh OLI-2',
      faultCause: 'Kênh thu ánh sáng xanh và cận hồng ngoại bị lỗi đồng bộ làm thiếu dải ảnh Trái Đất.',
    },
    {
      subsystemId: 'sat_tirs',
      status: 'degraded',
      health: 46,
      faultTitle: 'Sai lệch điểm ảnh nhiệt TIRS-2',
      faultCause: 'Bộ làm lạnh cảm biến nhiệt không ổn định tạo ra vùng nhiệt độ giả trên bản đồ.',
    },
    {
      subsystemId: 'sat_processor',
      status: 'failed',
      health: 30,
      faultTitle: 'Tràn bộ nhớ đệm xử lý dữ liệu',
      faultCause: 'Tia vũ trụ làm lỗi bộ xử lý trung tâm, khiến cả ảnh chụp và lịch quan sát bị ngắt.',
    },
    {
      subsystemId: 'sat_comms',
      status: 'degraded',
      health: 50,
      faultTitle: 'Suy hao bộ phát băng tần X',
      faultCause: 'Công suất phát sóng yếu khiến trạm Svalbard không nhận đủ gói tin ảnh vệ tinh.',
    },
  ],
  mission_03_space_station: [
    {
      subsystemId: 'iss_thermal',
      status: 'failed',
      health: 24,
      faultTitle: 'Tắc van tuần hoàn nhiệt Amoniac',
      faultCause: 'Nhiệt độ phòng thí nghiệm tăng vượt 33°C, buộc các hệ thống khác phải tự giảm tải.',
    },
    {
      subsystemId: 'iss_power',
      status: 'degraded',
      health: 50,
      faultTitle: 'Sụt áp tổ hợp pin khi vào bóng tối',
      faultCause: 'Pin lưu trữ suy giảm dung lượng khiến lưới điện thiếu hụt 35% công suất khi khuất nắng.',
    },
    {
      subsystemId: 'iss_comms',
      status: 'degraded',
      health: 54,
      faultTitle: 'Mất khóa hướng ăng-ten Ku-Band',
      faultCause: 'Ăng-ten không bám kịp vệ tinh chuyển tiếp TDRS làm gián đoạn truyền dữ liệu.',
    },
    {
      subsystemId: 'iss_lifesupport',
      status: 'degraded',
      health: 45,
      faultTitle: 'Nghẽn lọc tái chế nước sạch',
      faultCause: 'Áp suất bơm tái chế giảm mạnh làm lượng nước dự trữ cho phi hành đoàn tụt nhanh.',
    },
  ],
  mission_04_robotic_arm: [
    {
      subsystemId: 'arm_elbow',
      status: 'failed',
      health: 25,
      faultTitle: 'Sai lệch cảm biến góc khớp khuỷu',
      faultCause: 'Khớp khuỷu bị giật lệch 4.5° khiến đầu kẹp không thể vươn đúng tọa độ tàu hàng.',
    },
    {
      subsystemId: 'arm_camera',
      status: 'failed',
      health: 30,
      faultTitle: 'Mất hình camera đầu kẹp LEE',
      faultCause: 'Nhiễu tín hiệu hình ảnh từ đầu kẹp khiến phi hành gia không nhìn thấy tâm chốt neo.',
    },
    {
      subsystemId: 'arm_wrist',
      status: 'degraded',
      health: 48,
      faultTitle: 'Lỏng cáp siết đầu kẹp cổ tay',
      faultCause: 'Lực kẹp giảm còn 50%, không đủ an toàn để khóa tàu tiếp tế hoặc hỗ trợ phi hành gia.',
    },
    {
      subsystemId: 'arm_shoulder',
      status: 'degraded',
      health: 55,
      faultTitle: 'Ma sát tăng ở khớp vai',
      faultCause: 'Chênh lệch nhiệt độ làm khớp vai xoay chậm và lệch trục nhẹ.',
    },
  ],
  mission_05_space_telescope: [
    {
      subsystemId: 'hst_guidance',
      status: 'failed',
      health: 22,
      faultTitle: 'Trôi con quay hồi chuyển FGS',
      faultCause: 'Kính thiên văn bị rung và trôi khỏi ngôi sao dẫn đường, không thể phơi sáng.',
    },
    {
      subsystemId: 'hst_optics',
      status: 'degraded',
      health: 48,
      faultTitle: 'Nhiễu cảm biến ảnh WFC3',
      faultCause: 'Bức xạ quỹ đạo làm mờ dải thu sáng cực tím và nhiễu hạt ảnh tinh vân.',
    },
    {
      subsystemId: 'hst_power',
      status: 'degraded',
      health: 52,
      faultTitle: 'Sụt điện pin mặt trời khi qua bóng Trái Đất',
      faultCause: 'Nguồn điện dự trữ thấp khiến không thể bật đồng thời hệ định hướng và sưởi kính.',
    },
    {
      subsystemId: 'hst_computer',
      status: 'failed',
      health: 32,
      faultTitle: 'Lỗi hàng đợi lập lịch quan sát',
      faultCause: 'Bộ nhớ điều phối bị treo lệnh, không thể sắp xếp ưu tiên các mục tiêu thiên văn.',
    },
  ],
};

export function createInitialMissionSession(
  missionId: MissionId,
  difficulty: DifficultyLevel,
  selectedPartIds?: Record<string, string>
): MissionSessionState {
  const subs = getSubsystemsForMission(missionId);
  const profile = DIFFICULTY_PROFILES[difficulty];
  const initialBudget = getMissionInitialBudget(missionId, difficulty);
  const faultPool = MISSION_FAULT_TEMPLATES[missionId] || [];
  const activeFaults = faultPool.slice(0, Math.min(profile.initialFaultCount, faultPool.length));
  const faultyIds = new Set(activeFaults.map((f) => f.subsystemId));

  const subsystems: Record<string, SubsystemRuntimeState> = {};
  let partsCost = 0;
  let maintenanceCost = 0;

  subs.forEach((s) => {
    const parts = getPartsForSubsystem(s.id);
    const preferredId = selectedPartIds?.[s.id];
    const defaultTier: PartTier =
      difficulty >= 3 && (faultyIds.has(s.id) || s.criticality === 'support')
        ? 'economy'
        : 'standard';

    const chosen =
      (preferredId ? parts.find((p) => p.id === preferredId) : undefined) ||
      parts.find((p) => p.tier === defaultTier) ||
      parts[0];

    partsCost += chosen.purchaseCost;
    maintenanceCost += chosen.maintenanceCost;

    subsystems[s.id] = {
      subsystemId: s.id,
      partId: chosen.id,
      health: 100,
      status: 'ok',
    };
  });

  // Seed deterministic engineering faults scaling with difficulty level (1..4)
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
        faultCause: fault.faultCause,
        diagnosed: false,
      };
    }
  }

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
    completedSubTasks: [],
    diagnosisAttempts: 0,
    diagnosisCorrect: 0,
    incidentsTriggered: activeFaults.length,
    safetyWarningsIgnored: 0,
    safetyChecksRun: 0,
    preDeployReport: null,
  };
}

/**
 * Clean assembly-phase session for DesignLabView & LaunchCenterView (all newly mounted parts start at 100% health).
 */
export function createAssemblySession(
  missionId: MissionId,
  difficulty: DifficultyLevel,
  selectedPartIds?: Record<string, string>
): MissionSessionState {
  const subs = getSubsystemsForMission(missionId);
  const profile = DIFFICULTY_PROFILES[difficulty];
  const initialBudget = getMissionInitialBudget(missionId, difficulty);

  const subsystems: Record<string, SubsystemRuntimeState> = {};
  let partsCost = 0;
  let maintenanceCost = 0;

  subs.forEach((s) => {
    const parts = getPartsForSubsystem(s.id);
    const preferredId = selectedPartIds?.[s.id];
    const defaultTier: PartTier =
      difficulty >= 3 && s.criticality === 'support' ? 'economy' : 'standard';

    const chosen =
      (preferredId ? parts.find((p) => p.id === preferredId) : undefined) ||
      parts.find((p) => p.tier === defaultTier) ||
      parts[0];

    partsCost += chosen.purchaseCost;
    maintenanceCost += chosen.maintenanceCost;

    subsystems[s.id] = {
      subsystemId: s.id,
      partId: chosen.id,
      health: 100,
      status: 'ok',
    };
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
    completedSubTasks: [],
    diagnosisAttempts: 0,
    diagnosisCorrect: 0,
    incidentsTriggered: 0,
    safetyWarningsIgnored: 0,
    safetyChecksRun: 0,
    preDeployReport: null,
  };
}

/**
 * Applies deterministic orbital/planetary arrival faults when entering simulation,
 * influenced by difficulty level and chosen part durability/tier.
 */
export function activateMissionArrivalFaults(session: MissionSessionState): MissionSessionState {
  // Avoid double-seeding if already seeded
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

    // Higher durability/premium parts can soften a degraded fault, while economy parts break harder
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
      faultCause:
        tier === 'economy'
          ? `${fault.faultCause} (Linh kiện Tiết kiệm có độ bền thấp nên hư hại nặng hơn.)`
          : fault.faultCause,
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
  faultCause: string
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
        faultCause,
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
  economy: MissionEconomyState
): SafetyGateReport {
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
  const netPowerW = totalPowerGen > 0 ? totalPowerGen - totalPowerDraw : 45; // Canadarm2 uses ISS station bus

  const remainingBudget = getRemainingBudget(economy);

  const avgHealth = runtimes.length
    ? Math.round(runtimes.reduce((s, r) => s + r.health, 0) / runtimes.length)
    : 0;
  const safetyPct = Math.max(
    0,
    Math.min(100, Math.round(avgHealth * 0.45 + avgReliability * 0.35 + avgDurability * 0.2))
  );

  const checks: SafetyCheckItem[] = [
    {
      id: 'compat',
      label: '1. Độ tương thích thiết bị',
      level: allCompatible ? 'ok' : 'fail',
      detail: allCompatible
        ? `Tất cả ${parts.length}/${blueprints.length} bộ phận tương thích chuẩn với thiết bị.`
        : 'Phát hiện linh kiện không tương thích với thiết bị NASA này!',
    },
    {
      id: 'health',
      label: '2. Tình trạng bộ phận trọng yếu',
      level: failedSubs.length > 0 ? 'fail' : degradedSubs.length > 0 ? 'warn' : 'ok',
      detail:
        failedSubs.length > 0
          ? `Có ${failedSubs.length} bộ phận đang hỏng: ${failedSubs.map((b) => b.name).join(', ')}.`
          : degradedSubs.length > 0
          ? `Có ${degradedSubs.length} bộ phận suy giảm nhẹ: ${degradedSubs.map((b) => b.name).join(', ')}.`
          : 'Mọi bộ phận đều ở trạng thái hoạt động tốt.',
    },
    {
      id: 'quality',
      label: '3. Độ bền · Hiệu suất · Độ tin cậy',
      level:
        avgDurability < 55 || avgReliability < 55
          ? 'fail'
          : avgDurability < 75 || avgReliability < 75
          ? 'warn'
          : 'ok',
      detail: `Độ bền ${avgDurability}% · Hiệu suất ${avgPerformance}% · Tin cậy ${avgReliability}%.`,
    },
    {
      id: 'power',
      label: '4. Cân bằng năng lượng',
      level: netPowerW < -15 ? 'fail' : netPowerW < 15 ? 'warn' : 'ok',
      detail:
        totalPowerGen > 0
          ? `Nguồn cấp ${totalPowerGen}W / Tiêu thụ ${totalPowerDraw}W (Dư ${netPowerW >= 0 ? `+${netPowerW}` : netPowerW}W).`
          : 'Dùng nguồn điện trung tâm từ Trạm Vũ trụ ISS (ổn định).',
    },
    {
      id: 'budget',
      label: '5. Ngân sách & Dự phòng an toàn',
      level: remainingBudget < 0 ? 'fail' : remainingBudget < 60 ? 'warn' : 'ok',
      detail:
        remainingBudget < 0
          ? `Vượt ngân sách ${Math.abs(remainingBudget)} triệu $! Hãy chọn phương án cân bằng hơn.`
          : remainingBudget < 60
          ? `Còn dư ${remainingBudget} triệu $ — dự phòng sửa chữa rất mỏng.`
          : `Còn dư ${remainingBudget} triệu $ dự phòng vận hành.`,
    },
  ];

  const hasFail = checks.some((c) => c.level === 'fail');
  const hasWarn = checks.some((c) => c.level === 'warn');

  if (hasFail) {
    return {
      status: 'FAILED',
      checks,
      summary:
        'FAILED: Không đạt yêu cầu tối thiểu. Không thể triển khai khi còn bộ phận hỏng, mất cân bằng điện hoặc vượt ngân sách!',
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
      summary:
        'WARNING: Có thể hoạt động trong điều kiện hạn chế nhưng tồn tại rủi ro suy giảm hoặc phát sinh sự cố khi chạy tải nặng.',
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
    summary: 'READY: Thiết bị đạt đầy đủ tiêu chuẩn kỹ thuật, năng lượng và an toàn để triển khai!',
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
  extras: { photos: number; samples: number; totalSubTasks?: number }
): MissionEvaluationReport {
  const totalTasks = extras.totalSubTasks || 4;
  const completedCount = session.completedSubTasks.length;
  const completionPct = Math.round((completedCount / totalTasks) * 100);

  const safetyReport = evaluateSystemSafety(session.missionId, session.subsystems, session.economy);
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

  // Score calculation (max 100)
  // 1. Completion: up to 40 pts
  const completionScore = (completedCount / totalTasks) * 40;
  // 2. Safety & Reliability & Diagnosis: up to 25 pts
  const safetyScore =
    (safetyReport.safetyPct / 100) * 18 +
    (diagnosisAccuracyPct / 100) * 7 -
    session.safetyWarningsIgnored * 5;
  // 3. Performance: up to 15 pts
  const perfScore = (safetyReport.performancePct / 100) * 15;
  // 4. Cost Balance & Resource Optimization: up to 20 pts
  // Ideal: within budget, leaving healthy reserve (>= 8% of budget), NOT buying all premium blindly!
  let costScore = 0;
  if (remaining < 0) {
    costScore = Math.max(0, 6 - Math.floor(Math.abs(remaining) / 30));
  } else {
    const reserveRatio = remaining / initialBudget;
    costScore = 14 + Math.min(6, Math.round(reserveRatio * 35));
    if (allPremiumWasteful) {
      // Explicitly enforce: buying all most expensive parts does NOT get maximum score!
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

  const goodChoices: string[] = [];
  const suboptimalChoices: string[] = [];

  if (completedCount === totalTasks) {
    goodChoices.push(`Hoàn thành xuất sắc toàn bộ ${totalTasks}/${totalTasks} nhiệm vụ chuyên môn của thiết bị.`);
  } else if (completedCount > 0) {
    suboptimalChoices.push(`Mới hoàn thành ${completedCount}/${totalTasks} nhiệm vụ của thiết bị.`);
  }

  if (!allPremiumWasteful && premiumCount >= 1 && (standardCount >= 1 || economyCount >= 1) && remaining >= 0) {
    goodChoices.push(
      'Phân bổ ngân sách thông minh: đầu tư Cao cấp cho bộ phận cốt lõi và Tiêu chuẩn/Tiết kiệm cho bộ phận phụ.'
    );
  }

  if (allPremiumWasteful) {
    suboptimalChoices.push(
      'Lãng phí ngân sách: chọn linh kiện Cao cấp cho mọi vị trí dù một số bộ phận chỉ cần mức Tiêu chuẩn.'
    );
  }

  if (remaining < 0) {
    suboptimalChoices.push(
      `Chi tiêu vượt ngân sách ${Math.abs(remaining)} triệu $ — cần cắt giảm chi phí bảo trì hoặc hạ phân khúc bộ phận phụ.`
    );
  } else if (remaining >= Math.round(initialBudget * 0.1)) {
    goodChoices.push(`Giữ lại được ${remaining} triệu $ ngân sách dự phòng cho vận hành dài hạn.`);
  }

  if (session.safetyWarningsIgnored > 0) {
    suboptimalChoices.push(
      `Đã bỏ qua cảnh báo an toàn ${session.safetyWarningsIgnored} lần trước khi triển khai.`
    );
  } else if (session.safetyChecksRun > 0) {
    goodChoices.push('Tuân thủ nghiêm ngặt quy trình Kiểm tra an toàn trước khi vận hành.');
  }

  if (economyCount >= 2 && session.incidentsTriggered > DIFFICULTY_PROFILES[session.difficulty].initialFaultCount) {
    suboptimalChoices.push(
      'Sử dụng nhiều linh kiện Tiết kiệm ở vị trí chịu tải cao gây hỏng hóc phát sinh tốn phí sửa chữa.'
    );
  }

  if (session.economy.failurePenalty > 0) {
    suboptimalChoices.push(
      `Phát sinh ${session.economy.failurePenalty} triệu $ chi phí sự cố do chạy thử khi hệ thống chưa đạt chuẩn.`
    );
  }

  if (goodChoices.length === 0) {
    goodChoices.push('Đã tham gia chẩn đoán và thực hành vận hành hệ thống NASA.');
  }
  if (suboptimalChoices.length === 0) {
    suboptimalChoices.push('Không phát hiện lãng phí hay rủi ro đáng kể — giải pháp rất cân bằng!');
  }

  const lessonsByMission: Record<MissionId, string> = {
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
    outcomeTitle:
      finalScore >= 85
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
