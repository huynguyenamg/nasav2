import { Language } from '../types/game';

export const TRANSLATIONS = {
  vi: {
    // Brand & Header
    appName: 'NASA Technical Academy',
    appTagline: 'Học Viện Công Nghệ Không Gian – Mô Phỏng Kỹ Thuật NASA',
    nasaChallengeNote: 'Hệ thống mô phỏng nhiệm vụ không gian NASA',
    disclaimer: 'Phần mềm mô phỏng giáo dục kỹ thuật không gian dành cho học sinh THCS.',

    // Navigation
    navLobby: 'Trang chủ',
    navMap: 'Nhiệm vụ',
    navDesign: 'Lắp ráp',
    navLaunch: 'Kiểm tra phóng',
    navSim: 'Vận hành',
    navRepair: 'Sửa chữa',
    navNasa: 'Dữ liệu NASA',
    navAchievements: 'Hồ sơ',

    // Age Modes
    modeJuniorTitle: 'Kỹ sư Tập sự',
    modeJuniorAge: 'Mức cơ bản (11 – 12 tuổi)',
    modeJuniorDesc: 'Nhiệm vụ trực quan, hướng dẫn từng bước và phân tích thông số cơ bản.',
    modeEngineerTitle: 'Kỹ sư Không gian',
    modeEngineerAge: 'Mức nâng cao (13 – 15 tuổi)',
    modeEngineerDesc: 'Phân tích cân bằng điện năng, ngân sách, độ bền và chẩn đoán sự cố đa tầng.',

    // Cadet Profile
    cadetTitle: 'Hồ Sơ Học Viên NASA',
    enterName: 'Nhập họ và tên của bạn...',
    enterCallsign: 'Bí danh điều khiển (VD: Orion-01)',
    chooseAvatar: 'Chọn biểu tượng kỹ thuật',
    selectMode: 'Chọn cấp độ học tập',
    startAdventure: 'Bắt đầu nhiệm vụ',
    level: 'Cấp độ',
    rank: 'Cấp bậc',
    xp: 'Điểm kinh nghiệm',

    // NASA Badges
    badgeRealNasa: 'DỮ LIỆU NASA THẬT',
    badgeNasaModel: 'MÔ HÌNH KỸ THUẬT NASA',
    badgeSimData: 'DỮ LIỆU MÔ PHỎNG',

    // Stages
    stageDiscover: '1. Tổng quan',
    stageDesign: '2. Lắp ráp',
    stageResources: '3. Thông số',
    stageLaunch: '4. Kiểm tra',
    stageSimulate: '5. Vận hành',
    stageRepair: '6. Sửa chữa',
    stageDebrief: '7. Báo cáo',

    // Design Lab
    categories: {
      chassis: 'Khung thân',
      mobility: 'Hệ truyền động',
      camera: 'Quang học & Camera',
      antenna: 'Liên lạc vô tuyến',
      power: 'Nguồn năng lượng',
      battery: 'Pin lưu trữ',
      science: 'Thiết bị khoa học',
      thruster: 'Động cơ đẩy',
      computer: 'Máy tính điều khiển',
    },
    equipBtn: 'Lắp đặt',
    removeBtn: 'Tháo bỏ',
    equipped: 'Đang dùng',
    slotEmpty: 'Chưa lắp',

    // Resource Bar
    budget: 'Ngân sách',
    mass: 'Khối lượng',
    powerBalance: 'Cân bằng điện',
    batteryStorage: 'Pin dự trữ',
    commsRange: 'Liên lạc',
    scienceVal: 'Giá trị khoa học',
    warningOverBudget: 'Vượt quá ngân sách cho phép!',
    warningOverMass: 'Thiết bị vượt quá tải trọng tên lửa!',
    warningPowerDeficit: 'Công suất phát nhỏ hơn mức tiêu thụ!',
    readyToLaunch: 'Cấu hình đạt chuẩn! Sẵn sàng kiểm tra vận hành.',

    // Simulator
    simulatorControls: 'Bảng Điều Khiển Perseverance Trên Sao Hỏa',
    driveTip: 'Dùng phím mũi tên / WASD hoặc cần điều khiển để di chuyển tới mục tiêu.',
    takePhoto: 'Chụp ảnh khảo sát',
    scanRock: 'Phân tích mẫu đá',
    transmitData: 'Truyền dữ liệu',
    batteryLevel: 'Mức pin',
    solarStatus: 'Bức xạ Mặt Trời',
    samplesCollected: 'Mẫu đã phân tích',
    photosTaken: 'Ảnh đã thu',
    commsLink: 'Liên kết trạm',

    // Repair Workshop
    repairTitle: 'Trạm Chẩn Đoán & Sửa Chữa Kỹ Thuật',
    repairSubtitle: 'Kiểm tra chất lượng linh kiện, đấu nối lại hệ thống và chạy thử trước khi vận hành.',
    symptomLabel: 'Dấu hiệu ghi nhận:',
    hypothesisPrompt: 'Bạn hãy chọn phương án khắc phục phù hợp:',
    selectFix: 'Chọn phương án xử lý:',
    runDiagnostics: 'Kiểm tra và xác nhận sửa chữa',
    fixSuccess: 'Bạn đã khôi phục thành công hệ thống. Hãy kiểm tra lại các thông số trước khi vận hành.',
    fixFailed: 'Chưa đạt yêu cầu kỹ thuật. Bạn hãy kiểm tra lại nguyên nhân và thử phương án khác.',

    // Debrief
    debriefTitle: 'Báo Cáo Kết Quả Nhiệm Vụ',
    xpEarned: 'Điểm kinh nghiệm',
    badgeUnlocked: 'Đạt huy hiệu kỹ thuật mới!',
    reflectionTitle: 'Tổng Kết Kỹ Thuật',
    nextMission: 'Nhiệm vụ tiếp theo',
    replayMission: 'Làm lại nhiệm vụ',

    // AI Assistant NOVA
    novaGreeting: 'Chào bạn. Tôi là NOVA — Trợ lý Kỹ thuật. Bạn cần phân tích dữ liệu hay khắc phục sự cố gì?',
    askNovaPlaceholder: 'Nhập câu hỏi kỹ thuật cho NOVA...',
    novaSend: 'Gửi',
    novaThinking: 'NOVA đang phân tích dữ liệu...',
    quickQuestions: [
      'Làm sao tối ưu hóa ngân sách khi lắp linh kiện?',
      'Sự khác biệt giữa OLI-2 và TIRS-2 là gì?',
      'Vì sao hệ thống điện ảnh hưởng tới các phân hệ khác?',
      'Làm sao tránh vượt ngân sách khi sửa chữa?',
    ],
  },
  en: {
    // Brand & Header
    appName: 'NASA Technical Academy',
    appTagline: 'NASA Technical Academy – Aerospace Engineering Simulation',
    nasaChallengeNote: 'NASA Space Mission Simulation System',
    disclaimer: 'Educational aerospace engineering simulation for middle-school students.',

    // Navigation
    navLobby: 'Home',
    navMap: 'Missions',
    navDesign: 'Assembly Lab',
    navLaunch: 'Pre-Launch',
    navSim: 'Simulator',
    navRepair: 'Repair Bay',
    navNasa: 'NASA Data',
    navAchievements: 'Profile',

    // Age Modes
    modeJuniorTitle: 'Junior Engineer',
    modeJuniorAge: 'Foundation (Ages 11–12)',
    modeJuniorDesc: 'Visual missions, step-by-step troubleshooting, and core telemetry metrics.',
    modeEngineerTitle: 'Aerospace Engineer',
    modeEngineerAge: 'Advanced (Ages 13–15)',
    modeEngineerDesc: 'Power budget analysis, cost optimization, durability tradeoffs, and cascading faults.',

    // Cadet Profile
    cadetTitle: 'Student Engineering Profile',
    enterName: 'Enter your full name...',
    enterCallsign: 'Control Callsign (e.g., Orion-01)',
    chooseAvatar: 'Choose technical emblem',
    selectMode: 'Select learning track',
    startAdventure: 'Start Mission',
    level: 'Level',
    rank: 'Rank',
    xp: 'Experience Points',

    // NASA Badges
    badgeRealNasa: 'REAL NASA DATA',
    badgeNasaModel: 'NASA TECHNICAL MODEL',
    badgeSimData: 'SIMULATED DATA',

    // Stages
    stageDiscover: '1. Overview',
    stageDesign: '2. Assembly',
    stageResources: '3. Specs',
    stageLaunch: '4. Pre-Launch',
    stageSimulate: '5. Operations',
    stageRepair: '6. Repair',
    stageDebrief: '7. Report',

    // Design Lab
    categories: {
      chassis: 'Chassis',
      mobility: 'Drivetrain',
      camera: 'Optics & Cameras',
      antenna: 'Radio Comms',
      power: 'Power Source',
      battery: 'Battery Storage',
      science: 'Science Payload',
      thruster: 'Thrusters',
      computer: 'Flight Computer',
    },
    equipBtn: 'Install',
    removeBtn: 'Remove',
    equipped: 'Installed',
    slotEmpty: 'Empty',

    // Resource Bar
    budget: 'Budget',
    mass: 'Mass',
    powerBalance: 'Power Balance',
    batteryStorage: 'Battery',
    commsRange: 'Comms',
    scienceVal: 'Science Value',
    warningOverBudget: 'Exceeds authorized mission budget!',
    warningOverMass: 'Spacecraft exceeds launch mass limit!',
    warningPowerDeficit: 'Power generation is lower than demand!',
    readyToLaunch: 'Configuration verified! Ready for deployment check.',

    // Simulator
    simulatorControls: 'Perseverance Mars Operations Console',
    driveTip: 'Use arrow keys / WASD or the on-screen joystick to navigate to targets.',
    takePhoto: 'Capture Photo',
    scanRock: 'Analyze Rock Sample',
    transmitData: 'Transmit Data',
    batteryLevel: 'Battery Level',
    solarStatus: 'Solar Irradiance',
    samplesCollected: 'Samples Analyzed',
    photosTaken: 'Photos Captured',
    commsLink: 'Station Link',

    // Repair Workshop
    repairTitle: 'Diagnostic & Technical Repair Bay',
    repairSubtitle: 'Inspect component health, rewire subsystems, and run pre-deployment checks.',
    symptomLabel: 'Recorded symptom:',
    hypothesisPrompt: 'Select the most appropriate corrective action:',
    selectFix: 'Select repair action:',
    runDiagnostics: 'Verify and Apply Repair',
    fixSuccess: 'System restored successfully. Verify parameters before returning to operations.',
    fixFailed: 'Requirements not met yet. Review root cause and adjust your fix.',

    // Debrief
    debriefTitle: 'Mission Evaluation Report',
    xpEarned: 'Experience Points',
    badgeUnlocked: 'New Technical Badge Unlocked!',
    reflectionTitle: 'Engineering Summary',
    nextMission: 'Next Mission',
    replayMission: 'Replay Mission',

    // AI Assistant NOVA
    novaGreeting: 'Hello. I am NOVA — Technical Assistant. What telemetry or fault would you like to analyze?',
    askNovaPlaceholder: 'Ask NOVA a technical question...',
    novaSend: 'Send',
    novaThinking: 'NOVA is analyzing telemetry...',
    quickQuestions: [
      'How do I optimize part costs within budget?',
      'What is the difference between OLI-2 and TIRS-2?',
      'Why does the power subsystem affect other units?',
      'How can I avoid exceeding the repair budget?',
    ],
  },
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.vi;
}

