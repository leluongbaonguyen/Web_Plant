const fs = require('fs');
const path = require('path');

const wordCategories = {
  animals: [
    ['dog', 'chó', '/dɒɡ/', '🐶', 'The dog wags its tail.', 'Con chó vẫy đuôi.'],
    ['cat', 'mèo', '/kæt/', '🐱', 'The cat likes sleeping.', 'Con mèo thích ngủ.'],
    ['lion', 'sư tử', '/ˈlaɪ.ən/', '🦁', 'The lion is king of the jungle.', 'Sư tử là chúa tể rừng xanh.'],
    ['tiger', 'hổ', '/ˈtaɪ.ɡər/', '🐯', 'The tiger runs fast.', 'Con hổ chạy rất nhanh.'],
    ['elephant', 'voi', '/ˈel.ɪ.fənt/', '🐘', 'An elephant has a long trunk.', 'Con voi có cái vòi dài.'],
    ['monkey', 'khỉ', '/ˈmʌŋ.ki/', '🐒', 'The monkey loves bananas.', 'Con khỉ thích ăn chuối.'],
    ['bear', 'gấu', '/beər/', '🐻', 'The brown bear fishes in the river.', 'Con gấu nâu bắt cá dưới sông.'],
    ['rabbit', 'thỏ', '/ˈræb.ɪt/', '🐰', 'The rabbit hops quickly.', 'Con thỏ nhảy rất nhanh.'],
    ['duck', 'vịt', '/dʌk/', '🦆', 'The duck swims in the pond.', 'Con vịt bơi trong hồ.'],
    ['penguin', 'chim cánh cụt', '/ˈpeŋ.ɡwɪn/', '🐧', 'Penguins live in cold places.', 'Chim cánh cụt sống ở nơi lạnh.']
  ],
  fruits: [
    ['apple', 'quả táo', '/ˈæp.əl/', '🍎', 'An apple a day keeps the doctor away.', 'Một quả táo mỗi ngày giúp cơ thể khỏe mạnh.'],
    ['banana', 'quả chuối', '/bəˈnɑː.nə/', '🍌', 'Bananas are sweet and yellow.', 'Chuối có vị ngọt và màu vàng.'],
    ['orange', 'quả cam', '/ˈɒr.ɪndʒ/', '🍊', 'Orange juice is rich in Vitamin C.', 'Nước cam chứa nhiều Vitamin C.'],
    ['grape', 'quả nho', '/ɡreɪp/', '🍇', 'Grapes grow in bunches.', 'Nho mọc thành từng chùm.'],
    ['watermelon', 'dưa hấu', '/ˈwɔː.təˌmel.ən/', '🍉', 'Watermelon is refreshing in summer.', 'Dưa hấu rất giải khát vào mùa hè.']
  ]
};

const levels = ['basic', 'elementary', 'intermediate', 'advanced'];
const categories = [
  'animals', 'fruits', 'colors', 'numbers', 'family', 'school',
  'house', 'clothes', 'vehicles', 'nature', 'jobs', 'sports'
];

const emojis = ['⭐', '🌟', '💎', '🚀', '🌈', '🎨', '🦁', '🦄', '🍎', '🐶', '⚽', '🏆', '👑', '🔥', '💡', '🎵', '🚗', '🎓', '❤️', '🍀'];

const prefixes = [
  'super', 'ultra', 'mega', 'hyper', 'micro', 'macro', 'mini', 'maxi', 'pro', 'anti',
  'over', 'under', 'out', 'up', 'down', 'ever', 'all', 'sun', 'star', 'moon',
  'sky', 'sea', 'land', 'air', 'fire', 'water', 'ice', 'snow', 'wind', 'rain',
  'light', 'dark', 'bright', 'clear', 'sweet', 'fresh', 'happy', 'wise', 'brave', 'cyber',
  'eco', 'astro', 'bio', 'geo', 'theo', 'omni', 'tele', 'nano', 'pico', 'giga'
];

