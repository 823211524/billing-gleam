import { supabase } from '@/integrations/supabase/client';

export const sendBillEmail = async (userEmail: string, billDetails: {
  amount: number;
  dueDate: Date;
  pdfUrl: string;
}) => {
  try {
    const { error } = await supabase.functions.invoke('send-bill-email', {
      body: {
        to: userEmail,
        amount: billDetails.amount,
        dueDate: billDetails.dueDate,
        pdfUrl: billDetails.pdfUrl
      }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to send bill email:', error);
    throw error;
  }
};