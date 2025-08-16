import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface MilkReportData {
  farmer: {
    name: string;
    village: string;
    contact: string;
  };
  period: {
    from: string;
    to: string;
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

export const generateMilkReportPDF = (data: MilkReportData, res: Response): void => {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="milk-report-${data.farmer.name}-${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  doc.fontSize(20).text('Dairy Farm Management', { align: 'center' });
  doc.fontSize(16).text('Milk Collection Report', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(14).text('Farmer Information:', { underline: true });
  doc.fontSize(12)
     .text(`Name: ${data.farmer.name}`)
     .text(`Village: ${data.farmer.village}`)
     .text(`Contact: ${data.farmer.contact}`)
     .moveDown();
  
  doc.fontSize(14).text('Summary:', { underline: true });
  doc.fontSize(12)
     .text(`Total Records: ${data.summary.recordCount}`)
     .text(`Total Quantity: ${data.summary.totalQuantity.toFixed(2)} liters`)
     .text(`Average Fat: ${data.summary.averageFat.toFixed(2)}%`)
     .text(`Total Amount: ₹${data.summary.totalAmount.toFixed(2)}`)
     .moveDown();
  
  doc.end();
};
