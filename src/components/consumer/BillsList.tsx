import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bill } from '@/types';
import { BillDownloadLink } from '@/utils/pdfGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const BillsList = () => {
  const { toast } = useToast();
  const { data: bills, isLoading, error } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          reading:readings (
            *,
            meter:meters (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load bills",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading bills...</p>
        </CardContent>
      </Card>
    );
  }

  if (!bills?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No bills available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card key={bill.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Bill for {bill.reading?.month}/{bill.reading?.year}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Amount: ${bill.amount.toFixed(2)}</p>
                  <p>Due Date: {new Date(bill.due_date).toLocaleDateString()}</p>
                  <p>Status: <span className={bill.paid ? 'text-green-600' : 'text-red-600'}>
                    {bill.paid ? 'Paid' : 'Unpaid'}
                  </span></p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-4">
                <FileText className="h-4 w-4 mr-2" />
                <BillDownloadLink 
                  bill={bill} 
                  reading={bill.reading} 
                  className="no-underline hover:no-underline"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};