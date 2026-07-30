import fs from 'fs';
import path from 'path';
import { COURSE_LEVELS as OldLevels, VOCAB_CATEGORIES as OldCategories, VOCABULARY_DATABASE as OldDb } from './kidsVocabularyDatabase.js';

// 1. Updated COURSE_LEVELS for 600 words (150 words x 4 levels)
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

// 2. Updated VOCAB_CATEGORIES for 60 topics
const VOCAB_CATEGORIES = [
  { "id": "all", "name": "Tất Cả 4 Cấp Độ & 60 Chủ Đề (600 Từ Mở Rộng)", "icon": "🌈" },

  // Level 1
  { "id": "L1-U01", "name": "L1 • 01. Màu sắc (Colors)", "icon": "🎨", "level": "L1" },
  { "id": "L1-U02", "name": "L1 • 02. Số đếm 1–10 (Numbers 1-10)", "icon": "🔢", "level": "L1" },
  { "id": "L1-U03", "name": "L1 • 03. Hình dạng (Shapes)", "icon": "📐", "level": "L1" },
  { "id": "L1-U04", "name": "L1 • 04. Gia đình của bé (My Family)", "icon": "👨‍👩‍👧‍👦", "level": "L1" },
  { "id": "L1-U05", "name": "L1 • 05. Cơ thể của bé (My Body)", "icon": "👁️", "level": "L1" },
  { "id": "L1-U06", "name": "L1 • 06. Động vật quen thuộc (Animals)", "icon": "🐱", "level": "L1" },
  { "id": "L1-U07", "name": "L1 • 07. Đồ ăn và thức uống (Food & Drinks)", "icon": "🍱", "level": "L1" },
  { "id": "L1-U08", "name": "L1 • 08. Lớp học của bé (My Classroom)", "icon": "🏫", "level": "L1" },
  { "id": "L1-U09", "name": "L1 • 09. Động từ hành động (Action Words)", "icon": "🏃", "level": "L1" },
  { "id": "L1-U10", "name": "L1 • 10. Cảm xúc cơ bản (Feelings)", "icon": "😊", "level": "L1" },
  { "id": "L1-U11", "name": "L1 • 11. Đồ chơi của bé (Toys)", "icon": "🧸", "level": "L1" },
  { "id": "L1-U12", "name": "L1 • 12. Côn trùng & Sinh vật nhỏ (Insects)", "icon": "🐞", "level": "L1" },
  { "id": "L1-U13", "name": "L1 • 13. Đồ dùng phòng tắm (Bathroom Items)", "icon": "🛁", "level": "L1" },
  { "id": "L1-U14", "name": "L1 • 14. Ở nông trại (On the Farm)", "icon": "🚜", "level": "L1" },
  { "id": "L1-U15", "name": "L1 • 15. Từ trái nghĩa (Opposites)", "icon": "↕️", "level": "L1" },

  // Level 2
  { "id": "L2-U01", "name": "L2 • 01. Ngôi nhà (My Home)", "icon": "🏠", "level": "L2" },
  { "id": "L2-U02", "name": "L2 • 02. Quần áo (Clothes)", "icon": "👕", "level": "L2" },
  { "id": "L2-U03", "name": "L2 • 03. Sinh hoạt hằng ngày (Daily Routine)", "icon": "⏰", "level": "L2" },
  { "id": "L2-U04", "name": "L2 • 04. Thời tiết (Weather)", "icon": "🌤️", "level": "L2" },
  { "id": "L2-U05", "name": "L2 • 05. Phương tiện giao thông (Transportation)", "icon": "🚗", "level": "L2" },
  { "id": "L2-U06", "name": "L2 • 06. Địa điểm trong thành phố (Places in Town)", "icon": "🏙️", "level": "L2" },
  { "id": "L2-U07", "name": "L2 • 07. Nghề nghiệp (Jobs)", "icon": "👷", "level": "L2" },
  { "id": "L2-U08", "name": "L2 • 08. Trái cây và rau củ (Fruits & Vegetables)", "icon": "🍎", "level": "L2" },
  { "id": "L2-U09", "name": "L2 • 09. Thời gian và lịch (Time & Calendar)", "icon": "📅", "level": "L2" },
  { "id": "L2-U10", "name": "L2 • 10. Thể thao (Sports)", "icon": "⚽", "level": "L2" },
  { "id": "L2-U11", "name": "L2 • 11. Các môn học (School Subjects)", "icon": "📚", "level": "L2" },
  { "id": "L2-U12", "name": "L2 • 12. Dụng cụ nhà bếp (Kitchen Tools)", "icon": "🍳", "level": "L2" },
  { "id": "L2-U13", "name": "L2 • 13. Động vật biển (Sea Animals)", "icon": "🐬", "level": "L2" },
  { "id": "L2-U14", "name": "L2 • 14. Các mùa trong năm (Seasons)", "icon": "🌸", "level": "L2" },
  { "id": "L2-U15", "name": "L2 • 15. Phương hướng & Vị trí (Directions & Positions)", "icon": "🧩", "level": "L2" },

  // Level 3
  { "id": "L3-U01", "name": "L3 • 01. Thiên nhiên (Nature)", "icon": "🌿", "level": "L3" },
  { "id": "L3-U02", "name": "L3 • 02. Sức khỏe (Health)", "icon": "🩺", "level": "L3" },
  { "id": "L3-U03", "name": "L3 • 03. Mua sắm (Shopping)", "icon": "🛒", "level": "L3" },
  { "id": "L3-U04", "name": "L3 • 04. Du lịch (Travel)", "icon": "✈️", "level": "L3" },
  { "id": "L3-U05", "name": "L3 • 05. Công nghệ (Technology)", "icon": "💻", "level": "L3" },
  { "id": "L3-U06", "name": "L3 • 06. Sở thích (Hobbies)", "icon": "🎨", "level": "L3" },
  { "id": "L3-U07", "name": "L3 • 07. Cộng đồng quanh bé (My Community)", "icon": "🏡", "level": "L3" },
  { "id": "L3-U08", "name": "L3 • 08. Lễ hội & Tiệc (Festivals & Parties)", "icon": "🎉", "level": "L3" },
  { "id": "L3-U09", "name": "L3 • 09. Tính cách (Personality)", "icon": "💖", "level": "L3" },
  { "id": "L3-U10", "name": "L3 • 10. Bảo vệ Trái Đất (Protect the Earth)", "icon": "🌍", "level": "L3" },
  { "id": "L3-U11", "name": "L3 • 11. Ở nhà hàng (At a Restaurant)", "icon": "🍽️", "level": "L3" },
  { "id": "L3-U12", "name": "L3 • 12. Văn phòng & Công việc (Office & Work)", "icon": "🏢", "level": "L3" },
  { "id": "L3-U13", "name": "L3 • 13. Thiên tai (Natural Disasters)", "icon": "🌪️", "level": "L3" },
  { "id": "L3-U14", "name": "L3 • 14. Phương tiện truyền thông (Media Tools)", "icon": "📺", "level": "L3" },
  { "id": "L3-U15", "name": "L3 • 15. Miêu tả con người (Describing People)", "icon": "🧑", "level": "L3" },

  // Level 4
  { "id": "L4-U01", "name": "L4 • 01. Khoa học cơ bản (Science Basics)", "icon": "🧪", "level": "L4" },
  { "id": "L4-U02", "name": "L4 • 02. Không gian (Space)", "icon": "🚀", "level": "L4" },
  { "id": "L4-U03", "name": "L4 • 03. Từ học thuật cơ bản (Academic Words)", "icon": "🧠", "level": "L4" },
  { "id": "L4-U04", "name": "L4 • 04. Giao tiếp (Communication)", "icon": "🗣️", "level": "L4" },
  { "id": "L4-U05", "name": "L4 • 05. Giải quyết vấn đề (Problem Solving)", "icon": "🧩", "level": "L4" },
  { "id": "L4-U06", "name": "L4 • 06. Cảm xúc nâng cao (Complex Feelings)", "icon": "🌟", "level": "L4" },
  { "id": "L4-U07", "name": "L4 • 07. Quốc gia & Văn hóa (Countries & Culture)", "icon": "🌐", "level": "L4" },
  { "id": "L4-U08", "name": "L4 • 08. An toàn số (Digital Safety)", "icon": "🔒", "level": "L4" },
  { "id": "L4-U09", "name": "L4 • 09. Kể chuyện (Storytelling)", "icon": "📖", "level": "L4" },
  { "id": "L4-U10", "name": "L4 • 10. Mục tiêu & Trưởng thành (Goals & Growth)", "icon": "🎯", "level": "L4" },
  { "id": "L4-U11", "name": "L4 • 11. Toán học (Mathematics)", "icon": "🧮", "level": "L4" },
  { "id": "L4-U12", "name": "L4 • 12. Cơ thể người bên trong (The Human Body Inside)", "icon": "🫀", "level": "L4" },
  { "id": "L4-U13", "name": "L4 • 13. Hóa học cơ bản (Chemistry Basics)", "icon": "⚛️", "level": "L4" },
  { "id": "L4-U14", "name": "L4 • 14. Nghệ thuật & Thiết kế (Art & Design)", "icon": "🖼️", "level": "L4" },
  { "id": "L4-U15", "name": "L4 • 15. Xã hội & Công dân (Society & Citizenship)", "icon": "⚖️", "level": "L4" }
];

