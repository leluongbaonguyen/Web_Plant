const fs = require('fs');
const path = require('path');

const COURSE_LEVELS = [
  {
    id: 'all',
    name: 'Chương Trình Học Tiếng Anh Toàn Diện Cho Bé (Từ Cơ Bản Đến Nâng Cao)',
    badge: 'Khóa Học Tổng Hợp Duy Nhất',
    color: 'from-cyan-500 via-blue-500 to-indigo-500 border-cyan-400 text-cyan-300',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Sắp xếp chuẩn thứ tự từ Bảng chữ cái (Nguyên âm U, E, O, A, I & 21 Phụ âm) đến Số đếm, Gia đình, Trường học và Kỹ năng sống.',
    icon: '🏆',
    targetWords: 244,
  }
];

const VOCAB_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Chủ Đề (40 Chủ Đề Sắp Xếp Thứ Tự)', icon: '🌈' },
  { id: 'alphabet', name: '1. Bảng Chữ Cái & Phát Âm', icon: '🔤' },
  { id: 'math', name: '2. Số Đếm & Toán Học', icon: '🔢' },
  { id: 'colors', name: '3. Màu Sắc', icon: '🎨' },
  { id: 'shapes', name: '4. Hình Dạng & Kích Thước', icon: '📐' },
  { id: 'personal', name: '5. Thông Tin Cá Nhân', icon: '🪪' },
  { id: 'family', name: '6. Gia Đình & Họ Hàng', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', name: '7. Bạn Bè & Mối Quan Hệ', icon: '🤝' },
  { id: 'body', name: '8. Bộ Phận Cơ Thể', icon: '👁️' },
  { id: 'health', name: '9. Sức Khỏe & Bệnh Tật', icon: '🩺' },
  { id: 'emotions', name: '10. Cảm Xúc & Tính Cách', icon: '😊' },
  { id: 'daily', name: '11. Hoạt Động Hằng Ngày', icon: '⏰' },
  { id: 'housing', name: '12. Nhà Ở & Đồ Đạc', icon: '🏠' },
  { id: 'food', name: '13. Đồ Ăn & Thực Phẩm', icon: '🍱' },
  { id: 'drinks', name: '14. Đồ Uống & Nước Giải Khát', icon: '🥤' },
  { id: 'cooking', name: '15. Nấu Ăn & Nhà Bếp', icon: '🍳' },
  { id: 'clothes', name: '16. Quần Áo & Phụ Kiện', icon: '👕' },
  { id: 'school', name: '17. Trường Học & Giáo Dục', icon: '🏫' },
  { id: 'supplies', name: '18. Đồ Dùng Học Tập', icon: '🎒' },
  { id: 'subjects', name: '19. Các Môn Học', icon: '📚' },
  { id: 'toys', name: '20. Đồ Chơi & Trò Chơi', icon: '🧸' },
  { id: 'animals', name: '21. Động Vật & Sinh Vật', icon: '🦁' },
  { id: 'nature', name: '22. Thực Vật & Thiên Nhiên', icon: '🌿' },
  { id: 'weather', name: '23. Thời Tiết & Khí Hậu', icon: '🌤️' },
  { id: 'seasons', name: '24. Mùa Trong Năm', icon: '🍂' },
  { id: 'time', name: '25. Thời Gian & Lịch', icon: '📅' },
  { id: 'transport', name: '26. Giao Thông & Phương Tiện', icon: '🚗' },
  { id: 'places', name: '27. Địa Điểm Thành Phố', icon: '🏙️' },
  { id: 'jobs', name: '28. Nghề Nghiệp', icon: '👷' },
  { id: 'shopping', name: '29. Mua Sắm & Tiền Bạc', icon: '🛒' },
  { id: 'travel', name: '30. Du Lịch & Thám Hiểm', icon: '✈️' },
  { id: 'sports', name: '31. Thể Thao & Vận Động', icon: '⚽' },
  { id: 'hobbies', name: '32. Sở Thích & Giải Trí', icon: '🎨' },
  { id: 'art', name: '33. Nghệ Thuật, Âm Nhạc & Phim', icon: '🎬' },
  { id: 'tech', name: '34. Công Nghệ & Internet', icon: '💻' },
  { id: 'communication', name: '35. Giao Tiếp Hằng Ngày', icon: '💬' },
  { id: 'festivals', name: '36. Lễ Hội & Ngày Đặc Biệt', icon: '🎉' },
  { id: 'culture', name: '37. Quốc Gia & Văn Hóa', icon: '🌐' },
  { id: 'environment', name: '38. Môi Trường & Trái Đất', icon: '🌍' },
  { id: 'science', name: '39. Khoa Học & Không Gian', icon: '🚀' },
  { id: 'lifeskills', name: '40. Kỹ Năng Sống & Xã Hội', icon: '🌟' }
];

