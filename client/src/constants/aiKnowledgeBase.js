/**
 * CHRONOFLOW ENTERPRISE - AI KNOWLEDGE BASE & TRAINING DATASET
 * Chứa toàn bộ bộ câu hỏi & trả lời được huấn luyện sẵn chuyên sâu về:
 * 1. 🌱 Chăm Sóc Cây Cảnh & Trồng Cây (Plant Care, Watering, Fertilizing, Pest Control)
 * 2. 🏠 Cuộc Sống Hằng Ngày & Sức Khỏe (Daily Life, Health, Sleep, Stress, Nutrition)
 * 3. 🗓️ Lịch Sinh Hoạt Hằng Ngày & Quản Lý Thời Gian (Timetable, Work-Life Balance, Meal/Study/Work Shifts)
 */

export const AI_KNOWLEDGE_BASE = [
  // ==========================================
  // CATEGORY 1: PLANT CARE & CÂY TRỒNG (PLANT)
  // ==========================================
  {
    id: 'plant-watering-schedule',
    category: 'plant',
    topic: 'Tưới cây & Độ ẩm đất',
    keywords: ['tưới cây', 'bao lâu tưới', 'nước cho cây', 'khi nào tưới', 'tưới nước', 'đất khô', 'đất úng'],
    question: 'Bao lâu nên tưới cây một lần và tưới vào thời điểm nào tốt nhất?',
    answer: '🌱 **Thời điểm tưới cây tốt nhất:** Sáng sớm (06:00 - 08:00) hoặc chiều mát (16:30 - 18:00). Tránh tưới buổi trưa nắng gắt làm sốc nhiệt rễ cây.\n💧 **Tần suất tưới:**\n• Cây trong nhà (Kim Tiền, Lưỡi Hổ): Tưới 1-2 lần/tuần khi đất mặt khô khoảng 2-3cm.\n• Cây ngoài trời/Nắng nhiều (Hoa hồng, Dâu tây): Tưới 1 lần/ngày.\n• Sen đá/Xương rồng: Tưới 7-10 ngày/lần.',
    tips: 'Mẹo kiểm tra: Chọc ngón tay sâu 2cm vào đất, nếu thấy đất còn ẩm dính tay thì chưa cần tưới!',
  },
  {
    id: 'plant-yellow-leaves',
    category: 'plant',
    topic: 'Bệnh Vàng Lá & Úng Rễ',
    keywords: ['vàng lá', 'lá bị vàng', 'úng rễ', 'héo lá', 'thối rễ', 'rụng lá', 'cây úa'],
    question: 'Cây bị vàng lá, mềm nhũn hoặc héo rủ thì phải xử lý làm sao?',
    answer: '⚠️ **Nguyên nhân phổ biến:**\n1. **Úng rễ do tưới quá nhiều:** Lá vàng mềm, thân mọng nước, đất luôn ướt nhẹp. ➔ *Xử lý:* Tạm ngưng tưới 5-7 ngày, chuyển cây ra nơi thoáng gió, kiểm tra lỗ thoát nước của chậu.\n2. **Thiếu nước:** Lá vàng khô giòn, cuộn lại. ➔ *Xử lý:* Tưới đẫm nước ngấm từ từ.\n3. **Thiếu ánh sáng:** Thân vươn dài nghêu ngao, lá nhạt màu. ➔ *Xử lý:* Đưa cây ra nơi có nắng nhẹ/ánh sáng tán xạ.',
    tips: 'Nếu rễ bị thối đen: Cần nhổ cây, cắt bỏ rễ thối, bôi vôi/cồn sát trùng rồi thay đất mới xốp nhẹ!',
  },
  {
    id: 'plant-indoor-air-clean',
    category: 'plant',
    topic: 'Cây Lọc Không Khí Trong Nhà & Phòng Ngủ',
    keywords: ['cây trong nhà', 'lọc không khí', 'phòng ngủ', 'cây nhả oxy', 'cây phong thủy', 'lưỡi hổ', 'kim tiền', 'trầu bà'],
    question: 'Nên trồng cây gì trong nhà và phòng ngủ để lọc không khí và nhả Oxy ban đêm?',
    answer: '🌿 **Top 5 Cây Lọc Không Khí & Nhả Oxy Ban Đêm (Cơ chế CAM):**\n1. **Cây Lưỡi Hổ (Sansevieria):** Nhả Oxy ban đêm, lọc khí độc Formaldehyde & Benzene cực tốt cho phòng ngủ.\n2. **Cây Lan Ý (Peace Lily):** Lọc bào tử nấm mốc và ẩm mốc trong không khí.\n3. **Cây Trầu Bà (Pothos):** Rất dễ sống, lọc bức xạ điện từ từ máy tính/điện thoại.\n4. **Cây Kim Tiền (Zamioculcas):** Thu hút tài lộc, hút khí bụi mịn indoor.\n5. **Cây Môn Quan Âm / Xương Rồng:** Nhả Oxy dịu nhẹ giấc ngủ.',
    tips: 'Tránh để quá nhiều cây xanh lá to đậm trong phòng ngủ kín đêm vì cây hô hấp hút Oxy nếu không phải dòng CAM!',
  },
  {
    id: 'plant-fertilizer-care',
    category: 'plant',
    topic: 'Bón Phân & Dinh Dưỡng Cây',
    keywords: ['bón phân', 'phân bón', 'dinh dưỡng cây', 'phân hữu cơ', 'npk', 'khi nào bón phân', 'đổi chậu'],
    question: 'Bao lâu thì nên bón phân cho cây và loại phân bón nào an toàn?',
    answer: '🧪 **Lịch Bón Phân Chuẩn:**\n• **Tần suất:** Bón 3-4 tuần/lần trong mùa sinh trưởng (mùa xuân & mùa mưa). Ngừng hoặc giảm bón vào mùa đông lạnh.\n• **Phân Hữu Cơ (Phân trùn trùng, phân dê, phân mục):** An toàn nhất, giúp cải tạo đất tơi xốp.\n• **Phân NPK tan chậm:** Rắc 10-15 viên quanh mép chậu, phân giải từ từ suốt 3 tháng.\n• **Nước vo gạo ủ chua nhẹ:** Tưới 1 tuần/lần bổ sung Vitamin B1 kích rễ rất tốt.',
    tips: 'Lưu ý: Không bón phân trực tiếp sát gốc cây hoặc khi đất đang khô hạn kẻo bị cháy rễ!',
  },
  {
    id: 'plant-pest-control',
    category: 'plant',
    topic: 'Diệt Sâu Bệnh & Rệp Sáp Hữu Cơ',
    keywords: ['rệp sáp', 'sâu bệnh', 'bọ trĩ', 'sâu ăn lá', 'nấm bệnh', 'trị rệp', 'dầu neem'],
    question: 'Làm thế nào để trị rệp sáp, bọ trĩ và sâu bệnh trên cây bằng phương pháp hữu cơ an toàn?',
    answer: '🛡️ **Công Thức Trị Rệp & Bọ Hữu Cơ Tại Nhà:**\n1. **Dung dịch Nước Rửa Chén & Dầu Ăn:** 1 lít nước + 5ml nước rửa chén + 5ml dầu ăn. Lắc đều phun xịt trực tiếp lên ổ rệp sáp vào chiều mát. Sau 2 tiếng xịt rửa lại bằng nước sạch.\n2. **Dầu Neem Oil hữu cơ:** Phun định kỳ 2 tuần/lần phòng ngừa nấm và sâu bệnh.\n3. **Cồn 70 độ:** Dùng bông tăm thấm cồn lau sạch rệp sáp trắng bám trên nách lá.',
    tips: 'Chủ động lau bụi bẩn bám trên lá 1-2 lần/tuần giúp lá quang hợp tốt hơn và xua đuổi côn trùng!',
  },
  {
    id: 'plant-light-sunlight',
    category: 'plant',
    topic: 'Nắng & Ánh Sáng Cho Cây Trồng',
    keywords: ['ánh sáng', 'nắng', 'cây thiếu nắng', 'chịu bóng', 'nắng trực tiếp', 'đèn quang hợp'],
    question: 'Cây trồng trong nhà cần bao nhiêu giờ ánh sáng và làm sao biết cây thiếu nắng?',
    answer: '☀️ **Yêu Cầu Ánh Sáng:**\n• **Cây trong nhà (Lưỡi hổ, trầu bà, kim tiền):** Cần ánh sáng tán xạ 4-6 tiếng/ngày gần cửa sổ.\n• **Cây cảnh ngoài trời:** Cần nắng trực tiếp 6-8 tiếng/ngày.\n⚠️ **Dấu hiệu cây thiếu nắng:** Thân vươn dài ngầy ngậy, khoảng cách giữa các lá xa nhau, lá nhạt màu rũ xuống.\n➔ *Khắc phục:* Cho cây ra phơi nắng nhẹ buổi sáng (07:00 - 09:30) 2-3 lần/tuần.',
    tips: 'Xoay chậu cây 90 độ mỗi tuần để cây phát triển tròn đều các hướng, không bị vẹo lệch về hướng sáng!',
  },

  // ===================================================
  // CATEGORY 2: DAILY LIFE & CUỘC SỐNG HẰNG NGÀY (LIFE)
  // ===================================================
  {
    id: 'life-sleep-routine',
    category: 'daily_life',
    topic: 'Giấc Ngủ & Chu Kỳ Sinh Học',
    keywords: ['ngủ', 'giấc ngủ', 'mất ngủ', 'ngủ mấy tiếng', 'thức khuya', 'dậy sớm', 'ngủ ngon'],
    question: 'Một ngày nên ngủ mấy tiếng và làm sao để cải thiện chất lượng giấc ngủ?',
    answer: '🌙 **Thời gian ngủ tiêu chuẩn:** 7 - 8 tiếng mỗi đêm đối với người trưởng thành.\n⏰ **Khung giờ vàng cho cơ thể phục hồi:**\n• **21:00 - 23:00:** Cơ thể thải độc hệ miễn dịch ➔ Thư giãn, tránh căng thẳng.\n• **23:00 - 01:00:** Gan thải độc ➔ Cần chìm vào giấc ngủ sâu.\n• **01:00 - 03:00:** Mật thải độc ➔ Ngủ sâu.\n💡 **Mẹo ngủ ngon:** Tắt màn hình điện thoại/TV trước 30 phút, ngâm chân nước ấm, giữ phòng ngủ tối & mát mẻ.',
    tips: 'Áp dụng quy tắc chu kỳ giấc ngủ 90 phút (ngủ 5 chu kỳ = 7.5 tiếng) giúp thức dậy tỉnh táo không bị ngáp vặt!',
  },
  {
    id: 'life-water-drinking',
    category: 'daily_life',
    topic: 'Uống Nước & Dinh Dưỡng Dưỡng Sinh',
    keywords: ['uống nước', 'bao nhiêu nước', 'khung giờ uống nước', 'nước lọc', 'mệt mỏi', 'khát'],
    question: 'Mỗi ngày nên uống bao nhiêu nước và những khung giờ vàng nào nên uống nước?',
    answer: '💧 **Lượng nước tiêu chuẩn:** 1.5L - 2.5L/ngày (Tính theo công thức: Cân nặng kg x 0.04 = Lít nước cần uống).\n🕒 **5 Khung Giờ Vàng Uống Nước:**\n1. **06:30 (Ngay sau khi ngủ dậy):** 1 ly nước ấm thải độc ruột.\n2. **09:00:** 1 ly nước khởi động não bộ tập trung làm việc.\n3. **11:30 (Trước ăn trưa 30p):** Hỗ trợ tiêu hóa.\n4. **15:00:** 1 ly nước tỉnh táo chống buồn ngủ chiều.\n5. **20:00 (Trước khi ngủ 1 tiếng):** Phòng ngừa đông máu đêm.',
    tips: 'Uống nước từng ngụm nhỏ, ngồi uống tốt hơn đứng uống để cơ thể hấp thụ tối đa!',
  },
  {
    id: 'life-pomodoro-productivity',
    category: 'daily_life',
    topic: 'Quản Lý Thời Gian & Năng Suất Pomodoro',
    keywords: ['quản lý thời gian', 'năng suất', 'tập trung', 'pomodoro', 'xao nhãng', 'trì hoãn', 'làm việc'],
    question: 'Làm sao để tập trung cao độ, vượt qua thói trì hoãn khi làm việc & học tập?',
    answer: '⚡ **Kỹ thuật Pomodoro (Quả Cà Chua) 25-5:**\n1. Chọn 1 nhiệm vụ duy nhất cần làm.\n2. Bật đồng hồ đếm ngược **25 phút** làm việc tập trung tuyệt đối (tắt thông báo FB/Tiktok).\n3. Nghỉ giải lao ngắn **5 phút** (đứng dậy vươn vai, uống nước).\n4. Lặp lại 4 chu kỳ thì nghỉ dài 15-30 phút.\n🎯 **Quy tắc 2 phút:** Việc nào làm dưới 2 phút (dọn bàn, trả lời email ngắn) ➔ Làm ngay lập tức!',
    tips: 'Áp dụng Ma trận Eisenhower: Ưu tiên làm việc "Quan trọng & Khẩn cấp" trước tiên mỗi sáng!',
  },
  {
    id: 'life-stress-burnout',
    category: 'daily_life',
    topic: 'Giải Tỏa Căng Thẳng & Burnout',
    keywords: ['stress', 'căng thẳng', 'mệt mỏi', 'burnout', 'kiệt sức', 'áp lực', 'thư giãn'],
    question: 'Khi cảm thấy căng thẳng, quá tải công việc hoặc kiệt sức (burnout) nên làm gì?',
    answer: '🧘 **5 Bước Cấp Cứu Stress Tức Thì:**\n1. **Kỹ thuật hít thở 4-7-8:** Hít vào bằng mũi 4 giây ➔ Nín thở 7 giây ➔ Thở ra bằng miệng 8 giây (Lặp lại 4 lần nhịp tim sẽ hạ xuống tức thì).\n2. **Tạm rời màn hình 10 phút:** Đứng lên đi dạo, nhìn ra khoảng xanh cây cối.\n3. **Uống 1 cốc trà hoa cúc / nước ấm:** Giúp xoa dịu thần kinh.\n4. **Viết xả ra giấy (Brain Dump):** Viết tất cả nỗi lo ra giấy để giải phóng dung lượng não.\n5. **Nghe nhạc tần số 432Hz hoặc tiếng mưa:** Thư giãn sóng não Alpha.',
    tips: 'Đừng ngần ngại nói "Không" với những yêu cầu ngoài khả năng để bảo vệ năng lượng bản thân!',
  },
  {
    id: 'life-exercise-health',
    category: 'daily_life',
    topic: 'Thể Thao & Vận Động Mới Ngày',
    keywords: ['tập thể dục', 'thể thao', 'vận động', 'đi bộ', 'gym', 'yoga', 'chạy bộ', 'sức khỏe'],
    question: 'Nên dành thời gian tập thể dục khi nào và bài tập nào phù hợp cho người bận rộn?',
    answer: '🏃 **Thời gian & Tần suất vận động:**\n• Duy trì 30 phút/ngày hoặc 150 phút/tuần với cường độ vừa phải.\n• **Sáng (06:00 - 07:00):** Chạy bộ, Yoga nhẹ kích hoạt năng lượng đầu ngày.\n• **Chiều (17:00 - 18:30):** Gym, HIIT, Cầu lông khi sức bền cơ bắp đạt đỉnh.\n💡 **Bài tập 15 phút tại nhà cho người bận rộn:**\n• 3 phút Khởi động ➔ 4 phút Tabata/Jumping Jacks ➔ 4 phút Squat & Push-up ➔ 4 phút Plank & Giãn cơ.',
    tips: 'Mục tiêu 8.000 - 10.000 bước chân mỗi ngày giúp tăng thọ và cải thiện sức khỏe tim mạch rõ rệt!',
  },
  {
    id: 'life-housework-chores',
    category: 'daily_life',
    topic: 'Quản Lý Việc Nhà & Không Gian Sống',
    keywords: ['việc nhà', 'dọn dẹp', 'vệ sinh', 'gọn gàng', 'sắp xếp nhà cửa', 'phòng ở'],
    question: 'Làm sao để giữ nhà cửa luôn sạch sẽ, gọn gàng mà không mất quá nhiều thời gian?',
    answer: '🧹 **Phương Pháp Dọn Nhà 15 Phút Mỗi Ngày:**\n1. **Quy tắc "Mọi vật đều có ngôi nhà của nó":** Dùng xong trả đồ vật về đúng vị trí ban đầu.\n2. **Lịch chia việc trong tuần:**\n   • *Thứ 2:* Lau bụi bàn ghế, kệ TV.\n   • *Thứ 4:* Dọn dẹp tủ lạnh & gian bếp.\n   • *Thứ 6:* Giặt chăn ga gối nệm.\n   • *Cuối tuần:* Hút bụi toàn bộ sàn nhà & tưới cây xanh.\n3. **Bỏ bớt đồ không dùng (Minimalism):** Đồ nào 6 tháng không dùng ➔ Thanh lý hoặc cho đi.',
    tips: 'Vừa dọn dẹp vừa bật một bản nhạc vui tươi giúp thời gian trôi qua nhanh và đầy cảm hứng!',
  },

  // =========================================================================
  // CATEGORY 3: DAILY ROUTINE TIMETABLE & LỊCH SINH HOẠT HẰNG NGÀY (SCHEDULE)
  // =========================================================================
  {
    id: 'schedule-work-study-split',
    category: 'schedule',
    topic: 'Khung Giờ Học Tập & Làm Việc Chuẩn',
    keywords: ['lịch làm việc', 'lịch học', 'khung giờ làm việc', 'giờ học', 'ca làm', 'ca học', 'học tập', 'phân bổ giờ'],
    question: 'Làm thế nào để phân bổ khung giờ làm việc và học tập trong ngày đạt năng suất tối đa?',
    answer: '📅 **Khung Giờ Phân Bổ Năng Suất Cao Nhất (Biological Prime Time):**\n• **04:30 - 06:00 (Khung giờ Kim Cương):** Tiếp thu kiến thức mới, đọc sách, học ngôn ngữ (Sóng não Alpha tỉnh táo nhất).\n• **08:00 - 11:30 (Khung giờ Vàng Làm Việc):** Giải quyết các nhiệm vụ khó nhất, đòi hỏi tư duy sâu (Deep Work).\n• **14:00 - 16:30 (Khung giờ Chiều):** Xử lý email, họp nhóm, công việc hành chính.\n• **19:30 - 21:00 (Khung giờ Tối):** Ôn tập bài vở, học kỹ năng bổ trợ.',
    tips: 'Đừng xếp 2 ca học/làm việc căng thẳng liên tiếp nhau mà hãy chèn 15 phút giải lao uống nước!',
  },
  {
    id: 'schedule-family-meals',
    category: 'schedule',
    topic: 'Lịch Ăn Uống & Bữa Cơm Gia Đình',
    keywords: ['lịch ăn', 'giờ ăn', 'ăn sáng', 'ăn trưa', 'ăn tối', 'bữa cơm gia đình', 'dinh dưỡng đúng giờ'],
    question: 'Khung giờ ăn sáng, ăn trưa, ăn tối thế nào là chuẩn y tế và tốt cho dạ dày?',
    answer: '🥣 **Lịch Ăn Uống Chuẩn Y Tế Sinh Học:**\n• **Ăn Sáng (06:30 - 07:30):** Trong vòng 1 tiếng sau khi ngủ dậy. Nạp Protein & Carb chậm (Trứng, yến mạch, phở).\n• **Ăn Trưa (11:30 - 12:30):** Nạp lại năng lượng giữa ngày. Ăn vừa đủ no.\n• **Ăn Tối (18:00 - 19:00):** Ăn nhẹ nhàng, ít tinh bột. *Quan trọng:* Kết thúc bữa tối trước khi ngủ ít nhất 3 tiếng để tránh trào ngược dạ dày & béo phì.',
    tips: 'Nhắc nhở: Không bỏ ăn sáng kẻo làm tụt đường huyết và ảnh hưởng đến khả năng tập trung làm việc buổi sáng!',
  },
  {
    id: 'schedule-workout-rest',
    category: 'schedule',
    topic: 'Lịch Thể Thao & Giờ Nghỉ Ngơi Phục Hồi',
    keywords: ['lịch thể thao', 'giờ tập', 'giờ nghỉ', 'nghỉ trưa', 'giờ ngủ', 'tập sáng', 'tập chiều'],
    question: 'Nên chèn lịch tập thể dục và nghỉ ngơi vào khung giờ nào trong thời khóa biểu?',
    answer: '⏰ **Khung Giờ Vận Động & Phục Hồi Lý Tưởng:**\n• **Tập Thể Dục Sáng (06:00 - 06:30):** 30 phút chạy bộ hoặc yoga đánh thức cơ thể.\n• **Tập Thể Thao Chiều (17:30 - 18:30):** Thể thao cường độ cao (Gym, đá bóng, cầu lông) khi thân nhiệt cơ thể đỉnh cao.\n• **Nghỉ Trưa (12:30 - 13:00):** Chớp mắt 20-30 phút (Nap) giúp hồi phục 80% năng lượng tỉnh táo buổi chiều.\n• **Đi Ngủ (22:00 - 22:30):** Chuẩn bị đi ngủ, buông bỏ thiết bị điện tử.',
    tips: 'Nghỉ trưa không nên ngủ quá 45 phút kẻo bị đi vào giấc ngủ sâu làm cho người uể uể khi thức dậy!',
  },
  {
    id: 'schedule-weekend-balance',
    category: 'schedule',
    topic: 'Lập Kế Hoạch Cuối Tuần & Tái Tạo Năng Lượng',
    keywords: ['cuối tuần', 'thứ 7', 'chủ nhật', 'lịch cuối tuần', 'nghỉ ngơi cuối tuần', 'dọn dẹp cuối tuần'],
    question: 'Sắp xếp lịch sinh hoạt cuối tuần (Thứ 7 & Chủ Nhật) như thế nào để vừa nghỉ ngơi vừa chuẩn bị cho tuần mới?',
    answer: '🎉 **Lịch Sinh Hoạt Cuối Tuần Cân Bằng:**\n• **Thứ 7:**\n  - Sáng (08:00 - 10:30): Dọn dẹp vệ sinh nhà cửa, giặt chăn ga & chăm sóc chậu cây cảnh.\n  - Chiều & Tối: Gặp gỡ bạn bè, đi chơi gia đình, xem phim giải trí.\n• **Chủ Nhật:**\n  - Sáng (09:00 - 11:00): Đi siêu thị mua sắm thực phẩm tươi cho 3-5 ngày.\n  - Chiều (15:00 - 17:00): Dành thời gian riêng cho bản thân (đọc sách, vẽ tranh, thư giãn).\n  - Tối (20:00 - 21:00): Mở **ChronoFlow** rà soát tiến độ tuần qua & lập Lịch Sinh Hoạt tuần mới!',
    tips: 'Dành 15 phút tối Chủ Nhật để lên Lịch Sinh Hoạt Tuần Mới giúp bạn làm chủ tuần làm việc hoàn toàn chủ động!',
  },
  {
    id: 'schedule-chronoflow-tags',
    category: 'schedule',
    topic: 'Phân Loại Nhãn & Đánh Giá Giờ Trên ChronoFlow',
    keywords: ['nhãn phân loại', 'category', 'học tập', 'công việc', 'sức khỏe', 'nghỉ ngơi', 'đánh nhãn lịch', 'thống kê giờ'],
    question: 'Làm sao để đánh nhãn phân loại khung giờ trên ChronoFlow để Quản gia AI thống kê chính xác?',
    answer: '🏷️ **4 Nhãn Phân Loại Sinh Hoạt Chuẩn Trên ChronoFlow:**\n1. **Học Tập (Study - Màu Tím):** Ca học trên lớp, đọc sách, làm bài tập, học online.\n2. **Công Việc (Work - Màu Xanh Dương):** Ca làm việc văn phòng, chạy dự án, gặp khách hàng.\n3. **Sức Khỏe (Health - Màu Xanh Lá):** Ăn uống, tập thể dục, chạy bộ, chăm sóc cây cảnh.\n4. **Nghỉ Ngơi (Rest - Màu Vàng Cam):** Ngủ trưa, xem phim, nghỉ ngơi thư giãn.\n👉 *Cách gán:* Bấm vào từng ô khung giờ trên bảng lịch ➔ Chọn màu nhãn phân loại tương ứng ➔ Quản gia AI sẽ tự động tính toán tổng số giờ chính xác 100%!',
    tips: 'Gán đúng nhãn màu giúp Quản gia AI phát hiện ngay nếu bạn làm việc quá tải hoặc thiếu giờ sức khỏe!',
  },
];

