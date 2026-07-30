import fs from 'fs';
const content = fs.readFileSync('d:/TÀI LIỆU HỌC CODE/lich-sinh-hoat-react-node-tailwind/client/src/constants/kidsVocabularyDatabase.js', 'utf8');
const matches = content.match(/"id": "vocab-/g);
console.log('Vocab ID entries count:', matches ? matches.length : 0);
