const fs = require('fs');
const path = require('path');

const VOCAB_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Chủ Đề (40 Chủ Đề)', icon: '🌈' },
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

// Curated English vocabulary dictionary grouped by topic
const topicDictionary = {
  alphabet: [
    ['alphabet', 'bảng chữ cái', '/ˈæl.fə.bet/', '🔤'], ['vowel', 'nguyên âm', '/ˈvaʊ.əl/', '🅰️'], ['consonant', 'phụ âm', '/ˈkɒn.sə.nənt/', '🔤'],
    ['letter', 'chữ cái', '/ˈlet.ər/', '🔤'], ['uppercase', 'chữ in hoa', '/ˈʌp.ə.keɪs/', '🔠'], ['lowercase', 'chữ in thường', '/ˈləʊ.ə.keɪs/', '🔡'],
    ['phonetics', 'ngữ âm', '/fəˈnet.ɪks/', '🎙️'], ['pronunciation', 'sự phát âm', '/prəˌnʌn.siˈeɪ.ʃən/', '🔊'], ['syllable', 'âm tiết', '/ˈsɪl.ə.bəl/', '🎶'],
    ['intonation', 'ngữ điệu', '/ˌɪn.təˈneɪ.ʃən/', '📈'], ['stress', 'trọng âm', '/stres/', '🎯'], ['homophone', 'từ đồng âm', '/ˈhɒm.ə.fəʊn/', '🎧'],
    ['spelling', 'chính tả', '/ˈspel.ɪŋ/', '✍️'], ['rhyme', 'vần điệu', '/raɪm/', '🎵'], ['dictation', 'chính tả đọc nghe', '/dɪkˈteɪ.ʃən/', '📝']
  ],
  math: [
    ['zero', 'số 0', '/ˈzɪə.rəʊ/', '0️⃣'], ['one', 'số 1', '/wʌn/', '1️⃣'], ['ten', 'số 10', '/ten/', '🔟'],
    ['hundred', 'hàng trăm', '/ˈhʌn.drəd/', '💯'], ['thousand', 'hàng nghìn', '/ˈθaʊ.zənd/', '🔢'], ['million', 'hàng triệu', '/ˈmɪl.jən/', '💎'],
    ['addition', 'phép cộng', '/əˈdɪʃ.ən/', '➕'], ['subtraction', 'phép trừ', '/səbˈtræk.ʃən/', '➖'], ['multiplication', 'phép nhân', '/ˌmʌl.tɪ.plɪˈkeɪ.ʃən/', '✖️'],
    ['division', 'phép chia', '/dɪˈvɪʒ.ən/', '➗'], ['fraction', 'phân số', '/ˈfræk.ʃən/', '🍕'], ['decimal', 'số thập phân', '/ˈdes.ɪ.məl/', '🔢'],
    ['percent', 'phần trăm', '/pəˈsent/', '📊'], ['even', 'số chẵn', '/ˈiː.vən/', '2️⃣'], ['odd', 'số lẻ', '/ɒd/', '1️⃣'],
    ['equation', 'phương trình', '/ɪˈkweɪ.ʒən/', '📐'], ['geometry', 'hình học', '/dʒiˈɒm.ə.tri/', '📏'], ['calculate', 'tính toán', '/ˈkæl.kjə.leɪt/', '🧮']
  ],
  colors: [
    ['red', 'màu đỏ', '/red/', '🔴'], ['blue', 'màu xanh dương', '/bluː/', '🔵'], ['yellow', 'màu vàng', '/ˈjel.əʊ/', '🟡'],
    ['green', 'màu xanh lá', '/ɡriːn/', '🟢'], ['pink', 'màu hồng', '/pɪŋk/', '🌸'], ['purple', 'màu tím', '/ˈpɜː.pəl/', '🟣'],
    ['orange', 'màu cam', '/ˈɒr.ɪndʒ/', '🟠'], ['brown', 'màu nâu', '/braʊn/', '🟤'], ['black', 'màu đen', '/blæk/', '🖤'],
    ['white', 'màu trắng', '/waɪt/', '⚪'], ['gray', 'màu xám', '/ɡreɪ/', '🩶'], ['bright', 'màu sáng', '/braɪt/', '✨'],
    ['dark', 'màu đậm', '/dɑːk/', '🌑'], ['pastel', 'màu nhạt', '/pæsˈtel/', '🎨'], ['rainbow', 'cầu vồng', '/ˈreɪn.bəʊ/', '🌈']
  ],
  shapes: [
    ['circle', 'hình tròn', '/ˈsɜː.kəl/', '⭕'], ['square', 'hình vuông', '/skweər/', '⏹️'], ['triangle', 'hình tam giác', '/ˈtraɪ.æŋ.ɡəl/', '🔺'],
    ['rectangle', 'hình chữ nhật', '/ˈrek.tæŋ.ɡəl/', '▭'], ['oval', 'hình bầu dục', '/ˈəʊ.vəl/', '🥚'], ['star', 'hình ngôi sao', '/stɑːr/', '⭐'],
    ['heart', 'hình trái tim', '/hɑːt/', '❤️'], ['diamond', 'hình thoi', '/ˈdaɪə.mənd/', '🔷'], ['cube', 'hình lập phương', '/kjuːb/', '🧊'],
    ['sphere', 'hình cầu', '/sfɪər/', '⚽'], ['huge', 'to lớn', '/hjuːdʒ/', '🐘'], ['tiny', 'nhỏ bé', '/ˈtaɪ.ni/', '🐜'],
    ['tall', 'cao', '/tɔːl/', '🦒'], ['short', 'thấp/ngắn', '/ʃɔːt/', '🐕'], ['wide', 'rộng', '/waɪd/', '↔️']
  ],
  personal: [
    ['name', 'tên', '/neɪm/', '🪪'], ['age', 'tuổi', '/eɪdʒ/', '🎂'], ['birthday', 'ngày sinh', '/ˈbɜːθ.deɪ/', '🎉'],
    ['nationality', 'quốc tịch', '/ˌnæʃ.ənˈæl.ə.ti/', '🌐'], ['hometown', 'quê quán', '/ˈhəʊm.taʊn/', '🏡'], ['address', 'địa chỉ', '/əˈdres/', '📍'],
    ['email', 'hộp thư điện tử', '/ˈiː.meɪl/', '📧'], ['hobby', 'sở thích', '/ˈhɒb.i/', '🎨'], ['habit', 'thói quen', '/ˈhæb.ɪt/', '⏰'],
    ['dream', 'ước mơ', '/driːm/', '🌟'], ['strength', 'điểm mạnh', '/streŋθ/', '💪'], ['weakness', 'điểm yếu', '/ˈwiːk.nəs/', '🌱'],
    ['future', 'tương lai', '/ˈfjuː.tʃər/', '🚀'], ['goal', 'mục tiêu', '/ɡəʊl/', '🎯'], ['identity', 'danh tính', '/aɪˈden.tə.ti/', '👤']
  ],
  family: [
    ['father', 'bố/cha', '/ˈfɑː.ðər/', '👨'], ['mother', 'mẹ', '/ˈmʌð.ər/', '👩'], ['brother', 'anh/em trai', '/ˈbrʌð.ər/', '👦'],
    ['sister', 'chị/em gái', '/ˈsɪs.tər/', '👧'], ['grandfather', 'ông nội/ngoại', '/ˈɡræn.fɑː.ðər/', '👴'], ['grandmother', 'bà nội/ngoại', '/ˈɡræn.mʌð.ər/', '👵'],
    ['uncle', 'chú/bác/cậu', '/ˈʌŋ.kəl/', '👨‍💼'], ['aunt', 'cô/dì/thím', '/ɑːnt/', '👩‍💼'], ['cousin', 'anh chị em họ', '/ˈkʌz.ən/', '🧒'],
    ['nephew', 'cháu trai', '/ˈnef.juː/', '👦'], ['niece', 'cháu gái', '/niːs/', '👧'], ['parents', 'phụ huynh', '/ˈpeə.rənts/', '👨‍👩‍👧'],
    ['household', 'hộ gia đình', '/ˈhaʊs.həʊld/', '🏡'], ['chores', 'việc nhà', '/tʃɔːz/', '🧹'], ['affection', 'tình cảm', '/əˈfek.ʃən/', '❤️']
  ],
  friends: [
    ['friend', 'bạn bè', '/frend/', '🤝'], ['bestfriend', 'bạn thân', '/best frend/', '💖'], ['classmate', 'bạn cùng lớp', '/ˈklɑːs.meɪt/', '🧑‍🎓'],
    ['neighbor', 'hàng xóm', '/ˈneɪ.bər/', '🏡'], ['friendship', 'tình bạn', '/ˈfrend.ʃɪp/', '👫'], ['sharing', 'sự chia sẻ', '/ˈʃeə.rɪŋ/', '🎁'],
    ['helping', 'sự giúp đỡ', '/ˈhel.pɪŋ/', '🆘'], ['apology', 'lời xin lỗi', '/əˈpɒl.ə.dʒi/', '💔'], ['thanks', 'lời cảm ơn', '/θæŋks/', '🙏'],
    ['forgiveness', 'sự tha thứ', '/fəˈɡɪv.nəs/', '🕊️'], ['teamwork', 'làm việc nhóm', '/ˈtiːm.wɜːk/', '🧩'], ['respect', 'sự tôn trọng', '/rɪˈspekt/', '🌟']
  ],
  body: [
    ['head', 'đầu', '/hed/', '🗣️'], ['hair', 'tóc', '/heər/', '💇'], ['face', 'khuôn mặt', '/feɪs/', '😊'],
    ['eye', 'mắt', '/aɪ/', '👁️'], ['ear', 'tai', '/ɪər/', '👂'], ['nose', 'mũi', '/nəʊz/', '👃'],
    ['mouth', 'miệng', '/maʊθ/', '👄'], ['tooth', 'răng', '/tuːθ/', '🦷'], ['tongue', 'lưỡi', '/tʌŋ/', '👅'],
    ['neck', 'cổ', '/nek/', '👔'], ['shoulder', 'vai', '/ˈʃəʊl.dər/', '👔'], ['arm', 'cánh tay', '/ɑːm/', '💪'],
    ['hand', 'bàn tay', '/hænd/', '🤚'], ['finger', 'ngón tay', '/ˈfɪŋ.ɡər/', '🖐️'], ['heart', 'trái tim', '/hɑːt/', '❤️']
  ],
  health: [
    ['healthy', 'khỏe mạnh', '/ˈhel.θi/', '💪'], ['cough', 'ho', '/kɒf/', '🗣️'], ['fever', 'sốt', '/ˈfiː.vər/', '🌡️'],
    ['headache', 'đau đầu', '/ˈhed.eɪk/', '🤕'], ['stomachache', 'đau bụng', '/ˈstʌm.ək.eɪk/', '🤢'], ['hospital', 'bệnh viện', '/ˈhɒs.pɪ.təl/', '🏥'],
    ['doctor', 'bác sĩ', '/ˈdɒk.tər/', '🩺'], ['nurse', 'y tá', '/nɜːs/', '🧑‍⚕️'], ['medicine', 'thuốc', '/ˈmed.sən/', '💊'],
    ['hygiene', 'vệ sinh', '/ˈhaɪ.dʒiːn/', '🧼'], ['exercise', 'tập thể dục', '/ˈek.sə.saɪz/', '🏃'], ['sleep', 'giấc ngủ', '/sliːp/', '🌙']
  ],
  emotions: [
    ['happy', 'vui vẻ', '/ˈhæp.i/', '😊'], ['sad', 'buồn rầu', '/sæd/', '😢'], ['angry', 'tức giận', '/ˈæŋ.ɡri/', '😡'],
    ['scared', 'sợ hãi', '/skeəd/', '😱'], ['surprised', 'ngạc nhiên', '/səˈpraɪzd/', '😲'], ['proud', 'tự hào', '/praʊd/', '🦁'],
    ['excited', 'hào hứng', '/ɪkˈsaɪ.tɪd/', '🎉'], ['calm', 'bình tĩnh', '/kɑːm/', '🧘'], ['brave', 'dũng cảm', '/breɪv/', '🛡️'],
    ['kind', 'tốt bụng', '/kaɪnd/', '💖'], ['honest', 'trung thực', '/ˈɒn.ɪst/', '🤝'], ['patient', 'kiên nhẫn', '/ˈpeɪ.ʃənt/', '⏳']
  ],
  daily: [
    ['wakeup', 'thức dậy', '/weɪk ʌp/', '⏰'], ['washface', 'rửa mặt', '/wɒʃ feɪs/', '🚰'], ['shower', 'tắm vòi sen', '/ˈʃaʊ.ər/', '🚿'],
    ['breakfast', 'bữa sáng', '/ˈbrek.fəst/', '🍳'], ['lunch', 'bữa trưa', '/lʌntʃ/', '🍱'], ['dinner', 'bữa tối', '/ˈdɪn.ər/', '🍲'],
    ['studying', 'học bài', '/ˈstʌd.i.ɪŋ/', '📚'], ['reading', 'đọc sách', '/ˈriː.dɪŋ/', '📖'], ['sleeping', 'đi ngủ', '/ˈsliː.pɪŋ/', '🌙']
  ],
  housing: [
    ['house', 'ngôi nhà', '/haʊs/', '🏠'], ['livingroom', 'phòng khách', '/ˈlɪv.ɪŋ ˌruːm/', '🛋️'], ['bedroom', 'phòng ngủ', '/ˈbed.ruːm/', '🛏️'],
    ['kitchen', 'phòng bếp', '/ˈkɪtʃ.ən/', '🍳'], ['bathroom', 'phòng tắm', '/ˈbɑːθ.ruːm/', '🛁'], ['garden', 'sân vườn', '/ˈɡɑː.dən/', '🏡'],
    ['window', 'cửa sổ', '/ˈwɪn.dəʊ/', '🪟'], ['door', 'cửa chính', '/dɔːr/', '🚪'], ['furniture', 'đồ đạc nội thất', '/ˈfɜː.nɪ.tʃər/', '🛋️']
  ],
  food: [
    ['rice', 'cơm/gạo', '/raɪs/', '🍚'], ['noodle', 'mì phở', '/ˈnuː.dəl/', '🍜'], ['bread', 'bánh mì', '/bred/', '🍞'],
    ['beef', 'thịt bò', '/biːf/', '🥩'], ['chicken', 'thịt gà', '/ˈtʃɪk.ɪn/', '🍗'], ['fish', 'cá tươi', '/fɪʃ/', '🐟'],
    ['egg', 'quả trứng', '/eɡ/', '🥚'], ['vegetables', 'rau củ tươi', '/ˈvedʒ.tə.bəlz/', '🥦'], ['fruit', 'trái cây', '/fruːt/', '🍎']
  ],
  drinks: [
    ['water', 'nước lọc', '/ˈwɔː.tər/', '💧'], ['milk', 'sữa tươi', '/mɪlk/', '🥛'], ['juice', 'nước ép', '/dʒuːs/', '🧃'],
    ['tea', 'trà thanh nhiệt', '/tiː/', '🍵'], ['coffee', 'cà phê', '/ˈkɒf.i/', '☕'], ['smoothie', 'sinh tố', '/ˈsmuː.ði/', '🥤']
  ],
  cooking: [
    ['cook', 'nấu ăn', '/kʊk/', '👨‍🍳'], ['boil', 'luộc', '/bɔɪl/', '🍲'], ['fry', 'chiên/rán', '/fraɪ/', '🍳'],
    ['bake', 'nướng bánh', '/beɪk/', '🥧'], ['slice', 'thái lát', '/slaɪs/', '🔪'], ['ingredient', 'nguyên liệu', '/ɪnˈɡriː.di.ənt/', '🥕']
  ],
  clothes: [
    ['shirt', 'áo sơ mi', '/ʃɜːt/', '👔'], ['tshirt', 'áo thun', '/ˈtiː.ʃɜːt/', '👕'], ['jacket', 'áo khoác', '/ˈdʒæk.ɪt/', '🧥'],
    ['trousers', 'quần dài', '/ˈtraʊ.zəz/', '👖'], ['skirt', 'chân váy', '/skɜːt/', '👗'], ['shoes', 'đôi giày', '/ʃuːz/', '👟']
  ],
  school: [
    ['school', 'trường học', '/skuːl/', '🏫'], ['classroom', 'lớp học', '/ˈklɑːs.ruːm/', '🏫'], ['teacher', 'giáo viên', '/ˈtiː.tʃər/', '🧑‍🏫'],
    ['student', 'học sinh', '/ˈstjuː.dənt/', '🧑‍🎓'], ['library', 'thư viện', '/ˈlaɪ.brər.i/', '📖'], ['exam', 'bài kiểm tra', '/ɪɡˈzæm/', '📝']
  ],
  supplies: [
    ['book', 'cuốn sách', '/bʊk/', '📚'], ['notebook', 'quyển vở', '/ˈnəʊt.bʊk/', '📓'], ['pencil', 'bút chì', '/ˈpen.səl/', '✏️'],
    ['ruler', 'thước kẻ', '/ˈruː.lər/', '📏'], ['eraser', 'cục tẩy', '/ɪˈreɪ.zər/', '🧹'], ['backpack', 'ba lô', '/ˈbæk.pæk/', '🎒']
  ],
  subjects: [
    ['english', 'tiếng Anh', '/ˈɪŋ.ɡlɪʃ/', '🇬🇧'], ['maths', 'toán học', '/mæθs/', '🔢'], ['science', 'khoa học', '/ˈsaɪ.əns/', '🔬'],
    ['history', 'lịch sử', '/ˈhɪs.tər.i/', '📜'], ['geography', 'địa lý', '/dʒiˈɒɡ.rə.fi/', '🗺️'], ['music', 'âm nhạc', '/ˈmjuː.zɪk/', '🎵']
  ],
  toys: [
    ['doll', 'búp bê', '/dɒl/', '🪆'], ['robot', 'người máy', '/ˈrəʊ.bɒt/', '🤖'], ['puzzle', 'xếp hình', '/ˈpʌz.əl/', '🧩'],
    ['ball', 'quả bóng', '/bɔːl/', '⚽'], ['kite', 'con diều', '/kaɪt/', '🪁'], ['boardgame', 'trò chơi cờ', '/ˈbɔːd ɡeɪm/', '🎲']
  ],
  animals: [
    ['dog', 'con chó', '/dɒɡ/', '🐶'], ['cat', 'con mèo', '/kæt/', '🐱'], ['lion', 'sư tử', '/ˈlaɪ.ən/', '🦁'],
    ['tiger', 'con hổ', '/ˈtaɪ.ɡər/', '🐯'], ['elephant', 'con voi', '/ˈel.ɪ.fənt/', '🐘'], ['dolphin', 'cá heo', '/ˈdɒl.fɪn/', '🐬']
  ],
  nature: [
    ['tree', 'cây xanh', '/triː/', '🌳'], ['flower', 'bông hoa', '/flaʊ.ər/', '🌸'], ['forest', 'khu rừng', '/ˈfɒr.ɪst/', '🌲'],
    ['mountain', 'ngọn núi', '/ˈmaʊn.tɪn/', '⛰️'], ['river', 'dòng sông', '/ˈrɪv.ər/', '🏞️'], ['ocean', 'đại dương', '/ˈəʊ.ʃən/', '🌊']
  ],
  weather: [
    ['sunny', 'trời nắng', '/ˈsʌn.i/', '☀️'], ['rainy', 'trời mưa', '/ˈreɪ.ni/', '🌧️'], ['cloudy', 'nhiều mây', '/ˈklaʊ.di/', '☁️'],
    ['windy', 'có gió', '/ˈwɪn.di/', '🌬️'], ['snowy', 'có tuyết', '/ˈsnəʊ.i/', '❄️'], ['stormy', 'có bão', '/ˈstɔː.mi/', '🌩️']
  ],
  seasons: [
    ['spring', 'mùa xuân', '/sprɪŋ/', '🌸'], ['summer', 'mùa hè', '/ˈsʌm.ər/', '☀️'], ['autumn', 'mùa thu', '/ˈɔː.təm/', '🍂'],
    ['winter', 'mùa đông', '/ˈwɪn.tər/', '❄️'], ['season', 'mùa', '/ˈsiː.zən/', '🌿'], ['harvest', 'mùa thu hoạch', '/ˈhɑː.vɪst/', '🌾']
  ],
  time: [
    ['second', 'giây', '/ˈsek.ənd/', '⏱️'], ['minute', 'phút', '/ˈmɪn.ɪt/', '⏲️'], ['hour', 'giờ', '/aʊər/', '⏰'],
    ['today', 'hôm nay', '/təˈdeɪ/', '📅'], ['tomorrow', 'ngày mai', '/təˈmɒr.əʊ/', '🌅'], ['weekend', 'cuối tuần', '/ˌwiːkˈend/', '🎉']
  ],
  transport: [
    ['bicycle', 'xe đạp', '/ˈbaɪ.sɪ.kəl/', '🚲'], ['car', 'xe ô tô', '/kɑːr/', '🚗'], ['bus', 'xe buýt', '/bʌs/', '🚌'],
    ['train', 'tàu hỏa', '/treɪn/', '🚂'], ['airplane', 'máy bay', '/ˈeə.pleɪn/', '✈️'], ['ship', 'tàu thủy', '/ʃɪp/', '🛳️']
  ],
  places: [
    ['hospital', 'bệnh viện', '/ˈhɒs.pɪ.təl/', '🏥'], ['park', 'công viên', '/pɑːk/', '🏞️'], ['library', 'thư viện', '/ˈlaɪ.brər.i/', '📖'],
    ['museum', 'bảo tàng', '/mjuːˈziː.əm/', '🏛️'], ['supermarket', 'siêu thị', '/ˈsuː.pəˌmɑː.kɪt/', '🛒'], ['cinema', 'rạp chiếu phim', '/ˈsɪn.ə.mɑː/', '🎬']
  ],
  jobs: [
    ['doctor', 'bác sĩ', '/ˈdɒk.tər/', '🩺'], ['teacher', 'giáo viên', '/ˈtiː.tʃər/', '🧑‍🏫'], ['police', 'cảnh sát', '/pəˈliːs/', '👮'],
    ['firefighter', 'lính cứu hỏa', '/ˈfaɪəˌfaɪ.tər/', '👨‍🚒'], ['engineer', 'kỹ sư', '/ˌen.dʒɪˈnɪər/', '⚙️'], ['chef', 'đầu bếp', '/ʃef/', '👨‍🍳']
  ],
  shopping: [
    ['money', 'tiền bạc', '/ˈmʌn.i/', '💵'], ['price', 'giá cả', '/praɪs/', '🏷️'], ['discount', 'giảm giá', '/ˈdɪs.kaʊnt/', '🎉'],
    ['cashier', 'thu ngân', '/kæˈʃɪər/', '💳'], ['bill', 'hóa đơn', '/bɪl/', '🧾'], ['receipt', 'biên lai', '/rɪˈsiːt/', '📃']
  ],
  travel: [
    ['passport', 'hộ chiếu', '/ˈpɑːs.pɔːt/', '🛂'], ['luggage', 'hành lý', '/ˈlʌɡ.ɪdʒ/', '🧳'], ['hotel', 'khách sạn', '/həʊˈtel/', '🏨'],
    ['tourist', 'du khách', '/ˈtʊə.rɪst/', '🧳'], ['adventure', 'chuyến phiêu lưu', '/ədˈven.tʃər/', '🧭'], ['flight', 'chuyến bay', '/flaɪt/', '✈️']
  ],
  sports: [
    ['soccer', 'bóng đá', '/ˈsɒk.ər/', '⚽'], ['swimming', 'bơi lội', '/ˈswɪm.ɪŋ/', '🏊'], ['tennis', 'quần vợt', '/ˈten.ɪs/', '🎾'],
    ['badminton', 'cầu lông', '/ˈbæd.mɪn.tən/', '🏸'], ['running', 'chạy bộ', '/ˈrʌn.ɪŋ/', '🏃'], ['cycling', 'đạp xe', '/ˈsaɪ.klɪŋ/', '🚴']
  ],
  hobbies: [
    ['reading', 'đọc sách', '/ˈriː.dɪŋ/', '📖'], ['painting', 'vẽ tranh', '/ˈpeɪn.tɪŋ/', '🎨'], ['singing', 'ca hát', '/ˈsɪŋ.ɪŋ/', '🎤'],
    ['gardening', 'làm vườn', '/ˈɡɑː.dən.ɪŋ/', '🌱'], ['cooking', 'nấu ăn', '/ˈkʊk.ɪŋ/', '🍳'], ['photography', 'chụp ảnh', '/fəˈtɒɡ.rə.fi/', '📸']
  ],
  art: [
    ['music', 'âm nhạc', '/ˈmjuː.zɪk/', '🎶'], ['painting', 'hội họa', '/ˈpeɪn.tɪŋ/', '🎨'], ['sculpture', 'điêu khắc', '/ˈskʌlp.tʃər/', '🗿'],
    ['cinema', 'điện ảnh', '/ˈsɪn.ə.mɑː/', '🎬'], ['actor', 'diễn viên', '/ˈæk.tər/', '🎭'], ['orchestra', 'dàn nhạc', '/ˈɔː.kɪ.strə/', '🎷']
  ],
  tech: [
    ['computer', 'máy tính', '/kəmˈpjuː.tər/', '💻'], ['laptop', 'máy tính xách tay', '/ˈlæp.tɒp/', '💻'], ['smartphone', 'điện thoại', '/ˈsmɑːt.fəʊn/', '📱'],
    ['internet', 'mạng internet', '/ˈɪn.tə.net/', '🌐'], ['software', 'phần mềm', '/ˈsɒft.weər/', '⚙️'], ['robotics', 'ngành robot', '/rəʊˈbɒt.ɪks/', '🤖']
  ],
  communication: [
    ['hello', 'lời chào', '/həˈləʊ/', '👋'], ['goodbye', 'tạm biệt', '/ɡʊdˈbaɪ/', '👋'], ['thankyou', 'cảm ơn', '/ˈθæŋk ˌjuː/', '🙏'],
    ['sorry', 'xin lỗi', '/ˈsɒr.i/', '💔'], ['please', 'làm ơn/xin phép', '/pliːz/', '🥺'], ['welcome', 'chào mừng', '/ˈwel.kəm/', '🤗']
  ],
  festivals: [
    ['birthday', 'sinh nhật', '/ˈbɜːθ.deɪ/', '🎂'], ['christmas', 'giáng sinh', '/ˈkrɪs.məs/', '🎄'], ['newyear', 'năm mới', '/njuː jɪər/', '🎆'],
    ['halloween', 'halloween', '/ˌhæl.əʊˈiːn/', '🎃'], ['easter', 'lễ phục sinh', '/ˈiː.stər/', '🥚'], ['wedding', 'đám cưới', '/ˈwed.ɪŋ/', '💒']
  ],
  culture: [
    ['vietnam', 'Việt Nam', '/ˌvjetˈnæm/', '🇻🇳'], ['culture', 'văn hóa', '/ˈkʌl.tʃər/', '⛩️'], ['tradition', 'truyền thống', '/trəˈdɪʃ.ən/', '📜'],
    ['custom', 'phong tục', '/ˈkʌs.təm/', '🏮'], ['language', 'ngôn ngữ', '/ˈlæŋ.ɡwɪdʒ/', '🗣️'], ['heritage', 'di sản', '/ˈher.ɪ.tɪdʒ/', '🏛️']
  ],
  environment: [
    ['pollution', 'ô nhiễm', '/pəˈluː.ʃən/', '🏭'], ['recycle', 'tái chế', '/ˌriːˈsaɪ.kəl/', '♻️'], ['eco', 'thân thiện môi trường', '/ˈiː.kəʊ/', '🌱'],
    ['forest', 'rừng rậm', '/ˈfɒr.ɪst/', '🌲'], ['energy', 'năng lượng sạch', '/ˈen.ə.dʒi/', '⚡'], ['earth', 'Trái Đất', '/ɜːθ/', '🌍']
  ],
  science: [
    ['science', 'khoa học', '/ˈsaɪ.əns/', '🔬'], ['planet', 'hành tinh', '/ˈplæn.ɪt/', '🪐'], ['galaxy', 'dải ngân hà', '/ˈɡæl.ək.si/', '🌌'],
    ['experiment', 'thí nghiệm', '/ɪkˈsper.ɪ.mənt/', '🧪'], ['astronaut', 'phi hành gia', '/ˈæs.trə.nɔːt/', '👨‍🚀'], ['universe', 'vũ trụ', '/ˈjuː.nɪ.vɜːs/', '🌌']
  ],
  lifeskills: [
    ['discipline', 'kỷ luật', '/ˈdɪs.ə.plɪn/', '🎯'], ['creativity', 'sự sáng tạo', '/ˌkriː.eɪˈtɪv.ə.ti/', '💡'], ['empathy', 'thấu cảm', '/ˈem.pə.θi/', '❤️'],
    ['resilience', 'sự kiên cường', '/rɪˈzɪl.jəns/', '🛡️'], ['teamwork', 'làm việc nhóm', '/ˈtiːm.wɜːk/', '🧩'], ['leadership', 'lãnh đạo', '/ˈliː.də.ʃɪp/', '🚩']
  ]
};

