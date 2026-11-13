import { MissionEquipmentProfile, MissionId } from '../types/game';

export const NASA_EQUIPMENT_PROFILES: MissionEquipmentProfile[] = [
  // =========================================================================
  // MISSION 01: PERSEVERANCE MARS ROVER
  // =========================================================================
  {
    missionId: 'mission_01_mars_rover',
    missionNumber: '01',
    equipmentName: {
      vi: 'Robot Tự Hành Perseverance (Mars 2020)',
      en: 'Perseverance Mars Rover (Mars 2020)',
    },
    agency: 'NASA / Jet Propulsion Laboratory (JPL)',
    heroImageUrl: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
    fallbackImageUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
    anatomyImageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/03/mars2020-callouts-body.png',
    whereItOperates: {
      vi: 'Bề mặt Sao Hỏa, tại miệng hố Jezero Crater (xưa kia từng là một hồ nước cổ đại)',
      en: 'Surface of Mars inside Jezero Crater (an ancient lakebed and river delta)',
    },
    shortTypeSummary: {
      vi: 'Một robot thám hiểm 6 bánh to bằng chiếc ô tô con, hoạt động như một nhà khoa học tự động trên Sao Hỏa.',
      en: 'A car-sized, 6-wheeled robotic explorer acting as an automated scientist on Mars.',
    },
    launchAndOrbit: {
      vi: 'Phóng: 30/07/2020 · Hạ cánh lên Sao Hỏa: 18/02/2021',
      en: 'Launched: July 30, 2020 · Landed on Mars: February 18, 2021',
    },
    galleryImages: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~medium.jpg',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Toàn cảnh Perseverance trên Sao Hỏa',
          en: 'Perseverance Selfie at Jezero Crater',
        },
        caption: {
          vi: 'Ảnh thật do robot tự chụp trên nền đất đá Jezero Crater cùng trực thăng Ingenuity phía xa.',
          en: 'Real NASA/JPL selfie on Martian soil in Jezero Crater with the Ingenuity helicopter.',
        },
        sourceLabel: 'NASA / JPL-Caltech (PIA24542)',
        mediaKind: 'real_photo',
        viewCategory: 'overview',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA23266/PIA23266~medium.jpg',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Cận cảnh đôi mắt camera Mastcam-Z & đầu robot',
          en: 'Close-Up of Mastcam-Z Eyes & Rover Head',
        },
        caption: {
          vi: 'Ảnh thật cận cảnh hai ống kính Mastcam-Z gắn trên đỉnh đầu robot giúp nhìn màu 3D siêu nét.',
          en: 'Real close-up photo of the twin Mastcam-Z stereo zoom eyes on Perseverance’s head.',
        },
        sourceLabel: 'NASA / JPL-Caltech (PIA23266)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/KSC-20200402-PH-JPL01_0002/KSC-20200402-PH-JPL01_0002~medium.jpg',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Cận cảnh bánh xe nhôm leo đá của robot',
          en: 'Close-Up of Aluminum Mars Wheels',
        },
        caption: {
          vi: 'Ảnh thật cận cảnh bánh xe hợp kim nhôm có các rãnh cong giúp bám chắc vào cát và đá.',
          en: 'Real close-up photo of Perseverance’s cleated aluminum wheels engineered for Mars rocks.',
        },
        sourceLabel: 'NASA / JPL-Caltech (KSC-20200402)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA25171/PIA25171~medium.jpg',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Đang lăn bánh thám hiểm trên Sao Hỏa',
          en: 'Driving Across Martian Soil',
        },
        caption: {
          vi: 'Ảnh thật Perseverance ngoái lại chụp vệt 6 bánh xe đang di chuyển trên lớp cát đỏ Sao Hỏa.',
          en: 'Real photo of Perseverance looking back at its 6-wheel tracks on Martian sand.',
        },
        sourceLabel: 'NASA / JPL-Caltech (PIA25171)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://science.nasa.gov/wp-content/uploads/2024/03/mars2020-callouts-body.png',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Sơ đồ cấu tạo các bộ phận trên thân Perseverance',
          en: 'Official NASA Labeled Rover Anatomy Diagram',
        },
        caption: {
          vi: 'Sơ đồ kỹ thuật chính thức của NASA chỉ rõ vị trí đầu camera, cánh tay, bánh xe, ăng-ten và nguồn điện.',
          en: 'Official NASA technical callout diagram labeling cameras, arm, wheels, antennas, and power.',
        },
        sourceLabel: 'NASA Science (Mars 2020)',
        mediaKind: 'technical_diagram',
        viewCategory: 'anatomy',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA25073/PIA25073~medium.jpg',
        fallbackUrl: '/src/assets/images/mars_jezero_delta_1794503039436.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Ống mẫu đá Sao Hỏa đầu tiên',
          en: 'Mission Goal: Sealed Martian Rock Sample Tube',
        },
        caption: {
          vi: 'Ảnh thật cận cảnh ống đựng lõi đá Sao Hỏa sạch bóng được niêm phong chờ đưa về Trái Đất.',
          en: 'Real close-up photo of a sterile sample tube holding Martian rock core inside Perseverance.',
        },
        sourceLabel: 'NASA / JPL-Caltech (PIA25073)',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
    ],
    preschool: {
      simpleName: {
        vi: 'Robot Sao Hỏa Perseverance',
        en: 'Perseverance Mars Robot',
      },
      badgeEmoji: '🤖',
      whatIsItSpeech: {
        vi: 'Xin chào bé! Đây là robot Perseverance. Bạn ấy là một chú robot thông minh đang thám hiểm hành tinh Đỏ sao Hỏa đấy!',
        en: 'Hello explorer! This is Perseverance, a smart robot exploring the Red Planet Mars!',
      },
      usedForShort: {
        vi: 'Robot khám phá sao Hỏa, chụp ảnh và tìm hiểu đá trên sao Hỏa.',
        en: 'A Mars explorer robot that takes pictures and studies rocks on Mars.',
      },
      usedForSpeech: {
        vi: 'Perseverance là robot khám phá sao Hỏa, chụp ảnh và tìm hiểu các viên đá trên sao Hỏa.',
        en: 'Perseverance explores Mars, takes pictures, and studies rocks on the Martian surface.',
      },
      parts: [
        {
          id: 'p_eyes',
          simpleName: { vi: 'Đôi mắt camera (Mastcam-Z)', en: 'Camera Eyes (Mastcam-Z)' },
          shortRole: {
            vi: 'Nhìn đường và chụp ảnh màu rõ nét trên sao Hỏa.',
            en: 'Sees the path and takes crisp color photos on Mars.',
          },
          voiceLine: {
            vi: 'Đây là đôi mắt camera! Giúp robot nhìn rõ đường đi và chụp ảnh sao Hỏa thật đẹp.',
            en: 'These are the camera eyes! They help the robot see the path and take clear Mars photos.',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/PIA23266/PIA23266~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn trên đỉnh cột cổ cao phía trước đầu robot',
            en: 'Mounted high on the front mast head',
          },
          hotspotCoords: { x: 63, y: 21 },
          icon: 'Eye',
          sourceIndex: 1,
        },
        {
          id: 'p_wheels',
          simpleName: { vi: '6 bánh xe leo đá', en: '6 Climbing Wheels' },
          shortRole: {
            vi: 'Lăn trên cát đỏ và trèo qua đá gồ ghề an toàn.',
            en: 'Rolls over red sand and climbs bumpy rocks safely.',
          },
          voiceLine: {
            vi: 'Robot có tới 6 bánh xe thật khỏe! Giúp bạn ấy đi trên cát và trèo qua đá.',
            en: 'The robot has 6 strong wheels to roll across sand and climb over rocks!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/KSC-20200402-PH-JPL01_0002/KSC-20200402-PH-JPL01_0002~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: '6 bánh xe bằng nhôm xếp hai bên phía dưới thân xe',
            en: 'Six aluminum wheels lined along the bottom sides',
          },
          hotspotCoords: { x: 48, y: 74 },
          icon: 'Compass',
          sourceIndex: 0,
        },
        {
          id: 'p_arm',
          simpleName: { vi: 'Cánh tay gắp & khoan đá', en: 'Rock-Drilling Arm' },
          shortRole: {
            vi: 'Vươn ra chạm, quét và lấy các mẫu đá nhỏ.',
            en: 'Reaches out to touch and drill small rock samples.',
          },
          voiceLine: {
            vi: 'Đây là cánh tay robot! Bạn ấy vươn tay ra nhặt các viên đá nhỏ để khám phá.',
            en: 'This is the robot arm! It reaches out to touch and collect tiny rocks.',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24338/PIA24338~small.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn ở đầu mũi xe phía trước để vươn tới tảng đá',
            en: 'Attached at the front nose to reach rock targets',
          },
          hotspotCoords: { x: 24, y: 58 },
          icon: 'Wrench',
          sourceIndex: 0,
        },
        {
          id: 'p_antenna',
          simpleName: { vi: 'Ăng-ten gửi tin về Trái Đất', en: 'Earth Dish Antenna' },
          shortRole: {
            vi: 'Gửi ảnh và dữ liệu từ sao Hỏa bay về Trái Đất.',
            en: 'Sends photos and science data from Mars back to Earth.',
          },
          voiceLine: {
            vi: 'Còn đây là chiếc ăng-ten trên lưng robot! Giúp gửi ảnh từ sao Hỏa về Trái Đất cho chúng mình xem.',
            en: 'Here is the antenna on the rover deck! It sends photos from Mars all the way back to Earth.',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24045/PIA24045~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Đặt trên lưng thân xe phía sau cột camera',
            en: 'Mounted on the top deck behind the camera mast',
          },
          hotspotCoords: { x: 52, y: 39 },
          icon: 'Radio',
          sourceIndex: 1,
        },
        {
          id: 'p_power',
          simpleName: { vi: 'Trái tim năng lượng MMRTG', en: 'Day & Night Power Pack' },
          shortRole: {
            vi: 'Tạo ra điện ấm áp giúp robot chạy cả ngày lẫn đêm.',
            en: 'Produces steady warmth and electricity day and night.',
          },
          voiceLine: {
            vi: 'Đây là bộ nguồn năng lượng đặc biệt gắn sau đuôi xe giúp robot luôn khỏe mạnh ngay cả khi có bão bụi!',
            en: 'This special power unit at the back keeps the rover running even during dust storms!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24233/PIA24233~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn nghiêng ở đuôi sau của thân robot',
            en: 'Mounted at the rear tail of the rover body',
          },
          hotspotCoords: { x: 80, y: 50 },
          icon: 'Sun',
          sourceIndex: 1,
        },
      ],
      funFact: {
        vi: 'Robot Perseverance còn mang theo một bạn trực thăng tí hon biết bay trên sao Hỏa đấy!',
        en: 'Perseverance carried a tiny helicopter friend that flies in the sky of Mars!',
      },
      funFactSpeech: {
        vi: 'Em có biết không? Robot Perseverance còn mang theo một người bạn trực thăng tí hon biết bay trên sao Hỏa đấy!',
        en: 'Did you know? Perseverance brought along a tiny helicopter friend that actually flies on Mars!',
      },
    },
    introKid: {
      whatIsIt: {
        vi: 'Perseverance là xe robot thám hiểm hiện đại nhất của NASA trên Sao Hỏa, mang theo camera 3D, tia laser phân tích đá và máy khoan lấy mẫu.',
        en: 'Perseverance is NASA’s most advanced Mars rover, carrying 3D cameras, a rock-analyzing laser, and a core drill.',
      },
      purpose: {
        vi: 'Tìm dấu vết của sự sống vi sinh cổ đại, nghiên cứu đất đá Sao Hỏa và cất mẫu đá vào ống sạch chờ tàu tương lai mang về Trái Đất.',
        en: 'Search for signs of ancient microbial life, study Martian rocks, and seal rock tubes for future return to Earth.',
      },
      howItWorks: {
        vi: 'Robot tự nhìn đường bằng camera, lái 6 bánh vượt đá, bắn tia laser kiểm tra thành phần đá từ xa rồi vươn tay robot khoan mẫu và gửi dữ liệu qua vệ tinh Sao Hỏa về Trái Đất.',
        en: 'It scouts terrain with cameras, drives on 6 wheels, analyzes rocks with a laser, drills cores with its arm, and relays data to Earth.',
      },
      missionObjectives: [
        {
          icon: 'Search',
          title: { vi: 'Tìm dấu vết sự sống cổ đại', en: 'Search for Ancient Life' },
          desc: {
            vi: 'Kiểm tra đất đá nơi từng là hồ nước xưa xem vi sinh vật từng sống ở đó hay không.',
            en: 'Study ancient lake sediments for signs that tiny microbes once lived on Mars.',
          },
        },
        {
          icon: 'Layers',
          title: { vi: 'Thu thập & cất giữ mẫu đá', en: 'Collect & Seal Rock Samples' },
          desc: {
            vi: 'Khoan các lõi đá cho vào ống kim loại siêu sạch để sứ mệnh sau mang về Trái Đất.',
            en: 'Drill rock cores into sterile metal tubes for future return to Earth labs.',
          },
        },
        {
          icon: 'Sun',
          title: { vi: 'Khảo sát khí hậu & địa chất', en: 'Study Geology & Climate' },
          desc: {
            vi: 'Chụp ảnh các lớp đá, đo gió, bụi và nhiệt độ để hiểu lịch sử hành tinh Đỏ.',
            en: 'Map rock layers and measure weather to learn how Mars changed over time.',
          },
        },
        {
          icon: 'Rocket',
          title: { vi: 'Thử công nghệ cho phi hành gia', en: 'Test Tech for Future Humans' },
          desc: {
            vi: 'Thử tạo khí oxy từ không khí Sao Hỏa để chuẩn bị cho con người đặt chân tới đây.',
            en: 'Demonstrate oxygen production from Martian air to prepare for astronauts.',
          },
        },
      ],
      workflowSteps: [
        {
          step: 1,
          title: { vi: 'Quan sát xung quanh', en: 'Look Around' },
          desc: {
            vi: 'Camera trên cột cao chụp ảnh 3D và tìm đường an toàn tránh đá nhọn.',
            en: 'Mast and hazard cameras capture 3D views to spot safe paths.',
          },
          icon: 'Eye',
        },
        {
          step: 2,
          title: { vi: 'Di chuyển tới mục tiêu', en: 'Drive Safely' },
          desc: {
            vi: 'Hệ thống 6 bánh nhôm tự bò chậm rãi trên cát và sỏi tới tảng đá cần nghiên cứu.',
            en: 'Six motorized aluminum wheels roll over sand and rocks to the target.',
          },
          icon: 'Compass',
        },
        {
          step: 3,
          title: { vi: 'Phân tích đá từ xa', en: 'Scan with Laser' },
          desc: {
            vi: 'Thiết bị SuperCam bắn tia laser vào đá để xem bên trong có khoáng chất gì.',
            en: 'SuperCam zaps the rock with a laser to read its chemical ingredients.',
          },
          icon: 'Sparkles',
        },
        {
          step: 4,
          title: { vi: 'Khoan & cất mẫu', en: 'Drill & Seal' },
          desc: {
            vi: 'Cánh tay robot vươn ra khoan lõi đá nhỏ bằng viên phấn và niêm phong kín.',
            en: 'The robotic arm drills a chalk-sized core and seals it in a clean tube.',
          },
          icon: 'Wrench',
        },
        {
          step: 5,
          title: { vi: 'Gửi dữ liệu về Trái Đất', en: 'Send to Earth' },
          desc: {
            vi: 'Anten truyền ảnh và số liệu lên vệ tinh bay quanh Sao Hỏa để phát về Trái Đất.',
            en: 'Antennas beam photos and data to Mars orbiters that relay them to Earth.',
          },
          icon: 'Radio',
        },
      ],
      keyParts: [
        {
          name: 'Mast & Mastcam-Z',
          role: {
            vi: 'Cột cổ cao và đôi mắt camera zoom giúp robot nhìn toàn cảnh.',
            en: 'Tall neck mast and zoom eyes for panoramic 3D views.',
          },
        },
        {
          name: 'SuperCam',
          role: {
            vi: 'Bắn tia laser phân tích thành phần đá từ cách xa vài mét.',
            en: 'Laser spectrometer studying rock chemistry from meters away.',
          },
        },
        {
          name: 'Robotic Arm & Sample Caching System',
          role: {
            vi: 'Cánh tay dài 2,1 m khoan đá và cất ống mẫu siêu sạch.',
            en: '2.1 m arm and internal drill carousel sealing rock samples.',
          },
        },
        {
          name: 'Navcams, Hazcams & Antennas',
          role: {
            vi: 'Camera tìm đường tránh đá ngầm và anten liên lạc về Trái Đất.',
            en: 'Pathfinding/hazard eyes and antennas beaming data home.',
          },
        },
      ],
      funFacts: {
        vi: [
          'Perseverance mang theo micro thu được âm thanh thật đầu tiên của gió Sao Hỏa và tiếng tia laser nổ tách tách trên đá!',
          'Dưới bụng xe từng chở chiếc trực thăng tí hon Ingenuity — cỗ máy đầu tiên bay được trên hành tinh khác.',
          'Vì Sao Hỏa quá xa, tín hiệu radio từ Trái Đất mất từ 4 đến 24 phút mới bay tới nơi nên robot phải tự tránh đá bằng trí tuệ máy tính!',
        ],
        en: [
          'Perseverance carries microphones that recorded the first real sounds of Martian wind and laser zaps!',
          'It carried the tiny Ingenuity helicopter—the first aircraft to make a powered flight on another planet.',
          'Radio signals take 4 to 24 minutes each way between Earth and Mars, so Perseverance drives itself autonomously.',
        ],
      },
    },
    detailedArchive: {
      overview: {
        vi: 'Perseverance hoạt động trên miệng hố Jezero từ tháng 2/2021. Do nhiệt độ Sao Hỏa ban đêm rất lạnh (dưới -90°C), bên trong thân xe được giữ ấm và cấp điện liên tục bằng máy phát hạt nhân MMRTG nên không sợ bão bụi che nắng.',
        en: 'Operating in Jezero Crater since February 2021, Perseverance houses its computers inside a heated body and runs 24/7 on an MMRTG nuclear power source unaffected by dust storms.',
      },
      missionAndPurpose: {
        vi: 'Mục tiêu lớn nhất là tìm hiểu xem Jezero Crater — nơi xưa kia là hồ nước có sông chảy vào — từng có môi trường thuận lợi cho vi sinh vật hay không, đồng thời cất giữ những mẫu đá quý giá nhất vào các ống titan.',
        en: 'Its top goal is exploring whether ancient Lake Jezero could have supported microbial life, while sealing the best rock cores inside ultra-clean titanium tubes.',
      },
      operatingPrinciple: {
        vi: 'Robot phối hợp camera nhìn đường, máy tính tự lái, cánh tay khoan mẫu và mạng lưới truyền tin: gần 99,9% ảnh nặng được phát lên vệ tinh quỹ đạo Sao Hỏa (như MRO, MAVEN) rồi truyền tiếp về Mạng Không Gian Sâu (DSN) của NASA trên Trái Đất.',
        en: 'Cameras and onboard computers navigate around rocks automatically, while ~99.9% of science photos relay through Mars orbiters before reaching NASA’s Deep Space Network on Earth.',
      },
      technicalHighlight: {
        title: {
          vi: 'Mạng liên lạc 2 tầng: Vệ tinh tiếp sóng + Đĩa trực tiếp',
          en: 'Two-Way Mars Link: Orbiter Relay + Direct Earth Dish',
        },
        content: {
          vi: 'Anten UHF gửi ảnh dung lượng lớn lên tàu quỹ đạo bay ngang qua đầu ở tốc độ cao (giống gửi file qua trạm phát Wi-Fi trên trời). Còn anten đĩa High-Gain hướng thẳng về Trái Đất để nhận lịch làm việc mỗi sáng từ các kỹ sư NASA.',
          en: 'The UHF antenna uploads heavy photos quickly to overhead Mars orbiters (like an orbital Wi-Fi hotspot), while the steerable High-Gain dish receives daily commands directly from Earth.',
        },
      },
      simulationNote: {
        vi: 'Trong màn chơi mô phỏng game, tình huống bão bụi làm sụt điện pin Mặt Trời hoặc lún cát được tạo ra (GAME SIMULATION) giúp bạn tập làm kỹ sư chẩn đoán lỗi; ngoài đời thực Perseverance dùng nguồn điện hạt nhân MMRTG.',
        en: 'In-game solar dust storm and wheel stall puzzles are GAME SIMULATIONS for engineering practice; the real Perseverance uses an MMRTG nuclear generator.',
      },
      components: [
        {
          id: 'pers_mast',
          name: 'Mast',
          shortDesc: {
            vi: 'Cột nâng cao đặt phía trước thân xe, giúp đưa cụm camera và cảm biến lên tầm nhìn ngang người đứng (~2 m).',
            en: 'Tall vertical post elevating cameras and sensors to human eye level (~2 m above Mars).',
          },
          functionDesc: {
            vi: 'Cột có thể xoay ngang 360° và gật lên xuống để robot quan sát toàn cảnh xung quanh trước khi quyết định di chuyển hoặc khoan đá.',
            en: 'Swivels 360° and tilts up and down so the rover can survey the entire landscape before driving or sampling.',
          },
          analogy: {
            vi: 'Bộ phận này giống như chiếc cổ của robot giúp nâng "đầu và mắt" lên cao để nhìn xa hơn.',
            en: 'This part is like the rover’s neck, raising its head and eyes high above rocks.',
          },
          icon: 'Compass',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24932/PIA24932~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Đỉnh cột Mast của Perseverance trên Sao Hỏa (NASA/JPL).',
            en: 'Real photo: Top of Perseverance’s Remote Sensing Mast on Mars (NASA/JPL).',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'pers_mastcam_z',
          name: 'Mastcam-Z',
          shortDesc: {
            vi: 'Cặp camera chính có khả năng phóng to (zoom) và chụp ảnh màu 3D siêu nét địa hình Sao Hỏa.',
            en: 'Dual zoomable color stereo cameras capturing high-definition 3D terrain panoramas.',
          },
          functionDesc: {
            vi: 'Hai ống kính đặt song song như hai mắt người giúp đo khoảng cách, quan sát chi tiết vân đá nhỏ từ xa và giúp nhà khoa học chọn vị trí khoan mẫu.',
            en: 'Mounted side by side like human eyes, these zoom lenses judge distances and inspect rock textures from far away.',
          },
          analogy: {
            vi: 'Bộ phận này giống như đôi mắt có gắn ống nhòm siêu nét của robot.',
            en: 'This part is like a pair of eagle eyes with built-in zoom binoculars.',
          },
          icon: 'Camera',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24444/PIA24444~small.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cụm camera Mastcam-Z xoay chụp toàn cảnh 360° trên Sao Hỏa.',
            en: 'Real photo: Mastcam-Z camera pair capturing a 360° Mars panorama.',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'pers_supercam',
          name: 'SuperCam',
          shortDesc: {
            vi: 'Thiết bị gắn trên đỉnh đầu robot dùng tia laser và máy tách ánh sáng (quang phổ kế) để nghiên cứu đá từ xa.',
            en: 'Head-mounted laser and light analyzer (spectrometer) studying rocks from meters away.',
          },
          functionDesc: {
            vi: 'SuperCam bắn chùm laser vào tảng đá cách tới 7 m làm bay hơi một chấm tí hon, rồi đọc ánh sáng phát ra để biết đá chứa nguyên tố hóa học gì (kèm micro nghe tiếng nổ!).',
            en: 'Fires an invisible laser beam up to 7 m away, analyzes the glowing plasma spark to read rock minerals, and listens with its microphone.',
          },
          analogy: {
            vi: 'Bộ phận này giống như kính xét nghiệm bằng tia laser giúp "nếm" thử thành phần đá mà không cần chạm tay.',
            en: 'This part is like a laser scanner that reads what a rock is made of without touching it.',
          },
          icon: 'Sparkles',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24426/PIA24426~small.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Minh họa chính thức từ NASA/JPL: Tia laser của SuperCam chiếu vào tảng đá Sao Hỏa.',
            en: 'Official NASA/JPL visual: SuperCam firing its laser at a Martian rock.',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'pers_navcams',
          name: 'Navigation Cameras (Navcams)',
          shortDesc: {
            vi: 'Cặp camera đen trắng/màu hỗ trợ xác định đường đi và lập bản đồ địa hình 3D.',
            en: 'Stereo navigation cameras mapping terrain ahead to plan safe driving routes.',
          },
          functionDesc: {
            vi: 'Chụp ảnh góc rộng phía trước để kỹ sư và máy tính tự lái của robot tính toán đường đi vòng qua hố cát và đá lớn.',
            en: 'Takes wide-angle stereo views so Earth planners and onboard software chart safe routes across dunes and rocks.',
          },
          analogy: {
            vi: 'Bộ phận này giống như camera dẫn đường trên ô tô tự lái giúp xem trước con đường phía trước.',
            en: 'This part is like a self-driving car’s navigation camera checking the road ahead.',
          },
          icon: 'Eye',
          imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/03/mars2020-callouts-body.png',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Sơ đồ chú thích chính thức từ NASA chỉ vị trí Navcams và các bộ phận trên thân Perseverance.',
            en: 'Official NASA labeled diagram showing Navcams and major rover components.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'pers_hazcams',
          name: 'Hazard Avoidance Cameras (Hazcams)',
          shortDesc: {
            vi: '6 camera gắn thấp phía trước và phía sau thân xe để phát hiện chướng ngại vật ở cự ly gần.',
            en: '6 low-mounted cameras at the front and back watching for nearby boulders and drop-offs.',
          },
          functionDesc: {
            vi: 'Giúp robot tự động dừng phanh ngay khi thấy tảng đá nhọn, hố sâu hoặc mép vực trước bánh xe và khi cánh tay robot sắp vươn ra.',
            en: 'Triggers automatic stops if sharp rocks or steep ditches threaten the wheels, and watches the robotic arm workspace.',
          },
          analogy: {
            vi: 'Bộ phận này giống như cảm biến lùi & cảnh báo va chạm giúp xe không bị sập hố.',
            en: 'This part is like car bumper sensors that warn right before hitting an obstacle.',
          },
          icon: 'AlertTriangle',
          imageUrl:
            'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/resources/detail_files/2/4/24223_PIA23316-web.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Các ống kính camera phía trước của Perseverance khi thử nghiệm tại JPL.',
            en: 'Real photo: Front engineering camera lenses on Perseverance at NASA/JPL.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'pers_arm',
          name: 'Robotic Arm',
          shortDesc: {
            vi: 'Cánh tay robot dài ~2,1 m gồm 5 khớp linh hoạt gắn ở đầu xe dùng để thao tác trực tiếp với đá.',
            en: 'A 2.1-meter, 5-jointed mechanical arm reaching out to touch and drill Martian rocks.',
          },
          functionDesc: {
            vi: 'Ở đầu cánh tay có mâm xoay nặng ~45 kg mang mũi khoan và các máy quét cận cảnh, đưa sát vào bề mặt đá giống bàn tay nhà địa chất.',
            en: 'Holds a turret packed with drills and close-up scanners right against rock faces like a human geologist’s arm.',
          },
          analogy: {
            vi: 'Bộ phận này giống như cánh tay có vai, khuỷu và bàn tay cầm búa khoan của nhà thám hiểm.',
            en: 'This part is like a geologist’s arm reaching out with tools to examine a rock.',
          },
          icon: 'Wrench',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24338/PIA24338~small.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cánh tay robot Perseverance vươn ra thử nghiệm hoạt động ngay trên Sao Hỏa.',
            en: 'Real photo: Perseverance flexing its robotic arm on Mars.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'pers_scs',
          name: 'Sample Caching System',
          shortDesc: {
            vi: 'Hệ thống khoan lõi đá và niêm phong vào các ống mẫu vật siêu sạch nằm trong bụng xe.',
            en: 'Internal drill and carousel system sealing Martian rock cores into clean titanium tubes.',
          },
          functionDesc: {
            vi: 'Lõi đá sau khi khoan sẽ được chụp ảnh, đo khối lượng rồi đóng nắp kín hoàn toàn trong 43 ống mẫu để không bị bụi bẩn lẫn vào.',
            en: 'Photographs, weighs, and hermetically seals drilled rock cores inside ultra-clean sample tubes.',
          },
          analogy: {
            vi: 'Bộ phận này giống như hộp thí nghiệm vô trùng tự động đóng gói mẫu vật gửi về Trái Đất.',
            en: 'This part is like a sterile automated lab packing precious rock souvenirs for Earth.',
          },
          icon: 'Database',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA25073/PIA25073~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cận cảnh ống đựng mẫu vật kim loại sạch bóng trên robot Perseverance.',
            en: 'Real photo: Close-up of a pristine sample tube inside Perseverance.',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
        {
          id: 'pers_antennas',
          name: 'Antennas',
          shortDesc: {
            vi: 'Bộ 3 anten gắn trên lưng robot để truyền dữ liệu qua vệ tinh Sao Hỏa và liên lạc trực tiếp Trái Đất.',
            en: 'Three antennas on the rover deck linking to Mars orbiters and Earth’s Deep Space Network.',
          },
          functionDesc: {
            vi: 'Gồm anten UHF phát ảnh nặng lên vệ tinh bay trên đầu, anten đĩa High-Gain nhận lệnh thẳng từ Trái Đất và anten dự phòng Low-Gain.',
            en: 'Uses a UHF antenna for fast orbiter relays, a steerable dish for direct Earth commands, and a wide-beam backup antenna.',
          },
          analogy: {
            vi: 'Bộ phận này giống như bộ đàm siêu xa kết hợp chảo thu sóng truyền tin xuyên hàng trăm triệu km.',
            en: 'This part is like a deep-space walkie-talkie and satellite dish combined.',
          },
          icon: 'Radio',
          imageUrl: 'https://images-assets.nasa.gov/image/PIA24045/PIA24045~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Phần lưng Perseverance với đĩa anten High-Gain màu trắng (NASA/JPL).',
            en: 'Real photo: Perseverance deck showing the white High-Gain Antenna dish (NASA/JPL).',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
      ],
    },
    sources: [
      {
        title: 'NASA Science: Mars 2020 Perseverance Mission',
        organization: 'NASA/JPL',
        url: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
      },
      {
        title: 'NASA/JPL: Perseverance Rover Components & Communications',
        organization: 'NASA/JPL',
        url: 'https://science.nasa.gov/mission/mars-2020-perseverance/rover-components/',
      },
      {
        title: 'NASA/JPL: Perseverance Science Instruments',
        organization: 'NASA/JPL',
        url: 'https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/',
      },
      {
        title: 'NASA Science: Mars Rock Samples & Caching',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/',
      },
      {
        title: 'NASA 3D Resources (Spacecraft & Mars Models)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/3d-resources/',
      },
      {
        title: 'NASA Image and Video Library',
        organization: 'NASA',
        url: 'https://images.nasa.gov/',
      },
    ],
  },

  // =========================================================================
  // MISSION 02: LANDSAT 9 EARTH OBSERVATION SATELLITE
  // =========================================================================
  {
    missionId: 'mission_02_earth_satellite',
    missionNumber: '02',
    equipmentName: {
      vi: 'Vệ Tinh Quan Sát Trái Đất Landsat 9',
      en: 'Landsat 9 Earth Observation Satellite',
    },
    agency: 'NASA & USGS',
    heroImageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/2023/09/L9-Stills-Cover-3.png',
    fallbackImageUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
    anatomyImageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/landsat-9-mission-page/L9-sketch-thumbnail_rotated.png',
    whereItOperates: {
      vi: 'Quỹ đạo vòng quanh Trái Đất ở độ cao ~705 km (đi qua gần hai cực Bắc – Nam)',
      en: 'Orbiting Earth at ~705 km altitude (flying nearly from pole to pole)',
    },
    shortTypeSummary: {
      vi: 'Một "máy ảnh vũ trụ" khổng lồ quay quanh Trái Đất để chụp lại sức khỏe rừng cây, sông hồ và khí hậu.',
      en: 'A giant space camera orbiting Earth to monitor forests, rivers, farms, and surface temperature.',
    },
    launchAndOrbit: {
      vi: 'Phóng: 27/09/2021 từ California (Mỹ) · Cứ 16 ngày chụp lặp lại toàn Trái Đất',
      en: 'Launched: September 27, 2021 · Scans the entire Earth every 16 days',
    },
    galleryImages: [
      {
        url: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/2023/09/L9-Stills-Cover-3.png',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Toàn cảnh vệ tinh Landsat 9 trên quỹ đạo',
          en: 'Landsat 9 Orbiting Earth',
        },
        caption: {
          vi: 'Minh họa kỹ thuật chính thức của NASA: Landsat 9 mở tấm pin Mặt Trời khi bay phía trên Trái Đất.',
          en: 'Official NASA visual of Landsat 9 flying over Earth with its deployed solar wing.',
        },
        sourceLabel: 'NASA Science',
        mediaKind: 'technical_diagram',
        viewCategory: 'overview',
      },
      {
        url: 'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/09/oli2atballpic-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Cận cảnh máy ảnh đa phổ OLI-2 thật',
          en: 'Close-Up of the Real OLI-2 Earth Camera',
        },
        caption: {
          vi: 'Ảnh thật thiết bị máy ảnh OLI-2 của Landsat 9 đang được kiểm tra trước khi lắp lên vệ tinh.',
          en: 'Real NASA photo of Landsat 9’s OLI-2 optical sensor before integration.',
        },
        sourceLabel: 'NASA Science (OLI-2)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/04/GSFC_20181009_TIRS2_33878_EnvironmentalTesting.png/jcr:content/renditions/cq5dam.web.1280.1280.png',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Cận cảnh cảm biến đo nhiệt TIRS-2 thật',
          en: 'Close-Up of Thermal Sensor TIRS-2',
        },
        caption: {
          vi: 'Ảnh thật cảm biến TIRS-2 tại NASA Goddard chuyên đo độ ấm nóng của mặt đất và đại dương.',
          en: 'Real NASA Goddard photo of the TIRS-2 thermal infrared sensor.',
        },
        sourceLabel: 'NASA Goddard (TIRS-2)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/NHQ202109260004/NHQ202109260004~medium.jpg',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Vệ tinh Landsat 9 thật trước giờ phóng tên lửa',
          en: 'Real Landsat 9 Spacecraft Launch Prep',
        },
        caption: {
          vi: 'Ảnh thật vệ tinh Landsat 9 gắn trên bệ phóng tên lửa Atlas V sẵn sàng bay lên quỹ đạo.',
          en: 'Real NASA photo of Landsat 9 atop its Atlas V rocket before launch.',
        },
        sourceLabel: 'NASA (NHQ202109260004)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/OLI2-TIRS-2.PNG',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Sơ đồ vị trí máy ảnh OLI-2 và cảm biến TIRS-2',
          en: 'USGS Diagram of OLI-2 & TIRS-2 Instruments',
        },
        caption: {
          vi: 'Sơ đồ chính thức của USGS chỉ vị trí hai cảm biến quét mặt đất gắn dưới thân Landsat 9.',
          en: 'Official USGS technical diagram pinpointing OLI-2 and TIRS-2 on the spacecraft.',
        },
        sourceLabel: 'USGS Landsat Missions',
        mediaKind: 'technical_diagram',
        viewCategory: 'anatomy',
      },
      {
        url: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/150000/150482/elizabethtown_oli2_2022281.jpg',
        fallbackUrl: '/src/assets/images/satellite_earth_orbit_1794503041148.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Ảnh rừng và sông từ Landsat 9',
          en: 'Mission Result: Forests & Valleys Seen from Orbit',
        },
        caption: {
          vi: 'Ảnh thật do Landsat 9 chụp xuống Trái Đất giúp theo dõi rừng cây, đồng ruộng và dòng sông.',
          en: 'Real Earth photo taken by Landsat 9 OLI-2 showing colorful autumn forests and rivers.',
        },
        sourceLabel: 'NASA Earth Observatory / USGS',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
    ],
    preschool: {
      simpleName: {
        vi: 'Vệ Tinh Landsat 9',
        en: 'Landsat 9 Satellite',
      },
      badgeEmoji: '🛰️',
      whatIsItSpeech: {
        vi: 'Bé nhìn kìa! Đây là vệ tinh Landsat 9. Bạn ấy bay cao trên bầu trời để ngắm nhìn Trái Đất của chúng mình!',
        en: 'Look up high! This is Landsat 9, a satellite flying above Earth to watch over our planet!',
      },
      usedForShort: {
        vi: 'Vệ tinh chụp ảnh Trái Đất, giúp con người quan sát rừng, biển và đất đai.',
        en: 'A satellite that photographs Earth to help us watch forests, oceans, and land.',
      },
      usedForSpeech: {
        vi: 'Landsat 9 là vệ tinh chụp ảnh Trái Đất, giúp con người quan sát rừng xanh, biển cả và đất đai.',
        en: 'Landsat 9 photographs Earth from space so people can care for forests, oceans, and land.',
      },
      parts: [
        {
          id: 'l9_cam_kid',
          simpleName: { vi: 'Máy ảnh chụp Trái Đất (OLI-2)', en: 'Earth Camera (OLI-2)' },
          shortRole: {
            vi: 'Chụp ảnh màu sắc rừng cây, sông hồ và đại dương.',
            en: 'Takes crisp photos of forests, rivers, and oceans.',
          },
          voiceLine: {
            vi: 'Đây là máy ảnh siêu nét! Giúp vệ tinh chụp lại màu xanh của rừng cây và biển cả.',
            en: 'This is the Earth camera! It takes colorful pictures of green forests and blue oceans.',
          },
          imageUrl:
            'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/09/oli2atballpic-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn ở mặt dưới thân vệ tinh hướng thẳng xuống Trái Đất',
            en: 'Mounted underneath the satellite facing straight toward Earth',
          },
          hotspotCoords: { x: 52, y: 66 },
          icon: 'Camera',
          sourceIndex: 2,
        },
        {
          id: 'l9_heat_kid',
          simpleName: { vi: 'Mắt đo nóng lạnh (TIRS-2)', en: 'Warm & Cool Eye (TIRS-2)' },
          shortRole: {
            vi: 'Xem chỗ nào trên Trái Đất đang ấm hay mát.',
            en: 'Checks which places on Earth are warm or cool.',
          },
          voiceLine: {
            vi: 'Đây là mắt đo nóng lạnh! Giúp biết khu rừng hay dòng sông nào đang bị nóng quá.',
            en: 'This is the warm and cool eye! It checks where land or water is getting too hot.',
          },
          imageUrl:
            'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/04/GSFC_20181009_TIRS2_33878_EnvironmentalTesting.png/jcr:content/renditions/cq5dam.web.1280.1280.png',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Đặt ngay bên cạnh máy ảnh OLI-2 ở bụng vệ tinh',
            en: 'Seated right beside OLI-2 on the Earth-facing deck',
          },
          hotspotCoords: { x: 64, y: 62 },
          icon: 'Sun',
          sourceIndex: 3,
        },
        {
          id: 'l9_solar_kid',
          simpleName: { vi: 'Cánh pin Mặt Trời lớn', en: 'Solar Power Wing' },
          shortRole: {
            vi: 'Đón ánh nắng để tạo điện cho vệ tinh làm việc.',
            en: 'Catches sunlight to make electricity for the satellite.',
          },
          voiceLine: {
            vi: 'Cánh pin Mặt Trời đón ánh nắng ấm áp để tạo ra điện cho vệ tinh làm việc.',
            en: 'The solar wing catches bright sunlight to make electricity for the satellite!',
          },
          imageUrl:
            'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/landsat-9-mission-page/L9-sketch-thumbnail_rotated.png',
          isRealPhoto: false,
          mediaKind: 'technical_diagram',
          locationCallout: {
            vi: 'Cánh pin dài vươn ra bên hông thân vệ tinh',
            en: 'Long wing stretching out from the side of the body',
          },
          hotspotCoords: { x: 25, y: 38 },
          icon: 'Sun',
          sourceIndex: 1,
        },
        {
          id: 'l9_antenna_kid',
          simpleName: { vi: 'Ăng-ten gửi ảnh', en: 'Picture Antenna' },
          shortRole: {
            vi: 'Gửi ảnh Trái Đất qua sóng vô tuyến về mặt đất.',
            en: 'Sends Earth pictures home via radio waves.',
          },
          voiceLine: {
            vi: 'Chiếc ăng-ten này giúp gửi những bức ảnh Trái Đất về cho các cô chú nhà khoa học.',
            en: 'This antenna beams Earth pictures straight down to scientists on the ground!',
          },
          isRealPhoto: false,
          mediaKind: 'illustration',
          locationCallout: {
            vi: 'Đặt ở mặt dưới hướng sóng về các trạm thu trên Trái Đất',
            en: 'Located on the underside aiming radio beams to Earth',
          },
          hotspotCoords: { x: 44, y: 74 },
          illustrationKind: 'antenna',
          icon: 'Radio',
          sourceIndex: 1,
        },
      ],
      funFact: {
        vi: 'Chỉ mất 8 ngày là cặp đôi Landsat 9 và Landsat 8 chụp xong ảnh của cả Trái Đất đấy!',
        en: 'Together with Landsat 8, it takes only 8 days to photograph the whole Earth!',
      },
      funFactSpeech: {
        vi: 'Em có biết không? Chỉ mất 8 ngày thôi là vệ tinh Landsat 9 cùng bạn Landsat 8 đã chụp xong ảnh của cả Trái Đất rộng lớn rồi đấy!',
        en: 'Did you know? Working with its twin Landsat 8, Landsat 9 photographs the entire Earth in just 8 days!',
      },
    },
    introKid: {
      whatIsIt: {
        vi: 'Landsat 9 là vệ tinh hiện đại do NASA chế tạo – phóng lên trời và Cơ quan Địa chất Hoa Kỳ (USGS) vận hành, tiếp nối kho ảnh Trái Đất từ năm 1972.',
        en: 'Landsat 9 is an Earth-observing satellite built by NASA and operated with the USGS, continuing a continuous space photo album started in 1972.',
      },
      purpose: {
        vi: 'Chụp ảnh màu sắc và đo nhiệt độ bề mặt Trái Đất để theo dõi nạn chặt phá rừng, cháy rừng, nguồn nước sạch, mùa màng và đô thị hóa.',
        en: 'Capture color imagery and heat maps to track forests, wildfires, freshwater, farms, and growing cities.',
      },
      howItWorks: {
        vi: 'Khi bay ngang qua vùng ban ngày ở độ cao 705 km, kính quang học thu ánh sáng phản chiếu và hơi nóng từ mặt đất vào 2 cảm biến OLI-2 và TIRS-2 rồi gửi dữ liệu sóng radio về trạm mặt đất.',
        en: 'Flying over Earth at 705 km, its optics focus sunlight and heat onto the OLI-2 and TIRS-2 sensors, then beam free data down to Earth stations.',
      },
      missionObjectives: [
        {
          icon: 'Sun',
          title: { vi: 'Bảo vệ rừng & cây xanh', en: 'Monitor Forests & Greenery' },
          desc: {
            vi: 'Phát hiện sớm nạn phá rừng, cháy rừng và xem rừng cây phục hồi ra sao qua từng năm.',
            en: 'Spot deforestation, wildfire scars, and how forests regrow year after year.',
          },
        },
        {
          icon: 'Globe',
          title: { vi: 'Theo dõi nước & nông nghiệp', en: 'Track Water & Crops' },
          desc: {
            vi: 'Giúp nông dân biết ruộng nào đang thiếu nước hoặc tảo độc ở hồ, biển ven bờ.',
            en: 'Check lake water quality and help farmers see which fields need irrigation.',
          },
        },
        {
          icon: 'Sparkles',
          title: { vi: 'Đo nhiệt độ bề mặt Trái Đất', en: 'Measure Surface Heat' },
          desc: {
            vi: 'Phát hiện thành phố bị "đảo nhiệt" nóng hơn xung quanh hay băng tuyết đang tan.',
            en: 'Measure urban heat islands, glacier melt, and warm volcanic areas.',
          },
        },
      ],
      workflowSteps: [
        {
          step: 1,
          title: { vi: 'Quét dải đất rộng 185 km', en: 'Sweep 185 km Swath' },
          desc: {
            vi: 'Vệ tinh bay qua theo đường thẳng như máy quét từ cực Bắc xuống cực Nam.',
            en: 'The satellite flies pole-to-pole scanning a wide 185 km strip below.',
          },
          icon: 'Compass',
        },
        {
          step: 2,
          title: { vi: 'Tách ánh sáng & hơi nóng', en: 'Split Light & Heat' },
          desc: {
            vi: 'OLI-2 chụp ánh sáng phản chiếu (rừng, nước); TIRS-2 đo nhiệt độ tỏa ra từ mặt đất.',
            en: 'OLI-2 captures reflected colors; TIRS-2 measures thermal heat.',
          },
          icon: 'Camera',
        },
        {
          step: 3,
          title: { vi: 'Lưu vào bộ nhớ trên tàu', en: 'Store in Memory' },
          desc: {
            vi: 'Ảnh được chuyển thành dữ liệu số và lưu vào bộ nhớ cực lớn trên vệ tinh.',
            en: 'Pictures are saved digitally inside a large onboard solid-state recorder.',
          },
          icon: 'Database',
        },
        {
          step: 4,
          title: { vi: 'Phát miễn phí về Trái Đất', en: 'Downlink Free Data' },
          desc: {
            vi: 'Anten X-band gửi hơn 700 bức ảnh mỗi ngày xuống trạm mặt đất để mọi người cùng dùng.',
            en: 'X-band antennas beam 700+ scenes daily to ground stations for open public access.',
          },
          icon: 'Radio',
        },
      ],
      keyParts: [
        {
          name: 'OLI-2 & TIRS-2',
          role: {
            vi: 'Bộ đôi máy ảnh quan sát màu sắc cây cối, nước và cảm biến đo nhiệt mặt đất.',
            en: 'Twin Earth sensors capturing surface colors and thermal heat.',
          },
        },
        {
          name: 'Optical Telescope',
          role: {
            vi: 'Cụm gương và thấu kính hội tụ ánh sáng từ Trái Đất vào cảm biến.',
            en: 'Mirrors and lenses focusing Earth light onto the sensor detectors.',
          },
        },
        {
          name: 'Solar Panels & Antenna',
          role: {
            vi: 'Cánh pin tạo điện từ nắng và anten gửi ảnh về trạm mặt đất.',
            en: 'Solar wing generating power and antennas downlinking scenes.',
          },
        },
        {
          name: 'Attitude Control System',
          role: {
            vi: 'Giữ ống kính luôn chĩa thẳng đứng xuống Trái Đất không bị rung lắc.',
            en: 'Keeps cameras steadily pointed straight down at Earth.',
          },
        },
      ],
      funFacts: {
        vi: [
          'Nhờ phối hợp bay lệch nhịp với vệ tinh anh em Landsat 8, cứ 8 ngày là cặp đôi này chụp trọn toàn bộ bề mặt Trái Đất một lần!',
          'Cảm biến OLI-2 phân biệt được hơn 16.000 mức độ sáng tối, nhìn rõ cả trong rừng rậm âm u lẫn vùng nước biển sâu.',
          'Toàn bộ ảnh chụp của Landsat 9 được NASA & USGS chia sẻ hoàn toàn miễn phí cho học sinh và nhà khoa học toàn cầu!',
        ],
        en: [
          'Working in tandem with its twin Landsat 8, the pair photographs the entire Earth every 8 days!',
          'OLI-2 sees over 16,000 shades of brightness—spotting tiny details in deep oceans and dark forests.',
          'Every single Landsat 9 photo is free for students, teachers, and scientists worldwide.',
        ],
      },
    },
    detailedArchive: {
      overview: {
        vi: 'Landsat 9 là kết quả hợp tác giữa NASA (chế tạo và phóng vệ tinh) và USGS (vận hành trạm thu nhận, lưu trữ và phát miễn phí dữ liệu). Nhờ mang cả máy ảnh quang học và cảm biến nhiệt, vệ tinh giúp con người "khám sức khỏe" Trái Đất liên tục.',
        en: 'Landsat 9 is a joint NASA/USGS mission (NASA builds and launches; USGS operates ground archives). Its optical and thermal instruments provide continuous health checkups for Earth’s land and water.',
      },
      missionAndPurpose: {
        vi: 'Dữ liệu từ Landsat 9 giúp giải quyết những bài toán sát sườn đời sống: theo dõi mất rừng nhiệt đới, tính lượng nước cần tưới cho ruộng ngô/lúa mì, đo mực nước hồ chứa và theo dõi hiện tượng nóng lên ở các đô thị lớn.',
        en: 'Data supports forest tracking, crop irrigation planning, lake level measurement, and urban heat mapping across every continent.',
      },
      operatingPrinciple: {
        vi: 'Cả OLI-2 và TIRS-2 hoạt động kiểu "quét chổi" (push-broom): vệ tinh không quay ống kính mà chỉ cần bay thẳng qua, dải cảm biến ngang sẽ tự động ghi lại toàn bộ vùng đất rộng 185 km phía dưới.',
        en: 'Both OLI-2 and TIRS-2 use push-broom scanning: as the spacecraft flies forward, wide detector strips continuously record a 185 km swath below.',
      },
      technicalHighlight: {
        title: {
          vi: 'Phân biệt nhanh: OLI-2 (ánh sáng phản chiếu) vs. TIRS-2 (hơi nóng tỏa ra)',
          en: 'Quick Comparison: OLI-2 (Reflected Light) vs. TIRS-2 (Emitted Heat)',
        },
        content: {
          vi: '• OLI-2 nhìn giống mắt người (thêm ánh sáng hồng ngoại gần) để nhận biết cây xanh tươi hay khô héo, nước trong hay đục (chi tiết tới 15–30 m).\n• TIRS-2 giống nhiệt kế hồng ngoại khổng lồ đo hơi nóng mặt đất tỏa ra để phát hiện hạn hán trước cả khi lá cây kịp chuyển vàng (chi tiết 100 m).',
          en: '• OLI-2 captures reflected sunlight (15–30 m detail) to spot healthy greenery, muddy water, or burn scars.\n• TIRS-2 acts like a space thermometer (100 m detail) measuring emitted ground heat to detect crop drought early.',
        },
      },
      simulationNote: {
        vi: 'Trong trò chơi, kịch bản vệ tinh tụt độ cao do lực cản khí quyển là tình huống mô phỏng (GAME SIMULATION) giúp bạn thực hành cân bằng nhiên liệu và quỹ đạo LEO.',
        en: 'In-game orbital drag anomalies are GAME SIMULATIONS created to practice orbital maintenance concepts.',
      },
      components: [
        {
          id: 'l9_oli',
          name: 'Operational Land Imager (OLI-2)',
          shortDesc: {
            vi: 'Camera quang học chụp ánh sáng phản chiếu từ cây cối, đất đá, sông biển với độ nét 15–30 m.',
            en: 'Optical camera capturing reflected sunlight from forests, water, and farms (15–30 m resolution).',
          },
          functionDesc: {
            vi: 'Thu nhận 9 màu ánh sáng khác nhau (từ xanh lam đến hồng ngoại ngắn) giúp phân biệt rừng rậm, ruộng lúa, tuyết, mây và vùng bị cháy.',
            en: 'Records 9 spectral color bands so scientists can distinguish healthy crops, murky water, snow, and burn scars.',
          },
          analogy: {
            vi: 'Bộ phận này giống như máy ảnh chuyên nghiệp chụp ảnh màu thật sắc nét từ trên máy bay.',
            en: 'This part is like a super-sharp camera photographing Earth’s colors from space.',
          },
          icon: 'Camera',
          imageUrl:
            'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/09/oli2atballpic-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Thiết bị OLI-2 của Landsat 9 trong phòng thí nghiệm trước khi lắp lên vệ tinh (NASA).',
            en: 'Real photo: Landsat 9 OLI-2 instrument during testing before launch (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'l9_tirs',
          name: 'Thermal Infrared Sensor (TIRS-2)',
          shortDesc: {
            vi: 'Cảm biến hồng ngoại nhiệt đo lượng nhiệt tỏa ra từ bề mặt đất, biển và cây trồng.',
            en: 'Thermal infrared sensor measuring heat radiating off Earth’s land and water.',
          },
          functionDesc: {
            vi: 'Cảm biến bên trong được làm lạnh cực sâu để đo chính xác độ ấm – lạnh của mặt đất (độ nét 100 m), phát hiện cây thiếu nước hoặc điểm nóng núi lửa.',
            en: 'Cryo-cooled detectors measure surface temperatures accurately (100 m resolution) to spot plant drought stress and heat islands.',
          },
          analogy: {
            vi: 'Bộ phận này giống như chiếc camera đo thân nhiệt khổng lồ đặt trên quỹ đạo để đo "nhiệt độ" Trái Đất.',
            en: 'This part is like a giant space thermal camera taking Earth’s temperature.',
          },
          icon: 'Sun',
          imageUrl:
            'https://assets.science.nasa.gov/content/dam/science/missions/landsat/2019/04/GSFC_20181009_TIRS2_33878_EnvironmentalTesting.png/jcr:content/renditions/cq5dam.web.1280.1280.png',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cảm biến nhiệt TIRS-2 tại Trung tâm NASA Goddard trước khi phóng.',
            en: 'Real photo: TIRS-2 instrument undergoing environmental testing at NASA Goddard.',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
        {
          id: 'l9_telescope',
          name: 'Optical Telescope',
          shortDesc: {
            vi: 'Hệ gương phản xạ và thấu kính giúp thu gom ánh sáng yếu từ Trái Đất chiếu vào cảm biến.',
            en: 'Precision mirrors and lenses collecting Earthlight and focusing it onto detectors.',
          },
          functionDesc: {
            vi: 'OLI-2 dùng hệ 4 gương giúp ảnh không bị méo màu, còn TIRS-2 dùng thấu kính đặc biệt để dẫn tia nhiệt vào đầu dò.',
            en: 'OLI-2 uses four precision mirrors to avoid color distortion, while TIRS-2 uses special refractive lenses for thermal infrared light.',
          },
          analogy: {
            vi: 'Bộ phận này giống như ống kính máy ảnh giúp gom ánh sáng rõ nét trước khi đi vào cảm biến.',
            en: 'This part is like a camera lens barrel gathering clear light before it hits the sensor.',
          },
          icon: 'Sparkles',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật (chưa có ảnh chụp rời riêng hệ gương bên trong thân vệ tinh).',
            en: 'Technical illustration (internal optical mirrors are enclosed inside the sensor housing).',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'l9_solar',
          name: 'Solar Panels',
          shortDesc: {
            vi: 'Cánh pin Mặt Trời lớn mở ra bên hông vệ tinh để biến ánh nắng thành điện năng.',
            en: 'Deployable sun-tracking solar wing converting sunlight into electricity.',
          },
          functionDesc: {
            vi: 'Cung cấp điện liên tục cho hai máy ảnh, hệ làm lạnh của TIRS-2 và nạp điện vào pin dự trữ dùng khi vệ tinh bay qua vùng tối ban đêm.',
            en: 'Powers both imaging instruments, TIRS-2 coolers, and charges an onboard battery for nighttime passes.',
          },
          analogy: {
            vi: 'Bộ phận này giống như mái nhà gắn tấm pin Mặt Trời cung cấp điện cho cả trạm làm việc.',
            en: 'This part is like rooftop solar panels powering everything on the satellite.',
          },
          icon: 'Zap',
          imageUrl:
            'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/landsat/landsat-9-mission-page/L9-sketch-thumbnail_rotated.png',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Hình minh họa chính thức của NASA cho thấy rõ cánh pin Mặt Trời mở rộng của Landsat 9.',
            en: 'Official NASA spacecraft diagram showing Landsat 9’s extended solar array wing.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'l9_antenna',
          name: 'Antenna',
          shortDesc: {
            vi: 'Hệ thống anten sóng vô tuyến S-band và X-band đặt ở mặt hướng về Trái Đất.',
            en: 'Dual-band S-band and X-band antennas mounted on the Earth-facing side.',
          },
          functionDesc: {
            vi: 'Anten S-band nhận lệnh điều khiển từ mặt đất; anten X-band tốc độ cao truyền hàng trăm cảnh ảnh Trái Đất mỗi ngày xuống trạm thu.',
            en: 'S-band receives ground commands while high-speed X-band beams 700+ Earth scenes daily to USGS ground stations.',
          },
          analogy: {
            vi: 'Bộ phận này giống như bộ phát sóng truyền ảnh trực tiếp từ vũ trụ xuống máy tính dưới mặt đất.',
            en: 'This part is like a high-speed space transmitter streaming pictures down to Earth.',
          },
          icon: 'Radio',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho cụm thu phát sóng S-band / X-band trên thân vệ tinh.',
            en: 'Technical illustration representing the satellite S-band / X-band radio antennas.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'l9_acs',
          name: 'Attitude Control System',
          shortDesc: {
            vi: 'Hệ thống cảm biến sao, con quay và bánh đà giữ vệ tinh luôn hướng đúng góc chụp xuống Trái Đất.',
            en: 'Star trackers, gyros, and reaction wheels keeping sensors steadily aimed at Earth.',
          },
          functionDesc: {
            vi: 'Nếu vệ tinh xoay lệch chỉ một chút khi đang bay ở độ cao 705 km, bức ảnh chụp xuống sẽ bị chệch hàng chục km — hệ thống này giúp ảnh luôn chuẩn xác từng dải.',
            en: 'Prevents tilt or wobble so every 185 km ground swath lines up accurately without blurry or crooked imagery.',
          },
          analogy: {
            vi: 'Bộ phận này giống như tay cầm chống rung (gimbal) giúp camera không bị nghiêng khi chụp.',
            en: 'This part is like a steady camera gimbal holding the lens perfectly level.',
          },
          icon: 'Compass',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho hệ thống ổn định hướng bay nằm bên trong thân vệ tinh.',
            en: 'Technical illustration representing internal star trackers and attitude control.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
      ],
    },
    sources: [
      {
        title: 'NASA Science: Landsat 9 Overview',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/landsat-9/',
      },
      {
        title: 'NASA Science: Landsat 9 Mission Details',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/landsat-9/mission-details/',
      },
      {
        title: 'NASA Science: Operational Land Imager (OLI-2)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/landsat/oli/',
      },
      {
        title: 'NASA Science: Thermal Infrared Sensor (TIRS-2)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/landsat/tirs/',
      },
      {
        title: 'USGS: Landsat 9 Mission Portal',
        organization: 'USGS',
        url: 'https://www.usgs.gov/landsat-missions/landsat-9',
      },
      {
        title: 'NASA Goddard: Landsat 9 Satellite Facts',
        organization: 'NASA',
        url: 'https://landsat.gsfc.nasa.gov/satellites/landsat-9/',
      },
    ],
  },

  // =========================================================================
  // MISSION 03: INTERNATIONAL SPACE STATION (ISS)
  // =========================================================================
  {
    missionId: 'mission_03_space_station',
    missionNumber: '03',
    equipmentName: {
      vi: 'Trạm Vũ Trụ Quốc Tế (ISS)',
      en: 'International Space Station (ISS)',
    },
    agency: 'NASA & International Partners (CSA, ESA, JAXA, Roscosmos)',
    heroImageUrl: 'https://images-assets.nasa.gov/image/iss056e201248/iss056e201248~medium.jpg',
    fallbackImageUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
    anatomyImageUrl: 'https://images-assets.nasa.gov/image/0101424/0101424~medium.jpg',
    whereItOperates: {
      vi: 'Quỹ đạo Trái Đất tầm thấp, cách mặt đất ~400–420 km (bay với vận tốc ~28.000 km/h)',
      en: 'Low Earth Orbit at ~400–420 km altitude (traveling at ~28,000 km/h)',
    },
    shortTypeSummary: {
      vi: 'Ngôi nhà và phòng thí nghiệm khổng lồ dài bằng cả sân bóng đá (~109 m) nơi các phi hành gia sống ngoài không gian.',
      en: 'A giant football-field-sized orbiting home and science lab (~109 m wide) where astronauts live and work.',
    },
    launchAndOrbit: {
      vi: 'Lắp ghép từ năm 1998 · Có người sinh sống liên tục từ tháng 11/2000',
      en: 'Assembled starting 1998 · Continuously crewed since November 2000',
    },
    galleryImages: [
      {
        url: 'https://images-assets.nasa.gov/image/iss056e201248/iss056e201248~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Toàn cảnh Trạm Vũ trụ Quốc tế trên quỹ đạo',
          en: 'Full View of the International Space Station',
        },
        caption: {
          vi: 'Ảnh thật chụp toàn bộ trạm ISS với các khoang phòng ở giữa và 8 cánh pin Mặt Trời.',
          en: 'Real NASA photo of the entire ISS showing pressurized lab modules and giant solar wings.',
        },
        sourceLabel: 'NASA (iss056e201248)',
        mediaKind: 'real_photo',
        viewCategory: 'overview',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss073e0850593/iss073e0850593~large.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Cận cảnh các tấm pin Mặt Trời khổng lồ của ISS',
          en: 'Close-Up of ISS Solar Array Wings',
        },
        caption: {
          vi: 'Ảnh thật những cánh pin Mặt Trời vàng rực đón ánh sáng tạo điện cho toàn bộ trạm vũ trụ.',
          en: 'Real NASA photo of the massive ISS solar array wings collecting sunlight.',
        },
        sourceLabel: 'NASA (iss073e0850593)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/KSC-20210402-PH-FMX01_0047/KSC-20210402-PH-FMX01_0047~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Cận cảnh tấm pin cuộn thế hệ mới iROSA',
          en: 'Close-Up of iROSA Roll-Out Solar Arrays',
        },
        caption: {
          vi: 'Ảnh thật những tấm pin Mặt Trời cuộn gọn iROSA được kiểm tra trước khi lắp lên trạm ISS.',
          en: 'Real NASA photo of compact iROSA solar arrays prepared for launch to the ISS.',
        },
        sourceLabel: 'NASA (KSC-20210402)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss075e0046813/iss075e0046813~large.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Phi hành gia làm việc bên trong khoang thí nghiệm',
          en: 'Astronaut Working Inside ISS Lab Module',
        },
        caption: {
          vi: 'Ảnh thật phi hành gia làm thí nghiệm khoa học bên trong khoang phòng thí nghiệm Kibo trên ISS.',
          en: 'Real NASA photo of an astronaut conducting research inside the ISS Kibo laboratory.',
        },
        sourceLabel: 'NASA (iss075e0046813)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://images-assets.nasa.gov/image/05pd0995/05pd0995~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Cấu tạo khung giàn điện & hộp pin của trạm ISS',
          en: 'ISS Integrated Truss & Power Battery Segment',
        },
        caption: {
          vi: 'Ảnh thật khung giàn S4 chứa hộp chuyển điện và khối pin giúp trạm sáng đèn khi vào vùng tối.',
          en: 'Real NASA photo of the ISS truss power switching and orbital battery assembly.',
        },
        sourceLabel: 'NASA (KSC-05pd-0995)',
        mediaKind: 'real_photo',
        viewCategory: 'anatomy',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss074e0381623/iss074e0381623~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Ngắm Trái Đất qua cửa sổ Cupola',
          en: 'Mission View: Watching Earth from the Cupola',
        },
        caption: {
          vi: 'Ảnh thật phi hành gia ngắm nhìn Trái Đất xanh tuyệt đẹp từ vòm kính 7 cửa sổ trên ISS.',
          en: 'Real NASA photo of an astronaut gazing at Earth through the ISS Cupola dome.',
        },
        sourceLabel: 'NASA (iss074e0381623)',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
    ],
    preschool: {
      simpleName: {
        vi: 'Trạm Vũ Trụ ISS',
        en: 'Space Station (ISS)',
      },
      badgeEmoji: '🛸',
      whatIsItSpeech: {
        vi: 'Ồ! Đây là Trạm Vũ Trụ Quốc Tế ISS — một ngôi nhà khổng lồ biết bay ở ngoài không gian!',
        en: 'Whoa! This is the International Space Station, a giant flying home in outer space!',
      },
      usedForShort: {
        vi: 'Ngôi nhà trong không gian, nơi các phi hành gia sống và làm thí nghiệm.',
        en: 'A home in space where astronauts live and do fun science experiments.',
      },
      usedForSpeech: {
        vi: 'ISS là ngôi nhà trong không gian, nơi các cô chú phi hành gia sống, bay lơ lửng và làm thí nghiệm.',
        en: 'The ISS is a home in space where astronauts live, float around, and do science experiments.',
      },
      parts: [
        {
          id: 'iss_solar_kid',
          simpleName: { vi: 'Cánh pin Mặt Trời lớn', en: 'Giant Solar Wings' },
          shortRole: {
            vi: 'Đón ánh nắng để tạo điện thắp sáng ngôi nhà.',
            en: 'Catches sunlight to power the space home.',
          },
          voiceLine: {
            vi: 'Những cánh pin Mặt Trời khổng lồ này đón ánh nắng để tạo điện thắp sáng cho cả ngôi nhà.',
            en: 'These giant solar wings catch sunlight to power the whole space station!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss073e0850593/iss073e0850593~large.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Xòe rộng ở hai bên khung trạm để hứng ánh nắng',
            en: 'Stretched wide along both left and right truss sides',
          },
          hotspotCoords: { x: 20, y: 40 },
          icon: 'Sun',
          sourceIndex: 1,
        },
        {
          id: 'iss_rooms_kid',
          simpleName: { vi: 'Phòng ở & thí nghiệm', en: 'Living & Lab Rooms' },
          shortRole: {
            vi: 'Nơi phi hành gia ngủ, ăn uống và trồng cây.',
            en: 'Where astronauts sleep, eat, and do experiments.',
          },
          voiceLine: {
            vi: 'Bên trong có các căn phòng ấm áp để phi hành gia ăn, ngủ và trồng cây xanh đấy!',
            en: 'Inside are cozy rooms where astronauts eat, sleep, and even grow little plants!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss075e0046813/iss075e0046813~large.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Cụm ống khoang màu trắng nối liền nhau ở giữa trạm',
            en: 'Connected white cylindrical rooms right in the center',
          },
          hotspotCoords: { x: 52, y: 55 },
          icon: 'Rocket',
          sourceIndex: 4,
        },
        {
          id: 'iss_arm_kid',
          simpleName: { vi: 'Cánh tay robot hỗ trợ', en: 'Helper Robot Arm' },
          shortRole: {
            vi: 'Giúp nâng đồ và sửa chữa bên ngoài trạm.',
            en: 'Lifts equipment and helps fix the station exterior.',
          },
          voiceLine: {
            vi: 'Bên ngoài trạm còn có cánh tay robot dài giúp nâng đồ nặng và sửa chữa ngôi nhà.',
            en: 'Outside the station is a robot arm that lifts heavy things and helps make repairs!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss073e0657546/iss073e0657546~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn ở bên ngoài thân khung xương chính của trạm',
            en: 'Mounted outside along the main truss backbone',
          },
          hotspotCoords: { x: 60, y: 42 },
          icon: 'Wrench',
          sourceIndex: 0,
        },
        {
          id: 'iss_battery_kid',
          simpleName: { vi: 'Khối pin & chia điện ban đêm', en: 'Night Power Batteries' },
          shortRole: {
            vi: 'Cất điện để bật đèn khi trạm bay vào vùng tối.',
            en: 'Saves electricity so lights stay bright in space shadows.',
          },
          voiceLine: {
            vi: 'Những khối pin gắn trên khung giàn này cất điện dự trữ để bật đèn khi trạm bay vào bóng tối.',
            en: 'These truss battery units save extra electricity so lights stay on in the dark!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/05pd0995/05pd0995~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Lắp trên khung giàn chính gần gốc các cánh pin Mặt Trời',
            en: 'Mounted inside the main truss right beside the solar wings',
          },
          hotspotCoords: { x: 36, y: 45 },
          icon: 'BatteryCharging',
          sourceIndex: 1,
        },
      ],
      funFact: {
        vi: 'Các phi hành gia trên trạm ISS được ngắm Mặt Trời mọc tới 16 lần mỗi ngày!',
        en: 'Astronauts on the ISS get to see 16 sunrises every single day!',
      },
      funFactSpeech: {
        vi: 'Em có biết không? Vì bay rất nhanh vòng quanh Trái Đất, các phi hành gia trên trạm ISS được ngắm Mặt Trời mọc tới 16 lần mỗi ngày đấy!',
        en: 'Did you know? Because it zooms so fast around Earth, astronauts on the ISS see 16 sunrises every day!',
      },
    },
    introKid: {
      whatIsIt: {
        vi: 'Trạm Vũ trụ Quốc tế (ISS) là công trình lớn nhất con người từng ghép ngoài không gian, nơi các phi hành gia nhiều nước cùng làm việc trong trạng thái không trọng lượng.',
        en: 'The ISS is the largest human-built structure in space, where astronauts from many nations live and work in microgravity.',
      },
      purpose: {
        vi: 'Nghiên cứu khoa học trong môi trường vi trọng lực (nơi mọi vật trôi lơ lửng) và thử nghiệm hệ thống điện, tạo oxy cho chuyến bay tới Mặt Trăng, Sao Hỏa.',
        en: 'Run science experiments in microgravity and test life-support and power systems for future Moon and Mars journeys.',
      },
      howItWorks: {
        vi: 'Mỗi ngày ISS quay quanh Trái Đất 16 vòng (90 phút/vòng). Ban ngày, cánh pin Mặt Trời tạo điện cấp cho trạm và sạc pin; khi bay vào bóng tối Trái Đất, pin xả điện nuôi trạm chạy liên tục không ngừng.',
        en: 'Orbiting Earth 16 times a day, giant solar wings generate power and charge batteries in sunlight so the batteries keep everything running during orbital night.',
      },
      missionObjectives: [
        {
          icon: 'Sparkles',
          title: { vi: 'Nghiên cứu trong vi trọng lực', en: 'Microgravity Science Lab' },
          desc: {
            vi: 'Trồng rau trong không gian, nuôi tinh thể thuốc mới và nghiên cứu ngọn lửa, chất lỏng lơ lửng.',
            en: 'Grow space plants, develop medicines, and study how flames and fluids behave without gravity.',
          },
        },
        {
          icon: 'Shield',
          title: { vi: 'Bảo vệ sức khỏe phi hành gia', en: 'Study Human Health in Space' },
          desc: {
            vi: 'Tìm hiểu cơ thể người thay đổi ra sao khi sống lâu ngày ngoài vũ trụ để chuẩn bị bay tới Sao Hỏa.',
            en: 'Track how bones, muscles, and eyes adapt to long spaceflights before heading to Mars.',
          },
        },
        {
          icon: 'Globe',
          title: { vi: 'Quan sát Trái Đất & thử công nghệ', en: 'Earth Watch & Tech Testing' },
          desc: {
            vi: 'Chụp ảnh bão, sông băng và thử nghiệm pin mới, cánh tay robot, hệ thống lọc nước tái chế.',
            en: 'Photograph storms from orbit and test next-generation solar arrays, robots, and water recycling.',
          },
        },
      ],
      workflowSteps: [
        {
          step: 1,
          title: { vi: 'Đón nắng tạo điện', en: 'Catch Sunlight' },
          desc: {
            vi: 'Tám cánh pin Mặt Trời (và tấm iROSA) xoay theo Mặt Trời để phát dòng điện chính.',
            en: 'Eight giant solar wings track the Sun to generate primary electricity.',
          },
          icon: 'Sun',
        },
        {
          step: 2,
          title: { vi: 'Ổn định & chia điện', en: 'Regulate & Route' },
          desc: {
            vi: 'Các hộp điều phối giữ điện áp ổn định, không bị tăng giảm đột ngột làm hỏng máy.',
            en: 'Switching and converter boxes keep voltage steady and route power across the truss.',
          },
          icon: 'Zap',
        },
        {
          step: 3,
          title: { vi: 'Sạc pin cho ban đêm', en: 'Charge Batteries' },
          desc: {
            vi: 'Một phần điện ban ngày được nạp đầy vào các khối pin Lithium-ion dự trữ.',
            en: 'Extra daytime electricity charges orbital Lithium-ion battery packs.',
          },
          icon: 'BatteryCharging',
        },
        {
          step: 4,
          title: { vi: 'Nuôi trạm trong bóng tối', en: 'Power Through Night' },
          desc: {
            vi: 'Khi ISS chui vào bóng tối Trái Đất (~35 phút/vòng), pin xả điện giữ oxy và máy tính chạy êm.',
            en: 'During each ~35-minute orbital night, batteries smoothly power life support and labs.',
          },
          icon: 'Battery',
        },
      ],
      keyParts: [
        {
          name: 'Solar Array Wings & Batteries',
          role: {
            vi: 'Nhà máy phát điện Mặt Trời và pin dự trữ giúp trạm sáng đèn 24/24.',
            en: 'Solar power plant and rechargeable batteries running the station 24/7.',
          },
        },
        {
          name: 'Power Distribution System',
          role: {
            vi: 'Mạng lưới chuyển mạch, hạ áp và cầu dao thông minh bảo vệ từng thiết bị.',
            en: 'Switching, converter, and smart breaker network routing safe electricity.',
          },
        },
        {
          name: 'Laboratory Modules',
          role: {
            vi: 'Các khoang phòng thí nghiệm điều áp có không khí để phi hành gia làm việc.',
            en: 'Pressurized science modules where astronauts live and conduct research.',
          },
        },
        {
          name: 'Robotic & Communication Systems',
          role: {
            vi: 'Cánh tay robot ngoài vỏ trạm và anten liên lạc trực tiếp với Trung tâm Điều khiển.',
            en: 'Exterior robots for heavy lifting and antennas linking to Earth Mission Control.',
          },
        },
      ],
      funFacts: {
        vi: [
          'Vì ISS bay một vòng quanh Trái Đất chỉ mất 90 phút, các phi hành gia ngắm tới 16 lần Mặt Trời mọc và 16 lần Mặt Trời lặn mỗi ngày!',
          'Hệ thống dây điện trên ISS dài tổng cộng hơn 12,8 km — dài hơn 120 sân bóng đá nối lại!',
          'Phi hành gia dùng hệ thống tái chế nước siêu sạch, biến cả mồ hôi và hơi ẩm không khí thành nước uống tinh khiết.',
        ],
        en: [
          'Because the ISS circles Earth every 90 minutes, astronauts see 16 sunrises and 16 sunsets every single day!',
          'More than 8 miles (12.8 km) of electrical cables carry power across the space station.',
          'Water recycling systems purify humidity and wastewater into clean drinking water with over 90% recovery.',
        ],
      },
    },
    detailedArchive: {
      overview: {
        vi: 'Trạm Vũ trụ Quốc tế dài ~109 m, nặng ~420 tấn, bay ở độ cao ~400 km. Trạm cần một "lưới điện mini" thật tin cậy vì chỉ cần mất điện máy tạo oxy hay máy sưởi trong vài giờ, phi hành đoàn sẽ gặp nguy hiểm ngay.',
        en: 'Measuring ~109 m across and ~420 metric tons, the ISS relies on an ultra-reliable space power grid so life-support, oxygen, and cooling systems never shut down.',
      },
      missionAndPurpose: {
        vi: 'Là phòng thí nghiệm quốc tế duy nhất ngoài không gian có con người ở thường trực, giúp nhân loại hiểu cách sinh vật, vật liệu và con người tồn tại lâu dài bên ngoài Trái Đất.',
        en: 'Serves as humanity’s permanent orbiting microgravity lab to test biology, materials, and technologies needed for deep-space exploration.',
      },
      operatingPrinciple: {
        vi: 'Mỗi vòng quay 90 phút gồm khoảng 55 phút có nắng và 35 phút trong bóng tối Trái Đất. Ban ngày cánh pin phát điện ~160V DC nuôi thiết bị và nạp pin; qua bộ chuyển đổi sẽ hạ xuống 120V DC an toàn cho các tủ thí nghiệm bên trong.',
        en: 'Each 90-minute orbit has ~55 min sunlight and ~35 min darkness. Solar arrays produce ~160V DC power that is regulated, stored in batteries, and stepped down to 120V DC for lab racks.',
      },
      technicalHighlight: {
        title: {
          vi: 'Đường đi dòng điện trên ISS (Từ Tấm pin Mặt Trời đến Phòng thí nghiệm)',
          en: 'ISS Power Path: From Solar Wings to Laboratory Racks',
        },
        content: {
          vi: 'Tấm pin Mặt Trời (SAWs) phát điện → Bộ ổn áp SSU giữ dòng đều → Trạm chuyển mạch DCSU/MBSU chia tuyến & sạc/xả Batteries → Bộ hạ áp DDCU đưa xuống 120V DC → Cầu dao thông minh RPC cấp điện an toàn tới máy tạo oxy và phòng thí nghiệm.',
          en: 'Solar Arrays generate electricity → Regulators stabilize voltage → Switching units charge Batteries and route buses → Converters step down to 120V DC → Smart Remote Power Controllers deliver safe power to life support and labs.',
        },
      },
      simulationNote: {
        vi: 'Trong game, chu kỳ sáng/tối được rút gọn thành 45/45 phút (SIMPLIFIED FOR LEARNING) và sự cố sụt điện khi qua bóng tối (GAME SIMULATION) giúp bạn học cách ưu tiên điện cho máy tạo oxy trước các tải phụ.',
        en: 'In-game 45/45-minute day/night cycles are SIMPLIFIED FOR LEARNING, and eclipse brownouts are GAME SIMULATIONS teaching emergency load prioritization.',
      },
      components: [
        {
          id: 'iss_saw',
          name: 'Solar Array Wings',
          shortDesc: {
            vi: '8 đôi cánh pin Mặt Trời khổng lồ (mỗi cánh dài ~35 m) kết hợp các tấm pin cuộn mới iROSA.',
            en: 'Eight massive solar wings (~35 m long each) plus newer roll-out iROSA arrays.',
          },
          functionDesc: {
            vi: 'Chứa hàng chục nghìn tế bào quang điện tự xoay theo ánh nắng để sản xuất nguồn điện chính nuôi toàn bộ trạm vũ trụ.',
            en: 'Rotate smoothly toward the Sun to generate primary electricity for life support, heating, and science experiments.',
          },
          analogy: {
            vi: 'Bộ phận này giống như những nhà máy điện Mặt Trời khổng lồ mọc trên "đôi cánh" của trạm.',
            en: 'This part is like giant solar power plants stretching out like wings.',
          },
          icon: 'Sun',
          imageUrl: 'https://images-assets.nasa.gov/image/iss073e0850593/iss073e0850593~large.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Các cánh pin Mặt Trời của ISS phản chiếu ánh sáng trên quỹ đạo (NASA).',
            en: 'Real photo: Main ISS solar array wings catching sunlight in orbit (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'iss_batteries',
          name: 'Batteries',
          shortDesc: {
            vi: 'Các khối pin Lithium-ion dung lượng lớn gắn bên ngoài khung giàn trạm ISS.',
            en: 'High-capacity orbital Lithium-ion battery packs mounted along the ISS truss.',
          },
          functionDesc: {
            vi: 'Tích điện vào ban ngày và tự động xả điện nuôi đèn, máy tạo oxy, máy tính suốt ~35 phút ISS bay qua bóng tối Trái Đất.',
            en: 'Store daytime solar energy and power the station seamlessly through 16 orbital nights every 24 hours.',
          },
          analogy: {
            vi: 'Bộ phận này giống như những cục pin sạc dự phòng khổng lồ giữ trạm không bao giờ mất điện ban đêm.',
            en: 'This part is like giant rechargeable power banks keeping the lights and air running at night.',
          },
          icon: 'Battery',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho các khối pin gắn trong hộp kín trên giàn trạm.',
            en: 'Technical illustration representing orbital battery units on the ISS truss.',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'iss_power_dist',
          name: 'Power Distribution System',
          shortDesc: {
            vi: 'Mạng lưới điều áp, chuyển mạch (SSU, MBSU, DDCU) và cầu dao điều khiển từ xa (RPC) trên ISS.',
            en: 'Network of regulators, switch boxes (SSU, MBSU, DDCU), and smart breakers (RPCs).',
          },
          functionDesc: {
            vi: 'Biến đổi dòng điện cao áp (160V) từ pin Mặt Trời xuống điện áp chuẩn (120V) và tự động ngắt mạch nếu có thiết bị bị chập điện.',
            en: 'Steps down solar power from 160V to safe 120V DC and automatically isolates electrical faults like smart circuit breakers.',
          },
          analogy: {
            vi: 'Bộ phận này giống như trạm biến áp và tủ cầu dao thông minh chia điện an toàn tới từng phòng.',
            en: 'This part is like a home breaker box and power transformer protecting every room.',
          },
          icon: 'Zap',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho hệ thống phân phối điện chạy khắp khung giàn ISS.',
            en: 'Technical illustration representing ISS voltage converters and power switching.',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'iss_labs',
          name: 'Laboratory Modules',
          shortDesc: {
            vi: 'Các khoang hình trụ kín chứa không khí như Destiny (Mỹ), Columbus (Châu Âu) và Kibo (Nhật Bản).',
            en: 'Pressurized cylindrical labs like Destiny (US), Columbus (Europe), and Kibo (Japan).',
          },
          functionDesc: {
            vi: 'Bên trong có các "tủ thí nghiệm" gắn sát tường để phi hành gia mặc đồ thường nghiên cứu y học, thực vật và vật lý không trọng lượng.',
            en: 'Packed with science racks where astronauts work in shirt-sleeves studying biology, space plants, and physics.',
          },
          analogy: {
            vi: 'Bộ phận này giống như những phòng thí nghiệm lắp ghép nối liền nhau bằng đường hầm ngoài không gian.',
            en: 'This part is like interconnected high-tech science classrooms floating in orbit.',
          },
          icon: 'Layers',
          imageUrl: 'https://images-assets.nasa.gov/image/iss075e0046813/iss075e0046813~large.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Phi hành gia làm việc bên trong khoang phòng thí nghiệm Kibo trên ISS (NASA).',
            en: 'Real photo: Astronaut conducting experiments inside the ISS Kibo laboratory module (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 4,
        },
        {
          id: 'iss_robotics',
          name: 'Robotic Systems',
          shortDesc: {
            vi: 'Tổ hợp cánh tay robot Canadarm2, xe trượt giàn MBS và robot hai tay Dextre lắp bên ngoài trạm.',
            en: 'External robotic suite including Canadarm2, the Mobile Base railcar, and two-armed Dextre.',
          },
          functionDesc: {
            vi: 'Thay con người làm việc ngoài trời lạnh giá: di chuyển thiết bị nặng, lắp đặt pin mới và bắt các tàu hàng bay tiếp tế.',
            en: 'Performs heavy lifting outside the station, moves large cargo, replaces hardware, and catches supply ships.',
          },
          analogy: {
            vi: 'Bộ phận này giống như đội cần cẩu và thợ máy robot làm việc ngoài vỏ trạm vũ trụ.',
            en: 'This part is like a robotic crane and space mechanic working outside the station.',
          },
          icon: 'Wrench',
          imageUrl: 'https://images-assets.nasa.gov/image/iss058e002666/iss058e002666~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cánh tay robot Canadarm2 thuộc hệ thống robot gắn ngoài ISS (CSA/NASA).',
            en: 'Real photo: Canadarm2 robotic arm operating on the exterior of the ISS (CSA/NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'iss_comms',
          name: 'Communication Systems',
          shortDesc: {
            vi: 'Cụm anten băng tần Ku-band, S-band và hệ thống liên lạc qua vệ tinh tiếp sóng TDRSS.',
            en: 'Ku-band and S-band antennas connecting ISS to Earth via TDRSS relay satellites.',
          },
          functionDesc: {
            vi: 'Truyền dữ liệu thí nghiệm, hình ảnh video HD và giọng nói giữa các phi hành gia trên trạm với Trung tâm Điều khiển NASA tại Houston.',
            en: 'Streams science data, HD video, and astronaut voice calls back to NASA Mission Control in Houston.',
          },
          analogy: {
            vi: 'Bộ phận này giống như đường truyền Internet và điện thoại vệ tinh kết nối trạm với Trái Đất.',
            en: 'This part is like space Wi-Fi and satellite phone linking astronauts to Mission Control.',
          },
          icon: 'Radio',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho mạng anten truyền dữ liệu và liên lạc giữa ISS và mặt đất.',
            en: 'Technical illustration representing ISS Ku-band/S-band space communications.',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
      ],
    },
    sources: [
      {
        title: 'NASA: International Space Station Portal',
        organization: 'NASA',
        url: 'https://www.nasa.gov/international-space-station/',
      },
      {
        title: 'NASA: Space Station Overview',
        organization: 'NASA',
        url: 'https://www.nasa.gov/international-space-station/space-station-overview/',
      },
      {
        title: 'NASA: Space Station Facts and Figures',
        organization: 'NASA',
        url: 'https://www.nasa.gov/international-space-station/space-station-facts-and-figures/',
      },
      {
        title: 'NASA: ISS Reference & Facts',
        organization: 'NASA',
        url: 'https://www.nasa.gov/reference/international-space-station/',
      },
      {
        title: 'NASA: ISS Research and Technology',
        organization: 'NASA',
        url: 'https://www.nasa.gov/international-space-station/space-station-research-and-technology/',
      },
      {
        title: 'NASA Image and Video Library',
        organization: 'NASA',
        url: 'https://images.nasa.gov/',
      },
    ],
  },

  // =========================================================================
  // MISSION 04: CANADARM2 ROBOTIC ARM
  // =========================================================================
  {
    missionId: 'mission_04_robotic_arm',
    missionNumber: '04',
    equipmentName: {
      vi: 'Cánh Tay Robot Canadarm2',
      en: 'Canadarm2 Robotic Arm (SSRMS)',
    },
    agency: 'Canadian Space Agency (CSA) & NASA',
    heroImageUrl: 'https://images-assets.nasa.gov/image/iss058e002666/iss058e002666~medium.jpg',
    fallbackImageUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
    anatomyImageUrl: 'https://images-assets.nasa.gov/image/iss072e576480/iss072e576480~medium.jpg',
    whereItOperates: {
      vi: 'Gắn bên ngoài vỏ Trạm Vũ trụ Quốc tế (ISS) ở độ cao ~400 km',
      en: 'Mounted on the outside of the International Space Station (~400 km altitude)',
    },
    shortTypeSummary: {
      vi: 'Một cánh tay robot khổng lồ dài ~17,6 m, nặng ~1,5 tấn biết "bước đi" trên thân trạm vũ trụ.',
      en: 'A 17.6-meter, 1.5-ton robotic arm that can walk end-over-end across the space station.',
    },
    launchAndOrbit: {
      vi: 'Phóng lên ISS: 19/04/2001 (Tàu con thoi Endeavour STS-100)',
      en: 'Launched to ISS: April 19, 2001 (Space Shuttle Endeavour STS-100)',
    },
    galleryImages: [
      {
        url: 'https://images-assets.nasa.gov/image/iss058e002666/iss058e002666~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Toàn cảnh Canadarm2 vươn dài ngoài ISS',
          en: 'Canadarm2 Outside the Space Station',
        },
        caption: {
          vi: 'Ảnh thật cánh tay robot Canadarm2 màu trắng vươn dài bên ngoài thân Trạm Vũ trụ Quốc tế.',
          en: 'Real photo of Canadarm2 stretched outside the International Space Station (CSA/NASA).',
        },
        sourceLabel: 'Canadian Space Agency / NASA',
        mediaKind: 'real_photo',
        viewCategory: 'overview',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss075e0014476/iss075e0014476~large.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Cận cảnh bàn tay đầu kẹp LEE của Canadarm2',
          en: 'Close-Up of the Latching End Effector (LEE)',
        },
        caption: {
          vi: 'Ảnh thật cận cảnh đầu kẹp hình trụ với vòng cáp thép giúp bám chặt vào chốt neo hoặc tàu hàng.',
          en: 'Real NASA photo close-up of the Latching End Effector hand used to lock onto targets.',
        },
        sourceLabel: 'NASA (iss075e0014476)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss072e576480/iss072e576480~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Cận cảnh ống cần dài & khớp xoay Canadarm2',
          en: 'Close-Up of Booms & Motorized Joints',
        },
        caption: {
          vi: 'Ảnh thật thấy rõ các đoạn cần sợi carbon và cụm khớp xoay giúp cánh tay gập góc linh hoạt.',
          en: 'Real NASA photo showing the carbon-composite booms and rotary joints of Canadarm2.',
        },
        sourceLabel: 'NASA (iss072e576480)',
        mediaKind: 'real_photo',
        viewCategory: 'anatomy',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss071e418235/iss071e418235~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Đang hoạt động: Bắt tàu hàng tiếp tế Cygnus',
          en: 'In Action: Capturing Cygnus Cargo Ship',
        },
        caption: {
          vi: 'Ảnh thật Canadarm2 vươn ra "bắt gọn" tàu chở hàng Cygnus đang bay lơ lửng cạnh trạm ISS.',
          en: 'Real NASA photo of Canadarm2 grappling the Cygnus cargo spacecraft in orbit.',
        },
        sourceLabel: 'NASA (iss071e418235)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss072e574907/iss072e574907~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Hỗ trợ phi hành gia đi bộ ngoài không gian',
          en: 'Carrying Spacewalking Astronauts',
        },
        caption: {
          vi: 'Ảnh thật cánh tay Canadarm2 giữ an toàn và đưa phi hành gia tới vị trí sửa chữa bên ngoài trạm.',
          en: 'Real NASA photo of Canadarm2 moving an astronaut outside the ISS during a spacewalk.',
        },
        sourceLabel: 'NASA (iss072e574907)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://images-assets.nasa.gov/image/iss073e0575226/iss073e0575226~medium.jpg',
        fallbackUrl: '/src/assets/images/space_station_module_1794503040769.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Canadarm2 bên cạnh tàu Dragon',
          en: 'Mission Result: Next to Visiting Dragon Capsule',
        },
        caption: {
          vi: 'Ảnh thật Canadarm2 phối hợp giữ và dẫn hướng tàu hàng cập bến trạm vũ trụ an toàn.',
          en: 'Real NASA photo of Canadarm2 working alongside a docked Dragon cargo spacecraft.',
        },
        sourceLabel: 'NASA (iss073e0575226)',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
    ],
    preschool: {
      simpleName: {
        vi: 'Cánh Tay Robot Canadarm2',
        en: 'Canadarm2 Robot Arm',
      },
      badgeEmoji: '🦾',
      whatIsItSpeech: {
        vi: 'Chào bé! Đây là Canadarm2 — một cánh tay robot siêu khỏe ở ngoài không gian đấy!',
        en: 'Hi there! This is Canadarm2, a super-strong giant robot arm in outer space!',
      },
      usedForShort: {
        vi: 'Cánh tay robot khổng lồ giúp phi hành gia di chuyển và sửa chữa thiết bị ngoài không gian.',
        en: 'A giant robot arm that helps astronauts move and fix things in space.',
      },
      usedForSpeech: {
        vi: 'Canadarm2 là cánh tay robot khổng lồ giúp phi hành gia di chuyển và sửa chữa thiết bị ngoài không gian.',
        en: 'Canadarm2 is a giant robot arm that helps astronauts move around and repair equipment in space.',
      },
      parts: [
        {
          id: 'arm_hand_kid',
          simpleName: { vi: 'Bàn tay nắm chặt (LEE)', en: 'Grabber Hand (LEE)' },
          shortRole: {
            vi: 'Nắm giữ chặt tàu vũ trụ và đồ vật nặng.',
            en: 'Grabs and locks onto spaceships and tools.',
          },
          voiceLine: {
            vi: 'Đây là bàn tay nắm chặt! Có thể bắt lấy các tàu chở hàng bay tới trạm vũ trụ.',
            en: 'This is the grabber hand! It catches supply spaceships flying up to the station.',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss075e0014476/iss075e0014476~large.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn ở cả hai đầu mút của cánh tay robot',
            en: 'Identical grappling hands placed at both arm tips',
          },
          hotspotCoords: { x: 75, y: 36 },
          icon: 'Wrench',
          sourceIndex: 1,
        },
        {
          id: 'arm_tube_kid',
          simpleName: { vi: 'Cánh tay ống siêu dài', en: 'Long Carbon Booms' },
          shortRole: {
            vi: 'Vươn thật xa để với tới mọi chỗ bên ngoài trạm.',
            en: 'Reaches far out to any spot around the station.',
          },
          voiceLine: {
            vi: 'Cánh tay dài bằng cả một chiếc xe buýt lớn để vươn tới mọi nơi ngoài trạm.',
            en: 'These long tubes reach far out—almost as long as a school bus!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss072e576480/iss072e576480~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Hai đoạn ống trắng dài tạo nên thân cánh tay',
            en: 'Two long white carbon-fiber tubes forming the arm',
          },
          hotspotCoords: { x: 46, y: 52 },
          icon: 'Sliders',
          sourceIndex: 0,
        },
        {
          id: 'arm_joint_kid',
          simpleName: { vi: 'Khớp xoay dẻo dai', en: 'Bendable Joints' },
          shortRole: {
            vi: 'Gập và xoay mọi hướng giống khuỷu tay của bé.',
            en: 'Bends and turns smoothly just like your arm.',
          },
          voiceLine: {
            vi: 'Các khớp xoay giúp cánh tay gập lại và duỗi ra dễ dàng như cánh tay của chúng mình!',
            en: 'Bendable joints help the arm twist, turn, and bend just like your own arm!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss072e574907/iss072e574907~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Nằm tại vai, khuỷu giữa và cổ tay giúp uốn cong né vật cản',
            en: 'Positioned at the shoulder, middle elbow, and wrist',
          },
          hotspotCoords: { x: 56, y: 66 },
          icon: 'RefreshCw',
          sourceIndex: 2,
        },
        {
          id: 'arm_cam_kid',
          simpleName: { vi: 'Đầu ngắm camera hỗ trợ', en: 'Helper Alignment Cameras' },
          shortRole: {
            vi: 'Giúp phi hành gia nhìn rõ tâm ngắm khi điều khiển.',
            en: 'Helps astronauts see crosshairs while steering.',
          },
          voiceLine: {
            vi: 'Đôi mắt camera gắn trên đầu kẹp và khớp khuỷu giúp các phi hành gia nhìn thật rõ để bắt tàu an toàn.',
            en: 'Watchful cameras on the arm let astronauts line up cargo pins safely!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/iss071e384199/iss071e384199~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Gắn tại lòng đầu kẹp và gần khớp khuỷu tay',
            en: 'Tucked inside the end effector and on the elbow booms',
          },
          hotspotCoords: { x: 25, y: 40 },
          icon: 'Camera',
          sourceIndex: 0,
        },
      ],
      funFact: {
        vi: 'Cánh tay robot này có thể tự "bò" từ chỗ này sang chỗ khác trên trạm như chú sâu đo!',
        en: 'This robot arm can walk across the outside of the space station like an inchworm!',
      },
      funFactSpeech: {
        vi: 'Em có biết không? Cánh tay Canadarm2 có hai bàn tay ở hai đầu nên có thể tự bò đi khắp trạm vũ trụ như chú sâu đo đấy!',
        en: 'Did you know? Canadarm2 has hands on both ends so it can walk around the space station like an inchworm!',
      },
    },
    introKid: {
      whatIsIt: {
        vi: 'Canadarm2 là cánh tay robot siêu khỏe do Cơ quan Vũ trụ Canada (CSA) chế tạo, có 7 khớp xoay linh hoạt và hai "bàn tay" giống hệt nhau ở hai đầu.',
        en: 'Canadarm2 is a super-strong space robotic arm built by Canada with 7 motorized joints and identical hands at both ends.',
      },
      purpose: {
        vi: 'Lắp ghép các khoang phòng mới của ISS, di chuyển thiết bị nặng, hỗ trợ phi hành gia đi bộ ngoài không gian và "bắt" tàu chở hàng.',
        en: 'Assemble ISS modules, move heavy equipment, assist spacewalkers, and catch visiting cargo ships.',
      },
      howItWorks: {
        vi: 'Một đầu cánh tay cắm chặt vào "ổ cắm" trên trạm để lấy điện làm gốc tựa, 7 khớp xoay đưa đầu còn lại vươn tới bắt vật nặng; thậm chí hai đầu có thể đổi vai cho nhau để bước đi khắp trạm!',
        en: 'One hand locks onto a station socket for power while the 7 joints steer the other hand—letting it reach cargo or inchworm across the station.',
      },
      missionObjectives: [
        {
          icon: 'Rocket',
          title: { vi: 'Bắt tàu chở hàng ngoài không gian', en: 'Catch Visiting Cargo Ships' },
          desc: {
            vi: 'Vươn ra nhẹ nhàng tóm lấy các tàu tiếp tế đồ ăn và thí nghiệm đang bay song song trạm.',
            en: 'Safely grapple free-flying cargo vehicles bringing food and science gear to astronauts.',
          },
        },
        {
          icon: 'Wrench',
          title: { vi: 'Lắp ráp & sửa chữa ngoài trạm', en: 'Assemble & Maintain ISS' },
          desc: {
            vi: 'Di chuyển các khối pin, ăng-ten nặng hàng tấn mà phi hành gia khó tự bưng bê.',
            en: 'Relocate multi-ton modules, external experiments, and replacement batteries.',
          },
        },
        {
          icon: 'Shield',
          title: { vi: 'Làm thang nâng cho phi hành gia', en: 'Support Spacewalking Astronauts' },
          desc: {
            vi: 'Giữ chân phi hành gia ở đầu cánh tay để đưa họ tới đúng chỗ cần vặn ốc sửa trạm.',
            en: 'Carry astronauts on its tip right up to tight exterior repair spots.',
          },
        },
      ],
      workflowSteps: [
        {
          step: 1,
          title: { vi: 'Cắm neo lấy điện', en: 'Anchor & Power Up' },
          desc: {
            vi: 'Một đầu LEE khóa chặt vào chốt cắm điện trên thân ISS để làm "vai" cố định.',
            en: 'One LEE locks into an ISS power/data socket to become the base.',
          },
          icon: 'Zap',
        },
        {
          step: 2,
          title: { vi: 'Quan sát qua 4 camera', en: 'Aim with Cameras' },
          desc: {
            vi: 'Phi hành gia hoặc kỹ sư mặt đất nhìn hình ảnh từ camera ở khuỷu và đầu kẹp.',
            en: 'Operators watch live video from elbow and end-effector cameras.',
          },
          icon: 'Camera',
        },
        {
          step: 3,
          title: { vi: 'Phối hợp 7 khớp xoay', en: 'Move 7 Joints' },
          desc: {
            vi: 'Máy tính quay đồng bộ 3 khớp vai, 1 khuỷu và 3 cổ tay tránh va vào pin Mặt Trời.',
            en: 'Control computers bend shoulder, elbow, and wrist joints around obstacles.',
          },
          icon: 'Compass',
        },
        {
          step: 4,
          title: { vi: 'Siết chặt & di chuyển', en: 'Latch & Relocate' },
          desc: {
            vi: 'Đầu kẹp tự do đóng 3 dây cáp thép khóa cứng vật cần giữ rồi đưa vào đúng vị trí.',
            en: 'Wire snares close tightly around the target pin to pull it safely into place.',
          },
          icon: 'Wrench',
        },
      ],
      keyParts: [
        {
          name: 'Shoulder, Elbow & Wrist Joints',
          role: {
            vi: '7 khớp xoay giúp cánh tay vươn, gập và xoay góc chính xác mọi hướng 3D.',
            en: '7 motorized joints giving full 3D reach and obstacle-avoidance flexibility.',
          },
        },
        {
          name: 'Latching End Effector (LEE)',
          role: {
            vi: 'Hai "bàn tay" đối xứng ở hai đầu dùng cáp thép bắt chặt chốt và truyền điện.',
            en: 'Identical grappling hands at both ends with steel snares and power pins.',
          },
        },
        {
          name: 'Cameras',
          role: {
            vi: '4 camera có đèn chiếu sáng giúp ngắm chuẩn từng milimét khi gắp vật.',
            en: '4 onboard lighted cameras giving pinpoint alignment views.',
          },
        },
        {
          name: 'Control System',
          role: {
            vi: 'Máy tính và trạm điều khiển giúp điều phối nhịp nhàng tất cả 7 khớp cùng lúc.',
            en: 'Flight computers and astronaut hand-controller station coordinating motion.',
          },
        },
      ],
      funFacts: {
        vi: [
          'Nhờ môi trường không trọng lượng, Canadarm2 nặng chỉ ~1,5 tấn nhưng được thiết kế để nhấc tải trọng tới 116.000 kg — tương đương một tàu con thoi!',
          'Thân ống của cánh tay làm từ 19 lớp sợi carbon siêu bền nên vừa nhẹ vừa cứng như thép.',
          'Canadarm2 có thể tự "bước đi" như con sâu đo dọc theo thân trạm vũ trụ bằng cách luân phiên nhả một đầu và bám đầu kia!',
        ],
        en: [
          'In microgravity, Canadarm2 is designed to handle payloads up to 116,000 kg—about the mass of an entire Space Shuttle!',
          'Its booms are crafted from 19 layers of ultra-strong carbon thermoplastic composite.',
          'Because both ends are identical hands, it can walk end-over-end across the ISS like an inchworm!',
        ],
      },
    },
    detailedArchive: {
      overview: {
        vi: 'Canadarm2 (tên kỹ thuật: SSRMS) là thiết bị đóng góp nổi tiếng nhất của Cơ quan Vũ trụ Canada cho ISS. Chiều dài 17,6 m với hai đầu kẹp giống hệt nhau giúp nó linh hoạt hơn hẳn cánh tay robot thông thường chỉ gắn cố định một gốc.',
        en: 'Canadarm2 (SSRMS) is Canada’s signature contribution to the ISS. Its 17.6 m symmetric design allows either end to serve as the anchored base or working hand.',
      },
      missionAndPurpose: {
        vi: 'Phần lớn các khoang khổng lồ của Trạm Vũ trụ Quốc tế ngày nay đều từng được Canadarm2 nhấc đặt và ghép khít vào vị trí. Hiện nay nó giữ vai trò cần cẩu bảo trì và "thủ môn" bắt tàu hàng tiếp tế.',
        en: 'Canadarm2 helped assemble the majority of the ISS in orbit and now serves as its primary cargo catcher and exterior maintenance crane.',
      },
      operatingPrinciple: {
        vi: 'Chỉ cần 6 khớp để đi tới mọi điểm trong không gian 3D, nhưng Canadarm2 có tới 7 khớp xoay — khớp dư ra này cho phép nó uốn cong khuỷu tay né qua cánh pin Mặt Trời hoặc ăng-ten mà đầu kẹp vẫn giữ đúng hướng mục tiêu.',
        en: 'With 7 rotary joints (one extra "redundant" degree of freedom), Canadarm2 can bend its elbow safely around station trusses while keeping the target tip locked on course.',
      },
      technicalHighlight: {
        title: {
          vi: 'Cách Canadarm2 "bước đi" như sâu đo trên vỏ ISS',
          en: 'How Canadarm2 Walks Like an Inchworm Across the ISS',
        },
        content: {
          vi: '1. Đầu A cắm vào ổ chốt PDGF trên vỏ trạm để lấy điện và giữ gốc.\n2. Cánh tay gập 7 khớp đưa đầu B vươn tới cắm vào ổ chốt thứ hai ở khu vực mới.\n3. Khi đầu B đã nhận đủ điện và khóa chặt, đầu A nhả chốt ra để trở thành "bàn tay" mới!',
          en: '1. End A latches into an exterior power/data socket (PDGF).\n2. The 7 joints swing End B to latch into a second socket farther along the station.\n3. Once End B powers up, End A releases to become the new working hand!',
        },
      },
      simulationNote: {
        vi: 'Trong game, tình huống sai lệch cảm biến góc khớp cổ tay khi nhiệt độ thay đổi là mô phỏng giáo dục (GAME SIMULATION) giúp bạn thực hành hiệu chuẩn cảm biến cánh tay robot.',
        en: 'In-game wrist angle drift during thermal swings is a GAME SIMULATION teaching robotic sensor calibration.',
      },
      components: [
        {
          id: 'c2_shoulder',
          name: 'Shoulder Joints',
          shortDesc: {
            vi: 'Cụm 3 khớp xoay chịu lực lớn ở đầu đang gắn cố định vào trạm (cuộn, xoay ngang, ngẩng/cúi).',
            en: 'Three powerful rotary joints (roll, yaw, pitch) at the anchored base end of the arm.',
          },
          functionDesc: {
            vi: 'Định hướng toàn bộ cánh tay dài 17,6 m vươn tới khu vực cần thao tác và chịu mô-men xoắn khi nâng thiết bị nặng.',
            en: 'Sweeps the entire 17.6-meter boom across 3D space and bears heavy payload forces.',
          },
          analogy: {
            vi: 'Bộ phận này giống như khớp vai của người giúp xoay cả cánh tay ra trước, lên trên hoặc sang ngang.',
            en: 'This part is like a human shoulder swinging the whole arm in any direction.',
          },
          icon: 'Compass',
          imageUrl: 'https://images-assets.nasa.gov/image/iss072e576480/iss072e576480~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Các đoạn cần nối qua cụm khớp xoay của Canadarm2 trên quỹ đạo (NASA).',
            en: 'Real photo: Canadarm2 booms and rotary joint assemblies outside the ISS (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 0,
        },
        {
          id: 'c2_elbow',
          name: 'Elbow Joint',
          shortDesc: {
            vi: 'Khớp bản lề nằm chính giữa hai đoạn cần sợi carbon, giúp cánh tay gập duỗi linh hoạt.',
            en: 'Central hinge joint connecting the upper and lower carbon-fiber booms.',
          },
          functionDesc: {
            vi: 'Thay đổi tầm với xa gần của cánh tay và uốn cong đường cần để tránh va chạm vào vỏ trạm hay tấm pin Mặt Trời.',
            en: 'Bends and extends the arm’s reach while steering clear of nearby solar wings and modules.',
          },
          analogy: {
            vi: 'Bộ phận này giống như khuỷu tay giúp co gập cánh tay lại gần hoặc duỗi thẳng ra xa.',
            en: 'This part is like an elbow bending to fold close or stretch far out.',
          },
          icon: 'Wrench',
          imageUrl: 'https://images-assets.nasa.gov/image/iss071e418235/iss071e418235~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Khớp khuỷu ở giữa cánh tay Canadarm2 gập góc khi làm việc ngoài ISS (CSA).',
            en: 'Real photo: Canadarm2 flexing its central elbow joint outside the ISS (CSA).',
          },
          accuracy: 'FACT',
          sourceIndex: 0,
        },
        {
          id: 'c2_wrist',
          name: 'Wrist Joints',
          shortDesc: {
            vi: 'Cụm 3 khớp xoay tinh chỉnh đặt ngay phía sau đầu kẹp ở đầu đang thao tác.',
            en: 'Three fine-tuning rotary joints positioned right behind the active grappling hand.',
          },
          functionDesc: {
            vi: 'Xoay nhẹ và căn chỉnh chính xác từng góc nhỏ để đầu kẹp khớp thẳng hàng với chốt gắp trên tàu hàng hoặc thiết bị.',
            en: 'Steers the end effector at exact angles to align cleanly with cargo capture pins.',
          },
          analogy: {
            vi: 'Bộ phận này giống như cổ tay linh hoạt giúp xoay bàn tay vào đúng góc để cầm nắm đồ vật.',
            en: 'This part is like your wrist twisting smoothly to line up your hand.',
          },
          icon: 'Sliders',
          imageUrl: 'https://images-assets.nasa.gov/image/iss072e574907/iss072e574907~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cụm khớp cổ tay và đầu kẹp hỗ trợ phi hành gia đi bộ ngoài không gian (NASA).',
            en: 'Real photo: Canadarm2 wrist joints positioning an astronaut during a spacewalk (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 0,
        },
        {
          id: 'c2_lee',
          name: 'Latching End Effector (LEE)',
          shortDesc: {
            vi: 'Hai "bàn tay" giống hệt nhau gắn ở hai đầu Canadarm2 dùng dây cáp thép để bắt và khóa chặt chốt.',
            en: 'Two identical grappling hands at both ends using steel wire snares to grab and lock pins.',
          },
          functionDesc: {
            vi: 'Bên trong có 3 dây cáp xoắn siết chặt chốt neo, kéo sát vật vào khóa cứng và đồng thời truyền điện, dữ liệu qua các chân tiếp xúc.',
            en: 'Closes three internal wire snares around a target pin, pulls it rigid, and mates power and data plugs.',
          },
          analogy: {
            vi: 'Bộ phận này giống như bàn tay robot vừa tóm chặt đồ vật vừa cắm luôn phích điện vào ổ.',
            en: 'This part is like a robotic hand that grabs a handle and plugs in power at the same time.',
          },
          icon: 'Shield',
          imageUrl: 'https://images-assets.nasa.gov/image/iss075e0014476/iss075e0014476~large.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Cận cảnh đầu kẹp Latching End Effector (LEE) trên trạm ISS (NASA).',
            en: 'Real photo: Close-up of Canadarm2’s Latching End Effector on the ISS (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 0,
        },
        {
          id: 'c2_cameras',
          name: 'Cameras',
          shortDesc: {
            vi: '4 camera kèm đèn chiếu gắn tại hai đầu kẹp LEE và hai bên khớp khuỷu tay.',
            en: 'Four lighted video cameras mounted inside both LEEs and on the elbow booms.',
          },
          functionDesc: {
            vi: 'Giúp phi hành gia nhìn thấy mục tiêu trên màn hình khi thực hiện cú gắp chính xác trong bóng tối hoặc ánh nắng gắt ngoài vũ trụ.',
            en: 'Gives astronauts and ground controllers close-up alignment views even during orbital darkness.',
          },
          analogy: {
            vi: 'Bộ phận này giống như camera gắn ngay trên cần cẩu và lòng bàn tay để người lái nhìn rõ vị trí gắp.',
            en: 'This part is like backup/palm cameras helping the operator line up a crane hook.',
          },
          icon: 'Camera',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho vị trí camera quan sát dọc cần và trong đầu kẹp LEE.',
            en: 'Technical illustration representing Canadarm2’s boom and boresight cameras.',
          },
          accuracy: 'FACT',
          sourceIndex: 1,
        },
        {
          id: 'c2_control',
          name: 'Control System',
          shortDesc: {
            vi: 'Hệ thống máy tính điều khiển chuyển động gắn liền với trạm điều khiển RWS bên trong ISS và mặt đất.',
            en: 'Robotic flight computers paired with the Robotics Workstation (RWS) and ground control.',
          },
          functionDesc: {
            vi: 'Biến thao tác đẩy tay cầm đơn giản của phi hành gia thành chuyển động phối hợp mượt mà cho cả 7 khớp cùng lúc.',
            en: 'Translates simple joystick inputs into smooth, collision-safe motion across all 7 joints simultaneously.',
          },
          analogy: {
            vi: 'Bộ phận này giống như bộ não và bảng tay cầm chơi game giúp điều khiển cả cánh tay robot nhịp nhàng.',
            en: 'This part is like the brain and dual joysticks steering all 7 arm joints smoothly.',
          },
          icon: 'Cpu',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho máy tính điều khiển và trạm tay cầm của phi hành gia.',
            en: 'Technical illustration representing robotic control computers and hand controllers.',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
      ],
    },
    sources: [
      {
        title: 'Canadian Space Agency: About Canadarm2',
        organization: 'Canadian Space Agency',
        url: 'https://www.asc-csa.gc.ca/eng/iss/canadarm2/about.asp',
      },
      {
        title: 'Canadian Space Agency: Canadarm2 Portal & Specs',
        organization: 'Canadian Space Agency',
        url: 'https://www.asc-csa.gc.ca/eng/iss/canadarm2/',
      },
      {
        title: 'Canadian Space Agency: Dextre & ISS Robotics',
        organization: 'Canadian Space Agency',
        url: 'https://www.asc-csa.gc.ca/eng/iss/dextre/',
      },
      {
        title: 'NASA: Robotics & Mobile Servicing System',
        organization: 'NASA',
        url: 'https://www.nasa.gov/robotics/',
      },
      {
        title: 'NASA Image and Video Library',
        organization: 'NASA',
        url: 'https://images.nasa.gov/',
      },
    ],
  },

  // =========================================================================
  // MISSION 05: HUBBLE SPACE TELESCOPE
  // =========================================================================
  {
    missionId: 'mission_05_space_telescope',
    missionNumber: '05',
    equipmentName: {
      vi: 'Kính Thiên Văn Không Gian Hubble',
      en: 'Hubble Space Telescope (HST)',
    },
    agency: 'NASA & European Space Agency (ESA)',
    heroImageUrl: 'https://images-assets.nasa.gov/image/sts061-57-021/sts061-57-021~medium.jpg',
    fallbackImageUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
    anatomyImageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/04/hubbleinstruments-graphic.gif',
    whereItOperates: {
      vi: 'Quỹ đạo phía trên bầu khí quyển Trái Đất ở độ cao ~535–547 km',
      en: 'Orbiting above Earth’s atmosphere at ~535–547 km altitude',
    },
    shortTypeSummary: {
      vi: 'Một đài quan sát vũ trụ to bằng xe buýt trường học (~13,2 m), giúp chụp những bức ảnh vũ trụ rõ nét nhất.',
      en: 'A school-bus-sized space observatory (~13.2 m long) taking crystal-clear portraits of the cosmos.',
    },
    launchAndOrbit: {
      vi: 'Phóng: 24/04/1990 (Tàu con thoi Discovery) · Quay 1 vòng quanh Trái Đất mỗi ~95 phút',
      en: 'Launched: April 24, 1990 · Circles Earth once every ~95 minutes',
    },
    galleryImages: [
      {
        url: 'https://images-assets.nasa.gov/image/sts061-57-021/sts061-57-021~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Toàn cảnh Hubble trong không gian',
          en: 'Hubble Space Telescope in Orbit',
        },
        caption: {
          vi: 'Ảnh thật kính thiên văn Hubble lơ lửng phía trên Trái Đất xanh với Mặt Trăng phía xa.',
          en: 'Real NASA photo of Hubble orbiting high above Earth with the Moon in the background.',
        },
        sourceLabel: 'NASA (STS-61)',
        mediaKind: 'real_photo',
        viewCategory: 'overview',
      },
      {
        url: 'https://images-assets.nasa.gov/image/8218871/8218871~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Cận cảnh chiếc gương chính 2,4 m của Hubble',
          en: 'Close-Up of Hubble’s 2.4 m Primary Mirror',
        },
        caption: {
          vi: 'Ảnh thật chiếc gương cong khổng lồ sáng bóng giúp gom ánh sáng từ các ngôi sao xa.',
          en: 'Real NASA photo of Hubble’s polished 2.4-meter mirror collecting distant starlight.',
        },
        sourceLabel: 'NASA History (8218871)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/KSC-08pd2457/KSC-08pd2457~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Cận cảnh máy ảnh không gian Wide Field Camera 3',
          en: 'Close-Up of Wide Field Camera 3 (WFC3)',
        },
        caption: {
          vi: 'Ảnh thật máy ảnh đa năng WFC3 trước khi được các phi hành gia lắp nâng cấp cho Hubble.',
          en: 'Real NASA photo of the WFC3 science camera prepared for installation inside Hubble.',
        },
        sourceLabel: 'NASA KSC (KSC-08pd2457)',
        mediaKind: 'real_photo',
        viewCategory: 'closeup',
      },
      {
        url: 'https://images-assets.nasa.gov/image/s31-03-002/s31-03-002~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Hubble triển khai cánh pin & ăng-ten ngoài quỹ đạo',
          en: 'Hubble Deployed with Solar Wings & Dishes',
        },
        caption: {
          vi: 'Ảnh thật Hubble mở đôi cánh pin Mặt Trời và đĩa ăng-ten ngay khi bước vào quỹ đạo Trái Đất.',
          en: 'Real NASA photo of Hubble with extended solar arrays and high-gain antenna dishes.',
        },
        sourceLabel: 'NASA (STS-31)',
        mediaKind: 'real_photo',
        viewCategory: 'operation',
      },
      {
        url: 'https://science.nasa.gov/wp-content/uploads/2023/04/hubbleinstruments-graphic.gif',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Sơ đồ cấu tạo bên trong gương và máy ảnh Hubble',
          en: 'Cutaway Diagram Inside Hubble Observatory',
        },
        caption: {
          vi: 'Sơ đồ kỹ thuật chính thức của NASA minh họa đường đi ánh sáng qua gương và các máy ảnh.',
          en: 'Official NASA cutaway diagram showing how starlight hits Hubble’s mirrors and cameras.',
        },
        sourceLabel: 'NASA / ESA Hubble',
        mediaKind: 'technical_diagram',
        viewCategory: 'anatomy',
      },
      {
        url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Những cột trụ sáng tạo (Tinh vân Đại Bàng)',
          en: 'Cosmic Photo: Pillars of Creation by Hubble',
        },
        caption: {
          vi: 'Ảnh thật do Hubble chụp tinh vân Đại Bàng rực rỡ — nơi hàng loạt ngôi sao mới đang sinh ra.',
          en: 'Real Hubble photo of the Eagle Nebula’s famous Pillars of Creation star nursery.',
        },
        sourceLabel: 'NASA / ESA / STScI',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
      {
        url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002076/GSFC_20171208_Archive_e002076~medium.jpg',
        fallbackUrl: '/src/assets/images/hero_space_academy_1794503038299.jpg',
        title: {
          vi: 'Kết quả nhiệm vụ: Đám mây sao Tinh vân Carina',
          en: 'Cosmic Photo: Carina Nebula Landscape',
        },
        caption: {
          vi: 'Ảnh thật do Hubble chụp đỉnh núi khí và bụi khổng lồ lung linh sắc màu ngoài vũ trụ.',
          en: 'Real Hubble photo of glowing gas-and-dust peaks in the Carina Nebula.',
        },
        sourceLabel: 'NASA / ESA / STScI',
        mediaKind: 'real_photo',
        viewCategory: 'mission_result',
      },
    ],
    preschool: {
      simpleName: {
        vi: 'Kính Thiên Văn Hubble',
        en: 'Hubble Space Telescope',
      },
      badgeEmoji: '🔭',
      whatIsItSpeech: {
        vi: 'Chào nhà ngắm sao nhí! Đây là kính thiên văn Hubble đang bay cao để ngắm bầu trời vũ trụ!',
        en: 'Hi little stargazer! This is Hubble, a giant space telescope floating high to look at the stars!',
      },
      usedForShort: {
        vi: 'Kính thiên văn bay trong không gian, giúp con người nhìn thấy các ngôi sao và thiên hà.',
        en: 'A telescope flying in space that helps us see distant stars and galaxies.',
      },
      usedForSpeech: {
        vi: 'Hubble là kính thiên văn bay trong không gian, giúp con người nhìn thấy các ngôi sao và thiên hà lung linh.',
        en: 'Hubble is a telescope in space that helps people see shimmering stars and galaxies far away.',
      },
      parts: [
        {
          id: 'hst_mirror_kid',
          simpleName: { vi: 'Gương lớn đón ánh sao', en: 'Giant Star Mirror' },
          shortRole: {
            vi: 'Hứng ánh sáng từ các ngôi sao ở rất xa.',
            en: 'Collects light from faraway stars and galaxies.',
          },
          voiceLine: {
            vi: 'Đây là chiếc gương khổng lồ sáng bóng! Giúp hứng ánh sáng từ các ngôi sao ở rất xa.',
            en: 'This is the shiny giant mirror! It collects light from stars far, far away.',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/8218871/8218871~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Nằm sâu bên trong ống kính bạc ngay sau cửa nắp mở',
            en: 'Inside the silver optical tube behind the open door',
          },
          hotspotCoords: { x: 50, y: 45 },
          icon: 'Sparkles',
          sourceIndex: 1,
        },
        {
          id: 'hst_cam_kid',
          simpleName: { vi: 'Máy ảnh chụp bầu trời (WFC3)', en: 'Star Camera (WFC3)' },
          shortRole: {
            vi: 'Chụp ảnh các ngôi sao và tinh vân đầy màu sắc.',
            en: 'Takes crisp photos of stars and colorful nebulae.',
          },
          voiceLine: {
            vi: 'Máy ảnh đặc biệt này chụp lại những bức ảnh ngôi sao và đám mây vũ trụ đầy màu sắc.',
            en: 'This special camera snaps gorgeous, colorful photos of stars and space clouds!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/KSC-08pd2457/KSC-08pd2457~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Lắp đặt ở khoang máy ảnh phía đuôi thân kính Hubble',
            en: 'Located in the instrument bay at the aft tail',
          },
          hotspotCoords: { x: 57, y: 66 },
          icon: 'Camera',
          sourceIndex: 3,
        },
        {
          id: 'hst_solar_kid',
          simpleName: { vi: 'Đôi cánh pin Mặt Trời', en: 'Solar Wings' },
          shortRole: {
            vi: 'Lấy năng lượng từ nắng Mặt Trời để tạo điện.',
            en: 'Catches sunlight to power cameras and sensors.',
          },
          voiceLine: {
            vi: 'Hai đôi cánh pin Mặt Trời cung cấp điện để kính Hubble thức cả ngày lẫn đêm.',
            en: 'Two solar wings give Hubble plenty of power to watch the sky day and night!',
          },
          imageUrl: 'https://images-assets.nasa.gov/image/KSC-01pp1636/KSC-01pp1636~medium.jpg',
          isRealPhoto: true,
          mediaKind: 'real_photo',
          locationCallout: {
            vi: 'Hai cánh màu xanh dương xòe ra hai bên thân kính',
            en: 'Twin blue panels extending from both sides of Hubble',
          },
          hotspotCoords: { x: 25, y: 50 },
          icon: 'Sun',
          sourceIndex: 5,
        },
        {
          id: 'hst_balance_kid',
          simpleName: { vi: 'Bánh đà giữ thăng bằng', en: 'Balance Wheels' },
          shortRole: {
            vi: 'Giữ kính đứng thật yên để ảnh ngôi sao không bị mờ.',
            en: 'Keeps the telescope rock-steady for sharp photos.',
          },
          voiceLine: {
            vi: 'Bên trong có các bánh đà quay tròn giúp kính đứng thật yên để chụp ảnh không bị rung!',
            en: 'Spinning balance wheels inside keep Hubble super still so star photos stay crisp!',
          },
          isRealPhoto: false,
          mediaKind: 'illustration',
          locationCallout: {
            vi: 'Đặt kín bên trong thân kính gần khoang thiết bị',
            en: 'Housed inside the spacecraft equipment section',
          },
          hotspotCoords: { x: 46, y: 57 },
          illustrationKind: 'balance_wheel',
          icon: 'Compass',
          sourceIndex: 2,
        },
      ],
      funFact: {
        vi: 'Hubble bay cao hơn mọi đám mây, nên ảnh chụp các ngôi sao rõ nét hơn hẳn ở mặt đất!',
        en: 'Hubble floats high above every cloud, so its star photos are super crystal clear!',
      },
      funFactSpeech: {
        vi: 'Em có biết không? Kính Hubble bay cao hơn tất cả các đám mây trên trời, nên chụp ảnh các ngôi sao rõ nét gấp nhiều lần ở mặt đất đấy!',
        en: 'Did you know? Hubble flies above all the clouds, so its photos of stars are crystal clear!',
      },
    },
    introKid: {
      whatIsIt: {
        vi: 'Kính thiên văn không gian Hubble là đài quan sát nằm ngoài bầu khí quyển mây mù của Trái Đất, giúp nhìn thấu các thiên hà cách xa hàng tỷ năm ánh sáng.',
        en: 'Hubble is a giant space telescope flying above Earth’s blurring clouds and air, peering billions of light-years into space.',
      },
      purpose: {
        vi: 'Chụp ảnh sắc nét các tinh vân, thiên hà xa xôi, tìm hiểu hố đen, bầu khí quyển ngoại hành tinh và đo tuổi của vũ trụ (~13,8 tỷ năm).',
        en: 'Capture sharp images of nebulae and galaxies, study black holes and exoplanets, and measure the age of the universe (~13.8 billion years).',
      },
      howItWorks: {
        vi: 'Ánh sáng từ ngôi sao dội qua gương chính 2,4 m hội tụ vào máy ảnh ACS và WFC3; các bánh đà và cảm biến sao giữ kính đứng yên tuyệt đối rồi anten gửi ảnh qua vệ tinh về Trái Đất.',
        en: 'Starlight bounces off a 2.4 m mirror into ACS and WFC3 cameras while reaction wheels hold aim steady and antennas beam photos to Earth.',
      },
      missionObjectives: [
        {
          icon: 'Sparkles',
          title: { vi: 'Nhìn về thời sơ khai vũ trụ', en: 'Explore the Deep Universe' },
          desc: {
            vi: 'Chụp những bức ảnh thiên hà cổ đại cách hàng tỷ năm ánh sáng để tính tuổi vũ trụ.',
            en: 'Image ancient galaxies billions of light-years away to measure cosmic history.',
          },
        },
        {
          icon: 'Sun',
          title: { vi: 'Khám phá nơi ngôi sao sinh ra', en: 'Study Stars & Nebulae' },
          desc: {
            vi: 'Quan sát đám mây bụi và khí khổng lồ nơi hàng loạt ngôi sao, hành tinh mới hình thành.',
            en: 'Watch giant gas-and-dust nurseries giving birth to new stars and solar systems.',
          },
        },
        {
          icon: 'Globe',
          title: { vi: 'Nghiên cứu hành tinh & hố đen', en: 'Study Planets & Black Holes' },
          desc: {
            vi: 'Theo dõi bão trên Sao Mộc, phân tích không khí ngoại hành tinh và tìm bằng chứng hố đen.',
            en: 'Track storms on Jupiter, probe exoplanet skies, and confirm supermassive black holes.',
          },
        },
      ],
      workflowSteps: [
        {
          step: 1,
          title: { vi: 'Xoay ngắm không tốn xăng', en: 'Aim Without Thrusters' },
          desc: {
            vi: 'Các bánh đà quay bên trong khiến cả thân kính từ từ xoay đúng hướng ngôi sao cần chụp.',
            en: 'Spinning internal reaction wheels gently turn Hubble toward a new target.',
          },
          icon: 'RefreshCw',
        },
        {
          step: 2,
          title: { vi: 'Khóa cứng tiêu điểm sao', en: 'Lock On Guide Stars' },
          desc: {
            vi: 'Cảm biến dẫn đường FGS khóa vào sao chuẩn để kính đứng yên không rung dù chỉ một chút.',
            en: 'Fine Guidance Sensors lock onto guide stars for rock-steady pointing.',
          },
          icon: 'Eye',
        },
        {
          step: 3,
          title: { vi: 'Gom sáng bằng gương 2,4 m', en: 'Focus Starlight' },
          desc: {
            vi: 'Gương cong chính rộng 2,4 m phản xạ ánh sáng yếu ớt hội tụ vào máy ảnh phía sau.',
            en: 'The 2.4 m primary mirror reflects faint starlight into the aft camera bay.',
          },
          icon: 'Sparkles',
        },
        {
          step: 4,
          title: { vi: 'Chụp ảnh & gửi về Trái Đất', en: 'Snap & Beam Home' },
          desc: {
            vi: 'ACS và WFC3 ghi lại ảnh sắc nét rồi anten truyền qua vệ tinh tiếp sóng về NASA.',
            en: 'ACS and WFC3 record crisp images and antennas transmit files to NASA.',
          },
          icon: 'Radio',
        },
      ],
      keyParts: [
        {
          name: 'Optical Telescope & Mirrors',
          role: {
            vi: 'Ống kính và chiếc gương chính rộng 2,4 m gom ánh sáng từ vũ trụ sâu.',
            en: '2.4 m primary mirror system collecting faint light from distant galaxies.',
          },
        },
        {
          name: 'ACS & WFC3 Cameras',
          role: {
            vi: 'Hai "máy ảnh vũ trụ" chủ lực chụp tia cực tím, màu sắc và hồng ngoại.',
            en: 'Main space cameras imaging across ultraviolet, visible, and infrared light.',
          },
        },
        {
          name: 'Solar Arrays & Antennas',
          role: {
            vi: 'Đôi cánh pin Mặt Trời tạo điện và cụm anten truyền ảnh về NASA.',
            en: 'Twin solar wings powering the telescope and antennas beaming data home.',
          },
        },
        {
          name: 'Reaction Wheels & Fine Guidance Sensors',
          role: {
            vi: 'Bánh đà giúp xoay hướng êm ái và cảm biến giữ kính đứng yên siêu chuẩn.',
            en: 'Flywheels for smooth turning and optical sensors keeping aim steady.',
          },
        },
      ],
      funFacts: {
        vi: [
          'Độ chính xác khi ngắm sao của Hubble giống như bạn chiếu đèn tia laser trúng một đồng xu cách xa tới 320 km mà không bị run tay!',
          'Hubble được thiết kế theo từng ngăn tháo lắp nên các phi hành gia đã bay lên vũ trụ 5 lần (1993–2009) để thay pin và lắp máy ảnh mới cho kính!',
          'Bức ảnh "Hubble Ultra Deep Field" do kính chụp trên một khoảng trời bé tí đã phát hiện tới ~10.000 thiên hà!',
        ],
        en: [
          'Hubble’s pointing steadiness is like shining a laser beam on a dime 200 miles (320 km) away without shaking!',
          'Space Shuttle astronauts visited Hubble 5 times (1993–2009) to upgrade cameras, solar arrays, and batteries in orbit!',
          'One tiny patch of sky photographed by Hubble revealed roughly 10,000 galaxies!',
        ],
      },
    },
    detailedArchive: {
      overview: {
        vi: 'Kính thiên văn Hubble (hợp tác NASA & ESA) bay ở độ cao ~540 km phía trên lớp khí quyển Trái Đất. Nhờ không bị mây che hay không khí rung nhòe làm mờ sao, ảnh chụp từ Hubble nét hơn rất nhiều so với kính đặt dưới mặt đất.',
        en: 'Hubble (NASA/ESA) orbits at ~540 km above Earth’s turbulent air and clouds, producing far sharper cosmic views than ground-based telescopes.',
      },
      missionAndPurpose: {
        vi: 'Suốt hơn 3 thập kỷ, Hubble đã chụp hơn 1,6 triệu lượt quan sát thiên thể, góp phần khám phá năng lượng tối, xác định tuổi vũ trụ (~13,8 tỷ năm) và chụp ảnh những vườn ươm sao kỳ vĩ nhất.',
        en: 'Across more than three decades, Hubble has made 1.6+ million observations revealing cosmic expansion, star nurseries, and distant galaxies.',
      },
      operatingPrinciple: {
        vi: 'Hubble không dùng tên lửa phụt lửa để quay ống kính vì khói lửa sẽ làm bẩn gương; thay vào đó nó quay các bánh đà bằng điện bên trong thân kính (nguyên lý lực phản hồi) rồi phát dữ liệu qua mạng vệ tinh TDRSS về NASA Goddard.',
        en: 'Instead of firing exhaust thrusters that could dirty its optics, Hubble spins electric flywheels to turn smoothly, then beams files through TDRSS relay satellites.',
      },
      technicalHighlight: {
        title: {
          vi: 'Đường đi của bức ảnh vũ trụ từ Hubble về máy tính Trái Đất',
          en: 'How Hubble Pictures Travel from Deep Space to Earth',
        },
        content: {
          vi: 'Ánh sáng thiên hà đi vào gương 2,4 m → Máy ảnh ACS / WFC3 chuyển thành tệp ảnh số → Anten S-band phát lên vệ tinh tiếp sóng TDRSS ở quỹ đạo cao → Trạm mặt đất thu và gửi về Trung tâm NASA Goddard (STOCC) & Viện STScI để chia sẻ ảnh công khai.',
          en: 'Galaxy light focuses off the 2.4 m mirror → ACS & WFC3 cameras create digital files → Antennas transmit up to TDRSS relay satellites → Ground stations send data to NASA Goddard & STScI for calibration and public release.',
        },
      },
      simulationNote: {
        vi: 'Lưu ý: Trong gameplay Nhiệm vụ 05, kịch bản đưa kính tới điểm Lagrange L2 (lấy cảm hứng kết hợp với Kính James Webb) và lỗi rung bánh đà là mô hình mô phỏng giáo dục (GAME SIMULATION), tách biệt với hồ sơ thực tế của Hubble ở quỹ đạo ~540 km.',
        en: 'Note: Mission 05’s L2 gameplay scenario blends inspiration with Webb (GAME SIMULATION), while this NASA profile documents the real Hubble Space Telescope at ~540 km LEO.',
      },
      components: [
        {
          id: 'hst_ota',
          name: 'Optical Telescope',
          shortDesc: {
            vi: 'Cụm ống kính chính chứa chiếc gương cong khổng lồ đường kính 2,4 m nặng ~828 kg.',
            en: 'Core optical tube housing the famous 2.4-meter (7.9 ft) curved primary mirror.',
          },
          functionDesc: {
            vi: 'Thu gom ánh sáng yếu ớt từ các thiên hà xa hàng tỷ năm ánh sáng, phản xạ qua gương phụ và hội tụ vào khoang máy ảnh phía sau.',
            en: 'Gathers faint starlight from billions of light-years away, bounces it off a secondary mirror, and focuses it cleanly onto instruments.',
          },
          analogy: {
            vi: 'Bộ phận này giống như một cái phễu gương khổng lồ giúp hứng thật nhiều ánh sáng từ bầu trời đêm.',
            en: 'This part is like a giant super-smooth light bucket catching faint starlight.',
          },
          icon: 'Sparkles',
          imageUrl: 'https://images-assets.nasa.gov/image/8218871/8218871~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Gương chính 2,4 m sáng bóng của kính thiên văn Hubble trước khi lắp ráp (NASA).',
            en: 'Real photo: Hubble’s 2.4-meter primary mirror during assembly before launch (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 2,
        },
        {
          id: 'hst_acs',
          name: 'Advanced Camera for Surveys (ACS)',
          shortDesc: {
            vi: 'Máy ảnh khảo sát trường rộng chuyên chụp những vùng trời rộng lớn và thiên hà sâu xa.',
            en: 'High-resolution wide-field camera optimized for surveying distant galaxies and clusters.',
          },
          functionDesc: {
            vi: 'Chụp ảnh ánh sáng khả kiến và tia cực tím với trường nhìn rộng, tạo nên bức ảnh nổi tiếng Hubble Ultra Deep Field.',
            en: 'Captures visible and ultraviolet panoramas of cosmic evolution, including the famous Hubble Ultra Deep Field.',
          },
          analogy: {
            vi: 'Bộ phận này giống như ống kính góc rộng siêu nét chuyên chụp toàn cảnh thành phố đầy ánh sao.',
            en: 'This part is like a super-sharp wide-angle lens capturing thousands of galaxies at once.',
          },
          icon: 'Camera',
          imageUrl: 'https://images-assets.nasa.gov/image/0203046/0203046~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Thiết bị Advanced Camera for Surveys (ACS) trước khi được phi hành gia lắp lên Hubble (NASA).',
            en: 'Real photo: The Advanced Camera for Surveys (ACS) being prepared for installation (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
        {
          id: 'hst_wfc3',
          name: 'Wide Field Camera 3 (WFC3)',
          shortDesc: {
            vi: 'Máy ảnh đa năng hiện đại nhất trên Hubble (lắp năm 2009), chụp được cả tia cực tím, màu sắc và hồng ngoại.',
            en: 'Hubble’s newest versatile camera (installed 2009) seeing UV, visible, and infrared light.',
          },
          functionDesc: {
            vi: 'Nhờ dải hồng ngoại gần, WFC3 có thể nhìn xuyên qua các đám mây bụi dày đặc để thấy các ngôi sao trẻ đang hình thành bên trong.',
            en: 'Uses near-infrared vision to peer straight through thick cosmic dust clouds where newborn stars hide.',
          },
          analogy: {
            vi: 'Bộ phận này giống như chiếc máy ảnh đa chế độ vừa chụp ảnh màu vừa nhìn xuyên qua sương mù.',
            en: 'This part is like an all-in-one camera with color and dust-piercing infrared vision.',
          },
          icon: 'Camera',
          imageUrl: 'https://images-assets.nasa.gov/image/KSC-08pd2457/KSC-08pd2457~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Wide Field Camera 3 (WFC3) tại NASA Kennedy Space Center trước chuyến bay nâng cấp STS-125.',
            en: 'Real photo: Wide Field Camera 3 (WFC3) prepared at NASA Kennedy Space Center for STS-125.',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
        {
          id: 'hst_solar',
          name: 'Solar Arrays',
          shortDesc: {
            vi: 'Đôi cánh pin Mặt Trời gắn hai bên thân kính (thế hệ mới gắn năm 2002 gọn nhẹ hơn và khỏe hơn).',
            en: 'Twin rigid solar wings mounted on both sides of the telescope (upgraded in 2002).',
          },
          functionDesc: {
            vi: 'Biến ánh nắng ngoài không gian thành điện năng vận hành các máy ảnh khoa học, máy tính và sạc đầy 6 khối pin dùng ban đêm.',
            en: 'Generates electricity for cameras and avionics while charging six orbital batteries for Earth shadow passes.',
          },
          analogy: {
            vi: 'Bộ phận này giống như đôi cánh đón nắng cấp điện 24/24 cho kính thiên văn hoạt động.',
            en: 'This part is like two sun-catching wings powering the observatory day and night.',
          },
          icon: 'Sun',
          imageUrl: 'https://images-assets.nasa.gov/image/KSC-01pp1636/KSC-01pp1636~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Đôi cánh pin Mặt Trời nâng cấp cho kính Hubble trước chuyến bay bảo trì (NASA).',
            en: 'Real photo: Upgraded Hubble solar array wings prepared for Servicing Mission 3B (NASA).',
          },
          accuracy: 'FACT',
          sourceIndex: 4,
        },
        {
          id: 'hst_antennas',
          name: 'Antennas',
          shortDesc: {
            vi: 'Các cụm anten thu phát sóng S-band (gồm anten định hướng cao mở gập ra bên ngoài thân kính).',
            en: 'Low-Gain and deployable dish-shaped High-Gain S-band antennas.',
          },
          functionDesc: {
            vi: 'Nhận lệnh chụp ảnh mới từ Trái Đất và phát ngược những bức ảnh thiên hà sắc nét qua vệ tinh tiếp sóng TDRSS về NASA.',
            en: 'Receives target commands and beams space telescope photos through TDRSS relay satellites down to NASA.',
          },
          analogy: {
            vi: 'Bộ phận này giống như chảo thu phát sóng giúp Hubble gửi ảnh từ không gian về Trái Đất.',
            en: 'This part is like a satellite dish sending Hubble’s snapshots back down to Earth.',
          },
          icon: 'Radio',
          imageUrl: 'https://images-assets.nasa.gov/image/s31-03-002/s31-03-002~medium.jpg',
          isRealPhoto: true,
          imageCaption: {
            vi: 'Ảnh thật: Anten High-Gain dạng đĩa của Hubble bung ra khi vừa được phóng từ tàu Discovery.',
            en: 'Real photo: Hubble’s High-Gain Antenna dish deployed during Space Shuttle STS-31.',
          },
          accuracy: 'FACT',
          sourceIndex: 5,
        },
        {
          id: 'hst_rw',
          name: 'Reaction Wheels',
          shortDesc: {
            vi: '4 bánh đà bằng kim loại quay bằng mô-tơ điện nằm bên trong thân kính Hubble.',
            en: 'Four motor-driven internal flywheels spinning inside Hubble’s body.',
          },
          functionDesc: {
            vi: 'Khi bánh đà tăng tốc xoay về một phía, cả thân kính Hubble nặng 11 tấn tự động xoay nhẹ nhàng sang hướng ngược lại mà không cần đốt nhiên liệu tên lửa.',
            en: 'Using action-reaction physics, spinning these wheels smoothly rotates the 11-ton telescope without thruster exhaust.',
          },
          analogy: {
            vi: 'Bộ phận này giống như con quay xoay bên trong giúp cả đài quan sát từ từ quay đầu không cần động cơ đẩy.',
            en: 'This part is like spinning gyro-wheels that turn the telescope silently without fuel.',
          },
          icon: 'RefreshCw',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho cụm bánh đà phản lực nằm kín bên trong khoang thiết bị.',
            en: 'Technical illustration representing Hubble’s internal reaction wheel assemblies.',
          },
          accuracy: 'FACT',
          sourceIndex: 6,
        },
        {
          id: 'hst_fgs',
          name: 'Fine Guidance Sensors',
          shortDesc: {
            vi: '3 cảm biến quang học siêu nhạy đặt quanh rìa trường ngắm của kính Hubble.',
            en: 'Three ultra-precise optical sensors positioned around the edge of Hubble’s field of view.',
          },
          functionDesc: {
            vi: 'Khóa chặt vào các ngôi sao dẫn đường cố định để giữ ống kính không bị rung lệch quá 0,007 giây cung trong nhiều giờ phơi sáng.',
            en: 'Locks tightly onto guide stars so Hubble stays rock-steady during multi-hour deep-space exposures.',
          },
          analogy: {
            vi: 'Bộ phận này giống như hệ thống chống rung khóa nét siêu hạng giúp ảnh sao xa không bao giờ bị nhòe.',
            en: 'This part is like ultra-precise image stabilization locking onto reference stars.',
          },
          icon: 'Eye',
          isRealPhoto: false,
          imageCaption: {
            vi: 'Hình minh họa kỹ thuật cho cảm biến dẫn đường tinh vi nằm tại mặt phẳng tiêu.',
            en: 'Technical illustration representing Hubble’s Fine Guidance Sensors.',
          },
          accuracy: 'FACT',
          sourceIndex: 3,
        },
      ],
    },
    sources: [
      {
        title: 'NASA Science: About Hubble Space Telescope',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/overview/about-hubble/',
      },
      {
        title: 'NASA Science: Hubble Observatory Design',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/',
      },
      {
        title: 'NASA Science: Hubble Optics (2.4m Mirror)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/optics/',
      },
      {
        title: 'NASA Science: Hubble Instruments (ACS, WFC3, FGS)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/instruments/',
      },
      {
        title: 'NASA Science: Hubble Electrical Power',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/electrical-power/',
      },
      {
        title: 'NASA Science: Hubble Communications',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/design-communications/',
      },
      {
        title: 'NASA Science: Hubble Pointing Control (Reaction Wheels)',
        organization: 'NASA',
        url: 'https://science.nasa.gov/mission/hubble/observatory/design/pointing-control/',
      },
      {
        title: 'NASA Image and Video Library',
        organization: 'NASA',
        url: 'https://images.nasa.gov/',
      },
    ],
  },
];

export function getEquipmentProfileByMission(missionId: MissionId): MissionEquipmentProfile {
  return (
    NASA_EQUIPMENT_PROFILES.find((p) => p.missionId === missionId) || NASA_EQUIPMENT_PROFILES[0]
  );
}
