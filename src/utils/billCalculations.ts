import { Reading } from '../types';

export const calculateBillAmount = (reading: number, rate: number = 0.15) => {
  return reading * rate;
};

export const generateBillPDF = async (reading: Reading, amount: number) => {
  // This would typically connect to a PDF generation service
  // For now, we'll return a mock URL
  return `https://example.com/bills/${reading.id}.pdf`;
};