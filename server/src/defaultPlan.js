export const DAY_KEYS = [
  { key: 'monday', label: 'Thứ Hai' },
  { key: 'tuesday', label: 'Thứ Ba' },
  { key: 'wednesday', label: 'Thứ Tư' },
  { key: 'thursday', label: 'Thứ Năm' },
  { key: 'friday', label: 'Thứ Sáu' },
  { key: 'saturday', label: 'Thứ Bảy' },
  { key: 'sunday', label: 'Chủ Nhật' },
];

const slots = [
  ['06:00', '06:15', ['Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân', 'Thức dậy, uống nước, vệ sinh cá nhân']],
  ['06:15', '06:45', ['Đi bộ nhanh / cardio nhẹ', 'Giãn cơ + bụng', 'Tập sức mạnh', 'Đi bộ ngoài trời', 'Toàn thân nhẹ', 'Thể thao ngoài trời', 'Yoga / giãn cơ']],
  ['06:45', '07:30', ['Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới', 'Tắm, ăn sáng, chuẩn bị ngày mới']],
  ['07:30', '08:00', ['Lập 3 ưu tiên trong ngày', 'Ôn mục tiêu + chuẩn bị', 'Lập 3 ưu tiên trong ngày', 'Ôn mục tiêu + chuẩn bị', 'Tổng kết việc cần hoàn thành', 'Lên kế hoạch cuối tuần', 'Lên kế hoạch tuần mới']],
  ['08:00', '11:30', ['Làm việc / học tập tập trung', 'Làm việc / học tập tập trung', 'Làm việc / học tập tập trung', 'Làm việc / học tập tập trung', 'Hoàn thành việc quan trọng', 'Dọn dẹp + việc cá nhân', 'Nghỉ ngơi / thời gian gia đình']],
  ['11:30', '12:30', ['Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại', 'Ăn trưa, thư giãn, hạn chế điện thoại']],
  ['12:30', '13:00', ['Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng', 'Ngủ trưa 20 phút + thức dậy nhẹ nhàng']],
  ['13:00', '17:00', ['Làm việc / học tập', 'Làm việc / học tập', 'Làm việc / học tập', 'Làm việc / học tập', 'Kết thúc việc tuần + tổng kết', 'Mua sắm / việc riêng / đi chơi', 'Đọc sách + chuẩn bị cho tuần mới']],
  ['17:00', '18:00', ['Đi bộ + giãn cơ', 'Tập luyện', 'Đi bộ thư giãn', 'Tập luyện', 'Đi bộ nhẹ', 'Hoạt động ngoài trời', 'Đi bộ nhẹ']],
  ['18:00', '19:00', ['Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp', 'Tắm, ăn tối, dọn dẹp']],
  ['19:00', '21:00', ['Ôn lại công việc / học thêm', 'Học kỹ năng mới', 'Gặp gỡ / trò chuyện', 'Dự án cá nhân', 'Giải trí có giới hạn', 'Sở thích / bạn bè / gia đình', 'Chuẩn bị quần áo, lịch và mục tiêu tuần']],
  ['21:00', '22:00', ['Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình', 'Thư giãn, trò chuyện với gia đình']],
  ['22:00', '23:00', ['Việc cá nhân + chuẩn bị ngày mai', 'Việc cá nhân + chuẩn bị ngày mai', 'Việc cá nhân + chuẩn bị ngày mai', 'Việc cá nhân + chuẩn bị ngày mai', 'Sắp xếp phòng + chuẩn bị cuối tuần', 'Thư giãn nhẹ', 'Sắp xếp bàn học / bàn làm việc']],
  ['23:00', '23:45', ['Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình', 'Đọc sách, nghe nhạc nhẹ, hạn chế màn hình']],
  ['23:45', '00:15', ['Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ', 'Vệ sinh cá nhân, thư giãn và đi ngủ']],
];

const dailyFocus = {
  monday: 'Khởi động tuần, xác định ưu tiên và bắt đầu việc khó nhất.',
  tuesday: 'Duy trì nhịp làm việc, học thêm một kỹ năng thực tế.',
  wednesday: 'Rà soát giữa tuần, điều chỉnh tiến độ và phục hồi năng lượng.',
  thursday: 'Tập trung dự án cá nhân hoặc nhiệm vụ cần chiều sâu.',
  friday: 'Hoàn thành việc tồn, tổng kết kết quả và đóng tuần làm việc.',
  saturday: 'Chăm sóc không gian sống, sức khỏe và các mối quan hệ.',
  sunday: 'Nghỉ ngơi có chủ đích và chuẩn bị kỹ cho tuần tiếp theo.',
};

const buildCells = (texts) => Object.fromEntries(
  DAY_KEYS.map((day, index) => [day.key, { text: texts[index], done: false, notes: '' }]),
);

export function createDefaultPlan() {
  return {
    meta: {
      title: 'KẾ HOẠCH SINH HOẠT 1 TUẦN',
      wakeTime: '06:00',
      sleepTime: '00:15',
      note: 'Ngủ từ 00:15 đến 06:00 chỉ được 5 giờ 45 phút. Hãy ưu tiên ngủ trưa và cân nhắc ngủ sớm hơn để cơ thể phục hồi tốt hơn.',
      updatedAt: new Date().toISOString(),
    },
    settings: {
      fontFamily: 'Times New Roman',
      fontSize: 13,
      weekendHighlight: true,
      compact: false,
    },
    dailyFocus,
    weeklyGoals: [
      { id: 'goal-1', title: 'Hoàn thành 3 nhiệm vụ quan trọng nhất', result: 'Ít nhất 3 đầu việc có kết quả cụ thể', priority: 'Cao', dueDay: 'Thứ Sáu', done: false, notes: '' },
      { id: 'goal-2', title: 'Vận động tối thiểu 5 buổi', result: 'Mỗi buổi từ 25–45 phút', priority: 'Cao', dueDay: 'Chủ Nhật', done: false, notes: '' },
      { id: 'goal-3', title: 'Học thêm kỹ năng chuyên môn', result: 'Có ghi chú và một sản phẩm nhỏ', priority: 'Trung bình', dueDay: 'Chủ Nhật', done: false, notes: '' },
    ],
    schedule: slots.map(([start, end, texts], index) => ({
      id: `slot-${index + 1}`,
      start,
      end,
      cells: buildCells(texts),
    })),
    summary: {
      wins: '',
      incomplete: '',
      lessons: '',
      nextWeek: '',
      score: 0,
      mood: 'Bình thường',
    },
  };
}