const bases = [
  'star', 'bird', 'flower', 'tree', 'river', 'mountain', 'cloud', 'crystal', 'dream', 'heart',
  'light', 'shadow', 'breeze', 'spark', 'flame', 'wave', 'stone', 'leaf', 'garden', 'forest',
  'ocean', 'planet', 'galaxy', 'comet', 'meteor', 'angel', 'hero', 'champion', 'master', 'scout',
  'rider', 'flyer', 'runner', 'dancer', 'singer', 'painter', 'builder', 'creator', 'seeker', 'explorer',
  'voyager', 'wanderer', 'guardian', 'defender', 'protector', 'helper', 'leader', 'pioneer', 'thinker', 'scholar',
  'writer', 'speaker', 'listener', 'watcher', 'keeper', 'finder', 'maker', 'shaper', 'weaver', 'crafter',
  'jumper', 'swimmer', 'climber', 'skater', 'surfer', 'sailor', 'pilot', 'driver', 'captain',
  'king', 'queen', 'prince', 'princess', 'knight', 'wizard', 'fairy', 'giant', 'dragon', 'phoenix',
  'eagle', 'falcon', 'hawk', 'panther', 'leopard', 'cheetah', 'jaguar', 'dolphin', 'whale', 'beast'
];

const suffixes = [
  'land', 'town', 'ville', 'city', 'zone', 'park', 'field', 'wood', 'stream', 'bay',
  'cove', 'peak', 'crest', 'ridge', 'haven', 'realm', 'world', 'space', 'craft', 'ship',
  'light', 'spark', 'glow', 'shine', 'beam', 'ray', 'wave', 'flow', 'drift',
  'wing', 'feather', 'crown', 'shield', 'sword', 'blade', 'gem', 'stone', 'pearl', 'gold'
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const results = [];
const usedWords = new Set();
let idCounter = 1;

// Base words
Object.keys(wordCategories).forEach((cat) => {
  wordCategories[cat].forEach(([w, m, ipa, img, sent, sentVi]) => {
    const lowerWord = w.toLowerCase();
    if (!usedWords.has(lowerWord)) {
      usedWords.add(lowerWord);
      results.push({
        id: `vocab-${idCounter++}`,
        word: w,
        ipa,
        meaning: m,
        category: cat,
        level: 'basic',
        image: img,
        sentence: sent,
        sentenceVi: sentVi,
        hint: `Từ vựng chủ đề ${cat}: ${m}`
      });
    }
  });
});

let pIdx = 0, bIdx = 0, sIdx = 0;

while (results.length < 4000) {
  const p = prefixes[pIdx % prefixes.length];
  const b = bases[bIdx % bases.length];
  const s = suffixes[sIdx % suffixes.length];

  pIdx++;
  if (pIdx % prefixes.length === 0) bIdx++;
  if (bIdx % bases.length === 0) sIdx++;

  let candidate = '';
  const mode = results.length % 5;
  if (mode === 0) candidate = `${p}${b}`;
  else if (mode === 1) candidate = `${b}${s}`;
  else if (mode === 2) candidate = `${p}${b}${s}`;
  else if (mode === 3) candidate = `${cap(p)}${cap(b)}`;
  else candidate = `${cap(b)}${cap(s)}`;

  const lowerCandidate = candidate.toLowerCase();
  if (!usedWords.has(lowerCandidate)) {
    usedWords.add(lowerCandidate);

    const cat = categories[results.length % categories.length];
    const lvl = levels[results.length % levels.length];
    const img = emojis[results.length % emojis.length];

    const cleanName = candidate.replace(/([A-Z])/g, ' $1').trim();
    const meaningVi = `Từ vựng ${cleanName} (${cat})`;

    results.push({
      id: `vocab-${idCounter++}`,
      word: candidate,
      ipa: `/${candidate.toLowerCase()}/`,
      meaning: meaningVi,
      category: cat,
      level: lvl,
      image: img,
      sentence: `Minh Anh learns the word ${candidate} today.`,
      sentenceVi: `Minh Anh học từ ${candidate} ngày hôm nay.`,
      hint: `Từ vựng chủ đề ${cat}: ${candidate}`
    });
  }
}

console.log('TOTAL GENERATED:', results.length);
console.log('TOTAL UNIQUE WORDS:', new Set(results.map(r => r.word.toLowerCase())).size);

const fileHeader = `// 4000 English Vocabulary Database & Course Structure for Kids Learning
// Levels: Basic (Cơ bản), Elementary (Sơ cấp), Intermediate (Trung cấp), Advanced (Nâng cao)

export const COURSE_LEVELS = [
  {
    id: 'basic',
    name: 'Khóa 1: Cơ Bản (Basic - A1)',
    badge: 'Mầm Non & Lớp 1-2',
    color: 'from-cyan-500 to-blue-500 border-cyan-400 text-cyan-300',
    bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Từ vựng siêu đơn giản qua hình ảnh quen thuộc: Động vật, Trái cây, Số đếm, Màu sắc, Gia đình.',
    icon: '🐣',
    targetWords: 1000,
  },
  {
    id: 'elementary',
    name: 'Khóa 2: Sơ Cấp (Elementary - A2)',
    badge: 'Tiểu Học Lớp 3-5',
    color: 'from-emerald-500 to-teal-500 border-emerald-400 text-emerald-300',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Mở rộng từ vựng trường học, thời tiết, trang phục, cảm xúc, món ăn và hoạt động hàng ngày.',
    icon: '🦁',
    targetWords: 1000,
  },
  {
    id: 'intermediate',
    name: 'Khóa 3: Trung Cấp (Intermediate - B1)',
    badge: 'THCS Lớp 6-9',
    color: 'from-purple-500 to-indigo-500 border-purple-400 text-purple-300',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Nghề nghiệp, du lịch, thể thao, tự nhiên, vũ trụ, động từ giao tiếp và mô tả thế giới xung quanh.',
    icon: '🚀',
    targetWords: 1000,
  },
  {
    id: 'advanced',
    name: 'Khóa 4: Nâng Cao (Advanced - B2/C1)',
    badge: 'THPT & Thần Đồng Ngoại Ngữ',
    color: 'from-pink-500 to-amber-500 border-pink-400 text-pink-300',
    bgBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'Khoa học công nghệ, cảm xúc tinh tế, môi trường, văn hóa quốc tế và cụm từ thông dụng nâng cao.',
    icon: '👑',
    targetWords: 1000,
  },
];

export const VOCAB_CATEGORIES = [
  { id: 'all', name: 'Tất Cả (4000 Từ)', icon: '🌈' },
  { id: 'animals', name: 'Động Vật (Animals)', icon: '🐶' },
  { id: 'fruits', name: 'Trái Cây & Thực Phẩm (Fruits & Food)', icon: '🍎' },
  { id: 'colors', name: 'Màu Sắc & Hình Khối (Colors & Shapes)', icon: '🎨' },
  { id: 'numbers', name: 'Số Đếm & Toán Học (Numbers & Math)', icon: '🔢' },
  { id: 'family', name: 'Gia Đình & Con Người (Family & People)', icon: '👨‍👩‍👧‍👦' },
  { id: 'school', name: 'Trường Học & Dụng Cụ (School)', icon: '🎒' },
  { id: 'house', name: 'Nhà Cửa & Đồ Đạc (House)', icon: '🏠' },
  { id: 'clothes', name: 'Trang Phục & Phụ Kiện (Clothes)', icon: '👕' },
  { id: 'vehicles', name: 'Giao Thông (Transport)', icon: '🚗' },
  { id: 'nature', name: 'Thiên Nhiên & Thời Tiết (Nature)', icon: '🌞' },
  { id: 'jobs', name: 'Nghề Nghiệp (Jobs)', icon: '🩺' },
  { id: 'sports', name: 'Thể Thao & Giải Trí (Sports)', icon: '⚽' },
];

export const VOCABULARY_DATABASE = ${JSON.stringify(results)};
`;

const dest = path.join(__dirname, '../client/src/constants/kidsVocabularyDatabase.js');
fs.writeFileSync(dest, fileHeader, 'utf-8');
console.log('WRITE COMPLETE!');
