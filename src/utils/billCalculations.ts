import { Reading } from '@/types';

interface BillCalculationResult {
  amount: number;
  consumption: number;
  dueDate: Date;
}

export const calculateBill = (reading: Reading, unitRate: number = 0.15): BillCalculationResult => {
  const consumption = reading.reading;
  const amount = consumption * unitRate;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

  return {
    amount,
    consumption,
    dueDate
  };
};

export const generateBillPDF = async (reading: Reading, billDetails: BillCalculationResult): Promise<string> => {
  // This would connect to a PDF generation service
  // For now, return a mock URL
  return `https://storage.example.com/bills/${reading.id}.pdf`;
};