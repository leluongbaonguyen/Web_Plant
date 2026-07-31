/**
 * TÀI LIỆU TỔNG HỢP TOÀN DIỆN VÀ SIÊU CHI TIẾT CÁC MÃ LỖI TRONG LẬP TRÌNH
 * Cẩm nang tra cứu chuyên sâu dành cho Phát triển phần mềm, Tích hợp API và Quản trị hệ thống
 */

export const SYSTEM_ERROR_CATALOG = [
  // =========================================================================
  // CHƯƠNG I: MÃ TRẠNG THÁI GIAO THỨC HTTP (HTTP STATUS CODES)
  // =========================================================================
  {
    code: '400',
    key: 'HTTP_400',
    title: '400 - Bad Request (Yêu cầu lỗi)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Payload JSON gửi lên bị sai cú pháp (thiếu dấu phẩy, thừa ngoặc).\n- Sai kiểu dữ liệu trường (truyền chuỗi văn bản vào trường yêu cầu số nguyên).\n- Kích thước HTTP Header hoặc Body vượt quá giới hạn cấu hình của web server.',
    rootCause: 'Payload gửi lên không vượt qua vòng kiểm tra cú pháp hoặc vượt quá dung lượng cho phép của máy chủ.',
    solution: '- Sử dụng các thư viện schema validation ở backend (Zod, Joi, Validator) để kiểm tra chặt chẽ đầu vào.\n- Bật log chi tiết phần parse payload để xác định chính xác vị trí chuỗi ký tự bị lỗi cú pháp cấu trúc.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'AlertCircle'
  },
  {
    code: '401',
    key: 'HTTP_401',
    title: '401 - Unauthorized (Chưa xác thực)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Thiếu hẳn tiêu đề xác thực Authorization trong HTTP Header.\n- Access Token hoặc API Key bị sai, không hợp lệ hoặc đã hết hạn sử dụng (Expired JWT).\n- Chữ ký điện tử của token không khớp với Secret Key cấu hình trên Server.',
    rootCause: 'Yêu cầu thiếu thông tin xác thực danh tính hợp lệ hoặc Token truy cập đã bị vô hiệu hóa/hết hạn.',
    solution: '- Kiểm tra luồng gửi token từ Client (đảm bảo đúng tiền tố Bearer <token>).\n- Triển khai cơ chế Refresh Token tự động dưới Client khi Access Token hết hạn.\n- Kiểm tra tính đồng bộ của Secret Key giữa các cụm server.',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: 'ShieldAlert'
  },
  {
    code: '403',
    key: 'HTTP_403',
    title: '403 - Forbidden (Bị từ chối truy cập)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Người dùng đã đăng nhập thành công nhưng tài khoản không có quyền hạn (Role/Permission) để truy cập tài nguyên.\n- Hệ thống chặn IP của Client do nằm trong danh sách đen (Blacklist).\n- Thiếu hoặc sai Token bảo mật chống tấn công giả mạo CSRF.',
    rootCause: 'Danh tính người dùng đã được xác thực nhưng bị hệ thống phân quyền (RBAC/ABAC) hoặc tường lửa ngăn cản.',
    solution: '- Rà soát lại phân quyền dựa trên vai trò (RBAC) hoặc thuộc tính (ABAC) trong mã nguồn.\n- Kiểm tra lại quy tắc tường lửa (WAF) hoặc cấu hình giới hạn quyền truy cập thư mục của Web Server (Nginx, Apache).',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: 'Lock'
  },
  {
    code: '404',
    key: 'HTTP_404',
    title: '404 - Not Found (Không tìm thấy tài nguyên)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Client gọi sai đường dẫn Endpoint URL (sai chính tả, thừa thiếu dấu gạch chéo).\n- Bản ghi dữ liệu truy vấn theo ID cụ thể đã bị xóa hoặc không hề tồn tại trong database.\n- Định tuyến (Routing) ở phía ứng dụng backend cấu hình chưa chính xác.',
    rootCause: 'Đường dẫn API hoặc tài nguyên được yêu cầu không tồn tại trên hệ thống máy chủ.',
    solution: '- Xác thực lại cấu trúc Endpoint URL của API.\n- Trong mã nguồn backend, cần bắt điều kiện kiểm tra dữ liệu trả về từ DB: nếu kết quả rỗng (null/undefined) thì chủ động trả về thông báo lỗi tường minh thay vì để crash.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: 'FileQuestion'
  },
  {
    code: '422',
    key: 'HTTP_422',
    title: '422 - Unprocessable Entity (Lỗi logic dữ liệu)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Cú pháp dữ liệu gửi lên hoàn toàn đúng (vượt qua vòng kiểm tra lỗi 400), nhưng ngữ nghĩa và logic dữ liệu bị sai quy định nghiệp vụ hệ thống.\n- Ví dụ: Nhập ngày sinh trong tương lai, mật khẩu thiếu ký tự đặc biệt, email đăng ký đã tồn tại.',
    rootCause: 'Dữ liệu chuẩn cú pháp nhưng vi phạm các quy tắc nghiệp vụ (Business Rules Validation).',
    solution: '- Trả về một mảng chứa chi tiết toàn bộ các trường dữ liệu bị vi phạm nghiệp vụ đi kèm thông báo thân thiện (Validation Errors Message) để Client hiển thị lên giao diện UI cho người dùng sửa.',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    icon: 'Sliders'
  },
  {
    code: '429',
    key: 'HTTP_429',
    title: '429 - Too Many Requests (Quá tải yêu cầu)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 4xx',
    context: '- Client gửi số lượng Request vượt quá ngưỡng tối đa cho phép trong một đơn vị thời gian quy định (Rate Limit).\n- Thường xảy ra do Client bị lặp vòng vô hạn hoặc bị tấn công dò dẫm (Brute Force/DDOS).',
    rootCause: 'Tần suất gửi yêu cầu vượt quá giới hạn Rate Limiter được thiết lập trên máy chủ.',
    solution: '- Phía Server: Cấu hình mã lỗi trả về kèm Header Retry-After để báo client thời gian được thử lại.\n- Phía Client: Triển khai hàng đợi, cơ chế back-off giảm tần suất gửi, hoặc sử dụng Redis Token Bucket để điều tiết flow.',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    icon: 'Clock'
  },
  {
    code: '500',
    key: 'HTTP_500',
    title: '500 - Internal Server Error (Lỗi nội bộ máy chủ)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 5xx',
    context: '- Mã nguồn Backend xảy ra ngoại lệ nghiêm trọng không được bao bọc xử lý (Unhandled Exception).\n- Lỗi logic như đọc thuộc tính từ biến null/undefined, chia cho số 0, hoặc tràn bộ nhớ đệm (Stack Overflow).',
    rootCause: 'Ngoại lệ mã nguồn backend chưa được bắt try-catch hoặc sập tiến trình ngầm.',
    solution: '- Kiểm tra log tập trung của ứng dụng (Application Console Logs).\n- Bao bọc các vùng code rủi ro bằng khối lệnh try...catch.\n- Tuyệt đối không trả nguyên văn mã lỗi hệ thống (Stack Trace) về Client để tránh lộ thông tin bảo mật.',
    badgeColor: 'bg-red-600/30 text-red-300 border-red-500/50',
    icon: 'Zap'
  },
  {
    code: '502',
    key: 'HTTP_502',
    title: '502 - Bad Gateway (Cổng kết nối lỗi)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 5xx',
    context: '- Máy chủ Proxy/Gateway (Nginx, Apache, Cloudflare) không nhận được phản hồi hợp lệ hoặc bị mất kết nối với Server ứng dụng gốc (Upstream - Node.js, Java, Python).\n- Server backend ứng dụng bị sập hoàn toàn.',
    rootCause: 'Proxy Reverse không thể giao tiếp với ứng dụng Backend phía sau.',
    solution: '- Kiểm tra trạng thái hoạt động của tiến trình backend bằng công cụ quản lý (PM2, Docker, Systemctl).\n- Kiểm tra cấu hình chuyển tiếp cổng (Proxy Pass) trong file cấu hình Nginx đảm bảo trỏ đúng IP và Port.',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    icon: 'Server'
  },
  {
    code: '503',
    key: 'HTTP_503',
    title: '503 - Service Unavailable (Dịch vụ ngoại tuyến)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 5xx',
    context: '- Máy chủ không thể xử lý yêu cầu do đang quá tải cục bộ về tài nguyên phần cứng (CPU, RAM chạm ngưỡng 100%).\n- Hệ thống đang được tắt chủ động để bảo trì định kỳ hoặc cập nhật mã nguồn ứng dụng.',
    rootCause: 'Máy chủ chạm ngưỡng giới hạn phần cứng hoặc đang trong chế độ bảo trì.',
    solution: '- Thiết lập hệ thống giám sát cảnh báo tài nguyên để tự động mở rộng (Auto-scaling).\n- Khi bảo trì hệ thống, cấu hình Nginx trả về mã 503 kèm trang thông báo bảo trì thân thiện để bảo vệ hạ tầng phía sau.',
    badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
    icon: 'AlertTriangle'
  },
  {
    code: '504',
    key: 'HTTP_504',
    title: '504 - Gateway Timeout (Hết hạn phản hồi)',
    chapter: 'Chương I: Mã Trạng Thái HTTP',
    category: 'HTTP 5xx',
    context: '- Máy chủ Gateway kết nối được tới Server ứng dụng, nhưng tác vụ ở phía ứng dụng xử lý quá lâu vượt quá thời gian cấu hình chờ mặc định của Gateway.\n- Nguyên nhân do truy vấn SQL quá nặng, hoặc API bên thứ 3 bị treo.',
    rootCause: 'Tác vụ backend xử lý vượt quá mốc thời gian chờ (Timeout) của Proxy Server.',
    solution: '- Tối ưu hóa hiệu năng câu lệnh SQL (đánh Index, tối ưu Join).\n- Chuyển đổi các tác vụ nặng, tốn thời gian (xuất file lớn, gửi mail hàng loạt) sang cơ chế xử lý bất đồng bộ sử dụng Message Queue (BullMQ, RabbitMQ).',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    icon: 'Timer'
  },

  // =========================================================================
  // CHƯƠNG II: LỖI RUNTIME VÀ LỖI HỆ THỐNG TRONG LẬP TRÌNH
  // =========================================================================
  {
    code: 'SyntaxError',
    key: 'RUNTIME_SYNTAX',
    title: 'SyntaxError (Lỗi cú pháp)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'Runtime Errors',
    context: 'Phát sinh ngay khi trình thông dịch quét qua file code.\nVí dụ: Viết sai từ khóa `functon`, thiếu dấu `}` đóng khối lệnh.',
    rootCause: 'Mã nguồn viết sai quy tắc cú pháp cơ bản của ngôn ngữ lập trình, khiến Parser không thể biên dịch thành mã máy.',
    solution: 'Sử dụng các công cụ phân tích mã nguồn tĩnh (Linter như ESLint cho JS, SonarQube) kết hợp chặt chẽ với trình soạn thảo IDE để phát hiện và gạch chân đỏ lỗi ngay khi gõ code.',
    badgeColor: 'bg-rose-600/30 text-rose-300 border-rose-500/50',
    icon: 'Code'
  },
  {
    code: 'ReferenceError',
    key: 'RUNTIME_REFERENCE',
    title: 'ReferenceError (Lỗi tham chiếu)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'Runtime Errors',
    context: 'Gọi biến chưa khai báo.\nVí dụ: `console.log(totalAmount)` trong khi chưa viết dòng khai báo biến `totalAmount` trước đó.',
    rootCause: 'Mã nguồn cố gắng truy cập, đọc hoặc ghi dữ liệu vào một tham chiếu (biến, hàm) không tồn tại trong phạm vi biến (Scope) hiện tại.',
    solution: 'Luôn khai báo biến bằng các từ khóa có phạm vi tường minh (let, const). Kiểm tra kỹ phạm vi của hàm (Local vs Global Scope). Tránh sử dụng các biến toàn cục không kiểm soát.',
    badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
    icon: 'SearchX'
  },
  {
    code: 'TypeError',
    key: 'RUNTIME_TYPE',
    title: 'TypeError (Lỗi kiểu dữ liệu)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'Runtime Errors',
    context: 'Sai kiểu dữ liệu tác vụ.\nVí dụ: Đọc thuộc tính từ một đối tượng mang giá trị rỗng: `user.profile.name` khi trường `profile` đang là `undefined`.',
    rootCause: 'Chương trình thực hiện một toán tử hoặc gọi phương thức không được hỗ trợ bởi kiểu dữ liệu hiện tại của biến.',
    solution: 'Sử dụng toán tử an toàn Optional Chaining (`user?.profile?.name`). Triển khai ngôn ngữ kiểm soát kiểu dữ liệu tĩnh mạnh như TypeScript để phát hiện toàn bộ lỗi này ở giai đoạn biên dịch.',
    badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    icon: 'AlertCircle'
  },
  {
    code: 'ENOENT',
    key: 'SYS_ENOENT',
    title: 'ENOENT (Lỗi không tìm thấy tệp tin/thư mục)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'System Errors',
    context: 'Lỗi hệ thống tệp tin.\nVí dụ: Gọi hàm `fs.readFileSync(\'/data/config.json\')` nhưng tệp tin cấu hình không nằm ở vị trí đó.',
    rootCause: 'Hệ điều hành của máy chủ phản hồi rằng đường dẫn tệp tin (File) hoặc thư mục (Directory) được truyền vào không tồn tại trên ổ đĩa cứng.',
    solution: 'Sử dụng thư viện xử lý đường dẫn chuẩn của hệ điều hành (như module path trong Node.js) để tự động chuẩn hóa đường dẫn theo OS. Luôn dùng hàm fs.existsSync() để kiểm tra trước.',
    badgeColor: 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50',
    icon: 'FileX'
  },
  {
    code: 'ECONNREFUSED',
    key: 'SYS_ECONNREFUSED',
    title: 'ECONNREFUSED (Từ chối kết nối mạng)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'System Errors',
    context: 'Từ chối kết nối mạng.\nVí dụ: Ứng dụng Backend kết nối tới Redis/Database trên cổng `6379` nhưng gặp lỗi và dừng tiến trình.',
    rootCause: 'Máy chủ đích hoàn toàn từ chối thiết lập kết nối socket mạng với ứng dụng. Nguyên nhân do dịch vụ ở cổng đích chưa bật hoặc tường lửa bị khóa.',
    solution: 'Xác minh dịch vụ đích (Database, Cache server) đang ở trạng thái chạy (Active/Running). Kiểm tra cổng Port cấu hình trong file .env xem có khớp với Port thực tế của dịch vụ không.',
    badgeColor: 'bg-rose-700/40 text-rose-200 border-rose-500/60',
    icon: 'WifiOff'
  },
  {
    code: 'EADDRINUSE',
    key: 'SYS_EADDRINUSE',
    title: 'EADDRINUSE (Cổng mạng bị chiếm dụng)',
    chapter: 'Chương II: Lỗi Runtime & Hệ Thống',
    category: 'System Errors',
    context: 'Cổng mạng bị chiếm.\nVí dụ: Khởi chạy Server Node.js Express ở port `8080` nhưng hệ thống báo lỗi lập tức.',
    rootCause: 'Cổng mạng (Port) mà ứng dụng đăng ký lắng nghe (Listen) hiện đang bị một tiến trình khác đang chạy ngầm trên cùng hệ điều hành chiếm giữ hoàn toàn.',
    solution: 'Sử dụng lệnh hệ điều hành để tìm và tắt tiến trình cũ (`kill -9 $(lsof -t -i:8080)`), hoặc chuyển đổi linh hoạt cấu hình Port của ứng dụng thông qua biến môi trường ENV.',
    badgeColor: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50',
    icon: 'Radio'
  },

  // =========================================================================
  // CHƯƠNG III: MÃ LỖI CƠ SỞ DỮ LIỆU (DATABASE ERRORS)
  // =========================================================================
  {
    code: '1062',
    key: 'DB_UNIQUE',
    title: 'Unique Constraint Violation (Vi phạm trùng lặp CSDL)',
    chapter: 'Chương III: Mã Lỗi Cơ Sở Dữ Liệu',
    category: 'Database Errors',
    context: 'MySQL: 1062 | Postgres: 23505\nHệ thống ngăn chặn việc chèn phần tử trùng lặp vào cột mang tính duy nhất (ví dụ: đăng ký tài khoản với email đã tồn tại).',
    rootCause: 'Vi phạm ràng buộc giá trị duy nhất (Unique Index/Key) đã được thiết lập trong CSDL.',
    solution: 'Trước khi Insert, chạy câu lệnh SELECT kiểm tra trước. Hoặc sử dụng cơ chế xử lý nâng cao UPSERT (ví dụ SQL: ON CONFLICT(email) DO UPDATE... hoặc ON DUPLICATE KEY UPDATE).',
    badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
    icon: 'Database'
  },
  {
    code: '1452',
    key: 'DB_FOREIGN_KEY',
    title: 'Foreign Key Violation (Vi phạm khóa ngoại CSDL)',
    chapter: 'Chương III: Mã Lỗi Cơ Sở Dữ Liệu',
    category: 'Database Errors',
    context: 'MySQL: 1452 | Postgres: 23503\nTạo một hóa đơn mới cho `user_id = 9999` nhưng trong bảng người dùng `users` không hề tồn tại bất kỳ người dùng nào có ID bằng 9999.',
    rootCause: 'Vi phạm ràng buộc khóa ngoại bảo vệ tính toàn vẹn quan hệ giữa các bảng dữ liệu.',
    solution: 'Phía ứng dụng phải Validate kiểm tra sự tồn tại của ID cha trước khi lưu dữ liệu bảng con. Cấu hình khóa ngoại đi kèm thuộc tính xóa tự động ON DELETE CASCADE nếu logic cho phép.',
    badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    icon: 'Link2Off'
  },
  {
    code: '1048',
    key: 'DB_NOT_NULL',
    title: 'NotNull Violation (Vi phạm trường dữ liệu bắt buộc)',
    chapter: 'Chương III: Mã Lỗi Cơ Sở Dữ Liệu',
    category: 'Database Errors',
    context: 'MySQL: 1048 | Postgres: 23502\nThực hiện lưu thông tin sản phẩm vào bảng dữ liệu nhưng bỏ trống trường tên sản phẩm (`product_name = null`), trong khi cột này là NOT NULL.',
    rootCause: 'Vi phạm ràng buộc giá trị trường dữ liệu bắt buộc không được mang giá trị trống rỗng (NULL).',
    solution: 'Cài đặt bộ lọc kiểm tra dữ liệu đầu vào nghiêm ngặt tại tầng ứng dụng (DTO validation). Thiết lập giá trị mặc định (DEFAULT) tại tầng database cho các trường có thể tự tạo.',
    badgeColor: 'bg-pink-600/30 text-pink-300 border-pink-500/50',
    icon: 'AlertOctagon'
  },
  {
    code: '1213',
    key: 'DB_DEADLOCK',
    title: 'Deadlock Detected (Lỗi khóa chết luồng CSDL)',
    chapter: 'Chương III: Mã Lỗi Cơ Sở Dữ Liệu',
    category: 'Database Errors',
    context: 'MySQL: 1213 | Postgres: 40P01\nTiến trình A khóa dòng 1 và đợi dòng 2. Cùng lúc, tiến trình B đang khóa dòng 2 và đợi dòng 1 được giải phóng, tạo thành vòng lặp vô hạn.',
    rootCause: 'Xảy ra khi hai tiến trình cơ sở dữ liệu đồng thời giữ khóa và chờ đợi nhau.',
    solution: 'Thiết kế mã nguồn cập nhật dữ liệu theo một thứ tự bảng nhất quán. Giữ các Transaction (Giao dịch) ngắn gọn nhất có thể. Cấu hình cơ chế tự động thử lại (Retry Mechanism) ở Backend.',
    badgeColor: 'bg-red-700/40 text-red-200 border-red-500/60',
    icon: 'RefreshCw'
  },

  // =========================================================================
  // CHƯƠNG IV: CÁC MÃ LỖI TÍCH HỢP API VÀ XÁC THỰC CHUYÊN SÂU
  // =========================================================================
  {
    code: 'TokenExpiredError',
    key: 'AUTH_TOKEN_EXPIRED',
    title: 'TokenExpiredError (Mã JWT hết hạn)',
    chapter: 'Chương IV: Tích Hợp API & Xác Thực',
    category: 'API & Auth Errors',
    context: 'Mã thông báo bảo mật JWT (Json Web Token) đã quá thời gian hết hạn hiệu lực được cấu hình trong thuộc tính `exp`.',
    rootCause: 'Thời gian sống của Access Token hết hiệu lực (ví dụ sau 15 phút), client gửi request mà không refresh.',
    solution: 'Client bắt mã lỗi này để chủ động gọi endpoint /refresh-token nhằm lấy cặp token mới mà không làm gián đoạn trải nghiệm của người dùng cuối.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'KeyRound'
  },
  {
    code: 'JsonWebTokenError',
    key: 'AUTH_JWT_INVALID',
    title: 'JsonWebTokenError (Mã JWT không hợp lệ)',
    chapter: 'Chương IV: Tích Hợp API & Xác Thực',
    category: 'API & Auth Errors',
    context: 'Mã thông báo JWT gửi lên không đúng định dạng hoặc chữ ký số (Signature) không hợp lệ.',
    rootCause: 'Chuỗi token bị Client cắt xén ký tự khi lưu trữ, hoặc Client cố tình sửa đổi payload của token, hoặc server bị đổi Secret Key ký token.',
    solution: 'Từ chối ngay lập tức yêu cầu, ghi lại nhật ký log (IP, tài khoản) để theo dõi các hành vi có dấu hiệu tấn công thâm nhập trái phép hệ thống.',
    badgeColor: 'bg-rose-600/30 text-rose-300 border-rose-500/50',
    icon: 'ShieldOff'
  },
  {
    code: 'InvalidGrantError',
    key: 'AUTH_INVALID_GRANT',
    title: 'InvalidGrantError (OAuth 2.0 Cấp quyền thất bại)',
    chapter: 'Chương IV: Tích Hợp API & Xác Thực',
    category: 'API & Auth Errors',
    context: 'Thông tin xác thực cấp quyền (Authorization Code, Refresh Token, Password) sai hoặc không còn hiệu lực.',
    rootCause: 'Client sử dụng Authorization Code đã dùng trước đó, hoặc dùng Refresh Token đã bị thu hồi.',
    solution: 'Yêu cầu người dùng thực hiện lại quy trình đăng nhập từ đầu để cấp lại chuỗi định danh xác thực mới an toàn hoàn toàn.',
    badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    icon: 'UserX'
  }
];

