import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bill, Reading } from '@/types';
import { BillDownloadLink } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BillsList = () => {
  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const { data: bills, error } = await supabase
        .from('bills')
        .select(`
          *,
          reading:readings (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return bills;
    },
  });

  if (isLoading) {
    return <div>Loading bills...</div>;
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bill for {bill.reading.month}/{bill.reading.year}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <BillDownloadLink reading={bill.reading} bill={bill} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${bill.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">
                  {new Date(bill.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${bill.paid ? 'text-green-600' : 'text-red-600'}`}>
                  {bill.paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};