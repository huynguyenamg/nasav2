import { MissionConfig, SpacecraftComponent, Badge } from '../types/game';

export const COMPONENTS: SpacecraftComponent[] = [
  // CHASSIS
  {
    id: 'chassis_titanium_rocker',
    category: 'chassis',
    name: { vi: 'Khung Gầm Rocker-Bogie Titan', en: 'Titanium Rocker-Bogie Chassis' },
    desc: {
      vi: 'Khung hợp kim titan siêu bền, thiết kế hấp thụ chấn động lấy cảm hứng từ Curiosity và Perseverance.',
      en: 'Ultra-tough titanium alloy chassis with rocker-bogie articulation inspired by NASA Curiosity & Perseverance.',
    },
    icon: 'Shield',
    massKg: 320,
    costK: 240,
    powerDrawW: 0,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 40,
    ruggedness: 98,
    nasaHeritage: { vi: 'Kế thừa từ xe tự hành Perseverance (Mars 2020)', en: 'NASA Perseverance Heritage (Mars 2020)' },
  },
  {
    id: 'chassis_carbon_light',
    category: 'chassis',
    name: { vi: 'Khung Sợi Carbon Siêu Nhẹ', en: 'Ultralight Carbon Fiber Chassis' },
    desc: {
      vi: 'Tiết kiệm khối lượng tối đa để tên lửa dễ phóng, phù hợp cho địa hình ít đá gồ ghề.',
      en: 'Minimizes launch mass for small rocket payloads. Best for flat plains and dune navigation.',
    },
    icon: 'Feather',
    massKg: 140,
    costK: 150,
    powerDrawW: 0,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 20,
    ruggedness: 68,
    nasaHeritage: { vi: 'Công nghệ vật liệu hàng không vũ trụ NASA JPL', en: 'NASA JPL Advanced Materials Lab' },
  },
  {
    id: 'chassis_cube_compact',
    category: 'chassis',
    name: { vi: 'Khung Khối Cube Explorer', en: 'Compact Cube Chassis' },
    desc: {
      vi: 'Khung hình hộp gọn gàng, chi phí thấp, tối ưu cho học viên nhí lắp ráp nhanh.',
      en: 'Compact modular cube layout, affordable and ideal for junior cadets starting their first mission.',
    },
    icon: 'Box',
    massKg: 95,
    costK: 85,
    powerDrawW: 0,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 15,
    ruggedness: 75,
    nasaHeritage: { vi: 'Chuẩn CubeSat và Mini-Rover NASA', en: 'NASA CubeSat / Mini-Rover Standard' },
  },

  // MOBILITY
  {
    id: 'mobility_6wheel_rocker',
    category: 'mobility',
    name: { vi: 'Hệ 6 Bánh Nhôm Có Khía Răng', en: '6-Wheel Rocker-Bogie Aluminum Cleats' },
    desc: {
      vi: 'Bánh xe gia công từ một khối nhôm duy nhất với các gai bám cong, vượt chướng ngại vật cao gấp 1.5 lần đường kính bánh.',
      en: 'Six individually motorized aluminum wheels with curved traction cleats. Climbs obstacles 1.5x wheel diameter.',
    },
    icon: 'CircleDot',
    massKg: 85,
    costK: 130,
    powerDrawW: 45,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 30,
    speedRating: 0.9,
    ruggedness: 95,
    nasaHeritage: { vi: 'Hệ thống treo huyền thoại của NASA Mars Rovers', en: 'NASA Mars Rocker-Bogie Suspension' },
  },
  {
    id: 'mobility_4wheel_balloon',
    category: 'mobility',
    name: { vi: 'Hệ 4 Bánh Gai Đệm Cát Lún', en: '4-Wheel High-Traction Sand Wheels' },
    desc: {
      vi: 'Bánh xe rộng bản giúp robot lướt trên các đụn cát mịn mà không bị chìm sâu.',
      en: 'Wide balloon wheels that float over fine Martian sand dunes and silty clay deposits.',
    },
    icon: 'Disc',
    massKg: 50,
    costK: 75,
    powerDrawW: 30,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 15,
    speedRating: 1.3,
    ruggedness: 72,
    nasaHeritage: { vi: 'Thử nghiệm lốp lưới hợp kim ghi nhớ hình dạng NASA Glenn', en: 'NASA Glenn Shape Memory Alloy Tire' },
  },

  // CAMERAS
  {
    id: 'cam_mastcam_z',
    category: 'camera',
    name: { vi: 'Camera Thu Phóng Mastcam-Z 3D', en: 'Mastcam-Z Stereo Zoom Camera' },
    desc: {
      vi: 'Cặp mắt siêu sắc nét trên cột buồm robot, chụp ảnh toàn cảnh màu 3D và quay video bề mặt Sao Hỏa.',
      en: 'High-definition stereo zoom camera mounted on mast. Captures 3D color panoramas and multispectral scans.',
    },
    icon: 'Camera',
    massKg: 28,
    costK: 120,
    powerDrawW: 40,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 120,
    nasaHeritage: { vi: 'Trang bị chính trên xe Perseverance (ASU / Malin / NASA)', en: 'NASA Perseverance Mastcam-Z Principal Instrument' },
  },
  {
    id: 'cam_navcam_dual',
    category: 'camera',
    name: { vi: 'Camera Điều Hướng Góc Rộng Navcam', en: 'Dual Wide-Angle Navcam Pair' },
    desc: {
      vi: 'Camera trường nhìn rộng giúp máy tính tự động tìm đường đi an toàn quanh tảng đá.',
      en: 'Wide field-of-view engineering cameras for autonomous hazard detection and terrain mapping.',
    },
    icon: 'Eye',
    massKg: 12,
    costK: 45,
    powerDrawW: 18,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 50,
    nasaHeritage: { vi: 'Mắt dẫn đường tự hành tiêu chuẩn của NASA Mars Exploration', en: 'NASA Mars Autonomous Navigation Standard' },
  },

  // ANTENNAS
  {
    id: 'antenna_hga_dish',
    category: 'antenna',
    name: { vi: 'Anten Đĩa Định Hướng Cao HGA (Gửi Trực Tiếp)', en: 'High-Gain Steerable Dish Antenna (HGA)' },
    desc: {
      vi: 'Chảo anten xoay hướng chính xác về Trái Đất, truyền thẳng dữ liệu đến Mạng Không Gian Sâu (NASA DSN).',
      en: 'Steerable dish antenna pointing directly to Earth. Connects to the NASA Deep Space Network (DSN).',
    },
    icon: 'Radio',
    massKg: 25,
    costK: 95,
    powerDrawW: 55,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 80,
    nasaHeritage: { vi: 'Mạng lưới viễn thông Deep Space Network (Goldstone, Madrid, Canberra)', en: 'NASA Deep Space Network Direct-to-Earth Link' },
  },
  {
    id: 'antenna_uhf_relay',
    category: 'antenna',
    name: { vi: 'Anten Tiếp Sóng Vệ Tinh Quỹ Đạo (UHF Relay)', en: 'UHF Mars Orbiter Relay Antenna' },
    desc: {
      vi: 'Bắn dữ liệu tốc độ cực nhanh lên vệ tinh bay quanh Sao Hỏa (MRO / Odyssey) khi vệ tinh bay ngang qua.',
      en: 'High-bandwidth burst antenna beaming science files up to Mars Reconnaissance Orbiter (MRO) overhead.',
    },
    icon: 'Wifi',
    massKg: 15,
    costK: 65,
    powerDrawW: 35,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 70,
    nasaHeritage: { vi: 'Hệ thống chuyển tiếp quỹ đạo NASA Mars Relay Network', en: 'NASA Mars Relay Network (MRO / MAVEN)' },
  },
  {
    id: 'antenna_lga_omni',
    category: 'antenna',
    name: { vi: 'Anten Đẳng Hướng Cứu Hộ (LGA)', en: 'Low-Gain Omnidirectional Antenna (LGA)' },
    desc: {
      vi: 'Nhận lệnh từ bất kỳ hướng nào, chuyên dùng để cứu hộ khẩn cấp khi tàu mất định hướng.',
      en: 'Broadcasts in all directions without steering. Lifeline for emergency tele-commands from Earth.',
    },
    icon: 'RadioTower',
    massKg: 8,
    costK: 25,
    powerDrawW: 15,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 25,
    nasaHeritage: { vi: 'Hệ anten phụ cứu nạn trên mọi tàu thám hiểm NASA', en: 'NASA Deep Space Emergency Safe-Mode Beacon' },
  },

  // POWER SOURCES
  {
    id: 'power_mmrtg_nuclear',
    category: 'power',
    name: { vi: 'Máy Phát Điện Nhiệt Hạt Nhân (MMRTG)', en: 'Multi-Mission Radioisotope Generator (MMRTG)' },
    desc: {
      vi: 'Biến nhiệt lượng phân rã Plutonium thành điện năng liên tục suốt 14 năm! Không sợ đêm tối hay bão cát Sao Hỏa.',
      en: 'Converts radioactive decay heat of Plutonium-238 into continuous electricity 24/7, immune to dust storms.',
    },
    icon: 'Zap',
    massKg: 45,
    costK: 260,
    powerDrawW: 0,
    powerGenW: 125,
    batteryCapacityWh: 0,
    scienceValue: 60,
    nasaHeritage: { vi: 'Trái tim năng lượng của Curiosity và Perseverance (NASA / DOE)', en: 'Curiosity & Perseverance Nuclear Power Heart (NASA/DOE)' },
  },
  {
    id: 'power_ultraflex_solar',
    category: 'power',
    name: { vi: 'Cánh Pin Mặt Trời Bung Tròn UltraFlex', en: 'UltraFlex Circular Solar Arrays' },
    desc: {
      vi: 'Tạo ra nhiều điện khi trời nắng gắt, siêu nhẹ nhưng công suất giảm mạnh khi bão bụi che mờ ánh sáng.',
      en: 'High-efficiency circular folding solar wings. Generates great power in sunlight; drops in dust storms.',
    },
    icon: 'Sun',
    massKg: 32,
    costK: 90,
    powerDrawW: 0,
    powerGenW: 170,
    batteryCapacityWh: 0,
    scienceValue: 40,
    nasaHeritage: { vi: 'Công nghệ cánh pin trên tàu đổ bộ InSight và phi thuyền Orion', en: 'NASA InSight & Orion UltraFlex Solar Heritage' },
  },

  // BATTERIES
  {
    id: 'battery_deepspace_li',
    category: 'battery',
    name: { vi: 'Khối Pin Li-Ion Giữ Nhiệt Không Gian', en: 'Heated Deep-Space Li-Ion Battery Pack' },
    desc: {
      vi: 'Dung lượng lớn có hệ thống sưởi nhiệt để chống chọi cái lạnh -80°C của đêm đông Sao Hỏa.',
      en: 'High-capacity lithium-ion pack with internal thermal heater to endure -80°C Martian winter nights.',
    },
    icon: 'BatteryCharging',
    massKg: 42,
    costK: 85,
    powerDrawW: 5,
    powerGenW: 0,
    batteryCapacityWh: 850,
    scienceValue: 20,
    nasaHeritage: { vi: 'Tiêu chuẩn pin lưu trữ năng lượng tàu NASA JPL', en: 'NASA JPL Space Battery Subsystem' },
  },
  {
    id: 'battery_compact_li',
    category: 'battery',
    name: { vi: 'Pin Li-Ion Tiêu Chuẩn', en: 'Standard Compact Li-Ion Battery' },
    desc: {
      vi: 'Khối lượng nhẹ, dung lượng vừa đủ cho các nhiệm vụ cự ly ngắn.',
      en: 'Lightweight battery suitable for short-distance scout missions.',
    },
    icon: 'Battery',
    massKg: 20,
    costK: 35,
    powerDrawW: 2,
    powerGenW: 0,
    batteryCapacityWh: 400,
    scienceValue: 10,
    nasaHeritage: { vi: 'Thiết kế pin xe tự hành Sojourner và MER', en: 'Sojourner & MER Battery Configuration' },
  },

  // SCIENCE INSTRUMENTS
  {
    id: 'sci_supercam_laser',
    category: 'science',
    name: { vi: 'Laser Bắn Bốc Hơi Đá SuperCam', en: 'SuperCam Rock Laser & Microphone' },
    desc: {
      vi: 'Bắn tia laser làm bốc hơi một phần nhỏ hòn đá từ xa 7 mét để phân tích thành phần khoáng vật và ghi âm tiếng gió Sao Hỏa!',
      en: 'Fires laser pulses to vaporize rock targets from 7 meters away and records Martian wind with a microphone.',
    },
    icon: 'Sparkles',
    massKg: 30,
    costK: 160,
    powerDrawW: 60,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 210,
    nasaHeritage: { vi: 'Thiết bị tiên tiến trên xe Perseverance (NASA / CNES / LANL)', en: 'Perseverance SuperCam (NASA / CNES / LANL)' },
  },
  {
    id: 'sci_meda_weather',
    category: 'science',
    name: { vi: 'Trạm Khí Tượng & Bụi Sao Hỏa (MEDA)', en: 'MEDA Martian Environmental Station' },
    desc: {
      vi: 'Đo tốc độ gió, độ ẩm, áp suất khí quyển và kích thước hạt bụi trong không khí Sao Hỏa.',
      en: 'Measures Martian wind velocity, humidity, atmospheric pressure, and suspended dust particle sizes.',
    },
    icon: 'CloudRain',
    massKg: 14,
    costK: 55,
    powerDrawW: 16,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 95,
    nasaHeritage: { vi: 'Trạm thời tiết Mars Environmental Dynamics Analyzer (NASA / CAB)', en: 'NASA MEDA Weather Station (CAB / NASA)' },
  },
  {
    id: 'sci_rimfax_radar',
    category: 'science',
    name: { vi: 'Radar Quét Dưới Lòng Đất RIMFAX', en: 'RIMFAX Subsurface Radar Sounder' },
    desc: {
      vi: 'Phát sóng radar xuyên sâu hơn 10 mét dưới mặt đất để tìm các lớp băng ngầm và vết tích sông cổ.',
      en: 'Ground-penetrating radar detecting water-ice and buried geological strata down to 10+ meters depth.',
    },
    icon: 'Layers',
    massKg: 18,
    costK: 110,
    powerDrawW: 35,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 175,
    nasaHeritage: { vi: 'Radar viễn thám Sao Hỏa do FFI (Na Uy) và NASA phối hợp phát triển', en: 'NASA / FFI RIMFAX Subsurface Radar' },
  },

  // FLIGHT COMPUTER
  {
    id: 'comp_rad750',
    category: 'computer',
    name: { vi: 'Máy Tính Bọc Chống Bức Xạ RAD750', en: 'Radiation-Hardened RAD750 Computer' },
    desc: {
      vi: 'Bộ não xử lý chịu được tia vũ trụ khắc nghiệt, tự phát hiện lỗi và khởi động chế độ bảo vệ an toàn.',
      en: 'Radiation-hardened CPU built to survive cosmic rays with fault-tolerant self-recovery.',
    },
    icon: 'Cpu',
    massKg: 16,
    costK: 110,
    powerDrawW: 25,
    powerGenW: 0,
    batteryCapacityWh: 0,
    scienceValue: 40,
    nasaHeritage: { vi: 'Bộ vi xử lý trung tâm điều khiển Curiosity, Perseverance và James Webb', en: 'CPU powering Curiosity, Perseverance & JWST' },
  },
];