/**
 * Tra cứu mã lỗi tự động dựa trên đối tượng lỗi JS, HTTP status, hoặc chuỗi thông báo lỗi
 */
export function lookupSystemError(errorOrCode) {
  if (!errorOrCode) return SYSTEM_ERROR_CATALOG.find(e => e.code === '500');

  let codeStr = '';
  let msgStr = '';

  if (typeof errorOrCode === 'number') {
    codeStr = String(errorOrCode);
  } else if (typeof errorOrCode === 'string') {
    codeStr = errorOrCode;
    msgStr = errorOrCode;
  } else if (typeof errorOrCode === 'object') {
    codeStr = String(errorOrCode.status || errorOrCode.statusCode || errorOrCode.code || '');
    msgStr = String(errorOrCode.message || errorOrCode.name || '');
  }

  // 1. Direct match by exact code
  let matched = SYSTEM_ERROR_CATALOG.find(
    item => item.code.toLowerCase() === codeStr.toLowerCase()
  );

  if (matched) return matched;

  // 2. Substring match in code or title or key
  matched = SYSTEM_ERROR_CATALOG.find(
    item =>
      (codeStr && (item.code.includes(codeStr) || item.key.toLowerCase().includes(codeStr.toLowerCase()))) ||
      (msgStr && (msgStr.toLowerCase().includes(item.code.toLowerCase()) || msgStr.toLowerCase().includes(item.title.toLowerCase())))
  );

  if (matched) return matched;

  // 3. Match SQL error codes
  if (msgStr.includes('1062') || msgStr.includes('23505') || msgStr.includes('Duplicate entry')) {
    return SYSTEM_ERROR_CATALOG.find(e => e.code === '1062');
  }
  if (msgStr.includes('1452') || msgStr.includes('23503') || msgStr.includes('foreign key')) {
    return SYSTEM_ERROR_CATALOG.find(e => e.code === '1452');
  }
  if (msgStr.includes('1048') || msgStr.includes('23502') || msgStr.includes('cannot be null')) {
    return SYSTEM_ERROR_CATALOG.find(e => e.code === '1048');
  }
  if (msgStr.includes('1213') || msgStr.includes('40P01') || msgStr.includes('deadlock')) {
    return SYSTEM_ERROR_CATALOG.find(e => e.code === '1213');
  }

  // 4. Match JavaScript Runtime Exception Names
  if (msgStr.includes('SyntaxError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'SyntaxError');
  if (msgStr.includes('ReferenceError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'ReferenceError');
  if (msgStr.includes('TypeError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'TypeError');
  if (msgStr.includes('ENOENT')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'ENOENT');
  if (msgStr.includes('ECONNREFUSED') || msgStr.includes('Failed to fetch')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'ECONNREFUSED');
  if (msgStr.includes('EADDRINUSE')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'EADDRINUSE');

  // 5. Match Auth & Token errors
  if (msgStr.includes('jwt expired') || msgStr.includes('TokenExpiredError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'TokenExpiredError');
  if (msgStr.includes('invalid signature') || msgStr.includes('JsonWebTokenError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'JsonWebTokenError');
  if (msgStr.includes('invalid_grant') || msgStr.includes('InvalidGrantError')) return SYSTEM_ERROR_CATALOG.find(e => e.code === 'InvalidGrantError');

  // Default Fallback: HTTP 500
  return {
    code: codeStr || '500',
    key: 'UNKNOWN_SYSTEM_ERROR',
    title: `Lỗi Hệ Thống (${codeStr || 'Chưa xác định'})`,
    chapter: 'Chương I: Mã Trạng Thái HTTP / Runtime',
    category: 'Lỗi Không Xác Định',
    context: msgStr || 'Mã nguồn hệ thống phát sinh ngoại lệ không mong muốn.',
    rootCause: 'Xảy ra sự cố bất thường chưa nằm trong danh mục mã lỗi chuẩn.',
    solution: 'Kiểm tra nhật ký Console Logs để biết chi tiết ngoại lệ và báo cho quản trị viên hệ thống.',
    badgeColor: 'bg-rose-600/30 text-rose-300 border-rose-500/50',
    icon: 'Zap'
  };
}
