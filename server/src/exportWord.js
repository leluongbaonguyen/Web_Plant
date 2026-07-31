import {
  AlignmentType,
  BorderStyle,
  Document,
  PageOrientation,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { DAY_KEYS } from './defaultPlan.js';

const BLUE = '1F4E78';
const LIGHT_BLUE = 'D9EAF7';
const WEEKEND = 'FFF2CC';
const WHITE = 'FFFFFF';
const BORDER = '9CA3AF';
const FONT = 'Times New Roman';
const SIZE_13 = 26; // 13pt in half-points

const borders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
};

function paragraph(text, { bold = false, color = '000000', size = SIZE_13, align = AlignmentType.CENTER } = {}) {
  return new Paragraph({
    alignment: align,
    spacing: { before: 0, after: 0, line: 240 },
    children: [new TextRun({ text: String(text ?? ''), bold, color, size, font: FONT })],
  });
}

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.CLEAR, fill: BLUE, color: 'auto' },
    margins: { top: 70, bottom: 70, left: 60, right: 60 },
    children: [paragraph(text, { bold: true, color: WHITE })],
  });
}

function bodyCell(cell, isWeekend, width) {
  const marker = cell.done ? '☒ ' : '☐ ';
  const text = `${marker}${cell.text || ''}${cell.notes ? `\nGhi chú: ${cell.notes}` : ''}`;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: isWeekend ? { type: ShadingType.CLEAR, fill: WEEKEND, color: 'auto' } : undefined,
    margins: { top: 55, bottom: 55, left: 55, right: 55 },
    children: text.split('\n').map((line) => paragraph(line, { align: AlignmentType.LEFT })),
  });
}

function makeScheduleTable(plan) {
  const timeWidth = 1450;
  const dayWidth = 3130;
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [headerCell('Khung giờ', timeWidth), ...DAY_KEYS.map((day) => headerCell(day.label, dayWidth))],
    }),
  ];

  for (const slot of plan.schedule || []) {
    rows.push(
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: timeWidth, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            shading: { type: ShadingType.CLEAR, fill: LIGHT_BLUE, color: 'auto' },
            margins: { top: 55, bottom: 55, left: 50, right: 50 },
            children: [paragraph(`${slot.start}–${slot.end}`, { bold: true, color: BLUE })],
          }),
          ...DAY_KEYS.map((day, index) => bodyCell(slot.cells?.[day.key] || {}, index >= 5, dayWidth)),
        ],
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [timeWidth, ...DAY_KEYS.map(() => dayWidth)],
    borders,
    rows,
  });
}

function keyValueTable(title, rows) {
  return [
    new Paragraph({
      spacing: { before: 280, after: 120 },
      children: [new TextRun({ text: title, bold: true, font: FONT, size: 30, color: BLUE })],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders,
      rows: rows.map(([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 2600, type: WidthType.DXA },
              shading: { type: ShadingType.CLEAR, fill: LIGHT_BLUE, color: 'auto' },
              children: [paragraph(label, { bold: true, align: AlignmentType.LEFT })],
            }),
            new TableCell({
              width: { size: 19000, type: WidthType.DXA },
              children: [paragraph(value || '', { align: AlignmentType.LEFT })],
            }),
          ],
        })
      ),
    }),
  ];
}