// Helper to generate new word items for Units 11-15 for each Level
const extraWords = [
  // --- L1-U11 Toys ---
  { word: "doll", ipa: "/dɑl/", vietnamesePhonetic: "Đon-lơ", meaning: "búp bê", type: "Danh từ", example: "This is a doll.", exampleVi: "Đây là búp bê.", image: "🪆", level: "L1", category: "L1-U11", unit: 11 },
  { word: "ball", ipa: "/bɔl/", vietnamesePhonetic: "Bo-lơ", meaning: "quả bóng", type: "Danh từ", example: "This is a ball.", exampleVi: "Đây là quả bóng.", image: "⚽", level: "L1", category: "L1-U11", unit: 11 },
  { word: "kite", ipa: "/kaɪt/", vietnamesePhonetic: "Khai-tơ", meaning: "con diều", type: "Danh từ", example: "This is a kite.", exampleVi: "Đây là con diều.", image: "🪁", level: "L1", category: "L1-U11", unit: 11 },
  { word: "robot", ipa: "/roʊbɑt/", vietnamesePhonetic: "Rô-bốt", meaning: "rô-bốt", type: "Danh từ", example: "This is a robot.", exampleVi: "Đây là rô-bốt.", image: "🤖", level: "L1", category: "L1-U11", unit: 11 },
  { word: "teddy bear", ipa: "/tɛdi bɛr/", vietnamesePhonetic: "Tét-đi bê-ơ", meaning: "gấu bông", type: "Danh từ", example: "This is a teddy bear.", exampleVi: "Đây là gấu bông.", image: "🧸", level: "L1", category: "L1-U11", unit: 11 },
  { word: "blocks", ipa: "/blɑks/", vietnamesePhonetic: "Bơ-lóc-sơ", meaning: "khối xếp hình", type: "Danh từ", example: "These are blocks.", exampleVi: "Đây là khối xếp hình.", image: "🧱", level: "L1", category: "L1-U11", unit: 11 },
  { word: "puzzle", ipa: "/pʌzʌl/", vietnamesePhonetic: "Pơ-zơ-lơ", meaning: "trò ghép hình", type: "Danh từ", example: "This is a puzzle.", exampleVi: "Đây là trò ghép hình.", image: "🧩", level: "L1", category: "L1-U11", unit: 11 },
  { word: "yo-yo", ipa: "/joʊ joʊ/", vietnamesePhonetic: "Dô-dô", meaning: "con quay yo-yo", type: "Danh từ", example: "This is a yo-yo.", exampleVi: "Đây là con quay yo-yo.", image: "🪀", level: "L1", category: "L1-U11", unit: 11 },
  { word: "drum", ipa: "/drʌm/", vietnamesePhonetic: "Đơ-răm", meaning: "cái trống", type: "Danh từ", example: "This is a drum.", exampleVi: "Đây là cái trống.", image: "🥁", level: "L1", category: "L1-U11", unit: 11 },
  { word: "toy train", ipa: "/tɔɪ treɪn/", vietnamesePhonetic: "Toi-tơ-ren", meaning: "tàu hỏa đồ chơi", type: "Danh từ", example: "This is a toy train.", exampleVi: "Đây là tàu hỏa đồ chơi.", image: "🚂", level: "L1", category: "L1-U11", unit: 11 },

  // --- L1-U12 Insects ---
  { word: "ant", ipa: "/ænt/", vietnamesePhonetic: "En-tơ", meaning: "con kiến", type: "Danh từ", example: "This is an ant.", exampleVi: "Đây là con kiến.", image: "🐜", level: "L1", category: "L1-U12", unit: 12 },
  { word: "bee", ipa: "/bi/", vietnamesePhonetic: "Bi", meaning: "con ong", type: "Danh từ", example: "This is a bee.", exampleVi: "Đây là con ong.", image: "🐝", level: "L1", category: "L1-U12", unit: 12 },
  { word: "butterfly", ipa: "/bʌtɝflaɪ/", vietnamesePhonetic: "Bất-tơ-phlai", meaning: "con bướm", type: "Danh từ", example: "This is a butterfly.", exampleVi: "Đây là con bướm.", image: "🦋", level: "L1", category: "L1-U12", unit: 12 },
  { word: "mosquito", ipa: "/mʌskitoʊ/", vietnamesePhonetic: "Mốt-ski-tâu", meaning: "con muỗi", type: "Danh từ", example: "This is a mosquito.", exampleVi: "Đây là con muỗi.", image: "🦟", level: "L1", category: "L1-U12", unit: 12 },
  { word: "fly", ipa: "/flaɪ/", vietnamesePhonetic: "Phlai", meaning: "con ruồi", type: "Danh từ", example: "This is a fly.", exampleVi: "Đây là con ruồi.", image: "🪰", level: "L1", category: "L1-U12", unit: 12 },
  { word: "beetle", ipa: "/bitʌl/", vietnamesePhonetic: "Bi-tồ", meaning: "bọ cánh cứng", type: "Danh từ", example: "This is a beetle.", exampleVi: "Đây là bọ cánh cứng.", image: "🪲", level: "L1", category: "L1-U12", unit: 12 },
  { word: "ladybug", ipa: "/leɪdibʌɡ/", vietnamesePhonetic: "Lê-đi-bắc", meaning: "bọ rùa", type: "Danh từ", example: "This is a ladybug.", exampleVi: "Đây là bọ rùa.", image: "🐞", level: "L1", category: "L1-U12", unit: 12 },
  { word: "grasshopper", ipa: "/ɡræshɑpɝ/", vietnamesePhonetic: "Gơ-rát-háp-pơ", meaning: "châu chấu", type: "Danh từ", example: "This is a grasshopper.", exampleVi: "Đây là châu chấu.", image: "🦗", level: "L1", category: "L1-U12", unit: 12 },
  { word: "spider", ipa: "/spaɪdɝ/", vietnamesePhonetic: "Sơ-pai-đơ", meaning: "con nhện", type: "Danh từ", example: "This is a spider.", exampleVi: "Đây là con nhện.", image: "🕷️", level: "L1", category: "L1-U12", unit: 12 },
  { word: "caterpillar", ipa: "/kætʌpɪlɝ/", vietnamesePhonetic: "Két-tơ-pi-lơ", meaning: "sâu bướm", type: "Danh từ", example: "This is a caterpillar.", exampleVi: "Đây là sâu bướm.", image: "🐛", level: "L1", category: "L1-U12", unit: 12 },

  // --- L1-U13 Bathroom Items ---
  { word: "toothbrush", ipa: "/tuθbrʌʃ/", vietnamesePhonetic: "Tút-thơ-bơ-rắt", meaning: "bàn chải đánh răng", type: "Danh từ", example: "This is a toothbrush.", exampleVi: "Đây là bàn chải đánh răng.", image: "🪥", level: "L1", category: "L1-U13", unit: 13 },
  { word: "toothpaste", ipa: "/tuθpeɪst/", vietnamesePhonetic: "Tút-thơ-pết", meaning: "kem đánh răng", type: "Danh từ", example: "This is a toothpaste.", exampleVi: "Đây là kem đánh răng.", image: "🧴", level: "L1", category: "L1-U13", unit: 13 },
  { word: "soap", ipa: "/soʊp/", vietnamesePhonetic: "Sốp-pơ", meaning: "xà phòng", type: "Danh từ", example: "This is a soap.", exampleVi: "Đây là xà phòng.", image: "🧼", level: "L1", category: "L1-U13", unit: 13 },
  { word: "towel", ipa: "/taʊʌl/", vietnamesePhonetic: "Tao-vần", meaning: "khăn tắm", type: "Danh từ", example: "This is a towel.", exampleVi: "Đây là khăn tắm.", image: "🧺", level: "L1", category: "L1-U13", unit: 13 },
  { word: "comb", ipa: "/koʊm/", vietnamesePhonetic: "Côm-mơ", meaning: "cái lược", type: "Danh từ", example: "This is a comb.", exampleVi: "Đây là cái lược.", image: "🪮", level: "L1", category: "L1-U13", unit: 13 },
  { word: "mirror", ipa: "/mɪrɝ/", vietnamesePhonetic: "Mi-rơ", meaning: "gương", type: "Danh từ", example: "This is a mirror.", exampleVi: "Đây là gương.", image: "🪞", level: "L1", category: "L1-U13", unit: 13 },
  { word: "shower", ipa: "/ʃaʊɝ/", vietnamesePhonetic: "Sa-u-ơ", meaning: "vòi sen", type: "Danh từ", example: "This is a shower.", exampleVi: "Đây là vòi sen.", image: "🚿", level: "L1", category: "L1-U13", unit: 13 },
  { word: "bathtub", ipa: "/bæθtʌb/", vietnamesePhonetic: "Bát-thơ-tắp", meaning: "bồn tắm", type: "Danh từ", example: "This is a bathtub.", exampleVi: "Đây là bồn tắm.", image: "🛁", level: "L1", category: "L1-U13", unit: 13 },
  { word: "toilet", ipa: "/tɔɪlʌt/", vietnamesePhonetic: "Toi-lét", meaning: "bồn cầu", type: "Danh từ", example: "This is a toilet.", exampleVi: "Đây là bồn cầu.", image: "🚽", level: "L1", category: "L1-U13", unit: 13 },
  { word: "sink", ipa: "/sɪŋk/", vietnamesePhonetic: "Sinh-kơ", meaning: "bồn rửa", type: "Danh từ", example: "This is a sink.", exampleVi: "Đây là bồn rửa.", image: "🚰", level: "L1", category: "L1-U13", unit: 13 },

  // --- L1-U14 On the Farm ---
  { word: "barn", ipa: "/bɑrn/", vietnamesePhonetic: "Ban-nơ", meaning: "nhà kho nông trại", type: "Danh từ", example: "This is a barn.", exampleVi: "Đây là nhà kho nông trại.", image: "🛖", level: "L1", category: "L1-U14", unit: 14 },
  { word: "tractor", ipa: "/træktɝ/", vietnamesePhonetic: "Tơ-rác-tơ", meaning: "máy kéo", type: "Danh từ", example: "This is a tractor.", exampleVi: "Đây là máy kéo.", image: "🚜", level: "L1", category: "L1-U14", unit: 14 },
  { word: "chicken", ipa: "/tʃɪkʌn/", vietnamesePhonetic: "Chi-kin", meaning: "con gà", type: "Danh từ", example: "This is a chicken.", exampleVi: "Đây là con gà.", image: "🐔", level: "L1", category: "L1-U14", unit: 14 },
  { word: "rooster", ipa: "/rustɝ/", vietnamesePhonetic: "Rút-stơ", meaning: "gà trống", type: "Danh từ", example: "This is a rooster.", exampleVi: "Đây là gà trống.", image: "🐓", level: "L1", category: "L1-U14", unit: 14 },
  { word: "goat", ipa: "/ɡoʊt/", vietnamesePhonetic: "Gốt-tơ", meaning: "con dê", type: "Danh từ", example: "This is a goat.", exampleVi: "Đây là con dê.", image: "🐐", level: "L1", category: "L1-U14", unit: 14 },
  { word: "donkey", ipa: "/dɑŋki/", vietnamesePhonetic: "Đông-ki", meaning: "con lừa", type: "Danh từ", example: "This is a donkey.", exampleVi: "Đây là con lừa.", image: "🫏", level: "L1", category: "L1-U14", unit: 14 },
  { word: "field", ipa: "/fild/", vietnamesePhonetic: "Phiu-đơ", meaning: "cánh đồng", type: "Danh từ", example: "This is a field.", exampleVi: "Đây là cánh đồng.", image: "🌾", level: "L1", category: "L1-U14", unit: 14 },
  { word: "fence", ipa: "/fɛns/", vietnamesePhonetic: "Phen-sơ", meaning: "hàng rào", type: "Danh từ", example: "This is a fence.", exampleVi: "Đây là hàng rào.", image: "🪵", level: "L1", category: "L1-U14", unit: 14 },
  { word: "hay", ipa: "/heɪ/", vietnamesePhonetic: "Hei", meaning: "cỏ khô", type: "Danh từ", example: "This is a hay.", exampleVi: "Đây là cỏ khô.", image: "🌾", level: "L1", category: "L1-U14", unit: 14 },
  { word: "seed", ipa: "/sid/", vietnamesePhonetic: "Sít-đơ", meaning: "hạt giống", type: "Danh từ", example: "This is a seed.", exampleVi: "Đây là hạt giống.", image: "🫘", level: "L1", category: "L1-U14", unit: 14 },

  // --- L1-U15 Opposites ---
  { word: "big", ipa: "/bɪɡ/", vietnamesePhonetic: "Bích-gơ", meaning: "to, lớn", type: "Tính từ", example: "It is big.", exampleVi: "Nó to, lớn.", image: "🐘", level: "L1", category: "L1-U15", unit: 15 },
  { word: "small", ipa: "/smɔl/", vietnamesePhonetic: "Sơ-mol", meaning: "nhỏ", type: "Tính từ", example: "It is small.", exampleVi: "Nó nhỏ.", image: "🐭", level: "L1", category: "L1-U15", unit: 15 },
  { word: "tall", ipa: "/tɔl/", vietnamesePhonetic: "Tol-lơ", meaning: "cao", type: "Tính từ", example: "It is tall.", exampleVi: "Nó cao.", image: "🦒", level: "L1", category: "L1-U15", unit: 15 },
  { word: "short", ipa: "/ʃɔrt/", vietnamesePhonetic: "Sót-tơ", meaning: "thấp, ngắn", type: "Tính từ", example: "It is short.", exampleVi: "Nó thấp, ngắn.", image: "🦔", level: "L1", category: "L1-U15", unit: 15 },
  { word: "fast", ipa: "/fæst/", vietnamesePhonetic: "Phat-stơ", meaning: "nhanh", type: "Tính từ", example: "It is fast.", exampleVi: "Nó nhanh.", image: "🐆", level: "L1", category: "L1-U15", unit: 15 },
  { word: "slow", ipa: "/sloʊ/", vietnamesePhonetic: "Sơ-lâu", meaning: "chậm", type: "Tính từ", example: "It is slow.", exampleVi: "Nó chậm.", image: "🐢", level: "L1", category: "L1-U15", unit: 15 },
  { word: "clean", ipa: "/klin/", vietnamesePhonetic: "Cơ-lin", meaning: "sạch", type: "Tính từ", example: "It is clean.", exampleVi: "Nó sạch.", image: "🧽", level: "L1", category: "L1-U15", unit: 15 },
  { word: "dirty", ipa: "/dɝti/", vietnamesePhonetic: "Đơ-ti", meaning: "bẩn", type: "Tính từ", example: "It is dirty.", exampleVi: "Nó bẩn.", image: "💩", level: "L1", category: "L1-U15", unit: 15 },
  { word: "open", ipa: "/oʊpʌn/", vietnamesePhonetic: "Ô-pần", meaning: "mở", type: "Tính từ", example: "It is open.", exampleVi: "Nó mở.", image: "🔓", level: "L1", category: "L1-U15", unit: 15 },
  { word: "closed", ipa: "/kloʊzd/", vietnamesePhonetic: "Cơ-lâu-zđơ", meaning: "đóng", type: "Tính từ", example: "It is closed.", exampleVi: "Nó đóng.", image: "🔒", level: "L1", category: "L1-U15", unit: 15 },

  // --- L2-U11 School Subjects ---
  { word: "math", ipa: "/mæθ/", vietnamesePhonetic: "Mát-thơ", meaning: "môn toán", type: "Danh từ", example: "I like math class.", exampleVi: "Bé thích giờ học toán.", image: "🔢", level: "L2", category: "L2-U11", unit: 11 },
  { word: "English", ipa: "/ˈɪŋɡlɪʃ/", vietnamesePhonetic: "Ing-gơ-lish", meaning: "tiếng Anh", type: "Danh từ", example: "I learn English every day.", exampleVi: "Bé học tiếng Anh mỗi ngày.", image: "🇬🇧", level: "L2", category: "L2-U11", unit: 11 },
  { word: "science", ipa: "/ˈsaɪəns/", vietnamesePhonetic: "Sai-ân-sơ", meaning: "khoa học", type: "Danh từ", example: "Science is so interesting.", exampleVi: "Khoa học thật thú vị.", image: "🔬", level: "L2", category: "L2-U11", unit: 11 },
  { word: "history", ipa: "/ˈhɪstəri/", vietnamesePhonetic: "Hít-stơ-ri", meaning: "lịch sử", type: "Danh từ", example: "We study history today.", exampleVi: "Hôm nay chúng mình học lịch sử.", image: "🏛️", level: "L2", category: "L2-U11", unit: 11 },
  { word: "geography", ipa: "/dʒiˈɑːɡrəfi/", vietnamesePhonetic: "Gi-ó-gơ-ra-phi", meaning: "địa lý", type: "Danh từ", example: "Geography maps are cool.", exampleVi: "Bản đồ địa lý rất hay.", image: "🗺️", level: "L2", category: "L2-U11", unit: 11 },
  { word: "art", ipa: "/ɑːrt/", vietnamesePhonetic: "Át-tơ", meaning: "mỹ thuật", type: "Danh từ", example: "I draw pictures in art class.", exampleVi: "Bé vẽ tranh trong giờ mỹ thuật.", image: "🎨", level: "L2", category: "L2-U11", unit: 11 },
  { word: "music", ipa: "/ˈmjuːzɪk/", vietnamesePhonetic: "Miu-zíc", meaning: "âm nhạc", type: "Danh từ", example: "We sing songs in music class.", exampleVi: "Chúng mình hát bài hát trong giờ âm nhạc.", image: "🎵", level: "L2", category: "L2-U11", unit: 11 },
  { word: "physical education", ipa: "/ˈfɪzɪkəl ˌɛdʒʊˈkeɪʃən/", vietnamesePhonetic: "Phi-zi-cồ Ét-dụ-kế-shần", meaning: "thể dục", type: "Danh từ", example: "We play games in physical education.", exampleVi: "Chúng mình chơi trò chơi trong giờ thể dục.", image: "⚽", level: "L2", category: "L2-U11", unit: 11 },
  { word: "computer science", ipa: "/kəmˈpjuːtər ˈsaɪəns/", vietnamesePhonetic: "Cơm-piu-tơ Sai-ân-sơ", meaning: "tin học", type: "Danh từ", example: "I use laptops in computer science.", exampleVi: "Bé dùng máy tính trong giờ tin học.", image: "💻", level: "L2", category: "L2-U11", unit: 11 },
  { word: "literature", ipa: "/ˈlɪtərətʃər/", vietnamesePhonetic: "Li-tơ-rơ-chơ", meaning: "ngữ văn", type: "Danh từ", example: "We read stories in literature.", exampleVi: "Chúng mình đọc truyện trong giờ ngữ văn.", image: "📚", level: "L2", category: "L2-U11", unit: 11 },

  // --- L2-U12 Kitchen Tools ---
  { word: "spoon", ipa: "/spuːn/", vietnamesePhonetic: "Sơ-pun", meaning: "cái thìa", type: "Danh từ", example: "I use a spoon to eat soup.", exampleVi: "Bé dùng thìa để ăn súp.", image: "🥄", level: "L2", category: "L2-U12", unit: 12 },
  { word: "fork", ipa: "/fɔːrk/", vietnamesePhonetic: "Pho-cơ", meaning: "cái nĩa", type: "Danh từ", example: "I pick food with a fork.", exampleVi: "Bé xiên thức ăn bằng nĩa.", image: "🍴", level: "L2", category: "L2-U12", unit: 12 },
  { word: "knife", ipa: "/naɪf/", vietnamesePhonetic: "Nai-phơ", meaning: "con dao", type: "Danh từ", example: "Be careful with the knife.", exampleVi: "Hãy cẩn thận với con dao.", image: "🔪", level: "L2", category: "L2-U12", unit: 12 },
  { word: "plate", ipa: "/pleɪt/", vietnamesePhonetic: "Pơ-lết", meaning: "cái đĩa", type: "Danh từ", example: "Put the cake on the plate.", exampleVi: "Đặt bánh lên cái đĩa.", image: "🍽️", level: "L2", category: "L2-U12", unit: 12 },
  { word: "bowl", ipa: "/boʊl/", vietnamesePhonetic: "Bâu-lơ", meaning: "cái bát/tô", type: "Danh từ", example: "Rice is in the bowl.", exampleVi: "Cơm ở trong bát.", image: "🥣", level: "L2", category: "L2-U12", unit: 12 },
  { word: "cup", ipa: "/kʌp/", vietnamesePhonetic: "Cắp-pơ", meaning: "cái cốc/tách", type: "Danh từ", example: "I drink water from a cup.", exampleVi: "Bé uống nước từ cái cốc.", image: "🥤", level: "L2", category: "L2-U12", unit: 12 },
  { word: "pot", ipa: "/pɑːt/", vietnamesePhonetic: "Pót-tơ", meaning: "nồi nấu", type: "Danh từ", example: "Mom cooks soup in a pot.", exampleVi: "Mẹ nấu súp trong nồi.", image: "🫕", level: "L2", category: "L2-U12", unit: 12 },
  { word: "pan", ipa: "/pæn/", vietnamesePhonetic: "Pen", meaning: "chảo ráng", type: "Danh từ", example: "We fry eggs in a pan.", exampleVi: "Chúng mình rán trứng bằng chảo.", image: "🍳", level: "L2", category: "L2-U12", unit: 12 },
  { word: "kettle", ipa: "/ˈkɛtəl/", vietnamesePhonetic: "Két-tồ", meaning: "ấm đun nước", type: "Danh từ", example: "The kettle is hot.", exampleVi: "Ấm đun nước đang nóng.", image: "🫖", level: "L2", category: "L2-U12", unit: 12 },
  { word: "refrigerator", ipa: "/rɪˈfrɪdʒəreɪtər/", vietnamesePhonetic: "Ri-phri-giơ-rê-tơ", meaning: "tủ lạnh", type: "Danh từ", example: "Milk is in the refrigerator.", exampleVi: "Sữa ở trong tủ lạnh.", image: "🧊", level: "L2", category: "L2-U12", unit: 12 },

  // --- L2-U13 Sea Animals ---
  { word: "dolphin", ipa: "/ˈdɑːlfɪn/", vietnamesePhonetic: "Đôn-phin", meaning: "cá heo", type: "Danh từ", example: "The dolphin jumps high.", exampleVi: "Cá heo nhảy rất cao.", image: "🐬", level: "L2", category: "L2-U13", unit: 13 },
  { word: "whale", ipa: "/weɪl/", vietnamesePhonetic: "Quêu-lơ", meaning: "cá voi", type: "Danh từ", example: "The whale is huge.", exampleVi: "Cá voi rất khổng lồ.", image: "🐋", level: "L2", category: "L2-U13", unit: 13 },
  { word: "shark", ipa: "/ʃɑːrk/", vietnamesePhonetic: "Sác-cơ", meaning: "cá mập", type: "Danh từ", example: "The shark swims fast.", exampleVi: "Cá mập bơi rất nhanh.", image: "🦈", level: "L2", category: "L2-U13", unit: 13 },
  { word: "octopus", ipa: "/ˈɑːktəpʊs/", vietnamesePhonetic: "Óc-tơ-pớt-sơ", meaning: "bạch tuộc", type: "Danh từ", example: "The octopus has eight arms.", exampleVi: "Bạch tuộc có tám xúc giác.", image: "🐙", level: "L2", category: "L2-U13", unit: 13 },
  { word: "crab", ipa: "/kræb/", vietnamesePhonetic: "Cơ-rép", meaning: "con cua", type: "Danh từ", example: "The crab walks sideways.", exampleVi: "Con cua bò ngang.", image: "🦀", level: "L2", category: "L2-U13", unit: 13 },
  { word: "lobster", ipa: "/ˈlɑːbstər/", vietnamesePhonetic: "Lóp-stơ", meaning: "tôm hùm", type: "Danh từ", example: "The lobster lives in the ocean.", exampleVi: "Tôm hùm sống dưới đại dương.", image: "🦞", level: "L2", category: "L2-U13", unit: 13 },
  { word: "sea turtle", ipa: "/siː ˈtɝːtəl/", vietnamesePhonetic: "Si Tơ-tồ", meaning: "rùa biển", type: "Danh từ", example: "The sea turtle swims calmly.", exampleVi: "Rùa biển bơi rất thong thả.", image: "🐢", level: "L2", category: "L2-U13", unit: 13 },
  { word: "seahorse", ipa: "/ˈsiːhɔːrs/", vietnamesePhonetic: "Si-hót-sơ", meaning: "cá ngựa", type: "Danh từ", example: "The seahorse is small.", exampleVi: "Cá ngựa rất nhỏ nhắn.", image: "🐎", level: "L2", category: "L2-U13", unit: 13 },
  { word: "jellyfish", ipa: "/ˈdʒɛliˌfɪʃ/", vietnamesePhonetic: "Giê-li-phít-shơ", meaning: "con sứa", type: "Danh từ", example: "The jellyfish glows in water.", exampleVi: "Con sứa phát sáng dưới nước.", image: "🪼", level: "L2", category: "L2-U13", unit: 13 },
  { word: "starfish", ipa: "/ˈstɑːrfɪʃ/", vietnamesePhonetic: "Sờ-ta-phít-shơ", meaning: "sao biển", type: "Danh từ", example: "Starfish rest on the sand.", exampleVi: "Sao biển nằm trên bãi cát.", image: "🌟", level: "L2", category: "L2-U13", unit: 13 },

  // --- L2-U14 Seasons ---
  { word: "spring", ipa: "/sprɪŋ/", vietnamesePhonetic: "Sơ-pơ-ring", meaning: "mùa xuân", type: "Danh từ", example: "Flowers bloom in spring.", exampleVi: "Hoa nở vào mùa xuân.", image: "🌸", level: "L2", category: "L2-U14", unit: 14 },
  { word: "summer", ipa: "/ˈsʌmər/", vietnamesePhonetic: "Săm-mơ", meaning: "mùa hè", type: "Danh từ", example: "We swim in summer.", exampleVi: "Chúng mình đi bơi vào mùa hè.", image: "☀️", level: "L2", category: "L2-U14", unit: 14 },
  { word: "autumn", ipa: "/ˈɔːtəm/", vietnamesePhonetic: "Ó-tầm", meaning: "mùa thu", type: "Danh từ", example: "Leaves fall in autumn.", exampleVi: "Lá rơi vào mùa thu.", image: "🍂", level: "L2", category: "L2-U14", unit: 14 },
  { word: "winter", ipa: "/ˈwɪntər/", vietnamesePhonetic: "Quin-tơ", meaning: "mùa đông", type: "Danh từ", example: "It is cold in winter.", exampleVi: "Trời lạnh vào mùa đông.", image: "❄️", level: "L2", category: "L2-U14", unit: 14 },
  { word: "blossom", ipa: "/ˈblɑːsəm/", vietnamesePhonetic: "Bơ-lót-sầm", meaning: "hoa nở", type: "Danh từ", example: "Peach blossom is pretty.", exampleVi: "Hoa đào nở rất đẹp.", image: "🌺", level: "L2", category: "L2-U14", unit: 14 },
  { word: "sunlight", ipa: "/ˈsʌnlaɪt/", vietnamesePhonetic: "Săn-lai-tơ", meaning: "ánh nắng", type: "Danh từ", example: "Sunlight is warm.", exampleVi: "Ánh nắng thật ấm áp.", image: "☀️", level: "L2", category: "L2-U14", unit: 14 },
  { word: "fallen leaf", ipa: "/ˈfɔːlən liːf/", vietnamesePhonetic: "Pho-lần Líp-phơ", meaning: "lá rụng", type: "Danh từ", example: "I see a red fallen leaf.", exampleVi: "Bé thấy một chiếc lá rụng màu đỏ.", image: "🍁", level: "L2", category: "L2-U14", unit: 14 },
  { word: "snowman", ipa: "/ˈsnoʊmæn/", vietnamesePhonetic: "Sơ-nâu-men", meaning: "người tuyết", type: "Danh từ", example: "We make a snowman in winter.", exampleVi: "Chúng mình làm người tuyết vào mùa đông.", image: "☃️", level: "L2", category: "L2-U14", unit: 14 },
  { word: "umbrella", ipa: "/ʌmˈbrɛlə/", "vietnamesePhonetic": "Ăm-bơ-re-la", meaning: "cây dù/ô", type: "Danh từ", example: "Take an umbrella on rainy days.", exampleVi: "Hãy mang ô vào những ngày mưa.", image: "☂️", level: "L2", category: "L2-U14", unit: 14 },
  { word: "coat", ipa: "/koʊt/", vietnamesePhonetic: "Cốt-tơ", meaning: "áo khoác ấm", type: "Danh từ", example: "Wear a warm coat.", exampleVi: "Hãy mặc áo khoác ấm vào.", image: "🧥", level: "L2", category: "L2-U14", unit: 14 },

  // --- L2-U15 Directions & Positions ---
  { word: "left", ipa: "/lɛft/", vietnamesePhonetic: "Lép-phơ-tơ", meaning: "bên trái", type: "Danh từ", example: "Turn left at the corner.", exampleVi: "Rẽ trái ở góc đường.", image: "⬅️", level: "L2", category: "L2-U15", unit: 15 },
  { word: "right", ipa: "/raɪt/", vietnamesePhonetic: "Rai-tơ", meaning: "bên phải", type: "Danh từ", example: "Turn right here.", exampleVi: "Rẽ phải ở đây.", image: "➡️", level: "L2", category: "L2-U15", unit: 15 },
  { word: "straight", ipa: "/streɪt/", vietnamesePhonetic: "Sơ-tơ-rết-tơ", meaning: "đi thẳng", type: "Tính từ", example: "Go straight ahead.", exampleVi: "Đi thẳng về phía trước.", image: "⬆️", level: "L2", category: "L2-U15", unit: 15 },
  { word: "turn", ipa: "/tɝːn/", vietnamesePhonetic: "Tơn-nơ", meaning: "xoay/rẽ", type: "Động từ", example: "Turn around now.", exampleVi: "Hãy xoay người lại nào.", image: "🔄", level: "L2", category: "L2-U15", unit: 15 },
  { word: "near", ipa: "/nɪr/", vietnamesePhonetic: "Ni-ơ", meaning: "gần", type: "Giới từ", example: "The park is near my home.", exampleVi: "Công viên ở gần nhà bé.", image: "📍", level: "L2", category: "L2-U15", unit: 15 },
  { word: "far", ipa: "/fɑːr/", vietnamesePhonetic: "Pha-ơ", meaning: "xa", type: "Tính từ", example: "The moon is far away.", exampleVi: "Mặt trăng ở rất xa.", image: "🔭", level: "L2", category: "L2-U15", unit: 15 },
  { word: "above", ipa: "/əˈbʌv/", vietnamesePhonetic: "Ơ-bắp-vơ", meaning: "ở phía trên", type: "Giới từ", example: "The lamp is above the table.", exampleVi: "Đèn ở phía trên bàn.", image: "👆", level: "L2", category: "L2-U15", unit: 15 },
  { word: "below", ipa: "/bɪˈloʊ/", vietnamesePhonetic: "Bi-lâu", meaning: "ở phía dưới", type: "Giới từ", example: "The shoes are below the bed.", exampleVi: "Giày ở phía dưới gầm giường.", image: "👇", level: "L2", category: "L2-U15", unit: 15 },
  { word: "inside", ipa: "/ɪnˈsaɪd/", vietnamesePhonetic: "In-sai-đơ", meaning: "ở bên trong", type: "Giới từ", example: "Toys are inside the box.", exampleVi: "Đồ chơi ở bên trong hộp.", image: "📥", level: "L2", category: "L2-U15", unit: 15 },
  { word: "outside", ipa: "/aʊtˈsaɪd/", vietnamesePhonetic: "Ao-sai-đơ", meaning: "ở bên ngoài", type: "Giới từ", example: "Let's play outside.", exampleVi: "Chúng mình ra ngoài chơi nào.", image: "📤", level: "L2", category: "L2-U15", unit: 15 },

  // --- L3-U11 Restaurant ---
  { word: "menu", ipa: "/ˈmɛnjuː/", vietnamesePhonetic: "Me-niu", meaning: "thực đơn", type: "Danh từ", example: "Look at the food menu.", exampleVi: "Hãy xem thực đơn món ăn.", image: "📜", level: "L3", category: "L3-U11", unit: 11 },
  { word: "waiter", ipa: "/ˈweɪtər/", vietnamesePhonetic: "Quây-tơ", meaning: "nam bồi bàn", type: "Danh từ", example: "The waiter brings soup.", exampleVi: "Anh bồi bàn mang súp tới.", image: "🧑‍🍳", level: "L3", category: "L3-U11", unit: 11 },
  { word: "waitress", ipa: "/ˈweɪtrəs/", vietnamesePhonetic: "Quây-trớt-sơ", meaning: "nữ bồi bàn", type: "Danh từ", example: "The waitress smiles kindly.", exampleVi: "Chị bồi bàn mỉm cười thân thiện.", image: "👩‍🍳", level: "L3", category: "L3-U11", unit: 11 },
  { word: "order", ipa: "/ˈɔːrdər/", vietnamesePhonetic: "Ó-đơ", meaning: "gọi món", type: "Động từ", example: "I order pizza.", exampleVi: "Bé gọi món bánh pizza.", image: "📝", level: "L3", category: "L3-U11", unit: 11 },
  { word: "meal", ipa: "/miːl/", vietnamesePhonetic: "Miu-lơ", meaning: "bữa ăn", type: "Danh từ", example: "Enjoy your meal!", exampleVi: "Chúc bạn ngon miệng!", image: "🍽️", level: "L3", category: "L3-U11", unit: 11 },
  { word: "dessert", ipa: "/dɪˈzɝːt/", vietnamesePhonetic: "Đi-zớt-tơ", meaning: "món tráng miệng", type: "Danh từ", example: "Ice cream is dessert.", exampleVi: "Kem là món tráng miệng.", image: "🍨", level: "L3", category: "L3-U11", unit: 11 },
  { word: "soup", ipa: "/suːp/", vietnamesePhonetic: "Súp-pơ", meaning: "món súp", type: "Danh từ", example: "The hot soup is yummy.", exampleVi: "Món súp nóng thật ngon.", image: "🥣", level: "L3", category: "L3-U11", unit: 11 },
  { word: "salad", ipa: "/ˈsæləd/", vietnamesePhonetic: "Se-lật-đơ", meaning: "món xa-lát", type: "Danh từ", example: "Fresh salad is good.", exampleVi: "Món xa-lát tươi rất tốt.", image: "🥗", level: "L3", category: "L3-U11", unit: 11 },
  { word: "bill", ipa: "/bɪl/", vietnamesePhonetic: "Biu-lơ", meaning: "hóa đơn", type: "Danh từ", example: "Dad pays the bill.", exampleVi: "Bố thanh toán hóa đơn.", image: "🧾", level: "L3", category: "L3-U11", unit: 11 },
  { word: "tip", ipa: "/tɪp/", vietnamesePhonetic: "Típ-pơ", meaning: "tiền bồi dưỡng", type: "Danh từ", example: "We leave a friendly tip.", exampleVi: "Chúng mình để lại tiền bồi dưỡng.", image: "🪙", level: "L3", category: "L3-U11", unit: 11 },

  // --- L3-U12 Office & Work ---
  { word: "office", ipa: "/ˈɔːfɪs/", vietnamesePhonetic: "Ó-phít-sơ", meaning: "văn phòng", type: "Danh từ", example: "Mom works in an office.", exampleVi: "Mẹ làm việc ở văn phòng.", image: "🏢", level: "L3", category: "L3-U12", unit: 12 },
  { word: "manager", ipa: "/ˈmænɪdʒər/", vietnamesePhonetic: "Me-ni-giơ", meaning: "quản lý", type: "Danh từ", example: "The manager leads team.", exampleVi: "Người quản lý dẫn dắt đội ngũ.", image: "🧑‍💼", level: "L3", category: "L3-U12", unit: 12 },
  { word: "meeting", ipa: "/ˈmiːtɪŋ/", vietnamesePhonetic: "Mi-tinh", meaning: "cuộc họp", type: "Danh từ", example: "They start a meeting.", exampleVi: "Họ bắt đầu cuộc họp.", image: "🤝", level: "L3", category: "L3-U12", unit: 12 },
  { word: "project", ipa: "/ˈprɑːdʒɛkt/", vietnamesePhonetic: "Pơ-ro-giếch-tơ", meaning: "dự án", type: "Danh từ", example: "Our project is creative.", exampleVi: "Dự án của chúng mình rất sáng tạo.", image: "📁", level: "L3", category: "L3-U12", unit: 12 },
  { word: "document", ipa: "/ˈdɑːkjʊmənt/", vietnamesePhonetic: "Đó-kiu-mần-tơ", meaning: "tài liệu", type: "Danh từ", example: "Print this document.", exampleVi: "In tài liệu này ra nào.", image: "📄", level: "L3", category: "L3-U12", unit: 12 },
  { word: "printer", ipa: "/ˈprɪntər/", vietnamesePhonetic: "Pơ-rin-tơ", meaning: "máy in", type: "Danh từ", example: "The printer makes copies.", exampleVi: "Máy in tạo ra các bản sao.", image: "🖨️", level: "L3", category: "L3-U12", unit: 12 },
  { word: "desk", ipa: "/dɛsk/", vietnamesePhonetic: "Đét-skơ", meaning: "bàn làm việc", type: "Danh từ", example: "My computer is on desk.", exampleVi: "Máy tính ở trên bàn làm việc.", image: "🖥️", level: "L3", category: "L3-U12", unit: 12 },
  { word: "colleague", ipa: "/ˈkɑːliːɡ/", vietnamesePhonetic: "Co-lig-gơ", meaning: "đồng nghiệp", type: "Danh từ", example: "Colleagues work together.", exampleVi: "Đồng nghiệp làm việc cùng nhau.", image: "👥", level: "L3", category: "L3-U12", unit: 12 },
  { word: "schedule", ipa: "/ˈskɛdʒuːl/", vietnamesePhonetic: "Sơ-ke-du-lơ", meaning: "lịch trình", type: "Danh từ", example: "Check your daily schedule.", exampleVi: "Kiểm tra lịch trình hằng ngày của con.", image: "📅", level: "L3", category: "L3-U12", unit: 12 },
  { word: "folder", ipa: "/ˈfoʊldər/", vietnamesePhonetic: "Phâu-đơ", meaning: "kẹp hồ sơ", type: "Danh từ", example: "Put papers in folder.", exampleVi: "Đặt giấy tờ vào kẹp hồ sơ.", image: "📁", level: "L3", category: "L3-U12", unit: 12 },

  // --- L3-U13 Natural Disasters ---
  { word: "earthquake", ipa: "/ˈɝːθkweɪk/", vietnamesePhonetic: "Ớt-thơ-quếch-kơ", meaning: "trận động đất", type: "Danh từ", example: "The earth shakes in earthquake.", exampleVi: "Mặt đất rung chuyển trong trận động đất.", image: "🌋", level: "L3", category: "L3-U13", unit: 13 },
  { word: "flood", ipa: "/flʌd/", vietnamesePhonetic: "Phơ-lất-đơ", meaning: "trận lũ lụt", type: "Danh từ", example: "Heavy rain causes flood.", exampleVi: "Mưa lớn gây ra lũ lụt.", image: "🌊", level: "L3", category: "L3-U13", unit: 13 },
  { word: "drought", ipa: "/draʊt/", vietnamesePhonetic: "Đơ-rao-tơ", meaning: "hạn hán", type: "Danh từ", example: "Plants need water in drought.", exampleVi: "Cây cối cần nước trong đợt hạn hán.", image: "☀️", level: "L3", category: "L3-U13", unit: 13 },
  { word: "wildfire", ipa: "/ˈwaɪldfaɪər/", vietnamesePhonetic: "Quai-lơ-phai-ơ", meaning: "cháy rừng", type: "Danh từ", example: "Firefighters stop wildfire.", exampleVi: "Lính chữa cháy dập tắt đám cháy rừng.", image: "🔥", level: "L3", category: "L3-U13", unit: 13 },
  { word: "tornado", ipa: "/tɔːrˈneɪdoʊ/", vietnamesePhonetic: "Tor-nê-đâu", meaning: "lốc xoáy", type: "Danh từ", example: "A tornado spins strong winds.", exampleVi: "Lốc xoáy xoay quanh gió mạnh.", image: "🌪️", level: "L3", category: "L3-U13", unit: 13 },
  { word: "hurricane", ipa: "/ˈhɝːəkən/", vietnamesePhonetic: "Hơ-ri-ken", meaning: "bão lớn", type: "Danh từ", example: "Stay safe during a hurricane.", exampleVi: "Hãy giữ an toàn trong trận bão lớn.", image: "🌀", level: "L3", category: "L3-U13", unit: 13 },
  { word: "volcano", ipa: "/vɑːlˈkeɪnoʊ/", vietnamesePhonetic: "Von-kê-nâu", meaning: "núi lửa", type: "Danh từ", example: "Lava flows from volcano.", exampleVi: "Dung nham chảy ra từ núi lửa.", image: "🌋", level: "L3", category: "L3-U13", unit: 13 },
  { word: "landslide", ipa: "/ˈlændslaɪd/", vietnamesePhonetic: "Len-đơ-sơ-lai-đơ", meaning: "sạt lở đất", type: "Danh từ", example: "Mud falls down in landslide.", exampleVi: "Bùn đất sạt lở xuống dốc.", image: "🏔️", level: "L3", category: "L3-U13", unit: 13 },
  { word: "tsunami", ipa: "/tsuːˈnɑːmi/", vietnamesePhonetic: "Su-na-mi", meaning: "sóng thần", type: "Danh từ", example: "A tsunami brings giant waves.", exampleVi: "Sóng thần mang theo những ngọn sóng khổng lồ.", image: "🌊", level: "L3", category: "L3-U13", unit: 13 },
  { word: "emergency", ipa: "/ɪˈmɝːdʒənsi/", vietnamesePhonetic: "I-mơ-giân-si", meaning: "tình huống khẩn cấp", type: "Danh từ", example: "Call help in emergency.", exampleVi: "Gọi trợ giúp trong tình huống khẩn cấp.", image: "🚨", level: "L3", category: "L3-U13", unit: 13 },

  // --- L3-U14 Media Tools ---
  { word: "telephone", ipa: "/ˈtɛlɪfoʊn/", vietnamesePhonetic: "Te-li-phôn", meaning: "điện thoại bàn", type: "Danh từ", example: "The telephone is ringing.", exampleVi: "Điện thoại bàn đang đổ chuông.", image: "☎️", level: "L3", category: "L3-U14", unit: 14 },
  { word: "smartphone", ipa: "/ˈsmɑːrtfoʊn/", vietnamesePhonetic: "Sơ-mát-phôn", meaning: "điện thoại thông minh", type: "Danh từ", example: "I use a smartphone to learn.", exampleVi: "Bé dùng điện thoại thông minh để học.", image: "📱", level: "L3", category: "L3-U14", unit: 14 },
  { word: "letter", ipa: "/ˈlɛtər/", vietnamesePhonetic: "Lét-tơ", meaning: "bức thư", type: "Danh từ", example: "I write a letter to grandma.", exampleVi: "Bé viết một bức thư gửi bà.", image: "✉️", level: "L3", category: "L3-U14", unit: 14 },
  { word: "postcard", ipa: "/ˈpoʊstkɑːrd/", vietnamesePhonetic: "Pốt-stơ-cát", meaning: "bưu thiếp", type: "Danh từ", example: "Send a travel postcard.", exampleVi: "Gửi một bưu thiếp du lịch.", image: "🏙️", level: "L3", category: "L3-U14", unit: 14 },
  { word: "microphone", ipa: "/ˈmaɪkrəfoʊn/", vietnamesePhonetic: "Mai-cro-phôn", meaning: "micrô", type: "Danh từ", example: "Sing loudly into microphone.", exampleVi: "Hát thật to vào micrô.", image: "🎙️", level: "L3", category: "L3-U14", unit: 14 },
  { word: "radio", ipa: "/ˈreɪdioʊ/", vietnamesePhonetic: "Rê-đi-ô", meaning: "máy đài radio", type: "Danh từ", example: "Listen to music on radio.", exampleVi: "Nghe nhạc trên máy đài radio.", image: "📻", level: "L3", category: "L3-U14", unit: 14 },
  { word: "television", ipa: "/ˈtɛləvɪʒən/", vietnamesePhonetic: "Te-lơ-vi-giần", meaning: "ti vi", type: "Danh từ", example: "We watch cartoons on television.", exampleVi: "Chúng mình xem hoạt hình trên ti vi.", image: "📺", level: "L3", category: "L3-U14", unit: 14 },
  { word: "newspaper", ipa: "/ˈnuːzpeɪpər/", vietnamesePhonetic: "Niu-zơ-pê-pơ", meaning: "tờ báo", type: "Danh từ", example: "Dad reads morning newspaper.", exampleVi: "Bố đọc tờ báo buổi sáng.", image: "📰", level: "L3", category: "L3-U14", unit: 14 },
  { word: "magazine", ipa: "/ˌmæɡəˈziːn/", vietnamesePhonetic: "Me-gơ-zin", meaning: "tạp chí", type: "Danh từ", example: "This magazine has bright photos.", exampleVi: "Tạp chí này có những bức ảnh tươi sáng.", image: "📖", level: "L3", category: "L3-U14", unit: 14 },
  { word: "camera", ipa: "/ˈkæmrə/", vietnamesePhonetic: "Kem-mơ-ra", meaning: "máy ảnh", type: "Danh từ", example: "Take a picture with camera.", exampleVi: "Chụp một bức ảnh bằng máy ảnh.", image: "📷", level: "L3", category: "L3-U14", unit: 14 },

  // --- L3-U15 Describing People ---
  { word: "young", ipa: "/jʌŋ/", vietnamesePhonetic: "Dăng", meaning: "trẻ tuổi", type: "Tính từ", example: "The baby is very young.", exampleVi: "Em bé còn rất trẻ tuổi.", image: "👶", level: "L3", category: "L3-U15", unit: 15 },
  { word: "old", ipa: "/oʊld/", vietnamesePhonetic: "Ô-lơ-đơ", meaning: "lớn tuổi/già", type: "Tính từ", example: "My grandpa is wise and old.", exampleVi: "Ông của bé lớn tuổi và uyên bác.", image: "👴", level: "L3", category: "L3-U15", unit: 15 },
  { word: "tall", ipa: "/tɔːl/", vietnamesePhonetic: "Tol-lơ", meaning: "cao lớn", type: "Tính từ", example: "The basketball player is tall.", exampleVi: "Vận động viên bóng rổ rất cao lớn.", image: "🦒", level: "L3", category: "L3-U15", unit: 15 },
  { word: "short", ipa: "/ʃɔːrt/", vietnamesePhonetic: "Sót-tơ", meaning: "nấm lùn/thấp", type: "Tính từ", example: "The little puppy is short.", exampleVi: "Chú cún nhỏ rất thấp bé.", image: "🦔", level: "L3", category: "L3-U15", unit: 15 },
  { word: "thin", ipa: "/θɪn/", vietnamesePhonetic: "Thinh-nơ", meaning: "gầy/mảnh khảnh", type: "Tính từ", example: "He runs fast because he is thin.", exampleVi: "Cậu ấy chạy nhanh vì mảnh khảnh.", image: "🧍", level: "L3", category: "L3-U15", unit: 15 },
  { word: "strong", ipa: "/strɔːŋ/", vietnamesePhonetic: "Sơ-tơ-rong", meaning: "khỏe mạnh", type: "Tính từ", example: "Eating vegetables makes you strong.", exampleVi: "Ăn rau củ giúp bạn khỏe mạnh.", image: "🏋️", level: "L3", category: "L3-U15", unit: 15 },
  { word: "beautiful", ipa: "/ˈbjuːtɪfəl/", vietnamesePhonetic: "Biu-ti-phù-lơ", meaning: "xinh đẹp", type: "Tính từ", example: "Mom looks beautiful today.", exampleVi: "Hôm nay mẹ trông thật xinh đẹp.", image: "🌸", level: "L3", category: "L3-U15", unit: 15 },
  { word: "handsome", ipa: "/ˈhænsəm/", vietnamesePhonetic: "Hen-sầm", meaning: "đẹp trai", type: "Tính từ", example: "The prince is handsome.", exampleVi: "Hoàng tử rất đẹp trai.", image: "🤵", level: "L3", category: "L3-U15", unit: 15 },
  { word: "quiet", ipa: "/ˈkwaɪət/", vietnamesePhonetic: "Quai-ơ-tơ", meaning: "trầm tính/yên lặng", type: "Tính từ", example: "Be quiet in library.", exampleVi: "Hãy giữ yên lặng trong thư viện.", image: "🤫", level: "L3", category: "L3-U15", unit: 15 },
  { word: "noisy", ipa: "/ˈnɔɪzi/", vietnamesePhonetic: "Noi-zi", meaning: "ồn ào", type: "Tính từ", example: "The playground is noisy.", exampleVi: "Sân chơi rất ồn ào.", image: "📢", level: "L3", category: "L3-U15", unit: 15 },

  // --- L4-U11 Mathematics ---
  { word: "addition", ipa: "/əˈdɪʃən/", vietnamesePhonetic: "Ơ-đi-shần", meaning: "phép cộng", type: "Danh từ", example: "Addition is two plus two.", exampleVi: "Phép cộng là hai cộng hai.", image: "➕", level: "L4", category: "L4-U11", unit: 11 },
  { word: "subtraction", ipa: "/səbˈtrækʃən/", vietnamesePhonetic: "Sơ-bơ-tréc-shần", meaning: "phép trừ", type: "Danh từ", example: "Subtraction takes numbers away.", exampleVi: "Phép trừ bớt các con số đi.", image: "➖", level: "L4", category: "L4-U11", unit: 11 },
  { word: "multiplication", ipa: "/ˌmʌltəpləˈkeɪʃən/", vietnamesePhonetic: "Măn-ti-pơ-li-kế-shần", meaning: "phép nhân", type: "Danh từ", example: "Learn your multiplication tables.", exampleVi: "Hãy học thuộc bảng cửu chương phép nhân.", image: "✖️", level: "L4", category: "L4-U11", unit: 11 },
  { word: "division", ipa: "/dɪˈvɪʒən/", vietnamesePhonetic: "Đi-vi-giần", meaning: "phép chia", type: "Danh từ", example: "Division splits into parts.", exampleVi: "Phép chia chia đều thành các phần.", image: "➗", level: "L4", category: "L4-U11", unit: 11 },
  { word: "fraction", ipa: "/ˈfrækʃən/", vietnamesePhonetic: "Pơ-rác-shần", meaning: "phân số", type: "Danh từ", example: "One half is a fraction.", exampleVi: "Một phần hai là phân số.", image: "🧮", level: "L4", category: "L4-U11", unit: 11 },
  { word: "decimal", ipa: "/ˈdɛsəməl/", vietnamesePhonetic: "Đe-si-mần", meaning: "số thập phân", type: "Danh từ", example: "Zero point five is decimal.", exampleVi: "Zero phẩy năm là số thập phân.", image: "🔢", level: "L4", category: "L4-U11", unit: 11 },
  { word: "percentage", ipa: "/pərˈsɛntɪdʒ/", vietnamesePhonetic: "Pơ-sen-ti-giơ", meaning: "phần trăm", type: "Danh từ", example: "100 percentage is full.", exampleVi: "100 phần trăm là trọn vẹn.", image: "📊", level: "L4", category: "L4-U11", unit: 11 },
  { word: "equation", ipa: "/ɪˈkweɪʒən/", vietnamesePhonetic: "I-quê-giần", meaning: "phương trình", type: "Danh từ", example: "Solve math equation.", exampleVi: "Giải phương trình toán học.", image: "📐", level: "L4", category: "L4-U11", unit: 11 },
  { word: "graph", ipa: "/ɡræf/", vietnamesePhonetic: "Gơ-rép-phơ", meaning: "biểu đồ", type: "Danh từ", example: "Look at line graph.", exampleVi: "Hãy nhìn vào biểu đồ đường.", image: "📉", level: "L4", category: "L4-U11", unit: 11 },
  { word: "measurement", ipa: "/ˈmɛʒərmənt/", vietnamesePhonetic: "Me-giơ-mần-tơ", meaning: "sự đo lường", type: "Danh từ", example: "Use ruler for measurement.", exampleVi: "Dùng thước kẻ để đo lường.", image: "📏", level: "L4", category: "L4-U11", unit: 11 },

  // --- L4-U12 The Human Body Inside ---
  { word: "cell", ipa: "/sɛl/", vietnamesePhonetic: "Se-lơ", meaning: "tế bào", type: "Danh từ", example: "Cells are tiny life units.", exampleVi: "Tế bào là đơn vị sống tí hon.", image: "🧬", level: "L4", category: "L4-U12", unit: 12 },
  { word: "organ", ipa: "/ˈɔːrɡən/", vietnamesePhonetic: "Ó-gần", meaning: "cơ quan cơ thể", type: "Danh từ", example: "The heart is an organ.", exampleVi: "Trái tim là một cơ quan cơ thể.", image: "🫀", level: "L4", category: "L4-U12", unit: 12 },
  { word: "tissue", ipa: "/ˈtɪʃuː/", vietnamesePhonetic: "Ti-siu", meaning: "mô cơ thể", type: "Danh từ", example: "Cells build muscle tissue.", exampleVi: "Các tế bào xây dựng nên mô cơ.", image: "🔬", level: "L4", category: "L4-U12", unit: 12 },
  { word: "bone", ipa: "/boʊn/", vietnamesePhonetic: "Bôn-nơ", meaning: "xương", type: "Danh từ", example: "Calcium keeps bones strong.", exampleVi: "Can-xi giúp xương chắc khỏe.", image: "🦴", level: "L4", category: "L4-U12", unit: 12 },
  { word: "muscle", ipa: "/ˈmʌsəl/", vietnamesePhonetic: "Mắc-sồ", meaning: "cơ bắp", type: "Danh từ", example: "Exercise builds muscle.", exampleVi: "Tập thể dục giúp phát triển cơ bắp.", image: "🦾", level: "L4", category: "L4-U12", unit: 12 },
  { word: "blood", ipa: "/blʌd/", vietnamesePhonetic: "Bơ-lất-đơ", meaning: "máu", type: "Danh từ", example: "Heart pumps blood.", exampleVi: "Trái tim bơm máu đi khắp cơ thể.", image: "🩸", level: "L4", category: "L4-U12", unit: 12 },
  { word: "heart", ipa: "/hɑːrt/", vietnamesePhonetic: "Hát-tơ", meaning: "trái tim", type: "Danh từ", example: "Your heart beats constantly.", exampleVi: "Trái tim bạn đập liên tục.", image: "🫀", level: "L4", category: "L4-U12", unit: 12 },
  { word: "brain", ipa: "/breɪn/", vietnamesePhonetic: "Bơ-ren", meaning: "bộ não", type: "Danh từ", example: "The brain controls thinking.", exampleVi: "Bộ não điều khiển suy nghĩ.", image: "🧠", level: "L4", category: "L4-U12", unit: 12 },
  { word: "lung", ipa: "/lʌŋ/", vietnamesePhonetic: "Lăng", meaning: "lá phổi", type: "Danh từ", example: "Lungs help us breathe.", exampleVi: "Lá phổi giúp chúng mình hít thở.", image: "🫁", level: "L4", category: "L4-U12", unit: 12 },
  { word: "stomach", ipa: "/ˈstʌmək/", vietnamesePhonetic: "Sơ-tăm-mắc", meaning: "dạ dày/bụng", type: "Danh từ", example: "Food digests in stomach.", exampleVi: "Thức ăn tiêu hóa trong dạ dày.", image: "🫄", level: "L4", category: "L4-U12", unit: 12 },

  // --- L4-U13 Chemistry Basics ---
  { word: "atom", ipa: "/ˈætəm/", vietnamesePhonetic: "É-tầm", meaning: "nguyên tử", type: "Danh từ", example: "An atom is very small.", exampleVi: "Nguyên tử rất nhỏ bé.", image: "⚛️", level: "L4", category: "L4-U13", unit: 13 },
  { word: "molecule", ipa: "/ˈmɑːlɪkjuːl/", vietnamesePhonetic: "Mo-li-kiu-lơ", meaning: "phân tử", type: "Danh từ", example: "Atoms join to make molecule.", exampleVi: "Các nguyên tử kết hợp thành phân tử.", image: "🧬", level: "L4", category: "L4-U13", unit: 13 },
  { word: "element", ipa: "/ˈɛləmənt/", vietnamesePhonetic: "E-lơ-mần-tơ", meaning: "nguyên tố hóa học", type: "Danh từ", example: "Oxygen is an element.", exampleVi: "Oxy là một nguyên tố hóa học.", image: "🧪", level: "L4", category: "L4-U13", unit: 13 },
  { word: "compound", ipa: "/ˈkɑːmpaʊnd/", vietnamesePhonetic: "Com-pao-nđơ", meaning: "hợp chất", type: "Danh từ", example: "Water is a chemical compound.", exampleVi: "Nước là một hợp chất hóa học.", image: "⚗️", level: "L4", category: "L4-U13", unit: 13 },
  { word: "acid", ipa: "/ˈæsəd/", vietnamesePhonetic: "É-sít-đơ", meaning: "a-xít", type: "Danh từ", example: "Lemons contain citric acid.", exampleVi: "Quả chanh chứa a-xít xí-trích.", image: "🧪", level: "L4", category: "L4-U13", unit: 13 },
  { word: "base", ipa: "/beɪs/", vietnamesePhonetic: "Bê-sơ", meaning: "ba-zơ", type: "Danh từ", example: "Soap is a basic liquid.", exampleVi: "Xà phòng là dung dịch ba-zơ.", image: "🧪", level: "L4", category: "L4-U13", unit: 13 },
  { word: "reaction", ipa: "/riˈækʃən/", vietnamesePhonetic: "Ri-éc-shần", meaning: "phản ứng hóa học", type: "Danh từ", example: "Mixing colors creates reaction.", exampleVi: "Pha trộn màu sắc tạo ra phản ứng.", image: "💥", level: "L4", category: "L4-U13", unit: 13 },
  { word: "temperature", ipa: "/ˈtɛmprətʃər/", vietnamesePhonetic: "Tem-pơ-ra-chơ", meaning: "nhiệt độ", type: "Danh từ", example: "Check water temperature.", exampleVi: "Kiểm tra nhiệt độ của nước.", image: "🌡️", level: "L4", category: "L4-U13", unit: 13 },
  { word: "laboratory", ipa: "/ˈlæbrətɔːri/", vietnamesePhonetic: "Le-bo-ra-to-ri", meaning: "phòng thí nghiệm", type: "Danh từ", example: "Scientists work in laboratory.", exampleVi: "Các nhà khoa học làm việc trong phòng thí nghiệm.", image: "🔬", level: "L4", category: "L4-U13", unit: 13 },
  { word: "chemical", ipa: "/ˈkɛmɪkəl/", vietnamesePhonetic: "Kem-mi-cồ", meaning: "hóa chất", type: "Danh từ", example: "Store chemicals safely.", exampleVi: "Cất giữ hóa chất an toàn.", image: "🧪", level: "L4", category: "L4-U13", unit: 13 },

  // --- L4-U14 Art & Design ---
  { word: "canvas", ipa: "/ˈkænvəs/", vietnamesePhonetic: "Căn-vớt-sơ", meaning: "khung tranh canvas", type: "Danh từ", example: "Paint picture on canvas.", exampleVi: "Vẽ bức tranh lên khung canvas.", image: "🖼️", level: "L4", category: "L4-U14", unit: 14 },
  { word: "brush", ipa: "/brʌʃ/", vietnamesePhonetic: "Bơ-rắt-shơ", meaning: "cọ vẽ", type: "Danh từ", example: "Dip brush into paint.", exampleVi: "Chúng mình nhúng cọ vẽ vào màu.", image: "🖌️", level: "L4", category: "L4-U14", unit: 14 },
  { word: "palette", ipa: "/ˈpælət/", vietnamesePhonetic: "Pe-lợt-tơ", meaning: "bảng màu", type: "Danh từ", example: "Mix colors on palette.", exampleVi: "Pha trộn màu sắc trên bảng màu.", image: "🎨", level: "L4", category: "L4-U14", unit: 14 },
  { word: "sketch", ipa: "/skɛtʃ/", vietnamesePhonetic: "Sơ-kết-chơ", meaning: "bản phác thảo", type: "Danh từ", example: "Draw a pencil sketch.", exampleVi: "Vẽ một bản phác thảo bằng bút chì.", image: "✏️", level: "L4", category: "L4-U14", unit: 14 },
  { word: "portrait", ipa: "/ˈpɔːrtrət/", vietnamesePhonetic: "Por-trơ-tơ", meaning: "chân dung", type: "Danh từ", example: "This portrait looks beautiful.", exampleVi: "Bức chân dung này trông thật đẹp.", image: "🖼️", level: "L4", category: "L4-U14", unit: 14 },
  { word: "landscape", ipa: "/ˈlændskeɪp/", vietnamesePhonetic: "Len-đơ-sơ-kếp", meaning: "tranh phong cảnh", type: "Danh từ", example: "Paint a mountain landscape.", exampleVi: "Vẽ một bức tranh phong cảnh núi rừng.", image: "🌄", level: "L4", category: "L4-U14", unit: 14 },
  { word: "sculpture", ipa: "/ˈskʌlptʃər/", vietnamesePhonetic: "Sơ-cắp-chơ", meaning: "tượng điêu khắc", type: "Danh từ", example: "See marble sculpture in museum.", exampleVi: "Ngắm nhìn tượng điêu khắc cẩm thạch trong bảo tàng.", image: "🗿", level: "L4", category: "L4-U14", unit: 14 },
  { word: "gallery", ipa: "/ˈɡæləri/", vietnamesePhonetic: "Ge-lơ-ri", meaning: "phòng triển lãm", type: "Danh từ", example: "Visit local art gallery.", exampleVi: "Ghé thăm phòng triển lãm nghệ thuật địa phương.", image: "🏛️", level: "L4", category: "L4-U14", unit: 14 },
  { word: "pattern", ipa: "/ˈpætərn/", vietnamesePhonetic: "Pét-tơn", meaning: "họa tiết/hoa văn", type: "Danh từ", example: "This rug has star pattern.", exampleVi: "Tấm thảm này có hoa văn hình ngôi sao.", image: "🏁", level: "L4", category: "L4-U14", unit: 14 },
  { word: "texture", ipa: "/ˈtɛkstʃər/", vietnamesePhonetic: "Tếch-stơ-chơ", meaning: "kết cấu bề mặt", type: "Danh từ", example: "Feel smooth texture of wood.", exampleVi: "Cảm nhận kết cấu mịn màng của gỗ.", image: "🧱", level: "L4", category: "L4-U14", unit: 14 },

  // --- L4-U15 Society & Citizenship ---
  { word: "citizen", ipa: "/ˈsɪtɪzən/", vietnamesePhonetic: "Si-ti-zần", meaning: "người công dân", type: "Danh từ", example: "Be a good citizen.", exampleVi: "Hãy là một người công dân tốt.", image: "🧑‍🤝‍🧑", level: "L4", category: "L4-U15", unit: 15 },
  { word: "community", ipa: "/kəˈmjuːnəti/", vietnamesePhonetic: "Cơm-miu-nơ-ti", meaning: "cộng đồng", type: "Danh từ", example: "We help our community.", exampleVi: "Chúng mình giúp đỡ cộng đồng.", image: "👥", level: "L4", category: "L4-U15", unit: 15 },
  { word: "law", ipa: "/lɔː/", vietnamesePhonetic: "Lo-o", meaning: "luật pháp", type: "Danh từ", example: "Obey safety law.", exampleVi: "Tuân thủ luật pháp an toàn.", image: "⚖️", level: "L4", category: "L4-U15", unit: 15 },
  { word: "rule", ipa: "/ruːl/", vietnamesePhonetic: "Ru-lơ", meaning: "quy tắc", type: "Danh từ", example: "Follow school rules.", exampleVi: "Thực hiện theo các quy tắc trường học.", image: "📜", level: "L4", category: "L4-U15", unit: 15 },
  { word: "responsibility", ipa: "/rɪˌspɑːnsəˈbɪləti/", vietnamesePhonetic: "Ri-sơ-pon-si-bi-li-ti", meaning: "trách nhiệm", type: "Danh từ", example: "Cleaning room is my responsibility.", exampleVi: "Dọn dẹp phòng là trách nhiệm của bé.", image: "🤝", level: "L4", category: "L4-U15", unit: 15 },
  { word: "right", ipa: "/raɪt/", vietnamesePhonetic: "Rai-tơ", meaning: "quyền lợi", type: "Danh từ", example: "Children have right to learn.", exampleVi: "Trẻ em có quyền được đi học.", image: "🛡️", level: "L4", category: "L4-U15", unit: 15 },
  { word: "equality", ipa: "/ɪˈkwɑːləti/", vietnamesePhonetic: "I-quó-li-ti", meaning: "sự bình đẳng", type: "Danh từ", example: "Treat everyone with equality.", exampleVi: "Đối xử với mọi người bằng sự bình đẳng.", image: "⚖️", level: "L4", category: "L4-U15", unit: 15 },
  { word: "respect", ipa: "/rɪˈspɛkt/", vietnamesePhonetic: "Ri-sơ-pếch-tơ", meaning: "sự tôn trọng", type: "Danh từ", example: "Show respect to elders.", exampleVi: "Thể hiện sự tôn trọng với người lớn tuổi.", image: "🙇", level: "L4", category: "L4-U15", unit: 15 },
  { word: "volunteer", ipa: "/ˌvɑːlənˈtɪr/", vietnamesePhonetic: "Von-lần-ti-ơ", meaning: "tình nguyện viên", type: "Danh từ", example: "Volunteers plant new trees.", exampleVi: "Các tình nguyện viên trồng thêm cây mới.", image: "🤲", level: "L4", category: "L4-U15", unit: 15 },
  { word: "government", ipa: "/ˈɡʌvərnmənt/", vietnamesePhonetic: "Gă-vơn-mần-tơ", meaning: "chính phủ", type: "Danh từ", example: "The government serves citizens.", exampleVi: "Chính phủ phục vụ người dân.", image: "🏛️", level: "L4", category: "L4-U15", unit: 15 }
];