// List of popular quick-click question pills categorized for the UI
export const PLANT_QUICK_QUESTIONS = [
  '🌱 Tưới cây bao lâu 1 lần & giờ nào tốt?',
  '⚠️ Cây bị vàng lá, úng rễ phải làm sao?',
  '🌿 Top cây lọc không khí cho phòng ngủ?',
  '🧪 Khi nào cần bón phân cho cây?',
  '🛡️ Mẹo trị rệp sáp hữu cơ tại nhà?',
  '☀️ Làm sao biết cây bị thiếu ánh sáng?',
];

export const LIFE_QUICK_QUESTIONS = [
  '🌙 Ngủ mấy tiếng 1 ngày & giờ ngủ chuẩn?',
  '💧 Uống bao nhiêu nước & 5 khung giờ vàng?',
  '⚡ Kỹ thuật Pomodoro tập trung làm việc?',
  '🧘 Cách hít thở 4-7-8 giải tỏa stress tức thì?',
  '🏃 Gợi ý bài tập 15 phút cho người bận rộn?',
  '🧹 Mẹo dọn nhà gọn gàng 15 phút mỗi ngày?',
];

export const SCHEDULE_QUICK_QUESTIONS = [
  '📅 Khung giờ vàng làm việc & học tập trong ngày?',
  '🥣 Khung giờ ăn sáng, trưa, tối chuẩn y tế?',
  '⏰ Lịch thể thao & chợp mắt nghỉ trưa hợp lý?',
  '🎉 Sắp xếp lịch sinh hoạt thứ 7 & Chủ nhật?',
  '🏷️ Cách gán nhãn phân loại giờ trên ChronoFlow?',
];

/**
 * Intelligent Keyword & Semantic Matcher for AI Knowledge Base
 */
export function findAiKnowledgeAnswer(queryText) {
  if (!queryText || typeof queryText !== 'string') return null;

  const q = queryText.toLowerCase().trim();

  let bestMatch = null;
  let highestScore = 0;

  for (const item of AI_KNOWLEDGE_BASE) {
    let score = 0;

    // Check keyword hits
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    // Check topic & question hits
    if (q.includes(item.topic.toLowerCase())) score += 5;

    // Check partial string matching
    const words = q.split(/\s+/);
    for (const w of words) {
      if (w.length > 2) {
        if (item.topic.toLowerCase().includes(w)) score += 1;
        if (item.question.toLowerCase().includes(w)) score += 1;
        if (item.answer.toLowerCase().includes(w)) score += 0.5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Return best match if score passes threshold
  if (highestScore >= 2 && bestMatch) {
    return {
      topic: bestMatch.topic,
      category: bestMatch.category,
      question: bestMatch.question,
      answer: bestMatch.answer,
      tips: bestMatch.tips,
      score: highestScore,
    };
  }

  return null;
}
