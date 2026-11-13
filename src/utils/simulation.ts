import { AgeMode, Language, MissionConfig, MissionDesign, ResourceSummary } from '../types/game';

export function calculateResources(
  design: MissionDesign,
  mission: MissionConfig,
  ageMode: AgeMode,
  lang: Language
): ResourceSummary {
  const isVi = lang === 'vi';
  const components = Object.values(design).filter(Boolean);

  let totalMass = 0;
  let totalCost = 0;
  let totalPowerDraw = 0;
  let totalPowerGen = 0;
  let totalBattery = 0;
  let totalScience = 0;
  let commsScore = 0;

  for (const c of components) {
    if (!c) continue;
    totalMass += c.massKg || 0;
    totalCost += c.costK || 0;
    totalPowerDraw += c.powerDrawW || 0;
    totalPowerGen += c.powerGenW || 0;
    totalBattery += c.batteryCapacityWh || 0;
    totalScience += c.scienceValue || 0;

    if (c.category === 'antenna') {
      if (c.id === 'antenna_hga_dish') commsScore = 95;
      else if (c.id === 'antenna_uhf_relay') commsScore = 80;
      else commsScore = 40;
    }
  }

  const maxBudget = mission.budgetMax[ageMode];
  const maxMass = mission.massMax[ageMode];
  const netPower = totalPowerGen - totalPowerDraw;

  const issues: { vi: string; en: string }[] = [];

  // Core compatibility checks
  if (!design.chassis) {
    issues.push({
      vi: 'Chưa có Khung Thân chính để gắn kết các linh kiện!',
      en: 'Missing primary Chassis frame to mount components!',
    });
  }

  if (mission.id === 'mission_01_mars_rover' && !design.mobility) {
    issues.push({
      vi: 'Robot Sao Hỏa cần có Bánh Xe để di chuyển vượt địa hình!',
      en: 'Mars Rover requires Mobility / Wheels to traverse the terrain!',
    });
  }

  if (!design.power) {
    issues.push({
      vi: 'Chưa trang bị Nguồn Điện (Pin Mặt Trời hoặc Máy Phát MMRTG)!',
      en: 'Missing primary Power Source (Solar Array or MMRTG Generator)!',
    });
  }

  if (!design.battery) {
    issues.push({
      vi: 'Chưa có Pin Lưu Trữ để giữ điện trong bóng tối hoặc khi tải nặng!',
      en: 'Missing Battery storage to sustain operations during shadow or peak loads!',
    });
  }

  if (!design.antenna) {
    issues.push({
      vi: 'Chưa có Anten liên lạc để truyền dữ liệu khoa học về Trái Đất!',
      en: 'Missing Communications Antenna to transmit scientific telemetry back to Earth!',
    });
  }

  if (!design.camera && mission.id === 'mission_01_mars_rover') {
    issues.push({
      vi: 'Robot chưa có Camera để chụp ảnh địa chất và phát hiện chướng ngại vật!',
      en: 'Rover lacks Cameras to photograph geological layers and detect terrain hazards!',
    });
  }

  if (totalCost > maxBudget) {
    issues.push({
      vi: `Vượt quá ngân sách ${totalCost - maxBudget}k $! Hãy đổi sang linh kiện kinh tế hơn.`,
      en: `Exceeds mission budget by $${totalCost - maxBudget}k! Select more economical parts.`,
    });
  }

  if (totalMass > maxMass) {
    issues.push({
      vi: `Tàu quá nặng (vượt ${totalMass - maxMass} kg)! Tên lửa không thể phóng tới Sao Hỏa.`,
      en: `Spacecraft too heavy (exceeds limit by ${totalMass - maxMass} kg)! Rocket payload capacity exceeded.`,
    });
  }

  if (netPower < -30 && ageMode === 'engineer') {
    issues.push({
      vi: `Thâm hụt điện năng (${netPower}W)! Tàu sẽ nhanh chóng cạn kiệt pin trong vài giờ.`,
      en: `Power deficit (${netPower}W)! Batteries will drain rapidly under continuous load.`,
    });
  }

  const isCompatible = issues.length === 0;

  return {
    totalMass,
    maxMass,
    totalCost,
    maxBudget,
    netPower,
    totalBattery,
    totalScience,
    commsScore,
    isCompatible,
    issues,
  };
}
