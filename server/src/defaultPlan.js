export const DAY_KEYS = [
  { key: 'monday', label: 'Thứ Hai' },
  { key: 'tuesday', label: 'Thứ Ba' },
  { key: 'wednesday', label: 'Thứ Tư' },
  { key: 'thursday', label: 'Thứ Năm' },
  { key: 'friday', label: 'Thứ Sáu' },
  { key: 'saturday', label: 'Thứ Bảy' },
  { key: 'sunday', label: 'Chủ Nhật' },
];

const maternalSlots = [
  [
    '06:00',
    '07:30',
    [
      'Th thức dậy chậm, uống 1 ly nước ấm, vệ sinh, ăn sáng nhẹ, uống Sắt & Folic Acid theo đơn',
      'Thức dậy chậm, uống nước ấm, vệ sinh, ăn sáng bổ dưỡng, uống thuốc vi chất theo đơn',
      'Th thức dậy chậm, uống 1 ly nước ấm, vệ sinh, ăn sáng nhẹ, uống Sắt & Folic Acid theo đơn',
      'Th thức dậy chậm, uống nước ấm, vệ sinh, ăn sáng bổ dưỡng, uống thuốc vi chất theo đơn',
      'Th thức dậy chậm, uống 1 ly nước ấm, vệ sinh, ăn sáng nhẹ, uống Sắt & Folic Acid theo đơn',
      'Thức dậy nhẹ nhàng, ngâm chân nước ấm, ăn sáng cùng gia đình, uống vi chất bổ sung',
      'Thức dậy thong thả, uống nước ấm, ăn sáng dinh dưỡng, kiểm tra sức khỏe đầu ngày',
    ],
  ],
  [
    '07:30',
    '09:00',
    [
      'Vận động thai kỳ nhẹ nhàng (15p Yoga bầu / đi bộ) + Kiểm tra lịch hẹn khám thai',
      'Kiểm tra lịch hẹn tái khám + Đếm thai máy buổi sáng (đếm 4+ lần cử động)',
      'Vận động thai kỳ nhẹ nhàng (15p Yoga bầu / đi bộ) + Đếm thai máy',
      'Kiểm tra lịch hẹn tái khám + Đếm thai máy buổi sáng',
      'Giãn cơ nhẹ nhàng + Đếm thai máy buổi sáng',
      'Tưới cây cảnh, đi dạo nhẹ công viên gần nhà + Thư giãn tinh thần',
      'Đọc sách thai giáo / Nghe nhạc cổ điển 432Hz cùng em bé',
    ],
  ],
  [
    '09:00',
    '11:30',
    [
      'Làm việc / học tập nhẹ nhàng (Nghỉ giải lao 5p sau mỗi 45p, uống 1 ly nước)',
      'Làm việc nhẹ nhàng (Tránh mang vác nặng, đứng quá lâu)',
      'Làm việc / học tập nhẹ nhàng (Nghỉ giải lao 5p sau mỗi 45p)',
      'Làm việc nhẹ nhàng (Nghỉ giải lao 5p sau mỗi 45p)',
      'Hoàn thành việc nhẹ trong tuần (Chuẩn bị giỏ đồ đi sinh / đồ sơ sinh)',
      'Nghỉ ngơi, trò chuyện nhẹ nhàng cùng người thân',
      'Chuẩn bị danh sách câu hỏi cho Bác sĩ sản khoa tuần tới',
    ],
  ],
  [
    '11:30',
    '12:30',
    [
      'Ăn trưa dinh dưỡng (Bổ sung Protein, rau xanh, trái cây), uống 1 ly nước lọc',
      'Ăn trưa dinh dưỡng (Ăn chín uống sôi, hạn chế đồ cay nóng)',
      'Ăn trưa dinh dưỡng (Bổ sung Protein, rau xanh, trái cây)',
      'Ăn trưa dinh dưỡng (Ăn chín uống sôi, hạn chế đồ cay nóng)',
      'Ăn trưa dinh dưỡng (Bổ sung Protein, rau xanh, trái cây)',
      'Ăn trưa bổ dưỡng cùng gia đình',
      'Ăn trưa bổ dưỡng cùng gia đình',
    ],
  ],
  [
    '12:30',
    '13:00',
    [
      'Chợp mắt ngủ trưa 20-30 phút (Nằm nghiêng trái kê gối ôm dưới bụng)',
      'Chợp mắt ngủ trưa 20-30 phút (Nằm nghiêng trái kê gối ôm dưới bụng)',
      'Chợp mắt ngủ trưa 20-30 phút (Nằm nghiêng trái kê gối ôm dưới bụng)',
      'Chợp mắt ngủ trưa 20-30 phút (Nằm nghiêng trái kê gối ôm dưới bụng)',
      'Chợp mắt ngủ trưa 20-30 phút (Nằm nghiêng trái kê gối ôm dưới bụng)',
      'Chợp mắt ngủ trưa 20-30 phút',
      'Chợp mắt ngủ trưa 20-30 phút',
    ],
  ],
  [
    '13:00',
    '15:30',
    [
      'Hoạt động chiều nhẹ nhàng + Đếm thai máy lần 2 (Sau ăn trưa)',
      'Hoạt động chiều nhẹ nhàng + Đếm thai máy lần 2',
      'Hoạt động chiều nhẹ nhàng + Đếm thai máy lần 2',
      'Hoạt động chiều nhẹ nhàng + Đếm thai máy lần 2',
      'Hoạt động chiều nhẹ nhàng + Đếm thai máy lần 2',
      'Nghỉ ngơi, xem tài liệu chăm sóc sơ sinh & nuôi con bằng sữa mẹ',
      'Kiểm tra lại danh mục đồ đi sinh & giấy tờ y tế chuẩn bị sẵn',
    ],
  ],
  [
    '15:30',
    '16:30',
    [
      'Ăn phụ chiều (1 ly sữa bầu / hũ sữa chua / hạt ngũ cốc) + Uống Canxi',
      'Ăn phụ chiều (Trái cây tươi + hũ sữa chua) + Uống Canxi',
      'Ăn phụ chiều (1 ly sữa bầu / hũ sữa chua / hạt ngũ cốc) + Uống Canxi',
      'Ăn phụ chiều (Trái cây tươi + hũ sữa chua) + Uống Canxi',
      'Ăn phụ chiều (1 ly sữa bầu / hũ sữa chua / hạt ngũ cốc) + Uống Canxi',
      'Uống trà hoa cúc ấm / Ngăn ngừa căng thẳng',
      'Ăn phụ chiều nhẹ nhàng + Uống nước đầy đủ',
    ],
  ],
  [
    '16:30',
    '18:00',
    [
      'Đi bộ nhẹ nhàng 20 phút / Tập hít thở chuẩn bị sinh nở',
      'Đi bộ nhẹ nhàng 20 phút / Tập hít thở chuẩn bị sinh nở',
      'Đi bộ nhẹ nhàng 20 phút / Tập hít thở chuẩn bị sinh nở',
      'Đi bộ nhẹ nhàng 20 phút / Tập hít thở chuẩn bị sinh nở',
      'Đi bộ nhẹ nhàng 20 phút / Tập hít thở chuẩn bị sinh nở',
      'Tắm nước ấm (Nhiệt độ 37°C), lau khô người nhẹ nhàng',
      'Tắm nước ấm (Nhiệt độ 37°C), lau khô người nhẹ nhàng',
    ],
  ],
  [
    '18:00',
    '19:30',
    [
      'Ăn tối thanh nhẹ (Kết thúc trước khi đi ngủ 3 tiếng để tránh trào ngược)',
      'Ăn tối thanh nhẹ cùng gia đình',
      'Ăn tối thanh nhẹ (Kết thúc trước khi đi ngủ 3 tiếng)',
      'Ăn tối thanh nhẹ cùng gia đình',
      'Ăn tối thanh nhẹ (Kết thúc trước khi đi ngủ 3 tiếng)',
      'Ăn tối ấm cúng cùng gia đình',
      'Ăn tối ấm cúng cùng gia đình',
    ],
  ],
  [
    '19:30',
    '21:00',
    [
      'Ghi nhận Check-in tâm trạng, đo huyết áp / theo dõi dấu hiệu bất thường',
      'Check-in sức khỏe + Trò chuyện cùng chồng/người thân',
      'Ghi nhận Check-in tâm trạng, đo huyết áp / theo dõi dấu hiệu bất thường',
      'Check-in sức khỏe + Trò chuyện cùng chồng/người thân',
      'Ghi nhận Check-in tâm trạng, đo huyết áp / theo dõi dấu hiệu bất thường',
      'Xem lại Lịch Sinh Hoạt tuần tới trên ứng dụng ChronoFlow',
      'Rà soát Mục Tiêu Tuần & Tổng Kết Đánh Giá cùng Quản gia AI',
    ],
  ],
  [
    '21:00',
    '22:00',
    [
      'Uống 1 ly nước ấm / Sữa ấm, vệ sinh răng miệng & chuẩn bị đi ngủ',
      'Ngâm chân nước ấm 15 phút giúp lưu thông máu & ngủ sâu giấc',
      'Uống 1 ly nước ấm / Sữa ấm, vệ sinh răng miệng & chuẩn bị đi ngủ',
      'Ngâm chân nước ấm 15 phút giúp lưu thông máu & ngủ sâu giấc',
      'Uống 1 ly nước ấm / Sữa ấm, vệ sinh răng miệng & chuẩn bị đi ngủ',
      'Ngâm chân nước ấm 15 phút, thư giãn tinh thần',
      'Ngâm chân nước ấm 15 phút, thư giãn tinh thần',
    ],
  ],
  [
    '22:00',
    '00:15',
    [
      'Tắt thiết bị điện tử, đi ngủ đúng giờ (Đảm bảo ngủ 7-8 tiếng/ngày)',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
      'Tắt thiết bị điện tử, đi ngủ đúng giờ',
    ],
  ],
];

