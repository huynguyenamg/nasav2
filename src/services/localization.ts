import { Language } from '../types/game';

export const TRANSLATIONS = {
  vi: {
    // Brand & Header
    appName: 'Học Viện Vũ Trụ NASA',
    appTagline: 'Học Viện Khám Phá Vũ Trụ – Kỹ Sư Nhí NASA',
    nasaChallengeNote: 'Thử thách NASA 2026: Thiết Kế Sứ Mệnh Vũ Trụ',
    disclaimer: 'Trò chơi mô phỏng giáo dục phi lợi nhuận.',

    // Navigation
    navLobby: 'Trang chủ',
    navMap: 'Nhiệm vụ',
    navDesign: 'Lắp ráp',
    navLaunch: 'Phóng tên lửa',
    navSim: 'Thực hành',
    navRepair: 'Sửa chữa',
    navNasa: 'Dữ liệu NASA',
    navAchievements: 'Hồ sơ',

    // Age Modes
    modeJuniorTitle: 'Nhà Thám Hiểm Nhí',
    modeJuniorAge: 'Dành cho bé 4 – 8 tuổi',
    modeJuniorDesc: 'Nhiệm vụ ngắn gọn, kéo thả trực quan, hình ảnh lớn và hướng dẫn từng bước.',
    modeEngineerTitle: 'Kỹ Sư Nhí',
    modeEngineerAge: 'Dành cho bé 9 – 11 tuổi',
    modeEngineerDesc: 'Nhiệm vụ tính toán khối lượng, điện năng và sửa chữa sự cố.',

    // Cadet Profile
    cadetTitle: 'Hồ Sơ Phi Hành Gia Nhí',
    enterName: 'Nhập tên của bé...',
    enterCallsign: 'Bí danh vũ trụ (VD: Sao Sáng)',
    chooseAvatar: 'Chọn nhân vật của bé',
    selectMode: 'Chọn lứa tuổi của bé',
    startAdventure: 'Bắt đầu khám phá',
    level: 'Cấp độ',
    rank: 'Cấp bậc',
    xp: 'Điểm thưởng',

    // NASA Badges
    badgeRealNasa: 'DỮ LIỆU NASA THẬT',
    badgeNasaModel: 'MÔ HÌNH HỌC TẬP NASA',
    badgeSimData: 'DỮ LIỆU MÔ PHỎNG',

    // Stages
    stageDiscover: '1. Khám phá',
    stageDesign: '2. Lắp ráp',
    stageResources: '3. Kiểm tra',
    stageLaunch: '4. Phóng tàu',
    stageSimulate: '5. Thực hành',
    stageRepair: '6. Sửa chữa',
    stageDebrief: '7. Kết quả',

    // Design Lab
    categories: {
      chassis: 'Khung thân',
      mobility: 'Bánh xe',
      camera: 'Máy ảnh',
      antenna: 'Ăng-ten',
      power: 'Nguồn điện',
      battery: 'Pin lưu trữ',
      science: 'Thiết bị đo',
      thruster: 'Động cơ đẩy',
      computer: 'Máy tính',
    },
    equipBtn: 'Lắp vào',
    removeBtn: 'Gỡ ra',
    equipped: 'Đã lắp',
    slotEmpty: 'Chưa lắp',

    // Resource Bar
    budget: 'Ngân sách',
    mass: 'Khối lượng',
    powerBalance: 'Điện năng',
    batteryStorage: 'Pin dự trữ',
    commsRange: 'Liên lạc',
    scienceVal: 'Điểm khoa học',
    warningOverBudget: 'Vượt quá ngân sách cho phép!',
    warningOverMass: 'Thiết bị hơi nặng so với tên lửa!',
    warningPowerDeficit: 'Cần thêm nguồn điện để hoạt động!',
    readyToLaunch: 'Lắp ráp hoàn chỉnh! Đã sẵn sàng.',

    // Simulator
    simulatorControls: 'Điều Khiển Robot Trên Sao Hỏa',
    driveTip: 'Chạm nút mũi tên để lái robot khám phá!',
    takePhoto: 'Chụp ảnh',
    scanRock: 'Quét đá',
    transmitData: 'Gửi kết quả',
    batteryLevel: 'Mức pin',
    solarStatus: 'Nắng Mặt Trời',
    samplesCollected: 'Đá đã quét',
    photosTaken: 'Ảnh đã chụp',
    commsLink: 'Kết nối',

    // Repair Workshop
    repairTitle: 'Sửa Chữa Thiết Bị NASA',
    repairSubtitle: 'Kiểm tra linh kiện và chạy thử thiết bị.',
    symptomLabel: 'Dấu hiệu nhận biết:',
    hypothesisPrompt: 'Bé hãy chọn cách sửa phù hợp:',
    selectFix: 'Chọn phương án sửa:',
    runDiagnostics: 'Kiểm tra và sửa chữa',
    fixSuccess: 'Tuyệt vời! Thiết bị đã hoạt động tốt trở lại.',
    fixFailed: 'Chưa đúng rồi! Bé hãy thử chọn cách khác nhé.',

    // Debrief
    debriefTitle: 'Hoàn Thành Nhiệm Vụ!',
    xpEarned: 'Điểm đạt được',
    badgeUnlocked: 'Mở khóa huy hiệu mới!',
    reflectionTitle: 'Góc Khám Phá',
    nextMission: 'Tiếp tục',
    replayMission: 'Thử lại',

    // AI Assistant NOVA
    novaGreeting: 'Xin chào bé! Tớ là NOVA. Bé muốn hỏi gì về vũ trụ hôm nay?',
    askNovaPlaceholder: 'Hỏi NOVA nhé...',
    novaSend: 'Gửi',
    novaThinking: 'NOVA đang suy nghĩ...',
    quickQuestions: [
      'Làm sao để robot chạy nhanh hơn?',
      'Ăng-ten dùng để làm gì?',
      'Pin Mặt Trời hoạt động thế nào?',
      'Bánh xe nào đi tốt trên cát Sao Hỏa?',
    ],
  },
  en: {
    // Brand & Header
    appName: 'Space Mission Academy',
    appTagline: 'Little NASA Engineers – Space Mission Design Game',
    nasaChallengeNote: 'NASA Space Apps Challenge 2026: Space Mission Design Game',
    disclaimer: 'Educational non-profit space simulator. Not an official NASA certification program.',

    // Navigation
    navLobby: 'Academy Lobby',
    navMap: 'Mission Map',
    navDesign: 'Design Lab',
    navLaunch: 'Launch Center',
    navSim: 'Live Simulator',
    navRepair: 'Repair Workshop',
    navNasa: 'NASA Data',
    navAchievements: 'Trophy Room',

    // Age Modes
    modeJuniorTitle: 'Junior Explorer',
    modeJuniorAge: 'Ages 6 to 8',
    modeJuniorDesc: '5–8 min missions, vibrant tactile controls, 2-3 core resources, step-by-step guidance.',
    modeEngineerTitle: 'Young Engineer',
    modeEngineerAge: 'Ages 9 to 11',
    modeEngineerDesc: '10–15 min missions, calculate mass, budget, power balance, comms, troubleshoot anomalies.',

    // Cadet Profile
    cadetTitle: 'Cadet Astronaut Profile',
    enterName: 'Enter your cadet name...',
    enterCallsign: 'Space Callsign (e.g., StarGazer, AstroLeo)',
    chooseAvatar: 'Choose your avatar',
    selectMode: 'Select your flight mode',
    startAdventure: 'Launch Into Space',
    level: 'Level',
    rank: 'Rank',
    xp: 'Experience Points (XP)',

    // NASA Badges
    badgeRealNasa: 'REAL NASA DATA',
    badgeNasaModel: 'NASA-BASED EDUCATIONAL MODEL',
    badgeSimData: 'SIMULATED GAME DATA',

    // Stages
    stageDiscover: '1. Discover',
    stageDesign: '2. Design',
    stageResources: '3. Resources',
    stageLaunch: '4. Launch',
    stageSimulate: '5. Simulate',
    stageRepair: '6. Diagnose & Repair',
    stageDebrief: '7. Debrief & Badges',

    // Design Lab
    categories: {
      chassis: 'Chassis / Body',
      mobility: 'Mobility / Wheels',
      camera: 'Vision & Cameras',
      antenna: 'Communications',
      power: 'Primary Power',
      battery: 'Battery Storage',
      science: 'Science Instruments',
      thruster: 'Propulsion / Thrusters',
      computer: 'Flight Computer',
    },
    equipBtn: 'Equip Slot',
    removeBtn: 'Remove',
    equipped: 'Equipped',
    slotEmpty: 'Empty slot',

    // Resource Bar
    budget: 'Budget',
    mass: 'Mass',
    powerBalance: 'Power Balance',
    batteryStorage: 'Battery Storage',
    commsRange: 'Comms Range',
    scienceVal: 'Science Value',
    warningOverBudget: 'Exceeds authorized mission budget!',
    warningOverMass: 'Spacecraft too heavy for launch rocket!',
    warningPowerDeficit: 'Negative power budget! Equipment will brown out.',
    readyToLaunch: 'Configuration balanced! Ready for launch.',

    // Simulator
    simulatorControls: 'Martian Surface Rover Control',
    driveTip: 'Use [W, A, S, D] arrow keys or click the on-screen steering pad!',
    takePhoto: 'Take Mastcam Photo',
    scanRock: 'Laser Scan Rock (ChemCam)',
    transmitData: 'Transmit to Earth Orbiter',
    batteryLevel: 'Battery Level',
    solarStatus: 'Solar Irradiation',
    samplesCollected: 'Rocks Analyzed',
    photosTaken: 'Photos Captured',
    commsLink: 'Orbiter Link',

    // Repair Workshop
    repairTitle: 'Mission Diagnostic Workstation',
    repairSubtitle: 'Analyze real-time telemetry, predict root cause, and upload ground commands from Earth.',
    symptomLabel: 'Telemetry anomaly recorded:',
    hypothesisPrompt: 'What is the most probable engineering root cause?',
    selectFix: 'Select repair action:',
    runDiagnostics: 'Execute Diagnostic & Upload Ground Patch',
    fixSuccess: 'Superb! Ground patch verified, subsystem nominal.',
    fixFailed: 'Telemetry still nominal warning! Check NOVA hints and rethink.',

    // Debrief
    debriefTitle: 'Mission Debrief & Flight Log',
    xpEarned: 'XP Awarded',
    badgeUnlocked: 'New Honor Badge Unlocked!',
    reflectionTitle: 'Little Engineer Reflection',
    nextMission: 'Next Mission',
    replayMission: 'Replay to Optimize',

    // AI Assistant NOVA
    novaGreeting: 'Hello explorer! I am robot NOVA. What shall we discover today?',
    askNovaPlaceholder: 'Ask NOVA (e.g. Why did my battery drain?)...',
    novaSend: 'Send',
    novaThinking: 'NOVA is thinking...',
    quickQuestions: [
      'How to make the rover drive faster?',
      'Why do we need a High-Gain Antenna?',
      'Solar panels vs Nuclear RTG on Mars?',
      'Best wheels for Martian sand dunes?',
    ],
  },
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.vi;
}
