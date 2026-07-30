const fs = require('fs');
const path = require('path');

const COURSE_LEVELS = [
  {
    id: 'L1',
    name: 'Cấp độ L1: Khởi Động (4–5 tuổi)',
    badge: 'Khởi Động • 100 Từ',
    color: 'from-amber-500 to-orange-500 border-amber-400 text-amber-300',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Từ đơn, câu 2–4 từ. Nhận biết màu sắc, số đếm 1-10, hình dạng, gia đình, động vật, thức ăn, lớp học, động từ & cảm xúc.',
    icon: '🐥',
    targetWords: 100,
  },
  {
    id: 'L2',
    name: 'Cấp độ L2: Cơ Bản (5–6 tuổi)',
    badge: 'Cơ Bản • 100 Từ Mới',
    color: 'from-blue-500 to-cyan-500 border-blue-400 text-blue-300',
    bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Câu 3–6 từ. Ngôi nhà, quần áo, sinh hoạt hằng ngày, thời tiết, giao thông, địa điểm, nghề nghiệp, trái cây & thể thao.',
    icon: '🦁',
    targetWords: 100,
  },
  {
    id: 'L3',
    name: 'Cấp độ L3: Mở Rộng (6–7 tuổi)',
    badge: 'Mở Rộng • 100 Từ Mới',
    color: 'from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Câu hoàn chỉnh, hỏi đáp. Thiên nhiên, sức khỏe, mua sắm, du lịch, công nghệ, sở thích, cộng đồng, lễ hội & bảo vệ Trái Đất.',
    icon: '🚀',
    targetWords: 100,
  },
  {
    id: 'L4',
    name: 'Cấp độ L4: Nâng Cao (7–8 tuổi)',
    badge: 'Nâng Cao • 100 Từ Mới',
    color: 'from-purple-500 to-pink-500 border-purple-400 text-purple-300',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Giải thích, kể chuyện, học thuật. Khoa học cơ bản, không gian, giao tiếp, giải quyết vấn đề, an toàn số & mục tiêu trưởng thành.',
    icon: '👑',
    targetWords: 100,
  }
];

// 40 Units structured cleanly across 4 levels
const VOCAB_CATEGORIES = [
  { id: 'all', name: 'Tất Cả 4 Cấp Độ & 40 Chủ Đề (400 Từ Cốt Lõi)', icon: '🌈' },

  // L1 Units
  { id: 'L1-U01', name: 'L1 • 01. Màu sắc (Colors)', icon: '🎨', level: 'L1' },
  { id: 'L1-U02', name: 'L1 • 02. Số đếm 1–10 (Numbers 1-10)', icon: '🔢', level: 'L1' },
  { id: 'L1-U03', name: 'L1 • 03. Hình dạng (Shapes)', icon: '📐', level: 'L1' },
  { id: 'L1-U04', name: 'L1 • 04. Gia đình của bé (My Family)', icon: '👨‍👩‍👧‍👦', level: 'L1' },
  { id: 'L1-U05', name: 'L1 • 05. Cơ thể của bé (My Body)', icon: '👁️', level: 'L1' },
  { id: 'L1-U06', name: 'L1 • 06. Động vật quen thuộc (Animals)', icon: '🐱', level: 'L1' },
  { id: 'L1-U07', name: 'L1 • 07. Đồ ăn và thức uống (Food & Drinks)', icon: '🍱', level: 'L1' },
  { id: 'L1-U08', name: 'L1 • 08. Lớp học của bé (My Classroom)', icon: '🏫', level: 'L1' },
  { id: 'L1-U09', name: 'L1 • 09. Động từ hành động (Action Words)', icon: '🏃', level: 'L1' },
  { id: 'L1-U10', name: 'L1 • 10. Cảm xúc cơ bản (Feelings)', icon: '😊', level: 'L1' },

  // L2 Units
  { id: 'L2-U01', name: 'L2 • 01. Ngôi nhà (My Home)', icon: '🏠', level: 'L2' },
  { id: 'L2-U02', name: 'L2 • 02. Quần áo (Clothes)', icon: '👕', level: 'L2' },
  { id: 'L2-U03', name: 'L2 • 03. Sinh hoạt hằng ngày (Daily Routine)', icon: '⏰', level: 'L2' },
  { id: 'L2-U04', name: 'L2 • 04. Thời tiết (Weather)', icon: '🌤️', level: 'L2' },
  { id: 'L2-U05', name: 'L2 • 05. Phương tiện giao thông (Transportation)', icon: '🚗', level: 'L2' },
  { id: 'L2-U06', name: 'L2 • 06. Địa điểm trong thành phố (Places in Town)', icon: '🏙️', level: 'L2' },
  { id: 'L2-U07', name: 'L2 • 07. Nghề nghiệp (Jobs)', icon: '👷', level: 'L2' },
  { id: 'L2-U08', name: 'L2 • 08. Trái cây và rau củ (Fruits & Vegetables)', icon: '🍎', level: 'L2' },
  { id: 'L2-U09', name: 'L2 • 09. Thời gian và lịch (Time & Calendar)', icon: '📅', level: 'L2' },
  { id: 'L2-U10', name: 'L2 • 10. Thể thao (Sports)', icon: '⚽', level: 'L2' },

  // L3 Units
  { id: 'L3-U01', name: 'L3 • 01. Thiên nhiên (Nature)', icon: '🌿', level: 'L3' },
  { id: 'L3-U02', name: 'L3 • 02. Sức khỏe (Health)', icon: '🩺', level: 'L3' },
  { id: 'L3-U03', name: 'L3 • 03. Mua sắm (Shopping)', icon: '🛒', level: 'L3' },
  { id: 'L3-U04', name: 'L3 • 04. Du lịch (Travel)', icon: '✈️', level: 'L3' },
  { id: 'L3-U05', name: 'L3 • 05. Công nghệ (Technology)', icon: '💻', level: 'L3' },
  { id: 'L3-U06', name: 'L3 • 06. Sở thích (Hobbies)', icon: '🎨', level: 'L3' },
  { id: 'L3-U07', name: 'L3 • 07. Cộng đồng quanh bé (My Community)', icon: '🤝', level: 'L3' },
  { id: 'L3-U08', name: 'L3 • 08. Lễ hội và tiệc (Festivals & Parties)', icon: '🎉', level: 'L3' },
  { id: 'L3-U09', name: 'L3 • 09. Tính cách (Personality)', icon: '🌟', level: 'L3' },
  { id: 'L3-U10', name: 'L3 • 10. Bảo vệ Trái Đất (Protect the Earth)', icon: '🌍', level: 'L3' },

  // L4 Units
  { id: 'L4-U01', name: 'L4 • 01. Khoa học cơ bản (Science Basics)', icon: '🔬', level: 'L4' },
  { id: 'L4-U02', name: 'L4 • 02. Không gian (Space)', icon: '🚀', level: 'L4' },
  { id: 'L4-U03', name: 'L4 • 03. Từ học thuật cơ bản (Learning Words)', icon: '📚', level: 'L4' },
  { id: 'L4-U04', name: 'L4 • 04. Giao tiếp (Communication)', icon: '💬', level: 'L4' },
  { id: 'L4-U05', name: 'L4 • 05. Giải quyết vấn đề (Problem Solving)', icon: '🧩', level: 'L4' },
  { id: 'L4-U06', name: 'L4 • 06. Cảm xúc nâng cao (Complex Feelings)', icon: '🧠', level: 'L4' },
  { id: 'L4-U07', name: 'L4 • 07. Quốc gia và văn hóa (Countries & Culture)', icon: '🌐', level: 'L4' },
  { id: 'L4-U08', name: 'L4 • 08. An toàn số (Digital Safety)', icon: '🛡️', level: 'L4' },
  { id: 'L4-U09', name: 'L4 • 09. Kể chuyện (Storytelling)', icon: '📖', level: 'L4' },
  { id: 'L4-U10', name: 'L4 • 10. Mục tiêu và trưởng thành (Goals & Growth)', icon: '🎯', level: 'L4' }
];

