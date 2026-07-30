export const DAY_KEYS = [
  { key: 'monday', label: 'Thứ Hai' },
  { key: 'tuesday', label: 'Thứ Ba' },
  { key: 'wednesday', label: 'Thứ Tư' },
  { key: 'thursday', label: 'Thứ Năm' },
  { key: 'friday', label: 'Thứ Sáu' },
  { key: 'saturday', label: 'Thứ Bảy' },
  { key: 'sunday', label: 'Chủ Nhật' },
];

const standardSlots = [
  [
    '06:00',
    '07:30',
    [
      'Thức dậy, vệ sinh cá nhân, thể dục nhẹ nhàng & ăn sáng',
      'Thức dậy, uống 1 ly nước ấm, thiền định 10p & ăn sáng',
      'Thức dậy, vệ sinh cá nhân, chạy bộ nhẹ & ăn sáng',
      'Thức dậy, uống 1 ly nước ấm, đọc sách 15p & ăn sáng',
      'Thức dậy, vệ sinh cá nhân, thể dục nhẹ nhàng & ăn sáng',
      'Thức dậy thong thả, tập yoga & ăn sáng cùng gia đình',
      'Thức dậy thong thả, đi dạo công viên & ăn sáng',
    ],
  ],
  [
    '07:30',
    '09:00',
    [
      'Rà soát lịch làm việc trong ngày + Xử lý email ưu tiên',
      'Lập danh sách việc cần làm (To-Do List) + Xử lý công việc trọng tâm',
      'Rà soát mục tiêu tuần + Xử lý nhiệm vụ chính',
      'Kiểm tra tiến độ dự án + Xử lý phản hồi đối tác',
      'Tổng kết công việc cuối tuần + Chuẩn bị báo cáo',
      'Đọc sách phát triển bản thân / Học kỹ năng mới',
      'Dọn dẹp không gian sống, thư giãn & chăm sóc cây cảnh',
    ],
  ],
  [
    '09:00',
    '11:30',
    [
      'Tập trung làm việc sâu (Deep Work / Code / Biên tập)',
      'Tập trung làm việc sâu (Nghỉ 5p sau mỗi 45p tập trung)',
      'Tập trung làm việc sâu (Hoàn thành nhiệm vụ cốt lõi)',
      'Tập trung làm việc sâu & trao đổi chuyên môn',
      'Hoàn tất các việc còn tồn đọng trong tuần',
      'Tham gia khóa học online / Luyện tập kỹ năng',
      'Lập kế hoạch cho tuần mới & nghỉ ngơi tự do',
    ],
  ],
  [
    '11:30',
    '12:30',
    [
      'Ăn trưa dinh dưỡng & nghỉ ngơi nhẹ nhàng',
      'Ăn trưa & trò chuyện cùng đồng nghiệp/bạn bè',
      'Ăn trưa dinh dưỡng & nghỉ ngơi',
      'Ăn trưa & thư giãn',
      'Ăn trưa dinh dưỡng & chuẩn bị cho ca chiều',
      'Ăn trưa ấm cúng cùng gia đình',
      'Ăn trưa ấm cúng cùng gia đình',
    ],
  ],
  [
    '12:30',
    '13:00',
    [
      'Nghỉ trưa / Chợp mắt 20-30 phút để nạp lại năng lượng',
      'Nghỉ trưa 20-30 phút',
      'Nghỉ trưa 20-30 phút',
      'Nghỉ trưa 20-30 phút',
      'Nghỉ trưa 20-30 phút',
      'Nghỉ trưa thư giãn',
      'Nghỉ trưa thư giãn',
    ],
  ],
  [
    '13:00',
    '15:30',
    [
      'Xử lý công việc chiều + Thảo luận nhóm',
      'Xử lý hồ sơ, công văn & kiểm tra chất lượng',
      'Họp tiến độ dự án & phân công nhiệm vụ',
      'Tập trung xử lý công việc chuyên môn chiều',
      'Rà soát dữ liệu & lưu trữ tài liệu tuần',
      'Giải trí nhẹ nhàng, nghe nhạc hoặc xem phim',
      'Dành thời gian cho sở thích cá nhân / Gia đình',
    ],
  ],
  [
    '15:30',
    '16:30',
    [
      'Nghỉ giải lao chiều (Uống trà / Cà phê nhẹ) + Đọc tin tức',
      'Ăn nhẹ chiều + Vận động tay chân tại chỗ',
      'Uống nước / Giải lao chiều 15 phút',
      'Ăn nhẹ chiều + Thư giãn mắt',
      'Giải lao chiều + Trò chuyện thả lỏng',
      'Gặp gỡ bạn bè / Cà phê cuối tuần',
      'Chuẩn bị sinh hoạt gia đình',
    ],
  ],
  [
    '16:30',
    '18:00',
    [
      'Tập thể thao (Chạy bộ / Gym / Cầu lông) 45 phút',
      'Đi bộ thể thao 30-45 phút + Giãn cơ',
      'Tập thể thao giải tỏa căng thẳng',
      'Đi bộ / Đạp xe thể thao chiều',
      'Tập thể thao chốt tuần năng lượng',
      'Vận động ngoài trời / Dạo phố',
      'Chăm sóc bản thân & thư giãn',
    ],
  ],
  [
    '18:00',
    '19:30',
    [
      'Tắm rửa, chuẩn bị & ăn tối cùng gia đình',
      'Ăn tối ấm cúng & thư giãn',
      'Tắm rửa & ăn tối dinh dưỡng',
      'Ăn tối & trò chuyện cùng gia đình',
      'Tắm rửa & ăn tối chào đón cuối tuần',
      'Ăn tối cùng gia đình / Bạn bè',
      'Ăn tối ấm cúng cùng gia đình',
    ],
  ],
  [
    '19:30',
    '21:00',
    [
      'Học tập cá nhân / Đọc sách / Nâng cao kiến thức',
      'Thực hiện các dự án cá nhân / Viết lách',
      'Xem tài liệu chuyên môn / Học ngoại ngữ',
      'Giải trí nhẹ nhàng cùng gia đình',
      'Thư giãn xem phim / Đọc sách giải trí',
      'Sinh hoạt gia đình / Xem phim giải trí',
      'Đánh giá tổng kết tuần & chuẩn bị cho tuần mới',
    ],
  ],
  [
    '21:00',
    '22:00',
    [
      'Dọn dẹp bàn làm việc, kiểm tra lịch ngày mai',
      'Chuẩn bị trang phục & vật dụng cho ngày tiếp theo',
      'Đánh giá hiệu suất làm việc trong ngày',
      'Chuẩn bị không gian phòng ngủ thoáng mát',
      'Chuẩn bị kế hoạch thư giãn cuối tuần',
      'Thư giãn nhẹ nhàng trước khi ngủ',
      'Nghỉ ngơi chuẩn bị cho tuần làm việc mới',
    ],
  ],
  [
    '22:00',
    '00:15',
    [
      'Tắt thiết bị điện tử, đi ngủ đúng giờ (Đảm bảo ngủ 7-8 tiếng)',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Nghỉ ngơi ngủ sớm',
      'Nghỉ ngơi ngủ sớm',
    ],
  ],
];