// Topic 1: Alphabet & Pronunciation with exact matching icons for U, E, O, A, I and B..Z
const alphabetTopic = [
  ['vowel', 'Nguyên âm', '/ˈvaʊ.əl/', '🅰️', 'Gồm 5 chữ cái: U, E, O, A, I (Mẹo nhớ: U-E-O-A-I / Uể Uể).', 'English has 5 vowels: U, E, O, A, I.', 'Tiếng Anh có 5 nguyên âm: U, E, O, A, I.'],
  
  // 5 Vowels with exact matching representative icons (U: ☂️ Umbrella, E: 🥚 Egg, O: 🍊 Orange, A: 🍎 Apple, I: 🍦 Ice Cream)
  ['letter-u', 'Chữ U (Nguyên âm)', '/juː/', '☂️', 'Nguyên âm U trong mẹo nhớ U-E-O-A-I (U - Umbrella / Cây dù).', 'U is a vowel in English.', 'U là một nguyên âm trong tiếng Anh.'],
  ['letter-e', 'Chữ E (Nguyên âm)', '/iː/', '🥚', 'Nguyên âm E trong mẹo nhớ U-E-O-A-I (E - Egg / Quả trứng).', 'E is the most common vowel.', 'E là nguyên âm phổ biến nhất.'],
  ['letter-o', 'Chữ O (Nguyên âm)', '/əʊ/', '🍊', 'Nguyên âm O trong mẹo nhớ U-E-O-A-I (O - Orange / Quả cam).', 'O is a round vowel letter.', 'O là chữ cái nguyên âm tròn.'],
  ['letter-a', 'Chữ A (Nguyên âm)', '/eɪ/', '🍎', 'Nguyên âm A trong mẹo nhớ U-E-O-A-I (A - Apple / Quả táo).', 'A is the first vowel of the alphabet.', 'A là nguyên âm đầu tiên trong bảng chữ cái.'],
  ['letter-i', 'Chữ I (Nguyên âm)', '/aɪ/', '🍦', 'Nguyên âm I trong mẹo nhớ U-E-O-A-I (I - Ice cream / Ly kem).', 'I is an essential vowel letter.', 'I là một chữ cái nguyên âm quan trọng.'],

  ['consonant', 'Phụ âm', '/ˈkɒn.sə.nənt/', '🔤', 'Gồm 21 chữ cái còn lại: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z.', 'There are 21 consonants in the English alphabet.', 'Có 21 phụ âm trong bảng chữ cái tiếng Anh.'],

  // 21 Consonants with exact matching icons (B: 🍌 Banana, C: 🐱 Cat, D: 🐶 Dog, F: 🐟 Fish, G: 🦒 Giraffe, H: 🏠 House, J: 🧃 Juice, K: 🪁 Kite, L: 🦁 Lion, M: 🐒 Monkey, N: 📓 Notebook, P: ✏️ Pencil, Q: 👑 Queen, R: 🐰 Rabbit, S: ☀️ Sun, T: 🐯 Tiger, V: 🎻 Violin, W: 🍉 Watermelon, X: 🎷 Xylophone, Y: 🪀 Yo-yo, Z: 🦓 Zebra)
  ['letter-b', 'Chữ B (Phụ âm)', '/biː/', '🍌', 'Phụ âm B (B - Banana / Quả chuối).', 'B is a consonant.', 'B là một phụ âm.'],
  ['letter-c', 'Chữ C (Phụ âm)', '/siː/', '🐱', 'Phụ âm C (C - Cat / Con mèo).', 'C is a consonant.', 'C là một phụ âm.'],
  ['letter-d', 'Chữ D (Phụ âm)', '/diː/', '🐶', 'Phụ âm D (D - Dog / Con chó).', 'D is a consonant.', 'D là một phụ âm.'],
  ['letter-f', 'Chữ F (Phụ âm)', '/ef/', '🐟', 'Phụ âm F (F - Fish / Con cá).', 'F is a consonant.', 'F là một phụ âm.'],
  ['letter-g', 'Chữ G (Phụ âm)', '/dʒiː/', '🦒', 'Phụ âm G (G - Giraffe / Hươu cao cổ).', 'G is a consonant.', 'G là một phụ âm.'],
  ['letter-h', 'Chữ H (Phụ âm)', '/eɪtʃ/', '🏠', 'Phụ âm H (H - House / Ngôi nhà).', 'H is a consonant.', 'H là một phụ âm.'],
  ['letter-j', 'Chữ J (Phụ âm)', '/dʒeɪ/', '🧃', 'Phụ âm J (J - Juice / Nước ép).', 'J is a consonant.', 'J là một phụ âm.'],
  ['letter-k', 'Chữ K (Phụ âm)', '/keɪ/', '🪁', 'Phụ âm K (K - Kite / Con diều).', 'K is a consonant.', 'K là một phụ âm.'],
  ['letter-l', 'Chữ L (Phụ âm)', '/el/', '🦁', 'Phụ âm L (L - Lion / Con sư tử).', 'L is a consonant.', 'L là một phụ âm.'],
  ['letter-m', 'Chữ M (Phụ âm)', '/em/', '🐒', 'Phụ âm M (M - Monkey / Con khỉ).', 'M is a consonant.', 'M là một phụ âm.'],
  ['letter-n', 'Chữ N (Phụ âm)', '/en/', '📓', 'Phụ âm N (N - Notebook / Quyển vở).', 'N is a consonant.', 'N là một phụ âm.'],
  ['letter-p', 'Chữ P (Phụ âm)', '/piː/', '✏️', 'Phụ âm P (P - Pencil / Bút chì).', 'P is a consonant.', 'P là một phụ âm.'],
  ['letter-q', 'Chữ Q (Phụ âm)', '/kjuː/', '👑', 'Phụ âm Q (Q - Queen / Nữ hoàng).', 'Q is a consonant.', 'Q là một phụ âm.'],
  ['letter-r', 'Chữ R (Phụ âm)', '/ɑːr/', '🐰', 'Phụ âm R (R - Rabbit / Con thỏ).', 'R is a consonant.', 'R là một phụ âm.'],
  ['letter-s', 'Chữ S (Phụ âm)', '/es/', '☀️', 'Phụ âm S (S - Sun / Mặt trời).', 'S is a consonant.', 'S là một phụ âm.'],
  ['letter-t', 'Chữ T (Phụ âm)', '/tiː/', '🐯', 'Phụ âm T (T - Tiger / Con hổ).', 'T is a consonant.', 'T là một phụ âm.'],
  ['letter-v', 'Chữ V (Phụ âm)', '/viː/', '🎻', 'Phụ âm V (V - Violin / Đàn vĩ cầm).', 'V is a consonant.', 'V là một phụ âm.'],
  ['letter-w', 'Chữ W (Phụ âm)', '/ˈdʌb.əl.juː/', '🍉', 'Phụ âm W (W - Watermelon / Dưa hấu).', 'W is a consonant.', 'W là một phụ âm.'],
  ['letter-x', 'Chữ X (Phụ âm)', '/eks/', '🎷', 'Phụ âm X (X - Xylophone / Đàn mộc cầm).', 'X is a consonant.', 'X là một phụ âm.'],
  ['letter-y', 'Chữ Y (Phụ âm)', '/waɪ/', '🪀', 'Phụ âm Y (Y - Yo-yo / Con quay yo-yo).', 'Y is mostly a consonant.', 'Y chủ yếu đóng vai trò phụ âm.'],
  ['letter-z', 'Chữ Z (Phụ âm)', '/zed/', '🦓', 'Phụ âm Z (Z - Zebra / Ngựa vằn).', 'Z is the last consonant.', 'Z là phụ âm cuối cùng.'],

  // Concepts
  ['alphabet', 'Bảng chữ cái', '/ˈæl.fə.bet/', '🔤', 'Gồm 26 chữ cái (5 nguyên âm + 21 phụ âm).', 'The alphabet has 26 letters.', 'Bảng chữ cái có 26 chữ cái.'],
  ['letter', 'Chữ cái', '/ˈlet.ər/', '🔤', 'Kí tự cơ bản tạo nên từ vựng.', 'Each letter has a name and a sound.', 'Mỗi chữ cái có một tên gọi và phát âm.'],
  ['uppercase', 'Chữ in hoa', '/ˈʌp.ə.keɪs/', '🔠', 'Chữ viết hoa ở đầu câu hoặc tên riêng.', 'Capital letters start sentences.', 'Chữ in hoa bắt đầu câu.'],
  ['lowercase', 'Chữ in thường', '/ˈləʊ.ə.keɪs/', '🔡', 'Chữ viết thường trong câu văn.', 'Small letters are lowercase.', 'Chữ nhỏ là chữ in thường.'],
  ['phonetics', 'Ngữ âm học', '/fəˈnet.ɪks/', '🎙️', 'Học cách phát âm chuẩn IPA.', 'Phonetics helps us pronounce clearly.', 'Ngữ âm học giúp chúng mình phát âm rõ ràng.'],
  ['pronunciation', 'Sự phát âm', '/prəˌnʌn.siˈeɪ.ʃən/', '🔊', 'Phát âm chuẩn xác và tự nhiên.', 'Good pronunciation builds confidence.', 'Phát âm tốt tạo sự tự tin.']
];

