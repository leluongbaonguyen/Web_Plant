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
const RED_WARNING = 'C00000';
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

export async function createMaternalWordBuffer(plan, mode = 'pregnant') {
  const isPregnant = mode === 'pregnant';
  const docTitle = isPregnant
    ? 'LỊCH SINH HOẠT & NHẮC VIỆC CHO PHỤ NỮ MANG THAI (A3 NGANG - FONT TIMES NEW ROMAN 13)'
    : 'LỊCH SINH HOẠT & NHẮC VIỆC CHO PHỤ NỮ SAU SINH (A3 NGANG - FONT TIMES NEW ROMAN 13)';

  const profileHeader = isPregnant
    ? [
        ['Đối tượng áp dụng', 'Phụ nữ mang thai (Pregnancy Phase)'],
        ['Tuần thai & Dự sinh', `Tuần thai: ${plan.profile?.pregnancyWeek || '12'} | Ngày dự sinh: ${plan.profile?.dueDate || '2026-11-15'}`],
        ['Mức độ theo dõi', plan.profile?.trackingLevel || 'Bình thường'],
        ['Bác sĩ / Chuyên môn', plan.profile?.assignedDoctor || 'BS. Nguyễn Thị Mai - BV Phụ Sản Central'],
      ]
    : [
        ['Đối tượng áp dụng', 'Phụ nữ sau sinh (Postpartum Phase)'],
        ['Ngày sinh & Ngày sau sinh', `Ngày sau sinh: ${plan.profile?.postpartumDays || '21'} ngày | Ngày sinh: ${plan.profile?.birthDate || '2026-07-08'}`],
        ['Phương pháp sinh & Nuôi dưỡng', `Sinh: ${plan.profile?.deliveryMethod || 'Sinh thường'} | Nuôi dưỡng: ${plan.profile?.feedingPlan || 'Sữa mẹ hoàn toàn'}`],
        ['Bác sĩ / Chuyên môn', plan.profile?.assignedDoctor || 'BS. Phạm Văn Hùng - Trung tâm Chăm sóc Sau sinh'],
      ];

  const goalRows = (plan.weeklyGoals || []).length
    ? plan.weeklyGoals.map((goal, index) => [
        `${index + 1}. ${goal.done ? '☒' : '☐'} ${goal.title}`,
        `${goal.result || ''}${goal.priority ? ` | Ưu tiên: ${goal.priority}` : ''}${goal.dueDay ? ` | Hạn: ${goal.dueDay}` : ''}${goal.notes ? ` | Ghi chú: ${goal.notes}` : ''}`,
      ])
    : [['Mục tiêu', 'Chưa nhập mục tiêu tuần.']];

  const focusRows = DAY_KEYS.map((day) => [day.label, plan.dailyFocus?.[day.key] || '']);

  const warningRows = [
    ['Dấu hiệu khẩn cấp 1', 'Khó thở, đau ngực ➔ Tìm chăm sóc y tế khẩn cấp ngay.'],
    ['Dấu hiệu khẩn cấp 2', 'Ngất, co giật, lú lẫn ➔ Gọi cấp cứu 115 hoặc đến cơ sở y tế.'],
    ['Dấu hiệu khẩn cấp 3', 'Sốt từ 38°C / Đau đầu dữ dội ➔ Liên hệ cơ sở y tế đánh giá.'],
    ['Dấu hiệu khẩn cấp 4', isPregnant ? 'Ra máu hoặc rỉ dịch thai kỳ ➔ Đến viện ngay.' : 'Chảy máu nhiều / Sản dịch hôi ➔ Tìm chăm sóc y tế ngay.'],
    ['Dấu hiệu khẩn cấp 5', 'Ý nghĩ làm hại bản thân hoặc em bé ➔ Tìm trợ giúp khẩn cấp từ người thân & chuyên gia y tế ngay.'],
  ];

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
            spacing: { after: 60 },
            children: [new TextRun({ text: docTitle, bold: true, font: FONT, size: 36, color: BLUE })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'TUYÊN BỐ AN TOÀN Y KHOA: Hệ thống hỗ trợ tổ chức lịch và nhắc việc, không chẩn đoán, không thay thế bác sĩ hoặc cơ sở y tế.',
                bold: true,
                color: RED_WARNING,
                font: FONT,
                size: SIZE_13,
              }),
            ],
          }),
          ...keyValueTable('HỒ SƠ THEO DÕI CÁ NHÂN', profileHeader),
          new Paragraph({ spacing: { before: 180, after: 60 } }),
          makeScheduleTable(plan),
          ...keyValueTable('MỤC TIÊU TUẦN', goalRows),
          ...keyValueTable('TRỌNG TÂM TỪNG NGÀY', focusRows),
          ...keyValueTable('DANH MỤC CẢNH BÁO KHẨN CẤP (CDC / WHO)', warningRows),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export async function createWordBuffer(plan) {
  return createMaternalWordBuffer(plan, 'pregnant');
}