const dailyFocus = {
  monday: 'Khởi động tuần thai kỳ an toàn, uống vi chất đúng giờ & theo dõi thai máy.',
  tuesday: 'Duy trì nhịp sống lành mạnh, ăn trưa đúng giờ & nghỉ ngơi đầy đủ.',
  wednesday: 'Rà soát sức khỏe giữa tuần, đếm thai máy & giữ tinh thần thoải mái.',
  thursday: 'Uống đủ 2L nước ấm, tập hít thở thai giáo & tránh làm việc quá sức.',
  friday: 'Kiểm tra hồ sơ khám thai, chuẩn bị đồ đi sinh & đóng tuần an lành.',
  saturday: 'Thư giãn cùng gia đình, đi dạo nhẹ nhàng & tưới cây xanh.',
  sunday: 'Nghỉ ngơi có chủ đích, ngâm chân nước ấm & rà soát lịch tuần mới.',
};

const buildCells = (texts) =>
  Object.fromEntries(
    DAY_KEYS.map((day, index) => [
      day.key,
      {
        text: texts[index] || 'Sinh hoạt lành mạnh',
        done: false,
        notes: '',
        adminLocked: false, // Locked by admin if mandatory medical step
        category: index % 2 === 0 ? 'health' : 'rest',
      },
    ])
  );