// Topics sorted in strict numerical order 2 -> 40 with exact matching icons
const topicDictionary = {
  math: [
    ['zero', 'số 0', '/ˈzɪə.rəʊ/', '0️⃣'], ['one', 'số 1', '/wʌn/', '1️⃣'], ['two', 'số 2', '/tuː/', '2️⃣'],
    ['three', 'số 3', '/θriː/', '3️⃣'], ['four', 'số 4', '/fɔːr/', '4️⃣'], ['five', 'số 5', '/faɪv/', '5️⃣'],
    ['ten', 'số 10', '/ten/', '🔟'], ['hundred', 'hàng trăm', '/ˈhʌn.drəd/', '💯'], ['thousand', 'hàng nghìn', '/ˈθaʊ.zənd/', '🔢'],
    ['addition', 'phép cộng', '/əˈdɪʃ.ən/', '➕'], ['subtraction', 'phép trừ', '/səbˈtræk.ʃən/', '➖'], ['multiplication', 'phép nhân', '/ˌmʌl.tɪ.plɪˈkeɪ.ʃən/', '✖️'],
    ['division', 'phép chia', '/dɪˈvɪʒ.ən/', '➗'], ['fraction', 'phân số', '/ˈfræk.ʃən/', '🍕'], ['calculate', 'tính toán', '/ˈkæl.kjə.leɪt/', '🧮']
  ],
  colors: [
    ['red', 'màu đỏ', '/red/', '🔴'], ['blue', 'màu xanh dương', '/bluː/', '🔵'], ['yellow', 'màu vàng', '/ˈjel.əʊ/', '🟡'],
    ['green', 'màu xanh lá', '/ɡriːn/', '🟢'], ['pink', 'màu hồng', '/pɪŋk/', '🌸'], ['purple', 'màu tím', '/ˈpɜː.pəl/', '🟣'],
    ['orange', 'màu cam', '/ˈɒr.ɪndʒ/', '🍊'], ['brown', 'màu nâu', '/braʊn/', '🟤'], ['black', 'màu đen', '/blæk/', '🖤'],
    ['white', 'màu trắng', '/waɪt/', '⚪'], ['rainbow', 'cầu vồng', '/ˈreɪn.bəʊ/', '🌈']
  ],
  shapes: [
    ['circle', 'hình tròn', '/ˈsɜː.kəl/', '⭕'], ['square', 'hình vuông', '/skweər/', '⏹️'], ['triangle', 'hình tam giác', '/ˈtraɪ.æŋ.ɡəl/', '🔺'],
    ['rectangle', 'hình chữ nhật', '/ˈrek.tæŋ.ɡəl/', '▭'], ['oval', 'hình bầu dục', '/ˈəʊ.vəl/', '🥚'], ['star', 'hình ngôi sao', '/stɑːr/', '⭐'],
    ['heart', 'hình trái tim', '/hɑːt/', '❤️'], ['cube', 'hình lập phương', '/kjuːb/', '🧊'], ['huge', 'to lớn', '/hjuːdʒ/', '🐘'], ['tiny', 'nhỏ bé', '/ˈtaɪ.ni/', '🐜']
  ],
  personal: [
    ['name', 'tên', '/neɪm/', '🪪'], ['age', 'tuổi', '/eɪdʒ/', '🎂'], ['birthday', 'ngày sinh', '/ˈbɜːθ.deɪ/', '🎉'],
    ['nationality', 'quốc tịch', '/ˌnæʃ.ənˈæl.ə.ti/', '🌐'], ['hometown', 'quê quán', '/ˈhəʊm.taʊn/', '🏡'], ['address', 'địa chỉ', '/əˈdres/', '📍'],
    ['hobby', 'sở thích', '/ˈhɒb.i/', '🎨'], ['dream', 'ước mơ', '/driːm/', '🌟']
  ],
  family: [
    ['father', 'bố/cha', '/ˈfɑː.ðər/', '👨'], ['mother', 'mẹ', '/ˈmʌð.ər/', '👩'], ['brother', 'anh/em trai', '/ˈbrʌð.ər/', '👦'],
    ['sister', 'chị/em gái', '/ˈsɪs.tər/', '👧'], ['grandfather', 'ông nội/ngoại', '/ˈɡræn.fɑː.ðər/', '👴'], ['grandmother', 'bà nội/ngoại', '/ˈɡræn.mʌð.ər/', '👵'],
    ['uncle', 'chú/bác/cậu', '/ˈʌŋ.kəl/', '👨‍💼'], ['aunt', 'cô/dì/thím', '/ɑːnt/', '👩‍💼'], ['cousin', 'anh chị em họ', '/ˈkʌz.ən/', '🧒']
  ],
  friends: [
    ['friend', 'bạn bè', '/frend/', '🤝'], ['bestfriend', 'bạn thân', '/best frend/', '💖'], ['classmate', 'bạn cùng lớp', '/ˈklɑːs.meɪt/', '🧑‍🎓'],
    ['neighbor', 'hàng xóm', '/ˈneɪ.bər/', '🏡'], ['friendship', 'tình bạn', '/ˈfrend.ʃɪp/', '👫'], ['sharing', 'sự chia sẻ', '/ˈʃeə.rɪŋ/', '🎁']
  ],
  body: [
    ['head', 'đầu', '/hed/', '🗣️'], ['hair', 'tóc', '/heər/', '💇'], ['face', 'khuôn mặt', '/feɪs/', '😊'],
    ['eye', 'mắt', '/aɪ/', '👁️'], ['ear', 'tai', '/ɪər/', '👂'], ['nose', 'mũi', '/nəʊz/', '👃'],
    ['mouth', 'miệng', '/maʊθ/', '👄'], ['tooth', 'răng', '/tuːθ/', '🦷'], ['hand', 'bàn tay', '/hænd/', '🤚'], ['heart', 'trái tim', '/hɑːt/', '❤️']
  ],
  health: [
    ['healthy', 'khỏe mạnh', '/ˈhel.θi/', '💪'], ['cough', 'ho', '/kɒf/', '🗣️'], ['fever', 'sốt', '/ˈfiː.vər/', '🌡️'],
    ['doctor', 'bác sĩ', '/ˈdɒk.tər/', '🩺'], ['nurse', 'y tá', '/nɜːs/', '🧑‍⚕️'], ['hospital', 'bệnh viện', '/ˈhɒs.pɪ.təl/', '🏥'], ['medicine', 'thuốc', '/ˈmed.sən/', '💊']
  ],
  emotions: [
    ['happy', 'vui vẻ', '/ˈhæp.i/', '😊'], ['sad', 'buồn rầu', '/sæd/', '😢'], ['angry', 'tức giận', '/ˈæŋ.ɡri/', '😡'],
    ['scared', 'sợ hãi', '/skeəd/', '😱'], ['brave', 'dũng cảm', '/breɪv/', '🛡️'], ['kind', 'tốt bụng', '/kaɪnd/', '💖'], ['honest', 'trung thực', '/ˈɒn.ɪst/', '🤝']
  ],
  daily: [
    ['wakeup', 'thức dậy', '/weɪk ʌp/', '⏰'], ['washface', 'rửa mặt', '/wɒʃ feɪs/', '🚰'], ['shower', 'tắm vòi sen', '/ˈʃaʊ.ər/', '🚿'],
    ['breakfast', 'bữa sáng', '/ˈbrek.fəst/', '🍳'], ['lunch', 'bữa trưa', '/lʌntʃ/', '🍱'], ['dinner', 'bữa tối', '/ˈdɪn.ər/', '🍲'], ['sleeping', 'đi ngủ', '/ˈsliː.pɪŋ/', '🌙']
  ],
  housing: [
    ['house', 'ngôi nhà', '/haʊs/', '🏠'], ['livingroom', 'phòng khách', '/ˈlɪv.ɪŋ ˌruːm/', '🛋️'], ['bedroom', 'phòng ngủ', '/ˈbed.ruːm/', '🛏️'],
    ['kitchen', 'phòng bếp', '/ˈkɪtʃ.ən/', '🍳'], ['bathroom', 'phòng tắm', '/ˈbɑːθ.ruːm/', '🛁'], ['garden', 'sân vườn', '/ˈɡɑː.dən/', '🏡']
  ],
  food: [
    ['rice', 'cơm/gạo', '/raɪs/', '🍚'], ['noodle', 'mì phở', '/ˈnuː.dəl/', '🍜'], ['bread', 'bánh mì', '/bred/', '🍞'],
    ['beef', 'thịt bò', '/biːf/', '🥩'], ['chicken', 'thịt gà', '/ˈtʃɪk.ɪn/', '🍗'], ['fish', 'cá tươi', '/fɪʃ/', '🐟'], ['egg', 'quả trứng', '/eɡ/', '🥚']
  ],
  drinks: [
    ['water', 'nước lọc', '/ˈwɔː.tər/', '💧'], ['milk', 'sữa tươi', '/mɪlk/', '🥛'], ['juice', 'nước ép', '/dʒuːs/', '🧃'], ['tea', 'trà thanh nhiệt', '/tiː/', '🍵'], ['smoothie', 'sinh tố', '/ˈsmuː.ði/', '🥤']
  ],
  cooking: [
    ['cook', 'nấu ăn', '/kʊk/', '👨‍🍳'], ['boil', 'luộc', '/bɔɪl/', '🍲'], ['fry', 'chiên/rán', '/fraɪ/', '🍳'], ['bake', 'nướng bánh', '/beɪk/', '🥧'], ['slice', 'thái lát', '/slaɪs/', '🔪']
  ],
  clothes: [
    ['shirt', 'áo sơ mi', '/ʃɜːt/', '👔'], ['tshirt', 'áo thun', '/ˈtiː.ʃɜːt/', '👕'], ['jacket', 'áo khoác', '/ˈdʒæk.ɪt/', '🧥'], ['skirt', 'chân váy', '/skɜːt/', '👗'], ['shoes', 'đôi giày', '/ʃuːz/', '👟']
  ],
  school: [
    ['school', 'trường học', '/skuːl/', '🏫'], ['classroom', 'lớp học', '/ˈklɑːs.ruːm/', '🏫'], ['teacher', 'giáo viên', '/ˈtiː.tʃər/', '🧑‍🏫'], ['student', 'học sinh', '/ˈstjuː.dənt/', '🧑‍🎓'], ['library', 'thư viện', '/ˈlaɪ.brər.i/', '📖']
  ],
  supplies: [
    ['book', 'cuốn sách', '/bʊk/', '📚'], ['notebook', 'quyển vở', '/ˈnəʊt.bʊk/', '📓'], ['pencil', 'bút chì', '/ˈpen.səl/', '✏️'], ['ruler', 'thước kẻ', '/ˈruː.lər/', '📏'], ['eraser', 'cục tẩy', '/ɪˈreɪ.zər/', '🧹'], ['backpack', 'ba lô', '/ˈbæk.pæk/', '🎒']
  ],
  subjects: [
    ['english', 'tiếng Anh', '/ˈɪŋ.ɡlɪʃ/', '🇬🇧'], ['maths', 'toán học', '/mæθs/', '🔢'], ['science', 'khoa học', '/ˈsaɪ.əns/', '🔬'], ['history', 'lịch sử', '/ˈhɪs.tər.i/', '📜'], ['geography', 'địa lý', '/dʒiˈɒɡ.rə.fi/', '🗺️']
  ],
  toys: [
    ['doll', 'búp bê', '/dɒl/', '🪆'], ['robot', 'người máy', '/ˈrəʊ.bɒt/', '🤖'], ['puzzle', 'xếp hình', '/ˈpʌz.əl/', '🧩'], ['ball', 'quả bóng', '/bɔːl/', '⚽'], ['kite', 'con diều', '/kaɪt/', '🪁']
  ],
  animals: [
    ['dog', 'con chó', '/dɒɡ/', '🐶'], ['cat', 'con mèo', '/kæt/', '🐱'], ['lion', 'sư tử', '/ˈlaɪ.ən/', '🦁'], ['tiger', 'con hổ', '/ˈtaɪ.ɡər/', '🐯'], ['elephant', 'con voi', '/ˈel.ɪ.fənt/', '🐘'], ['dolphin', 'cá heo', '/ˈdɒl.fɪn/', '🐬']
  ],
  nature: [
    ['tree', 'cây xanh', '/triː/', '🌳'], ['flower', 'bông hoa', '/flaʊ.ər/', '🌸'], ['forest', 'khu rừng', '/ˈfɒr.ɪst/', '🌲'], ['mountain', 'ngọn núi', '/ˈmaʊn.tɪn/', '⛰️'], ['river', 'dòng sông', '/ˈrɪv.ər/', '🏞️'], ['ocean', 'đại dương', '/ˈəʊ.ʃən/', '🌊']
  ],
  weather: [
    ['sunny', 'trời nắng', '/ˈsʌn.i/', '☀️'], ['rainy', 'trời mưa', '/ˈreɪ.ni/', '🌧️'], ['cloudy', 'nhiều mây', '/ˈklaʊ.di/', '☁️'], ['windy', 'có gió', '/ˈwɪn.di/', '🌬️'], ['snowy', 'có tuyết', '/ˈsnəʊ.i/', '❄️']
  ],
  seasons: [
    ['spring', 'mùa xuân', '/sprɪŋ/', '🌸'], ['summer', 'mùa hè', '/ˈsʌm.ər/', '☀️'], ['autumn', 'mùa thu', '/ˈɔː.təm/', '🍂'], ['winter', 'mùa đông', '/ˈwɪn.tər/', '❄️']
  ],
  time: [
    ['second', 'giây', '/ˈsek.ənd/', '⏱️'], ['minute', 'phút', '/ˈmɪn.ɪt/', '⏲️'], ['hour', 'giờ', '/aʊər/', '⏰'], ['today', 'hôm nay', '/təˈdeɪ/', '📅'], ['tomorrow', 'ngày mai', '/təˈmɒr.əʊ/', '🌅']
  ],
  transport: [
    ['bicycle', 'xe đạp', '/ˈbaɪ.sɪ.kəl/', '🚲'], ['car', 'xe ô tô', '/kɑːr/', '🚗'], ['bus', 'xe buýt', '/bʌs/', '🚌'], ['train', 'tàu hỏa', '/treɪn/', '🚂'], ['airplane', 'máy bay', '/ˈeə.pleɪn/', '✈️']
  ],
  places: [
    ['hospital', 'bệnh viện', '/ˈhɒs.pɪ.təl/', '🏥'], ['park', 'công viên', '/pɑːk/', '🏞️'], ['library', 'thư viện', '/ˈlaɪ.brər.i/', '📖'], ['supermarket', 'siêu thị', '/ˈsuː.pəˌmɑː.kɪt/', '🛒']
  ],
  jobs: [
    ['doctor', 'bác sĩ', '/ˈdɒk.tər/', '🩺'], ['teacher', 'giáo viên', '/ˈtiː.tʃər/', '🧑‍🏫'], ['firefighter', 'lính cứu hỏa', '/ˈfaɪəˌfaɪ.tər/', '👨‍🚒'], ['chef', 'đầu bếp', '/ʃef/', '👨‍🍳']
  ],
  shopping: [
    ['money', 'tiền bạc', '/ˈmʌn.i/', '💵'], ['price', 'giá cả', '/praɪs/', '🏷️'], ['discount', 'giảm giá', '/ˈdɪs.kaʊnt/', '🎉'], ['receipt', 'biên lai', '/rɪˈsiːt/', '📃']
  ],
  travel: [
    ['passport', 'hộ chiếu', '/ˈpɑːs.pɔːt/', '🛂'], ['luggage', 'hành lý', '/ˈlʌɡ.ɪdʒ/', '🧳'], ['hotel', 'khách sạn', '/həʊˈtel/', '🏨'], ['flight', 'chuyến bay', '/flaɪt/', '✈️']
  ],
  sports: [
    ['soccer', 'bóng đá', '/ˈsɒk.ər/', '⚽'], ['swimming', 'bơi lội', '/ˈswɪm.ɪŋ/', '🏊'], ['tennis', 'quần vợt', '/ˈten.ɪs/', '🎾'], ['running', 'chạy bộ', '/ˈrʌn.ɪŋ/', '🏃']
  ],
  hobbies: [
    ['reading', 'đọc sách', '/ˈriː.dɪŋ/', '📖'], ['painting', 'vẽ tranh', '/ˈpeɪn.tɪŋ/', '🎨'], ['singing', 'ca hát', '/ˈsɪŋ.ɪŋ/', '🎤']
  ],
  art: [
    ['music', 'âm nhạc', '/ˈmjuː.zɪk/', '🎶'], ['painting', 'hội họa', '/ˈpeɪn.tɪŋ/', '🎨'], ['cinema', 'điện ảnh', '/ˈsɪn.ə.mɑː/', '🎬']
  ],
  tech: [
    ['computer', 'máy tính', '/kəmˈpjuː.tər/', '💻'], ['smartphone', 'điện thoại', '/ˈsmɑːt.fəʊn/', '📱'], ['internet', 'mạng internet', '/ˈɪn.tə.net/', '🌐']
  ],
  communication: [
    ['hello', 'lời chào', '/həˈləʊ/', '👋'], ['goodbye', 'tạm biệt', '/ɡʊdˈbaɪ/', '👋'], ['thankyou', 'cảm ơn', '/ˈθæŋk ˌjuː/', '🙏'], ['sorry', 'xin lỗi', '/ˈsɒr.i/', '💔']
  ],
  festivals: [
    ['birthday', 'sinh nhật', '/ˈbɜːθ.deɪ/', '🎂'], ['christmas', 'giáng sinh', '/ˈkrɪs.məs/', '🎄'], ['newyear', 'năm mới', '/njuː jɪər/', '🎆']
  ],
  culture: [
    ['vietnam', 'Việt Nam', '/ˌvjetˈnæm/', '🇻🇳'], ['culture', 'văn hóa', '/ˈkʌl.tʃər/', '⛩️'], ['tradition', 'truyền thống', '/trəˈdɪʃ.ən/', '📜']
  ],
  environment: [
    ['recycle', 'tái chế', '/ˌriːˈsaɪ.kəl/', '♻️'], ['clean', 'sạch sẻ', '/kliːn/', '✨'], ['earth', 'Trái Đất', '/ɜːθ/', '🌍']
  ],
  science: [
    ['science', 'khoa học', '/ˈsaɪ.əns/', '🔬'], ['planet', 'hành tinh', '/ˈplæn.ɪt/', '🪐'], ['astronaut', 'phi hành gia', '/ˈæs.trə.nɔːt/', '👨‍🚀']
  ],
  lifeskills: [
    ['discipline', 'kỷ luật', '/ˈdɪs.ə.plɪn/', '🎯'], ['creativity', 'sự sáng tạo', '/ˌkriː.eɪˈtɪv.ə.ti/', '💡'], ['empathy', 'thấu cảm', '/ˈem.pə.θi/', '❤️']
  ]
};