// Raw curriculum data for 400 words
const rawData = [
  // L1 • UNIT 01: Colors
  ['L1', 'L1-U01', 'red', '/rˈɛd/', 'màu đỏ', '🔴', 'The balloon is red.', 'Quả bóng bay có màu đỏ.'],
  ['L1', 'L1-U01', 'blue', '/blˈu/', 'màu xanh dương', '🔵', 'The balloon is blue.', 'Quả bóng bay có màu xanh dương.'],
  ['L1', 'L1-U01', 'yellow', '/jˈɛloʊ/', 'màu vàng', '🟡', 'The balloon is yellow.', 'Quả bóng bay có màu vàng.'],
  ['L1', 'L1-U01', 'green', '/ɡrˈin/', 'màu xanh lá', '🟢', 'The balloon is green.', 'Quả bóng bay có màu xanh lá.'],
  ['L1', 'L1-U01', 'orange', '/ˈɔrəndʒ/', 'màu cam', '🟠', 'The balloon is orange.', 'Quả bóng bay có màu cam.'],
  ['L1', 'L1-U01', 'purple', '/pˈɝpəl/', 'màu tím', '🟣', 'The balloon is purple.', 'Quả bóng bay có màu tím.'],
  ['L1', 'L1-U01', 'pink', '/pˈɪŋk/', 'màu hồng', '🌸', 'The balloon is pink.', 'Quả bóng bay có màu hồng.'],
  ['L1', 'L1-U01', 'black', '/blˈæk/', 'màu đen', '🖤', 'The balloon is black.', 'Quả bóng bay có màu đen.'],
  ['L1', 'L1-U01', 'white', '/wˈaɪt/', 'màu trắng', '⚪', 'The balloon is white.', 'Quả bóng bay có màu trắng.'],
  ['L1', 'L1-U01', 'brown', '/brˈaʊn/', 'màu nâu', '🟤', 'The balloon is brown.', 'Quả bóng bay có màu nâu.'],

  // L1 • UNIT 02: Numbers 1–10
  ['L1', 'L1-U02', 'one', '/wˈʌn/', 'một', '1️⃣', 'I can count to one.', 'Bé có thể đếm đến một.'],
  ['L1', 'L1-U02', 'two', '/tˈu/', 'hai', '2️⃣', 'I can count to two.', 'Bé có thể đếm đến hai.'],
  ['L1', 'L1-U02', 'three', '/θrˈi/', 'ba', '3️⃣', 'I can count to three.', 'Bé có thể đếm đến ba.'],
  ['L1', 'L1-U02', 'four', '/fˈɔr/', 'bốn', '4️⃣', 'I can count to four.', 'Bé có thể đếm đến bốn.'],
  ['L1', 'L1-U02', 'five', '/fˈaɪv/', 'năm', '5️⃣', 'I can count to five.', 'Bé có thể đếm đến năm.'],
  ['L1', 'L1-U02', 'six', '/sˈɪks/', 'sáu', '6️⃣', 'I can count to six.', 'Bé có thể đếm đến sáu.'],
  ['L1', 'L1-U02', 'seven', '/sˈɛvən/', 'bảy', '7️⃣', 'I can count to seven.', 'Bé có thể đếm đến bảy.'],
  ['L1', 'L1-U02', 'eight', '/ˈeɪt/', 'tám', '8️⃣', 'I can count to eight.', 'Bé có thể đếm đến tám.'],
  ['L1', 'L1-U02', 'nine', '/nˈaɪn/', 'chín', '9️⃣', 'I can count to nine.', 'Bé có thể đếm đến chín.'],
  ['L1', 'L1-U02', 'ten', '/tˈɛn/', 'mười', '🔟', 'I can count to ten.', 'Bé có thể đếm đến mười.'],

  // L1 • UNIT 03: Shapes
  ['L1', 'L1-U03', 'circle', '/sˈɝkəl/', 'hình tròn', '⭕', 'I can see a circle.', 'Bé nhìn thấy hình tròn.'],
  ['L1', 'L1-U03', 'square', '/skwˈɛr/', 'hình vuông', '⏹️', 'I can see a square.', 'Bé nhìn thấy hình vuông.'],
  ['L1', 'L1-U03', 'triangle', '/trˈaɪˌæŋɡəl/', 'hình tam giác', '🔺', 'I can see a triangle.', 'Bé nhìn thấy hình tam giác.'],
  ['L1', 'L1-U03', 'rectangle', '/rˈɛktæŋɡəl/', 'hình chữ nhật', '▭', 'I can see a rectangle.', 'Bé nhìn thấy hình chữ nhật.'],
  ['L1', 'L1-U03', 'star', '/stˈɑr/', 'hình ngôi sao', '⭐', 'I can see a star.', 'Bé nhìn thấy hình ngôi sao.'],
  ['L1', 'L1-U03', 'heart', '/hˈɑrt/', 'hình trái tim', '❤️', 'I can see a heart.', 'Bé nhìn thấy hình trái tim.'],
  ['L1', 'L1-U03', 'oval', '/ˈoʊvəl/', 'hình bầu dục', '🥚', 'I can see an oval.', 'Bé nhìn thấy hình bầu dục.'],
  ['L1', 'L1-U03', 'diamond', '/dˈaɪmənd/', 'hình thoi', '🔷', 'I can see a diamond.', 'Bé nhìn thấy hình thoi.'],
  ['L1', 'L1-U03', 'line', '/lˈaɪn/', 'đường thẳng', '➖', 'I can see a line.', 'Bé nhìn thấy đường thẳng.'],
  ['L1', 'L1-U03', 'dot', '/dˈɑt/', 'dấu chấm', '⏺️', 'I can see a dot.', 'Bé nhìn thấy dấu chấm.'],

  // L1 • UNIT 04: My Family
  ['L1', 'L1-U04', 'mother', '/mˈʌðɚ/', 'mẹ', '👩', 'This is my mother.', 'Đây là mẹ của bé.'],
  ['L1', 'L1-U04', 'father', '/fˈɑðɚ/', 'bố/cha', '👨', 'This is my father.', 'Đây là bố/cha của bé.'],
  ['L1', 'L1-U04', 'sister', '/sˈɪstɚ/', 'chị/em gái', '👧', 'This is my sister.', 'Đây là chị/em gái của bé.'],
  ['L1', 'L1-U04', 'brother', '/brˈʌðɚ/', 'anh/em trai', '👦', 'This is my brother.', 'Đây là anh/em trai của bé.'],
  ['L1', 'L1-U04', 'grandmother', '/ɡrˈændmˌʌðɚ/', 'bà', '👵', 'This is my grandmother.', 'Đây là bà của bé.'],
  ['L1', 'L1-U04', 'grandfather', '/ɡrˈændfˌɑðɚ/', 'ông', '👴', 'This is my grandfather.', 'Đây là ông của bé.'],
  ['L1', 'L1-U04', 'baby', '/bˈeɪbi/', 'em bé', '👶', 'This is my baby.', 'Đây là em bé của bé.'],
  ['L1', 'L1-U04', 'family', '/fˈæməli/', 'gia đình', '👨‍👩‍👧‍👦', 'This is my family.', 'Đây là gia đình của bé.'],
  ['L1', 'L1-U04', 'aunt', '/ˈænt/', 'cô/dì', '👩‍💼', 'This is my aunt.', 'Đây là cô/dì của bé.'],
  ['L1', 'L1-U04', 'uncle', '/ˈʌŋkəl/', 'chú/cậu/bác trai', '👨‍💼', 'This is my uncle.', 'Đây là chú/cậu/bác trai của bé.'],

  // L1 • UNIT 05: My Body
  ['L1', 'L1-U05', 'head', '/hˈɛd/', 'đầu', '🗣️', 'Touch your head.', 'Hãy chạm vào đầu của con.'],
  ['L1', 'L1-U05', 'hair', '/hˈɛr/', 'tóc', '💇', 'Touch your hair.', 'Hãy chạm vào tóc của con.'],
  ['L1', 'L1-U05', 'eye', '/ˈaɪ/', 'mắt', '👁️', 'Touch your eye.', 'Hãy chạm vào mắt của con.'],
  ['L1', 'L1-U05', 'ear', '/ˈir/', 'tai', '👂', 'Touch your ear.', 'Hãy chạm vào tai của con.'],
  ['L1', 'L1-U05', 'nose', '/nˈoʊz/', 'mũi', '👃', 'Touch your nose.', 'Hãy chạm vào mũi của con.'],
  ['L1', 'L1-U05', 'mouth', '/mˈaʊθ/', 'miệng', '👄', 'Touch your mouth.', 'Hãy chạm vào miệng của con.'],
  ['L1', 'L1-U05', 'hand', '/hˈænd/', 'bàn tay', '🤚', 'Touch your hand.', 'Hãy chạm vào bàn tay của con.'],
  ['L1', 'L1-U05', 'arm', '/ˈɑrm/', 'cánh tay', '🦾', 'Touch your arm.', 'Hãy chạm vào cánh tay của con.'],
  ['L1', 'L1-U05', 'leg', '/lˈɛɡ/', 'chân', '🦵', 'Touch your leg.', 'Hãy chạm vào chân của con.'],
  ['L1', 'L1-U05', 'foot', '/fˈʊt/', 'bàn chân', '🦶', 'Touch your foot.', 'Hãy chạm vào bàn chân của con.'],

  // L1 • UNIT 06: Animals
  ['L1', 'L1-U06', 'cat', '/kˈæt/', 'con mèo', '🐱', 'The cat is friendly.', 'Con mèo rất thân thiện.'],
  ['L1', 'L1-U06', 'dog', '/dˈɔɡ/', 'con chó', '🐶', 'The dog is friendly.', 'Con chó rất thân thiện.'],
  ['L1', 'L1-U06', 'bird', '/bˈɝd/', 'con chim', '🐦', 'The bird is friendly.', 'Con chim rất thân thiện.'],
  ['L1', 'L1-U06', 'fish', '/fˈɪʃ/', 'con cá', '🐟', 'The fish is friendly.', 'Con cá rất thân thiện.'],
  ['L1', 'L1-U06', 'rabbit', '/rˈæbət/', 'con thỏ', '🐰', 'The rabbit is friendly.', 'Con thỏ rất thân thiện.'],
  ['L1', 'L1-U06', 'duck', '/dˈʌk/', 'con vịt', '🦆', 'The duck is friendly.', 'Con vịt rất thân thiện.'],
  ['L1', 'L1-U06', 'cow', '/kˈaʊ/', 'con bò', '🐮', 'The cow is friendly.', 'Con bò rất thân thiện.'],
  ['L1', 'L1-U06', 'pig', '/pˈɪɡ/', 'con heo', '🐷', 'The pig is friendly.', 'Con heo rất thân thiện.'],
  ['L1', 'L1-U06', 'horse', '/hˈɔrs/', 'con ngựa', '🐴', 'The horse is friendly.', 'Con ngựa rất thân thiện.'],
  ['L1', 'L1-U06', 'sheep', '/ʃˈip/', 'con cừu', '🐑', 'The sheep is friendly.', 'Con cừu rất thân thiện.'],

  // L1 • UNIT 07: Food and Drinks
  ['L1', 'L1-U07', 'apple', '/ˈæpəl/', 'quả táo', '🍎', 'I like apples.', 'Bé thích quả táo.'],
  ['L1', 'L1-U07', 'banana', '/bənˈænə/', 'quả chuối', '🍌', 'I like bananas.', 'Bé thích quả chuối.'],
  ['L1', 'L1-U07', 'orange_fruit', '/ˈɔrəndʒ/', 'quả cam', '🍊', 'I like oranges.', 'Bé thích quả cam.'],
  ['L1', 'L1-U07', 'rice', '/rˈaɪs/', 'cơm/gạo', '🍚', 'I like rice.', 'Bé thích cơm/gạo.'],
  ['L1', 'L1-U07', 'bread', '/brˈɛd/', 'bánh mì', '🍞', 'I like bread.', 'Bé thích bánh mì.'],
  ['L1', 'L1-U07', 'milk', '/mˈɪlk/', 'sữa', '🥛', 'I like milk.', 'Bé thích sữa.'],
  ['L1', 'L1-U07', 'egg', '/ˈɛɡ/', 'quả trứng', '🥚', 'I like eggs.', 'Bé thích quả trứng.'],
  ['L1', 'L1-U07', 'cake', '/kˈeɪk/', 'bánh ngọt', '🎂', 'I like cakes.', 'Bé thích bánh ngọt.'],
  ['L1', 'L1-U07', 'water', '/wˈɔtɚ/', 'nước', '💧', 'I like water.', 'Bé thích nước.'],
  ['L1', 'L1-U07', 'juice', '/dʒˈus/', 'nước ép', '🧃', 'I like juice.', 'Bé thích nước ép.'],

  // L1 • UNIT 08: My Classroom
  ['L1', 'L1-U08', 'book', '/bˈʊk/', 'quyển sách', '📚', 'This is my book.', 'Đây là quyển sách của bé.'],
  ['L1', 'L1-U08', 'pen', '/pˈɛn/', 'bút mực', '🖊️', 'This is my pen.', 'Đây là bút mực của bé.'],
  ['L1', 'L1-U08', 'pencil', '/pˈɛnsəl/', 'bút chì', '✏️', 'This is my pencil.', 'Đây là bút chì của bé.'],
  ['L1', 'L1-U08', 'ruler', '/rˈulɚ/', 'thước kẻ', '📏', 'This is my ruler.', 'Đây là thước kẻ của bé.'],
  ['L1', 'L1-U08', 'eraser', '/ɪrˈeɪsɚ/', 'cục tẩy', '🧹', 'This is my eraser.', 'Đây là cục tẩy của bé.'],
  ['L1', 'L1-U08', 'bag', '/bˈæɡ/', 'cặp/túi', '🎒', 'This is my bag.', 'Đây là cặp/túi của bé.'],
  ['L1', 'L1-U08', 'chair', '/tʃˈɛr/', 'ghế', '🪑', 'This is my chair.', 'Đây là ghế của bé.'],
  ['L1', 'L1-U08', 'table', '/tˈeɪbəl/', 'bàn', '🪵', 'This is my table.', 'Đây là bàn của bé.'],
  ['L1', 'L1-U08', 'door', '/dˈɔr/', 'cửa ra vào', '🚪', 'This is my door.', 'Đây là cửa ra vào của bé.'],
  ['L1', 'L1-U08', 'window', '/wˈɪndoʊ/', 'cửa sổ', '🪟', 'This is my window.', 'Đây là cửa sổ của bé.'],

  // L1 • UNIT 09: Action Words
  ['L1', 'L1-U09', 'run', '/rˈʌn/', 'chạy', '🏃', 'I can run.', 'Bé có thể chạy.'],
  ['L1', 'L1-U09', 'jump', '/dʒˈʌmp/', 'nhảy', '🦘', 'I can jump.', 'Bé có thể nhảy.'],
  ['L1', 'L1-U09', 'walk', '/wˈɔk/', 'đi bộ', '🚶', 'I can walk.', 'Bé có thể đi bộ.'],
  ['L1', 'L1-U09', 'sit', '/sˈɪt/', 'ngồi', '🪑', 'I can sit.', 'Bé có thể ngồi.'],
  ['L1', 'L1-U09', 'stand', '/stˈænd/', 'đứng', '🧍', 'I can stand.', 'Bé có thể đứng.'],
  ['L1', 'L1-U09', 'clap', '/klˈæp/', 'vỗ tay', '👏', 'I can clap.', 'Bé có thể vỗ tay.'],
  ['L1', 'L1-U09', 'sing', '/sˈɪŋ/', 'hát', '🎤', 'I can sing.', 'Bé có thể hát.'],
  ['L1', 'L1-U09', 'dance', '/dˈæns/', 'nhảy múa', '💃', 'I can dance.', 'Bé có thể nhảy múa.'],
  ['L1', 'L1-U09', 'eat', '/ˈit/', 'ăn', '🍎', 'I can eat.', 'Bé có thể ăn.'],
  ['L1', 'L1-U09', 'drink', '/drˈɪŋk/', 'uống', '🥛', 'I can drink.', 'Bé có thể uống.'],

  // L1 • UNIT 10: Feelings
  ['L1', 'L1-U10', 'happy', '/hˈæpi/', 'vui vẻ', '😊', 'I feel happy.', 'Bé cảm thấy vui vẻ.'],
  ['L1', 'L1-U10', 'sad', '/sˈæd/', 'buồn', '😢', 'I feel sad.', 'Bé cảm thấy buồn.'],
  ['L1', 'L1-U10', 'angry', '/ˈæŋɡri/', 'tức giận', '😡', 'I feel angry.', 'Bé cảm thấy tức giận.'],
  ['L1', 'L1-U10', 'scared', '/skˈɛrd/', 'sợ hãi', '😱', 'I feel scared.', 'Bé cảm thấy sợ hãi.'],
  ['L1', 'L1-U10', 'tired', '/tˈaɪɚd/', 'mệt', '🥱', 'I feel tired.', 'Bé cảm thấy mệt.'],
  ['L1', 'L1-U10', 'hungry', '/hˈʌŋɡri/', 'đói', '🍕', 'I feel hungry.', 'Bé cảm thấy đói.'],
  ['L1', 'L1-U10', 'thirsty', '/θˈɝsti/', 'khát', '🥤', 'I feel thirsty.', 'Bé cảm thấy khát.'],
  ['L1', 'L1-U10', 'excited', '/ɪksˈaɪtəd/', 'hào hứng', '🎉', 'I feel excited.', 'Bé cảm thấy hào hứng.'],
  ['L1', 'L1-U10', 'calm', '/kˈɑm/', 'bình tĩnh', '🧘', 'I feel calm.', 'Bé cảm thấy bình tĩnh.'],
  ['L1', 'L1-U10', 'sleepy', '/slˈipi/', 'buồn ngủ', '🌙', 'I feel sleepy.', 'Bé cảm thấy buồn ngủ.'],

  // L2 • UNIT 01: My Home
  ['L2', 'L2-U01', 'house', '/hˈaʊs/', 'ngôi nhà', '🏠', 'This is the house.', 'Đây là ngôi nhà.'],
  ['L2', 'L2-U01', 'living room', '/lˈɪvɪŋ rˈum/', 'phòng khách', '🛋️', 'This is the living room.', 'Đây là phòng khách.'],
  ['L2', 'L2-U01', 'bedroom', '/bˈɛdrˌum/', 'phòng ngủ', '🛏️', 'This is the bedroom.', 'Đây là phòng ngủ.'],
  ['L2', 'L2-U01', 'kitchen', '/kˈɪtʃən/', 'nhà bếp', '🍳', 'This is the kitchen.', 'Đây là nhà bếp.'],
  ['L2', 'L2-U01', 'bathroom', '/bˈæθrˌum/', 'phòng tắm', '🛁', 'This is the bathroom.', 'Đây là phòng tắm.'],
  ['L2', 'L2-U01', 'garden', '/ɡˈɑrdən/', 'khu vườn', '🏡', 'This is the garden.', 'Đây là khu vườn.'],
  ['L2', 'L2-U01', 'bed', '/bˈɛd/', 'giường', '🛌', 'This is the bed.', 'Đây là giường.'],
  ['L2', 'L2-U01', 'sofa', '/sˈoʊfə/', 'ghế sofa', '🛋️', 'This is the sofa.', 'Đây là ghế sofa.'],
  ['L2', 'L2-U01', 'lamp', '/lˈæmp/', 'đèn', '💡', 'This is the lamp.', 'Đây là đèn.'],
  ['L2', 'L2-U01', 'clock', '/klˈɑk/', 'đồng hồ', '⏰', 'This is the clock.', 'Đây là đồng hồ.'],

  // L2 • UNIT 02: Clothes
  ['L2', 'L2-U02', 'shirt', '/ʃˈɝt/', 'áo sơ mi', '👔', 'I am wearing a shirt.', 'Bé đang mặc áo sơ mi.'],
  ['L2', 'L2-U02', 'T-shirt', '/tˈi-ʃˈɝt/', 'áo thun', '👕', 'I am wearing a T-shirt.', 'Bé đang mặc áo thun.'],
  ['L2', 'L2-U02', 'dress', '/drˈɛs/', 'váy liền', '👗', 'She is wearing a dress.', 'Bạn ấy đang mặc váy liền.'],
  ['L2', 'L2-U02', 'skirt', '/skˈɝt/', 'chân váy', '👗', 'She is wearing a skirt.', 'Bạn ấy đang mặc chân váy.'],
  ['L2', 'L2-U02', 'trousers', '/trˈaʊzɚz/', 'quần dài', '👖', 'I am wearing trousers.', 'Bé đang mặc quần dài.'],
  ['L2', 'L2-U02', 'shorts', '/ʃˈɔrts/', 'quần ngắn', '🩳', 'I am wearing shorts.', 'Bé đang mặc quần ngắn.'],
  ['L2', 'L2-U02', 'shoes', '/ʃˈuz/', 'giày', '👟', 'These are my shoes.', 'Đây là đôi giày của bé.'],
  ['L2', 'L2-U02', 'socks', '/sˈɑks/', 'tất/vớ', '🧦', 'These are my socks.', 'Đây là đôi tất của bé.'],
  ['L2', 'L2-U02', 'hat', '/hˈæt/', 'mũ', '🧢', 'I am wearing a hat.', 'Bé đang đội mũ.'],
  ['L2', 'L2-U02', 'jacket', '/dʒˈækət/', 'áo khoác', '🧥', 'I am wearing a jacket.', 'Bé đang mặc áo khoác.'],

  // L2 • UNIT 03: Daily Routine
  ['L2', 'L2-U03', 'wake up', '/wˈeɪk ˈʌp/', 'thức dậy', '⏰', 'I wake up at seven.', 'Bé thức dậy lúc bảy giờ.'],
  ['L2', 'L2-U03', 'brush', '/brˈʌʃ/', 'chải/đánh', '🪥', 'I brush my teeth every morning.', 'Bé đánh răng mỗi sáng.'],
  ['L2', 'L2-U03', 'wash', '/wˈɑʃ/', 'rửa', '🚰', 'I wash my face every morning.', 'Bé rửa mặt mỗi sáng.'],
  ['L2', 'L2-U03', 'get dressed', '/ɡˈɛt drˈɛst/', 'mặc quần áo', '👕', 'I get dressed after breakfast.', 'Bé mặc quần áo sau bữa sáng.'],
  ['L2', 'L2-U03', 'have breakfast', '/hˈæv brˈɛkfəst/', 'ăn sáng', '🍳', 'I have breakfast with my family.', 'Bé ăn sáng cùng gia đình.'],
  ['L2', 'L2-U03', 'go to school', '/ɡˈoʊ tˈu skˈul/', 'đi học', '🏫', 'I go to school in the morning.', 'Bé đi học vào buổi sáng.'],
  ['L2', 'L2-U03', 'study', '/stˈʌdi/', 'học', '📚', 'I study English after school.', 'Bé học tiếng Anh sau giờ học.'],
  ['L2', 'L2-U03', 'play', '/plˈeɪ/', 'chơi', '⚽', 'I play with my friends.', 'Bé chơi cùng các bạn.'],
  ['L2', 'L2-U03', 'have dinner', '/hˈæv dˈɪnɚ/', 'ăn tối', '🍲', 'I have dinner at home.', 'Bé ăn tối ở nhà.'],
  ['L2', 'L2-U03', 'sleep', '/slˈip/', 'ngủ', '🌙', 'I sleep at night.', 'Bé ngủ vào ban đêm.'],

  // L2 • UNIT 04: Weather
  ['L2', 'L2-U04', 'sunny', '/sˈʌni/', 'có nắng', '☀️', 'It is sunny today.', 'Hôm nay trời có nắng.'],
  ['L2', 'L2-U04', 'rainy', '/rˈeɪni/', 'có mưa', '🌧️', 'It is rainy today.', 'Hôm nay trời có mưa.'],
  ['L2', 'L2-U04', 'cloudy', '/klˈaʊdi/', 'nhiều mây', '☁️', 'It is cloudy today.', 'Hôm nay trời nhiều mây.'],
  ['L2', 'L2-U04', 'windy', '/wˈɪndi/', 'có gió', '🌬️', 'It is windy today.', 'Hôm nay trời có gió.'],
  ['L2', 'L2-U04', 'hot', '/hˈɑt/', 'nóng', '🥵', 'It is hot today.', 'Hôm nay trời nóng.'],
  ['L2', 'L2-U04', 'cold', '/kˈoʊld/', 'lạnh', '🥶', 'It is cold today.', 'Hôm nay trời lạnh.'],
  ['L2', 'L2-U04', 'warm', '/wˈɔrm/', 'ấm', '🌤️', 'It is warm today.', 'Hôm nay trời ấm.'],
  ['L2', 'L2-U04', 'cool', '/kˈul/', 'mát', '🍃', 'It is cool today.', 'Hôm nay trời mát.'],
  ['L2', 'L2-U04', 'storm', '/stˈɔrm/', 'cơn bão', '🌩️', 'I can see a storm.', 'Bé có thể nhìn thấy cơn bão.'],
  ['L2', 'L2-U04', 'rainbow', '/rˈeɪnbˌoʊ/', 'cầu vồng', '🌈', 'I can see a rainbow.', 'Bé có thể nhìn thấy cầu vồng.'],

  // L2 • UNIT 05: Transportation
  ['L2', 'L2-U05', 'bicycle', '/bˈaɪsɪkəl/', 'xe đạp', '🚲', 'I can travel by bicycle.', 'Bé có thể di chuyển bằng xe đạp.'],
  ['L2', 'L2-U05', 'motorbike', '/mˈoʊtɚbˌaɪk/', 'xe máy', '🛵', 'I can travel by motorbike.', 'Bé có thể di chuyển bằng xe máy.'],
  ['L2', 'L2-U05', 'car', '/kˈɑr/', 'ô tô', '🚗', 'I can travel by car.', 'Bé có thể di chuyển bằng ô tô.'],
  ['L2', 'L2-U05', 'bus', '/bˈʌs/', 'xe buýt', '🚌', 'I can travel by bus.', 'Bé có thể di chuyển bằng xe buýt.'],
  ['L2', 'L2-U05', 'train', '/trˈeɪn/', 'tàu hỏa', '🚂', 'I can travel by train.', 'Bé có thể di chuyển bằng tàu hỏa.'],
  ['L2', 'L2-U05', 'plane', '/plˈeɪn/', 'máy bay', '✈️', 'I can travel by plane.', 'Bé có thể di chuyển bằng máy bay.'],
  ['L2', 'L2-U05', 'boat', '/bˈoʊt/', 'thuyền', '⛵', 'I can travel by boat.', 'Bé có thể di chuyển bằng thuyền.'],
  ['L2', 'L2-U05', 'taxi', '/tˈæksi/', 'xe taxi', '🚕', 'I can travel by taxi.', 'Bé có thể di chuyển bằng xe taxi.'],
  ['L2', 'L2-U05', 'truck', '/trˈʌk/', 'xe tải', '🚚', 'I can travel by truck.', 'Bé có thể di chuyển bằng xe tải.'],
  ['L2', 'L2-U05', 'scooter', '/skˈutɚ/', 'xe tay ga/xe trượt', '🛴', 'I can travel by scooter.', 'Bé có thể di chuyển bằng xe tay ga/xe trượt.'],

  // L2 • UNIT 06: Places in Town
  ['L2', 'L2-U06', 'school', '/skˈul/', 'trường học', '🏫', 'We go to school in the morning.', 'Chúng ta đi học vào buổi sáng.'],
  ['L2', 'L2-U06', 'hospital', '/hˈɑspˌɪtəl/', 'bệnh viện', '🏥', 'A doctor works at the hospital.', 'Bác sĩ làm việc tại bệnh viện.'],
  ['L2', 'L2-U06', 'park', '/pˈɑrk/', 'công viên', '🏞️', 'We play in the park.', 'Chúng ta chơi trong công viên.'],
  ['L2', 'L2-U06', 'supermarket', '/sˈupɚmˌɑrkɪt/', 'siêu thị', '🛒', 'We buy food at the supermarket.', 'Chúng ta mua thực phẩm ở siêu thị.'],
  ['L2', 'L2-U06', 'library', '/lˈaɪbrɛrˌi/', 'thư viện', '📖', 'We read books at the library.', 'Chúng ta đọc sách ở thư viện.'],
  ['L2', 'L2-U06', 'zoo', '/zˈu/', 'sở thú', '🦁', 'We can see animals at the zoo.', 'Chúng ta có thể xem động vật ở sở thú.'],
  ['L2', 'L2-U06', 'cinema', '/sˈɪnəmə/', 'rạp chiếu phim', '🎬', 'We watch a movie at the cinema.', 'Chúng ta xem phim ở rạp chiếu phim.'],
  ['L2', 'L2-U06', 'restaurant', '/rˈɛstɚˌɑnt/', 'nhà hàng', '🍽️', 'We eat dinner at the restaurant.', 'Chúng ta ăn tối ở nhà hàng.'],
  ['L2', 'L2-U06', 'bank', '/bˈæŋk/', 'ngân hàng', '🏦', 'People keep money in a bank.', 'Mọi người gửi tiền ở ngân hàng.'],
  ['L2', 'L2-U06', 'post office', '/pˈoʊst ˈɔfɪs/', 'bưu điện', '📮', 'We send a letter at the post office.', 'Chúng ta gửi thư ở bưu điện.'],

  // L2 • UNIT 07: Jobs
  ['L2', 'L2-U07', 'teacher', '/tˈitʃɚ/', 'giáo viên', '🧑‍🏫', 'A teacher helps children learn.', 'Giáo viên giúp trẻ học tập.'],
  ['L2', 'L2-U07', 'doctor', '/dˈɑktɚ/', 'bác sĩ', '🩺', 'A doctor helps sick people.', 'Bác sĩ giúp người bị ốm.'],
  ['L2', 'L2-U07', 'nurse', '/nˈɝs/', 'y tá', '🧑‍⚕️', 'A nurse cares for patients.', 'Y tá chăm sóc bệnh nhân.'],
  ['L2', 'L2-U07', 'police officer', '/pəlˈis ˈɔfəsɚ/', 'cảnh sát', '👮', 'A police officer keeps people safe.', 'Cảnh sát giúp mọi người an toàn.'],
  ['L2', 'L2-U07', 'firefighter', '/fˈaɪrfˌaɪtɚ/', 'lính cứu hỏa', '👨‍🚒', 'A firefighter puts out fires.', 'Lính cứu hỏa dập tắt đám cháy.'],
  ['L2', 'L2-U07', 'farmer', '/fˈɑrmɚ/', 'nông dân', '👨‍🌾', 'A farmer grows food.', 'Nông dân trồng lương thực.'],
  ['L2', 'L2-U07', 'cook', '/kˈʊk/', 'đầu bếp', '👨‍🍳', 'A cook makes delicious food.', 'Đầu bếp nấu món ăn ngon.'],
  ['L2', 'L2-U07', 'driver', '/drˈaɪvɚ/', 'tài xế', '🚘', 'A driver drives a vehicle.', 'Tài xế lái phương tiện.'],
  ['L2', 'L2-U07', 'pilot', '/pˈaɪlət/', 'phi công', '👨‍✈️', 'A pilot flies a plane.', 'Phi công lái máy bay.'],
  ['L2', 'L2-U07', 'artist', '/ˈɑrtəst/', 'họa sĩ/nghệ sĩ', '🎨', 'An artist creates beautiful pictures.', 'Họa sĩ tạo ra những bức tranh đẹp.'],

  // L2 • UNIT 08: Fruits and Vegetables
  ['L2', 'L2-U08', 'mango', '/mˈæŋɡoʊ/', 'quả xoài', '🥭', 'I like mangoes.', 'Bé thích quả xoài.'],
  ['L2', 'L2-U08', 'grape', '/ɡrˈeɪp/', 'quả nho', '🍇', 'I like grapes.', 'Bé thích quả nho.'],
  ['L2', 'L2-U08', 'watermelon', '/wˈɔtɚmˌɛlən/', 'dưa hấu', '🍉', 'I like watermelons.', 'Bé thích dưa hấu.'],
  ['L2', 'L2-U08', 'strawberry', '/strˈɔbˌɛri/', 'dâu tây', '🍓', 'I like strawberries.', 'Bé thích dâu tây.'],
  ['L2', 'L2-U08', 'pineapple', '/pˈaɪnˌæpəl/', 'quả dứa/thơm', '🍍', 'I like pineapples.', 'Bé thích quả dứa/thơm.'],
  ['L2', 'L2-U08', 'carrot', '/kˈærət/', 'cà rốt', '🥕', 'I like carrots.', 'Bé thích cà rốt.'],
  ['L2', 'L2-U08', 'tomato', '/təmˈeɪtˌoʊ/', 'cà chua', '🍅', 'I like tomatoes.', 'Bé thích cà chua.'],
  ['L2', 'L2-U08', 'potato', '/pətˈeɪtˌoʊ/', 'khoai tây', '🥔', 'I like potatoes.', 'Bé thích khoai tây.'],
  ['L2', 'L2-U08', 'corn', '/kˈɔrn/', 'bắp/ngô', '🌽', 'I like corn.', 'Bé thích bắp/ngô.'],
  ['L2', 'L2-U08', 'cucumber', '/kjˈukəmbɚ/', 'dưa leo', '🥒', 'I like cucumbers.', 'Bé thích dưa leo.'],

  // L2 • UNIT 09: Time and Calendar
  ['L2', 'L2-U09', 'morning', '/mˈɔrnɪŋ/', 'buổi sáng', '🌅', 'I eat breakfast in the morning.', 'Bé ăn sáng vào buổi sáng.'],
  ['L2', 'L2-U09', 'afternoon', '/ˌæftɚnˈun/', 'buổi chiều', '☀️', 'I play in the afternoon.', 'Bé chơi vào buổi chiều.'],
  ['L2', 'L2-U09', 'evening', '/ˈivnɪŋ/', 'buổi tối', '🌆', 'I read in the evening.', 'Bé đọc sách vào buổi tối.'],
  ['L2', 'L2-U09', 'night', '/nˈaɪt/', 'ban đêm', '🌙', 'I sleep at night.', 'Bé ngủ vào ban đêm.'],
  ['L2', 'L2-U09', 'today', '/tədˈeɪ/', 'hôm nay', '📅', 'Today is a sunny day.', 'Hôm nay là một ngày nắng.'],
  ['L2', 'L2-U09', 'tomorrow', '/təmˈɑrˌoʊ/', 'ngày mai', '🌅', 'We will go to school tomorrow.', 'Ngày mai chúng ta sẽ đi học.'],
  ['L2', 'L2-U09', 'yesterday', '/jˈɛstɚdˌeɪ/', 'hôm qua', '📜', 'I played with my friend yesterday.', 'Hôm qua bé đã chơi cùng bạn.'],
  ['L2', 'L2-U09', 'Monday', '/mˈʌndi/', 'thứ Hai', '📆', 'Today is Monday.', 'Hôm nay là thứ Hai.'],
  ['L2', 'L2-U09', 'weekend', '/wˈikˌɛnd/', 'cuối tuần', '🎉', 'We visit Grandma at the weekend.', 'Chúng ta thăm bà vào cuối tuần.'],
  ['L2', 'L2-U09', 'birthday', '/bˈɝθdˌeɪ/', 'sinh nhật', '🎂', 'My birthday is in September.', 'Sinh nhật của bé vào tháng Chín.'],

  // L2 • UNIT 10: Sports
  ['L2', 'L2-U10', 'football', '/fˈʊtbˌɔl/', 'bóng đá', '⚽', 'I enjoy football.', 'Bé thích bóng đá.'],
  ['L2', 'L2-U10', 'basketball', '/bˈæskətbˌɔl/', 'bóng rổ', '🏀', 'I enjoy basketball.', 'Bé thích bóng rổ.'],
  ['L2', 'L2-U10', 'badminton', '/bˈædmˌɪntən/', 'cầu lông', '🏸', 'I enjoy badminton.', 'Bé thích cầu lông.'],
  ['L2', 'L2-U10', 'swimming', '/swˈɪmɪŋ/', 'bơi lội', '🏊', 'I enjoy swimming.', 'Bé thích bơi lội.'],
  ['L2', 'L2-U10', 'running', '/rˈʌnɪŋ/', 'chạy bộ', '🏃', 'I enjoy running.', 'Bé thích chạy bộ.'],
  ['L2', 'L2-U10', 'cycling', '/sˈaɪkəlɪŋ/', 'đạp xe', '🚴', 'I enjoy cycling.', 'Bé thích đạp xe.'],
  ['L2', 'L2-U10', 'tennis', '/tˈɛnəs/', 'quần vợt', '🎾', 'I enjoy tennis.', 'Bé thích quần vợt.'],
  ['L2', 'L2-U10', 'volleyball', '/vˈɑlibˌɔl/', 'bóng chuyền', '🏐', 'I enjoy volleyball.', 'Bé thích bóng chuyền.'],
  ['L2', 'L2-U10', 'yoga', '/jˈoʊɡə/', 'yoga', '🧘', 'I enjoy yoga.', 'Bé thích yoga.'],
  ['L2', 'L2-U10', 'skating', '/skˈeɪtɪŋ/', 'trượt patin/trượt băng', '🛼', 'I enjoy skating.', 'Bé thích trượt patin/trượt băng.'],

  // L3 • UNIT 01: Nature
  ['L3', 'L3-U01', 'forest', '/fˈɔrəst/', 'rừng', '🌲', 'The forest is beautiful.', 'Rừng rất đẹp.'],
  ['L3', 'L3-U01', 'mountain', '/mˈaʊntən/', 'núi', '⛰️', 'The mountain is beautiful.', 'Núi rất đẹp.'],
  ['L3', 'L3-U01', 'river', '/rˈɪvɚ/', 'sông', '🏞️', 'The river is beautiful.', 'Sông rất đẹp.'],
  ['L3', 'L3-U01', 'lake', '/lˈeɪk/', 'hồ', '🌊', 'The lake is beautiful.', 'Hồ rất đẹp.'],
  ['L3', 'L3-U01', 'ocean', '/ˈoʊʃən/', 'đại dương', '🌊', 'The ocean is beautiful.', 'Đại dương rất đẹp.'],
  ['L3', 'L3-U01', 'beach', '/bˈitʃ/', 'bãi biển', '🏖️', 'The beach is beautiful.', 'Bãi biển rất đẹp.'],
  ['L3', 'L3-U01', 'island', '/ˈaɪlənd/', 'hòn đảo', '🏝️', 'The island is beautiful.', 'Hòn đảo rất đẹp.'],
  ['L3', 'L3-U01', 'waterfall', '/wˈɔtɚfˌɔl/', 'thác nước', '🌊', 'The waterfall is beautiful.', 'Thác nước rất đẹp.'],
  ['L3', 'L3-U01', 'flower', '/flˈaʊɚ/', 'bông hoa', '🌸', 'The flower is beautiful.', 'Bông hoa rất đẹp.'],
  ['L3', 'L3-U01', 'tree', '/trˈi/', 'cây', '🌳', 'The tree is beautiful.', 'Cây rất đẹp.'],

  // L3 • UNIT 02: Health
  ['L3', 'L3-U02', 'healthy', '/hˈɛlθi/', 'khỏe mạnh', '💪', 'Fruit and exercise keep us healthy.', 'Trái cây và vận động giúp chúng ta khỏe mạnh.'],
  ['L3', 'L3-U02', 'sick', '/sˈɪk/', 'bị ốm', '🤢', 'I feel sick today.', 'Hôm nay bé cảm thấy bị ốm.'],
  ['L3', 'L3-U02', 'fever', '/fˈivɚ/', 'sốt', '🌡️', 'I have a fever.', 'Bé bị sốt.'],
  ['L3', 'L3-U02', 'cough', '/kˈɑf/', 'ho', '🗣️', 'I have a cough.', 'Bé bị ho.'],
  ['L3', 'L3-U02', 'headache', '/hˈɛdˌeɪk/', 'đau đầu', '🤕', 'I have a headache.', 'Bé bị đau đầu.'],
  ['L3', 'L3-U02', 'medicine', '/mˈɛdəsən/', 'thuốc', '💊', 'The doctor gives me medicine.', 'Bác sĩ cho bé thuốc.'],
  ['L3', 'L3-U02', 'doctor_h', '/dˈɑktɚ/', 'bác sĩ', '🩺', 'The doctor checks my health.', 'Bác sĩ kiểm tra sức khỏe của bé.'],
  ['L3', 'L3-U02', 'hospital_h', '/hˈɑspˌɪtəl/', 'bệnh viện', '🏥', 'Sick people may go to the hospital.', 'Người bị ốm có thể đến bệnh viện.'],
  ['L3', 'L3-U02', 'exercise', '/ˈɛksɚsˌaɪz/', 'tập thể dục', '🏃', 'I exercise every day.', 'Bé tập thể dục mỗi ngày.'],
  ['L3', 'L3-U02', 'rest', '/rˈɛst/', 'nghỉ ngơi', '🛌', 'I need to rest when I am tired.', 'Bé cần nghỉ ngơi khi mệt.'],

  // L3 • UNIT 03: Shopping
  ['L3', 'L3-U03', 'shop', '/ʃˈɑp/', 'cửa hàng/mua sắm', '🏪', 'We buy food at the shop.', 'Chúng ta mua thực phẩm ở cửa hàng.'],
  ['L3', 'L3-U03', 'price', '/prˈaɪs/', 'giá', '🏷️', 'The price is 10,000 đồng.', 'Giá là 10.000 đồng.'],
  ['L3', 'L3-U03', 'money', '/mˈʌni/', 'tiền', '💵', 'I keep my money in a small wallet.', 'Bé để tiền trong một chiếc ví nhỏ.'],
  ['L3', 'L3-U03', 'cheap', '/tʃˈip/', 'rẻ', '🪙', 'This pencil is cheap.', 'Cây bút chì này rẻ.'],
  ['L3', 'L3-U03', 'expensive', '/ɪkspˈɛnsɪv/', 'đắt', '💎', 'This bicycle is expensive.', 'Chiếc xe đạp này đắt.'],
  ['L3', 'L3-U03', 'buy', '/bˈaɪ/', 'mua', '🛒', 'I want to buy a book.', 'Bé muốn mua một quyển sách.'],
  ['L3', 'L3-U03', 'sell', '/sˈɛl/', 'bán', '🏷️', 'The shop sells fruit.', 'Cửa hàng bán trái cây.'],
  ['L3', 'L3-U03', 'pay', '/pˈeɪ/', 'thanh toán', '💳', 'We pay at the counter.', 'Chúng ta thanh toán tại quầy.'],
  ['L3', 'L3-U03', 'receipt', '/rɪsˈit/', 'biên lai', '🧾', 'Please keep the receipt.', 'Hãy giữ lại biên lai.'],
  ['L3', 'L3-U03', 'change', '/tʃˈeɪndʒ/', 'tiền thừa', '🪙', 'The cashier gives me my change.', 'Thu ngân trả lại tiền thừa cho bé.'],

  // L3 • UNIT 04: Travel
  ['L3', 'L3-U04', 'ticket', '/tˈɪkət/', 'vé', '🎟️', 'I show my ticket before the trip.', 'Bé xuất trình vé trước chuyến đi.'],
  ['L3', 'L3-U04', 'passport', '/pˈæspˌɔrt/', 'hộ chiếu', '🛂', 'A passport is needed for some countries.', 'Cần hộ chiếu khi đến một số quốc gia.'],
  ['L3', 'L3-U04', 'suitcase', '/sˈutkˌeɪs/', 'va li', '🧳', 'My clothes are in the suitcase.', 'Quần áo của bé ở trong va li.'],
  ['L3', 'L3-U04', 'airport', '/ˈɛrpˌɔrt/', 'sân bay', '✈️', 'We arrive at the airport early.', 'Chúng ta đến sân bay sớm.'],
  ['L3', 'L3-U04', 'hotel', '/hoʊtˈɛl/', 'khách sạn', '🏨', 'Our family stays at a hotel.', 'Gia đình bé ở tại khách sạn.'],
  ['L3', 'L3-U04', 'map', '/mˈæp/', 'bản đồ', '🗺️', 'The map shows us the way.', 'Bản đồ chỉ đường cho chúng ta.'],
  ['L3', 'L3-U04', 'journey', '/dʒˈɝni/', 'chuyến đi', '🧭', 'The journey takes two hours.', 'Chuyến đi kéo dài hai giờ.'],
  ['L3', 'L3-U04', 'tourist', '/tˈʊrəst/', 'du khách', '🧳', 'The tourist takes a photo.', 'Du khách chụp một bức ảnh.'],
  ['L3', 'L3-U04', 'visit', '/vˈɪzɪt/', 'thăm', '🏛️', 'We visit a museum.', 'Chúng ta thăm một bảo tàng.'],
  ['L3', 'L3-U04', 'arrive', '/ɚˈaɪv/', 'đến nơi', '🛬', 'We arrive before lunch.', 'Chúng ta đến nơi trước bữa trưa.'],

  // L3 • UNIT 05: Technology
  ['L3', 'L3-U05', 'computer', '/kəmpjˈutɚ/', 'máy tính', '💻', 'I use the computer carefully.', 'Bé sử dụng máy tính cẩn thận.'],
  ['L3', 'L3-U05', 'laptop', '/lˈæptˌɑp/', 'máy tính xách tay', '💻', 'I use the laptop carefully.', 'Bé sử dụng máy tính xách tay cẩn thận.'],
  ['L3', 'L3-U05', 'tablet', '/tˈæblət/', 'máy tính bảng', '📱', 'I use the tablet carefully.', 'Bé sử dụng máy tính bảng cẩn thận.'],
  ['L3', 'L3-U05', 'screen', '/skrˈin/', 'màn hình', '🖥️', 'I use the screen carefully.', 'Bé sử dụng màn hình cẩn thận.'],
  ['L3', 'L3-U05', 'keyboard', '/kˈibˌɔrd/', 'bàn phím', '⌨️', 'I use the keyboard carefully.', 'Bé sử dụng bàn phím cẩn thận.'],
  ['L3', 'L3-U05', 'mouse', '/mˈaʊs/', 'chuột máy tính', '🖱️', 'I use the mouse carefully.', 'Bé sử dụng chuột máy tính cẩn thận.'],
  ['L3', 'L3-U05', 'internet', '/ˈɪntɚnˌɛt/', 'mạng Internet', '🌐', 'I use the internet carefully.', 'Bé sử dụng mạng Internet cẩn thận.'],
  ['L3', 'L3-U05', 'website', '/wˈɛbsˌaɪt/', 'trang web', '🕸️', 'I use the website carefully.', 'Bé sử dụng trang web cẩn thận.'],
  ['L3', 'L3-U05', 'email', '/imˈeɪl/', 'thư điện tử', '📧', 'I use the email carefully.', 'Bé sử dụng thư điện tử cẩn thận.'],
  ['L3', 'L3-U05', 'password', '/pˈæswˌɝd/', 'mật khẩu', '🔑', 'I use the password carefully.', 'Bé sử dụng mật khẩu cẩn thận.'],

  // L3 • UNIT 06: Hobbies
  ['L3', 'L3-U06', 'reading', '/rˈidɪŋ/', 'đọc sách', '📖', 'I enjoy reading.', 'Bé thích đọc sách.'],
  ['L3', 'L3-U06', 'drawing', '/drˈɔɪŋ/', 'vẽ', '✏️', 'I enjoy drawing.', 'Bé thích vẽ.'],
  ['L3', 'L3-U06', 'painting', '/pˈeɪntɪŋ/', 'vẽ tranh', '🎨', 'I enjoy painting.', 'Bé thích vẽ tranh.'],
  ['L3', 'L3-U06', 'cooking', '/kˈʊkɪŋ/', 'nấu ăn', '🍳', 'I enjoy cooking.', 'Bé thích nấu ăn.'],
  ['L3', 'L3-U06', 'gardening', '/ɡˈɑrdənɪŋ/', 'làm vườn', '🌱', 'I enjoy gardening.', 'Bé thích làm vườn.'],
  ['L3', 'L3-U06', 'singing', '/sˈɪŋɪŋ/', 'ca hát', '🎤', 'I enjoy singing.', 'Bé thích ca hát.'],
  ['L3', 'L3-U06', 'dancing', '/dˈænsɪŋ/', 'nhảy múa', '💃', 'I enjoy dancing.', 'Bé thích nhảy múa.'],
  ['L3', 'L3-U06', 'photography', '/fətˈɑɡrəfi/', 'nhiếp ảnh', '📸', 'I enjoy photography.', 'Bé thích nhiếp ảnh.'],
  ['L3', 'L3-U06', 'collecting', '/kəlˈɛktɪŋ/', 'sưu tầm', '🪨', 'I enjoy collecting.', 'Bé thích sưu tầm.'],
  ['L3', 'L3-U06', 'camping', '/kˈæmpɪŋ/', 'cắm trại', '⛺', 'I enjoy camping.', 'Bé thích cắm trại.'],

  // L3 • UNIT 07: My Community
  ['L3', 'L3-U07', 'neighbor', '/nˈeɪbɚ/', 'hàng xóm', '🏡', 'Our neighbor is friendly.', 'Hàng xóm của chúng ta rất thân thiện.'],
  ['L3', 'L3-U07', 'police station', '/pəlˈis stˈeɪʃən/', 'đồn cảnh sát', '👮', 'The police station is near the bank.', 'Đồn cảnh sát ở gần ngân hàng.'],
  ['L3', 'L3-U07', 'fire station', '/fˈaɪɚ stˈeɪʃən/', 'trạm cứu hỏa', '👨‍🚒', 'Firefighters work at the fire station.', 'Lính cứu hỏa làm việc tại trạm cứu hỏa.'],
  ['L3', 'L3-U07', 'museum', '/mjuzˈiəm/', 'bảo tàng', '🏛️', 'We learn about history at the museum.', 'Chúng ta học về lịch sử tại bảo tàng.'],
  ['L3', 'L3-U07', 'bakery', '/bˈeɪkɚi/', 'tiệm bánh', '🥖', 'The bakery sells fresh bread.', 'Tiệm bánh bán bánh mì mới.'],
  ['L3', 'L3-U07', 'market', '/mˈɑrkət/', 'chợ', '🛒', 'My mother buys vegetables at the market.', 'Mẹ mua rau ở chợ.'],
  ['L3', 'L3-U07', 'playground', '/plˈeɪɡrˌaʊnd/', 'sân chơi', '🛝', 'Children play at the playground.', 'Trẻ em chơi ở sân chơi.'],
  ['L3', 'L3-U07', 'traffic light', '/trˈæfɪk lˈaɪt/', 'đèn giao thông', '🚦', 'Stop when the traffic light is red.', 'Dừng lại khi đèn giao thông màu đỏ.'],
  ['L3', 'L3-U07', 'crossing', '/krˈɔsɪŋ/', 'vạch qua đường', '🚶', 'Use the crossing to cross the road.', 'Hãy dùng vạch qua đường để sang đường.'],
  ['L3', 'L3-U07', 'neighborhood', '/nˈeɪbɚhˌʊd/', 'khu phố', '🏘️', 'My neighborhood is clean and friendly.', 'Khu phố của bé sạch sẽ và thân thiện.'],

  // L3 • UNIT 08: Festivals and Parties
  ['L3', 'L3-U08', 'festival', '/fˈɛstəvəl/', 'lễ hội', '🎈', 'Our town has a colorful festival.', 'Thành phố có một lễ hội đầy màu sắc.'],
  ['L3', 'L3-U08', 'present', '/prˈɛzənt/', 'quà tặng', '🎁', 'I give my friend a present.', 'Bé tặng bạn một món quà.'],
  ['L3', 'L3-U08', 'party', '/pˈɑrti/', 'bữa tiệc', '🎉', 'We sing and play at the party.', 'Chúng ta hát và chơi trong bữa tiệc.'],
  ['L3', 'L3-U08', 'candle', '/kˈændəl/', 'nến', '🕯️', 'There are candles on the cake.', 'Có những cây nến trên bánh.'],
  ['L3', 'L3-U08', 'costume', '/kɑstˈum/', 'trang phục hóa trang', '🎭', 'She wears a funny costume.', 'Bạn ấy mặc trang phục hóa trang vui nhộn.'],
  ['L3', 'L3-U08', 'parade', '/pɚˈeɪd/', 'cuộc diễu hành', '🎺', 'We watch the parade in the street.', 'Chúng ta xem cuộc diễu hành trên đường.'],
  ['L3', 'L3-U08', 'holiday', '/hˈɑlədˌeɪ/', 'ngày lễ/kỳ nghỉ', '🏖️', 'School is closed for the holiday.', 'Trường nghỉ trong ngày lễ.'],
  ['L3', 'L3-U08', 'celebrate', '/sˈɛləbrˌeɪt/', 'ăn mừng', '🥳', 'We celebrate together.', 'Chúng ta cùng ăn mừng.'],
  ['L3', 'L3-U08', 'decorate', '/dˈɛkɚˌeɪt/', 'trang trí', '🎀', 'We decorate the room with balloons.', 'Chúng ta trang trí phòng bằng bóng bay.'],
  ['L3', 'L3-U08', 'invitation', '/ˌɪnvɪtˈeɪʃən/', 'lời mời/thiệp mời', '✉️', 'I receive an invitation to the party.', 'Bé nhận được lời mời dự tiệc.'],

  // L3 • UNIT 09: Personality
  ['L3', 'L3-U09', 'kind', '/kˈaɪnd/', 'tốt bụng', '💖', 'My friend is kind.', 'Bạn của bé rất tốt bụng.'],
  ['L3', 'L3-U09', 'friendly', '/frˈɛndli/', 'thân thiện', '🤝', 'My friend is friendly.', 'Bạn của bé rất thân thiện.'],
  ['L3', 'L3-U09', 'polite', '/pəlˈaɪt/', 'lịch sự', '🙇', 'My friend is polite.', 'Bạn của bé rất lịch sự.'],
  ['L3', 'L3-U09', 'honest', '/ˈɑnəst/', 'trung thực', '🤝', 'My friend is honest.', 'Bạn của bé rất trung thực.'],
  ['L3', 'L3-U09', 'brave', '/brˈeɪv/', 'dũng cảm', '🛡️', 'My friend is brave.', 'Bạn của bé rất dũng cảm.'],
  ['L3', 'L3-U09', 'clever', '/klˈɛvɚ/', 'thông minh', '💡', 'My friend is clever.', 'Bạn của bé rất thông minh.'],
  ['L3', 'L3-U09', 'careful', '/kˈɛrfəl/', 'cẩn thận', '🔍', 'My friend is careful.', 'Bạn của bé rất cẩn thận.'],
  ['L3', 'L3-U09', 'patient', '/pˈeɪʃənt/', 'kiên nhẫn', '⏳', 'My friend is patient.', 'Bạn của bé rất kiên nhẫn.'],
  ['L3', 'L3-U09', 'helpful', '/hˈɛlpfəl/', 'hay giúp đỡ', '🆘', 'My friend is helpful.', 'Bạn của bé rất hay giúp đỡ.'],
  ['L3', 'L3-U09', 'shy', '/ʃˈaɪ/', 'nhút nhát', '🙈', 'My friend is shy.', 'Bạn của bé rất nhút nhát.'],

  // L3 • UNIT 10: Protect the Earth
  ['L3', 'L3-U10', 'recycle', '/risˈaɪkəl/', 'tái chế', '♻️', 'We recycle paper and glass.', 'Chúng ta tái chế giấy và thủy tinh.'],
  ['L3', 'L3-U10', 'reuse', '/rijˈus/', 'tái sử dụng', '🛍️', 'We reuse this bag.', 'Chúng ta tái sử dụng chiếc túi này.'],
  ['L3', 'L3-U10', 'reduce', '/rədˈus/', 'giảm bớt', '📉', 'We reduce plastic waste.', 'Chúng ta giảm rác thải nhựa.'],
  ['L3', 'L3-U10', 'rubbish', '/rˈʌbɪʃ/', 'rác', '🗑️', 'Put the rubbish in the bin.', 'Hãy bỏ rác vào thùng.'],
  ['L3', 'L3-U10', 'plastic', '/plˈæstɪk/', 'nhựa', '🥤', 'This bottle is made of plastic.', 'Chai này làm bằng nhựa.'],
  ['L3', 'L3-U10', 'paper', '/pˈeɪpɚ/', 'giấy', '📄', 'Use both sides of the paper.', 'Hãy sử dụng cả hai mặt giấy.'],
  ['L3', 'L3-U10', 'glass', '/ɡlˈæs/', 'thủy tinh', '🍷', 'Glass can be recycled.', 'Thủy tinh có thể được tái chế.'],
  ['L3', 'L3-U10', 'electricity', '/ɪlˌɛktrˈɪsəti/', 'điện', '⚡', 'Turn off the light to save electricity.', 'Tắt đèn để tiết kiệm điện.'],
  ['L3', 'L3-U10', 'pollution', '/pəlˈuʃən/', 'ô nhiễm', '🏭', 'Pollution can harm animals.', 'Ô nhiễm có thể gây hại cho động vật.'],
  ['L3', 'L3-U10', 'protect', '/prətˈɛkt/', 'bảo vệ', '🛡️', 'We protect trees and animals.', 'Chúng ta bảo vệ cây cối và động vật.'],

  // L4 • UNIT 01: Science Basics
  ['L4', 'L4-U01', 'experiment', '/ɪkspˈɛrəmənt/', 'thí nghiệm', '🧪', 'We do an experiment with water.', 'Chúng ta làm một thí nghiệm với nước.'],
  ['L4', 'L4-U01', 'energy', '/ˈɛnɚdʒi/', 'năng lượng', '⚡', 'Food gives our bodies energy.', 'Thức ăn cung cấp năng lượng cho cơ thể.'],
  ['L4', 'L4-U01', 'light', '/lˈaɪt/', 'ánh sáng', '💡', 'Light helps us see.', 'Ánh sáng giúp chúng ta nhìn thấy.'],
  ['L4', 'L4-U01', 'sound', '/sˈaʊnd/', 'âm thanh', '🔊', 'A bell makes a loud sound.', 'Chiếc chuông tạo ra âm thanh lớn.'],
  ['L4', 'L4-U01', 'heat', '/hˈit/', 'nhiệt', '🔥', 'The Sun gives us heat.', 'Mặt Trời cung cấp nhiệt cho chúng ta.'],
  ['L4', 'L4-U01', 'force', '/fˈɔrs/', 'lực', '💥', 'A push is a kind of force.', 'Lực đẩy là một loại lực.'],
  ['L4', 'L4-U01', 'matter', '/mˈætɚ/', 'vật chất', '⚛️', 'Water and air are forms of matter.', 'Nước và không khí là các dạng vật chất.'],
  ['L4', 'L4-U01', 'liquid', '/lˈɪkwəd/', 'chất lỏng', '💧', 'Water is a liquid.', 'Nước là chất lỏng.'],
  ['L4', 'L4-U01', 'solid', '/sˈɑləd/', 'chất rắn', '🧊', 'Ice is a solid.', 'Nước đá là chất rắn.'],
  ['L4', 'L4-U01', 'gas', '/ɡˈæs/', 'chất khí', '💨', 'Air contains different gases.', 'Không khí chứa các chất khí khác nhau.'],

  // L4 • UNIT 02: Space
  ['L4', 'L4-U02', 'planet', '/plˈænət/', 'hành tinh', '🪐', 'Earth is a planet.', 'Trái Đất là một hành tinh.'],
  ['L4', 'L4-U02', 'Earth', '/ˈɝθ/', 'Trái Đất', '🌍', 'Earth is our home planet.', 'Trái Đất là hành tinh quê hương của chúng ta.'],
  ['L4', 'L4-U02', 'Moon', '/mˈun/', 'Mặt Trăng', '🌕', 'The Moon moves around Earth.', 'Mặt Trăng chuyển động quanh Trái Đất.'],
  ['L4', 'L4-U02', 'Sun', '/sˈʌn/', 'Mặt Trời', '☀️', 'The Sun gives us light and heat.', 'Mặt Trời cung cấp ánh sáng và nhiệt.'],
  ['L4', 'L4-U02', 'star_s', '/stˈɑr/', 'ngôi sao', '⭐', 'A star shines in the night sky.', 'Một ngôi sao tỏa sáng trên bầu trời đêm.'],
  ['L4', 'L4-U02', 'astronaut', '/ˈæstrənˌɑt/', 'phi hành gia', '👨‍🚀', 'An astronaut travels into space.', 'Phi hành gia du hành vào không gian.'],
  ['L4', 'L4-U02', 'rocket', '/rˈɑkət/', 'tên lửa', '🚀', 'The rocket launches into space.', 'Tên lửa phóng vào không gian.'],
  ['L4', 'L4-U02', 'galaxy', '/ɡˈæləksi/', 'thiên hà', '🌌', 'Our solar system is in a galaxy.', 'Hệ Mặt Trời của chúng ta ở trong một thiên hà.'],
  ['L4', 'L4-U02', 'telescope', '/tˈɛləskˌoʊp/', 'kính thiên văn', '🔭', 'We use a telescope to see stars.', 'Chúng ta dùng kính thiên văn để nhìn các ngôi sao.'],
  ['L4', 'L4-U02', 'gravity', '/ɡrˈævəti/', 'trọng lực', '🍏', 'Gravity pulls objects toward Earth.', 'Trọng lực kéo vật thể về phía Trái Đất.'],

  // L4 • UNIT 03: Learning Words
  ['L4', 'L4-U03', 'compare', '/kəmpˈɛr/', 'so sánh', '⚖️', 'Compare the two pictures.', 'Hãy so sánh hai bức tranh.'],
  ['L4', 'L4-U03', 'describe', '/dɪskrˈaɪb/', 'mô tả', '📝', 'Describe the animal in the picture.', 'Hãy mô tả con vật trong tranh.'],
  ['L4', 'L4-U03', 'explain', '/ɪksplˈeɪn/', 'giải thích', '💡', 'Explain how you found the answer.', 'Hãy giải thích cách con tìm ra câu trả lời.'],
  ['L4', 'L4-U03', 'classify', '/klˈæsəfˌaɪ/', 'phân loại', '🏷️', 'Classify the animals into two groups.', 'Hãy phân loại động vật thành hai nhóm.'],
  ['L4', 'L4-U03', 'calculate', '/kˈælkjəlˌeɪt/', 'tính toán', '🧮', 'Calculate the total number of stars.', 'Hãy tính tổng số ngôi sao.'],
  ['L4', 'L4-U03', 'observe', '/əbzˈɝv/', 'quan sát', '🔬', 'Observe what happens to the ice.', 'Hãy quan sát điều xảy ra với nước đá.'],
  ['L4', 'L4-U03', 'predict', '/prɪdˈɪkt/', 'dự đoán', '🔮', 'Predict what will happen next.', 'Hãy dự đoán điều sẽ xảy ra tiếp theo.'],
  ['L4', 'L4-U03', 'result', '/rɪzˈʌlt/', 'kết quả', '📊', 'Write the result in the box.', 'Hãy viết kết quả vào ô.'],
  ['L4', 'L4-U03', 'example', '/ɪɡzˈæmpəl/', 'ví dụ', '📌', 'Give one example of a farm animal.', 'Hãy nêu một ví dụ về động vật trang trại.'],
  ['L4', 'L4-U03', 'information', '/ˌɪnfɚmˈeɪʃən/', 'thông tin', 'ℹ️', 'Find the important information in the text.', 'Hãy tìm thông tin quan trọng trong đoạn văn.'],

  // L4 • UNIT 04: Communication
  ['L4', 'L4-U04', 'opinion', '/əpˈɪnjən/', 'ý kiến', '💭', 'In my opinion, the story is interesting.', 'Theo ý kiến của bé, câu chuyện rất thú vị.'],
  ['L4', 'L4-U04', 'agree', '/əɡrˈi/', 'đồng ý', '👍', 'I agree with your idea.', 'Bé đồng ý với ý tưởng của bạn.'],
  ['L4', 'L4-U04', 'disagree', '/dɪsəɡrˈi/', 'không đồng ý', '👎', 'I disagree, but I will listen politely.', 'Bé không đồng ý nhưng vẫn lắng nghe lịch sự.'],
  ['L4', 'L4-U04', 'suggest', '/sədʒˈɛst/', 'đề xuất', '💡', 'I suggest reading this book.', 'Bé đề xuất đọc quyển sách này.'],
  ['L4', 'L4-U04', 'invite', '/ˌɪnvˈaɪt/', 'mời', '✉️', 'I invite my friend to play.', 'Bé mời bạn cùng chơi.'],
  ['L4', 'L4-U04', 'reply', '/rɪplˈaɪ/', 'trả lời', '💬', 'Please reply to my message.', 'Hãy trả lời tin nhắn của bé.'],
  ['L4', 'L4-U04', 'question', '/kwˈɛstʃən/', 'câu hỏi', '❓', 'I ask a question when I need help.', 'Bé đặt câu hỏi khi cần giúp đỡ.'],
  ['L4', 'L4-U04', 'answer', '/ˈænsɚ/', 'câu trả lời', '💡', 'Please answer in a full sentence.', 'Hãy trả lời bằng một câu đầy đủ.'],
  ['L4', 'L4-U04', 'message', '/mˈɛsədʒ/', 'tin nhắn', '📱', 'I send a short message to my teacher.', 'Bé gửi một tin nhắn ngắn cho giáo viên.'],
  ['L4', 'L4-U04', 'conversation', '/kˌɑnvɚsˈeɪʃən/', 'cuộc hội thoại', '🗣️', 'We have a polite conversation.', 'Chúng ta có một cuộc hội thoại lịch sự.'],

  // L4 • UNIT 05: Problem Solving
  ['L4', 'L4-U05', 'problem', '/prˈɑbləm/', 'vấn đề', '❓', 'First, understand the problem.', 'Trước tiên, hãy hiểu vấn đề.'],
  ['L4', 'L4-U05', 'solution', '/səlˈuʃən/', 'giải pháp', '💡', 'We found a simple solution.', 'Chúng ta tìm được một giải pháp đơn giản.'],
  ['L4', 'L4-U05', 'plan', '/plˈæn/', 'kế hoạch', '📋', 'Make a plan before you begin.', 'Hãy lập kế hoạch trước khi bắt đầu.'],
  ['L4', 'L4-U05', 'choice', '/tʃˈɔɪs/', 'lựa chọn', '🔀', 'Think carefully before making a choice.', 'Hãy suy nghĩ cẩn thận trước khi lựa chọn.'],
  ['L4', 'L4-U05', 'reason', '/rˈizən/', 'lý do', '🧠', 'Tell me the reason for your answer.', 'Hãy nói lý do cho câu trả lời của con.'],
  ['L4', 'L4-U05', 'step', '/stˈɛp/', 'bước', '👣', 'Follow each step in order.', 'Hãy làm theo từng bước theo thứ tự.'],
  ['L4', 'L4-U05', 'check', '/tʃˈɛk/', 'kiểm tra', '📊', 'Check your work when you finish.', 'Hãy kiểm tra bài khi hoàn thành.'],
  ['L4', 'L4-U05', 'improve', '/ˌɪmprˈuv/', 'cải thiện', '📈', 'Practice can improve your reading.', 'Luyện tập có thể cải thiện khả năng đọc.'],
  ['L4', 'L4-U05', 'decide', '/dˌɪsˈaɪd/', 'quyết định', '🎯', 'We decide which idea is best.', 'Chúng ta quyết định ý tưởng nào tốt nhất.'],
  ['L4', 'L4-U05', 'complete', '/kəmplˈit/', 'hoàn thành', '✅', 'Complete the task before lunch.', 'Hãy hoàn thành nhiệm vụ trước bữa trưa.'],

  // L4 • UNIT 06: Complex Feelings
  ['L4', 'L4-U06', 'proud', '/prˈaʊd/', 'tự hào', '🦁', 'I feel proud today.', 'Hôm nay bé cảm thấy tự hào.'],
  ['L4', 'L4-U06', 'worried', '/wˈɝid/', 'lo lắng', '😟', 'I feel worried today.', 'Hôm nay bé cảm thấy lo lắng.'],
  ['L4', 'L4-U06', 'surprised', '/sɚprˈaɪzd/', 'ngạc nhiên', '😲', 'I feel surprised today.', 'Hôm nay bé cảm thấy ngạc nhiên.'],
  ['L4', 'L4-U06', 'disappointed', '/dˌɪsəpˈɔɪntɪd/', 'thất vọng', '😞', 'I feel disappointed today.', 'Hôm nay bé cảm thấy thất vọng.'],
  ['L4', 'L4-U06', 'confident', '/kˈɑnfədənt/', 'tự tin', '😎', 'I feel confident today.', 'Hôm nay bé cảm thấy tự tin.'],
  ['L4', 'L4-U06', 'nervous', '/nˈɝvəs/', 'hồi hộp', '😬', 'I feel nervous today.', 'Hôm nay bé cảm thấy hồi hộp.'],
  ['L4', 'L4-U06', 'curious', '/kjˈʊriəs/', 'tò mò', '🧐', 'I feel curious today.', 'Hôm nay bé cảm thấy tò mò.'],
  ['L4', 'L4-U06', 'lonely', '/lˈoʊnli/', 'cô đơn', '🥺', 'I feel lonely today.', 'Hôm nay bé cảm thấy cô đơn.'],
  ['L4', 'L4-U06', 'grateful', '/ɡrˈeɪtfəl/', 'biết ơn', '🙏', 'I feel grateful today.', 'Hôm nay bé cảm thấy biết ơn.'],
  ['L4', 'L4-U06', 'embarrassed', '/ɪmbˈɛrəst/', 'xấu hổ/ngượng', '😳', 'I feel embarrassed today.', 'Hôm nay bé cảm thấy xấu hổ/ngượng.'],

  // L4 • UNIT 07: Countries and Culture
  ['L4', 'L4-U07', 'country', '/kˈʌntri/', 'quốc gia', '🌐', 'Vietnam is a beautiful country.', 'Việt Nam là một quốc gia xinh đẹp.'],
  ['L4', 'L4-U07', 'language', '/lˈæŋɡwədʒ/', 'ngôn ngữ', '🗣️', 'English is an international language.', 'Tiếng Anh là một ngôn ngữ quốc tế.'],
  ['L4', 'L4-U07', 'culture', '/kˈʌltʃɚ/', 'văn hóa', '⛩️', 'Food is part of a culture.', 'Ẩm thực là một phần của văn hóa.'],
  ['L4', 'L4-U07', 'tradition', '/trədˈɪʃən/', 'truyền thống', '📜', 'Families keep special traditions.', 'Các gia đình gìn giữ những truyền thống đặc biệt.'],
  ['L4', 'L4-U07', 'custom', '/kˈʌstəm/', 'phong tục', '🏮', 'Greeting politely is an important custom.', 'Chào hỏi lịch sự là một phong tục quan trọng.'],
  ['L4', 'L4-U07', 'national', '/nˈæʃənəl/', 'thuộc quốc gia', '🏛️', 'This is a national celebration.', 'Đây là một lễ kỷ niệm cấp quốc gia.'],
  ['L4', 'L4-U07', 'local', '/lˈoʊkəl/', 'địa phương', '🏡', 'We buy fruit at the local market.', 'Chúng ta mua trái cây ở chợ địa phương.'],
  ['L4', 'L4-U07', 'foreign', '/fˈɔrən/', 'nước ngoài', '✈️', 'She is learning a foreign language.', 'Bạn ấy đang học một ngoại ngữ.'],
  ['L4', 'L4-U07', 'famous', '/fˈeɪməs/', 'nổi tiếng', '🌟', 'This city is famous for its food.', 'Thành phố này nổi tiếng về ẩm thực.'],
  ['L4', 'L4-U07', 'history', '/hˈɪstɚi/', 'lịch sử', '📜', 'We learn about history at the museum.', 'Chúng ta học lịch sử tại bảo tàng.'],

  // L4 • UNIT 08: Digital Safety
  ['L4', 'L4-U08', 'account', '/əkˈaʊnt/', 'tài khoản', '👤', 'Use a strong password for your account.', 'Hãy dùng mật khẩu mạnh cho tài khoản.'],
  ['L4', 'L4-U08', 'private', '/prˈaɪvət/', 'riêng tư', '🔒', 'Keep personal information private.', 'Hãy giữ thông tin cá nhân riêng tư.'],
  ['L4', 'L4-U08', 'public', '/pˈʌblɪk/', 'công khai', '🌐', 'A public post can be seen by many people.', 'Bài đăng công khai có thể được nhiều người xem.'],
  ['L4', 'L4-U08', 'download', '/dˈaʊnlˌoʊd/', 'tải xuống', '📥', 'Ask an adult before you download a file.', 'Hãy hỏi người lớn trước khi tải tệp xuống.'],
  ['L4', 'L4-U08', 'upload', '/ˈʌplˌoʊd/', 'tải lên', '📤', 'Ask for permission before you upload a photo.', 'Hãy xin phép trước khi tải ảnh lên.'],
  ['L4', 'L4-U08', 'online', '/ˈɔnlˌaɪn/', 'trực tuyến', '💻', 'Be kind when you talk online.', 'Hãy tử tế khi giao tiếp trực tuyến.'],
  ['L4', 'L4-U08', 'safe', '/sˈeɪf/', 'an toàn', '🛡️', 'This website is safe for children.', 'Trang web này an toàn cho trẻ em.'],
  ['L4', 'L4-U08', 'dangerous', '/dˈeɪndʒɚəs/', 'nguy hiểm', '⚠️', 'Do not open a dangerous link.', 'Không mở đường liên kết nguy hiểm.'],
  ['L4', 'L4-U08', 'report', '/ripˈɔrt/', 'báo cáo/báo cho người lớn', '🚨', 'Report unsafe content to an adult.', 'Hãy báo nội dung không an toàn cho người lớn.'],
  ['L4', 'L4-U08', 'permission', '/pɚmˈɪʃən/', 'sự cho phép', '🔑', 'Ask for permission before sharing a photo.', 'Hãy xin phép trước khi chia sẻ ảnh.'],

  // L4 • UNIT 09: Storytelling
  ['L4', 'L4-U09', 'character', '/kˈɛrɪktɚ/', 'nhân vật', '🎭', 'The main character is a brave girl.', 'Nhân vật chính là một cô bé dũng cảm.'],
  ['L4', 'L4-U09', 'setting', '/sˈɛtɪŋ/', 'bối cảnh', '🌄', 'The setting is a quiet forest.', 'Bối cảnh là một khu rừng yên tĩnh.'],
  ['L4', 'L4-U09', 'beginning', '/bɪɡˈɪnɪŋ/', 'phần mở đầu', '🎬', 'The beginning introduces the characters.', 'Phần mở đầu giới thiệu các nhân vật.'],
  ['L4', 'L4-U09', 'middle', '/mˈɪdəl/', 'phần giữa', '⏳', 'The middle shows the main problem.', 'Phần giữa thể hiện vấn đề chính.'],
  ['L4', 'L4-U09', 'ending', '/ˈɛndɪŋ/', 'phần kết', '🏁', 'The ending tells how the story finishes.', 'Phần kết cho biết câu chuyện kết thúc thế nào.'],
  ['L4', 'L4-U09', 'event', '/ɪvˈɛnt/', 'sự kiện', '⚡', 'A surprising event changes the story.', 'Một sự kiện bất ngờ làm thay đổi câu chuyện.'],
  ['L4', 'L4-U09', 'adventure', '/ædvˈɛntʃɚ/', 'cuộc phiêu lưu', '🧭', 'The children begin an adventure.', 'Các bạn nhỏ bắt đầu một cuộc phiêu lưu.'],
  ['L4', 'L4-U09', 'mystery', '/mˈɪstɚi/', 'điều bí ẩn', '🕵️', 'The missing key is a mystery.', 'Chiếc chìa khóa bị mất là một điều bí ẩn.'],
  ['L4', 'L4-U09', 'imagine', '/ˌɪmˈædʒən/', 'tưởng tượng', '💭', 'Imagine a city in the clouds.', 'Hãy tưởng tượng một thành phố trên mây.'],
  ['L4', 'L4-U09', 'create', '/kriˈeɪt/', 'tạo ra', '🎨', 'Create a new ending for the story.', 'Hãy tạo một kết thúc mới cho câu chuyện.'],

  // L4 • UNIT 10: Goals and Growth
  ['L4', 'L4-U10', 'dream', '/drˈim/', 'ước mơ', '🌟', 'My dream is to become a scientist.', 'Ước mơ của bé là trở thành nhà khoa học.'],
  ['L4', 'L4-U10', 'goal', '/ɡˈoʊl/', 'mục tiêu', '🎯', 'My goal is to read ten pages.', 'Mục tiêu của bé là đọc mười trang.'],
  ['L4', 'L4-U10', 'future', '/fjˈutʃɚ/', 'tương lai', '🚀', 'I want to learn more in the future.', 'Bé muốn học thêm trong tương lai.'],
  ['L4', 'L4-U10', 'practice', '/prˈæktəs/', 'luyện tập', '🏋️', 'I practice English every day.', 'Bé luyện tiếng Anh mỗi ngày.'],
  ['L4', 'L4-U10', 'progress', '/prˈɑɡrˌɛs/', 'sự tiến bộ', '📈', 'I can see my progress this week.', 'Bé có thể thấy sự tiến bộ trong tuần này.'],
  ['L4', 'L4-U10', 'success', '/səksˈɛs/', 'thành công', '🏆', 'Hard work can lead to success.', 'Chăm chỉ có thể dẫn đến thành công.'],
  ['L4', 'L4-U10', 'challenge', '/tʃˈæləndʒ/', 'thử thách', '⛰️', 'This puzzle is a fun challenge.', 'Câu đố này là một thử thách thú vị.'],
  ['L4', 'L4-U10', 'learn', '/lˈɝn/', 'học', '📚', 'I learn from my mistakes.', 'Bé học từ những lỗi sai.'],
  ['L4', 'L4-U10', 'achieve', '/ətʃˈiv/', 'đạt được', '🏅', 'I can achieve my goal step by step.', 'Bé có thể đạt mục tiêu từng bước.'],
  ['L4', 'L4-U10', 'promise', '/prˈɑməs/', 'lời hứa/hứa', '🤝', 'I promise to keep trying.', 'Bé hứa sẽ tiếp tục cố gắng.']
];