// Helper mapping vietnamesePhonetic for existing items if missing
const phoneticGuideMap = {
  // Colors
  "red": "Rét", "blue": "Bờ-lu", "yellow": "Dét-lô", "green": "Gờ-rin", "orange": "Ó-rin-jơ", "purple": "Pơ-pồ", "pink": "Pinh-kơ", "black": "Bơ-lắc", "white": "Quai-tơ", "brown": "Bơ-rao",
  // Numbers
  "one": "Oăn", "two": "Tu", "three": "Tờ-ri", "four": "Pho", "five": "Phai-vơ", "six": "Sích-sơ", "seven": "Se-vần", "eight": "Eit-tơ", "nine": "Nain", "ten": "Ten",
  // Shapes
  "circle": "Sơ-cồ", "square": "Sờ-que", "triangle": "Tờ-rai-eng-gồ", "rectangle": "Réc-teng-gồ", "star": "Sờ-ta", "heart": "Hát-tơ", "oval": "Ô-vần", "diamond": "Đai-mần", "line": "Lai-nơ", "dot": "Đót-tơ",
  // Family
  "mother": "Mó-đơ", "father": "Pha-đơ", "sister": "Sít-stơ", "brother": "Bơ-ra-đơ", "grandmother": "Gơ-ren-mó-đơ", "grandfather": "Gơ-ren-pha-đơ", "baby": "Bê-bi", "family": "Phem-mi-li", "aunt": "Ent-tơ", "uncle": "Ăng-cồ",
  // Body
  "head": "Hét-đơ", "hair": "He-ơ", "eye": "Ai", "ear": "I-ơ", "nose": "Nâu-zơ", "mouth": "Mau-thơ", "hand": "Hen-đơ", "arm": "Am-mơ", "leg": "Léc-gơ", "foot": "Phút-tơ",
  // Animals
  "cat": "Cát-tơ", "dog": "Đót-gơ", "bird": "Bớt-đơ", "fish": "Phít-shơ", "rabbit": "Rép-bít", "duck": "Đắc-kơ", "cow": "Cao", "pig": "Píc-gơ", "horse": "Hót-sơ", "sheep": "Síp-pơ",
  // Food
  "apple": "Ép-pồ", "banana": "Bờ-na-na", "orange": "Ó-rin-jơ", "rice": "Rai-sơ", "bread": "Bơ-rét", "milk": "Miu-kơ", "egg": "Éc-gơ", "cake": "Cếch-kơ", "water": "Quót-tơ", "juice": "Giút-sơ",
  // Classroom
  "book": "Búc-kơ", "pen": "Pen", "pencil": "Pên-sần", "ruler": "Rú-lơ", "eraser": "I-rai-sơ", "bag": "Béc-gơ", "chair": "Che-ơ", "table": "Tê-bồ", "door": "Đo-ơ", "window": "Quin-đâu",
  // Actions
  "run": "Răn", "jump": "Giăm-pơ", "walk": "Quốc-kơ", "sit": "Sít-tơ", "stand": "Sten-đơ", "clap": "Cơ-lép", "sing": "Sinh", "dance": "Đen-sơ", "eat": "Ít-tơ", "drink": "Đơ-rinh-kơ",
  // Feelings
  "happy": "Hép-pi", "sad": "Sét-đơ", "angry": "Eng-gơ-ri", "scared": "Sơ-ke-đơ", "tired": "Tai-ơ-đơ", "hungry": "Hăng-gơ-ri", "thirsty": "Thớt-stơ-ti", "excited": "Ích-sai-tịt", "calm": "Cam-mơ", "sleepy": "Sơ-li-pi"
};