export function getDifficultyText(
  level: 1 | 2 | 3 | 4,
  lang: Language
): { title: string; subtitle: string } {
  if (lang === 'en') {
    switch (level) {
      case 1:
        return {
          title: 'Level 1: Orientation',
          subtitle: '1 clear fault · Generous budget · Guided diagnosis',
        };
      case 2:
        return {
          title: 'Level 2: Technician',
          subtitle: 'Multiple symptoms · Pinpoint root fault · Balanced budget',
        };
      case 3:
        return {
          title: 'Level 3: Engineer',
          subtitle: 'Cascading faults · Balance price vs durability · Tight planning',
        };
      case 4:
        return {
          title: 'Level 4: Specialist',
          subtitle: 'Concurrent failures · Strict budget · High operational stress',
        };
    }
  }
  switch (level) {
    case 1:
      return {
        title: 'Cấp 1: Làm quen',
        subtitle: '1 lỗi rõ ràng · Ngân sách thoải mái · Dễ phân tích',
      };
    case 2:
      return {
        title: 'Cấp 2: Kỹ thuật viên',
        subtitle: 'Nhiều triệu chứng · Phân biệt đúng bộ phận lỗi · Ngân sách vừa phải',
      };
    case 3:
      return {
        title: 'Cấp 3: Kỹ sư',
        subtitle: 'Lỗi dây chuyền · Cân nhắc giá và độ bền · Cần lập kế hoạch',
      };
    case 4:
      return {
        title: 'Cấp 4: Chuyên gia',
        subtitle: 'Nhiều sự cố đồng thời · Ngân sách eo hẹp · Rủi ro dài hạn',
      };
  }
}

export function getPartTierText(
  tier: 'economy' | 'standard' | 'premium',
  lang: Language
): string {
  if (lang === 'en') {
    if (tier === 'economy') return 'Economy';
    if (tier === 'standard') return 'Standard';
    return 'Premium';
  }
  if (tier === 'economy') return 'Tiết kiệm';
  if (tier === 'standard') return 'Tiêu chuẩn';
  return 'Cao cấp';
}