const finalItems = rawData.map(([lvl, unit, w, ipa, meaning, img, sentence, sentenceVi], index) => {
  const catObj = VOCAB_CATEGORIES.find(c => c.id === unit);
  const catName = catObj ? catObj.name : unit;
  const cleanWord = w.replace('_fruit', '').replace('_h', '').replace('_s', '');
  return {
    id: `vocab-${lvl}-${unit}-W${String((index % 10) + 1).padStart(2, '0')}`,
    word: cleanWord,
    ipa: ipa,
    meaning: meaning,
    category: unit,
    level: lvl,
    image: img,
    sentence: sentence,
    sentenceVi: sentenceVi,
    hint: `${catName}: ${meaning}`
  };
});

const fileHeader = `// Official 400 Core English Vocabulary Database for Kids (4 Levels • 40 Units • Exact Matching Icons • Sample Sentences)

export const COURSE_LEVELS = ${JSON.stringify(COURSE_LEVELS, null, 2)};

export const VOCAB_CATEGORIES = ${JSON.stringify(VOCAB_CATEGORIES, null, 2)};

export const VOCABULARY_DATABASE = ${JSON.stringify(finalItems, null, 2)};
`;

const dest = path.join(__dirname, '../client/src/constants/kidsVocabularyDatabase.js');
fs.writeFileSync(dest, fileHeader, 'utf-8');

// Also save JSON and CSV files in scratch for user download/audit as requested in guideline 8
const jsonDest = path.join(__dirname, 'du_lieu_tu_vung_4_cap_do.json');
fs.writeFileSync(jsonDest, JSON.stringify(finalItems, null, 2), 'utf-8');

let csvContent = 'id,word,ipa,meaning,level,unit,image,sentence_en,sentence_vi\n';
finalItems.forEach(i => {
  csvContent += `"${i.id}","${i.word}","${i.ipa}","${i.meaning}","${i.level}","${i.category}","${i.image}","${i.sentence.replace(/"/g, '""')}","${i.sentenceVi.replace(/"/g, '""')}"\n`;
});
const csvDest = path.join(__dirname, 'du_lieu_tu_vung_4_cap_do.csv');
fs.writeFileSync(csvDest, csvContent, 'utf-8');

console.log('SUCCESSFULLY BUILT 400 Core Vocabulary Database across 4 Levels and 40 Units! Total Items:', finalItems.length);