const finalItems = [];
const set = new Set();
let count = 1;
const levels = ['basic', 'elementary', 'intermediate', 'advanced'];

VOCAB_CATEGORIES.forEach(cat => {
  if (cat.id === 'all') return;
  const list = topicDictionary[cat.id] || [];
  list.forEach(([w, m, ipa, img]) => {
    const low = w.toLowerCase();
    if (!set.has(low)) {
      set.add(low);
      const lvl = levels[finalItems.length % levels.length];
      finalItems.push({
        id: `vocab-${count++}`,
        word: w,
        ipa: ipa,
        meaning: m,
        category: cat.id,
        level: lvl,
        image: img,
        sentence: `Minh Anh practices "${w}" in lesson ${cat.name}.`,
        sentenceVi: `Minh Anh học từ "${w}" (${m}) trong chủ đề ${cat.name}.`,
        hint: `Chủ đề ${cat.name}: ${m}`
      });
    }
  });
});

const fileHeader = `// 40 Comprehensive Topic English Vocabulary Database & Course Structure for Kids Learning
// Aligned with 40 Detailed User Topics & Modules (IPA, Context Sentences, Dynamic Icons)

export const COURSE_LEVELS = [
  {
    id: 'basic',
    name: 'Khóa 1: Cơ Bản (Basic - A1)',
    badge: 'Mầm Non & Lớp 1-2',
    color: 'from-cyan-500 to-blue-500 border-cyan-400 text-cyan-300',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Bảng chữ cái, Số đếm, Màu sắc, Hình dạng, Bộ phận cơ thể, Gia đình & Động vật.',
    icon: '🐣',
    targetWords: ${finalItems.filter(i => i.level === 'basic').length},
  },
  {
    id: 'elementary',
    name: 'Khóa 2: Sơ Cấp (Elementary - A2)',
    badge: 'Tiểu Học Lớp 3-5',
    color: 'from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Trường học, Đồ dùng học tập, Thức ăn, Đồ uống, Thời tiết, Mùa & Phương tiện giao thông.',
    icon: '🦁',
    targetWords: ${finalItems.filter(i => i.level === 'elementary').length},
  },
  {
    id: 'intermediate',
    name: 'Khóa 3: Trung Cấp (Intermediate - B1)',
    badge: 'THCS Lớp 6-9',
    color: 'from-purple-500 to-indigo-500 border-purple-400 text-purple-300',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Nghề nghiệp, Mua sắm, Du lịch, Thể thao, Sở thích, Nghệ thuật & Công nghệ.',
    icon: '🚀',
    targetWords: ${finalItems.filter(i => i.level === 'intermediate').length},
  },
  {
    id: 'advanced',
    name: 'Khóa 4: Nâng Cao (Advanced - B2/C1)',
    badge: 'THPT & Thần Đồng Ngoại Ngữ',
    color: 'from-pink-500 to-amber-500 border-pink-400 text-pink-300',
    bgBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'Môi trường, Khoa học vũ trụ, Kỹ năng sống, Văn hóa quốc tế & Giao tiếp chuyên sâu.',
    icon: '👑',
    targetWords: ${finalItems.filter(i => i.level === 'advanced').length},
  },
];

export const VOCAB_CATEGORIES = ${JSON.stringify(VOCAB_CATEGORIES, null, 2)};

export const VOCABULARY_DATABASE = ${JSON.stringify(finalItems, null, 2)};
`;

const dest = path.join(__dirname, '../client/src/constants/kidsVocabularyDatabase.js');
fs.writeFileSync(dest, fileHeader, 'utf-8');
console.log('POPULATED FULL 40 TOPICS VOCABULARY DATABASE! TOTAL ITEMS:', finalItems.length);