export const MISSIONS: MissionConfig[] = [
  {
    id: 'mission_01_mars_rover',
    number: '01',
    title: { vi: 'Chế Tạo Robot Sao Hỏa', en: 'Build Your Mars Rover' },
    subtitle: {
      vi: 'Thám hiểm lòng hồ cổ Jezero Crater và tìm kiếm dấu vết sự sống vi sinh',
      en: 'Explore ancient Jezero Crater lakebed and search for biosignatures',
    },
    briefing: {
      vi: 'Chào kỹ sư nhí! Mục tiêu của em là chế tạo một robot tự hành hoàn chỉnh để hạ cánh xuống Jezero Crater trên Sao Hỏa. Robot phải có khả năng di chuyển trên địa hình gồ ghề, chụp ảnh địa chất, bắn tia laser phân tích đá và truyền dữ liệu về Trái Đất an toàn.',
      en: 'Welcome cadet engineer! Your goal is to design a resilient rover to land in Jezero Crater on Mars. The rover must traverse rugged terrain, take high-res geological photos, analyze rock chemistry, and beam data back to Earth.',
    },
    nasaContext: {
      vi: 'Miệng hố Jezero từng là một hồ nước sâu 250m cách đây 3.7 tỷ năm, với dòng sông cổ bồi tụ phù sa delta giàu đất sét. Đây là nơi lý tưởng nhất để xe Perseverance thu thập các mẫu đất đá.',
      en: 'Jezero Crater was once filled with a 250m deep lake 3.7 billion years ago, with a river delta depositing clay minerals—ideal for Perseverance rover sample collection.',
    },
    targetLocation: { vi: 'Đồng bằng phù sa Jezero Crater (Sao Hỏa)', en: 'Jezero Crater River Delta (Mars)' },
    nasaDatasetRef: 'NASA Mars 2020 Perseverance Mission & PDS Geoscience Node',
    badgeId: 'badge_mars_explorer',
    badgeName: { vi: 'Nhà Thám Hiểm Sao Hỏa', en: 'Mars Explorer' },
    badgeDesc: {
      vi: 'Thiết kế thành công robot vượt địa hình Sao Hỏa và phân tích mẫu đá cổ.',
      en: 'Successfully designed and driven a rover across Martian terrain with rock sampling.',
    },
    budgetMax: { junior: 1100, engineer: 950 },
    massMax: { junior: 800, engineer: 680 },
    scienceTarget: 250,
    anomalies: [
      {
        id: 'anomaly_dust_storm',
        title: { vi: 'Bão Bụi Làm Giảm Năng Lượng Tấm Pin', en: 'Martian Dust Storm Power Deficit' },
        symptom: {
          vi: 'Cảm biến MEDA phát hiện bầu trời mờ đục do gió cuốn bụi. Cánh pin mặt trời sụt giảm 60% điện năng, pin chính cạn nhanh!',
          en: 'Atmospheric opacity spikes as a regional dust storm rolls in. Solar array output drops by 60%, depleting battery!',
        },
        subsystem: 'power',
        telemetryClue: {
          vi: 'Dòng điện sạc từ pin mặt trời giảm từ 170W xuống còn 45W. Hệ thống tự động báo động đỏ.',
          en: 'Solar bus current dropped from 170W to 45W. Rover battery state of charge is falling.',
        },
        options: [
          {
            id: 'fix_sleep_mode',
            text: {
              vi: 'Chuyển robot sang Chế Độ Ngủ Bảo Tồn (Safe Sleep), tắt camera và hoãn phân tích đá cho đến khi bão tan.',
              en: 'Command rover into Low-Power Safe Sleep Mode, park science payloads until atmospheric dust clears.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Chính xác! Giống như tàu Opportunity và InSight, khi bão bụi che khuất Mặt Trời, kỹ sư NASA luôn cho robot ngủ đông và chỉ duy trì hệ sưởi ấm tối thiểu.',
              en: 'Spot on! Just like NASA engineers managed Spirit, Opportunity, and InSight during Martian storms, conserving power is essential.',
            },
          },
          {
            id: 'fix_drive_faster',
            text: {
              vi: 'Tăng tốc độ động cơ bánh xe lên tối đa để nhanh chóng chạy thoát khỏi khu vực bão.',
              en: 'Rev wheel motors to maximum speed to outrun the dust storm.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Bão bụi trên Sao Hỏa có thể rộng hàng nghìn km! Tăng tốc chỉ khiến robot cạn sạch pin trong vài phút và chết máy.',
              en: 'Martian dust storms can span thousands of kilometers! Speeding up rapidly drains the remaining battery reserves.',
            },
          },
          {
            id: 'fix_blow_air',
            text: {
              vi: 'Bật quạt thổi bụi trên bề mặt tấm pin.',
              en: 'Activate high-pressure air blowers to blow dust off solar panels.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Khí quyển Sao Hỏa rất mỏng (chỉ bằng 1% Trái Đất) và robot không mang theo máy nén khí vì quá nặng.',
              en: 'Mars has a paper-thin atmosphere (1% of Earth) and rovers do not carry heavy air compressors.',
            },
          },
        ],
        nasaContext: {
          vi: 'Vào năm 2018, một cơn bão bụi toàn cầu trên Sao Hỏa đã kết thúc sứ mệnh 15 năm kỳ tích của robot Opportunity.',
          en: 'In 2018, a planet-encircling dust storm blocked sunlight and concluded the historic 15-year Opportunity mission.',
        },
      },
      {
        id: 'anomaly_wheel_bogged',
        title: { vi: 'Bánh Xe Lún Trong Đụn Cát Sâu', en: 'Rover Wheel Stall in Soft Sand' },
        symptom: {
          vi: 'Bánh xe trước bên phải bị trượt 80% khi leo qua một gờ cát mịn. Động cơ báo dòng điện tăng vọt vì quá tải!',
          en: 'Front right wheel experiencing 80% slippage while crossing a rippled sand dune. Motor current spikes due to stall!',
        },
        subsystem: 'mobility',
        telemetryClue: {
          vi: 'Cảm biến gia tốc IMU ghi nhận robot không tiến lên dù bánh xe vẫn quay. Nguy cơ sa lầy.',
          en: 'IMU accelerometers register zero forward progression despite wheel rotation. Rover is sinking into soft sand.',
        },
        options: [
          {
            id: 'fix_reverse_differential',
            text: {
              vi: 'Gửi bản vá phần mềm: Lùi lại theo đúng vệt bánh cũ, lắc lư đổi góc lái từng cặp bánh để thoát cát.',
              en: 'Upload tele-command sequence: Reverse along entry tracks with differential crab-steering steps.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Tuyệt vời! Đây chính là kỹ thuật "vượt lầy" mà đội ngũ lái xe tự hành JPL áp dụng khi Curiosity bị kẹt tại vùng cát Pahrump Hills.',
              en: 'Brilliant! This is the exact backward zigzag extraction maneuver NASA rover drivers at JPL execute.',
            },
          },
          {
            id: 'fix_spin_harder',
            text: {
              vi: 'Nhấn hết ga về phía trước để bánh xe đào thật mạnh qua đụn cát.',
              en: 'Floor the throttle forward to dig aggressively through the dune.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Đào bánh xe quay tít sẽ chỉ khiến gầm robot lún sâu hơn và mắc kẹt vĩnh viễn (như bài học xe Spirit năm 2009).',
              en: 'Spinning wheels in place digs the rover belly deeper into sand traps, as learned with the Spirit rover in 2009.',
            },
          },
        ],
        nasaContext: {
          vi: 'NASA có một căn phòng mô phỏng cát Sao Hỏa tại JPL gọi là Mars Yard, nơi họ dùng robot sinh đôi "Optimus" để thử nghiệm cách thoát kẹt.',
          en: 'NASA JPL operates the "Mars Yard" sandbox with test duplicate rovers to test maneuvers before sending commands to Mars.',
        },
      },
    ],
    reflectionQuestion: {
      vi: 'Tại sao việc cân đối giữa khối lượng (Mass) và năng lượng (Power) lại là quyết định quan trọng nhất của một kỹ sư hàng không vũ trụ?',
      en: 'Why is balancing Mass and Power the single most critical decision for an aerospace engineer?',
    },
    reflectionAnswer: {
      vi: 'Mỗi kilôgam đưa lên vũ trụ đòi hỏi hàng trăm kilôgam nhiên liệu tên lửa. Thêm pin lớn sẽ tăng thời gian chạy nhưng làm tàu nặng hơn và đắt hơn gấp bội!',
      en: 'Every kilogram launched into space requires enormous rocket fuel. Bigger batteries extend runtime but drastically increase payload weight and launch cost.',
    },
  },
  {
    id: 'mission_02_earth_satellite',
    number: '02',
    title: { vi: 'Vệ Tinh Quan Sát Trái Đất', en: 'Earth Observation Satellite' },
    subtitle: {
      vi: 'Theo dõi biến đổi khí hậu, bão nhiệt đới và thảm thực vật toàn cầu từ quỹ đạo',
      en: 'Monitor climate shifts, tropical cyclones, and global vegetation from orbit',
    },
    briefing: {
      vi: 'Thiết kế một vệ tinh viễn thám bay quanh Trái Đất ở quỹ đạo đồng bộ Mặt Trời. Vệ tinh cần cảm biến đa phổ để theo dõi cháy rừng, bão lớn và băng tan ở hai cực.',
      en: 'Design an Earth remote sensing satellite in Sun-synchronous orbit. Equip multispectral imagers to track wildfires, typhoons, and polar ice sheets.',
    },
    nasaContext: {
      vi: 'Các vệ tinh Landsat và camera NASA EPIC chụp ảnh Trái Đất mỗi ngày để cảnh báo thiên tai và giúp nông dân theo dõi mùa màng.',
      en: 'NASA Landsat satellites and the EPIC camera monitor Earth continuously, aiding disaster response and agriculture.',
    },
    targetLocation: { vi: 'Quỹ Đạo Trái Đất Tầm Thấp (LEO 705 km)', en: 'Low Earth Orbit (LEO 705 km)' },
    nasaDatasetRef: 'NASA Earthdata GIBS & DSCOVR EPIC Imagery Archive',
    badgeId: 'badge_earth_observer',
    badgeName: { vi: 'Người Bảo Vệ Trái Đất', en: 'Earth Observer' },
    badgeDesc: {
      vi: 'Chế tạo vệ tinh quan sát khí hậu và truyền ảnh Trái Đất thời gian thực.',
      en: 'Engineered an orbital satellite monitoring climate data and storm tracks.',
    },
    budgetMax: { junior: 1200, engineer: 1050 },
    massMax: { junior: 1000, engineer: 850 },
    scienceTarget: 280,
    anomalies: [
      {
        id: 'anomaly_orbit_drag',
        title: { vi: 'Suy Giảm Quỹ Đạo Do Ma Sát Khí Quyển', en: 'Atmospheric Drag Orbital Decay' },
        symptom: {
          vi: 'Hoạt động Mặt Trời làm tầng khí quyển ngoài giãn nở, tạo lực cản kéo vệ tinh bay thấp hơn 5km so với quỹ đạo thiết kế.',
          en: 'Solar storm activity expands the upper atmosphere, causing aerodynamic drag that drops orbit altitude by 5 km.',
        },
        subsystem: 'thruster',
        telemetryClue: {
          vi: 'Độ cao GPS giảm từ 705km xuống 700km. Vận tốc suy giảm.',
          en: 'GPS altitude decreased from 705 km to 700 km. Orbital lifetime threatened without re-boost.',
        },
        options: [
          {
            id: 'fix_reboost_burn',
            text: {
              vi: 'Khai hỏa động cơ đẩy ion mini trong 120 giây để nâng lại độ cao quỹ đạo về 705km.',
              en: 'Fire onboard mini-thruster in a 120-second prograde orbital burn to restore nominal 705 km altitude.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Chính xác! Các vệ tinh NASA thường xuyên thực hiện các đợt kích hoạt động cơ nhỏ (Orbit Maintenance Burns) để duy trì độ cao.',
              en: 'Correct! NASA Earth satellites regularly perform routine orbit maintenance burns to counteract upper-atmospheric drag.',
            },
          },
          {
            id: 'fix_wings_fold',
            text: {
              vi: 'Gập hẳn tấm pin mặt trời lại vĩnh viễn để giảm bớt diện tích cản gió.',
              en: 'Permanently fold solar panels flat to reduce drag surface.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Gập tấm pin lại thì vệ tinh sẽ mất toàn bộ nguồn điện và ngừng hoạt động!',
              en: 'Folding solar wings permanently cuts off power, rendering the satellite dead in orbit.',
            },
          },
        ],
        nasaContext: {
          vi: 'Trạm Vũ trụ Quốc tế ISS cũng phải dùng động cơ tên lửa đẩy để tăng độ cao đều đặn hàng tháng do lực cản khí quyển mỏng.',
          en: 'The ISS regularly fires thrusters to boost its orbit because faint atmospheric molecules constantly slow it down.',
        },
      },
    ],
    reflectionQuestion: {
      vi: 'Tại sao việc nhìn Trái Đất từ không gian lại giúp chúng ta hiểu rõ hơn về thời tiết và môi trường sống của mình?',
      en: 'How does observing Earth from space give us a unique perspective on climate and weather?',
    },
    reflectionAnswer: {
      vi: 'Từ trên cao, vệ tinh có thể thấy toàn bộ quy mô một cơn bão khổng lồ và đo đạc nhiệt độ đại dương mà các trạm mặt đất không thể bao quát hết.',
      en: 'From space, satellites capture entire storm systems and global ocean currents simultaneously, providing holistic climate telemetry.',
    },
  },
  {
    id: 'mission_03_space_station',
    number: '03',
    title: { vi: 'Cấp Năng Lượng Trạm Vũ Trụ', en: 'Power The Space Station' },
    subtitle: {
      vi: 'Quản lý lưới điện cho phòng thí nghiệm vi trọng lực bay quanh Trái Đất',
      en: 'Balance microgravity science laboratory power across day-and-night cycles',
    },
    briefing: {
      vi: 'Trạm vũ trụ bay quanh Trái Đất mỗi 90 phút, trong đó có 45 phút ban ngày rực rỡ và 45 phút ban đêm hoàn toàn trong bóng tối của Trái Đất. Em phải thiết kế hệ thống pin và điều phối điện để các thí nghiệm sinh học không bị gián đoạn.',
      en: 'The station orbits Earth every 90 minutes—45 minutes in sunlight, 45 minutes in dark Earth eclipse. Balance solar panels and battery storage to keep life support and science racks energized.',
    },
    nasaContext: {
      vi: 'Trạm ISS có diện tích tấm pin mặt trời rộng tương đương 8 sân bóng rổ, nạp đầy các khối pin Lithium-ion khổng lồ.',
      en: 'The ISS features 8 massive solar wings covering nearly an acre, charging huge lithium-ion battery banks.',
    },
    targetLocation: { vi: 'Quỹ Đạo Trạm Vũ Trụ Quốc Tế (ISS LEO 420 km)', en: 'International Space Station Orbit (420 km)' },
    nasaDatasetRef: 'NASA ISS Research & Technology Telemetry Overview',
    badgeId: 'badge_energy_guardian',
    badgeName: { vi: 'Hộ Vệ Năng Lượng', en: 'Energy Guardian' },
    badgeDesc: {
      vi: 'Điều phối hoàn hảo hệ thống lưu trữ và phân phối điện cho trạm không gian.',
      en: 'Mastered day/night orbital power cycling and energy storage management.',
    },
    budgetMax: { junior: 1400, engineer: 1200 },
    massMax: { junior: 1500, engineer: 1300 },
    scienceTarget: 300,
    anomalies: [
      {
        id: 'anomaly_battery_degrade',
        title: { vi: 'Phân Phối Quá Tải Khi Vào Vùng Bóng Tối', en: 'Eclipse Power Bus Overdraw' },
        symptom: {
          vi: 'Khi trạm vừa bay vào bóng tối Trái Đất, tất cả các khoang thí nghiệm bật máy sưởi cùng lúc khiến lưới điện sụt áp nghiêm trọng!',
          en: 'As the station enters orbital eclipse, science heater racks trigger simultaneously, causing a high-voltage bus drop!',
        },
        subsystem: 'battery',
        telemetryClue: {
          vi: 'Điện áp thanh cái DC giảm từ 120V xuống 92V. Nguy cơ mất điện khoang dưỡng khí.',
          en: 'DC main bus voltage dipped below nominal safety threshold. Risk of life support trip.',
        },
        options: [
          {
            id: 'fix_shed_noncritical',
            text: {
              vi: 'Tự động ngắt điện tạm thời các thiết bị không thiết yếu (Non-critical load shedding) và ưu tiên oxy cùng máy tính.',
              en: 'Initiate automated load shedding: prioritize life support and core avionics while deferring non-urgent lab heaters.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Chính xác! Giao thức phân cấp phụ tải là quy tắc an toàn số 1 của trạm không gian để bảo vệ tính mạng phi hành đoàn.',
              en: 'Spot on! Hierarchical load shedding is the fundamental safety protocol on crewed space platforms.',
            },
          },
          {
            id: 'fix_turn_on_all',
            text: {
              vi: 'Cắm thêm tất cả dây nguồn dự phòng để tăng dòng điện.',
              en: 'Bridge auxiliary cables to force maximum power throughput.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Cắm thêm dây khi nguồn pin đang quá tải sẽ làm nổ cầu chì chính và gây mất điện toàn trạm!',
              en: 'Overloading an already depleted battery bank blows main breaker fuses, creating a total station blackout.',
            },
          },
        ],
        nasaContext: {
          vi: 'Các phi hành gia NASA trên ISS vừa thay thế các khối pin niken-hydro cũ bằng pin Lithium-ion mới trong nhiều chuyến đi bộ ngoài không gian.',
          en: 'Astronauts conducted numerous spacewalks to swap older nickel-hydrogen batteries with advanced high-capacity Li-ion units.',
        },
      },
    ],
    reflectionQuestion: {
      vi: 'Tại sao việc tích trữ năng lượng trong pin lại quan trọng đối với các trạm không gian bay quanh Trái Đất?',
      en: 'Why is energy storage in rechargeable batteries vital for low Earth orbit space stations?',
    },
    reflectionAnswer: {
      vi: 'Vì cứ mỗi 45 phút trạm lại bay vào vùng khuất sau Trái Đất không có ánh Mặt Trời, nếu không có pin thì toàn bộ đèn và hệ thống oxy sẽ tắt ngấm!',
      en: 'Because stations enter the shadow of Earth 16 times a day. Without batteries, life support and experiments would lose all power in the dark.',
    },
  },
  {
    id: 'mission_04_robotic_arm',
    number: '04',
    title: { vi: 'Thử Thách Cánh Tay Robot', en: 'Robotic Arm Challenge' },
    subtitle: {
      vi: 'Lập trình điều khiển cánh tay cơ khí bắt tàu hàng tiếp tế ngoài không gian',
      en: 'Manipulate robotic joints to grapple cargo spacecraft in microgravity',
    },
    briefing: {
      vi: 'Tàu hàng tự hành chở đồ ăn và dụng cụ khoa học đang tiếp cận trạm ở khoảng cách 10 mét. Em cần điều khiển cánh tay robot đa khớp gắp chặt chốt neo và đưa tàu vào cửa nối ghép an toàn.',
      en: 'An uncrewed cargo resupply capsule is holding 10 meters outside the station. Operate the multi-joint robotic manipulator to grapple the capture pin safely without collision.',
    },
    nasaContext: {
      vi: 'Cánh tay robot Canadarm2 dài 17 mét trên ISS có 7 khớp xoay linh hoạt, có thể di chuyển như một con sâu đo khổng lồ quanh thân trạm.',
      en: 'The 17-meter Canadarm2 on ISS features 7 motorized rotary joints, capable of inchworming across the station exterior.',
    },
    targetLocation: { vi: 'Khoang ghép trạm ISS Harmony Module', en: 'Station Harmony Module Docking Port' },
    nasaDatasetRef: 'NASA Robotic Manipulator Tele-operations & Rendezvous Standards',
    badgeId: 'badge_robotics_expert',
    badgeName: { vi: 'Chuyên Gia Robot Vũ Trụ', en: 'Robotics Expert' },
    badgeDesc: {
      vi: 'Điều khiển cánh tay robot gắp tàu hàng thành công không gây va chạm.',
      en: 'Precision microgravity robotic capture and berthing operation completed.',
    },
    budgetMax: { junior: 1100, engineer: 980 },
    massMax: { junior: 1200, engineer: 1000 },
    scienceTarget: 260,
    anomalies: [
      {
        id: 'anomaly_joint_drift',
        title: { vi: 'Sai Lệch Góc Khớp Cổ Tay Robot', en: 'Robotic Wrist Joint Resolver Offset' },
        symptom: {
          vi: 'Cảm biến góc quay của khớp cổ tay robot bị lệch 3 độ do nhiệt độ thay đổi đột ngột giữa nắng và bóng tối, đầu gắp bị rung nhẹ.',
          en: 'Thermal gradient across the wrist joint causes a 3-degree resolver offset, vibrating the end-effector.',
        },
        subsystem: 'computer',
        telemetryClue: {
          vi: 'Encoder báo lỗi sai lệch vị trí mong muốn (Tracking error).',
          en: 'Joint servo controller flags closed-loop tracking deviation warning.',
        },
        options: [
          {
            id: 'fix_recalibrate_sensors',
            text: {
              vi: 'Dừng di chuyển, bật chế độ giữ cố định và chạy lệnh hiệu chuẩn zero cảm biến nhiệt độ tự động.',
              en: 'Hold position, lock brakes, and execute automated thermal resolver zero-point recalibration.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Chính xác! Hiệu chuẩn lại cảm biến trước khi tiếp tục thao tác giúp đầu gắp định vị chính xác milimét.',
              en: 'Excellent! Recalibrating joint encoders eliminates mechanical backlash and ensures millimeter-precision capture.',
            },
          },
          {
            id: 'fix_force_grab',
            text: {
              vi: 'Cố giật thật mạnh đầu kẹp vào chốt của tàu hàng.',
              en: 'Yank the end-effector aggressively to snatch the capsule pin.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Giật mạnh trong môi trường vi trọng lực sẽ làm hỏng chốt neo hoặc đẩy tàu hàng văng ra xa gây tai nạn!',
              en: 'Forcing the grapple in microgravity can snap capture cables or send the multi-ton capsule tumbling.',
            },
          },
        ],
        nasaContext: {
          vi: 'Để bắt tàu Cygnus hay Dragon, các phi hành gia phải luyện tập hàng trăm giờ trên máy mô phỏng VR tại Trung tâm Không gian Johnson.',
          en: 'Astronauts spend hundreds of hours training on virtual reality simulators at Johnson Space Center to master robotic capture.',
        },
      },
    ],
    reflectionQuestion: {
      vi: 'Tại sao cánh tay robot lại cần nhiều khớp xoay giống như cánh tay của con người?',
      en: 'Why do space robotic arms need multiple degrees of freedom similar to human arms?',
    },
    reflectionAnswer: {
      vi: 'Nhiều khớp xoay giúp cánh tay vươn tới mọi góc độ trong không gian 3 chiều và tránh va chạm vào các tấm pin xung quanh.',
      en: 'Multiple rotary joints provide degrees of freedom to reach any coordinate in 3D space while bending around obstacles like solar arrays.',
    },
  },
  {
    id: 'mission_05_space_telescope',
    number: '05',
    title: { vi: 'Thiết Kế Kính Thiên Văn Không Gian', en: 'Design A Space Telescope' },
    subtitle: {
      vi: 'Nhìn sâu vào thuở sơ khai của vũ trụ và tìm kiếm bầu khí quyển ngoại hành tinh',
      en: 'Peer into cosmic dawn and detect atmospheric signatures on distant exoplanets',
    },
    briefing: {
      vi: 'Kính thiên văn mặt đất bị cản trở bởi bầu khí quyển rung động và ô nhiễm ánh sáng. Em hãy thiết kế một đài quan sát không gian đặt tại điểm cân bằng Lagrange L2 để chụp những thiên hà xa xôi nhất.',
      en: 'Earth atmosphere blurs starlight. Engineer a space observatory stationed at Sun-Earth Lagrange Point 2 (L2) to image the earliest galaxies and spectra of alien worlds.',
    },
    nasaContext: {
      vi: 'Kính viễn vọng James Webb có gương mạ vàng đường kính 6.5m và tấm chắn nhiệt 5 lớp kích thước bằng sân tennis để giữ nhiệt độ ở mức -233°C.',
      en: 'The James Webb Space Telescope uses a 6.5m gold-coated beryllium mirror and a 5-layer tennis-court-sized sunshield keeping it at -233°C.',
    },
    targetLocation: { vi: 'Điểm Lagrange L2 (Cách Trái Đất 1.5 triệu km)', en: 'Sun-Earth Lagrange Point 2 (1.5M km from Earth)' },
    nasaDatasetRef: 'NASA Hubble & James Webb Space Telescope Archive (MAST / STScI)',
    badgeId: 'badge_space_visionary',
    badgeName: { vi: 'Kỹ Sư Tầm Nhìn Vũ Trụ', en: 'Space Visionary' },
    badgeDesc: {
      vi: 'Chế tạo đài thiên văn không gian thu thập hình ảnh tinh vân và thiên hà sâu.',
      en: 'Designed an orbital observatory capturing deep space nebulae and exoplanet spectra.',
    },
    budgetMax: { junior: 1500, engineer: 1350 },
    massMax: { junior: 1600, engineer: 1400 },
    scienceTarget: 350,
    anomalies: [
      {
        id: 'anomaly_reaction_wheel_jitter',
        title: { vi: 'Độ Rung Bánh Xe Phản Lực Làm Mờ Ảnh', en: 'Reaction Wheel Micro-Vibration Jitter' },
        symptom: {
          vi: 'Bánh đà phản lực quay ở tốc độ cao tạo rung động siêu nhỏ (Jitter) khiến ảnh chụp ngôi sao xa bị nhòe.',
          en: 'High-speed reaction wheels produce microscopic structural vibrations that blur long-exposure galactic exposures.',
        },
        subsystem: 'computer',
        telemetryClue: {
          vi: 'Cảm biến dẫn đường FGS báo độ ổn định góc lệch 0.05 giây cung.',
          en: 'Fine Guidance Sensor (FGS) registers pointing jitter exceeding scientific optical tolerance.',
        },
        options: [
          {
            id: 'fix_magnetic_damping',
            text: {
              vi: 'Kích hoạt bộ cách ly dao động từ tính chủ động và điều chỉnh tốc độ bánh đà tránh tần số cộng hưởng.',
              en: 'Engage active magnetic vibration isolation struts and desaturate wheels away from harmonic resonance.',
            },
            isCorrect: true,
            explanation: {
              vi: 'Rất chính xác! Cả Hubble và James Webb đều dùng hệ thống cô lập dao động để giữ ống kính đứng yên như tượng trong hàng giờ chụp ảnh.',
              en: 'Spot on! Both Hubble and Webb rely on ultra-precision vibration dampers to maintain arcsecond pointing stability during hours-long exposures.',
            },
          },
          {
            id: 'fix_spin_faster',
            text: {
              vi: 'Cho bánh xe quay nhanh gấp đôi để ổn định con quay.',
              en: 'Spin reaction wheels at double speed to overpower the vibration.',
            },
            isCorrect: false,
            explanation: {
              vi: 'Quay nhanh hơn sẽ càng làm tăng lực rung và có thể làm hỏng vòng bi của bánh đà phản lực!',
              en: 'Spinning wheels faster amplifies harmonic vibrations and risks catastrophic bearing failure.',
            },
          },
        ],
        nasaContext: {
          vi: 'Hubble bay quanh Trái Đất ở độ cao 540km, trong khi James Webb cách Trái Đất 1.5 triệu km nên không thể cử người bay đến sửa chữa trực tiếp.',
          en: 'Hubble was serviced in low Earth orbit by Space Shuttles, but Webb is 1.5 million km away at L2 where no human can travel to physically fix it.',
        },
      },
    ],
    reflectionQuestion: {
      vi: 'Tại sao các kính thiên văn không gian lớn như James Webb lại cần bay xa Trái Đất đến vậy?',
      en: 'Why do giant space telescopes like James Webb operate so far away from Earth?',
    },
    reflectionAnswer: {
      vi: 'Tại điểm L2, kính viễn vọng tránh được bức xạ nhiệt từ Trái Đất và Mặt Trời, giúp các cảm biến hồng ngoại giữ được độ lạnh cực sâu để nhìn thấy những ngôi sao đầu tiên của vũ trụ.',
      en: 'At L2, Webb stays shielded from Earth and Moon thermal glow, keeping its infrared sensors cryogenic (-233°C) to detect faint primordial light.',
    },
  },
];

