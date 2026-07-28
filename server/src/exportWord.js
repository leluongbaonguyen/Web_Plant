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
const SIZE_13 = 26;

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
    children: text.split('\n').map((line) => paragraph(line)),
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

  for (const slot of plan.schedule) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: timeWidth, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          shading: { type: ShadingType.CLEAR, fill: LIGHT_BLUE, color: 'auto' },
          margins: { top: 55, bottom: 55, left: 50, right: 50 },
          children: [paragraph(`${slot.start}–${slot.end}`, { bold: true, color: BLUE })],
        }),
        ...DAY_KEYS.map((day, index) => bodyCell(slot.cells[day.key], index >= 5, dayWidth)),
      ],
    }));
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
      rows: rows.map(([label, value]) => new TableRow({
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
      })),
    }),
  ];
}

export async function createWordBuffer(plan) {
  const goalRows = plan.weeklyGoals.length
    ? plan.weeklyGoals.map((goal, index) => [
        `${index + 1}. ${goal.done ? '☒' : '☐'} ${goal.title}`,
        `${goal.result || ''}${goal.priority ? ` | Ưu tiên: ${goal.priority}` : ''}${goal.dueDay ? ` | Hạn: ${goal.dueDay}` : ''}${goal.notes ? ` | Ghi chú: ${goal.notes}` : ''}`,
      ])
    : [['Mục tiêu', 'Chưa nhập mục tiêu tuần.']];

  const focusRows = DAY_KEYS.map((day) => [day.label, plan.dailyFocus[day.key] || '']);
  const summaryRows = [
    ['Thành tựu nổi bật', plan.summary.wins],
    ['Việc chưa hoàn thành', plan.summary.incomplete],
    ['Bài học rút ra', plan.summary.lessons],
    ['Kế hoạch tuần tiếp theo', plan.summary.nextWeek],
    ['Điểm tự đánh giá', `${plan.summary.score}/10`],
    ['Tâm trạng chung', plan.summary.mood],
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
    sections: [{
      properties: {
        page: {
          size: { width: 23811, height: 16838, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 420, bottom: 420, left: 420, right: 420 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: plan.meta.title, bold: true, font: FONT, size: 42, color: BLUE })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: `Khung giờ cố định: ${plan.meta.wakeTime} thức dậy  |  ${plan.meta.sleepTime} đi ngủ`, bold: true, font: FONT, size: SIZE_13 })],
        }),
        makeScheduleTable(plan),
        new Paragraph({
          spacing: { before: 80, after: 0 },
          children: [
            new TextRun({ text: 'Lưu ý: ', bold: true, color: 'C00000', font: FONT, size: SIZE_13 }),
            new TextRun({ text: plan.meta.note || '', font: FONT, size: SIZE_13 }),
          ],
        }),
        ...keyValueTable('MỤC TIÊU TUẦN', goalRows),
        ...keyValueTable('TRỌNG TÂM TỪNG NGÀY', focusRows),
        ...keyValueTable('TỔNG KẾT CUỐI TUẦN', summaryRows),
      ],
    }],
  });

  return Packer.toBuffer(doc);
}
