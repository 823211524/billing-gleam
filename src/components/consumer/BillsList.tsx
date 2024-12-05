import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bill } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

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
        <Card key={bill.id} className={bill.due_date < new Date().toISOString() && !bill.paid ? 'border-red-500' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  Bill for {bill.reading?.month}/{bill.reading?.year}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Amount: ${bill.amount.toFixed(2)}</p>
                  <p>Consumption: {bill.consumption} units</p>
                  <p>Due Date: {format(new Date(bill.due_date), 'PPP')}</p>
                  <p>Status: <span className={bill.paid ? 'text-green-600' : 'text-red-600'}>
                    {bill.paid ? 'Paid' : 'Unpaid'}
                  </span></p>
                  {!bill.paid && new Date(bill.due_date) < new Date() && (
                    <p className="flex items-center text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Overdue
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-4">
                <FileText className="h-4 w-4 mr-2" />
                <a 
                  href={bill.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="no-underline hover:no-underline"
                >
                  View Bill
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};