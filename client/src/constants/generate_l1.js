const fs = require('fs');
const path = require('path');

const rawText = `
L1-U01|Colors / Màu sắc|red|/rˈɛd/|màu đỏ|Tính từ|The balloon is red.|Quả bóng bay có màu đỏ.|🔴
L1-U01|Colors / Màu sắc|blue|/blˈu/|màu xanh dương|Tính từ|The balloon is blue.|Quả bóng bay có màu xanh dương.|🔷
L1-U01|Colors / Màu sắc|yellow|/jˈɛloʊ/|màu vàng|Tính từ|The balloon is yellow.|Quả bóng bay có màu vàng.|🟡
L1-U01|Colors / Màu sắc|green|/ɡrˈin/|màu xanh lá|Tính từ|The balloon is green.|Quả bóng bay có màu xanh lá.|🟢
L1-U01|Colors / Màu sắc|orange|/ˈɔrəndʒ/|màu cam|Tính từ|The balloon is orange.|Quả bóng bay có màu cam.|🍊
L1-U01|Colors / Màu sắc|purple|/pˈɝpəl/|màu tím|Tính từ|The balloon is purple.|Quả bóng bay có màu tím.|🟣
L1-U01|Colors / Màu sắc|pink|/pˈɪŋk/|màu hồng|Tính từ|The balloon is pink.|Quả bóng bay có màu hồng.|🌸
L1-U01|Colors / Màu sắc|black|/blˈæk/|màu đen|Tính từ|The balloon is black.|Quả bóng bay có màu đen.|🖤
L1-U01|Colors / Màu sắc|white|/wˈaɪt/|màu trắng|Tính từ|The balloon is white.|Quả bóng bay có màu trắng.|⚪
L1-U01|Colors / Màu sắc|brown|/brˈaʊn/|màu nâu|Tính từ|The balloon is brown.|Quả bóng bay có màu nâu.|🐻

L1-U02|Numbers 1–10 / Số đếm 1–10|one|/wˈʌn/|một|number|I can count to one.|Bé có thể đếm đến một.|1️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|two|/tˈu/|hai|number|I can count to two.|Bé có thể đếm đến hai.|2️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|three|/θrˈi/|ba|number|I can count to three.|Bé có thể đếm đến ba.|3️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|four|/fˈɔr/|bốn|number|I can count to four.|Bé có thể đếm đến bốn.|4️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|five|/fˈaɪv/|năm|number|I can count to five.|Bé có thể đếm đến năm.|5️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|six|/sˈɪks/|sáu|number|I can count to six.|Bé có thể đếm đến sáu.|6️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|seven|/sˈɛvən/|bảy|number|I can count to seven.|Bé có thể đếm đến bảy.|7️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|eight|/ˈeɪt/|tám|number|I can count to eight.|Bé có thể đếm đến tám.|8️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|nine|/nˈaɪn/|chín|number|I can count to nine.|Bé có thể đếm đến chín.|9️⃣
L1-U02|Numbers 1–10 / Số đếm 1–10|ten|/tˈɛn/|mười|number|I can count to ten.|Bé có thể đếm đến mười.|🔟

L1-U03|Shapes / Hình dạng|circle|/sˈɝkəl/|hình tròn|Danh từ|I can see a circle.|Bé nhìn thấy hình tròn.|🔴
L1-U03|Shapes / Hình dạng|square|/skwˈɛr/|hình vuông|Danh từ|I can see a square.|Bé nhìn thấy hình vuông.|⬛
L1-U03|Shapes / Hình dạng|triangle|/trˈaɪˌæŋɡəl/|hình tam giác|Danh từ|I can see a triangle.|Bé nhìn thấy hình tam giác.|🔺
L1-U03|Shapes / Hình dạng|rectangle|/rˈɛktæŋɡəl/|hình chữ nhật|Danh từ|I can see a rectangle.|Bé nhìn thấy hình chữ nhật.|🟩
L1-U03|Shapes / Hình dạng|star|/stˈɑr/|hình ngôi sao|Danh từ|I can see a star.|Bé nhìn thấy hình ngôi sao.|⭐
L1-U03|Shapes / Hình dạng|heart|/hˈɑrt/|hình trái tim|Danh từ|I can see a heart.|Bé nhìn thấy hình trái tim.|❤️
L1-U03|Shapes / Hình dạng|oval|/ˈoʊvəl/|hình bầu dục|Danh từ|I can see an oval.|Bé nhìn thấy hình bầu dục.|🥚
L1-U03|Shapes / Hình dạng|diamond|/dˈaɪmənd/|hình thoi|Danh từ|I can see a diamond.|Bé nhìn thấy hình thoi.|💎
L1-U03|Shapes / Hình dạng|line|/lˈaɪn/|đường thẳng|Danh từ|I can see a line.|Bé nhìn thấy đường thẳng.|📏
L1-U03|Shapes / Hình dạng|dot|/dˈɑt/|dấu chấm|Danh từ|I can see a dot.|Bé nhìn thấy dấu chấm.|🟢

L1-U04|My Family / Gia đình của bé|mother|/mˈʌðɚ/|mẹ|Danh từ|This is my mother.|Đây là mẹ của bé.|👩
L1-U04|My Family / Gia đình của bé|father|/fˈɑðɚ/|bố/cha|Danh từ|This is my father.|Đây là bố/cha của bé.|👨
L1-U04|My Family / Gia đình của bé|sister|/sˈɪstɚ/|chị/em gái|Danh từ|This is my sister.|Đây là chị/em gái của bé.|👧
L1-U04|My Family / Gia đình của bé|brother|/brˈʌðɚ/|anh/em trai|Danh từ|This is my brother.|Đây là anh/em trai của bé.|👦
L1-U04|My Family / Gia đình của bé|grandmother|/ɡrˈændmˌʌðɚ/|bà|Danh từ|This is my grandmother.|Đây là bà của bé.|👵
L1-U04|My Family / Gia đình của bé|grandfather|/ɡrˈændfˌɑðɚ/|ông|Danh từ|This is my grandfather.|Đây là ông của bé.|👴
L1-U04|My Family / Gia đình của bé|baby|/bˈeɪbi/|em bé|Danh từ|This is my baby.|Đây là em bé của bé.|👶
L1-U04|My Family / Gia đình của bé|family|/fˈæməli/|gia đình|Danh từ|This is my family.|Đây là gia đình của bé.|👨‍👩‍👧‍👦
L1-U04|My Family / Gia đình của bé|aunt|/ˈænt/|cô/dì|Danh từ|This is my aunt.|Đây là cô/dì của bé.|👩‍🦱
L1-U04|My Family / Gia đình của bé|uncle|/ˈʌŋkəl/|chú/cậu/bác trai|Danh từ|This is my uncle.|Đây là chú/cậu/bác trai của bé.|👨‍🦰

L1-U05|My Body / Cơ thể của bé|head|/hˈɛd/|đầu|Danh từ|Touch your head.|Hãy chạm vào đầu của con.|👦
L1-U05|My Body / Cơ thể của bé|hair|/hˈɛr/|tóc|Danh từ|Touch your hair.|Hãy chạm vào tóc của con.|💇
L1-U05|My Body / Cơ thể của bé|eye|/ˈaɪ/|mắt|Danh từ|Touch your eye.|Hãy chạm vào mắt của con.|👁️
L1-U05|My Body / Cơ thể của bé|ear|/ˈir/|tai|Danh từ|Touch your ear.|Hãy chạm vào tai của con.|👂
L1-U05|My Body / Cơ thể của bé|nose|/nˈoʊz/|mũi|Danh từ|Touch your nose.|Hãy chạm vào mũi của con.|👃
L1-U05|My Body / Cơ thể của bé|mouth|/mˈaʊθ/|miệng|Danh từ|Touch your mouth.|Hãy chạm vào miệng của con.|👄
L1-U05|My Body / Cơ thể của bé|hand|/hˈænd/|bàn tay|Danh từ|Touch your hand.|Hãy chạm vào bàn tay của con.|✋
L1-U05|My Body / Cơ thể của bé|arm|/ˈɑrm/|cánh tay|Danh từ|Touch your arm.|Hãy chạm vào cánh tay của con.|🦾
L1-U05|My Body / Cơ thể của bé|leg|/lˈɛɡ/|chân|Danh từ|Touch your leg.|Hãy chạm vào chân của con.|🦵
L1-U05|My Body / Cơ thể của bé|foot|/fˈʊt/|bàn chân|Danh từ|Touch your foot.|Hãy chạm vào bàn chân của con.|🦶

L1-U06|Animals / Động vật quen thuộc|cat|/kˈæt/|con mèo|Danh từ|The cat is friendly.|Con mèo rất thân thiện.|🐱
L1-U06|Animals / Động vật quen thuộc|dog|/dˈɔɡ/|con chó|Danh từ|The dog is friendly.|Con chó rất thân thiện.|🐶
L1-U06|Animals / Động vật quen thuộc|bird|/bˈɝd/|con chim|Danh từ|The bird is friendly.|Con chim rất thân thiện.|🐦
L1-U06|Animals / Động vật quen thuộc|fish|/fˈɪʃ/|con cá|Danh từ|The fish is friendly.|Con cá rất thân thiện.|🐟
L1-U06|Animals / Động vật quen thuộc|rabbit|/rˈæbət/|con thỏ|Danh từ|The rabbit is friendly.|Con thỏ rất thân thiện.|🐰
L1-U06|Animals / Động vật quen thuộc|duck|/dˈʌk/|con vịt|Danh từ|The duck is friendly.|Con vịt rất thân thiện.|🦆
L1-U06|Animals / Động vật quen thuộc|cow|/kˈaʊ/|con bò|Danh từ|The cow is friendly.|Con bò rất thân thiện.|🐮
L1-U06|Animals / Động vật quen thuộc|pig|/pˈɪɡ/|con heo|Danh từ|The pig is friendly.|Con heo rất thân thiện.|🐷
L1-U06|Animals / Động vật quen thuộc|horse|/hˈɔrs/|con ngựa|Danh từ|The horse is friendly.|Con ngựa rất thân thiện.|🐴
L1-U06|Animals / Động vật quen thuộc|sheep|/ʃˈip/|con cừu|Danh từ|The sheep is friendly.|Con cừu rất thân thiện.|🐑

L1-U07|Food and Drinks / Đồ ăn và thức uống|apple|/ˈæpəl/|quả táo|Danh từ|I like apples.|Bé thích quả táo.|🍎
L1-U07|Food and Drinks / Đồ ăn và thức uống|banana|/bənˈænə/|quả chuối|Danh từ|I like bananas.|Bé thích quả chuối.|🍌
L1-U07|Food and Drinks / Đồ ăn và thức uống|orange|/ˈɔrəndʒ/|quả cam|Danh từ|I like oranges.|Bé thích quả cam.|🍊
L1-U07|Food and Drinks / Đồ ăn và thức uống|rice|/rˈaɪs/|cơm/gạo|Danh từ|I like rice.|Bé thích cơm/gạo.|🍚
L1-U07|Food and Drinks / Đồ ăn và thức uống|bread|/brˈɛd/|bánh mì|Danh từ|I like bread.|Bé thích bánh mì.|🍞
L1-U07|Food and Drinks / Đồ ăn và thức uống|milk|/mˈɪlk/|sữa|Danh từ|I like milk.|Bé thích sữa.|🥛
L1-U07|Food and Drinks / Đồ ăn và thức uống|egg|/ˈɛɡ/|quả trứng|Danh từ|I like eggs.|Bé thích quả trứng.|🥚
L1-U07|Food and Drinks / Đồ ăn và thức uống|cake|/kˈeɪk/|bánh ngọt|Danh từ|I like cakes.|Bé thích bánh ngọt.|🎂
L1-U07|Food and Drinks / Đồ ăn và thức uống|water|/wˈɔtɚ/|nước|Danh từ|I like water.|Bé thích nước.|💧
L1-U07|Food and Drinks / Đồ ăn và thức uống|juice|/dʒˈus/|nước ép|Danh từ|I like juice.|Bé thích nước ép.|🧃

L1-U08|My Classroom / Lớp học của bé|book|/bˈʊk/|quyển sách|Danh từ|This is my book.|Đây là quyển sách của bé.|📖
L1-U08|My Classroom / Lớp học của bé|pen|/pˈɛn/|bút mực|Danh từ|This is my pen.|Đây là bút mực của bé.|🖊️
L1-U08|My Classroom / Lớp học của bé|pencil|/pˈɛnsəl/|bút chì|Danh từ|This is my pencil.|Đây là bút chì của bé.|✏️
L1-U08|My Classroom / Lớp học của bé|ruler|/rˈulɚ/|thước kẻ|Danh từ|This is my ruler.|Đây là thước kẻ của bé.|📏
L1-U08|My Classroom / Lớp học của bé|eraser|/ɪrˈeɪsɚ/|cục tẩy|Danh từ|This is my eraser.|Đây là cục tẩy của bé.|🧹
L1-U08|My Classroom / Lớp học của bé|bag|/bˈæɡ/|cặp/túi|Danh từ|This is my bag.|Đây là cặp/túi của bé.|🎒
L1-U08|My Classroom / Lớp học của bé|chair|/tʃˈɛr/|ghế|Danh từ|This is my chair.|Đây là ghế của bé.|🪑
L1-U08|My Classroom / Lớp học của bé|table|/tˈeɪbəl/|bàn|Danh từ|This is my table.|Đây là bàn của bé.|🪵
L1-U08|My Classroom / Lớp học của bé|door|/dˈɔr/|cửa ra vào|Danh từ|This is my door.|Đây là cửa ra vào của bé.|🚪
L1-U08|My Classroom / Lớp học của bé|window|/wˈɪndoʊ/|cửa sổ|Danh từ|This is my window.|Đây là cửa sổ của bé.|🪟

L1-U09|Action Words / Động từ hành động|run|/rˈʌn/|chạy|Động từ|I can run.|Bé có thể chạy.|🏃
L1-U09|Action Words / Động từ hành động|jump|/dʒˈʌmp/|nhảy|Động từ|I can jump.|Bé có thể nhảy.|🦘
L1-U09|Action Words / Động từ hành động|walk|/wˈɔk/|đi bộ|Động từ|I can walk.|Bé có thể đi bộ.|🚶
L1-U09|Action Words / Động từ hành động|sit|/sˈɪt/|ngồi|Động từ|I can sit.|Bé có thể ngồi.|🪑
L1-U09|Action Words / Động từ hành động|stand|/stˈænd/|đứng|Động từ|I can stand.|Bé có thể đứng.|🧍
L1-U09|Action Words / Động từ hành động|clap|/klˈæp/|vỗ tay|Động từ|I can clap.|Bé có thể vỗ tay.|👏
L1-U09|Action Words / Động từ hành động|sing|/sˈɪŋ/|hát|Động từ|I can sing.|Bé có thể hát.|🎤
L1-U09|Action Words / Động từ hành động|dance|/dˈæns/|nhảy múa|Động từ|I can dance.|Bé có thể nhảy múa.|💃
L1-U09|Action Words / Động từ hành động|eat|/ˈit/|ăn|Động từ|I can eat.|Bé có thể ăn.|🍽️
L1-U09|Action Words / Động từ hành động|drink|/drˈɪŋk/|uống|Động từ|I can drink.|Bé có thể uống.|🥤

L1-U10|Feelings / Cảm xúc cơ bản|happy|/hˈæpi/|vui vẻ|Tính từ|I feel happy.|Bé cảm thấy vui vẻ.|😊
L1-U10|Feelings / Cảm xúc cơ bản|sad|/sˈæd/|buồn|Tính từ|I feel sad.|Bé cảm thấy buồn.|😢
L1-U10|Feelings / Cảm xúc cơ bản|angry|/ˈæŋɡri/|tức giận|Tính từ|I feel angry.|Bé cảm thấy tức giận.|😡
L1-U10|Feelings / Cảm xúc cơ bản|scared|/skˈɛrd/|sợ hãi|Tính từ|I feel scared.|Bé cảm thấy sợ hãi.|😱
L1-U10|Feelings / Cảm xúc cơ bản|tired|/tˈaɪɚd/|mệt|Tính từ|I feel tired.|Bé cảm thấy mệt.|🥱
L1-U10|Feelings / Cảm xúc cơ bản|hungry|/hˈʌŋɡri/|đói|Tính từ|I feel hungry.|Bé cảm thấy đói.|😋
L1-U10|Feelings / Cảm xúc cơ bản|thirsty|/θˈɝsti/|khát|Tính từ|I feel thirsty.|Bé cảm thấy khát.|🥤
L1-U10|Feelings / Cảm xúc cơ bản|excited|/ɪksˈaɪtəd/|hào hứng|Tính từ|I feel excited.|Bé cảm thấy hào hứng.|🤩
L1-U10|Feelings / Cảm xúc cơ bản|calm|/kˈɑm/|bình tĩnh|Tính từ|I feel calm.|Bé cảm thấy bình tĩnh.|😌
L1-U10|Feelings / Cảm xúc cơ bản|sleepy|/slˈipi/|buồn ngủ|Tính từ|I feel sleepy.|Bé cảm thấy buồn ngủ.|😴

L1-U11|Toys / Đồ chơi|doll|/dɑl/|búp bê|Danh từ|This is a doll.|Đây là búp bê.|🪆
L1-U11|Toys / Đồ chơi|ball|/bɔl/|quả bóng|Danh từ|This is a ball.|Đây là quả bóng.|⚽
L1-U11|Toys / Đồ chơi|kite|/kaɪt/|con diều|Danh từ|This is a kite.|Đây là con diều.|🪁
L1-U11|Toys / Đồ chơi|robot|/roʊbɑt/|rô-bốt|Danh từ|This is a robot.|Đây là rô-bốt.|🤖
L1-U11|Toys / Đồ chơi|teddy bear|/tɛdi bɛr/|gấu bông|Danh từ|This is a teddy bear.|Đây là gấu bông.|🧸
L1-U11|Toys / Đồ chơi|blocks|/blɑks/|khối xếp hình|Danh từ|These are blocks.|Đây là khối xếp hình.|🧱
L1-U11|Toys / Đồ chơi|puzzle|/pʌzʌl/|trò ghép hình|Danh từ|This is a puzzle.|Đây là trò ghép hình.|🧩
L1-U11|Toys / Đồ chơi|yo-yo|/joʊ joʊ/|con quay yo-yo|Danh từ|This is a yo-yo.|Đây là con quay yo-yo.|🪀
L1-U11|Toys / Đồ chơi|drum|/drʌm/|cái trống|Danh từ|This is a drum.|Đây là cái trống.|🥁
L1-U11|Toys / Đồ chơi|toy train|/tɔɪ treɪn/|tàu hỏa đồ chơi|Danh từ|This is a toy train.|Đây là tàu hỏa đồ chơi.|🚂

L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|ant|/ænt/|con kiến|Danh từ|This is an ant.|Đây là con kiến.|🐜
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|bee|/bi/|con ong|Danh từ|This is a bee.|Đây là con ong.|🐝
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|butterfly|/bʌtɝflaɪ/|con bướm|Danh từ|This is a butterfly.|Đây là con bướm.|🦋
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|mosquito|/mʌskitoʊ/|con muỗi|Danh từ|This is a mosquito.|Đây là con muỗi.|🦟
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|fly|/flaɪ/|con ruồi|Danh từ|This is a fly.|Đây là con ruồi.|🪰
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|beetle|/bitʌl/|bọ cánh cứng|Danh từ|This is a beetle.|Đây là bọ cánh cứng.|🪲
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|ladybug|/leɪdibʌɡ/|bọ rùa|Danh từ|This is a ladybug.|Đây là bọ rùa.|🐞
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|grasshopper|/ɡræshɑpɝ/|châu chấu|Danh từ|This is a grasshopper.|Đây là châu chấu.|🦗
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|spider|/spaɪdɝ/|con nhện|Danh từ|This is a spider.|Đây là con nhện.|🕷️
L1-U12|Insects and Small Creatures / Côn trùng và sinh vật nhỏ|caterpillar|/kætʌpɪlɝ/|sâu bướm|Danh từ|This is a caterpillar.|Đây là sâu bướm.|🐛

L1-U13|Bathroom Items / Đồ dùng phòng tắm|toothbrush|/tuθbrʌʃ/|bàn chải đánh răng|Danh từ|This is a toothbrush.|Đây là bàn chải đánh răng.|🪥
L1-U13|Bathroom Items / Đồ dùng phòng tắm|toothpaste|/tuθpeɪst/|kem đánh răng|Danh từ|This is a toothpaste.|Đây là kem đánh răng.|🧴
L1-U13|Bathroom Items / Đồ dùng phòng tắm|soap|/soʊp/|xà phòng|Danh từ|This is a soap.|Đây là xà phòng.|🧼
L1-U13|Bathroom Items / Đồ dùng phòng tắm|towel|/taʊʌl/|khăn tắm|Danh từ|This is a towel.|Đây là khăn tắm.|🧺
L1-U13|Bathroom Items / Đồ dùng phòng tắm|comb|/koʊm/|cái lược|Danh từ|This is a comb.|Đây là cái lược.|🪮
L1-U13|Bathroom Items / Đồ dùng phòng tắm|mirror|/mɪrɝ/|gương|Danh từ|This is a mirror.|Đây là gương.|🪞
L1-U13|Bathroom Items / Đồ dùng phòng tắm|shower|/ʃaʊɝ/|vòi sen|Danh từ|This is a shower.|Đây là vòi sen.|🚿
L1-U13|Bathroom Items / Đồ dùng phòng tắm|bathtub|/bæθtʌb/|bồn tắm|Danh từ|This is a bathtub.|Đây là bồn tắm.|🛁
L1-U13|Bathroom Items / Đồ dùng phòng tắm|toilet|/tɔɪlʌt/|bồn cầu|Danh từ|This is a toilet.|Đây là bồn cầu.|🚽
L1-U13|Bathroom Items / Đồ dùng phòng tắm|sink|/sɪŋk/|bồn rửa|Danh từ|This is a sink.|Đây là bồn rửa.|🚰

L1-U14|On the Farm / Ở nông trại|barn|/bɑrn/|nhà kho nông trại|Danh từ|This is a barn.|Đây là nhà kho nông trại.|🛖
L1-U14|On the Farm / Ở nông trại|tractor|/træktɝ/|máy kéo|Danh từ|This is a tractor.|Đây là máy kéo.|🚜
L1-U14|On the Farm / Ở nông trại|chicken|/tʃɪkʌn/|con gà|Danh từ|This is a chicken.|Đây là con gà.|🐔
L1-U14|On the Farm / Ở nông trại|rooster|/rustɝ/|gà trống|Danh từ|This is a rooster.|Đây là gà trống.|🐓
L1-U14|On the Farm / Ở nông trại|goat|/ɡoʊt/|con dê|Danh từ|This is a goat.|Đây là con dê.|🐐
L1-U14|On the Farm / Ở nông trại|donkey|/dɑŋki/|con lừa|Danh từ|This is a donkey.|Đây là con lừa.|🫏
L1-U14|On the Farm / Ở nông trại|field|/fild/|cánh đồng|Danh từ|This is a field.|Đây là cánh đồng.|🌾
L1-U14|On the Farm / Ở nông trại|fence|/fɛns/|hàng rào|Danh từ|This is a fence.|Đây là hàng rào.|🪵
L1-U14|On the Farm / Ở nông trại|hay|/heɪ/|cỏ khô|Danh từ|This is a hay.|Đây là cỏ khô.|🌾
L1-U14|On the Farm / Ở nông trại|seed|/sid/|hạt giống|Danh từ|This is a seed.|Đây là hạt giống.|🫘

L1-U15|Opposites / Các cặp từ trái nghĩa|big|/bɪɡ/|to, lớn|Tính từ|It is big.|Nó to, lớn.|🐘
L1-U15|Opposites / Các cặp từ trái nghĩa|small|/smɔl/|nhỏ|Tính từ|It is small.|Nó nhỏ.|🐭
L1-U15|Opposites / Các cặp từ trái nghĩa|tall|/tɔl/|cao|Tính từ|It is tall.|Nó cao.|🦒
L1-U15|Opposites / Các cặp từ trái nghĩa|short|/ʃɔrt/|thấp, ngắn|Tính từ|It is short.|Nó thấp, ngắn.|🦔
L1-U15|Opposites / Các cặp từ trái nghĩa|fast|/fæst/|nhanh|Tính từ|It is fast.|Nó nhanh.|🐆
L1-U15|Opposites / Các cặp từ trái nghĩa|slow|/sloʊ/|chậm|Tính từ|It is slow.|Nó chậm.|🐢
L1-U15|Opposites / Các cặp từ trái nghĩa|clean|/klin/|sạch|Tính từ|It is clean.|Nó sạch.|🧽
L1-U15|Opposites / Các cặp từ trái nghĩa|dirty|/dɝti/|bẩn|Tính từ|It is dirty.|Nó bẩn.|💩
L1-U15|Opposites / Các cặp từ trái nghĩa|open|/oʊpʌn/|mở|Tính từ|It is open.|Nó mở.|🔓
L1-U15|Opposites / Các cặp từ trái nghĩa|closed|/kloʊzd/|đóng|Tính từ|It is closed.|Nó đóng.|🔒
`;

console.log('Script template ready');
