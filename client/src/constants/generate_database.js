const fs = require('fs');
const path = require('path');

const COURSE_LEVELS = [
  {
    "id": "L1",
    "name": "Cấp độ L1: Khởi Động (4–5 tuổi)",
    "badge": "Khởi Động • 150 Từ (15 Chủ Đề)",
    "color": "from-amber-500 to-orange-500 border-amber-400 text-amber-300",
    "bgBadge": "bg-amber-500/20 text-amber-300 border-amber-500/40",
    "description": "Từ đơn, nhận biết hình ảnh, phản xạ nghe–chọn. Màu sắc, số đếm 1-10, hình dạng, gia đình, cơ thể, động vật, đồ ăn, lớp học, động từ, cảm xúc, đồ chơi, côn trùng, phòng tắm, nông trại & trái nghĩa.",
    "icon": "🐥",
    "targetWords": 150
  },
  {
    "id": "L2",
    "name": "Cấp độ L2: Cơ Bản (5–7 tuổi)",
    "badge": "Cơ Bản • 150 Từ (15 Chủ Đề)",
    "color": "from-blue-500 to-cyan-500 border-blue-400 text-blue-300",
    "bgBadge": "bg-blue-500/20 text-blue-300 border-blue-500/40",
    "description": "Câu ngắn, sinh hoạt, trường học, mô tả vị trí. Ngôi nhà, quần áo, sinh hoạt hằng ngày, thời tiết, giao thông, địa điểm, nghề nghiệp, trái cây/rau củ, thời gian, thể thao, môn học, nhà bếp, động vật biển, mùa & vị trí.",
    "icon": "🦁",
    "targetWords": 150
  },
  {
    "id": "L3",
    "name": "Cấp độ L3: Mở Rộng (7–9 tuổi)",
    "badge": "Mở Rộng • 150 Từ (15 Chủ Đề)",
    "color": "from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300",
    "bgBadge": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    "description": "Giao tiếp thực tế, xã hội, công nghệ và thiên nhiên. Thiên nhiên, sức khỏe, mua sắm, du lịch, công nghệ, sở thích, cộng đồng, lễ hội, tính cách, bảo vệ Trái Đất, nhà hàng, văn phòng, thiên tai, truyền thông & miêu tả con người.",
    "icon": "🚀",
    "targetWords": 150
  },
  {
    "id": "L4",
    "name": "Cấp độ L4: Nâng Cao Cho Bé (8–10 tuổi)",
    "badge": "Nâng Cao • 150 Từ (15 Chủ Đề)",
    "color": "from-purple-500 to-pink-500 border-purple-400 text-purple-300",
    "bgBadge": "bg-purple-500/20 text-purple-300 border-purple-500/40",
    "description": "Từ học thuật cơ bản, khoa học, tư duy và công dân. Khoa học cơ bản, không gian, từ học thuật, giao tiếp, giải quyết vấn đề, cảm xúc nâng cao, quốc gia/văn hóa, an toàn số, kể chuyện, mục tiêu, toán học, cơ thể bên trong, hóa học, nghệ thuật & xã hội.",
    "icon": "👑",
    "targetWords": 150
  }
];