export const BADGES: Badge[] = [
  {
    id: 'badge_mars_explorer',
    name: { vi: 'Nhà Thám Hiểm Sao Hỏa', en: 'Mars Explorer' },
    desc: {
      vi: 'Hoàn thành thiết kế và điều khiển xe tự hành thám hiểm Jezero Crater.',
      en: 'Designed and operated a rover traversing Martian terrain.',
    },
    icon: 'Compass',
    category: 'mission',
  },
  {
    id: 'badge_earth_observer',
    name: { vi: 'Người Bảo Vệ Trái Đất', en: 'Earth Observer' },
    desc: {
      vi: 'Vận hành vệ tinh quan sát khí hậu và truyền dữ liệu Trái Đất thời gian thực.',
      en: 'Operated an Earth observation satellite tracking climate telemetry.',
    },
    icon: 'Globe',
    category: 'mission',
  },
  {
    id: 'badge_energy_guardian',
    name: { vi: 'Hộ Vệ Năng Lượng', en: 'Energy Guardian' },
    desc: {
      vi: 'Cân bằng điện năng hoàn hảo trong chu kỳ sáng/tối của trạm vũ trụ.',
      en: 'Balanced microgravity space station power grid through orbital day and night.',
    },
    icon: 'Zap',
    category: 'engineering',
  },
  {
    id: 'badge_robotics_expert',
    name: { vi: 'Chuyên Gia Robot Vũ Trụ', en: 'Robotics Expert' },
    desc: {
      vi: 'Điều khiển cánh tay robot bắt tàu hàng ghép nối thành công.',
      en: 'Grappled space cargo capsule with robotic manipulator arm.',
    },
    icon: 'Cpu',
    category: 'engineering',
  },
  {
    id: 'badge_space_visionary',
    name: { vi: 'Kỹ Sư Tầm Nhìn Vũ Trụ', en: 'Space Visionary' },
    desc: {
      vi: 'Xây dựng kính viễn vọng không gian khám phá những thiên hà xa xôi.',
      en: 'Constructed space observatory surveying deep space cosmic dawn.',
    },
    icon: 'Sparkles',
    category: 'science',
  },
  {
    id: 'badge_diagnostic_master',
    name: { vi: 'Bậc Thầy Chẩn Đoán', en: 'Diagnostic Master' },
    desc: {
      vi: 'Phân tích telemetry và khắc phục thành công sự cố kỹ thuật ngoài không gian.',
      en: 'Accurately diagnosed telemetry anomalies and uploaded ground tele-command fixes.',
    },
    icon: 'Wrench',
    category: 'engineering',
  },
];
