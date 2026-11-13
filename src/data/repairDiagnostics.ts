import { MissionId } from '../types/game';

export type PartQualityStatus = 'good' | 'medium' | 'poor' | 'incompatible';
export type SafetyCheckState = 'READY' | 'WARNING' | 'FAILED';
export type DeployOutcome = 'success' | 'partial' | 'failed';

export interface RepairCandidatePart {
  id: string;
  slotId: string;
  name: { vi: string; en: string };
  shortNote: { vi: string; en: string };
  quality: PartQualityStatus;
  compatibilityOk: boolean;
  safetyFitOk: boolean;
  compatibilityNote: { vi: string; en: string };
  qualityNote: { vi: string; en: string };
  safetyNote: { vi: string; en: string };
  visualEffect: 'clear' | 'blur' | 'signal_drop' | 'power_flicker' | 'jitter' | 'incompatible_stop';
  symptomWhenUsed: { vi: string; en: string };
  causeShort: { vi: string; en: string };
}

export interface RepairSlotDefinition {
  slotId: string;
  slotLabel: { vi: string; en: string };
  icon: 'Camera' | 'Radio' | 'Zap' | 'BatteryCharging' | 'Wrench' | 'Compass' | 'Sun';
  hotspotCoords: { x: number; y: number };
  locationHint: { vi: string; en: string };
  referencePhotoUrl: string;
  referencePhotoKind: 'real_photo' | 'technical_diagram';
  isFaultyInitially: boolean;
  initialPartId: string;
  parts: RepairCandidatePart[];
}

export interface MissionRepairScenario {
  missionId: MissionId;
  equipmentTitle: { vi: string; en: string };
  previewImageUrl: string;
  previewMediaKind?: 'real_photo' | 'technical_diagram';
  fallbackImageUrl: string;
  observedSymptom: { vi: string; en: string };
  clueHint: { vi: string; en: string };
  slots: RepairSlotDefinition[];
}