const dailyFocus = {
  monday: 'Khởi động tuần mới tràn đầy năng lượng, hoàn thành các nhiệm vụ quan trọng nhất.',
  tuesday: 'Duy trì sự tập trung cao độ, xử lý dứt điểm các hạng mục tồn đọng.',
  wednesday: 'Rà soát tiến độ giữa tuần, điều chỉnh nhịp độ làm việc và duy trì năng lượng.',
  thursday: 'Tập trung vào chất lượng công việc, tối ưu hóa quy trình làm việc.',
  friday: 'Hoàn tất các chỉ tiêu tuần, tổng kết và chuẩn bị kế hoạch cho tuần tới.',
  saturday: 'Dành thời gian tái tạo sức lao động, học hỏi kỹ năng mới và thư giãn.',
  sunday: 'Nghỉ ngơi có chủ đích, chăm sóc bản thân, gia đình và sẵn sàng cho tuần mới.',
};

const buildCells = (texts) =>
  Object.fromEntries(
    DAY_KEYS.map((day, index) => [
      day.key,
      {
        text: texts[index] || 'Sinh hoạt khoa học',
        done: false,
        notes: '',
        adminLocked: false,
        category: index % 2 === 0 ? 'work' : 'health',
      },
    ])
  );

export function createDefaultPlan() {
  return {
    meta: {
      title: 'LỊCH SINH HOẠT THÔNG MINH & QUẢN LÝ TIẾN ĐỘ TUẦN',
      wakeTime: '06:00',
      sleepTime: '00:15',
      note: 'Hệ thống hỗ trợ quản lý lịch sinh hoạt, mục tiêu tuần và theo dõi tiến độ công việc hiệu quả.',
      updatedAt: new Date().toISOString(),
    },
    profile: {
      fullName: 'Người dùng ChronoFlow',
      role: 'Quản trị viên',
      trackingLevel: 'Tiêu chuẩn',
      contact: 'admin@chronoflow.local',
    },
    settings: {
      fontFamily: 'Inter',
      fontSize: 13,
      weekendHighlight: true,
      compact: false,
    },
    dailyFocus,
    weeklyGoals: [
      {
        id: 'goal-1',
        title: 'Hoàn thành 100% các công việc ưu tiên hàng ngày',
        result: 'Đạt chỉ tiêu 7/7 ngày',
        priority: 'Cao',
        dueDay: 'Chủ Nhật',
        done: false,
        notes: 'Tập trung làm việc theo chu kỳ Pomodoro',
      },
      {
        id: 'goal-2',
        title: 'Duy trì tập thể thao tổi thiểu 45 phút/ngày',
        result: 'Tối thiểu 5 buổi/tuần',
        priority: 'Cao',
        dueDay: 'Chủ Nhật',
        done: false,
        notes: 'Chạy bộ, thể hình hoặc thể thao ngoài trời',
      },
      {
        id: 'goal-3',
        title: 'Đọc hết 1 cuốn sách phát triển bản thân / chuyên môn',
        result: 'Đọc xong 1 cuốn',
        priority: 'Trung bình',
        dueDay: 'Thứ Sáu',
        done: false,
        notes: 'Dành 30 phút mỗi tối trước khi ngủ',
      },
    ],
    schedule: standardSlots.map(([start, end, texts], index) => ({
      id: `slot-${index + 1}`,
      start,
      end,
      cells: buildCells(texts),
    })),
    summary: {
      wins: 'Duy trì tốt tính kỷ luật và hoàn thành các mục tiêu quan trọng.',
      incomplete: 'Cần tối ưu hóa thời gian ngủ trưa đúng 30 phút.',
      lessons: 'Tập trung làm việc sâu vào buổi sáng mang lại hiệu suất gấp đôi.',
      nextWeek: 'Tiếp tục duy trì thói quen thức dậy sớm và tập thể thao.',
      score: 9,
      mood: 'Tích cực & Năng lượng',
    },
  };
}