export function createDefaultPlan() {
  return {
    meta: {
      title: 'LỊCH SINH HOẠT & NHẮC VIỆC PHỤ NỮ MANG THAI VÀ SAU SINH',
      wakeTime: '06:00',
      sleepTime: '00:15',
      note: 'Hệ thống hỗ trợ tổ chức lịch và nhắc việc, không chẩn đoán, không thay thế bác sĩ hoặc cơ sở y tế. Nội dung có tính lâm sàng phải được đơn vị triển khai và người có chuyên môn phê duyệt.',
      updatedAt: new Date().toISOString(),
    },
    profile: {
      mode: 'pregnant', // 'pregnant' | 'postpartum'
      fullName: 'Nguyễn Thị Thu Hà',
      pregnancyWeek: 24,
      dueDate: '2026-11-15',
      postpartumDays: 14,
      birthDate: '2026-07-15',
      deliveryMethod: 'Sinh thường',
      feedingPlan: 'Sữa mẹ hoàn toàn',
      trackingLevel: 'Theo dõi chuẩn y tế',
      assignedDoctor: 'BS. CKII Nguyễn Thị Mai - BV Phụ Sản Central',
      emergencyContact: '0988 123 456 (Chồng - Anh Minh)',
    },
    settings: {
      fontFamily: 'Times New Roman',
      fontSize: 13,
      weekendHighlight: true,
      compact: false,
      safetyNoticeDismissed: false,
    },
    dailyFocus,
    weeklyGoals: [
      {
        id: 'goal-1',
        title: 'Bổ sung đầy đủ Folic Acid, Sắt & Canxi theo đơn Bác sĩ',
        result: 'Uống đúng liều 7/7 ngày',
        priority: 'Cao',
        dueDay: 'Chủ Nhật',
        done: false,
        notes: 'Uống Canxi cách Sắt ít nhất 2 tiếng',
      },
      {
        id: 'goal-2',
        title: 'Theo dõi đếm thai máy (Kick count) 2 lần/ngày',
        result: 'Ghi nhận đủ 4+ lần cử động/tiếng',
        priority: 'Cao',
        dueDay: 'Chủ Nhật',
        done: false,
        notes: 'Thực hiện sau bữa ăn sáng và tối',
      },
      {
        id: 'goal-3',
        title: 'Vận động thai kỳ nhẹ nhàng 15-20 phút/ngày',
        result: 'Tối thiểu 5 buổi/tuần',
        priority: 'Trung bình',
        dueDay: 'Thứ Sáu',
        done: false,
        notes: 'Đi bộ nhẹ hoặc bài tập Yoga thai kỳ',
      },
    ],
    schedule: maternalSlots.map(([start, end, texts], index) => ({
      id: `slot-${index + 1}`,
      start,
      end,
      cells: buildCells(texts),
    })),
    checkIns: [],
    summary: {
      wins: 'Thực hiện đúng liều vi chất và đếm thai máy đều đặn trong tuần qua.',
      incomplete: 'Cần uống thêm 500ml nước ấm vào khung giờ chiều.',
      lessons: 'Nằm nghiêng trái với gối ôm giúp giấc ngủ ngon hơn rõ rệt.',
      nextWeek: 'Chuẩn bị hồ sơ cho đợt siêu âm hình thái 26 tuần.',
      score: 9,
      mood: 'Vui vẻ & Tích cực',
    },
  };
}
