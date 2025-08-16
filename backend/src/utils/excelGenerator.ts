import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface ExcelReportData {
  farmer: {
    name: string;
    village: string;
    contact: string;
  };
  records: Array<{
    date: string;
    shift: string;
    quantity: number;
    fat: number;
    degree: number;
    rate: number;
    amount: number;
  }>;
  summary: {
    totalQuantity: number;
    averageFat: number;
    totalAmount: number;
    recordCount: number;
  };
}

export const generateMilkReportExcel = async (data: ExcelReportData, res: Response): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Milk Records');

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="milk-report-${data.farmer.name}-${Date.now()}.xlsx"`);

  // Add title
  worksheet.mergeCells('A1:G1');
  worksheet.getCell('A1').value = 'Dairy Farm Management - Milk Collection Report';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Add farmer info
  worksheet.getCell('A3').value = 'Farmer Information:';
  worksheet.getCell('A3').font = { bold: true };
  worksheet.getCell('A4').value = `Name: ${data.farmer.name}`;
  worksheet.getCell('A5').value = `Village: ${data.farmer.village}`;
  worksheet.getCell('A6').value = `Contact: ${data.farmer.contact}`;

  // Add summary
  worksheet.getCell('A8').value = 'Summary:';
  worksheet.getCell('A8').font = { bold: true };
  worksheet.getCell('A9').value = `Total Records: ${data.summary.recordCount}`;
  worksheet.getCell('A10').value = `Total Quantity: ${data.summary.totalQuantity.toFixed(2)} liters`;
  worksheet.getCell('A11').value = `Average Fat: ${data.summary.averageFat.toFixed(2)}%`;
  worksheet.getCell('A12').value = `Total Amount: ₹${data.summary.totalAmount.toFixed(2)}`;

  // Add headers
  const headerRow = worksheet.getRow(14);
  headerRow.values = ['Date', 'Shift', 'Quantity (L)', 'Fat %', 'Degree', 'Rate (₹)', 'Amount (₹)'];
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data rows
  data.records.forEach((record, index) => {
    const row = worksheet.getRow(15 + index);
    row.values = [
      record.date,
      record.shift,
      record.quantity.toFixed(2),
      record.fat.toFixed(1),
      record.degree,
      record.rate.toFixed(2),
      record.amount.toFixed(2)
    ];
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};

export const generateFeedReportExcel = async (data: any, res: Response): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Feed Records');

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="feed-report-${data.farmer.name}-${Date.now()}.xlsx"`);

  // Add title
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = 'Dairy Farm Management - Feed Records Report';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Add farmer info
  worksheet.getCell('A3').value = 'Farmer Information:';
  worksheet.getCell('A3').font = { bold: true };
  worksheet.getCell('A4').value = `Name: ${data.farmer.name}`;
  worksheet.getCell('A5').value = `Village: ${data.farmer.village}`;
  worksheet.getCell('A6').value = `Contact: ${data.farmer.contact}`;

  // Add summary
  worksheet.getCell('A8').value = 'Summary:';
  worksheet.getCell('A8').font = { bold: true };
  worksheet.getCell('A9').value = `Total Records: ${data.summary.recordCount}`;
  worksheet.getCell('A10').value = `Total Quantity: ${data.summary.totalQuantity.toFixed(2)} kg`;
  worksheet.getCell('A11').value = `Total Amount: ₹${data.summary.totalAmount.toFixed(2)}`;
  worksheet.getCell('A12').value = `Pending Amount: ₹${data.summary.pendingAmount.toFixed(2)}`;

  // Add headers
  const headerRow = worksheet.getRow(14);
  headerRow.values = ['Date', 'Feed Type', 'Quantity (kg)', 'Price (₹)', 'Status'];
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data rows
  data.records.forEach((record: any, index: number) => {
    const row = worksheet.getRow(15 + index);
    row.values = [
      record.date,
      record.feedType,
      record.quantity.toFixed(2),
      record.price.toFixed(2),
      record.status
    ];
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};