export const MISSION_REPAIR_SCENARIOS: Record<MissionId, MissionRepairScenario> = {
  mission_01_mars_rover: {
    missionId: 'mission_01_mars_rover',
    equipmentTitle: {
      vi: 'Robot Tự Hành Perseverance',
      en: 'Perseverance Mars Rover',
    },
    previewImageUrl: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
    previewMediaKind: 'real_photo',
    fallbackImageUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
    observedSymptom: {
      vi: 'Dấu hiệu quan sát: Robot không gửi được hình ảnh từ sao Hỏa về Trái Đất, và bức ảnh thử nghiệm lưu trong máy bị mờ nhòe.',
      en: 'Observed clue: The rover cannot send Mars photos back to Earth, and test images appear blurry.',
    },
    clueHint: {
      vi: 'Gợi ý suy luận: Hãy kiểm tra bộ phận chụp ảnh và bộ phận gửi tín hiệu liên lạc!',
      en: 'Think carefully: Which parts take photos and send signals back to Earth?',
    },
    slots: [
      {
        slotId: 'm1_camera',
        slotLabel: { vi: 'Đôi mắt Camera', en: 'Camera Eyes' },
        icon: 'Camera',
        hotspotCoords: { x: 56, y: 24 },
        locationHint: {
          vi: 'Gắn trên đỉnh cột cổ cao phía đầu xe',
          en: 'Mounted atop the front tall mast',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/PIA23266/PIA23266~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm1_cam_poor',
        parts: [
          {
            id: 'm1_cam_good',
            slotId: 'm1_camera',
            name: { vi: 'Camera Mastcam-Z Chuẩn Sao Hỏa', en: 'Mars-Grade Mastcam-Z' },
            shortNote: {
              vi: 'Ống kính chống bụi tốt, ảnh màu rõ nét.',
              en: 'Dust-sealed optical lens for crisp color photos.',
            },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp 100% với cột camera Perseverance', en: 'Matches Perseverance mast mount' },
            qualityNote: { vi: 'Ống kính sạch, cảm biến nhạy sáng tốt', en: 'Clean glass, crisp sensor response' },
            safetyNote: { vi: 'Khóa ngàm chống rung đạt chuẩn', en: 'Vibration lock verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Camera chụp ảnh rõ nét.', en: 'Camera captures clear photos.' },
            causeShort: { vi: 'Linh kiện hoạt động ổn định.', en: 'Component works smoothly.' },
          },
          {
            id: 'm1_cam_medium',
            slotId: 'm1_camera',
            name: { vi: 'Camera Thử Nghiệm Tầm Gần', en: 'Basic Test Camera' },
            shortNote: {
              vi: 'Chụp được lúc mới bật nhưng dễ mờ khi có gió bụi.',
              en: 'Works at first, can blur when dust blows.',
            },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Lắp vừa khe gắn trên cột camera', en: 'Fits the camera mast slot' },
            qualityNote: { vi: 'Chất lượng trung bình — lớp phủ chống bụi mỏng', en: 'Medium quality — thin dust seal' },
            safetyNote: { vi: 'An toàn cơ bản, có thể lệch nét khi chạy lâu', en: 'Basic fit; may drift during long runs' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Lúc đầu chụp bình thường, sau vài giây ảnh bắt đầu hơi mờ.',
              en: 'Sharp at startup, then slightly blurry under test load.',
            },
            causeShort: {
              vi: 'Linh kiện chất lượng trung bình bị bám bụi nhẹ làm giảm độ nét.',
              en: 'Medium-quality lens lost focus slightly during continuous operation.',
            },
          },
          {
            id: 'm1_cam_poor',
            slotId: 'm1_camera',
            name: { vi: 'Camera Cũ Bị Xước Kính', en: 'Scratched Legacy Camera' },
            shortNote: {
              vi: 'Mặt kính mờ đục, hình ảnh bị nhòe.',
              en: 'Cloudy lens glass causes blurry frames.',
            },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Gắn được vào robot nhưng đời rất cũ', en: 'Fits physically, outdated model' },
            qualityNote: { vi: 'Chất lượng kém — mặt kính bị mờ xước', en: 'Poor quality — scratched front glass' },
            safetyNote: { vi: 'Chưa đạt yêu cầu quan sát an toàn', en: 'Below visual navigation safety standard' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Hình ảnh thu được từ sao Hỏa bị mờ, không nhìn rõ đá!',
              en: 'Captured Mars images are blurry and unclear!',
            },
            causeShort: {
              vi: 'Lắp camera kém chất lượng khiến ánh sáng bị tán xạ gây mờ ảnh.',
              en: 'Low-quality scratched lens blurred the camera image.',
            },
          },
          {
            id: 'm1_cam_incompat',
            slotId: 'm1_camera',
            name: { vi: 'Ống Kính Kính Hiển Vi Phòng Thí Nghiệm', en: 'Indoor Lab Microscope Lens' },
            shortNote: {
              vi: 'Chỉ dùng trong nhà ấm, không chịu được lạnh sao Hỏa.',
              en: 'Built for warm indoor labs, not freezing Mars.',
            },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích cổng kết nối và môi trường sao Hỏa', en: 'Incompatible connector & Mars climate' },
            qualityNote: { vi: 'Không dùng được cho nhiệm vụ ngoài trời', en: 'Unsuitable outside indoor labs' },
            safetyNote: { vi: 'Không khóa chặt vào khung robot', en: 'Does not lock into rover frame' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Xuất hiện cảnh báo đỏ: Robot không nhận diện được camera!',
              en: 'Red alert: Rover computer cannot recognize this lens!',
            },
            causeShort: {
              vi: 'Lắp linh kiện không tương thích khiến hệ thống camera báo lỗi.',
              en: 'Incompatible indoor microscope cannot connect to Mars rover.',
            },
          },
        ],
      },
      {
        slotId: 'm1_comms',
        slotLabel: { vi: 'Ăng-ten Liên Lạc', en: 'Comms Antenna' },
        icon: 'Radio',
        hotspotCoords: { x: 37, y: 48 },
        locationHint: {
          vi: 'Đặt trên lưng thân robot phía sau cột camera',
          en: 'Mounted on top deck behind the mast',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/PIA24045/PIA24045~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm1_comms_incompat',
        parts: [
          {
            id: 'm1_comms_good',
            slotId: 'm1_comms',
            name: { vi: 'Ăng-ten Định Hướng Cao HGA', en: 'Deep-Space High-Gain Antenna' },
            shortNote: {
              vi: 'Gửi ảnh rõ ràng xuyên không gian về Trái Đất.',
              en: 'Sends crisp images all the way to Earth.',
            },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Chuẩn liên lạc NASA Deep Space Network', en: 'NASA Deep Space Network compatible' },
            qualityNote: { vi: 'Sóng khỏe, truyền dữ liệu ổn định', en: 'Strong signal and steady transmission' },
            safetyNote: { vi: 'Khóa khớp xoay hướng an toàn', en: 'Safe gimbal lock verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Tín hiệu về Trái Đất ổn định.', en: 'Earth communication link steady.' },
            causeShort: { vi: 'Bộ phận liên lạc tốt.', en: 'Comms module healthy.' },
          },
          {
            id: 'm1_comms_medium',
            slotId: 'm1_comms',
            name: { vi: 'Ăng-ten Dự Phòng Sóng Vừa', en: 'Mid-Range Backup Antenna' },
            shortNote: {
              vi: 'Gửi tin nhắn ngắn được, gửi ảnh lớn hay chập chờn.',
              en: 'Handles short pings, flickers on large photos.',
            },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Tương thích tần số liên lạc tầm trung', en: 'Compatible mid-band radio frequency' },
            qualityNote: { vi: 'Trung bình — tốc độ gửi dữ liệu chậm', en: 'Medium — slower data transmission' },
            safetyNote: { vi: 'An toàn cơ bản nhưng dễ hụt sóng khi gửi ảnh lớn', en: 'Safe for telemetry, unstable for heavy photos' },
            visualEffect: 'signal_drop',
            symptomWhenUsed: {
              vi: 'Kết nối được lúc đầu rồi tín hiệu chập chờn khi truyền ảnh lớn.',
              en: 'Connected at first, then signal flickered during heavy photo upload.',
            },
            causeShort: {
              vi: 'Ăng-ten chất lượng trung bình thiếu băng thông để gửi ảnh liên tục.',
              en: 'Medium-grade antenna struggled with continuous image upload.',
            },
          },
          {
            id: 'm1_comms_poor',
            slotId: 'm1_comms',
            name: { vi: 'Ăng-ten Cong Vênh Mất Sóng', en: 'Bent Signal Antenna' },
            shortNote: {
              vi: 'Thanh thu phát bị cong, sóng rất yếu.',
              en: 'Bent dish rim weakens signal.',
            },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng đầu cắm nhưng vỏ anten bị móp', en: 'Matching plug but dented dish' },
            qualityNote: { vi: 'Kém — sóng bị nhiễu và yếu', en: 'Poor — noisy, weak signal' },
            safetyNote: { vi: 'Không đảm bảo liên lạc với Trái Đất', en: 'Fails reliable Earth link requirement' },
            visualEffect: 'signal_drop',
            symptomWhenUsed: {
              vi: 'Robot mất kết nối giữa chừng, không gửi hết ảnh về được.',
              en: 'Rover lost connection mid-transfer.',
            },
            causeShort: {
              vi: 'Ăng-ten kém chất lượng không giữ nổi đường truyền về Trái Đất.',
              en: 'Damaged low-quality antenna dropped the Earth link.',
            },
          },
          {
            id: 'm1_comms_incompat',
            slotId: 'm1_comms',
            name: { vi: 'Bộ Phát Wi-Fi Trong Nhà', en: 'Home Indoor Wi-Fi Router' },
            shortNote: {
              vi: 'Chỉ phát vài mét trong phòng, không tới được Trái Đất.',
              en: 'Only reaches across a room, never across space.',
            },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích liên lạc liên hành tinh', en: 'Incompatible with space communication' },
            qualityNote: { vi: 'Không thể truyền tín hiệu vượt không gian', en: 'Cannot reach Earth or Mars orbiters' },
            safetyNote: { vi: 'Cổng nguồn và tần số sai chuẩn', en: 'Wrong voltage and frequency' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Thiết bị mất kết nối hoàn toàn, trạm mặt đất không thấy tín hiệu!',
              en: 'Complete communication loss with Earth!',
            },
            causeShort: {
              vi: 'Lắp bộ phận liên lạc không tương thích nên robot mất kết nối.',
              en: 'Incompatible indoor Wi-Fi module cannot communicate across space.',
            },
          },
        ],
      },
      {
        slotId: 'm1_power',
        slotLabel: { vi: 'Nguồn Năng Lượng', en: 'Power Source' },
        icon: 'Zap',
        hotspotCoords: { x: 26, y: 58 },
        locationHint: {
          vi: 'Gắn nghiêng ở phần đuôi phía sau xe',
          en: 'Mounted sloped at the rear tail',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/PIA24233/PIA24233~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: false,
        initialPartId: 'm1_power_good',
        parts: [
          {
            id: 'm1_power_good',
            slotId: 'm1_power',
            name: { vi: 'Pin Nhiệt Hạt Nhân MMRTG', en: 'All-Weather MMRTG Power' },
            shortNote: {
              vi: 'Cấp điện khỏe ngày đêm, không sợ bão bụi.',
              en: 'Steady day-and-night power even in dust storms.',
            },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Nguồn điện chuẩn của robot Perseverance', en: 'Standard Perseverance power unit' },
            qualityNote: { vi: 'Cấp điện ổn định 24/7', en: 'Steady 24/7 power delivery' },
            safetyNote: { vi: 'Cách nhiệt và bảo vệ chuẩn NASA', en: 'Thermal & radiation shielding verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Nguồn điện dồi dào, ổn định.', en: 'Power steady across all systems.' },
            causeShort: { vi: 'Bộ nguồn hoạt động hoàn hảo.', en: 'Power supply works properly.' },
          },
          {
            id: 'm1_power_medium',
            slotId: 'm1_power',
            name: { vi: 'Tấm Pin Mặt Trời Nhỏ', en: 'Small Solar Panel' },
            shortNote: {
              vi: 'Đủ điện ban ngày, yếu đi khi trời nhiều bụi.',
              en: 'Enough power in sun, weakens in Martian dust.',
            },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Gắn được lên lưng robot', en: 'Mounts onto rover deck' },
            qualityNote: { vi: 'Trung bình — điện áp sụt khi có bụi', en: 'Medium — power drops in dust' },
            safetyNote: { vi: 'Đạt mức an toàn cơ bản khi nắng đẹp', en: 'Basic safety in clear skies' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Bụi bay nhẹ làm điện áp giảm, vài cảm biến phải tạm nghỉ.',
              en: 'Light dust reduced voltage, dimming secondary sensors.',
            },
            causeShort: {
              vi: 'Nguồn năng lượng trung bình không đủ mạnh khi gặp bụi sao Hỏa.',
              en: 'Small solar panel lost power when dust covered it.',
            },
          },
          {
            id: 'm1_power_poor',
            slotId: 'm1_power',
            name: { vi: 'Pin Cũ Chai Điện Áp Thấp', en: 'Degraded Low-Volt Battery' },
            shortNote: {
              vi: 'Sụt điện nhanh, máy ảnh khó khởi động.',
              en: 'Drains fast; science cameras struggle to boot.',
            },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Vừa khay pin nhưng dung lượng suy giảm nặng', en: 'Fits bay, badly degraded capacity' },
            qualityNote: { vi: 'Kém — điện sụt rất nhanh', en: 'Poor — severe voltage drop' },
            safetyNote: { vi: 'Không đủ điện dự phòng an toàn', en: 'Unsafe power reserve margin' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Một số hệ thống như camera và laser không thể khởi động!',
              en: 'Cameras and laser could not start up!',
            },
            causeShort: {
              vi: 'Nguồn điện kém không đủ sức bật các bộ phận khoa học.',
              en: 'Weak power source prevented science instruments from booting.',
            },
          },
          {
            id: 'm1_power_incompat',
            slotId: 'm1_power',
            name: { vi: 'Pin Đồ Chơi Dân Dụng 9V', en: 'Household Toy Battery' },
            shortNote: {
              vi: 'Quá yếu, không khởi động được robot vũ trụ.',
              en: 'Way too weak for a Mars rover.',
            },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Sai hoàn toàn điện áp và đầu nối', en: 'Wrong voltage & connector' },
            qualityNote: { vi: 'Không dùng được cho thiết bị không gian', en: 'Not space-rated' },
            safetyNote: { vi: 'Không an toàn trong nhiệt độ lạnh -80°C', en: 'Freezes in -80°C Martian nights' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo nguồn điện không phù hợp: Robot không thể khởi động!',
              en: 'Power mismatch alert: Rover systems could not start!',
            },
            causeShort: {
              vi: 'Lắp bộ phận cung cấp năng lượng không phù hợp nên hệ thống không khởi động được.',
              en: 'Incompatible power pack prevented spacecraft startup.',
            },
          },
        ],
      },
    ],
  },

  mission_02_earth_satellite: {
    missionId: 'mission_02_earth_satellite',
    equipmentTitle: {
      vi: 'Vệ Tinh Landsat 9',
      en: 'Landsat 9 Satellite',
    },
    previewImageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/2023/09/L9-Stills-Cover-3.png',
    previewMediaKind: 'technical_diagram',
    fallbackImageUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
    observedSymptom: {
      vi: 'Dấu hiệu quan sát: Vệ tinh chụp ảnh rừng và biển trên Trái Đất bị mờ không rõ nét, đồng thời mức điện trên vệ tinh tụt nhanh.',
      en: 'Observed clue: Earth forest and ocean images are blurry, and satellite power is slowly draining.',
    },
    clueHint: {
      vi: 'Gợi ý suy luận: Hãy kiểm tra máy ảnh nhìn Trái Đất và đôi cánh pin Mặt Trời!',
      en: 'Think carefully: Inspect the Earth camera and the solar power wings!',
    },
    slots: [
      {
        slotId: 'm2_camera',
        slotLabel: { vi: 'Máy Ảnh Chụp Trái Đất', en: 'Earth Camera (OLI-2)' },
        icon: 'Camera',
        hotspotCoords: { x: 56, y: 55 },
        locationHint: {
          vi: 'Khoang quang học hướng thẳng xuống Trái Đất',
          en: 'Earth-facing underside optical bay',
        },
        referencePhotoUrl:
          'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/09/oli2atballpic-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm2_cam_poor',
        parts: [
          {
            id: 'm2_cam_good',
            slotId: 'm2_camera',
            name: { vi: 'Máy Ảnh Đa Phổ OLI-2 Chuẩn NASA', en: 'NASA OLI-2 Multispectral Imager' },
            shortNote: { vi: 'Chụp rõ từng khu rừng, sông hồ và bờ biển.', en: 'Crisp imagery of forests, rivers, and coasts.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Tương thích hoàn hảo với thân vệ tinh Landsat 9', en: 'Designed for Landsat 9 payload bay' },
            qualityNote: { vi: 'Tốt — độ nét cao, màu sắc trung thực', en: 'Good — razor-sharp multispectral resolution' },
            safetyNote: { vi: 'Che chắn ánh nắng chói đạt chuẩn', en: 'Sun baffle protection verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Ảnh chụp Trái Đất rõ đẹp.', en: 'Earth photos are crystal clear.' },
            causeShort: { vi: 'Máy ảnh hoạt động bình thường.', en: 'Imager healthy.' },
          },
          {
            id: 'm2_cam_medium',
            slotId: 'm2_camera',
            name: { vi: 'Ống Kính Thời Tiết Cũ', en: 'Older Weather Lens' },
            shortNote: { vi: 'Chụp được mây lớn nhưng vùng rừng nhỏ hơi nhòe.', en: 'Sees big clouds, small forests blur slightly.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Lắp vừa khoang quang học', en: 'Fits optical bay' },
            qualityNote: { vi: 'Trung bình — độ sắc nét giảm khi phóng to', en: 'Medium — softens at fine zoom' },
            safetyNote: { vi: 'Ổn định cơ bản, chưa đạt độ nét tối đa', en: 'Safe mount; below ideal clarity' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Chụp được Trái Đất nhưng khi phóng to xem rừng cây thì hơi mờ.',
              en: 'Captured Earth, but forest close-ups look slightly fuzzy.',
            },
            causeShort: {
              vi: 'Ống kính chất lượng trung bình chưa đủ nét để quan sát chi tiết rừng.',
              en: 'Medium-grade optics lacked sharp forest detail.',
            },
          },
          {
            id: 'm2_cam_poor',
            slotId: 'm2_camera',
            name: { vi: 'Cảm Biến Lệch Tiêu Cự', en: 'Out-of-Focus Sensor' },
            shortNote: { vi: 'Hình ảnh thu về nhòe hẳn, không phân biệt được đất và nước.', en: 'Everything looks hazy and smeared.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Khớp kích thước nhưng lệch trục quang học', en: 'Fits bay, optical alignment off' },
            qualityNote: { vi: 'Kém — ảnh nhòe không đạt yêu cầu', en: 'Poor — unusable blurry frames' },
            safetyNote: { vi: 'Không đạt chuẩn kiểm tra trước vận hành', en: 'Failed optical calibration check' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Vệ tinh chụp ảnh không rõ, các vùng rừng và biển hòa lẫn vào nhau.',
              en: 'Satellite images are blurry; land and water cannot be told apart.',
            },
            causeShort: {
              vi: 'Cảm biến kém chất lượng bị lệch tiêu cự làm mờ ảnh.',
              en: 'Out-of-focus camera caused blurry Earth photos.',
            },
          },
          {
            id: 'm2_cam_incompat',
            slotId: 'm2_camera',
            name: { vi: 'Đèn Pin Quét Mặt Đất', en: 'Ground Flashlight Module' },
            shortNote: { vi: 'Không phải máy ảnh vệ tinh!', en: 'Not an orbital camera at all!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Sai hoàn toàn chức năng và cổng dữ liệu', en: 'Wrong device type & connector' },
            qualityNote: { vi: 'Không chụp được ảnh', en: 'Cannot capture imagery' },
            safetyNote: { vi: 'Gây báo lỗi hệ thống gắn kết', en: 'Triggers payload mismatch alarm' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo: Thiết bị gắn sai linh kiện, không thể chụp ảnh Trái Đất!',
              en: 'Warning: Wrong part installed, cannot capture Earth imagery!',
            },
            causeShort: {
              vi: 'Lắp sai linh kiện cho khoang máy ảnh vệ tinh.',
              en: 'Incompatible part installed in Earth camera bay.',
            },
          },
        ],
      },
      {
        slotId: 'm2_solar',
        slotLabel: { vi: 'Cánh Pin Mặt Trời', en: 'Solar Power Wings' },
        icon: 'Sun',
        hotspotCoords: { x: 78, y: 32 },
        locationHint: {
          vi: 'Cánh pin dài vươn ra phía ngoài đón nắng',
          en: 'Extended wing panel catching sunlight',
        },
        referencePhotoUrl:
          'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/landsat-9-mission-page/L9-sketch-thumbnail_rotated.png',
        referencePhotoKind: 'technical_diagram',
        isFaultyInitially: true,
        initialPartId: 'm2_solar_poor',
        parts: [
          {
            id: 'm2_solar_good',
            slotId: 'm2_solar',
            name: { vi: 'Cánh Pin Hiệu Suất Cao Landsat 9', en: 'Landsat 9 High-Efficiency Solar Array' },
            shortNote: { vi: 'Tạo điện ổn định suốt vòng bay quanh Trái Đất.', en: 'Generates reliable power all around orbit.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp chuẩn bản lề vệ tinh Landsat', en: 'Standard Landsat hinge mount' },
            qualityNote: { vi: 'Tốt — hiệu suất chuyển nắng thành điện cao', en: 'Good — high solar conversion rate' },
            safetyNote: { vi: 'Khóa bung cánh an toàn ngoài quỹ đạo', en: 'Orbital deployment lock verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Pin vệ tinh luôn đầy đủ.', en: 'Satellite power stays strong.' },
            causeShort: { vi: 'Cánh pin hoạt động tốt.', en: 'Solar array works well.' },
          },
          {
            id: 'm2_solar_medium',
            slotId: 'm2_solar',
            name: { vi: 'Tấm Pin Vệ Tinh Đời Cũ', en: 'Aging Solar Wing' },
            shortNote: { vi: 'Đủ điện ban đầu, yếu nhẹ khi vào bóng râm.', en: 'Adequate in sun, dips near shadow edge.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa ngàm gắn bên hông vệ tinh', en: 'Fits side wing mount' },
            qualityNote: { vi: 'Trung bình — tế bào quang điện hơi cũ', en: 'Medium — slightly aged cells' },
            safetyNote: { vi: 'An toàn nhưng điện dự phòng ít', en: 'Safe but slim power margin' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Lúc đầu đủ điện, lúc bay gần rìa tối công suất điện chập chờn.',
              en: 'Good initially, then power dipped near Earth shadow.',
            },
            causeShort: {
              vi: 'Tấm pin trung bình tạo ít điện hơn nhu cầu tải tối đa.',
              en: 'Medium solar panel produced marginal reserve power.',
            },
          },
          {
            id: 'm2_solar_poor',
            slotId: 'm2_solar',
            name: { vi: 'Tấm Pin Nứt Tế Bào Quang Điện', en: 'Cracked Solar Panel' },
            shortNote: { vi: 'Không đủ điện bật máy ảnh và ăng-ten.', en: 'Not enough electricity for full mission.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Lắp vừa nhưng mạch điện bị hở nhẹ', en: 'Fits mount, weakened solar circuit' },
            qualityNote: { vi: 'Kém — tạo rất ít điện', en: 'Poor — low power output' },
            safetyNote: { vi: 'Không đảm bảo an toàn năng lượng', en: 'Below mission power threshold' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Điện trên vệ tinh tụt nhanh, máy ảnh bị tắt tạm thời!',
              en: 'Power dropped quickly; camera shut off!',
            },
            causeShort: {
              vi: 'Cánh pin kém chất lượng không cung cấp đủ điện.',
              en: 'Damaged solar wing failed to power the satellite.',
            },
          },
          {
            id: 'm2_solar_incompat',
            slotId: 'm2_solar',
            name: { vi: 'Bánh Xe Robot Mặt Đất', en: 'Ground Rover Wheel' },
            shortNote: { vi: 'Vệ tinh bay trên không không dùng bánh xe!', en: 'Orbiting satellites do not drive on wheels!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích với vệ tinh', en: 'Incompatible with spacecraft' },
            qualityNote: { vi: 'Không tạo ra điện', en: 'Generates zero power' },
            safetyNote: { vi: 'Mất cân bằng vệ tinh', en: 'Breaks spacecraft balance' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo đỏ: Vệ tinh không có điện để khởi động!',
              en: 'Red alert: Zero power generation detected!',
            },
            causeShort: {
              vi: 'Lắp sai linh kiện không phải tấm pin Mặt Trời.',
              en: 'Installed a non-power part on the solar array slot.',
            },
          },
        ],
      },
      {
        slotId: 'm2_antenna',
        slotLabel: { vi: 'Ăng-ten Gửi Ảnh', en: 'Downlink Antenna' },
        icon: 'Radio',
        hotspotCoords: { x: 47, y: 66 },
        locationHint: {
          vi: 'Cụm phát sóng dưới thân hướng về trạm mặt đất',
          en: 'Underside transmitter aiming down to ground stations',
        },
        referencePhotoUrl:
          'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/OLI2-TIRS-2.PNG',
        referencePhotoKind: 'technical_diagram',
        isFaultyInitially: false,
        initialPartId: 'm2_ant_good',
        parts: [
          {
            id: 'm2_ant_good',
            slotId: 'm2_antenna',
            name: { vi: 'Ăng-ten Băng Tần X/S Chuẩn USGS', en: 'USGS X/S-Band Downlink Antenna' },
            shortNote: { vi: 'Gửi ảnh Trái Đất nhanh và rõ về trạm.', en: 'Fast, reliable Earth imagery downlink.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp chuẩn vệ tinh Landsat 9', en: 'Landsat 9 telemetry compatible' },
            qualityNote: { vi: 'Tốt — đường truyền mượt mà', en: 'Good — clear data stream' },
            safetyNote: { vi: 'An toàn, không nhiễu sóng', en: 'Zero signal interference' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Ảnh gửi về trạm mặt đất nhanh chóng.', en: 'Photos beamed cleanly to Earth.' },
            causeShort: { vi: 'Ăng-ten hoạt động tốt.', en: 'Antenna healthy.' },
          },
          {
            id: 'm2_ant_medium',
            slotId: 'm2_antenna',
            name: { vi: 'Ăng-ten Tốc Độ Trung Bình', en: 'Moderate Speed Antenna' },
            shortNote: { vi: 'Truyền chậm, thỉnh thoảng rớt vài khung hình.', en: 'Slower downlink; occasional dropped frames.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa cổng dữ liệu vệ tinh', en: 'Fits telemetry port' },
            qualityNote: { vi: 'Trung bình — tốc độ truyền chậm', en: 'Medium — slower transfer rate' },
            safetyNote: { vi: 'An toàn cơ bản', en: 'Basic operational safety' },
            visualEffect: 'signal_drop',
            symptomWhenUsed: {
              vi: 'Ảnh tải về chậm và bị thiếu một góc nhỏ.',
              en: 'Download slowed down with a few missing packets.',
            },
            causeShort: {
              vi: 'Ăng-ten trung bình hơi chậm so với lượng ảnh lớn.',
              en: 'Medium downlink antenna lagged under full image size.',
            },
          },
          {
            id: 'm2_ant_poor',
            slotId: 'm2_antenna',
            name: { vi: 'Đầu Phát Nhiễu Sóng', en: 'Noisy Transmitter' },
            shortNote: { vi: 'Tín hiệu bị nhiễu nặng.', en: 'Heavy static ruins transmitted files.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Lắp vừa nhưng bộ lọc sóng hỏng', en: 'Fits slot, damaged filter' },
            qualityNote: { vi: 'Kém — tín hiệu bị nhiễu', en: 'Poor — heavy noise' },
            safetyNote: { vi: 'Không đạt chuẩn truyền dữ liệu', en: 'Fails downlink safety check' },
            visualEffect: 'signal_drop',
            symptomWhenUsed: {
              vi: 'Trạm mặt đất nhận được tín hiệu đứt quãng.',
              en: 'Ground station receives broken signals.',
            },
            causeShort: {
              vi: 'Bộ phát kém chất lượng làm đứt quãng đường truyền.',
              en: 'Noisy transmitter broke the photo transfer.',
            },
          },
          {
            id: 'm2_ant_incompat',
            slotId: 'm2_antenna',
            name: { vi: 'Loa Phát Thanh Mặt Đất', en: 'Ground Loudspeaker' },
            shortNote: { vi: 'Âm thanh không truyền được trong chân không vũ trụ!', en: 'Sound cannot travel through space vacuum!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích môi trường không gian', en: 'Cannot broadcast in vacuum' },
            qualityNote: { vi: 'Không gửi được dữ liệu', en: 'Zero data downlink' },
            safetyNote: { vi: 'Mất hoàn toàn liên lạc', en: 'Total link loss' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo mất kết nối hoàn toàn với vệ tinh!',
              en: 'Total satellite communication loss!',
            },
            causeShort: {
              vi: 'Không gian là chân không, loa không thể gửi tín hiệu về Trái Đất.',
              en: 'Incompatible loudspeaker cannot send radio data through space.',
            },
          },
        ],
      },
    ],
  },

  mission_03_space_station: {
    missionId: 'mission_03_space_station',
    equipmentTitle: {
      vi: 'Trạm Vũ Trụ Quốc Tế (ISS)',
      en: 'International Space Station (ISS)',
    },
    previewImageUrl: 'https://images-assets.nasa.gov/image/iss056e201248/iss056e201248~medium.jpg',
    previewMediaKind: 'real_photo',
    fallbackImageUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
    observedSymptom: {
      vi: 'Dấu hiệu quan sát: Hệ thống điện trên trạm vũ trụ hoạt động không ổn định; khi bay vào bóng tối, đèn phòng thí nghiệm bị nhấp nháy yếu dần.',
      en: 'Observed clue: Space station electrical power is unstable; lights flicker and dim during Earth eclipse.',
    },
    clueHint: {
      vi: 'Gợi ý suy luận: Hãy kiểm tra khối pin lưu trữ ban đêm và bộ chia điện ổn áp!',
      en: 'Think carefully: Which parts store night-time electricity and distribute steady voltage?',
    },
    slots: [
      {
        slotId: 'm3_solar',
        slotLabel: { vi: 'Cánh Pin Mặt Trời iROSA', en: 'ISS Solar Array Wings' },
        icon: 'Sun',
        hotspotCoords: { x: 78, y: 36 },
        locationHint: {
          vi: 'Các cánh pin vàng khổng lồ trải dài hai đầu khung giàn',
          en: 'Giant golden solar wings along the outer station truss',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/iss073e0850593/iss073e0850593~large.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: false,
        initialPartId: 'm3_solar_good',
        parts: [
          {
            id: 'm3_solar_good',
            slotId: 'm3_solar',
            name: { vi: 'Cánh Pin Mặt Trời Cuộn Mới iROSA', en: 'Upgraded iROSA Solar Wings' },
            shortNote: { vi: 'Thu nắng tạo điện dồi dào cho toàn trạm.', en: 'High-output solar wings power all station labs.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp khung giàn ISS', en: 'Matches ISS truss mount' },
            qualityNote: { vi: 'Tốt — hiệu suất phát điện tối đa', en: 'Good — peak power output' },
            safetyNote: { vi: 'An toàn cách điện cao', en: 'Insulated orbital mount' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Cánh pin tạo điện khỏe.', en: 'Solar wings generate plenty of electricity.' },
            causeShort: { vi: 'Cánh pin hoạt động ổn định.', en: 'Solar wings healthy.' },
          },
          {
            id: 'm3_solar_medium',
            slotId: 'm3_solar',
            name: { vi: 'Cánh Pin Cũ Giảm Công Suất', en: 'Older Worn Solar Wing' },
            shortNote: { vi: 'Đủ dùng cơ bản, hơi thiếu khi bật nhiều máy.', en: 'Powers basic rooms, dips at peak lab load.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa khung giàn ISS', en: 'Fits ISS truss slot' },
            qualityNote: { vi: 'Trung bình — công suất giảm nhẹ theo tuổi', en: 'Medium — reduced cell output' },
            safetyNote: { vi: 'Đủ an toàn khi tiết kiệm điện', en: 'Safe under moderate load' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: { vi: 'Ban ngày đủ điện, lúc nạp pin vào tối hơi chậm.', en: 'Charges slowly before night cycle.' },
            causeShort: { vi: 'Cánh pin cũ sạc chưa kịp đầy cho 45 phút ban đêm.', en: 'Aging solar wing charged too slowly.' },
          },
          {
            id: 'm3_solar_poor',
            slotId: 'm3_solar',
            name: { vi: 'Cánh Pin Kẹt Góc Quay', en: 'Stuck Sun-Tracking Wing' },
            shortNote: { vi: 'Không xoay theo Mặt Trời được.', en: 'Cannot rotate toward sunlight.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Khớp ngàm nhưng hỏng trục xoay', en: 'Fits mount, broken sun tracker' },
            qualityNote: { vi: 'Kém — thu được rất ít nắng', en: 'Poor — captures little sunlight' },
            safetyNote: { vi: 'Nguy cơ thiếu điện toàn trạm', en: 'Power shortfall risk' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: { vi: 'Trạm thiếu điện nạp vào giờ ban ngày.', en: 'Low solar charging during sunlight.' },
            causeShort: { vi: 'Cánh pin không hướng về Mặt Trời làm thiếu điện.', en: 'Stuck solar array lost sunlight angle.' },
          },
          {
            id: 'm3_solar_incompat',
            slotId: 'm3_solar',
            name: { vi: 'Cánh Quạt Gió Mặt Đất', en: 'Earth Wind Turbine Blade' },
            shortNote: { vi: 'Ngoài vũ trụ không có gió để quay cánh quạt!', en: 'There is no wind in outer space!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích môi trường chân không', en: 'Incompatible with vacuum of space' },
            qualityNote: { vi: 'Không tạo ra bất kỳ điện nào', en: 'Zero power in space' },
            safetyNote: { vi: 'Gây mất cân bằng cấu trúc', en: 'Unsafe structural attachment' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: { vi: 'Cảnh báo: Không tạo ra điện, trạm không thể vận hành!', en: 'Alert: Zero power produced!' },
            causeShort: { vi: 'Không gian không có gió nên cánh quạt gió không hoạt động.', en: 'Wind blades produce zero power in vacuum.' },
          },
        ],
      },
      {
        slotId: 'm3_battery',
        slotLabel: { vi: 'Pin Dự Trữ Ban Đêm', en: 'Night Storage Batteries' },
        icon: 'BatteryCharging',
        hotspotCoords: { x: 54, y: 46 },
        locationHint: {
          vi: 'Gắn trên giàn khung điện ngoài trạm vũ trụ',
          en: 'Seated inside the external truss power bay',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/05pd0995/05pd0995~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm3_bat_poor',
        parts: [
          {
            id: 'm3_bat_good',
            slotId: 'm3_battery',
            name: { vi: 'Khối Pin Li-Ion ISS Chuẩn NASA', en: 'NASA ISS Li-Ion Battery Bank' },
            shortNote: { vi: 'Giữ điện bền bỉ suốt 45 phút đêm tối.', en: 'Keeps lights & air steady through 45-minute eclipse.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Chuẩn trạm vũ trụ quốc tế ISS', en: 'ISS-certified orbital unit' },
            qualityNote: { vi: 'Tốt — trữ điện dồi dào, không sụt áp', en: 'Good — steady high capacity' },
            safetyNote: { vi: 'Chống quá nhiệt chuẩn an toàn phi hành đoàn', en: 'Crew thermal safety certified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Đèn và phòng thí nghiệm sáng ổn định cả ban đêm.', en: 'Station lights stay bright during eclipse.' },
            causeShort: { vi: 'Pin lưu trữ hoạt động tốt.', en: 'Battery bank healthy.' },
          },
          {
            id: 'm3_bat_medium',
            slotId: 'm3_battery',
            name: { vi: 'Pin Dự Phòng Dung Lượng Vừa', en: 'Mid-Capacity Backup Battery' },
            shortNote: { vi: 'Giữ đèn sáng lúc đầu, cuối đêm hơi yếu.', en: 'Holds early eclipse, dims near sunrise.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa khay pin ISS', en: 'Fits ISS battery rack' },
            qualityNote: { vi: 'Trung bình — hơi hụt điện ở nửa cuối vùng tối', en: 'Medium — weakens late in eclipse' },
            safetyNote: { vi: 'An toàn cơ bản, phải tắt bớt đèn phụ', en: 'Safe if auxiliary lights dim' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Nửa đầu vùng tối chạy bình thường, gần hết vùng tối đèn nhấp nháy nhẹ.',
              en: 'Steady at first, then flickered near the end of eclipse.',
            },
            causeShort: {
              vi: 'Pin chất lượng trung bình hơi nhỏ cho toàn bộ khoang thí nghiệm.',
              en: 'Medium battery lacked full reserve for late-night load.',
            },
          },
          {
            id: 'm3_bat_poor',
            slotId: 'm3_battery',
            name: { vi: 'Pin Cũ Chai Sụt Áp Nhanh', en: 'Degraded Old Battery Pack' },
            shortNote: { vi: 'Vào vùng tối là đèn nhấp nháy và tắt dần.', en: 'Drains fast as soon as station enters shadow.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng cỡ khay nhưng pin đã xuống cấp', en: 'Right rack size, worn-out cells' },
            qualityNote: { vi: 'Kém — tụt điện rất nhanh', en: 'Poor — rapid voltage drop' },
            safetyNote: { vi: 'Không đủ an toàn cho khoang sinh hoạt', en: 'Below crew power reserve safety' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Khi bay vào bóng tối, đèn trạm vũ trụ nhấp nháy và các máy tắt dần!',
              en: 'Lights flicker and lab racks power down in darkness!',
            },
            causeShort: {
              vi: 'Pin lưu trữ kém chất lượng không giữ nổi điện qua vùng tối.',
              en: 'Worn battery failed to sustain station power in eclipse.',
            },
          },
          {
            id: 'm3_bat_incompat',
            slotId: 'm3_battery',
            name: { vi: 'Ắc Quy Xe Máy Mặt Đất', en: 'Street Scooter Battery' },
            shortNote: { vi: 'Sai điện áp và không dùng được ngoài không gian.', en: 'Wrong voltage & unsafe in space vacuum.' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích lưới điện trạm ISS', en: 'Incompatible with ISS 120V bus' },
            qualityNote: { vi: 'Không dùng được cho tàu vũ trụ', en: 'Not rated for spaceflight' },
            safetyNote: { vi: 'Vi phạm nghiêm trọng quy chuẩn an toàn', en: 'Fails crew safety inspection' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo đỏ: Lưới điện trạm không thể khởi động!',
              en: 'Red alert: Station power bus cannot initialize!',
            },
            causeShort: {
              vi: 'Lắp nguồn pin không tương thích gây lỗi khởi động.',
              en: 'Incompatible scooter battery blocked startup.',
            },
          },
        ],
      },
      {
        slotId: 'm3_regulator',
        slotLabel: { vi: 'Bộ Chia Điện Ổn Áp', en: 'Power Regulator' },
        icon: 'Zap',
        hotspotCoords: { x: 44, y: 52 },
        locationHint: {
          vi: 'Dọc thanh trục xương sống nối vào các phòng thí nghiệm',
          en: 'Along the central spine distributing power to lab modules',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/KSC-20210402-PH-FMX01_0047/KSC-20210402-PH-FMX01_0047~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm3_reg_medium',
        parts: [
          {
            id: 'm3_reg_good',
            slotId: 'm3_regulator',
            name: { vi: 'Bộ Điều Phối Điện Thông Minh ISS', en: 'Smart ISS Power Controller' },
            shortNote: { vi: 'Chia điện đều đặn và tự bảo vệ khi quá tải.', en: 'Balances power smoothly across all modules.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Tương thích hoàn hảo trạm ISS', en: 'Matches ISS distribution bus' },
            qualityNote: { vi: 'Tốt — dòng điện mượt và ổn định', en: 'Good — smooth voltage output' },
            safetyNote: { vi: 'Có rơ-le bảo vệ tự động', en: 'Auto-protection circuit verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Dòng điện chạy đều đến mọi khoang.', en: 'Power flows evenly to all rooms.' },
            causeShort: { vi: 'Bộ chia điện hoạt động hoàn hảo.', en: 'Power controller healthy.' },
          },
          {
            id: 'm3_reg_medium',
            slotId: 'm3_regulator',
            name: { vi: 'Bộ Chia Điện Chậm Cân Bằng', en: 'Slow-Balancing Switchbox' },
            shortNote: { vi: 'Chạy ổn lúc đầu, hơi chập chờn khi bật nhiều thiết bị.', en: 'Works at low load, flickers when labs turn on together.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp cổng nối hệ thống điện', en: 'Fits power bus socket' },
            qualityNote: { vi: 'Trung bình — phản ứng chậm khi đổi tải', en: 'Medium — slow load switching' },
            safetyNote: { vi: 'Có thể gây sụt áp nhẹ khi chuyển ngày-đêm', en: 'Minor dip during eclipse switchover' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Lúc chuyển từ nắng sang tối, hệ thống điện bị chập chờn vài giây.',
              en: 'Voltage flickered briefly during day-to-night switch.',
            },
            causeShort: {
              vi: 'Bộ chia điện trung bình chuyển mạch hơi chậm khi sang vùng tối.',
              en: 'Slow-balancing switchbox flickered during eclipse transition.',
            },
          },
          {
            id: 'm3_reg_poor',
            slotId: 'm3_regulator',
            name: { vi: 'Bộ Chia Điện Lỏng Giắc Cắm', en: 'Loose-Contact Breaker' },
            shortNote: { vi: 'Tiếp xúc kém làm điện lúc có lúc mất.', en: 'Loose wiring drops power unpredictably.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Vừa khe lắp nhưng chân cắm lỏng', en: 'Fits slot, loose pins' },
            qualityNote: { vi: 'Kém — điện chập chờn liên tục', en: 'Poor — constant flicker' },
            safetyNote: { vi: 'Không an toàn cho thiết bị khoa học', en: 'Unsafe voltage spikes' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: {
              vi: 'Đèn phòng thí nghiệm nhấp nháy liên tục!',
              en: 'Lab lights flicker continuously!',
            },
            causeShort: {
              vi: 'Bộ chia điện kém chất lượng làm dòng điện mất ổn định.',
              en: 'Loose breaker contacts disrupted power flow.',
            },
          },
          {
            id: 'm3_reg_incompat',
            slotId: 'm3_regulator',
            name: { vi: 'Ổ Cắm Điện Dân Dụng', en: 'Home Wall Power Strip' },
            shortNote: { vi: 'Không dùng được cho nguồn điện một chiều của ISS.', en: 'Incompatible with ISS space DC bus.' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Sai hoàn toàn chuẩn điện áp vũ trụ', en: 'Wrong electrical standard' },
            qualityNote: { vi: 'Không hoạt động trên trạm vũ trụ', en: 'Cannot operate on ISS' },
            safetyNote: { vi: 'Cảnh báo mất an toàn điện', en: 'Fails electrical safety check' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Hệ thống phân phối điện báo lỗi không tương thích!',
              en: 'Power bus incompatible error!',
            },
            causeShort: {
              vi: 'Ổ cắm gia đình không tương thích với Trạm Vũ trụ.',
              en: 'Household strip cannot connect to ISS power bus.',
            },
          },
        ],
      },
    ],
  },

  mission_04_robotic_arm: {
    missionId: 'mission_04_robotic_arm',
    equipmentTitle: {
      vi: 'Cánh Tay Robot Canadarm2',
      en: 'Canadarm2 Robotic Arm',
    },
    previewImageUrl: 'https://images-assets.nasa.gov/image/iss058e002666/iss058e002666~medium.jpg',
    previewMediaKind: 'real_photo',
    fallbackImageUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
    observedSymptom: {
      vi: 'Dấu hiệu quan sát: Cánh tay robot không di chuyển chính xác tới vị trí chốt tàu hàng và đầu kẹp bị rung nhẹ.',
      en: 'Observed clue: Robotic arm drifts off target when reaching for the cargo pin and shakes slightly.',
    },
    clueHint: {
      vi: 'Gợi ý suy luận: Hãy kiểm tra khớp xoay cổ tay và bàn tay nắm tàu (đầu kẹp)!',
      en: 'Think carefully: Check the wrist joints and the grabber end-effector!',
    },
    slots: [
      {
        slotId: 'm4_joint',
        slotLabel: { vi: 'Khớp Xoay Linh Hoạt', en: 'Motorized Arm Joints' },
        icon: 'Compass',
        hotspotCoords: { x: 46, y: 42 },
        locationHint: {
          vi: 'Khớp khuỷu giữa cánh tay cho phép gập và xoay đa hướng',
          en: 'Central elbow joint allowing smooth flexing & rotation',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/iss072e574907/iss072e574907~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm4_joint_poor',
        parts: [
          {
            id: 'm4_joint_good',
            slotId: 'm4_joint',
            name: { vi: 'Khớp Xoay Chính Xác Chuẩn CSA', en: 'CSA Precision Servo Joint' },
            shortNote: { vi: 'Xoay êm mượt, dừng đúng từng milimét.', en: 'Smooth motion with millimeter precision.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Chuẩn cánh tay Canadarm2 Canada', en: 'Certified Canadarm2 joint' },
            qualityNote: { vi: 'Tốt — cảm biến góc chuẩn xác', en: 'Good — accurate angle sensors' },
            safetyNote: { vi: 'Phanh hãm giữ tàu an toàn', en: 'Locking brake verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Cánh tay di chuyển êm và chính xác.', en: 'Arm moves smoothly on target.' },
            causeShort: { vi: 'Khớp xoay hoạt động chính xác.', en: 'Joints healthy.' },
          },
          {
            id: 'm4_joint_medium',
            slotId: 'm4_joint',
            name: { vi: 'Khớp Xoay Chưa Hiệu Chuẩn Nhiệt', en: 'Uncalibrated Backup Joint' },
            shortNote: { vi: 'Đầu giờ chạy ổn, chuyển lạnh dễ lệch 2–3 độ.', en: 'Smooth at first, drifts slightly in temperature shifts.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Lắp vừa ống cánh tay', en: 'Fits arm boom collar' },
            qualityNote: { vi: 'Trung bình — hơi trôi góc khi đổi nhiệt độ', en: 'Medium — slight thermal drift' },
            safetyNote: { vi: 'An toàn cơ bản, phải di chuyển chậm', en: 'Safe only at very slow speed' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Lúc đầu vươn ra khá ổn, khi xoay góc rộng bị lệch nhẹ vị trí.',
              en: 'Smooth initially, then drifted slightly during wide turns.',
            },
            causeShort: {
              vi: 'Khớp xoay trung bình bị trôi góc khi thay đổi nhiệt độ.',
              en: 'Uncalibrated joint drifted under space temperature changes.',
            },
          },
          {
            id: 'm4_joint_poor',
            slotId: 'm4_joint',
            name: { vi: 'Khớp Rơ Lỏng Bánh Răng', en: 'Worn-Gear Shaky Joint' },
            shortNote: { vi: 'Bị rung lắc và lệch hướng khi cầm đồ nặng.', en: 'Shakes and misses the docking pin.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng cỡ nhưng bánh răng đã mòn', en: 'Right size, worn inner gears' },
            qualityNote: { vi: 'Kém — rung giật khi xoay', en: 'Poor — jerky movement' },
            safetyNote: { vi: 'Nguy cơ chạm nhẹ vào thân tàu hàng', en: 'Alignment safety hazard' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Cánh tay robot rung lắc và không di chuyển chính xác tới chốt tàu!',
              en: 'Robotic arm shakes and misses the target pin!',
            },
            causeShort: {
              vi: 'Khớp xoay kém chất lượng làm cánh tay rung và lệch vị trí.',
              en: 'Worn joint gears caused shaky, inaccurate motion.',
            },
          },
          {
            id: 'm4_joint_incompat',
            slotId: 'm4_joint',
            name: { vi: 'Bản Lề Cửa Gỗ Thường', en: 'Standard Wooden Door Hinge' },
            shortNote: { vi: 'Không có mô-tơ xoay ngoài không gian!', en: 'Not motorized for space robotics!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích với robot Canadarm2', en: 'Incompatible with Canadarm2' },
            qualityNote: { vi: 'Không thể điều khiển tự động', en: 'No motor control' },
            safetyNote: { vi: 'Không giữ được tải trọng tàu hàng', en: 'Unsafe load rating' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo: Cánh tay robot không thể xoay!',
              en: 'Alert: Robotic arm cannot rotate!',
            },
            causeShort: {
              vi: 'Lắp sai bản lề thường không tương thích cho robot vũ trụ.',
              en: 'Door hinge is incompatible with Canadarm2.',
            },
          },
        ],
      },
      {
        slotId: 'm4_gripper',
        slotLabel: { vi: 'Bàn Tay Nắm Tàu (LEE)', en: 'Grabber End-Effector' },
        icon: 'Wrench',
        hotspotCoords: { x: 68, y: 26 },
        locationHint: {
          vi: 'Ở đầu mút cánh tay để vươn ra bắt chốt tàu hàng',
          en: 'Located at the tip of the arm to catch spacecraft pins',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/iss075e0014476/iss075e0014476~large.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm4_grip_medium',
        parts: [
          {
            id: 'm4_grip_good',
            slotId: 'm4_gripper',
            name: { vi: 'Đầu Kẹp Dây Cáp LEE Chuẩn CSA', en: 'CSA Snare-Cable Grabber (LEE)' },
            shortNote: { vi: 'Siết cáp êm ái, giữ tàu hàng cực chắc.', en: 'Softly cinches snare cables for rock-solid hold.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Chuẩn chốt bắt tàu vũ trụ ISS', en: 'Matches ISS grapple fixtures' },
            qualityNote: { vi: 'Tốt — lực kẹp cân bằng, êm ái', en: 'Good — balanced snare grip' },
            safetyNote: { vi: 'Cảm biến báo khóa chốt an toàn', en: 'Capture latch sensors verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Bắt và giữ chốt tàu hàng gọn gàng.', en: 'Locks cleanly onto cargo pin.' },
            causeShort: { vi: 'Đầu kẹp hoạt động hoàn hảo.', en: 'Grabber healthy.' },
          },
          {
            id: 'm4_grip_medium',
            slotId: 'm4_gripper',
            name: { vi: 'Đầu Kẹp Cũ Đóng Chậm', en: 'Slow-Latching Old Grabber' },
            shortNote: { vi: 'Khóa được nhưng đóng cáp hơi chậm.', en: 'Grabs the pin, closes a bit slowly.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa đầu ống Canadarm2', en: 'Fits arm tip' },
            qualityNote: { vi: 'Trung bình — dây cáp hơi cứng', en: 'Medium — stiff snare cables' },
            safetyNote: { vi: 'Cần giữ tàu lâu hơn khi khóa chốt', en: 'Requires extra hold time' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Chạm được chốt tàu nhưng chốt khóa đóng chậm và hơi rung.',
              en: 'Caught pin slowly with minor vibration during latch.',
            },
            causeShort: {
              vi: 'Đầu kẹp chất lượng trung bình đóng chốt hơi chậm.',
              en: 'Stiff snare cables delayed clean latching.',
            },
          },
          {
            id: 'm4_grip_poor',
            slotId: 'm4_gripper',
            name: { vi: 'Đầu Kẹp Trượt Chốt', en: 'Slipping Snare Hand' },
            shortNote: { vi: 'Dây cáp mòn nên hay tuột khỏi chốt.', en: 'Worn snares slip off the grapple pin.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng cỡ nhưng dây kẹp bị tưa', en: 'Right collar, frayed snares' },
            qualityNote: { vi: 'Kém — không giữ chặt được tàu', en: 'Poor — slipping grip' },
            safetyNote: { vi: 'Nguy hiểm làm trôi tàu hàng', en: 'Unsafe capture risk' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Đầu kẹp không bám chắc vào chốt tàu hàng!',
              en: 'End-effector slips off the capture pin!',
            },
            causeShort: {
              vi: 'Đầu kẹp kém chất lượng không khóa được tàu.',
              en: 'Worn snare cables slipped off target.',
            },
          },
          {
            id: 'm4_grip_incompat',
            slotId: 'm4_gripper',
            name: { vi: 'Nam Châm Hút Nhôm Nhỏ', en: 'Small Toy Magnet' },
            shortNote: { vi: 'Vỏ tàu vũ trụ làm bằng nhôm không hút nam châm!', en: 'Aluminum spacecraft hulls are non-magnetic!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích chốt neo cơ khí', en: 'Incompatible with mechanical pins' },
            qualityNote: { vi: 'Không bám được vào tàu hàng', en: 'Cannot hold cargo ship' },
            safetyNote: { vi: 'Không đạt an toàn kết nối', en: 'Fails mechanical safety check' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo: Đầu kẹp không bắt được tàu vũ trụ!',
              en: 'Warning: Magnet cannot hold aluminum hull!',
            },
            causeShort: {
              vi: 'Tàu vũ trụ dùng chốt cơ khí, nam châm không tương thích.',
              en: 'Toy magnet is incompatible with spacecraft grapple pins.',
            },
          },
        ],
      },
      {
        slotId: 'm4_camera',
        slotLabel: { vi: 'Camera Quan Sát Tay', en: 'Arm Watch Camera' },
        icon: 'Camera',
        hotspotCoords: { x: 58, y: 33 },
        locationHint: {
          vi: 'Gắn dọc thân cánh tay gần đầu kẹp để soi tâm ngắm',
          en: 'Mounted along the boom near the grabber for target alignment',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/iss071e384199/iss071e384199~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: false,
        initialPartId: 'm4_cam_good',
        parts: [
          {
            id: 'm4_cam_good',
            slotId: 'm4_camera',
            name: { vi: 'Camera Mục Tiêu Chuẩn ISS', en: 'ISS Target Alignment Camera' },
            shortNote: { vi: 'Soi rõ tâm ngắm chữ thập giúp bắt tàu chuẩn xác.', en: 'Clear crosshair alignment view for astronauts.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Tương thích màn hình điều khiển ISS', en: 'Matches ISS control workstation' },
            qualityNote: { vi: 'Tốt — hình ảnh sáng rõ', en: 'Good — crisp target view' },
            safetyNote: { vi: 'Đèn LED chiếu sáng an toàn', en: 'Alignment light verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Phi hành gia nhìn rõ tâm chốt neo.', en: 'Crystal-clear grapple view.' },
            causeShort: { vi: 'Camera hoạt động tốt.', en: 'Arm camera healthy.' },
          },
          {
            id: 'm4_cam_medium',
            slotId: 'm4_camera',
            name: { vi: 'Camera Góc Hẹp Không Đèn', en: 'Dim Narrow Camera' },
            shortNote: { vi: 'Hơi tối khi trạm bay vào bóng râm.', en: 'Dim image when orbiting through shadow.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa giá gắn đầu kẹp', en: 'FitsLEE mount' },
            qualityNote: { vi: 'Trung bình — thiếu đèn trợ sáng', en: 'Medium — no alignment LED' },
            safetyNote: { vi: 'Khó nhìn khi thiếu ánh nắng', en: 'Harder to see in dark shadow' },
            visualEffect: 'blur',
            symptomWhenUsed: { vi: 'Khi trạm vào bóng tối, màn hình ngắm hơi tối.', en: 'Target screen dims in orbital shadow.' },
            causeShort: { vi: 'Camera trung bình thiếu đèn chiếu sáng.', en: 'Dim camera struggled in shadow.' },
          },
          {
            id: 'm4_cam_poor',
            slotId: 'm4_camera',
            name: { vi: 'Camera Nhiễu Sọc Màn Hình', en: 'Static-Line Camera' },
            shortNote: { vi: 'Hình ảnh giật sọc, khó canh tâm ngắm.', en: 'Flickering lines hide the target.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng giắc nhưng dây cáp nhiễu', en: 'Right plug, noisy cable' },
            qualityNote: { vi: 'Kém — màn hình mờ sọc', en: 'Poor — heavy screen static' },
            safetyNote: { vi: 'Không an toàn khi điều khiển tay robot', en: 'Unsafe visibility for capture' },
            visualEffect: 'blur',
            symptomWhenUsed: { vi: 'Màn hình điều khiển bị mờ nhòe khó căn chuẩn.', en: 'Viewscreen blurry with static.' },
            causeShort: { vi: 'Camera kém làm phi hành gia khó nhìn chốt tàu.', en: 'Noisy camera obscured the target.' },
          },
          {
            id: 'm4_cam_incompat',
            slotId: 'm4_camera',
            name: { vi: 'Đồng Hồ Bấm Giây Cơ', en: 'Mechanical Stopwatch' },
            shortNote: { vi: 'Không phải camera nên không truyền được hình ảnh!', en: 'Not a camera!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích hệ thống quan sát', en: 'Incompatible with video system' },
            qualityNote: { vi: 'Không có hình ảnh hiển thị', en: 'No video feed' },
            safetyNote: { vi: 'Cấm vận hành khi mất hình ảnh', en: 'Unsafe blind operation' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: { vi: 'Màn hình mất hình ảnh hoàn toàn!', en: 'Complete camera feed loss!' },
            causeShort: { vi: 'Lắp sai linh kiện cho vị trí camera.', en: 'Incompatible part in camera slot.' },
          },
        ],
      },
    ],
  },

  mission_05_space_telescope: {
    missionId: 'mission_05_space_telescope',
    equipmentTitle: {
      vi: 'Kính Thiên Văn Hubble',
      en: 'Hubble Space Telescope',
    },
    previewImageUrl: 'https://images-assets.nasa.gov/image/sts061-57-021/sts061-57-021~medium.jpg',
    previewMediaKind: 'real_photo',
    fallbackImageUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
    observedSymptom: {
      vi: 'Dấu hiệu quan sát: Kính thiên văn không thu được ảnh các ngôi sao sắc nét như mong đợi; khung hình bị rung nhẹ và nhòe.',
      en: 'Observed clue: Telescope star images are not crisp as expected; frames look slightly shaken and blurred.',
    },
    clueHint: {
      vi: 'Gợi ý suy luận: Hãy kiểm tra bánh đà giữ thăng bằng chống rung và hệ gương/máy ảnh!',
      en: 'Think carefully: Inspect the balance wheels (reaction wheels) and star optics!',
    },
    slots: [
      {
        slotId: 'm5_balance',
        slotLabel: { vi: 'Bánh Đà Giữ Thăng Bằng', en: 'Balance Wheels' },
        icon: 'Compass',
        hotspotCoords: { x: 50, y: 66 },
        locationHint: {
          vi: 'Nằm trong khoang thân dưới giúp kính đứng yên tuyệt đối',
          en: 'Seated inside the lower equipment bay to hold steady aim',
        },
        referencePhotoUrl: 'https://science.nasa.gov/wp-content/uploads/2023/04/hubbleinstruments-graphic.gif',
        referencePhotoKind: 'technical_diagram',
        isFaultyInitially: true,
        initialPartId: 'm5_bal_poor',
        parts: [
          {
            id: 'm5_bal_good',
            slotId: 'm5_balance',
            name: { vi: 'Bánh Đà Cân Bằng Siêu Êm Hubble', en: 'Hubble Precision Reaction Wheels' },
            shortNote: { vi: 'Giữ kính đứng yên tuyệt đối khi ngắm sao xa.', en: 'Holds telescope steady for razor-sharp star shots.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Tương thích hoàn hảo hệ điều hướng Hubble', en: 'Hubble pointing system certified' },
            qualityNote: { vi: 'Tốt — vòng bi không rung lắc', en: 'Good — zero micro-vibration' },
            safetyNote: { vi: 'Khóa an toàn chống quay quá tốc', en: 'Overspeed guard verified' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Kính giữ đứng yên, ảnh ngôi sao cực nét.', en: 'Telescope stays rock steady.' },
            causeShort: { vi: 'Bánh đà hoạt động êm ái.', en: 'Reaction wheels healthy.' },
          },
          {
            id: 'm5_bal_medium',
            slotId: 'm5_balance',
            name: { vi: 'Bánh Đà Hơi Rung Khi Quay Nhanh', en: 'Slightly Unbalanced Wheel' },
            shortNote: { vi: 'Chụp ảnh nhanh ổn, chụp lâu bắt đầu rung nhẹ.', en: 'Fine for quick snaps, jitters on long exposures.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa khoang điều khiển hướng', en: 'Fits pointing bay' },
            qualityNote: { vi: 'Trung bình — hơi rung ở tốc độ cao', en: 'Medium — minor jitter at high RPM' },
            safetyNote: { vi: 'An toàn cơ bản nhưng giảm độ sắc nét', en: 'Safe mount; reduces star crispness' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Lúc đầu ảnh nét, khi giữ lâu ngắm thiên hà bắt đầu rung nhẹ.',
              en: 'Clear briefly, then slight jitter during long star exposure.',
            },
            causeShort: {
              vi: 'Bánh đà trung bình rung nhẹ khi quay lâu để ngắm sao.',
              en: 'Medium reaction wheel vibrated slightly on long exposures.',
            },
          },
          {
            id: 'm5_bal_poor',
            slotId: 'm5_balance',
            name: { vi: 'Bánh Đà Mòn Vòng Bi', en: 'Worn-Bearing Balance Wheel' },
            shortNote: { vi: 'Tạo độ rung liên tục làm mờ ảnh ngôi sao.', en: 'Constant vibration blurs distant stars.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng cỡ nhưng ổ bi bị mòn', en: 'Right size, worn bearings' },
            qualityNote: { vi: 'Kém — rung mạnh khi xoay kính', en: 'Poor — heavy jitter' },
            safetyNote: { vi: 'Không đạt chuẩn giữ ổn định kính', en: 'Fails pointing safety tolerance' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Khung hình rung lắc, ngôi sao bị kéo vệt nhòe!',
              en: 'Star frame shakes and smears into streaks!',
            },
            causeShort: {
              vi: 'Bánh đà kém chất lượng gây rung làm kính không chụp rõ được.',
              en: 'Worn balance wheel jitter blurred the telescope view.',
            },
          },
          {
            id: 'm5_bal_incompat',
            slotId: 'm5_balance',
            name: { vi: 'Bánh Xe Đạp Trẻ Em', en: 'Kids Bicycle Wheel' },
            shortNote: { vi: 'Không phải bánh đà động cơ chính xác!', en: 'Not a motorized precision flywheel!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích kính thiên văn', en: 'Incompatible with Hubble bus' },
            qualityNote: { vi: 'Không xoay cân bằng kính được', en: 'Cannot stabilize spacecraft' },
            safetyNote: { vi: 'Cảnh báo mất kiểm soát hướng ngắm', en: 'Pointing control failure' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo đỏ: Hệ thống giữ thăng bằng không hoạt động!',
              en: 'Red alert: Pointing stabilization offline!',
            },
            causeShort: {
              vi: 'Lắp bánh xe không tương thích khiến kính không giữ được hướng.',
              en: 'Bicycle wheel is incompatible with space telescope.',
            },
          },
        ],
      },
      {
        slotId: 'm5_optics',
        slotLabel: { vi: 'Gương & Máy Ảnh Vũ Trụ', en: 'Star Mirror & Camera' },
        icon: 'Camera',
        hotspotCoords: { x: 55, y: 38 },
        locationHint: {
          vi: 'Ống thân lớn màu bạc nơi gương 2,4 m đón ánh sáng các ngôi sao',
          en: 'Large metallic telescope tube housing the 2.4 m star mirror',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/8218871/8218871~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: true,
        initialPartId: 'm5_opt_medium',
        parts: [
          {
            id: 'm5_opt_good',
            slotId: 'm5_optics',
            name: { vi: 'Bộ Gương & Máy Ảnh WFC3 Chuẩn NASA', en: 'NASA WFC3 Mirror & Camera' },
            shortNote: { vi: 'Thu trọn ánh sáng thiên hà sắc nét tuyệt đẹp.', en: 'Captures razor-sharp colorful nebulae.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Chuẩn khoang khoa học Hubble', en: 'Hubble instrument bay certified' },
            qualityNote: { vi: 'Tốt — gương siêu phẳng, ảnh sắc nét', en: 'Good — flawless optical precision' },
            safetyNote: { vi: 'Màn chắn ánh nắng bảo vệ cảm biến tốt', en: 'Aperture sun protection safe' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Ảnh tinh vân và thiên hà rực rỡ rõ nét.', en: 'Nebula images are brilliantly crisp.' },
            causeShort: { vi: 'Hệ quang học hoạt động xuất sắc.', en: 'Optics healthy.' },
          },
          {
            id: 'm5_opt_medium',
            slotId: 'm5_optics',
            name: { vi: 'Ống Kính Cũ Độ Nét Vừa', en: 'Older Optics Module' },
            shortNote: { vi: 'Thấy được sao sáng, thiên hà mờ hơi nhòe.', en: 'Shows bright stars, faint galaxies soften.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa rãnh lắp khoang WFC3', en: 'Fits Hubble instrument rail' },
            qualityNote: { vi: 'Trung bình — hơi thiếu nét với vật thể xa', en: 'Medium — soft focus on faint stars' },
            safetyNote: { vi: 'An toàn cơ bản', en: 'Basic fit verified' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Thấy các ngôi sao lớn, nhưng thiên hà ở xa vẫn hơi mờ.',
              en: 'Bright stars visible, but distant galaxies look soft.',
            },
            causeShort: {
              vi: 'Bộ quang học trung bình chưa đủ sắc nét với thiên hà xa.',
              en: 'Medium optics module softened distant galaxy light.',
            },
          },
          {
            id: 'm5_opt_poor',
            slotId: 'm5_optics',
            name: { vi: 'Gương Lệch Đường Cong', en: 'Misshaped Mirror' },
            shortNote: { vi: 'Gương hơi méo khiến ánh sao bị nhòe vòng.', en: 'Mirror flaw creates blurry halos around stars.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Đúng cỡ nhưng mặt gương lỗi', en: 'Right size, flawed mirror polish' },
            qualityNote: { vi: 'Kém — ánh sao bị nhòe sáng', en: 'Poor — spherical blur halos' },
            safetyNote: { vi: 'Không đạt chất lượng quan sát', en: 'Fails science clarity check' },
            visualEffect: 'blur',
            symptomWhenUsed: {
              vi: 'Mọi ngôi sao đều bị quầng mờ, không chụp rõ được!',
              en: 'Every star has blurry halos!',
            },
            causeShort: {
              vi: 'Gương kém chất lượng làm ánh sáng hội tụ sai chỗ.',
              en: 'Misshaped mirror prevented sharp star focus.',
            },
          },
          {
            id: 'm5_opt_incompat',
            slotId: 'm5_optics',
            name: { vi: 'Kính Râm Thời Trang', en: 'Fashion Sunglasses Lens' },
            shortNote: { vi: 'Chắn hết ánh sáng sao, kính thành tối thui!', en: 'Blocks starlight completely!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích máy ảnh thiên văn', en: 'Incompatible with Hubble optics' },
            qualityNote: { vi: 'Chắn ánh sáng yếu từ các ngôi sao', en: 'Blocks faint starlight' },
            safetyNote: { vi: 'Sai hoàn toàn quy cách quang học', en: 'Fails optical inspection' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: {
              vi: 'Cảnh báo: Không thu được ánh sáng từ các ngôi sao!',
              en: 'Alert: Zero starlight reaching camera!',
            },
            causeShort: {
              vi: 'Kính râm chặn hết ánh sáng nên không thể ngắm sao.',
              en: 'Sunglasses lens blocked all faint starlight.',
            },
          },
        ],
      },
      {
        slotId: 'm5_solar',
        slotLabel: { vi: 'Cánh Pin Mặt Trời', en: 'Solar Power Wings' },
        icon: 'Sun',
        hotspotCoords: { x: 76, y: 56 },
        locationHint: {
          vi: 'Đôi cánh xanh đón ánh nắng hai bên thân kính Hubble',
          en: 'Blue solar wing panels flanking the Hubble spacecraft tube',
        },
        referencePhotoUrl: 'https://images-assets.nasa.gov/image/KSC-01pp1636/KSC-01pp1636~medium.jpg',
        referencePhotoKind: 'real_photo',
        isFaultyInitially: false,
        initialPartId: 'm5_sol_good',
        parts: [
          {
            id: 'm5_sol_good',
            slotId: 'm5_solar',
            name: { vi: 'Cánh Pin Mặt Trời Hubble Chuẩn NASA', en: 'Hubble Rigid Solar Arrays' },
            shortNote: { vi: 'Cung cấp điện liên tục cho kính ngắm sao.', en: 'Steady solar energy for cameras & gyros.' },
            quality: 'good',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Khớp trục gắn bên thân Hubble', en: 'Matches Hubble solar drive' },
            qualityNote: { vi: 'Tốt — điện khỏe, ít rung động', en: 'Good — rigid, low-vibration design' },
            safetyNote: { vi: 'An toàn, không làm rung kính', en: 'Vibration-safe solar mount' },
            visualEffect: 'clear',
            symptomWhenUsed: { vi: 'Điện ổn định và không gây rung kính.', en: 'Power steady without shaking.' },
            causeShort: { vi: 'Cánh pin hoạt động tốt.', en: 'Solar wings healthy.' },
          },
          {
            id: 'm5_sol_medium',
            slotId: 'm5_solar',
            name: { vi: 'Cánh Pin Mềm Hơi Rung Khi Đón Nắng', en: 'Flexible Solar Wing' },
            shortNote: { vi: 'Đủ điện nhưng hơi dẻo khi đổi nóng lạnh.', en: 'Enough power, flexes slightly in thermal shifts.' },
            quality: 'medium',
            compatibilityOk: true,
            safetyFitOk: true,
            compatibilityNote: { vi: 'Vừa ngàm Hubble', en: 'Fits Hubble socket' },
            qualityNote: { vi: 'Trung bình — hơi rung nhẹ khi qua ranh giới ngày đêm', en: 'Medium — slight thermal flex' },
            safetyNote: { vi: 'Ổn định cơ bản', en: 'Basic fit safe' },
            visualEffect: 'jitter',
            symptomWhenUsed: {
              vi: 'Cánh pin hơi rung nhẹ lúc vừa đón ánh nắng.',
              en: 'Solar wing flexed lightly entering sunlight.',
            },
            causeShort: {
              vi: 'Cánh pin trung bình hơi mềm gây rung nhẹ.',
              en: 'Flexible wing caused mild jitter in sunlight.',
            },
          },
          {
            id: 'm5_sol_poor',
            slotId: 'm5_solar',
            name: { vi: 'Tấm Pin Yếu Hỏng Mạch', en: 'Damaged Low-Power Wing' },
            shortNote: { vi: 'Không đủ điện cấp cho máy ảnh không gian.', en: 'Not enough power for cameras.' },
            quality: 'poor',
            compatibilityOk: true,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Khớp ngàm nhưng thiếu dây dẫn', en: 'Fits mount, broken cell strips' },
            qualityNote: { vi: 'Kém — điện áp tụt nhanh', en: 'Poor — weak voltage' },
            safetyNote: { vi: 'Thiếu nguồn an toàn cho bánh đà', en: 'Unsafe reserve power' },
            visualEffect: 'power_flicker',
            symptomWhenUsed: { vi: 'Máy ảnh chớp tắt vì thiếu điện!', en: 'Camera flickers due to low power!' },
            causeShort: { vi: 'Tấm pin kém chất lượng không đủ điện nuôi kính.', en: 'Damaged solar array lacked power.' },
          },
          {
            id: 'm5_sol_incompat',
            slotId: 'm5_solar',
            name: { vi: 'Bình Xăng Xe Hơi', en: 'Car Fuel Tank' },
            shortNote: { vi: 'Kính thiên văn dùng điện Mặt Trời, không dùng xăng!', en: 'Space telescopes run on sunlight, not gasoline!' },
            quality: 'incompatible',
            compatibilityOk: false,
            safetyFitOk: false,
            compatibilityNote: { vi: 'Không tương thích với vệ tinh năng lượng Mặt Trời', en: 'Incompatible with solar telescope' },
            qualityNote: { vi: 'Không tạo ra điện', en: 'Produces no electricity' },
            safetyNote: { vi: 'Cảnh báo an toàn nghiêm trọng', en: 'Major safety mismatch' },
            visualEffect: 'incompatible_stop',
            symptomWhenUsed: { vi: 'Cảnh báo: Không có điện để bật kính thiên văn!', en: 'Alert: Zero electrical power!' },
            causeShort: { vi: 'Lắp linh kiện không tương thích cho bộ phận nguồn.', en: 'Incompatible part on solar power slot.' },
          },
        ],
      },
    ],
  },
};

export function getRepairScenario(missionId: MissionId): MissionRepairScenario {
  return MISSION_REPAIR_SCENARIOS[missionId] || MISSION_REPAIR_SCENARIOS.mission_01_mars_rover;
}

/**
 * Computes 4 automatic safety checks before Deploy.
 */
export function evaluatePreDeploySafety(
  scenario: MissionRepairScenario,
  equippedIds: Record<string, string>,
  lang: 'vi' | 'en'
): {
  status: SafetyCheckState;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    level: 'ok' | 'warn' | 'fail';
    detail: string;
  }[];
  summary: string;
} {
  const selectedParts = scenario.slots.map((slot) => {
    const pid = equippedIds[slot.slotId] || slot.initialPartId;
    return slot.parts.find((p) => p.id === pid) || slot.parts[0];
  });

  const allSlotsFilled = scenario.slots.every((s) => Boolean(equippedIds[s.slotId] || s.initialPartId));
  const hasIncompatible = selectedParts.some((p) => !p.compatibilityOk || p.quality === 'incompatible');
  const hasPoor = selectedParts.some((p) => p.quality === 'poor');
  const hasMedium = selectedParts.some((p) => p.quality === 'medium');
  const anySafetyFail = selectedParts.some((p) => !p.safetyFitOk);

  const checks = [
    {
      id: 'type_match',
      label: lang === 'vi' ? '1. Linh kiện đúng loại & tương thích' : '1. Compatible part types',
      passed: !hasIncompatible,
      level: (hasIncompatible ? 'fail' : 'ok') as 'ok' | 'warn' | 'fail',
      detail: hasIncompatible
        ? lang === 'vi'
          ? 'Phát hiện linh kiện không tương thích với thiết bị này!'
          : 'Incompatible component detected!'
        : lang === 'vi'
        ? 'Các linh kiện đều đúng loại cho thiết bị.'
        : 'All parts match the spacecraft.',
    },
    {
      id: 'slots_complete',
      label: lang === 'vi' ? '2. Đã lắp đầy đủ các bộ phận' : '2. All components installed',
      passed: allSlotsFilled,
      level: (allSlotsFilled ? 'ok' : 'fail') as 'ok' | 'warn' | 'fail',
      detail: allSlotsFilled
        ? lang === 'vi'
          ? 'Đủ 3/3 cụm bộ phận quan trọng.'
          : 'All 3/3 required slots equipped.'
        : lang === 'vi'
        ? 'Còn vị trí chưa được lắp linh kiện.'
        : 'Missing component in a slot.',
    },
    {
      id: 'quality_check',
      label: lang === 'vi' ? '3. Chất lượng linh kiện đạt yêu cầu' : '3. Component quality check',
      passed: !hasPoor && !hasMedium,
      level: (hasPoor ? 'fail' : hasMedium ? 'warn' : 'ok') as 'ok' | 'warn' | 'fail',
      detail: hasPoor
        ? lang === 'vi'
          ? 'Có linh kiện chất lượng Kém, dễ hỏng khi vận hành!'
          : 'Poor-quality part detected!'
        : hasMedium
        ? lang === 'vi'
          ? 'Có linh kiện chất lượng Trung bình, tiềm ẩn lỗi khi chạy thử.'
          : 'Medium-quality part detected; may show minor issues under load.'
        : lang === 'vi'
        ? 'Tất cả linh kiện đều đạt chất lượng Tốt.'
        : 'All components rated Good quality.',
    },
    {
      id: 'safety_check',
      label: lang === 'vi' ? '4. Cảnh báo an toàn lắp đặt' : '4. Safety & installation check',
      passed: !anySafetyFail && !hasMedium,
      level: (anySafetyFail ? 'fail' : hasMedium ? 'warn' : 'ok') as 'ok' | 'warn' | 'fail',
      detail: anySafetyFail
        ? lang === 'vi'
          ? 'Có cảnh báo an toàn chưa được xử lý!'
          : 'Active safety alert unresolved!'
        : hasMedium
        ? lang === 'vi'
          ? 'Độ ổn định đạt mức trung bình — nên cân nhắc nâng cấp trước khi chạy thử.'
          : 'Moderate stability — consider upgrading before Deploy.'
        : lang === 'vi'
        ? 'Không có cảnh báo an toàn nào.'
        : 'Zero safety warnings.',
    },
  ];

  if (hasIncompatible || hasPoor || anySafetyFail || !allSlotsFilled) {
    return {
      status: 'FAILED',
      checks,
      summary:
        lang === 'vi'
          ? 'Chưa đạt: Thiết bị chưa thể vận hành an toàn. Hãy thay các linh kiện bị lỗi trước!'
          : 'FAILED: Spacecraft is not safe to deploy yet. Replace faulty parts first!',
    };
  }

  if (hasMedium) {
    return {
      status: 'WARNING',
      checks,
      summary:
        lang === 'vi'
          ? 'Cảnh báo: Có linh kiện mức Trung bình. Bé vẫn có thể bấm Chạy thử nhưng có thể gặp lỗi!'
          : 'WARNING: Medium-quality part detected. You may Deploy, but instability could occur!',
    };
  }

  return {
    status: 'READY',
    checks,
    summary:
      lang === 'vi'
        ? 'Sẵn sàng: Thiết bị đã qua kiểm tra an toàn và sẵn sàng chạy thử!'
        : 'READY: Spacecraft passed all safety checks and is ready to Deploy!',
  };
}