export async function createWordBuffer(plan) {
  const docTitle = 'LỊCH SINH HOẠT & QUẢN LÝ TIẾN ĐỘ TUẦN (A3 NGANG - FONT TIMES NEW ROMAN 13)';

  const profileHeader = [
    ['Tên hồ sơ', plan.profile?.fullName || 'Người dùng ChronoFlow'],
    ['Vai trò', plan.profile?.role || 'Quản trị viên'],
    ['Mức độ theo dõi', plan.profile?.trackingLevel || 'Tiêu chuẩn'],
  ];

  const goalRows = (plan.weeklyGoals || []).length
    ? plan.weeklyGoals.map((goal, index) => [
        `${index + 1}. ${goal.done ? '☒' : '☐'} ${goal.title}`,
        `${goal.result || ''}${goal.priority ? ` | Ưu tiên: ${goal.priority}` : ''}${goal.dueDay ? ` | Hạn: ${goal.dueDay}` : ''}${goal.notes ? ` | Ghi chú: ${goal.notes}` : ''}`,
      ])
    : [['Mục tiêu', 'Chưa nhập mục tiêu tuần.']];

  const focusRows = DAY_KEYS.map((day) => [day.label, plan.dailyFocus?.[day.key] || '']);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_13 },
          paragraph: { spacing: { after: 0, line: 240 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 23811, height: 16838, orientation: PageOrientation.LANDSCAPE },
            margin: { top: 420, bottom: 420, left: 420, right: 420 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun({ text: docTitle, bold: true, font: FONT, size: 36, color: BLUE })],
          }),
          ...keyValueTable('HỒ SƠ CÁ NHÂN', profileHeader),
          new Paragraph({ spacing: { before: 180, after: 60 } }),
          makeScheduleTable(plan),
          ...keyValueTable('MỤC TIÊU TUẦN', goalRows),
          ...keyValueTable('TRỌNG TÂM TỪNG NGÀY', focusRows),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export async function createBrdWordBuffer() {
  const title = 'TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ NÂNG CẤP\nBẢNG TỪ VỰNG MINH HỌA TRỰC QUAN – 12 TRANG CHO BÉ\nCHRONOFLOW PREMIUM (CFP-BRD-IVB-002 v2.0)';

  const controlRows = [
    ['Mã tài liệu', 'CFP-BRD-IVB-002'],
    ['Phiên bản', 'v2.0 (Phát hành chính thức)'],
    ['Ngày phê duyệt', new Date().toISOString().slice(0, 10)],
    ['Đơn vị xây dựng', 'ChronoFlow Architecture & Quality Assurance Team'],
    ['Trạng thái', 'APPROVED / PUBLISHED'],
    ['Cấp độ bảo mật', 'INTERNAL / RESTRICTED'],
    ['Phạm vi ứng dụng', 'Hệ thống Quản lý Học liệu 12 Trang - ChronoFlow Premium Visual Vocabulary Board'],
  ];

  const versionHistory = [
    ['v1.0', '2026-07-28', 'Khởi tạo đặc tả Bảng từ vựng minh họa 8 trang ban đầu', 'Content Team'],
    ['v2.0', '2026-07-31', 'Nâng cấp toàn diện 12 Trang, CRUD nâng cao, AI quét tranh, Audio event telemetry, Dry-run 8 bước & Rollback job', 'ChronoFlow Enterprise Team'],
  ];

  const sectionsList = [
    ['Phần 1', 'Mô hình dữ liệu 3 cấp (Tập poster -> Trang poster -> Phân vùng/Chủ đề -> Thẻ từ vựng -> Biến thể Media/Audio).'],
    ['Phần 2', 'Bảng quy hoạch 12 Trang từ vựng minh họa (Chi tiết 12 trang x 4 phân vùng x 10 từ = 480 từ cốt lõi mở rộng lên 2,000 từ).'],
    ['Phần 3', 'Quy trình CRUD nâng cao & Khôi phục dữ liệu (Tạo draft, Soft Delete có lý do, Trash Can 30 ngày, Hard Delete Super Admin + MFA).'],
    ['Phần 4', 'Nhập dữ liệu hàng loạt 8 bước (Wizard, Dry-Run kiểm duyệt từng dòng, 5 chế độ trùng lặp, Rollback Job nguyên tử).'],
    ['Phần 5', 'Hỗ trợ AI quét tranh & OCR (Tải ảnh tranh, Bounding box, gán nhãn EN/VI/IPA/Audio, Duyệt thủ công 4 mắt, Quota log).'],
    ['Phần 6', 'Âm thanh & Phát âm (Hướng dẫn đọc từng trang, Playback đơn lẻ chống chồng âm, Audio event telemetry).'],
    ['Phần 7', 'Kiểm soát chất lượng QA Checklist (7 chỉ số hoàn thiện, Lifecycle State Machine, Separation of Duties).'],
    ['Phần 8', 'Phân quyền RBAC & An toàn trẻ em (Kid Mode 100% sạch, Parent Mode, Content Admin, Super Admin MFA).'],
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_13 },
          paragraph: { spacing: { after: 100, line: 240 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: title, bold: true, font: FONT, size: 28, color: BLUE })],
          }),
          ...keyValueTable('THÔNG TIN KIỂM SOÁT TÀI LIỆU', controlRows),
          new Paragraph({ spacing: { before: 200, after: 100 } }),
          ...keyValueTable('LỊCH SỬ THAY ĐỔI PHIÊN BẢN', versionHistory),
          new Paragraph({ spacing: { before: 200, after: 100 } }),
          ...keyValueTable('CÁC PHÂN HỆ NGHIỆP VỤ CỐT LÕI', sectionsList),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

