import { Reading } from "@/types";

export const calculateBill = (reading: number, unitRate: number = 1): number => {
  return reading * unitRate;
};

export const calculateBillAmount = calculateBill; // Alias for backward compatibility

export const generateBillPDF = async (reading: Reading, amount: number): Promise<string> => {
  // Mock implementation - replace with actual PDF generation
  return `https://example.com/bills/${reading.id}.pdf`;
};
