# Web Lịch Sinh Hoạt — React.js + Node.js + Tailwind CSS

Ứng dụng quản lý lịch sinh hoạt 1 tuần, nhập trực tiếp từng ô, đánh dấu hoàn thành, theo dõi mục tiêu và xuất file Word theo bố cục ngang.

## Công nghệ

- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Lưu dữ liệu: JSON trên máy chủ
- Xuất Word: thư viện `docx`

## Yêu cầu môi trường

- Node.js 20.19+ hoặc 22.12+
- npm

## Chạy ở chế độ phát triển

```bash
npm install
npm run dev
```

Sau đó mở:

- Giao diện: `http://localhost:5173`
- API: `http://localhost:4000`

## Chạy bản hoàn chỉnh

```bash
npm install
npm start
```

Lệnh trên build React rồi chạy Node.js tại `http://localhost:4000`.

## Cấu trúc dự án

```text
lich-sinh-hoat-react-node-tailwind/
├─ client/                    # React + Tailwind CSS
│  ├─ src/App.jsx             # Giao diện và nghiệp vụ phía trình duyệt
│  ├─ src/api.js              # Gọi REST API
│  └─ src/index.css           # Tailwind và định dạng in A3 ngang
├─ server/                    # Node.js + Express
│  ├─ src/index.js            # API và phục vụ bản build React
│  ├─ src/store.js            # Đọc/ghi dữ liệu JSON an toàn
│  ├─ src/validation.js       # Kiểm tra dữ liệu đầu vào
│  ├─ src/exportWord.js       # Tạo file Word .docx
│  └─ data/plan.json          # Dữ liệu lịch hiện tại
└─ package.json               # npm workspaces và lệnh chạy chung
```

## Chức năng

1. Lịch 7 ngày từ 06:00 đến 00:15.
2. Nhập/sửa nội dung, giờ bắt đầu, giờ kết thúc và ghi chú.
3. Đánh dấu hoàn thành từng ô.
4. Tự tính tiến độ toàn tuần và từng ngày.
5. Trọng tâm riêng cho từng ngày.
6. Mục tiêu tuần: kết quả cần đạt, ưu tiên, hạn, trạng thái và ghi chú.
7. Tổng kết cuối tuần: thành tựu, việc tồn, bài học, kế hoạch mới, điểm và tâm trạng.
8. Tìm kiếm, lọc theo ngày và trạng thái.
9. Thêm/xóa khung giờ.
10. Tự động lưu qua Node.js API.
11. Sao lưu và nhập lại dữ liệu JSON.
12. Xuất file Word `.docx` khổ A3 ngang, Times New Roman cỡ 13.
13. In hoặc lưu PDF trực tiếp từ trình duyệt.

## API

- `GET /api/health`
- `GET /api/plan`
- `PUT /api/plan`
- `POST /api/plan/reset`
- `GET /api/export/word`

## Lưu ý

Tệp `server/data/plan.json` chứa dữ liệu thực tế. Nên sao lưu tệp này hoặc dùng nút **Sao lưu JSON** trước khi di chuyển/xóa dự án.