const VOCAB_CATEGORIES = [
  { "id": "all", "name": "Tất Cả 4 Cấp Độ & 60 Chủ Đề (600 Từ Mở Rộng)", "icon": "🌈" },

  // Level 1 (L1)
  { "id": "L1-U01", "name": "L1 • 01. Colors / Màu sắc", "icon": "🎨", "level": "L1" },
  { "id": "L1-U02", "name": "L1 • 02. Numbers 1–10 / Số đếm 1–10", "icon": "🔢", "level": "L1" },
  { "id": "L1-U03", "name": "L1 • 03. Shapes / Hình dạng", "icon": "📐", "level": "L1" },
  { "id": "L1-U04", "name": "L1 • 04. My Family / Gia đình của bé", "icon": "👨‍👩‍👧‍👦", "level": "L1" },
  { "id": "L1-U05", "name": "L1 • 05. My Body / Cơ thể của bé", "icon": "👁️", "level": "L1" },
  { "id": "L1-U06", "name": "L1 • 06. Animals / Động vật quen thuộc", "icon": "🐱", "level": "L1" },
  { "id": "L1-U07", "name": "L1 • 07. Food and Drinks / Đồ ăn và thức uống", "icon": "🍱", "level": "L1" },
  { "id": "L1-U08", "name": "L1 • 08. My Classroom / Lớp học của bé", "icon": "🏫", "level": "L1" },
  { "id": "L1-U09", "name": "L1 • 09. Action Words / Động từ hành động", "icon": "🏃", "level": "L1" },
  { "id": "L1-U10", "name": "L1 • 10. Feelings / Cảm xúc cơ bản", "icon": "😊", "level": "L1" },
  { "id": "L1-U11", "name": "L1 • 11. Toys / Đồ chơi", "icon": "🧸", "level": "L1" },
  { "id": "L1-U12", "name": "L1 • 12. Insects & Small Creatures / Côn trùng", "icon": "🐞", "level": "L1" },
  { "id": "L1-U13", "name": "L1 • 13. Bathroom Items / Đồ dùng phòng tắm", "icon": "🛁", "level": "L1" },
  { "id": "L1-U14", "name": "L1 • 14. On the Farm / Ở nông trại", "icon": "🚜", "level": "L1" },
  { "id": "L1-U15", "name": "L1 • 15. Opposites / Từ trái nghĩa", "icon": "↕️", "level": "L1" },

  // Level 2 (L2)
  { "id": "L2-U01", "name": "L2 • 01. My Home / Ngôi nhà", "icon": "🏠", "level": "L2" },
  { "id": "L2-U02", "name": "L2 • 02. Clothes / Quần áo", "icon": "👕", "level": "L2" },
  { "id": "L2-U03", "name": "L2 • 03. Daily Routine / Sinh hoạt hằng ngày", "icon": "⏰", "level": "L2" },
  { "id": "L2-U04", "name": "L2 • 04. Weather / Thời tiết", "icon": "🌤️", "level": "L2" },
  { "id": "L2-U05", "name": "L2 • 05. Transportation / Phương tiện giao thông", "icon": "🚗", "level": "L2" },
  { "id": "L2-U06", "name": "L2 • 06. Places in Town / Địa điểm thành phố", "icon": "🏙️", "level": "L2" },
  { "id": "L2-U07", "name": "L2 • 07. Jobs / Nghề nghiệp", "icon": "👷", "level": "L2" },
  { "id": "L2-U08", "name": "L2 • 08. Fruits and Vegetables / Trái cây & rau củ", "icon": "🍎", "level": "L2" },
  { "id": "L2-U09", "name": "L2 • 09. Time and Calendar / Thời gian và lịch", "icon": "📅", "level": "L2" },
  { "id": "L2-U10", "name": "L2 • 10. Sports / Thể thao", "icon": "⚽", "level": "L2" },
  { "id": "L2-U11", "name": "L2 • 11. School Subjects / Các môn học", "icon": "📚", "level": "L2" },
  { "id": "L2-U12", "name": "L2 • 12. Kitchen Tools / Dụng cụ nhà bếp", "icon": "🍳", "level": "L2" },
  { "id": "L2-U13", "name": "L2 • 13. Sea Animals / Động vật biển", "icon": "🐬", "level": "L2" },
  { "id": "L2-U14", "name": "L2 • 14. Seasons / Các mùa trong năm", "icon": "🌸", "level": "L2" },
  { "id": "L2-U15", "name": "L2 • 15. Directions & Positions / Phương hướng & vị trí", "icon": "🧩", "level": "L2" },

  // Level 3 (L3)
  { "id": "L3-U01", "name": "L3 • 01. Nature / Thiên nhiên", "icon": "🌿", "level": "L3" },
  { "id": "L3-U02", "name": "L3 • 02. Health / Sức khỏe", "icon": "🩺", "level": "L3" },
  { "id": "L3-U03", "name": "L3 • 03. Shopping / Mua sắm", "icon": "🛒", "level": "L3" },
  { "id": "L3-U04", "name": "L3 • 04. Travel / Du lịch", "icon": "✈️", "level": "L3" },
  { "id": "L3-U05", "name": "L3 • 05. Technology / Công nghệ", "icon": "💻", "level": "L3" },
  { "id": "L3-U06", "name": "L3 • 06. Hobbies / Sở thích", "icon": "🎨", "level": "L3" },
  { "id": "L3-U07", "name": "L3 • 07. My Community / Cộng đồng quanh bé", "icon": "🏡", "level": "L3" },
  { "id": "L3-U08", "name": "L3 • 08. Festivals & Parties / Lễ hội & tiệc", "icon": "🎉", "level": "L3" },
  { "id": "L3-U09", "name": "L3 • 09. Personality / Tính cách", "icon": "💖", "level": "L3" },
  { "id": "L3-U10", "name": "L3 • 10. Protect the Earth / Bảo vệ Trái Đất", "icon": "🌍", "level": "L3" },
  { "id": "L3-U11", "name": "L3 • 11. At a Restaurant / Ở nhà hàng", "icon": "🍽️", "level": "L3" },
  { "id": "L3-U12", "name": "L3 • 12. Office & Work / Văn phòng & công việc", "icon": "🏢", "level": "L3" },
  { "id": "L3-U13", "name": "L3 • 13. Natural Disasters / Thiên tai", "icon": "🌪️", "level": "L3" },
  { "id": "L3-U14", "name": "L3 • 14. Media Tools / Phương tiện truyền thông", "icon": "📺", "level": "L3" },
  { "id": "L3-U15", "name": "L3 • 15. Describing People / Miêu tả con người", "icon": "🧑", "level": "L3" },

  // Level 4 (L4)
  { "id": "L4-U01", "name": "L4 • 01. Science Basics / Khoa học cơ bản", "icon": "🧪", "level": "L4" },
  { "id": "L4-U02", "name": "L4 • 02. Space / Không gian", "icon": "🚀", "level": "L4" },
  { "id": "L4-U03", "name": "L4 • 03. Learning Words / Từ học thuật cơ bản", "icon": "🧠", "level": "L4" },
  { "id": "L4-U04", "name": "L4 • 04. Communication / Giao tiếp", "icon": "🗣️", "level": "L4" },
  { "id": "L4-U05", "name": "L4 • 05. Problem Solving / Giải quyết vấn đề", "icon": "🧩", "level": "L4" },
  { "id": "L4-U06", "name": "L4 • 06. Complex Feelings / Cảm xúc nâng cao", "icon": "🌟", "level": "L4" },
  { "id": "L4-U07", "name": "L4 • 07. Countries & Culture / Quốc gia & văn hóa", "icon": "🌐", "level": "L4" },
  { "id": "L4-U08", "name": "L4 • 08. Digital Safety / An toàn số", "icon": "🔒", "level": "L4" },
  { "id": "L4-U09", "name": "L4 • 09. Storytelling / Kể chuyện", "icon": "📖", "level": "L4" },
  { "id": "L4-U10", "name": "L4 • 10. Goals & Growth / Mục tiêu & trưởng thành", "icon": "🎯", "level": "L4" },
  { "id": "L4-U11", "name": "L4 • 11. Mathematics / Toán học", "icon": "🧮", "level": "L4" },
  { "id": "L4-U12", "name": "L4 • 12. The Human Body Inside / Cơ thể bên trong", "icon": "🫀", "level": "L4" },
  { "id": "L4-U13", "name": "L4 • 13. Chemistry Basics / Hóa học cơ bản", "icon": "⚛️", "level": "L4" },
  { "id": "L4-U14", "name": "L4 • 14. Art & Design / Nghệ thuật & thiết kế", "icon": "🖼️", "level": "L4" },
  { "id": "L4-U15", "name": "L4 • 15. Society & Citizenship / Xã hội & công dân", "icon": "⚖️", "level": "L4" }
];

console.log("Ready to write full database file with 60 units");