const finalItems = [];
const set = new Set();
let count = 1;

// 1. Topic 1 (Alphabet)
alphabetTopic.forEach(([w, m, ipa, img, hint, s, sVi]) => {
  const low = w.toLowerCase();
  if (!set.has(low)) {
    set.add(low);
    finalItems.push({
      id: `vocab-${count++}`,
      word: w,
      ipa: ipa,
      meaning: m,
      category: 'alphabet',
      level: 'all',
      image: img,
      sentence: s || `Minh Anh studies "${w}" in Topic 1.`,
      sentenceVi: sVi || `Minh Anh học từ "${w}" (${m}) trong Chủ Đề 1.`,
      hint: hint || `Chủ đề 1: ${m}`
    });
  }
});

// 2. Remaining topics (2 -> 40)
VOCAB_CATEGORIES.forEach(cat => {
  if (cat.id === 'all' || cat.id === 'alphabet') return;
  const list = topicDictionary[cat.id] || [];
  list.forEach(([w, m, ipa, img]) => {
    const low = w.toLowerCase();
    if (!set.has(low)) {
      set.add(low);
      finalItems.push({
        id: `vocab-${count++}`,
        word: w,
        ipa: ipa,
        meaning: m,
        category: cat.id,
        level: 'all',
        image: img,
        sentence: `Minh Anh practices "${w}" in lesson ${cat.name}.`,
        sentenceVi: `Minh Anh học từ "${w}" (${m}) trong chủ đề ${cat.name}.`,
        hint: `Chủ đề ${cat.name}: ${m}`
      });
    }
  });
});

COURSE_LEVELS[0].targetWords = finalItems.length;

const fileHeader = `// Unified Master English Vocabulary Database & Course Structure for Kids Learning
// Single Consolidated Level ("all"), Strictly Ordered with Exact Matching Icons

export const COURSE_LEVELS = ${JSON.stringify(COURSE_LEVELS, null, 2)};

export const VOCAB_CATEGORIES = ${JSON.stringify(VOCAB_CATEGORIES, null, 2)};

export const VOCABULARY_DATABASE = ${JSON.stringify(finalItems, null, 2)};
`;

const dest = path.join(__dirname, '../client/src/constants/kidsVocabularyDatabase.js');
fs.writeFileSync(dest, fileHeader, 'utf-8');
console.log('SUCCESSFULLY UPDATED EXACT MATCHING ICONS FOR ALL VOCABULARY! TOTAL ITEMS:', finalItems.length);