// Process existing DB items to ensure vietnamesePhonetic and sentence structure
const processedOldDb = OldDb.map(item => {
  const phonetic = item.vietnamesePhonetic || phoneticGuideMap[item.word.toLowerCase()] || (item.word.charAt(0).toUpperCase() + item.word.slice(1));
  return {
    id: item.id,
    word: item.word,
    ipa: item.ipa || item.pronunciation || "",
    vietnamesePhonetic: phonetic,
    meaning: item.meaning || item.vietnamese || "",
    type: item.type || "Danh từ",
    example: item.example || item.sentence || `This is a ${item.word}.`,
    exampleVi: item.exampleVi || item.sentenceVi || `Đây là ${item.meaning || item.word}.`,
    image: item.image || "🌟",
    level: item.level || "L1",
    category: item.category || "L1-U01",
    unit: parseInt((item.category || "U01").split('U')[1] || "1", 10)
  };
});

// Format new extra words into the database shape
const formattedExtraDb = extraWords.map((item, idx) => {
  return {
    id: `vocab-${item.level}-${item.category}-W${String(idx + 1).padStart(2, '0')}`,
    word: item.word,
    ipa: item.ipa,
    vietnamesePhonetic: item.vietnamesePhonetic,
    meaning: item.meaning,
    type: item.type,
    example: item.example,
    exampleVi: item.exampleVi,
    image: item.image,
    level: item.level,
    category: item.category,
    unit: item.unit
  };
});

const FINAL_600_DB = [...processedOldDb, ...formattedExtraDb];

console.log("Total compiled items:", FINAL_600_DB.length);

const fileContent = `// Official 600 Core & Expanded English Vocabulary Database for Kids (4 Levels • 60 Units • 600 Words • Exact Icons • Vietnamese Phonetics • Bilingual Examples)

export const COURSE_LEVELS = ${JSON.stringify(COURSE_LEVELS, null, 2)};

export const VOCAB_CATEGORIES = ${JSON.stringify(VOCAB_CATEGORIES, null, 2)};

export const VOCABULARY_DATABASE = ${JSON.stringify(FINAL_600_DB, null, 2)};

export default VOCABULARY_DATABASE;
`;

fs.writeFileSync('d:/TÀI LIỆU HỌC CODE/lich-sinh-hoat-react-node-tailwind/client/src/constants/kidsVocabularyDatabase.js', fileContent, 'utf8');
console.log('Successfully written 600 items to kidsVocabularyDatabase.js!');
